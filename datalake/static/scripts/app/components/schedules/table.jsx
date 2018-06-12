import React from 'react';
import ColumnFilter from '../column-filter/filter.jsx'
import ScheduleTableRow from './row.jsx';

class ScheduleTable extends React.Component {

  render() {

    const head = (
      <tr>
        <th>Schedule</th>
        <th>Next scheduled date</th>
        <th>
          Client
          {
            !!this.props.clients.length &&
              <ColumnFilter values={this.props.clients} onChange={this.props.filterClients} />
          }
        </th>
        <th>
          Dataset
          {
            !!this.props.dataSets.length &&
              <ColumnFilter values={this.props.dataSets} onChange={this.props.filterDataSets} />
          }
        </th>
        <th>Load date</th>
        <th>Enabled?</th>
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
