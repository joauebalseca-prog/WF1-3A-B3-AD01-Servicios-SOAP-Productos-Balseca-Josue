using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductosSOAPA.Models
{
    [Table("Movimiento_Inventario")]
    public class MovimientoInventario
    {
        [Key]
        public int IdMovimiento { get; set; }

        [Required]
        public int IdProducto { get; set; }

        [Required]
        [MaxLength(20)]
        [RegularExpression(
            "^(Entrada|Salida)$",
            ErrorMessage = "El tipo de movimiento debe ser Entrada o Salida."
        )]
        public string TipoMovimiento { get; set; } = string.Empty;

        [Required]
        [Range(
            1,
            int.MaxValue,
            ErrorMessage = "La cantidad debe ser mayor a 0."
        )]
        public int Cantidad { get; set; }

        [Required]
        public DateTime FechaMovimiento { get; set; } = DateTime.Now;

        [MaxLength(250)]
        public string? Observacion { get; set; }

        // ============================================
        // RELACIÓN CON PRODUCTO
        // ============================================
        [ForeignKey("IdProducto")]
        public Producto? Producto { get; set; }
    }
}