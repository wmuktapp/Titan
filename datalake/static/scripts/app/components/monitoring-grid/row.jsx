import React from 'react';
import MonitoringGridLabel from './label.jsx';
import MonitoringGridExecution from './execution.jsx';

class MonitoringGridRow extends React.Component {

  // TODO get list of executions for the given task

  constructor(props) {
    super(props);
  }

  getCells() {
    let cells = [];
    for (let i in this.props.data) {
      let datum = this.props.data[i];
      let key = 'grid-execution-' + this.props.name + '-' + datum.date;
      cells.push(
        <td key={key + '-row'}>
          <MonitoringGridExecution key={key} data={datum} />
        </td>
      );
    }
    return cells;
  }

  render() {
    return (
      <tr>
        <td>
          <MonitoringGridLabel label={this.props.name} />
        </td>
        {this.getCells()}
      </tr>
    );
  }

}

export default MonitoringGridRow;
