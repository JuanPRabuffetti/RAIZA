import { sql } from 'drizzle-orm';
import { boolean, check, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    description: text('description').notNull(),
    image: text('image').notNull(),
    gallery: text('gallery').array().notNull(),
    available: boolean('available').notNull().default(true),
    catalogSinglePreview: boolean('catalog_single_preview').notNull().default(false),
    catalogDoublePreview: boolean('catalog_double_preview').notNull().default(false),
    version: integer('version').notNull().default(1),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
    check('products_price_positive', sql`${table.price} >= 0`),
    check('products_category_valid', sql`${table.category} IN ('libros', 'juegos', 'accesorios', 'tarjetas', 'jabones', 'ropa')`),
]);
