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