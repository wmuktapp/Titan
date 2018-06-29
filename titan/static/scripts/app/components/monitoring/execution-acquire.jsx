import React from 'react';

class MonitoringGridExecutionAcquire extends React.Component {

  statusClass() {
    const classes = {
      'success': 'execution-success',
      'failure': 'execution-failure',
      'running': 'execution-running',
      'waiting': 'execution-waiting'
    }
    return classes[this.props.status.toLowerCase()] || '';
  }

  render() {
    return (
      <span className={'execution-partial ' + this.statusClass()}>A</span>
    );
  }

}

export default MonitoringGridExecutionAcquire;
