import { acceptInvite, getUser, handleAuthCallback, login, logout, onAuthChange, requestPasswordRecovery, updateUser } from '@netlify/identity';

const elements = Object.fromEntries([...document.querySelectorAll('[id]')].map(element => [element.id, element]));
const categories = { libros: 'Libros', juegos: 'Juegos', accesorios: 'Accesorios', tarjetas: 'Tarjetas', jabones: 'Jabones', ropa: 'Ropa' };
const currency = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' });
let catalog = [];
let editing = null;
let gallery = [];
let deleting = null;
let callback = null;
let uploading = false;
let saving = false;
let loading = false;
let authenticated = false;

function message(target, text = '', type = 'error') {
    target.textContent = text;
    target.dataset.type = type;
}

function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function button(text, className, action, label) {
    const element = node('button', className, text);
    element.type = 'button';
    if (label) element.setAttribute('aria-label', label);
    element.addEventListener('click', action);
    return element;
}

function showLogin() {
    authenticated = false;
    catalog = [];
    elements.adminProducts.replaceChildren();
    elements.productDialog.close();
    elements.deleteDialog.close();
    elements.catalogSection.hidden = true;
    elements.loginSection.hidden = false;
    elements.logoutButton.hidden = true;
}

async function api(path, options = {}) {
    await getUser();
    const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...options });
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error('El servicio no está disponible. Intentá nuevamente en unos momentos.');
    }
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            showLogin();
            message(elements.authMessage, data.error || 'Volvé a iniciar sesión.');
        }
        throw new Error(data.error || 'No pudimos completar la operación.');
    }
    return data;
}

