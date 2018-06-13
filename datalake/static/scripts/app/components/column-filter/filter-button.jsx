import React from 'react';

class FilterButton extends React.Component {

  render() {

    return <button className="filter-button" onClick={this.props.toggle}>
      <span className={'fas ' + (this.props.filtered ? 'fa-filter' : 'fa-caret-down')}></span>
      { this.props.filtered && <span className="fas fa-caret-down filter-icon-sub"></span> }
    </button>;
  }

}

export default FilterButton;
