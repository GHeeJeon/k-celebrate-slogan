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
     * Whether to enable animations (entrance jump and pinwheel spin)
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
     * Scale factor specifically for the left and right emblems.
     * @default 1
     */
    emblemScale?: number;

    /**

     * Additional CSS classes for the container.
     */
    className?: string;
}
