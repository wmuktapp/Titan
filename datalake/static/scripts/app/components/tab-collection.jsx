import React from 'react';
import Tab from './tab.jsx';

class TabCollection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected
    };

    // Required for 'this' to work
    this.tabSelect = this.tabSelect.bind(this);
  }

  tabSelect(tab) {
    // this.setState({ selected: tab });
    this.props.onSelectTab(tab);
  }

  render() {
    return (
      <div>
        <Tab name="Monitoring" selected="true" onSelect={() => {this.tabSelect('monitoring')}} />
        <Tab name="Config" selected="false" onSelect={() => {this.tabSelect('config')}} />
        <Tab name="Ad Hoc" selected="false" onSelect={() => {this.tabSelect('adhoc')}} />
      </div>
    );
  }
}

export default TabCollection;