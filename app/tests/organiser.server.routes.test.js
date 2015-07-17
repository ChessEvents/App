'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organiser = mongoose.model('Organiser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, organiser;

/**
 * Organiser routes tests
 */
describe('Organiser CRUD tests', function() {
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

		// Save a user to the test db and create new Organiser
		user.save(function() {
			organiser = {
				name: 'Organiser Name'
			};

			done();
		});
	});

	it('should be able to save Organiser instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organiser
				agent.post('/organisers')
					.send(organiser)
					.expect(200)
					.end(function(organiserSaveErr, organiserSaveRes) {
						// Handle Organiser save error
						if (organiserSaveErr) done(organiserSaveErr);

						// Get a list of Organisers
						agent.get('/organisers')
							.end(function(organisersGetErr, organisersGetRes) {
								// Handle Organiser save error
								if (organisersGetErr) done(organisersGetErr);

								// Get Organisers list
								var organisers = organisersGetRes.body;

								// Set assertions
								(organisers[0].user._id).should.equal(userId);
								(organisers[0].name).should.match('Organiser Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Organiser instance if not logged in', function(done) {
		agent.post('/organisers')
			.send(organiser)
			.expect(401)
			.end(function(organiserSaveErr, organiserSaveRes) {
				// Call the assertion callback
				done(organiserSaveErr);
			});
	});

	it('should not be able to save Organiser instance if no name is provided', function(done) {
		// Invalidate name field
		organiser.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organiser
				agent.post('/organisers')
					.send(organiser)
					.expect(400)
					.end(function(organiserSaveErr, organiserSaveRes) {
						// Set message assertion
						(organiserSaveRes.body.message).should.match('Please fill Organiser name');
						
						// Handle Organiser save error
						done(organiserSaveErr);
					});
			});
	});

	it('should be able to update Organiser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organiser
				agent.post('/organisers')
					.send(organiser)
					.expect(200)
					.end(function(organiserSaveErr, organiserSaveRes) {
						// Handle Organiser save error
						if (organiserSaveErr) done(organiserSaveErr);

						// Update Organiser name
						organiser.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Organiser
						agent.put('/organisers/' + organiserSaveRes.body._id)
							.send(organiser)
							.expect(200)
							.end(function(organiserUpdateErr, organiserUpdateRes) {
								// Handle Organiser update error
								if (organiserUpdateErr) done(organiserUpdateErr);

								// Set assertions
								(organiserUpdateRes.body._id).should.equal(organiserSaveRes.body._id);
								(organiserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Organisers if not signed in', function(done) {
		// Create new Organiser model instance
		var organiserObj = new Organiser(organiser);

		// Save the Organiser
		organiserObj.save(function() {
			// Request Organisers
			request(app).get('/organisers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Organiser if not signed in', function(done) {
		// Create new Organiser model instance
		var organiserObj = new Organiser(organiser);

		// Save the Organiser
		organiserObj.save(function() {
			request(app).get('/organisers/' + organiserObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', organiser.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Organiser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organiser
				agent.post('/organisers')
					.send(organiser)
					.expect(200)
					.end(function(organiserSaveErr, organiserSaveRes) {
						// Handle Organiser save error
						if (organiserSaveErr) done(organiserSaveErr);

						// Delete existing Organiser
						agent.delete('/organisers/' + organiserSaveRes.body._id)
							.send(organiser)
							.expect(200)
							.end(function(organiserDeleteErr, organiserDeleteRes) {
								// Handle Organiser error error
								if (organiserDeleteErr) done(organiserDeleteErr);

								// Set assertions
								(organiserDeleteRes.body._id).should.equal(organiserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Organiser instance if not signed in', function(done) {
		// Set Organiser user 
		organiser.user = user;

		// Create new Organiser model instance
		var organiserObj = new Organiser(organiser);

		// Save the Organiser
		organiserObj.save(function() {
			// Try deleting Organiser
			request(app).delete('/organisers/' + organiserObj._id)
			.expect(401)
			.end(function(organiserDeleteErr, organiserDeleteRes) {
				// Set message assertion
				(organiserDeleteRes.body.message).should.match('User is not logged in');

				// Handle Organiser error error
				done(organiserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Organiser.remove().exec();
		done();
	});
});