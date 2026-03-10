// cart.js - Lógica de gestión del carrito

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    /**
     * Obtiene la clave de almacenamiento según la sesión actual
     * @returns {string} Clave de localStorage por usuario o invitado
     */
    getStorageKey() {
        if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
            const currentUser = auth.getCurrentUser();
            return `raiza_cart_user_${currentUser.id}`;
        }
        return 'raiza_cart_guest';
    }

    /**
     * Agrega un producto al carrito
     * @param {number} productId - ID del producto
     */
    addItem(productId) {
        const product = findProductById(productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveToStorage();
    }

    /**
     * Elimina un producto del carrito
     * @param {number} productId - ID del producto a eliminar
     */
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    /**
     * Aumenta la cantidad de un producto
     * @param {number} productId - ID del producto
     */
    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity++;
            this.saveToStorage();
        }
    }

    /**
     * Disminuye la cantidad de un producto
     * @param {number} productId - ID del producto
     */
    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
                this.saveToStorage();
            } else {
                this.removeItem(productId);
            }
        }
    }

    /**
     * Obtiene la cantidad total de items en el carrito
     * @returns {number} Cantidad total
     */
    getItemCount() {
        return calculateCartCount(this.items);
    }

    /**
     * Obtiene el total del carrito
     * @returns {number} Total calculado
     */
    getTotal() {
        return roundToTwo(calculateTotal(this.items));
    }

    /**
     * Vacía el carrito
     */
    clear() {
        this.items = [];
        this.saveToStorage();
    }

    /**
     * Obtiene todos los items del carrito
     * @returns {Array} Items del carrito
     */
    getItems() {
        return this.items;
    }

    /**
     * Obtiene un resumen del carrito
     * @returns {Object} Resumen con cantidad e items
     */
    getSummary() {
        return {
            itemCount: this.getItemCount(),
            total: this.getTotal(),
            items: this.items,
            isEmpty: this.items.length === 0
        };
    }

    /**
     * Guarda el carrito en localStorage
     */
    saveToStorage() {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.items));
    }

    /**
     * Carga el carrito desde localStorage
     */
    loadFromStorage() {
        const saved = localStorage.getItem(this.getStorageKey());
        if (!saved) {
            this.items = [];
            return;
        }

        try {
            this.items = JSON.parse(saved);
            if (!Array.isArray(this.items)) {
                this.items = [];
            }
        } catch {
            this.items = [];
        }
    }
}

// Instancia global del carrito
const cart = new ShoppingCart();
