'use strict';

// Calendaritems controller
angular.module('calendaritems').controller('CalendaritemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendaritems',
	function($scope, $stateParams, $location, Authentication, Calendaritems) {
		$scope.authentication = Authentication;

		// Create new Calendaritem
		$scope.create = function() {
			// Create new Calendaritem object
			var calendaritem = new Calendaritems ({
				name: this.name
			});

			// Redirect after save
			calendaritem.$save(function(response) {
				$location.path('calendaritems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Calendaritem
		$scope.remove = function(calendaritem) {
			if ( calendaritem ) { 
				calendaritem.$remove();

				for (var i in $scope.calendaritems) {
					if ($scope.calendaritems [i] === calendaritem) {
						$scope.calendaritems.splice(i, 1);
					}
				}
			} else {
				$scope.calendaritem.$remove(function() {
					$location.path('calendaritems');
				});
			}
		};

		// Update existing Calendaritem
		$scope.update = function() {
			var calendaritem = $scope.calendaritem;

			calendaritem.$update(function() {
				$location.path('calendaritems/' + calendaritem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Calendaritems
		$scope.find = function() {
			$scope.calendaritems = Calendaritems.query();
		};

		// Find existing Calendaritem
		$scope.findOne = function() {
			$scope.calendaritem = Calendaritems.get({ 
				calendaritemId: $stateParams.calendaritemId
			});
		};
	}
]);