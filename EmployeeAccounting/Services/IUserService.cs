using EmployeeAccounting.Controllers;

namespace EmployeeAccounting.Services
{
    public interface IUserService
    {
        bool IsValidUserInformation(LoginModel model);
        //string GetUserDetails();
    }
}
