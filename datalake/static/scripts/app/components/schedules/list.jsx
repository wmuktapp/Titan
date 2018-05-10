import React from 'react';
import ScheduleTable from './table.jsx';

class ScheduleList extends React.Component {

  // Retrieve data from database
  // Manage the list of data

  constructor() {
    super();
    this.state = {
      schedules: []
    };
  }

  componentDidMount() {

    fetch('/api/schedules')
      .then(res => res.json())
      .then((results) => {
        this.setState({
          schedules: results
        })
      });

  }

  render() {
    return <ScheduleTable schedules={this.state.schedules} />;
  }

}

export default ScheduleList;
