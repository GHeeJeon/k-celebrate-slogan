import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { KCelebrateSloganProps } from './types';
import ClassicLayout from './layouts/ClassicLayout';
import CoachellaLayout from './layouts/CoachellaLayout';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const GOOGLE_FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Outfit:wght@400;600&display=swap';

const computeScaleFromWidth = (containerWidth: number, baseScale: number): number => {
    if (containerWidth < 320) return baseScale * 0.28;
    if (containerWidth < 480) return baseScale * 0.38;
    if (containerWidth < 600) return baseScale * 0.5;
    if (containerWidth < 900) return baseScale * 0.75;
    return baseScale;
};

const KCelebrateSlogan: React.FC<KCelebrateSloganProps> = (props) => {
    const {
        variant = 'classic',
        text1 = '축하합니다',
        text2 = '김준호',
        text2Color = '#222222',
        text2StrokeColor,
        text2StrokeWidth = '2.5px',
        animate = true,
        scale = 1,
        className = '',
        style,
        autoFit = true,
        loadFonts = true,
        interactive = false,
        exportMode = false,
    } = props;

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

    // Calculate dynamic minimum width based on the layout variant
    let minContentWidth: string;
    if (variant === 'coachella') {
        // Coachella has no emblems. Width is driven by the longest text string.
        const maxLen = Math.max(text1.length, text2.length);
        minContentWidth = `${(Math.max(10, maxLen * 4) * scale).toFixed(1)}rem`;
    } else {
        // Classic has ~8rem overhead for emblems and gaps, plus text2 length
        minContentWidth = `${(Math.max(12, 8 + text2.length * 1.4) * scale).toFixed(1)}rem`;
    }

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
                    pointerEvents: interactive ? 'auto' : 'none',
                    width: '100%',
                    transformOrigin: 'center',
                }}
            >
                {variant === 'coachella' ? (
                    <CoachellaLayout activeScale={activeScale} {...props} />
                ) : (
                    <ClassicLayout
                        activeScale={activeScale}
                        strokeColor={strokeColor}
                        numericStroke={numericStroke}
                        {...props}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default KCelebrateSlogan;
