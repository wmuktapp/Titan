import React from 'react';
import AcquireOption from './acquire-option.jsx';

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
      <div className="acquire-options">
        <a onClick={this.toggle}>
          Options <span className={'fas ' + icon} />
        </a>
        {
          this.state.expanded && this.props.options.map(
            (option, index) => <AcquireOption key={index} name={option.AcquireOptionName} value={option.AcquireOptionValue} />)
        }
      </div>
    );
  }

}

export default AcquireOptions;