'use strict';

// Organisers controller
angular.module('organisers').controller('OrganisersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organisers',
	function($scope, $stateParams, $location, Authentication, Organisers) {
		$scope.authentication = Authentication;

		// Create new Organiser
		$scope.create = function() {
			// Create new Organiser object
			var organiser = new Organisers ({
				name: this.name,
				email: this.email,
				telephone: this.telephone
			});

			// Redirect after save
			organiser.$save(function(response) {
				$location.path('organisers/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.email = '';
				$scope.telephone = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Organiser
		$scope.remove = function(organiser) {
			if ( organiser ) { 
				organiser.$remove();

				for (var i in $scope.organisers) {
					if ($scope.organisers [i] === organiser) {
						$scope.organisers.splice(i, 1);
					}
				}
			} else {
				$scope.organiser.$remove(function() {
					$location.path('organisers');
				});
			}
		};

		// Update existing Organiser
		$scope.update = function() {
			var organiser = $scope.organiser;

			organiser.$update(function() {
				$location.path('organisers/' + organiser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organisers
		$scope.find = function() {
			$scope.organisers = Organisers.query();
		};

		// Find existing Organiser
		$scope.findOne = function() {
			$scope.organiser = Organisers.get({ 
				organiserId: $stateParams.organiserId
			});
		};
	}
]);