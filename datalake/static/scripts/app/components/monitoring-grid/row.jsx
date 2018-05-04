import React from 'react';
import MonitoringGridLabel from './label.jsx';
import MonitoringGridExecution from './execution.jsx';

class MonitoringGridRow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const cells = this.props.data.map((datum, index) => {
      return (
        <td key={'grid-execution-' + this.props.name + '-' + index}>
          <MonitoringGridExecution data={datum} />
        </td>
      );
    });

    return (
      <tr>
        <td>
          <MonitoringGridLabel label={this.props.name} />
        </td>
        {cells}
      </tr>
    );
  }

}

export default MonitoringGridRow;
