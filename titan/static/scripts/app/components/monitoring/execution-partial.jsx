import React from 'react';

class ExecutionPartial extends React.Component {

  statusClass() {
    const classes = {
      'success': 'execution-success',
      'failure': 'execution-failure',
      'running': 'execution-running',
      'not-requested': 'execution-not-requested'
    };
    return this.props.status
      ? classes[this.props.status.toLowerCase()]
      : '';
  }

  render() {
    return (
      <span className={'execution-partial ' + this.statusClass()}>
        { this.props.children }
      </span>
    );
  }
}

export default ExecutionPartial;
