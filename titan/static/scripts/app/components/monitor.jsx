import React from 'react';
import MonitoringControls from './monitoring/controls.jsx';
import MonitoringGrid from './monitoring/grid.jsx';
import MonitoringFooter from './monitoring/footer.jsx';
import Alert from './alert/alert.jsx'
import { isEmpty, mergeData } from '../utils/data-utils';
import { fetchMonitorData } from '../services/data';
import Retry from './monitoring/retry/index.jsx';

import './monitor.css';

class Monitor extends React.Component {

  constructor() {

    super();

    const days = 5;

    const start = new Date();
    start.setDate(start.getDate() - days);
    const end = new Date();
    end.setDate(end.getDate() - 1);

    this.state = {
      hasError: false,
      pageNumber: 1,
      start: start,
      end: end,
      loading: true,
      data: [],
      retryList: [],
      showMoreButton: true
    };

    // Bind events
    this.showDates = this.showDates.bind(this);
    this.showMore = this.showMore.bind(this);
    this.selectExecution = this.selectExecution.bind(this);
    this.clearRetries = this.clearRetries.bind(this);
  }

  componentDidMount() {

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result.data
      });
    };

    this.fetchData(this.state.end, this.state.pageNumber, callback);
  }

  showDates(start, end) {

    const pageNumber = 1;

    this.setState({
      pageNumber: pageNumber,
      start: start,
      end: end,
      data: []
    });

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result.data,
        showMoreButton: !isEmpty(result.data)
      });
    }

    this.fetchData(end, pageNumber, callback);
  }

  showMore() {

    const pageNumber = this.state.pageNumber + 1;
    this.setState({
      pageNumber: pageNumber
    });

    const callback = (result) => {
      this.setState({
        showMoreButton: !isEmpty(result.data),
        loading: false,
        data: mergeData(this.state.data, result.data)
      });
    };
    this.fetchData(this.state.end, pageNumber, callback);
  }

  fetchData(date, pageNumber, callback) {

    this.setState({
      hasError: false,
      loading: true
    });

    // Fetch data using data service
    fetchMonitorData(date, pageNumber, callback, error => {
      console.error(error.message);
      this.setState({
        hasError: true
      });
    });

  }

  selectExecution(executionKey, add) {

    // Add or remove execution from list

    const list = this.state.retryList;

    if (add) {
      // Add to list
      list.push(executionKey);
    } else {
      // Remove from list
      const index = list.indexOf(executionKey);
      if (index > -1) {
        list.splice(index, 1);
      }
    }

    this.setState({
      retryList: list
    });
  }

  clearRetries() {
    this.setState({
      retryList: []
    });
  }

  render() {

    if (this.state.hasError) {
      return (
        <Alert type="error" title="Unable to load data" canDismiss={false}>
          <p>An error occurred while retrieving the monitoring data</p>
        </Alert>
      );
    }

    return (
      <div className="monitor-grid">
        <MonitoringControls
          start={this.state.start}
          end={this.state.end}
          onSelectDates={this.showDates}
        />
        <MonitoringGrid
          start={this.state.start}
          end={this.state.end}
          data={this.state.data}
          onSelect={this.selectExecution}
          retryList={this.state.retryList}
        />
        <MonitoringFooter>
          {
            this.state.loading
              ? <p className="monitor-loading">Loading...</p>
              : this.state.showMoreButton && 
                  <a onClick={this.showMore} className="monitoring-control-more">Show more</a>
          }
          {
            isEmpty(this.state.data) && !this.state.loading &&
              <p className="monitor-empty">No monitoring data found</p>
          }
        </MonitoringFooter>
        <Retry ids={this.state.retryList} onRetry={this.clearRetries} />
      </div>
    );
  }
}

export default Monitor;