function mutation(method, body) {
    return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

async function enterPanel() {
    const session = await api('/api/admin/session');
    authenticated = true;
    elements.loginSection.hidden = true;
    elements.catalogSection.hidden = false;
    elements.logoutButton.hidden = false;
    elements.adminEmail.textContent = session.email;
    await loadCatalog();
}

async function loadCatalog() {
    if (loading) return;
    loading = true;
    elements.refreshButton.disabled = true;
    elements.newProductButton.disabled = true;
    message(elements.catalogMessage);
    elements.adminProducts.replaceChildren(...Array.from({ length: 3 }, () => node('div', 'skeleton')));
    elements.adminProducts.setAttribute('aria-busy', 'true');
    try {
        const data = await api('/api/admin/products');
        if (!authenticated) return;
        catalog = data;
        renderCatalog();
    } catch (error) {
        elements.adminProducts.replaceChildren();
        message(elements.catalogMessage, error.message);
    } finally {
        loading = false;
        elements.refreshButton.disabled = false;
        elements.newProductButton.disabled = false;
        elements.adminProducts.setAttribute('aria-busy', 'false');
    }
}

function renderCatalog() {
    const query = elements.searchProducts.value.trim().toLocaleLowerCase('es');
    const category = elements.filterCategory.value;
    const shown = catalog.filter(product => (!category || product.category === category) && product.name.toLocaleLowerCase('es').includes(query));
    elements.productCount.textContent = catalog.length;
    elements.adminProducts.replaceChildren();
    if (!shown.length) {
        const empty = node('div', 'empty-state');
        empty.append(node('h2', '', catalog.length ? 'No encontramos esa creación.' : 'El comienzo de algo lindo.'), node('p', '', catalog.length ? 'Probá otro nombre o cambiá la categoría.' : 'Agregá tu primer producto para darle vida al catálogo.'));
        elements.adminProducts.append(empty);
        return;
    }
    shown.forEach(product => {
        const card = node('article', 'catalog-card');
        const imageWrap = node('div', 'card-image-wrap');
        const image = node('img');
        image.src = product.image;
        image.alt = product.name;
        image.loading = 'lazy';
        imageWrap.append(image, node('span', `visibility-badge${product.available ? '' : ' hidden-badge'}`, product.available ? '● En la tienda' : '○ Oculto'));
        const content = node('div', 'card-content');
        const meta = node('div', 'card-meta');
        meta.append(node('span', '', currency.format(product.price)), node('small', '', `${product.gallery.length} fotos`));
        const actions = node('div', 'card-actions');
        actions.append(button('Editar producto ↗', '', () => openEditor(product), `Editar ${product.name}`), button('Eliminar', '', () => openDelete(product), `Eliminar ${product.name}`));
        content.append(node('p', 'card-category', categories[product.category] || product.category), node('h3', '', product.name), meta, actions);
        card.append(imageWrap, content);
        elements.adminProducts.append(card);
    });
}

function openEditor(product = null) {
    editing = product;
    gallery = product ? [...product.gallery] : [];
    elements.productForm.reset();
    elements.editorTitle.textContent = product ? 'Editar producto' : 'Nueva creación';
    elements.productName.value = product?.name || '';
    elements.productCategory.value = product?.category || 'libros';
    elements.productPrice.value = product?.price ?? '';
    elements.productDescription.value = product?.description || '';
    elements.productAvailable.checked = product?.available ?? true;
    elements.productSinglePreview.checked = product?.catalogSinglePreview ?? false;
    message(elements.editorMessage);
    message(elements.uploadMessage);
    renderGallery();
    elements.productDialog.showModal();
    elements.productName.focus();
}

function renderGallery() {
    elements.editorGallery.replaceChildren();
    if (!gallery.length) elements.editorGallery.append(node('p', 'gallery-empty', 'Todavía no hay fotos. Sumá al menos una para guardar.'));
    gallery.forEach((url, index) => {
        const item = node('div', 'gallery-item');
        const image = node('img');
        image.src = url;
        image.alt = `Foto ${index + 1}`;
        const controls = node('div', 'photo-controls');
        const main = button('Principal', '', () => {
            gallery.unshift(...gallery.splice(index, 1));
            renderGallery();
        }, `Usar la foto ${index + 1} como principal`);
        main.disabled = index === 0 || uploading || saving;
        const previous = button('←', '', () => {
            [gallery[index - 1], gallery[index]] = [gallery[index], gallery[index - 1]];
            renderGallery();
        }, `Mover la foto ${index + 1} hacia adelante`);
        previous.disabled = index === 0 || uploading || saving;
        const next = button('→', '', () => {
            [gallery[index + 1], gallery[index]] = [gallery[index], gallery[index + 1]];
            renderGallery();
        }, `Mover la foto ${index + 1} hacia atrás`);
        next.disabled = index === gallery.length - 1 || uploading || saving;
        const remove = button('Quitar', '', () => {
            gallery.splice(index, 1);
            renderGallery();
        }, `Quitar la foto ${index + 1}`);
        remove.disabled = uploading || saving;
        controls.append(main, previous, next, remove);
        item.append(image, node('p', '', index === 0 ? 'FOTO PRINCIPAL' : `FOTO ${index + 1}`), controls);
        elements.editorGallery.append(item);
    });
}

function setEditorBusy(busy) {
    for (const control of elements.productForm.querySelectorAll('input, select, textarea, button')) control.disabled = busy;
    elements.saveProduct.textContent = saving ? 'Guardando…' : uploading ? 'Subiendo fotos…' : 'Guardar producto';
    renderGallery();
}

function closeEditor() {
    if (!uploading && !saving) elements.productDialog.close();
}

elements.loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = elements.loginForm.querySelector('button');
    submit.disabled = true;
    submit.textContent = 'Ingresando…';
    message(elements.authMessage);
    try {
        await login(elements.loginEmail.value.trim(), elements.loginPassword.value);
        elements.loginPassword.value = '';
        await enterPanel();
    } catch (error) {
        message(elements.authMessage, error.status === 400 || error.status === 401 ? 'Revisá el correo y la contraseña, y asegurate de haber aceptado la invitación.' : error.status === 403 ? 'El acceso está restringido. Verificá tu invitación y el rol admin.' : error.message || 'No pudimos iniciar sesión.');
    } finally {
        submit.disabled = false;
        submit.textContent = 'Entrar al panel →';
    }
});

