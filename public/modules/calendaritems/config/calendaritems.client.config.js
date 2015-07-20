'use strict';

// Configuring the Articles module
angular.module('calendaritems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Calendaritems', 'calendaritems', 'dropdown', '/calendaritems(/create)?');
		Menus.addSubMenuItem('topbar', 'calendaritems', 'List Calendaritems', 'calendaritems');
		Menus.addSubMenuItem('topbar', 'calendaritems', 'New Calendaritem', 'calendaritems/create');
	}
]);