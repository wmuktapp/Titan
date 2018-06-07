import React from 'react';

class ExecutionAcquireDetails extends React.Component {

  render() {

    const acquire = this.props.acquire;

    // TODO
    // - Add options (expandable section?)

    const statusClasses = {
      success: 'text-success',
      failure: 'text-failure',
      running: 'text-neutral'
    };

    const statusClass = statusClasses[acquire.AcquireStatus] || '';

    return (
      <div className="acquire-details">

        <div>
          <label>Key</label>
          <span className="execution-value">{acquire.AcquireKey}</span>
        </div>
        <div>
          <label>Start Time</label>
          <span className="execution-value">{acquire.AcquireStartTime}</span>
        </div>
        <div>
          <label>End Time</label>
          <span className="execution-value">{acquire.AcquireEndTime}</span>
        </div>
        <div>
          <label>Status</label>
          <span className={'execution-value status ' + statusClass}>{acquire.AcquireStatus.toUpperCase()}</span>
        </div>
        {
          acquire.AcquireErrorMessage &&
            <div>
              <label>Key</label>
              <span className="execution-value">{acquire.AcquireKey}</span>
            </div>
        }

      </div>
    )
  }
}

export default ExecutionAcquireDetails;
