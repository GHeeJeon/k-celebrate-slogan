import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { motion } from 'framer-motion';
import EmblemSection from './EmblemSection';
import type { KCelebrateSloganProps } from './types';

const GOOGLE_FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Outfit:wght@400;600&display=swap';

const computeScaleFromWidth = (containerWidth: number, baseScale: number): number => {
    if (containerWidth < 320) return baseScale * 0.28;
    if (containerWidth < 480) return baseScale * 0.38;
    if (containerWidth < 600) return baseScale * 0.5;
    if (containerWidth < 900) return baseScale * 0.75;
    return baseScale;
};

const KCelebrateSlogan: React.FC<KCelebrateSloganProps> = ({
    text1 = '축하합니다',
    text2 = '김준호',
    text3 = '아무 이유 없음',
    text1Color = '#1c89bf',
    text2Color = '#222222',
    text3Color = '#111827',
    text2StrokeColor,
    text2StrokeWidth = '2.5px',
    pinwheelColors,
    animate = true,
    scale = 1,
    emblemScale = 0.75,
    className = '',
    style,
    autoFit = true,
    loadFonts = true,
    borderColor = '#f3f4f6',
    borderWidth = '2px',
    borderRadius = '0.125rem',
    backgroundColor = '#ffffff',
    interactive = false,
    char1 = '경',
    char2 = '축',
    exportMode = false,
}) => {
    const strokeColor = text2StrokeColor || text2Color;
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScale, setAutoScale] = useState(scale);

    useEffect(() => {
        if (!loadFonts || typeof document === 'undefined') return;
        if (!document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = GOOGLE_FONTS_URL;
            document.head.appendChild(link);
        }
    }, [loadFonts]);

    useIsomorphicLayoutEffect(() => {
        if (exportMode) {
            setAutoScale(scale);
            return;
        }
        if (!autoFit) {
            setAutoScale(scale);
            return;
        }

        // Graceful fallback for SSR and environments without ResizeObserver (e.g. jsdom)
        if (typeof ResizeObserver === 'undefined') {
            const fallbackWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
            setAutoScale(computeScaleFromWidth(fallbackWidth, scale));
            return;
        }

        const observer = new ResizeObserver((entries) => {
            setAutoScale(computeScaleFromWidth(entries[0].contentRect.width, scale));
        });

        if (containerRef.current) {
            setAutoScale(computeScaleFromWidth(containerRef.current.offsetWidth, scale));
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [scale, autoFit, exportMode]);

    const activeScale = exportMode ? scale : autoScale;
    const parsedStroke = parseFloat(text2StrokeWidth.replace(/[^0-9.]/g, ''));
    const numericStroke = isNaN(parsedStroke) ? 3 : parsedStroke;

    // Minimum width based on text2 length to prevent layout breakage on narrow containers.
    // Formula: fixed overhead (emblems + gaps + padding) ~8rem + ~1.4rem per character, scaled by user scale.
    const minContentWidth = `${(Math.max(12, 8 + text2.length * 1.4) * scale).toFixed(1)}rem`;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: 'fit-content',
                maxWidth: '100%',
                minWidth: minContentWidth,
                display: 'inline-block',
                ...style,
            }}
        >
            <motion.div
                initial={animate ? { y: -50, opacity: 0 } : { y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: exportMode || !animate ? 0 : 0.5 }}
                style={{
                    position: 'relative',
                    zIndex: 20,
                    pointerEvents: interactive ? 'auto' : 'none',
                    width: '100%',
                    transformOrigin: 'center',
                }}
            >
                <style>
                    {`
                    @font-face {
                        font-family: 'JoseonPalace';
                        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff') format('woff');
                        font-weight: normal;
                        font-display: ${exportMode ? 'block' : 'swap'};
                    }

                    .k-celebrate-slogan-container {
                        -webkit-text-size-adjust: none;
                        text-size-adjust: none;
                        --active-scale: ${activeScale};
                        --emblem-size: calc(13rem * ${emblemScale} * var(--active-scale));
                        --char-size: calc(var(--emblem-size) * 0.3);
                        --fs-1: calc(3rem * var(--active-scale));
                        --fs-2: calc(3.75rem * var(--active-scale));
                        --fs-3: calc(1.25rem * var(--active-scale));

                        --text1-color: ${text1Color};
                        --text2-color: ${text2Color};
                        --text3-color: ${text3Color};
                        --stroke-color: ${strokeColor};
                        --stroke-width: ${numericStroke === 0 ? 0 : Math.max(0.6, numericStroke * activeScale)}px;

                        --main-gap: calc(1.5rem * var(--active-scale));
                        --padding-tb: calc(0.5rem * var(--active-scale));
                        --padding-lr: calc(2rem * var(--active-scale));
                    }

                    .text1-style {
                        letter-spacing: 0.35em;
                        line-height: 1.25;
                        text-align: center;
                        font-size: var(--fs-1);
                        color: var(--text1-color);
                        font-family: "Nanum Myeongjo", serif;
                        font-weight: 900;
                        text-shadow: ${Math.max(0.3, 0.5 * activeScale)}px ${Math.max(0.3, 0.5 * activeScale)}px 0px rgba(0,0,0,0.1);
                        display: inline-block;
                        transform: scaleX(1.2);
                        white-space: nowrap;
                    }

                    .text2-style {
                        margin: 0;
                        width: 100%;
                        overflow: visible;
                        white-space: nowrap;
                        text-rendering: optimizeLegibility;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }

                    .text3-style {
                        letter-spacing: 0.4em;
                        text-transform: uppercase;
                        text-align: center;
                        font-size: var(--fs-3);
                        color: var(--text3-color);
                        font-family: 'Outfit', sans-serif;
                        font-weight: 600;
                        white-space: nowrap;
                    }

                    @keyframes pinwheel-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .k-pinwheel-animated {
                        animation: pinwheel-spin 4s linear infinite !important;
                    }
                    .k-pinwheel-animated-reverse {
                        animation: pinwheel-spin 4s linear infinite reverse !important;
                    }
                    `}
                </style>

                <div className="k-celebrate-slogan-container" style={{ width: '100%' }}>
                    <div
                        style={{
                            position: 'relative',
                            backgroundColor,
                            border: `${borderWidth} solid ${borderColor}`,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                            gap: 'var(--main-gap)',
                            boxShadow: exportMode
                                ? 'none'
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            userSelect: 'none',
                            borderRadius,
                            minHeight: 'calc(140px * var(--active-scale))',
                            width: '100%',
                        }}
                    >
                        <EmblemSection
                            char={char1}
                            flipped={false}
                            reverse
                            colors={pinwheelColors}
                            animate={animate}
                            charFontSize="var(--char-size)"
                            activeScale={activeScale}
                        />

                        <div
                            style={{
                                flex: '1 1 0%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                minWidth: 'max-content',
                                paddingTop: 'calc(0.5rem * var(--active-scale))',
                                paddingBottom: 'calc(0.5rem * var(--active-scale))',
                                gap: 'calc(0.5rem * var(--active-scale))',
                            }}
                        >
                            <div
                                style={{ padding: `0 calc(var(--fs-1) * 0.14 * ${text1.length})` }}
                            >
                                <span className="text1-style">{text1}</span>
                            </div>

                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        visibility: 'hidden',
                                        fontFamily:
                                            "'JoseonPalace', '궁서', '궁서체', 'Gungsuh', serif",
                                        fontSize: 'var(--fs-2)',
                                        fontWeight: 400,
                                        letterSpacing: '0.3em',
                                        whiteSpace: 'nowrap',
                                        lineHeight: 1,
                                        padding: '0 0.1em', // Buffer for stroke
                                    }}
                                >
                                    {text2}
                                </span>
                                <svg
                                    className="text2-style"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '100%',
                                        height: '100%',
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))',
                                    }}
                                >
                                    <text
                                        x="50%"
                                        y="50%"
                                        dominantBaseline="central"
                                        textAnchor="middle"
                                        style={{
                                            fill: 'var(--text2-color)',
                                            stroke: 'var(--stroke-color)',
                                            strokeWidth: 'var(--stroke-width)',
                                            paintOrder: 'stroke fill',
                                            fontFamily:
                                                "'JoseonPalace', '궁서', '궁서체', 'Gungsuh', serif",
                                            fontSize: 'var(--fs-2)',
                                            fontWeight: 400,
                                            letterSpacing: '0.3em',
                                        }}
                                    >
                                        {text2}
                                    </text>
                                </svg>
                            </div>

                            <span className="text3-style">ㅡ {text3} ㅡ</span>
                        </div>

                        <EmblemSection
                            char={char2}
                            colors={pinwheelColors}
                            animate={animate}
                            charFontSize="var(--char-size)"
                            activeScale={activeScale}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default KCelebrateSlogan;
