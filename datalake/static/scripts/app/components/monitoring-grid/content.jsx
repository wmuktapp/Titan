import React from 'react';
import MonitoringGridRow from './row.jsx';

class MonitoringGridContent extends React.Component {

  render() {

    const contents = this.props.loading
      ? <tr><td>Loading data...</td></tr>
      : this.props.data.map((datum) => {
          return <MonitoringGridRow key={'grid-row-' + datum.name} name={datum.name} data={datum.executions} />;
        });

    return (
      <tbody>
        {contents}
      </tbody>
    );
  }

}

export default MonitoringGridContent;
