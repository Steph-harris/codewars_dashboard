FROM python:3.7-alpine3.8

COPY . /

RUN pip3 install -r requirements.txt

ENTRYPOINT ["python3", "app.py"]
