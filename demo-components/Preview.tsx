import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { encode } from 'modern-gif';
import { saveAs } from 'file-saver';
import { Config, ACCENT, ACCENT_DARK } from './types';
import { Section } from './UI';
import KCelebrateSlogan from '../KCelebrateSlogan';
import { PASTEL_THEME, NEON_THEME } from '../themes';

function getPinwheelColors(theme: Config['pinwheelTheme']): string[] | undefined {
    if (theme === 'pastel') return PASTEL_THEME;
    if (theme === 'neon') return NEON_THEME;
    return undefined;
}

interface Props {
    cfg: Config;
    animKey: number;
    replayAnim: () => void;
}

export const Preview = React.forwardRef<HTMLDivElement, Props>(
    ({ cfg, animKey, replayAnim }, ref) => {
        const [isExporting, setIsExporting] = useState<string | null>(null);

        const handleExport = async (format: 'jpg' | 'png' | 'svg' | 'gif') => {
            // ref is a forwardRef, we need to access its current value.
            // Since it's passed from parent as sloganRef, we expect it to be a RefObject.
            const node = (ref as React.RefObject<HTMLDivElement>).current;
            if (!node) return;

            setIsExporting(format);

            try {
                const filename = `slogan.${format}`;
                const filter = () => true;

                if (format === 'jpg') {
                    const dataUrl = await htmlToImage.toJpeg(node, {
                        quality: 0.95,
                        backgroundColor: '#ffffff',
                        filter,
                    });
                    saveAs(dataUrl, filename);
                } else if (format === 'png') {
                    const dataUrl = await htmlToImage.toPng(node, { filter });
                    saveAs(dataUrl, filename);
                } else if (format === 'svg') {
                    const dataUrl = await htmlToImage.toSvg(node, { filter });
                    saveAs(dataUrl, filename);
                } else if (format === 'gif') {
                    const durationMs = 4000;
                    const fps = 10;
                    const msPerFrame = 1000 / fps;
                    const frameCount = Math.floor(durationMs / msPerFrame);

                    const framesData = [];
                    let width = 0;
                    let height = 0;

                    for (let i = 0; i < frameCount; i++) {
                        const canvas = await htmlToImage.toCanvas(node, {
                            backgroundColor: '#ffffff',
                            filter,
                        });
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            width = canvas.width;
                            height = canvas.height;
                            framesData.push({ data: canvas, delay: msPerFrame });
                        }
                        await new Promise((r) => setTimeout(r, msPerFrame));
                    }

                    if (framesData.length > 0 && width > 0 && height > 0) {
                        const buffer = await encode({
                            workerUrl: undefined,
                            width,
                            height,
                            frames: framesData,
                        });
                        const blob = new Blob([buffer], { type: 'image/gif' });
                        saveAs(blob, filename);
                    }
                }
            } catch (err) {
                console.error('Export error:', err);
                alert('Failed to export. Check console for details.');
            } finally {
                setIsExporting(null);
            }
        };

        return (
            <Section
                title="👁️ Preview"
                id="preview"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <div
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        padding: '3rem 2rem 2rem',
                        position: 'relative',
                        overflowX: 'auto',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
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

                    {/* Slogan Container */}
                    <div
                        key={animKey}
                        ref={ref}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'center',
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

                    {/* Replay Button */}
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

                {/* Export Buttons */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                        marginTop: '1.25rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px dotted #e2e8f0',
                    }}
                >
                    {(['jpg', 'png', 'svg', 'gif'] as const).map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => handleExport(fmt)}
                            disabled={isExporting !== null}
                            style={{
                                padding: '0.5rem 0.9rem',
                                background: isExporting === fmt ? '#f1f5f9' : '#fff',
                                color: isExporting === fmt ? '#94a3b8' : ACCENT,
                                border: `1px solid ${isExporting === fmt ? '#e2e8f0' : ACCENT + '44'}`,
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: isExporting !== null ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                fontFamily: 'inherit',
                                textTransform: 'uppercase',
                                minWidth: '85px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isExporting) {
                                    e.currentTarget.style.background = ACCENT;
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.borderColor = ACCENT;
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isExporting) {
                                    e.currentTarget.style.background = '#fff';
                                    e.currentTarget.style.color = ACCENT;
                                    e.currentTarget.style.borderColor = ACCENT + '44';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {isExporting === fmt ? 'Saving...' : `Save ${fmt}`}
                        </button>
                    ))}
                </div>
            </Section>
        );
    }
);
Preview.displayName = 'Preview';
