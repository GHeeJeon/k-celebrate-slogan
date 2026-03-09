export const isMobile = () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

export const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export interface DownloadResult {
    success: boolean;
    requiresFallback?: boolean;
    fallbackUrl?: string;
}

export const executeDownloadOrShare = async (
    data: string | Blob | Uint8Array | ArrayBuffer,
    filename: string,
    mimeType: string
): Promise<DownloadResult> => {
    let blob: Blob;
    let dataUrl: string;

    if (typeof data === 'string') {
        const res = await fetch(data);
        blob = await res.blob();
        dataUrl = data;
    } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
        blob = new Blob([data as any], { type: mimeType });
        dataUrl = await blobToDataURL(blob);
    } else {
        blob = data;
        dataUrl = await blobToDataURL(blob);
    }

    if (isMobile() && mimeType !== 'image/svg+xml') {
        const file = new File([blob], filename, { type: mimeType });

        // Step 1: Web Share API
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: filename,
                });
                return { success: true };
            } catch (err) {
                console.warn('Share API failed or user cancelled, falling back to modal', err);
            }
        }

        // Step 2: Fallback - Long-press Modal (For PNG/JPG)
        return {
            success: false,
            requiresFallback: true,
            fallbackUrl: dataUrl,
        };
    }

    // PC Environment or SVG on Mobile
    const { saveAs } = await import('file-saver');
    saveAs(blob, filename);
    return { success: true };
};

/**
 * Custom SVG Exporter that preserves animations and styles by manually
 * extracting CSS and wrapping the DOM in a foreignObject.
 */
export const exportAnimatedSvg = async (
    node: HTMLElement,
    filename: string = 'slogan.svg'
): Promise<DownloadResult> => {
    try {
        // 1. Clone the node to avoid mutating the live DOM
        const clone = node.cloneNode(true) as HTMLElement;

        // 2. Capture dimensions
        const width = node.offsetWidth;
        const height = node.offsetHeight;

        // 3. Extract Styles, Keyframes & FontFaces
        let cssRules = '';
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                const rules = Array.from(sheet.cssRules);
                for (const rule of rules) {
                    if (
                        rule.cssText.includes('k-celebrate') ||
                        rule.cssText.includes('text1-style') ||
                        rule.cssText.includes('text2-style') ||
                        rule.cssText.includes('text3-style') ||
                        rule.cssText.includes('pinwheel') ||
                        rule instanceof CSSKeyframesRule ||
                        rule instanceof CSSFontFaceRule // Always include font faces
                    ) {
                        cssRules += rule.cssText + '\n';
                    }
                }
            } catch {
                console.warn('Skipped stylesheet due to CORS:', sheet.href);
            }
        }

        // 4. Inline Web Fonts (Base64 encoding for reliability in SVG)
        const embedFont = async (url: string, name: string) => {
            try {
                const res = await fetch(url);
                const blob = await res.blob();
                const reader = new FileReader();
                return new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        const base64 = reader.result as string;
                        resolve(
                            `@font-face { font-family: '${name}'; src: url('${base64}') format('woff'); font-weight: normal; font-display: block; }\n`
                        );
                    };
                    reader.readAsDataURL(blob);
                });
            } catch (err) {
                console.error('Font embedding failed:', url, err);
                return '';
            }
        };

        const joseonBase64 = await embedFont(
            'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff',
            'JoseonPalace'
        );

        // 5. [Crucial] Inline Google Fonts (Nanum Myeongjo, Outfit)
        const inlineGoogleFonts = async (googleFontsUrl: string) => {
            try {
                const response = await fetch(googleFontsUrl, {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    },
                });
                let cssText = await response.text();
                const fontUrls = cssText.match(/url\([^)]+\)/g) || [];

                for (const urlMatch of fontUrls) {
                    const url = urlMatch.replace(/url\(["']?([^"']+)["']?\)/, '$1');
                    const fontRes = await fetch(url);
                    const fontBlob = await fontRes.blob();
                    const reader = new FileReader();
                    const base64 = await new Promise<string>((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(fontBlob);
                    });
                    // Use split/join for reliable global replacement
                    cssText = cssText.split(url).join(base64);
                }
                return cssText;
            } catch (err) {
                console.error('Google Fonts inlining failed:', err);
                return ''; // No fallback to @import to avoid mobile SVG blocks
            }
        };

        const googleFontsCss = await inlineGoogleFonts(
            'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@700;800;900&family=Outfit:wght@400;600;700&display=swap'
        );

        // 6. [Crucial] Convert HTML to XML-compatible format
        const serializer = new XMLSerializer();
        const xhtmlContent = serializer.serializeToString(clone);

        // 7. [Crucial] Construct SVG String using CDATA for styles (Self-contained)
        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; margin: 0; padding: 0;">
            <style type="text/css">
            /* <![CDATA[ */
                ${joseonBase64}
                ${googleFontsCss}
                ${cssRules}
                
                /* Global resets for SVG foreignObject context */
                * { box-sizing: border-box; }
                
                .k-celebrate-slogan-container { 
                    width: 100% !important; 
                    height: 100% !important; 
                    margin: 0 !important; 
                    font-size: 16px !important; /* Base for rem calculations */
                }
                .k-celebrate-slogan-container > div { border: none !important; box-shadow: none !important; }
            /* ]]> */
            </style>
            ${xhtmlContent}
        </div>
    </foreignObject>
</svg>`.trim();

        // 8. Create Blob and Download
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        return await executeDownloadOrShare(blob, filename, 'image/svg+xml');
    } catch (err) {
        console.error('Animated SVG export failed:', err);
        return { success: false };
    }
};
