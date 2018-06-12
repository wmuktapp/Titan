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

    // Pass the destination and options to the parent

    const name = destination ? destination.value : '';

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

    this.props.onDestinationChange(name, options);
  }

  onOptionChange(e) {
    const target = e.target;
    const options = this.state.options;

    options
      .find(option => option.ScheduledExtractOptionName === target.name).ScheduledExtractOptionValue = target.value;

    this.props.onOptionsChange(options);
  }

  render() {

    let rows = [];

    const destinationOptions = this.state.availableDestinations.map(destination => {
      return {
        value: destination.ExtractProgramPythonName,
        label: destination.ExtractProgramFriendlyName
      };
    });

    // Find the correct object from destinationObjects
    const destinationValue = destinationOptions.find(o => o.value === this.state.destination);

    if (this.state.destination) {

      const dest = this.state.availableDestinations.find(d => d.ExtractProgramPythonName === this.state.destination);
      const options = dest ? dest.Options : [];

      const optionRows = options.map((option, index) => {

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

      rows = rows.concat(optionRows);
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
