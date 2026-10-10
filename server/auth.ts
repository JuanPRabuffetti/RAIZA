import { getUser } from '@netlify/identity';
import { HttpError } from './http.js';

const ADMIN_EMAILS = ['jrabu3004@gmail.com', 'florabuffetti@gmail.com'];

export async function requireAdmin() {
    const user = await getUser();
    if (!user) throw new HttpError(401, 'Iniciá sesión para administrar el catálogo.');
    const roles = user.appMetadata?.roles;
    if (!user.confirmedAt || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '') || !Array.isArray(roles) || !roles.includes('admin')) {
        throw new HttpError(403, 'Esta cuenta no está autorizada. Verificá el correo y el rol admin en Netlify Identity.');
    }
    return user;
}
