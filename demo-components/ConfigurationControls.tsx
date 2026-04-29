import React from 'react';
import { Config, ACCENT, DEFAULT_CONFIG } from './types';
import { Section, Label, TextInput, ColorRow, SliderRow } from './UI';

interface BaseProps {
    cfg: Config;
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

// ── Shared Content Blocks ──────────────────────────────────────────────────

const VariantContent: React.FC<BaseProps> = ({ cfg, set }) => {
    const handleVariantChange = (name: 'classic' | 'coachella') => {
        if (cfg.variant === name) return;
        set('variant', name);
        if (name === 'coachella') {
            set('text1', '안녕하세요');
            set('text2', '대성입니다');
        } else {
            set('text1', '축하합니다');
            set('text2', '김준호');
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['classic', 'coachella'] as const).map((name) => (
                <button
                    key={name}
                    onClick={() => handleVariantChange(name)}
                    style={{
                        flex: 1,
                        padding: '0.45rem',
                        background: cfg.variant === name ? ACCENT : '#f8fafc',
                        color: cfg.variant === name ? '#fff' : '#475569',
                        border: '1px solid',
                        borderColor: cfg.variant === name ? ACCENT : '#e2e8f0',
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
};

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
        {cfg.variant === 'classic' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                    <Label htmlFor="char1">Left Char</Label>
                    <TextInput
                        id="char1"
                        value={cfg.char1}
                        onChange={(v) => set('char1', v.slice(0, 2))}
                        placeholder="경"
                    />
                </div>
                <div>
                    <Label htmlFor="char2">Right Char</Label>
                    <TextInput
                        id="char2"
                        value={cfg.char2}
                        onChange={(v) => set('char2', v.slice(0, 2))}
                        placeholder="축"
                    />
                </div>
            </div>
        )}
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
        {cfg.variant === 'classic' && (
            <div>
                <Label htmlFor="text3">Sub Text (text3)</Label>
                <TextInput
                    id="text3"
                    value={cfg.text3}
                    onChange={(v) => set('text3', v)}
                    placeholder="No reason at all"
                />
            </div>
        )}
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
        {cfg.variant === 'classic' && (
            <>
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
            </>
        )}
        <ColorRow
            id="backgroundColor"
            label="Background"
            value={cfg.backgroundColor}
            onChange={(v) => set('backgroundColor', v)}
            fallbackValue={DEFAULT_CONFIG.backgroundColor}
        />
        {cfg.variant !== 'coachella' && (
            <ColorRow
                id="borderColor"
                label="Border Color"
                value={cfg.borderColor}
                onChange={(v) => set('borderColor', v)}
                fallbackValue={DEFAULT_CONFIG.borderColor}
            />
        )}
    </div>
);

const LayoutContent: React.FC<BaseProps> = ({ cfg, set }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span
                    style={{
                        fontSize: '0.6rem',
                        color: '#94a3b8',
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        display: 'inline-block',
                    }}
                >
                    ▶
                </span>
                <span
                    style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                    }}
                >
                    Layout Settings
                </span>
            </div>

            {isOpen && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        marginTop: '0.2rem',
                    }}
                >
                    {cfg.variant === 'classic' && (
                        <>
                            <SliderRow
                                id="strokeWidth"
                                label="Stroke Width (px)"
                                value={
                                    parseFloat(cfg.text2StrokeWidth.replace(/[^0-9.]/g, '')) || 0
                                }
                                min={0}
                                max={10}
                                step={0.1}
                                onChange={(v) => set('text2StrokeWidth', `${v}px`)}
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
                        </>
                    )}
                    <SliderRow
                        id="scale"
                        label="Scale"
                        value={cfg.scale}
                        min={0.3}
                        max={2}
                        step={0.05}
                        onChange={(v) => set('scale', v)}
                    />
                    {cfg.variant !== 'coachella' && (
                        <SliderRow
                            id="borderWidth"
                            label="Border Width (px)"
                            value={parseFloat(cfg.borderWidth.replace(/[^0-9.]/g, '')) || 0}
                            min={0}
                            max={20}
                            step={1}
                            onChange={(v) => set('borderWidth', `${v}px`)}
                        />
                    )}
                    <SliderRow
                        id="borderRadius"
                        label="Border Radius (rem)"
                        value={parseFloat(cfg.borderRadius.replace(/[^0-9.]/g, '')) || 0}
                        min={0}
                        max={3}
                        step={0.125}
                        onChange={(v) => set('borderRadius', `${v}rem`)}
                    />
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                        }}
                    >
                        <input
                            type="checkbox"
                            id="interactive"
                            checked={cfg.interactive}
                            onChange={(e) => set('interactive', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                        <Label htmlFor="interactive" style={{ marginBottom: 0, cursor: 'pointer' }}>
                            Interactive Mode (Enable Clicks)
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );
};

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
        <Label>Variant</Label>
        <div style={{ marginBottom: '1rem' }}>
            <VariantContent cfg={cfg} set={set} />
        </div>
        {cfg.variant === 'classic' && (
            <>
                <Label>Presets</Label>
                <div style={{ marginBottom: '1rem' }}>
                    <PresetContent cfg={cfg} set={set} applyPreset={applyPreset} />
                </div>
            </>
        )}
        <div style={{ height: '0.5rem' }} />
        <Label>Text Settings</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <TextContent cfg={cfg} set={set} />
            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0' }} />
            <ColorContent cfg={cfg} set={set} />
            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '0' }} />
            <LayoutContent cfg={cfg} set={set} />
        </div>
    </Section>
);
