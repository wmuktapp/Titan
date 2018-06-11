import React from 'react';
import DatePicker from 'react-datepicker';
import AcquireList from './acquire-list/acquire-list.jsx';
import ExtractForm from './extract/extract-form.jsx';
import Ajax from '../utils/ajax';
import moment from 'moment';
import Select from 'react-select';

// Import styles
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

class AdhocForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      schedule: props.schedule,
      program: '',
      loadDate: null,
      client: '',
      dataSource: '',
      dataSet: '',
      user: '',
      availablePrograms: [],

      acquireProperties: ['property1', 'property2', 'property3'],
      acquires: [],

      extractDestination: '',
      extractFields: [],

      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleProgramChange = this.handleProgramChange.bind(this);
    this.handleLoadDateChange = this.handleLoadDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAcquires = this.updateAcquires.bind(this);
    this.onSelectExtractDestination = this.onSelectExtractDestination.bind(this);
    this.onUpdateExtractField = this.onUpdateExtractField.bind(this);
  }

  componentDidMount() {

    // Get available acquire programs
    Ajax.fetch('/api/acquire-programs')
      .then(res => res.json())
      .then(results => {
        this.setState({
          availablePrograms: results.data
        });
      });

    if (this.state.schedule) {
      
      Ajax.fetch('/api/schedules/' + this.state.schedule)
        .then(res => res.json())
        .then((results) => {

          results.loadDate = moment(new Date(results.loadDate));

          this.setState(results);
        });
    }

  }

  handleChange(event) {

    const target = event.target,
      value = target.value,
      name = target.name;

    this.setState({
      [name]: value
    });
  }

  // Special case for program
  handleProgramChange(program) {

    // TODO deal with updated field names

    const dataSource = program ? program.dataSource : '';

    this.setState({
      program: program,
      dataSource: dataSource,
      acquires: [],
      extractFields: []
    });
  }

  // Special case for load date
  // TODO only permit dates in the past?
  handleLoadDateChange(date) {
    this.setState({
      loadDate: date
    });
  }

  updateAcquires(acquires) {
    this.setState({
      acquires: acquires
    });
  }

  onSelectExtractDestination(destination) {
    this.setState({
      extractDestination: destination,
      extractFields: {
        'Extract field 1': '',
        'Extract field 2': '',
        'Extract field 3': ''
      }
    });
  }

  onUpdateExtractField(name, value) {
    const extractFields = this.state.extractFields;
    extractFields[name] = value;
    this.setState({
      extractFields: extractFields
    });
  }

  handleSubmit(event) {

    this.setState({
      submitted: true
    });

    Ajax.fetch('/api/executions', {
      method: 'POST',
      data: JSON.stringify(this.state)
    })
      .then(() => {
        console.log('execution successful!');
      });

    event.preventDefault();
  }

  render() {

    // Acquire program dropdown options
    const programOptions = this.state.availablePrograms.map(program => {
      return {
        value: program.AcquireProgramKey,
        label: program.AcquireProgramFriendlyName,
        dataSource: program.AcquireProgramDataSource,
        options: program.Options
      };
    });

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    // Acquire option names
    const acquireOptionNames = program
      ? program.options.map(option => option.AcquireProgramOptionName)
      : [];

    // TODO calculate whether to show Execute button based on other values

    // TODO calculate extractFields based on other values?

    if (this.state.submitted) {
      // TODO update this to contain status of execution (requires result from server)
      return <p>Adhoc execution triggered</p>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Program</label>
          <Select
            value={program}
            onChange={this.handleProgramChange}
            options={programOptions}
            className="titan-react-select"
          />
        </div>
        <div>
          <label>Load date</label>
          <DatePicker selected={this.state.loadDate} dateFormat="DD/MM/YYYY" onChange={this.handleLoadDateChange} />
        </div>
        <div>
          <label>Client</label>
          <input type="text" name="client" value={this.state.client} onChange={this.handleChange} />
        </div>
        <div>
          <label>Data source</label>
          <input type="text" name="dataSource" value={this.state.dataSource} onChange={this.handleChange} disabled={!!this.state.program} />
        </div>
        <div>
          <label>Data set</label>
          <input type="text" name="dataSet" value={this.state.dataSet} onChange={this.handleChange} />
        </div>
        <div>
          <label>User</label>
          <input type="text" name="user" value={this.state.user} onChange={this.handleChange} />
        </div>
        <div className="form-section">
          <h6>Acquires</h6>
          {
            this.state.program
            ? <AcquireList
                optionNames={acquireOptionNames}
                acquires={this.state.acquires}
                onChange={this.updateAcquires} />
            : <p>Select an acquire program</p>
          }
        </div>
        <div className="form-section">
          <h6>Extract</h6>
          {
            this.state.program
              ? <ExtractForm destination={this.state.extractDestination} selectDestination={this.onSelectExtractDestination}
                  fields={this.state.extractFields} updateField={this.onUpdateExtractField} />
              : <p className="empty-msg">No acquire program selected</p>
          }
        </div>
        <div>
          <input type="submit" value="Execute" />
        </div>
      </form>
    );
  }

}

export default AdhocForm;
