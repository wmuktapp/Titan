import React from 'react';

class AdhocForm extends React.Component {
  
  // Form values
  // - Program
  // - Load date
  // - Client
  // - Dataset
  // - User
  // - Parameters?

  constructor() {
    super();
    this.state = {
      program: '',
      loadDate: '',
      client: '',
      dataset: '',
      user: '',
      parameters: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {

    // TODO form validation?

    const target = event.target,
      value = target.value,
      name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    // TODO handle submission, send to server
    console.log(this.state);
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <label>Program</label>
          <input type="text" name="program" value={this.state.program} onChange={this.handleChange} />
        </div>
        <div className="row">
          <label>Load date</label>
          <input type="text" name="loadDate" value={this.state.loadDate} onChange={this.handleChange} />
        </div>
        <div className="row">
          <label>Client</label>
          <input type="text" name="client" value={this.state.client} onChange={this.handleChange} />
        </div>
        <div className="row">
          <label>Dataset</label>
          <input type="text" name="dataset" value={this.state.dataset} onChange={this.handleChange} />
        </div>
        <div className="row">
          <label>User</label>
          <input type="text" name="user" value={this.state.user} onChange={this.handleChange} />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }

}

export default AdhocForm;
