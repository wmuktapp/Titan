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
          loading: false,
          selectedClients: this.getUniqueClients(results)
        });
      });

  }

  onFilterChange(clients) {
    this.setState({
      selectedClients: clients
    });
  }

  getUniqueClients(schedules) {
    return schedules.reduce((clients, schedule) => {
      if (clients.indexOf(schedule.client) === -1) {
        clients.push(schedule.client);
      }
      return clients;
    }, []).sort();
  }

  render() {

    // TODO calculate these properly
    const clients = this.getUniqueClients(this.state.schedules);

    let schedules = this.state.schedules;
    const selectedClients = this.state.selectedClients;
    schedules = schedules.filter((schedule) => {
      return selectedClients.indexOf(schedule.client) !== -1; 
    });

    return (
      <div className="schedule-list">
        <ScheduleTable schedules={schedules}
          clients={clients} filterClients={this.onFilterChange}
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
