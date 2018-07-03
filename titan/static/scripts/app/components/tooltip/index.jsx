import React from 'react';
import './index.css';

function Tooltip(props) {
  return (
    <div className="tooltip">
      {props.children}
    </div>
  );
}

export default Tooltip;
