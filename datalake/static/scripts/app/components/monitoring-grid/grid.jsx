import React from 'react';
import MonitoringGridHeader from './header.jsx';
import MonitoringGridContent from './content.jsx';

class MonitoringGrid extends React.Component {

  constructor(props) {
    super(props);
    this.retry = this.retry.bind(this);
  }

  retry() {
    if (this.props.retryEnabled) {
      this.props.retry();
    }
  }

  render() {
    return (
      <div className="monitoring-grid">
        <div className="monitoring-controls u-cf">
          <a onClick={this.props.showPrevious} className="monitoring-control-previous">&lt; Previous</a>
          <a onClick={this.props.showNext} className="monitoring-control-next">Next &gt;</a>
        </div>
        <table className="monitoring-table">
          <MonitoringGridHeader start={this.props.start} end={this.props.end} />
          <MonitoringGridContent data={this.props.data} loading={this.props.loading} selectExecution={this.props.selectExecution} />
        </table>
        {
          this.props.loading
            ? <p>Loading...</p>
            : <div className="monitoring-controls-footer">
                <a onClick={this.props.showMore} className="monitoring-control-more">Show more</a>
                <a onClick={this.retry} className={'btn-retry' + (this.props.retryEnabled ? '' : ' btn-disabled')}>Retry</a>
              </div>
        }
      </div>
    );
  }

}

export default MonitoringGrid;
