import { getSvgSlogan } from './_lib/slogan';

interface VercelRequest {
    query: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
    setHeader(name: string, value: string): void;
    status(code: number): VercelResponse;
    send(body: string): void;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Normalize query params — Vercel passes them as string | string[] | undefined
        const raw: Record<string, string | undefined> = {};
        for (const key of Object.keys(req.query || {})) {
            const v = req.query[key];
            raw[key] = Array.isArray(v) ? v[0] : v;
        }

        const svg = getSvgSlogan(raw);

        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        // Revalidate every hour; CDN can cache for 24h
        res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
        res.status(200).send(svg);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).send(`<!-- Error: ${message} -->`);
    }
}
