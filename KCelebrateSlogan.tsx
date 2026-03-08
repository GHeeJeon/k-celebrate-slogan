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
            if (vw < 480) setAutoScale(scale * 0.45);
            else if (vw < 640) setAutoScale(scale * 0.55);
            else if (vw < 768) setAutoScale(scale * 0.7);
            else if (vw < 1024) setAutoScale(scale * 0.85);
            else setAutoScale(scale);
        };
        computeScale();
        window.addEventListener('resize', computeScale);
        return () => window.removeEventListener('resize', computeScale);
    }, [scale]);

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
                scale: exportMode ? scale : autoScale,
            }}
        >
            <style>
                {`
                @font-face {
                    font-family: 'JoseonPalace';
                    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff') format('woff');
                    font-weight: normal;
                    font-display: swap;
                }

                .k-celebrate-slogan-container {
                  /* Emblem column width, taking emblemScale prop into account */
                  --emblem-size: calc(13rem * ${emblemScale});
                  /* Char size tracks emblem: about 35% of emblem width */
                  --char-size: calc(var(--emblem-size) * 0.35);
                  /* Text font sizes */
                  --fs-1: 3rem;
                  --fs-2: 3.75rem;
                  --fs-3: 1.25rem;
                }
                `}
            </style>

            {/* Inner container */}
            <div className="k-celebrate-slogan-container" style={{ width: '100%' }}>
                {/* Main Wrapper: properties mapped from tailwind classes */}
                <div
                    style={{
                        position: 'relative',
                        backgroundColor: '#ffffff',
                        border: '2px solid #f3f4f6',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        boxShadow:
                            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        userSelect: 'none',
                        borderRadius: '0.125rem',
                        minHeight: '140px',
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
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            paddingLeft: '2rem',
                            paddingRight: '2rem',
                            minWidth: 'max-content',
                        }}
                    >
                        <span
                            style={{
                                letterSpacing: '0.35em',
                                lineHeight: 1.25,
                                textAlign: 'center',
                                fontSize: 'var(--fs-1)',
                                color: text1Color,
                                fontFamily: '"Nanum Myeongjo", serif',
                                fontWeight: 900,
                                textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)',
                                display: 'inline-block',
                                transform: 'scaleX(1.2)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {text1}
                        </span>

                        <h1
                            style={{
                                margin: 0,
                                lineHeight: 1.25,
                                textAlign: 'center',
                                fontSize: 'var(--fs-2)',
                                color: text2Color,
                                fontFamily: "'JoseonPalace', '궁서', '궁서체', 'Gungsuh', serif",
                                fontWeight: 300,
                                WebkitTextStroke: `${text2StrokeWidth} ${strokeColor}`,
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.3em',
                            }}
                        >
                            {text2}
                        </h1>

                        <span
                            style={{
                                letterSpacing: '0.4em',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                fontSize: 'var(--fs-3)',
                                color: text3Color,
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            ㅡ {text3} ㅡ
                        </span>
                    </div>

                    <EmblemSection
                        char="축"
                        colors={pinwheelColors}
                        animate={animate}
                        charFontSize="var(--char-size)"
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
