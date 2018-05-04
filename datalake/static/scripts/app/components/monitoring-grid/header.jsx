import React from 'react';

class MonitoringGridHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const cells = this.props.data[0].executions.map((execution) => {
      return <th key={'th-' + execution.date}>{execution.date}</th>;
    });

    return (
      <thead>
        <tr>
          <th>Task</th>
          {cells}
        </tr>
      </thead>
    );
  }

}

export default MonitoringGridHeader;
