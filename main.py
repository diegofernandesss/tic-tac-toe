#!/usr/bin/env python
# encoding: utf-8
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)
    

@app.route("/")
def main():
    return render_template("index.html")

@socketio.on("play")
def play(index):
    print("server received", index)
    emit("play", index, broadcast=True)

if __name__ == "__main__":
    socketio.run(app,'0.0.0.0', debug=True)

   