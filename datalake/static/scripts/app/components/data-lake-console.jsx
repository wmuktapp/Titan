import React from 'react';
import TabCollection from './tab-collection.jsx';

class DataLakeConsole extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'monitoring'
    };

    this.onSelectTab = this.onSelectTab.bind(this);
  }

  onSelectTab(tab) {
    this.setState({
      tab: tab
    });
  }

  render() {
    return (
      <div>
        <TabCollection selected={this.state.tab} onSelectTab={this.onSelectTab} />
        <div>{this.state.tab}</div>
      </div>
    );
  }

}

export default DataLakeConsole;