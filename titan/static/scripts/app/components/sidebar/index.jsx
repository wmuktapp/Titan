import React from 'react';
import PropTypes from 'prop-types'

import './index.css';

class SideBar extends React.Component {

  render() {

    const className = 'sidebar '
      + (this.props.orient === 'left' ? 'sidebar-left' : 'sidebar-right')
      + (this.props.className ? ' ' + this.props.className : '');

    const style = {
      top: this.props.offsetTop,
      bottom: this.props.offsetBottom
    };

    return (
      <div className={className} style={style}>
        { this.props.children }
      </div>
    );

  }

}

SideBar.defaultProps = {
  orient: PropTypes.oneOf(['left', 'right']).isRequired,
  offsetTop: PropTypes.number,
  offsetBottom: PropTypes.number
};

export default SideBar;
