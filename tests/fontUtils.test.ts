import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    GOOGLE_FONTS_ELEMENT_ID,
    JOSEON_PALACE_STYLE_ELEMENT_ID,
    ensureSloganFonts,
    waitForSloganFonts,
} from '../fontUtils';

const removeInjectedFonts = () => {
    document.getElementById(GOOGLE_FONTS_ELEMENT_ID)?.remove();
    document.getElementById(JOSEON_PALACE_STYLE_ELEMENT_ID)?.remove();
};

const originalFontsDescriptor = Object.getOwnPropertyDescriptor(document, 'fonts');

afterEach(() => {
    removeInjectedFonts();
    vi.useRealTimers();
    vi.restoreAllMocks();

    if (originalFontsDescriptor) {
        Object.defineProperty(document, 'fonts', originalFontsDescriptor);
    } else {
        Reflect.deleteProperty(document, 'fonts');
    }
});

describe('slogan font utilities', () => {
    it('adds one shared Google Fonts link and JoseonPalace style to the document', () => {
        ensureSloganFonts();
        ensureSloganFonts();

        const googleFontsLink = document.getElementById(GOOGLE_FONTS_ELEMENT_ID);
        const joseonPalaceStyle = document.getElementById(JOSEON_PALACE_STYLE_ELEMENT_ID);

        expect(document.querySelectorAll(`#${GOOGLE_FONTS_ELEMENT_ID}`)).toHaveLength(1);
        expect(document.querySelectorAll(`#${JOSEON_PALACE_STYLE_ELEMENT_ID}`)).toHaveLength(1);
        expect(googleFontsLink).toHaveAttribute('rel', 'stylesheet');
        expect(googleFontsLink).toHaveAttribute(
            'href',
            'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@800&family=Noto+Sans+KR:wght@600&family=Outfit:wght@600&display=swap'
        );
        expect(joseonPalaceStyle).toHaveTextContent("font-family: 'JoseonPalace'");
        expect(joseonPalaceStyle).toHaveTextContent('font-display: swap');
    });

    it('loads each font with the text that needs its glyphs before export', async () => {
        const load = vi.fn().mockResolvedValue([]);
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { load },
        });

        await waitForSloganFonts({
            emblems: '경축',
            text1: '축하합니다',
            text2: '김준호',
            text3: 'ㅡ 아무 이유 없음 ㅡ',
        });

        expect(load).toHaveBeenCalledWith('800 1em "Nanum Myeongjo"', '경축 축하합니다');
        expect(load).toHaveBeenCalledWith('400 1em "JoseonPalace"', '김준호');
        expect(load).toHaveBeenCalledWith('600 1em "Outfit"', 'ㅡ 아무 이유 없음 ㅡ');
        expect(load).toHaveBeenCalledWith('600 1em "Noto Sans KR"', 'ㅡ 아무 이유 없음 ㅡ');
    });

    it('continues export after the font wait timeout', async () => {
        vi.useFakeTimers();
        const load = vi.fn().mockImplementation(() => new Promise(() => undefined));
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { load },
        });

        const wait = waitForSloganFonts(
            {
                emblems: '경축',
                text1: '축하합니다',
                text2: '김준호',
                text3: 'ㅡ 아무 이유 없음 ㅡ',
            },
            3000
        );

        await vi.advanceTimersByTimeAsync(3000);
        await expect(wait).resolves.toBeUndefined();
    });

    it('continues export when a font request is rejected', async () => {
        const load = vi.fn().mockRejectedValue(new Error('font unavailable'));
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { load },
        });

        await expect(
            waitForSloganFonts({
                emblems: '경축',
                text1: '축하합니다',
                text2: '김준호',
                text3: 'ㅡ 아무 이유 없음 ㅡ',
            })
        ).resolves.toBeUndefined();
    });

    it('continues export when the Font Loading API is unavailable', async () => {
        Reflect.deleteProperty(document, 'fonts');

        await expect(
            waitForSloganFonts({
                emblems: '경축',
                text1: '축하합니다',
                text2: '김준호',
                text3: 'ㅡ 아무 이유 없음 ㅡ',
            })
        ).resolves.toBeUndefined();
    });
});
