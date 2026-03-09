import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { domToCanvas, domToJpeg, domToPng } from 'modern-screenshot';
import { encode } from 'modern-gif';
import { Config, ACCENT, ACCENT_DARK } from './types';
import { Section } from './UI';
import { executeDownloadOrShare } from './exportUtils';
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
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

export const Preview = React.forwardRef<HTMLDivElement, Props>(
    ({ cfg, animKey, replayAnim, set }, ref) => {
        const exportRef = React.useRef<HTMLDivElement>(null);
        const [isExporting, setIsExporting] = useState<string | null>(null);
        const [exportProgress, setExportProgress] = useState<number>(0);
        const [gifFps, setGifFps] = useState<number>(10);

        const handleExport = async (format: 'jpg' | 'png' | 'svg' | 'gif') => {
            const node = exportRef.current;
            if (!node) return;

            setIsExporting(format);
            setExportProgress(0);

            // Use requestAnimationFrame to let React apply 'isExporting' to the DOM instead of setTimeout (which kills Share API gesture tokens)
            await new Promise<void>((r) =>
                requestAnimationFrame(() => requestAnimationFrame(() => r()))
            );
            // Ensure fonts and styles are loaded
            await document.fonts.ready;

            try {
                const filename = `slogan.${format}`;
                const filter = (el: Node) => {
                    if (!(el instanceof HTMLElement)) return true;
                    return !el.classList?.contains('no-export');
                };

                // Explicitly embed critical fonts to bypass CORS issues with html-to-image scanning stylesheets
                const joseonPalaceCSS = `
                    @font-face {
                        font-family: 'JoseonPalace';
                        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff') format('woff');
                        font-weight: normal;
                        font-display: block;
                    }

                    @keyframes pinwheel-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `;

                let combinedCSS = joseonPalaceCSS;
                try {
                    const fontRes = await fetch(
                        'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Outfit:wght@100..900&family=Inter:wght@300;400;500;600;700&display=block'
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
                    scale: 1.5,
                    pixelRatio: 1.5, // modern-screenshot uses 'scale', html-to-image uses 'pixelRatio'
                    fontEmbedCSS: embeddedCSS,
                    skipFonts: true,
                    width,
                    height,
                    style: { margin: '0' },
                };

                // Dummy render to ensure fonts and styles are fully loaded
                await domToCanvas(node, { ...commonOptions, scale: 1 });
                // Another non-gestural-killing tick
                await new Promise<void>((r) => requestAnimationFrame(() => r()));

                // Handle saving with new utility
                const handleSave = async (
                    data: string | Blob | Uint8Array | ArrayBuffer,
                    mimeType: string
                ) => {
                    await executeDownloadOrShare(data, filename, mimeType);
                };

                if (format === 'jpg') {
                    setExportProgress(30);
                    const dataUrl = await domToJpeg(node, {
                        ...commonOptions,
                        quality: 0.95,
                    });
                    setExportProgress(100);
                    await handleSave(dataUrl, 'image/jpeg');
                } else if (format === 'png') {
                    setExportProgress(30);
                    const dataUrl = await domToPng(node, commonOptions);
                    setExportProgress(100);
                    await handleSave(dataUrl, 'image/png');
                } else if (format === 'svg') {
                    setExportProgress(50);
                    const dataUrl = await htmlToImage.toSvg(node, commonOptions);

                    let svgData = decodeURIComponent(dataUrl.split(',')[1]);

                    if (!svgData.startsWith('<?xml')) {
                        svgData = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgData;
                    }

                    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

                    setExportProgress(100);
                    // Standard download for SVG regardless of OS (Share usually fails this)
                    const { saveAs } = await import('file-saver');
                    saveAs(blob, filename);
                } else if (format === 'gif') {
                    const durationMs = 4000;
                    const fps = gifFps;
                    const msPerFrame = 1000 / fps;
                    const frameCount = cfg.animate ? Math.floor(durationMs / msPerFrame) : 1;

                    const framesData = [];
                    let width = 0;
                    let height = 0;

                    // Lower pixel ratio for faster GIF encoding
                    const gifOptions = { ...commonOptions, scale: 1 };

                    // Find pinwheels to manually rotate them
                    const pinwheels = node.querySelectorAll(
                        '.k-celebrate-pinwheel'
                    ) as NodeListOf<HTMLElement>;

                    for (let i = 0; i < frameCount; i++) {
                        const progress = i / frameCount;
                        const degrees = cfg.animate ? progress * 360 : 0;

                        pinwheels.forEach((pw) => {
                            const isReverse = pw.getAttribute('data-reverse') === 'true';
                            // Remove classes to ensure CSS transition/animation doesn't override manual transform
                            pw.classList.remove(
                                'k-pinwheel-animated',
                                'k-pinwheel-animated-reverse'
                            );
                            pw.style.transform = `rotate(${isReverse ? -degrees : degrees}deg)`;
                        });

                        const canvas = await domToCanvas(node, gifOptions);
                        if (i === 0) {
                            width = canvas.width;
                            height = canvas.height;
                        }
                        framesData.push({ data: canvas, delay: msPerFrame });
                        setExportProgress(Math.floor((i / frameCount) * 85));

                        // Yield thread purely with RequestAnimationFrame instead of setTimeout to attempt preserving user activation token
                        if (i % 5 === 0)
                            await new Promise<void>((r) => requestAnimationFrame(() => r()));
                    }

                    // Restore pinwheels for potential subsequent exports or if node reused
                    pinwheels.forEach((pw) => {
                        const isReverse = pw.getAttribute('data-reverse') === 'true';
                        if (cfg.animate) {
                            pw.classList.add(
                                isReverse ? 'k-pinwheel-animated-reverse' : 'k-pinwheel-animated'
                            );
                        }
                        pw.style.transform = '';
                    });

                    if (framesData.length > 0) {
                        const buffer = await encode({
                            workerUrl: undefined,
                            width,
                            height,
                            frames: framesData,
                        });
                        await handleSave(buffer, 'image/gif');
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
                headerExtra={
                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer',
                            padding: '0.3rem 0.6rem',
                            background: '#f1f5f9',
                            borderRadius: '2rem',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            userSelect: 'none',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={cfg.animate}
                            onChange={(e) => set('animate', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                        <span style={{ color: cfg.animate ? ACCENT : '#64748b' }}>
                            Animation {cfg.animate ? 'ON' : 'OFF'}
                        </span>
                    </label>
                }
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0, // Prevents flex container from expanding past viewport
                    maxWidth: '100%',
                }}
            >
                <div
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        padding: '2rem 1rem',
                        position: 'relative',
                        overflowX: 'auto', // Triggers local scrollbar
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '220px',
                        width: '100%', // Prevents inner content from pushing parent
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

                    {isExporting && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(255,255,255,0.85)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '0.75rem',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: `3px solid ${ACCENT}22`,
                                    borderTop: `3px solid ${ACCENT}`,
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginBottom: '1rem',
                                }}
                            />
                            <style>{`
                                @keyframes spin {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: ACCENT }}>
                                Exporting {isExporting.toUpperCase()}...
                            </span>
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#64748b',
                                    marginTop: '0.25rem',
                                }}
                            >
                                {exportProgress}%
                            </span>
                        </div>
                    )}

                    {/* Slogan Container (Display - Normal View) */}
                    <div
                        key={animKey}
                        ref={ref}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            margin: '0 auto',
                            width: 'max-content',
                            padding: '1.5rem',
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
                            exportMode={false} // NEVER export mode on the display version
                        />
                    </div>

                    {/* Slogan Container (Hidden - Used for pure 1:1 image exporting) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0,
                            overflow: 'hidden',
                            opacity: 0.001,
                            zIndex: -1,
                            pointerEvents: 'none',
                        }}
                    >
                        <div
                            ref={exportRef}
                            style={{
                                padding: 0, // Removed 1.5rem padding to avoid blank space outside the border
                                width: 'max-content',
                                backgroundColor: '#ffffff',
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
                                animate={cfg.animate} // Pinwheel spins via CSS!
                                pinwheelColors={getPinwheelColors(cfg.pinwheelTheme)}
                                exportMode={true} // Forces exact scale proportions
                            />
                        </div>
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
                    className="export-btns"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        flexWrap: 'nowrap',
                        marginTop: exportProgress > 0 ? '0.6rem' : '1rem',
                        paddingTop: exportProgress > 0 ? '0' : '1rem',
                        borderTop: exportProgress > 0 ? 'none' : '1px dotted #e2e8f0',
                        overflowX: 'auto',
                        paddingBottom: '0.25rem',
                        scrollbarWidth: 'none',
                    }}
                >
                    {(['jpg', 'png', 'svg', 'gif'] as const).map((fmt) => (
                        <div
                            key={fmt}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
                        >
                            <button
                                onClick={() => handleExport(fmt)}
                                disabled={isExporting !== null}
                                className="export-btn"
                                style={{
                                    padding: '0.4rem 0.6rem',
                                    background: isExporting === fmt ? '#f1f5f9' : '#fff',
                                    color: isExporting === fmt ? '#94a3b8' : ACCENT,
                                    border: `1px solid ${isExporting === fmt ? '#e2e8f0' : ACCENT + '44'}`,
                                    borderRadius: '0.4rem',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    cursor: isExporting !== null ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    fontFamily: 'inherit',
                                    textTransform: 'uppercase',
                                    minWidth: '70px',
                                    flexShrink: 0,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isExporting) {
                                        e.currentTarget.style.background = ACCENT;
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = ACCENT;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isExporting) {
                                        e.currentTarget.style.background = '#fff';
                                        e.currentTarget.style.color = ACCENT;
                                        e.currentTarget.style.borderColor = ACCENT + '44';
                                    }
                                }}
                            >
                                {isExporting === fmt ? '...' : `Save ${fmt}`}
                            </button>
                            {fmt === 'gif' && (
                                <select
                                    value={gifFps}
                                    onChange={(e) => setGifFps(Number(e.target.value))}
                                    disabled={isExporting !== null}
                                    style={{
                                        fontSize: '0.6rem',
                                        padding: '0.1rem',
                                        borderRadius: '0.2rem',
                                        border: '1px solid #e2e8f0',
                                        color: '#64748b',
                                        background: '#fff',
                                        cursor: 'pointer',
                                    }}
                                    title="GIF FPS"
                                >
                                    {[20, 15, 10, 5].map((fps) => (
                                        <option key={fps} value={fps}>
                                            {fps} FPS
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            </Section>
        );
    }
);
Preview.displayName = 'Preview';
