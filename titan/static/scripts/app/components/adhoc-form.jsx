import React from 'react';
import Select from 'react-select';
import DateField from './form-field/date-field.jsx';
import TextField from './form-field/text-field.jsx';
import AcquireList from './acquire-list/acquire-list.jsx';
import ExtractForm from './extract/extract-form.jsx';
import Alert from './alert/alert.jsx';
import Ajax from '../utils/ajax';

import { getAcquireProgramOptions, getAdhocExecutionData } from '../utils/data-utils';
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

      isFormValid: true,
      triggered: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleProgramChange = this.handleProgramChange.bind(this);
    this.handleLoadDateChange = this.handleLoadDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateAcquires = this.updateAcquires.bind(this);
    this.onUpdateExtractDestination = this.onUpdateExtractDestination.bind(this);
    this.onUpdateExtractOptions = this.onUpdateExtractOptions.bind(this);
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

          // TODO ensure data is in the right format

          this.setState({
            execution: result.data.execution,
            acquires: result.data.acquires,
            extract: result.data.extract
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
  // TODO only permit dates in the past?
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

  onUpdateExtractDestination(destination, options) {
    const extract = this.state.extract;
    extract.ExtractDestination = destination;
    extract.Options = options;
    this.setState({
      extract: extract
    });
  }

  onUpdateExtractOptions(options) {
    const extract = this.state.extract;
    extract.Options = options;
    this.setState({
      extract: extract
    });
  }

  handleSubmit(event) {

    event.preventDefault();

    // Convert into adhoc format
    const data = getAdhocExecutionData(this.state);

    if (!this.validate(data.data)) {
      // TODO scroll to top
      return;
    }

    this.setState({
      triggered: true
    });

    Ajax.fetch('/api/executions/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log('execution successful!');
      });
  }

  validate(data) {

    // TODO acquire options, extract options
    const isFormValid = validateAdhocData(data);

    this.setState({ isFormValid });

    return isFormValid;
  }

  render() {

    const execution = this.state.execution;

    // Acquire program dropdown options
    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    const extractOptions = this.state.extract.Options;

    return (
      <form onSubmit={this.handleSubmit}>
        {
          this.state.triggered &&
            <Alert title="Adhoc Execution Triggered" type="success">
              <p>The execution may take a few minutes to start.  Please check the monitoring page periodically.</p>
            </Alert>
        }
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
            onDestinationChange={this.onUpdateExtractDestination}
            options={extractOptions}
            onOptionsChange={this.onUpdateExtractOptions}
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
