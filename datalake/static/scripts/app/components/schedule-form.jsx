import React from 'react';
import ScheduleDays from './days/days.jsx';
import IntervalPicker from './interval-picker.jsx';
import AcquireList from './acquire-list/acquire-list.jsx';
import ExtractForm from './extract/extract-form.jsx';
import Label from './label.jsx';
import Ajax from '../utils/ajax';
import DataUtils from '../utils/data-utils';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import moment from 'moment';

// Import styles
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

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
        ScheduledExecutionEnabled: true,

        ScheduledIntervalKey: null,
        ScheduledIntervalMI: 0,
        ScheduledIntervalHH: 0,
        ScheduledIntervalDD: 0,

        ScheduledMondayEnabled: false,
        ScheduledTuesdayEnabled: false,
        ScheduledWednesdayEnabled: false,
        ScheduledThursdayEnabled: false,
        ScheduledFridayEnabled: false,
        ScheduledSaturdayEnabled: false,
        ScheduledSundayEnabled: false,

        AcquireProgramKey: 0
      },

      acquires: [],
      extract: {
        ScheduledExtractKey: null,
        ScheduledExtractDestination: 0,
        Options: []
      },

      availablePrograms: [],

      loading: false
    };

    this.onExecutionChange = this.onExecutionChange.bind(this);
    this.onChangeProgram = this.onChangeProgram.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateNextScheduled = this.updateNextScheduled.bind(this);
    this.updateScheduleEnd = this.updateScheduleEnd.bind(this);
    this.updateNextLoadDate = this.updateNextLoadDate.bind(this);
    this.updateDays = this.updateDays.bind(this);
    this.updateAcquires = this.updateAcquires.bind(this);
    this.updateExtractDestination = this.updateExtractDestination.bind(this);
    this.updateExtractOptions = this.updateExtractOptions.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.executeNow = this.executeNow.bind(this);
  }

  componentDidMount() {

    this.setState({
      loading: true
    });

    // Get acquire prohrams
    Ajax.fetch('/api/acquire-programs')
      .then(res => res.json())
      .then(result => {
        this.setState({
          availablePrograms: result.data
        });
      });

    if (this.state.execution.ScheduledExecutionKey) {

      Ajax.fetch(`/api/schedules/${this.state.execution.ScheduledExecutionKey}`)
        .then(res => res.json())
        .then(result => {

          const execution = result.data.execution;

          // TODO Make this a method in DateUtils?
          execution.ScheduledExecutionNextScheduled = moment(new Date(execution.ScheduledExecutionNextScheduled));
          execution.ScheduledExecutionScheduleEnd = moment(new Date(execution.ScheduledExecutionScheduleEnd));
          execution.ScheduledExecutionNextLoadDate = moment(new Date(execution.ScheduledExecutionNextLoadDate));

          this.setState({
            execution: execution,
            acquires: result.data.acquires,
            extract: result.data.extract,
            loading: false
          });
        });
    }
  }

  onExecutionChange(event) {
    const target = event.target,
      name = target.name,
      value = target.value;

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

  updateInterval(days, hours, minutes) {

    const execution = this.state.execution;

    execution.ScheduledIntervalDD = days;
    execution.ScheduledIntervalHH = hours;
    execution.ScheduledIntervalMI = minutes;

    this.setState({
      execution: execution
    });
  }

  updateNextScheduled(value) {
    const execution = this.state.execution;
    execution.ScheduledExecutionNextScheduled = value;
    this.setState({
      execution: execution
    });
  }

  updateScheduleEnd(value) {
    const execution = this.state.execution;
    execution.ScheduledExecutionScheduleEnd = value;
    this.setState({
      execution: execution
    });
  }

  updateNextLoadDate(value) {
    const execution = this.state.execution;
    execution.ScheduledExecutionNextLoadDate = value;
    this.setState({
      execution: execution
    });
  }

  updateDays(days) {

    const execution = this.state.execution,
      executionDays = DataUtils.getExecutionDays(days);
    Object.assign(execution, executionDays);

    this.setState({ execution });
  }

  updateAcquires(acquires) {
    this.setState({
      acquires: acquires
    });
  }

  updateExtractDestination(destination, options) {
    const extract = this.state.extract;
    extract.ScheduledExtractDestination = destination;
    extract.Options = options;
    this.setState({
      extract: extract
    });
  }

  updateExtractOptions(options) {
    const extract = this.state.extract;
    extract.Options = options;
    this.setState({
      extract: extract
    });
  }

  onSubmit(event) {

    // Send insert/update to server
    Ajax.fetch('/api/schedules', {
      method: 'POST',
      data: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(response => {

        const execution = this.state.execution;
        execution.ScheduledExecutionKey = execution.ScheduledExecutionKey || response.ScheduledExecutionKey;

        this.setState({
          execution: execution,
          updated: true
        });
      });

    event.preventDefault();
  }

  executeNow() {

    // TODO
    // Dialog about unsaved values?

    // Redirect to adhoc form, pre-populated
    window.location.href = `/adhoc?schedule=${this.state.execution.ScheduledExecutionKey}`;
  }

  render() {

    // NOTE: Handles both insert and update

    const execution = this.state.execution;

    // Simpler days object
    const days = DataUtils.getWeekDays(execution);

    // Acquire program dropdown options
    const programOptions = DataUtils.getAcquireProgramOptions(this.state.availablePrograms);

    const program = programOptions.find(option => option.value === execution.AcquireProgramKey);

    const extractOptions = this.state.extract.Options;

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>

        { this.state.updated && <p>Schedule updated</p> }

        <h5>{ execution.ScheduledExecutionKey ? 'Update Schedule' : 'New Schedule' }</h5>

        <div>
          <Label required={true}>Name</Label>
          <input type="text" name="ScheduledExecutionName" value={execution.ScheduledExecutionName} onChange={this.onExecutionChange} />
        </div>
        <div>
          <Label>Program</Label>
          <Select
            value={program}
            onChange={this.onChangeProgram}
            options={programOptions}
            className="titan-react-select"
          />
        </div>
        <div>
          <Label>Next scheduled</Label>
          <DatePicker selected={execution.ScheduledExecutionNextScheduled} dateFormat="DD/MM/YYYY" onChange={this.updateNextScheduled} />
        </div>
        <div>
          <Label>Schedule end</Label>
          <DatePicker selected={execution.ScheduledExecutionScheduleEnd} dateFormat="DD/MM/YYYY" onChange={this.updateScheduleEnd} />
        </div>
        <div>
          <Label>Client</Label>
          <input type="text" name="ScheduledExecutionClientName" value={execution.ScheduledExecutionClientName} onChange={this.onExecutionChange} />
        </div>
        <div>
          <Label>Data source</Label>
          <input type="text" name="ScheduledExecutionDataSourceName" value={execution.ScheduledExecutionDataSourceName} onChange={this.onExecutionChange} disabled={!!this.state.program} />
        </div>
        <div>
          <Label>Data set</Label>
          <input type="text" name="ScheduledExecutionDataSetName" value={execution.ScheduledExecutionDataSetName} onChange={this.onExecutionChange} />
        </div>
        <div>
          <Label>Next load date</Label>
          <DatePicker selected={execution.ScheduledExecutionNextLoadDate} dateFormat="DD/MM/YYYY" onChange={this.updateNextLoadDate} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="ScheduledExecutionEnabled" checked={this.ScheduledExecutionEnabled} onChange={this.onExecutionChange} />
            <span className="label-body">Enabled</span>
          </label>
        </div>
        <div className="form-section">
          <h6>Interval</h6>
          <IntervalPicker days={execution.ScheduledIntervalDD} hours={execution.ScheduledIntervalHH}
            minutes={execution.ScheduledIntervalMI} onUpdate={this.updateInterval} />
        </div>
        <div className="form-section">
          <h6>Days</h6>
          <ScheduleDays key="days" days={days} onChange={this.updateDays} />
        </div>
        <div className="form-section">
          <h6>Acquires</h6>
          {
            program
              ? <AcquireList
                  options={program.options}
                  acquires={this.state.acquires}
                  onChange={this.updateAcquires}
                />
              : <p>No acquire program selected</p>
          }
        </div>
        <div className="form-section">
          <h6>Extract</h6>
          {
            program
              ? <ExtractForm
                  destination={this.state.extract.ScheduledExtractDestination}
                  onDestinationChange={this.updateExtractDestination}
                  options={extractOptions}
                  onOptionsChange={this.updateExtractOptions}
                />
              : <p className="empty-msg">No acquire program selected</p>
          }
        </div>

        <div>
          <input type="submit" value={ execution.ScheduledExecutionKey ? 'Update' : 'Create' } />
          <button onClick={this.executeNow} className="btn-now">
            Execute now
            <span className="fas fa-angle-right btn-now-icon" />
          </button>
        </div>

      </form>
    );
  }

}

export default ScheduleForm;
