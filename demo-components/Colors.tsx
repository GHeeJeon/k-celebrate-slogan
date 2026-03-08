import React from 'react';
import { Config } from './types';
import { Section, Label, TextInput, ColorRow } from './UI';

interface Props {
    cfg: Config;
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

export const ColorControls: React.FC<Props> = ({ cfg, set }) => {
    return (
        <Section title="🌈 Colors">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ColorRow
                    id="text1Color"
                    label="text1 Color"
                    value={cfg.text1Color}
                    onChange={(v) => set('text1Color', v)}
                />
                <ColorRow
                    id="text2Color"
                    label="text2 Color"
                    value={cfg.text2Color}
                    onChange={(v) => set('text2Color', v)}
                />
                <ColorRow
                    id="text3Color"
                    label="text3 Color"
                    value={cfg.text3Color}
                    onChange={(v) => set('text3Color', v)}
                />
                <ColorRow
                    id="text2StrokeColor"
                    label="text2 Stroke Color"
                    value={cfg.text2StrokeColor}
                    onChange={(v) => set('text2StrokeColor', v)}
                />
                <div>
                    <Label htmlFor="strokeWidth">text2 Stroke Width</Label>
                    <TextInput
                        id="strokeWidth"
                        value={cfg.text2StrokeWidth}
                        onChange={(v) => set('text2StrokeWidth', v)}
                        placeholder="2.5px"
                    />
                </div>
            </div>
        </Section>
    );
};
