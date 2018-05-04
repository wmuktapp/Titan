
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template
from random import random


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/monitoring')
def monitoring():

    # TODO
    # - Return list of executions
    # - Response should be based on the date range and page number(s) provided

    # Sample data
    tasks = []
    results = 5
    date_range = 5

    today = datetime.now().date()
    start_date = today - timedelta(days=date_range - 1)
    end_date = today

    for i in range(1, results + 1):

        task = {
            'name': 'Task-%s' % i,
            'executions': []
        }

        temp_date = start_date
        while temp_date <= end_date:

            task['executions'].append({
                'date': temp_date.strftime('%d-%m-%Y'),
                'acquire': get_state(),
                'extract': get_state()
            })

            temp_date += timedelta(days=1)

        tasks.append(task)

    return jsonify(tasks)


# State randomiser
def get_state():

    n = random()
    if n > .5:
        return 'success'
    if n > .2:
        return 'failure'

    return 'running'
