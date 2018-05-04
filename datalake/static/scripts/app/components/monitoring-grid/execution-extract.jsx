import React from 'react';

class MonitoringGridExecutionExtract extends React.Component {

  constructor(props) {
    super(props);
  }

  statusClass() {
    const classes = {
      'success': 'execution-success',
      'failure': 'execution-failure',
      'running': 'execution-running'
    }
    return classes[this.props.status];
  }

  render() {
    return (
      <span className={'execution-partial ' + this.statusClass()}>E</span>
    );
  }

}

export default MonitoringGridExecutionExtract;
