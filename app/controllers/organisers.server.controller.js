'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organiser = mongoose.model('Organiser'),
	_ = require('lodash');

/**
 * Create a Organiser
 */
exports.create = function(req, res) {
	var organiser = new Organiser(req.body);
	organiser.user = req.user;

	organiser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organiser);
		}
	});
};

/**
 * Show the current Organiser
 */
exports.read = function(req, res) {
	res.jsonp(req.organiser);
};

/**
 * Update a Organiser
 */
exports.update = function(req, res) {
	var organiser = req.organiser ;

	organiser = _.extend(organiser , req.body);

	organiser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organiser);
		}
	});
};

/**
 * Delete an Organiser
 */
exports.delete = function(req, res) {
	var organiser = req.organiser ;

	organiser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organiser);
		}
	});
};

/**
 * List of Organisers
 */
exports.list = function(req, res) { 
	Organiser.find().sort('-created').populate('user', 'displayName').exec(function(err, organisers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organisers);
		}
	});
};

/**
 * Organiser middleware
 */
exports.organiserByID = function(req, res, next, id) { 
	Organiser.findById(id).populate('user', 'displayName').exec(function(err, organiser) {
		if (err) return next(err);
		if (! organiser) return next(new Error('Failed to load Organiser ' + id));
		req.organiser = organiser ;
		next();
	});
};

/**
 * Organiser authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.organiser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
