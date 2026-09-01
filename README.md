# ProductosSOAPA - Servicios SOAP y REST con Angular

Proyecto desarrollado para la gestión de productos, categorías y movimientos de inventario utilizando **ASP.NET Core**, **CoreWCF**, **Entity Framework Core**, **SQL Server** y **Angular**.

El proyecto integra dos tipos de servicios:

- **SOAP** para la gestión de Productos y Categorías.
- **REST** para la gestión de Movimientos de Inventario.

También se incluye una aplicación Angular que consume los servicios desarrollados.

---

## Tecnologías utilizadas

### Backend

- ASP.NET Core
- CoreWCF
- Entity Framework Core
- SQL Server
- C#

### Frontend

- Angular
- TypeScript
- HTML
- CSS

### Herramientas

- Visual Studio 2022
- Visual Studio Code
- SQL Server Management Studio
- Postman
- Git
- GitHub

---

# Base de datos

La base de datos utilizada es:

```text
ProductosSOAPDB
```

La base contiene las siguientes tablas:

```text
Categorias
    │
    │ 1
    │
    └──── N
        Productos
            │
            │ 1
            │
            └──── N
                Movimiento_Inventario
```

## Tabla Categorias

Contiene las categorías disponibles para los productos.

Campos principales:

```text
IdCategoria
Nombre
Descripcion
Estado
```

## Tabla Productos

Contiene la información de los productos.

Campos principales:

```text
IdProducto
Nombre
Descripcion
Precio
Stock
Estado
IdCategoria
```

`IdCategoria` es una clave foránea relacionada con la tabla `Categorias`.

## Tabla Movimiento_Inventario

Permite registrar entradas y salidas relacionadas con los productos.

Campos:

```text
IdMovimiento
IdProducto
TipoMovimiento
Cantidad
FechaMovimiento
Observacion
```

`IdProducto` es una clave foránea relacionada con la tabla `Productos`.

El campo `TipoMovimiento` permite únicamente:

```text
Entrada
Salida
```

La cantidad debe ser mayor a cero.

---

# Scripts SQL

El repositorio incluye los scripts necesarios para trabajar con la base de datos.

```text
SQL/
└── ProductosSOAPDB.sql
```

También se incluye el script específico de Movimiento de Inventario:

```text
ProductosSOAPA/
└── Database/
    └── Movimiento_Inventario.sql
```

---

# Servicio SOAP

La gestión original de Productos se realiza mediante **CoreWCF / SOAP**.

Endpoint local:

```text
http://localhost:5139/ProductoService.svc
```

Entre las operaciones implementadas se encuentran:

```text
ObtenerProductos
ObtenerProducto
AgregarProducto
ActualizarProducto
EliminarProducto
ObtenerCategorias
ObtenerProductosPorPrecio
ObtenerProductosPorCategoria
```

---

# Servicio REST - Movimiento de Inventario

Se agregó un servicio REST para administrar los movimientos de inventario.

Endpoint principal:

```text
http://localhost:5139/api/MovimientoInventario
```

## GET - Obtener todos los movimientos

```http
GET /api/MovimientoInventario
```

Permite consultar todos los movimientos registrados y devuelve también la información del producto relacionado.

---

## GET - Obtener movimiento por ID

```http
GET /api/MovimientoInventario/{id}
```

Ejemplo:

```text
GET /api/MovimientoInventario/2
```

---

## POST - Registrar movimiento

```http
POST /api/MovimientoInventario
```

Ejemplo de JSON:

```json
{
  "idProducto": 1,
  "tipoMovimiento": "Entrada",
  "cantidad": 10,
  "fechaMovimiento": "2026-09-01T17:45:00",
  "observacion": "Ingreso de inventario"
}
```

Respuesta esperada:

```text
201 Created
```

---

## PUT - Actualizar movimiento

```http
PUT /api/MovimientoInventario/{id}
```

Ejemplo:

```json
{
  "idProducto": 1,
  "tipoMovimiento": "Salida",
  "cantidad": 5,
  "fechaMovimiento": "2026-09-01T18:00:00",
  "observacion": "Salida de inventario"
}
```

---

## DELETE - Eliminar movimiento

