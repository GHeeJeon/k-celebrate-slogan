import React from 'react';
import ReactDOM from 'react-dom/client';
import KCelebrateSlogan from './KCelebrateSlogan';

const ComparisonPage = () => {
    const commonProps = {
        text1: '축하합니다',
        text2: '김준호',
        text3: '아무 이유 없음',
        text2StrokeWidth: '2.5px',
        scale: 1,
        emblemScale: 0.75,
    };

    return (
        <div
            style={{
                padding: '40px',
                backgroundColor: '#f0f6fa',
                minHeight: '100vh',
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Slogan Style Comparison</h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '60px',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}
            >
                {/* 1. Mobile Preview Mode (Simulated) */}
                <section
                    style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    }}
                >
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1c89bf' }}>
                        1. Mobile Preview Mode (exportMode: false)
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                        This version uses <code>autoScale</code>. On a desktop, it might look like
                        the desktop version unless the viewport is narrowed. (Currently showing at
                        your screen&apos;s auto-calculated scale).
                    </p>
                    <div
                        style={{
                            border: '1px dashed #cbd5e1',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            background: '#f8fafc',
                        }}
                    >
                        <KCelebrateSlogan {...commonProps} exportMode={false} />
                    </div>
                </section>

                {/* 2. Hidden Export Layer (High Quality) */}
                <section
                    style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    }}
                >
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#e11d48' }}>
                        2. Hidden Export Layer (exportMode: true)
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                        This is the &quot;Hidden&quot; layer used for capturing images. It forces{' '}
                        <code>scale: 1</code> regardless of screen width. This is what actually gets
                        saved as JPG/PNG/SVG.
                    </p>
                    <div
                        style={{
                            border: '1px dashed #cbd5e1',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            background: '#f8fafc',
                        }}
                    >
                        <KCelebrateSlogan {...commonProps} exportMode={true} />
                    </div>
                </section>

                {/* 3. Small Screen Simulation (Force Mobile Scale) */}
                <section
                    style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    }}
                >
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f59e0b' }}>
                        3. Forced Mobile Scale (Narrow Container)
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                        Simulating a 375px mobile viewport. Note how the stroke and emblem borders
                        might look thinner here.
                    </p>
                    <div
                        style={{
                            width: '375px',
                            margin: '0 auto',
                            border: '1px dashed #cbd5e1',
                            padding: '10px',
                            overflow: 'hidden',
                            background: '#f8fafc',
                        }}
                    >
                        <KCelebrateSlogan {...commonProps} exportMode={false} />
                    </div>
                </section>
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <a href="/" style={{ color: '#1c89bf', textDecoration: 'none', fontWeight: 600 }}>
                    ← Back to Main Demo
                </a>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ComparisonPage />
    </React.StrictMode>
);
