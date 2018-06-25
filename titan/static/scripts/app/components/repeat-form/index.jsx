import React from 'react';
import PropTypes from 'prop-types';
import IntervalPicker from '../interval-picker/index.jsx';

import './index.css';

class RepeatForm extends React.Component {

  constructor(props) {
    super(props);
    this.addRepeat = this.addRepeat.bind(this);
    this.clearRepeat = this.clearRepeat.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateDays = this.updateDays.bind(this);
  }

  addRepeat() {
    this.props.onAddRepeat();
  }

  clearRepeat() {
    this.props.onRemoveRepeat();
  }

  updateInterval(days, hours, minutes) {
    // TODO pass updated interval and days to props method

    const repeat = {
      interval: {
        days: days,
        hours: hours,
        minutes: minutes
      },
      days: this.props.value.days
    };

    this.props.onChange(repeat);
  }

  updateDays() {
    // TODO pass updated interval and days to props method
  }

  render() {

    const repeat = this.props.value;

    // TODO
    // - DayPicker
    // - Warning message if interval === 0,0,0

    return (
      <div className="repeat-form">
        {
          this.props.includeRepeat
            ? <a onClick={this.clearRepeat}>
                <span className="fas fa-times repeat-form-link-icon" />Remove
              </a>
            : <a onClick={this.addRepeat}>
                <span className="fas fa-plus repeat-form-link-icon" />Repeat
              </a>
        }
        {
          this.props.includeRepeat &&
            <div>
              <h6>Interval</h6>
              <IntervalPicker
                days={repeat.interval.days}
                hours={repeat.interval.hours}
                minutes={repeat.interval.minutes}
                onUpdate={this.updateInterval}
              />
            </div>
        }
        {
          this.props.includeRepeat &&
              <p>DayPicker goes here</p>
        }
      </div>
    );
  }

}

RepeatForm.propTypes = {
  includeRepeat: PropTypes.bool.isRequired
};

export default RepeatForm;
