import React from 'react';
import MonitoringGridHeader from './header.jsx';
import MonitoringGridContent from './content.jsx';

class MonitoringGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoaded: false,
        data: []
    }
  }

  componentDidMount() {
    // Request data
    fetch('/monitoring')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
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
    return (
      // TODO pass dates to header component instead?
      this.state.isLoaded
        ? <table className="monitoring-grid">
            <MonitoringGridHeader data={this.state.data} />
            <MonitoringGridContent data={this.state.data} />
          </table>
        : <p className="monitoring-grid-loading">Loading data...</p>
    );
  }

}

export default MonitoringGrid;
