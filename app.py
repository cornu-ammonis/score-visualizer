from flask import Flask
from flask import render_template
from redis import Redis, RedisError
from bokeh.plotting import figure
from bokeh.embed import components 
import os
import socket
import time
from datetime import datetime as dt
import redis

"""
TO DO
( ) automatically determine the start date on first run 
(x) include link to graph page on rank page
( ) better determine graph size
( ) modify score updating to be secured post request or api call
( ) include mobile bootstrap column sizes i

"""


# Connect to Redis
r = redis.StrictRedis(host="localhost", decode_responses=True)
#r = redis.StrictRedis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2, decode_responses=True)

app = Flask(__name__)

# NOTE: this forms the starting point for the graph where all scores are assumed to be 0
startdate = dt(2017, 6, 5)

@app.route("/graph")
def graph():
	try:
		visits = r.incr("counter")
	except RedisError:
		visits = "<i>cannot connect to Redis, counter disabled</i>"

		# create a new plot with a title and axis labels
	p = figure(x_axis_type="datetime", y_axis_label="score")

	colors = ["red", "blue", "green", "black", "orange"]
	users = r.smembers("users")
	x_list= []
	y_list = []
	c = 0
	for user in users:
		y = [0]
		y.extend(r.zrange(user, 0, -1))
		x = [startdate]
		for _y in y:
			if _y is not 0:
				x.append(dt.fromtimestamp(int(r.zscore(user, _y))))

		#add a line to the plot using x and y values and username as legend
		p.line(x=x, y=y, legend=user, color=colors[c])
		c += 1
		

		

	
	script, div = components(p)
	return render_template('graph.html', script=script, div=div, visits=visits)

@app.route("/")
def rank():
	htmlbasis = "<div class=\"row\"> <div class=\"col-md-3 col-md-offset-4 \"> {username}</div> \
		<div class=\"col-md-3\"> {score} </div></div>"

	usersranks = r.zrevrange("ranks", 0, -1)

	page = ""
	for user in usersranks:
		tmp = htmlbasis[:]
		score = r.zscore("ranks", user)
		page += tmp.format(username=user, score=score)

	return render_template('ranks.html', ranks=page)




@app.route('/updatescore/<user>/<int:score>')
def updateScore(user, score):
	r.sadd("users", user)
	r.zadd(user, time.time(), score)
	r.zadd("ranks", score, user)
	#t = r.zrange(user, 0, -1)
	u = r.smembers("users")
	us = ""
	for x in u:
		us = us + " " + x
	return render_template('graph.html', visits=us)

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=82)