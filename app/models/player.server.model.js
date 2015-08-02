'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var reference = {
	refType: {
			type: [{ 
				type: String,
				lowercase: true,
				enum: ['fide', 'ecf', 'yca', 'uscf']
		}],
		default: ['ecf']
	},
	refID: {
		type: String
	},
	refUrl: {
		type: String
	}
};

var ratings = {
			ref: reference,
			ratings: [{
				gameRatingType: {
					type: [{
						type: String,
						lowercase: true,
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
			}]
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
	ratings: [ratings],
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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Player', PlayerSchema);	
