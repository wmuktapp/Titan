
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request
from random import random
from time import sleep


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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


@app.route('/retry', methods=['POST'])
def retry():

    data = request.get_data('executions')

    # Get the data
    # print(data)

    # TODO
    start_date = datetime.strptime('2018-05-04', '%Y-%m-%d')
    end_date = datetime.strptime('2018-05-08', '%Y-%m-%d')
    row_count = 10
    return get_monitor_data(start_date, end_date, row_count)



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

            acquire_state = get_state(prev_state=None)
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
def get_state(prev_state):

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
