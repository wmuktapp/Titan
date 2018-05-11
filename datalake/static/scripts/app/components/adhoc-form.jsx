import React from 'react';

class AdhocForm extends React.Component {
  
  constructor() {
    super();
    this.state = {
      name: 'test'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleSubmit(e) {
    console.log('Form submitted');
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Name</label>
        <input type="text" value={this.state.name} onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    );
  }

}

export default AdhocForm;
