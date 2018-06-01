import React from 'react';

require('./dialog.css');

class Dialog extends React.Component {
  
  constructor(props) {

    super(props);

    this.state = {
      show: true  // Take value from props if provided?
    };

    this.close = this.close.bind(this);
    this.ok = this.ok.bind(this);
  }

  close() {
    this.setState({
      show: false
    });
    this.props.onClose();
  }

  ok() {
    this.setState({
      show: false
    });
  }

  render() {

    return this.state.show && (
      <div className="dialog">
        <div className="dialog-box">
          <p>This is dialog!</p>
          <button className="button button-primary" onClick={this.ok}>Ok</button>
        </div>
        <div className="dialog-cover" onClick={this.close}></div>
      </div>
    );

  }  
}

export default Dialog;
