export const GOOGLE_FONTS_ELEMENT_ID = 'k-celebrate-slogan-google-fonts';
export const JOSEON_PALACE_STYLE_ELEMENT_ID = 'k-celebrate-slogan-joseon-palace-font';

const GOOGLE_FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@800&family=Noto+Sans+KR:wght@600&family=Outfit:wght@600&display=swap';

const JOSEON_PALACE_FONT_CSS = `
    @font-face {
        font-family: 'JoseonPalace';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff') format('woff');
        font-weight: 400;
        font-display: swap;
    }
`;

export interface SloganFontTexts {
    emblems: string;
    text1: string;
    text2: string;
    text3: string;
}

export const ensureSloganFonts = (): void => {
    if (typeof document === 'undefined') return;

    if (!document.getElementById(GOOGLE_FONTS_ELEMENT_ID)) {
        const link = document.createElement('link');
        link.id = GOOGLE_FONTS_ELEMENT_ID;
        link.rel = 'stylesheet';
        link.href = GOOGLE_FONTS_URL;
        document.head.appendChild(link);
    }

    if (!document.getElementById(JOSEON_PALACE_STYLE_ELEMENT_ID)) {
        const style = document.createElement('style');
        style.id = JOSEON_PALACE_STYLE_ELEMENT_ID;
        style.textContent = JOSEON_PALACE_FONT_CSS;
        document.head.appendChild(style);
    }
};

export const waitForSloganFonts = async (
    { emblems, text1, text2, text3 }: SloganFontTexts,
    timeoutMs = 3000
): Promise<void> => {
    if (typeof document === 'undefined' || !document.fonts?.load) return;

    const loadPromises = [
        document.fonts.load('800 1em "Nanum Myeongjo"', `${emblems} ${text1}`),
        document.fonts.load('400 1em "JoseonPalace"', text2),
        document.fonts.load('600 1em "Outfit"', text3),
        document.fonts.load('600 1em "Noto Sans KR"', text3),
    ].map((fontLoad) => fontLoad.catch(() => undefined));

    await new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, timeoutMs);
        void Promise.all(loadPromises).then(() => {
            clearTimeout(timeout);
            resolve();
        });
    });
};
