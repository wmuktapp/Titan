import React from 'react';
import dateUtils from '../../utils/date-utils';

require('./header.css');

class MonitoringGridHeader extends React.Component {

  render() {

    const start = this.props.dates.start, end = this.props.dates.end;

    let cells = [], i = 1, temp = new Date(start);

    // Iterate from start to end dates
    while (temp <= end) {

      let dateLabel = '', day;

      // Special case for yesterday and today
      if (dateUtils.isToday(temp)) {
        dateLabel = 'Today';
      } else if (dateUtils.isYesterday(temp)) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = dateUtils.dateToString(temp);
        day = <label className="header-day">{dateUtils.getWeekday(temp)}</label>;
      }

      // Add header cell with (formatted) date
      cells.push(
        <th key={i++}>
          <span className="header-contents">
            <label className="header-date">{dateLabel}</label>
            {day}
          </span>
        </th>
      );

      // Next date
      temp.setDate(temp.getDate() + 1);
    }

    return (
      <thead className="header">
        <tr>
          <th></th>
          {cells}
        </tr>
      </thead>
    );
  }

}

export default MonitoringGridHeader;
