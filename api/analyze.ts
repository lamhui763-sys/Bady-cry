import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { Subject } from '../src/types';

// Prompts for different subjects, now living on the server
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
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { subject, mediaType, data, mimeType } = req.body as {
        subject: Subject;
        mediaType: 'audio' | 'video';
        data: string | string[];
        mimeType?: string;
    };

    if (!subject || !mediaType || !data) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable is not set on the server.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const subjectPrompts = PROMPTS[subject];

    try {
        let response;
        if (mediaType === 'audio') {
            const audioData = data as string;
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: subjectPrompts.audio },
                        { inlineData: { mimeType: mimeType!, data: audioData } }
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { cryType: { type: Type.STRING, enum: subjectPrompts.audioTypes }, confidence: { type: Type.NUMBER }, suggestion: { type: Type.STRING } },
                        required: ["cryType", "confidence", "suggestion"]
                    }
                }
            });
        } else { // video
            const imageParts = (data as string[]).map(d => ({
                inlineData: { mimeType: 'image/jpeg', data: d }
            }));
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [{ text: subjectPrompts.video }, ...imageParts]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { cryType: { type: Type.STRING, enum: subjectPrompts.videoTypes }, behavior: { type: Type.STRING }, suggestion: { type: Type.STRING } },
                        required: ["cryType", "behavior", "suggestion"]
                    }
                }
            });
        }
        
        const resultJson = JSON.parse(response.text.trim());
        return res.status(200).json(resultJson);

    } catch (error) {
        console.error("Error calling Gemini API on server:", error);
        return res.status(500).json({ error: 'Failed to analyze media' });
    }
}