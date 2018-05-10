import React from 'react';
import {render} from 'react-dom';

class SchedulesApp extends React.Component {
  render() {
    return <p>Schedules go here</p>;
  }
}

render(<SchedulesApp />, document.getElementById('schedules'));
