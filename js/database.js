// database.js - Base de datos de productos
const products = [
    {
        id: 1,
        name: "Libro para Embarazo",
        category: "libros",
        price: 1190,
        description: "Cuaderno diseñado para acompañar y registrar cada etapa del embarazo. Tamaño A5, con 60 páginas en papel ecológico de 250 g, ideal para guardar ecografías, anotar controles médicos, pensamientos y recuerdos de esta etapa tan especial. Se entrega en bolsa de tela, perfecta para protegerlo y conservarlo con el tiempo. ",
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
        description: "Set de 24 tarjetas ilustradas para los primeros doce meses y eventos clave; se presentan en bolsa de tela.",
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
        description: "Libro diseñado para conservar los momentos más especiales del primer año de vida. Impreso en papel ecológico con 70 páginas de hojas gruesas de 250 g, ideales para escribir, pegar fotografías y guardar recuerdos. Incluye tarjeta personalizada con el nombre del bebé y se entrega en bolsa de lienzo para protegerlo y conservarlo.",
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
        description: "Versión personalizada del libro de recuerdos, con carátula diseñada con el nombre del bebé. Impreso en papel ecológico de 250 g, de excelente calidad. Incluye bolsa de lienzo para guardarlo y conservarlo.",
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
            "pictures/librorecuerdos1 (16).jpeg",
            "pictures/libro_personalizado (1).jpeg",
            "pictures/libro_personalizado (2).jpeg",
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
        description: "Almohadillas diseñadas para tomar las huellas de las manos y los pies del bebé de forma simple y prolija, permitiendo conservar una impresión duradera de este momento único. Son ideales para completar la sección de huellas del Libro de Recuerdos del Bebé y guardar ese recuerdo especial para siempre.",
        image: "pictures/almohadilla_huellas.jpeg",
        gallery: [
            "pictures/almohadilla_huellas.jpeg",
            "pictures/almohadilla2.jpeg"
        ],
        catalogSinglePreview: true,
        available: false
    },
    {
        id: 7,
        name: "Separadores de percha para ropa de bebé",
        category: "ropa",
        price: 690,
        description: "Organizá la ropita de tu bebé de forma práctica con nuestros separadores de perchas por edad. Son ideales para mantener el placard ordenado y encontrar fácilmente cada etapa, desde recién nacido hasta los primeros dos años. Elaborados con materiales resistentes y un diseño delicado, pensados para acompañar la estética de un espacio cálido, natural y cuidado.",
        image: "pictures/separadoresropabebe (1).jpeg",
        gallery: [
            "pictures/separadoresropabebe (1).jpeg",
            "pictures/separadoresropabebe (2).jpeg",
            "pictures/separadoresropabebe (3).jpeg",
            "pictures/separadoresropabebe (4).jpeg",
            "pictures/separadoresropabebe (5).jpeg"
        ],
        available: true
    },
    {
        id: 8,
        name: "Tarjetas Personalizadas Cumple",
        category: "tarjetas",
        price: 370,
        description: "Hacé que cada regalo tenga un toque único y especial. Estas tarjetas están diseñadas para acompañar tus obsequios de una forma delicada y significativa.Incluye 15 tarjetas personalizadas con el nombre que elijas Son ideales para cumpleaños infantiles, souvenirs o para sumar un detalle especial a tus regalos.",
        image: "pictures/tarjetas_personalizadas_cumple (1).jpeg",
        gallery: [
            "pictures/tarjetas_personalizadas_cumple (1).jpeg",
            "pictures/tarjetas_personalizadas_cumple (2).jpeg",
            "pictures/tarjetas_personalizadas_cumple (3).jpeg",
            "pictures/tarjetas_personalizadas_cumple (4).jpeg",
            "pictures/tarjetas_personalizadas_cumple (5).jpeg",
            "pictures/tarjetas_personalizadas_cumple (6).jpeg"
        ],
        available: true
    }
];
