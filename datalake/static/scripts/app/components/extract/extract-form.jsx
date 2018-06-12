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

    const state = this.state;
    state.destination = destination ? destination.value : '';
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

    const destinationOptions = this.state.availableDestinations.map(destination => {
      return {
        value: destination.ExtractProgramPythonName,
        label: destination.ExtractProgramFriendlyName
      };
    });
    const destinationValue = {
      value: this.state.destination,
      label: this.state.destination
    };

    rows.push(
      <div key="destination">
        <label>Destination</label>
        <Select
          value={destinationValue}
          options={destinationOptions}
          onChange={this.onDestinationChange}
          className="titan-react-select"
        />
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
