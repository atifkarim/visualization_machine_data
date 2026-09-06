FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 DATA_DIR=/data
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock && useradd --uid 10001 --create-home explorer \
    && mkdir /data && chown explorer:explorer /data
COPY app.py ./
COPY dashboard ./dashboard
COPY examples ./examples
USER explorer
EXPOSE 5012
VOLUME ["/data"]
CMD ["waitress-serve", "--host=0.0.0.0", "--port=5012", "--call", "dashboard:create_app"]
