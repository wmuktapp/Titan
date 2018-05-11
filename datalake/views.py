
from datetime import datetime, timedelta
from flask import Flask, jsonify, redirect, render_template, request
from markupsafe import Markup
from random import random, randint
from time import sleep


app = Flask(__name__)


# Page URLs

@app.route('/')
def index():
    return redirect('/monitoring')

@app.route('/monitoring')
def monitoring():
    return render_template('monitoring.html')

@app.route('/monitoring/executions/<int:execution_key>')
def monitoring_execution(execution_key):
    # TODO return full set of data for execution?
    data = Markup({ 'executionKey': execution_key })
    return render_template('execution.html', data=data)

@app.route('/schedules')
def schedules():
    return render_template('schedules.html')

@app.route('/schedules/<int:schedule_key>')
def schedule_details(schedule_key):
    # TODO
    return render_template('schedules.html')

@app.route('/schedules/add')
def schedule_add():
    # TODO
    return render_template('schedules.html')

@app.route('/adhoc')
def adhoc():
    return render_template('adhoc.html')


# API URLs

@app.route('/api/executions')
def executions_list():

    start_date = request.args.get('start')
    end_date = request.args.get('end')

    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    return get_execution_data(start_date, end_date)


@app.route('/api/executions/<int:execution_key>')
def execution_get(execution_key):

    data = {
        'execution': get_execution(execution_key)
    }

    return jsonify(data)


@app.route('/api/executions/retry', methods=['POST'])
def execution_retry():

    data = request.get_data('executions')

    start_date = datetime.now() - timedelta(days=4)
    end_date = datetime.now()

    return get_execution_data(start_date, end_date)


@app.route('/api/schedules')
def schedules_list():
    return get_schedules()


@app.route('/api/schedules/<int:schedule_key>')
def schedules_get(schedule_key):
    return get_schedule(schedule_key)


@app.route('/api/acquireprograms')
def acquire_programs_list():
    return get_acquire_programs()


@app.route('/api/clients')
def clients_list():
    return get_clients()


@app.route('/api/datasets')
def datasets_list():
    return get_datasets()


# ENDPOINTS

# Execution endpoints
# /executions
#   POST: create execution (we know this is adhoc)
#   GET: list all
# /executions/<execution_key>
#   GET: retrieve individual
#   PATCH/PUT: partial update/overwrite
# /executions/retry
#   POST: retry existing execution(s)

# Schedule endpoints
# /schedules
#   POST: create new schedule
#   GET: list schedules, supports filtering by querystring
# /schedules/<schedule_key>
#   GET: retrieve individual item
#   PATCH/PUT: partial update/overwrite
# Optional:
# /schedules/distinct/<col>
#   GET: retrieve distinct column values (for filtering)

# AcquirePrograms endpoints
# /acquireprograms
#   GET: list all
# Optional
# /acquireprograms/<key>
#   GET: retrieve individual instance



# SAMPLE DATA

# Executions

def get_execution_data(start_date, end_date):

    # Small delay, for testing purposes
    sleep(1)

    # Sample data
    tasks = []
    row_count = 10

    for i in range(1, row_count + 1):

        task = {
            'name': 'Task-%s' % i,
            'executions': []
        }

        temp_date = start_date
        while temp_date <= end_date:

            execution = get_execution(randint(1, 1000), temp_date)

            task['executions'].append(execution)

            temp_date += timedelta(days=1)

        tasks.append(task)

    return jsonify(tasks)


def get_execution(id, temp_date=None):

    if not temp_date:
        temp_date = datetime.now()

    acquire_state = get_state()
    extract_state = get_state(prev_state=acquire_state)

    return {
        'id': id,
        'name': 'Task-%i' % id,
        'date': temp_date.strftime('%d-%m-%Y'),
        'acquire': acquire_state,
        'extract': extract_state
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

    row_count = 10

    for i in range(1, row_count + 1):

        id = randint(1, 1000)

        schedule = get_schedule(id)

        schedules.append(schedule)

    return jsonify(schedules)


def get_schedule(id):

    return {
        'id': id,
        'name': 'Schedule %i' % id,
        'nextDate': get_next_date(),
        'client': 'Client %i' % id,
        'dataset': 'Dataset %i' % id,
        'loadDate': get_load_date(),
        'enabled': random() > .2
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
    return { 'id': id, 'name': 'Program %i' % id }


# Clients

def get_clients():

    data = []

    for i in range(1, 11):
        data.append(get_client(i))

    return jsonify(data)

def get_client(id):
    return { 'id': id, 'name': 'Client %i' % id }


# Datasets

def get_datasets():

    data = []

    for i in range(1, 21):
        data.append(get_dataset(i))

    return jsonify(data)

def get_dataset(id):
    return { 'id': id, 'name': 'Dataset %i' % id }
