import React from 'react';
import type { CSSProperties } from 'react';
import type { KCelebrateSloganProps } from '../types';

interface CoachellaLayoutProps extends KCelebrateSloganProps {
    activeScale: number;
}

const NUM_LAYERS = 5;
const TEXT1_BOTTOM_BRIGHT_HOLD = '75%';
const TEXT2_TOP_BRIGHT_HOLD = '65%';
const CARD_BACKGROUND_COLOR = '#160505';
const CARD_SHADOW = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
const TEXT_FACE_GOLD = '#E8B55D';
const TEXT_FACE_STRIPE = '#EA9527';
const TEXT_FACE_DARK = '#5A2000';
const DEPTH_TEXT_COLOR = '#EFE7D5';
const TEXT_STROKE_COLOR = '#FFFFF8';
const TEXT_GLITTER_OPACITY = 0.9;
const TEXT_GLITTER_TEXTURE_URL = "url('/textures/text_texture_optimized.webp')";
const BACKGROUND_BOKEH_TEXTURE_URL = "url('/textures/background_texture_optimized.webp')";
const FACE_STRIPE_TEXTURE = `repeating-linear-gradient(90deg,
    ${TEXT_FACE_GOLD} 0px, ${TEXT_FACE_GOLD} 1px,
    ${TEXT_FACE_STRIPE} 1px, ${TEXT_FACE_STRIPE} 2px)`;
const TEXT_LINE_STYLE: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 20,
};
const CHARACTER_WRAPPER_STYLE: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
};
const SPACE_STYLE: CSSProperties = {
    display: 'inline-block',
    width: '0.25em',
};

const getSeededValue = (seed: number, min: number, max: number): number => {
    const raw = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    const normalized = raw - Math.floor(raw);
    return min + normalized * (max - min);
};

const buildFaceGradient = (isText1: boolean): string =>
    isText1
        ? `linear-gradient(to bottom, ${TEXT_FACE_DARK} 0%, ${TEXT_FACE_GOLD} ${TEXT1_BOTTOM_BRIGHT_HOLD}, ${TEXT_FACE_GOLD} 100%)`
        : `linear-gradient(to bottom, ${TEXT_FACE_GOLD} 0%, ${TEXT_FACE_GOLD} ${TEXT2_TOP_BRIGHT_HOLD}, ${TEXT_FACE_DARK} 100%)`;

const buildTextFaceStyle = (isText1: boolean, strokeWidth: string): CSSProperties => ({
    position: 'relative',
    zIndex: NUM_LAYERS + 1,
    display: 'inline-block',
    backgroundImage: [FACE_STRIPE_TEXTURE, buildFaceGradient(isText1)].join(', '),
    backgroundBlendMode: 'soft-light, normal',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    WebkitTextStroke: `${strokeWidth} ${TEXT_STROKE_COLOR}`,
});

const buildDepthTextureStyle = (charIndex: number, activeScale: number): CSSProperties => {
    const seedBase = charIndex * 19 + NUM_LAYERS * 23 + 101;
    const textureWidth = Math.round(
        Math.max(156, 210 * activeScale + getSeededValue(seedBase + 1, -12, 14))
    );
    const textureOffsetX = Math.round(getSeededValue(seedBase + 2, 0, textureWidth - 1));
    const textureOffsetY = Math.round(getSeededValue(seedBase + 3, 0, textureWidth * 1.25));

    return {
        backgroundImage: [
            TEXT_GLITTER_TEXTURE_URL,
            `linear-gradient(to bottom, ${DEPTH_TEXT_COLOR} 0%, #FFF6E9 100%)`,
        ].join(', '),
        backgroundSize: [`${textureWidth}px auto`, '100% 100%'].join(', '),
        backgroundPosition: [`${textureOffsetX}px ${textureOffsetY}px`, '0 0'].join(', '),
        backgroundRepeat: 'repeat, no-repeat',
        backgroundBlendMode: 'screen, normal',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        opacity: 1,
        filter: 'brightness(1.02) contrast(1.08) saturate(0.96)',
    };
};

