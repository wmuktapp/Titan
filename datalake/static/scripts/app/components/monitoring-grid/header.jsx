import React from 'react';

class MonitoringGridHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let cells = [];
    const days = (this.props.end - this.props.start) / (24 * 60 * 60 * 1000) + 1;

    for (let i = 0; i < days; i++) {
      // TODO fix this as the date is not updated
      let temp = new Date(this.props.start + days * (24 * 60 * 60 * 1000));
      let isoString = temp.toISOString().substr(0, 10);
      // TODO display in clearer format
      cells.push(<th key={'th-' + isoString + '-' + i}>{isoString}</th>);
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
