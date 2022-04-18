import time as t
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='build', static_url_path='')


# Still testing

@app.route('/saying')
def home():
    return {'saying': ['mHELLO STEPHON', 'HELLO ERICA']}


@app.route('/time')
def time():
    return {'time': t.time()}


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/models')
def models():
    return {
        "models": {
            "NNN": {
                "name": "Stephon",
                "age": 1
            },
            "RNNN": {
                "name": "Bob",
                "age": 12
            }
        }
    }


if __name__ == "__main__":
    app.run(debug=True)  # start the app
