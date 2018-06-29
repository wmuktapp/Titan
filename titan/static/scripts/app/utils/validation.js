
const requiredScheduleFields = {
  execution: [
    'ScheduledExecutionName',
    'ScheduledExecutionNextScheduled',
    'ScheduledExecutionClientName',
    'ScheduledExecutionDataSourceName',
    'ScheduledExecutionDataSetName',
    'ScheduledExecutionNextLoadDate',
    'ScheduledExecutionUser'
  ]
};

function isValid(value) {
  return !!value
    && typeof value.trim === 'function'
    && !!value.trim().length;
}

export function validateScheduleData(data, acquireOptionConfig, extractOptionConfig) {

  // TODO
  // - Check acquires, if applicable
  // - Check extract, if applicable

  // Validate execution
  for (let field in requiredScheduleFields.execution) {
    if (!isValid(data.execution[field])) {
      return false;
    }
  }

  return true;
}

export function validateAdhocData(data) {

  // TODO
  // - Check execution
  // - Check acquires, if applicable
  // - Check extract, if applicable


}