```http
DELETE /api/MovimientoInventario/{id}
```

Permite eliminar un movimiento existente mediante su identificador.

---

# Validaciones del servicio REST

El servicio REST incluye validaciones para evitar información incorrecta.

Se validan los siguientes casos:

```text
Producto inexistente
        ↓
400 Bad Request

Cantidad menor o igual a 0
        ↓
400 Bad Request

Tipo diferente de Entrada o Salida
        ↓
400 Bad Request

Movimiento inexistente
        ↓
404 Not Found
```

---

# Arquitectura del proyecto

```text
ProductosSOAPDB
      │
      ▼
SQL Server
      │
      ▼
Entity Framework Core
      │
      ├──────────────────────┐
      ▼                      ▼
CoreWCF / SOAP          ASP.NET REST
Productos               Movimiento_Inventario
      │                      │
      └──────────┬───────────┘
                 ▼
               Angular
```

---

# Backend

El backend se encuentra en:

```text
ProductosSOAPA/
```

Entre sus principales carpetas se encuentran:

```text
ProductosSOAPA
│
├── Controllers
│   └── MovimientoInventarioController.cs
│
├── Data
│   └── ProductosDBContext.cs
│
├── Database
│   └── Movimiento_Inventario.sql
│
├── Models
│   ├── Categoria.cs
│   ├── Producto.cs
│   └── MovimientoInventario.cs
│
├── Services
│   ├── IProductoService.cs
│   ├── ProductoService.cs
│   ├── IMovimientoInventarioService.cs
│   └── MovimientoInventarioService.cs
│
├── Program.cs
└── appsettings.json
```

---

# Angular

El frontend se encuentra en:

```text
ProductosSOAPA-app/
```

La interfaz permite trabajar tanto con Productos como con los Movimientos de Inventario.

Para Movimiento de Inventario se implementaron las operaciones:

```text
GET
GET por ID
POST
PUT
DELETE
```

Entre los archivos agregados se encuentran:

```text
src/app/model/movimiento-inventario.ts

src/app/services/movimiento-inventario.service.ts
```

Además se actualizaron:

```text
app.ts
app.html
app.css
```

La interfaz permite:

```text
Registrar movimientos
Editar movimientos
Eliminar movimientos
Buscar movimientos por ID
Mostrar todos los movimientos
Seleccionar el producto
Registrar Entrada o Salida
Ingresar cantidad
Ingresar fecha
Ingresar observación
```

---

# Ejecución del Backend

Abrir la solución del proyecto en Visual Studio.

Verificar la cadena de conexión en:

```text
ProductosSOAPA/appsettings.json
```

Configuración utilizada:

```text
Server=(localdb)\MSSQLLocalDB;
Database=ProductosSOAPDB;
Trusted_Connection=True;
TrustServerCertificate=True;
```

Ejecutar el proyecto desde Visual Studio.

---

# Ejecución de Angular

Abrir:

```text
ProductosSOAPA-app
```

en Visual Studio Code.

Instalar las dependencias si es necesario:

```bash
npm install
```

Ejecutar Angular:

```bash
ng serve
```

Después ingresar en:

```text
http://localhost:4200
```

El backend debe estar ejecutándose para que Angular pueda consumir los servicios.

---

# Postman

El repositorio incluye una colección de Postman:

```text
Postman/
└── ProductosSOAPA.postman_collection.json
```

La colección contiene las pruebas correspondientes a los servicios SOAP y REST.

Para Movimiento de Inventario se incluyen las operaciones:

```text
GET     ObtenerMovimientos
GET     ObtenerMovimientoPorId
POST    AgregarMovimiento
PUT     ActualizarMovimiento
DELETE  EliminarMovimiento
```

---

# Pruebas realizadas

Se comprobaron correctamente las operaciones REST:

```text
GET todos                 ✅
GET por ID                ✅
POST                      ✅
PUT                       ✅
DELETE                    ✅

Producto inexistente      ✅
Cantidad inválida         ✅
Tipo inválido             ✅
```

También se verificó el funcionamiento del CRUD de Movimiento de Inventario desde Angular.

---

# Autor

**Josué Balseca**

Proyecto académico de Servicios Web utilizando SOAP, REST, SQL Server y Angular.