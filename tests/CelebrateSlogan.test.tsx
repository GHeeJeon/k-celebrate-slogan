import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CelebrateSlogan } from '../index';
import { NEON_THEME } from '../themes';

describe('CelebrateSlogan', () => {
    it('renders default texts correctly', () => {
        render(<CelebrateSlogan />);
        expect(screen.getByText('축하합니다')).toBeInTheDocument();
        expect(screen.getByText('유즈하 리코')).toBeInTheDocument();
        expect(screen.getByText('ㅡ 아무 이유 없음 ㅡ')).toBeInTheDocument();
        expect(screen.getByText('경')).toBeInTheDocument();
        expect(screen.getByText('축')).toBeInTheDocument();
    });

    it('renders custom texts when provided', () => {
        render(
            <CelebrateSlogan
                text1="Happy Anniversary"
                text2="Company Launch"
                text3="10th Year"
            />
        );
        expect(screen.getByText('Happy Anniversary')).toBeInTheDocument();
        expect(screen.getByText('Company Launch')).toBeInTheDocument();
        expect(screen.getByText('ㅡ 10th Year ㅡ')).toBeInTheDocument();
    });

    it('applies custom text colors', () => {
        const { container } = render(
            <CelebrateSlogan
                text1Color="#ff0000"
                text2Color="#00ff00"
                text3Color="#0000ff"
            />
        );

        // Find elements and check styles indirectly via computed styles or inline styles depending on implementation
        // Since we pass styles directly, we can check for them in the style attribute.
        const text1 = screen.getByText('축하합니다');
        expect(text1).toHaveStyle({ color: '#ff0000' });

        const text2 = screen.getByText('유즈하 리코');
        expect(text2).toHaveStyle({ color: '#00ff00' });

        // text3 is inside a span with the text
        const text3 = screen.getByText('ㅡ 아무 이유 없음 ㅡ');
        expect(text3).toHaveStyle({ color: '#0000ff' });
    });

    it('renders without crashing even with custom themes', () => {
        render(<CelebrateSlogan pinwheelColors={NEON_THEME} />);
        // If it reaches here without error, it passes.
        // We can check if svg paths exist to imply pinwheels are rendered
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('renders without animation when animate prop is false', () => {
        const { container } = render(<CelebrateSlogan animate={false} />);

        // Check if the pinwheel container has "animation: none" style or similar
        // Since PinwheelSVG takes the animate prop, we can inspect its container style
        // We need to find the pinwheel container. It usually has style with animation property.
        // Let's query by class or structure if possible.
        // The PinwheelSVG div has "absolute inset-0 w-full h-full" classes.

        // A hacky way to find it is to look for the element with the animation style
        const animatedDivs = container.querySelectorAll('div[style*="animation"]');
        const nonAnimatedDivs = container.querySelectorAll('div[style*="animation: none"]');

        // Since we pass animate={false}, the inline style should satisfy "animation: none"
        // Let's just check if we can find elements that would have had animation.

        // In the code: style={{ animation: animate ? ... : 'none' }}
        // So we expect at least one element with 'animation: none' (actually two, left and right pinwheels)
        expect(nonAnimatedDivs.length).toBeGreaterThanOrEqual(2);
    });
});
