import React from 'react';
import MonitoringGridDataSource from './datasource.jsx';
import dateUtils from '../../utils/date-utils';

class MonitoringGridClient extends React.Component {

  render() {

    const dataSources = Object.keys(this.props.data).map((key, index) => {

      const datum = this.props.data[key];

      return (
        <MonitoringGridDataSource key={index} name={key} data={datum} selectExecution={this.props.selectExecution} />
      );
    });

    return (
      <div className="monitoring-client">
        <div className="monitoring-client-label">{this.props.name}</div>
        {dataSources}
      </div>
    );
  }
}

export default MonitoringGridClient;
