import React from 'react';
import type { KCelebrateSloganProps } from '../types';

interface CoachellaLayoutProps extends KCelebrateSloganProps {
    activeScale: number;
}

const NUM_LAYERS = 5;
const TEXT1_BOTTOM_BRIGHT_HOLD = '75%';
const TEXT2_TOP_BRIGHT_HOLD = '65%';

// Precomputed per-layer props (d=1: shallowest extrusion, d=NUM_LAYERS: deepest)
const DEPTH_LAYERS = Array.from({ length: NUM_LAYERS }, (_, i) => {
    const d = i + 1;
    const t = d / NUM_LAYERS; // 0 → 1 (front → back)
    return {
        d,
        // Color: match the current gold face color uniformly through the depth layers.
        r: 232,
        g: 181,
        b: 93,
        opacity: 1,
        // No blur so all layers look identical and crisp
        blur: 0,
        // z-index: deepest = lowest (1), shallowest back layer = highest (NUM_LAYERS)
        zIndex: NUM_LAYERS - d + 1,
    };
});

const CoachellaLayout: React.FC<CoachellaLayoutProps> = ({
    text1 = '안녕하세요',
    text2 = '대성입니다',
    text1Color: _text1Color,
    text2Color: _text2Color,
    backgroundColor: _backgroundColor,
    borderColor: _borderColor,
    borderWidth: _borderWidth,
    borderRadius,
    activeScale,
    exportMode,
}) => {
    // Edge stroke scales with activeScale but never renders below 0.5px
    const strokeWidth = `${Math.max(0.5, 0.7 * activeScale).toFixed(1)}px`;

    const renderLine = (text: string, isText1: boolean) => {
        const chars = text.split('');
        const n = chars.length;

        return (
            <div
                className="coachella-text"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {chars.map((char, ci) => {
                    if (char === ' ') {
                        return (
                            <span key={ci} style={{ display: 'inline-block', width: '0.25em' }} />
                        );
                    }

                    // Normalised horizontal position within this line: -1 (left) → 0 (center) → +1 (right)
                    // Used to compute the radial extrusion direction for each character.
                    const relX = n <= 1 ? 0 : (ci - (n - 1) / 2) / ((n - 1) / 2);

                    return (
                        <span key={ci} style={{ position: 'relative', display: 'inline-block' }}>
                            {/* ── Depth layers ── painted deepest first (lowest DOM order, lowest z-index) */}
                            {[...DEPTH_LAYERS]
                                .reverse()
                                .map(({ d, r, g, b, opacity, blur, zIndex }) => {
                                    // Horizontal: radiates outward from line center, proportional to depth
                                    const offsetX = -relX * 0.012 * d;
                                    // Vertical: text1 extrudes down-and-out; text2 has no vertical extrusion
                                    const offsetY = isText1 ? 0.01 * d : 0;
                                    // Fake refraction: the deepest half of layers shift extra horizontally,
                                    // simulating light bending as it passes through the acrylic thickness.
                                    const refract =
                                        d > NUM_LAYERS / 2
                                            ? (d - NUM_LAYERS / 2) * 0.004 * -relX
                                            : 0;

                                    // Use uniform bright color for all depth layers
                                    const finalR = r;
                                    const finalG = g;
                                    const finalB = b;

                                    const isDeepest = d === NUM_LAYERS;
                                    const strokeStyle = isDeepest
                                        ? {
                                              WebkitTextStroke: `${strokeWidth} rgba(255, 248, 168, 0.88)`,
                                          }
                                        : {};

                                    return (
                                        <span
                                            key={d}
                                            aria-hidden="true"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex,
                                                transform: `translate(${(offsetX + refract).toFixed(4)}em, ${offsetY.toFixed(4)}em)`,
                                                color: '#EFE7D5',
                                                filter: blur > 0 ? `blur(${blur}px)` : undefined,
                                                pointerEvents: 'none',
                                                userSelect: 'none',
                                                ...strokeStyle,
                                            }}
                                        >
                                            {char}
                                        </span>
                                    );
                                })}

                            {/* ── Front face ── stripe texture + semi-transparent gold gradient, clipped to text */}
                            <span
                                style={{
                                    position: 'relative',
                                    zIndex: NUM_LAYERS + 1,
                                    display: 'inline-block',
                                    // Vertical stripe texture alternating between #E8B55D and #EA9527
                                    backgroundImage: [
                                        `repeating-linear-gradient(90deg,
                                            #E8B55D 0px, #E8B55D 1px,
                                            #EA9527 1px, #EA9527 2px)`,
                                        isText1
                                            ? `linear-gradient(to bottom, #5A2000 0%, #E8B55D ${TEXT1_BOTTOM_BRIGHT_HOLD}, #E8B55D 100%)`
                                            : `linear-gradient(to bottom, #E8B55D 0%, #E8B55D ${TEXT2_TOP_BRIGHT_HOLD}, #5A2000 100%)`,
                                    ].join(', '),
                                    backgroundBlendMode: 'soft-light, normal',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    WebkitTextFillColor: 'transparent',
                                    WebkitTextStroke: `${strokeWidth} rgba(255, 248, 168, 0.88)`,
                                }}
                            >
                                {char}
                            </span>
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <style>{`
                @font-face {
                    font-family: 'Yangjin';
                    src: url('https://cdn.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff') format('woff');
                    font-weight: normal;
                    font-display: ${exportMode ? 'block' : 'swap'};
                }
                .coachella-container {
                    -webkit-text-size-adjust: none;
                    text-size-adjust: none;
                    --active-scale: ${activeScale};
                    --fs-main: calc(6.5rem * var(--active-scale));
                }
                .coachella-text {
                    font-family: 'Yangjin', sans-serif;
                    font-size: var(--fs-main);
                    line-height: 1.35;
                    letter-spacing: -0.02em;
                    white-space: nowrap;
                    text-align: center;
                    margin-top: -0.25em;
                }
            `}</style>

            <div className="coachella-container" style={{ width: '100%' }}>
                <div
                    style={{
                        position: 'relative',
                        backgroundColor: '#160505',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        boxShadow: exportMode
                            ? 'none'
                            : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        userSelect: 'none',
                        borderRadius,
                        width: '100%',
                    }}
                >
                    {renderLine(text1, true)}
                    {renderLine(text2, false)}

                    {/* Vignette overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            background:
                                'radial-gradient(50% 75% at center, rgba(255,255,255,0) 40%, rgba(218, 117, 67, 0.3) 60%, rgba(120, 38, 38, 0.3) 120%)',
                            mixBlendMode: 'multiply',
                            borderRadius,
                            zIndex: 100,
                        }}
                    />
                </div>
            </div>

            {/* Debug: Vignette Range Visualizer */}
            {!exportMode && (
                <div style={{ marginTop: '24px', width: '100%' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        비네트 범위 확인용 (미리보기 전용)
                    </p>
                    <div
                        style={{
                            width: '100%',
                            height: '250px', // Approximate height of the main banner
                            backgroundColor: '#fff', // White background to clearly see the multiply gradient
                            position: 'relative',
                            borderRadius,
                            border: '1px dashed #ccc',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                background:
                                    'radial-gradient(50% 75% at center, rgba(255,255,255,0) 40%, rgba(218, 132, 67, 0.3) 60%, rgba(120, 47, 38, 0.3) 120%)',
                                mixBlendMode: 'multiply',
                                borderRadius,
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CoachellaLayout;
