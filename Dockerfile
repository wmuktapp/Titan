FROM python:3.6-alpine

### APP INSTALLATION ###
WORKDIR /titan/

ADD . /titan/

# PYODBC dependency
RUN apk --no-cache add unixodbc-dev libffi-dev openssl-dev build-base

RUN pip install --trusted-host pypi.python.org -r requirements.txt

### APP EXTENSIONS INSTALLATION ###

RUN apk --no-cache --virtual .build add git

WORKDIR /acquire-programs/AdWordsReportDownloader/

RUN git clone https://github.com/wmuktapp/Titan-AdWordsReportDownloader.git .

RUN apk --no-cache add libxml2-dev libxslt-dev

RUN pip install --trusted-host pypi.python.org .

### CLEAN UP ###
RUN rm -rf /acquire-programs /var/cache/apk/* /var/tmp/* /tmp/*
RUN apk del .build