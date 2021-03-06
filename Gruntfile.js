var fs = require("fs");

module.exports = function(grunt) {
	"use strict";

	var gzip = require("gzip-js");

	var gruntConfig = {};
	gruntConfig.pkg = grunt.file.readJSON("package.json");

	gruntConfig.compare_size = {
		files : [ "dist/classify-observer.js", "dist/classify-observer.min.js" ],
		options : {
			compress : {
				gz : function(file_contents) {
					return gzip.zip(file_contents, {}).length;
				}
			}
		}
	};

	gruntConfig.concat = {
		dist : {
			src : [ "srcwrap/intro.js", "src/core.js", "src/observer.js", "src/mutator.observable.js", "src/export.js", "srcwrap/outro.js" ],
			dest : "dist/classify-observer.js"
		},
		options : {
			banner : fs.readFileSync("srcwrap/copyright.js", "utf8"),
			process : true
		}
	};

	gruntConfig.jshint = {
		dist : {
			src : [ "dist/classify-observer.js" ],
			options : {
				latedef : true,
				noempty : true,
				curly : true,
				noarg : true,
				trailing : false,
				undef : true,
				unused : true,
				strict : true,
				node : true,
				browser : true,
				newcap : false,
				quotmark : "double",
				maxcomplexity : 13,
				predef : [ "Classify" ]
			}
		},
		test : {
			src : [ "test/*.js" ],
			options : {
				latedef : true,
				noempty : true,
				curly : true,
				trailing : false,
				undef : true,
				strict : false,
				node : true,
				browser : true,
				quotmark : "double",
				maxcomplexity : 7,
				predef : [ "QUnit", "Classify" ]
			}
		},
		build : {
			src : [ "Gruntfile.js", "test/bridge/qunit-node-bridge.js" ],
			options : {
				latedef : true,
				noempty : true,
				curly : true,
				trailing : false,
				undef : true,
				unused : true,
				strict : true,
				node : true,
				browser : true,
				quotmark : "double",
				maxcomplexity : 18,
				predef : []
			}
		}
	};

	gruntConfig.uglify = {
		all : {
			files : {
				"dist/classify-observer.min.js" : [ "dist/classify-observer.js" ]
			},
			options : {
				banner : "/*! ClassifyJs Observer v<%= pkg.version %> | (c) 2011-<%= grunt.template.today(\"yyyy\") %>, Wei Kin Huang | <%= pkg.homepage %> | MIT license | <%= grunt.template.today(\"yyyy-mm-dd\") %> */;",
				sourceMap : "dist/classify-observer.min.map",
				sourceMappingURL : "classify-observer.min.map",
				sourceMapPrefix : 1,
				beautify : {
					ascii_only : true
				},
				mangle : true
			}
		}
	};

	gruntConfig.qunit = {
		all : {
			options : {
				urls : [ "http://localhost:8080/test/index.html" ]
			}
		}
	};

	gruntConfig["qunit-node"] = {
		all : {
			code : [ "node_modules/classifyjs/dist/classify.js", "src/core.js", "src/observer.js", "src/mutator.observable.js", "src/export.js" ],
			tests : [ "test/observer.js", "test/mutator.observable.js" ],
			setUp : function() {
				this.root = this;
			}
		}
	};

	gruntConfig.connect = {
		server : {
			options : {
				base : ".",
				port : 8080
			}
		}
	};

	gruntConfig["qunit-cov"] = {
		test : {
			minimum : 0.95,
			srcDir : "src",
			depDirs : [ "test" ],
			outDir : "coverage",
			testFiles : [ "test/*.html" ]
		}
	};

	gruntConfig.watch = {
		files : [ "src/*.js", "test/*.js", "test/*.html", "Gruntfile.js" ],
		tasks : "dev"
	};

	grunt.initConfig(gruntConfig);

	grunt.loadNpmTasks("grunt-compare-size");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-qunit-cov");

	grunt.registerMultiTask("qunit-node", "Run QUnit unit tests in node sandbox.", function() {
		// Nodejs libs.
		var path = require("path"),
		// This task is asynchronous.
		done = this.async(),
		// Reset status.
		status = {
			failed : 0,
			passed : 0,
			total : 0,
			duration : 0
		},
		// other vars
		child;

		// Allow an error message to retain its color when split across multiple
		// lines.
		var formatMessage = function(str) {
			return String(str).split("\n").map(function(s) {
				return s.magenta;
			}).join("\n");
		};

		// Keep track of failed assertions for pretty-printing.
		var failedAssertions = [];
		var logFailedAssertions = function() {
			var assertion;
			// Print each assertion error.
			while ((assertion = failedAssertions.shift())) {
				grunt.verbose.or.error(assertion.testName);
				grunt.log.error("Message: " + formatMessage(assertion.message));
				if (assertion.actual !== assertion.expected) {
					grunt.log.error("Actual: " + formatMessage(assertion.actual));
					grunt.log.error("Expected: " + formatMessage(assertion.expected));
				}
				if (assertion.source) {
					grunt.log.error(assertion.source.replace(/ {4}(at)/g, "  $1"));
				}
				grunt.log.writeln();
			}
		};

		child = require("child_process").fork(path.join(__dirname, "test/bridge/qunit-node-bridge.js"), [ JSON.stringify({
			data : this.data,
			dir : __dirname,
			setUp : (this.data.setUp || "").toString()
		}) ], {
			env : process.env
		});

		child.on("message", function(message) {
			var data = message.data || {};
			switch (message.event) {
				case "assertionDone":
					if (data.result === false) {
						failedAssertions.push({
							actual : data.actual,
							expected : data.expected,
							message : data.message,
							source : data.source,
							testName : (data.module ? data.module + " - " : "") + data.name
						});
					}
					break;
				case "testStart":
					grunt.verbose.write((data.module ? data.module + " - " : "") + data.name + "...");
					break;
				case "testDone":
					// Log errors if necessary, otherwise success.
					if (data.failed > 0) {
						// list assertions
						if (grunt.option("verbose")) {
							grunt.log.error();
							logFailedAssertions();
						} else {
							grunt.log.write("F".red);
						}
					} else {
						grunt.verbose.ok().or.write(".");
					}
					break;
				case "moduleStart":
					break;
				case "moduleDone":
					break;
				case "done":
					status.failed += data.failed;
					status.passed += data.passed;
					status.total += data.total;
					status.duration += data.runtime;
					// Print assertion errors here, if verbose mode is disabled.
					if (!grunt.option("verbose")) {
						if (data.failed > 0) {
							grunt.log.writeln();
							logFailedAssertions();
						} else {
							grunt.log.ok();
						}
					}
					// Log results.
					if (status.failed > 0) {
						grunt.warn(status.failed + "/" + status.total + " assertions failed (" + status.duration + "ms)");
						done(false);
					} else if (status.total === 0) {
						grunt.warn("0/0 assertions ran (" + status.duration + "ms)");
					} else {
						grunt.verbose.writeln();
						grunt.log.ok(status.total + " assertions passed (" + status.duration + "ms)");
					}
					break;
			}
			if (message.event === "done") {
				child.kill();
				done();
			}
		});
	});

	// Default grunt
	grunt.registerTask("default", [ "concat", "jshint", "uglify" ]);

	var unit_test_tasks = [ "connect", "qunit", "qunit-node" ];
	var unit_test_all_tasks = unit_test_tasks.slice(0);

	// Other tasks
	grunt.registerTask("all", [ "concat", "jshint" ].concat(unit_test_all_tasks).concat([ "uglify", "compare_size" ]));
	grunt.registerTask("all:local", [ "concat", "jshint" ].concat(unit_test_tasks).concat([ "uglify", "compare_size" ]));
	grunt.registerTask("travis", [ "concat", "jshint" ].concat(unit_test_all_tasks).concat([ "uglify" ]));
	grunt.registerTask("lint", [ "concat", "jshint" ]);
	grunt.registerTask("test:local", unit_test_tasks);
	grunt.registerTask("test", unit_test_all_tasks);
	grunt.registerTask("doc", [ "yuidoc" ]);
	grunt.registerTask("coverage", [ "connect", "qunit", "qunit-cov" ]);
	grunt.registerTask("dev", [ "lint" ].concat(unit_test_tasks).concat([ "uglify", "compare_size" ]));
};
