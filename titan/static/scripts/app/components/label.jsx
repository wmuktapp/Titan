import React from 'react';
import './label.css';

// Creates a label, handles the 'required' asterisk
class Label extends React.Component {
  render() {
    return <label className="label">
      { this.props.children }
      { this.props.required && <span className="fas fa-asterisk label-required" /> }
    </label>;
  }
}

export default Label;
