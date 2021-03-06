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
			let data =  JSON.parse(this.fs.readFileSync('./data/userscores.json'));
			this.fs.writeFileSync('./data/userscores.json', '');
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
			return JSON.parse(this.fs.readFileSync('./data/userscores.json').toString());
		}
		catch (e) {
			console.log (e.message);
		}

	},

	// attempts to find the score for a particular user according to username
	//   returns null if file not found
	//   returns undefined if error parsing file
	//   returns -1 if the user is not found.
	retrieveOneUserScore : function(userName) {

		data = this.retrieveUserScores();

		// no file to read in 
		if (data === null) {
			return null;
		}

		// error parsing file
		if (data === undefined) {
			return;
		}

		for (let i = 0; i < data.users.length; i++) {
			if (data.users[i] === userName) {
				return data.points[i];
			}
		}

		// never found a user matching the name, data is empty
		return -1;
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


 	// TO DO - pull current score to increment it 
	convertLineToScore : function(line, userName = undefined) {
		let linearr = line.split('\t');
		let flagwords = line.split('/');
		
		// not an alias - so initialize their 0 score and name
		if (userName === undefined) {
			console.log('initializing');
			userName = flagwords[3];
			this.addScoreToUser(userName, 0, "2017-6-18-00-00");
			this.addScoreToUser(userName, 10, this.convertTsToDate(linearr[1]));
		}
		else {
			let ranks = this.retrieveUserRanks();

			for (let i = 0; i < ranks.length; i++) {
				if (ranks[i].name === userName) {
					let newScore = parseInt(ranks[i].score) + 10;
					this.addScoreToUser(userName, newScore, this.convertTsToDate(linearr[1]));
					return;
				}
			}

			//this.addScoreToUser(userName, 20, this.convertTsToDate(linearr[1]));
		}


	},

	// currently hard coded for the reverse assignment, needs to be generalized
	readScoresFromSolvedFile : function() {

		try {
			this.fs.unlinkSync('./data/userscores.json');
		}
		catch (e) {
			console.log('exception when deleting scores');
		}
		
		if (this.fs.existsSync('./data/solved.txt')) {

			let arr = this.fs.readFileSync('./data/solved.txt').toString().split('\n');
			let aliases = JSON.parse(this.fs.readFileSync('./data/aliases.json').toString());
			let seen = {};
			for (let i = 0; i < arr.length; i++) {
				let line = arr[i];
				let linearr = line.split('\t');
				let flagwords = line.split('/');
				let userName = flagwords[3];
				if (seen[userName]) {
					continue;
				}
				else {
					seen[userName] = true;
					let isAlias = true;
					for (let j = 0; j < aliases.users.length; j++) {
						if (aliases.users[j] === userName) {
							isAlias = false;
							this.convertLineToScore(arr[i])
						}
					}

					if (isAlias) {
						console.log("alias: " + userName);
						for (let j = 0; j < aliases.users.length; j++) {
							for (let k = 0; k < aliases.aliases[j].length; k++) {
								if (aliases.aliases[j][k] === userName) {
									this.convertLineToScore(arr[i], aliases.users[j]);
									break;
								}
							}
						}
					}
					//this.convertLineToScore(arr[i], true, 10);
				}
				
			}
		}
	}
}