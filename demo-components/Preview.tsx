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

// Global cache for font base64 to avoid refetching on every export
const fontBase64Cache = new Map<string, string>();

const fetchAndEncodeFont = async (url: string): Promise<string> => {
    if (fontBase64Cache.has(url)) return fontBase64Cache.get(url)!;
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                fontBase64Cache.set(url, base64);
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn('Failed to encode font:', url, e);
        return url; // fallback to original url
    }
};

const getBase64CSS = async (cssText: string): Promise<string> => {
    const urlRegex = /url\((['"]?)(.*?)\1\)/g;
    let match;
    let result = cssText;
    const urls: string[] = [];

    while ((match = urlRegex.exec(cssText)) !== null) {
        urls.push(match[2]);
    }

    // Process all URLs in parallel
    const encodingPromises = urls.map(async (url) => {
        const base64 = await fetchAndEncodeFont(url);
        return { url, base64 };
    });

    const encodedUrls = await Promise.all(encodingPromises);

    // Replace urls with base64
    for (const { url, base64 } of encodedUrls) {
        result = result
            .split(`url('${url}')`)
            .join(`url('${base64}')`)
            .split(`url("${url}")`)
            .join(`url('${base64}')`)
            .split(`url(${url})`)
            .join(`url('${base64}')`);
    }

    return result;
};

interface Props {
    cfg: Config;
    animKey: number;
    replayAnim: () => void;
}

export const Preview = React.forwardRef<HTMLDivElement, Props>(
    ({ cfg, animKey, replayAnim }, ref) => {
        const [isExporting, setIsExporting] = useState<string | null>(null);
        const [exportProgress, setExportProgress] = useState<number>(0);

        const handleExport = async (format: 'jpg' | 'png' | 'svg' | 'gif') => {
            const node = (ref as React.RefObject<HTMLDivElement>).current;
            if (!node) return;

            setIsExporting(format);
            setExportProgress(0);

            // Wait for React to apply 'isExporting' rules to the DOM (like removing padding and restoring scale: 1)
            await new Promise((r) => setTimeout(r, 150));

            try {
                const filename = `slogan.${format}`;
                const filter = (el: HTMLElement) => !el.classList?.contains('no-export');

                // Explicitly embed critical fonts to bypass CORS issues with html-to-image scanning stylesheets
                const joseonPalaceCSS = `
                    @font-face {
                        font-family: 'JoseonPalace';
                        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff') format('woff');
                        font-weight: normal;
                        font-display: swap;
                    }
                `;

                let combinedCSS = joseonPalaceCSS;
                try {
                    const fontRes = await fetch(
                        'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Outfit:wght@100..900&family=Inter:wght@300;400;500;600;700&display=swap'
                    );
                    if (fontRes.ok) {
                        combinedCSS += await fontRes.text();
                    }
                } catch (e) {
                    console.warn('Failed to fetch Google Fonts CSS', e);
                }

                // Convert all external URLs in the CSS to base64 to prevent canvas taint issues
                const embeddedCSS = await getBase64CSS(combinedCSS);

                // Capture the exact layout dimensions to prevent html-to-image from miscalculating
                // the bounding box due to spinning CSS animations inside the node.
                const width = node.offsetWidth;
                const height = node.offsetHeight;

                const commonOptions = {
                    backgroundColor: '#ffffff',
                    filter,
                    pixelRatio: 1.5, // Balance quality and speed
                    fontEmbedCSS: embeddedCSS,
                    width,
                    height,
                    style: { margin: '0' },
                };

                // Dummy render to ensure fonts and styles are fully loaded and cached in html-to-image
                // This prevents FOUT (Flash of Unstyled Text) across all export formats, not just GIF.
                await htmlToImage.toCanvas(node, { ...commonOptions, pixelRatio: 1 });

                // Wait an extra tick to ensure the browser has fully processed the injected CSS from the dummy render
                await new Promise((r) => setTimeout(r, 50));

                if (format === 'jpg') {
                    setExportProgress(30);
                    const dataUrl = await htmlToImage.toJpeg(node, {
                        ...commonOptions,
                        quality: 0.95,
                    });
                    setExportProgress(100);
                    saveAs(dataUrl, filename);
                } else if (format === 'png') {
                    setExportProgress(30);
                    const dataUrl = await htmlToImage.toPng(node, commonOptions);
                    setExportProgress(100);
                    saveAs(dataUrl, filename);
                } else if (format === 'svg') {
                    setExportProgress(50);
                    const dataUrl = await htmlToImage.toSvg(node, commonOptions);

                    // Decode the URI component to handle Korean/UTF-8 characters properly
                    let svgData = decodeURIComponent(dataUrl.split(',')[1]);

                    // QuickLook/Finder on macOS requires the XML UTF-8 declaration to not break Korean characters
                    if (!svgData.startsWith('<?xml')) {
                        svgData = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgData;
                    }

                    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

                    setExportProgress(100);
                    saveAs(blob, filename);
                } else if (format === 'gif') {
                    // Smoother and longer GIF: 4s total @ 15fps
                    const durationMs = 4000;
                    const fps = 15;
                    const msPerFrame = 1000 / fps;
                    const frameCount = cfg.animate ? Math.floor(durationMs / msPerFrame) : 1;

                    const framesData = [];
                    let width = 0;
                    let height = 0;

                    // Lower pixel ratio for faster GIF encoding
                    const gifOptions = { ...commonOptions, pixelRatio: 1 };

                    // Find pinwheels to manually rotate them since html-to-image freezes CSS animations on clone
                    const pinwheels = node.querySelectorAll(
                        '.k-celebrate-pinwheel'
                    ) as NodeListOf<HTMLElement>;

                    // Backup original animations before overriding them for manual frame advancing
                    const originalAnims: string[] = [];
                    pinwheels.forEach((pw) => {
                        originalAnims.push(pw.style.animation);
                    });

                    for (let i = 0; i < frameCount; i++) {
                        const progress = i / frameCount;
                        const degrees = cfg.animate ? progress * 360 : 0; // Fix Issue 2: respect animate off

                        pinwheels.forEach((pw) => {
                            const isReverse = pw.getAttribute('data-reverse') === 'true';
                            pw.style.animation = 'none'; // Disable CSS
                            pw.style.transform = `rotate(${isReverse ? -degrees : degrees}deg)`;
                        });

                        const canvas = await htmlToImage.toCanvas(node, gifOptions);
                        if (i === 0) {
                            width = canvas.width;
                            height = canvas.height;
                        }
                        framesData.push({ data: canvas, delay: msPerFrame });
                        setExportProgress(Math.floor((i / frameCount) * 85));

                        // Small wait to unblock UI thread occasionally
                        if (i % 5 === 0) await new Promise((r) => setTimeout(r, 10));
                    }

                    // Restore pinwheels
                    pinwheels.forEach((pw, idx) => {
                        pw.style.animation = originalAnims[idx] || '';
                        pw.style.transform = '';
                    });

                    if (framesData.length > 0) {
                        const buffer = await encode({
                            workerUrl: undefined,
                            width,
                            height,
                            frames: framesData,
                        });
                        const blob = new Blob([buffer], { type: 'image/gif' });
                        saveAs(blob, filename);
                    }
                    setExportProgress(100);
                }
            } catch (err) {
                console.error('Export error:', err);
                alert('An error occurred during export. Check terminal/console for details.');
            } finally {
                setIsExporting(null);
                setTimeout(() => setExportProgress(0), 800);
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
                            margin: '0 auto',
                            width: 'max-content',
                            padding: isExporting ? '0.2rem' : '1.5rem',
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
                            exportMode={isExporting !== null}
                        />
                    </div>

                    {/* Replay Button */}
                    <div
                        className="no-export"
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

                {/* Progress Bar */}
                {exportProgress > 0 && (
                    <div
                        style={{
                            marginTop: '1.25rem',
                            height: '2px',
                            background: '#e2e8f0',
                            borderRadius: '1px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${exportProgress}%`,
                                height: '100%',
                                background: ACCENT,
                                transition: 'width 0.2s ease',
                            }}
                        />
                    </div>
                )}

                {/* Export Buttons */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                        marginTop: exportProgress > 0 ? '0.75rem' : '1.25rem',
                        paddingTop: exportProgress > 0 ? '0' : '1.25rem',
                        borderTop: exportProgress > 0 ? 'none' : '1px dotted #e2e8f0',
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
