import React from 'react';
import MonitoringGridHeader from './header.jsx';
import MonitoringGridContent from './content.jsx';

require('./grid.css');

class MonitoringGrid extends React.Component {

  render() {

    // TODO refactor this and MonitoringRow

    return (
      <div className="monitoring-grid">
        <MonitoringGridHeader dates={this.props.dates} />
        <MonitoringGridContent data={this.props.data} selectExecution={this.props.select} />
      </div>
    );
  }

}

export default MonitoringGrid;