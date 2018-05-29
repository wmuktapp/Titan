import React from 'react';
import FilterButton from './filter-button.jsx';
import FilterMenu from './filter-menu.jsx';

require('./filter.css');

class ColumnFilter extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      values: ['one', 'two', 'three']
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return (
      <span className="column-filter">
        <FilterButton toggle={this.toggle} />
        <FilterMenu open={this.state.open} />
      </span>
    );
  }
}

export default ColumnFilter;
