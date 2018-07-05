import React from 'react';
import ExecutionPartial from './execution-partial.jsx';
import DateUtils from '../../utils/date-utils';
import Tooltip from './tooltip.jsx';

import './execution.css';

class MonitoringGridExecution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tooltip: null,
      executionHover: false
    };
    this.handleExecutionHover = this.handleExecutionHover.bind(this);
    this.handleAcquireHover = this.handleAcquireHover.bind(this);
    this.handleExtractHover = this.handleExtractHover.bind(this);
    this.clearTooltip = this.clearTooltip.bind(this);
    this.selectorChange = this.selectorChange.bind(this);
  }

  selectorChange(e) {
    const add = e && e.target && e.target.checked;
    this.props.select(this.props.executionKey, add);
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

  isSuccess() {
    return this.props.data.ExecutionStatus.toLowerCase() === 'success';
  }

  isFailure() {
    return this.props.data.ExecutionStatus.toLowerCase() === 'failure';
  }

  handleExecutionHover() {
    this.setState({
      tooltip: 'execution',
      executionHover: true
    });
    event.stopPropagation();
  }

  handleAcquireHover(event) {
    this.setState({
      tooltip: 'acquire',
      executionHover: false
    });
    event.stopPropagation();
  }

  handleExtractHover(event) {
    this.setState({
      tooltip: 'extract',
      executionHover: false
    });
    event.stopPropagation();
  }

  clearTooltip() {
    this.setState({
      tooltip: null,
      executionHover: false
    });
  }

  getTooltip() {

    const execution = this.props.data;

    switch(this.state.tooltip) {
      case 'execution':
        return (
          <Tooltip
            title="Execution"
            startTime={execution.ExecutionStartTime}
            endTime={execution.ExecutionEndTime}
            error={execution.ExecutionErrorMessage}
          />
        );
      case 'acquire':
        return (
          <Tooltip
            title="Acquire"
            startTime={execution.AcquireStartTime}
            endTime={execution.AcquireEndTime}
            error={execution.AcquireErrorMessage}
          />
        );
      case 'extract':
        return (
          <Tooltip
            title="Extract"
            startTime={execution.ExtractStartTime}
            endTime={execution.ExtractEndTime}
            error={execution.ExtractErrorMessage}
          />
        );
    }

    return null;
  }

  render() {

    const execution = this.props.data;
    const className = 'execution'
      + (this.state.executionHover ? ' execution-hover' : '')
      + this.getStatusClass(execution.ExecutionStatus);

    return (
      <span className={className} onMouseOver={this.handleExecutionHover} onMouseOut={this.clearTooltip}>
        <a href={`/monitoring/executions/${execution.ExecutionKey}`}>
          <span className="execution-parts">
            <ExecutionPartial status={execution.AcquireStatus} onMouseOver={this.handleAcquireHover}>A</ExecutionPartial>
            <ExecutionPartial status={execution.ExtractStatus} onMouseOver={this.handleExtractHover}>E</ExecutionPartial>
          </span>
        </a>
        {
          (this.isSuccess() || this.isFailure()) &&
            <input type="checkbox" checked={execution.selected} className="execution-selector" onChange={this.selectorChange} />
        }
        { this.getTooltip() }
      </span>
    );
  }

}

export default MonitoringGridExecution;
