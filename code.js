// Base de datos de productos
const products = [
    {
        id: 1,
        name: "Libro para Embarazo",
        category: "libros",
        price: 1190,
        description: "Tamaño A5 con 60 páginas para registrar todo tu embarazo: recuerdos, ecografías, pensamientos y controles. Viene en bolsa de tela 🫶🏼",
        emoji: "🤰",
        available: true
    },
    {
        id: 2,
        name: "Tarjetas del Primer Año",
        category: "libros",
        price: 790,
        description: "Set de 12 tarjetas ilustradas para los primeros 12 meses y momentos importantes de cada etapa. Van en bolsa de tela 📸",
        emoji: "📅",
        available: true
    },
    {
        id: 3,
        name: "Libro de Recuerdos del Bebé",
        category: "libros",
        price: 1490,
        description: "Impreso en papel ecológico con 70 páginas para guardar recuerdos y fotos del primer año. Incluye tarjeta personalizada. Se entrega en bolsa de lienzo ✨",
        emoji: "👶",
        available: true
    },
    {
        id: 4,
        name: "Libro de Recuerdos Personalizado",
        category: "libros",
        price: 1590,
        description: "Mismo producto que el Libro de Recuerdos pero con carátula personalizada con el nombre del bebé. Papel ecológico, 70 páginas en bolsa de lienzo 💕",
        emoji: "👶",
        available: true
    },
    {
        id: 5,
        name: "MEMO Bajo del Mar",
        category: "juegos",
        price: 490,
        description: "Juego de memoria con ilustraciones de animales marinos y sus palabras. Plastificado y resistente al agua. Perfecto para estimulación temprana 🌊🐠",
        emoji: "🎮",
        available: true
    },
    {
        id: 6,
        name: "Almohadillas para Sellos y Manos",
        category: "accesorios",
        price: 390,
        description: "Almohadillas para sellos de manos y pies de bebés. Perfectas para crear recuerdos especiales 🖐️👣",
        emoji: "🎨",
        available: false
    }
];

// Carrito de compras
let cart = [];
let currentFilter = 'todos';

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
});

// Renderizar productos
function renderProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const buttonHTML = product.available 
            ? `<button class="add-to-cart-btn" onclick="addToCart(${product.id})">Agregar</button>`
            : `<button class="add-to-cart-btn" style="opacity: 0.6; cursor: not-allowed;" disabled>Próximamente</button>`;
        
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${getCategoryLabel(product.category)}</div>
                <div class="product-name">${product.name}</div>
                <div class="rating">★★★★★</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <span class="price">$${product.price.toLocaleString('es-AR')}</span>
                    ${buttonHTML}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Obtener etiqueta de categoría
function getCategoryLabel(category) {
    const labels = {
        'libros': '📚 Libros',
        'juegos': '🎮 Juegos',
        'accesorios': '🎨 Accesorios'
    };
    return labels[category] || category;
}

// Filtrar productos
function filterProducts(category) {
    currentFilter = category;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrar y mostrar
    if (category === 'todos') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification('Producto agregado al carrito');
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;

    const cartItemsDiv = document.getElementById('cartItems');
    const cartEmptyDiv = document.getElementById('cartEmpty');
    const cartTotalDiv = document.getElementById('cartTotalDiv');

    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyDiv.style.display = 'block';
        cartTotalDiv.style.display = 'none';
    } else {
        cartEmptyDiv.style.display = 'none';
        cartTotalDiv.style.display = 'block';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.emoji} ${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-AR')} x ${item.quantity} = $${itemTotal.toLocaleString('es-AR')}</div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = total.toLocaleString('es-AR');
    }
}

// Aumentar cantidad
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCartUI();
    }
}

// Disminuir cantidad
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            updateCartUI();
        } else {
            removeFromCart(productId);
        }
    }
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Producto eliminado del carrito');
}

// Alternar carrito
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

// Continuar comprando
function continueShopping() {
    toggleCart();
}

// Proceder al pago
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartSummary = cart.map(item => `${item.name} (${item.quantity})`).join(', ');

    alert(`
¡Gracias por tu compra!

Productos:
${cart.map(item => `- ${item.emoji} ${item.name} x${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-AR')}`).join('\n')}

Total: $${total.toLocaleString('es-AR')}

Por favor, completa el pago en nuestro sistema de pago seguro.
Este es un sitio de demostración.
    `);

    // Limpiar carrito después del "pago"
    cart = [];
    updateCartUI();
    toggleCart();
    showNotification('¡Pedido completado con éxito!');
}

// Manejar formulario de contacto
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Aquí normalmente enviarías los datos a un servidor
    showNotification('¡Mensaje enviado! Nos pondremos en contacto pronto.');
    
    // Limpiar formulario
    form.reset();
}

// Mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ecdc4;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
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
