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

    const icon = this.state.expanded ? 'fa-angle-left' : 'fa-angle-right';

    const options = this.props.options.map(
      (option, index) => <AcquireOption key={index} name={option.AcquireOptionName} value={option.AcquireOptionValue} />
    )

    return (
      <div className="acquire-options">
        <div className="acquire-options-toggle-wrap">
          <a onClick={this.toggle}>
            Options <span className={'fas ' + icon} />
          </a>
        </div>
        {
          this.state.expanded && 
          <div className="acquire-option-list">
            {options}
          </div>
        }
      </div>
    );
  }

}

export default AcquireOptions;