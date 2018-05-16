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

    // Form title
    const title = (
      <h5>
        { this.state.id ? 'Update Schedule' : 'New Schedule' }
      </h5>
    );

    // TODO form rows
    const rows = []

    // Submit button
    const submit = <input type="submit" value={ this.state.id ? 'Update' : 'Create' } />;

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>
        {title}
        {rows}
        {submit}
      </form>
    );
  }

}

export default ScheduleForm;
