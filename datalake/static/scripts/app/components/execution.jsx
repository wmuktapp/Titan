import React from 'react';
import ExecutionDetails from './execution/details.jsx';
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

    // TODO components for acquires and extract

    return (
      <div>
        <ExecutionDetails execution={this.state.execution} />
        <a href={`/schedules/${this.state.execution.ScheduledExecutionKey}`}>
          Go to schedule <span className="fas fa-angle-right" />
        </a>
      </div>
    );
  }

}

export default Execution;
