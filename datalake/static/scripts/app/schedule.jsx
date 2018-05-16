import React from 'react';
import {render} from 'react-dom';
import ScheduleForm from './components/schedule-form.jsx';

class ScheduleApp extends React.Component {
  render() {
    const id = null;    // TODO get this from the page, if applicable
    return <ScheduleForm id={id} />;
  }
}

render(<ScheduleApp />, document.getElementById('schedule'));
