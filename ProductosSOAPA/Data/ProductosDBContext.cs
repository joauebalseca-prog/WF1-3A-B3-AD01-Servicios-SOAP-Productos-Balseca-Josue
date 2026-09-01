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

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Producto> Productos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tabla Categorias
            modelBuilder.Entity<Categoria>()
                .ToTable("Categorias");

            // Tabla Productos
            modelBuilder.Entity<Producto>()
                .ToTable("Productos");

            // Relación Categoria 1 ---- N Productos
            modelBuilder.Entity<Producto>()
                .HasOne<Categoria>()
                .WithMany()
                .HasForeignKey(p => p.IdCategoria)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración del precio
            modelBuilder.Entity<Producto>()
                .Property(p => p.Precio)
                .HasPrecision(10, 2);
        }
    }
}