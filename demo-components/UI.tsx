import React, { useState } from 'react';
import { ACCENT } from './types';

export interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    style?: React.CSSProperties;
}
export const Label: React.FC<LabelProps> = ({ children, htmlFor, style }) => (
    <label
        htmlFor={htmlFor}
        style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748b',
            marginBottom: '0.35rem',
            ...style,
        }}
    >
        {children}
    </label>
);

export interface TextInputProps {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    onBlur?: () => void;
}
export const TextInput: React.FC<TextInputProps> = ({
    id,
    value,
    onChange,
    placeholder,
    onBlur,
}) => (
    <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            color: '#0f172a',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={(e) => {
            e.target.style.borderColor = ACCENT;
            e.target.style.boxShadow = `0 0 0 3px ${ACCENT}22`;
        }}
        onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
            if (onBlur) onBlur();
        }}
        onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
        }}
    />
);

export interface ColorRowProps {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    fallbackValue: string;
}
export const ColorRow: React.FC<ColorRowProps> = ({
    id,
    label,
    value,
    onChange,
    fallbackValue,
}) => {
    const [local, setLocal] = React.useState(value);

    React.useEffect(() => {
        setLocal(value);
    }, [value]);

    const handleBlur = () => {
        let v = local.trim();
        if (!v) {
            setLocal(fallbackValue);
            onChange(fallbackValue);
            return;
        }
        if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
            if (/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
                v = '#' + v;
            } else {
                v = value; // Revert if invalid
            }
        }
        setLocal(v);
        onChange(v);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <Label htmlFor={id}>{label}</Label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    id={id}
                    type="color"
                    value={/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(local) ? local : value}
                    onChange={(e) => {
                        const val = e.target.value;
                        setLocal(val);
                        onChange(val);
                    }}
                    style={{
                        width: '2.2rem',
                        height: '2.2rem',
                        padding: '0.1rem',
                        borderRadius: '0.4rem',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        background: 'transparent',
                        flexShrink: 0,
                    }}
                />
                <TextInput
                    id={`${id}-text`}
                    value={local}
                    onChange={setLocal}
                    onBlur={handleBlur}
                />
            </div>
        </div>
    );
};

export interface SliderRowProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
}
export const SliderRow: React.FC<SliderRowProps> = ({
    id,
    label,
    value,
    min,
    max,
    step,
    onChange,
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Label htmlFor={id}>{label}</Label>
            <span style={{ fontSize: '0.8rem', color: ACCENT, fontWeight: 700 }}>{value}</span>
        </div>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: ACCENT, cursor: 'pointer' }}
        />
    </div>
);

export interface CopyBlockProps {
    label: string;
    code: string;
}
export const CopyBlock: React.FC<CopyBlockProps> = ({ label, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = code;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div
            style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 1rem',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc',
                }}
            >
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {label}
                </span>
                <button
                    onClick={handleCopy}
                    style={{
                        padding: '0.3rem 0.8rem',
                        background: copied ? '#16a34a' : ACCENT,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        fontFamily: 'inherit',
                    }}
                >
                    {copied ? '✓ Copied!' : 'Copy'}
                </button>
            </div>
            <pre
                style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.75rem',
                    color: '#0369a1',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    maxHeight: '80px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    lineHeight: 1.5,
                    margin: 0,
                    background: '#f8fafc',
                }}
            >
                {code}
            </pre>
        </div>
    );
};

export const Section: React.FC<{
    title: string;
    children: React.ReactNode;
    id?: string;
    style?: React.CSSProperties;
    headerExtra?: React.ReactNode;
}> = ({ title, children, id, style, headerExtra }) => (
    <section
        id={id}
        style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            ...style,
        }}
    >
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
            }}
        >
            <h2
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0,
                }}
            >
                {title}
            </h2>
            {headerExtra}
        </div>
        {children}
    </section>
);

export interface LongPressModalProps {
    isOpen: boolean;
    imageUrl: string;
    onClose: () => void;
}

export const LongPressModal: React.FC<LongPressModalProps> = ({ isOpen, imageUrl, onClose }) => {
    const [isSharing, setIsSharing] = React.useState(false);

    // [Temporary] Always show for styling preview
    const showForPreview = true;
    if (!isOpen && !showForPreview) return null;

    const handleShare = async () => {
        if (!imageUrl) return;
        setIsSharing(true);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            // Determine extension from mime type or default to gif
            const mime = blob.type || 'image/gif';
            const ext = mime.split('/')[1]?.split(';')[0] || 'gif';
            const filename = `slogan.${ext}`;
            const file = new File([blob], filename, { type: mime });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: filename,
                });
            } else {
                // Fallback to direct download for PC or unsupported mobile browsers
                const { saveAs } = await import('file-saver');
                saveAs(blob, filename);
            }
        } catch (err) {
            console.error('Share/Save failed:', err);
            alert('An error occurred. Please try long pressing the image to save.');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
            }}
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                style={{
                    backgroundColor: '#ffffff',
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    width: '80%',
                    maxWidth: '800px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visually Hidden Title and Description for Accessibility (Radix-style) */}
                <h2
                    id="modal-title"
                    style={{
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        border: '0',
                    }}
                >
                    Export Success
                </h2>
                <p
                    id="modal-desc"
                    style={{
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        border: '0',
                    }}
                >
                    Your slogan has been generated. You can save it by long pressing the image or
                    clicking the save button.
                </p>

                <div style={{ textAlign: 'center' }}>
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 800,
                            color: '#0f172a',
                            fontSize: '2rem',
                        }}
                    >
                        🎉 Success!
                    </p>
                    <p
                        style={{
                            margin: '0.75rem 0 0',
                            color: '#475569',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                        }}
                    >
                        Tap <strong>Save</strong> or <strong>Long Press</strong> the image
                        <br />
                        to save to your photos.
                    </p>
                </div>

                <div
                    style={{
                        position: 'relative',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        width: '100%',
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Generated Slogan"
                        style={{
                            width: '100%',
                            maxHeight: '65vh',
                            display: 'block',
                            WebkitTouchCallout: 'default',
                            userSelect: 'none',
                        }}
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1rem',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        style={{
                            width: '45%',
                            padding: '0.6rem 1rem',
                            backgroundColor: ACCENT,
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '0.4rem',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            opacity: isSharing ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: `0 4px 6px -1px ${ACCENT}44`,
                        }}
                    >
                        {isSharing ? 'Processing...' : '💾 Save'}
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            width: '45%',
                            padding: '0.6rem 1rem',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            border: 'none',
                            borderRadius: '0.4rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
