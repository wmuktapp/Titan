

// Converts a list of acquire programs into a format to be used by react-select
export function getAcquireProgramOptions(programs) {
  return programs.map(program => {
    return {
      value: program.AcquireProgramKey,
      label: program.AcquireProgramFriendlyName,
      disabled: !program.AcquireProgramEnabled,
      dataSource: program.AcquireProgramDataSourceName,
      options: program.Options
    };
  });
}

// Pulls data to be submitted
export function getExecutionData(data) {

  // Remove scheduled interval key
  const execution = data.execution;
  delete execution.ScheduledIntervalKey;

  return {
    data: {
      execution: execution,
      acquires: data.acquires,
      extract: data.extract
    }
  };
}

// Fields required for execution
export const requiredExecutionFields = [
  'ScheduledExecutionName',
  'ScheduledExecutionNextScheduled',
  'ScheduledExecutionClientName',
  'ScheduledExecutionDataSourceName',
  'ScheduledExecutionDataSetName',
  'ScheduledExecutionNextLoadDate'
];

export function validateField(value) {

  if (value === null) { // Object values
    return false;
  }
  if (typeof value.trim === 'function') { // String values
    return value.trim().length > 0;
  }
  return true;
}

// Convert data in execution object into simpler weekday data
export function getWeekDays(execution) {
  return {
    Monday: execution.ScheduledMondayEnabled,
    Tuesday: execution.ScheduledTuesdayEnabled,
    Wednesday: execution.ScheduledWednesdayEnabled,
    Thursday: execution.ScheduledThursdayEnabled,
    Friday: execution.ScheduledFridayEnabled,
    Saturday: execution.ScheduledSaturdayEnabled,
    Sunday: execution.ScheduledSundayEnabled
  }
}

// Convert simple weekday data into properties to be merged into an execution object literal
export function getExecutionDays(days) {
  return {
    ScheduledMondayEnabled: days.Monday,
    ScheduledTuesdayEnabled: days.Tuesday,
    ScheduledWednesdayEnabled: days.Wednesday,
    ScheduledThursdayEnabled: days.Thursday,
    ScheduledFridayEnabled: days.Friday,
    ScheduledSaturdayEnabled: days.Saturday,
    ScheduledSundayEnabled: days.Sunday
  }
}

// Merge two data objects 
export function mergeData(data1, data2) {
  return this.__mergeObjects(data1, data2);
}

function __mergeObjects(object1, object2) {

  const mergedObject = {};

  // Not an object?  No merging necessary
  if (typeof object1 !== 'object' || typeof object2 !== 'object') {
    return object1;
  }

  // Add all items from object 1, merging with object 2 when appropriate
  for (var key in object1) {

    if (object2.hasOwnProperty(key)) {
      // Ooooh recursion.  Be careful!
      mergedObject[key] = this.__mergeObjects(object1[key], object2[key]);
    } else {
      // Only in object 1 - just add to the object
      mergedObject[key] = object1[key];
    }
  }

  // Add any remaining values in object2
  for (var key in object2) {
    if (!object1.hasOwnProperty(key)) {
      mergedObject[key] = object2[key];
    }
  }

  return mergedObject;
}
