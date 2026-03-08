import React from 'react';
import { Config, ACCENT } from './types';
import { Section, SliderRow, Label } from './UI';

interface Props {
    cfg: Config;
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

export const LayoutControls: React.FC<Props> = ({ cfg, set }) => {
    return (
        <Section title="📐 Layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <SliderRow
                    id="scale"
                    label="Scale"
                    value={cfg.scale}
                    min={0.3}
                    max={2}
                    step={0.05}
                    onChange={(v) => set('scale', v)}
                />
                <SliderRow
                    id="emblemScale"
                    label="Emblem Scale"
                    value={cfg.emblemScale}
                    min={0.3}
                    max={1.5}
                    step={0.05}
                    onChange={(v) => set('emblemScale', v)}
                />
                {/* Animate toggle */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Label>Animation</Label>
                    <button
                        onClick={() => set('animate', !cfg.animate)}
                        style={{
                            padding: '0.3rem 0.8rem',
                            background: cfg.animate ? ACCENT : '#f1f5f9',
                            color: cfg.animate ? '#fff' : '#94a3b8',
                            border: '1px solid',
                            borderColor: cfg.animate ? ACCENT : '#e2e8f0',
                            borderRadius: '2rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {cfg.animate ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>
        </Section>
    );
};