const buildTextGlitterStyle = (
    isText1: boolean,
    charIndex: number,
    activeScale: number,
    exportMode?: boolean
): CSSProperties => {
    const seedBase = charIndex * 17 + (isText1 ? 11 : 29);
    const textureWidth = Math.round(
        Math.max(168, 235 * activeScale + getSeededValue(seedBase + 1, -16, 18))
    );
    const textureOffsetX = Math.round(getSeededValue(seedBase + 2, 0, textureWidth - 1));
    const textureOffsetY = Math.round(getSeededValue(seedBase + 3, 0, textureWidth * 1.35));
    const twinkleDuration = getSeededValue(seedBase + 4, 3.8, 6.4).toFixed(2);
    const twinkleDelay = `-${getSeededValue(seedBase + 5, 0.4, 4.2).toFixed(2)}s`;
    const highlightMask = isText1
        ? 'linear-gradient(to bottom, rgba(255,255,255,0.01) 0%, rgba(255,242,191,0.12) 36%, rgba(255,249,225,0.34) 100%)'
        : 'linear-gradient(to bottom, rgba(255,249,225,0.36) 0%, rgba(255,242,191,0.14) 42%, rgba(255,255,255,0.01) 100%)';

    return {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: NUM_LAYERS + 2,
        display: 'inline-block',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: TEXT_GLITTER_OPACITY,
        backgroundImage: [highlightMask, TEXT_GLITTER_TEXTURE_URL].join(', '),
        backgroundSize: [`100% 100%`, `${textureWidth}px auto`].join(', '),
        backgroundPosition: ['0 0', `${textureOffsetX}px ${textureOffsetY}px`].join(', '),
        backgroundRepeat: 'no-repeat, repeat',
        backgroundBlendMode: 'screen, normal',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        mixBlendMode: 'screen',
        filter: 'brightness(1.04) contrast(1.34) saturate(1.18)',
        animation: exportMode
            ? undefined
            : `coachella-text-glitter-twinkle ${twinkleDuration}s ease-in-out infinite`,
        animationDelay: exportMode ? undefined : twinkleDelay,
    };
};

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
    const strokeWidth = `${Math.max(0.5, 0.7 * activeScale).toFixed(1)}px`;

    const renderLine = (text: string, isText1: boolean) => {
        const chars = Array.from(text);
        const charCount = chars.length;

        return (
            <div className="coachella-text" style={TEXT_LINE_STYLE}>
                {chars.map((char, charIndex) => {
                    if (char === ' ') {
                        return <span key={`space-${charIndex}`} style={SPACE_STYLE} />;
                    }

                    const relativeX =
                        charCount <= 1
                            ? 0
                            : (charIndex - (charCount - 1) / 2) / ((charCount - 1) / 2);
                    const shadowOffsetX = -relativeX * 0.012 * NUM_LAYERS;
                    const shadowOffsetY = 0;
                    const shadowRefract =
                        NUM_LAYERS > 2.5 ? (NUM_LAYERS - 2.5) * 0.004 * -relativeX : 0;

                    return (
                        <span key={`${char}-${charIndex}`} style={CHARACTER_WRAPPER_STYLE}>
                            <span
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 1,
                                    transform: `translate(${(shadowOffsetX + shadowRefract).toFixed(4)}em, ${shadowOffsetY.toFixed(4)}em)`,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                    ...buildDepthTextureStyle(
                                        isText1,
                                        charIndex,
                                        activeScale,
                                        strokeWidth
                                    ),
                                }}
                            >
                                {char}
                            </span>

                            <span
                                className="coachella-text-face"
                                style={buildTextFaceStyle(isText1, strokeWidth)}
                            >
                                {char}
                            </span>
                            <span
                                aria-hidden="true"
                                className="coachella-text-glitter"
                                style={buildTextGlitterStyle(
                                    isText1,
                                    charIndex,
                                    activeScale,
                                    exportMode
                                )}
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
                @keyframes coachella-text-glitter-twinkle {
                    0%, 100% {
                        opacity: 0.54;
                        filter: brightness(1.02) contrast(1.2) saturate(1.08);
                    }
                    45% {
                        opacity: 0.74;
                        filter: brightness(1.1) contrast(1.42) saturate(1.2);
                    }
                    70% {
                        opacity: 0.62;
                        filter: brightness(1.06) contrast(1.3) saturate(1.14);
                    }
                }
            `}</style>

            <div className="coachella-container" style={{ width: '100%' }}>
                <div
                    style={{
                        position: 'relative',
                        backgroundColor: CARD_BACKGROUND_COLOR,
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        boxShadow: exportMode ? 'none' : CARD_SHADOW,
                        userSelect: 'none',
                        borderRadius,
                        width: '100%',
                        overflow: 'hidden',
                        isolation: 'isolate',
                    }}
                >
                    <div
                        aria-hidden="true"
                        className="coachella-background-bokeh"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 1,
                            pointerEvents: 'none',
                            borderRadius,
                            backgroundImage: BACKGROUND_BOKEH_TEXTURE_URL,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                            opacity: 0.9,
                            filter: 'brightness(0.94) contrast(1.02) saturate(0.94)',
                        }}
                    />
                    {renderLine(text1, true)}
                    {renderLine(text2, false)}

                    <div
                        aria-hidden="true"
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

            {!exportMode && (
                <div style={{ marginTop: '24px', width: '100%' }}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        비네트 범위 확인용 (미리보기 전용)
                    </p>
                    <div
                        style={{
                            width: '100%',
                            height: '250px',
                            backgroundColor: '#fff',
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
