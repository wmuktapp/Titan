import React from 'react';
import {render} from 'react-dom';
import ScheduleList from './components/schedules/list.jsx';
import ScrollToTop from './utils/scroll-to-top.jsx';

class SchedulesApp extends React.Component {
  render() {
    return <ScheduleList />;
  }
}

render(<SchedulesApp />, document.getElementById('schedules'));

render(<ScrollToTop />, document.getElementById('back-to-top-wrap'));
