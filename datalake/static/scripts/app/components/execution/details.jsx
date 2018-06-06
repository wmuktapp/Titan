import React from 'react';

class ExecutionDetails extends React.Component {

  render() {

    const execution = this.props.execution;

    return (
      <div className="execution-details">

        <div>
          <label>Key</label>
          <span className="execution-value">{execution.ExecutionKey}</span>
        </div>
        <div>
          <label>Container Group</label>
          <span className="execution-value">{execution.ExecutionContainerGroupName}</span>
        </div>
        <div>
          <label>Client</label>
          <span className="execution-value">{execution.ExecutionClientName}</span>
        </div>
        <div>
          <label>Data Source</label>
          <span className="execution-value">{execution.ExecutionDataSourceName}</span>
        </div>
        <div>
          <label>Data Set</label>
          <span className="execution-value">{execution.ExecutionDataSetName}</span>
        </div>

      </div>
    );
  }

}

export default ExecutionDetails;
