import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EmblemSection from './EmblemSection';
import type { KCelebrateSloganProps } from './types';

// ─── KCelebrateSlogan ────────────────────────────────────────────────────────
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
    exportMode = false,
}) => {
    const strokeColor = text2StrokeColor || text2Color;

    // ── Mobile auto-scale ──────────────────────────────────────────────────────
    // Automatically shrinks the slogan on narrow screens.
    // The user-provided `scale` prop takes priority on wide screens.
    const [autoScale, setAutoScale] = useState(scale);

    useEffect(() => {
        const computeScale = () => {
            const vw = window.innerWidth;
            if (vw < 480) setAutoScale(scale * 0.28);
            else if (vw < 640) setAutoScale(scale * 0.38);
            else if (vw < 768) setAutoScale(scale * 0.5);
            else if (vw < 1024) setAutoScale(scale * 0.75);
            else setAutoScale(scale);
        };
        computeScale();
        window.addEventListener('resize', computeScale);
        return () => window.removeEventListener('resize', computeScale);
    }, [scale]);

    const activeScale = exportMode ? scale : autoScale;
    const numericStroke = parseFloat(text2StrokeWidth.replace(/[^0-9.]/g, '')) || 3;

    return (
        <motion.div
            initial={animate ? { y: -50, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: exportMode || !animate ? 0 : 0.5 }}
            className={className}
            style={{
                position: 'relative',
                zIndex: 20,
                pointerEvents: 'none',
                width: 'fit-content',
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
                  --stroke-width: ${Math.max(0.6, numericStroke * activeScale)}px;
                  
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
                    line-height: 1.25;
                    text-align: center;
                    font-size: var(--fs-2);
                    color: var(--text2-color);
                    fill: var(--text2-color); /* Explicit fill for SVG/CSS stroke properties */
                    font-weight: 400;
                    
                    /* Main stroke logic for both preview and export */
                    -webkit-text-stroke: var(--stroke-width) var(--stroke-color);
                    
                    /* Standard SVG/CSS properties for browsers that support paint-order (prevents eating into text) */
                    stroke: var(--stroke-color);
                    stroke-width: var(--stroke-width);
                    fill: var(--text2-color);
                    paint-order: stroke fill;
                    
                    white-space: nowrap;
                    letter-spacing: 0.3em;
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
                        backgroundColor: '#ffffff',
                        border: '2px solid #f3f4f6',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'space-between',
                        gap: 'var(--main-gap)',
                        boxShadow: exportMode
                            ? 'none'
                            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        userSelect: 'none',
                        borderRadius: '0.125rem',
                        minHeight: 'calc(140px * var(--active-scale))',
                        width: '100%',
                    }}
                >
                    <EmblemSection
                        char="경"
                        flipped={false}
                        reverse
                        colors={pinwheelColors}
                        animate={animate}
                        charFontSize="var(--char-size)"
                        activeScale={activeScale}
                    />

                    {/* Main Text Area:
                        minWidth: max-content ensures this column is always AT LEAST
                        as wide as the longest text line. Since the outer div is
                        width: fit-content, the whole card stretches automatically. */}
                    <div
                        style={{
                            flex: '1 1 0%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            paddingTop: 'var(--padding-tb)',
                            paddingBottom: 'var(--padding-tb)',
                            paddingLeft: 'var(--padding-lr)',
                            paddingRight: 'var(--padding-lr)',
                            minWidth: 'max-content',
                        }}
                    >
                        <span className="text1-style">{text1}</span>
                        <h1 className="text2-style">{text2}</h1>
                        <span className="text3-style">ㅡ {text3} ㅡ</span>
                    </div>

                    <EmblemSection
                        char="축"
                        colors={pinwheelColors}
                        animate={animate}
                        charFontSize="var(--char-size)"
                        activeScale={activeScale}
                    />

                    {/* Texture Overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            opacity: 0.04,
                            pointerEvents: 'none',
                            mixBlendMode: 'multiply',
                            borderRadius: '0.125rem',
                            backgroundImage:
                                'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default KCelebrateSlogan;
