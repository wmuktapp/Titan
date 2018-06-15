import React from 'react';
import './label.css';

function Label(props) {
  return <label className="label">
      { props.children }
      { props.required && <span className="fas fa-asterisk label-required" /> }
    </label>;
}

export default Label;
