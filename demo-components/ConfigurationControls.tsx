import React from 'react';
import { Config, ACCENT, DEFAULT_CONFIG } from './types';
import { Section, Label, TextInput, ColorRow, SliderRow } from './UI';

interface BaseProps {
    cfg: Config;
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

// ── Shared Content Blocks ──────────────────────────────────────────────────

const PresetContent: React.FC<
    BaseProps & { applyPreset: (name: 'default' | 'pastel' | 'neon') => void }
> = ({ cfg, applyPreset }) => (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
        {(['default', 'pastel', 'neon'] as const).map((name) => (
            <button
                key={name}
                onClick={() => applyPreset(name)}
                style={{
                    flex: 1,
                    padding: '0.45rem',
                    background: cfg.pinwheelTheme === name ? ACCENT : '#f8fafc',
                    color: cfg.pinwheelTheme === name ? '#fff' : '#475569',
                    border: '1px solid',
                    borderColor: cfg.pinwheelTheme === name ? ACCENT : '#e2e8f0',
                    borderRadius: '0.4rem',
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
);

const TextContent: React.FC<BaseProps> = ({ cfg, set }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div>
            <Label htmlFor="text1">Top Text (text1)</Label>
            <TextInput
                id="text1"
                value={cfg.text1}
                onChange={(v) => set('text1', v)}
                placeholder="Congratulations!"
            />
        </div>
        <div>
            <Label htmlFor="text2">Main Text (text2)</Label>
            <TextInput
                id="text2"
                value={cfg.text2}
                onChange={(v) => set('text2', v)}
                placeholder="Name"
            />
        </div>
        <div>
            <Label htmlFor="text3">Sub Text (text3)</Label>
            <TextInput
                id="text3"
                value={cfg.text3}
                onChange={(v) => set('text3', v)}
                placeholder="No reason at all"
            />
        </div>
    </div>
);

const ColorContent: React.FC<BaseProps> = ({ cfg, set }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 0.5rem' }}>
        <ColorRow
            id="text1Color"
            label="text1 Color"
            value={cfg.text1Color}
            onChange={(v) => set('text1Color', v)}
            fallbackValue={DEFAULT_CONFIG.text1Color}
        />
        <ColorRow
            id="text2Color"
            label="text2 Color"
            value={cfg.text2Color}
            onChange={(v) => set('text2Color', v)}
            fallbackValue={DEFAULT_CONFIG.text2Color}
        />
        <ColorRow
            id="text3Color"
            label="text3 Color"
            value={cfg.text3Color}
            onChange={(v) => set('text3Color', v)}
            fallbackValue={DEFAULT_CONFIG.text3Color}
        />
        <ColorRow
            id="text2StrokeColor"
            label="text2 Stroke"
            value={cfg.text2StrokeColor}
            onChange={(v) => set('text2StrokeColor', v)}
            fallbackValue={DEFAULT_CONFIG.text2StrokeColor}
        />
    </div>
);

const LayoutContent: React.FC<BaseProps> = ({ cfg, set }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <SliderRow
            id="strokeWidth"
            label="Stroke Width (px)"
            value={parseFloat(cfg.text2StrokeWidth.replace(/[^0-9.]/g, '')) || 0}
            min={0}
            max={10}
            step={0.1}
            onChange={(v) => set('text2StrokeWidth', `${v}px`)}
        />
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
);

// ── Exported Components ────────────────────────────────────────────────────

export const PresetControls: React.FC<
    BaseProps & { applyPreset: (name: 'default' | 'pastel' | 'neon') => void }
> = (props) => (
    <Section title="🎯 Presets">
        <PresetContent {...props} />
    </Section>
);

export const TextControls: React.FC<BaseProps> = (props) => (
    <Section title="✏️ Text">
        <TextContent {...props} />
    </Section>
);

export const ColorControls: React.FC<BaseProps> = (props) => (
    <Section title="🎨 Colors">
        <ColorContent {...props} />
    </Section>
);

export const LayoutControls: React.FC<BaseProps> = (props) => (
    <Section title="📐 Layout">
        <LayoutContent {...props} />
    </Section>
);

// ── Compact Unified Version ────────────────────────────────────────────────

export const CompactConfiguration: React.FC<
    BaseProps & { applyPreset: (name: 'default' | 'pastel' | 'neon') => void }
> = ({ cfg, set, applyPreset }) => (
    <Section title="⚙️ Configuration" style={{ height: '100%', boxSizing: 'border-box' }}>
        <Label>Presets</Label>
        <div style={{ marginBottom: '1rem' }}>
            <PresetContent cfg={cfg} set={set} applyPreset={applyPreset} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <TextContent cfg={cfg} set={set} />
            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0' }} />
            <ColorContent cfg={cfg} set={set} />
            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0' }} />
            <LayoutContent cfg={cfg} set={set} />
        </div>
    </Section>
);
