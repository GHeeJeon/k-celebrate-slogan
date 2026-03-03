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
        if (c.match(/[\u3131-\u318E\uAC00-\uD7A3\u4E00-\u9FFF]/))
            w += s * 1.1; // Hangul/CJK
        else if (c.match(/[A-Z]/))
            w += s * 0.85; // Uppercase Latin
        else if (c.match(/[a-z0-9]/))
            w += s * 0.65; // Lowercase/Numbers
        else w += s * 0.5; // Spaces, etc
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

    // emblemSize base 130: targets ratio ~2.0x vs fs2(48) — closer to React's 2.6x
    // React: 13rem * 0.75 = 9.75rem ≈ 156px vs fs2 3.75rem=60px → ratio 2.6
    const emblemSize = 130 * emblemScale * scale;
    const gap = 24 * scale;

    // Font sizes match React proportions: fs1/fs2 ≈ 3rem/3.75rem = 0.8
    const fs1 = 38 * scale; // was 20; React = 3rem ≈ 48px at default scale
    const fs2 = 48 * scale; // React = 3.75rem — unchanged
    const fs3 = 14 * scale;

    const rawText1 = options.text1 || '축하합니다';
    const rawText2 = options.text2 || '김준호';
    const rawText3 = options.text3 || '아무 이유 없음';

    // text1 has scaleX(1.2) applied in SVG
    const w1 = estimate(rawText1, fs1, 0.35) * 1.2;
    const w2 = estimate(rawText2, fs2, 0.15);
    const w3 = estimate(`— ${rawText3} —`, fs3, 0.4);

    const maxTextWidth = Math.max(w1, w2, w3, 100 * scale);
    const contentWidth = emblemSize * 2 + gap * 2 + maxTextWidth;
    const padX = 32 * scale;
    const padY = 20 * scale;

    const totalW = contentWidth + padX * 2;
    // Increase content/min height to accommodate larger fs1
    const contentH = 130 * scale;
    const minHeight = 160 * scale;
    const totalH = Math.max(minHeight, contentH + padY * 2, emblemSize + padY * 2);

    const centerX = totalW / 2;
    const centerY = totalH / 2;

    // ── Text area available width (between emblems) ────────────────────────────
    // Used to clamp text2 so it never overlaps the emblem regions.
    const textAreaW = Math.round(totalW - 2 * padX - 2 * emblemSize - 2 * gap);

    // Positions — adjusted gaps to fit larger fs1
    const leftEmblemX = padX;
    const rightEmblemX = totalW - padX - emblemSize;
    const emblemY = centerY - emblemSize / 2;

    const textCenterY = centerY;
    const y1 = textCenterY - 44 * scale; // moved up a bit for larger text1
    const y2 = textCenterY + 12 * scale;
    const y3 = textCenterY + 52 * scale;

    const numStrokeW = parseFloat(text2StrokeWidth) || 2.5;

    // Emblem SVGs (pinwheels)
    // Left 경: reverse=true (counter-clockwise) — matches EmblemSection reverse prop
    // Right 축: reverse=false (clockwise) — opposite direction
    // Pass unique ids so each pinwheel uses its own @keyframes & CSS class,
    // preventing collision when both are embedded in the same SVG document.
    const e1 = generatePinwheelSvgPaths(theme, true, false, animate, 'gyeong');
    const e2 = generatePinwheelSvgPaths(theme, false, true, animate, 'chuk');

    // ── SVG z-order: later elements are rendered ON TOP.
    // Correct order per emblem: pinwheel blades → red disk → 경/축 text
    // Disk: red circle + white border + thin dark inner shadow (matches EmblemSection CSS)
    // Disk size: EmblemSection sets disk at 55% of emblem → r = 55/2 = 27.5 ≈ 27
    const diskMarkup = `
        <circle cx="50" cy="50" r="27" fill="#E11D48"/>
        <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="3"/>
        <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`;

    // ── Fonts ──────────────────────────────────────────────────────────────────
    // @font-face works when SVG is opened directly in a browser (local preview).
    // GitHub <img> sandboxing blocks external font requests — system fallbacks apply.
    // Use @font-face (NOT @import) — @import in SVG <style> is unreliable cross-browser.
    const styleBlock = `
        @import url('//fonts.googleapis.com/earlyaccess/nanummyeongjo.css');
        @font-face {
            font-family: JoseonPalace;
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff') format('woff');
            font-weight: normal;
    `;

    // Per-role font stacks (NO double-quotes — they break XML attribute parsing)
    const fontText1 = "'Nanum Myeongjo', serif";
    const fontText2 = 'JoseonPalace, 궁서, Gungsuh, Batang, serif';
    const fontText3 = 'Outfit, SF Pro Display, Segoe UI, system-ui, sans-serif';
    const fontEmblem = "'Nanum Myeongjo', serif";

    return `<svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="card-shadow" x="-5%" y="-5%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.08"/>
        </filter>
    </defs>

    <style>${styleBlock}</style>

    <!-- Background Card -->
    <rect x="2" y="2" width="${totalW - 4}" height="${totalH - 4}" rx="${4 * scale}" fill="white" stroke="#f3f4f6" stroke-width="2" filter="url(#card-shadow)"/>

    <!-- Left Emblem (경): pinwheel BEHIND disk, disk BEHIND text -->
    <svg x="${leftEmblemX}" y="${emblemY}" width="${emblemSize}" height="${emblemSize}" viewBox="0 0 100 100" overflow="visible">
        ${e1}
        ${diskMarkup}
        <!-- Char: black outline (4-dir text-shadow → SVG stroke trick), then yellow fill -->
        <text x="50" y="53" dominant-baseline="middle" text-anchor="middle"
              font-family="${fontEmblem}" font-size="28" font-weight="900"
              fill="none" stroke="#000000" stroke-width="3" stroke-linejoin="round">경</text>
        <text x="50" y="53" dominant-baseline="middle" text-anchor="middle"
              font-family="${fontEmblem}" font-size="28" font-weight="900"
              fill="#FDE047">경</text>
    </svg>

    <!-- Texts -->
    <g text-anchor="middle">
        <!-- Text 1: scaleX(1.2) 장평, letter-spacing 0.35em, text-shadow -->
        <text x="${centerX}" y="${y1}" dominant-baseline="middle" text-anchor="middle"
              fill="${text1Color}" font-size="${fs1}" font-weight="800"
              font-family="${fontText1}"
              style="letter-spacing: 0.35em; text-shadow: 0.5px 0.5px 0px rgba(0,0,0,0.1);"
              transform="translate(${centerX},${y1}) scale(1.2,1) translate(${-centerX},${-y1})">${text1}</text>

        <!-- Text 2: JoseonPalace — textLength clamped to textAreaW to prevent emblem overlap -->
        <text x="${centerX}" y="${y2}" dominant-baseline="middle"
              fill="${text2Color}" stroke="${text2StrokeColor}"
              stroke-width="${numStrokeW * scale}" stroke-linejoin="round"
              font-size="${fs2}" font-weight="300" font-family="${fontText2}"
              letter-spacing="0.15em"
              ${w2 > textAreaW ? `textLength="${textAreaW}" lengthAdjust="spacingAndGlyphs"` : ''}>${text2}</text>
        <text x="${centerX}" y="${y2}" dominant-baseline="middle"
              fill="${text2Color}" font-size="${fs2}" font-weight="300"
              font-family="${fontText2}" letter-spacing="0.15em"
              ${w2 > textAreaW ? `textLength="${textAreaW}" lengthAdjust="spacingAndGlyphs"` : ''}>${text2}</text>

        <!-- Text 3: Outfit tagline -->
        <text x="${centerX}" y="${y3}" dominant-baseline="middle"
              fill="${text3Color}" font-size="${fs3}" font-weight="600"
              font-family="${fontText3}" letter-spacing="0.4em">— ${text3} —</text>
    </g>

    <!-- Right Emblem (축): pinwheel BEHIND disk, disk BEHIND text -->
    <svg x="${rightEmblemX}" y="${emblemY}" width="${emblemSize}" height="${emblemSize}" viewBox="0 0 100 100" overflow="visible">
        ${e2}
        ${diskMarkup}
        <!-- Char: black outline then yellow fill -->
        <text x="50" y="53" dominant-baseline="middle" text-anchor="middle"
              font-family="${fontEmblem}" font-size="28" font-weight="900"
              fill="none" stroke="#000000" stroke-width="3" stroke-linejoin="round">축</text>
        <text x="50" y="53" dominant-baseline="middle" text-anchor="middle"
              font-family="${fontEmblem}" font-size="28" font-weight="900"
              fill="#FDE047">축</text>
    </svg>
</svg>`.trim();
}
