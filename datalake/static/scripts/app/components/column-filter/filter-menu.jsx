import React from 'react';

class FilterMenu extends React.Component {

  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
  }

  select() {
    // TODO
  }

  render() {

    const options = this.props.values.map((value, index) => {
      return <div key={index} className="filter-menu-row">
        <input type="checkbox" checked={value.selected} onChange={this.select} />
        <label>{value.name}</label>
      </div>;
    })

    if (this.props.open) {
      return (
        <div className="filter-menu">
          {options}
        </div>
      );
    }
    return [];
  }
}

export default FilterMenu;
