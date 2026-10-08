export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export function json(data: unknown, status = 200) {
    return Response.json(data, {
        status,
        headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
}

export function errorResponse(error: unknown) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    return json({ error: 'No pudimos completar la operación. Intentá nuevamente.' }, 503);
}

export function requireSameOrigin(request: Request) {
    if (request.headers.get('origin') !== new URL(request.url).origin) {
        throw new HttpError(403, 'La solicitud debe realizarse desde este sitio.');
    }
}

export async function readJson(request: Request) {
    if (!request.headers.get('content-type')?.startsWith('application/json')) {
        throw new HttpError(415, 'El formato de la solicitud no es válido.');
    }
    const body = await request.text();
    if (Buffer.byteLength(body) > 65536) throw new HttpError(413, 'La solicitud es demasiado grande.');
    try {
        const value = JSON.parse(body);
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
        return value as Record<string, unknown>;
    } catch {
        throw new HttpError(400, 'Los datos enviados no son válidos.');
    }
}
