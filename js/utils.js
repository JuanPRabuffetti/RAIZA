// utils.js - Utilidades matemáticas y funciones auxiliares

/**
 * Calcula el total del carrito
 * @param {Array} cart - Array de items del carrito
 * @returns {number} Total calculado
 */
function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Calcula el total de items en el carrito
 * @param {Array} cart - Array de items del carrito
 * @returns {number} Cantidad total de items
 */
function calculateCartCount(cart) {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calcula el subtotal de un item
 * @param {number} price - Precio unitario
 * @param {number} quantity - Cantidad
 * @returns {number} Subtotal del item
 */
function calculateItemTotal(price, quantity) {
    return price * quantity;
}

/**
 * Redondea un número a 2 decimales
 * @param {number} value - Valor a redondear
 * @returns {number} Valor redondeado
 */
function roundToTwo(value) {
    return Math.round(value * 100) / 100;
}

/**
 * Obtiene la etiqueta de categoría según el código
 * @param {string} category - Código de categoría
 * @returns {string} Etiqueta legible de categoría
 */
function getCategoryLabel(category) {
    const labels = {
        'libros': 'Libros',
        'jabones': 'Jabones',
        'accesorios': 'Accesorios',
        'juegos': 'Juegos'
    };
    return labels[category] || category;
}

/**
 * Formatea un precio a moneda
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
function formatPrice(price) {
    return roundToTwo(price).toFixed(2);
}

/**
 * Busca un producto por ID
 * @param {number} productId - ID del producto
 * @returns {Object|undefined} Producto encontrado o undefined
 */
function findProductById(productId) {
    return products.find(p => p.id === productId);
}

/**
 * Filtra productos por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Array} Productos filtrados
 */
function filterProductsByCategory(category) {
    if (category === 'todos') {
        return products;
    }
    return products.filter(p => p.category === category);
}
