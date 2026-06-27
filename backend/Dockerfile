FROM python:3.10-alpine

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./backend/src

EXPOSE 12345

CMD ["uvicorn", "backend.src.websockets.websocket_handler:app", "--host", "0.0.0.0", "--port", "12345"]
