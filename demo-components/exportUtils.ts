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

    if (isMobile()) {
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
                // Fall down to step 2
            }
        }

        // Step 2: Long-press Modal Fallback
        // On iOS Safari, long pressing a Data URL works best for saving images.
        return {
            success: false,
            requiresFallback: true,
            fallbackUrl: dataUrl,
        };
    }

    // PC Environment
    const { saveAs } = await import('file-saver');
    saveAs(blob, filename);
    return { success: true };
};
