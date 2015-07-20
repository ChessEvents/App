'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calendaritem = mongoose.model('Calendaritem');

/**
 * Globals
 */
var user, calendaritem;

/**
 * Unit tests
 */
describe('Calendaritem Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			calendaritem = new Calendaritem({
				name: 'Calendaritem Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return calendaritem.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			calendaritem.name = '';

			return calendaritem.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Calendaritem.remove().exec();
		User.remove().exec();

		done();
	});
});