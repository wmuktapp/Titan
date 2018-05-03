import React from 'react';
import TabCollection from './tab-collection.jsx';
import AdHocForm from './ad-hoc-form.jsx';
import ConfigForm from './config-form.jsx';
import MonitoringGrid from './monitoring-grid/grid.jsx';

class DataLakeConsole extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'monitoring'
    };

    this.selectSection = this.selectSection.bind(this);
  }

  selectSection(tab) {
    this.setState({
      tab: tab
    });
  }

  renderChosenSection() {
    if (this.state.tab === 'monitoring') {
      return <MonitoringGrid />;
    } else if (this.state.tab === 'config') {
      return <ConfigForm />;
    } else if (this.state.tab === 'adhoc') {
      return <AdHocForm />;
    }
    return <p>Select a tab</p>;
  }

  render() {
    return (
      <div>
        <TabCollection selectedTab={this.state.tab} onSelectTab={this.selectSection} />
        <div>
          {this.renderChosenSection()}
        </div>
      </div>
    );
  }

}

export default DataLakeConsole;