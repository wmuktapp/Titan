import React from 'react';
import DateUtils from '../../utils/date-utils';
import moment from 'moment';

class ScheduleTableRow extends React.Component {

  render() {

    const schedule = this.props.schedule;
    const nextDate = DateUtils.toDateString(schedule.ScheduledExecutionNextScheduled, '-'),
      nextTime = DateUtils.toTimeString(schedule.ScheduledExecutionNextScheduled),
      loadDate = DateUtils.toDateString(schedule.ScheduledExecutionNextLoadDate, '-');

    return (
      <tr>
        <td>
          <a href={`/schedules/${schedule.ScheduledExecutionKey}`}>{schedule.ScheduledExecutionName}</a>
        </td>
        <td>
          {nextDate}
          <br />
          <span className="schedule-time">{nextTime}</span>
        </td>
        <td>{schedule.ScheduledExecutionClientName}</td>
        <td>{schedule.ScheduledExecutionDataSetName}</td>
        <td>{loadDate}</td>
        <td>
          <input type="checkbox" disabled={true} checked={schedule.ScheduledExecutionEnabled} />
        </td>
      </tr>
    );

  }

}

export default ScheduleTableRow;
