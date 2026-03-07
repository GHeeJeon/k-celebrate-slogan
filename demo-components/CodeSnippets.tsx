import React from 'react';
import { Config } from './types';
import { Section, CopyBlock } from './UI';

function buildUrl(cfg: Config): string {
    const base = 'https://k-celebrate-slogan.vercel.app/api';
    const params = new URLSearchParams({
        text1: cfg.text1,
        text2: cfg.text2,
        text3: cfg.text3,
        text1Color: cfg.text1Color,
        text2Color: cfg.text2Color,
        text3Color: cfg.text3Color,
        text2StrokeColor: cfg.text2StrokeColor,
        text2StrokeWidth: cfg.text2StrokeWidth,
        scale: String(cfg.scale),
        emblemScale: String(cfg.emblemScale),
        theme: cfg.pinwheelTheme,
    });
    return `${base}?${params.toString()}`;
}

interface Props {
    cfg: Config;
}

export const CodeSnippets: React.FC<Props> = ({ cfg }) => {
    const sloganUrl = buildUrl(cfg);
    const markdownCode = `[![k-celebrate-slogan](${sloganUrl})](https://github.com/GHeeJeon/k-celebrate-slogan)`;
    const htmlCode = `<a href="https://github.com/GHeeJeon/k-celebrate-slogan">\n  <img src="${sloganUrl}" alt="k-celebrate-slogan" />\n</a>`;

    return (
        <>
            <Section title="📝 Markdown">
                <CopyBlock label="Markdown" code={markdownCode} />
            </Section>
            <Section title="🌐 HTML">
                <CopyBlock label="HTML" code={htmlCode} />
            </Section>
            <Section title="🔗 URL">
                <CopyBlock label="URL" code={sloganUrl} />
            </Section>
        </>
    );
};
