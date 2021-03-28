FROM python:3.9-alpine3.13

WORKDIR /usr/app

COPY requirements.txt /requirements.txt

RUN pip3 install -r /requirements.txt

COPY ./ ./

EXPOSE 8080

CMD ["python3", "app.py"]
