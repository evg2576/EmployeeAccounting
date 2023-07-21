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
    [Route("getall/{pageNumber:int}/{pageSize:int}")]
    [SwaggerOperation(
    Summary = "Получить список всех сотрудников в постраничном виде",
    Description = "Получить список всех сотрудников в постраничном виде")]
    public IActionResult GetAll(int pageNumber = 1, int pageSize = 10)
    {
        int itemsToSkip = (pageNumber - 1) * pageSize;

        var items = db.Employees.Skip(itemsToSkip).Take(pageSize);

        var response = new PaginatedResponse<Employee>
        {
            TotalItems = db.Employees.Count(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            Items = items
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