import React, { useMemo } from 'react';

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
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(v, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b]
        .map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0'))
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

// Default logic constants
const WARM_STOPS = ['#ff1a1a', '#ff7a00', '#ffd400', '#00c853'];
const SKY_STOPS = ['#c6e9ff', '#78ccff', '#3c9adb', '#0068b7'];

type PinwheelProps = {
    reverse?: boolean;
    flipped?: boolean;
    className?: string;
    colors?: string[];
    animate?: boolean;
};

const PinwheelSVG: React.FC<PinwheelProps> = ({
    reverse,
    flipped = true,
    className,
    colors,
    animate = true
}) => {
    const centerX = 50;
    const centerY = 50;

    const r = 33;

    const count = 12;
    const step = 360 / count;

    const start = -90;

    const offset = r * 0.3;
    const localCx = centerX;
    const localCy = centerY - offset;

    const innerEdgeShiftX = -10;

    // Generate colors for the 12 blades
    const blades = useMemo(() => {
        return Array.from({ length: count }, (_, i) => i)
            .reverse() // Keep the last blade (often blue in default) on top
            .map((i) => {
                const colorIndex = count - 1 - i;
                let fill = '#000000';

                if (colors) {
                    if (colors.length === count) {
                        // Exact mapping
                        fill = colors[colorIndex];
                    } else {
                        // Interpolate across the custom colors
                        const t = colorIndex / (count - 1);
                        fill = ramp(colors, t);
                    }
                } else {
                    // Default logic
                    if (colorIndex <= 7) {
                        // 8 blades: 0..7
                        const t = colorIndex / 7;
                        fill = ramp(WARM_STOPS, t);
                    } else {
                        // 4 blades: 8..11
                        const t = (colorIndex - 8) / 3;
                        fill = ramp(SKY_STOPS, t);
                    }
                }

                return { i, fill };
            });
    }, [colors]);

    return (
        <div
            className={className ?? 'absolute inset-0 w-full h-full'}
            style={{
                animation: animate ? `pinwheel-spin 4s linear infinite ${reverse ? 'reverse' : ''}` : 'none'
            }}
        >
            <style>
                {`
                @keyframes pinwheel-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <g transform={flipped ? "translate(100 0) scale(-1 1)" : ""}>
                    {blades.map(({ i, fill }) => (
                        <g key={i} transform={`rotate(${i * step} ${centerX} ${centerY})`}>
                            <g transform={`translate(${innerEdgeShiftX} 0)`}>
                                <path d={halfDiskPath(localCx, localCy, r, start)} fill={fill} />
                            </g>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default PinwheelSVG;
