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

	addScoreToUser : function(user, score) {
		let dateString = this.getCurrentDateString();

		if(!this.fs.existsSync('./data/userscores.json')) {
			let data = {users: [], points: []};
			data.users.push(user);

			points = []; 
			points[0] = {date: dateString, value: score};
			data.points.push(points);
			fs.writeFileSync('./data/userscores.json', JSON.stringify(data));
		}
		else {
			let data = require('./data/userscores.json');
			let userAlreadyExisted = false;
			for (let i = 0; i < data.users.length; i++) {
				if (data.users[i] === user) {
					userAlreadyExisted = true;
					data.points[i].push({date: dateString, value: score});
				}
			}

			if (!userAlreadyExisted) {
				data.users.push(user);
				data.points.push([{date: dateString, value: score}]);
			}
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

	convertLineToScore : function(line, subtractForIncorrect, TotalPoints) {
		console.log(line);
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