import type { Config } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { products } from '../../db/schema.js';

export default async (request: Request) => {
    const origin = process.env.URL || new URL(request.url).origin;
    const urls = [{ loc: `${origin}/`, lastmod: undefined as string | undefined }];
    try {
        const rows = await getDb().select({ id: products.id, updatedAt: products.updatedAt })
            .from(products).where(eq(products.available, true)).orderBy(products.id);
        for (const row of rows) {
            urls.push({ loc: `${origin}/product?id=${row.id}`, lastmod: row.updatedAt.toISOString().slice(0, 10) });
        }
    } catch {
        // Si la base no responde, se publica al menos la portada.
    }
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod }) => `  <url><loc>${loc.replace(/&/g, '&amp;')}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
    return new Response(body, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'Netlify-CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
};

export const config: Config = { path: '/sitemap.xml' };
