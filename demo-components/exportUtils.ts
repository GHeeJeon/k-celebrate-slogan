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
    texts: { t1: string; t2: string; t3: string },
    filename: string = 'slogan.svg'
) => {
    try {
        const clone = node.cloneNode(true) as HTMLElement;
        const width = node.offsetWidth;
        const height = node.offsetHeight;

        // 1. Optimization: Collect unique characters for dynamic Google Font subsetting.
        const staticChars = '경축'; // Fixed characters in emblem
        const combinedText = staticChars + texts.t1 + texts.t2 + texts.t3;
        const uniqueChars = Array.from(new Set(combinedText.split(''))).join('');
        const encodedText = encodeURIComponent(uniqueChars);

        // 2. Style Extraction: Capture relevant CSS rules and keyframe animations.
        let cssRules = '';
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                const rules = Array.from(sheet.cssRules);
                for (const rule of rules) {
                    if (
                        rule instanceof CSSFontFaceRule ||
                        rule instanceof CSSKeyframesRule ||
                        /slogan|text|emblem|pinwheel|celebrate|char/i.test(rule.cssText)
                    ) {
                        cssRules += rule.cssText + '\n';
                    }
                }
            } catch (e) {
                console.warn('Skipping stylesheet due to CORS restrictions:', sheet.href);
            }
        }

        // 3. Font Inlining: Helper to convert font URLs to Base64 data strings.
        const fetchAndInlineFonts = async (url: string) => {
            try {
                const response = await fetch(url, {
                    headers: {
                        // Use a mobile-like UA to get optimized CSS chunks from Google Fonts.
                        'User-Agent':
                            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                    },
                });
                let cssText = await response.text();
                const fontMatches = [...cssText.matchAll(/url\(["']?([^"']+)["']?\)/g)];

                for (const match of fontMatches) {
                    const fontUrl = match[1];
                    const fontRes = await fetch(fontUrl);
                    const fontBlob = await fontRes.blob();
                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(fontBlob);
                    });
                    // Global replacement of font URL with its Base64 data.
                    cssText = cssText.split(fontUrl).join(base64);
                }
                return cssText;
            } catch (err) {
                console.error('Failed to convert font to Base64:', err);
                return '';
            }
        };

        // 4. Resource Preparation: Fetch and inline Google and local custom fonts.
        const googleFontsUrl = `https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@700;800;900&family=Outfit:wght@400;700&display=swap&text=${encodedText}`;
        const googleFontsCss = await fetchAndInlineFonts(googleFontsUrl);

        const joseonRes = await fetch(
            'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff'
        );
        const joseonBlob = await joseonRes.blob();
        const joseonBase64 = await new Promise<string>((r) => {
            const reader = new FileReader();
            reader.onloadend = () => r(reader.result as string);
            reader.readAsDataURL(joseonBlob);
        });

        // 5. XML Serialization: Convert HTML clone to a valid XML string for SVG compatibility.
        const serializer = new XMLSerializer();
        const xhtmlContent = serializer.serializeToString(clone);

        // 6. SVG Assembly: Wrap content in CDATA to protect special characters from XML parsers.
        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; margin: 0; padding: 0;">
            <style type="text/css">
            /* <![CDATA[ */
                @font-face { 
                    font-family: 'JoseonPalace'; 
                    src: url('${joseonBase64}') format('woff'); 
                    font-display: block; 
                }
                ${googleFontsCss}
                ${cssRules}
                
                * { 
                    box-sizing: border-box; 
                    -webkit-font-smoothing: antialiased; 
                    text-rendering: optimizeLegibility; 
                }
                .k-celebrate-slogan-container { 
                    width: 100% !important; 
                    height: 100% !important; 
                    margin: 0 !important; 
                }
                .k-celebrate-slogan-container > div { 
                    border: none !important; 
                    box-shadow: none !important; 
                }
            /* ]]> */
            </style>
            ${xhtmlContent}
        </div>
    </foreignObject>
</svg>`.trim();

        // 7. Finalization: Create Blob and trigger the download/share sequence.
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        return await executeDownloadOrShare(blob, filename, 'image/svg+xml');
    } catch (err) {
        console.error('Critical error during SVG export generation:', err);
        return { success: false };
    }
};
