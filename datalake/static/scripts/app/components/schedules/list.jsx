import React from 'react';
import ScheduleTable from './table.jsx';

require('./schedule.css');

class ScheduleList extends React.Component {

  // Retrieve data from database
  // Manage the list of data

  constructor() {
    super();
    this.state = {
      schedules: [],
      loading: true,
      

      selectedClients: []
    };

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  componentDidMount() {

    fetch('/api/schedules')
      .then(res => res.json())
      .then((results) => {
        this.setState({
          schedules: results,
          loading: false
        });
      });

  }

  onFilterChange(clients) {

    let schedules = this.state.schedules;
    // const clients = this.state.selectedClients;

    schedules = schedules.filter((schedule) => {
      return clients.indexOf(schedule.client) !== -1; 
    });

    this.setState({
      schedules: schedules,
      selectedClients: clients
    });
  }

  render() {

    // TODO calculate these properly
    const clients = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'];
    const selectedClients = [];



    return (
      <div className="schedule-list">
        <ScheduleTable schedules={this.state.schedules}
          clients={clients} selectedClients={selectedClients} filterClients={this.onFilterChange}
          />
        {
          this.state.loading && 
            <div className="schedule-loading">
              <p>Loading...</p>
            </div>
        }
      </div>
    );
  }

}

export default ScheduleList;
