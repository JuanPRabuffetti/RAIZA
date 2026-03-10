// main.js - Coordinador principal y manejadores de eventos

// ==================== SLIDESHOW ====================

let slideIndex = 1;
let slideTimer;

/**
 * Cambia al slide anterior o siguiente
 * @param {number} n - Número de slides a cambiar (-1 anterior, 1 siguiente)
 */
function changeSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
    startAutoSlide();
}

/**
 * Va a un slide específico
 * @param {number} n - Número del slide
 */
function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
    startAutoSlide();
}

/**
 * Muestra el slide actual y actualiza los puntos indicadores
 * @param {number} n - Índice del slide
 */
function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

/**
 * Inicia la rotación automática del slideshow
 */
function startAutoSlide() {
    slideTimer = setTimeout(function() {
        slideIndex++;
        showSlides(slideIndex);
        startAutoSlide();
    }, 5000); // Cambiar slide cada 5 segundos
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', function() {
    initializeStyles();
    renderProducts(products);
    updateCartUI();
    
    // Iniciar slideshow
    showSlides(slideIndex);
    startAutoSlide();
});

// ==================== EVENTOS DE CARRITO ====================

/**
 * Maneja la adición de un producto al carrito
 * @param {number} productId - ID del producto
 */
function handleAddToCart(productId) {
    cart.addItem(productId);
    updateCartUI();
    showNotification('Producto agregado al carrito', 'success');
}

/**
 * Maneja la eliminación de un producto del carrito
 * @param {number} productId - ID del producto
 */
function handleRemoveFromCart(productId) {
    cart.removeItem(productId);
    updateCartUI();
    showNotification('Producto eliminado del carrito', 'info');
}

/**
 * Maneja el aumento de cantidad de un producto
 * @param {number} productId - ID del producto
 */
function handleIncreaseQuantity(productId) {
    cart.increaseQuantity(productId);
    updateCartUI();
}

/**
 * Maneja la disminución de cantidad de un producto
 * @param {number} productId - ID del producto
 */
function handleDecreaseQuantity(productId) {
    cart.decreaseQuantity(productId);
    updateCartUI();
}

/**
 * Maneja la continuación de compras
 */
function continueShopping() {
    closeCart();
}

/**
 * Maneja el proceso de pago
 */
function checkout() {
    const summary = cart.getSummary();
    
    if (summary.isEmpty) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    // Crear resumen de la compra
    const cartSummary = cart.getItems()
        .map(item => `- ${item.emoji} ${item.name} x${item.quantity} = $${formatPrice(calculateItemTotal(item.price, item.quantity))}`)
        .join('\n');

    const message = `
¡Gracias por tu compra!

Productos:
${cartSummary}

Total: $${formatPrice(summary.total)}

Por favor, completa el pago en nuestro sistema de pago seguro.
Este es un sitio de demostración.
    `;

    alert(message);

    // Limpiar carrito después del "pago"
    cart.clear();
    updateCartUI();
    closeCart();
    showNotification('¡Pedido completado con éxito!', 'success');
}

// ==================== EVENTOS DE FILTROS ====================

/**
 * Maneja el filtrado de productos
 * @param {string} category - Categoría a filtrar
 */
function filterProducts(category) {
    const filtered = filterProductsByCategory(category);
    renderProducts(filtered);
    
    // Actualizar botón activo (si se llama desde un click handler)
    if (event && event.target.classList) {
        updateFilterButtons(event.target);
    }
}

// ==================== EVENTOS DEL MODAL ====================

/**
 * Alterna la visibilidad del carrito
 */
function toggleCartVisibility() {
    toggleCart();
}

// Cerrar modal al hacer click fuera del contenido
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    const cartContent = document.querySelector('.cart-content');
    
    if (modal && modal.classList.contains('active')) {
        if (!cartContent.contains(event.target) && 
            event.target.id !== 'cartCount' && 
            !event.target.closest('.cart-icon')) {
            closeCart();
        }
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCart();
    }
});

// ==================== EVENTOS DEL FORMULARIO ====================

/**
 * Maneja el envío del formulario de contacto
 * @param {Event} event - Evento del formulario
 */
function handleContactForm(event) {
    event.preventDefault();
    
    // Validaciones
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    // Aquí normalmente enviarías los datos a un servidor
    console.log('Formulario enviado:', { name, email, message });

    showNotification('¡Mensaje enviado! Nos pondremos en contacto pronto.', 'success');
    
    // Limpiar formulario
    form.reset();
}

// ==================== UTILIDADES ADICIONALES ====================

/**
 * Desplaza suavemente a una sección
 * @param {string} sectionId - ID de la sección
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Obtiene el resumen del carrito para debugging
 */
function getCartSummary() {
    return cart.getSummary();
}
