# ProductosSOAPA

## Descripción

ProductosSOAPA es un servicio SOAP desarrollado en .NET para la gestión de productos y categorías.

El proyecto utiliza SQL Server como base de datos y permite realizar operaciones de consulta, registro, actualización y eliminación de productos mediante un servicio SOAP.

La base de datos utilizada se llama:

ProductosSOAPDB

El servicio SOAP se encuentra configurado en:

http://localhost:5139/ProductoService.svc

## Funcionalidades

El servicio permite realizar las siguientes operaciones:

- Obtener todos los productos.
- Obtener un producto por ID.
- Obtener todas las categorías.
- Agregar un producto.
- Actualizar un producto.
- Eliminar un producto.
- Consultar productos por rango de precio.
- Consultar productos por categoría.

## Estructura del repositorio

ProductosSOAPA/
│
├── ProductosSOAPA/
│   ├── Data/
│   ├── Models/
│   ├── Properties/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json
│   └── ProductosSOAPA.csproj
│
├── SQL/
│   └── ProductosSOAPDB.sql
│
├── Postman/
│   └── ProductosSOAPA.postman_collection.json
│
├── ProductosSOAPA.slnx
├── README.md
└── .gitignore

## Requisitos

Para ejecutar el proyecto se requiere:

- Visual Studio 2022 o compatible.
- .NET.
- SQL Server.
- SQL Server Management Studio.
- Postman.

## Instrucciones de uso

### 1. Crear la base de datos

Abrir SQL Server Management Studio.

Abrir el archivo:

SQL/ProductosSOAPDB.sql

Ejecutar el script completo.

El script crea la base de datos ProductosSOAPDB, sus tablas y los datos necesarios para realizar las pruebas.

### 2. Configurar la conexión a SQL Server

Abrir el archivo:

ProductosSOAPA/appsettings.json

Verificar la cadena de conexión.

La instancia de SQL Server debe modificarse de acuerdo con la configuración local del equipo donde se ejecute el proyecto.

El nombre de la base de datos debe mantenerse como:

ProductosSOAPDB

### 3. Abrir el proyecto

Abrir el archivo:

ProductosSOAPA.slnx

utilizando Visual Studio.

### 4. Ejecutar el servicio SOAP

Ejecutar el proyecto desde Visual Studio.

El servicio está configurado para utilizar la dirección:

http://localhost:5139/ProductoService.svc

Si el puerto cambia en el equipo donde se ejecuta el proyecto, se debe actualizar también la URL utilizada en Postman.

### 5. Importar la colección de Postman

Abrir Postman.

Seleccionar:

Import

Importar el archivo:

Postman/ProductosSOAPA.postman_collection.json

### 6. Probar el servicio

Con el proyecto ejecutándose, utilizar las solicitudes de la colección de Postman para comprobar las operaciones del servicio SOAP.

## Base de datos

La base de datos ProductosSOAPDB contiene principalmente las tablas:

- Categorias
- Productos

La tabla Productos se relaciona con Categorias mediante IdCategoria.

## Autor

Nombre: Josue Balseca