export interface Vendedor {
  id: number;
  nombre: string;
  identificacion: string;
  email: string;
  telefono: string | null;
  activo: boolean;
}

export type VendedorInput = Omit<Vendedor, 'id'>;

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: string;
  stock: number;
}

export interface ProductoInput {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
}

export interface Venta {
  id: number;
  fecha: string;
  vendedor_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: string;
  total: string;
  vendedor: Vendedor;
  producto: Producto;
}

export interface VentaInput {
  vendedor_id: number;
  producto_id: number;
  cantidad: number;
}
