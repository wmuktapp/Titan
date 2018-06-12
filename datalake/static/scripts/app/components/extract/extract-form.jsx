import React from 'react';

class ExtractForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      destination: props.destination,
      options: props.options
    };

    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.destination !== this.state.destination) {
      this.setState({
        destination: nextProps.destination
      });
    }
    if (nextProps.options !== this.state.options) {
      this.setState({
        options: nextProps.options
      });
    }
  }

  onDestinationChange(e) {

    const state = this.state;
    state.destination = e.target.value;
    this.setState(state);

    this.props.onDestinationChange(state.destination);
  }

  onOptionChange(e) {
    const target = e.target;

    // TODO update state.fields
    // this.props.updateField(target.name, target.value);
  }

  render() {

    let rows = [];
    const destinations = [ // TODO get these from props?
      'FTP',
      'Database',
      'Dropbox'
    ];

    // Destination
    const destinationOptions = destinations.map((source, index) => {
      return <option key={index} value={source}>{source}</option>;
    });

    rows.push(
      <div key="destination">
        <label>Destination</label>
        <select value={this.state.destination} onChange={this.onDestinationChange}>
          <option value=""></option>
          { destinationOptions }
        </select>
      </div>
    );

    if (this.state.destination) {

      // Dynamic options
      const dynamicOptionRows = this.state.options.map((option, index) => {
        return (
          <div key={index}>
            <label>{option.ScheduledExtractOptionName}</label>
            <input type="text" name={option.ScheduledExtractOptionName}
              value={option.ScheduledExtractOptionValue} onChange={this.onOptionChange} />
          </div>
        );
      });

      rows = rows.concat(dynamicOptionRows);
    }

    return (
      <div className="extract-form">
        {rows}
      </div>
    );
  }

}

export default ExtractForm;
