import React from 'react';

class ExtractForm extends React.Component {

  constructor(props) {
    super(props);
    this.onDestinationChange = this.onDestinationChange.bind(this);
  }

  onDestinationChange(e) {
    this.props.selectDestination(e.target.value);
  }

  render() {

    let rows = [];
    const destinations = [ // TODO get these from props
      'FTP',
      'Database',
      'Dropbox'
    ];

    if (this.props.showForm) {

      // Destination
      const destinationOptions = destinations.map((source, index) => {
        return <option key={index} value={source}>{source}</option>;
      });

      rows.push(
        // How are input values restricted in child components?
        <div key="destination" className="row">
          <label>Destination</label>
          <select value={this.props.destination} onChange={this.onDestinationChange}>
            <option value=""></option>
            { destinationOptions }
          </select>
        </div>
      );

      if (this.props.destination) {
        rows.push(
          <div key="datasource" className="row">
            <label>Data source name</label>
            <input type="text" />
          </div>
        );
        rows.push(<h6 key="subtitle">Dynamic fields</h6>);
        const dynamicFields = [ // TODO get these from props
          'Dynamic field 1',
          'Dynamic field 2',
          'Dynamic field 3'
        ];
        const dynamicFieldRows = dynamicFields.map((field, index) => {
          return (
            <div key={'df-' + index} className="row">
              <label>{field}</label>
              <input type="text" />
            </div>
          );
        });
        rows = rows.concat(dynamicFieldRows);
      }

    } else {  // Don't show form
      rows.push(<p key="empty-msg">No acquire job selected</p>);
    }

    return (
      <div className="extract-form">
        <h5>Extracts</h5>
        {rows}
      </div>
    );
  }

}

export default ExtractForm;
