import React from 'react';
import Status from './status.jsx';
import ExecutionExtractOptions from './extract-options.jsx';

class ExecutionExtractDetails extends React.Component {

  render() {

    const extract = this.props.extract;

    return (
      <div className="extract-details">

        <div>
          <label>Key</label>
          <span className="execution-value">{extract.ExtractKey}</span>
        </div>
        <div>
          <label>Destination</label>
          <span className="execution-value">{extract.ExtractDestination}</span>
        </div>
        <div>
          <label>Start Time</label>
          <span className="execution-value">{extract.ExtractStartTime}</span>
        </div>
        <div>
          <label>End Time</label>
          <span className="execution-value">{extract.ExtractEndTime}</span>
        </div>
        <div>
          <label>Status</label>
          <span className="execution-value">
            <Status status={extract.ExtractStatus} />
          </span>
        </div>

        <ExecutionExtractOptions options={extract.Options} />

      </div>
    );
  }
}

export default ExecutionExtractDetails;
