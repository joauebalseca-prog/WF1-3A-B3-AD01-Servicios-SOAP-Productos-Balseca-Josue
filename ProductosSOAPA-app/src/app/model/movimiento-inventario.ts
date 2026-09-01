export interface ProductoMovimiento {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: boolean;
  idCategoria: number;
}

export interface MovimientoInventario {
  idMovimiento: number;
  idProducto: number;
  tipoMovimiento: string;
  cantidad: number;
  fechaMovimiento: string;
  observacion?: string;
  producto?: ProductoMovimiento | null;
}