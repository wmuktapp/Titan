import React from 'react';
import ScheduleDays from './schedule/days.jsx';

class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,

      days: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      }
    };

    this.updateDay = this.updateDay.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  updateDay(day, enabled) {
    const days = this.state.days;
    days[day] = enabled;
    this.setState({
      days: days
    });
  }

  onSubmit(event) {

    // TODO send insert/update to server
    console.log('Form submitted');

    event.preventDefault();
  }

  render() {

    // NOTE: Handles both insert and update

    // TODO form rows
    // - key?
    // - name
    // - next scheduled
    // - schedule end
    // - client name
    // - data source name
    // - data set name
    // - next load date
    // - enabled
    // - interval duration (h/m/s)
    // - daily enabled boxes
    // - acquire (key/name?)
    // - acquire option(s) (name/value)
    // - extract (key/name?)
    // - extract option(s) (name/value)
    // - status
    const rows = [];

    const daysRow = (
      <div key="days" className="row">
        <ScheduleDays key="days" days={this.state.days} onChange={this.updateDay} />
      </div>
    );

    rows.push(daysRow);

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>
        <h5>{ this.state.id ? 'Update Schedule' : 'New Schedule' }</h5>
        {rows}
        <input type="submit" value={ this.state.id ? 'Update' : 'Create' } />
      </form>
    );
  }

}

export default ScheduleForm;
