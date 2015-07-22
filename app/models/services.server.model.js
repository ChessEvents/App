'use strict';

// helpful notes: https://github.com/ncb000gt/node-cron

var CronJob = require('cron').CronJob;

var ECF_GRADE_DOWNLOAD =  new CronJob({
	cronTime: '* * * * * *', 
	onTick: function() {
  		var dateTime = new Date();
  		console.log('You will see this message every second ' + dateTime);
	},
	onComplete: function () {
		var dateTime = new Date();
		console.log('This job was completed at ' + dateTime);
	},
	start: false,
	timeZone: null
});

// ECF_GRADE_DOWNLOAD.start();