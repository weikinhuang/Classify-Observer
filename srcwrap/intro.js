(function(root, callback) {
	"use strict";
	// standard browser include
	if (root.Classify) {
		callback(root, root.Classify);
		return;
	}
	/* global define */
	if (typeof define === "function" && define.amd) {
		// Export Classify as an AMD module only if there is a AMD module
		// loader, use lowercase classify, because AMD modules are usually
		// loaded with filenames and Classify would usually be loaded with
		// lowercase classify.js
		define(["classify"], function(Classify) {
			callback(root, Classify);
			return Classify;
		});
		return;
	}
	if (typeof module !== "undefined" && module.exports) {
		// Export the Classify object for **CommonJS**, with
		// backwards-compatibility for the old "require()" API. Also we
		// must use a top level defined classifyjs object
		callback(root, require("classifyjs"));
		return;
	}
})(this, function(root, Classify, undefined) {
	"use strict";
