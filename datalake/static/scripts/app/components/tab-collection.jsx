import React from 'react';
import Tab from './tab.jsx';

class TabCollection extends React.Component {

  constructor(props) {
    super(props);

    // Required for 'this' to work
    this.tabSelect = this.tabSelect.bind(this);
  }

  tabSelect(tab) {
    this.props.onSelectTab(tab);
  }

  render() {
    return (
      <div>
        <Tab name="Monitoring" selected={this.props.selectedTab === 'monitoring'} onSelect={() => {this.tabSelect('monitoring')}} />
        <Tab name="Config" selected={this.props.selectedTab === 'config'} onSelect={() => {this.tabSelect('config')}} />
        <Tab name="Ad Hoc" selected={this.props.selectedTab === 'adhoc'} onSelect={() => {this.tabSelect('adhoc')}} />
      </div>
    );
  }
}

export default TabCollection;