export const ACCENT = '#1c89bf';
export const ACCENT_DARK = '#1570a0';

export interface Config {
    text1: string;
    text2: string;
    text3: string;
    text1Color: string;
    text2Color: string;
    text3Color: string;
    text2StrokeColor: string;
    text2StrokeWidth: string;
    scale: number;
    emblemScale: number;
    animate: boolean;
    pinwheelTheme: 'default' | 'pastel' | 'neon';
}

export const PRESETS: Record<string, Partial<Config>> = {
    default: {
        text1: '축하합니다',
        text2: '김준호',
        text3: '아무 이유 없음',
        text1Color: '#1c89bf',
        text2Color: '#222222',
        text3Color: '#111827',
        text2StrokeColor: '#222222',
        text2StrokeWidth: '2.5px',
        pinwheelTheme: 'default',
    },
    pastel: {
        text1: 'Happy Birthday',
        text2: 'Dear Friend',
        text3: 'With Best Wishes',
        text1Color: '#FF6B6B',
        text2Color: '#4ECDC4',
        text3Color: '#111827',
        text2StrokeColor: '#4ECDC4',
        text2StrokeWidth: '2.5px',
        pinwheelTheme: 'pastel',
    },
    neon: {
        text1: 'GRAND OPENING',
        text2: 'NIGHT CLUB',
        text3: 'Tonight Only',
        text1Color: '#FF00FF',
        text2Color: '#00FFFF',
        text3Color: '#FFFFFF',
        text2StrokeColor: '#00FFFF',
        text2StrokeWidth: '2px',
        pinwheelTheme: 'neon',
    },
};

export const DEFAULT_CONFIG: Config = {
    ...PRESETS.default,
    scale: 1,
    emblemScale: 0.75,
    animate: true,
} as Config;
