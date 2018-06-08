from datetime import datetime, timedelta
from flask import jsonify, redirect, render_template, request, current_app
from markupsafe import Markup
from random import random, randint
from time import sleep

import datalake


app = datalake.create_app()

# Page URLs

@app.route('/')
def index():
    return redirect('/monitoring')

@app.route('/monitoring')
def monitoring():
    return render_template('monitoring.html', access_token=get_access_token())

@app.route('/monitoring/executions/<int:execution_key>')
def monitoring_execution(execution_key):
    # TODO return full set of data for execution?
    # TODO add link to related schedule page, if applicable
    data = Markup({ 'executionKey': execution_key })
    return render_template('execution.html', access_token=get_access_token(), data=data)

@app.route('/schedules')
def schedules():
    return render_template('schedules.html', access_token=get_access_token())

@app.route('/schedules/<int:schedule_key>')
def schedule_details(schedule_key):

    # NOTE: 'run now' button, links to the adhoc page pre-filled (if possible)
    data = Markup({ 'scheduleKey': schedule_key })
    return render_template('schedule.html', access_token=get_access_token(), data=data)

@app.route('/schedules/add')
def schedule_add():
    data = Markup({})
    return render_template('schedule.html', access_token=get_access_token(), data=data)

@app.route('/adhoc')
def adhoc():

    data = {}

    schedule_id = request.args.get('schedule')
    if schedule_id:
        data['scheduleId'] = int(schedule_id)

    data = Markup(data)

    return render_template('adhoc.html', access_token=get_access_token(), data=data)


# API URLs

@app.route('/api/executions')
def executions_list():

    start_date = request.args.get('start')
    end_date = request.args.get('end')

    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    return get_execution_data(start_date, end_date)


@app.route('/api/executions', methods=['POST'])
def execute():

    # TODO handle adhoc execution

    return jsonify([])


@app.route('/api/executions/<int:execution_key>')
def execution_get(execution_key):

    data = get_execution(execution_key)

    return jsonify(data)


@app.route('/api/executions/<int:execution_key>', methods=['PUT'])
def execution_update(execution_key):

    # TODO update execution

    return jsonify([])


@app.route('/api/executions/retry', methods=['POST'])
def execution_retry():

    data = request.get_data('executions')

    start_date = datetime.now() - timedelta(days=5)
    end_date = datetime.now() - timedelta(days=1)

    return get_execution_data(start_date, end_date)


@app.route('/api/schedules')
def schedules_list():
    # TODO support filtering by querystring?
    return get_schedules()


@app.route('/api/schedules', methods=['POST'])
def schedule_create():
    # TODO create schedule?
    return jsonify({
        'id': randint(1, 1000)
    })


@app.route('/api/schedules/<int:schedule_key>')
def schedules_get(schedule_key):
    return jsonify(get_schedule(schedule_key))


# Should this be merged with /api/schedules POST?
@app.route('/api/schedules/<int:schedule_key>', methods=['PUT'])
def schedule_update(schedule_key):
    # TODO update schedule
    return jsonify([])


@app.route('/api/acquire-programs')
def acquire_programs_list():
    return get_acquire_programs()


# Potential new endpoints:
# /schedules/distinct/<col>
#   GET: retrieve distinct column values (for filtering)
# /acquire-programs/<key>
#   GET: retrieve individual instance


# Access Token

def get_access_token():
    return request.headers.get("X-Ms-Token-Aad-Access-Token", "")


# SAMPLE DATA

# Executions

def get_execution_data(start_date, end_date):

    # Small delay
    sleep(.5)

    data = {}

    clients = [
        'InGen Bioengineering %i' % randint(0, 9),
        'Nedry Solutions %i' % randint(0, 9),
        'Dr. Grant and Co %i' % randint(0, 9)
    ]

    data_sources = [
        'Facebook %i' % randint(0, 9),
        'DCM %i' % randint(0, 9),
        'MySpace %i' % randint(0, 9)
    ]

    data_sets = [
        'Data set 1%i' % randint(0, 9),
        'Data set 2%i' % randint(0, 9),
        'Data set 3%i' % randint(0, 9),
        'Data set 4%i' % randint(0, 9)
    ]

    for client in clients:

        client_data = {}

        for data_source in data_sources:

            data_source_data = {}

            for data_set in data_sets:

                data_set_data = {}

                temp_date = start_date

                while temp_date <= end_date:

                    acquire_state = get_state()
                    extract_state = get_state(prev_state=acquire_state)

                    data_set_data[temp_date.strftime('%Y-%m-%d')] = {
                        'ExecutionKey': randint(1, 1000),
                        'AcquireProgramKey': randint(1, 5),
                        'AcquireStartTime': get_time(),
                        'AcquireStatus': acquire_state,
                        'ExtractStartTime': get_time(),
                        'ExtractStatus': extract_state
                    }

                    temp_date += timedelta(days=1)

                data_source_data[data_set] = data_set_data

            client_data[data_source] = data_source_data

        data[client] = client_data

    return jsonify({ 'data': data })


