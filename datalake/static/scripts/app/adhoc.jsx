import React from 'react';
import { render } from 'react-dom';
import { wrapWithAdal } from './utils/adal-config';
import AdhocForm from './components/adhoc-form.jsx';

class AdhocApp extends React.Component {
  render() {
    return <AdhocForm schedule={data.scheduleId} />;
  }
}

wrapWithAdal(() => {
  render(<AdhocApp />, document.getElementById('adhoc'));
});