import React from 'react';
import DatePicker from 'react-datepicker';

// Datepicker styles
require('react-datepicker/dist/react-datepicker.css');


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
      loadDate: null,
      client: '',
      dataset: '',
      user: '',
      parameters: [],
      availablePrograms: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {

    // Get available acquire programs
    fetch('/api/acquireprograms')
      .then(res => res.json())
      .then((results) => {
        this.setState({
          availablePrograms: results
        });
      });

  }

  handleChange(event) {

    const target = event.target,
      value = target.value,
      name = target.name;

    this.setState({
      [name]: value
    });
  }

  // Special case - merge with handleChange?
  handleDateChange(event) {
    // const value = event.target.value;

    console.log(event);

    // TODO date formatting?
    this.setState({
      loadDate: event
    });
  }

  handleSubmit(event) {
    // TODO handle submission, send to server
    console.log(this.state);
    event.preventDefault();
  }

  render() {

    const programOptions = this.state.availablePrograms.map((program, index) => {
      return <option key={index} value={program.id}>{program.name}</option>;
    });

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <label>Program</label>
          <select name="program" value={this.state.program} onChange={this.handleChange}>
            <option value=""></option>
            { programOptions }
          </select>
        </div>
        <div className="row">
          <label>Load date</label>
          <DatePicker selected={this.state.loadDate} dateFormat="DD/MM/YYYY" onChange={this.handleDateChange} />
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
