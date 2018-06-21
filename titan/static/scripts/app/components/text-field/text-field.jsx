import React from 'react';
import Label from '../label.jsx';
import './text-field.css';

class TextField extends React.Component {

  render() {

    const error = this.props.required
      && this.props.validate
      && this.props.value.length === 0;

    const className = error ? 'input-error' : '';

    return (
      <div>
        <Label required={this.props.required}>{this.props.label}</Label>
        {
          error &&
            <p className="input-error-message">This field is required</p>
        }
        <input
          className={className}
          type="text"
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default TextField;
