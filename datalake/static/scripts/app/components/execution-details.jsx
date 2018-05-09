import React from 'react';

class ExecutionDetails extends React.Component {

  render() {
    return (
      <div className="execution-details">
        <p>Task Name: {this.props.execution.taskName}</p>
        <p>Task ID: {this.props.execution.taskId}</p>
      </div>
    );
  }

}

export default ExecutionDetails;
