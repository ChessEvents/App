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
			lowercase: true,
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
			lowercase: true,
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
	waitingForProcess: {
		type: Boolean,
		default: false
	},
	isProcessing: {
		type: Boolean,
		default: false
	},
	allowReprocess: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('RatingUpdateSchedule', ratingUpdateScheduleSchema);	