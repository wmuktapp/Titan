import React from 'react';
import ExecutionExtractDetails from './extract-details.jsx';

class ExecutionExtractSection extends React.Component {

  render() {
    return (
      <section className="form-section">
        <h6>Extract</h6>
        {
          this.props.extract.ExtractKey
            ? <ExecutionExtractDetails extract={this.props.extract} />
            : <p>No extract for this execution</p>
        }
      </section>
    );
  }

}

export default ExecutionExtractSection;