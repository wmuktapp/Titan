import React from 'react';

class AcquireExtry extends React.Component {

  render() {

    const rows = Object.entries(this.props.fields).map((field, index) => {
      return <div key={index} className="row">
        <label>{field[0]}</label>
        <input type="text" value={field[1]} />
      </div>
    });

    return (
      <div className="acquire-entry">
        {rows}
      </div>
    );
  }
}

export default AcquireExtry;
