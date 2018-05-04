import React from 'react';
import MonitoringGridRow from './row.jsx';

class MonitoringGridContents extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tbody>
        {
          this.props.data.map((datum) => {
            return <MonitoringGridRow key={'grid-row-' + datum.name} name={datum.name} data={datum.executions} />;
          })
        }
      </tbody>
    );
  }

}

export default MonitoringGridContents;
