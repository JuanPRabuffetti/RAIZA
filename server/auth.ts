import { getUser } from '@netlify/identity';
import { HttpError } from './http.js';

const ADMIN_EMAILS = ['jrabu3004@gmail.com', 'florabuffetti@gmail.com'];

export async function requireAdmin() {
    const user = await getUser();
    if (!user) throw new HttpError(401, 'Iniciá sesión para administrar el catálogo.');
    // Signups require email confirmation, so a confirmed allowlisted email proves ownership.
    if (!user.confirmedAt || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
        throw new HttpError(403, 'Esta cuenta no está autorizada para administrar el catálogo.');
    }
    return user;
}
