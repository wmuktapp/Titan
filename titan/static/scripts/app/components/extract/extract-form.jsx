import React from 'react';
import Select from 'react-select';
import Label from '../label.jsx';
import TextField from '../form-field/text-field.jsx';
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
    Ajax.fetch('/api/extract-programs/')
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

    const name = destination ? destination.label : '';

    // Reset options
    const options = destination
      ? this.state.availableDestinations
          .find(d => d.ExtractProgramFriendlyName === destination.label)
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

    // NOTE:  We are passed a list of current values for the extract options, and a list containing
    //        all fields and details on whether they are mandatory (along with an explanation). We
    //        need to cross-reference the two so that blank options are still displayed.

    let rows = [];

    const destinationOptions = this.state.availableDestinations.map(destination => {
      return {
        value: destination.ExtractProgramPythonName,
        label: destination.ExtractProgramFriendlyName,
        options: destination.Options
      };
    });

    // Find the correct object from destinationObjects
    const destinationValue = destinationOptions.find(o => o.label === this.state.destination);

    if (this.state.destination) {

      // Get a list of all available options
      const dest = this.state.availableDestinations.find(d => d.ExtractProgramFriendlyName === this.state.destination);
      const optionsConfig = dest ? dest.Options : [];

      const optionRows = optionsConfig.map((optionConfig, index) => {

        // Option name
        const name = optionConfig.ExtractProgramOptionName;

        // Look for the existing value
        const option = this.state.options
          .find(option => option.ScheduledExtractOptionName === name);

        // Option not found? Create a blank value
        const value = option ? option.ScheduledExtractOptionValue : '';

        // Field required?
        const required = optionConfig.ExtractProgramOptionRequired;

        // TODO validate
        return (
          <TextField
            key={index}
            label={name}
            value={value}
            required={required}
            onChange={this.onOptionChange}
          />
        );

      });

      rows = rows.concat(optionRows);
    }

    return (
      <div className="extract-form">
        <div key="destination">
          <Label>Destination</Label>
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
