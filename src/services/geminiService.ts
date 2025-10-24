import { GoogleGenAI, Type } from "@google/genai";
import { Subject, TranslationResult } from '../types';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const PROMPTS = {
    Baby: {
        audio: `你是一位專業的嬰兒聲音分析師。請分析接下來的嬰兒音訊（例如哭聲、咕咕聲、牙牙學語），並判斷最可能的原因。可能的原因有：Hungry, Tired, Diaper, Uncomfortable, Bored。如果音訊不清晰、太短或不是嬰兒的聲音，請將其分類為 Unknown。請以單一 JSON 物件格式回應。`,
        video: `你是一位專業的嬰兒行為分析師。請分析接下來的嬰兒影片畫面。 1. 以繁體中文描述嬰兒的關鍵動作和行為（例如：揉眼睛、伸懶腰、微笑、專注凝視）。 2. *僅*根據視覺線索判斷嬰兒的狀態。請從以下選項中選擇：Playful, Tired, Uncomfortable, Bored。如果狀態是開心、冷靜、睡著或不明確，請選擇 "Unknown"。請勿使用 "Hungry" 或 "Diaper"，因為僅從影像無法判斷。 3. 以繁體中文為家長提供有用的建議。請以單一 JSON 物件格式回應。`,
        audioTypes: ['Hungry', 'Tired', 'Diaper', 'Uncomfortable', 'Bored', 'Unknown'],
        videoTypes: ['Playful', 'Tired', 'Uncomfortable', 'Bored', 'Unknown'],
    },
    Dog: {
        audio: `你是一位專業的狗狗聲音分析師。請分析接下來的狗狗音訊（例如吠叫、嗚咽、低吼），並判斷最可能的情緒或需求。可能的原因有：Happy, Playful, Anxious, Warning, Lonely。如果音訊不清晰、太短或不是狗狗的聲音，請將其分類為 Unknown。請以單一 JSON 物件格式回應。`,
        video: `你是一位狗狗行為專家。請分析接下來的狗狗影片畫面。 1. 以繁體中文描述狗狗的關鍵肢體語言（例如：搖尾巴、耳朵前傾、露牙、遊戲鞠躬）。 2. *僅*根據視覺線索判斷狗狗最可能的狀態。請從以下選項中選擇：Happy, Playful, Anxious, Warning。如果狀態是冷靜或不明確，請選擇 "Unknown"。 3. 以繁體中文為飼主提供有用的建議。請以單一 JSON 物件格式回應。`,
        audioTypes: ['Happy', 'Playful', 'Anxious', 'Warning', 'Lonely', 'Unknown'],
        videoTypes: ['Happy', 'Playful', 'Anxious', 'Warning', 'Unknown'],
    },
    Cat: {
        audio: `你是一位專業的貓咪聲音分析師。請分析接下來的貓咪音訊（例如喵喵叫、呼嚕聲、哈氣聲），並判斷最可能的含義。可能的原因有：Greeting, Hungry, Attention, Annoyed, Pain。如果音訊不清晰、太短或不是貓咪的聲音，請將其分類為 Unknown。請以單一 JSON 物件格式回應。`,
        video: `你是一位貓咪行為專家。請分析接下來的貓咪影片畫面。 1. 以繁體中文描述貓咪的關鍵肢體語言（例如：尾巴豎高、緩慢眨眼、耳朵向後、哈氣）。 2. *僅*根據視覺線索判斷貓咪最可能的狀態。請從以下選項中選擇：Relaxed, Playful, Greeting, Attention, Annoyed。如果狀態不明確，請選擇 "Unknown"。 3. 以繁體中文為飼主提供有用的建議。請以單一 JSON 物件格式回應。`,
        audioTypes: ['Greeting', 'Hungry', 'Attention', 'Annoyed', 'Pain', 'Unknown'],
        videoTypes: ['Relaxed', 'Playful', 'Greeting', 'Attention', 'Annoyed', 'Unknown'],
    }
}

export async function translateAudio(audioBlob: Blob, subject: Subject, apiKey: string): Promise<TranslationResult> {
  if (!apiKey) {
    throw new Error("API Key is not provided");
  }

  const ai = new GoogleGenAI({ apiKey });
  const audioBase64 = await blobToBase64(audioBlob);
  const subjectPrompts = PROMPTS[subject];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: subjectPrompts.audio },
          { inlineData: { mimeType: audioBlob.type, data: audioBase64 } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cryType: {
              type: Type.STRING,
              enum: subjectPrompts.audioTypes,
              description: "The most likely reason for the sound."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score from 0 to 1 for the classification."
            },
            suggestion: {
              type: Type.STRING,
              description: "A short, one-sentence suggestion for the owner in Traditional Chinese."
            }
          },
          required: ["cryType", "confidence", "suggestion"]
        }
      }
    });

    const resultJson = JSON.parse(response.text);
    
    if (subjectPrompts.audioTypes.includes(resultJson.cryType as string)) {
        return resultJson as TranslationResult;
    } else {
        return {
            cryType: 'Unknown',
            confidence: 0.5,
            suggestion: "無法識別聲音，請再試一次。"
        };
    }
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function analyzeVideoFrames(imageBase64s: string[], subject: Subject, apiKey: string): Promise<TranslationResult> {
  if (!apiKey) {
    throw new Error("API Key is not provided");
  }

  const ai = new GoogleGenAI({ apiKey });
  const subjectPrompts = PROMPTS[subject];

  const imageParts = imageBase64s.map(data => ({
    inlineData: { mimeType: 'image/jpeg', data }
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: subjectPrompts.video }, ...imageParts]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cryType: {
              type: Type.STRING,
              enum: subjectPrompts.videoTypes,
              description: "The most likely reason for the state based on visual cues."
            },
            behavior: {
              type: Type.STRING,
              description: "A short description of the observed behavior in Traditional Chinese."
            },
            suggestion: {
              type: Type.STRING,
              description: "A short, one-sentence suggestion for the owner in Traditional Chinese."
            }
          },
          required: ["cryType", "behavior", "suggestion"]
        }
      }
    });

    const resultJson = JSON.parse(response.text);

    if (subjectPrompts.videoTypes.includes(resultJson.cryType as string)) {
      return { ...resultJson, confidence: 0.7 }; 
    } else {
      return {
        ...resultJson,
        cryType: 'Unknown',
        confidence: 0.7
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API for video frames:", error);
    throw error;
  }
}
