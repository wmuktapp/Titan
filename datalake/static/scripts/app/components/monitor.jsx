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
      data: []
    };
  }

  componentDidMount() {

    const url = '/monitoring'
      + '?start=' + this.state.start.toISOString().substr(0, 10)
      + '&end=' + this.state.end.toISOString().substr(0, 10)
      + '&rows=' + this.state.rows;

    // Request data
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result
          });
        },
        (error) => {
          // TODO error handling
          console.log('Error retrieving data');
        }
      );
  }

  showNext() {
    // TODO
  }

  showPrevious() {
    // TODO
  }

  showMore() {
    this.setState({
      rows: this.state.rows + 10
    });
  }

  render() {
    return <MonitoringGrid start={this.state.start} end={this.state.end} data={this.state.data} />;
  }
}

export default Monitor;
