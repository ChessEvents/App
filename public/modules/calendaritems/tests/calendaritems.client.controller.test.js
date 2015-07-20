'use strict';

(function() {
	// Calendaritems Controller Spec
	describe('Calendaritems Controller Tests', function() {
		// Initialize global variables
		var CalendaritemsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Calendaritems controller.
			CalendaritemsController = $controller('CalendaritemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Calendaritem object fetched from XHR', inject(function(Calendaritems) {
			// Create sample Calendaritem using the Calendaritems service
			var sampleCalendaritem = new Calendaritems({
				name: 'New Calendaritem'
			});

			// Create a sample Calendaritems array that includes the new Calendaritem
			var sampleCalendaritems = [sampleCalendaritem];

			// Set GET response
			$httpBackend.expectGET('calendaritems').respond(sampleCalendaritems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendaritems).toEqualData(sampleCalendaritems);
		}));

		it('$scope.findOne() should create an array with one Calendaritem object fetched from XHR using a calendaritemId URL parameter', inject(function(Calendaritems) {
			// Define a sample Calendaritem object
			var sampleCalendaritem = new Calendaritems({
				name: 'New Calendaritem'
			});

			// Set the URL parameter
			$stateParams.calendaritemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/calendaritems\/([0-9a-fA-F]{24})$/).respond(sampleCalendaritem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendaritem).toEqualData(sampleCalendaritem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Calendaritems) {
			// Create a sample Calendaritem object
			var sampleCalendaritemPostData = new Calendaritems({
				name: 'New Calendaritem'
			});

			// Create a sample Calendaritem response
			var sampleCalendaritemResponse = new Calendaritems({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendaritem'
			});

			// Fixture mock form input values
			scope.name = 'New Calendaritem';

			// Set POST response
			$httpBackend.expectPOST('calendaritems', sampleCalendaritemPostData).respond(sampleCalendaritemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Calendaritem was created
			expect($location.path()).toBe('/calendaritems/' + sampleCalendaritemResponse._id);
		}));

		it('$scope.update() should update a valid Calendaritem', inject(function(Calendaritems) {
			// Define a sample Calendaritem put data
			var sampleCalendaritemPutData = new Calendaritems({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendaritem'
			});

			// Mock Calendaritem in scope
			scope.calendaritem = sampleCalendaritemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/calendaritems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/calendaritems/' + sampleCalendaritemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid calendaritemId and remove the Calendaritem from the scope', inject(function(Calendaritems) {
			// Create new Calendaritem object
			var sampleCalendaritem = new Calendaritems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Calendaritems array and include the Calendaritem
			scope.calendaritems = [sampleCalendaritem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/calendaritems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCalendaritem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.calendaritems.length).toBe(0);
		}));
	});
}());