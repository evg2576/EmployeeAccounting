import { Component } from 'react';

import './pagination.css';

class Pagination extends Component {
    constructor(props) {
        super();
        this.state = {
            currentPage: 1
        };
    }

    renderPaginationButtons = () => {
        const buttons = [];
        for (let page = 1; page <= this.props.countPages; page++) {
            buttons.push(
                <button
                    key={page}
                    onClick={() => this.props.onHandlePagination(page)}
                    style={{ fontWeight: this.props.pageNumber === page ? 'bold' : 'normal' }}
                >
                    {page}
                </button>
            );
        }
        return buttons;
    };
   
    render() {
        return (
            <div>
                <div>{this.renderPaginationButtons()}</div>
            </div>
        );
    }
}

export default Pagination;
