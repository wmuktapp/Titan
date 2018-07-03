import React from 'react';
import ExecutionPartial from './execution-partial.jsx';
import Tooltip from '../tooltip/index.jsx';
import DateUtils from '../../utils/date-utils';

import './execution.css';

class MonitoringGridExecution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false
    };
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.selectorChange = this.selectorChange.bind(this);
  }

  mouseOver() {
    this.setState({
      showTooltip: true
    });
  }

  mouseOut() {
    this.setState({
      showTooltip: false
    });
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

  isFailure() {
    return this.props.data.ExecutionStatus.toLowerCase() === 'failure';
  }

  render() {

    const SUCCESS = 'success', FAILURE = 'failure';
    const execution = this.props.data;
    const className = 'execution'
      + (DateUtils.isYesterday(this.props.date) ? ' execution-highlight' : '')
      + this.getStatusClass(execution.ExecutionStatus);
    const title = `Acquire time: ${execution.AcquireStartTime}\nExtract time: ${execution.ExtractStartTime}`;

    return (
      <span className={className}>
        <a href={`/monitoring/executions/${execution.ExecutionKey}`} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
          <span className="execution-parts">
            <ExecutionPartial status={execution.AcquireStatus}>A</ExecutionPartial>
            <ExecutionPartial status={execution.ExtractStatus}>E</ExecutionPartial>
          </span>
        </a>
        {
          this.isFailure() &&
            <input type="checkbox" checked={execution.selected} className="execution-selector" onChange={this.selectorChange} />
        }
        {
          this.state.showTooltip &&
            <Tooltip offsetY={50}>{title}</Tooltip>
        }
      </span>
    );
  }

}

export default MonitoringGridExecution;
