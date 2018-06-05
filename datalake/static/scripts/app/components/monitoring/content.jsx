import React from 'react';
import MonitoringGridRow from './row.jsx';

class MonitoringGridContent extends React.Component {

  render() {

    // TODO remove this object?

    return Object.keys(this.props.data).map((key) => {

      const datum = this.props.data[key];

      return <MonitoringGridRow key={key} name={key}
        data={datum} selectExecution={this.props.selectExecution} />;
    });
  }

}

export default MonitoringGridContent;
