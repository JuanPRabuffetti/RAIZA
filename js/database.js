const products = [];

async function loadProducts() {
    const response = await fetch('/api/products', { cache: 'no-store' });
    if (!response.ok) throw new Error('No pudimos cargar el catálogo. Intentá nuevamente.');
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new Error('No pudimos cargar el catálogo.');
    products.splice(0, products.length, ...catalog);
    return products;
}
