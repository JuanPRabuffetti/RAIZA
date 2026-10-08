import type { Config } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { products } from '../../db/schema.js';
import { errorResponse, json } from '../../server/http.js';

export default async (request: Request) => {
    if (request.method !== 'GET') return json({ error: 'Método no permitido.' }, 405);
    try {
        const rows = await getDb().select().from(products).where(eq(products.available, true)).orderBy(products.id);
        return json(rows.map(({ version, updatedAt, ...product }) => product));
    } catch (error) {
        return errorResponse(error);
    }
};

export const config: Config = { path: '/api/products' };
