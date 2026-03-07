import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Config, DEFAULT_CONFIG, PRESETS, ACCENT } from './demo-components/types';
import { Presets } from './demo-components/Presets';
import { TextControls } from './demo-components/Text';
import { ColorControls } from './demo-components/Colors';
import { LayoutControls } from './demo-components/Layout';
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
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #f1f5f9; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

                @media (min-width: 900px) {
                    .demo-layout { display: grid !important; grid-template-columns: 340px 1fr; gap: 1.5rem; }
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

            <main
                style={{
                    maxWidth: '1600px',
                    margin: '0 auto',
                    padding: '1.5rem',
                }}
            >
                <div
                    className="demo-layout"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}
                    >
                        <Presets cfg={cfg} applyPreset={applyPreset} />
                        <TextControls cfg={cfg} set={set} />
                        <ColorControls cfg={cfg} set={set} />
                        <LayoutControls cfg={cfg} set={set} />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            minWidth: 0,
                            flex: 1, // Stretch to match left column height
                        }}
                    >
                        <Preview
                            ref={sloganRef}
                            cfg={cfg}
                            animKey={animKey}
                            replayAnim={replayAnim}
                        />

                        <CodeSnippets cfg={cfg} />
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
