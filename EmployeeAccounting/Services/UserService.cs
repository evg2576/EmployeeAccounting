using EmployeeAccounting.Controllers;

namespace EmployeeAccounting.Services
{
    public class UserService : IUserService
    {
        //public string GetUserDetails()
        //{
        //    return "1";
        //}

        public bool IsValidUserInformation(LoginModel model)
        {
            if (model.UserName.Equals("123") && model.Password.Equals("123")) return true;
            else return false;
        }
    }
}
