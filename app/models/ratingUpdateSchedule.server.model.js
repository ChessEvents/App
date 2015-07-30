'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var ratingUpdateScheduleSchema = new Schema({

	fileName: {
		type: String
	},
	body: {
		type: [{
			type: String,
			enum: ['ecf', 'fide', 'yca', 'other']
		}]
	},
	gameType: {
		type: [{
			type: String,
			enum: ['standard', 'rapidplay']
		}]
	},
	month: {
		type: [{
			type: String,
			enum: ['january', 'february', 'march','april','may','june','july','august', 'september', 'october', 'november', 'december']
		}]
	},
	year: {
		type: Number
	},
	processDate: {
		type: Date,
		default: null
	},
	isProcessing: {
		type: String,
		default: false
	},
	allowReprocess: {
		type: String,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('RatingUpdateSchedule', ratingUpdateScheduleSchema);	