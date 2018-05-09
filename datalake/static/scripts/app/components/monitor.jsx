import React from 'react';
import MonitoringGrid from './monitoring/grid.jsx';

class Monitor extends React.Component {

  constructor() {

    super();

    const days = 5;

    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    let start = new Date(today);
    start.setDate(start.getDate() - days + 1);
    let end = new Date(today);

    this.state = {
      dates: {
        start: start,
        end: end
      },
      loading: true,
      data: [],
      retryList: []
    };

    // Bind events
    this.selectExecution = this.selectExecution.bind(this);
    this.retryExecutions = this.retryExecutions.bind(this);
    this.showPrevious = this.showPrevious.bind(this);
    this.showNext = this.showNext.bind(this);
    this.showMore = this.showMore.bind(this);
  }

  componentDidMount() {

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result
      });
    };

    this.fetchData(this.state.dates, callback);
  }

  showPrevious() {

    let end = new Date(this.state.dates.start);
    end.setDate(end.getDate() - 1);
    let start = new Date(end);
    start.setDate(start.getDate() - 4);

    this.setState({
      dates: {
        start: start,
        end: end
      },
      data: []
    });

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result
      });
    };

    this.fetchData({ start: start, end: end }, callback);
  }

  showNext() {
    let start = new Date(this.state.dates.end);
    start.setDate(start.getDate() + 1);
    let end = new Date(start);
    end.setDate(end.getDate() + 4);

    this.setState({
      dates: {
        start: start,
        end: end
      },
      data: []
    });

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result
      });
    };

    this.fetchData({ start: start, end: end }, callback);
  }

  showMore() {
    const callback = (result) => {
      this.setState({
        loading: false,
        data: this.state.data.concat(result)
      });
    };
    this.fetchData(this.state.dates, callback)
  }

  fetchData(dates, callback) {

    this.setState({
      loading: true
    });

    const url = '/api/executions'
      + '?start=' + dates.start.toISOString().substr(0, 10)
      + '&end=' + dates.end.toISOString().substr(0, 10);

    // Request data
    fetch(url)
      .then(res => res.json())
      .then(
        callback,
        (error) => {
          // TODO error handling
          console.log('Error retrieving data');
        }
      );
  }

  selectExecution(id, date, add) {

    // Add or remove execution from list

    let list = this.state.retryList;

    if (add) {
      // Add to list
      list.push({
        id: id,
        date: date
      });
    } else {
      // Remove from list
      for (let i in list) {
        if (list[i].id === id && list[i].date === date) {
          list.splice(i, 1);
          break;
        }
      }
    }

    this.setState({
      retryList: list
    });
  }

  retryExecutions() {

    if (this.state.retryList.length === 0) {
      return;
    }

    this.setState({
      loading: true
    });

    fetch('/api/executions/retry', {
      method: 'post',
      body: JSON.stringify({
        'executions': this.state.retryList
      })
    }).then(res => res.json())
      .then((result) => {
          this.setState({
            loading: false,
            data: result
          });
        },
        (error) => {
          // TODO error handling
          console.log('Error retrieving data');
        }
      );
  }

  render() {
    // TODO enable / disable controls based on available data
    return (

      <div className="monitoring-grid">
        <div className="monitoring-controls u-cf">
          <a onClick={this.showPrevious} className="monitoring-control-previous">&lt; Previous</a>
          <a onClick={this.showNext} className="monitoring-control-next">Next &gt;</a>
        </div>
        <MonitoringGrid dates={this.state.dates} data={this.state.data} select={this.selectExecution} />
        {
          this.state.loading
            ? <p className="loading-message">Loading...</p>
            : <div className="monitoring-controls-footer">
                <a onClick={this.showMore} className="monitoring-control-more">Show more</a>
                <a onClick={this.retryExecutions} className={'btn-retry' + (!!this.state.retryList.length ? '' : ' btn-disabled')}>Retry</a>
              </div>
        }
      </div>
    );
  }
}

export default Monitor;
