import React from 'react';
import MonitoringGridExecutionAcquire from './execution-acquire.jsx';
import MonitoringGridExecutionExtract from './execution-extract.jsx';

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

    const execution = this.props.data;
    const showSelector = execution.acquire === 'failure' || execution.extract === 'failure';

    return (
      <span className="execution-cell">
        <MonitoringGridExecutionAcquire status={execution.acquire} />
        <MonitoringGridExecutionExtract status={execution.extract} />
        {
          showSelector
            ? <input type="checkbox" checked={execution.selected} className="execution-selector" onChange={this.selectorChange} />
            : null
        }
      </span>
    );
  }

}

export default MonitoringGridExecution;
