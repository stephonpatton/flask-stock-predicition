import time as t
from flask import Flask

app = Flask(__name__)


@app.route('/saying')
def home():
    return {'saying': ['HELLO STEPHON', 'HELLO ERICA']}


@app.route('/time')
def time():
    return {'time': t.time()}


if __name__ == "__main__":
    app.run(debug=True)  # start the app
