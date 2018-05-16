import React from 'react';

class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {

    // TODO send insert/update to server
    console.log('Form submitted');

    event.preventDefault();
  }

  render() {

    // NOTE: Handles both insert and update

    // TODO form rows
    // - key?
    // - name
    // - next scheduled
    // - schedule end
    // - client name
    // - data source name
    // - data set name
    // - next load date
    // - enabled
    // - interval duration (h/m/s)
    // - daily enabled boxes
    // - acquire (key/name?)
    // - acquire option(s) (name/value)
    // - extract (key/name?)
    // - extract option(s) (name/value)
    // - status
    const rows = []

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>
        <h5>{ this.state.id ? 'Update Schedule' : 'New Schedule' }</h5>
        {rows}
        <input type="submit" value={ this.state.id ? 'Update' : 'Create' } />
      </form>
    );
  }

}

export default ScheduleForm;
