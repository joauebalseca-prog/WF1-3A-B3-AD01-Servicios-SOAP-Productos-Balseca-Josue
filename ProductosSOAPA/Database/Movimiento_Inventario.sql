USE ProductosSOAPDB;
GO

-- ============================================
-- TABLA MOVIMIENTO_INVENTARIO
-- ============================================

IF OBJECT_ID('dbo.Movimiento_Inventario', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Movimiento_Inventario
    (
        IdMovimiento INT IDENTITY(1,1) PRIMARY KEY,

        IdProducto INT NOT NULL,

        TipoMovimiento NVARCHAR(20) NOT NULL,

        Cantidad INT NOT NULL,

        FechaMovimiento DATETIME2 NOT NULL
            CONSTRAINT DF_MovimientoInventario_Fecha
            DEFAULT GETDATE(),

        Observacion NVARCHAR(250) NULL,

        CONSTRAINT FK_MovimientoInventario_Productos
            FOREIGN KEY (IdProducto)
            REFERENCES dbo.Productos(IdProducto),

        CONSTRAINT CK_MovimientoInventario_Tipo
            CHECK (TipoMovimiento IN ('Entrada', 'Salida')),

        CONSTRAINT CK_MovimientoInventario_Cantidad
            CHECK (Cantidad > 0)
    );
END;
GO


-- ============================================
-- CONSULTA DE MOVIMIENTOS
-- ============================================

SELECT *
FROM dbo.Movimiento_Inventario;
GO


-- ============================================
-- CONSULTA CON PRODUCTO RELACIONADO
-- ============================================

SELECT
    m.IdMovimiento,
    m.IdProducto,
    p.Nombre AS Producto,
    m.TipoMovimiento,
    m.Cantidad,
    m.FechaMovimiento,
    m.Observacion
FROM dbo.Movimiento_Inventario m
INNER JOIN dbo.Productos p
    ON m.IdProducto = p.IdProducto;
GO