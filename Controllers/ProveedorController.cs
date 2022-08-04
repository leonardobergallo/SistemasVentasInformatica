using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactVentas.Models;
using Microsoft.AspNetCore.Mvc;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly DBREACT_VENTAContext _context;
        public ProveedorController(DBREACT_VENTAContext context)
        {
            _context = context;

        }
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            List<Proveedor> lista = new List<Proveedor>();
            try
            {
                lista = await _context.Proveedor.OrderByDescending(c => c.IdProveedor).ToListAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, lista);
            }
        }
    
    }
}
