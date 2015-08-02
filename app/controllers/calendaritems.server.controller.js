'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Calendaritem = mongoose.model('Calendaritem'),
	_ = require('lodash');

/**
 * Create a Calendaritem
 */
exports.create = function(req, res) {
	var calendaritem = new Calendaritem(req.body);
	calendaritem.user = req.user;

	console.log('The organiser object :' + req.organiser);

	calendaritem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendaritem);
		}
	});
};

/**
 * Show the current Calendaritem
 */
exports.read = function(req, res) {
	res.jsonp(req.calendaritem);
};

/**
 * Update a Calendaritem
 */
exports.update = function(req, res) {
	var calendaritem = req.calendaritem ;

	calendaritem = _.extend(calendaritem , req.body);

	calendaritem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendaritem);
		}
	});
};

/**
 * Delete an Calendaritem
 */
exports.delete = function(req, res) {
	var calendaritem = req.calendaritem ;

	calendaritem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendaritem);
		}
	});
};

/**
 * List of Calendaritems
 */
exports.list = function(req, res) { 
	Calendaritem.find().sort('-created').populate('user', 'displayName').exec(function(err, calendaritems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendaritems);
		}
	});
};

/**
 * Calendaritem middleware
 */
exports.calendaritemByID = function(req, res, next, id) { 
	Calendaritem.findById(id).populate('user', 'displayName').exec(function(err, calendaritem) {
		if (err) return next(err);
		if (! calendaritem) return next(new Error('Failed to load Calendaritem ' + id));
		req.calendaritem = calendaritem ;
		next();
	});
};

/**
 * Calendaritem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.calendaritem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
