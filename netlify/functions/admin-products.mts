import type { Config, Context } from '@netlify/functions';
import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { products } from '../../db/schema.js';
import { requireAdmin } from '../../server/auth.js';
import { errorResponse, HttpError, json, readJson, requireSameOrigin } from '../../server/http.js';
import { validateId, validateProduct, validateVersion } from '../../server/products.js';

export default async (request: Request, context: Context) => {
    try {
        await requireAdmin();
        const productId = context.params.id;
        if (request.method === 'GET' && !productId) {
            return json(await getDb().select().from(products).orderBy(products.id));
        }
        if (!['POST', 'PATCH', 'DELETE'].includes(request.method)) return json({ error: 'Método no permitido.' }, 405);
        requireSameOrigin(request);
        const body = await readJson(request);
        if (request.method === 'POST' && !productId) {
            const [product] = await getDb().insert(products).values(validateProduct(body)).returning();
            return json(product, 201);
        }
        if (!productId || request.method === 'POST') return json({ error: 'Método no permitido.' }, 405);
        const id = validateId(productId);
        const version = validateVersion(body.version);
        const condition = and(eq(products.id, id), eq(products.version, version));
        if (request.method === 'PATCH') {
            const [product] = await getDb().update(products).set({
                ...validateProduct(body),
                version: sql`${products.version} + 1`,
                updatedAt: new Date(),
            }).where(condition).returning();
            if (!product) throw new HttpError(409, 'El producto cambió o fue eliminado en otra sesión. Recargá el catálogo antes de continuar.');
            return json(product);
        }
        const [deleted] = await getDb().delete(products).where(condition).returning({ id: products.id });
        if (!deleted) throw new HttpError(409, 'El producto cambió o fue eliminado en otra sesión. Recargá el catálogo antes de continuar.');
        return json(deleted);
    } catch (error) {
        return errorResponse(error);
    }
};

export const config: Config = { path: ['/api/admin/products', '/api/admin/products/:id'] };
