import React from 'react';
import { render } from 'react-dom';
import { wrapWithAdal } from './utils/adal-config';
import Monitor from './components/monitor.jsx';

class MonitoringApp extends React.Component {
  render () {
    return <Monitor />;
  }
}

wrapWithAdal(() => {
  render(<MonitoringApp />, document.getElementById('monitoring'));
});
