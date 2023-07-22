import { Component } from 'react';
import EmployeeService from '../../services/EmployeeService';
import AppInfo from '../app-info/app-info';
import SearchPanel from '../search-panel/search-panel';
import AppFilter from '../app-filter/app-filter';
import EmployeeList from '../employee-list/employee-list';
import EmployeeAddForm from '../employee-add-form/employee-add-form';
import Pagination from '../pagination/pagination';

import './main.css';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            data: {
                items: []
            },
            term: '',
            filter: 'all',
            loading: true,

        };
        this.onHandlePagination = this.onHandlePagination.bind(this);
    }

    employeeService = new EmployeeService();

    componentDidMount() {
        this.employeeService.getEmployees(1, 5).then(this.onEmployeesLoaded);
    }

    onEmployeesLoaded = (data) => {
        this.setState({
            data
        })
    }

    onHandlePagination = (pageNumber) => {
        this.setState({
            pageNumber
        }, () => {
            this.employeeService.getEmployees(pageNumber, this.state.data.pageSize).then(this.onEmployeesLoaded);
        })
    }

    async getEmployees() {
        const response = await fetch('api/Employee/getall/1/10');
        const data = await response.json();
        this.setState({ data: data.items, loading: false, maxId: data.length, pageNumber: data.pageNumber });
    }

    async updateEmployee(employee) {
        const formData = new FormData();

        for (let key in employee) {
            formData.append(key, employee[key]);
        }

        await fetch('api/Employee/update', {
            method: 'POST',
            body: formData
        });
    }


    deleteItem = async (id) => {
        await fetch('api/Employee/delete/' + id, {
            method: 'DELETE'
        })

        this.setState(({ data }) => {
            return {
                data: { items: data.items.filter(item => item.id !== id) }
            }
        })
    }

    addItem = async (name, salary) => {
        const newItem = {
            name, 
            salary,
            bonusAdded: false,
            isPromoted: false,
            id: 0
        }

        try {
            const formData = new FormData();

            for (let key in newItem) {
                formData.append(key, newItem[key]);
            }

            await fetch('api/Employee/create', {
                method: 'POST',
                body: formData
            });
            this.getEmployees();
        } catch (error) {
            console.error('Error:', error);
        }
    }


    onToggleProp = (id, prop) => {
        const updatedData = this.state.data.items.map(item => {
            if (item.id === id) {
                return { ...item, [prop]: !item[prop] };
            }
            return item;
        });
        this.setState({ data: { items: updatedData } }, () => {
            this.updateEmployee(updatedData.find(item => item.id === id));
        });
    };

    searchEmp = (items, term) => {
        if (term.length === 0) {
            return items;
        }

        return items.filter(item => {
            return item.name.indexOf(term) > -1
        })
    }

    onUpdateSearch = (term) => {
        return this.setState({term});
    }

    filterPost = (items, filter) => {
        switch(filter) {
            case 'like':
                return items.filter(item => item.isPromoted);
            case 'more1000':
                return items.filter(item => item.salary > 1000);
            default: 
                return items
        }
    }

    onFilterSelect = (filter) => {
        this.setState({filter});
    }

    onChangeSalaryFromInput = (id, salary) => {
        const updatedData = this.state.data.items.map(item => {
            if (item.id === id) {
                return { ...item, salary };
            }
            return item;
        });
        this.setState({ data: { items: updatedData } }, () => {
            this.updateEmployee(updatedData.find(item => item.id === id));
        });
    }




    render() {
        if (!this.state.data.items.length) {
            return <div>Loading...</div>;
        }

        const { data, term, filter, pageNumber } = this.state;
        const countPages = Math.ceil(this.state.data.totalItems / this.state.data.pageSize);
        const employees = this.state.data.length;
        const increased = this.state.data.items.filter(item => item.isPromoted).length;
        const visibleData = this.filterPost(this.searchEmp(data.items, term), filter);

        return (
            <div className="main">
                <AppInfo 
                    employees={employees}
                    increased={increased}/>
    
                <div className="search-panel">
                    <SearchPanel onUpdateSearch={this.onUpdateSearch}/>
                    <AppFilter filter={filter} onFilterSelect={this.onFilterSelect}/>
                </div>
    
                <EmployeeList 
                    data={visibleData}
                    onDelete={this.deleteItem}
                    onToggleProp={this.onToggleProp}
                    onChangeSalaryFromInput={this.onChangeSalaryFromInput} />
                <Pagination
                    pageNumber={pageNumber}
                    onHandlePagination={this.onHandlePagination}
                    countPages={countPages} />

                <EmployeeAddForm onAdd={this.addItem}/>
            </div>
        );
    }
}

export default Main;