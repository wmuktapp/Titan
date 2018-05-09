import React from 'react';
import {render} from 'react-dom';
import Execution from './components/execution.jsx';

class ExecutionApp extends React.Component {

  render() {
    const executionKey = 1; // TODO get from page
    return <Execution executionKey={executionKey} />;
  }
}

render(<ExecutionApp />, document.getElementById('execution'));
