import React from 'react';

class MonitoringGridHeader extends React.Component {

  render() {

    const start = this.props.dates.start, end = this.props.dates.end;

    let cells = [], i = 1, temp = new Date(start);

    while (temp <= end) {
      temp.setDate(temp.getDate() + 1)
      let isoString = temp.toISOString().substr(0, 10);
      // TODO display in clearer format (dd-mm-yyyy?)
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
