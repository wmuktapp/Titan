import React from 'react';

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
        console.log(results)
        this.setState({
          schedules: results
        })
      });

  }

  render() {

    // TODO move to child component
    const items = this.state.schedules.map((schedule, index) => {
      return <li key={index}>{schedule.name}</li>
    });

    return (
      <ul>
        {items}
      </ul>
    );
  }

}

export default ScheduleList;
