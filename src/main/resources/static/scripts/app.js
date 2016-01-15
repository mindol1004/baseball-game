/**
 * Created by Hana on 2016-01-15.
 */
/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, app */

var app = (function () {
	'use strict';
	var initModule;

	initModule = function(container) {
		app.v_shell.initModule(container);
	};

	return {
		initModule: initModule
	};
})();