from flask import Flask, render_template
from googleapiclient.discovery import build
import csv
import datetime
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

CHANNELS = {
    "Your Channel": "YOUR_CHANNEL_ID",
    "Friend 1": "CHANNEL_ID_1",
    "Friend 2": "CHANNEL_ID_2"
}

CSV_FILE = "ulb_leaderboard.csv"
app = Flask(__name__)
youtube = build('youtube', 'v3', developerKey=API_KEY)

def fetch_stats():
    leaderboard = []
    for name, channel_id in CHANNELS.items():
        request = youtube.channels().list(
            part="statistics,snippet",
            id=channel_id
        )
        response = request.execute()
        stats = response['items'][0]['statistics']
        leaderboard.append({
            "Channel": name,
            "Subscribers": int(stats.get('subscriberCount', 0)),
            "TotalViews": int(stats.get('viewCount', 0)),
            "Videos": int(stats.get('videoCount', 0))
        })
    return sorted(leaderboard, key=lambda x: x['Subscribers'], reverse=True)

def save_csv(leaderboard):
    today = datetime.date.today()
    try:
        with open(CSV_FILE, "x", newline="") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=["Date","Channel","Subscribers","TotalViews","Videos"])
            writer.writeheader()
    except FileExistsError:
        pass

    with open(CSV_FILE, "a", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["Date","Channel","Subscribers","TotalViews","Videos"])
        for entry in leaderboard:
            row = {"Date": today, **entry}
            writer.writerow(row)

@app.route("/")
def index():
    leaderboard = fetch_stats()
    save_csv(leaderboard)
    return render_template("index.html", leaderboard=leaderboard)

if __name__ == "__main__":
    app.run(debug=True)
