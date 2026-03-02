import { generatePinwheelSvgPaths } from './pinwheel';

// ─── Sanitize ─────────────────────────────────────────────────────────────────
// Prevent XSS / SVG injection from user-provided query params.
function escapeXml(raw: string): string {
    return String(raw)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Only allow safe CSS color values (hex, rgb, named colors)
function sanitizeColor(raw: string, fallback: string): string {
    const cleaned = String(raw).trim();
    // Allow hex colors, rgb(), rgba(), hsl(), hsla(), and CSS color names (letters only)
    if (
        /^(#[0-9a-fA-F]{3,8}|rgb\([\d,\s.%]+\)|rgba\([\d,\s.%]+\)|hsl\([\d,\s.%]+\)|hsla\([\d,\s.%]+\)|[a-zA-Z]+)$/.test(
            cleaned
        )
    ) {
        return cleaned;
    }
    return fallback;
}

function sanitizeStrokeWidth(raw: string, fallback: string): string {
    // Only allow valid CSS length values like "2.5px", "2", "0.5em"
    if (/^\d+(\.\d+)?(px|em|rem)?$/.test(String(raw).trim())) return String(raw).trim();
    return fallback;
}

// ─── Width Estimation ─────────────────────────────────────────────────────────
const estimate = (t: string, s: number, ls: number) => {
    let w = 0;
    for (const c of t) {
        // Hangul/CJK ~1em, Latin/ASCII ~0.6em
        w += s * (c.match(/[\u3131-\u318E\uAC00-\uD7A3\u4E00-\u9FFF]/) ? 1.1 : 0.65);
    }
    return w + t.length * s * ls;
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export function getSvgSlogan(options: Record<string, string | undefined>) {
    // Text — escape to prevent SVG injection
    const text1 = escapeXml(options.text1 || '축하합니다');
    const text2 = escapeXml(options.text2 || '김준호');
    const text3 = escapeXml(options.text3 || '아무 이유 없음');

    // Colors — sanitize
    const text1Color = sanitizeColor(options.text1Color || '', '#1c89bf');
    const text2Color = sanitizeColor(options.text2Color || '', '#222222');
    const text3Color = sanitizeColor(options.text3Color || '', '#111827');
    const text2StrokeColor = sanitizeColor(options.text2StrokeColor || '', '#222222');
    const text2StrokeWidth = sanitizeStrokeWidth(options.text2StrokeWidth || '', '2.5px');

    const scale = Math.min(3, Math.max(0.1, parseFloat(options.scale || '') || 1));
    const emblemScale = Math.min(2, Math.max(0.2, parseFloat(options.emblemScale || '') || 0.75));
    const animate = options.animate !== 'false';
    const theme = ['default', 'pastel', 'neon'].includes(options.theme || '')
        ? (options.theme as string)
        : 'default';

    // ── Dimensions ────────────────────────────────────────────────────────────
    const emblemSize = 90 * emblemScale * scale;
    const gap = 24 * scale;

    const fs1 = 20 * scale;
    const fs2 = 48 * scale;
    const fs3 = 14 * scale;

    const rawText1 = options.text1 || '축하합니다';
    const rawText2 = options.text2 || '김준호';
    const rawText3 = options.text3 || '아무 이유 없음';

    const w1 = estimate(rawText1, fs1, 0.35);
    const w2 = estimate(rawText2, fs2, 0.15);
    const w3 = estimate(`— ${rawText3} —`, fs3, 0.4);

    const maxTextWidth = Math.max(w1, w2, w3, 100 * scale);
    const contentWidth = emblemSize * 2 + gap * 2 + maxTextWidth;
    const padX = 32 * scale;
    const padY = 20 * scale;

    const totalW = contentWidth + padX * 2;
    const contentH = 110 * scale;
    const minHeight = 140 * scale;
    const totalH = Math.max(minHeight, contentH + padY * 2, emblemSize + padY * 2);

    const centerX = totalW / 2;
    const centerY = totalH / 2;

    // Positions
    const leftEmblemX = padX;
    const rightEmblemX = totalW - padX - emblemSize;
    const emblemY = centerY - emblemSize / 2;

    const textCenterY = centerY;
    const y1 = textCenterY - 35 * scale;
    const y2 = textCenterY + 10 * scale;
    const y3 = textCenterY + 45 * scale;

    const numStrokeW = parseFloat(text2StrokeWidth) || 2.5;

    // Emblem SVGs (pinwheels)
    const e1 = generatePinwheelSvgPaths(theme, true, false, animate);
    const e2 = generatePinwheelSvgPaths(theme, true, true, animate);

    // ── Font Setup ────────────────────────────────────────────────────────────
    // GitHub renders SVGs in a sandboxed <img> — external CSS/fonts are blocked.
    // We use Google Fonts CSS API via a <style> @import which some renderers DO load,
    // AND we set a broad fallback chain so CJK glyphs still render via system fonts.
    const fontFamily =
        '"Nanum Myeongjo", "Apple SD Gothic Neo", "Malgun Gothic", "나눔명조", "Gungsuh", "Batang", "궁서", "바탕", CJKsc, serif';
    const monoFontFamily = '"Outfit", "SF Pro Display", "Segoe UI", system-ui, sans-serif';

    return `<svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <filter id="card-shadow" x="-5%" y="-5%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.08"/>
        </filter>
        <rect id="center-disk" x="18" y="18" width="64" height="64" rx="32" fill="#E11D48"/>
        <circle id="inner-disk" cx="50" cy="50" r="30" stroke="white" stroke-width="2" fill="none"/>
    </defs>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&amp;family=Outfit:wght@600&amp;display=swap');
    </style>

    <!-- Background Card -->
    <rect x="2" y="2" width="${totalW - 4}" height="${totalH - 4}" rx="${4 * scale}" fill="white" stroke="#f3f4f6" stroke-width="2" filter="url(#card-shadow)"/>

    <!-- Left Emblem (경) -->
    <svg x="${leftEmblemX}" y="${emblemY}" width="${emblemSize}" height="${emblemSize}" viewBox="0 0 100 100">
        <use href="#center-disk"/>
        <use href="#inner-disk"/>
        <text x="50" y="53" dominant-baseline="middle" text-anchor="middle"
              font-family="${fontFamily}" font-size="28" font-weight="800"
              fill="#f8bf01" stroke="#f8bf01" stroke-width="1.5">경</text>
        ${e1}
    </svg>

    <!-- Texts -->
    <g text-anchor="middle">
        <!-- Text 1: top label -->
        <text x="${centerX}" y="${y1}" dominant-baseline="middle"
              fill="${text1Color}" font-size="${fs1}" font-weight="900"
              font-family="${fontFamily}" letter-spacing="${(0.35 * fs1) / 16}em">${text1}</text>

        <!-- Text 2: main name — stroke pass first, then fill pass (matches -webkit-text-stroke) -->
        <text x="${centerX}" y="${y2}" dominant-baseline="middle"
              fill="${text2Color}" stroke="${text2StrokeColor}"
              stroke-width="${numStrokeW * scale}" stroke-linejoin="round"
              font-size="${fs2}" font-weight="300" font-family="${fontFamily}"
              letter-spacing="${(0.15 * fs2) / 16}em">${text2}</text>
        <text x="${centerX}" y="${y2}" dominant-baseline="middle"
              fill="${text2Color}" font-size="${fs2}" font-weight="300"
              font-family="${fontFamily}" letter-spacing="${(0.15 * fs2) / 16}em">${text2}</text>

        <!-- Text 3: tagline -->
        <text x="${centerX}" y="${y3}" dominant-baseline="middle"
              fill="${text3Color}" font-size="${fs3}" font-weight="600"
              font-family="${monoFontFamily}" letter-spacing="${(0.4 * fs3) / 16}em">— ${text3} —</text>
    </g>

    <!-- Right Emblem (축) -->
    <svg x="${rightEmblemX}" y="${emblemY}" width="${emblemSize}" height="${emblemSize}" viewBox="0 0 100 100">
        <use href="#center-disk"/>
        <use href="#inner-disk"/>
        <text x="50" y="53" dominant-baseline="middle" text-anchor="middle"
              font-family="${fontFamily}" font-size="28" font-weight="800"
              fill="#f8bf01" stroke="#f8bf01" stroke-width="1.5">축</text>
        ${e2}
    </svg>
</svg>`.trim();
}
