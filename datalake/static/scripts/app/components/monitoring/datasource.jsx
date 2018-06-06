import React from 'react';
import MonitoringGridDataSet from './dataset.jsx';

class MonitoringGridDataSource extends React.Component {

  render() {

    const rows = Object.keys(this.props.data).map((key, index) => {

      const datum = this.props.data[key];

      return (
        <MonitoringGridDataSet key={index} name={key} data={datum} selectExecution={this.props.selectExecution} />
      );
    });
    return (
      <div className="monitoring-datasource">
        <div className="monitoring-datasource-label">{this.props.name}</div>
        {rows}
      </div>
    );
  }
}

export default MonitoringGridDataSource;
