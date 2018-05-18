import React from 'react';

require('./days.css');

class ScheduleDays extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const target = event.target,
      day = target.name,
      enabled = target.checked;

    this.props.onChange(day, enabled);
  }

  render() {

    const days = Object.keys(this.props.days).map((day) => {
      return (
        <label key={day}>
          <input type="checkbox" name={day} checked={this.props.days[day]} onChange={this.onChange} />
          <span className="label-body">{day}</span>
        </label>
      );
    });

    return (
      <div className="schedule-days">
        {days}
      </div>
    );
  }
}

export default ScheduleDays;
