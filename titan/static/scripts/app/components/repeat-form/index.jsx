import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class RepeatForm extends React.Component {

  constructor(props) {
    super(props);
    this.addRepeat = this.addRepeat.bind(this);
    this.clearRepeat = this.clearRepeat.bind(this);
  }

  addRepeat() {
    this.props.onAddRepeat();
  }

  clearRepeat() {
    this.props.onRemoveRepeat();
  }

  update() {
    // TODO pass updated interval and days to props method
  }

  render() {

    // TODO
    // - IntervalPicker
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
              <p>IntervalPicker goes here</p>
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
