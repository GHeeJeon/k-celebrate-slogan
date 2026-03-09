export const isMobile = () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

export const executeDownloadOrShare = async (
    data: string | Blob | Uint8Array | ArrayBuffer,
    filename: string,
    mimeType: string
): Promise<{ success: boolean }> => {
    let blob: Blob;

    if (typeof data === 'string') {
        const res = await fetch(data);
        blob = await res.blob();
    } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
        blob = new Blob([data as any], { type: mimeType });
    } else {
        blob = data;
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
                console.warn('Share API failed or user cancelled, falling back to saveAs', err);
            }
        }
    }

    // Fallback or PC Environment
    const { saveAs } = await import('file-saver');
    saveAs(blob, filename);
    return { success: true };
};
