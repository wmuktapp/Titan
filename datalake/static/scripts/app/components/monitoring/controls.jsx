import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

require('./controls.css');
require('react-datepicker/dist/react-datepicker.css');

class MonitoringControls extends React.Component {

  constructor(props) {
    super(props);
    this.selectDate = this.selectDate.bind(this);
  }

  selectDate(value) {
    
    const start = value.toDate();
    start.setDate(start.getDate() - 4);
    const end = value.toDate();

    this.props.selectDates(start, end);
  }

  render() {

    // TODO enable / disable controls based on available data?

    const date = moment(this.props.dates.end);

    return (
      <div className="monitoring-controls u-cf">
        <label>Show executions up to date</label>
        <DatePicker selected={date} dateFormat="DD/MM/YYYY" onChange={this.selectDate} maxDate={moment().add(-1, 'd')} />
      </div>
    );
  }

}

export default MonitoringControls;
