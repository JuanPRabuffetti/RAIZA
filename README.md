# RAIZA

La tienda mantiene su diseño original y usa un catálogo compartido en Netlify Database. El panel privado permite agregar, editar, ocultar o eliminar productos y subir fotografías sin modificar archivos.

## Primer acceso al panel

1. Después del despliegue, abrí el proyecto RAIZA en Netlify y entrá a **Identity**. La integración de Identity quedó incluida en el proyecto.
2. Invitá a `jrbau3004@gmail.com` con **Invite users**. Si esa cuenta ya existe en Identity, no hace falta invitarla de nuevo.
3. Abrí el correo de invitación y creá una contraseña. Los enlaces que llegan a la portada se redirigen al panel para completar este paso.
4. En la lista de usuarios de Identity, abrí esa cuenta, agregá el rol **admin** y guardá. La primera asignación de administrador se realiza desde Netlify, no desde la tienda.
5. Entrá a `/admin` e iniciá sesión. También hay un enlace **Administrar productos** al pie de la tienda.

El panel acepta únicamente ese correo confirmado con el rol `admin`, verificado en el servidor. Las cuentas de clientes que ya existen en la tienda no son cuentas de Identity y no permiten administrar productos. No uses el registro de clientes para crear la cuenta administradora. Para autorizar otras cuentas en el futuro, se debe actualizar la política de acceso en `server/auth.ts` y asignar sus roles desde Netlify.

## Administrar productos

Usá **Nuevo producto** para completar nombre, categoría, precio en pesos uruguayos y descripción. Subí al menos una foto y guardá para publicar. El catálogo permite buscar y filtrar por categoría.

Usá **Editar producto** para cambiar sus datos, sumar o quitar fotos y elegir o reordenar la fotografía principal. Las fotografías admiten JPG, PNG o WebP, hasta 4 MB por archivo y 20 fotos por producto. Se optimizan y guardan en Netlify Blobs; permanecen disponibles entre despliegues. Quitar una foto del producto no elimina el archivo del almacenamiento, para no romper referencias existentes.

Desmarcá **Visible en la tienda** para ocultar un producto sin perder sus datos. **Eliminar** pide confirmación y quita el producto de forma permanente. Los cambios quedan guardados en la base de datos y aparecen en nuevas cargas del catálogo sin necesitar otro despliegue. Las pestañas de la tienda que ya están abiertas deben recargarse.

La recuperación de contraseña está disponible en la pantalla de ingreso. Si una invitación o enlace de recuperación venció, solicitá uno nuevo. Si se modificó un producto en otra sesión, el panel evita sobrescribir los cambios y pide recargar el catálogo.

## Datos y despliegue

El esquema está en `db/schema.ts` y las migraciones en `netlify/database/migrations/`. Netlify las aplica automáticamente durante el despliegue. La migración inicial conserva los 11 productos existentes, sus identificadores, precios, galerías y preferencias de visualización. No se restauran productos eliminados al recargar o desplegar nuevamente.

El despliegue prepara únicamente los archivos públicos dentro de `dist/` y empaqueta el cliente del panel. Los archivos del servidor, las migraciones y la configuración privada no forman parte de la carpeta publicada. Las operaciones del panel requieren sesión autorizada; las escrituras también verifican el origen de la solicitud. Los textos se muestran de forma segura y las imágenes se validan y convierten en el servidor.

## Desarrollo local

Instalá las dependencias con `npm ci`. Usá Netlify Dev para emular las funciones, Identity, Database y Blobs:

```sh
/opt/buildhome/node-deps/node_modules/.bin/netlify dev --port 8889
```

La comprobación de tipos está disponible con `npm run check`. Para cambiar el esquema, consultá primero `netlify db status` y generá una nueva migración con `npx drizzle-kit generate --name nombre_descriptivo`; no apliques cambios de esquema manualmente.
