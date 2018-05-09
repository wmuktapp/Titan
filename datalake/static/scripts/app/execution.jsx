import React from 'react';
import {render} from 'react-dom';

class ExecutionApp extends React.Component {

  render() {
    return (
      <div className="panel">
        <h3>Execution Details</h3>
      </div>
    );
  }
}

render(<ExecutionApp />, document.getElementById('execution'));
