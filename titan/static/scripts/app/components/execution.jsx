import React from 'react';
import ExecutionDetails from './execution/details.jsx';
import ExecutionAcquireDetails from './execution/acquire-details.jsx';
import ExecutionExtractDetails from './execution/extract-details.jsx';
import ExecutionHistory from './execution-history/index.jsx';
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
      history: {}
    };
    this.selectAnotherVersion = this.selectAnotherVersion.bind(this);
  }

  componentDidMount() {
    this.getData(this.props.executionKey);
  }

  selectAnotherVersion(version) {

    const key = version ? version.value : this.props.executionKey;

    this.setState({
      key: key
    });

    // NOTE: State not updated yet
    this.getData(key);
  }

  getData(key) {

    this.setState({
      loading: true
    });

    Ajax.fetch('/api/executions/' + key)
      .then(res => res.json())
      .then(result => {
        const data = result.data;
        this.setState({
          loading: false,
          execution: data.execution,
          acquires: data.acquires,
          extract: data.extract,
          history: result.other_versions
        });
      },
      (error) => {
        console.log('Unable to find information on excecution: ' + this.props.executionKey);
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
          this.state.loading
            ? <p className="execution-loading">Loading...</p>
            : <div>
                <ExecutionDetails execution={this.state.execution} />
                  <section className="form-section">
                    <h6>Acquires</h6>
                    { acquires }
                  </section>
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
