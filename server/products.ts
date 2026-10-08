import { HttpError } from './http.js';

export function validateImagePath(value: unknown): string {
    if (typeof value !== 'string' || value.length > 500) throw new HttpError(400, 'La imagen no es válida.');
    if (/^\/?pictures\/[^/\\?#]+\.(?:jpe?g|png|webp)$/i.test(value) && !value.includes('..')) {
        return value.startsWith('/') ? value : `/${value}`;
    }
    if (/^\/api\/product-images\/[a-f0-9-]{36}\.webp$/.test(value)) return value;
    throw new HttpError(400, 'Usá las fotografías del catálogo o subí una nueva imagen.');
}

export function validateProduct(body: Record<string, unknown>) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (!name || name.length > 160) throw new HttpError(400, 'El nombre es obligatorio y admite hasta 160 caracteres.');
    if (!description || description.length > 10000) throw new HttpError(400, 'La descripción es obligatoria y admite hasta 10.000 caracteres.');
    if (typeof body.category !== 'string' || !['libros', 'juegos', 'accesorios', 'tarjetas', 'jabones', 'ropa'].includes(body.category)) {
        throw new HttpError(400, 'Seleccioná una categoría válida.');
    }
    if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0 || body.price > 99999999.99 || Math.abs(body.price * 100 - Math.round(body.price * 100)) > 0.00001) {
        throw new HttpError(400, 'Ingresá un precio válido, con hasta dos decimales.');
    }
    if (typeof body.available !== 'boolean' || typeof body.catalogSinglePreview !== 'boolean') {
        throw new HttpError(400, 'La disponibilidad y la vista del catálogo no son válidas.');
    }
    if (!Array.isArray(body.gallery) || !body.gallery.length || body.gallery.length > 20) {
        throw new HttpError(400, 'Agregá entre una y veinte fotografías.');
    }
    const gallery = [...new Set(body.gallery.map(validateImagePath))];
    return {
        name,
        description,
        category: body.category,
        price: body.price,
        gallery,
        image: gallery[0],
        available: body.available,
        catalogSinglePreview: body.catalogSinglePreview,
    };
}

export function validateId(value: string | undefined) {
    if (!value || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > 2147483647) {
        throw new HttpError(400, 'El identificador del producto no es válido.');
    }
    return Number(value);
}

export function validateVersion(value: unknown) {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
        throw new HttpError(400, 'La versión del producto no es válida. Volvé a cargar el catálogo.');
    }
    return value;
}
