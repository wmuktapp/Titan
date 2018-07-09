import Ajax from './../utils/ajax';
import DateUtils from './../utils/date-utils';

const URLS = {
  fetchExecutions: '/api/executions/',
  retryExecutions: '/api/executions/retry'
};

export function doRetry(ids, onSuccess, onError) {

  return Ajax.fetch(URLS.retryExecutions, {
    method: 'POST',
    body: JSON.stringify({
      data: ids
    })
  })
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function fetchMonitorData(date, pageNumber, onSuccess, onError) {

  const url = URLS.fetchExecutions
    + '?end_date=' + DateUtils.dateToIso8601(date)
    + '&page_number=' + pageNumber;

  Ajax.fetch(url)
    .then(response => response.json())
    .then(onSuccess, onError);
}
