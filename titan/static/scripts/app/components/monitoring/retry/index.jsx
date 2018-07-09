import React from 'react';
import PropTypes from 'prop-types';
import { doRetry } from '../../../services/data';
import SideBar from '../../sidebar/index.jsx';
import Dialog from '../../dialog/index.jsx';

const RETRY_STATE = {
  NONE: null,
  REQUESTED: 'requested',
  STARTED: 'started',
  FAILED: 'failed'
}

class Retry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      retryState: RETRY_STATE.NONE
    };
    this.retry = this.retry.bind(this);
    this.clearDialog = this.clearDialog.bind(this);
  }

  retry() {

    this.setState({
      retryState: RETRY_STATE.REQUESTED
    });

    doRetry(this.props.ids, result => {
      this.setState({
        retryState: RETRY_STATE.STARTED
      });
    }, error => {
      this.setState({
        retryState: RETRY_STATE.FAILED
      });
    });
  }

  clearDialog() {
    this.setState({
      retryState: RETRY_STATE.NONE
    });
  }

  render() {

    if (this.state.retryState === RETRY_STATE.REQUESTED) {
      return <Dialog canDismiss={false}>
        <p>Restarting executions...</p>
      </Dialog>
    }

    if (this.state.retryState === RETRY_STATE.STARTED) {
      return <Dialog onClose={this.clearDialog} onOk={this.clearDialog}>
        <p>Executions restarted - check back in a few minutes to see progress.</p>
      </Dialog>
    }

    if (this.state.retryState === RETRY_STATE.FAILED) {
      return <Dialog onClose={this.clearDialog} onOk={this.clearDialog}>
        <p>Unable to retry executions.  Please refresh the page and try again.</p>
      </Dialog>
    }

    if (this.props.ids.length) {

      return (
        <SideBar orient="right" offsetTop={100}>
          <a className="button button-primary monitor-btn-retry" onClick={this.retry}>
            Retry ({this.props.ids.length})
          </a>
        </SideBar>
      );

    }

    return null;
  }

}

Retry.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number).isRequired
}

export default Retry;