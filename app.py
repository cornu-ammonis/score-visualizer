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
import secrets

"""
TO DO
( ) documentation
( ) automatically determine the start date on first run 
(x) include link to graph page on rank page
( ) better determine graph size
( ) modify score updating to be secured post request or api call
( ) include mobile bootstrap column sizes i
( ) more colors for lines

( ) make lines stay straight between updates
( ) replace legend with hovering over the lines to display names (js on hover handler for line with id)

"""


# THERE IS ONE CONFUSING THING IN THIS FILE - the graph method employs some trickery to make the graph lines
# step between values rather than sloping. it does this by creating two points for every score - one with
# the timestamp at which the user reached that score, and one with the timestamp at which the user reached 
# another score. it does this so that there will be a straight line between the two time-endpoints at which
# the user had a particular score, and then a line will be drawn between the "phantom" point and the next score's 
# starting point, making the graph step. 


# api wrapper for all database interactions
class Repository(object):

	# updates score for specified user
	# @param user - string uniquely identifying user
	# @param score - integer/double representing score
	def updateScore(self, user, score):
		# makes sure user is in list of users
		r.sadd("users", user)
		
		# adds score with current timstamp
		r.zadd(user, time.time(), score)
		
		# adds score to the ranking list
		r.zadd("ranks", score, user)

	# @returns a list of all users in the users 'table'
	def listUsers(self):
		return r.smembers("users")

	# @returns a list of users sorted from highest score to lowest score
	def listUsersOrderedByScore(self):
		return r.zrevrange("ranks", 0, -1)

	# @param user - string uniquely identifying user 
	# @returns - score for that user 
	def scoreForUser(self, user):
		return r.zscore("ranks", user)

	# @param user - string uniquely identifying user
	# @returns - a list of scores which this user has had. 
	#    essentially the y values for a scores vs time graph (x values sold separately)
	def scoresForUserOverTime(self, user):
		return r.zrange(user, 0, -1)

	# @param user - string uniquely identifying a user 
	# @param score - a score the user had at one time
	# @returns - the integer timestamp for that score (in ms, not datatime)
	def timestampForUserScore(self, user, score):
		return int(r.zscore(user, score))




_repo = Repository()

# Connect to Redis
r = redis.StrictRedis(host="localhost", decode_responses=True, password=secrets.redispw)
#r = redis.StrictRedis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2, decode_responses=True)

app = Flask(__name__)

# NOTE: this forms the starting point for the graph where all scores are assumed to be 0
startdate = dt(2017, 6, 5)



# displays the scores over time graph
@app.route("/graph")
def graph():
	try:
		visits = r.incr("counter")
	except RedisError:
		visits = "<i>cannot connect to Redis, counter disabled</i>"

	# create a new plot with a title and axis labels
	p = figure(width=1000, x_axis_type="datetime", y_axis_label="score", title="scores over time")

	colors = ["red", "blue", "green", "black", "orange"]
	users = _repo.listUsers()

	# tracks which colors we've used
	c = 0
	for user in users:

		# first two points are 0 because it starts at zero and replicates 
		# that value at the x for the first real scor
		# SEE COMMENT AT TOP OF FILE
		y = [0, 0]
		scores = _repo.scoresForUserOverTime(user)

		#gives startdate and date of first datapoint
		x = [startdate, dt.fromtimestamp( _repo.timestampForUserScore(user, scores[0]) ) ]
		
		for _y in range(len(scores)):
			
			# this is where the phantom point is created beneath every point except the 
			# first one - SEE COMMENT AT TOP OF FILE
			if _y != 0:
				y.append(scores[ _y - 1])
				x.append(dt.fromtimestamp(_repo.timestampForUserScore(user, scores[ _y ])))
			
			# this is where the true points get added to the graph
			y.append(scores[_y])
			x.append(dt.fromtimestamp(_repo.timestampForUserScore(user, scores[ _y ])))


		# recreate last score at current timestamp
		x.append(dt.fromtimestamp(time.time()))
		y.append(y[len(y) - 1])
			



		#add a line to the plot using x and y values and username as legend
		p.line(x=x, y=y, legend=user, color=colors[c], line_width=2)
		c += 1
	
	script, div = components(p)
	return render_template('graph.html', script=script, div=div, visits=visits)


# displays sorted scoreboard of users with their scores
@app.route("/")
def rank():
	htmlbasis = "<div class=\"row\"> <div class=\"col-md-3 col-md-offset-4 \"> {username}</div> \
		<div class=\"col-md-3\"> {score} </div></div>"

	usersranks = _repo.listUsersOrderedByScore()

	page = ""
	for user in usersranks:
		tmp = htmlbasis[:]
		score = _repo.scoreForUser(user)
		page += tmp.format(username=user, score=score)

	return render_template('ranks.html', ranks=page)




# updates a user's score
@app.route('/updatescore/<user>/<int:score>')
def updateScore(user, score):
	_repo.updateScore(user, score)
	#t = r.zrange(user, 0, -1)
	u = _repo.listUsers()
	us = ""
	for x in u:
		us = us + " " + x
	return render_template('users.html', users=us)

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=82)