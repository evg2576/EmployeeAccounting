using Microsoft.AspNetCore.Mvc;

namespace EmployeeAccounting.Controllers;

[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    static readonly List<Employee> data;

    static EmployeeController()
    {
        data = new List<Employee>
            {
                new Employee { Name = "Nekita", Salary = 1337, BonusAdded = true, IsPromoted = false, Id = 1 },
                new Employee { Name = "S3rg10", Salary = 5051, BonusAdded = true, IsPromoted = true, Id = 2 },
            };
    }

    [HttpGet]
    public IEnumerable<Employee> Get() => data;

    [HttpPost]
    public IActionResult Post(Employee employee)
    {
        data.Add(employee);
        return Ok(employee);
    }

    [HttpDelete("{name}")]
    public IActionResult Delete(string name)
    {
        var employee = data.FirstOrDefault(x => x.Name == name);

        if (employee == null)
            return NotFound();

        data.Remove(employee);

        return Ok(employee);
    }
}