import React from 'react';

class MonitoringFooter extends React.Component {

  render() {
    return (
      <div className="monitor-controls-footer">
        { this.props.children }
      </div>
    );
  }
}

export default MonitoringFooter;
