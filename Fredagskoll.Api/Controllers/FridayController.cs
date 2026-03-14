using Microsoft.AspNetCore.Mvc;

namespace Fredagskoll.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FridayController : ControllerBase
    {
        [HttpGet]
        public IActionResult IsFriday([FromQuery] string? date = null)
        {
            DateTime checkDate;
            if (string.IsNullOrWhiteSpace(date))
            {
                checkDate = DateTime.Today;
            }
            else if (!DateTime.TryParse(date, out checkDate))
            {
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");
            }

            var isFriday = checkDate.DayOfWeek == DayOfWeek.Friday;
            var isTuesday = checkDate.DayOfWeek == DayOfWeek.Tuesday;
            var isWednesday = checkDate.DayOfWeek == DayOfWeek.Wednesday;
            var isThursday = checkDate.DayOfWeek == DayOfWeek.Thursday;

            return Ok(new { isFriday, isTuesday, isWednesday, isThursday, date = checkDate.ToString("yyyy-MM-dd") });
        }
    }
}
