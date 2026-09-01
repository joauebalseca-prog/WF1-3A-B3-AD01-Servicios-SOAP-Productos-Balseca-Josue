import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductoService } from './services/producto';
import { MovimientoInventarioService } from './services/movimiento-inventario.service';

import { Producto } from './model/producto.model';
import { Categoria } from './model/categoria.model';
import { MovimientoInventario } from './model/movimiento-inventario';


@Component({
  selector: 'app-root',

  imports: [
    FormsModule
  ],

  templateUrl: './app.html',

  styleUrl: './app.css'
})
export class App {


  // ============================================
  // PRODUCTOS
  // ============================================
  productos = signal<Producto[]>([]);


  // ============================================
  // CATEGORIAS
  // ============================================
  categorias = signal<Categoria[]>([]);


  // ============================================
  // MOVIMIENTOS DE INVENTARIO
  // ============================================
  movimientos = signal<MovimientoInventario[]>([]);


  // ============================================
  // MODO EDICION PRODUCTO
  // ============================================
  modoEdicion = false;


  // ============================================
  // MODO EDICION MOVIMIENTO
  // ============================================
  modoEdicionMovimiento = false;


  // ============================================
  // BUSQUEDA PRODUCTO POR ID
  // ============================================
  idBusqueda: number = 0;


  // ============================================
  // BUSQUEDA MOVIMIENTO POR ID
  // ============================================
  idMovimientoBusqueda: number = 0;


  // ============================================
  // FILTROS PRODUCTOS
  // ============================================
  precioMinimo: number = 0;

  precioMaximo: number = 0;

  categoriaFiltro: number = 0;


  // ============================================
  // PRODUCTO FORMULARIO
  // ============================================
  productoNuevo: Producto = {

    idProducto: 0,

    nombre: '',

    descripcion: '',

    precio: 0,

    stock: 0,

    estado: true,

    idCategoria: 0
  };


  // ============================================
  // MOVIMIENTO FORMULARIO
  // ============================================
  movimientoNuevo: MovimientoInventario = {

    idMovimiento: 0,

    idProducto: 0,

    tipoMovimiento: 'Entrada',

    cantidad: 1,

    fechaMovimiento: '',

    observacion: '',

    producto: null
  };


  // ============================================
  // CONSTRUCTOR
  // ============================================
  constructor(
    private productoService: ProductoService,
    private movimientoService: MovimientoInventarioService
  ) {

    this.cargarProductos();

    this.cargarCategorias();

    this.cargarMovimientos();
  }


  // ==========================================================
  // ==========================================================
  //                    PRODUCTOS
  // ==========================================================
  // ==========================================================


  // ============================================
  // CARGAR PRODUCTOS
  // ============================================
  cargarProductos(): void {

    this.productoService
      .obtenerProductos()
      .subscribe({

        next: (datos) => {

          this.productos.set(datos);

          console.log(
            'Productos recibidos:',
            datos
          );
        },

        error: (error) => {

          console.error(
            'Error al obtener productos:',
            error
          );
        }

      });
  }


  // ============================================
  // CARGAR CATEGORIAS
  // ============================================
  cargarCategorias(): void {

    this.productoService
      .obtenerCategorias()
      .subscribe({

        next: (datos) => {

          this.categorias.set(datos);
        },

        error: (error) => {

          console.error(
            'Error al obtener categorías:',
            error
          );
        }

      });
  }


  // ============================================
  // BUSCAR PRODUCTO POR ID
  // ============================================
  buscarPorId(): void {

    if (this.idBusqueda <= 0) {

      alert(
        'Ingrese un ID de producto válido.'
      );

      return;
    }

    this.productoService
      .obtenerProducto(
        this.idBusqueda
      )
      .subscribe({

        next: (producto) => {

          if (producto) {

            this.productos.set([
              producto
            ]);

          } else {

            this.productos.set([]);

            alert(
              'No se encontró un producto con ese ID.'
            );
          }

        },

        error: (error) => {

          console.error(
            'Error al buscar producto:',
            error
          );

          alert(
            'Ocurrió un error al buscar el producto.'
          );
        }

      });
  }


