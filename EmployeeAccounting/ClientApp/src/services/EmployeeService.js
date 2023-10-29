class EmployeeService {
    _apiBase = 'api/Employee/';

    getEmployees = async (page, size, search, filterPromoted) => {
        if (!search) search = '';
        if (!filterPromoted) filterPromoted = false;
        const employee = await fetch(this._apiBase + `getbysearch?pageNumber=${page}&pageSize=${size}&name=${search}&isPromoted=${filterPromoted}`);
        return await employee.json();
    }

    addEmployee = async (requestData) => {
        const formData = new FormData();

        for (let key in requestData) {
            formData.append(key, requestData[key]);
        }

        await fetch(this._apiBase + 'create', {
            method: 'POST',
            body: formData
        });
    }

    updateEmployee = async (requestData) => {
        const formData = new FormData();

        for (let key in requestData) {
            formData.append(key, requestData[key]);
        }

        await fetch(this._apiBase + 'update', {
            method: 'POST',
            body: formData
        });
    }

    deleteEmployee = async (id) => {
        await fetch(this._apiBase + 'delete/' + id, {
            method: 'DELETE'
        })
    }
}

export default EmployeeService;