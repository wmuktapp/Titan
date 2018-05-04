
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request
from random import random


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/monitoring')
def monitoring():

    # TODO
    # - Return list of executions

    start_date = request.args.get('start')
    end_date = request.args.get('end')
    row_count = int(request.args.get('rows'))

    start_date = datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.strptime(end_date, '%Y-%m-%d')

    # Sample data
    tasks = []

    for i in range(1, row_count + 1):

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
