'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calendaritem Schema
 */
var CalendaritemSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Calendaritem name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill out some details about this event',
		trim: true
	},
	headline: {
		type: String,
		default: '',
		required: 'Please give this event a headline',
		trim: true
	},
	start: {
		type: Date,
		default: Date.now
	},
	end: {
		type: Date,
		default: null
	},
	organiser: {
		type: Schema.ObjectId,
		ref: 'Organiser'
	},
	eventType: {
		type: [{
			type: String,
			enum: ['congress', 'rapidplay', 'other']
		}],
		default: ['congress']
	},
	ratingType: {
		type: [{
			type: String,
			enum: ['ecf', 'fide', 'yca', 'Other']
		}],
		default : ['ecf']
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Calendaritem', CalendaritemSchema);