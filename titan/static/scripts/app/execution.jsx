import React from 'react';
import { render } from 'react-dom';
import { wrapWithAdal } from './utils/adal-config';
import Execution from './components/execution.jsx';

class ExecutionApp extends React.Component {

  render() {
    return <Execution executionKey={data.executionKey} />;
  }
}

wrapWithAdal(() => {
  render(<ExecutionApp />, document.getElementById('execution'));
});