import React from 'react';
import ExecutionPartial from './execution-partial.jsx';
import dateUtils from '../../utils/date-utils';

import './execution.css';

class MonitoringGridExecution extends React.Component {

  constructor(props) {
    super(props);
    this.selectorChange = this.selectorChange.bind(this);
  }

  selectorChange(e) {
    const add = e && e.target && e.target.checked;
    this.props.select(this.props.taskId, this.props.date, add);
  }

  getStatusClass(status) {
    const classes = {
      'success': 'execution-success',
      'failure': 'execution-failure',
      'running': 'execution-running',
      'not-requested': 'execution-not-requested'
    };
    return status
      ? (' ' + classes[status.toLowerCase()])
      : '';
  }

  render() {

    const SUCCESS = 'success', FAILURE = 'failure';
    const execution = this.props.data,
      acquireStatus = execution.AcquireStatus,
      extractStatus = execution.ExtractStatus;
    const showCheckbox = acquireStatus === FAILURE || extractStatus === FAILURE;
    const className = 'execution'
      + (dateUtils.isYesterday(this.props.date) ? ' execution-highlight' : '')
      + this.getStatusClass(execution.ExecutionStatus);
    const title = `Acquire time: ${execution.AcquireStartTime}\nExtract time: ${execution.ExtractStartTime}`;

    return (
      <span className={className} title={title}>
        <a href={`/monitoring/executions/${execution.ExecutionKey}`}>
          <span className="execution-parts">
            <ExecutionPartial status={acquireStatus}>A</ExecutionPartial>
            <ExecutionPartial status={extractStatus}>E</ExecutionPartial>
          </span>
        </a>
        {
          showCheckbox &&
            <input type="checkbox" checked={execution.selected} className="execution-selector" onChange={this.selectorChange} />
        }
      </span>
    );
  }

}

export default MonitoringGridExecution;
