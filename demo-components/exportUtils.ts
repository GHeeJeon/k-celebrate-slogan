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

        // 3. Extract Styles & Keyframes
        let cssRules = '';
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                const rules = Array.from(sheet.cssRules);
                for (const rule of rules) {
                    // We specifically want keyframes and general slogan styles
                    if (
                        rule.cssText.includes('k-celebrate') ||
                        rule.cssText.includes('text1-style') ||
                        rule.cssText.includes('text2-style') ||
                        rule.cssText.includes('text3-style') ||
                        rule.cssText.includes('pinwheel') ||
                        rule instanceof CSSKeyframesRule
                    ) {
                        cssRules += rule.cssText + '\n';
                    }
                }
            } catch {
                // Ignore cross-origin stylesheet errors
                console.warn('Skipped stylesheet due to CORS:', sheet.href);
            }
        }

        // 4. Inline Web Fonts (Base64 encoding for reliability in SVG)
        // For Google Fonts (Nanum Myeongjo, Outfit), we ideally fetch their WOFF2,
        // but for now we focus on the most critical custom font: JoseonPalace.
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

        // 5. Construct SVG String
        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%;">
            <style>
                /* Embedded Font */
                ${joseonBase64}
                
                /* Standard Google Fonts (External) */
                /* Escaped & to &amp; for XML parsing compatibility */
                @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&amp;family=Outfit:wght@100..900&amp;display=swap');
                
                ${cssRules}
                
                /* Layout Fixes for SVG Context */
                .k-celebrate-slogan-container { width: 100% !important; height: 100% !important; margin: 0 !important; }
                .k-celebrate-slogan-container > div { border: none !important; box-shadow: none !important; }
            </style>
            ${clone.outerHTML}
        </div>
    </foreignObject>
</svg>`.trim();

        // 6. Create Blob and Download
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        return await executeDownloadOrShare(blob, filename, 'image/svg+xml');
    } catch (err) {
        console.error('Animated SVG export failed:', err);
        return { success: false };
    }
};
