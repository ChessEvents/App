'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organiser Schema
 */
var OrganiserSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Organiser name',
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

mongoose.model('Organiser', OrganiserSchema);