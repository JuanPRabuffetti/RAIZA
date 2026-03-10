// database.js - Base de datos de productos
const products = [
    {
        id: 1,
        name: "Libro para Embarazo",
        category: "libros",
        price: 1190,
        description: "Tamaño A5 con 60 páginas para documentar el embarazo: ecografías, notas de control y pensamientos. Se entrega en bolsa de tela.",
        image: "pictures/libro_seguimiento_embarazo.jpeg",
        available: true
    },
    {
        id: 2,
        name: "Tarjetas del Primer Año",
        category: "libros",
        price: 790,
        description: "Set de 12 tarjetas ilustradas para los primeros doce meses y eventos clave; se presentan en bolsa de tela.",
        image: "pictures/tarjetas1.jpeg",
        available: true
    },
    {
        id: 3,
        name: "Libro de Recuerdos del Bebé",
        category: "libros",
        price: 1490,
        description: "Impreso en papel ecológico con 70 páginas para conservar recuerdos y fotografías del primer año. Incluye tarjeta personalizada. Se entrega en bolsa de lienzo.",
        image: "pictures/libro_de_recuerdos_sin_personalizar.jpeg",
        available: true
    },
    {
        id: 4,
        name: "Libro de Recuerdos Personalizado",
        category: "libros",
        price: 1590,
        description: "Versión personalizada del libro de recuerdos, con carátula que puede llevar el nombre del bebé. Papel ecológico, 70 páginas en bolsa de lienzo.",
        image: "pictures/libro_de_recuerdos_personalizado.jpeg",
        available: true
    },
    {
        id: 5,
        name: "MEMO Bajo del Mar",
        category: "juegos",
        price: 490,
        description: "Juego de memoria con ilustraciones de animales marinos. Cartas plastificadas y resistentes al agua, ideal para estimulación temprana.",
        image: "pictures/memo1.jpeg",
        gallery: ["pictures/memo1.jpeg", "pictures/memo2.jpeg"],
        available: true
    },
    {
        id: 6,
        name: "Almohadillas para Sellos y Manos",
        category: "accesorios",
        price: 390,
        description: "Almohadillas para sellos de manos y pies de bebés, diseñadas para conservar impresiones duraderas.",
        image: "pictures/memo2.jpeg",
        available: false
    }
];
