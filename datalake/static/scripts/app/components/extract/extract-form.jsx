import React from 'react';

class ExtractForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      destination: props.destination,
      fields: props.fields
    };

    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onDestinationChange(e) {

    const state = this.state;
    state.destination = e.target.value;
    this.setState(state);

    this.props.onChange(state)
  }

  onFieldChange(e) {
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

      // Dynamic fields
      const dynamicFieldRows = Object.keys(this.state.fields).map((key, index) => {
        return (
          <div key={index}>
            <label>{key}</label>
            <input type="text" name={key} value={this.state.fields[key]} onChange={this.onFieldChange} />
          </div>
        );
      });

      rows = rows.concat(dynamicFieldRows);
    }

    return (
      <div className="extract-form">
        {rows}
      </div>
    );
  }

}

export default ExtractForm;