  // ============================================
  // GUARDAR O ACTUALIZAR PRODUCTO
  // ============================================
  guardarProducto(): void {

    if (!this.productoNuevo.nombre.trim()) {

      alert(
        'Debe ingresar el nombre del producto.'
      );

      return;
    }


    if (this.productoNuevo.precio < 0) {

      alert(
        'El precio no puede ser negativo.'
      );

      return;
    }


    if (this.productoNuevo.stock < 0) {

      alert(
        'El stock no puede ser negativo.'
      );

      return;
    }


    if (this.productoNuevo.idCategoria <= 0) {

      alert(
        'Debe seleccionar una categoría.'
      );

      return;
    }


    // ==========================================
    // ACTUALIZAR PRODUCTO
    // ==========================================
    if (this.modoEdicion) {

      this.productoService
        .actualizarProducto(
          this.productoNuevo
        )
        .subscribe({

          next: () => {

            alert(
              'Producto actualizado correctamente.'
            );

            this.cargarProductos();

            this.limpiarFormulario();
          },

          error: (error) => {

            console.error(
              'Error al actualizar:',
              error
            );

            alert(
              'Error al actualizar el producto.'
            );
          }

        });

      return;
    }


    // ==========================================
    // AGREGAR PRODUCTO
    // ==========================================
    this.productoService
      .agregarProducto(
        this.productoNuevo
      )
      .subscribe({

        next: () => {

          alert(
            'Producto registrado correctamente.'
          );

          this.cargarProductos();

          this.limpiarFormulario();
        },

        error: (error) => {

          console.error(
            'Error al registrar:',
            error
          );

          alert(
            'Error al registrar el producto.'
          );
        }

      });
  }


