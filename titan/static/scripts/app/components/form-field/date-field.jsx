import React from 'react';
import DatePicker from 'react-datepicker';
import Label from '../label.jsx';
import './index.css';

class DateField extends React.Component {

  render() {

    const error = this.props.required
      && this.props.validate
      && this.props.value === null;

    const className = error ? 'input-error' : '';

    return (
      <div>
        <Label required={this.props.required}>{this.props.label}</Label>
        {
          error &&
            <p className="input-error-message">This field is required</p>
        }
        <DatePicker
          dateFormat="DD/MM/YYYY"
          className={className}
          type="text"
          name={this.props.name}
          selected={this.props.value}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default DateField;
