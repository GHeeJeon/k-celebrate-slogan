import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import KCelebrateSlogan from './KCelebrateSlogan';
import { PASTEL_THEME, NEON_THEME } from './themes';

const Lobby: React.FC = () => {
    const [animate, setAnimate] = useState(true);

    return (
        <div className="relative w-full min-h-screen overflow-y-auto bg-[#FFFDF7] pb-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none fixed"
                style={{
                    backgroundImage: 'radial-gradient(#F43F5E 2px, transparent 2px)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0'
                }}
            />

            <div className="relative z-10 w-full max-w-4xl mx-auto p-10 flex flex-col gap-16 items-center">

                <header className="w-full flex justify-between items-center mb-8 sticky top-0 bg-[#FFFDF7]/80 backdrop-blur-sm p-4 rounded-xl border border-stone-200 shadow-sm z-50">
                    <h1 className="text-2xl font-bold text-stone-700">🎉 Slogan Test Lab</h1>
                    <button
                        onClick={() => setAnimate(prev => !prev)}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg font-bold shadow-sm hover:bg-rose-600 transition-colors"
                    >
                        Toggle Animation: {animate ? "ON" : "OFF"}
                    </button>
                </header>

                {/* 1. Original Default Theme */}
                <section className="w-full flex flex-col items-center">
                    <h2 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-4">Default Theme</h2>
                    <KCelebrateSlogan animate={animate} />
                </section>

                {/* 2. Pastel Theme - Birthday */}
                <section className="w-full flex flex-col items-center">
                    <h2 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-4">Pastel Theme</h2>
                    <KCelebrateSlogan
                        text1="Happy Birthday"
                        text2="Dear Friend"
                        text3="With Best Wishes"
                        text1Color="#FF6B6B"
                        text2Color="#4ECDC4"
                        pinwheelColors={PASTEL_THEME}
                        animate={animate}
                    />
                </section>

                {/* 3. Neon Theme - Grand Opening */}
                <section className="w-full flex flex-col items-center">
                    <h2 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-4">Neon Theme</h2>
                    <KCelebrateSlogan
                        text1="GRAND OPENING"
                        text2="NIGHT CLUB"
                        text3="Tonight Only"
                        text1Color="#FF00FF"
                        text2Color="#00FFFF"
                        text3Color="#FFFFFF"
                        pinwheelColors={NEON_THEME}
                        animate={animate}
                        className="bg-black border-purple-500"
                    />
                </section>

                {/* 4. Long Text & Stroke Customization */}
                <section className="w-full flex flex-col items-center">
                    <h2 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-4">Long Text & Red Stroke</h2>
                    <KCelebrateSlogan
                        text1="A Very Long Slogan Text Test"
                        text2="Super Long Main Title That Expands"
                        text3="Checking if dimensions adapt correctly"
                        text2Color="#FFFFFF"
                        text2StrokeColor="#E11D48"
                        text2StrokeWidth="3px"
                        animate={animate}
                    />
                </section>

                {/* 5. Small Scale Test */}
                <section className="w-full flex flex-col items-center">
                    <h2 className="text-sm uppercase tracking-widest text-stone-400 font-bold mb-4">Scaled Down (0.6)</h2>
                    <div className="border border-dashed border-stone-300 p-8 rounded-xl w-full flex justify-center bg-white/50">
                        <KCelebrateSlogan
                            scale={0.6}
                            animate={animate}
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Lobby;

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Lobby />);
}
