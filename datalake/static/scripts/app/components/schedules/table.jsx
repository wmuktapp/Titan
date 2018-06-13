import React from 'react';
import ColumnListFilter from '../column-filter/list-filter.jsx'
import ColumnFlagFilter from '../column-filter/flag-filter.jsx'
import ScheduleTableRow from './row.jsx';

class ScheduleTable extends React.Component {

  render() {

    const head = (
      <tr>
        <th>
          Schedule
          {
            !!this.props.executions.length &&
              <ColumnListFilter values={this.props.executions} onChange={this.props.filterExecutions} />
          }
        </th>
        <th>Next scheduled</th>
        <th>
          Client
          {
            !!this.props.clients.length &&
              <ColumnListFilter values={this.props.clients} onChange={this.props.filterClients} />
          }
        </th>
        <th>
          Dataset
          {
            !!this.props.dataSets.length &&
              <ColumnListFilter values={this.props.dataSets} onChange={this.props.filterDataSets} />
          }
        </th>
        <th>Load date</th>
        <th>
          Enabled?
          <ColumnFlagFilter trueLabel="Enabled" falseLabel="Disabled" onChange={this.props.filterEnabled} />
        </th>
      </tr>
    );

    const body = this.props.schedules.length
      ? this.props.schedules.map((schedule, index) => <ScheduleTableRow key={index} schedule={schedule} />)
      : <tr>
          <td className="schedule-loading" colSpan="6">{ this.props.loading ? 'Loading...' : 'No schedules' }</td>
        </tr>;

    return (
      <table className="schedule-table">
        <thead>{head}</thead>
        <tbody>{body}</tbody>
      </table>
    );

  }
  
}

export default ScheduleTable;
