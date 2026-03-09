import React, { useState, useCallback, useRef, useEffect } from 'react';
import './demo.css';
import { createRoot } from 'react-dom/client';
import { Config, DEFAULT_CONFIG, PRESETS } from './demo-components/types';
import { CompactConfiguration } from './demo-components/ConfigurationControls';
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
    const sloganRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Handle mobile default scale (0.75) if on a small screen
        if (window.innerWidth < 900) {
            setCfg((prev) => ({ ...prev, scale: 0.75 }));
        }
    }, []);

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
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 'fit-content', // This guarantees the container (and its sticky header) expands with horizontally scrolling content
            }}
        >
            <header
                style={{
                    background: 'rgba(255,255,255,0.93)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e2e8f0',
                    position: 'sticky', // Sticky is better for horizontal content width synchronization
                    top: 0,
                    zIndex: 200,
                    padding: '0.45rem 1rem',
                    width: '100%', // Expand with container
                    minWidth: '100vw', // Ensure it covers at least the viewport
                    left: 0,
                    boxSizing: 'border-box',
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
                            <svg width="14" height="14" viewBox="0 0 576 512" fill="currentColor">
                                <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"></path>
                            </svg>
                            NPM
                        </a>
                        <a
                            href="https://github.com/GHeeJeon/k-celebrate-slogan"
                            target="_blank"
                            rel="noreferrer"
                            className="header-link-btn"
                            style={{ background: '#24292f' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                            </svg>
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            <main
                style={{
                    maxWidth: '1600px',
                    margin: '0 auto',
                    padding: '1rem',
                }}
            >
                <div className="demo-layout">
                    {/* Unified Configuration Column (PC & Mobile) */}
                    <div className="control-col">
                        <CompactConfiguration cfg={cfg} set={set} applyPreset={applyPreset} />

                        <div className="share-section-wrapper">{shareContent}</div>
                    </div>

                    {/* PC View: Right, Mobile View: Top (Sticky Preview) */}
                    <div className="preview-col">
                        <div className="sticky-preview">
                            <Preview
                                ref={sloganRef}
                                cfg={cfg}
                                animKey={animKey}
                                replayAnim={replayAnim}
                                set={set}
                            />
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
        </div>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<DemoApp />);
}
