using Microsoft.AspNetCore.Mvc;

namespace EmployeeAccounting.Controllers;

[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    AppDbContext db;
    public EmployeeController(AppDbContext context)
    {
        db = context;
    }

    [HttpGet("~/getall")]
    public IEnumerable<Employee> GetAll() => db.Employees;


    [HttpPost("~/create")]
    public IActionResult Create(Employee employee)
    {
        db.Add(employee);
        return Ok(employee);
    }

    [HttpDelete("~/delte/{id:int}")]
    public IActionResult Delete(int id)
    {
        var employee = db.Employees.FirstOrDefault(x => x.Id == id);

        if (employee == null)
            return NotFound();

        db.Employees.Remove(employee);

        return Ok(employee);
    }

    [HttpPost("~/update/{employee:Employee}")]
    public IActionResult Update(Employee employee)
    {
        db.Entry(db.Employees.FirstOrDefault(x => x.Id == employee.Id)).CurrentValues.SetValues(employee);
        db.SaveChanges();
        
        return Ok(employee);
    }
}