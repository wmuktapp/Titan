import React from 'react';
import ScheduleTable from './table.jsx';

require('./schedule.css');

class ScheduleList extends React.Component {

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

    // On page load, retrieve a list of schedules

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

  // TODO needs to handle other filtering
  onFilterChange(clients) {
    this.setState({
      selectedClients: clients
    });
  }

  // Get a list of all clients included in the given list of schedules
  getUniqueClients(schedules) {
    return schedules.reduce((clients, schedule) => {
      if (clients.indexOf(schedule.client) === -1) {
        clients.push(schedule.client);
      }
      return clients;
    }, []).sort();
  }

  render() {

    const clients = this.getUniqueClients(this.state.schedules);

    let schedules = this.state.schedules;
    const selectedClients = this.state.selectedClients;
    schedules = schedules.filter((schedule) => {
      return selectedClients.indexOf(schedule.client) !== -1; 
    });

    // TODO other filtering, once support is added

    return (
      <div className="schedule-list">
        <ScheduleTable schedules={schedules} loading={this.state.loading}
          clients={clients} filterClients={this.onFilterChange}
          />
      </div>
    );
  }

}

export default ScheduleList;
