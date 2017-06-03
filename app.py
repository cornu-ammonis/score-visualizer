from flask import Flask
from flask import render_template
from redis import Redis, RedisError
from bokeh.plotting import figure
from bokeh.embed import components 
import os
import socket
import time
import datetime

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
	try:
		visits = redis.incr("counter")
	except RedisError:
		visits = "<i>cannot connect to Redis, counter disabled</i>"

	y = redis.zrange('test', 0, -1)
	x = []
	for _y in y:
		x.append(redis.zscore('test', _y))

	# create a new plot with a title and axis labels
	p = figure(title="simple line example", x_axis_label='date',
              , y_axis_label='score')

	# add a line renderer with legend and line thickness
	p.line(x, y, legend="User1", line_width=2)

	script, div = components(p)
	return render_template('graph.html', script=script, div=div, visits=visits)

@app.route('/updatescore/<user>/<score>')
def updateScore(user, score):

	redis.zadd(user, time.time(), int(score))
	t = redis.zrange(user, 0, -1)
	return render_template('graph.html', visits=str(t[0]))

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=80)