import React from 'react';
import MonitoringGridLabel from './label.jsx';
import MonitoringGridExecution from './execution.jsx';
import dateUtils from '../../utils/date-utils';

require('./row.css');

class MonitoringGridRow extends React.Component {

  render() {

    const select = this.props.selectExecution;

    const cells = this.props.data.map((datum, index) => {

      const id = datum.id;
      const date = new Date(datum.date);
      const className = dateUtils.isToday(date) ? 'cell-today' : '';

      return (
        <td key={index} className={className}>
          <MonitoringGridExecution data={datum} select={select} taskId={id} date={date} />
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
