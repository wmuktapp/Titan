import React from 'react';
import MonitoringGridExecution from './execution.jsx';
import moment from 'moment';

class MonitoringGridDataSet extends React.Component {

  render() {

    // Iterate through date range, draw cells (empty or otherwise)
    let temp = moment(this.props.start), key = 1;    
    const executions = [];

    while (!temp.isAfter(this.props.end)) {

      const execution = this.props.data[temp.format('YYYY-MM-DD')];

      if (execution) {
        executions.push(
          <MonitoringGridExecution
            key={key}
            data={execution}
            select={this.props.selectExecution}
            taskId={execution.id}
            date={temp.toDate()}
          />
        );
      } else {
        executions.push(
          <span
            key={key}
            className="execution execution-empty"
          />
        );
      }

      temp.add(1, 'days');
      key++;
    }

    const cells = Object.keys(this.props.data).map((key) => {

      const datum = this.props.data[key];
      const id = datum.id, date = new Date(key);

      console.log(id)

      return (
        <MonitoringGridExecution key={key} data={datum} select={this.props.selectExecution} taskId={id} date={date} />
      );
    });

    return (
      <div className="monitoring-dataset">
        <span className="monitoring-dataset-label">{this.props.name}</span>
        <div className="monitoring-executions">{executions}</div>
      </div>
    );
  }

}

export default MonitoringGridDataSet;
