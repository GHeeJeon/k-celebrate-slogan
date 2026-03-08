import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Config, DEFAULT_CONFIG, PRESETS, ACCENT } from './demo-components/types';
import { ConfigurationControls } from './demo-components/ConfigurationControls';
import { Preview } from './demo-components/Preview';
import { CodeSnippets } from './demo-components/CodeSnippets';

const DemoApp: React.FC = () => {
    const [cfg, setCfg] = useState<Config>(DEFAULT_CONFIG);
    const [animKey, setAnimKey] = useState(0);
    const sloganRef = useRef<HTMLDivElement>(null);

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

    return (
        <>
            <style>{`
                :root { color-scheme: light; }
                * { box-sizing: border-box; }
                body { margin: 0; background: #f0f6fa; font-family: 'Inter', sans-serif; color: #0f172a; }
                input[type=range] { accent-color: ${ACCENT}; }
                .demo-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .control-col { order: 2; display: flex; flex-direction: column; gap: 1.5rem; flex: 1; }
                .preview-col { order: 1; display: flex; flex-direction: column; gap: 1.5rem; flex: 1; min-width: 0; }
                
                .sticky-preview {
                    position: sticky;
                    top: 80px; 
                    z-index: 50;
                }

                @media (min-width: 900px) {
                    .demo-layout { 
                        display: grid !important; 
                        grid-template-columns: 340px 1fr; 
                        gap: 1.5rem; 
                        align-items: flex-start;
                    }
                    .control-col { order: 1; }
                    .preview-col { order: 2; }
                }
            `}</style>

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
                            margin: 0,
                        }}
                    >
                        k-celebrate-slogan
                    </h1>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0.1rem 0 0 0' }}>
                        Slogan customizer for your GitHub README
                    </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <a
                        href="https://www.npmjs.com/package/k-celebrate-slogan"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            padding: '0.4rem 0.8rem',
                            background: '#cb3837',
                            color: '#fff',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        NPM ↗
                    </a>
                    <a
                        href="https://github.com/GHeeJeon/k-celebrate-slogan"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            padding: '0.4rem 0.8rem',
                            background: '#24292f',
                            color: '#fff',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        GitHub ↗
                    </a>
                </div>
            </header>

            <main
                style={{
                    maxWidth: '1600px',
                    margin: '0 auto',
                    padding: '1.5rem',
                }}
            >
                <div className="demo-layout">
                    {/* Controls & Snippets (Left Col on Desktop, Bottom on Mobile) */}
                    <div className="control-col">
                        <ConfigurationControls cfg={cfg} set={set} applyPreset={applyPreset} />
                        <CodeSnippets cfg={cfg} />
                    </div>

                    {/* Preview (Right Col on Desktop, Top/Sticky on Mobile) */}
                    <div className="preview-col">
                        <div className="sticky-preview">
                            <Preview
                                ref={sloganRef}
                                cfg={cfg}
                                animKey={animKey}
                                replayAnim={replayAnim}
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
        </>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<DemoApp />);
}
