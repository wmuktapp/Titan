import React from 'react';
import MonitoringGridRow from './row.jsx';

class MonitoringGridContents extends React.Component {

  constructor(props) {
    super(props);
  }

  getRows() {
    let rows = [];
    for (let i in this.props.data) {
      let datum = this.props.data[i];
      rows.push(<MonitoringGridRow key={'grid-row-' + datum.name} name={datum.name} data={datum.executions} />)
    }
    return rows;
  }

  render() {
    return (
        <tbody>
          {this.getRows()}
        </tbody>
      );
  }

}

export default MonitoringGridContents;
