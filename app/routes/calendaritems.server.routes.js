'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var calendaritems = require('../../app/controllers/calendaritems.server.controller');

	// Calendaritems Routes
	app.route('/calendaritems')
		.get(calendaritems.list)
		.post(users.requiresLogin, calendaritems.create);

	app.route('/calendaritems/:calendaritemId')
		.get(calendaritems.read)
		.put(users.requiresLogin, calendaritems.hasAuthorization, calendaritems.update)
		.delete(users.requiresLogin, calendaritems.hasAuthorization, calendaritems.delete);

	// Finish by binding the Calendaritem middleware
	app.param('calendaritemId', calendaritems.calendaritemByID);
};
