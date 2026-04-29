import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { KCelebrateSlogan } from '../index';
import { NEON_THEME } from '../themes';

describe('CelebrateSlogan', () => {
    it('renders default texts correctly', () => {
        render(<KCelebrateSlogan />);
        expect(screen.getByText('축하합니다')).toBeInTheDocument();
        expect(screen.getAllByText('김준호')).toHaveLength(2);
        expect(screen.getByText('ㅡ 아무 이유 없음 ㅡ')).toBeInTheDocument();
        expect(screen.getByText('경')).toBeInTheDocument();
        expect(screen.getByText('축')).toBeInTheDocument();
    });

    it('renders custom texts when provided', () => {
        render(
            <KCelebrateSlogan text1="Happy Anniversary" text2="Company Launch" text3="10th Year" />
        );
        expect(screen.getByText('Happy Anniversary')).toBeInTheDocument();
        expect(screen.getAllByText('Company Launch')).toHaveLength(2);
        expect(screen.getByText('ㅡ 10th Year ㅡ')).toBeInTheDocument();
    });

    it('applies custom text colors', () => {
        const { container } = render(
            <KCelebrateSlogan text1Color="#ff0000" text2Color="#00ff00" text3Color="#0000ff" />
        );
        const styleTag = container.querySelector('style');
        expect(styleTag?.textContent).toContain('--text1-color: #ff0000');
        expect(styleTag?.textContent).toContain('--text2-color: #00ff00');
        expect(styleTag?.textContent).toContain('--text3-color: #0000ff');
    });

    it('renders without crashing even with custom themes', () => {
        render(<KCelebrateSlogan pinwheelColors={NEON_THEME} />);
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('renders without animation when animate prop is false', () => {
        const { container } = render(<KCelebrateSlogan animate={false} />);
        const animatedElements = container.querySelectorAll(
            '.k-pinwheel-animated, .k-pinwheel-animated-reverse'
        );
        expect(animatedElements.length).toBe(0);
    });

    it('renders separate background and text glitter layers for the coachella variant', () => {
        const { container } = render(
            <KCelebrateSlogan variant="coachella" text1="환영" text2="테스트" />
        );

        expect(container.querySelectorAll('.coachella-background-bokeh')).toHaveLength(1);
        expect(container.querySelectorAll('.coachella-text-glitter').length).toBeGreaterThan(0);
    });
});
