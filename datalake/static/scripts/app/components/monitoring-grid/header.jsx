import React from 'react';

class MonitoringGridHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  getDateCells() {
    let cells = [];
    let executions = this.props.data[0].executions;
    for (let i in executions) {
      let date = executions[i].date;
      let key = 'th-' + date;
      cells.push(<th key={key}>{date}</th>);
    } 
    return cells;
  }

  render() {

    const cells = this.props.data[0].executions.map((execution) => {
      return <th key={'th-' + execution.date}>{execution.date}</th>;
    });

    return (
      <thead>
        <tr>
          <th>Task</th>
          {cells}
        </tr>
      </thead>
    );
  }

}

export default MonitoringGridHeader;
