import React from 'react';
import MonitoringGridLabel from './label.jsx';
import MonitoringGridExecution from './execution.jsx';
import dateUtils from '../../utils/date-utils';

require('./row.css');

class MonitoringGridRow extends React.Component {

  render() {

    const cells = Object.keys(this.props.data).map((key) => {

      const datum = this.props.data[key];
      const id = datum.id, date = new Date(key);

      return (
        <MonitoringGridExecution key={key} data={datum} select={this.props.selectExecution} taskId={id} date={date} />
      );
    });

    return (
      <div className="monitoring-dataset">
        {this.props.children}
        <span className="monitoring-dataset-label">{this.props.name}</span>
        <div className="monitoring-executions">{cells}</div>
      </div>
    );
  }

}

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

class MonitoringGridDataSource extends React.Component {

  render() {

    const rows = Object.keys(this.props.data).map((key, index) => {

      const datum = this.props.data[key];

      return (
        <MonitoringGridRow key={index} name={key} data={datum} selectExecution={this.props.selectExecution} />
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

// export default MonitoringGridRow;
export default MonitoringGridClient;
