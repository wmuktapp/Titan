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

    this.state = {
      start: new Date(today - (days - 1) * (24 * 60 * 60 * 1000)),
      end: new Date(today),
      rows: rows,
      loading: true,
      data: []
    };

    // Bind events
    this.showPrevious = this.showPrevious.bind(this);
    this.showNext = this.showNext.bind(this);
    this.showMore = this.showMore.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.state.start, this.state.end);
  }

  showPrevious() {

    const start = new Date(this.state.start - 5 * (24 * 60 * 60 * 1000)),
      end = new Date(this.state.end - 5 * (24 * 60 * 60 * 1000));

    this.setState({
      start: start,
      end: end
    });

    this.fetchData(start, end);
  }

  showNext() {
    const start = new Date(this.state.start + 5 * (24 * 60 * 60 * 1000)),
      end = new Date(this.state.end + 5 * (24 * 60 * 60 * 1000));

    this.setState({
      start: start,
      end: end
    });

    this.fetchData(start, end);
  }

  showMore() {
    this.setState({
      rows: this.state.rows + 10
    });
    // TODO send request and append rows
  }

  fetchData(start, end) {

    this.setState({
      loading: true
    });

    const url = '/monitoring'
      + '?start=' + start.toISOString().substr(0, 10)
      + '&end=' + end.toISOString().substr(0, 10)
      + '&rows=' + this.state.rows;

    // Request data
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
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
    return (
      <MonitoringGrid start={this.state.start} end={this.state.end}
        data={this.state.data} loading={this.state.loading}
        showPrevious={this.showPrevious} showNext={this.showNext} showMore={this.showMore} />
    );
  }
}

export default Monitor;
