# syntax=docker/dockerfile:1

FROM python:3.10-alpine 

WORKDIR /app
COPY . /app

RUN apk update && apk add --no-cache bash 

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP=dictionary-backend.py
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "dictionary-backend:app"]