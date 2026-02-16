FROM python:3.10-alpine

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

EXPOSE 12345

CMD ["fastapi", "run", "./src/websockets/websocket_handler.py", "--host", "0.0.0.0", "--port", "12345"]
