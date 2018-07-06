import React from 'react';
import ExecutionDetails from './execution/details.jsx';
import ExecutionAcquireDetails from './execution/acquire-details.jsx';
import ExecutionExtractDetails from './execution/extract-details.jsx';
import ExecutionHistory from './execution-history/index.jsx';
import Alert from './alert/alert.jsx';
import Ajax from '../utils/ajax';

import './execution.css';

class Execution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: this.props.executionKey,
      loading: true,
      execution: null,
      acquires: [],
      extract: null,
      history: {},
      hasDataError: false
    };
    this.selectAnotherVersion = this.selectAnotherVersion.bind(this);
  }

  componentDidMount() {
    this.getData(this.props.executionKey);
  }

  componentWillUnmount() {
    this.clearReload();
  }

  executionIsRunning() {
    return this.state.execution
      && this.state.execution.ExecutionStatus.toUpperCase() === 'RUNNING';
  }

  // Automatically reload data every ten seconds, if this task is still running
  setupReload() {
    if (this.executionIsRunning() && !this.timerId) {
      this.timerId = setInterval(
        () => this.doReload(),
        10000
      );
    }
  }

  doReload() {
    // Only reload if this is a running execution
    if (this.executionIsRunning()) {
      this.getData(this.state.key, true);
    }
    else {
      this.clearReload();
    }
  }

  // Cleanup
  clearReload() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  selectAnotherVersion(version) {

    const key = version ? version.value : this.props.executionKey;

    this.setState({
      key: key
    });

    // NOTE: State not updated yet
    this.getData(key);

    // Update URL
    history.pushState({}, null, `/monitoring/executions/${key}`);
  }

  getData(key, doSilently) {

    if (!doSilently) {
      this.setState({
        loading: true
      });
    }

    Ajax.fetch('/api/executions/' + key)
      .then(res => res.json())
      .then(result => {
        const data = result.data;
        this.setState({
          loading: false,
          execution: data.execution,
          acquires: data.acquires,
          extract: data.extract,
          history: result.other_versions,
          hasDataError: false
        });

        // Set up polling of the server
        this.setupReload();

      }, error => {
        this.setState({
          hasDataError: true
        })
      });
  }

  render() {



    const acquires = this.state.acquires.map(
      acquire => <ExecutionAcquireDetails key={acquire.AcquireKey} acquire={acquire} />
    );

    return (
      <div className="execution">

        <section className="controls u-cf">
          <a href="/monitoring">
            <span className="fas fa-angle-left" /> Back to Monitoring
          </a>
          <div className="execution-control-additional">
            <ExecutionHistory versions={this.state.history} onChange={this.selectAnotherVersion} />
          </div>
        </section>

        {
          this.state.hasDataError &&
            <Alert title="Unable to retrieve data" type="error" canDismiss={false}>
              <p>An error occurred when retrieving data for execution with ID {this.props.executionKey}.  Refresh the page to try again.</p>
            </Alert>
        }

        {
          this.state.loading
            ? <p className="execution-loading">Loading...</p>
            : <div>
                <ExecutionDetails execution={this.state.execution} />
                  {
                    !!this.state.acquires.length &&
                      <section className="form-section">
                        <h6>Acquires</h6>
                        { acquires }
                      </section>
                  }
                  {
                    this.state.extract.ExtractKey &&
                      <section className="form-section">
                        <h6>Extract</h6>
                        <ExecutionExtractDetails extract={this.state.extract} />
                      </section>
                  }
                  {
                    this.state.execution.ScheduledExecutionKey &&
                      <section className="form-section">
                        <a href={`/schedules/${this.state.execution.ScheduledExecutionKey}`}>
                          Go to schedule <span className="fas fa-angle-right" />
                        </a>
                      </section>
                  }
              </div>
        }
        
      </div>
    );
  }

}

export default Execution;
