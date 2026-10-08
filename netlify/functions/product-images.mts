import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import sharp from 'sharp';
import { requireAdmin } from '../../server/auth.js';
import { errorResponse, HttpError, json, requireSameOrigin } from '../../server/http.js';

export default async (request: Request, context: Context) => {
    try {
        if (request.method === 'GET') {
            const key = context.params.key;
            if (!key || !/^[a-f0-9-]{36}\.webp$/.test(key)) throw new HttpError(404, 'Imagen no encontrada.');
            const image = await getStore({ name: 'product-images', consistency: 'strong' }).get(key, { type: 'arrayBuffer' });
            if (!image) throw new HttpError(404, 'Imagen no encontrada.');
            return new Response(image, {
                headers: {
                    'Content-Type': 'image/webp',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'X-Content-Type-Options': 'nosniff',
                },
            });
        }
        if (request.method !== 'POST' || context.params.key) return json({ error: 'Método no permitido.' }, 405);
        await requireAdmin();
        requireSameOrigin(request);
        const form = await request.formData();
        const file = form.get('file');
        if (!(file instanceof File) || !file.size || file.size > 4 * 1024 * 1024) {
            throw new HttpError(400, 'Seleccioná una foto de hasta 4 MB.');
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        const isPng = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        const isWebp = buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
        if (!isJpeg && !isPng && !isWebp) throw new HttpError(400, 'Usá una foto JPG, PNG o WebP.');
        let image: Buffer;
        try {
            image = await sharp(buffer, { limitInputPixels: 40000000 }).rotate()
                .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 85 }).toBuffer();
        } catch {
            throw new HttpError(400, 'No pudimos procesar esta foto. Probá con otro archivo JPG, PNG o WebP.');
        }
        const key = `${crypto.randomUUID()}.webp`;
        await getStore({ name: 'product-images', consistency: 'strong' }).set(key, new Blob([new Uint8Array(image)]));
        return json({ url: `/api/product-images/${key}` }, 201);
    } catch (error) {
        return errorResponse(error);
    }
};

export const config: Config = { path: ['/api/product-images', '/api/product-images/:key'] };
