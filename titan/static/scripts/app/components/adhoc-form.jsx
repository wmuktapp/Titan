import React from 'react';
import DatePicker from 'react-datepicker'; // REMOVE?
import DateField from './form-field/date-field.jsx';
import TextField from './form-field/text-field.jsx';
import AcquireList from './acquire-list/acquire-list.jsx';
import ExtractForm from './extract/extract-form.jsx';
import Alert from './alert/alert.jsx';
import Ajax from '../utils/ajax';
import moment from 'moment';  // REMOVE?
import Select from 'react-select';

import { getAcquireProgramOptions, getExecutionData } from '../utils/data-utils';

// Import styles
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-overrides.css';

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
      acquires: [], // TODO make sure properties are appropriately named for adhoc execution
      extract: {
        ScheduledExtractDestination: null,  // TODO rename
        Options: []
      },

      schedule: props.schedule,
      availablePrograms: [],

      submitted: false
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

          const execution = result.data.execution;

          // results.loadDate = moment(new Date(results.data.loadDate));
          execution.ScheduledExecutionNextScheduled = moment(new Date(execution.ScheduledExecutionNextScheduled));
          execution.ScheduledExecutionScheduleEnd = moment(new Date(execution.ScheduledExecutionScheduleEnd));
          execution.ScheduledExecutionNextLoadDate = moment(new Date(execution.ScheduledExecutionNextLoadDate));

          this.setState({
            execution: execution,
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
  handleLoadDateChange(date) {

    const execution = this.state.execution;
    execution.ScheduledExecutionNextLoadDate = date;
    this.setState({ execution });
  }

  updateAcquires(acquires) {
    this.setState({ acquires });
  }

  onUpdateExtractDestination(destination, options) {
    const extract = this.state.extract;
    extract.ScheduledExtractDestination = destination;
    extract.Options = options;
    this.setState({ extract });
  }

  onUpdateExtractOptions(options) {
    const extract = this.state.extract;
    extract.Options = options;
    this.setState({ extract });
  }

  handleSubmit(event) {

    this.setState({
      submitted: true
    });

    const data = getExecutionData(this.state);

    Ajax.fetch('/api/executions/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log('execution successful!');
      });

    event.preventDefault();
  }

  render() {

    const execution = this.state.execution;

    // Acquire program dropdown options
    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    const extractOptions = this.state.extract.Options;

    // TODO calculate whether to show Execute button based on other values

    if (this.state.submitted) {
      // TODO update this to contain status of execution (requires result from server)
      return (
        <Alert title="Execution Triggered" type="success">
          <p>Adhoc execution triggered</p>
        </Alert>
      );
    }

    // TODO validation

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

        <DateField
          label="Load data"
          value={execution.ExecutionLoadDate}
          required={true}
          onChange={this.handleLoadDateChange}
        />

        <div>
          <label>Client</label>
          <input type="text" name="ExecutionClientName" value={execution.ExecutionClientName} onChange={this.handleChange} />
        </div>
        <div>
          <label>Data source</label>
          <input type="text" name="ExecutionDataSourceName" value={execution.ExecutionDataSourceName} onChange={this.handleChange} disabled={!!program} />
        </div>
        <div>
          <label>Data set</label>
          <input type="text" name="ExecutionDataSetName" value={execution.ScheduledExecutionDataSetName} onChange={this.handleChange} />
        </div>
        <div>
          <label>User</label>
          <input type="text" name="ExecutionUser" value={execution.ExecutionUser} onChange={this.handleChange} />
        </div>
        <div className="form-section">
          <h6>Acquires</h6>
          {
            program
              ? <AcquireList
                  options={program.options}
                  acquires={this.state.acquires}
                  onChange={this.updateAcquires} />
              : <p>No acquire program selected</p>
          }
        </div>
        <div className="form-section">
          <h6>Extract</h6>
          <ExtractForm
            destination={this.state.extract.ScheduledExtractDestination}
            onDestinationChange={this.onUpdateExtractDestination}
            options={extractOptions}
            onOptionsChange={this.onUpdateExtractOptions}
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