elements.recoverButton.addEventListener('click', async () => {
    if (!elements.loginEmail.reportValidity() || !elements.loginEmail.value) return;
    elements.recoverButton.disabled = true;
    message(elements.authMessage);
    try {
        await requestPasswordRecovery(elements.loginEmail.value.trim());
        message(elements.authMessage, 'Si la cuenta existe, recibís un correo para recuperar tu contraseña. Revisá también la carpeta de spam.', 'success');
    } catch {
        message(elements.authMessage, 'No pudimos enviar el correo. Intentá nuevamente.');
    } finally {
        elements.recoverButton.disabled = false;
    }
});

elements.passwordForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (elements.newPassword.value !== elements.repeatPassword.value) {
        message(elements.authMessage, 'Las contraseñas no coinciden.');
        return;
    }
    const submit = elements.passwordForm.querySelector('button');
    submit.disabled = true;
    message(elements.authMessage);
    try {
        if (callback?.type === 'invite') await acceptInvite(callback.token, elements.newPassword.value);
        else await updateUser({ password: elements.newPassword.value });
        callback = null;
        elements.passwordForm.reset();
        elements.passwordForm.hidden = true;
        elements.loginForm.hidden = false;
        elements.recoverButton.hidden = false;
        elements.authTitle.textContent = 'Bienvenida al taller';
        elements.authDescription.textContent = 'Ingresá con tu cuenta administradora de Netlify Identity.';
        message(elements.authMessage, 'Contraseña guardada. Recordá asignar el rol admin en Netlify para habilitar el panel.', 'success');
        await enterPanel();
    } catch (error) {
        message(elements.authMessage, error.message || 'No pudimos guardar la contraseña. Solicitá un enlace nuevo si el anterior venció.');
    } finally {
        submit.disabled = false;
    }
});

elements.logoutButton.addEventListener('click', async () => {
    elements.logoutButton.disabled = true;
    try {
        await logout();
        showLogin();
        message(elements.authMessage, 'Sesión cerrada.', 'success');
    } catch {
        message(elements.catalogMessage, 'No pudimos cerrar sesión. Intentá nuevamente.');
    } finally {
        elements.logoutButton.disabled = false;
    }
});

elements.newProductButton.addEventListener('click', () => openEditor());
elements.refreshButton.addEventListener('click', loadCatalog);
elements.searchProducts.addEventListener('input', renderCatalog);
elements.filterCategory.addEventListener('change', renderCatalog);
elements.closeEditor.addEventListener('click', closeEditor);
elements.cancelEditor.addEventListener('click', closeEditor);
elements.productDialog.addEventListener('cancel', event => {
    if (uploading || saving) event.preventDefault();
});

elements.imageFiles.addEventListener('change', async () => {
    const files = [...elements.imageFiles.files];
    if (!files.length) return;
    if (gallery.length + files.length > 20) {
        message(elements.uploadMessage, 'Podés agregar hasta 20 fotografías.');
        elements.imageFiles.value = '';
        return;
    }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > 4 * 1024 * 1024)) {
        message(elements.uploadMessage, 'Usá fotos JPG, PNG o WebP de hasta 4 MB cada una.');
        elements.imageFiles.value = '';
        return;
    }
    uploading = true;
    setEditorBusy(true);
    let completed = 0;
    try {
        for (const file of files) {
            message(elements.uploadMessage, `Subiendo foto ${completed + 1} de ${files.length}…`, 'success');
            const form = new FormData();
            form.append('file', file);
            const result = await api('/api/product-images', { method: 'POST', body: form });
            if (!authenticated) return;
            gallery.push(result.url);
            completed++;
        }
        message(elements.uploadMessage, 'Fotos listas. Guardá el producto para publicarlas.', 'success');
    } catch (error) {
        message(elements.uploadMessage, `${completed ? `${completed} fotos subidas. ` : ''}${error.message}`);
    } finally {
        uploading = false;
        elements.imageFiles.value = '';
        setEditorBusy(false);
    }
});

