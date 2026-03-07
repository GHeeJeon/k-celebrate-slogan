import React, { useState } from 'react';
import { ACCENT } from './types';

export interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
}
export const Label: React.FC<LabelProps> = ({ children, htmlFor }) => (
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
}
export const TextInput: React.FC<TextInputProps> = ({ id, value, onChange, placeholder }) => (
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
        }}
    />
);

export interface ColorRowProps {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
}
export const ColorRow: React.FC<ColorRowProps> = ({ id, label, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <Label htmlFor={id}>{label}</Label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
                id={id}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
            <TextInput id={`${id}-text`} value={value} onChange={onChange} />
        </div>
    </div>
);

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
                    padding: '1rem',
                    fontSize: '0.8rem',
                    color: '#0369a1',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    lineHeight: 1.6,
                    margin: 0,
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
}> = ({ title, children, id, style }) => (
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
        <h2
            style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ACCENT,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}
        >
            {title}
        </h2>
        {children}
    </section>
);
