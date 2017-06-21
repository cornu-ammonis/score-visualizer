module.exports = {
	fs: require('fs'), 

	getCurrentDateString: function() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
	}, 

	updateUserRank : function (userName, score) {
		if (!this.fs.existsSync('./data/userranks.json')) {
			let dataList = [];
			let user = {name: userName, score: score};
			dataList.push(user);
			this.fs.writeFileSync('./data/userranks.json', JSON.stringify(dataList));
		}
		else {
			let dataList = require('./data/userranks.json');

			let alreadyExisted = false;

			for (let i = 0; i < dataList.length; i++) {
				
				// user already in list; update their score
				if (dataList[i].name === userName) {
					alreadyExisted = true;
					dataList[i].score = score;
				}
			}

			if (!alreadyExisted) {
				let user = {name: userName, score: score};
				dataList.push(user);
			}

			// sort by score descending
			dataList.sort(function(a, b) {
				return b.score - a.score;
			}); 

			this.fs.writeFileSync('./data/userranks.json', JSON.stringify(dataList));
		}
	},

	addScoreToUser : function(user, score, dateString = this.getCurrentDateString() ) {

		if(!this.fs.existsSync('./data/userscores.json')) {
			let data = {users: [], points: []};
			data.users.push(user);

			points = []; 
			points[0] = {date: dateString, value: score};
			data.points.push(points);
			this.fs.writeFileSync('./data/userscores.json', JSON.stringify(data));
		}
		else {
			let data = require('./data/userscores.json');
			let userAlreadyExisted = false;
			for (let i = 0; i < data.users.length; i++) {
				if (data.users[i] === user) {
					console.log('data - ' + data.users[i]);
					console.log(user);
					userAlreadyExisted = true;
					if (data.points[i] === undefined) {
						data.points[i] = [{date: dateString, value: score}];
					}
					else {
						data.points[i].push({date: dateString, value: score});
					}
					
				}
			}

			if (!userAlreadyExisted) {
				data.users.push(user);
				data.points.push([{date: dateString, value: score}]);
			}

			this.fs.writeFileSync('./data/userscores.json', JSON.stringify(data));
		}

		this.updateUserRank(user, score);
	}, 


	// attempts to read in data from ./data/userscores.json - returns a list of 
	//    objects with points -- a list of lists of points -- and users, usernames corresponding
	//    to the respective index in .points
	// if no file is found, returns null. if something goes wrong reading in the value, returns nothing (undefined)
	retrieveUserScores : function () {

		// no file, return null
		if (!this.fs.existsSync('./data/userscores.json')) {
			return null;
		}

		try {
			return require('./data/userscores.json');
		}
		catch (e) {
			console.log (e.message);
		}

	},

	retrieveUserRanks : function () {
		if (!this.fs.existsSync('./data/userranks.json')) {
			return null;
		}

		try {
			return require('./data/userranks.json');
		}
		catch (e) {
			console.log(e.message);
		}
	},

	convertTsToDate : function(unixTimeStamp) {
		let date = new Date(parseInt(unixTimeStamp)*1000);
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
	},

	// TOP_SECRET//ICTERUSPIPIEST/UNRASPYMERCY//C0RE	1497913534	UNIXAddress(None)	1

	// TO DO - optimize to do it all in memory rather than i/o
	convertLineToScore : function(line, subtractForIncorrect, TotalPoints) {
		let users = this.retrieveUserRanks();
		let linearr = line.split('\t');
		let flagwords = line.split('/');
		let userName = flagwords[3];

		let userAlreadyRecorded = false;
		let usersCurrentScore = -1;
		if (users) {
			for (let i = 0; i < users.length; i++) {
			if (users[i].name === userName) {
				userAlreadyRecorded = true;
				usersCurrentScore = users[i].score;
				break;
			}
		}
		}

		// new user - initialize with a 0 value and then give current value
		if (!userAlreadyRecorded) {
			this.addScoreToUser(userName, 0, "2017-6-19-00-00");
			let score = 10 - (.2 * (parseInt(linearr[3]) - 1));
			score = Math.round(score*10)/10;
			//console.log(score);
			this.addScoreToUser(userName, score, this.convertTsToDate(linearr[1]))
		}
		else {
			/*let score = usersCurrentScore - (.2 * (parseInt(linearr[3])));
			score = Math.round(score*10)/10;
			this.addScoreToUser(userName, score, this.convertTsToDate(linearr[1])); */
			//return;
		}
		console.log(userName);
	}, 

	// currently hard coded for the reverse assignment, needs to be generalized
	readScoresFromSolvedFile : function() {
		if (this.fs.existsSync('./data/solved.txt')) {
			let arr = this.fs.readFileSync('./data/solved.txt').toString().split('\n');

			for (let i = 0; i < arr.length; i++) {
				this.convertLineToScore(arr[i], true, 10);
			}
		}
	}
}