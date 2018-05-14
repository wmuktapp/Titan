import React from 'react';
import DatePicker from 'react-datepicker';
import AcquireForm from './adhoc/acquire-form.jsx';

// Datepicker styles
require('react-datepicker/dist/react-datepicker.css');


class AdhocForm extends React.Component {
  
  // Form values
  // - Program
  // - Load date
  // - Client
  // - Dataset
  // - User

  // TODO add:
  // - Define zero or more acquires (name-value pairs)
  // - Extract details - same as above, but with destination and data source name

  constructor() {
    super();
    this.state = {
      program: '',
      loadDate: null,
      client: '',
      dataset: '',
      user: '',
      availablePrograms: [],

      // Handled by sub-forms
      acquires: [],
      extracts: [],

      showSubmit: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoadDateChange = this.handleLoadDateChange.bind(this);
    this.addAcquire = this.addAcquire.bind(this);
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

    // TODO is there a better way of catching this event?
    if (name === 'program') {

      if (value) {
        this.addAcquire();
        this.setState({
          extracts: []
        });
      } else {
        this.setState({
          acquires: [],
          extracts: []
        });
      }
    }

    this.setState({
      [name]: value
    });
  }

  // Special case - merge with handleChange?
  // TODO only permit dates in the past?
  handleLoadDateChange(date) {
    this.setState({
      loadDate: date
    });
  }

  // TODO handle changes in sub-components, show / hide submit button

  handleSubmit(event) {
    // TODO handle submission, send to server
    console.log(this.state);
    event.preventDefault();
  }

  addAcquire() {

    let acquires = this.state.acquires;

    // TODO get property names dynamically
    acquires.push({
      fields: {
        // TODO add ID / name here?
        property1: '',
        property2: '',
        property3: ''
      }
    });

    this.setState({
      acquires: acquires
    });
  }

  removeAcquire() {
    // TODO
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
          <DatePicker selected={this.state.loadDate} dateFormat="DD/MM/YYYY" onChange={this.handleLoadDateChange} />
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
        <AcquireForm acquires={this.state.acquires} addAnother={this.addAcquire} />
        {
          this.state.showSubmit
            ? <input type="submit" value="Submit" />
            : null
        }
      </form>
    );
  }

}

export default AdhocForm;
