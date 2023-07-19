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
            loading: true
        }
        this.maxId = 3;
    }

    componentDidMount() {
        this.getEmployee();
    }

    async getEmployee() {
        const response = await fetch('api/Employee');
        const data = await response.json();
        this.setState({ data: data, loading: false })
    }

    async addEmployee(data) {
        try {
            const response = await fetch('api/Employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log(JSON.stringify(data));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async deleteEmployee(id) {
        const response = await fetch('api/Employee/' + id, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                console.log('Delete success');
            } else {
                console.error('Error');
            }
        })

        this.setState(({ data }) => {
            return {
                data: data.filter(item => item.id !== id)
            }
        })
    }

    deleteItem = (id) => {
        this.deleteEmployee(id);
    }

    addItem = (name, salary) => {
        const newItem = {
            name, 
            salary,
            bonusAdded: false,
            isPromoted: false,
            id: this.maxId++
        }

        this.addEmployee(newItem);

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