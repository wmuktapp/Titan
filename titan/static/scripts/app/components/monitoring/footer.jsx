import React from 'react';

class MonitoringFooter extends React.Component {

  render() {
    return (
      <div className="monitor-controls-footer">
        {
          this.props.showMore &&
            <a onClick={this.props.showMore} className="monitoring-control-more">Show more</a>
        }
      </div>
    );
  }
}

export default MonitoringFooter;
