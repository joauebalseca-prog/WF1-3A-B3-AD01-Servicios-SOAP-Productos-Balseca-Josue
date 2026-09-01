import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductoService } from './services/producto';

import { Producto } from './model/producto.model';
import { Categoria } from './model/categoria.model';

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
  // MODO EDICION
  // ============================================
  modoEdicion = false;

  // ============================================
  // BUSQUEDA POR ID
  // ============================================
  idBusqueda: number = 0;

  // ============================================
  // FILTROS
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


  constructor(
    private productoService: ProductoService
  ) {

    this.cargarProductos();

    this.cargarCategorias();
  }


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
  // GUARDAR O ACTUALIZAR
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
    // ACTUALIZAR
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
    // AGREGAR
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
  // EDITAR
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
  // ELIMINAR
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
  // MOSTRAR TODOS
  // ============================================
  mostrarTodos(): void {

    this.idBusqueda = 0;

    this.precioMinimo = 0;

    this.precioMaximo = 0;

    this.categoriaFiltro = 0;

    this.cargarProductos();
  }


  // ============================================
  // LIMPIAR FORMULARIO
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
  // NOMBRE CATEGORIA
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
}