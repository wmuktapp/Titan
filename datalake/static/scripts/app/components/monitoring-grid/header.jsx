import React from 'react';

class MonitoringGridHeader extends React.Component {

  render() {

    let cells = [], i = 1, temp = new Date(this.props.start);

    while (temp <= this.props.end) {
      temp.setDate(temp.getDate() + 1)
      let isoString = temp.toISOString().substr(0, 10);
      // TODO display in clearer format (dd-mm-yyyy)
      cells.push(<th key={'th-' + isoString + '-' + i++}>{isoString}</th>);
    }

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
