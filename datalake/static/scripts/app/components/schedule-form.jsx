import React from 'react';
import ScheduleDays from './days/days.jsx';
import IntervalPicker from './interval-picker.jsx';
import AcquireList from './acquire-list/acquire-list.jsx';
import ExtractForm from './extract/extract-form.jsx';
import DatePicker from 'react-datepicker';
import Ajax from '../utils/ajax';
import dateUtils from '../utils/date-utils';
import moment from 'moment';

// react-datepicker stylesheet
require('react-datepicker/dist/react-datepicker.css');

require('./schedule-form.css');

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

        AcquireProgramKey: ''
      },

      days: {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true
      },
      extract: '',

      acquires: [],
      acquireProperties: ['property1', 'property2', 'property3'],

      extractDestination: '',
      extractFields: {
        'Extract field 1': '',
        'Extract field 2': '',
        'Extract field 3': ''
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
    this.updateDay = this.updateDay.bind(this);
    this.addAcquire = this.addAcquire.bind(this);
    this.removeAcquire = this.removeAcquire.bind(this);
    this.updateAcquireItem = this.updateAcquireItem.bind(this);
    this.selectExtractDestination = this.selectExtractDestination.bind(this);
    this.updateExtractField = this.updateExtractField.bind(this);
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
      .then(results => {

        const availablePrograms = results.data.map(program => {
          return {
            id: program.AcquireProgramKey,
            name: program.AcquireProgramFriendlyName,
            dataSource: program.AcquireProgramDataSource
          };
        });

        this.setState({
          availablePrograms: availablePrograms
        });
      })

    if (this.state.execution.ScheduledExecutionKey) {

      Ajax.fetch(`/api/schedules/${this.state.execution.ScheduledExecutionKey}`)
        .then(res => res.json())
        .then(result => {

          const execution = result.data.execution;

          // TODO Make this a method in dateUtils?
          execution.ScheduledExecutionNextScheduled = moment(new Date(execution.ScheduledExecutionNextScheduled));
          execution.ScheduledExecutionScheduleEnd = moment(new Date(execution.ScheduledExecutionScheduleEnd));
          execution.ScheduledExecutionNextLoadDate = moment(new Date(execution.ScheduledExecutionNextLoadDate));

          this.setState({
            execution: execution,
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
  onChangeProgram(event) {

    const program = Number(event.target.value);
    const dataSource = program
      ? this.state.availablePrograms.find((obj) => { return obj.id === program; }).dataSource
      : '';

    const execution = this.state.execution;
    execution.ScheduledExecutionDataSourceName = dataSource;

    this.setState({
      execution: execution,
      acquires: []
    });
    this.onExecutionChange(...arguments);
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

  updateDay(day, enabled) {
    const days = this.state.days;
    days[day] = enabled;
    this.setState({
      days: days
    });
  }

  addAcquire() {
    const acquires = this.state.acquires;
    acquires.push({
      fields: this.state.acquireProperties.reduce((obj, option) => { obj[option] = ''; return obj; }, {})
    });
    this.setState({
      acquires: acquires
    });
  }

  removeAcquire(index) {
    let acquires = this.state.acquires;
    acquires.splice(index, 1);
    this.setState({
      acquires: acquires
    });
  }

  updateAcquireItem(index, name, value) {
    const acquires = this.state.acquires;
    acquires[index].fields[name] = value;
    this.setState({
      acquires: acquires
    });
  }

  selectExtractDestination(destination) {
    this.setState({
      extractDestination: destination
    });
  }

  updateExtractField(name, value) {
    const extractFields = this.state.extractFields;
    extractFields[name] = value;
    this.setState({
      extractFields: extractFields
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

    // Acquire options
    const programOptions = this.state.availablePrograms.map(
      option => <option key={option.id} value={option.id}>{option.name}</option>
    );

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>

        { this.state.updated && <p>Schedule updated</p> }

        <h5>{ execution.ScheduledExecutionKey ? 'Update Schedule' : 'New Schedule' }</h5>

        <div>
          <label>Name</label>
          <input type="text" name="ScheduledExecutionName" value={execution.ScheduledExecutionName} onChange={this.onExecutionChange} />
        </div>
        <div>
          <label>Program</label>
          <select name="AcquireProgramKey" value={execution.AcquireProgramKey} onChange={this.onChangeProgram}>
            <option value=""></option>
            { programOptions }
          </select>
        </div>
        <div>
          <label>Next scheduled</label>
          <DatePicker selected={execution.ScheduledExecutionNextScheduled} dateFormat="DD/MM/YYYY" onChange={this.updateNextScheduled} />
        </div>
        <div>
          <label>Schedule end</label>
          <DatePicker selected={execution.ScheduledExecutionScheduleEnd} dateFormat="DD/MM/YYYY" onChange={this.updateScheduleEnd} />
        </div>
        <div>
          <label>Client</label>
          <input type="text" name="ScheduledExecutionClientName" value={execution.ScheduledExecutionClientName} onChange={this.onExecutionChange} />
        </div>
        <div>
          <label>Data source</label>
          <input type="text" name="ScheduledExecutionDataSourceName" value={execution.ScheduledExecutionDataSourceName} onChange={this.onExecutionChange} disabled={!!this.state.program} />
        </div>
        <div>
          <label>Data set</label>
          <input type="text" name="ScheduledExecutionDataSetName" value={execution.ScheduledExecutionDataSetName} onChange={this.onExecutionChange} />
        </div>
        <div>
          <label>Next load date</label>
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
          <ScheduleDays key="days" days={this.state.days} onChange={this.updateDay} />
        </div>
        <div className="form-section">
          <h6>Acquires</h6>
          {
            this.state.execution.AcquireProgramKey
              ? <AcquireList acquires={this.state.acquires} onAdd={this.addAcquire}
                  onRemove={this.removeAcquire} onItemChange={this.updateAcquireItem} />
              : <p>Select an acquire program</p>
          }
        </div>
        <div className="form-section">
          <h6>Extract</h6>
          <ExtractForm destination={this.state.extractDestination} selectDestination={this.selectExtractDestination}
            fields={this.state.extractFields} updateField={this.updateExtractField} />
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
