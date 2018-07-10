import React from 'react';
import Select from 'react-select';
import Alert from './alert/alert.jsx';
import RepeatForm from './repeat-form/index.jsx';
import AcquireList from './acquire-list/index.jsx';
import ExtractForm from './extract/extract-form.jsx';
import TextField from './form-field/text-field.jsx';
import DateField from './form-field/date-field.jsx';
import Label from './label.jsx';

import {
  createBlankIntervalDays,
  createInterval,
  getAcquireProgramOptions,
  getExecutionData,
  getWeekDays,
  getExecutionDays
} from '../utils/data-utils';
import {
  fetchSchedule,
  fetchAcquires,
  insertOrUpdateSchedule
} from '../services/data';
import { validateScheduleData } from '../utils/validation';

// Import styles
import 'react-select/dist/react-select.css';
import './schedule-form.css';

class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      execution: {
        ScheduledExecutionKey: this.props.id,
        ScheduledExecutionName: '',
        ScheduledExecutionNextScheduled: null,
        ScheduledExecutionScheduleEnd: null,
        ScheduledExecutionClientName: '',
        ScheduledExecutionDataSourceName: '',
        ScheduledExecutionDataSetName: '',
        ScheduledExecutionNextLoadDate: null,
        ScheduledExecutionUser: '',
        ScheduledExecutionEnabled: false,
        AcquireProgramKey: 0
      },

      acquires: [],
      extract: {
        ScheduledExtractDestination: '',
        Options: []
      },

      availablePrograms: [],
      extractOptionConfig: [],

      includeRepeat: false,

      hasDataError: false,

      scheduleAddedOrUpdated: false,
      isFormValid: true
    };

    this.onExecutionChange = this.onExecutionChange.bind(this);
    this.onChangeProgram = this.onChangeProgram.bind(this);
    this.addRepeat = this.addRepeat.bind(this);
    this.removeRepeat = this.removeRepeat.bind(this);
    this.updateRepeat = this.updateRepeat.bind(this);
    this.updateDateField = this.updateDateField.bind(this);
    this.updateAcquires = this.updateAcquires.bind(this);
    this.updateExtractDestination = this.updateExtractDestination.bind(this);
    this.updateExtractOptions = this.updateExtractOptions.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.executeNow = this.executeNow.bind(this);
  }

  componentDidMount() {

    // Get acquire programs from data service
    fetchAcquires(result => {
      this.setState({
        availablePrograms: result.data
      });
    });

    if (this.state.execution.ScheduledExecutionKey) {

      // Get schedule data from data service
      fetchSchedule(
        this.state.execution.ScheduledExecutionKey,
        result => {
          this.setState({
            execution: result.data.execution,
            acquires: result.data.acquires,
            extract: result.data.extract,
            includeRepeat: this.shouldIncludeRepeat(result.data.execution),
            hasDataError: false
          });
        }, error => {
          this.setState({
            hasDataError: true
          });
        });
    }
  }

  onExecutionChange(event) {

    const target = event.target,
      name = target.name,
      value = target.hasOwnProperty('checked') ? target.checked : target.value;

    const execution = this.state.execution;
    execution[name] = value;

    this.setState({
      execution: execution
    });
  }

  // Special case for program
  onChangeProgram(program) {

    const execution = this.state.execution;
    execution.AcquireProgramKey = program ? program.value : 0;
    execution.ScheduledExecutionDataSourceName = program ? program.dataSource : '';

    this.setState({
      execution: execution,
      acquires: []
    });
  }

  shouldIncludeRepeat(execution) {
    return execution.ScheduledIntervalDD
        + execution.ScheduledIntervalHH
        + execution.ScheduledIntervalMI
      > 0;
  }

  addRepeat() {

    // Add default interval and day values to this.state
    const execution = Object.assign(
      this.state.execution, createInterval(0, 0, 0), createBlankIntervalDays()
    );

    this.setState({
      execution: execution,
      includeRepeat: true
    });
  }

  removeRepeat() {

    // Set interval values to zero (they'll be cleared in DataUtils later)
    const execution = this.state.execution;
    Object.assign(execution, createInterval(0, 0, 0));

    this.setState({
      execution: execution,
      includeRepeat: false
    });
  }

  updateRepeat(repeat) {

    const execution = this.state.execution;

    Object.assign(
      execution,
      // Update interval
      createInterval(repeat.interval.days, repeat.interval.hours, repeat.interval.minutes),
      // Update days
      getExecutionDays(repeat.days)
    );

    // Update state
    this.setState({ execution });
  }

  // Different method for date fields
  updateDateField(name, value) {
    const execution = this.state.execution;
    execution[name] = value;
    this.setState({ execution });
  }

  updateAcquires(acquires, valid) {
    this.setState({
      acquires: acquires,
    });
  }

  updateExtractDestination(destination, options, optionConfig) {
    const extract = this.state.extract;
    extract.ScheduledExtractDestination = destination;
    extract.Options = options;
    this.setState({
      extract: extract,
      extractOptionConfig: optionConfig      
    });
  }

  updateExtractOptions(options, optionConfig) {
    const extract = this.state.extract;
    extract.Options = options;
    this.setState({
      extract: extract,
      extractOptionConfig: optionConfig || this.state.extractOptionConfig
    });
  }

  onSubmit(event) {

    event.preventDefault();

    // Validate fields
    if (!this.validateFields()) {
      this.goToTop();
      return;
    }

    // Format data for API
    const data = getExecutionData(this.state);

    // Send insert/update to server via data service
    insertOrUpdateSchedule(
      data,
      this.state.execution.ScheduledExecutionKey,
      result => {

      const execution = this.state.execution;
      execution.ScheduledExecutionKey = execution.ScheduledExecutionKey || result.ScheduledExecutionKey;

      this.setState({
        execution: execution,
        scheduleAddedOrUpdated: true
      });
    });

    this.goToTop();
  }

  goToTop() {
    window.scrollTo(0, 0);
  }

  validateFields() {

    const isFormValid = validateScheduleData(
      this.state,
      this.getAcquireOptionConfig(),
      this.state.extractOptionConfig
    );

    this.setState({
      isFormValid: isFormValid
    });

    return isFormValid;
  }

  getAcquireOptionConfig() {

    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    if (this.state.execution.AcquireProgramKey) {
      const program = programOptions.find(option => option.value === this.state.execution.AcquireProgramKey);
      return program && program.options;
    }

    return [];
  }

  executeNow() {

    // TODO
    // Dialog about unsaved values?

    // Redirect to adhoc form, pre-populated
    window.location.href = `/adhoc?schedule=${this.state.execution.ScheduledExecutionKey}`;
  }

  render() {

    if (this.state.hasDataError) {
      return (
        <Alert title="Unable to retrieve data" type="error" canDismiss={false}>
          <p>We were unable to pull any data from the server.  Refresh the page to try again.</p>
        </Alert>
      );
    }

    // NOTE: Handles both insert and update

    const execution = this.state.execution;

    // Repeat object
    const repeat = {
      interval: {
        days: execution.ScheduledIntervalDD,
        hours: execution.ScheduledIntervalHH,
        minutes: execution.ScheduledIntervalMI
      },
      days: getWeekDays(execution)
    };

    // Acquire program dropdown options
    const programOptions = getAcquireProgramOptions(this.state.availablePrograms);

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>

        {
          this.state.scheduleAddedOrUpdated &&
            <p>
              {
                this.props.id
                  ? 'Schedule updated'
                  : 'Schedule added'
              }
            </p>
        }

        <h5>{ execution.ScheduledExecutionKey ? 'Update Schedule' : 'New Schedule' }</h5>

        {
          !this.state.isFormValid &&
            <Alert title="Fields Missing" type="error">
              <p>One or more required fields were not entered.</p>
            </Alert>
        }

        <TextField
          label="Name"
          name="ScheduledExecutionName"
          value={execution.ScheduledExecutionName}
          required={true}
          validate={!this.state.isFormValid}
          onChange={this.onExecutionChange}
        />

        <div>
          <Label>Program</Label>
          <Select
            value={program}
            onChange={this.onChangeProgram}
            options={programOptions}
            className="titan-react-select"
          />
        </div>

        <DateField
          label="Next scheduled"
          name="ScheduledExecutionNextScheduled"
          value={execution.ScheduledExecutionNextScheduled}
          validate={!this.state.isFormValid}
          onChange={this.updateDateField}
          includeTime={true}
        />

        <DateField
          label="Schedule end"
          name="ScheduledExecutionScheduleEnd"
          value={execution.ScheduledExecutionScheduleEnd}
          validate={!this.state.isFormValid}
          onChange={this.updateDateField}
          includeTime={true}
        />

        <TextField
          label="Client"
          name="ScheduledExecutionClientName"
          value={execution.ScheduledExecutionClientName}
          required={true}
          validate={!this.state.isFormValid}
          onChange={this.onExecutionChange}
        />

        <TextField
          label="Data source"
          name="ScheduledExecutionDataSourceName"
          value={execution.ScheduledExecutionDataSourceName}
          required={true}
          validate={!this.state.isFormValid}
          disabled={!!program}
          onChange={this.onExecutionChange}
        />

        <TextField
          label="Data set"
          name="ScheduledExecutionDataSetName"
          value={execution.ScheduledExecutionDataSetName}
          required={true}
          validate={!this.state.isFormValid}
          onChange={this.onExecutionChange}
        />

        <DateField
          label="Next load date"
          name="ScheduledExecutionNextLoadDate"
          value={execution.ScheduledExecutionNextLoadDate}
          required={true}
          validate={!this.state.isFormValid}
          onChange={this.updateDateField}
        />

        <TextField
          label="User"
          name="ScheduledExecutionUser"
          value={execution.ScheduledExecutionUser}
          required={true}
          validate={!this.state.isFormValid}
          onChange={this.onExecutionChange}
        />

        <div className="form-checkbox-field">
          <label>
            <input type="checkbox" name="ScheduledExecutionEnabled" checked={execution.ScheduledExecutionEnabled} onChange={this.onExecutionChange} />
            <span className="label-body">Enabled</span>
          </label>
        </div>

        <div className="form-section">
          <RepeatForm
            value={repeat}
            includeRepeat={this.state.includeRepeat}
            onAddRepeat={this.addRepeat}
            onRemoveRepeat={this.removeRepeat}
            onChange={this.updateRepeat}
          />
        </div>

        <div className="form-section">
          <h6>Acquires</h6>
          {
            program
              ? <AcquireList
                  acquires={this.state.acquires}
                  options={program.options}
                  onChange={this.updateAcquires}
                  validate={!this.state.isFormValid}
                />
              : <p>No acquire program selected</p>
          }
        </div>
        <div className="form-section">
          <h6>Extract</h6>
          <ExtractForm
            destination={this.state.extract.ScheduledExtractDestination}
            onDestinationChange={this.updateExtractDestination}
            options={this.state.extract.Options}
            onOptionsChange={this.updateExtractOptions}
            validate={!this.state.isFormValid}
          />
        </div>

        <div>
          <input type="submit" value={ execution.ScheduledExecutionKey ? 'Update' : 'Create' } />
          {
            this.props.id &&
              <button onClick={this.executeNow} className="btn-now">
                Execute now
                <span className="fas fa-angle-right btn-now-icon" />
              </button>
          }
        </div>

      </form>
    );
  }

}

export default ScheduleForm;
