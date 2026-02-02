# MBappe Store

Frontend de e-commerce en React + Vite para catálogo de productos, carrito y checkout con pago con tarjeta.

**App desplegada:** [Abrir en producción](https://fullstack-checkout-challenge-fronte.vercel.app/)

## Características

- **Listado de productos** (`/products`): grid responsive con tarjetas, búsqueda en tiempo real por nombre, categoría o descripción, chips de categoría/stock (Agotado, Últimas unidades, Novedad).
- **Detalle de producto** (`/products/:id`): imagen, precio, stock, botón agregar al carrito y navegación al listado.
- **Carrito**: modal con ítems, cantidad editable con botones **[-]** y **[+]** (respetando stock disponible), subtotal, envío e impuestos. El ítem se elimina al bajar la cantidad a 0.
- **Checkout**: flujo Carrito → Datos de pago (tarjeta) → Resumen y confirmación. Creación/búsqueda de cliente por email, envío de transacción al backend y vaciado del carrito al finalizar.
- **Estado persistente**: carrito persistido con `redux-persist` (localStorage).

## Stack tecnológico

| Tecnología        | Uso                          |
|-------------------|------------------------------|
| React 19          | UI                           |
| Vite 7            | Build y dev server           |
| Redux Toolkit     | Estado global (productos, carrito) |
| redux-persist     | Persistencia del carrito     |
| Material-UI (MUI) | Componentes y tema           |
| React Router 7    | Rutas                        |
| Axios             | Cliente HTTP                 |
| Sonner            | Notificaciones toast         |

## Requisitos

- Node.js 18+
- Backend de API (productos, clientes, transacciones). **Backend desplegado:** [Abrir API en producción](https://fullstack-checkout-challenge-backend-production.up.railway.app). Para desarrollo local se usa `http://localhost:3000` por defecto.

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev
```

### Variables de entorno

Crea un archivo `.env` en la raíz para configurar la URL del API:

```env
# Backend desplegado (producción)
VITE_API_URL=https://fullstack-checkout-challenge-backend-production.up.railway.app

# O para desarrollo local:
# VITE_API_URL=http://localhost:3000
```

Si no se define `VITE_API_URL`, se usa `http://localhost:3000` por defecto.

## Scripts disponibles

| Comando           | Descripción                |
|-------------------|----------------------------|
| `npm run dev`     | Servidor de desarrollo     |
| `npm run build`   | Build de producción        |
| `npm run preview` | Vista previa del build     |
| `npm run lint`    | ESLint                     |
| `npm run format`  | Prettier sobre `src`       |

## Estructura del proyecto

```
src/
├── api/                    # Servicios HTTP
│   ├── axiosConfig.js      # Instancia Axios (baseURL desde VITE_API_URL)
│   ├── productService.js   # GET productos, producto por ID
│   ├── customerService.js  # Cliente por email, crear cliente
│   └── transactionService.js  # Crear transacción (checkout)
├── constants/
│   └── store.js            # STORE_NAME, BASE_FEE, DELIVERY_FEE
├── models/
│   ├── store.js            # Configuración Redux + redux-persist
│   └── productSlice.js     # list, cart, currentProduct; fetchProducts, addToCart, increment/decrementCartItem, clearCart
├── router/
│   └── AppRouter.jsx       # Rutas: /products, /products/:id, /checkout; resto → /products
├── theme/
│   └── AppTheme.js         # Tema MUI
├── utils/
│   └── price.js            # getPriceAmount (precio desde objeto API)
├── view/
│   ├── components/         # Componentes reutilizables
│   │   ├── CartModal.jsx   # Modal carrito (cantidad +/- por ítem)
│   │   ├── PaymentModal.jsx   # Formulario tarjeta y datos de envío
│   │   └── SummaryBackdrop.jsx  # Resumen pre-pago y confirmación
│   └── page/
│       ├── ProductPage.jsx       # Listado + búsqueda + carrito
│       ├── ProductDetailPage.jsx  # Detalle + agregar al carrito
│       └── CheckoutPage.jsx      # Página checkout (redirige o reutiliza flujo)
└── viewModel/              # Lógica de negocio (MVVM)
    ├── useProductViewModel.jsx   # Productos, búsqueda, addToCart
    └── useCheckoutViewModel.jsx  # Carrito, subtotal/total, submitCheckout
```

## Arquitectura

- **MVVM**: las páginas (`view/page`) consumen hooks de `viewModel` que orquestan Redux y servicios en `api/`. Los componentes en `view/components` reciben props (datos y callbacks) desde las páginas.
- **Estado**: Redux almacena `products.list`, `products.cart` y `products.currentProduct`. El carrito se rehidrata desde `localStorage` gracias a `redux-persist`.
- **API**: todos los datos de productos, clientes y transacciones se obtienen vía Axios usando la base URL configurada en `axiosConfig.js`.

## Rutas

| Ruta            | Página             | Descripción                          |
|-----------------|--------------------|--------------------------------------|
| `/products`     | ProductPage        | Listado y búsqueda de productos      |
| `/products/:id` | ProductDetailPage  | Detalle de un producto               |
| `/checkout`     | CheckoutPage       | Página de checkout                   |
| Cualquier otra  | Redirect           | Redirección a `/products`            |

## Flujo de checkout

1. Usuario agrega productos al carrito desde listado o detalle.
2. Abre el carrito (icono) y puede ajustar cantidades con **[-]** / **[+]**.
3. Pulsa "Pagar con tarjeta de crédito" → se abre el modal de pago (datos de tarjeta y envío).
4. Tras confirmar, se muestra el resumen (SummaryBackdrop); al confirmar pago se llama al backend (cliente + transacción), se vacía el carrito y se refresca el listado de productos (stock actualizado).
