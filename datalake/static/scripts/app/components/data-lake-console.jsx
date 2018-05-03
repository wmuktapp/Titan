import React from 'react';
import TabCollection from './tab-collection.jsx';

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
      return <p>Monitoring</p>;
    } else if (this.state.tab === 'config') {
      return <p>Config</p>;
    } else if (this.state.tab === 'adhoc') {
      return <p>Ad Hoc</p>;
    }
    return <p>Select a tab</p>;
  }

  render() {
    return (
      <div>
        <TabCollection selected={this.state.tab} onSelectTab={this.selectSection} />
        <div>
          {this.renderChosenSection()}
        </div>
      </div>
    );
  }

}

export default DataLakeConsole;