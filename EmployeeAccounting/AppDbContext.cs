using Microsoft.EntityFrameworkCore;

namespace EmployeeAccounting;
public class AppDbContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        Database.EnsureCreated();
    }
}