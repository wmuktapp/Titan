import React from 'react';
import ScheduleDays from './schedule/days.jsx';

class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);

    // TODO populate these from querying
    this.state = {
      id: this.props.id,

      name: '',
      enabled: true,

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

    this.onChange = this.onChange.bind(this);
    this.updateDay = this.updateDay.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const target = event.target,
      name = target.name,
      value = target.value;

    this.setState({
      [name]: value
    });
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
    // - DONE name
    // - next scheduled
    // - schedule end
    // - client name
    // - data source name
    // - data set name
    // - next load date
    // - DONE enabled
    // - interval duration (h/m/s)
    // - DONE daily enabled boxes
    // - acquire (key/name?)
    // - acquire option(s) (name/value)
    // - extract (key/name?)
    // - extract option(s) (name/value)
    // - status
    const rows = [];

    // Name
    rows.push(
      <div key="name">
        <label>Name</label>
        <input type="text" name="name" value={this.state.name} />
      </div>
    );

    // Enabled
    rows.push(
      <div key="enabled" className="row">
        <label>
          <input type="checkbox" name="enabled" checked={this.enabled} onChange={this.onChange} />
          <span className="label-body">Enabled</span>
        </label>
      </div>
    );

    // Days
    rows.push(
      <div key="days" className="row">
        <ScheduleDays key="days" days={this.state.days} onChange={this.updateDay} />
      </div>
    );

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
