/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ─── Local API middleware (mirrors Vercel Serverless Function) ────────────────
// Lets you hit http://localhost:3000/api?text1=...  during `npm run demo`
// without deploying to Vercel.
function localApiPlugin() {
    return {
        name: 'local-api',
        configureServer(server: {
            ssrLoadModule: (...args: any[]) => any;
            middlewares: { use: (...args: any[]) => any };
        }) {
            server.middlewares.use(
                '/api',
                async (
                    req: { url?: string },
                    res: {
                        writeHead: (...args: any[]) => any;
                        end: (...args: any[]) => any;
                        statusCode: number;
                    },
                    next: (...args: any[]) => any
                ) => {
                    try {
                        // ssrLoadModule: Vite가 TS를 직접 변환하면서 로드 (일반 import는 Node.js가 .ts를 못 읽음)
                        const mod = await server.ssrLoadModule('/api/_lib/slogan.ts');
                        const getSvgSlogan = mod.getSvgSlogan as (
                            opts: Record<string, string | undefined>
                        ) => string;

                        const url = new URL(req.url || '', 'http://localhost');
                        const raw: Record<string, string | undefined> = {};
                        url.searchParams.forEach((value: string, key: string) => {
                            raw[key] = value;
                        });

                        const svg = getSvgSlogan(raw);
                        res.writeHead(200, {
                            'Content-Type': 'image/svg+xml; charset=utf-8',
                            'Cache-Control': 'no-cache',
                        });
                        res.end(svg);
                    } catch (err) {
                        console.error('[local-api] Error:', err);
                        next();
                    }
                }
            );
        },
    };
}

export default defineConfig(({ mode: _mode }) => {
    return {
        plugins: [react(), localApiPlugin()],
        publicDir: false,
        server: {
            open: true,
            port: 3000,
        },
        build: {
            rollupOptions: {
                input: {
                    main: 'index.html',
                    test: 'test.html',
                    svgPreview: 'svg-preview.html',
                },
            },
        },
    };
});
