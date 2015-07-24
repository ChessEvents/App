'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Player = mongoose.model('Player'),
	_ = require('lodash');


/**
 * Create a Player
 */
exports.create = function(req, res) {
	var player = new Player(req.body);

	player.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
};