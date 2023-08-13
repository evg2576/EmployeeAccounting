using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace EmployeeAccounting.Controllers;

[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    AppDbContext db;
    public EmployeeController(AppDbContext context)
    {
        db = context;
    }

    [HttpGet]
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
    [Route("getbysearch")]
    [SwaggerOperation(
    Summary = "Получить список сотрудников в постраничном виде",
    Description = "Получить список сотрудников в постраничном виде")]
    public IActionResult GetBySearch(int pageNumber = 1, int pageSize = 10, 
        string? name = null, bool isPromoted = false)
    {
        int itemsToSkip = (pageNumber - 1) * pageSize;

        var query = db.Employees.AsQueryable();

        if (!string.IsNullOrEmpty(name))
            query = query.Where(m => m.Name.Contains(name));

        if (isPromoted)
            query = query.Where(m => m.IsPromoted == isPromoted);

        var response = new PaginatedResponse<Employee>
        {
            TotalItems = db.Employees.Count(),
            PromotedCount = db.Employees.Count(x => x.IsPromoted),
            PageNumber = pageNumber,
            PageSize = pageSize,
            Items = query.Skip(itemsToSkip).Take(pageSize)
        };

        return Ok(response);
    }

    [HttpPost]
    [Route("create")]
    [SwaggerOperation(
    Summary = "Созать учётную запись сотрудника",
    Description = "Созать учётную запись сотрудника")]
    public IActionResult Create(Employee employee)
    {
        db.Employees.Add(employee);
        db.SaveChanges();
        return Ok(employee);
    }

    [HttpDelete]
    [Route("delete/{id:int}")]
    [SwaggerOperation(
    Summary = "Удалить учётную запись сотрудника",
    Description = "Удалить учётную запись сотрудника")]
    public IActionResult Delete(int id)
    {
        var employee = db.Employees.FirstOrDefault(x => x.Id == id);

        if (employee == null)
            return NotFound();

        db.Employees.Remove(employee);
        db.SaveChanges();

        return Ok(employee);
    }

    [HttpPost]
    [Route("update")]
    [SwaggerOperation(
    Summary = "Обновить данные о сотруднике",
    Description = "Обновить данные о сотруднике")]
    public IActionResult Update(Employee employee)
    {
        db.Entry(db.Employees.FirstOrDefault(x => x.Id == employee.Id)).CurrentValues.SetValues(employee);
        db.SaveChanges();

        return Ok(employee);
    }
}