import React from 'react';
import MonitoringGridHeader from './header.jsx';
import MonitoringGridContent from './content.jsx';

class MonitoringGrid extends React.Component {

  render() {
    return (
      // TODO pass dates to header component instead?
      this.props.loading
        ? <p className="monitoring-grid-loading">Loading data...</p>
        : <table className="monitoring-grid">
            <MonitoringGridHeader data={this.props.data} />
            <MonitoringGridContent data={this.props.data} />
          </table>
    );
  }

}

export default MonitoringGrid;
