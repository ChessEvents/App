'use strict';

(function() {
	// Organisers Controller Spec
	describe('Organisers Controller Tests', function() {
		// Initialize global variables
		var OrganisersController,
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

			// Initialize the Organisers controller.
			OrganisersController = $controller('OrganisersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Organiser object fetched from XHR', inject(function(Organisers) {
			// Create sample Organiser using the Organisers service
			var sampleOrganiser = new Organisers({
				name: 'New Organiser'
			});

			// Create a sample Organisers array that includes the new Organiser
			var sampleOrganisers = [sampleOrganiser];

			// Set GET response
			$httpBackend.expectGET('organisers').respond(sampleOrganisers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organisers).toEqualData(sampleOrganisers);
		}));

		it('$scope.findOne() should create an array with one Organiser object fetched from XHR using a organiserId URL parameter', inject(function(Organisers) {
			// Define a sample Organiser object
			var sampleOrganiser = new Organisers({
				name: 'New Organiser'
			});

			// Set the URL parameter
			$stateParams.organiserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/organisers\/([0-9a-fA-F]{24})$/).respond(sampleOrganiser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organiser).toEqualData(sampleOrganiser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Organisers) {
			// Create a sample Organiser object
			var sampleOrganiserPostData = new Organisers({
				name: 'New Organiser'
			});

			// Create a sample Organiser response
			var sampleOrganiserResponse = new Organisers({
				_id: '525cf20451979dea2c000001',
				name: 'New Organiser'
			});

			// Fixture mock form input values
			scope.name = 'New Organiser';

			// Set POST response
			$httpBackend.expectPOST('organisers', sampleOrganiserPostData).respond(sampleOrganiserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Organiser was created
			expect($location.path()).toBe('/organisers/' + sampleOrganiserResponse._id);
		}));

		it('$scope.update() should update a valid Organiser', inject(function(Organisers) {
			// Define a sample Organiser put data
			var sampleOrganiserPutData = new Organisers({
				_id: '525cf20451979dea2c000001',
				name: 'New Organiser'
			});

			// Mock Organiser in scope
			scope.organiser = sampleOrganiserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/organisers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organisers/' + sampleOrganiserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid organiserId and remove the Organiser from the scope', inject(function(Organisers) {
			// Create new Organiser object
			var sampleOrganiser = new Organisers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Organisers array and include the Organiser
			scope.organisers = [sampleOrganiser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/organisers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOrganiser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.organisers.length).toBe(0);
		}));
	});
}());