def get_time():
    return '%s:%s:%s' % (pad(randint(0, 23)), pad(randint(0, 59)), pad(randint(0, 59)))

def pad(number):
    if number < 10:
        return '0%i' % number
    else:
        return str(number)


def get_execution(id):

    execution = {
        'ExecutionKey': id,
        'ExecutionContainerGroupName': 'Container %s' % 'ABCDE'[randint(0, 4)],
        'ScheduledExecutionKey': randint(1, 1000),
        'ExecutionScheduledTime': '14:23:35',
        'ExecutionStartTime': '14:23:52',
        'ExecutionEndTime': '14:27:29',
        'ExecutionSuccessful': (random() < .5),
        'ExecutionClientName': 'Client %s' % 'ABCDE'[randint(0, 4)],
        'ExecutionDataSourceName': 'Data Source %s' % 'ABCDE'[randint(0, 4)],
        'ExecutionDataSetName': 'Data Set %s' % 'ABCDE'[randint(0, 4)],
        'ExecutionLoadDate': datetime.now(),
        'ExecutionVersion': randint(1, 3),
        'ExecutionUser': 'User %s' % 'ABCDE'[randint(0, 4)],
        'AcquireProgramKey': randint(1, 1000),
        'AcquireProgramFriendlyName': 'My Acquire Program %s' % 'ABCDE'[randint(0, 4)]
    }

    acquires = []
    acquire_count = randint(1, 3)

    for i in range(0, acquire_count):

        acquire = {
            'AcquireKey': randint(1, 1000),
            'AcquireStartTime': '12:34:56',
            'AcquireEndTime': '12:51:15',
            'AcquireStatus': get_state(),
            'AcquireErrorMessage': None,
            'Options': []
        }

        option_count = randint(1, 5)
        for j in range(0, option_count):
            acquire['Options'].append({
                'AcquireOptionName': 'Name %i' % j,
                'AcquireOptionValue': 'Value %i' % j
            })

        acquires.append(acquire)

    extract = {
        'ExtractKey': randint(1, 1000),
        'ExtractDestination': 'Destination %s' % 'ABCDE'[randint(0, 4)],
        'ExtractStartTime': '19:23:35',
        'ExtractEndTime': '19:38:16',
        'ExtractStatus': get_state(),
        'ExtractErrorMessage': None,
        'Options': []
    }

    option_count = randint(1, 5)
    for i in range(0, option_count):
        extract['Options'].append({
            'ExtractOptionName': 'Name %i' % i,
            'ExtractOptionValue': 'Value %i' % i
        })

    return {
        'data': {
            'execution': execution,
            'acquires': acquires,
            'extract': extract
        }
    }



# State randomiser
def get_state(prev_state=None):

    SUCCESS = 'success'
    FAILURE = 'failure'
    RUNNING = 'running'
    WAITING = 'waiting'

    if prev_state == FAILURE:
        return FAILURE
    if prev_state == RUNNING:
        return WAITING
    if prev_state == WAITING:
        return WAITING

    n = random()
    if n > .3:
        return SUCCESS
    if n > .1:
        return FAILURE
    if n > .05:
        return RUNNING

    return WAITING


# Schedules

def get_schedules():

    # Small delay
    sleep(1)

    schedules = []

    row_count = 50

    for i in range(1, row_count + 1):

        id = randint(1, 1000)

        schedule = get_schedule(id)

        schedules.append(schedule)

    return jsonify(schedules)


def get_schedule(id):

    return {
        'id': id,
        'name': 'Schedule %i' % id,
        'nextScheduled': get_next_date(),
        'scheduleEnd': get_next_date(),
        'client': 'Client %s' % 'ABCDE'[randint(0, 4)],
        'dataSource': 'Data source %i' % id,
        'dataSet': 'Dataset %s' % 'ABCDE'[randint(0, 4)],
        'loadDate': get_load_date(),
        'enabled': random() > .2,
        'interval': {
            'hours': randint(1, 23),
            'minutes': randint(1, 59),
            'seconds': randint(1, 59)
        },
        'days': {
            'Monday': random() > .3,
            'Tuesday': random() > .3,
            'Wednesday': random() > .3,
            'Thursday': random() > .3,
            'Friday': random() > .3,
            'Saturday': random() > .3,
            'Sunday': random() > .3
        },
        'program': randint(1, 5),
        'extract': randint(1, 5)
    }

def get_interval():

    if random() > .5:
        return 'Daily'
    return 'Weekly'

def get_next_date():
    return datetime.now() + timedelta(days=randint(0, 7))

def get_load_date():
    return datetime.now() - timedelta(days=randint(0, 7))


# Acquire Programs

def get_acquire_programs():

    data = []

    for i in range(1, 6):
        data.append(get_acquire_program(i))

    return jsonify(data)

def get_acquire_program(id):
    return {
        'id': id,
        'name': 'Program %i' % id,
        'dataSource': 'Data source %i' % id
    }
