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
    return (
      <thead>
        <tr>
          <th>Task</th>
          {this.getDateCells()}
        </tr>
      </thead>
    );
  }

}

export default MonitoringGridHeader;
