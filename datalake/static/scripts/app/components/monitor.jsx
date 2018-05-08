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
      // rows: rows,
      loading: true,
      data: []
    };

    // Bind events
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

    const url = '/monitoring'
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

  render() {
    // TODO enable / disable controls based on available data
    return (
      <MonitoringGrid start={this.state.start} end={this.state.end}
        data={this.state.data} loading={this.state.loading}
        showPrevious={this.showPrevious} showNext={this.showNext} showMore={this.showMore} />
    );
  }
}

export default Monitor;
