// ui.js - Funciones para actualizar la interfaz visual

/**
 * Renderiza los productos en la grilla
 * @param {Array} productsToShow - Array de productos a mostrar
 */
function renderProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${getCategoryLabel(product.category)}</div>
                <div class="product-name">${product.name}</div>
                <div class="rating">★★★★★</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <span class="price">$${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})">Agregar</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * Actualiza la interfaz del carrito
 */
function updateCartUI() {
    const summary = cart.getSummary();
    
    // Actualizar contador en el header
    document.getElementById('cartCount').textContent = summary.itemCount;

    const cartItemsDiv = document.getElementById('cartItems');
    const cartEmptyDiv = document.getElementById('cartEmpty');
    const cartTotalDiv = document.getElementById('cartTotalDiv');

    cartItemsDiv.innerHTML = '';

    if (summary.isEmpty) {
        cartEmptyDiv.style.display = 'block';
        cartTotalDiv.style.display = 'none';
    } else {
        cartEmptyDiv.style.display = 'none';
        cartTotalDiv.style.display = 'block';

        // Renderizar items del carrito
        cart.getItems().forEach(item => {
            const itemTotal = calculateItemTotal(item.price, item.quantity);
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.emoji} ${item.name}</div>
                    <div class="cart-item-price">$${formatPrice(item.price)} x ${item.quantity} = $${formatPrice(itemTotal)}</div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="handleDecreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="handleIncreaseQuantity(${item.id})">+</button>
                </div>
                <button class="remove-btn" onclick="handleRemoveFromCart(${item.id})">Eliminar</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        // Actualizar total
        document.getElementById('cartTotal').textContent = formatPrice(summary.total);
    }
}

/**
 * Alterna la visibilidad del modal del carrito
 */
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

/**
 * Cierra el modal del carrito
 */
function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
}

/**
 * Abre el modal del carrito
 */
function openCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('active');
}

/**
 * Muestra una notificación en la pantalla
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, info, error)
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    // Definir colores según el tipo
    const colors = {
        'success': '#4ecdc4',
        'info': '#667eea',
        'error': '#ff6b6b'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors['success']};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-in-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Actualiza los botones de filtro
 * @param {HTMLElement} clickedBtn - Botón clickeado
 */
function updateFilterButtons(clickedBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
}

/**
 * Agrega estilos de animación (se ejecuta una sola vez)
 */
function initializeStyles() {
    if (document.getElementById('animation-styles')) {
        return; // Ya fue agregado
    }

    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
