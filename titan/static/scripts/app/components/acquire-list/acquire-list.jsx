import React from 'react';
import AcquireItem from './acquire-item.jsx';

import './acquire-list.css';

class AcquireList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      acquires: this.props.acquires
    };

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.itemNameChange = this.itemNameChange.bind(this);
    this.itemOptionChange = this.itemOptionChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.acquires !== this.state.acquires) {
      this.setState({
        acquires: nextProps.acquires
      });
    } 
  }

  // Add another acquire to list
  add() {

    const acquires = this.state.acquires;

    const newAcquire = {
      ScheduledAcquireName: name,
      Options: this.props.options.map(option => {
        return {
          ScheduledAcquireOptionName: option.AcquireProgramOptionName,
          ScheduledAcquireOptionValue: ''
        }
      })
    };

    acquires.push(newAcquire);

    this.setState({ acquires });

    this.props.onChange(acquires, this.isValid());
  }

  remove(index) {
    let acquires = this.state.acquires;
    acquires.splice(index, 1);
    this.setState({ acquires });
    this.props.onChange(acquires, this.isValid());
  }

  itemNameChange(index, value) {
    const acquires = this.state.acquires;
    acquires[index].ScheduledAcquireName = value;
    this.setState({ acquires });
    this.props.onChange(acquires, this.isValid());
  }

  itemOptionChange(index, name, value) {
    const acquires = this.state.acquires;

    let option = acquires[index].Options
      .find(option => option.ScheduledAcquireOptionName === name);

    // Option not found? Add it
    if (!option) {
      option = {
        ScheduledAcquireOptionName: name,
        ScheduledAcquireOptionValue: ''
      };
      acquires[index].Options.push(option);
    }

    option.ScheduledAcquireOptionValue = value;

    this.setState({ acquires });
    this.props.onChange(acquires, this.isValid());
  }

  // Check that this acquire is valid
  isValid() {

    // Get required options
    const requiredOptions = this.props.options
      .filter(option => option.AcquireProgramOptionRequired)
      .map(option => option.AcquireProgramOptionName);

    // Check each acquire
    for (let acquire of this.state.acquires) {

      // Check name
      if (!acquire.ScheduledAcquireName.trim()) {
        return false;
      }

      // Check mandatory fields
      for (let optionName of requiredOptions) {
        const selectedOption = acquire.Options
          .find(option => option.ScheduledAcquireOptionName === optionName);

        if (!selectedOption || selectedOption.ScheduledAcquireOptionValue.trim().length === 0) {
          return false;
        }
      }
    }

    return true;
  }

  render() {

    const acquireItems = this.state.acquires.map((acquire, index) => {
      return <AcquireItem
        key={index}
        acquire={acquire}
        index={index}
        remove={this.remove}
        onNameChange={this.itemNameChange}
        onOptionChange={this.itemOptionChange}
        options={this.props.options}
        showInvalid={this.props.showInvalid}
      />
    });

    return (
      <div className="acquire-list">
        { acquireItems }
        { !this.state.acquires.length && <p>No acquires</p> }
        <a onClick={this.add}>+ Add another</a>
      </div>
    );
  }
}

export default AcquireList;
  