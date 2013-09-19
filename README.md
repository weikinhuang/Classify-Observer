[Classify-Observer.js](http://classifyjs.com)
==================================================

Classify-Ovserver is a mutator for Classify.js[https://github.com/weikinhuang/Classify] that
allows for simple getters and setters, and on value change events listeners for object
properties.

Classify-Observer is tested in IE 6+, Firefox 2+, Safari 3+, Chrome 3+, and Opera 10+, NodeJs.

Usage
--------------------------------------

#### Defining a observable property
```javascript
var test = Classify({
	__observable_x : 10,
	__observable_y : {
		value : 100,
		get : function(value) {
			return value * 10;
		},
		set : function(value, original) {
			return this.a();
		}
	}
});
var instance = new test();

// test that observers are created
instance.x instanceof Classify.Observer;

// Calling observer from object context.
instance.x.get() === 10;
// Calling observer from object context with defined getter.
instance.y.get() === 1000;
// The return value of setter function is a chain of parent instance.
instance.y.set(10) === instance;
// Calling observer from object context with setter referencing parent function.
instance.y.get() === 10;

// add an event listener
instance.y.addListener(function(value) {
	console.log(value);
});
// event fired
instance.y.set(1);

// test separate instances of instantiated class
var instance2 = new test();
instance.x !== instance2.x; //"Separate instances of classes have different observers.";
```

Environments
--------------------------------------

Classify is [CommonJS](http://commonjs.org) compliant and can be used in the browser scope or the server scope.

### In the browser:
```html
<script src="path/to/classify.js" type="text/javascript"></script>
<script src="path/to/classify-observer.js" type="text/javascript"></script>
<!-- Classify() is now in the global context -->
```

### In [NodeJs](http://nodejs.org/) environment:
```bash
npm install classifyjs
npm install classifyjs-observer
```

```javascript
var Classify = require("classifyjs").Classify;
// only needed once where classifyjs is first required
require("classifyjs-observable");
```

### With an AMD loader like [RequireJS](http://requirejs.org/):
```javascript
require({
	"paths" : {
		"classify-observer" : "path/to/classify-observer"
	}
}, [ "classify-observer" ], function(Classify) {
	console.log(Classify.Observer);
});
```

Building the Source
--------------------------------------

Classify-Observer uses the [grunt](https://github.com/cowboy/grunt) build system. Building Classify-Observer requires node.js and a command line gzip program.

```bash
# Install grunt.
$ npm install -g grunt-cli

# Clone the Classify-Observer git repo.
$ git clone git://github.com/weikinhuang/Classify-Observer.git
$ cd Classify-Observer
$ git submodule update --init

# Install node modules.
$ npm install

# Run grunt.
$ grunt
```

Running the tests:

```bash
$ grunt test
```

There are many other tasks that can be run through grunt. For a list of all tasks:

```bash
$ grunt --help
```


Changelog
--------------------------------------

#### v0.11.0
	Initial split from core Classify[https://github.com/weikinhuang/Classify] mutator


About
--------------------------------------

Classify copyright 2011-2013 by [Wei Kin Huang](http://closedinterval.com/).

Build Tools: 
[Grunt](https://github.com/cowboy/grunt),
[QUnit](https://github.com/jquery/qunit),
[Benchmark.js](https://github.com/bestiejs/benchmark.js),
[UglifyJS](https://github.com/mishoo/UglifyJS),
[JsHint](https://github.com/jshint/jshint),
[JsCoverage](http://siliconforks.com/jscoverage).

All code released under the [MIT License](http://mit-license.org/).

Fork me to show support and help fix bugs!
