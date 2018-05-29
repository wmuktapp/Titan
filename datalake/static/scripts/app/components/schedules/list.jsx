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
      page: 1
    };
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

  render() {

    return (
      <div className="schedule-list">
        <ScheduleTable schedules={this.state.schedules} />
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
