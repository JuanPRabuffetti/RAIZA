CREATE TABLE "products" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"gallery" text[] NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"catalog_single_preview" boolean DEFAULT false NOT NULL,
	"catalog_double_preview" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_price_positive" CHECK ("price" >= 0),
	CONSTRAINT "products_category_valid" CHECK ("category" IN ('libros', 'juegos', 'accesorios', 'tarjetas', 'jabones', 'ropa'))
);
