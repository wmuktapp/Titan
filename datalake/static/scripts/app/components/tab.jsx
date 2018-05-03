import React from 'react';

class Tab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected
    };
  }

  render() {
    return (
      <span className="tab">
        <a onClick={this.props.onSelect}>{this.props.name}</a>
      </span>
    );
  }
}

export default Tab;
