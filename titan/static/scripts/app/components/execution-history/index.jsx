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

    const options = Object.keys(this.props.versions).map(key => {
      return {
        label: key,
        value: this.props.versions[key]
      };
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
