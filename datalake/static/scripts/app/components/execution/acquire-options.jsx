import React from 'react';

class AcquireOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {

    const icon = this.state.expanded ? 'fa-angle-up' : 'fa-angle-down';

    // TODO expandable thing containing options

    return (
      <a onClick={this.toggle}>
        Options <span className={'fas ' + icon} />
      </a>
    );
  }

}

export default AcquireOptions;