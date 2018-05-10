import React from 'react';

class ScheduleTable extends React.Component {

  render() {

    const head = (
      <tr>
        <th>Schedule</th>
        <th>Interval</th>
      </tr>
    );

    const body = this.props.schedules.map((schedule, index) => {
      return (
        <tr key={index}>
          <td>{schedule.name}</td>
          <td>{schedule.interval}</td>
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
