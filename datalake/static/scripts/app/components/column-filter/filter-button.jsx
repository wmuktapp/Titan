import React from 'react';

require('./menu.css');

class FilterButton extends React.Component {

  render() {
    return <button onClick={this.props.toggle}>F</button>;
  }

}

export default FilterButton;
