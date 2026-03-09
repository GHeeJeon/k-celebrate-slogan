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
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    padding: '1rem',
                    borderRadius: '1rem',
                    maxWidth: '100%',
                    boxShadow:
                        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inner modal box
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                        이미지 저장하기
                    </p>
                    <p style={{ margin: '0.4rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                        아래 이미지를 <strong>길게 눌러</strong> 갤러리/사진 앱에 저장하세요.
                    </p>
                </div>

                <div
                    style={{
                        position: 'relative',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Generated Slogan"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '60vh',
                            display: 'block',
                            WebkitTouchCallout: 'default', // Extremely important for iOS Safari menu
                            userSelect: 'none',
                        }}
                    />
                </div>

                <button
                    onClick={onClose}
                    style={{
                        padding: '0.6rem 1.5rem',
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        border: 'none',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '0.5rem',
                        width: '100%',
                    }}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};
