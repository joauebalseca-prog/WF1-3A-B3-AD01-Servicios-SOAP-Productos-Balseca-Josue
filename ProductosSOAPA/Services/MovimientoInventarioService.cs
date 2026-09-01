using Microsoft.EntityFrameworkCore;
using ProductosSOAPA.Data;
using ProductosSOAPA.Models;

namespace ProductosSOAPA.Services
{
    public class MovimientoInventarioService : IMovimientoInventarioService
    {
        private readonly ProductosDBContext _context;

        public MovimientoInventarioService(ProductosDBContext context)
        {
            _context = context;
        }


        // ============================================
        // GET - OBTENER TODOS LOS MOVIMIENTOS
        // ============================================
        public async Task<IEnumerable<MovimientoInventario>> GetAllAsync()
        {
            return await _context.MovimientosInventario
                .Include(m => m.Producto)
                .AsNoTracking()
                .OrderBy(m => m.IdMovimiento)
                .ToListAsync();
        }


        // ============================================
        // GET POR ID
        // ============================================
        public async Task<MovimientoInventario?> GetByIdAsync(int id)
        {
            return await _context.MovimientosInventario
                .Include(m => m.Producto)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.IdMovimiento == id);
        }


        // ============================================
        // POST - CREAR MOVIMIENTO
        // ============================================
        public async Task<MovimientoInventario> CreateAsync(
            MovimientoInventario movimiento)
        {
            _context.MovimientosInventario.Add(movimiento);

            await _context.SaveChangesAsync();

            return movimiento;
        }


        // ============================================
        // PUT - ACTUALIZAR MOVIMIENTO
        // ============================================
        public async Task<bool> UpdateAsync(
            int id,
            MovimientoInventario movimiento)
        {
            var movimientoExistente =
                await _context.MovimientosInventario
                    .FindAsync(id);

            if (movimientoExistente == null)
            {
                return false;
            }

            movimientoExistente.IdProducto =
                movimiento.IdProducto;

            movimientoExistente.TipoMovimiento =
                movimiento.TipoMovimiento;

            movimientoExistente.Cantidad =
                movimiento.Cantidad;

            movimientoExistente.FechaMovimiento =
                movimiento.FechaMovimiento;

            movimientoExistente.Observacion =
                movimiento.Observacion;

            await _context.SaveChangesAsync();

            return true;
        }


        // ============================================
        // DELETE - ELIMINAR MOVIMIENTO
        // ============================================
        public async Task<bool> DeleteAsync(int id)
        {
            var movimiento =
                await _context.MovimientosInventario
                    .FindAsync(id);

            if (movimiento == null)
            {
                return false;
            }

            _context.MovimientosInventario.Remove(movimiento);

            await _context.SaveChangesAsync();

            return true;
        }


        // ============================================
        // VALIDAR SI EL PRODUCTO EXISTE
        // ============================================
        public async Task<bool> ProductoExisteAsync(int idProducto)
        {
            return await _context.Productos
                .AnyAsync(p => p.IdProducto == idProducto);
        }
    }
}