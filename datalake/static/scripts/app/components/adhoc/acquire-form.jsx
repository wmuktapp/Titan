import React from 'react';
import AcquireEntry from './acquire-entry.jsx';

class AcquireForm extends React.Component {

  render() {

    const acquireEntries = this.props.acquires.map((acquire, index) => {
      return <AcquireEntry key={index} fields={acquire.fields} />
    });

    const emptyMessage = <p>No acquire program selected</p>;

    return (
      <div className="acquire-form">
        <h4>Acquires</h4>
        { this.props.acquires.length ? acquireEntries : emptyMessage }
      </div>
    );
  }
}

export default AcquireForm;
