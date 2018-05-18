import React from 'react';

class AcquireItem extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
  }

  onChange(event) {
    const target = event.target,
      name = target.name,
      value = target.value;
    this.props.onChange(this.props.index, name, value);
  }

  remove() {
    this.props.remove(this.props.index);
  }

  render() {

    // TODO use keys instead?
    const rows = Object.entries(this.props.fields).map((field, index) => {
      return (
        <div key={index} className="row">
          <label>{field[0]}</label>
          <input type="text" name={field[0]} value={field[1]} onChange={this.onChange} />
        </div>
      );
    });

    return (
      <div className="acquire-item u-cf">
        {rows}
        <a onClick={this.remove} className="acquire-item-remove">Remove</a>
      </div>
    );
  }
}

export default AcquireItem;
