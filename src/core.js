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
