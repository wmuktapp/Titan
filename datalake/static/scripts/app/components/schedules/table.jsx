import React from 'react';

class ScheduleTable extends React.Component {

  render() {

    const head = (
      <tr>
        <th>Schedule</th>
        <th>Interval</th>
        <th>Client</th>
        <th>Dataset</th>
        <th>Load date</th>
        <th>Enabled?</th>
      </tr>
    );

    const body = this.props.schedules.map((schedule, index) => {
      return (
        <tr key={index}>
          <td>{schedule.name}</td>
          <td>{schedule.interval}</td>
          <td>{schedule.client}</td>
          <td>{schedule.dataset}</td>
          <td>{schedule.loadDate}</td>
          <td>
            <input type="checkbox" disabled={true} checked={schedule.enabled} />
          </td>
        </tr>
      );
    });

    return (
      <table className="schedule-table">
        <thead>{head}</thead>
        <tbody>{body}</tbody>
      </table>
    );

  }
  
}

export default ScheduleTable;
