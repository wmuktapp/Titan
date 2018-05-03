import React from 'react';

const Tab = props => {
  return (
    <span className={'tab' + (!!props.selected ? ' tab-selected' : '')}>
      <a onClick={props.onSelect}>{props.name}</a>
    </span>
  );
}

export default Tab;
