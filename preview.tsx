import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { KCelebrateSlogan, PASTEL_THEME, NEON_THEME } from './index';

const App = () => {
    const [animate, setAnimate] = useState(true);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            gap: '3rem',
            overflow: 'hidden'
        }}>
            <div>
                <button
                    onClick={() => setAnimate(!animate)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        marginBottom: '20px',
                        cursor: 'pointer'
                    }}
                >
                    Toggle Animation: {animate ? 'ON' : 'OFF'}
                </button>
            </div>

            {/* Default Theme */}
            <section style={{ width: '100%', maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>Default Theme</h2>
                <KCelebrateSlogan animate={animate} />
            </section>

            {/* Pastel Theme */}
            <section style={{ width: '100%', maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>Pastel Theme</h2>
                <KCelebrateSlogan
                    text1="Happy Birthday"
                    text2="Love, Friends"
                    text3="With Best Wishes"
                    text1Color="#FF6B6B"
                    text2Color="#4ECDC4"
                    pinwheelColors={PASTEL_THEME}
                    animate={animate}
                />
            </section>

            {/* Neon Theme */}
            <section style={{ width: '100%', maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>Neon Theme</h2>
                <KCelebrateSlogan
                    text1="GRAND OPENING"
                    text2="Night Club"
                    text3="Tonight Only"
                    text1Color="#FF00FF"
                    text2Color="#00FFFF"
                    text3Color="#FFFFFF"
                    pinwheelColors={NEON_THEME}
                    animate={animate}
                />
            </section>
        </div>
    );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
