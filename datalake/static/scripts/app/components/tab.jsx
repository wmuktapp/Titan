import React from 'react';

class Tab extends React.Component {

  render() {
    return (
      <span className={'tab' + (!!this.props.selected ? ' tab-selected' : '')}>
        <a onClick={this.props.onSelect}>{this.props.name}</a>
      </span>
    );
  }
}

export default Tab;
