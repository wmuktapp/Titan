import React from 'react';
import MonitoringGridRow from './row.jsx';

class MonitoringGridContents extends React.Component {

  render() {
    return (
        <tbody>
          <MonitoringGridRow />
          <MonitoringGridRow />
          <MonitoringGridRow />
          <MonitoringGridRow />
          <MonitoringGridRow />
          <MonitoringGridRow />
        </tbody>
      );
  }

}

export default MonitoringGridContents;
