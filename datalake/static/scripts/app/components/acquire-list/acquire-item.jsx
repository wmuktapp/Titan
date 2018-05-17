import React from 'react';

class AcquireItem extends React.Component {

  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove() {
    this.props.remove(this.props.index);
  }

  render() {

    const rows = Object.entries(this.props.fields).map((field, index) => {
      return (
        <div key={index} className="row">
          <label>{field[0]}</label>
          <input type="text" value={field[1]} />
        </div>
      );
    });

    const removeButton = this.props.index === 0
      ? []
      : <a onClick={this.remove} className="acquire-item-remove">Remove</a>

    return (
      <div className="acquire-item u-cf">
        {rows}
        {removeButton}
      </div>
    );
  }
}

export default AcquireItem;
