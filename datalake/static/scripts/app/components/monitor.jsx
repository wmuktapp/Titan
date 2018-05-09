import React from 'react';
import MonitoringGrid from './monitoring-grid/grid.jsx';

class Monitor extends React.Component {

  constructor() {

    super();

    const days = 5;
    const rows = 10;

    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    let start = new Date(today);
    start.setDate(start.getDate() - days + 1);
    let end = new Date(today);

    this.state = {
      start: start,
      end: end,
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

    this.fetchData(this.state.start, this.state.end, callback);
  }

  showPrevious() {

    let end = new Date(this.state.start);
    end.setDate(end.getDate() - 1);
    let start = new Date(end);
    start.setDate(start.getDate() - 4);

    this.setState({
      start: start,
      end: end,
      data: []
    });

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result
      });
    };

    this.fetchData(start, end, callback);
  }

  showNext() {
    let start = new Date(this.state.end);
    start.setDate(start.getDate() + 1);
    let end = new Date(start);
    end.setDate(end.getDate() + 4);

    this.setState({
      start: start,
      end: end,
      data: []
    });

    const callback = (result) => {
      this.setState({
        loading: false,
        data: result
      });
    };

    this.fetchData(start, end, callback);
  }

  showMore() {
    const callback = (result) => {
      this.setState({
        loading: false,
        data: this.state.data.concat(result)
      });
    };
    this.fetchData(this.state.start, this.state.end, callback)
  }

  fetchData(start, end, callback) {

    this.setState({
      loading: true
    });

    const url = '/executions'
      + '?start=' + start.toISOString().substr(0, 10)
      + '&end=' + end.toISOString().substr(0, 10)
      + '&rows=' + 10;

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

    fetch('/retry', {
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
      <MonitoringGrid start={this.state.start} end={this.state.end}
        data={this.state.data} loading={this.state.loading}
        selectExecution={this.selectExecution}
        retryEnabled={!!this.state.retryList.length} retry={this.retryExecutions}
        showPrevious={this.showPrevious} showNext={this.showNext} showMore={this.showMore} />
    );
  }
}

export default Monitor;
