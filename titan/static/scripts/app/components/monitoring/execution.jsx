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

  render() {

    const SUCCESS = 'success', FAILURE = 'failure';
    const execution = this.props.data,
      acquireStatus = execution.AcquireStatus,
      extractStatus = execution.ExtractStatus;
    const showCheckbox = acquireStatus === FAILURE || extractStatus === FAILURE;
    const className = 'execution' + (dateUtils.isYesterday(this.props.date) ? ' execution-highlight' : '');
    const title = `Acquire time: ${execution.AcquireStartTime}\nExtract time: ${execution.ExtractStartTime}`;

    return (
      <span className={className} title={title}>
        <a href={`/monitoring/executions/${execution.ExecutionKey}`}>
          <ExecutionPartial status={acquireStatus}>A</ExecutionPartial>
          <ExecutionPartial status={extractStatus}>E</ExecutionPartial>
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
