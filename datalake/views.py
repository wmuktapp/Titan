
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request
from random import random, randint
from time import sleep


app = Flask(__name__)


# Page URLs

@app.route('/')
def index():
    # TODO redirect to /monitoring
    return render_template('monitoring.html')

@app.route('/monitoring')
def monitoring():
    return render_template('monitoring.html')

@app.route('/monitoring/executions/<int:execution_key>')
def monitoring_execution(execution_key):
    # TODO add execution to parameters
    return render_template('execution.html')

@app.route('/schedules')
def schedules():
    return render_template('schedules.html')

@app.route('/adhoc')
def adhoc():
    return render_template('adhoc.html')


# API URLs

@app.route('/api/executions')
def executions():

    start_date = request.args.get('start')
    end_date = request.args.get('end')

    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    # TODO
    # - Return list of executions
    return get_monitor_data(start_date, end_date)


@app.route('/api/executions/<int:execution_key>')
def execution_details(execution_key):

    data = {
        'execution': get_execution(execution_key)
    }

    return jsonify(data)


@app.route('/api/executions/retry', methods=['POST'])
def execution_retry():

    data = request.get_data('executions')

    # TODO
    start_date = datetime.strptime('2018-05-05', '%Y-%m-%d')
    end_date = datetime.strptime('2018-05-09', '%Y-%m-%d')

    return get_monitor_data(start_date, end_date)



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

def get_monitor_data(start_date, end_date):

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