elements.productForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (uploading || saving) return;
    if (!gallery.length) {
        message(elements.editorMessage, 'Agregá al menos una fotografía.');
        elements.imageFiles.focus();
        return;
    }
    const body = {
        name: elements.productName.value.trim(),
        category: elements.productCategory.value,
        price: Number(elements.productPrice.value),
        description: elements.productDescription.value.trim(),
        available: elements.productAvailable.checked,
        catalogSinglePreview: elements.productSinglePreview.checked,
        gallery,
        ...(editing ? { version: editing.version } : {}),
    };
    saving = true;
    setEditorBusy(true);
    message(elements.editorMessage);
    try {
        const product = await api(editing ? `/api/admin/products/${editing.id}` : '/api/admin/products', mutation(editing ? 'PATCH' : 'POST', body));
        if (!authenticated) return;
        if (editing) catalog = catalog.map(item => item.id === product.id ? product : item);
        else catalog.push(product);
        elements.productDialog.close();
        renderCatalog();
        message(elements.catalogMessage, product.available ? 'Producto guardado. Ya está actualizado en la tienda.' : 'Producto guardado como oculto. No aparece en la tienda.', 'success');
    } catch (error) {
        message(elements.editorMessage, error.message);
    } finally {
        saving = false;
        setEditorBusy(false);
    }
});

function openDelete(product) {
    deleting = product;
    elements.deleteDescription.textContent = product.name;
    message(elements.deleteMessage);
    elements.deleteDialog.showModal();
    elements.cancelDelete.focus();
}

elements.cancelDelete.addEventListener('click', () => elements.deleteDialog.close());
elements.deleteDialog.addEventListener('cancel', event => {
    if (elements.confirmDelete.disabled) event.preventDefault();
});
elements.confirmDelete.addEventListener('click', async () => {
    if (!deleting) return;
    elements.confirmDelete.disabled = true;
    elements.cancelDelete.disabled = true;
    message(elements.deleteMessage);
    try {
        await api(`/api/admin/products/${deleting.id}`, mutation('DELETE', { version: deleting.version }));
        if (!authenticated) return;
        catalog = catalog.filter(product => product.id !== deleting.id);
        deleting = null;
        elements.deleteDialog.close();
        renderCatalog();
        message(elements.catalogMessage, 'Producto eliminado del catálogo.', 'success');
    } catch (error) {
        message(elements.deleteMessage, error.message);
    } finally {
        elements.confirmDelete.disabled = false;
        elements.cancelDelete.disabled = false;
    }
});

onAuthChange(event => {
    if (event === 'logout') {
        showLogin();
        message(elements.authMessage, 'La sesión se cerró. Ingresá nuevamente para continuar.');
    }
});

async function initialize() {
    try {
        callback = await handleAuthCallback();
        if (callback?.type === 'invite' || callback?.type === 'recovery') {
            elements.authTitle.textContent = callback.type === 'invite' ? 'Tu espacio empieza acá.' : 'Una nueva contraseña';
            elements.authDescription.textContent = 'Elegí una contraseña segura para tu cuenta.';
            elements.loginForm.hidden = true;
            elements.passwordForm.hidden = false;
            elements.recoverButton.hidden = true;
            elements.newPassword.focus();
            return;
        }
        if (await getUser()) await enterPanel();
    } catch (error) {
        message(elements.authMessage, error.message || 'No pudimos verificar la sesión. Ingresá nuevamente.');
    }
}

initialize();
