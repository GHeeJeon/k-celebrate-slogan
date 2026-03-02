const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const halfDiskPath = (cx: number, cy: number, r: number, startDeg: number) => {
    const endDeg = startDeg + 180;
    const p0 = polar(cx, cy, r, startDeg);
    const p1 = polar(cx, cy, r, endDeg);

    return [
        `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
        `A ${r} ${r} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
        `L ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
        'Z',
    ].join(' ');
};

const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '').trim();
    const v =
        h.length === 3
            ? h
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : h;
    const n = parseInt(v, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b]
        .map((x) =>
            Math.round(Math.max(0, Math.min(255, x)))
                .toString(16)
                .padStart(2, '0')
        )
        .join('')}`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpColor = (aHex: string, bHex: string, t: number) => {
    const a = hexToRgb(aHex);
    const b = hexToRgb(bHex);
    return rgbToHex(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t));
};

const ramp = (stops: string[], t01: number) => {
    const n = stops.length;
    if (n === 0) return '#000000';
    if (n === 1) return stops[0];
    const x = t01 * (n - 1);
    const i = Math.min(n - 2, Math.max(0, Math.floor(x)));
    const localT = x - i;
    return lerpColor(stops[i], stops[i + 1], localT);
};

const WARM_STOPS = ['#ff1a1a', '#ff7a00', '#ffd400', '#00c853'];
const SKY_STOPS = ['#c6e9ff', '#78ccff', '#3c9adb', '#0068b7'];
const PASTEL_THEME = ['#FFA1A1', '#FFCD9E', '#FFF1A8', '#B7F0B1', '#AEE4FF', '#B5B1FF'];
const NEON_THEME = [
    '#FF0055',
    '#FF4400',
    '#FFDD00',
    '#00FF44',
    '#00DDFF',
    '#9900FF',
    '#FF00CC',
    '#FF0055',
];

export function generatePinwheelSvgPaths(
    theme: string,
    reverse: boolean = false,
    flipped: boolean = true,
    animate: boolean = true
) {
    let colors: string[] | undefined;
    if (theme === 'pastel') colors = PASTEL_THEME;
    else if (theme === 'neon') colors = NEON_THEME;

    const count = 12;
    const step = 360 / count;
    const centerX = 50,
        centerY = 50,
        r = 33,
        start = -90;
    const offset = r * 0.3;
    const localCx = centerX,
        localCy = centerY - offset;
    const innerEdgeShiftX = -10;

    const blades = Array.from({ length: count }, (_, i) => i)
        .reverse()
        .map((i) => {
            const colorIndex = count - 1 - i;
            let fill = '#000000';
            if (colors) {
                if (colors.length === count) {
                    fill = colors[colorIndex];
                } else {
                    const t = colorIndex / (count - 1);
                    fill = ramp(colors, t);
                }
            } else {
                if (colorIndex <= 7) {
                    const t = colorIndex / 7;
                    fill = ramp(WARM_STOPS, t);
                } else {
                    const t = (colorIndex - 8) / 3;
                    fill = ramp(SKY_STOPS, t);
                }
            }
            return { i, fill };
        });

    const transformStr = flipped ? 'translate(100 0) scale(-1 1)' : '';

    let pathStrs = `<g transform="${transformStr}">`;
    for (const { i, fill } of blades) {
        pathStrs += `
        <g transform="rotate(${i * step} ${centerX} ${centerY})">
            <g transform="translate(${innerEdgeShiftX} 0)">
                <path d="${halfDiskPath(localCx, localCy, r, start)}" fill="${fill}" />
            </g>
        </g>`;
    }
    pathStrs += `</g>`;

    // We can't easily animate SVG using CSS without the stylesheet applied if it's an img tag, BUT wait, GitHub allows <style> inside SVG for animations!
    return `
        <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <style>
                @keyframes pinwheel-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin-group {
                    transform-origin: 50px 50px;
                    ${animate ? `animation: pinwheel-spin 4s linear infinite ${reverse ? 'alternate' : 'normal'};` : ''}
                }
            </style>
            <!-- Wrapping animation group around the static paths -->
            <g class="spin-group" style="transform-origin: 50px 50px;">
                ${pathStrs}
            </g>
        </svg>
    `;
}
