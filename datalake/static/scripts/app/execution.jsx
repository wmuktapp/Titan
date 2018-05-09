import React from 'react';
import {render} from 'react-dom';
import ExecutionDetails from './components/execution-details.jsx';

class ExecutionApp extends React.Component {

  constructor() {
    super();
    this.state = {
      execution: {
        taskName: 'Task 1',
        taskId: 1
      }
    }
  }

  render() {
    return (
      <div className="panel">
        <h3>Execution Details</h3>
        <ExecutionDetails execution={this.state.execution} />
      </div>
    );
  }
}

render(<ExecutionApp />, document.getElementById('execution'));
