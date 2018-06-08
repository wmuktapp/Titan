import React from 'react';
import {render} from 'react-dom';
import { runWithAdal } from 'react-adal';
import { authContext } from './utils/adal-config';
import Monitor from './components/monitor.jsx';

class MonitoringApp extends React.Component {
  render () {
    return <Monitor />;
  }
}

runWithAdal(authContext, () => {
  render(<MonitoringApp />, document.getElementById('monitoring'));
});
