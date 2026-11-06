DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS vendedor;

CREATE TABLE vendedor(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  documento VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE, 
  telefono VARCHAR(20),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE producto(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(12,2) NOT NULL CHECK(precio > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0)
);

CREATE TABLE venta(  
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  vendedor_id INTEGER NOT NULL REFERENCES vendedor(id) ON DELETE RESTRICT,
  producto_id INTEGER NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK( precio_unitario > 0),
  total NUMERIC(12,2) NOT NULL CHECK(total = cantidad * precio_unitario)
);

CREATE INDEX idx_venta_vendedor_id ON venta(vendedor_id);
CREATE INDEX idx_venta_producto_id ON venta(producto_id);
