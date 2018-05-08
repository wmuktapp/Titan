import React from 'react';
import MonitoringGridRow from './row.jsx';

class MonitoringGridContent extends React.Component {

  render() {

    // Table contents
    const contents = this.props.data.map((datum, index) => {
          return <MonitoringGridRow key={'grid-row-' + index} name={datum.name} data={datum.executions} />;
        })
    
    // Loading row
    const loadingRow = this.props.loading
        ? <tr><td className="monitoring-grid-loading" colSpan="6">Loading data...</td></tr>
        : [];

    return (
      <tbody>
        {contents}
        {loadingRow}
      </tbody>
    );
  }

}

export default MonitoringGridContent;
