export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  estado: boolean;
  idCategoria: number;
}