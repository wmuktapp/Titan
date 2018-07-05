import React from 'react';
import Tooltip from '../tooltip/index.jsx';

function MonitoringTooltip(props) {
  return (
    <Tooltip offsetY={50}>
      <h4 className="tooltip-title">{props.title}</h4>
      <p>
        <label>Start time:</label> {props.startTime || 'N/A'}
      </p>
      <p>
        <label>End time:</label> {props.endTime || 'N/A'}
      </p>
      {
        props.error &&
          <p className="tooltip-error">
            <span className="fas fa-exclamation-triangle tooltip-error-icon" />
            {props.error}
          </p>
      }
    </Tooltip>
  );
}

export default MonitoringTooltip;
