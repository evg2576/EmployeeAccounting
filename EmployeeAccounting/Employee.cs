using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeAccounting;
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Salary { get; set; }
    public bool IsPromoted { get; set; }
    public bool BonusAdded { get; set; }
}