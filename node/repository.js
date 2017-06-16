module.exports = {
	fs: require('fs'), 

	getCurrentDateString: function() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHour() + 1) + "-" + (date.getMinute() + 1);
	}
	/*addScoreToUser : function(user, score) {
		var d = new Date();

		let dateString = "" + d.getFullYear() + "-" + 
	}*/
}