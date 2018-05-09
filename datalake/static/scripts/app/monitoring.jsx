import React from 'react';
import {render} from 'react-dom';
import DataLakeConsole from './components/data-lake-console.jsx';

class App extends React.Component {
  render () {
    return (
      <div className="panel">
        <DataLakeConsole />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
