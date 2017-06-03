from flask import Flask
from flask import render_template
from redis import Redis, RedisError
from bokeh.plotting import figure
from bokeh.embed import components 
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
	try:
		visits = redis.incr("counter")
	except RedisError:
		visits = "<i>cannot connect to Redis, counter a disabled</i>"

	x = [1, 2, 3, 4, 5]
	y = [6, 7, 2, 4, 5]
	# create a new plot with a title and axis labels
	p = figure(title="simple line example", x_axis_label='x', y_axis_label='y')

	# add a line renderer with legend and line thickness
	p.line(x, y, legend="Temp.", line_width=2)

	script, div = components(p)
	return render_template('graph.html', script=script, div=div)
	

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=81)