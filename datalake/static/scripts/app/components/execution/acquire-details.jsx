import React from 'react';
import Status from './status.jsx';

class ExecutionAcquireDetails extends React.Component {

  render() {

    const acquire = this.props.acquire;

    // TODO
    // - Add options (expandable section?)

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
          <span className="execution-value">
            <Status status={acquire.AcquireStatus} />
          </span>
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
