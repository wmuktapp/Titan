import React from 'react';
import MonitoringGridLabel from './label.jsx';
import MonitoringGridExecution from './execution.jsx';

class MonitoringGridRow extends React.Component {

  // TODO get list of executions for the given task

  render() {
    return (
      <tr>
        <td>
          <MonitoringGridLabel label="Task Name" />
        </td>
        <td>
          <MonitoringGridExecution />
        </td>
        <td>
          <MonitoringGridExecution />
        </td>
        <td>
          <MonitoringGridExecution />
        </td>
        <td>
          <MonitoringGridExecution />
        </td>
      </tr>
    );
  }

}

export default MonitoringGridRow;
