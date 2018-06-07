import React from 'react';

function AcquireOption(props) {
  return (
    <div className="acquire-option">
      <label className="acquire-option-label">{props.name}</label>
      <span className="acquire-option-value">{props.value}</span>
    </div>
  );
}

export default AcquireOption;
