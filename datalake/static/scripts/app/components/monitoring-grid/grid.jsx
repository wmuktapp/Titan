import React from 'react';
import MonitoringGridHeader from './header.jsx';
import MonitoringGridContent from './content.jsx';

class MonitoringGrid extends React.Component {

  render() {
    return (
      <table className="monitoring-grid">
        <MonitoringGridHeader />
        <MonitoringGridContent />
      </table>
    );
  }

}

export default MonitoringGrid;
