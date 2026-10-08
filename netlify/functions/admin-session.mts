import type { Config } from '@netlify/functions';
import { requireAdmin } from '../../server/auth.js';
import { errorResponse, json } from '../../server/http.js';

export default async (request: Request) => {
    if (request.method !== 'GET') return json({ error: 'Método no permitido.' }, 405);
    try {
        const user = await requireAdmin();
        return json({ email: user.email });
    } catch (error) {
        return errorResponse(error);
    }
};

export const config: Config = { path: '/api/admin/session' };
