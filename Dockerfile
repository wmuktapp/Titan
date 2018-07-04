FROM python:3.6

### APP INSTALLATION ###
WORKDIR /root/
ADD . /root/
# System utilities, PYODBC dependencies and Titan installation
RUN apt-get update && \
    apt-get install -y --no-install-recommends apt-transport-https && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add && \
    curl https://packages.microsoft.com/config/debian/9/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install --no-install-recommends -y msodbcsql17 unixodbc-dev && \
    rm -rf /var/lib/apt/lists/* /var/tmp/* /tmp/* && \
    ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts && \
    chmod 700 /root/.ssh/id_rsa && \
    chown -R root:root /root/.ssh && \
    pip install --trusted-host pypi.python.org -r requirements.txt

### APP EXTENSIONS INSTALLATION ###
WORKDIR /acquire-programs/AdWordsReportDownloader/
RUN git clone https://github.com/wmuktapp/Titan-AdWordsReportDownloader.git . && \
    pip install --trusted-host pypi.python.org .

WORKDIR /acquire-programs/DBMReportDownloader/
RUN git clone https://github.com/wmuktapp/Titan-DBMReportDownloader.git . && \
    pip install --trusted-host pypi.python.org -r requirements.txt

WORKDIR /acquire-programs/DCMReportDownloader/
RUN git clone git@bitbucket.org:adamcunnington/titan-dcmreportdownloader.git . && \
    pip install --trusted-host pypi.python.org -r requirements.txt

WORKDIR /acquire-programs/DSReportDownloader/
RUN git clone https://github.com/wmuktapp/Titan-DSReportDownloader.git . && \
    pip install --trusted-host pypi.python.org -r requirements.txt

WORKDIR /acquire-programs/FTPFileDownloader/
RUN git clone https://github.com/wmuktapp/Titan-FTPFileDownloader.git . && \
    pip install --trusted-host pypi.python.org .

WORKDIR /acquire-programs/EmailAttachmentDownloader/
RUN git clone https://github.com/wmuktapp/Titan-EmailAttachmentDownloader.git . && \
    pip install --trusted-host pypi.python.org .

