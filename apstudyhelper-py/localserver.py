from flask import Flask, request
from scrape_main import get_main_page_data
from scrape_topic import get_questions
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Home route
@app.route('/')
def home():
    return "Reached Serving Questions Bank"

# Topic Route
@app.get('/all_units')
def all_units():
    mode = request.args.get("mode")
    return get_main_page_data(mode)

# Specific Questions
@app.post('/topic')
def topic():
    data = request.get_json()
    url = data["url"]
    return get_questions(url)


if __name__ == "__main__":
    app.run(debug=True, port=8010)
