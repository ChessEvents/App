'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var organisers = require('../../app/controllers/organisers.server.controller');

	// Organisers Routes
	app.route('/organisers')
		.get(organisers.list)
		.post(users.requiresLogin, organisers.create);

	app.route('/organisers/:organiserId')
		.get(organisers.read)
		.put(users.requiresLogin, organisers.hasAuthorization, organisers.update)
		.delete(users.requiresLogin, organisers.hasAuthorization, organisers.delete);

	// Finish by binding the Organiser middleware
	app.param('organiserId', organisers.organiserByID);
};
