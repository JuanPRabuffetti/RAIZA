// product-detail.js - Render de detalle individual con galeria hover

function getProductFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return findProductById(id) || null;
}

function getProductImages(product) {
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
        return product.gallery;
    }
    return [product.image];
}

function renderProductDetail() {
    const product = getProductFromQuery();
    const target = document.getElementById('productDetail');

    if (!target) {
        return;
    }

    if (!product) {
        target.innerHTML = `
            <div class="product-detail-empty">
                <h1>Producto no encontrado</h1>
                <p>No pudimos cargar el producto solicitado.</p>
            </div>
        `;
        return;
    }

    const images = getProductImages(product);

    target.innerHTML = `
        <div class="product-gallery-panel">
            <div class="product-main-image-wrap">
                <img id="productMainImage" class="product-main-image" src="${images[0]}" alt="${product.name}">
            </div>
            <div class="product-thumbs" id="productThumbs">
                ${images.map((img, index) => `
                    <button type="button" class="product-thumb ${index === 0 ? 'active' : ''}" data-image="${img}" aria-label="Vista ${index + 1}">
                        <img src="${img}" alt="${product.name} ${index + 1}" loading="lazy">
                    </button>
                `).join('')}
            </div>
        </div>

        <div class="product-detail-info">
            <p class="product-detail-category">${getCategoryLabel(product.category)}</p>
            <h1 class="product-detail-title">${product.name}</h1>
            <p class="product-detail-description">${product.description}</p>
            <p class="product-detail-price">$${formatPrice(product.price)}</p>
            <button type="button" class="btn" onclick="addDetailProductToCart(${product.id})">Agregar al carrito</button>
        </div>
    `;

    bindGalleryHover();
}

function bindGalleryHover() {
    const mainImage = document.getElementById('productMainImage');
    const thumbs = document.querySelectorAll('.product-thumb');

    if (!mainImage || thumbs.length === 0) {
        return;
    }

    thumbs.forEach(thumb => {
        const setImage = () => {
            const nextImage = thumb.getAttribute('data-image');
            if (!nextImage) return;

            mainImage.src = nextImage;
            thumbs.forEach(item => item.classList.remove('active'));
            thumb.classList.add('active');
        };

        thumb.addEventListener('mouseenter', setImage);
        thumb.addEventListener('focus', setImage);
    });
}

function bindMainImageMagnifier() {
    const wrap = document.querySelector('.product-main-image-wrap');
    const image = document.getElementById('productMainImage');

    if (!wrap || !image) {
        return;
    }

    const moveZoom = (clientX, clientY) => {
        const rect = wrap.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        image.style.transformOrigin = `${clampedX}% ${clampedY}%`;
    };

    wrap.addEventListener('mouseenter', function(event) {
        wrap.classList.add('is-zoomed');
        moveZoom(event.clientX, event.clientY);
    });

    wrap.addEventListener('mousemove', function(event) {
        if (!wrap.classList.contains('is-zoomed')) {
            return;
        }
        moveZoom(event.clientX, event.clientY);
    });

    wrap.addEventListener('mouseleave', function() {
        wrap.classList.remove('is-zoomed');
        image.style.transformOrigin = 'center center';
    });
}

function addDetailProductToCart(productId) {
    cart.addItem(productId);
    showNotification('Producto agregado al carrito', 'success');
}

document.addEventListener('DOMContentLoaded', function() {
    initializeStyles();
    renderProductDetail();
    bindMainImageMagnifier();
});
