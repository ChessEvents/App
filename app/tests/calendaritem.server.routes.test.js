'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calendaritem = mongoose.model('Calendaritem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, calendaritem;

/**
 * Calendaritem routes tests
 */
describe('Calendaritem CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Calendaritem
		user.save(function() {
			calendaritem = {
				name: 'Calendaritem Name'
			};

			done();
		});
	});

	it('should be able to save Calendaritem instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendaritem
				agent.post('/calendaritems')
					.send(calendaritem)
					.expect(200)
					.end(function(calendaritemSaveErr, calendaritemSaveRes) {
						// Handle Calendaritem save error
						if (calendaritemSaveErr) done(calendaritemSaveErr);

						// Get a list of Calendaritems
						agent.get('/calendaritems')
							.end(function(calendaritemsGetErr, calendaritemsGetRes) {
								// Handle Calendaritem save error
								if (calendaritemsGetErr) done(calendaritemsGetErr);

								// Get Calendaritems list
								var calendaritems = calendaritemsGetRes.body;

								// Set assertions
								(calendaritems[0].user._id).should.equal(userId);
								(calendaritems[0].name).should.match('Calendaritem Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Calendaritem instance if not logged in', function(done) {
		agent.post('/calendaritems')
			.send(calendaritem)
			.expect(401)
			.end(function(calendaritemSaveErr, calendaritemSaveRes) {
				// Call the assertion callback
				done(calendaritemSaveErr);
			});
	});

	it('should not be able to save Calendaritem instance if no name is provided', function(done) {
		// Invalidate name field
		calendaritem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendaritem
				agent.post('/calendaritems')
					.send(calendaritem)
					.expect(400)
					.end(function(calendaritemSaveErr, calendaritemSaveRes) {
						// Set message assertion
						(calendaritemSaveRes.body.message).should.match('Please fill Calendaritem name');
						
						// Handle Calendaritem save error
						done(calendaritemSaveErr);
					});
			});
	});

	it('should be able to update Calendaritem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendaritem
				agent.post('/calendaritems')
					.send(calendaritem)
					.expect(200)
					.end(function(calendaritemSaveErr, calendaritemSaveRes) {
						// Handle Calendaritem save error
						if (calendaritemSaveErr) done(calendaritemSaveErr);

						// Update Calendaritem name
						calendaritem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Calendaritem
						agent.put('/calendaritems/' + calendaritemSaveRes.body._id)
							.send(calendaritem)
							.expect(200)
							.end(function(calendaritemUpdateErr, calendaritemUpdateRes) {
								// Handle Calendaritem update error
								if (calendaritemUpdateErr) done(calendaritemUpdateErr);

								// Set assertions
								(calendaritemUpdateRes.body._id).should.equal(calendaritemSaveRes.body._id);
								(calendaritemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Calendaritems if not signed in', function(done) {
		// Create new Calendaritem model instance
		var calendaritemObj = new Calendaritem(calendaritem);

		// Save the Calendaritem
		calendaritemObj.save(function() {
			// Request Calendaritems
			request(app).get('/calendaritems')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Calendaritem if not signed in', function(done) {
		// Create new Calendaritem model instance
		var calendaritemObj = new Calendaritem(calendaritem);

		// Save the Calendaritem
		calendaritemObj.save(function() {
			request(app).get('/calendaritems/' + calendaritemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', calendaritem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Calendaritem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendaritem
				agent.post('/calendaritems')
					.send(calendaritem)
					.expect(200)
					.end(function(calendaritemSaveErr, calendaritemSaveRes) {
						// Handle Calendaritem save error
						if (calendaritemSaveErr) done(calendaritemSaveErr);

						// Delete existing Calendaritem
						agent.delete('/calendaritems/' + calendaritemSaveRes.body._id)
							.send(calendaritem)
							.expect(200)
							.end(function(calendaritemDeleteErr, calendaritemDeleteRes) {
								// Handle Calendaritem error error
								if (calendaritemDeleteErr) done(calendaritemDeleteErr);

								// Set assertions
								(calendaritemDeleteRes.body._id).should.equal(calendaritemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Calendaritem instance if not signed in', function(done) {
		// Set Calendaritem user 
		calendaritem.user = user;

		// Create new Calendaritem model instance
		var calendaritemObj = new Calendaritem(calendaritem);

		// Save the Calendaritem
		calendaritemObj.save(function() {
			// Try deleting Calendaritem
			request(app).delete('/calendaritems/' + calendaritemObj._id)
			.expect(401)
			.end(function(calendaritemDeleteErr, calendaritemDeleteRes) {
				// Set message assertion
				(calendaritemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Calendaritem error error
				done(calendaritemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Calendaritem.remove().exec();
		done();
	});
});