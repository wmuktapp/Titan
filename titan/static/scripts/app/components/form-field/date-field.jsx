import React from 'react';
import FormRow from './form-row.jsx';
import DatePicker from 'react-datepicker';

class DateField extends React.Component {

  render() {

    const error = this.props.required
      && this.props.validate
      && this.props.value === null;

    const className = error ? 'input-error' : '';
    const errorMessage = error ? 'This field is required' : '';

    return (
      <FormRow required={this.props.required} label={this.props.label} error={errorMessage}>
        <DatePicker
          dateFormat="DD/MM/YYYY"
          className={className}
          type="text"
          name={this.props.name}
          selected={this.props.value}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
        />
      </FormRow>
    );
  }
}

export default DateField;
