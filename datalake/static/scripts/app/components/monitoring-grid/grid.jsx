import React from 'react';
import MonitoringGridHeader from './header.jsx';
import MonitoringGridContent from './content.jsx';

class MonitoringGrid extends React.Component {

  render() {
    return (
      // TODO add controls (previous, next, more)
      <table className="monitoring-grid">
        <MonitoringGridHeader start={this.props.start} end={this.props.end} />
        <MonitoringGridContent data={this.props.data} />
      </table>
    );
  }

}

export default MonitoringGrid;
