import Ajax from './../utils/ajax';
import DateUtils from './../utils/date-utils';

const NOT_FOUND_PAGE = '/404';

const URLS = {
  fetchExecutions: '/api/executions/',
  retryExecutions: '/api/executions/retry',
  changeExecutions: '/api/executions',
  fetchSchedules: '/api/schedules/',
  changeSchedules: '/api/schedules/',
  fetchAcquirePrograms: '/api/acquire-programs/',
  fetchExtractPrograms: '/api/extract-programs/'
};

export function doRetry(ids, onSuccess, onError) {

  return Ajax.fetch(URLS.retryExecutions, {
    method: 'POST',
    body: JSON.stringify({
      data: ids.length ? ids : [ ids ]
    })
  })
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function fetchMonitorData(date, pageNumber, onSuccess, onError) {

  const url = URLS.fetchExecutions
    + '?end_date=' + DateUtils.dateToIso8601(date)
    + '&page_number=' + pageNumber;

  return Ajax.fetch(url)
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function fetchExecution(key, onSuccess, onError) {

  return Ajax.fetch(URLS.fetchExecutions + key)
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function createExecution(data, onSuccess, onError) {

  return Ajax.fetch(URLS.changeExecutions, {
    method: 'POST',
    body: JSON.stringify(data)
  })
    .then(onSuccess, onError);
}

export function fetchSchedules(pageNumber, onSuccess, onError) {

  const url = URLS.fetchSchedules + '?page_size=100&page_number=' + pageNumber;

  return Ajax.fetch(url)
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function fetchSchedule(key, onSuccess, onError) {
  return fetch(URLS.fetchSchedules + key)
    .then(onSuccess, onError);
}

export function fetchAcquires(onSuccess, onError) {
  return Ajax.fetch(URLS.fetchAcquirePrograms)
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function fetchExtracts(onSuccess, onError) {
  return Ajax.fetch(URLS.fetchExtractPrograms)
    .then(response => response.json())
    .then(onSuccess, onError);
}

export function insertOrUpdateSchedule(data, key, onSuccess, onError) {
  return Ajax.fetch(URLS.changeSchedules + (key || ''), {
    method: key ? 'PUT' : 'POST',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(onSuccess, onError);
}

function fetch(url, options = {}) {
  return Ajax.fetch(url, options)
    .then(response => {

      if (response.status === 404) {
        window.location.href = NOT_FOUND_PAGE;
        return;
      }

      return response.json();
    });
}

