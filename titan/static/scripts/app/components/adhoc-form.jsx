import React from 'react';
import DateField from './form-field/date-field.jsx';
import TextField from './form-field/text-field.jsx';
import AcquireList from './acquire-list/acquire-list.jsx';
import ExtractForm from './extract/extract-form.jsx';
import Alert from './alert/alert.jsx';
import Ajax from '../utils/ajax';
import Select from 'react-select';

import { getAcquireProgramOptions, getAdhocExecutionData } from '../utils/data-utils';

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

      acquiresValid: false,
      extractValid: false,
      showInvalid: false,
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
  // TODO only permit dates in the past
  handleLoadDateChange(name, date) {
    const execution = this.state.execution;
    execution.ExecutionLoadDate = date;
    this.setState({ execution });
  }

  updateAcquires(acquires, isInvalid) {
    this.setState({
      acquires: acquires,
      acquiresInvalid: isInvalid
    });
  }

  onUpdateExtractDestination(destination, options, isValid) {
    const extract = this.state.extract;
    extract.ExtractDestination = destination;
    extract.Options = options;
    this.setState({
      extract: extract,
      extractValid: isValid
    });
  }

  onUpdateExtractOptions(options, isValid) {
    const extract = this.state.extract;
    extract.Options = options;
    this.setState({
      extract: extract,
      extractValid: isValid
    });
  }

  handleSubmit(event) {

    event.preventDefault();

    if (!this.validate()) {
      this.setState({
        showInvalid: true
      });
      return;
    }

    this.setState({
      triggered: true
    });

    const data = getAdhocExecutionData(this.state);

    console.log(data)

    Ajax.fetch('/api/executions/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log('execution successful!');
      });

  }

  validate() {

    if (this.state.acquiresValid || this.state.executionValid) {
      return false;
    }

    const requiredFields = [
      'ExecutionClientName',
      'ExecutionDataSourceName',
      'ExecutionDataSetName',
      'ExecutionLoadDate',
      'ExecutionUser'
    ];

    // Validate execution
    
    for (let field of requiredFields) {
      if (!this.state.execution[field].trim()) {
        return false;
      }
    }

    return true; 
  }

  render() {

    const execution = this.state.execution;

    // Acquire program dropdown options
    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    const extractOptions = this.state.extract.Options;

    const validate = this.state.showInvalid;

    // TODO calculate whether to show Execute button based on other values

    // TODO validation

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
          validate={validate}
        />

        <TextField
          label="Client"
          name="ExecutionClientName"
          value={execution.ExecutionClientName}
          required={true}
          onChange={this.handleChange}
          validate={validate}
        />
        <TextField
          label="Data source"
          name="ExecutionDataSourceName"
          value={execution.ExecutionDataSourceName}
          required={true}
          onChange={this.handleChange}
          validate={validate}
        />
        <TextField
          label="Data set"
          name="ExecutionDataSetName"
          value={execution.ExecutionDataSetName}
          required={true}
          onChange={this.handleChange}
          validate={validate}
        />
        <TextField
          label="User"
          name="ExecutionUser"
          value={execution.ExecutionUser}
          required={true}
          onChange={this.handleChange}
          validate={validate}
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
                  showInvalid={validate}
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
            validate={validate}
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
