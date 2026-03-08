import React, { useState, useCallback, useRef, useEffect } from 'react';
import './demo.css';
import { createRoot } from 'react-dom/client';
import { Config, DEFAULT_CONFIG, PRESETS } from './demo-components/types';
import {
    PresetControls,
    TextControls,
    ColorControls,
    LayoutControls,
    CompactConfiguration,
} from './demo-components/ConfigurationControls';
import { Preview } from './demo-components/Preview';
import { Section, CopyBlock } from './demo-components/UI';

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

const DemoApp: React.FC = () => {
    const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
    const [animKey, setAnimKey] = useState(0);
    const [activeTab, setActiveTab] = useState<'preset' | 'text' | 'colors' | 'layout' | 'share'>(
        'preset'
    );
    const sloganRef = useRef<HTMLDivElement>(null);

    const set = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
        setCfg((prev) => ({ ...prev, [key]: value }));
    }, []);

    const applyPreset = (name: keyof typeof PRESETS) => {
        setCfg((prev) => ({ ...prev, ...PRESETS[name] }));
        setAnimKey((k) => k + 1);
    };

    const replayAnim = () => setAnimKey((k) => k + 1);

    const sloganUrl = buildUrl(cfg);
    const markdownCode = `[![k-celebrate-slogan](${sloganUrl})](https://github.com/GHeeJeon/k-celebrate-slogan)`;
    const htmlCode = `<a href="https://github.com/GHeeJeon/k-celebrate-slogan">\n  <img src="${sloganUrl}" alt="k-celebrate-slogan" />\n</a>`;

    useEffect(() => {
        // reserved for future sync logic
    }, [cfg.text2Color]);

    const shareContent = (
        <Section title="📤 Share">
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem',
                }}
            >
                <CopyBlock label="Markdown" code={markdownCode} />
                <CopyBlock label="HTML" code={htmlCode} />
                <CopyBlock label="URL" code={sloganUrl} />
            </div>
        </Section>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header
                style={{
                    background: 'rgba(255,255,255,0.93)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    padding: '0.45rem 1rem',
                }}
            >
                <div className="header-inner" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🎉</span>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <h1 className="header-title">k-celebrate-slogan</h1>
                        <p className="header-subtitle">Slogan customizer for your GitHub README</p>
                    </div>
                    <div className="header-links">
                        <a
                            href="https://www.npmjs.com/package/k-celebrate-slogan"
                            target="_blank"
                            rel="noreferrer"
                            className="header-link-btn"
                            style={{ background: '#cb3837' }}
                        >
                            NPM
                        </a>
                        <a
                            href="https://github.com/GHeeJeon/k-celebrate-slogan"
                            target="_blank"
                            rel="noreferrer"
                            className="header-link-btn"
                            style={{ background: '#24292f' }}
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '1rem' }}>
                <div className="demo-layout">
                    {/* PC View: Left, Mobile View: Bottom (Tab Contents) */}
                    <div className="control-col">
                        {/* Compact view only for Desktop */}
                        <div className="desktop-compact">
                            <CompactConfiguration cfg={cfg} set={set} applyPreset={applyPreset} />
                        </div>

                        {/* Mobile Tabs & Content (Hidden on Desktop) */}
                        <div className="mobile-tabs">
                            {(['preset', 'text', 'colors', 'layout', 'share'] as const).map((t) => (
                                <button
                                    key={t}
                                    className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                                    onClick={() => setActiveTab(t)}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className={`tab-content ${activeTab === 'preset' ? 'active' : ''}`}>
                            <PresetControls cfg={cfg} applyPreset={applyPreset} set={set} />
                        </div>
                        <div className={`tab-content ${activeTab === 'text' ? 'active' : ''}`}>
                            <TextControls cfg={cfg} set={set} />
                        </div>
                        <div className={`tab-content ${activeTab === 'colors' ? 'active' : ''}`}>
                            <ColorControls cfg={cfg} set={set} />
                        </div>
                        <div className={`tab-content ${activeTab === 'layout' ? 'active' : ''}`}>
                            <LayoutControls cfg={cfg} set={set} />
                        </div>
                        <div
                            className={`tab-content mobile-share ${activeTab === 'share' ? 'active' : ''}`}
                        >
                            {shareContent}
                        </div>
                    </div>

                    {/* PC View: Right, Mobile View: Top (Sticky Preview) */}
                    <div className="preview-col">
                        <div className="sticky-preview">
                            <Preview
                                ref={sloganRef}
                                cfg={cfg}
                                animKey={animKey}
                                replayAnim={replayAnim}
                            />
                        </div>
                        <div className="desktop-share">{shareContent}</div>
                    </div>
                </div>
            </main>

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
        </div>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<DemoApp />);
}
