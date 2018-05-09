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
    return <ExecutionDetails execution={this.state.execution} />;
  }
}

render(<ExecutionApp />, document.getElementById('execution'));
