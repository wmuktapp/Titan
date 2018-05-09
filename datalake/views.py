
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request
from random import random
from time import sleep


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# TODO get details
@app.route('/execution/<int:task_id>')
def execution(task_id):
    # TODO add execution to parameters
    return render_template('execution.html')

# TODO rename this endpoint to /executions
@app.route('/monitoring')
def monitoring():

    start_date = request.args.get('start')
    end_date = request.args.get('end')
    row_count = int(request.args.get('rows'))

    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    # TODO
    # - Return list of executions
    return get_monitor_data(start_date, end_date, row_count)


# TODO rename this to /executions
@app.route('/retry', methods=['POST'])
def retry():

    data = request.get_data('executions')

    # TODO
    start_date = datetime.strptime('2018-05-05', '%Y-%m-%d')
    end_date = datetime.strptime('2018-05-09', '%Y-%m-%d')
    row_count = 10
    return get_monitor_data(start_date, end_date, row_count)


# TODO add load date to URL
@app.route('/execution-details/<int:task_id>')
def execution_details(task_id):

    # TODO get this data from somewhere
    data = {
        'execution': {
            'name': 'Task %i' % task_id,
            'id': task_id,
            'date': datetime.now()
        }
    }

    return jsonify(data)


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

def get_monitor_data(start_date, end_date, row_count):

    # Small delay, for testing purposes
    sleep(1)

    # Sample data
    tasks = []

    for i in range(1, row_count + 1):

        task = {
            'name': 'Task-%s' % i,
            'executions': []
        }

        temp_date = start_date
        while temp_date <= end_date:

            acquire_state = get_state()
            extract_state = get_state(prev_state=acquire_state)

            task['executions'].append({
                'date': temp_date.strftime('%d-%m-%Y'),
                'acquire': acquire_state,
                'extract': extract_state
            })

            temp_date += timedelta(days=1)

        tasks.append(task)

    return jsonify(tasks)


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

    n = random()
    if n > .3:
        return SUCCESS
    if n > .1:
        return FAILURE

    return RUNNING
