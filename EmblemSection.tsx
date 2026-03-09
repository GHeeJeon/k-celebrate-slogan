import React from 'react';
import PinwheelSVG from './PinwheelSVG';

export interface EmblemSectionProps {
    /** The Korean character to display in the center disk (e.g. '경' or '축') */
    char: string;
    /** Whether to flip the pinwheel horizontally */
    flipped?: boolean;
    /** Whether to reverse the pinwheel rotation direction */
    reverse?: boolean;
    /** Custom colors for the pinwheel blades */
    colors?: string[];
    /** Whether to animate the pinwheel */
    animate?: boolean;
    /** Font size of the center character (CSS value, e.g. '3rem') */
    charFontSize?: string;
    /** Current scale factor for adjusting non-scalable properties */
    activeScale?: number;
}

const EmblemSection: React.FC<EmblemSectionProps> = ({
    char,
    flipped = true,
    reverse = false,
    colors,
    animate = true,
    charFontSize = '3rem',
    activeScale = 1,
}) => {
    // 소문자 g, j, p, q, y 처럼 기준선 아래로 내려가는 꼬리(Descender)가 있는지 정규식으로 판별합니다.
    // 꼬리가 있는 소문자는 위쪽 여백(Ascender 공간)이 비어보이므로 위로 살짝 올려주고,
    // 꼬리가 없는 문자(한글, 한자, 대문자 등)는 아래 하단 여백이 쏠려보이므로 아래로 내려줍니다.
    const hasDescender = /[gjpqy]/.test(char);
    const opticalCenterShift = hasDescender ? 'translateY(-0.07em)' : 'translateY(0.07em)';

    return (
        <div
            style={{
                position: 'relative',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${0.5 * activeScale}rem`,
                width: 'var(--emblem-size)',
            }}
        >
            {/* Inner Square Wrapper: enforces 1:1 aspect ratio so the circle stays perfectly round */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Swirl Pinwheel Decoration */}
                <PinwheelSVG
                    flipped={flipped}
                    reverse={reverse}
                    colors={colors}
                    animate={animate}
                />

                {/* Red Disk - Sticker Style */}
                <div
                    className="emblem-disk"
                    style={{
                        position: 'relative',
                        width: '55%',
                        height: '55%',
                        backgroundColor: '#E11D48',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        border: `${Math.max(5, 5 * activeScale)}px solid rgba(255,255,255,0.9)`,
                        // box-shadow often fails on mobile canvas (black squares).
                        // We use a multi-point text-shadow/filter drop-shadow alternative or simplify it.
                        // Here we use a standard drop-shadow filter which is more robust in modern-screenshot
                        filter: `drop-shadow(0 ${2 * activeScale}px ${1 * activeScale}px rgba(0,0,0,0.15))`,
                    }}
                >
                    {/* Main Character using Inline SVG for perfect Stroke support across all exports */}
                    <svg
                        style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'visible',
                        }}
                    >
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="central"
                            textAnchor="middle"
                            style={{
                                fill: '#FDE047',
                                stroke: 'rgb(0, 0, 0)',
                                strokeWidth: `${Math.max(3, 3 * activeScale)}px`,
                                paintOrder: 'stroke fill',
                                fontFamily: '"Nanum Myeongjo", serif',
                                fontWeight: 900,
                                fontSize: charFontSize,
                                transform: opticalCenterShift,
                                transformOrigin: 'center',
                            }}
                        >
                            {char}
                        </text>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default EmblemSection;
