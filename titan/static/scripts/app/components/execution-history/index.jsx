import React from 'react';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

class ExecutionHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.change = this.change.bind(this);
  }

  change(value) {
    this.setState({
      value: value
    });
    this.props.onChange(...arguments);
  }

  render() {

    let options = Object.keys(this.props.versions).map(key => {
      return {
        label: key,
        value: this.props.versions[key]
      };
    });

    // Sort options by number
    options = options.sort((a, b) => {
      const numA = Number(a.label.replace('v', '')),
        numB = Number(b.label.replace('v', ''));
      if (numA < numB) {
        return -1;
      }
      if (numA > numB) {
        return 1;
      }
      return 0;
    });

    return (
      <div className="execution-history">
        <Select
          options={options}
          value={this.state.value}
          onChange={this.change}
          className="titan-react-select"
        />
      </div>
    );
  }

}

export default ExecutionHistory;
