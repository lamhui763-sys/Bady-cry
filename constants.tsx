import React from 'react';
import { Subject, CryType } from './types';

interface CryDetail {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  advice: string;
}

enum BabyCryType {
  Hungry = 'Hungry',
  Tired = 'Tired',
  Diaper = 'Diaper',
  Uncomfortable = 'Uncomfortable',
  Bored = 'Bored',
  Playful = 'Playful',
  Unknown = 'Unknown',
}

enum DogBarkType {
    Happy = 'Happy',
    Playful = 'Playful',
    Anxious = 'Anxious',
    Warning = 'Warning',
    Lonely = 'Lonely',
    Unknown = 'Unknown',
}

enum CatMeowType {
    Greeting = 'Greeting',
    Hungry = 'Hungry',
    Attention = 'Attention',
    Annoyed = 'Annoyed',
    Pain = 'Pain',
    Playful = 'Playful',
    Relaxed = 'Relaxed',
    Unknown = 'Unknown',
}

export const BABY_CRY_DETAILS: Record<string, CryDetail> = {
  [BabyCryType.Hungry]: {
    label: '肚子餓了',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    advice: '寶寶的哭聲通常短促、有節奏且音調較低。可以嘗試餵奶，並觀察寶寶是否有尋乳反射，例如轉頭或張嘴。',
  },
  [BabyCryType.Tired]: {
    label: '想睡覺了',
    color: 'text-indigo-800',
    bgColor: 'bg-indigo-100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    advice: '哭聲聽起來像是斷斷續續的嗚咽，寶寶可能會揉眼睛或打哈欠。可以嘗試將寶寶包裹起來，輕輕搖晃或播放白噪音來幫助寶寶入睡。',
  },
  [BabyCryType.Diaper]: {
    label: '需要換尿布',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    advice: '哭聲可能比較煩躁、刺耳。檢查尿布是否濕了或髒了，並及時更換以保持寶寶的舒適。',
  },
  [BabyCryType.Uncomfortable]: {
    label: '感到不舒服',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    advice: '哭聲尖銳且持續，可能是因為脹氣、太熱、太冷或衣服不舒服。嘗試給寶寶拍嗝，檢查室內溫度和衣物。',
  },
  [BabyCryType.Bored]: {
    label: '覺得無聊',
    color: 'text-purple-800',
    bgColor: 'bg-purple-100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.136A1.76 1.76 0 017.165 9.7l5.147-5.147a1.76 1.76 0 012.489 0l5.147 5.147a1.76 1.76 0 01-.732 3.006l-6.136 2.147a1.76 1.76 0 01-.592-3.417z" />
      </svg>
    ),
    advice: '哭聲一陣一陣，像是在尋求關注。嘗試和寶寶互動，對他說話、唱歌或玩一些溫和的遊戲。',
  },
  [BabyCryType.Playful]: {
    label: '想玩耍',
    color: 'text-lime-800',
    bgColor: 'bg-lime-100',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    advice: '寶寶看起來很開心，正在探索周遭環境。可以跟他玩遊戲、對他說話，或給他安全的玩具來鼓勵他發展。',
  },
  [BabyCryType.Unknown]: {
    label: '無法識別',
    color: 'text-gray-800',
    bgColor: 'bg-gray-100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    advice: '無法準確識別哭聲，請結合寶寶的狀態進行觀察。如果寶寶持續哭鬧，請考慮尋求專業醫療建議。',
  },
};

export const DOG_BARK_DETAILS: Record<string, CryDetail> = {
    [DogBarkType.Happy]: {
        label: '開心',
        color: 'text-orange-800',
        bgColor: 'bg-orange-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        advice: '叫聲高亢、連續，通常伴隨著搖尾巴。狗狗可能在歡迎你回家，或是對某件事感到興奮。',
    },
    [DogBarkType.Playful]: {
        label: '想玩耍',
        color: 'text-lime-800',
        bgColor: 'bg-lime-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>,
        advice: '短促而連續的「汪！汪！」聲，可能會做出「遊戲鞠躬」的動作（前肢趴下，屁股翹高）。是時候拿出玩具了！',
    },
    [DogBarkType.Anxious]: {
        label: '焦慮不安',
        color: 'text-cyan-800',
        bgColor: 'bg-cyan-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        advice: '高音調、嗚咽般的吠叫，可能伴隨踱步或發抖。試著找出焦慮的來源（如打雷、陌生人），並安撫牠。',
    },
    [DogBarkType.Warning]: {
        label: '警告',
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        advice: '低沉、有力的吠叫，通常是為了警告有潛在威脅。注意觀察周遭環境，但不要隨意懲罰牠的警戒心。',
    },
    [DogBarkType.Lonely]: {
        label: '孤單',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
        advice: '持續、單調的吠叫，尤其是在你離開時。可以考慮提供一些抗憂鬱玩具，或進行更多的陪伴與互動。',
    },
     [DogBarkType.Unknown]: {
        label: '無法識別',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        advice: '無法準確識別，請結合狗狗的肢體語言和環境進行觀察。如果持續異常，請考慮尋求獸醫建議。',
    },
};