  // ============================================
  // EDITAR PRODUCTO
  // ============================================
  editarProducto(
    producto: Producto
  ): void {

    this.productoNuevo = {

      idProducto:
        producto.idProducto,

      nombre:
        producto.nombre,

      descripcion:
        producto.descripcion,

      precio:
        producto.precio,

      stock:
        producto.stock,

      estado:
        producto.estado,

      idCategoria:
        producto.idCategoria
    };


    this.modoEdicion = true;


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // ============================================
  // ELIMINAR PRODUCTO
  // ============================================
  eliminarProducto(
    producto: Producto
  ): void {

    const confirmar = confirm(
      `¿Está seguro de eliminar el producto "${producto.nombre}"?`
    );


    if (!confirmar) {

      return;
    }


    this.productoService
      .eliminarProducto(
        producto.idProducto
      )
      .subscribe({

        next: () => {

          alert(
            'Producto eliminado correctamente.'
          );


          this.cargarProductos();


          if (
            this.productoNuevo.idProducto ===
            producto.idProducto
          ) {

            this.limpiarFormulario();
          }

        },

        error: (error) => {

          console.error(
            'Error al eliminar:',
            error
          );


          alert(
            'Error al eliminar el producto.'
          );
        }

      });
  }


  // ============================================
  // FILTRAR POR PRECIO
  // ============================================
  filtrarPorPrecio(): void {

    if (
      this.precioMinimo < 0 ||
      this.precioMaximo < 0
    ) {

      alert(
        'Los precios no pueden ser negativos.'
      );

      return;
    }


    if (
      this.precioMaximo <
      this.precioMinimo
    ) {

      alert(
        'El precio máximo debe ser mayor o igual al mínimo.'
      );

      return;
    }


    this.productoService
      .obtenerProductosPorPrecio(
        this.precioMinimo,
        this.precioMaximo
      )
      .subscribe({

        next: (datos) => {

          this.productos.set(datos);
        },

        error: (error) => {

          console.error(
            'Error al filtrar por precio:',
            error
          );

          alert(
            'Error al filtrar por precio.'
          );
        }

      });
  }


  // ============================================
  // FILTRAR POR CATEGORIA
  // ============================================
  filtrarPorCategoria(): void {

    if (
      this.categoriaFiltro <= 0
    ) {

      alert(
        'Debe seleccionar una categoría.'
      );

      return;
    }


    this.productoService
      .obtenerProductosPorCategoria(
        this.categoriaFiltro
      )
      .subscribe({

        next: (datos) => {

          this.productos.set(datos);
        },

        error: (error) => {

          console.error(
            'Error al filtrar por categoría:',
            error
          );

          alert(
            'Error al filtrar por categoría.'
          );
        }

      });
  }


  // ============================================
  // MOSTRAR TODOS LOS PRODUCTOS
  // ============================================
  mostrarTodos(): void {

    this.idBusqueda = 0;

    this.precioMinimo = 0;

    this.precioMaximo = 0;

    this.categoriaFiltro = 0;

    this.cargarProductos();
  }


  // ============================================
  // LIMPIAR FORMULARIO PRODUCTO
  // ============================================
  limpiarFormulario(): void {

    this.productoNuevo = {

      idProducto: 0,

      nombre: '',

      descripcion: '',

      precio: 0,

      stock: 0,

      estado: true,

      idCategoria: 0
    };


    this.modoEdicion = false;
  }


  // ============================================
  // OBTENER NOMBRE CATEGORIA
  // ============================================
  obtenerNombreCategoria(
    idCategoria: number
  ): string {

    const categoria =
      this.categorias().find(
        c =>
          c.idCategoria ===
          idCategoria
      );


    return categoria
      ? categoria.nombre
      : 'Sin categoría';
  }



  // ==========================================================
  // ==========================================================
  //              MOVIMIENTOS DE INVENTARIO
  // ==========================================================
  // ==========================================================


  // ============================================
  // CARGAR MOVIMIENTOS
  // GET
  // ============================================
  cargarMovimientos(): void {

    this.movimientoService
      .obtenerMovimientos()
      .subscribe({

        next: (datos) => {

          this.movimientos.set(datos);

          console.log(
            'Movimientos recibidos:',
            datos
          );
        },

        error: (error) => {

          console.error(
            'Error al obtener movimientos:',
            error
          );

          alert(
            'Error al obtener los movimientos de inventario.'
          );
        }

      });
  }


  // ============================================
  // BUSCAR MOVIMIENTO POR ID
  // GET POR ID
  // ============================================
  buscarMovimientoPorId(): void {

    if (
      this.idMovimientoBusqueda <= 0
    ) {

      alert(
        'Ingrese un ID de movimiento válido.'
      );

      return;
    }


    this.movimientoService
      .obtenerMovimientoPorId(
        this.idMovimientoBusqueda
      )
      .subscribe({

        next: (movimiento) => {

          this.movimientos.set([
            movimiento
          ]);
        },

        error: (error) => {

          console.error(
            'Error al buscar movimiento:',
            error
          );


          if (
            error.status === 404
          ) {

            alert(
              'No se encontró el movimiento.'
            );

          } else {

            alert(
              'Error al buscar el movimiento.'
            );
          }
        }

      });
  }


  // ============================================
  // GUARDAR O ACTUALIZAR MOVIMIENTO
  // POST / PUT
  // ============================================
  guardarMovimiento(): void {

    // ==========================================
    // VALIDAR PRODUCTO
    // ==========================================
    if (
      this.movimientoNuevo.idProducto <= 0
    ) {

      alert(
        'Debe seleccionar un producto.'
      );

      return;
    }


    // ==========================================
    // VALIDAR TIPO
    // ==========================================
    if (
      this.movimientoNuevo.tipoMovimiento !== 'Entrada' &&
      this.movimientoNuevo.tipoMovimiento !== 'Salida'
    ) {

      alert(
        'El tipo debe ser Entrada o Salida.'
      );

      return;
    }


    // ==========================================
    // VALIDAR CANTIDAD
    // ==========================================
    if (
      this.movimientoNuevo.cantidad <= 0
    ) {

      alert(
        'La cantidad debe ser mayor a 0.'
      );

      return;
    }


    // ==========================================
    // VALIDAR FECHA
    // ==========================================
    if (
      !this.movimientoNuevo.fechaMovimiento
    ) {

      alert(
        'Debe ingresar la fecha del movimiento.'
      );

      return;
    }


    // ==========================================
    // ACTUALIZAR MOVIMIENTO
    // ==========================================
    if (
      this.modoEdicionMovimiento
    ) {

      this.movimientoService
        .actualizarMovimiento(
          this.movimientoNuevo.idMovimiento,
          this.movimientoNuevo
        )
        .subscribe({

          next: () => {

            alert(
              'Movimiento actualizado correctamente.'
            );


            this.cargarMovimientos();


            this.limpiarFormularioMovimiento();
          },

          error: (error) => {

            console.error(
              'Error al actualizar movimiento:',
              error
            );


            if (
              error.error &&
              error.error.mensaje
            ) {

              alert(
                error.error.mensaje
              );

            } else {

              alert(
                'Error al actualizar el movimiento.'
              );
            }
          }

        });


      return;
    }


    // ==========================================
    // AGREGAR MOVIMIENTO
    // ==========================================
    this.movimientoService
      .agregarMovimiento(
        this.movimientoNuevo
      )
      .subscribe({

        next: () => {

          alert(
            'Movimiento registrado correctamente.'
          );


          this.cargarMovimientos();


          this.limpiarFormularioMovimiento();
        },

        error: (error) => {

          console.error(
            'Error al registrar movimiento:',
            error
          );


          if (
            error.error &&
            error.error.mensaje
          ) {

            alert(
              error.error.mensaje
            );

          } else if (
            error.error &&
            error.error.errors
          ) {

            const errores =
              error.error.errors;


            if (
              errores.Cantidad
            ) {

              alert(
                errores.Cantidad[0]
              );

            } else if (
              errores.TipoMovimiento
            ) {

              alert(
                errores.TipoMovimiento[0]
              );

            } else {

              alert(
                'Los datos del movimiento no son válidos.'
              );
            }

          } else {

            alert(
              'Error al registrar el movimiento.'
            );
          }
        }

      });
  }


  // ============================================
  // EDITAR MOVIMIENTO
  // ============================================
  editarMovimiento(
    movimiento: MovimientoInventario
  ): void {

    this.movimientoNuevo = {

      idMovimiento:
        movimiento.idMovimiento,

      idProducto:
        movimiento.idProducto,

      tipoMovimiento:
        movimiento.tipoMovimiento,

      cantidad:
        movimiento.cantidad,

      fechaMovimiento:
        movimiento.fechaMovimiento,

      observacion:
        movimiento.observacion ?? '',

      producto: null
    };


    this.modoEdicionMovimiento = true;


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // ============================================
  // ELIMINAR MOVIMIENTO
  // DELETE
  // ============================================
  eliminarMovimiento(
    movimiento: MovimientoInventario
  ): void {

    const confirmar = confirm(
      `¿Está seguro de eliminar el movimiento ${movimiento.idMovimiento}?`
    );


    if (!confirmar) {

      return;
    }


    this.movimientoService
      .eliminarMovimiento(
        movimiento.idMovimiento
      )
      .subscribe({

        next: () => {

          alert(
            'Movimiento eliminado correctamente.'
          );


          this.cargarMovimientos();


          if (
            this.movimientoNuevo.idMovimiento ===
            movimiento.idMovimiento
          ) {

            this.limpiarFormularioMovimiento();
          }

        },

        error: (error) => {

          console.error(
            'Error al eliminar movimiento:',
            error
          );


          if (
            error.status === 404
          ) {

            alert(
              'El movimiento ya no existe.'
            );

          } else {

            alert(
              'Error al eliminar el movimiento.'
            );
          }
        }

      });
  }


  // ============================================
  // MOSTRAR TODOS LOS MOVIMIENTOS
  // ============================================
  mostrarTodosMovimientos(): void {

    this.idMovimientoBusqueda = 0;

    this.cargarMovimientos();
  }


  // ============================================
  // LIMPIAR FORMULARIO MOVIMIENTO
  // ============================================
  limpiarFormularioMovimiento(): void {

    this.movimientoNuevo = {

      idMovimiento: 0,

      idProducto: 0,

      tipoMovimiento: 'Entrada',

      cantidad: 1,

      fechaMovimiento: '',

      observacion: '',

      producto: null
    };


    this.modoEdicionMovimiento = false;
  }


  // ============================================
  // OBTENER NOMBRE PRODUCTO
  // ============================================
  obtenerNombreProducto(
    idProducto: number
  ): string {

    const producto =
      this.productos().find(
        p =>
          p.idProducto ===
          idProducto
      );


    return producto
      ? producto.nombre
      : 'Producto no encontrado';
  }

}