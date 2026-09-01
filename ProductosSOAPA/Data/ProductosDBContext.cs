using Microsoft.EntityFrameworkCore;
using ProductosSOAPA.Models;

namespace ProductosSOAPA.Data
{
    public class ProductosDBContext : DbContext
    {
        public ProductosDBContext(DbContextOptions<ProductosDBContext> options)
            : base(options)
        {
        }

        // ============================================
        // TABLAS
        // ============================================

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Producto> Productos { get; set; }

        public DbSet<MovimientoInventario> MovimientosInventario { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // ============================================
            // TABLA CATEGORIAS
            // ============================================

            modelBuilder.Entity<Categoria>()
                .ToTable("Categorias");


            // ============================================
            // TABLA PRODUCTOS
            // ============================================

            modelBuilder.Entity<Producto>()
                .ToTable("Productos");


            // ============================================
            // TABLA MOVIMIENTO_INVENTARIO
            // ============================================

            modelBuilder.Entity<MovimientoInventario>()
                .ToTable("Movimiento_Inventario");


            // ============================================
            // RELACIÓN:
            // Categoria 1 ---- N Productos
            // ============================================

            modelBuilder.Entity<Producto>()
                .HasOne<Categoria>()
                .WithMany()
                .HasForeignKey(p => p.IdCategoria)
                .OnDelete(DeleteBehavior.Restrict);


            // ============================================
            // RELACIÓN:
            // Producto 1 ---- N Movimiento_Inventario
            // ============================================

            modelBuilder.Entity<MovimientoInventario>()
                .HasOne(m => m.Producto)
                .WithMany()
                .HasForeignKey(m => m.IdProducto)
                .OnDelete(DeleteBehavior.Restrict);


            // ============================================
            // CONFIGURACIÓN DEL PRECIO
            // ============================================

            modelBuilder.Entity<Producto>()
                .Property(p => p.Precio)
                .HasPrecision(10, 2);


            // ============================================
            // CONFIGURACIÓN MOVIMIENTO INVENTARIO
            // ============================================

            modelBuilder.Entity<MovimientoInventario>()
                .Property(m => m.TipoMovimiento)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<MovimientoInventario>()
                .Property(m => m.Observacion)
                .HasMaxLength(250);
        }
    }
}