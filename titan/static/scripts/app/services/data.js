
import Ajax from './../utils/ajax';

const URLS = {
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
