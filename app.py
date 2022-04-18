import time as t
from flask import Flask

app = Flask(__name__, static_folder='../build', static_url_path='')


@app.route('/saying')
def home():
    return {'saying': ['mHELLO STEPHON', 'HELLO ERICA']}


@app.route('/time')
def time():
    return {'time': t.time()}

@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(debug=True)  # start the app
