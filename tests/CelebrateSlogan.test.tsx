import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KCelebrateSlogan } from '../index';
import { NEON_THEME } from '../themes';

describe('CelebrateSlogan', () => {
    it('renders default texts correctly', () => {
        render(<KCelebrateSlogan />);
        expect(screen.getByText('축하합니다')).toBeInTheDocument();
        expect(screen.getByText('김준호')).toBeInTheDocument();
        expect(screen.getByText('ㅡ 아무 이유 없음 ㅡ')).toBeInTheDocument();
        expect(screen.getByText('경')).toBeInTheDocument();
        expect(screen.getByText('축')).toBeInTheDocument();
    });

    it('renders custom texts when provided', () => {
        render(
            <KCelebrateSlogan
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
            <KCelebrateSlogan
                text1Color="#ff0000"
                text2Color="#00ff00"
                text3Color="#0000ff"
            />
        );

        const text1 = screen.getByText('축하합니다');
        expect(text1).toHaveStyle({ color: '#ff0000' });

        const text2 = screen.getByText('김준호');
        expect(text2).toHaveStyle({ color: '#00ff00' });

        const text3 = screen.getByText('ㅡ 아무 이유 없음 ㅡ');
        expect(text3).toHaveStyle({ color: '#0000ff' });
    });

    it('renders without crashing even with custom themes', () => {
        render(<KCelebrateSlogan pinwheelColors={NEON_THEME} />);
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('renders without animation when animate prop is false', () => {
        const { container } = render(<KCelebrateSlogan animate={false} />);
        const nonAnimatedDivs = container.querySelectorAll('div[style*="animation: none"]');
        expect(nonAnimatedDivs.length).toBeGreaterThanOrEqual(2);
    });
});
