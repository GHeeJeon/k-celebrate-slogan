import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import KCelebrateSlogan from './KCelebrateSlogan';
import { PASTEL_THEME, NEON_THEME } from './themes';

const Card = ({
    title,
    desc,
    children,
}: {
    title: string;
    desc?: string;
    children: React.ReactNode;
}) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-[0.72rem] font-bold tracking-wider uppercase text-[#1c89bf]">
                {title}
            </span>
            {desc && <span className="text-[0.7rem] text-slate-400 font-mono">{desc}</span>}
        </div>
        <div className="py-6 px-4 bg-slate-50 flex items-center justify-center min-h-[160px] relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#1c89bf 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />
            <div className="relative z-10 w-full flex justify-center items-center">{children}</div>
        </div>
    </div>
);

const Lobby: React.FC = () => {
    const [animate, setAnimate] = useState(true);

    return (
        <div className="relative w-full min-h-screen bg-[#f0f6fa] text-slate-900 p-8 font-sans">
            <header className="mb-8 flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-[1.4rem] font-bold text-[#1c89bf] mb-1">
                        🎉 React Component Demo
                    </h1>
                    <p className="text-[0.85rem] text-slate-500">
                        KCelebrateSlogan 라이브러리의 다양한 적용 예시 (로비)
                    </p>
                </div>
                <button
                    onClick={() => setAnimate((prev) => !prev)}
                    className="px-5 py-2.5 bg-[#1c89bf] text-white rounded-full text-sm font-bold shadow-[0_4px_12px_rgba(28,137,191,0.4)] hover:bg-sky-600 transition-colors"
                >
                    Toggle Animation: {animate ? 'ON' : 'OFF'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card title="기본 (DEFAULT)" desc="text1=축하합니다, text2=김준호">
                    <KCelebrateSlogan animate={animate} />
                </Card>

                <Card title="영문 (PASTEL)" desc="text1=Happy Birthday, theme=pastel">
                    <KCelebrateSlogan
                        text1="Happy Birthday"
                        text2="Dear Friend"
                        text3="With Best Wishes"
                        text1Color="#FF6B6B"
                        text2Color="#4ECDC4"
                        pinwheelColors={PASTEL_THEME}
                        animate={animate}
                    />
                </Card>

                <Card title="네온 (NEON)" desc="text1=GRAND OPENING, theme=neon">
                    <KCelebrateSlogan
                        text1="GRAND OPENING"
                        text2="NIGHT CLUB"
                        text3="Tonight Only ..."
                        text1Color="#FF00FF"
                        text2Color="#00FFFF"
                        text3Color="#FFFFFF"
                        pinwheelColors={NEON_THEME}
                        animate={animate}
                    />
                </Card>

                <Card title="스케일 0.7" desc="scale=0.7">
                    <KCelebrateSlogan scale={0.7} animate={animate} />
                </Card>

                <Card title="긴 이름" desc="text2=이름이매우긴사람">
                    <KCelebrateSlogan
                        text1="축하합니다"
                        text2="이름이매우긴사람"
                        text3="아무 이유 없음"
                        animate={animate}
                    />
                </Card>

                <Card title="EMBLEMSCALE 0.5" desc="emblemScale=0.5">
                    <KCelebrateSlogan
                        text1="축하합니다"
                        text2="홍길동"
                        text3="기념일 ..."
                        emblemScale={0.5}
                        animate={animate}
                    />
                </Card>

                <Card title="애니메이션 OFF" desc="animate=false">
                    <KCelebrateSlogan animate={false} />
                </Card>

                <Card title="스트로크 커스텀" desc="text2StrokeColor, strokeWidth">
                    <KCelebrateSlogan
                        text1="Congratulations"
                        text2="John Doe"
                        text3="For no reason"
                        text2StrokeColor="#EF4444"
                        text2StrokeWidth="4px"
                        animate={animate}
                    />
                </Card>
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
