FROM python:3.6

WORKDIR /app

ADD . /app

RUN apt-get update && apt-get install -y unixodbc-dev && rm -rf /var/lib/apt/lists/*

RUN pip install --trusted-host pypi.python.org -r requirements.txt

RUN python setup.py install
