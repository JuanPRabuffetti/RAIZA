// database.js - Base de datos de productos
const products = [
    {
        id: 1,
        name: "Libro para Embarazo",
        category: "libros",
        price: 1190,
        description: "Tamaño A5 con 60 páginas para documentar el embarazo: ecografías, notas de control y pensamientos. Se entrega en bolsa de tela.",
        image: "pictures/libro_seguimiento_embarazo.jpeg",
        gallery: [
            "pictures/libro_seguimiento_embarazo.jpeg",
            "pictures/libroembarazo1.jpeg",
            "pictures/libroembarazo2.jpeg",
            "pictures/libroembarazo3.jpeg",
            "pictures/libroembarazo4.jpeg",
            "pictures/libroembarazo5.jpeg",
            "pictures/libroembarazo6.jpeg",
            "pictures/libroembarazo7.jpeg",
            "pictures/libroembarazo8.jpeg",
            "pictures/libroembarazo9.jpeg",
            "pictures/libroembarazo10.jpeg"
        ],
        available: true
    },
    {
        id: 2,
        name: "Tarjetas del Primer Año",
        category: "libros",
        price: 790,
        description: "Set de 12 tarjetas ilustradas para los primeros doce meses y eventos clave; se presentan en bolsa de tela.",
        image: "pictures/tarjetas1.jpeg",
        gallery: [
            "pictures/tarjetas1.jpeg",
            "pictures/tarjetas2.jpeg",
            "pictures/tarjetas3.jpeg",
            "pictures/tarjetas (1).jpeg",
            "pictures/tarjetas (2).jpeg",
            "pictures/tarjetas (3).jpeg",
            "pictures/tarjetas (4).jpeg",
            "pictures/tarjetas (5).jpeg",
            "pictures/tarjetas (6).jpeg",
            "pictures/tarjetas (7).jpeg",
            "pictures/tarjetas (8).jpeg",
            "pictures/tarjetas (9).jpeg",
            "pictures/tarjetas (10).jpeg",
            "pictures/tarjetas (11).jpeg"
        ],
        available: true
    },
    {
        id: 3,
        name: "Libro de Recuerdos del Bebé",
        category: "libros",
        price: 1490,
        description: "Impreso en papel ecológico con 70 páginas para conservar recuerdos y fotografías del primer año. Incluye tarjeta personalizada. Se entrega en bolsa de lienzo.",
        image: "pictures/libro_de_recuerdos_sin_personalizar.jpeg",
        gallery: [
            "pictures/libro_de_recuerdos_sin_personalizar.jpeg",
            "pictures/librorecuerdos1 (1).jpeg",
            "pictures/librorecuerdos1 (2).jpeg",
            "pictures/librorecuerdos1 (3).jpeg",
            "pictures/librorecuerdos1 (4).jpeg",
            "pictures/librorecuerdos1 (5).jpeg",
            "pictures/librorecuerdos1 (6).jpeg",
            "pictures/librorecuerdos1 (7).jpeg",
            "pictures/librorecuerdos1 (8).jpeg"
        ],
        available: true
    },
    {
        id: 4,
        name: "Libro de Recuerdos Personalizado",
        category: "libros",
        price: 1590,
        description: "Versión personalizada del libro de recuerdos, con carátula que puede llevar el nombre del bebé. Papel ecológico, 70 páginas en bolsa de lienzo.",
        image: "pictures/libro_de_recuerdos_personalizado.jpeg",
        gallery: [
            "pictures/libro_de_recuerdos_personalizado.jpeg",
            "pictures/librorecuerdos1 (9).jpeg",
            "pictures/librorecuerdos1 (10).jpeg",
            "pictures/librorecuerdos1 (11).jpeg",
            "pictures/librorecuerdos1 (12).jpeg",
            "pictures/librorecuerdos1 (13).jpeg",
            "pictures/librorecuerdos1 (14).jpeg",
            "pictures/librorecuerdos1 (15).jpeg",
            "pictures/librorecuerdos1 (16).jpeg"
        ],
        available: true
    },
    {
        id: 5,
        name: "MEMO Bajo del Mar",
        category: "juegos",
        price: 490,
        description: "Juego de memoria con ilustraciones de animales marinos. Cartas plastificadas y resistentes al agua, ideal para estimulación temprana.",
        image: "pictures/memo1.jpeg",
        gallery: [
            "pictures/memo1.jpeg",
            "pictures/memo2.jpeg",
            "pictures/memo (1).jpeg",
            "pictures/memo (2).jpeg",
            "pictures/memo (3).jpeg",
            "pictures/memo (4).jpeg",
            "pictures/memo (5).jpeg",
            "pictures/memo (6).jpeg"
        ],
        catalogDoublePreview: true,
        available: true
    },
    {
        id: 6,
        name: "Almohadillas para Sellos y Manos",
        category: "accesorios",
        price: 390,
        description: "Almohadillas para sellos de manos y pies de bebés, diseñadas para conservar impresiones duraderas.",
        image: "pictures/almohadilla_huellas.jpeg",
        gallery: [
            "pictures/almohadilla_huellas.jpeg",
            "pictures/almohadilla2.jpeg"
        ],
        catalogSinglePreview: true,
        available: false
    }
];
