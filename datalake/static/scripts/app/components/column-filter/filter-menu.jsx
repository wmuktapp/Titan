import React from 'react';

class FilterMenu extends React.Component {

  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  select(event) {
    const target = event.target;
    this.props.onSelect(target.name, target.checked);
  }

  selectAll() {
    this.props.onSelectAll();
  }

  deselectAll() {
    this.props.onDeselectAll();
  }

  render() {

    const options = this.props.values.map((value, index) => {

      const id = 'filter-value-' + index; // TODO more robust unique ID?

      return <div key={index} className="filter-menu-row">
        <input id={id} type="checkbox" name={value.name} checked={value.selected} onChange={this.select} />
        <label htmlFor={id}>{value.name}</label>
      </div>;
    });

    if (this.props.open) {
      return (
        <div className="filter-menu">
          <div className="filter-menu-controls">
            <a onClick={this.selectAll}>Select all</a>
            <a onClick={this.deselectAll}>Deselect all</a>
          </div>
          {options}
        </div>
      );
    }
    return [];
  }
}

export default FilterMenu;
