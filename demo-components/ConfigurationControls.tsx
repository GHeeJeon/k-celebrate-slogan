import React from 'react';
import { Config, ACCENT } from './types';
import { Section, Label, TextInput, ColorRow, SliderRow } from './UI';

interface BaseProps {
    cfg: Config;
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

export const PresetControls: React.FC<
    BaseProps & { applyPreset: (name: 'default' | 'pastel' | 'neon') => void }
> = ({ cfg, applyPreset }) => (
    <Section title="🎯 Presets">
        <div style={{ display: 'flex', gap: '0.4rem' }}>
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
                        fontSize: '0.75rem',
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

export const TextControls: React.FC<BaseProps> = ({ cfg, set }) => (
    <Section title="✏️ Text">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
                <Label htmlFor="text1">Top Text (text1)</Label>
                <TextInput id="text1" value={cfg.text1} onChange={(v) => set('text1', v)} />
            </div>
            <div>
                <Label htmlFor="text2">Main Text (text2)</Label>
                <TextInput id="text2" value={cfg.text2} onChange={(v) => set('text2', v)} />
            </div>
            <div>
                <Label htmlFor="text3">Sub Text (text3)</Label>
                <TextInput id="text3" value={cfg.text3} onChange={(v) => set('text3', v)} />
            </div>
        </div>
    </Section>
);

export const ColorControls: React.FC<BaseProps> = ({ cfg, set }) => (
    <Section title="🎨 Colors">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 0.5rem' }}>
            <ColorRow
                id="text1Color"
                label="text1 Color"
                value={cfg.text1Color}
                onChange={(v) => set('text1Color', v)}
            />
            <ColorRow
                id="text2Color"
                label="text2 Color"
                value={cfg.text2Color}
                onChange={(v) => set('text2Color', v)}
            />
            <ColorRow
                id="text3Color"
                label="text3 Color"
                value={cfg.text3Color}
                onChange={(v) => set('text3Color', v)}
            />
            <ColorRow
                id="text2StrokeColor"
                label="text2 Stroke"
                value={cfg.text2StrokeColor}
                onChange={(v) => set('text2StrokeColor', v)}
            />
        </div>
    </Section>
);

export const LayoutControls: React.FC<BaseProps> = ({ cfg, set }) => (
    <Section title="📐 Layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                    <Label htmlFor="strokeWidth">Stroke Width</Label>
                    <TextInput
                        id="strokeWidth"
                        value={cfg.text2StrokeWidth}
                        onChange={(v) => set('text2StrokeWidth', v)}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1.2rem',
                    }}
                >
                    <Label>Animation</Label>
                    <button
                        onClick={() => set('animate', !cfg.animate)}
                        style={{
                            padding: '0.2rem 0.6rem',
                            background: cfg.animate ? ACCENT : '#f1f5f9',
                            color: cfg.animate ? '#fff' : '#94a3b8',
                            border: '1px solid',
                            borderColor: cfg.animate ? ACCENT : '#e2e8f0',
                            borderRadius: '1rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        {cfg.animate ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>
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
        </div>
    </Section>
);
