import React from 'react';
import ExecutionDetails from './execution/details.jsx';
import ExecutionAcquireDetails from './execution/acquire-details.jsx';
import ExecutionExtractDetails from './execution/extract-details.jsx';
import Ajax from '../utils/ajax';

class Execution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      execution: null,
      acquires: null,
      extract: null
    };
  }

  componentDidMount() {

    Ajax.fetch('/api/executions/' + this.props.executionKey)
      .then(res => res.json())
      .then(result => {
        const data = result.data;
        this.setState({
          loading: false,
          execution: data.execution,
          acquires: data.acquires,
          extract: data.extract
        });
      },
      (error) => {
        console.log('Unable to find information on excecution for task: ' + this.props.taskId);
      });
  }

  render() {

    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    // TODO components for extract

    const acquires = this.state.acquires.map(acquire => {
      return <ExecutionAcquireDetails key={acquire.AcquireKey} acquireKey={acquire.AcquireKey}
        startTime={acquire.StartTime} endTime={acquire.EndTime} status={acquire.AcquireStatus} />
    });

    return (
      <div>
        <ExecutionDetails execution={this.state.execution} />
        { acquires }
        <ExecutionExtractDetails extractKey={this.state.extract.ExtractKey} />
        <a href={`/schedules/${this.state.execution.ScheduledExecutionKey}`}>
          Go to schedule <span className="fas fa-angle-right" />
        </a>
      </div>
    );
  }

}

export default Execution;
