import EmployeeListItem from '../employee-list-item/employee-list-item';

import './employee-list.css';

const EmployeeList = ({data, onDelete, onToggleProp, onChangeSalaryFromInput}) => {
    const elements = data.map(item => {
        const {id, ...itemProps} = item;
        return (
            <EmployeeListItem 
                key = {id}
                {...itemProps}
                onDelete={() => onDelete(id)}
                onToggleProp={(e) => onToggleProp(id, e.currentTarget.getAttribute('data-toggle'))}
                onChangeSalaryFromInput={(e) => onChangeSalaryFromInput(id, parseInt(e.currentTarget.value))}/>
        )
    })
    

    return (
        <ul className="app-list list-group">
            {elements}
        </ul>
    )
}

export default EmployeeList;