import React from 'react';
import Select from 'react-select';
import Ajax from '../../utils/ajax';

class ExtractForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      availableDestinations: [],
      destination: props.destination,
      options: props.options
    };

    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
  }

  componentDidMount() {
    Ajax.fetch('/api/extract-programs')
      .then(res => res.json())
      .then(result => {
        this.setState({
          availableDestinations: result.data
        });
      });
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

  onDestinationChange(destination) {

    // Reset options
    const options = destination
      ? this.state.availableDestinations
          .find(d => d.ExtractProgramPythonName === destination.value)
          .Options.map(option => {
            return {
              ScheduledExtractOptionName: option.ExtractProgramOptionName,
              ScheduledExtractOptionValue: ''
            };
          })
      : [];

    const state = this.state;
    state.destination = destination ? destination.value : '';
    state.options = options;

    // Not sure whether this is needed
    this.setState(state);

    // TODO this also requires options to be passed to the parent

    this.props.onDestinationChange(state.destination, options);
  }

  onOptionChange(e) {
    const target = e.target;

    // TODO update state.fields
    // this.props.updateField(target.name, target.value);
  }

  render() {

    let rows = [];

    const destinationOptions = this.state.availableDestinations.map(destination => {
      return {
        value: destination.ExtractProgramPythonName,
        label: destination.ExtractProgramFriendlyName
      };
    });

    // TODO return the correct object from destinationObjects
    const destinationValue = {
      value: this.state.destination,
      label: this.state.destination
    };

    if (this.state.destination) {

      // How do we handle the options being reset in the parent component?  Does it need to know
      // the names of the options for each destination?  Or should we manage that within this
      // component?

      const dest = this.state.availableDestinations.find(d => d.ExtractProgramPythonName === this.state.destination);
      const options = dest ? dest.Options : [];

      const _rows = options.map((option, index) => {

        const name = option.ExtractProgramOptionName;
        const value = this.state.options
          .find(o => o.ScheduledExtractOptionName === name).ScheduledExtractOptionValue;

        return (
          <div key={index}>
            <label>{name}</label>
            <input type="text" name={name} value={value} onChange={this.onOptionChange} />
          </div>
        );

      });

      rows = rows.concat(_rows);
    }

    return (
      <div className="extract-form">
        <div key="destination">
          <label>Destination</label>
          <Select
            value={destinationValue}
            options={destinationOptions}
            onChange={this.onDestinationChange}
            className="titan-react-select"
          />
        </div>
        {rows}
      </div>
    );
  }

}

export default ExtractForm;
