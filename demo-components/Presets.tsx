import React from 'react';
import { Config, PRESETS, ACCENT } from './types';
import { Section } from './UI';

interface Props {
    cfg: Config;
    applyPreset: (name: keyof typeof PRESETS) => void;
}

export const Presets: React.FC<Props> = ({ cfg, applyPreset }) => {
    return (
        <Section title="🎨 Presets">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['default', 'pastel', 'neon'] as const).map((name) => (
                    <button
                        key={name}
                        onClick={() => applyPreset(name)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: cfg.pinwheelTheme === name ? ACCENT : '#f8fafc',
                            color: cfg.pinwheelTheme === name ? '#fff' : '#475569',
                            border: '1px solid',
                            borderColor: cfg.pinwheelTheme === name ? ACCENT : '#e2e8f0',
                            borderRadius: '0.5rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </Section>
    );
};
