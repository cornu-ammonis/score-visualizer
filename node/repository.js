module.exports = {
	fs: require('fs'), 

	getCurrentDateString: function() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
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
	}
}