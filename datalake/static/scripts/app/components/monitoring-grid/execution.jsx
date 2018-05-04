import React from 'react';
import MonitoringGridExecutionAcquire from './execution-acquire.jsx';
import MonitoringGridExecutionExtract from './execution-extract.jsx';

class MonitoringGridExecution extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let execution = this.props.data;
    return (
      <span className="execution-cell">
        <MonitoringGridExecutionAcquire status={execution.acquire} />
        <MonitoringGridExecutionExtract status={execution.extract} />
      </span>
    );
  }

}

export default MonitoringGridExecution;
