export const ACCENT = '#1c89bf';
export const ACCENT_DARK = '#1570a0';

export interface Config {
    // Layout
    variant: 'classic' | 'coachella';
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
    char1: string;
    char2: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
    interactive: boolean;
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
        text2StrokeWidth: '3px',
        pinwheelTheme: 'default',
        char1: '경',
        char2: '축',
        backgroundColor: '#ffffff',
        borderColor: '#f3f4f6',
        borderWidth: '2px',
        borderRadius: '0.125rem',
        interactive: false,
    },
    pastel: {
        text1: 'Happy Birthday',
        text2: 'Dear Friend',
        text3: 'With Best Wishes',
        text1Color: '#FF6B6B',
        text2Color: '#4ECDC4',
        text3Color: '#111827',
        text2StrokeColor: '#4ECDC4',
        text2StrokeWidth: '3px',
        pinwheelTheme: 'pastel',
        char1: 'H',
        char2: 'B',
        backgroundColor: '#f0fdfa',
        borderColor: '#ccfbf1',
        borderWidth: '2px',
        borderRadius: '1rem',
        interactive: false,
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
        char1: '★',
        char2: '★',
        backgroundColor: '#0f172a',
        borderColor: '#FF00FF',
        borderWidth: '3px',
        borderRadius: '0.5rem',
        interactive: false,
    },
};

export const DEFAULT_CONFIG: Config = {
    ...PRESETS.default,
    variant: 'classic',
    scale: 1,
    emblemScale: 0.75,
    animate: true,
} as Config;

export const PASTEL_CONFIG: Config = {
    ...DEFAULT_CONFIG,
    ...PRESETS.pastel,
    variant: 'classic',
};

export const NEON_CONFIG: Config = {
    ...DEFAULT_CONFIG,
    ...PRESETS.neon,
    variant: 'classic',
};
