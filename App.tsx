import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CryRecord, TranslationResult, Subject } from './types';
import { translateAudio, analyzeVideoFrames } from './services/geminiService';
import { ANALYSIS_DETAILS } from './constants';

type Status = 'idle' | 'recording' | 'processing' | 'result';
type RecordMode = 'audio' | 'video';

const SUBJECT_CONFIG: Record<Subject, { title: string; subtitle: string; recordPlaceholder: (mode: RecordMode) => string }> = {
  Baby: {
    title: '寶寶行為解讀器',
    subtitle: 'AI 助您解讀寶寶的聲音、表情與動作',
    recordPlaceholder: (mode) => mode === 'audio' ? '錄製聲音' : '錄製行為'
  },
  Dog: {
    title: '狗狗行為解讀器',
    subtitle: 'AI 助您解讀汪星人的吠叫與肢體語言',
    recordPlaceholder: (mode) => mode === 'audio' ? '錄製吠叫聲' : '錄製行為'
  },
  Cat: {
    title: '貓咪行為解讀器',
    subtitle: 'AI 助您解讀喵星語及身體信號',
    recordPlaceholder: (mode) => mode === 'audio' ? '錄製喵喵聲' : '錄製行為'
  }
};

const ApiKeyModal: React.FC<{
  isOpen: boolean;
  onSave: (apiKey: string) => void;
  onClose: () => void;
  currentKey?: string;
}> = ({ isOpen, onSave, onClose, currentKey = '' }) => {
  const [key, setKey] = useState(currentKey);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };
  
  const hasApiKey = !!currentKey;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" onClick={hasApiKey ? onClose : undefined}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">輸入您的 Google Gemini API 金鑰</h2>
        <p className="text-gray-600 mb-6">
          您的 API 金鑰將會安全地儲存在您的瀏覽器本機，不會被傳送到任何伺服器。
        </p>
        <input
          ref={inputRef}
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="請在此貼上您的 API 金鑰"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <div className="flex gap-4 mt-6">
            {hasApiKey && <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              取消
            </button>}
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              儲存金鑰
            </button>
        </div>
      </div>
    </div>
  );
};

const TranslationCard: React.FC<{ record: CryRecord }> = ({ record }) => {
  const details = ANALYSIS_DETAILS[record.subject][record.cryType] || ANALYSIS_DETAILS[record.subject]['Unknown'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full transform transition-all duration-500 hover:scale-105">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${details.bgColor} ${details.color}`}>
          {details.icon}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${details.color}`}>{details.label}</h3>
          <p className="text-sm text-gray-500">{new Date(record.timestamp).toLocaleString()}</p>
        </div>
        <div className="ml-auto text-right">
            <div className={`text-lg font-semibold ${details.color}`}>{(record.confidence * 100).toFixed(0)}%</div>
            <div className="text-xs text-gray-400">信心指數</div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-gray-700 font-medium">{record.suggestion}</p>
        <p className="text-gray-600 text-sm">{details.advice}</p>
      </div>
       {record.behavior && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-1">行為分析</h4>
          <p className="text-gray-600 text-sm">{record.behavior}</p>
        </div>
      )}
    </div>
  );
};

const SubjectSelector: React.FC<{ selected: Subject, onSelect: (subject: Subject) => void }> = ({ selected, onSelect }) => {
    const subjects: { key: Subject; icon: React.ReactNode; label: string }[] = [
        { key: 'Baby', label: '寶寶', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3h-.5a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3h.5a1 1 0 001-1V3.5zM3.5 6.5a1.5 1.5 0 013 0V7a1 1 0 001 1h.5a1.5 1.5 0 010 3h-.5a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V11a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3h.5a1 1 0 001-1V6.5zM10 12.5a1.5 1.5 0 013 0V13a1 1 0 001 1h.5a1.5 1.5 0 010 3h-.5a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V17a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3h.5a1 1 0 001-1v-1.5z" /></svg> },
        { key: 'Dog', label: '狗狗', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a.75.75 0 001.072 0l1.464-1.464a.75.75 0 00-1.072-1.072L8.464 12l-1.992-1.992a.75.75 0 00-1.072 1.072l2.52 2.52zM12 13a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H12z" clipRule="evenodd" /></svg> },
        { key: 'Cat', label: '貓咪', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1z" /><path d="M4 6a1 1 0 011-1h.5a1 1 0 01.98.804l.325 1.622A2 2 0 008.82 8H11a2 2 0 000-4H7.5a1 1 0 010-2H11a4 4 0 014 4v.18a4.002 4.002 0 013.82 3.636 1 1 0 01-1.99.146A2.002 2.002 0 0015 10H8.82a4.002 4.002 0 01-3.8-3.57L4.7 4.8A1 1 0 014 6zM5 12a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg> },
    ];
    return (
        <div className="flex justify-center space-x-2 sm:space-x-4 p-2 bg-blue-100 rounded-full">
            {subjects.map(({key, icon, label}) => (
                <button 
                    key={key}
                    onClick={() => onSelect(key)}
                    className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 ${selected === key ? 'bg-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-blue-200'}`}
                    aria-pressed={selected === key}
                >
                    {icon}
                    <span className="hidden sm:inline font-semibold">{label}</span>
                </button>
            ))}
        </div>
    )
};


