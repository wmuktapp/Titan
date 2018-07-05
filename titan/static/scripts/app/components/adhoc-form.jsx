import React from 'react';
import Select from 'react-select';
import moment from 'moment';
import DateField from './form-field/date-field.jsx';
import TextField from './form-field/text-field.jsx';
import AcquireList from './acquire-list/index.jsx';
import ExtractForm from './extract/extract-form.jsx';
import Alert from './alert/alert.jsx';
import Ajax from '../utils/ajax';

import {
  getAcquireProgramOptions,
  getAdhocExecutionData,
  convertScheduleToAdhoc
} from '../utils/data-utils';
import { validateAdhocData } from '../utils/validation';

// Import styles
import 'react-select/dist/react-select.css';

class AdhocForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      execution: {
        ExecutionClientName: '',
        ExecutionDataSourceName: '',
        ExecutionDataSetName: '',
        ExecutionLoadDate: null,
        ExecutionUser: '',
        AcquireProgramKey: 0
      },
      acquires: [],
      extract: {
        ExtractDestination: null,
        Options: []
      },

      schedule: props.schedule,
      availablePrograms: [],
      extractOptionConfig: [],

      isFormValid: true,
      triggered: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleProgramChange = this.handleProgramChange.bind(this);
    this.handleLoadDateChange = this.handleLoadDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAcquires = this.updateAcquires.bind(this);
    this.updateExtractDestination = this.updateExtractDestination.bind(this);
    this.updateExtractOptions = this.updateExtractOptions.bind(this);
  }

  componentDidMount() {

    // Get available acquire programs
    Ajax.fetch('/api/acquire-programs/')
      .then(res => res.json())
      .then(result => {
        this.setState({
          availablePrograms: result.data
        });
      });

    if (this.state.schedule) {

      Ajax.fetch('/api/schedules/' + this.state.schedule)
        .then(res => res.json())
        .then(result => {

          // Convert data from schedule to adhoc data
          const data = convertScheduleToAdhoc(result.data);

          this.setState({
            execution: data.execution,
            acquires: data.acquires,
            extract: data.extract
          });
        });
    }

  }

  handleChange(event) {

    const execution = this.state.execution;
    execution[event.target.name] = event.target.value;

    this.setState({ execution });
  }

  // Special case for program
  handleProgramChange(program) {

    const execution = this.state.execution;
    execution.AcquireProgramKey = program ? program.value : 0;
    execution.ExecutionDataSourceName = program ? program.dataSource : '';

    this.setState({
      execution: execution,
      acquires: []
    });
  }

  // Special case for load date
  handleLoadDateChange(name, date) {
    const execution = this.state.execution;
    execution.ExecutionLoadDate = date;
    this.setState({ execution });
  }

  updateAcquires(acquires) {
    this.setState({
      acquires: acquires
    });
  }

  updateExtractDestination(destination, options, optionConfig) {
    const extract = this.state.extract;
    extract.ExtractDestination = destination;
    extract.Options = options;
    this.setState({
      extract: extract,
      extractOptionConfig: optionConfig
    });
  }

  updateExtractOptions(options) {
    const extract = this.state.extract;
    extract.Options = options;
    this.setState({
      extract: extract
    });
  }

  handleSubmit(event) {

    // Stop the form from submitting
    event.preventDefault();

    // Convert into adhoc format
    const data = getAdhocExecutionData(this.state);

    if (!this.validate(data.data)) {
      this.setState({
        isFormValid: false,
        triggered: false
      });
      this.goToTop();
      return;
    }

    this.setState({
      isFormValid: true,
      triggered: true,
      executionUrl: null
    });

    Ajax.fetch('/api/executions/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(response => {
        this.setState({
          executionUrl: response.headers.get('Location')
        })
      });

    this.goToTop();
  }

  goToTop() {
    window.scrollTo(0, 0);
  }

  validate(data) {
    return validateAdhocData(data, this.getAcquireOptionConfig(), this.state.extractOptionConfig);
  }

  getAcquireOptionConfig() {

    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    if (this.state.execution.AcquireProgramKey) {
      const program = programOptions.find(option => option.value === this.state.execution.AcquireProgramKey);
      return program && program.options;
    }

    return [];
  }

  render() {

    const alerts = [];

    // Form submitted
    if (this.state.triggered) {
      if (this.state.executionUrl) {
        alerts.push(
          <Alert key={0} title="Adhoc Execution Triggered" type="success">
            <p>
              <a href={this.state.executionUrl}>Click here</a> to see the execution details
            </p>
          </Alert>
        );
      } else {
        alerts.push(
          <Alert key={1} title="Starting Adhoc Execution" type="success">
            <p>This may take a few moments...</p>
          </Alert>
        );
      }
    }

    // Form invalid
    if (!this.state.isFormValid) {
      alerts.push(
        <Alert key={2} title="Fields Missing" type="error">
          <p>One or more required fields were not entered.</p>
        </Alert>
      );
    }

    const execution = this.state.execution;

    // Acquire program dropdown options
    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    const extractOptions = this.state.extract.Options;

    return (
      <form onSubmit={this.handleSubmit}>

        { alerts }

        <div>
          <label>Program</label>
          <Select
            value={program}
            onChange={this.handleProgramChange}
            options={programOptions}
            className="titan-react-select"
          />
        </div>

        <DateField
          label="Load date"
          value={execution.ExecutionLoadDate}
          required={true}
          onChange={this.handleLoadDateChange}
          validate={!this.state.isFormValid}
          maxDate={moment().subtract(1, 'days')}
        />

        <TextField
          label="Client"
          name="ExecutionClientName"
          value={execution.ExecutionClientName}
          required={true}
          onChange={this.handleChange}
          validate={!this.state.isFormValid}
        />
        <TextField
          label="Data source"
          name="ExecutionDataSourceName"
          value={execution.ExecutionDataSourceName}
          required={true}
          onChange={this.handleChange}
          validate={!this.state.isFormValid}
        />
        <TextField
          label="Data set"
          name="ExecutionDataSetName"
          value={execution.ExecutionDataSetName}
          required={true}
          onChange={this.handleChange}
          validate={!this.state.isFormValid}
        />
        <TextField
          label="User"
          name="ExecutionUser"
          value={execution.ExecutionUser}
          required={true}
          onChange={this.handleChange}
          validate={!this.state.isFormValid}
        />

        <div className="form-section">
          <h6>Acquires</h6>
          {
            program
              ? <AcquireList
                  adhoc={true}
                  options={program.options}
                  acquires={this.state.acquires}
                  onChange={this.updateAcquires}
                  validate={!this.state.isFormValid}
                />
              : <p>No acquire program selected</p>
          }
        </div>
        <div className="form-section">
          <h6>Extract</h6>
          <ExtractForm
            destination={this.state.extract.ExtractDestination}
            onDestinationChange={this.updateExtractDestination}
            options={extractOptions}
            onOptionsChange={this.updateExtractOptions}
            validate={!this.state.isFormValid}
          />
        </div>
        <div>
          <input type="submit" value="Execute" />
        </div>
      </form>
    );
  }

}

export default AdhocForm;
