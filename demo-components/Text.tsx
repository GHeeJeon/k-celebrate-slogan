import React from 'react';
import { Config } from './types';
import { Section, Label, TextInput } from './UI';

interface Props {
    cfg: Config;
    set: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

export const TextControls: React.FC<Props> = ({ cfg, set }) => {
    return (
        <Section title="✏️ Text">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                    <Label htmlFor="text1">Top Text (text1)</Label>
                    <TextInput
                        id="text1"
                        value={cfg.text1}
                        onChange={(v) => set('text1', v)}
                        placeholder="축하합니다"
                    />
                </div>
                <div>
                    <Label htmlFor="text2">Main Text (text2)</Label>
                    <TextInput
                        id="text2"
                        value={cfg.text2}
                        onChange={(v) => set('text2', v)}
                        placeholder="김준호"
                    />
                </div>
                <div>
                    <Label htmlFor="text3">Sub Text (text3)</Label>
                    <TextInput
                        id="text3"
                        value={cfg.text3}
                        onChange={(v) => set('text3', v)}
                        placeholder="아무 이유 없음"
                    />
                </div>
            </div>
        </Section>
    );
};
