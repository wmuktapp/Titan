import React from 'react';
import ColumnFilter from './filter.jsx';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class ColumnDateFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: null
    }
    this.clear = this.clear.bind(this);
    this.select = this.select.bind(this);
  }

  clear() {
    this.setState({
      date: null
    });
    this.props.onChange(null);
  }

  select(date) {
    this.setState({ date });
    this.props.onChange(date);
  }

  render() {

    const controls = <a className="filter-menu-link" onClick={this.clear}>Clear</a>;

    return (
      <ColumnFilter filtered={!!this.state.date} controls={controls} menuClassName="filter-menu-date">
        <DatePicker inline={true} selected={this.state.date} onChange={this.select} calendarClassName="filter-menu-datepicker" />
      </ColumnFilter>
    );
  }

}

export default ColumnDateFilter;
