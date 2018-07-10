import React from 'react';
import ExecutionAcquireDetails from './acquire-details.jsx';

class ExecutionAcquireSection extends React.Component {

  render() {

    const acquires = this.props.acquires.map(
      acquire => <ExecutionAcquireDetails key={acquire.AcquireKey} acquire={acquire} />
    );

    return (
      <section className="form-section">
        <h6>Acquires</h6>
        {
          this.props.acquires.length
            ? acquires
            : <p>No acquires for this execution</p>
        }
      </section>
    );

  }

}

export default ExecutionAcquireSection;