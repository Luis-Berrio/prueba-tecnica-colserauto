# Prueba técnica Desarrollador Junior · Colserauto

Sistema CRUD para gestionar un flujo simple de ventas: **Venta**, **Producto** y **Vendedor**.
Interfaz en Angular, API REST en Node.js + Express (arquitectura MVC) y base de datos PostgreSQL.

![Pantalla de ventas](docs/capturas/02-ventas.png)

## Contenido

- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Cómo ejecutarlo](#cómo-ejecutarlo)
- [Modelo de datos](#modelo-de-datos)
- [API REST](#api-rest)
- [Arquitectura MVC](#arquitectura-mvc)
- [Reglas de negocio](#reglas-de-negocio)
- [Decisiones técnicas](#decisiones-técnicas)
- [Capturas](#capturas)
- [Posibles mejoras](#posibles-mejoras)

## Tecnologías

| Capa           | Tecnología                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| Frontend       | Angular 19 (componentes _standalone_, formularios reactivos) y Angular Material |
| Backend        | Node.js 20, Express 5 y TypeScript                                              |
| Base de datos  | PostgreSQL, con **scripts SQL** como fuente de verdad                           |
| Acceso a datos | Prisma 7 (el esquema se obtiene de la base con `prisma db pull`)                |
| Validación     | zod                                                                             |

## Estructura del repositorio

```
.
├── database/                  Scripts SQL (se ejecutan en orden)
│   ├── 01_create_database.sql   Crea la base de datos
│   ├── 02_schema.sql            Crea las tablas, claves y relaciones
│   └── 03_seed.sql              Inserta datos de prueba (5+ por tabla)
├── backend/                   API REST (Node.js + Express)
│   ├── prisma/                  Esquema de Prisma (generado desde la base)
│   └── src/
│       ├── routes/              URL -> controlador
│       ├── controllers/         Reciben la petición y responden
│       ├── services/            Lógica de negocio y acceso a datos
│       ├── schemas/             Validación de entrada (zod)
│       ├── middlewares/         Manejo centralizado de errores
│       └── errors/              Error HTTP propio
├── frontend/                  Aplicación Angular
│   └── src/app/
│       ├── core/                Modelos, URL de la API e interceptor de errores
│       ├── services/            Un servicio HTTP por recurso
│       ├── shared/              Diálogo de confirmación reutilizable
│       └── features/            Pantallas: inicio, ventas, productos, vendedores
└── docs/                      Diagrama relacional y capturas
```

## Cómo ejecutarlo

**Requisitos:** Node.js 20 o superior, PostgreSQL 12 o superior y Git.

### 1. Base de datos

Ejecuta los scripts de `database/` **en orden**:

```bash
psql -U postgres -f database/01_create_database.sql
psql -U postgres -d colserauto_ventas -f database/02_schema.sql
psql -U postgres -d colserauto_ventas -f database/03_seed.sql
```

También funciona desde pgAdmin: ejecuta `01` conectado a la base `postgres`, y `02` y `03`
conectado a `colserauto_ventas`.

> `02_schema.sql` empieza borrando las tablas si existen, así que se puede volver a ejecutar
> (junto con `03_seed.sql`) para dejar la base en su estado inicial.

### 2. Backend

```bash
cd backend
cp .env.example .env      # y ajusta en DATABASE_URL la clave de tu PostgreSQL
npm install
npm run db:generate       # genera el cliente de Prisma
npm run dev               # API en http://localhost:3000
```

Comprueba que responde: `curl http://localhost:3000/health` debe devolver `{"status":"ok"}`.

Variables del archivo `.env`:

| Variable       | Ejemplo                                                           | Descripción           |
| -------------- | ----------------------------------------------------------------- | --------------------- |
| `DATABASE_URL` | `postgresql://postgres:postgres@127.0.0.1:5432/colserauto_ventas` | Conexión a PostgreSQL |
| `PORT`         | `3000`                                                            | Puerto de la API      |

### 3. Frontend

```bash
cd frontend
npm install
npm start                 # aplicación en http://localhost:4200
```

El frontend espera la API en `http://localhost:3000/api`. Si la cambias de puerto, edita
`frontend/src/app/core/api.config.ts`.

## Modelo de datos

![Diagrama relacional](docs/diagrama-er.png)

```mermaid
erDiagram
    VENDEDOR ||--o{ VENTA : realiza
    PRODUCTO ||--o{ VENTA : "se vende en"
    VENDEDOR {
        int id PK
        varchar nombre
        varchar identificacion UK
        varchar email UK
        varchar telefono
        boolean activo
    }
    PRODUCTO {
        int id PK
        varchar codigo UK
        varchar nombre
        text descripcion
        numeric precio
        int stock
    }
    VENTA {
        int id PK
        timestamptz fecha
        int vendedor_id FK
        int producto_id FK
        int cantidad
        numeric precio_unitario
        numeric total
    }
```

**Relaciones:** un vendedor realiza muchas ventas y un producto aparece en muchas ventas
(uno a muchos). Cada venta pertenece a un solo vendedor y a un solo producto.

**Reglas que garantiza la propia base de datos:**

| Regla                                               | Cómo                                                    |
| --------------------------------------------------- | ------------------------------------------------------- |
| Claves primarias autogeneradas                      | `GENERATED ALWAYS AS IDENTITY`                          |
| Identificación, correo y código no se repiten       | `UNIQUE`                                                |
| Precio y stock no negativos; cantidad mayor que 0   | `CHECK`                                                 |
| `total = cantidad × precio_unitario`                | `CHECK`                                                 |
| No se borra un vendedor o producto que tiene ventas | `ON DELETE RESTRICT` en las claves foráneas             |
| Búsquedas rápidas por vendedor y producto           | Índices sobre `venta.vendedor_id` y `venta.producto_id` |

`precio_unitario` se guarda en la venta para conservar el precio **al momento de vender**,
aunque el producto cambie de precio después.

## API REST

Base: `http://localhost:3000/api`. Los tres recursos tienen los mismos cinco endpoints.

| Método | Ruta                                     | Descripción | Respuesta          |
| ------ | ---------------------------------------- | ----------- | ------------------ |
| GET    | `/vendedores` · `/productos` · `/ventas` | Lista todos | 200                |
| GET    | `/{recurso}/:id`                         | Obtiene uno | 200, o 404         |
| POST   | `/{recurso}`                             | Crea        | **201**            |
| PUT    | `/{recurso}/:id`                         | Actualiza   | 200, o 404         |
| DELETE | `/{recurso}/:id`                         | Elimina     | **204**, o 404/409 |

Además: `GET /health` para comprobar que la API está viva.

**Formato de errores.** Todos los errores tienen la misma forma y un mensaje claro para el usuario:

```json
{ "error": { "message": "Ya existe un vendedor con ese correo" } }
```

| Código | Cuándo                                                                                                                           |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Datos inválidos (con el detalle campo por campo), JSON mal formado o `id` no numérico                                            |
| 404    | El registro o la ruta no existen                                                                                                 |
| 409    | Duplicado (identificación, correo o código), registro con ventas que se intenta eliminar, stock insuficiente o vendedor inactivo |
| 500    | Error inesperado (el detalle queda en el registro del servidor, no se envía al cliente)                                          |

**Ejemplo: registrar una venta.** El cliente solo envía quién, qué y cuánto; el servidor calcula
el precio y el total:

```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{"vendedor_id": 2, "producto_id": 4, "cantidad": 3}'
```

```json
{
  "id": 7,
  "fecha": "2026-11-06T15:22:33.137Z",
  "vendedor_id": 2,
  "producto_id": 4,
  "cantidad": 3,
  "precio_unitario": "78000",
  "total": "234000",
  "vendedor": { "id": 2, "nombre": "Isabella Corzo", "...": "..." },
  "producto": { "id": 4, "nombre": "Bujías de iridio", "...": "..." }
}
```

> Los montos viajan como texto (`"78000"`) porque Prisma entrega los `NUMERIC` de PostgreSQL como
> decimales exactos. El frontend los convierte al mostrarlos.

## Arquitectura MVC

| Capa            | Dónde está                                               | Responsabilidad                                     |
| --------------- | -------------------------------------------------------- | --------------------------------------------------- |
| **Modelo**      | `backend/src/services/` y `backend/prisma/schema.prisma` | Lógica de negocio y acceso a los datos              |
| **Controlador** | `backend/src/controllers/` y `backend/src/routes/`       | Reciben la petición, validan la entrada y responden |
| **Vista**       | La respuesta JSON de la API y el frontend en `frontend/` | Lo que ve el usuario                                |

Cada capa tiene una sola responsabilidad: los controladores no tocan la base de datos y los
servicios no conocen HTTP. Los errores se lanzan desde cualquier capa y **un único middleware**
(`middlewares/errorHandler.ts`) los convierte en la respuesta adecuada.

## Reglas de negocio

El registro de ventas mantiene el inventario coherente:

- **El precio y el total los calcula el servidor** a partir del producto; el cliente no puede enviarlos.
- **Vender descuenta el stock**, **editar una venta lo reajusta** y **eliminarla lo devuelve** al producto.
- Se valida que el vendedor y el producto existan (404) y que el vendedor esté **activo** (409).
- Si el stock no alcanza, la venta se rechaza con **409 "Stock insuficiente"**.
- Todo ocurre dentro de **una transacción**: si algo falla a la mitad, no queda nada a medias.
- El descuento de stock es **una sola sentencia condicional** (`stock >= cantidad`), así dos ventas
  simultáneas no pueden vender la última unidad dos veces. Comprobado lanzando 20 ventas a la vez de
  1 unidad de un producto con stock 12: **entraron 12, se rechazaron 8 y el stock final fue 0**.

## Decisiones técnicas

- **El SQL es la fuente de verdad.** La base se crea con los scripts de `database/`; Prisma solo
  _lee_ esa estructura (`prisma db pull`). Así no hay dos definiciones del esquema que mantener.
- **Validación en el borde** con zod: los datos inválidos se rechazan con un 400 antes de tocar la base.
- **Errores centralizados.** Los controladores no usan `try/catch`: Express 5 envía las excepciones
  al middleware de errores. Los errores de la base se traducen a mensajes específicos
  (por ejemplo, _"No se puede eliminar el vendedor porque tiene ventas registradas"_).
- **Angular standalone + Material**, con un interceptor HTTP que muestra los errores de la API en un
  aviso, sin repetir el manejo en cada pantalla.
- **Formularios reactivos** con validación visible (campos obligatorios, correo, números enteros).

## Capturas

|                                                            |                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| ![Inicio](docs/capturas/01-inicio.png) **Inicio**          | ![Ventas](docs/capturas/02-ventas.png) **Ventas**             |
| ![Productos](docs/capturas/03-productos.png) **Productos** | ![Vendedores](docs/capturas/04-vendedores.png) **Vendedores** |

---

Desarrollado por **Luis Berrio**.
