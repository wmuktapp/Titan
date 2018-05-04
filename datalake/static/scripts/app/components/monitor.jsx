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
      startDate: new Date(today - days * (24 * 60 * 60 * 1000)),
      endDate: new Date(today),
      rows: rows,
      loading: true,
      data: []
    };
  }


  componentDidMount() {

    const url = '/monitoring'
      + '?start=' + this.state.startDate.toISOString().substr(0, 10)
      + '&end=' + this.state.endDate.toISOString().substr(0, 10)
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
      )
  }

  render() {
    return <MonitoringGrid data={this.state.data} loading={this.state.loading} />;
  }
}

export default Monitor;
