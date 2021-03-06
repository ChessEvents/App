'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'chessevents';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('calendaritems');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('organisers');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('players');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('calendaritems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Events', 'calendaritems', 'dropdown', '/calendaritems(/create)?');
		Menus.addSubMenuItem('topbar', 'calendaritems', 'List Events', 'calendaritems');
		Menus.addSubMenuItem('topbar', 'calendaritems', 'New Event', 'calendaritems/create');
	}
]);
'use strict';

//Setting up route
angular.module('calendaritems').config(['$stateProvider',
	function($stateProvider) {
		// Calendaritems state routing
		$stateProvider.
		state('listCalendaritems', {
			url: '/calendaritems',
			templateUrl: 'modules/calendaritems/views/list-calendaritems.client.view.html'
		}).
		state('createCalendaritem', {
			url: '/calendaritems/create',
			templateUrl: 'modules/calendaritems/views/create-calendaritem.client.view.html'
		}).
		state('viewCalendaritem', {
			url: '/calendaritems/:calendaritemId',
			templateUrl: 'modules/calendaritems/views/view-calendaritem.client.view.html'
		}).
		state('editCalendaritem', {
			url: '/calendaritems/:calendaritemId/edit',
			templateUrl: 'modules/calendaritems/views/edit-calendaritem.client.view.html'
		});
	}
]);
'use strict';

// Calendaritems controller
angular.module('calendaritems').controller('CalendaritemsController', 
	['$scope', '$stateParams', '$location', 'Authentication', 'Calendaritems', 'Organisers',
	function($scope, $stateParams, $location, Authentication, Calendaritems, Organisers) {
		$scope.authentication = Authentication;

		// Populates dropdown:
		$scope.organisers = Organisers.query();
		$scope.selectedOrganiser = null;

		// Create new Calendaritem
		$scope.create = function() {
			// Create new Calendaritem object


			var calendaritem = new Calendaritems ({
				name: this.name,
				description: this.description,
				headline: this.headline,
				organiser: $scope.selectedOrganiser,
				start: this.start,
				end: this.end
			});

			// Redirect after save
			calendaritem.$save(function(response) {
				$location.path('calendaritems/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.headline = '';
				$scope.selectedOrganiser = null;
				$scope.start = Date.now;
				$scope.end = null;

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
'use strict';

//Calendaritems service used to communicate Calendaritems REST endpoints
angular.module('calendaritems').factory('Calendaritems', ['$resource',
	function($resource) {
		return $resource('calendaritems/:calendaritemId', { calendaritemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Calendaritems', 'Players',
	function($scope, Authentication, Calendaritems, Players) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Get a list of calendar items
		$scope.calendaritems = Calendaritems.query({ limit: 10 });

		$scope.players = Players.count();

		console.log($scope.players);
		
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('organisers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Organisers', 'organisers', 'dropdown', '/organisers(/create)?');
		Menus.addSubMenuItem('topbar', 'organisers', 'List Organisers', 'organisers');
		Menus.addSubMenuItem('topbar', 'organisers', 'New Organiser', 'organisers/create');
	}
]);
'use strict';

//Setting up route
angular.module('organisers').config(['$stateProvider',
	function($stateProvider) {
		// Organisers state routing
		$stateProvider.
		state('listOrganisers', {
			url: '/organisers',
			templateUrl: 'modules/organisers/views/list-organisers.client.view.html'
		}).
		state('createOrganiser', {
			url: '/organisers/create',
			templateUrl: 'modules/organisers/views/create-organiser.client.view.html'
		}).
		state('viewOrganiser', {
			url: '/organisers/:organiserId',
			templateUrl: 'modules/organisers/views/view-organiser.client.view.html'
		}).
		state('editOrganiser', {
			url: '/organisers/:organiserId/edit',
			templateUrl: 'modules/organisers/views/edit-organiser.client.view.html'
		});
	}
]);
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
'use strict';

//Organisers service used to communicate Organisers REST endpoints
angular.module('organisers').factory('Organisers', ['$resource',
	function($resource) {
		return $resource('organisers/:organiserId', { organiserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('players').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Players', 'players', 'dropdown', '/players(/create)?');
		Menus.addSubMenuItem('topbar', 'players', 'List Players', 'players');
		Menus.addSubMenuItem('topbar', 'players', 'New Player', 'players/create');
	}
]);
'use strict';

//Setting up route
angular.module('players').config(['$stateProvider',
	function($stateProvider) {
		// Players state routing
		$stateProvider.
		state('listPlayers', {
			url: '/players',
			templateUrl: 'modules/players/views/list-players.client.view.html'
		}).
		state('createPlayer', {
			url: '/players/create',
			templateUrl: 'modules/players/views/create-player.client.view.html'
		}).
		state('viewPlayer', {
			url: '/players/:playerId',
			templateUrl: 'modules/players/views/view-player.client.view.html'
		}).
		state('editPlayer', {
			url: '/players/:playerId/edit',
			templateUrl: 'modules/players/views/edit-player.client.view.html'
		});
	}
]);
'use strict';

// Players controller
angular.module('players').controller('PlayersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Players',
	function($scope, $stateParams, $location, Authentication, Players) {
		$scope.authentication = Authentication;

		// Create new Player
		$scope.create = function() {
			// Create new Player object
			var player = new Players ({
				name: this.name
			});

			// Redirect after save
			player.$save(function(response) {
				$location.path('players/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Player
		$scope.remove = function(player) {
			if ( player ) { 
				player.$remove();

				for (var i in $scope.players) {
					if ($scope.players [i] === player) {
						$scope.players.splice(i, 1);
					}
				}
			} else {
				$scope.player.$remove(function() {
					$location.path('players');
				});
			}
		};

		// Update existing Player
		$scope.update = function() {
			var player = $scope.player;

			player.$update(function() {
				$location.path('players/' + player._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.limit = 50;
		$scope.searchString = 'webb';
		$scope.loaded = false;

		// Find a list of Players
		$scope.find = function() {
			$scope.loaded = false;
			$scope.players = Players.query({limit: $scope.limit, searchString: $scope.searchString });
			$scope.loaded = true;
		};

		// Find existing Player
		$scope.findOne = function() {
			$scope.player = Players.get({ 
				playerId: $stateParams.playerId
			});
		};
	}
]);
'use strict';

//Players service used to communicate Players REST endpoints
angular.module('players').factory('Players', ['$resource',
	function($resource) {
		return $resource('players/:playerId', { playerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

// Configuring the User module
/*
angular.module('user').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Users', 'users', 'dropdown', '/users(/create)?');
		Menus.addSubMenuItem('topbar', 'users', 'List Users', 'users');
	}
]);
*/
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});

			$http.post('/email', {
				name: $scope.credentials.firstName + ' ' + $scope.credentials.lastName,
				email: $scope.credentials.email,
				message: 'Thank you for registering with Chess Events!'
			}).success(function (response) {
				// notify the user.
				console.log('Success - sent email');
			}).error(function (response) {
				console.log('Ooops - no sent emai!');
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);