const App: React.FC = () => {
  const [subject, setSubject] = useState<Subject>('Baby');
  const [status, setStatus] = useState<Status>('idle');
  const [recordMode, setRecordMode] = useState<RecordMode>('audio');
  const [latestResult, setLatestResult] = useState<CryRecord | null>(null);
  const [history, setHistory] = useState<CryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);
  
  const stopMediaTracks = useCallback(() => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current);
          frameIntervalRef.current = null;
      }
  }, []);

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('geminiApiKey', newApiKey);
    setIsApiKeyModalOpen(false);
    setError(null);
  };
  
  const handleApiError = (err: any) => {
    console.error("Analysis failed:", err);
    let errorMessage = '分析失敗，請再試一次。';
    // Check for common API key-related errors
    if (err instanceof Error && (err.message.includes('API key not valid') || err.message.includes('API_KEY_INVALID'))) {
      errorMessage = 'API 金鑰無效或已過期，請檢查並重新輸入。';
      localStorage.removeItem('geminiApiKey');
      setApiKey('');
      setIsApiKeyModalOpen(true);
    }
    setError(errorMessage);
    setStatus('idle');
  }

  const startRecording = async () => {
    setError(null);
    setStatus('recording');
    setLatestResult(null);

    try {
      const constraints = recordMode === 'audio' ? { audio: true } : { audio: true, video: { facingMode: "user" } };
      streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);

      if (recordMode === 'audio') {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          setStatus('processing');
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          try {
              const result = await translateAudio(audioBlob, subject, apiKey);
              const newRecord: CryRecord = {
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  subject,
                  ...result
              };
              setLatestResult(newRecord);
              setHistory(prev => [newRecord, ...prev]);
              setStatus('result');
          } catch(err) {
              handleApiError(err);
          }
          stopMediaTracks();
        };
        mediaRecorderRef.current.start();
      } else { // video
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        const frames: string[] = [];
        frameIntervalRef.current = window.setInterval(() => {
          if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
              const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
              frames.push(dataUrl.split(',')[1]);
            }
          }
        }, 500); // Capture frame every 500ms
        
        // Also record audio for video mode
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.start();
        
        setTimeout(async () => {
            mediaRecorderRef.current?.stop();
            stopMediaTracks();
            setStatus('processing');

            try {
                // Analyze video frames first
                const videoResult = await analyzeVideoFrames(frames, subject, apiKey);
                
                // Then analyze audio
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioResult = await translateAudio(audioBlob, subject, apiKey);
                
                // Combine results (prioritizing audio for cry type, video for behavior)
                const combinedResult: TranslationResult = {
                    cryType: audioResult.cryType,
                    confidence: (audioResult.confidence + videoResult.confidence) / 2, // Average confidence
                    suggestion: `${videoResult.suggestion} ${audioResult.suggestion}`, // Combine suggestions
                    behavior: videoResult.behavior,
                };

                const newRecord: CryRecord = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    subject,
                    ...combinedResult
                };

                setLatestResult(newRecord);
                setHistory(prev => [newRecord, ...prev]);
                setStatus('result');

            } catch(err) {
                handleApiError(err);
            }

        }, 5000); // Record for 5 seconds
      }
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("無法啟動麥克風或攝影機，請檢查權限。");
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (recordMode === 'audio' && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    // Video stops on its own timeout
    setStatus('processing');
  };

  const config = SUBJECT_CONFIG[subject];

  return (
    <>
    <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onSave={handleSaveApiKey}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
    />
    <div className="min-h-screen bg-blue-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center relative">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">{config.title}</h1>
            <button onClick={() => setIsApiKeyModalOpen(true)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors" aria-label="設定 API 金鑰">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <p className="text-blue-600 mt-2">{config.subtitle}</p>
        </header>

        <main className="space-y-8">
          <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
             <SubjectSelector selected={subject} onSelect={(s) => { setSubject(s); setLatestResult(null); }} />
             <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                <button onClick={() => setRecordMode('audio')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${recordMode === 'audio' ? 'bg-white shadow' : 'text-gray-600'}`}>聲音</button>
                <button onClick={() => setRecordMode('video')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${recordMode === 'video' ? 'bg-white shadow' : 'text-gray-600'}`}>影像</button>
             </div>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-8 min-h-[250px] space-y-4">
            {recordMode === 'video' && status === 'recording' && (
                <div className="w-full max-w-sm aspect-video bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scaleX-[-1]"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )}
            
            <button
              onClick={status === 'recording' ? stopRecording : startRecording}
              disabled={status === 'processing' || !apiKey}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed ${status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
              aria-label={status === 'recording' ? '停止錄製' : '開始錄製'}
            >
              {status === 'recording' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1V5z" clipRule="evenodd" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5V14M12 6.5V5M16 10.5h1.5M6.5 10.5H5m.38-4.12l1.06-1.06M17.56 16.5l1.06-1.06M6.94 16.5l-1.06-1.06M18.62 6.38l-1.06 1.06M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>
              }
            </button>
            <p className="text-lg font-semibold text-gray-700 h-8">
              {status === 'idle' && config.recordPlaceholder(recordMode)}
              {status === 'recording' && (recordMode === 'video' ? '錄影中... (5秒)' : '錄音中...')}
              {status === 'processing' && '分析中，請稍候...'}
              {status === 'result' && '分析完成！'}
            </p>
             {!apiKey && status === 'idle' && (
                <p className="text-red-600 text-sm font-medium">請先設定您的 API 金鑰</p>
            )}
          </div>
          
           {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">發生錯誤：</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
           )}

          {latestResult && status === 'result' && <TranslationCard record={latestResult} />}
          
          {history.length > 1 && (
            <div className="pt-8">
                <h2 className="text-2xl font-bold text-center mb-4 text-blue-800">歷史紀錄</h2>
                <div className="space-y-4">
                    {history.slice(1).map(record => <TranslationCard key={record.id} record={record} />)}
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  );
};

export default App;
