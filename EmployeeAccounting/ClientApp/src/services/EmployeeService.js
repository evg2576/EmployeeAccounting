class EmployeeService {
    _apiBase = 'api/Employee/';

    getEmployees = async (page, size) => {
        const employee = await fetch(this._apiBase + 'getall/' + page + '/' + size);
        return await employee.json();
    }

    addEmployee = async (requestData) => {
        await fetch(this._apiBase + 'create', {
            method: 'POST',
            body: requestData
        });
    }

    updateEmployee = async (requestData) => {
        await fetch(this._apiBase + 'update', {
            method: 'POST',
            body: requestData
        });
    }

    deleteEmployee = async (id) => {
        await fetch(this._apiBase + 'delete/' + id, {
            method: 'DELETE'
        })
    }
}

export default EmployeeService;