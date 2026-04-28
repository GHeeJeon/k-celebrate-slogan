import type { CSSProperties } from 'react';

export interface KCelebrateSloganProps {
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
     * @default "#111827"
     */
    text3Color?: string;

    /**
     * Stroke color for text2. Defaults to text2Color.
     */
    text2StrokeColor?: string;
    /**
     * Stroke width for text2.
     * @default "2.5px"
     */
    text2StrokeWidth?: string;

    /**
     * Custom colors for pinwheel blades.
     * Accepts a list of color stops (interpolated) or exactly 12 colors.
     */
    pinwheelColors?: string[];

    /**
     * Enable entrance and pinwheel animations.
     * @default true
     */
    animate?: boolean;

    /**
     * Uniform scale factor for the entire component.
     * Prefer using `width` for layout-driven sizing.
     * @default 1
     */
    scale?: number;

    /**
     * Scale factor for the side emblems (pinwheels + characters) relative to the component.
     * @default 0.75
     */
    emblemScale?: number;

    /**
     * CSS class forwarded to the root element.
     */
    className?: string;

    /**
     * Inline styles forwarded to the root element.
     */
    style?: CSSProperties;

    /**
     * Auto-scale the component based on its container width using ResizeObserver.
     * Set to false to disable all auto-scaling and rely on `scale` alone.
     * @default true
     */
    autoFit?: boolean;

    /**
     * Inject Nanum Myeongjo and Outfit fonts from Google Fonts automatically.
     * Set to false if you load these fonts yourself to avoid duplicate requests.
     * @default true
     */
    loadFonts?: boolean;

    /**
     * Card border color.
     * @default "#f3f4f6"
     */
    borderColor?: string;

    /**
     * Card border width.
     * @default "2px"
     */
    borderWidth?: string;

    /**
     * Card border radius.
     * @default "0.125rem"
     */
    borderRadius?: string;

    /**
     * Card background color.
     * @default "#ffffff"
     */
    backgroundColor?: string;

    /**
     * Allow pointer events on the component.
     * Useful when the component is inside a clickable or interactive wrapper.
     * @default false
     */
    interactive?: boolean;

    /**
     * Character displayed in the left emblem.
     * @default "경"
     */
    char1?: string;

    /**
     * Character displayed in the right emblem.
     * @default "축"
     */
    char2?: string;

    /**
     * Internal prop used to bypass auto-scaling during image/gif export.
     * @internal
     */
    exportMode?: boolean;
}
