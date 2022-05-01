import time as t
from flask import Flask, send_from_directory, request, render_template
# import boto3
# client = boto3.client('runtime.sagemaker')
# print(client.connect_s3())
# print(client.list_models())

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

@app.route('/aapl')
def aapl_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/goog')
def goog_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/fb')
def fb_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/nflx')
def nflx_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/amzn')
def amzn_index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/models')
def models():
    return {
        "models": [{
            "id": 2,
            "name": "RNN"
        }, {
            "id": 3,
            "name": "NNN"
        }]
    }

@app.route("/faang")
def display_quote():
  symbol = request.args.get('symbol', default="AAPL")

  quote = yf.Ticker(symbol)

  return quote.info


if __name__ == "__main__":
    app.run(debug=True)  # start the app
