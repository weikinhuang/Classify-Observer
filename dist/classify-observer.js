/*!
 * Classify JavaScript Library v0.10.4
 * http://www.closedinterval.com/
 *
 * Copyright 2011-2013, Wei Kin Huang
 * Classify is freely distributable under the MIT license.
 *
 * Date: Thu Sep 19 2013 13:50:40
 */
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
		define("classify-observer", ["classify"], function(Classify) {
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

// quick reference to object prototype
var objectPrototype = Object.prototype,
// quick reference to the toString prototype
toString = objectPrototype.toString,
// quick reference to the hasOwnProperty prototype
hasOwn = objectPrototype.hasOwnProperty,
// test if object is a function
isFunction = function(o) {
	return toString.call(o) === "[object Function]";
},
//Hook to use Object.defineProperty if needed
objectDefineProperty = function(obj, prop, descriptor) {
	obj[prop] = descriptor;
},
// quickly be able to get all the keys of an object
keys = function(o) {
	var k = [], i;
	for (i in o) {
		k[k.length] = i;
	}
	return k;
},
// create ability to convert the arguments object to an array
argsToArray = function(o) {
	return Array.prototype.slice.call(o, 0);
},
// simple iteration function
each = function(o, iterator, context) {
	// we must account for null, otherwise it will throw the error "Unable to get value of the property 'length': object is null or undefined"
	if (!o) {
		return o;
	}
	var n, i = 0, l = o.length, k;
	// objects and functions iterate through the keys
	if (l === undefined || isFunction(o)) {
		k = keys(o);
		l = k.length;
		for (n = o[k[0]]; i < l; n = o[k[++i]]) {
			if (iterator.call(context || n, n, k[i], o) === false) {
				break;
			}
		}
	} else {
		// loops are iterated with the for i statement
		for (n = o[0]; i < l; n = o[++i]) {
			if (iterator.call(context || n, n, i, o) === false) {
				break;
			}
		}
	}
	return o;
},
// simple extension function that takes into account the enumerated keys
extend = function() {
	var args = argsToArray(arguments), base = args.shift();
	each(args, function(extens) {
		each(keys(extens), function(k) {
			base[k] = extens[k];
		});
	});
	return base;
};

/**
 * @module observer
 */
// Observer class that handles an abstraction layer to class properties (getter and setter methods)
var Observer = Classify({
	/**
	 * The context that this object is created within
	 * @for Classify.Observer
	 * @property context
	 * @type {Class}
	 */
	context : null,
	/**
	 * The name of the property that this object observes
	 * @for Classify.Observer
	 * @property name
	 * @type {String}
	 */
	name : null,
	/**
	 * Array containing all the event listeners for when this value changes
	 * @for Classify.Observer
	 * @property events
	 * @type {Array}
	 */
	events : null,
	/**
	 * Flag to check if this property is writable
	 * @for Classify.Observer
	 * @property writable
	 * @type {Boolean}
	 */
	writable : null,
	/**
	 * Number of seconds to delay the event emitter, 0 will disable delays
	 * @for Classify.Observer
	 * @property delay
	 * @type {Number}
	 */
	delay : null,
	/**
	 * Flag to hold the delay timer
	 * @private
	 * @for Classify.Observer
	 * @property _debounce
	 * @type {Number}
	 */
	_debounce : null,
	/**
	 * The internal value of this object
	 * @for Classify.Observer
	 * @property value
	 * @type {Object}
	 */
	value : null,
	/**
	 * Internal getter method that modifies the internal value being returned by
	 * the Classify.Observer.prototype.get method
	 * @param {Object} value The internal value of this object
	 * @private
	 * @for Classify.Observer
	 * @method getter
	 * @return {Object}
	 */
	getter : null,
	/**
	 * Internal setter method that modifies the internal value being set by
	 * the Classify.Observer.prototype.set method
	 * @param {Object} value The new value that will be set
	 * @param {Object} original The original internal value of this object
	 * @private
	 * @for Classify.Observer
	 * @method setter
	 * @return {Object}
	 */
	setter : null,
	/**
	 * Wrapper object that allows for getter/setter/event listeners of object properties
	 * @constructor
	 * @for Classify.Observer
	 * @extends {Class}
	 * @param {Object} value The internal value can be either an object or a value
	 * @param {Object} value.value The internal value if the parameter was passed in as an object
	 * @param {Boolean} [value.writable=true] Marks this object as writable or readonly
	 * @param {Number} [value.delay=0] Only fire the event emitter after a delay of value.delay ms
	 * @param {Function} [value.getter] The internal get modifier
	 * @param {Function} [value.setter] The internal set modifier
	 */
	init : function(context, name, value) {
		// an Observer can only be instantiated with an instance of an object
		if (!context) {
			throw new Error("Cannot create Observer without class context.");
		}
		// set internal context
		this.context = context;
		// the name of the property
		this.name = name;
		// array of event listeners to watch for the set call
		this.events = [];
		// flag to check that this observer is writable
		this.writable = true;
		// flag to check if we need to debounce the event listener
		this.delay = 0;
		// flag to the debounce timer
		this._debounce = null;
		// if an object is passed in as value, the break it up into it's parts
		if (value !== null && typeof value === "object") {
			this.getter = isFunction(value.get) ? value.get : null;
			this.setter = isFunction(value.set) ? value.set : null;
			this.value = value.value;
			this.writable = typeof value.writable === "boolean" ? value.writable : true;
			this.delay = typeof value.delay === "number" ? value.delay : 0;
		} else {
			// otherwise only the value is passed in
			this.value = value;
		}
	},
	/**
	 * Gets the value of the internal property
	 * @for Classify.Observer
	 * @method get
	 * @return {Object}
	 */
	get : function() {
		// getter method is called for return value if specified
		return this.getter ? this.getter.call(this.context, this.value) : this.value;
	},
	/**
	 * Sets the value of the internal property
	 * @param {Object} value Mixed value to store internally
	 * @for Classify.Observer
	 * @method set
	 * @return {Class}
	 */
	set : function(value) {
		var original = this.value, context = this.context;
		// if this is not writable then we can't do anything
		if (!this.writable) {
			return context;
		}
		// setter method is called for return value to set if specified
		this.value = this.setter ? this.setter.call(context, value, original) : value;
		// only fire event listeners if the value has changed
		if (this.value !== original) {
			// emit the change event
			this.emit();
		}
		return context;
	},
	/**
	 * Starts the timers to call the registered event listeners
	 * @for Classify.Observer
	 * @method emit
	 * @return {Class}
	 */
	emit : function() {
		var self = this, args = argsToArray(arguments);
		if (this.delay > 0) {
			if (this._debounce !== null) {
				root.clearTimeout(this._debounce);
			}
			this._debounce = root.setTimeout(function() {
				self._debounce = null;
				self._triggerEmit(args);
			}, this.delay);
		} else {
			this._triggerEmit(args);
		}
		return this.context;
	},
	/**
	 * Fires the event listeners in the order they were added
	 * @param {Array} args Array of arguments to pass to the bound event listeners
	 * @private
	 * @for Classify.Observer
	 * @method _triggerEmit
	 */
	_triggerEmit : function(args) {
		var i = 0, l = this.events.length, context = this.context, events = this.events;
		args.unshift(this.value);
		// fire off all event listeners in the order they were added
		for (; i < l; ++i) {
			events[i].apply(context, args);
		}
	},
	/**
	 * Add an event listener for when the internal value is changed
	 * @param {Function} listener The event listener to add
	 * @throws Error
	 * @for Classify.Observer
	 * @method addListener
	 * @return {Class}
	 */
	addListener : function(listener) {
		// event listeners can only be functions
		if (!isFunction(listener)) {
			throw new Error("Observer.addListener only takes instances of Function");
		}
		// add the event to the queue
		this.events[this.events.length] = listener;
		return this.context;
	},
	/**
	 * Add an event listener to be called only once when the internal value is changed
	 * @param {Function} listener The event listener to add
	 * @throws Error
	 * @for Classify.Observer
	 * @method once
	 * @return {Class}
	 */
	once : function(listener) {
		// event listeners can only be functions
		if (!isFunction(listener)) {
			throw new Error("Observer.once only takes instances of Function");
		}
		var self = this, temp = function() {
			self.removeListener(temp);
			listener.apply(this, arguments);
		};
		temp.listener = listener;
		this.addListener(temp);
		return this.context;
	},
	/**
	 * Remove an event listener from being fired when the internal value is changed
	 * @param {Function} listener The event listener to remove
	 * @throws Error
	 * @for Classify.Observer
	 * @method removeListener
	 * @return {Class}
	 */
	removeListener : function(listener) {
		// event listeners can only be functions
		if (!isFunction(listener)) {
			throw new Error("Observer.removeListener only takes instances of Function");
		}
		// remove the event listener if it exists
		var context = this.context, events = this.events, index = -1, i = 0, length = events.length;

		for (; i < length; ++i) {
			if (events[i] === listener || (events[i].listener && events[i].listener === listener)) {
				index = i;
				break;
			}
		}
		if (index < 0) {
			return context;
		}
		events.splice(i, 1);
		return context;
	},
	/**
	 * Remove all event listeners from this object
	 * @for Classify.Observer
	 * @method removeAllListeners
	 * @return {Class}
	 */
	removeAllListeners : function() {
		// garbage collection
		this.events = null;
		// reset the internal events array
		this.events = [];
		return this.context;
	},
	/**
	 * Returns the array of internal listeners
	 * @for Classify.Observer
	 * @method listeners
	 * @return {Array}
	 */
	listeners : function() {
		// gets the list of all the listeners
		return this.events;
	},
	/**
	 * Returns the internal value of this object in the scalar form
	 * @for Classify.Observer
	 * @method toValue
	 * @return {Boolean|Number|String}
	 */
	toValue : function() {
		// gets the scalar value of the internal property
		return this.value && this.value.toValue ? this.value.toValue() : this.value;
	},
	/**
	 * Returns the special name of this object
	 * @for Classify.Observer
	 * @method toString
	 * @return {String}
	 */
	toString : function() {
		// overriden toString function to say this is an instance of an observer
		return "[observer " + this.name + "]";
	}
});

// alias "on" to addListener
/**
 * Add an event listener for when the internal value is changed, alias to addListener
 *
 * @param {Function} listener The event listener to add
 * @throws Error
 * @see Classify.Observer.prototype.addListener
 * @for Classify.Observer
 * @method on
 * @return {Class}
 */
Observer.prototype.on = Observer.prototype.addListener;

/**
 * @module mutator.observable
 */
// mutator for adding observable properties to a class
Classify.addMutator("observable", {
	// the special identifier is "__observable_"
	onCreate : function(klass, parent) {
		var mutator = this;
		// re-assign the observable so that it produces copies across child classes
		/**
		 * Hashtable containing the definitions of all the observable properties that is implemented by this object
		 * @static
		 * @for Classify.Class
		 * @property observable
		 * @type {Object}
		 */
		klass.observable = extend({}, parent.observable || {});
		/**
		 * Adds a new observable property to the object's prototype
		 * @param {String} name The name of the observable property to add
		 * @param {Object} property The descriptor of the observable property
		 * @static
		 * @for Classify.Class
		 * @method addObservableProperty
		 * @return {Class}
		 */
		klass.addObservableProperty = function(name, property) {
			return klass.addProperty(name, property, mutator.propPrefix);
		};
		/**
		 * Removes a observable property to the object's prototype
		 * @param {String} name The name of the observable property to remove
		 * @static
		 * @for Classify.Class
		 * @method removeObservableProperty
		 * @return {Class}
		 */
		klass.removeObservableProperty = function(name) {
			return klass.removeProperty(mutator.propPrefix + name);
		};
	},
	onPropAdd : function(klass, parent, name, property) {
		// add the observable to the internal observable array
		klass.observable[name] = property;
		// add a null value to the prototype
		objectDefineProperty(klass.prototype, name, null);
		// we need to add the observable property from all children as well as the current class
		each(klass.subclass, function(k) {
			// add it only if it is not redefined in the child classes
			if (!hasOwn.call(k.observable, name)) {
				k.addObservableProperty(name, property);
			}
		});
	},
	onPropRemove : function(klass, name) {
		// keep a reference to the current observable property
		var tmp = klass.observable[name];
		// we need to delete the observable property from all children as well as the current class
		each(klass.subclass, function(k) {
			// remove it only if it is equal to the parent class
			if (k.observable[name] === tmp) {
				k.removeObservableProperty(name);
			}
		});
		// garbage collection
		klass.observable[name] = null;
		// then try to remove the property
		try {
			delete klass.observable[name];
		} catch (e) {
		}
	},
	onInit : function(instance, klass) {
		var prop, observables = klass.observable || null;
		// if there are no observable properties, just continue
		if (observables === null) {
			return;
		}
		// initialize the observable properties if any
		for (prop in observables) {
			if (hasOwn.call(observables, prop)) {
				instance[prop] = new Observer(instance, prop, observables[prop]);
			}
		}
	}
});

/**
 * @module export
 */

// export methods to the main object
Classify.Observer = Observer;

	// Establish the root object, "window" in the browser, or "global" on the server.
});
