import React from 'react';
import ScheduleTable from './table.jsx';
import Ajax from '../../utils/ajax';

import './schedule.css';

class ScheduleList extends React.Component {

  constructor() {
    super();
    this.state = {
      schedules: [],
      loading: true,
      selectedExecutions: [],
      selectedClients: [],
      selectedDataSets: []
    };

    this.onExecutionFilterChange = this.onExecutionFilterChange.bind(this);
    this.onClientFilterChange = this.onClientFilterChange.bind(this);
    this.onDataSetFilterChange = this.onDataSetFilterChange.bind(this);
  }

  componentDidMount() {

    // On page load, retrieve a list of schedules

    Ajax.fetch('/api/schedules')
      .then(res => res.json())
      .then(results => {
        this.setState({
          schedules: results,
          loading: false,
          selectedExecutions: this.getUniqueExecutions(results),
          selectedClients: this.getUniqueClients(results),
          selectedDataSets: this.getUniqueDataSets(results)
        });
      });
  }

  // Filter update methods

  onExecutionFilterChange(executions) {
    this.setState({
      selectedExecutions: executions
    });
  }

  onClientFilterChange(clients) {
    this.setState({
      selectedClients: clients
    });
  }

  onDataSetFilterChange(dataSets) {
    this.setState({
      selectedDataSets: dataSets
    });
  }

  // Get a list of all executions included in the given list of schedules
  getUniqueExecutions(schedules) {
    return schedules.reduce((executions, schedule) => {
      if (executions.indexOf(schedule.ScheduledExecutionName) === -1) {
        executions.push(schedule.ScheduledExecutionName);
      }
      return executions;
    }, []).sort();
  }

  // Get a list of all clients included in the given list of schedules
  getUniqueClients(schedules) {
    return schedules.reduce((clients, schedule) => {
      if (clients.indexOf(schedule.ScheduledExecutionClientName) === -1) {
        clients.push(schedule.ScheduledExecutionClientName);
      }
      return clients;
    }, []).sort();
  }

  // Get a list of all datasets included in the given list of schedules
  getUniqueDataSets(schedules) {
    return schedules.reduce((dataSets, schedule) => {
      if (dataSets.indexOf(schedule.ScheduledExecutionDataSetName) === -1) {
        dataSets.push(schedule.ScheduledExecutionDataSetName);
      }
      return dataSets;
    }, []).sort();
  }

  render() {

    const
      executions = this.getUniqueExecutions(this.state.schedules),
      clients = this.getUniqueClients(this.state.schedules),
      dataSets = this.getUniqueDataSets(this.state.schedules);

    let schedules = this.state.schedules;

    // Filter by execution
    schedules = schedules.filter((schedule) => {
      return this.state.selectedExecutions.indexOf(schedule.ScheduledExecutionName) !== -1; 
    });

    // Filter by client
    schedules = schedules.filter((schedule) => {
      return this.state.selectedClients.indexOf(schedule.ScheduledExecutionClientName) !== -1; 
    });

    // Filter by dataset
    schedules = schedules.filter((schedule) => {
      return this.state.selectedDataSets.indexOf(schedule.ScheduledExecutionDataSetName) !== -1; 
    });

    return (
      <div className="schedule-list">
        <ScheduleTable schedules={schedules} loading={this.state.loading}
          executions={executions} filterExecutions={this.onExecutionFilterChange}
          clients={clients} filterClients={this.onClientFilterChange}
          dataSets={dataSets} filterDataSets={this.onDataSetFilterChange}
        />
      </div>
    );
  }

}

export default ScheduleList;
