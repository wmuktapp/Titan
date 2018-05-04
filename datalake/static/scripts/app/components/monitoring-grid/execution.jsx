import React from 'react';
import MonitoringGridExecutionAcquire from './execution-acquire.jsx';
import MonitoringGridExecutionExtract from './execution-extract.jsx';

class MonitoringGridExecution extends React.Component {

  constructor(props) {
    super(props);

    // TODO get task statuses from server
    this.state = {
      acquireStatus: Math.random() > .3 ? 'success' : 'failure',
      executeStatus: Math.random() > .4 ? 'success' : 'failure'
    }
  }

  render() {
    return (
        <span className="execution-cell">
            <MonitoringGridExecutionAcquire status={this.state.acquireStatus} />
            <MonitoringGridExecutionExtract status={this.state.extractStatus} />
        </span>
      );
  }

}

export default MonitoringGridExecution;
