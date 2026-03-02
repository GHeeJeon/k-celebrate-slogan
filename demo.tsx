import React, { useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import KCelebrateSlogan from './KCelebrateSlogan';
import { PASTEL_THEME, NEON_THEME } from './themes';

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = '#1c89bf';
const ACCENT_DARK = '#1570a0';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Config {
    text1: string;
    text2: string;
    text3: string;
    text1Color: string;
    text2Color: string;
    text3Color: string;
    text2StrokeColor: string;
    text2StrokeWidth: string;
    scale: number;
    emblemScale: number;
    animate: boolean;
    pinwheelTheme: 'default' | 'pastel' | 'neon';
}

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS: Record<string, Partial<Config>> = {
    default: {
        text1: '축하합니다',
        text2: '김준호',
        text3: '아무 이유 없음',
        text1Color: '#1c89bf',
        text2Color: '#222222',
        text3Color: '#111827',
        text2StrokeColor: '#222222',
        text2StrokeWidth: '2.5px',
        pinwheelTheme: 'default',
    },
    pastel: {
        text1: 'Happy Birthday',
        text2: 'Dear Friend',
        text3: 'With Best Wishes',
        text1Color: '#FF6B6B',
        text2Color: '#4ECDC4',
        text3Color: '#111827',
        text2StrokeColor: '#4ECDC4',
        text2StrokeWidth: '2.5px',
        pinwheelTheme: 'pastel',
    },
    neon: {
        text1: 'GRAND OPENING',
        text2: 'NIGHT CLUB',
        text3: 'Tonight Only',
        text1Color: '#FF00FF',
        text2Color: '#00FFFF',
        text3Color: '#FFFFFF',
        text2StrokeColor: '#00FFFF',
        text2StrokeWidth: '2px',
        pinwheelTheme: 'neon',
    },
};

const DEFAULT_CONFIG: Config = {
    ...PRESETS.default,
    scale: 1,
    emblemScale: 0.75,
    animate: true,
} as Config;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPinwheelColors(theme: Config['pinwheelTheme']): string[] | undefined {
    if (theme === 'pastel') return PASTEL_THEME;
    if (theme === 'neon') return NEON_THEME;
    return undefined;
}

function buildUrl(cfg: Config): string {
    const base = 'https://k-celebrate-slogan.vercel.app/api';
    const params = new URLSearchParams({
        text1: cfg.text1,
        text2: cfg.text2,
        text3: cfg.text3,
        text1Color: cfg.text1Color,
        text2Color: cfg.text2Color,
        text3Color: cfg.text3Color,
        text2StrokeColor: cfg.text2StrokeColor,
        text2StrokeWidth: cfg.text2StrokeWidth,
        scale: String(cfg.scale),
        emblemScale: String(cfg.emblemScale),
        theme: cfg.pinwheelTheme,
    });
    return `${base}?${params.toString()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
}
const Label: React.FC<LabelProps> = ({ children, htmlFor }) => (
    <label
        htmlFor={htmlFor}
        style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748b',
            marginBottom: '0.35rem',
        }}
    >
        {children}
    </label>
);

interface TextInputProps {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}
const TextInput: React.FC<TextInputProps> = ({ id, value, onChange, placeholder }) => (
    <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            color: '#0f172a',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={(e) => {
            e.target.style.borderColor = ACCENT;
            e.target.style.boxShadow = `0 0 0 3px ${ACCENT}22`;
        }}
        onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
        }}
    />
);

interface ColorRowProps {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
}
const ColorRow: React.FC<ColorRowProps> = ({ id, label, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <Label htmlFor={id}>{label}</Label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
                id={id}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '2.2rem',
                    height: '2.2rem',
                    padding: '0.1rem',
                    borderRadius: '0.4rem',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    background: 'transparent',
                    flexShrink: 0,
                }}
            />
            <TextInput id={`${id}-text`} value={value} onChange={onChange} />
        </div>
    </div>
);

interface SliderRowProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
}
const SliderRow: React.FC<SliderRowProps> = ({ id, label, value, min, max, step, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Label htmlFor={id}>{label}</Label>
            <span style={{ fontSize: '0.8rem', color: ACCENT, fontWeight: 700 }}>{value}</span>
        </div>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: ACCENT, cursor: 'pointer' }}
        />
    </div>
);

interface CopyBlockProps {
    label: string;
    code: string;
}
const CopyBlock: React.FC<CopyBlockProps> = ({ label, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = code;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div
            style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 1rem',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc',
                }}
            >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {label}
                </span>
                <button
                    onClick={handleCopy}
                    style={{
                        padding: '0.3rem 0.8rem',
                        background: copied ? '#16a34a' : ACCENT,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        fontFamily: 'inherit',
                    }}
                >
                    {copied ? '✓ Copied!' : 'Copy'}
                </button>
            </div>
            <pre
                style={{
                    padding: '1rem',
                    fontSize: '0.8rem',
                    color: '#0369a1',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    lineHeight: 1.6,
                    margin: 0,
                }}
            >
                {code}
            </pre>
        </div>
    );
};

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({
    title,
    children,
    id,
}) => (
    <section
        id={id}
        style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
    >
        <h2
            style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ACCENT,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}
        >
            {title}
        </h2>
        {children}
    </section>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
const DemoApp: React.FC = () => {
    const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
    const [animKey, setAnimKey] = useState(0);

    const set = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
        setCfg((prev) => ({ ...prev, [key]: value }));
    }, []);

    const applyPreset = (name: keyof typeof PRESETS) => {
        setCfg((prev) => ({ ...prev, ...PRESETS[name] }));
        setAnimKey((k) => k + 1);
    };

    const replayAnim = () => setAnimKey((k) => k + 1);

    useEffect(() => {
        // reserved for future sync logic
    }, [cfg.text2Color]);

    const sloganUrl = buildUrl(cfg);
    const markdownCode = `[![k-celebrate-slogan](${sloganUrl})](https://github.com/GHeeJeon/k-celebrate-slogan)`;
    const htmlCode = `<a href="https://github.com/GHeeJeon/k-celebrate-slogan">\n  <img src="${sloganUrl}" alt="k-celebrate-slogan" />\n</a>`;

    return (
        <>
            <style>{`
                :root { color-scheme: light; }
                * { box-sizing: border-box; }
                body { margin: 0; background: #f0f6fa; font-family: 'Inter', sans-serif; color: #0f172a; }
                input[type=range] { accent-color: ${ACCENT}; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #f1f5f9; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

                @media (min-width: 900px) {
                    .demo-layout { display: grid !important; grid-template-columns: 340px 1fr; gap: 1.5rem; }
                }
            `}</style>

            {/* ── Header ── */}
            <header
                style={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    padding: '0.9rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}
            >
                <span style={{ fontSize: '1.4rem' }}>🎉</span>
                <div>
                    <h1
                        style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            letterSpacing: '0.01em',
                        }}
                    >
                        k-celebrate-slogan
                    </h1>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>
                        Slogan customizer for your GitHub README
                    </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <a
                        href="https://github.com/GHeeJeon/k-celebrate-slogan"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            padding: '0.4rem 0.9rem',
                            background: '#f1f5f9',
                            color: '#475569',
                            borderRadius: '0.5rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        GitHub ↗
                    </a>
                </div>
            </header>

            {/* ── Main ── */}
            <main
                style={{
                    maxWidth: '1600px',
                    margin: '0 auto',
                    padding: '1.5rem',
                }}
            >
                <div
                    className="demo-layout"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    {/* ── Left: Controls ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Presets */}
                        <Section title="🎨 Presets">
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {(['default', 'pastel', 'neon'] as const).map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => applyPreset(name)}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background:
                                                cfg.pinwheelTheme === name ? ACCENT : '#f8fafc',
                                            color: cfg.pinwheelTheme === name ? '#fff' : '#475569',
                                            border: '1px solid',
                                            borderColor:
                                                cfg.pinwheelTheme === name ? ACCENT : '#e2e8f0',
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

                        {/* Text */}
                        <Section title="✏️ Text">
                            <div
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
                            >
                                <div>
                                    <Label htmlFor="text1">Top Text (text1)</Label>
                                    <TextInput
                                        id="text1"
                                        value={cfg.text1}
                                        onChange={(v) => set('text1', v)}
                                        placeholder="축하합니다"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="text2">Main Text (text2)</Label>
                                    <TextInput
                                        id="text2"
                                        value={cfg.text2}
                                        onChange={(v) => set('text2', v)}
                                        placeholder="김준호"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="text3">Sub Text (text3)</Label>
                                    <TextInput
                                        id="text3"
                                        value={cfg.text3}
                                        onChange={(v) => set('text3', v)}
                                        placeholder="아무 이유 없음"
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Colors */}
                        <Section title="🌈 Colors">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                    label="text2 Stroke Color"
                                    value={cfg.text2StrokeColor}
                                    onChange={(v) => set('text2StrokeColor', v)}
                                />
                                <div>
                                    <Label htmlFor="strokeWidth">text2 Stroke Width</Label>
                                    <TextInput
                                        id="strokeWidth"
                                        value={cfg.text2StrokeWidth}
                                        onChange={(v) => set('text2StrokeWidth', v)}
                                        placeholder="2.5px"
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Layout */}
                        <Section title="📐 Layout">
                            <div
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                            >
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
                    </div>

                    {/* ── Right: Preview + Code ── */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            minWidth: 0,
                        }}
                    >
                        {/* Preview */}
                        <Section title="👁️ Preview" id="preview">
                            {/* Outer wrapper: scrollable if slogan overflows horizontally */}
                            <div
                                style={{
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                    padding: '3rem 2rem 2rem',
                                    position: 'relative',
                                    overflowX: 'auto',
                                }}
                            >
                                {/* Subtle dot grid bg */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundImage: `radial-gradient(${ACCENT}33 1px, transparent 1px)`,
                                        backgroundSize: '20px 20px',
                                        opacity: 0.5,
                                        pointerEvents: 'none',
                                        borderRadius: '0.75rem',
                                    }}
                                />

                                {/* Slogan render area — NOT overflow:hidden so scale transform isn't clipped */}
                                <div
                                    key={animKey}
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        /* Give enough vertical room for the scale transform */
                                        paddingBottom: '1rem',
                                    }}
                                >
                                    <KCelebrateSlogan
                                        text1={cfg.text1 || undefined}
                                        text2={cfg.text2 || undefined}
                                        text3={cfg.text3 || undefined}
                                        text1Color={cfg.text1Color}
                                        text2Color={cfg.text2Color}
                                        text3Color={cfg.text3Color}
                                        text2StrokeColor={cfg.text2StrokeColor}
                                        text2StrokeWidth={cfg.text2StrokeWidth}
                                        scale={cfg.scale}
                                        emblemScale={cfg.emblemScale}
                                        animate={cfg.animate}
                                        pinwheelColors={getPinwheelColors(cfg.pinwheelTheme)}
                                    />
                                </div>

                                {/* Replay button */}
                                <div
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: '1rem',
                                    }}
                                >
                                    <button
                                        onClick={replayAnim}
                                        title="Replay animation"
                                        style={{
                                            padding: '0.4rem 1rem',
                                            background: '#ffffff',
                                            color: '#64748b',
                                            border: `1px solid #e2e8f0`,
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.15s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = ACCENT;
                                            e.currentTarget.style.color = ACCENT_DARK;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.color = '#64748b';
                                        }}
                                    >
                                        ↺ Replay
                                    </button>
                                </div>
                            </div>
                        </Section>

                        {/* Markdown */}
                        <Section title="📝 Markdown">
                            <CopyBlock label="Markdown" code={markdownCode} />
                        </Section>

                        {/* HTML */}
                        <Section title="🌐 HTML">
                            <CopyBlock label="HTML" code={htmlCode} />
                        </Section>

                        {/* URL */}
                        <Section title="🔗 URL">
                            <CopyBlock label="URL" code={sloganUrl} />
                        </Section>
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer
                style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                }}
            >
                k-celebrate-slogan © 2025 GHeeJeon · MIT License
            </footer>
        </>
    );
};

// ─── Mount ────────────────────────────────────────────────────────────────────
const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<DemoApp />);
}
