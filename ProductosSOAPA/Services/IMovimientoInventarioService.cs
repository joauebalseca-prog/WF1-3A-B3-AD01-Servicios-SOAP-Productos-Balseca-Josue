using ProductosSOAPA.Models;

namespace ProductosSOAPA.Services
{
    public interface IMovimientoInventarioService
    {
        Task<IEnumerable<MovimientoInventario>> GetAllAsync();

        Task<MovimientoInventario?> GetByIdAsync(int id);

        Task<MovimientoInventario> CreateAsync(
            MovimientoInventario movimiento);

        Task<bool> UpdateAsync(
            int id,
            MovimientoInventario movimiento);

        Task<bool> DeleteAsync(int id);

        Task<bool> ProductoExisteAsync(int idProducto);
    }
}