import React from 'react';
import { render } from 'react-dom';
import { wrapWithAdal } from './utils/adal-config';
import ScheduleList from './components/schedules/list.jsx';
import ScrollToTop from './utils/scroll-to-top.jsx';

class SchedulesApp extends React.Component {
  render() {
    return <ScheduleList />;
  }
}

wrapWithAdal(() => {
  render(<SchedulesApp />, document.getElementById('schedules'));
});