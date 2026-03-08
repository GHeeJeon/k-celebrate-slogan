import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Config, DEFAULT_CONFIG, PRESETS, ACCENT } from './demo-components/types';
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

                /* ── Layout ── */
                .demo-layout { display: flex; flex-direction: column; gap: 1rem; }
                .control-col { order: 2; display: flex; flex-direction: column; gap: 1rem; flex: 1; }
                .preview-col { order: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1.5rem; }
                .sticky-preview { position: sticky; top: 60px; z-index: 50; }

                /* ── Header ── */
                .header-inner { display: flex; align-items: center; gap: 0.6rem; width: 100%; flex-wrap: nowrap; }
                .header-title { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .header-subtitle { display: none; }
                .header-links { display: flex; gap: 0.35rem; margin-left: auto; flex-shrink: 0; }
                .header-link-btn { padding: 0.28rem 0.55rem; border-radius: 0.4rem; font-size: 0.68rem; font-weight: 600; text-decoration: none; color: #fff; white-space: nowrap; }

                @media (min-width: 600px) {
                    .header-subtitle { display: block; font-size: 0.66rem; color: #64748b; margin: 0.05rem 0 0; }
                    .header-title { font-size: 0.95rem; }
                    .header-link-btn { padding: 0.35rem 0.7rem; font-size: 0.72rem; }
                }

                /* ── Tabs ── */
                .mobile-tabs {
                    display: flex;
                    overflow-x: auto;
                    gap: 0.25rem;
                    background: #fff;
                    padding: 0.4rem 0.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    position: sticky;
                    top: 300px; /* Default top - Will be adjusted if possible */
                    z-index: 45;
                    scrollbar-width: none;
                    margin: 0 -1rem; /* Full width bleed on mobile */
                }
                .mobile-tabs::-webkit-scrollbar { display: none; }
                .tab-btn {
                    padding: 0.4rem 0.75rem;
                    border: none;
                    background: transparent;
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #64748b;
                    border-radius: 0.4rem;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn.active { background: ${ACCENT}15; color: ${ACCENT}; }

                /* ── Tab Content Visibility ── */
                .tab-content { display: block; }
                .tab-content Section { margin-bottom: 0; border: none; box-shadow: none; border-radius: 0; background: transparent; padding: 1rem 0; }

                /* PC-specific Compact View */
                .desktop-compact { display: none; }

                @media (max-width: 899.98px) {
                    .tab-content:not(.active) { display: none !important; }
                    .control-col { gap: 0; }
                    .snippet-row { display: flex !important; flex-direction: column; gap: 0; }
                }

                @media (min-width: 900px) {
                    .desktop-compact { display: block !important; }
                    .tab-content, .mobile-tabs { display: none !important; }
                    .demo-layout {
                        display: grid !important;
                        grid-template-columns: 340px 1fr;
                        gap: 1.5rem;
                        align-items: flex-start;
                    }
                    .control-col { order: 1; }
                    .preview-col { order: 2; }
                    .sticky-preview { position: relative; top: 0; z-index: 1; }
                    .snippet-row { flex-direction: row; display: flex !important; gap: 1rem; }
                    .snippet-row > * { flex: 1; min-width: 0; }
                }
            `}</style>

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
                        <div
                            className={`tab-content snippet-row ${activeTab === 'share' ? 'active' : ''}`}
                        >
                            <Section title="� Share">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
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
                        </div>
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
        </>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<DemoApp />);
}
