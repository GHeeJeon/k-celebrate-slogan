import React from 'react';
import { motion } from 'framer-motion';
import PinwheelSVG from './PinwheelSVG';

interface KCelebrateSloganProps {
    /**
     * Top small text
     * @default "축하합니다"
     */
    text1?: string;
    /**
     * Main large text
     * @default "김준호"
     */
    text2?: string;
    /**
     * Bottom tagline
     * @default "아무 이유 없음"
     */
    text3?: string;

    /**
     * Color for text1
     * @default "#1c89bf"
     */
    text1Color?: string;
    /**
     * Color for text2
     * @default "#222222"
     */
    text2Color?: string;
    /**
     * Color for text3
     * @default "#111827" (gray-900)
     */
    text3Color?: string;

    /**
     * Stroke/Border color for text2 (Main Text)
     * @default matches text2Color
     */
    text2StrokeColor?: string;

    /**
     * Stroke/Border width for text2 (Main Text)
     * @default "2.5px"
     */
    text2StrokeWidth?: string;

    /**
     * Custom colors for the pinwheel blades.
     * Can be a list of stops (interpolated) or exactly 12 colors.
     */
    pinwheelColors?: string[];

    /**
     * Whether to enable animations (entrance and spin)
     * @default true
     */
    animate?: boolean;

    /**
     * Scale factor to resize the entire component.
     * Useful because the component uses fixed pixel/rem sizes internally.
     * @default 1
     */
    scale?: number;

    /**
     * Additional CSS classes for the container.
     */
    className?: string;
}

const KCelebrateSlogan: React.FC<KCelebrateSloganProps> = ({
    text1 = "축하합니다",
    text2 = "김준호",
    text3 = "아무 이유 없음",
    text1Color = "#1c89bf",
    text2Color = "#222222",
    text3Color = "#111827",
    text2StrokeColor,
    text2StrokeWidth = "2.5px",
    pinwheelColors,
    animate = true,
    scale = 1,
    className = ""
}) => {
    const strokeColor = text2StrokeColor || text2Color;

    return (
        <motion.div
            initial={animate ? { y: -50, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative z-20 pointer-events-none ${className}`}
            style={{
                width: 'fit-content',
                minWidth: '600px',
                margin: '1rem auto',
                transformOrigin: 'center',
                scale: scale,
                rotate: -0.5
            }}
        >
            <div className="relative bg-white border-2 border-gray-100 py-6 px-32 flex flex-col items-center justify-center shadow-lg select-none overflow-hidden rounded-sm h-full">

                {/* Left Emblem */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-28 h-28 flex items-center justify-center">
                    {/* Swirl Pinwheel Decoration */}
                    <PinwheelSVG flipped={false} reverse colors={pinwheelColors} animate={animate} />

                    {/* Red Disk - Sticker Style */}
                    <div
                        className="relative w-[55%] h-[55%] bg-[#E11D48] rounded-full flex items-center justify-center z-10"
                        style={{
                            border: '3px solid rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 0 rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.08)',
                        }}
                    >
                        <span
                            className="text-4xl font-black text-[#FDE047] leading-none"
                            style={{
                                fontFamily: '"Nanum Myeongjo", serif',
                                fontWeight: 900,
                                textShadow: '-1.0px -1.0px 0 #000, 1.0px -1.0px 0 #000, -1.0px 1.0px 0 #000, 1.0px 1.0px 0 #000',
                                transform: 'translateY(1.5px)'
                            }}
                        >
                            경
                        </span>
                    </div>
                </div>

                {/* Main Text Area */}
                <div className="flex flex-col items-center z-10">
                    <span
                        className="text-5xl font-black tracking-[0.35em] leading-none mb-2"
                        style={{
                            color: text1Color,
                            fontFamily: '"Nanum Myeongjo", serif',
                            fontWeight: 900,
                            textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)',
                            display: 'inline-block',
                            transform: 'scaleX(1.2)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {text1}
                    </span>

                    <h1
                        className="text-6xl font-black my-1 leading-none tracking-tight"
                        style={{
                            color: text2Color,
                            fontFamily: '"궁서", "궁서체", "Gungsuh", serif',
                            fontWeight: 900,
                            WebkitTextStroke: `${text2StrokeWidth} ${strokeColor}`,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {text2}
                    </h1>

                    <span
                        className="text-xl font-normal tracking-[0.4em] mt-3 uppercase"
                        style={{
                            color: text3Color,
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        ㅡ {text3} ㅡ
                    </span>
                </div>

                {/* Right Emblem */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-28 h-28 flex items-center justify-center">
                    {/* Swirl Pinwheel Decoration */}
                    <PinwheelSVG colors={pinwheelColors} animate={animate} />

                    {/* Red Disk - Sticker Style */}
                    <div
                        className="relative w-[55%] h-[55%] bg-[#E11D48] rounded-full flex items-center justify-center z-10"
                        style={{
                            border: '3px solid rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 0 rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.08)',
                        }}
                    >
                        <span
                            className="text-4xl font-black text-[#FDE047] leading-none"
                            style={{
                                fontFamily: '"Nanum Myeongjo", serif',
                                fontWeight: 900,
                                textShadow: '-1.0px -1.0px 0 #000, 1.0px -1.0px 0 #000, -1.0px 1.0px 0 #000, 1.0px 1.0px 0 #000',
                                transform: 'translateY(1.5px)'
                            }}
                        >
                            축
                        </span>
                    </div>
                </div>

                {/* Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
                />
            </div>
        </motion.div>
    );
};

export default KCelebrateSlogan;
