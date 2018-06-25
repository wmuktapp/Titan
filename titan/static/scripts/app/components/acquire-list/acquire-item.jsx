import React from 'react';
import Label from '../label.jsx';

class AcquireItem extends React.Component {

  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
    this.updateOption = this.updateOption.bind(this);
    this.remove = this.remove.bind(this);
  }

  updateName(event) {
    this.props.onNameChange(this.props.index, event.target.value);
  }

  updateOption(event) {
    const target = event.target,
      name = target.name,
      value = target.value;
    this.props.onOptionChange(this.props.index, name, value);
  }

  remove() {
    this.props.remove(this.props.index);
  }

  render() {

    // TODO use TextField component here?

    const rows = this.props.acquire.Options.map((option, index) => {
      return (
        <div key={index} className="acquire-property">
          <Label>{option.ScheduledAcquireOptionName}</Label>
          <input type="text" name={option.ScheduledAcquireOptionName} value={option.ScheduledAcquireOptionValue} onChange={this.updateOption} />
        </div>
      );
    });

    // TODO use TextField for name

    return (
      <div className="acquire-item u-cf">
        <a onClick={this.remove} className="acquire-item-remove">
          <span className="fas fa-times" />
        </a>
        <div className="acquire-name">
          <Label required={true}>Acquire Name</Label>
          <input type="text" className="acquire-name-input" value={this.props.acquire.ScheduledAcquireName} onChange={this.updateName} />
        </div>
        <div className="acquire-properties">
          <h6>Acquire Options</h6>
          {rows}
        </div>
      </div>
    );
  }
}

export default AcquireItem;
