import React from 'react';
import MonitoringGridHeader from './header.jsx';
// import MonitoringGridContent from './content.jsx';
import MonitoringGridClient from './client.jsx';

require('./grid.css');

class MonitoringGrid extends React.Component {

  render() {

    const clients = Object.keys(this.props.data).map((key) => {

      const datum = this.props.data[key];

      return <MonitoringGridClient key={key} name={key} data={datum} selectExecution={this.props.select} />;
    })

    return (
      <div className="monitoring-grid">
        <MonitoringGridHeader dates={this.props.dates} />
        { clients }
      </div>
    );
  }

}

export default MonitoringGrid;