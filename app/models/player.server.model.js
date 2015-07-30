'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var rating = {
			ratingType: {
				type: [{
					type: String,
					enum: ['fide', 'ecf', 'yca', 'uscf']
				}],
				default: ['ecf']
			},
			gameRatingType: {
				type: [{
					type: String,
					enum: ['standard', 'rapidplay', 'blitz', 'bullet']
				}],
				default: ['standard']
			},
			rating: {
				type: Number
			},
			ratingDate: {
				type: Date
			},
			ratingRef: {
				type: String,
				trim: true
			},
			created: {
				type: Date,
				default: Date.now
			}
};

var reference = {
	refType: {
			type: [{ 
		type: String,
			enum: ['fide', 'ecf', 'yca', 'uscf']
		}],
		default: ['ecf']
	},
	refID: {
		type: String
	}
};

var PlayerSchema = new Schema({
	forename: {
		type: String,
		default: '',
		trim: true
	},
	surname: {
		type: String,
		default: '',
		trim: true
	},
	ratings: [rating],
	sex: {
		type: [{
			type: String,
			enum: ['male', 'female']
		}]
	},
	created: {
		type: Date,
		default: Date.now
	},
	ref: [reference],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Player', PlayerSchema);	