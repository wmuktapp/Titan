import React from 'react';
import {render} from 'react-dom';

class AdhocApp extends React.Component {
  render() {
    return <p>Adhoc form goes here</p>;
  }
}

render(<AdhocApp />, document.getElementById('adhoc'));
