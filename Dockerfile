FROM python:3.6

WORKDIR /titan

ADD . /titan/

# pyodbc system dependency
RUN apt-get update && apt-get install -y unixodbc-dev && rm -rf /var/lib/apt/lists/*

RUN pip install --trusted-host pypi.python.org -r requirements.txt