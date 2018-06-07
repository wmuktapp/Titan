import React from 'react';

function ExecutionOption(props) {
  return (
    <div className="execution-option">
      <label className="execution-option-label">{props.name}</label>
      <span className="execution-option-value">{props.value}</span>
    </div>
  );
}

export default ExecutionOption;
