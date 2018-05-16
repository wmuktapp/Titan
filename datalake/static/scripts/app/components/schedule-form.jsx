import React from 'react';

class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };
  }

  render() {

    // NOTE: Handles both insert and update

    const subTitle = (
      <h5>
        { this.state.id ? 'Update Schedule' : 'New Schedule' }
      </h5>
    );

    return (
      <form className="schedule-form">
        {subTitle}

      </form>
    );
  }

}

export default ScheduleForm;
