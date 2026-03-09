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
        const clone = node.cloneNode(true) as HTMLElement;
        const width = node.offsetWidth;
        const height = node.offsetHeight;

        // 1. [개선] 스타일 추출 범위 확대 (엠블럼 및 공통 스타일 포함)
        let cssRules = '';
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                const rules = Array.from(sheet.cssRules);
                for (const rule of rules) {
                    const txt = rule.cssText;
                    if (
                        rule instanceof CSSFontFaceRule ||
                        rule instanceof CSSKeyframesRule ||
                        // 'emblem' 키워드 추가하여 '경', '축' 스타일 확보
                        /slogan|text|emblem|pinwheel|celebrate|char/i.test(txt)
                    ) {
                        cssRules += txt + '\n';
                    }
                }
            } catch (e) {
                console.warn('CORS 이슈로 스타일 시트 스킵:', sheet.href);
            }
        }

        // 2. [개선] 폰트 인라이닝 (모든 조각/Subset 대응)
        const fetchAndInlineFonts = async (url: string) => {
            try {
                const response = await fetch(url, {
                    headers: {
                        // 최신 브라우저 UA를 사용해야 최적화된 조각 데이터(CSS)를 반환받음
                        'User-Agent':
                            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                    },
                });
                let cssText = await response.text();

                // CSS 내의 모든 url()을 찾아 Base64로 변환
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
                    cssText = cssText.split(fontUrl).join(base64);
                }
                return cssText;
            } catch (err) {
                console.error('폰트 변환 실패:', err);
                return '';
            }
        };

        // 한글 폰트는 용량이 크므로 필요한 Weight만 정확히 타겟팅
        const googleFontsCss = await fetchAndInlineFonts(
            'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@700;800;900&family=Outfit:wght@400;700&display=swap'
        );

        // 조선궁서체(커스텀) 처리
        const joseonRes = await fetch(
            'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff'
        );
        const joseonBlob = await joseonRes.blob();
        const joseonBase64 = await new Promise<string>((r) => {
            const reader = new FileReader();
            reader.onloadend = () => r(reader.result as string);
            reader.readAsDataURL(joseonBlob);
        });

        const serializer = new XMLSerializer();
        const xhtmlContent = serializer.serializeToString(clone);

        // 3. [중요] 스타일 태그 내 폰트 우선 순위 및 렌더링 옵션 조정
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
                
                /* SVG 렌더링 가독성 향상 */
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
            /* ]]> */
            </style>
            ${xhtmlContent}
        </div>
    </foreignObject>
</svg>`.trim();

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        return await executeDownloadOrShare(blob, filename, 'image/svg+xml');
    } catch (err) {
        console.error('SVG 저장 실패:', err);
        return { success: false };
    }
};
