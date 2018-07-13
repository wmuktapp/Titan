import React from 'react';
import DateUtils from '../../utils/date-utils';

import './header.css';

class MonitoringGridHeader extends React.Component {

  render() {

    const start = this.props.start, end = this.props.end;

    let labels = [], i = 1, temp = new Date(start);

    // Iterate from start to end dates
    while (temp <= end) {

      let dateLabel = '', className = 'header-label';

      // Special case for yesterday and today
      if (DateUtils.isToday(temp)) {
        dateLabel = 'Today';
      } else if (DateUtils.isYesterday(temp)) {
        dateLabel = 'Yesterday';
        className += ' header-highlight';
      } else {
        dateLabel = DateUtils.toDateString(temp);
      }

      // Add header cell with (formatted) date
      labels.push(
        <span key={i++} className={className}>
          <label className="header-date">{dateLabel}</label>
          <label className="header-day">{DateUtils.getWeekday(temp)}</label>
        </span>
      );

      // Next date
      temp.setDate(temp.getDate() + 1);
    }

    const separator = <span className="fas fa-angle-right header-description-separator" />

    return (
      <div className="header">
        <h4 className="header-description">Client {separator} Data Source {separator} Data Set</h4>
        {labels}
      </div>
    );
  }

}

export default MonitoringGridHeader;
