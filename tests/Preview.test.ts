import { describe, expect, it } from 'vitest';
import { getExportFontTexts } from '../demo-components/Preview';

describe('getExportFontTexts', () => {
    it('uses the configured text and emblem characters when preparing export fonts', () => {
        expect(
            getExportFontTexts({
                char1: 'H',
                char2: 'B',
                text1: 'Happy Birthday',
                text2: 'Dear Friend',
                text3: 'Best Wishes',
            })
        ).toEqual({
            emblems: 'HB',
            text1: 'Happy Birthday',
            text2: 'Dear Friend',
            text3: 'ㅡ Best Wishes ㅡ',
        });
    });
});
