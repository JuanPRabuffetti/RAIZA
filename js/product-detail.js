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
        setMetaContent('meta[name="robots"]', 'noindex, follow', 'name', 'robots');
        target.innerHTML = `
            <div class="product-detail-empty">
                <h1>Producto no encontrado</h1>
                <p>No pudimos cargar el producto solicitado.</p>
            </div>
        `;
        return;
    }

    const images = getProductImages(product);
    updateProductSeo(product, images);

    target.innerHTML = `
        <div class="product-gallery-panel">
            <div class="product-main-image-wrap">
                <img id="productMainImage" class="product-main-image" src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}">
            </div>
            <div class="product-thumbs" id="productThumbs">
                ${images.map((img, index) => `
                    <button type="button" class="product-thumb ${index === 0 ? 'active' : ''}" data-image="${escapeHtml(img)}" aria-label="Vista ${index + 1}">
                        <img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} ${index + 1}" loading="lazy">
                    </button>
                `).join('')}
            </div>
        </div>

        <div class="product-detail-info">
            <p class="product-detail-category">${escapeHtml(getCategoryLabel(product.category))}</p>
            <h1 class="product-detail-title">${escapeHtml(product.name)}</h1>
            <p class="product-detail-description">${escapeHtml(product.description)}</p>
            <p class="product-detail-price">$${formatPrice(product.price)}</p>
            <button type="button" class="btn" onclick="openProductWhatsApp(${product.id})">Saber mas</button>
        </div>
    `;

    bindGalleryHover();
}

function setMetaContent(selector, content, attribute, key) {
    let tag = document.head.querySelector(selector);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

function toAbsoluteUrl(path) {
    return new URL(path, window.location.origin).href;
}

function updateProductSeo(product, images) {
    const title = `${product.name} | RAIZA Artesanal`;
    const description = product.description.replace(/\s+/g, ' ').trim().slice(0, 160);
    const url = `${window.location.origin}/product?id=${product.id}`;
    const image = toAbsoluteUrl(images[0]);

    document.title = title;
    setMetaContent('meta[name="description"]', description, 'name', 'description');
    setMetaContent('meta[property="og:title"]', title, 'property', 'og:title');
    setMetaContent('meta[property="og:description"]', description, 'property', 'og:description');
    setMetaContent('meta[property="og:url"]', url, 'property', 'og:url');
    setMetaContent('meta[property="og:image"]', image, 'property', 'og:image');

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    const structuredData = document.createElement('script');
    structuredData.type = 'application/ld+json';
    structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: images.map(toAbsoluteUrl),
        category: getCategoryLabel(product.category),
        brand: { '@type': 'Brand', name: 'RAIZA' },
        url,
        offers: {
            '@type': 'Offer',
            price: formatPrice(product.price),
            priceCurrency: 'UYU',
            availability: 'https://schema.org/InStock',
            url,
            seller: { '@type': 'Organization', name: 'RAIZA Artesanal' }
        }
    });
    document.head.appendChild(structuredData);
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

function buildProductWhatsAppMessage(product) {
    return [
        'Hola, quiero mas informacion sobre este producto:',
        '',
        `Producto: ${product.name}`
    ].join('\n');
}

function openProductWhatsApp(productId) {
    const product = findProductById(productId);
    if (!product) {
        showNotification('No pudimos cargar el producto para WhatsApp.', 'error');
        return;
    }

    const message = buildProductWhatsAppMessage(product);
    openWhatsAppMessage(WHATSAPP_PHONE, message);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeStyles();
    refreshProductDetail();
});

async function refreshProductDetail() {
    const target = document.getElementById('productDetail');
    target.textContent = 'Cargando producto…';
    target.setAttribute('aria-busy', 'true');
    try {
        await loadProducts();
        renderProductDetail();
        bindMainImageMagnifier();
    } catch {
        renderCatalogError(target, refreshProductDetail);
    } finally {
        target.setAttribute('aria-busy', 'false');
    }
}
