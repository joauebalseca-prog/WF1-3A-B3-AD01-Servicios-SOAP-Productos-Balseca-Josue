using Microsoft.AspNetCore.Mvc;
using ProductosSOAPA.Models;
using ProductosSOAPA.Services;

namespace ProductosSOAPA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientoInventarioController : ControllerBase
    {
        private readonly IMovimientoInventarioService _service;

        public MovimientoInventarioController(
            IMovimientoInventarioService service)
        {
            _service = service;
        }


        // ============================================
        // GET - OBTENER TODOS LOS MOVIMIENTOS
        // ============================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoInventario>>> Get()
        {
            var movimientos = await _service.GetAllAsync();

            return Ok(movimientos);
        }


        // ============================================
        // GET POR ID
        // ============================================
        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoInventario>> GetById(int id)
        {
            var movimiento = await _service.GetByIdAsync(id);

            if (movimiento == null)
            {
                return NotFound(new
                {
                    mensaje = "Movimiento de inventario no encontrado."
                });
            }

            return Ok(movimiento);
        }


        // ============================================
        // POST - CREAR MOVIMIENTO
        // ============================================
        [HttpPost]
        public async Task<ActionResult<MovimientoInventario>> Post(
            MovimientoInventario movimiento)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar que el producto exista
            var productoExiste =
                await _service.ProductoExisteAsync(
                    movimiento.IdProducto);

            if (!productoExiste)
            {
                return BadRequest(new
                {
                    mensaje = "El producto especificado no existe."
                });
            }

            var nuevoMovimiento =
                await _service.CreateAsync(movimiento);

            return CreatedAtAction(
                nameof(GetById),
                new { id = nuevoMovimiento.IdMovimiento },
                nuevoMovimiento);
        }


        // ============================================
        // PUT - ACTUALIZAR MOVIMIENTO
        // ============================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(
            int id,
            MovimientoInventario movimiento)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar que el producto exista
            var productoExiste =
                await _service.ProductoExisteAsync(
                    movimiento.IdProducto);

            if (!productoExiste)
            {
                return BadRequest(new
                {
                    mensaje = "El producto especificado no existe."
                });
            }

            var actualizado =
                await _service.UpdateAsync(id, movimiento);

            if (!actualizado)
            {
                return NotFound(new
                {
                    mensaje = "Movimiento de inventario no encontrado."
                });
            }

            return Ok(new
            {
                mensaje = "Movimiento actualizado correctamente."
            });
        }


        // ============================================
        // DELETE - ELIMINAR MOVIMIENTO
        // ============================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado =
                await _service.DeleteAsync(id);

            if (!eliminado)
            {
                return NotFound(new
                {
                    mensaje = "Movimiento de inventario no encontrado."
                });
            }

            return Ok(new
            {
                mensaje = "Movimiento eliminado correctamente."
            });
        }
    }
}