using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    public partial class Proveedor
    {
        public Proveedor()
        {
            Productos = new HashSet<Producto>();
        }
        public int idProveedores { get; set; }
        public string? NroDocumento { get; set; }
        public string? RazonSocial { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public bool? EsActivo { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
