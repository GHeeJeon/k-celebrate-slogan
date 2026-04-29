import React from 'react';
import type { KCelebrateSloganProps } from '../types';

interface CoachellaLayoutProps extends KCelebrateSloganProps {
    activeScale: number;
}

const CoachellaLayout: React.FC<CoachellaLayoutProps> = ({
    text1 = '안녕하세요',
    text2 = '대성입니다',
    text1Color = '#ffeaa7', // Default to a light gold
    text2Color = '#ffeaa7',
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    activeScale,
    exportMode,
}) => {
    const renderText = (text: string) => {
        return (
            <div
                className="coachella-text"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {text}
            </div>
        );
    };

    return (
        <>
            <style>
                {`
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
                    background-color: transparent;

                    /* Metallic Gradient & Stripe Texture */
                    color: transparent;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    -webkit-background-clip: text;
                    
                    background-image: 
                        repeating-linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0.15) 0px,
                            rgba(255, 255, 255, 0.15) 1px,
                            rgba(0, 0, 0, 0.15) 1px,
                            rgba(0, 0, 0, 0.15) 2px
                        ),
                        linear-gradient(#F1B872, #F1B872);
                    background-blend-mode: soft-light, normal;
                }
                `}
            </style>

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
                            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        userSelect: 'none',
                        borderRadius,
                        width: '100%',
                    }}
                >
                    {renderText(text1)}
                    {renderText(text2)}

                    {/* Container-sized Radial Gradient Overlay for Vignette Effect */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            background:
                                'radial-gradient(ellipse at center, rgba(255,255,255,0) 30%, rgba(138, 60, 0, 0.5) 80%, rgba(90, 33, 0, 0.9) 100%)',
                            mixBlendMode: 'multiply',
                            borderRadius,
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default CoachellaLayout;
