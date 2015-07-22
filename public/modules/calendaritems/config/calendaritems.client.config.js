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