import { Component } from 'react';
import AppInfo from '../app-info/app-info';
import SearchPanel from '../search-panel/search-panel';
import AppFilter from '../app-filter/app-filter';
import EmployeeList from '../employee-list/employee-list';
import EmployeeAddForm from '../employee-add-form/employee-add-form';

import './main.css';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            term: '',
            filter: 'all',
            loading: true,
        }
        this.maxId = 3;
    }

    componentDidMount() {
        this.getEmployees();
    }

    async getEmployees() {
        const response = await fetch('api/Employee/getall');
        const data = await response.json();
        this.setState({ data: data, loading: false, maxId: data.length})
    }

    deleteItem = async (id) => {
        await fetch('api/Employee/delete' + id, {
            method: 'DELETE'
        })

        this.setState(({ data }) => {
            return {
                data: data.filter(item => item.id !== id)
            }
        })
    }

    addItem = async (name, salary) => {
        const newItem = {
            name, 
            salary: parseInt(salary),
            bonusAdded: false,
            isPromoted: false,
            id: ++this.maxId
        }

        const formData = new FormData();

        for (let key in newItem) {
            formData.append(key, newItem[key]);
        }

        try {
            await fetch('api/Employee/create', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Error:', error);
        }

        this.setState(({data}) => {
            const newArr = [...data, newItem];
            return {
                data: newArr
            }
        });


    }


    onToggleProp = (id, prop) => {
        this.setState(({data}) => ({
            data: data.map(item => {
                if (item.id === id) {
                    return {...item, [prop]: !item[prop]}
                }
                return item;
            })
        }))
    }

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
        this.setState(({data}) => ({
            data: data.map(item => {
                if (item.id === id) {
                    return {...item, salary: salary}
                }
                return item;
            })
        }))
    }




    render() {
        const {data, term, filter} = this.state;
        const employees = this.state.data.length;
        const increased = this.state.data.filter(item => item.isPromoted).length;
        const visibleData = this.filterPost(this.searchEmp(data, term), filter);

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
                    onChangeSalaryFromInput={this.onChangeSalaryFromInput}/>
                <EmployeeAddForm onAdd={this.addItem}/>
    
            </div>
        );
    }
}

export default Main;