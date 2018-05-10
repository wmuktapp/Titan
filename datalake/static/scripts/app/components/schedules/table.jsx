import React from 'react';
import dateUtils from '../../utils/date-utils';

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
        <th></th>
      </tr>
    );

    const body = this.props.schedules.map((schedule, index) => {

      const href = '/schedules/' + schedule.id;
      const loadDate = dateUtils.dateToString(new Date(schedule.loadDate));

      return (
        <tr key={index}>
          <td>{schedule.name}</td>
          <td>{schedule.interval}</td>
          <td>{schedule.client}</td>
          <td>{schedule.dataset}</td>
          <td>{loadDate}</td>
          <td>
            <input type="checkbox" disabled={true} checked={schedule.enabled} />
          </td>
          <td>
            <a className="schedule-link" href={href}>Details &gt;</a>
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
