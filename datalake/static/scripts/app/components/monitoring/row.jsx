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
        <td key={key} className={dateUtils.isYesterday(date) ? 'cell-highlight' : ''}>
          <MonitoringGridExecution data={datum} select={this.props.selectExecution} taskId={id} date={date} />
        </td>
      );
    });

    return (
      <tr>
        {this.props.children}
        <td className="monitoring-cell-dataset">{this.props.name}</td>
        {cells}
      </tr>
    );
  }

}

function getDataLength(data) {
  let count = 0;
  for (var dataSource in data) {
    count += Object.keys(data[dataSource]).length;
  }
  return count;
}

class MonitoringGridClient extends React.Component {

  render() {

    const rowSpan = getDataLength(this.props.data);

    return Object.keys(this.props.data).map((key, index) => {

      const datum = this.props.data[key];

      let label = (index === 0) &&
        <td rowSpan={rowSpan} className="monitoring-cell-client">{this.props.name}</td>;

      return (
        <MonitoringGridDataSource key={index} name={key} data={datum} selectExecution={this.props.selectExecution}>
          {label}
        </MonitoringGridDataSource>
      );
    });
  }

}

class MonitoringGridDataSource extends React.Component {

  render() {

    const rowSpan = Object.keys(this.props.data).length;

    return Object.keys(this.props.data).map((key, index) => {

      const datum = this.props.data[key];

      const dataSource = (index === 0) &&
        <td rowSpan={rowSpan} className="monitoring-cell-datasource">{this.props.name}</td>;

      return (
        <MonitoringGridRow key={index} name={key} data={datum} selectExecution={this.props.selectExecution}>
          { (index === 0) && this.props.children }
          { dataSource }
        </MonitoringGridRow>
      );

    });
  }
}

// export default MonitoringGridRow;
export default MonitoringGridClient;
