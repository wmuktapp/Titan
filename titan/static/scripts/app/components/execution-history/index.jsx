import React from 'react';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

class ExecutionHistory extends React.Component {

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
          onChange={this.props.onChange}
          className="titan-react-select"
        />
      </div>
    );
  }

}

export default ExecutionHistory;