export const CAT_MEOW_DETAILS: Record<string, CryDetail> = {
    [CatMeowType.Greeting]: {
        label: '打招呼',
        color: 'text-emerald-800',
        bgColor: 'bg-emerald-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11" /></svg>,
        advice: '短促、輕柔的喵喵聲，通常在你回家或進入房間時發出。這是友好的問候，可以輕輕地回應牠。',
    },
    [CatMeowType.Hungry]: {
        label: '肚子餓了',
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        advice: '中等長度、帶有乞求意味的喵喵聲，可能會在你周圍磨蹭或帶你到食盆旁。是時候檢查一下貓糧了。',
    },
    [CatMeowType.Attention]: {
        label: '求關注',
        color: 'text-sky-800',
        bgColor: 'bg-sky-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
        advice: '持續不斷的喵喵叫，可能是希望你陪牠玩、撫摸牠或幫牠開門。給予一些關注和互動吧。',
    },
    [CatMeowType.Annoyed]: {
        label: '煩躁',
        color: 'text-rose-800',
        bgColor: 'bg-rose-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
        advice: '尖銳、長長的咆哮或嘶嘶聲，表示牠感到威脅或不滿。最好先保持距離，找出讓牠不悅的原因。',
    },
    [CatMeowType.Pain]: {
        label: '疼痛',
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
        advice: '突然發出響亮、刺耳或不尋常的叫聲，尤其是在被觸摸或移動時。這可能是身體不適的信號，應密切觀察並考慮諮詢獸醫。',
    },
    [CatMeowType.Playful]: {
        label: '想玩耍',
        color: 'text-lime-800',
        bgColor: 'bg-lime-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.936 18.323a.96.96 0 01.657-1.723 5.05 5.05 0 004.82-4.82.96.96 0 111.92 0 7 7 0 01-6.74 6.74.96.96 0 01-1.722-.657.954.954 0 01.12-.303.954.954 0 00-.055-.24zm12-12a.96.96 0 01-1.723-.657A7 7 0 005.473 12a.96.96 0 110 1.92 5.05 5.05 0 004.82 4.82.96.96 0 11-.657 1.723.954.954 0 00-.24-.055.954.954 0 01-.303.12c-.44.175-.657-.403-.303-.767l.001-.001c.175-.175.175-.46 0-.636l-.001-.001c-.354-.354.327-.942.767-.303zm-1.636 5.636a2 2 0 112.828-2.828 2 2 0 01-2.828 2.828z" /></svg>,
        advice: '貓咪的姿勢放鬆但專注，瞳孔放大，尾巴輕快地擺動。這是邀請你一起玩耍的信號！拿出逗貓棒吧。',
    },
    [CatMeowType.Relaxed]: {
        label: '放鬆滿足',
        color: 'text-teal-800',
        bgColor: 'bg-teal-100',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.5 9.5a5.5 5.5 0 1111 0v1a5.5 5.5 0 01-11 0v-1zM18.5 11a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>,
        advice: '貓咪正在緩慢眨眼、發出呼嚕聲，或以舒服的姿勢躺著。這表示牠感到安全且滿足，靜靜地陪伴牠就是最好的回應。',
    },
     [CatMeowType.Unknown]: {
        label: '無法識別',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        icon: <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        advice: '無法準確識別，貓的叫聲非常多樣化。請結合牠的肢體語言和當前情境來理解牠的需求。',
    },
};


export const ANALYSIS_DETAILS: Record<Subject, Record<string, CryDetail>> = {
    Baby: BABY_CRY_DETAILS,
    Dog: DOG_BARK_DETAILS,
    Cat: CAT_MEOW_DETAILS,
}