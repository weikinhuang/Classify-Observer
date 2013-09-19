/*!
 * Classify JavaScript Library v@VERSION
 * http://www.closedinterval.com/
 *
 * Copyright 2011-2012, Wei Kin Huang
 * Classify is freely distributable under the MIT license.
 *
 * Date: @DATE
 */

/**
 * Wrapper object that allows for getter/setter/event listeners of object properties
 *
 * @constructor
 * @augments {Classify.Class}
 * @super {Classify.Class}
 * @param {Object}
 *            value The internal value can be either an object or a value
 * @param {Object}
 *            value.value The internal value if the parameter was passed in as an object
 * @param {Boolean}
 *            [value.writable=true] Marks this object as writable or readonly
 * @param {Number}
 *            [value.delay=0] Only fire the event emitter after a delay of value.delay ms
 * @param {Function}
 *            [value.getter] The internal get modifier
 * @param {Function}
 *            [value.setter] The internal set modifier
 * @memberOf Classify
 * @refexample Classify.Observer
 */
Classify.Observer = function(value) {
};
/**
 * Prototype chain for Classify.Observer
 *
 * @memberOf Classify.Observer
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype
 */
Classify.Observer.prototype = new Classify.Class();
/**
 * The context that this object is created within
 *
 * @memberOf Classify.Observer
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.context
 */
Classify.Observer.prototype.context = new Classify.Class();
/**
 * The name of the property that this object observes
 *
 * @memberOf Classify.Observer
 * @type {String}
 * @refexample Classify.Observer.prototype.name
 */
Classify.Observer.prototype.name = "";
/**
 * Flag to check if this property is writable
 *
 * @memberOf Classify.Observer
 * @type {Boolean}
 * @refexample Classify.Observer.prototype.writable
 */
Classify.Observer.prototype.writable = true;
/**
 * Number of seconds to delay the event emitter, 0 will disable delays
 *
 * @memberOf Classify.Observer
 * @type {Number}
 * @refexample Classify.Observer.prototype.delay
 */
Classify.Observer.prototype.delay = 0;
/**
 * Flag to hold the delay timer
 *
 * @private
 * @memberOf Classify.Observer
 * @type {Number}
 * @refexample Classify.Observer.prototype._debounce
 */
Classify.Observer.prototype._debounce = 0;
/**
 * The internal value of this object
 *
 * @memberOf Classify.Observer
 * @type {Object}
 * @refexample Classify.Observer.prototype.value
 */
Classify.Observer.prototype.value = new Object();
/**
 * Array containing all the event listeners for when this value changes
 *
 * @memberOf Classify.Observer
 * @type {Array}
 * @refexample Classify.Observer.prototype.events
 */
Classify.Observer.prototype.events = new Array();
/**
 * Internal getter method that modifies the internal value being returned by the Classify.Observer.prototype.get method
 *
 * @param {Object}
 *            value The internal value of this object
 * @private
 * @memberOf Classify.Observer
 * @returns {Object}
 * @type {Object}
 * @refexample Classify.Observer.prototype.getter
 */
Classify.Observer.prototype.getter = function(value) {
	return new Object();
};
/**
 * Internal setter method that modifies the internal value being set by the Classify.Observer.prototype.set method
 *
 * @param {Object}
 *            value The new value that will be set
 * @param {Object}
 *            original The original internal value of this object
 * @private
 * @memberOf Classify.Observer
 * @returns {Object}
 * @type {Object}
 * @refexample Classify.Observer.prototype.setter
 */
Classify.Observer.prototype.setter = function(value, original) {
	return new Object();
};
/**
 * Gets the value of the internal property
 *
 * @memberOf Classify.Observer
 * @returns {Object}
 * @type {Object}
 * @refexample Classify.Observer.prototype.get
 */
Classify.Observer.prototype.get = function() {
	return new Object();
};
/**
 * Sets the value of the internal property
 *
 * @param {Object}
 *            value Mixed value to store internally
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.set
 */
Classify.Observer.prototype.set = function(value) {
	return new Classify.Class();
};
/**
 * Starts the timers to call the registered event listeners
 *
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.emit
 */
Classify.Observer.prototype.emit = function() {
	return new Classify.Class();
};
/**
 * Fires the event listeners in the order they were added
 *
 * @param {Array}
 *            args Array of arguments to pass to the bound event listeners
 * @private
 * @memberOf Classify.Observer
 * @refexample Classify.Observer.prototype._triggerEmit
 */
Classify.Observer.prototype._triggerEmit = function(args) {
};
/**
 * Add an event listener for when the internal value is changed
 *
 * @param {Function}
 *            listener The event listener to add
 * @throws Error
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.addListener
 */
Classify.Observer.prototype.addListener = function(listener) {
	return new Classify.Class();
};
/**
 * Add an event listener for when the internal value is changed, alias to addListener
 *
 * @param {Function}
 *            listener The event listener to add
 * @throws Error
 * @see Classify.Observer.prototype.addListener
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.on
 */
Classify.Observer.prototype.on = function(listener) {
	return new Classify.Class();
};
/**
 * Add an event listener to be called only once when the internal value is changed
 *
 * @param {Function}
 *            listener The event listener to add
 * @throws Error
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.once
 */
Classify.Observer.prototype.once = function(listener) {
	return new Classify.Class();
};
/**
 * Remove an event listener from being fired when the internal value is changed
 *
 * @param {Function}
 *            listener The event listener to remove
 * @throws Error
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.removeListener
 */
Classify.Observer.prototype.removeListener = function(listener) {
	return new Classify.Class();
};
/**
 * Remove all event listeners from this object
 *
 * @memberOf Classify.Observer
 * @returns {Classify.Class}
 * @type {Classify.Class}
 * @refexample Classify.Observer.prototype.removeAllListeners
 */
Classify.Observer.prototype.removeAllListeners = function() {
	return new Classify.Class();
};
/**
 * Returns the array of internal listeners
 *
 * @memberOf Classify.Observer
 * @returns {Array}
 * @type {Array}
 * @refexample Classify.Observer.prototype.listeners
 */
Classify.Observer.prototype.listeners = function() {
	return new Array();
};
/**
 * Returns the internal value of this object in the scalar form
 *
 * @memberOf Classify.Observer
 * @returns {Boolean|Number|String}
 * @type {Boolean|Number|String}
 * @refexample Classify.Observer.prototype.toValue
 */
Classify.Observer.prototype.toValue = function() {
	return new Object();
};
/**
 * Returns the special name of this object
 *
 * @memberOf Classify.Observer
 * @returns {String}
 * @type {String}
 * @refexample Classify.Observer.prototype.toString
 */
Classify.Observer.prototype.toString = function() {
	return "";
};
