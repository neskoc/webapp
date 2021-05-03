/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/mithril/api/mount-redraw.js":
/*!**************************************************!*\
  !*** ./node_modules/mithril/api/mount-redraw.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

module.exports = function(render, schedule, console) {
	var subscriptions = []
	var rendering = false
	var pending = false

	function sync() {
		if (rendering) throw new Error("Nested m.redraw.sync() call")
		rendering = true
		for (var i = 0; i < subscriptions.length; i += 2) {
			try { render(subscriptions[i], Vnode(subscriptions[i + 1]), redraw) }
			catch (e) { console.error(e) }
		}
		rendering = false
	}

	function redraw() {
		if (!pending) {
			pending = true
			schedule(function() {
				pending = false
				sync()
			})
		}
	}

	redraw.sync = sync

	function mount(root, component) {
		if (component != null && component.view == null && typeof component !== "function") {
			throw new TypeError("m.mount(element, component) expects a component, not a vnode")
		}

		var index = subscriptions.indexOf(root)
		if (index >= 0) {
			subscriptions.splice(index, 2)
			render(root, [], redraw)
		}

		if (component != null) {
			subscriptions.push(root, component)
			render(root, Vnode(component), redraw)
		}
	}

	return {mount: mount, redraw: redraw}
}


/***/ }),

/***/ "./node_modules/mithril/api/router.js":
/*!********************************************!*\
  !*** ./node_modules/mithril/api/router.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")
var m = __webpack_require__(/*! ../render/hyperscript */ "./node_modules/mithril/render/hyperscript.js")
var Promise = __webpack_require__(/*! ../promise/promise */ "./node_modules/mithril/promise/promise.js")

var buildPathname = __webpack_require__(/*! ../pathname/build */ "./node_modules/mithril/pathname/build.js")
var parsePathname = __webpack_require__(/*! ../pathname/parse */ "./node_modules/mithril/pathname/parse.js")
var compileTemplate = __webpack_require__(/*! ../pathname/compileTemplate */ "./node_modules/mithril/pathname/compileTemplate.js")
var assign = __webpack_require__(/*! ../pathname/assign */ "./node_modules/mithril/pathname/assign.js")

var sentinel = {}

module.exports = function($window, mountRedraw) {
	var fireAsync

	function setPath(path, data, options) {
		path = buildPathname(path, data)
		if (fireAsync != null) {
			fireAsync()
			var state = options ? options.state : null
			var title = options ? options.title : null
			if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path)
			else $window.history.pushState(state, title, route.prefix + path)
		}
		else {
			$window.location.href = route.prefix + path
		}
	}

	var currentResolver = sentinel, component, attrs, currentPath, lastUpdate

	var SKIP = route.SKIP = {}

	function route(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		// 0 = start
		// 1 = init
		// 2 = ready
		var state = 0

		var compiled = Object.keys(routes).map(function(route) {
			if (route[0] !== "/") throw new SyntaxError("Routes must start with a `/`")
			if ((/:([^\/\.-]+)(\.{3})?:/).test(route)) {
				throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`")
			}
			return {
				route: route,
				component: routes[route],
				check: compileTemplate(route),
			}
		})
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
		var p = Promise.resolve()
		var scheduled = false
		var onremove

		fireAsync = null

		if (defaultRoute != null) {
			var defaultData = parsePathname(defaultRoute)

			if (!compiled.some(function (i) { return i.check(defaultData) })) {
				throw new ReferenceError("Default route doesn't match any known routes")
			}
		}

		function resolveRoute() {
			scheduled = false
			// Consider the pathname holistically. The prefix might even be invalid,
			// but that's not our problem.
			var prefix = $window.location.hash
			if (route.prefix[0] !== "#") {
				prefix = $window.location.search + prefix
				if (route.prefix[0] !== "?") {
					prefix = $window.location.pathname + prefix
					if (prefix[0] !== "/") prefix = "/" + prefix
				}
			}
			// This seemingly useless `.concat()` speeds up the tests quite a bit,
			// since the representation is consistently a relatively poorly
			// optimized cons string.
			var path = prefix.concat()
				.replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
				.slice(route.prefix.length)
			var data = parsePathname(path)

			assign(data.params, $window.history.state)

			function fail() {
				if (path === defaultRoute) throw new Error("Could not resolve default route " + defaultRoute)
				setPath(defaultRoute, null, {replace: true})
			}

			loop(0)
			function loop(i) {
				// 0 = init
				// 1 = scheduled
				// 2 = done
				for (; i < compiled.length; i++) {
					if (compiled[i].check(data)) {
						var payload = compiled[i].component
						var matchedRoute = compiled[i].route
						var localComp = payload
						var update = lastUpdate = function(comp) {
							if (update !== lastUpdate) return
							if (comp === SKIP) return loop(i + 1)
							component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
							attrs = data.params, currentPath = path, lastUpdate = null
							currentResolver = payload.render ? payload : null
							if (state === 2) mountRedraw.redraw()
							else {
								state = 2
								mountRedraw.redraw.sync()
							}
						}
						// There's no understating how much I *wish* I could
						// use `async`/`await` here...
						if (payload.view || typeof payload === "function") {
							payload = {}
							update(localComp)
						}
						else if (payload.onmatch) {
							p.then(function () {
								return payload.onmatch(data.params, path, matchedRoute)
							}).then(update, fail)
						}
						else update("div")
						return
					}
				}
				fail()
			}
		}

		// Set it unconditionally so `m.route.set` and `m.route.Link` both work,
		// even if neither `pushState` nor `hashchange` are supported. It's
		// cleared if `hashchange` is used, since that makes it automatically
		// async.
		fireAsync = function() {
			if (!scheduled) {
				scheduled = true
				callAsync(resolveRoute)
			}
		}

		if (typeof $window.history.pushState === "function") {
			onremove = function() {
				$window.removeEventListener("popstate", fireAsync, false)
			}
			$window.addEventListener("popstate", fireAsync, false)
		} else if (route.prefix[0] === "#") {
			fireAsync = null
			onremove = function() {
				$window.removeEventListener("hashchange", resolveRoute, false)
			}
			$window.addEventListener("hashchange", resolveRoute, false)
		}

		return mountRedraw.mount(root, {
			onbeforeupdate: function() {
				state = state ? 2 : 1
				return !(!state || sentinel === currentResolver)
			},
			oncreate: resolveRoute,
			onremove: onremove,
			view: function() {
				if (!state || sentinel === currentResolver) return
				// Wrap in a fragment to preserve existing key semantics
				var vnode = [Vnode(component, attrs.key, attrs)]
				if (currentResolver) vnode = currentResolver.render(vnode[0])
				return vnode
			},
		})
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = "#!"
	route.Link = {
		view: function(vnode) {
			var options = vnode.attrs.options
			// Remove these so they don't get overwritten
			var attrs = {}, onclick, href
			assign(attrs, vnode.attrs)
			// The first two are internal, but the rest are magic attributes
			// that need censored to not screw up rendering.
			attrs.selector = attrs.options = attrs.key = attrs.oninit =
			attrs.oncreate = attrs.onbeforeupdate = attrs.onupdate =
			attrs.onbeforeremove = attrs.onremove = null

			// Do this now so we can get the most current `href` and `disabled`.
			// Those attributes may also be specified in the selector, and we
			// should honor that.
			var child = m(vnode.attrs.selector || "a", attrs, vnode.children)

			// Let's provide a *right* way to disable a route link, rather than
			// letting people screw up accessibility on accident.
			//
			// The attribute is coerced so users don't get surprised over
			// `disabled: 0` resulting in a button that's somehow routable
			// despite being visibly disabled.
			if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
				child.attrs.href = null
				child.attrs["aria-disabled"] = "true"
				// If you *really* do want to do this on a disabled link, use
				// an `oncreate` hook to add it.
				child.attrs.onclick = null
			} else {
				onclick = child.attrs.onclick
				href = child.attrs.href
				child.attrs.href = route.prefix + href
				child.attrs.onclick = function(e) {
					var result
					if (typeof onclick === "function") {
						result = onclick.call(e.currentTarget, e)
					} else if (onclick == null || typeof onclick !== "object") {
						// do nothing
					} else if (typeof onclick.handleEvent === "function") {
						onclick.handleEvent(e)
					}

					// Adapted from React Router's implementation:
					// https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
					//
					// Try to be flexible and intuitive in how we handle links.
					// Fun fact: links aren't as obvious to get right as you
					// would expect. There's a lot more valid ways to click a
					// link than this, and one might want to not simply click a
					// link, but right click or command-click it to copy the
					// link target, etc. Nope, this isn't just for blind people.
					if (
						// Skip if `onclick` prevented default
						result !== false && !e.defaultPrevented &&
						// Ignore everything but left clicks
						(e.button === 0 || e.which === 0 || e.which === 1) &&
						// Let the browser handle `target=_blank`, etc.
						(!e.currentTarget.target || e.currentTarget.target === "_self") &&
						// No modifier keys
						!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
					) {
						e.preventDefault()
						e.redraw = false
						route.set(href, null, options)
					}
				}
			}
			return child
		},
	}
	route.param = function(key) {
		return attrs && key != null ? attrs[key] : attrs
	}

	return route
}


/***/ }),

/***/ "./node_modules/mithril/hyperscript.js":
/*!*********************************************!*\
  !*** ./node_modules/mithril/hyperscript.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hyperscript = __webpack_require__(/*! ./render/hyperscript */ "./node_modules/mithril/render/hyperscript.js")

hyperscript.trust = __webpack_require__(/*! ./render/trust */ "./node_modules/mithril/render/trust.js")
hyperscript.fragment = __webpack_require__(/*! ./render/fragment */ "./node_modules/mithril/render/fragment.js")

module.exports = hyperscript


/***/ }),

/***/ "./node_modules/mithril/index.js":
/*!***************************************!*\
  !*** ./node_modules/mithril/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hyperscript = __webpack_require__(/*! ./hyperscript */ "./node_modules/mithril/hyperscript.js")
var request = __webpack_require__(/*! ./request */ "./node_modules/mithril/request.js")
var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js")

var m = function m() { return hyperscript.apply(this, arguments) }
m.m = hyperscript
m.trust = hyperscript.trust
m.fragment = hyperscript.fragment
m.mount = mountRedraw.mount
m.route = __webpack_require__(/*! ./route */ "./node_modules/mithril/route.js")
m.render = __webpack_require__(/*! ./render */ "./node_modules/mithril/render.js")
m.redraw = mountRedraw.redraw
m.request = request.request
m.jsonp = request.jsonp
m.parseQueryString = __webpack_require__(/*! ./querystring/parse */ "./node_modules/mithril/querystring/parse.js")
m.buildQueryString = __webpack_require__(/*! ./querystring/build */ "./node_modules/mithril/querystring/build.js")
m.parsePathname = __webpack_require__(/*! ./pathname/parse */ "./node_modules/mithril/pathname/parse.js")
m.buildPathname = __webpack_require__(/*! ./pathname/build */ "./node_modules/mithril/pathname/build.js")
m.vnode = __webpack_require__(/*! ./render/vnode */ "./node_modules/mithril/render/vnode.js")
m.PromisePolyfill = __webpack_require__(/*! ./promise/polyfill */ "./node_modules/mithril/promise/polyfill.js")

module.exports = m


/***/ }),

/***/ "./node_modules/mithril/mount-redraw.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/mount-redraw.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var render = __webpack_require__(/*! ./render */ "./node_modules/mithril/render.js")

module.exports = __webpack_require__(/*! ./api/mount-redraw */ "./node_modules/mithril/api/mount-redraw.js")(render, requestAnimationFrame, console)


/***/ }),

/***/ "./node_modules/mithril/pathname/assign.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/pathname/assign.js ***!
  \*************************************************/
/***/ ((module) => {



module.exports = Object.assign || function(target, source) {
	if(source) Object.keys(source).forEach(function(key) { target[key] = source[key] })
}


/***/ }),

/***/ "./node_modules/mithril/pathname/build.js":
/*!************************************************!*\
  !*** ./node_modules/mithril/pathname/build.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var buildQueryString = __webpack_require__(/*! ../querystring/build */ "./node_modules/mithril/querystring/build.js")
var assign = __webpack_require__(/*! ./assign */ "./node_modules/mithril/pathname/assign.js")

// Returns `path` from `template` + `params`
module.exports = function(template, params) {
	if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
		throw new SyntaxError("Template parameter names *must* be separated")
	}
	if (params == null) return template
	var queryIndex = template.indexOf("?")
	var hashIndex = template.indexOf("#")
	var queryEnd = hashIndex < 0 ? template.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = template.slice(0, pathEnd)
	var query = {}

	assign(query, params)

	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
		delete query[key]
		// If no such parameter exists, don't interpolate it.
		if (params[key] == null) return m
		// Escape normal parameters, but not variadic ones.
		return variadic ? params[key] : encodeURIComponent(String(params[key]))
	})

	// In case the template substitution adds new query/hash parameters.
	var newQueryIndex = resolved.indexOf("?")
	var newHashIndex = resolved.indexOf("#")
	var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex
	var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex
	var result = resolved.slice(0, newPathEnd)

	if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd)
	if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd)
	var querystring = buildQueryString(query)
	if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring
	if (hashIndex >= 0) result += template.slice(hashIndex)
	if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex)
	return result
}


/***/ }),

/***/ "./node_modules/mithril/pathname/compileTemplate.js":
/*!**********************************************************!*\
  !*** ./node_modules/mithril/pathname/compileTemplate.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var parsePathname = __webpack_require__(/*! ./parse */ "./node_modules/mithril/pathname/parse.js")

// Compiles a template into a function that takes a resolved path (without query
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled template to be the
// output of `parsePathname`. Note that it does *not* remove query parameters
// specified in the template.
module.exports = function(template) {
	var templateData = parsePathname(template)
	var templateKeys = Object.keys(templateData.params)
	var keys = []
	var regexp = new RegExp("^" + templateData.path.replace(
		// I escape literal text so people can use things like `:file.:ext` or
		// `:lang-:locale` in routes. This is all merged into one pass so I
		// don't also accidentally escape `-` and make it harder to detect it to
		// ban it from template parameters.
		/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
		function(m, key, extra) {
			if (key == null) return "\\" + m
			keys.push({k: key, r: extra === "..."})
			if (extra === "...") return "(.*)"
			if (extra === ".") return "([^/]+)\\."
			return "([^/]+)" + (extra || "")
		}
	) + "$")
	return function(data) {
		// First, check the params. Usually, there isn't any, and it's just
		// checking a static set.
		for (var i = 0; i < templateKeys.length; i++) {
			if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false
		}
		// If no interpolations exist, let's skip all the ceremony
		if (!keys.length) return regexp.test(data.path)
		var values = regexp.exec(data.path)
		if (values == null) return false
		for (var i = 0; i < keys.length; i++) {
			data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1])
		}
		return true
	}
}


/***/ }),

/***/ "./node_modules/mithril/pathname/parse.js":
/*!************************************************!*\
  !*** ./node_modules/mithril/pathname/parse.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var parseQueryString = __webpack_require__(/*! ../querystring/parse */ "./node_modules/mithril/querystring/parse.js")

// Returns `{path, params}` from `url`
module.exports = function(url) {
	var queryIndex = url.indexOf("?")
	var hashIndex = url.indexOf("#")
	var queryEnd = hashIndex < 0 ? url.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/")

	if (!path) path = "/"
	else {
		if (path[0] !== "/") path = "/" + path
		if (path.length > 1 && path[path.length - 1] === "/") path = path.slice(0, -1)
	}
	return {
		path: path,
		params: queryIndex < 0
			? {}
			: parseQueryString(url.slice(queryIndex + 1, queryEnd)),
	}
}


/***/ }),

/***/ "./node_modules/mithril/promise/polyfill.js":
/*!**************************************************!*\
  !*** ./node_modules/mithril/promise/polyfill.js ***!
  \**************************************************/
/***/ ((module) => {


/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")

	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}

	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.prototype.finally = function(callback) {
	return this.then(
		function(value) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return value
			})
		},
		function(reason) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return PromisePolyfill.reject(reason);
			})
		}
	)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}

module.exports = PromisePolyfill


/***/ }),

/***/ "./node_modules/mithril/promise/promise.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/promise/promise.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var PromisePolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/mithril/promise/polyfill.js")

if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") {
		window.Promise = PromisePolyfill
	} else if (!window.Promise.prototype.finally) {
		window.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = window.Promise
} else if (typeof __webpack_require__.g !== "undefined") {
	if (typeof __webpack_require__.g.Promise === "undefined") {
		__webpack_require__.g.Promise = PromisePolyfill
	} else if (!__webpack_require__.g.Promise.prototype.finally) {
		__webpack_require__.g.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = __webpack_require__.g.Promise
} else {
	module.exports = PromisePolyfill
}


/***/ }),

/***/ "./node_modules/mithril/querystring/build.js":
/*!***************************************************!*\
  !*** ./node_modules/mithril/querystring/build.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""

	var args = []
	for (var key in object) {
		destructure(key, object[key])
	}

	return args.join("&")

	function destructure(key, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}


/***/ }),

/***/ "./node_modules/mithril/querystring/parse.js":
/*!***************************************************!*\
  !*** ./node_modules/mithril/querystring/parse.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)

	var entries = string.split("&"), counters = {}, data = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""

		if (value === "true") value = true
		else if (value === "false") value = false

		var levels = key.split(/\]\[?|\[/)
		var cursor = data
		if (key.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			if (level === "") {
				var key = levels.slice(0, j).join()
				if (counters[key] == null) {
					counters[key] = Array.isArray(cursor) ? cursor.length : 0
				}
				level = counters[key]++
			}
			// Disallow direct prototype pollution
			else if (level === "__proto__") break
			if (j === levels.length - 1) cursor[level] = value
			else {
				// Read own properties exclusively to disallow indirect
				// prototype pollution
				var desc = Object.getOwnPropertyDescriptor(cursor, level)
				if (desc != null) desc = desc.value
				if (desc == null) cursor[level] = desc = isNumber ? [] : {}
				cursor = desc
			}
		}
	}
	return data
}


/***/ }),

/***/ "./node_modules/mithril/render.js":
/*!****************************************!*\
  !*** ./node_modules/mithril/render.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(/*! ./render/render */ "./node_modules/mithril/render/render.js")(window)


/***/ }),

/***/ "./node_modules/mithril/render/fragment.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/render/fragment.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")
var hyperscriptVnode = __webpack_require__(/*! ./hyperscriptVnode */ "./node_modules/mithril/render/hyperscriptVnode.js")

module.exports = function() {
	var vnode = hyperscriptVnode.apply(0, arguments)

	vnode.tag = "["
	vnode.children = Vnode.normalizeChildren(vnode.children)
	return vnode
}


/***/ }),

/***/ "./node_modules/mithril/render/hyperscript.js":
/*!****************************************************!*\
  !*** ./node_modules/mithril/render/hyperscript.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")
var hyperscriptVnode = __webpack_require__(/*! ./hyperscriptVnode */ "./node_modules/mithril/render/hyperscriptVnode.js")

var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty

function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}

function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}

function execSelector(state, vnode) {
	var attrs = vnode.attrs
	var children = Vnode.normalizeChildren(vnode.children)
	var hasClass = hasOwn.call(attrs, "class")
	var className = hasClass ? attrs.class : attrs.className

	vnode.tag = state.tag
	vnode.attrs = null
	vnode.children = undefined

	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}

		for (var key in attrs) {
			if (hasOwn.call(attrs, key)) newAttrs[key] = attrs[key]
		}

		attrs = newAttrs
	}

	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)){
			attrs[key] = state.attrs[key]
		}
	}
	if (className != null || state.attrs.className != null) attrs.className =
		className != null
			? state.attrs.className != null
				? String(state.attrs.className) + " " + String(className)
				: className
			: state.attrs.className != null
				? state.attrs.className
				: null

	if (hasClass) attrs.class = null

	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			vnode.attrs = attrs
			break
		}
	}

	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		vnode.text = children[0].children
	} else {
		vnode.children = children
	}

	return vnode
}

function hyperscript(selector) {
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}

	var vnode = hyperscriptVnode.apply(1, arguments)

	if (typeof selector === "string") {
		vnode.children = Vnode.normalizeChildren(vnode.children)
		if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode)
	}

	vnode.tag = selector
	return vnode
}

module.exports = hyperscript


/***/ }),

/***/ "./node_modules/mithril/render/hyperscriptVnode.js":
/*!*********************************************************!*\
  !*** ./node_modules/mithril/render/hyperscriptVnode.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

// Call via `hyperscriptVnode.apply(startOffset, arguments)`
//
// The reason I do it this way, forwarding the arguments and passing the start
// offset in `this`, is so I don't have to create a temporary array in a
// performance-critical path.
//
// In native ES6, I'd instead add a final `...args` parameter to the
// `hyperscript` and `fragment` factories and define this as
// `hyperscriptVnode(...args)`, since modern engines do optimize that away. But
// ES5 (what Mithril requires thanks to IE support) doesn't give me that luxury,
// and engines aren't nearly intelligent enough to do either of these:
//
// 1. Elide the allocation for `[].slice.call(arguments, 1)` when it's passed to
//    another function only to be indexed.
// 2. Elide an `arguments` allocation when it's passed to any function other
//    than `Function.prototype.apply` or `Reflect.apply`.
//
// In ES6, it'd probably look closer to this (I'd need to profile it, though):
// module.exports = function(attrs, ...children) {
//     if (attrs == null || typeof attrs === "object" && attrs.tag == null && !Array.isArray(attrs)) {
//         if (children.length === 1 && Array.isArray(children[0])) children = children[0]
//     } else {
//         children = children.length === 0 && Array.isArray(attrs) ? attrs : [attrs, ...children]
//         attrs = undefined
//     }
//
//     if (attrs == null) attrs = {}
//     return Vnode("", attrs.key, attrs, children)
// }
module.exports = function() {
	var attrs = arguments[this], start = this + 1, children

	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = this
	}

	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}

	return Vnode("", attrs.key, attrs, children)
}


/***/ }),

/***/ "./node_modules/mithril/render/render.js":
/*!***********************************************!*\
  !*** ./node_modules/mithril/render/render.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

module.exports = function($window) {
	var $doc = $window && $window.document
	var currentRedraw

	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}

	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}

	//sanity check to discourage people from doing `vnode.state = ...`
	function checkState(vnode, original) {
		if (vnode.state !== original) throw new Error("`vnode.state` must not be modified")
	}

	//Note: the hook is passed as the `this` argument to allow proxying the
	//arguments without requiring a full array allocation to do so. It also
	//takes advantage of the fact the current `vnode` is the first argument in
	//all lifecycle methods.
	function callHook(vnode) {
		var original = vnode.state
		try {
			return this.apply(original, arguments)
		} finally {
			checkState(vnode, original)
		}
	}

	// IE11 (at least) throws an UnspecifiedError when accessing document.activeElement when
	// inside an iframe. Catch and swallow this error, and heavy-handidly return null.
	function activeElement() {
		try {
			return $doc.activeElement
		} catch (e) {
			return null
		}
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": createText(parent, vnode, nextSibling); break
				case "<": createHTML(parent, vnode, ns, nextSibling); break
				case "[": createFragment(parent, vnode, hooks, ns, nextSibling); break
				default: createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
	}
	var possibleParents = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}
	function createHTML(parent, vnode, ns, nextSibling) {
		var match = vnode.children.match(/^\s*?<(\w+)/im) || []
		// not using the proper parent makes the child element(s) vanish.
		//     var div = document.createElement("div")
		//     div.innerHTML = "<td>i</td><td>j</td>"
		//     console.log(div.innerHTML)
		// --> "ij", no <td> in sight.
		var temp = $doc.createElement(possibleParents[match[1]] || "div")
		if (ns === "http://www.w3.org/2000/svg") {
			temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode.children + "</svg>"
			temp = temp.firstChild
		} else {
			temp.innerHTML = vnode.children
		}
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		// Capture nodes to remove, so we don't confuse them.
		vnode.instance = []
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			vnode.instance.push(child)
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs = vnode.attrs
		var is = attrs && attrs.is

		ns = getNameSpace(vnode) || ns

		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element

		if (attrs != null) {
			setAttrs(vnode, attrs, ns)
		}

		insertNode(parent, element, nextSibling)

		if (!maybeSetContentEditable(vnode)) {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs)
			}
		}
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		initLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
		}
		else {
			vnode.domSize = 0
		}
	}

	//update
	/**
	 * @param {Element|Fragment} parent - the parent element
	 * @param {Vnode[] | null} old - the list of vnodes of the last `render()` call for
	 *                               this part of the tree
	 * @param {Vnode[] | null} vnodes - as above, but for the current `render()` call.
	 * @param {Function[]} hooks - an accumulator of post-render hooks (oncreate/onupdate)
	 * @param {Element | null} nextSibling - the next DOM node if we're dealing with a
	 *                                       fragment that is not the last item in its
	 *                                       parent
	 * @param {'svg' | 'math' | String | null} ns) - the current XML namespace, if any
	 * @returns void
	 */
	// This function diffs and patches lists of vnodes, both keyed and unkeyed.
	//
	// We will:
	//
	// 1. describe its general structure
	// 2. focus on the diff algorithm optimizations
	// 3. discuss DOM node operations.

	// ## Overview:
	//
	// The updateNodes() function:
	// - deals with trivial cases
	// - determines whether the lists are keyed or unkeyed based on the first non-null node
	//   of each list.
	// - diffs them and patches the DOM if needed (that's the brunt of the code)
	// - manages the leftovers: after diffing, are there:
	//   - old nodes left to remove?
	// 	 - new nodes to insert?
	// 	 deal with them!
	//
	// The lists are only iterated over once, with an exception for the nodes in `old` that
	// are visited in the fourth part of the diff and in the `removeNodes` loop.

	// ## Diffing
	//
	// Reading https://github.com/localvoid/ivi/blob/ddc09d06abaef45248e6133f7040d00d3c6be853/packages/ivi/src/vdom/implementation.ts#L617-L837
	// may be good for context on longest increasing subsequence-based logic for moving nodes.
	//
	// In order to diff keyed lists, one has to
	//
	// 1) match nodes in both lists, per key, and update them accordingly
	// 2) create the nodes present in the new list, but absent in the old one
	// 3) remove the nodes present in the old list, but absent in the new one
	// 4) figure out what nodes in 1) to move in order to minimize the DOM operations.
	//
	// To achieve 1) one can create a dictionary of keys => index (for the old list), then iterate
	// over the new list and for each new vnode, find the corresponding vnode in the old list using
	// the map.
	// 2) is achieved in the same step: if a new node has no corresponding entry in the map, it is new
	// and must be created.
	// For the removals, we actually remove the nodes that have been updated from the old list.
	// The nodes that remain in that list after 1) and 2) have been performed can be safely removed.
	// The fourth step is a bit more complex and relies on the longest increasing subsequence (LIS)
	// algorithm.
	//
	// the longest increasing subsequence is the list of nodes that can remain in place. Imagine going
	// from `1,2,3,4,5` to `4,5,1,2,3` where the numbers are not necessarily the keys, but the indices
	// corresponding to the keyed nodes in the old list (keyed nodes `e,d,c,b,a` => `b,a,e,d,c` would
	//  match the above lists, for example).
	//
	// In there are two increasing subsequences: `4,5` and `1,2,3`, the latter being the longest. We
	// can update those nodes without moving them, and only call `insertNode` on `4` and `5`.
	//
	// @localvoid adapted the algo to also support node deletions and insertions (the `lis` is actually
	// the longest increasing subsequence *of old nodes still present in the new list*).
	//
	// It is a general algorithm that is fireproof in all circumstances, but it requires the allocation
	// and the construction of a `key => oldIndex` map, and three arrays (one with `newIndex => oldIndex`,
	// the `LIS` and a temporary one to create the LIS).
	//
	// So we cheat where we can: if the tails of the lists are identical, they are guaranteed to be part of
	// the LIS and can be updated without moving them.
	//
	// If two nodes are swapped, they are guaranteed not to be part of the LIS, and must be moved (with
	// the exception of the last node if the list is fully reversed).
	//
	// ## Finding the next sibling.
	//
	// `updateNode()` and `createNode()` expect a nextSibling parameter to perform DOM operations.
	// When the list is being traversed top-down, at any index, the DOM nodes up to the previous
	// vnode reflect the content of the new list, whereas the rest of the DOM nodes reflect the old
	// list. The next sibling must be looked for in the old list using `getNextSibling(... oldStart + 1 ...)`.
	//
	// In the other scenarios (swaps, upwards traversal, map-based diff),
	// the new vnodes list is traversed upwards. The DOM nodes at the bottom of the list reflect the
	// bottom part of the new vnodes list, and we can use the `v.dom`  value of the previous node
	// as the next sibling (cached in the `nextSibling` variable).


	// ## DOM node moves
	//
	// In most scenarios `updateNode()` and `createNode()` perform the DOM operations. However,
	// this is not the case if the node moved (second and fourth part of the diff algo). We move
	// the old DOM nodes before updateNode runs because it enables us to use the cached `nextSibling`
	// variable rather than fetching it using `getNextSibling()`.
	//
	// The fourth part of the diff currently inserts nodes unconditionally, leading to issues
	// like #1791 and #1999. We need to be smarter about those situations where adjascent old
	// nodes remain together in the new list in a way that isn't covered by parts one and
	// three of the diff algo.

	function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length)
		else {
			var isOldKeyed = old[0] != null && old[0].key != null
			var isKeyed = vnodes[0] != null && vnodes[0].key != null
			var start = 0, oldStart = 0
			if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++
			if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++
			if (isKeyed === null && isOldKeyed == null) return // both lists are full of nulls
			if (isOldKeyed !== isKeyed) {
				removeNodes(parent, old, oldStart, old.length)
				createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else if (!isKeyed) {
				// Don't index past the end of either list (causes deopts).
				var commonLength = old.length < vnodes.length ? old.length : vnodes.length
				// Rewind if necessary to the first non-null index on either side.
				// We could alternatively either explicitly create or remove nodes when `start !== oldStart`
				// but that would be optimizing for sparse lists which are more rare than dense ones.
				start = start < oldStart ? start : oldStart
				for (; start < commonLength; start++) {
					o = old[start]
					v = vnodes[start]
					if (o === v || o == null && v == null) continue
					else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling))
					else if (v == null) removeNode(parent, o)
					else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns)
				}
				if (old.length > commonLength) removeNodes(parent, old, start, old.length)
				if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else {
				// keyed diff
				var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling

				// bottom-up
				while (oldEnd >= oldStart && end >= start) {
					oe = old[oldEnd]
					ve = vnodes[end]
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
				}
				// top-down
				while (oldEnd >= oldStart && end >= start) {
					o = old[oldStart]
					v = vnodes[start]
					if (o.key !== v.key) break
					oldStart++, start++
					if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns)
				}
				// swaps and list reversals
				while (oldEnd >= oldStart && end >= start) {
					if (start === end) break
					if (o.key !== ve.key || oe.key !== v.key) break
					topSibling = getNextSibling(old, oldStart, nextSibling)
					moveNodes(parent, oe, topSibling)
					if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns)
					if (++start <= --end) moveNodes(parent, o, nextSibling)
					if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldStart++; oldEnd--
					oe = old[oldEnd]
					ve = vnodes[end]
					o = old[oldStart]
					v = vnodes[start]
				}
				// bottom up once again
				while (oldEnd >= oldStart && end >= start) {
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
					oe = old[oldEnd]
					ve = vnodes[end]
				}
				if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1)
				else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
				else {
					// inspired by ivi https://github.com/ivijs/ivi/ by Boris Kaul
					var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li=0, i=0, pos = 2147483647, matched = 0, map, lisIndices
					for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1
					for (i = end; i >= start; i--) {
						if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1)
						ve = vnodes[i]
						var oldIndex = map[ve.key]
						if (oldIndex != null) {
							pos = (oldIndex < pos) ? oldIndex : -1 // becomes -1 if nodes were re-ordered
							oldIndices[i-start] = oldIndex
							oe = old[oldIndex]
							old[oldIndex] = null
							if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
							if (ve.dom != null) nextSibling = ve.dom
							matched++
						}
					}
					nextSibling = originalNextSibling
					if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1)
					if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
					else {
						if (pos === -1) {
							// the indices of the indices of the items that are part of the
							// longest increasing subsequence in the oldIndices list
							lisIndices = makeLisIndices(oldIndices)
							li = lisIndices.length - 1
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								else {
									if (lisIndices[li] === i - start) li--
									else moveNodes(parent, v, nextSibling)
								}
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						} else {
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						}
					}
				}
			}
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode.events = old.events
			if (shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, ns, nextSibling); break
					case "[": updateFragment(parent, old, vnode, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, ns)
		}
		else {
			removeNode(parent, old)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, ns, nextSibling) {
		if (old.children !== vnode.children) {
			removeHTML(parent, old)
			createHTML(parent, vnode, ns, nextSibling)
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
		}
	}
	function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns

		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (!maybeSetContentEditable(vnode)) {
			if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
				updateNodes(element, old.children, vnode.children, hooks, null, ns)
			}
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		updateLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(parent, old.instance)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function getKeyMap(vnodes, start, end) {
		var map = Object.create(null)
		for (; start < end; start++) {
			var vnode = vnodes[start]
			if (vnode != null) {
				var key = vnode.key
				if (key != null) map[key] = start
			}
		}
		return map
	}
	// Lifted from ivi https://github.com/ivijs/ivi/
	// takes a list of unique numbers (-1 is special and can
	// occur multiple times) and returns an array with the indices
	// of the items that are part of the longest increasing
	// subsequece
	var lisTemp = []
	function makeLisIndices(a) {
		var result = [0]
		var u = 0, v = 0, i = 0
		var il = lisTemp.length = a.length
		for (var i = 0; i < il; i++) lisTemp[i] = a[i]
		for (var i = 0; i < il; ++i) {
			if (a[i] === -1) continue
			var j = result[result.length - 1]
			if (a[j] < a[i]) {
				lisTemp[i] = j
				result.push(i)
				continue
			}
			u = 0
			v = result.length - 1
			while (u < v) {
				// Fast integer average without overflow.
				// eslint-disable-next-line no-bitwise
				var c = (u >>> 1) + (v >>> 1) + (u & v & 1)
				if (a[result[c]] < a[i]) {
					u = c + 1
				}
				else {
					v = c
				}
			}
			if (a[i] < a[result[u]]) {
				if (u > 0) lisTemp[i] = result[u - 1]
				result[u] = i
			}
		}
		u = result.length
		v = result[u - 1]
		while (u-- > 0) {
			result[u] = v
			v = lisTemp[v]
		}
		lisTemp.length = 0
		return result
	}

	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}

	// This covers a really specific edge case:
	// - Parent node is keyed and contains child
	// - Child is removed, returns unresolved promise in `onbeforeremove`
	// - Parent node is moved in keyed diff
	// - Remaining children still need moved appropriately
	//
	// Ideally, I'd track removed nodes as well, but that introduces a lot more
	// complexity and I'm not exactly interested in doing that.
	function moveNodes(parent, vnode, nextSibling) {
		var frag = $doc.createDocumentFragment()
		moveChildToFrag(parent, frag, vnode)
		insertNode(parent, frag, nextSibling)
	}
	function moveChildToFrag(parent, frag, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				for (var i = 0; i < vnode.instance.length; i++) {
					frag.appendChild(vnode.instance[i])
				}
			} else if (vnode.tag !== "[") {
				// Don't recurse for text nodes *or* elements, just fragments
				frag.appendChild(vnode.dom)
			} else if (vnode.children.length === 1) {
				vnode = vnode.children[0]
				if (vnode != null) continue
			} else {
				for (var i = 0; i < vnode.children.length; i++) {
					var child = vnode.children[i]
					if (child != null) moveChildToFrag(parent, frag, child)
				}
			}
			break
		}
	}

	function insertNode(parent, dom, nextSibling) {
		if (nextSibling != null) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}

	function maybeSetContentEditable(vnode) {
		if (vnode.attrs == null || (
			vnode.attrs.contenteditable == null && // attribute
			vnode.attrs.contentEditable == null // property
		)) return false
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		return true
	}

	//remove
	function removeNodes(parent, vnodes, start, end) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) removeNode(parent, vnode)
		}
	}
	function removeNode(parent, vnode) {
		var mask = 0
		var original = vnode.state
		var stateResult, attrsResult
		if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
			var result = callHook.call(vnode.state.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				mask = 1
				stateResult = result
			}
		}
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = callHook.call(vnode.attrs.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				// eslint-disable-next-line no-bitwise
				mask |= 2
				attrsResult = result
			}
		}
		checkState(vnode, original)

		// If we can, try to fast-path it and avoid all the overhead of awaiting
		if (!mask) {
			onremove(vnode)
			removeChild(parent, vnode)
		} else {
			if (stateResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 1) { mask &= 2; if (!mask) reallyRemove() }
				}
				stateResult.then(next, next)
			}
			if (attrsResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 2) { mask &= 1; if (!mask) reallyRemove() }
				}
				attrsResult.then(next, next)
			}
		}

		function reallyRemove() {
			checkState(vnode, original)
			onremove(vnode)
			removeChild(parent, vnode)
		}
	}
	function removeHTML(parent, vnode) {
		for (var i = 0; i < vnode.instance.length; i++) {
			parent.removeChild(vnode.instance[i])
		}
	}
	function removeChild(parent, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				removeHTML(parent, vnode)
			} else {
				if (vnode.tag !== "[") {
					parent.removeChild(vnode.dom)
					if (!Array.isArray(vnode.children)) break
				}
				if (vnode.children.length === 1) {
					vnode = vnode.children[0]
					if (vnode != null) continue
				} else {
					for (var i = 0; i < vnode.children.length; i++) {
						var child = vnode.children[i]
						if (child != null) removeChild(parent, child)
					}
				}
			}
			break
		}
	}
	function onremove(vnode) {
		if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode)
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode)
		if (typeof vnode.tag !== "string") {
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}

	//attrs
	function setAttrs(vnode, attrs, ns) {
		for (var key in attrs) {
			setAttr(vnode, key, null, attrs[key], ns)
		}
	}
	function setAttr(vnode, key, old, value, ns) {
		if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || (old === value && !isFormAttribute(vnode, key)) && typeof value !== "object") return
		if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value)
		if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value)
		else if (key === "style") updateStyle(vnode.dom, old, value)
		else if (hasPropertyKey(vnode, key, ns)) {
			if (key === "value") {
				// Only do the coercion if we're actually going to check the value.
				/* eslint-disable no-implicit-coercion */
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && vnode.dom === activeElement()) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return
				/* eslint-enable no-implicit-coercion */
			}
			// If you assign an input type that is not supported by IE 11 with an assignment expression, an error will occur.
			if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value)
			else vnode.dom[key] = value
		} else {
			if (typeof value === "boolean") {
				if (value) vnode.dom.setAttribute(key, "")
				else vnode.dom.removeAttribute(key)
			}
			else vnode.dom.setAttribute(key === "className" ? "class" : key, value)
		}
	}
	function removeAttr(vnode, key, old, ns) {
		if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return
		if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) updateEvent(vnode, key, undefined)
		else if (key === "style") updateStyle(vnode.dom, old, null)
		else if (
			hasPropertyKey(vnode, key, ns)
			&& key !== "className"
			&& !(key === "value" && (
				vnode.tag === "option"
				|| vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement()
			))
			&& !(vnode.tag === "input" && key === "type")
		) {
			vnode.dom[key] = null
		} else {
			var nsLastIndex = key.indexOf(":")
			if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1)
			if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key)
		}
	}
	function setLateSelectAttrs(vnode, attrs) {
		if ("value" in attrs) {
			if(attrs.value === null) {
				if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null
			} else {
				var normalized = "" + attrs.value // eslint-disable-line no-implicit-coercion
				if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
					vnode.dom.value = normalized
				}
			}
		}
		if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, undefined)
	}
	function updateAttrs(vnode, old, attrs, ns) {
		if (attrs != null) {
			for (var key in attrs) {
				setAttr(vnode, key, old && old[key], attrs[key], ns)
			}
		}
		var val
		if (old != null) {
			for (var key in old) {
				if (((val = old[key]) != null) && (attrs == null || attrs[key] == null)) {
					removeAttr(vnode, key, val, ns)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement() || vnode.tag === "option" && vnode.dom.parentNode === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function hasPropertyKey(vnode, key, ns) {
		// Filter out namespaced keys
		return ns === undefined && (
			// If it's a custom element, just keep it.
			vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is ||
			// If it's a normal element, let's try to avoid a few browser bugs.
			key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height"// && key !== "type"
			// Defer the property check until *after* we check everything.
		) && key in vnode.dom
	}

	//style
	var uppercaseRegex = /[A-Z]/g
	function toLowerCase(capital) { return "-" + capital.toLowerCase() }
	function normalizeKey(key) {
		return key[0] === "-" && key[1] === "-" ? key :
			key === "cssFloat" ? "float" :
				key.replace(uppercaseRegex, toLowerCase)
	}
	function updateStyle(element, old, style) {
		if (old === style) {
			// Styles are equivalent, do nothing.
		} else if (style == null) {
			// New style is missing, just clear it.
			element.style.cssText = ""
		} else if (typeof style !== "object") {
			// New style is a string, let engine deal with patching.
			element.style.cssText = style
		} else if (old == null || typeof old !== "object") {
			// `old` is missing or a string, `style` is an object.
			element.style.cssText = ""
			// Add new style properties
			for (var key in style) {
				var value = style[key]
				if (value != null) element.style.setProperty(normalizeKey(key), String(value))
			}
		} else {
			// Both old & new are (different) objects.
			// Update style properties that have changed
			for (var key in style) {
				var value = style[key]
				if (value != null && (value = String(value)) !== String(old[key])) {
					element.style.setProperty(normalizeKey(key), value)
				}
			}
			// Remove style properties that no longer exist
			for (var key in old) {
				if (old[key] != null && style[key] == null) {
					element.style.removeProperty(normalizeKey(key))
				}
			}
		}
	}

	// Here's an explanation of how this works:
	// 1. The event names are always (by design) prefixed by `on`.
	// 2. The EventListener interface accepts either a function or an object
	//    with a `handleEvent` method.
	// 3. The object does not inherit from `Object.prototype`, to avoid
	//    any potential interference with that (e.g. setters).
	// 4. The event name is remapped to the handler before calling it.
	// 5. In function-based event handlers, `ev.target === this`. We replicate
	//    that below.
	// 6. In function-based event handlers, `return false` prevents the default
	//    action and stops event propagation. We replicate that below.
	function EventDict() {
		// Save this, so the current redraw is correctly tracked.
		this._ = currentRedraw
	}
	EventDict.prototype = Object.create(null)
	EventDict.prototype.handleEvent = function (ev) {
		var handler = this["on" + ev.type]
		var result
		if (typeof handler === "function") result = handler.call(ev.currentTarget, ev)
		else if (typeof handler.handleEvent === "function") handler.handleEvent(ev)
		if (this._ && ev.redraw !== false) (0, this._)()
		if (result === false) {
			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	//event
	function updateEvent(vnode, key, value) {
		if (vnode.events != null) {
			if (vnode.events[key] === value) return
			if (value != null && (typeof value === "function" || typeof value === "object")) {
				if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = value
			} else {
				if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = undefined
			}
		} else if (value != null && (typeof value === "function" || typeof value === "object")) {
			vnode.events = new EventDict()
			vnode.dom.addEventListener(key.slice(2), vnode.events, false)
			vnode.events[key] = value
		}
	}

	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") callHook.call(source.oninit, vnode)
		if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		do {
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
				var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
				var force = callHook.call(vnode.state.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			return false
		} while (false); // eslint-disable-line no-constant-condition
		vnode.dom = old.dom
		vnode.domSize = old.domSize
		vnode.instance = old.instance
		// One would think having the actual latest attributes would be ideal,
		// but it doesn't let us properly diff based on our current internal
		// representation. We have to save not only the old DOM info, but also
		// the attributes used to create it, as we diff *that*, not against the
		// DOM directly (with a few exceptions in `setAttr`). And, of course, we
		// need to save the children and text as they are conceptually not
		// unlike special "attributes" internally.
		vnode.attrs = old.attrs
		vnode.children = old.children
		vnode.text = old.text
		return true
	}

	return function(dom, vnodes, redraw) {
		if (!dom) throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = activeElement()
		var namespace = dom.namespaceURI

		// First time rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""

		vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes])
		var prevRedraw = currentRedraw
		try {
			currentRedraw = typeof redraw === "function" ? redraw : undefined
			updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		} finally {
			currentRedraw = prevRedraw
		}
		dom.vnodes = vnodes
		// `document.activeElement` can return null: https://html.spec.whatwg.org/multipage/interaction.html#dom-document-activeelement
		if (active != null && activeElement() !== active && typeof active.focus === "function") active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
}


/***/ }),

/***/ "./node_modules/mithril/render/trust.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/render/trust.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js")

module.exports = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}


/***/ }),

/***/ "./node_modules/mithril/render/vnode.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/render/vnode.js ***!
  \**********************************************/
/***/ ((module) => {



function Vnode(tag, key, attrs, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs, children: children, text: text, dom: dom, domSize: undefined, state: undefined, events: undefined, instance: undefined}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node == null || typeof node === "boolean") return null
	if (typeof node === "object") return node
	return Vnode("#", undefined, undefined, String(node), undefined, undefined)
}
Vnode.normalizeChildren = function(input) {
	var children = []
	if (input.length) {
		var isKeyed = input[0] != null && input[0].key != null
		// Note: this is a *very* perf-sensitive check.
		// Fun fact: merging the loop like this is somehow faster than splitting
		// it, noticeably so.
		for (var i = 1; i < input.length; i++) {
			if ((input[i] != null && input[i].key != null) !== isKeyed) {
				throw new TypeError("Vnodes must either always have keys or never have keys!")
			}
		}
		for (var i = 0; i < input.length; i++) {
			children[i] = Vnode.normalize(input[i])
		}
	}
	return children
}

module.exports = Vnode


/***/ }),

/***/ "./node_modules/mithril/request.js":
/*!*****************************************!*\
  !*** ./node_modules/mithril/request.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var PromisePolyfill = __webpack_require__(/*! ./promise/promise */ "./node_modules/mithril/promise/promise.js")
var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js")

module.exports = __webpack_require__(/*! ./request/request */ "./node_modules/mithril/request/request.js")(window, PromisePolyfill, mountRedraw.redraw)


/***/ }),

/***/ "./node_modules/mithril/request/request.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/request/request.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var buildPathname = __webpack_require__(/*! ../pathname/build */ "./node_modules/mithril/pathname/build.js")

module.exports = function($window, Promise, oncompletion) {
	var callbackCount = 0

	function PromiseProxy(executor) {
		return new Promise(executor)
	}

	// In case the global Promise is some userland library's where they rely on
	// `foo instanceof this.constructor`, `this.constructor.resolve(value)`, or
	// similar. Let's *not* break them.
	PromiseProxy.prototype = Promise.prototype
	PromiseProxy.__proto__ = Promise // eslint-disable-line no-proto

	function makeRequest(factory) {
		return function(url, args) {
			if (typeof url !== "string") { args = url; url = url.url }
			else if (args == null) args = {}
			var promise = new Promise(function(resolve, reject) {
				factory(buildPathname(url, args.params), args, function (data) {
					if (typeof args.type === "function") {
						if (Array.isArray(data)) {
							for (var i = 0; i < data.length; i++) {
								data[i] = new args.type(data[i])
							}
						}
						else data = new args.type(data)
					}
					resolve(data)
				}, reject)
			})
			if (args.background === true) return promise
			var count = 0
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion()
			}

			return wrap(promise)

			function wrap(promise) {
				var then = promise.then
				// Set the constructor, so engines know to not await or resolve
				// this as a native promise. At the time of writing, this is
				// only necessary for V8, but their behavior is the correct
				// behavior per spec. See this spec issue for more details:
				// https://github.com/tc39/ecma262/issues/1577. Also, see the
				// corresponding comment in `request/tests/test-request.js` for
				// a bit more background on the issue at hand.
				promise.constructor = PromiseProxy
				promise.then = function() {
					count++
					var next = then.apply(promise, arguments)
					next.then(complete, function(e) {
						complete()
						if (count === 0) throw e
					})
					return wrap(next)
				}
				return promise
			}
		}
	}

	function hasHeader(args, name) {
		for (var key in args.headers) {
			if ({}.hasOwnProperty.call(args.headers, key) && name.test(key)) return true
		}
		return false
	}

	return {
		request: makeRequest(function(url, args, resolve, reject) {
			var method = args.method != null ? args.method.toUpperCase() : "GET"
			var body = args.body
			var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData)
			var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json")

			var xhr = new $window.XMLHttpRequest(), aborted = false
			var original = xhr, replacedAbort
			var abort = xhr.abort

			xhr.abort = function() {
				aborted = true
				abort.call(this)
			}

			xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)

			if (assumeJSON && body != null && !hasHeader(args, /^content-type$/i)) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			if (args.timeout) xhr.timeout = args.timeout
			xhr.responseType = responseType

			for (var key in args.headers) {
				if ({}.hasOwnProperty.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key])
				}
			}

			xhr.onreadystatechange = function(ev) {
				// Don't throw errors on xhr.abort().
				if (aborted) return

				if (ev.target.readyState === 4) {
					try {
						var success = (ev.target.status >= 200 && ev.target.status < 300) || ev.target.status === 304 || (/^file:\/\//i).test(url)
						// When the response type isn't "" or "text",
						// `xhr.responseText` is the wrong thing to use.
						// Browsers do the right thing and throw here, and we
						// should honor that and do the right thing by
						// preferring `xhr.response` where possible/practical.
						var response = ev.target.response, message

						if (responseType === "json") {
							// For IE and Edge, which don't implement
							// `responseType: "json"`.
							if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText)
						} else if (!responseType || responseType === "text") {
							// Only use this default if it's text. If a parsed
							// document is needed on old IE and friends (all
							// unsupported), the user should use a custom
							// `config` instead. They're already using this at
							// their own risk.
							if (response == null) response = ev.target.responseText
						}

						if (typeof args.extract === "function") {
							response = args.extract(ev.target, args)
							success = true
						} else if (typeof args.deserialize === "function") {
							response = args.deserialize(response)
						}
						if (success) resolve(response)
						else {
							try { message = ev.target.responseText }
							catch (e) { message = response }
							var error = new Error(message)
							error.code = ev.target.status
							error.response = response
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}

			if (typeof args.config === "function") {
				xhr = args.config(xhr, args, url) || xhr

				// Propagate the `abort` to any replacement XHR as well.
				if (xhr !== original) {
					replacedAbort = xhr.abort
					xhr.abort = function() {
						aborted = true
						replacedAbort.call(this)
					}
				}
			}

			if (body == null) xhr.send()
			else if (typeof args.serialize === "function") xhr.send(args.serialize(body))
			else if (body instanceof $window.FormData) xhr.send(body)
			else xhr.send(JSON.stringify(body))
		}),
		jsonp: makeRequest(function(url, args, resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				resolve(data)
			}
			script.onerror = function() {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
			}
			script.src = url + (url.indexOf("?") < 0 ? "?" : "&") +
				encodeURIComponent(args.callbackKey || "callback") + "=" +
				encodeURIComponent(callbackName)
			$window.document.documentElement.appendChild(script)
		}),
	}
}


/***/ }),

/***/ "./node_modules/mithril/route.js":
/*!***************************************!*\
  !*** ./node_modules/mithril/route.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js")

module.exports = __webpack_require__(/*! ./api/router */ "./node_modules/mithril/api/router.js")(window, mountRedraw)


/***/ }),

/***/ "./www/js/models/auth.js":
/*!*******************************!*\
  !*** ./www/js/models/auth.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "auth": () => (/* binding */ auth),
/* harmony export */   "baseUrl": () => (/* reexport safe */ _vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl),
/* harmony export */   "apiKey": () => (/* reexport safe */ _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vars.js */ "./www/js/vars.js");
/* harmony import */ var _filemodel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filemodel.js */ "./www/js/models/filemodel.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/models/auth.js







// import { apiKey, baseUrl, token } from "../vars.js";

let auth = {
    baseUrl: _vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl,
    apiKey: _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey,
    urlLogin: `${_vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl}/auth/login`,
    urlRegister: `${_vars_js__WEBPACK_IMPORTED_MODULE_1__.baseUrl}/auth/register`,
    email: "",
    password: "",
    // TODO: change token to ""
    token: "", //token,
    currentForm: {},
    callback: "",
    error: "",
    login: async function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: auth.urlLogin,
            body: {
                email: auth.email,
                password: auth.password,
                api_key: _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey
            }
        }).then(function(result) {
            console.log(result.data.token);
            auth.token = result.data.token;
            if (_filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.file) {
                console.log("in login fileModel.file:", _filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.file);
                _filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.writeToFile(_filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.file, auth.token);
            }
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/${auth.callback}`);
        });
    },
    register: async function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: auth.urlRegister,
            body: {
                email: auth.email,
                password: auth.password,
                api_key: _vars_js__WEBPACK_IMPORTED_MODULE_1__.apiKey
            }
        }).then(function(result) {
            console.log("Register.result.data:", result);
            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/${auth.callback}`);
        }).catch(function(err) {
            let errJson = JSON.parse(err);

            console.error("Error:", errJson);
            console.log("Error name:", errJson.name);
            // return m.route.set(`/register`);
        });
    },
    checkTokenValidity: async function() {
        if (auth.token === "") {
            await _filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.checkIfFileExist("token.txt", auth.fileExists, auth.fileDoesNotExist);
        }
    },
    fileExists: function(fileEntry) {
        _filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.file = fileEntry;
        console.log("fileEntry in callback from readFromFile: ", fileEntry);
        _filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.readFromFile(fileEntry, auth.checkToken);
    },
    checkToken: function(token) {
        console.log("after file read in fileExist");
        if (token !== "") {
            auth.token = token;
            if (auth.getAllInvoices()) {
                console.log("Token is valid!");
            } else {
                auth.token = "";
                console.log("Token is invalid!");
            }
        }
    },
    fileDoesNotExist: function() {
        console.log("file does not exist");
        _filemodel_js__WEBPACK_IMPORTED_MODULE_2__.fileModel.createFile();
    },
    getAllInvoices: async function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${auth.baseUrl}/invoices?api_key=${auth.apiKey}`,
            headers: {
                'x-access-token': auth.token,
            }
        }).then(function(result) {
            console.log("Invoices.getAllInvoices:", result.data);
        });
    }
};




/***/ }),

/***/ "./www/js/models/filemodel.js":
/*!************************************!*\
  !*** ./www/js/models/filemodel.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fileModel": () => (/* binding */ fileModel)
/* harmony export */ });
/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */



var fileModel = {
    current: "",
    file: null,
    readText: "",

    createFile: function() {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {
            console.log('file system open: ' + fs.name);
            fs.root.getFile(
                "token.txt",
                {
                    create: true,
                    exclusive: false
                },
                function (fileEntry) {
                    console.log("fileEntry: ", fileEntry);
                    fileModel.file = fileEntry;
                    // fileModel.writeToFile(fileModel.file, null, false);
                    fileModel.readFromFile(fileEntry);
                },
                function() {
                    outputError("Error loading file");
                });
        }, function() {
            outputError("Error loading filesystem");
        });
    },

    writeToFile: function(fileEntry, data, append) {
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            if (append) {
                try {
                    fileWriter.seek(fileWriter.length);
                } catch (e) {
                    console.log("file doesn't exist!");
                }
            }

            if (data) {
                fileWriter.write(data);
            }
        });
    },

    readFromFile: function(fileEntry, callback) {
        console.log("readFromFile");
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                fileModel.readText = this.result;
                if (callback) {
                    console.log("callback in readFromFile: ", this.result);
                    callback(this.result);
                }
                // m.redraw();
            };

            reader.readAsText(file);
        }, function() {
            outputError("Error reading from file");
            return false;
        });
    },

    checkIfFileExist: async function(path, fileExists, fileDoesNotExist) {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function() {
            window.requestFileSystem(
                window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.root.getFile(
                        path,
                        { create: false },
                        fileExists,
                        fileDoesNotExist
                    );
                }, fileModel.getFSFail); //of requestFileSystem
        });
    },

    getFSFail: function(evt) {
        console.log(evt.target.error.code);
    }
};

function outputError(errorMessage) {
    console.error(errorMessage);
}




/***/ }),

/***/ "./www/js/models/invoices.js":
/*!***********************************!*\
  !*** ./www/js/models/invoices.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoicesModel": () => (/* binding */ invoicesModel)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./orders.js */ "./www/js/models/orders.js");
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/models/invoices.js








let invoicesModel = {
    url: `${_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.baseUrl}/invoices?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.apiKey}`,
    invoices: [],

    getAllInvoices: async function() {
        console.log(`auth.token: ${_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.token}`);
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: invoicesModel.url,
            headers: {
                'x-access-token': _auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.token,
            }
        }).then(function(result) {
            console.log("Invoices.getAllInvoices:", result.data);
            invoicesModel.invoices = result.data;
        });
    },

    saveInvoice: async function(order) {
        const formatYmd = date => date.toISOString().slice(0, 10);
        let currentDate = formatYmd(new Date());

        let sum = 0;

        order.order_items.forEach(function(product) {
            sum += +product.price * +product.amount;
        });

        let body = {
            order_id: order.id,
            api_key: _auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.apiKey,
            total_price: sum,
            creation_date: currentDate
        };

        console.log("saveInvoice: body", body);

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.baseUrl}/invoices`,
            body: body,
            headers: {
                'x-access-token': _auth_js__WEBPACK_IMPORTED_MODULE_2__.auth.token,
            }
        }).then(function(result) {
            console.log("saveInvoice: result: ", result);
            _orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.updateOrder(order.id, 600);
        });
    }
};




/***/ }),

/***/ "./www/js/models/lager.js":
/*!********************************!*\
  !*** ./www/js/models/lager.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lager": () => (/* binding */ lager)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/models/lager.js






let lager = {
    current: {
        deliveries: [],
        products: []
    },
    currentForm: {},
    loadAllDeliveries: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/deliveries?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
        }).then(function(result) {
            lager.current.deliveries = result.data;
        }).finally (function() {
            mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
                method: "GET",
                url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
            }).then(function(result) {
                lager.current.products = result.data;
                // console.log("lager.current.products: ", lager.current.products);
            });
        });
    },
    addIndelivery: function() {
        lager.currentForm.api_key = _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey;
        console.log("lager.currentForm: ", lager.currentForm);

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "POST",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/deliveries`,
            body: lager.currentForm
        }).then(function() {
            console.log("lager.currentForm: ", lager.currentForm);
            let requestBody = {
                api_key: _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey,
                id: lager.currentForm.product_id,
                name: lager.current.products.filter(
                    product => product.id == lager.currentForm.product_id
                )[0].name,
                stock: (+lager.currentForm.amount + // prefix +string converts it to number
                    +lager.current.products.filter(
                        product => product.id == lager.currentForm.product_id
                    )[0].stock)
            };

            console.log("requestBody: ", requestBody);
            mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
                method: "PUT",
                url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products`,
                body: requestBody
            }).then(function(response) {
                console.log("update product response: ",  response);
            });
        }).finally(function() {
            lager.resetCurrentForm();

            return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/indelivery");
        });
    },
    resetCurrentForm: function() {
        lager.currentForm = {};
    }
};




/***/ }),

/***/ "./www/js/models/orders.js":
/*!*********************************!*\
  !*** ./www/js/models/orders.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orders": () => (/* binding */ orders)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.js */ "./www/js/models/auth.js");
/* harmony import */ var _products_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./products.js */ "./www/js/models/products.js");
/* jshint esversion: 8 */
/* jshint node: true */



// orders.js





// import { pickLists } from "../views/pick-lists.js";

let orders = {
    allOrders: [],
    currentOrder: '',
    current: { order: ''},

    getAllOrders: async function(noCache = false) {
        if (noCache) {
            console.log("noCache", noCache);
            _products_js__WEBPACK_IMPORTED_MODULE_2__.products.allProducts = [];
            orders.allOrders = [];
        } else if (orders.allOrders.length > 0) {
            return orders.allOrders;
        }

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/orders?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
        }).then(function(result) {
            orders.allOrders = result.data;
            console.log("orders.allOrders: ", orders.allOrders);
        });
    },

    getOrder: async function(orderId) {
        if (orders.allOrders === []) {
            await orders.getAllOrders(true);
        }
        orders.currentOrder = orders.allOrders.filter(function(order) {
            return order.id == orderId;
        })[0];
        console.log("getOrder: orders.currentOrder", orders.currentOrder);
        return orders.currentOrder;
    },

    updateOrder: async function(orderId, nyStatusId) {
        let order = {
            id: orderId,
            status_id: nyStatusId,
            api_key: _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey
        };

        // console.log("order:", order);
        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            // body: JSON.stringify(order),
            body: order,
            method: 'PUT',
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/orders`
        }).then(function(result) {
            console.log(result);
            let fullOrder = orders.getOrder(orderId);

            console.log("fullOrder", fullOrder);

            fullOrder.order_items.forEach(function(item) {
                let newStock = item.stock - item.amount;
                let productDetails = {
                    id: item.product_id,
                    stock: newStock,
                    api_key: _auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey
                };

                console.log("productDetails:", productDetails);

                _products_js__WEBPACK_IMPORTED_MODULE_2__.products.updateProduct(productDetails);
            });
        }).finally(function() {
            orders.getAllOrders(true);
        });
    }
};




/***/ }),

/***/ "./www/js/models/products.js":
/*!***********************************!*\
  !*** ./www/js/models/products.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "products": () => (/* binding */ products)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// products.js





let products = {
    allProducts: [],

    getAllProducts: function(noCache = false) {
        if (noCache) {
            products.allProducts = [];
        } else if (products.allProducts.length > 0) {
            // console.log("return: getAllProducts");
            return products.allProducts;
        }

        return mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "GET",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products?api_key=${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.apiKey}`
        }).then(function(result) {
            products.allProducts = result.data;
            // console.log("products.allProducts: ", products.allProducts);
        });
    },

    getProduct: function(productId) {
        console.log("productId:", productId);
        return products.allProducts.filter(function(product) {
            return product.id == productId;
        })[0];
    },

    areProductsOnStock: function(orderItems) {
        if (products.allProducts.length === 0) {
            return products.getAllProducts();
        }

        let allAvailable = true;

        orderItems.forEach(function (orderItem) {
            if (orderItem.amount > orderItem.stock) {
                allAvailable = false;
                console.log("Item not available: ", orderItem.product_id, orderItem.stock);
            } else {
                console.log(orderItem.product_id, orderItem.amount, orderItem.stock);
            }
        });

        return allAvailable;
    },

    areProductsOnStockCallback: function(orderItems) {
        let allAvailable = true;

        orderItems.forEach(function (orderItem) {
            if (orderItem.amount > orderItem.stock) {
                allAvailable = false;
                console.log("Item not available: ", orderItem.product_id, orderItem.stock);
            } else {
                console.log(orderItem.product_id, orderItem.amount, orderItem.stock);
            }
        });

        return allAvailable;
    },

    updateProduct: function(productDetails) {
        console.log("updateProduct.productDetails:", productDetails);

        mithril__WEBPACK_IMPORTED_MODULE_0___default().request({
            method: "PUT",
            url: `${_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.baseUrl}/products`,
            body: productDetails
        }).then(function(response) {
            console.log("update product response: ",  response);
        });
    }
};




/***/ }),

/***/ "./www/js/vars.js":
/*!************************!*\
  !*** ./www/js/vars.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "baseUrl": () => (/* binding */ baseUrl),
/* harmony export */   "apiKey": () => (/* binding */ apiKey)
/* harmony export */ });
/* jshint esversion: 8 */
/* jshint node: true */




const apiKey = "0bf1922ce8a318addb340d65036b4a5e";
const baseUrl = "https://lager.emilfolino.se/v2";
/*
const token = "";
*/

// export { baseUrl, apiKey, token };



/***/ }),

/***/ "./www/js/views/home.js":
/*!******************************!*\
  !*** ./www/js/views/home.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "home": () => (/* binding */ home)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./www/js/models/orders.js");
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/products.js */ "./www/js/models/products.js");
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/home.js







let main = {
    oninit: function() {
        _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getAllOrders();
        _models_products_js__WEBPACK_IMPORTED_MODULE_2__.products.getAllProducts();
        _models_auth_js__WEBPACK_IMPORTED_MODULE_3__.auth.checkTokenValidity();
        _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id < 600)[0];
    },
    view: function() {
        let greeting = "Det här är en SPA för kursen Webapp";
        let image = {
            src: "img/AI-head2.jpg",
            alt: "AI head"
        };

        if (_models_auth_js__WEBPACK_IMPORTED_MODULE_3__.auth.token) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Lagerapp"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", greeting),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("img", image, greeting)
            ];
        } else {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Lagerapp"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", greeting),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "a.button.blue-button.full-width-button",
                    { href: "#!/login" },
                    "Logga in"
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "a.button.green-button.full-width-button",
                    { href: "#!/register" },
                    "Registrera"
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("img", image, greeting)
            ];
        }
    }
};

let home = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/indelivery.js":
/*!************************************!*\
  !*** ./www/js/views/indelivery.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "indelivery": () => (/* binding */ indelivery)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_lager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/lager.js */ "./www/js/models/lager.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/indelivery.js




const indeliveryComponent = {
    view: function(vnode) {
        let current = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.card", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.card-title", current.product_name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("dl.product-info",
                [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Produkt"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.product_id),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Antal"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.amount),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Leveransdatum"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.delivery_date),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Kommentar"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", current.comment)
                ]
            ),
        ]);
    }
};

let main = {
    oninit: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.loadAllDeliveries,
    view: function() {
        if (_models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.current.deliveries.length < 1) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Inleveranser"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", "Inga inleveranser finns registrerade!")
            ];
        }
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Inleveranser"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                "a.button.blue-button.full-width-button",
                { href: "#!/new-indelivery" },
                "Ny inleverans"
            ),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.delivery-container", _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.current.deliveries.map(function(delivery) {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(indeliveryComponent, delivery);
            }))
        ];
    }
};

let indelivery = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/inventory.js":
/*!***********************************!*\
  !*** ./www/js/views/inventory.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inventory": () => (/* binding */ inventory)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/products.js */ "./www/js/models/products.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/inventory.js





const inventoryComponent = {
    view: function(vnode) {
        let product = vnode.attrs;
        // console.log("vnode.attrs:", vnode.attrs);

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-row", {
            onclick: function() {
                console.log("view:product-details/:id", product.id);
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/product-details/${product.id}`);
            }
        }, [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.left", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.right", product.stock),
        ]);
    }
};

let main = {
    oninit: _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.getAllProducts,
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Lagersaldo"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.inv-container", _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.allProducts.map(product => {
                // console.log("inventory.view:product", product);
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(inventoryComponent, product);
            }))
        ];
    }
};

let inventory = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/invoice.js":
/*!*********************************!*\
  !*** ./www/js/views/invoice.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoice": () => (/* binding */ invoice)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./www/js/models/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/invoice.js




const orderRow = {
    view: function(vnode) {
        let product = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.amount),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.price),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", +product.amount * +product.price)
        ]);
    }
};

let main = {
    view: function(vnode) {
        let order = vnode.attrs;

        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h2", "Fakturainfo"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.address),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.zip ? order.zip : '' + ' ' + order.city ? order.city : 0),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.country),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.adress),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("table.table.table-scroll.table-striped", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Product"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Antal"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Pris"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Total")
                ]),
                order.order_items.map(function(item) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderRow, item);
                })
            ])
        ];
    }
};

let invoice = {
    oninit: function(vnode) {
        _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getOrder(vnode.attrs.id);
    },
    view: function(vnode) {
        console.log("invoice.view: vnode.attrs", vnode.attrs);
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main, _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder));
    }
};




/***/ }),

/***/ "./www/js/views/invoices.js":
/*!**********************************!*\
  !*** ./www/js/views/invoices.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoices": () => (/* binding */ invoices)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_invoices_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/invoices.js */ "./www/js/models/invoices.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/invoices.js





const invoicesRow = {
    view: function(vnode) {
        let invoice = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr.tr-link", {
            onclick: function() {
                console.log(invoice);
                mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/invoice/${invoice.order_id}`);
            }
        }, [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td", invoice.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", invoice.total_price)
        ]);
    }
};

let main = {
    oninit: _models_invoices_js__WEBPACK_IMPORTED_MODULE_1__.invoicesModel.getAllInvoices,
    view: function() {
        if (_models_invoices_js__WEBPACK_IMPORTED_MODULE_1__.invoicesModel.invoices.length === 0) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Fakturor"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", "Inga fakturor finns registrerade!")
            ];
        }
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Fakturor"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("table.table.table-scroll.table-striped", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Kund"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Summa")
                ]),
                _models_invoices_js__WEBPACK_IMPORTED_MODULE_1__.invoicesModel.invoices.map(function(invoice) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()(invoicesRow, invoice);
                })
            ]),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                "a.button.green-button.full-width-button.space",
                { href: "#!/new-invoice" },
                "Skapa en faktura"
            )
        ];
    }
};

let invoices = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/layout.js":
/*!********************************!*\
  !*** ./www/js/views/layout.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "layout": () => (/* binding */ layout)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */

// js/views/layout.js






let layout = {
    view: function(vnode) {
        let navElements = [
            {name: "Home", class: "home", link: "home", nav: "#!/"}
        ];

        if (_models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.token) {
            navElements.push({name: "Inleverans", class: "local_shipping",
                link: "indelivery", nav: "#!/indelivery"});
            navElements.push({name: "Lagersaldo", class: "inventory",
                link: "inventory", nav: "#!/inventory"});
            navElements.push({name: "Plocklista", class: "checklist",
                link: "pick-lists", nav: "#!/pick-lists"});
            navElements.push({name: "Faktura", class: "receipt",
                link: "invoices", nav: "#!/invoices"});
        }
        // console.log("route: ", m.route.get().split("/"));
        let selected = mithril__WEBPACK_IMPORTED_MODULE_0___default().route.get().split("/")[1] || "home";

        console.log("selected:", selected);

        navElements = navElements.map(element => generateBottomNavElement(element, selected));

        return [
            // m("main.container", vnode.children),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div#root", vnode.children),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("nav.bottom-nav", navElements)
        ];
    }
};

let generateBottomNavElement = function (element, selected) {
    let bottomNavElements = [];
    let active = "";

    if (selected === element.link) {
        active = ".active";
    }

    let navElementAndClass = "a" + active;

    bottomNavElements.push(
        mithril__WEBPACK_IMPORTED_MODULE_0___default()(
            navElementAndClass,
            { href: element.nav },
            [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "i.material-icons",
                    element.class
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "span.icon-text",
                    element.name
                )
            ]
        )
    );

    return bottomNavElements;
};




/***/ }),

/***/ "./www/js/views/login.js":
/*!*******************************!*\
  !*** ./www/js/views/login.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "login": () => (/* binding */ login)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/login.js




let main = {
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Logga in"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.login();
                }}, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "E-postadress"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=email][placeholder=E-postadress][required=required]", {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Lösenord"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=password][placeholder=Lösenord][required=required]", {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "input.button.green-button.full-width-button[type=submit][value=Login]",
                    "Logga in"
                )]
            )];
    }
};

let login = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/new-indelivery.js":
/*!****************************************!*\
  !*** ./www/js/views/new-indelivery.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newIndelivery": () => (/* binding */ newIndelivery)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_lager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/lager.js */ "./www/js/models/lager.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/new-indelivery.js




let main = {
    oninit: function() {
        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.resetCurrentForm();
    },
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.form-container", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h2", "Ny inleverans"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.addIndelivery();
                } }, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Produkt"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("select.input[required=required]", {
                    onchange: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.product_id = e.target.value;
                    }
                }, _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.current.products.map(function(product) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()("option", { value: product.id }, product.name);
                })),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Antal"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=number][placeholder=Antal][required=required][min=1]", {
                    oninput: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.amount = e.target.value;
                    },
                    value: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.amount
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Leveransdatum"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=date][placeholder=Leveransdatum][required=required]", {
                    oninput: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.delivery_date = e.target.value;
                    },
                    value: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.date
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Kommentar"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("textarea.input[cols=2][placeholder=Kommentar]", {
                    oninput: function (e) {
                        _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.comment = e.target.value;
                    },
                    value: _models_lager_js__WEBPACK_IMPORTED_MODULE_1__.lager.currentForm.comment
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "input.button.green-button.full-width-button[type=submit][value=Save]",
                    "Gör inleverans"
                )
            ])
        ]);
    }
};

let newIndelivery = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/new-invoice.js":
/*!*************************************!*\
  !*** ./www/js/views/new-invoice.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "newInvoice": () => (/* binding */ newInvoice)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./www/js/models/orders.js");
/* harmony import */ var _models_invoices_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/invoices.js */ "./www/js/models/invoices.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/new-invoice.js





const orderRow = {
    view: function(vnode) {
        let product = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.amount),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", product.price),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("td.right", +product.amount * +product.price)
        ]);
    }
};

let showOrder = {
    view: function(vnode) {
        let order = vnode.attrs;
        // console.log("showOrder: orders.ccurrentOrder", order);

        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.address),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.zip ? order.zip : '' + ' ' + order.city ? order.city : 0),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.country),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("p.info-row", order.adress),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("table.table.table-scroll.table-striped", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("tr", [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Product"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Antal"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Pris"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("th", "Total")
                ]),
                order.order_items.map(function(item) {
                    return mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderRow, item);
                })
            ]),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                "input.button.green-button.full-width-button[type=submit][value='Skapa fakturan']"
            )
        ];
    }
};

let main = {
    view: function() {
        let order = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.form-container", [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h2", "Ny faktura"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_invoices_js__WEBPACK_IMPORTED_MODULE_2__.invoicesModel.saveInvoice(order);
                    mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/invoices");
                } }, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Order"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("select.input[required=required]", {
                    onchange: function (e) {
                        order = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getOrder(e.target.value);
                        console.log("main", _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder);
                    }
                }, _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id < 600)
                    .map(function(order) {
                        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("option", { value: order.id }, order.name);
                    })
                ),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("div#invoice-container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(showOrder, order))
            ])
        ]);
    }
};

let newInvoice = {
    oninit: function() {
        if (_models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder !== '') {
            _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.currentOrder = _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id < 600)[0];
        }
    },
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/order-details.js":
/*!***************************************!*\
  !*** ./www/js/views/order-details.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "orderDetails": () => (/* binding */ orderDetails)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/products.js */ "./www/js/models/products.js");
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/orders.js */ "./www/js/models/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// order-details.js



// import { pickLists } from "./pick-lists.js";



let orderItems = {
    view: function(vnode) {
        let order = vnode.attrs;

        console.log("orderItems->order.order_items:", order.order_items);
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("dl.product-info", order.order_items.map(function(product) {
                return [
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Product"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.product_id),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Hylla"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.location),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Beskrivning"),
                    mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.description)
                ];
            }))
        ];
    }
};

let main = {
    view: function() {
        let order = _models_orders_js__WEBPACK_IMPORTED_MODULE_2__.orders.currentOrder;

        let indeliveryPossible = _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.areProductsOnStock(order.order_items);

        if (indeliveryPossible) {
            return [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderItems, order),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "a.button.green-button.full-width-button",
                    {
                        onclick: function() {
                            console.log(order.id);
                            _models_orders_js__WEBPACK_IMPORTED_MODULE_2__.orders.updateOrder(order.id, 200);
                            mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set('/pick-lists');
                        }
                    },
                    "Sätt som packat"
                )];
        } else {
            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(orderItems, order);
        }
    }
};

let orderDetails = {
    oninit: function(vnode) {
        _models_orders_js__WEBPACK_IMPORTED_MODULE_2__.orders.getOrder(vnode.attrs.id);
    },
    view: function(vnode) {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main, vnode.attrs));
    }
};




/***/ }),

/***/ "./www/js/views/pick-lists.js":
/*!************************************!*\
  !*** ./www/js/views/pick-lists.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pickLists": () => (/* binding */ pickLists)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_orders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/orders.js */ "./www/js/models/orders.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/pick-lists.js






const generateOrderList = {
    view: function(vnode) {
        let order = vnode.attrs;

        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-row", {
            onclick: function() {
                console.log(order);
                mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set(`/order-details/${order.id}`);
            }
        }, [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.left", order.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.flex-item.right", order.id),
        ]);
    }
};

let main = {
    oninit: _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.getAllOrders,
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Nya ordrar"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("div.inv-container", (
                _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.length === 0 ?
                    _models_orders_js__WEBPACK_IMPORTED_MODULE_1__.orders.allOrders.filter(order => order.status_id === 100)
                        .map(order => {
                            return mithril__WEBPACK_IMPORTED_MODULE_0___default()(generateOrderList, order);
                        }) : mithril__WEBPACK_IMPORTED_MODULE_0___default()("p", "Finns inga nya ordrar")
            ))
        ];
    }
};

let pickLists = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ }),

/***/ "./www/js/views/product-details.js":
/*!*****************************************!*\
  !*** ./www/js/views/product-details.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "productDetails": () => (/* binding */ productDetails)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_products_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/products.js */ "./www/js/models/products.js");
/* jshint esversion: 8 */
/* jshint node: true */



// product-details.js





let main = {
    view: function(vnode) {
        console.log("vnode:", vnode);
        let product = _models_products_js__WEBPACK_IMPORTED_MODULE_1__.products.getProduct(vnode.attrs.id);

        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.product-name", product.name),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("dl.product-info", [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "id"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.id),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Artikelnummer"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.article_number),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Beskrivning"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.description),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Specifikation"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.specifiers),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "I lager"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.stock),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Hylla"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.location),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dt", "Pris"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("dd", product.price),
            ])
        ];
    }
};

let productDetails = {
    view: function(vnode) {
        console.log("product-details");
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main, vnode.attrs));
    }
};




/***/ }),

/***/ "./www/js/views/register.js":
/*!**********************************!*\
  !*** ./www/js/views/register.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "register": () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */



// js/views/register.js




let main = {
    view: function() {
        return [
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("h1.title", "Registrering"),
            mithril__WEBPACK_IMPORTED_MODULE_0___default()("form", {
                onsubmit: function(event) {
                    event.preventDefault();
                    _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.register();
                } }, [
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "E-postadress"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("input.input[type=email][placeholder=E-postadress][required=required]", {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.email
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()("label.input-label", "Lösenord"),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()('input.input[type="password"][placeholder="Lösenord"][required=required]', {
                    oninput: function (event) {
                        _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password = event.target.value;
                    },
                    value: _models_auth_js__WEBPACK_IMPORTED_MODULE_1__.auth.password
                }),
                mithril__WEBPACK_IMPORTED_MODULE_0___default()(
                    "input.button.green-button.full-width-button[type=submit][value=Registrera]"
                )]
            )];
    }
};

let register = {
    view: function() {
        return mithril__WEBPACK_IMPORTED_MODULE_0___default()("main.container", mithril__WEBPACK_IMPORTED_MODULE_0___default()(main));
    }
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./www/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _views_layout_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./views/layout.js */ "./www/js/views/layout.js");
/* harmony import */ var _views_home_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/home.js */ "./www/js/views/home.js");
/* harmony import */ var _views_inventory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/inventory.js */ "./www/js/views/inventory.js");
/* harmony import */ var _views_product_details_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/product-details.js */ "./www/js/views/product-details.js");
/* harmony import */ var _views_pick_lists_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/pick-lists.js */ "./www/js/views/pick-lists.js");
/* harmony import */ var _views_order_details_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/order-details.js */ "./www/js/views/order-details.js");
/* harmony import */ var _views_indelivery_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/indelivery.js */ "./www/js/views/indelivery.js");
/* harmony import */ var _views_new_indelivery_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./views/new-indelivery.js */ "./www/js/views/new-indelivery.js");
/* harmony import */ var _views_invoices_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./views/invoices.js */ "./www/js/views/invoices.js");
/* harmony import */ var _views_invoice_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./views/invoice.js */ "./www/js/views/invoice.js");
/* harmony import */ var _views_new_invoice_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./views/new-invoice.js */ "./www/js/views/new-invoice.js");
/* harmony import */ var _views_login_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./views/login.js */ "./www/js/views/login.js");
/* harmony import */ var _views_register_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./views/register.js */ "./www/js/views/register.js");
/* harmony import */ var _models_auth_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./models/auth.js */ "./www/js/models/auth.js");
/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */



// index.js



















// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');

    mithril__WEBPACK_IMPORTED_MODULE_0___default().route(document.body, "/", {
        "/": {
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_home_js__WEBPACK_IMPORTED_MODULE_2__.home));
            }
        },
        "/inventory": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_inventory_js__WEBPACK_IMPORTED_MODULE_3__.inventory;
                }
                _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "inventory";
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_inventory_js__WEBPACK_IMPORTED_MODULE_3__.inventory));
            }
        },
        "/product-details/:id": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_product_details_js__WEBPACK_IMPORTED_MODULE_4__.productDetails;
                }
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function(vnode) {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_product_details_js__WEBPACK_IMPORTED_MODULE_4__.productDetails, vnode.attrs));
            }
        },
        "/pick-lists": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_pick_lists_js__WEBPACK_IMPORTED_MODULE_5__.pickLists;
                }
                _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "pick-lists";
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_pick_lists_js__WEBPACK_IMPORTED_MODULE_5__.pickLists));
            }
        },
        "/order-details/:id": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_order_details_js__WEBPACK_IMPORTED_MODULE_6__.orderDetails;
                }
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function(vnode) {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_order_details_js__WEBPACK_IMPORTED_MODULE_6__.orderDetails, vnode.attrs));
            }
        },
        "/indelivery": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_indelivery_js__WEBPACK_IMPORTED_MODULE_7__.indelivery;
                }
                _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "indelivery";
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_indelivery_js__WEBPACK_IMPORTED_MODULE_7__.indelivery));
            }
        },
        "/new-indelivery": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_new_indelivery_js__WEBPACK_IMPORTED_MODULE_8__.newIndelivery;
                }
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_new_indelivery_js__WEBPACK_IMPORTED_MODULE_8__.newIndelivery));
            }
        },
        "/invoices": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_invoices_js__WEBPACK_IMPORTED_MODULE_9__.invoices;
                }
                _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "invoices";
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_invoices_js__WEBPACK_IMPORTED_MODULE_9__.invoices));
            }
        },
        "/invoice/:id": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_invoice_js__WEBPACK_IMPORTED_MODULE_10__.invoice;
                }
                _models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.callback = "invoice";
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function(vnode) {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_invoice_js__WEBPACK_IMPORTED_MODULE_10__.invoice, vnode.attrs));
            }
        },
        "/new-invoice": {
            onmatch: function() {
                if (_models_auth_js__WEBPACK_IMPORTED_MODULE_14__.auth.token) {
                    return _views_invoices_js__WEBPACK_IMPORTED_MODULE_9__.invoices;
                }
                return mithril__WEBPACK_IMPORTED_MODULE_0___default().route.set("/login");
            },
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_new_invoice_js__WEBPACK_IMPORTED_MODULE_11__.newInvoice));
            }
        },
        "/login": {
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_login_js__WEBPACK_IMPORTED_MODULE_12__.login));
            }
        },
        "/register": {
            render: function() {
                return mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_layout_js__WEBPACK_IMPORTED_MODULE_1__.layout, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_views_register_js__WEBPACK_IMPORTED_MODULE_13__.register));
            }
        }
    });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9hcGkvbW91bnQtcmVkcmF3LmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL25vZGVfbW9kdWxlcy9taXRocmlsL2FwaS9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvaHlwZXJzY3JpcHQuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvbW91bnQtcmVkcmF3LmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL25vZGVfbW9kdWxlcy9taXRocmlsL3BhdGhuYW1lL2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9wYXRobmFtZS9idWlsZC5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9wYXRobmFtZS9jb21waWxlVGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcGF0aG5hbWUvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcHJvbWlzZS9wb2x5ZmlsbC5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9wcm9taXNlL3Byb21pc2UuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcXVlcnlzdHJpbmcvYnVpbGQuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcXVlcnlzdHJpbmcvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci9mcmFnbWVudC5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIvaHlwZXJzY3JpcHQuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyL2h5cGVyc2NyaXB0Vm5vZGUuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyL3JlbmRlci5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIvdHJ1c3QuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyL3Zub2RlLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVxdWVzdC9yZXF1ZXN0LmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JvdXRlLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy9tb2RlbHMvYXV0aC5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvbW9kZWxzL2ZpbGVtb2RlbC5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvbW9kZWxzL2ludm9pY2VzLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy9tb2RlbHMvbGFnZXIuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vd3d3L2pzL21vZGVscy9vcmRlcnMuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vd3d3L2pzL21vZGVscy9wcm9kdWN0cy5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvdmFycy5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvdmlld3MvaG9tZS5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvdmlld3MvaW5kZWxpdmVyeS5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvdmlld3MvaW52ZW50b3J5LmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy92aWV3cy9pbnZvaWNlLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy92aWV3cy9pbnZvaWNlcy5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvdmlld3MvbGF5b3V0LmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy92aWV3cy9sb2dpbi5qcyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvdmlld3MvbmV3LWluZGVsaXZlcnkuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vd3d3L2pzL3ZpZXdzL25ldy1pbnZvaWNlLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy92aWV3cy9vcmRlci1kZXRhaWxzLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy92aWV3cy9waWNrLWxpc3RzLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci8uL3d3dy9qcy92aWV3cy9wcm9kdWN0LWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyLy4vd3d3L2pzL3ZpZXdzL3JlZ2lzdGVyLmpzIiwid2VicGFjazovL3NlLmRid2ViYi5sYWdlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2UuZGJ3ZWJiLmxhZ2VyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zZS5kYndlYmIubGFnZXIvLi93d3cvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFZOztBQUVaLFlBQVksbUJBQU8sQ0FBQywrREFBaUI7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0MsUUFBUTtBQUNSLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDs7Ozs7Ozs7Ozs7QUNqRFk7O0FBRVosWUFBWSxtQkFBTyxDQUFDLCtEQUFpQjtBQUNyQyxRQUFRLG1CQUFPLENBQUMsMkVBQXVCO0FBQ3ZDLGNBQWMsbUJBQU8sQ0FBQyxxRUFBb0I7O0FBRTFDLG9CQUFvQixtQkFBTyxDQUFDLG1FQUFtQjtBQUMvQyxvQkFBb0IsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDL0Msc0JBQXNCLG1CQUFPLENBQUMsdUZBQTZCO0FBQzNELGFBQWEsbUJBQU8sQ0FBQyxxRUFBb0I7O0FBRXpDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUIsRUFBRTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLG9DQUFvQyw4QkFBOEI7QUFDbEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUMsY0FBYztBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxxQkFBcUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3JRWTs7QUFFWixrQkFBa0IsbUJBQU8sQ0FBQywwRUFBc0I7O0FBRWhELG9CQUFvQixtQkFBTyxDQUFDLDhEQUFnQjtBQUM1Qyx1QkFBdUIsbUJBQU8sQ0FBQyxvRUFBbUI7O0FBRWxEOzs7Ozs7Ozs7OztBQ1BZOztBQUVaLGtCQUFrQixtQkFBTyxDQUFDLDREQUFlO0FBQ3pDLGNBQWMsbUJBQU8sQ0FBQyxvREFBVztBQUNqQyxrQkFBa0IsbUJBQU8sQ0FBQyw4REFBZ0I7O0FBRTFDLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyxnREFBUztBQUMzQixXQUFXLG1CQUFPLENBQUMsa0RBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsd0VBQXFCO0FBQ2xELHFCQUFxQixtQkFBTyxDQUFDLHdFQUFxQjtBQUNsRCxrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBa0I7QUFDNUMsa0JBQWtCLG1CQUFPLENBQUMsa0VBQWtCO0FBQzVDLFVBQVUsbUJBQU8sQ0FBQyw4REFBZ0I7QUFDbEMsb0JBQW9CLG1CQUFPLENBQUMsc0VBQW9COztBQUVoRDs7Ozs7Ozs7Ozs7QUN2Qlk7O0FBRVosYUFBYSxtQkFBTyxDQUFDLGtEQUFVOztBQUUvQixpQkFBaUIsbUJBQU8sQ0FBQyxzRUFBb0I7Ozs7Ozs7Ozs7O0FDSmpDOztBQUVaO0FBQ0EsdURBQXVELDRCQUE0QjtBQUNuRjs7Ozs7Ozs7Ozs7QUNKWTs7QUFFWix1QkFBdUIsbUJBQU8sQ0FBQyx5RUFBc0I7QUFDckQsYUFBYSxtQkFBTyxDQUFDLDJEQUFVOztBQUUvQjtBQUNBO0FBQ0EsdUJBQXVCLEVBQUU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLDhDQUE4QyxFQUFFO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFDWTs7QUFFWixvQkFBb0IsbUJBQU8sQ0FBQyx5REFBUzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixFQUFFLCtCQUErQjtBQUNuRDtBQUNBO0FBQ0EsY0FBYywyQkFBMkI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix5QkFBeUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFDWTs7QUFFWix1QkFBdUIsbUJBQU8sQ0FBQyx5RUFBc0I7O0FBRXJELGFBQWEsYUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLEdBQUc7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN2Qlk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtQ0FBbUMsWUFBWTtBQUN0RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsNkJBQTZCLFlBQVk7QUFDdEQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCwyQ0FBMkM7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsZUFBZTtBQUM5RDtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBOzs7Ozs7Ozs7OztBQy9HWTs7QUFFWixzQkFBc0IsbUJBQU8sQ0FBQyw4REFBWTs7QUFFMUM7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLENBQUMsaUJBQWlCLHFCQUFNO0FBQ3hCLFlBQVkscUJBQU07QUFDbEIsRUFBRSxxQkFBTTtBQUNSLEVBQUUsV0FBVyxxQkFBTTtBQUNuQixFQUFFLHFCQUFNO0FBQ1I7QUFDQSxrQkFBa0IscUJBQU07QUFDeEIsQ0FBQztBQUNEO0FBQ0E7Ozs7Ozs7Ozs7O0FDcEJZOztBQUVaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN6Qlk7O0FBRVo7QUFDQTtBQUNBOztBQUVBLCtDQUErQztBQUMvQyxnQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFDWTs7QUFFWixpQkFBaUIsbUJBQU8sQ0FBQyxnRUFBaUI7Ozs7Ozs7Ozs7O0FDRjlCOztBQUVaLFlBQVksbUJBQU8sQ0FBQywrREFBaUI7QUFDckMsdUJBQXVCLG1CQUFPLENBQUMsNkVBQW9COztBQUVuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1hZOztBQUVaLFlBQVksbUJBQU8sQ0FBQywrREFBaUI7QUFDckMsdUJBQXVCLG1CQUFPLENBQUMsNkVBQW9COztBQUVuRDtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BHWTs7QUFFWixZQUFZLG1CQUFPLENBQUMsK0RBQWlCOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUNwRFk7O0FBRVosWUFBWSxtQkFBTyxDQUFDLCtEQUFpQjs7QUFFckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQseURBQXlEO0FBQ3pELG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHVDQUF1QyxPQUFPO0FBQzlDLGlDQUFpQyxPQUFPO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLGlCQUFpQjtBQUM3QixZQUFZLGVBQWU7QUFDM0I7QUFDQSxZQUFZLGVBQWU7QUFDM0IsWUFBWSxXQUFXO0FBQ3ZCLFlBQVksZUFBZTtBQUMzQjtBQUNBO0FBQ0EsWUFBWSwrQkFBK0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxzQkFBc0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQyxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1Asb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDLCtEQUErRDtBQUMvRCwwRUFBMEU7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsYUFBYTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QixpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsbUJBQW1CO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLG1CQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0osbUJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixXQUFXO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixXQUFXO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsb0JBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QXVCLDhDQUFDLENBQUMsb0RBQU0sRUFBRSw4Q0FBQyxDQUFDLG1EQUFLO0FBQ3hDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSx1QkFBdUIsOENBQUMsQ0FBQyxvREFBTSxFQUFFLDhDQUFDLENBQUMseURBQVE7QUFDM0M7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmVuZGVyLCBzY2hlZHVsZSwgY29uc29sZSkge1xuXHR2YXIgc3Vic2NyaXB0aW9ucyA9IFtdXG5cdHZhciByZW5kZXJpbmcgPSBmYWxzZVxuXHR2YXIgcGVuZGluZyA9IGZhbHNlXG5cblx0ZnVuY3Rpb24gc3luYygpIHtcblx0XHRpZiAocmVuZGVyaW5nKSB0aHJvdyBuZXcgRXJyb3IoXCJOZXN0ZWQgbS5yZWRyYXcuc3luYygpIGNhbGxcIilcblx0XHRyZW5kZXJpbmcgPSB0cnVlXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpcHRpb25zLmxlbmd0aDsgaSArPSAyKSB7XG5cdFx0XHR0cnkgeyByZW5kZXIoc3Vic2NyaXB0aW9uc1tpXSwgVm5vZGUoc3Vic2NyaXB0aW9uc1tpICsgMV0pLCByZWRyYXcpIH1cblx0XHRcdGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoZSkgfVxuXHRcdH1cblx0XHRyZW5kZXJpbmcgPSBmYWxzZVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xuXHRcdGlmICghcGVuZGluZykge1xuXHRcdFx0cGVuZGluZyA9IHRydWVcblx0XHRcdHNjaGVkdWxlKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwZW5kaW5nID0gZmFsc2Vcblx0XHRcdFx0c3luYygpXG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdHJlZHJhdy5zeW5jID0gc3luY1xuXG5cdGZ1bmN0aW9uIG1vdW50KHJvb3QsIGNvbXBvbmVudCkge1xuXHRcdGlmIChjb21wb25lbnQgIT0gbnVsbCAmJiBjb21wb25lbnQudmlldyA9PSBudWxsICYmIHR5cGVvZiBjb21wb25lbnQgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIm0ubW91bnQoZWxlbWVudCwgY29tcG9uZW50KSBleHBlY3RzIGEgY29tcG9uZW50LCBub3QgYSB2bm9kZVwiKVxuXHRcdH1cblxuXHRcdHZhciBpbmRleCA9IHN1YnNjcmlwdGlvbnMuaW5kZXhPZihyb290KVxuXHRcdGlmIChpbmRleCA+PSAwKSB7XG5cdFx0XHRzdWJzY3JpcHRpb25zLnNwbGljZShpbmRleCwgMilcblx0XHRcdHJlbmRlcihyb290LCBbXSwgcmVkcmF3KVxuXHRcdH1cblxuXHRcdGlmIChjb21wb25lbnQgIT0gbnVsbCkge1xuXHRcdFx0c3Vic2NyaXB0aW9ucy5wdXNoKHJvb3QsIGNvbXBvbmVudClcblx0XHRcdHJlbmRlcihyb290LCBWbm9kZShjb21wb25lbnQpLCByZWRyYXcpXG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHttb3VudDogbW91bnQsIHJlZHJhdzogcmVkcmF3fVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxudmFyIG0gPSByZXF1aXJlKFwiLi4vcmVuZGVyL2h5cGVyc2NyaXB0XCIpXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCIuLi9wcm9taXNlL3Byb21pc2VcIilcblxudmFyIGJ1aWxkUGF0aG5hbWUgPSByZXF1aXJlKFwiLi4vcGF0aG5hbWUvYnVpbGRcIilcbnZhciBwYXJzZVBhdGhuYW1lID0gcmVxdWlyZShcIi4uL3BhdGhuYW1lL3BhcnNlXCIpXG52YXIgY29tcGlsZVRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3BhdGhuYW1lL2NvbXBpbGVUZW1wbGF0ZVwiKVxudmFyIGFzc2lnbiA9IHJlcXVpcmUoXCIuLi9wYXRobmFtZS9hc3NpZ25cIilcblxudmFyIHNlbnRpbmVsID0ge31cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkd2luZG93LCBtb3VudFJlZHJhdykge1xuXHR2YXIgZmlyZUFzeW5jXG5cblx0ZnVuY3Rpb24gc2V0UGF0aChwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0cGF0aCA9IGJ1aWxkUGF0aG5hbWUocGF0aCwgZGF0YSlcblx0XHRpZiAoZmlyZUFzeW5jICE9IG51bGwpIHtcblx0XHRcdGZpcmVBc3luYygpXG5cdFx0XHR2YXIgc3RhdGUgPSBvcHRpb25zID8gb3B0aW9ucy5zdGF0ZSA6IG51bGxcblx0XHRcdHZhciB0aXRsZSA9IG9wdGlvbnMgPyBvcHRpb25zLnRpdGxlIDogbnVsbFxuXHRcdFx0aWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXBsYWNlKSAkd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCB0aXRsZSwgcm91dGUucHJlZml4ICsgcGF0aClcblx0XHRcdGVsc2UgJHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgdGl0bGUsIHJvdXRlLnByZWZpeCArIHBhdGgpXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcm91dGUucHJlZml4ICsgcGF0aFxuXHRcdH1cblx0fVxuXG5cdHZhciBjdXJyZW50UmVzb2x2ZXIgPSBzZW50aW5lbCwgY29tcG9uZW50LCBhdHRycywgY3VycmVudFBhdGgsIGxhc3RVcGRhdGVcblxuXHR2YXIgU0tJUCA9IHJvdXRlLlNLSVAgPSB7fVxuXG5cdGZ1bmN0aW9uIHJvdXRlKHJvb3QsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKSB7XG5cdFx0aWYgKHJvb3QgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCB0aGF0IHdhcyBwYXNzZWQgdG8gYG0ucm91dGVgIGlzIG5vdCB1bmRlZmluZWRcIilcblx0XHQvLyAwID0gc3RhcnRcblx0XHQvLyAxID0gaW5pdFxuXHRcdC8vIDIgPSByZWFkeVxuXHRcdHZhciBzdGF0ZSA9IDBcblxuXHRcdHZhciBjb21waWxlZCA9IE9iamVjdC5rZXlzKHJvdXRlcykubWFwKGZ1bmN0aW9uKHJvdXRlKSB7XG5cdFx0XHRpZiAocm91dGVbMF0gIT09IFwiL1wiKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJSb3V0ZXMgbXVzdCBzdGFydCB3aXRoIGEgYC9gXCIpXG5cdFx0XHRpZiAoKC86KFteXFwvXFwuLV0rKShcXC57M30pPzovKS50ZXN0KHJvdXRlKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJSb3V0ZSBwYXJhbWV0ZXIgbmFtZXMgbXVzdCBiZSBzZXBhcmF0ZWQgd2l0aCBlaXRoZXIgYC9gLCBgLmAsIG9yIGAtYFwiKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cm91dGU6IHJvdXRlLFxuXHRcdFx0XHRjb21wb25lbnQ6IHJvdXRlc1tyb3V0ZV0sXG5cdFx0XHRcdGNoZWNrOiBjb21waWxlVGVtcGxhdGUocm91dGUpLFxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0dmFyIGNhbGxBc3luYyA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEltbWVkaWF0ZSA6IHNldFRpbWVvdXRcblx0XHR2YXIgcCA9IFByb21pc2UucmVzb2x2ZSgpXG5cdFx0dmFyIHNjaGVkdWxlZCA9IGZhbHNlXG5cdFx0dmFyIG9ucmVtb3ZlXG5cblx0XHRmaXJlQXN5bmMgPSBudWxsXG5cblx0XHRpZiAoZGVmYXVsdFJvdXRlICE9IG51bGwpIHtcblx0XHRcdHZhciBkZWZhdWx0RGF0YSA9IHBhcnNlUGF0aG5hbWUoZGVmYXVsdFJvdXRlKVxuXG5cdFx0XHRpZiAoIWNvbXBpbGVkLnNvbWUoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGkuY2hlY2soZGVmYXVsdERhdGEpIH0pKSB7XG5cdFx0XHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcIkRlZmF1bHQgcm91dGUgZG9lc24ndCBtYXRjaCBhbnkga25vd24gcm91dGVzXCIpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZVJvdXRlKCkge1xuXHRcdFx0c2NoZWR1bGVkID0gZmFsc2Vcblx0XHRcdC8vIENvbnNpZGVyIHRoZSBwYXRobmFtZSBob2xpc3RpY2FsbHkuIFRoZSBwcmVmaXggbWlnaHQgZXZlbiBiZSBpbnZhbGlkLFxuXHRcdFx0Ly8gYnV0IHRoYXQncyBub3Qgb3VyIHByb2JsZW0uXG5cdFx0XHR2YXIgcHJlZml4ID0gJHdpbmRvdy5sb2NhdGlvbi5oYXNoXG5cdFx0XHRpZiAocm91dGUucHJlZml4WzBdICE9PSBcIiNcIikge1xuXHRcdFx0XHRwcmVmaXggPSAkd2luZG93LmxvY2F0aW9uLnNlYXJjaCArIHByZWZpeFxuXHRcdFx0XHRpZiAocm91dGUucHJlZml4WzBdICE9PSBcIj9cIikge1xuXHRcdFx0XHRcdHByZWZpeCA9ICR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBwcmVmaXhcblx0XHRcdFx0XHRpZiAocHJlZml4WzBdICE9PSBcIi9cIikgcHJlZml4ID0gXCIvXCIgKyBwcmVmaXhcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gVGhpcyBzZWVtaW5nbHkgdXNlbGVzcyBgLmNvbmNhdCgpYCBzcGVlZHMgdXAgdGhlIHRlc3RzIHF1aXRlIGEgYml0LFxuXHRcdFx0Ly8gc2luY2UgdGhlIHJlcHJlc2VudGF0aW9uIGlzIGNvbnNpc3RlbnRseSBhIHJlbGF0aXZlbHkgcG9vcmx5XG5cdFx0XHQvLyBvcHRpbWl6ZWQgY29ucyBzdHJpbmcuXG5cdFx0XHR2YXIgcGF0aCA9IHByZWZpeC5jb25jYXQoKVxuXHRcdFx0XHQucmVwbGFjZSgvKD86JVthLWY4OV1bYS1mMC05XSkrL2dpbSwgZGVjb2RlVVJJQ29tcG9uZW50KVxuXHRcdFx0XHQuc2xpY2Uocm91dGUucHJlZml4Lmxlbmd0aClcblx0XHRcdHZhciBkYXRhID0gcGFyc2VQYXRobmFtZShwYXRoKVxuXG5cdFx0XHRhc3NpZ24oZGF0YS5wYXJhbXMsICR3aW5kb3cuaGlzdG9yeS5zdGF0ZSlcblxuXHRcdFx0ZnVuY3Rpb24gZmFpbCgpIHtcblx0XHRcdFx0aWYgKHBhdGggPT09IGRlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IHJlc29sdmUgZGVmYXVsdCByb3V0ZSBcIiArIGRlZmF1bHRSb3V0ZSlcblx0XHRcdFx0c2V0UGF0aChkZWZhdWx0Um91dGUsIG51bGwsIHtyZXBsYWNlOiB0cnVlfSlcblx0XHRcdH1cblxuXHRcdFx0bG9vcCgwKVxuXHRcdFx0ZnVuY3Rpb24gbG9vcChpKSB7XG5cdFx0XHRcdC8vIDAgPSBpbml0XG5cdFx0XHRcdC8vIDEgPSBzY2hlZHVsZWRcblx0XHRcdFx0Ly8gMiA9IGRvbmVcblx0XHRcdFx0Zm9yICg7IGkgPCBjb21waWxlZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmIChjb21waWxlZFtpXS5jaGVjayhkYXRhKSkge1xuXHRcdFx0XHRcdFx0dmFyIHBheWxvYWQgPSBjb21waWxlZFtpXS5jb21wb25lbnRcblx0XHRcdFx0XHRcdHZhciBtYXRjaGVkUm91dGUgPSBjb21waWxlZFtpXS5yb3V0ZVxuXHRcdFx0XHRcdFx0dmFyIGxvY2FsQ29tcCA9IHBheWxvYWRcblx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBsYXN0VXBkYXRlID0gZnVuY3Rpb24oY29tcCkge1xuXHRcdFx0XHRcdFx0XHRpZiAodXBkYXRlICE9PSBsYXN0VXBkYXRlKSByZXR1cm5cblx0XHRcdFx0XHRcdFx0aWYgKGNvbXAgPT09IFNLSVApIHJldHVybiBsb29wKGkgKyAxKVxuXHRcdFx0XHRcdFx0XHRjb21wb25lbnQgPSBjb21wICE9IG51bGwgJiYgKHR5cGVvZiBjb21wLnZpZXcgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgY29tcCA9PT0gXCJmdW5jdGlvblwiKT8gY29tcCA6IFwiZGl2XCJcblx0XHRcdFx0XHRcdFx0YXR0cnMgPSBkYXRhLnBhcmFtcywgY3VycmVudFBhdGggPSBwYXRoLCBsYXN0VXBkYXRlID0gbnVsbFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50UmVzb2x2ZXIgPSBwYXlsb2FkLnJlbmRlciA/IHBheWxvYWQgOiBudWxsXG5cdFx0XHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gMikgbW91bnRSZWRyYXcucmVkcmF3KClcblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdGUgPSAyXG5cdFx0XHRcdFx0XHRcdFx0bW91bnRSZWRyYXcucmVkcmF3LnN5bmMoKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyBUaGVyZSdzIG5vIHVuZGVyc3RhdGluZyBob3cgbXVjaCBJICp3aXNoKiBJIGNvdWxkXG5cdFx0XHRcdFx0XHQvLyB1c2UgYGFzeW5jYC9gYXdhaXRgIGhlcmUuLi5cblx0XHRcdFx0XHRcdGlmIChwYXlsb2FkLnZpZXcgfHwgdHlwZW9mIHBheWxvYWQgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0XHRwYXlsb2FkID0ge31cblx0XHRcdFx0XHRcdFx0dXBkYXRlKGxvY2FsQ29tcClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHBheWxvYWQub25tYXRjaCkge1xuXHRcdFx0XHRcdFx0XHRwLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwYXlsb2FkLm9ubWF0Y2goZGF0YS5wYXJhbXMsIHBhdGgsIG1hdGNoZWRSb3V0ZSlcblx0XHRcdFx0XHRcdFx0fSkudGhlbih1cGRhdGUsIGZhaWwpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHVwZGF0ZShcImRpdlwiKVxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGZhaWwoKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCBpdCB1bmNvbmRpdGlvbmFsbHkgc28gYG0ucm91dGUuc2V0YCBhbmQgYG0ucm91dGUuTGlua2AgYm90aCB3b3JrLFxuXHRcdC8vIGV2ZW4gaWYgbmVpdGhlciBgcHVzaFN0YXRlYCBub3IgYGhhc2hjaGFuZ2VgIGFyZSBzdXBwb3J0ZWQuIEl0J3Ncblx0XHQvLyBjbGVhcmVkIGlmIGBoYXNoY2hhbmdlYCBpcyB1c2VkLCBzaW5jZSB0aGF0IG1ha2VzIGl0IGF1dG9tYXRpY2FsbHlcblx0XHQvLyBhc3luYy5cblx0XHRmaXJlQXN5bmMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICghc2NoZWR1bGVkKSB7XG5cdFx0XHRcdHNjaGVkdWxlZCA9IHRydWVcblx0XHRcdFx0Y2FsbEFzeW5jKHJlc29sdmVSb3V0ZSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodHlwZW9mICR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0b25yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgZmlyZUFzeW5jLCBmYWxzZSlcblx0XHRcdH1cblx0XHRcdCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGZpcmVBc3luYywgZmFsc2UpXG5cdFx0fSBlbHNlIGlmIChyb3V0ZS5wcmVmaXhbMF0gPT09IFwiI1wiKSB7XG5cdFx0XHRmaXJlQXN5bmMgPSBudWxsXG5cdFx0XHRvbnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIHJlc29sdmVSb3V0ZSwgZmFsc2UpXG5cdFx0XHR9XG5cdFx0XHQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIHJlc29sdmVSb3V0ZSwgZmFsc2UpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1vdW50UmVkcmF3Lm1vdW50KHJvb3QsIHtcblx0XHRcdG9uYmVmb3JldXBkYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0c3RhdGUgPSBzdGF0ZSA/IDIgOiAxXG5cdFx0XHRcdHJldHVybiAhKCFzdGF0ZSB8fCBzZW50aW5lbCA9PT0gY3VycmVudFJlc29sdmVyKVxuXHRcdFx0fSxcblx0XHRcdG9uY3JlYXRlOiByZXNvbHZlUm91dGUsXG5cdFx0XHRvbnJlbW92ZTogb25yZW1vdmUsXG5cdFx0XHR2aWV3OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCFzdGF0ZSB8fCBzZW50aW5lbCA9PT0gY3VycmVudFJlc29sdmVyKSByZXR1cm5cblx0XHRcdFx0Ly8gV3JhcCBpbiBhIGZyYWdtZW50IHRvIHByZXNlcnZlIGV4aXN0aW5nIGtleSBzZW1hbnRpY3Ncblx0XHRcdFx0dmFyIHZub2RlID0gW1Zub2RlKGNvbXBvbmVudCwgYXR0cnMua2V5LCBhdHRycyldXG5cdFx0XHRcdGlmIChjdXJyZW50UmVzb2x2ZXIpIHZub2RlID0gY3VycmVudFJlc29sdmVyLnJlbmRlcih2bm9kZVswXSlcblx0XHRcdFx0cmV0dXJuIHZub2RlXG5cdFx0XHR9LFxuXHRcdH0pXG5cdH1cblx0cm91dGUuc2V0ID0gZnVuY3Rpb24ocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuXHRcdGlmIChsYXN0VXBkYXRlICE9IG51bGwpIHtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cdFx0XHRvcHRpb25zLnJlcGxhY2UgPSB0cnVlXG5cdFx0fVxuXHRcdGxhc3RVcGRhdGUgPSBudWxsXG5cdFx0c2V0UGF0aChwYXRoLCBkYXRhLCBvcHRpb25zKVxuXHR9XG5cdHJvdXRlLmdldCA9IGZ1bmN0aW9uKCkge3JldHVybiBjdXJyZW50UGF0aH1cblx0cm91dGUucHJlZml4ID0gXCIjIVwiXG5cdHJvdXRlLkxpbmsgPSB7XG5cdFx0dmlldzogZnVuY3Rpb24odm5vZGUpIHtcblx0XHRcdHZhciBvcHRpb25zID0gdm5vZGUuYXR0cnMub3B0aW9uc1xuXHRcdFx0Ly8gUmVtb3ZlIHRoZXNlIHNvIHRoZXkgZG9uJ3QgZ2V0IG92ZXJ3cml0dGVuXG5cdFx0XHR2YXIgYXR0cnMgPSB7fSwgb25jbGljaywgaHJlZlxuXHRcdFx0YXNzaWduKGF0dHJzLCB2bm9kZS5hdHRycylcblx0XHRcdC8vIFRoZSBmaXJzdCB0d28gYXJlIGludGVybmFsLCBidXQgdGhlIHJlc3QgYXJlIG1hZ2ljIGF0dHJpYnV0ZXNcblx0XHRcdC8vIHRoYXQgbmVlZCBjZW5zb3JlZCB0byBub3Qgc2NyZXcgdXAgcmVuZGVyaW5nLlxuXHRcdFx0YXR0cnMuc2VsZWN0b3IgPSBhdHRycy5vcHRpb25zID0gYXR0cnMua2V5ID0gYXR0cnMub25pbml0ID1cblx0XHRcdGF0dHJzLm9uY3JlYXRlID0gYXR0cnMub25iZWZvcmV1cGRhdGUgPSBhdHRycy5vbnVwZGF0ZSA9XG5cdFx0XHRhdHRycy5vbmJlZm9yZXJlbW92ZSA9IGF0dHJzLm9ucmVtb3ZlID0gbnVsbFxuXG5cdFx0XHQvLyBEbyB0aGlzIG5vdyBzbyB3ZSBjYW4gZ2V0IHRoZSBtb3N0IGN1cnJlbnQgYGhyZWZgIGFuZCBgZGlzYWJsZWRgLlxuXHRcdFx0Ly8gVGhvc2UgYXR0cmlidXRlcyBtYXkgYWxzbyBiZSBzcGVjaWZpZWQgaW4gdGhlIHNlbGVjdG9yLCBhbmQgd2Vcblx0XHRcdC8vIHNob3VsZCBob25vciB0aGF0LlxuXHRcdFx0dmFyIGNoaWxkID0gbSh2bm9kZS5hdHRycy5zZWxlY3RvciB8fCBcImFcIiwgYXR0cnMsIHZub2RlLmNoaWxkcmVuKVxuXG5cdFx0XHQvLyBMZXQncyBwcm92aWRlIGEgKnJpZ2h0KiB3YXkgdG8gZGlzYWJsZSBhIHJvdXRlIGxpbmssIHJhdGhlciB0aGFuXG5cdFx0XHQvLyBsZXR0aW5nIHBlb3BsZSBzY3JldyB1cCBhY2Nlc3NpYmlsaXR5IG9uIGFjY2lkZW50LlxuXHRcdFx0Ly9cblx0XHRcdC8vIFRoZSBhdHRyaWJ1dGUgaXMgY29lcmNlZCBzbyB1c2VycyBkb24ndCBnZXQgc3VycHJpc2VkIG92ZXJcblx0XHRcdC8vIGBkaXNhYmxlZDogMGAgcmVzdWx0aW5nIGluIGEgYnV0dG9uIHRoYXQncyBzb21laG93IHJvdXRhYmxlXG5cdFx0XHQvLyBkZXNwaXRlIGJlaW5nIHZpc2libHkgZGlzYWJsZWQuXG5cdFx0XHRpZiAoY2hpbGQuYXR0cnMuZGlzYWJsZWQgPSBCb29sZWFuKGNoaWxkLmF0dHJzLmRpc2FibGVkKSkge1xuXHRcdFx0XHRjaGlsZC5hdHRycy5ocmVmID0gbnVsbFxuXHRcdFx0XHRjaGlsZC5hdHRyc1tcImFyaWEtZGlzYWJsZWRcIl0gPSBcInRydWVcIlxuXHRcdFx0XHQvLyBJZiB5b3UgKnJlYWxseSogZG8gd2FudCB0byBkbyB0aGlzIG9uIGEgZGlzYWJsZWQgbGluaywgdXNlXG5cdFx0XHRcdC8vIGFuIGBvbmNyZWF0ZWAgaG9vayB0byBhZGQgaXQuXG5cdFx0XHRcdGNoaWxkLmF0dHJzLm9uY2xpY2sgPSBudWxsXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvbmNsaWNrID0gY2hpbGQuYXR0cnMub25jbGlja1xuXHRcdFx0XHRocmVmID0gY2hpbGQuYXR0cnMuaHJlZlxuXHRcdFx0XHRjaGlsZC5hdHRycy5ocmVmID0gcm91dGUucHJlZml4ICsgaHJlZlxuXHRcdFx0XHRjaGlsZC5hdHRycy5vbmNsaWNrID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdHZhciByZXN1bHRcblx0XHRcdFx0XHRpZiAodHlwZW9mIG9uY2xpY2sgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gb25jbGljay5jYWxsKGUuY3VycmVudFRhcmdldCwgZSlcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG9uY2xpY2sgPT0gbnVsbCB8fCB0eXBlb2Ygb25jbGljayAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0Ly8gZG8gbm90aGluZ1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIG9uY2xpY2suaGFuZGxlRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0b25jbGljay5oYW5kbGVFdmVudChlKVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEFkYXB0ZWQgZnJvbSBSZWFjdCBSb3V0ZXIncyBpbXBsZW1lbnRhdGlvbjpcblx0XHRcdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RUcmFpbmluZy9yZWFjdC1yb3V0ZXIvYmxvYi81MjBhMGFjZDQ4YWUxYjA2NmViMGIwN2Q2ZDRkMTc5MGExZDAyNDgyL3BhY2thZ2VzL3JlYWN0LXJvdXRlci1kb20vbW9kdWxlcy9MaW5rLmpzXG5cdFx0XHRcdFx0Ly9cblx0XHRcdFx0XHQvLyBUcnkgdG8gYmUgZmxleGlibGUgYW5kIGludHVpdGl2ZSBpbiBob3cgd2UgaGFuZGxlIGxpbmtzLlxuXHRcdFx0XHRcdC8vIEZ1biBmYWN0OiBsaW5rcyBhcmVuJ3QgYXMgb2J2aW91cyB0byBnZXQgcmlnaHQgYXMgeW91XG5cdFx0XHRcdFx0Ly8gd291bGQgZXhwZWN0LiBUaGVyZSdzIGEgbG90IG1vcmUgdmFsaWQgd2F5cyB0byBjbGljayBhXG5cdFx0XHRcdFx0Ly8gbGluayB0aGFuIHRoaXMsIGFuZCBvbmUgbWlnaHQgd2FudCB0byBub3Qgc2ltcGx5IGNsaWNrIGFcblx0XHRcdFx0XHQvLyBsaW5rLCBidXQgcmlnaHQgY2xpY2sgb3IgY29tbWFuZC1jbGljayBpdCB0byBjb3B5IHRoZVxuXHRcdFx0XHRcdC8vIGxpbmsgdGFyZ2V0LCBldGMuIE5vcGUsIHRoaXMgaXNuJ3QganVzdCBmb3IgYmxpbmQgcGVvcGxlLlxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdC8vIFNraXAgaWYgYG9uY2xpY2tgIHByZXZlbnRlZCBkZWZhdWx0XG5cdFx0XHRcdFx0XHRyZXN1bHQgIT09IGZhbHNlICYmICFlLmRlZmF1bHRQcmV2ZW50ZWQgJiZcblx0XHRcdFx0XHRcdC8vIElnbm9yZSBldmVyeXRoaW5nIGJ1dCBsZWZ0IGNsaWNrc1xuXHRcdFx0XHRcdFx0KGUuYnV0dG9uID09PSAwIHx8IGUud2hpY2ggPT09IDAgfHwgZS53aGljaCA9PT0gMSkgJiZcblx0XHRcdFx0XHRcdC8vIExldCB0aGUgYnJvd3NlciBoYW5kbGUgYHRhcmdldD1fYmxhbmtgLCBldGMuXG5cdFx0XHRcdFx0XHQoIWUuY3VycmVudFRhcmdldC50YXJnZXQgfHwgZS5jdXJyZW50VGFyZ2V0LnRhcmdldCA9PT0gXCJfc2VsZlwiKSAmJlxuXHRcdFx0XHRcdFx0Ly8gTm8gbW9kaWZpZXIga2V5c1xuXHRcdFx0XHRcdFx0IWUuY3RybEtleSAmJiAhZS5tZXRhS2V5ICYmICFlLnNoaWZ0S2V5ICYmICFlLmFsdEtleVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRlLnJlZHJhdyA9IGZhbHNlXG5cdFx0XHRcdFx0XHRyb3V0ZS5zZXQoaHJlZiwgbnVsbCwgb3B0aW9ucylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGlsZFxuXHRcdH0sXG5cdH1cblx0cm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkpIHtcblx0XHRyZXR1cm4gYXR0cnMgJiYga2V5ICE9IG51bGwgPyBhdHRyc1trZXldIDogYXR0cnNcblx0fVxuXG5cdHJldHVybiByb3V0ZVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGh5cGVyc2NyaXB0ID0gcmVxdWlyZShcIi4vcmVuZGVyL2h5cGVyc2NyaXB0XCIpXG5cbmh5cGVyc2NyaXB0LnRydXN0ID0gcmVxdWlyZShcIi4vcmVuZGVyL3RydXN0XCIpXG5oeXBlcnNjcmlwdC5mcmFnbWVudCA9IHJlcXVpcmUoXCIuL3JlbmRlci9mcmFnbWVudFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh5cGVyc2NyaXB0XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgaHlwZXJzY3JpcHQgPSByZXF1aXJlKFwiLi9oeXBlcnNjcmlwdFwiKVxudmFyIHJlcXVlc3QgPSByZXF1aXJlKFwiLi9yZXF1ZXN0XCIpXG52YXIgbW91bnRSZWRyYXcgPSByZXF1aXJlKFwiLi9tb3VudC1yZWRyYXdcIilcblxudmFyIG0gPSBmdW5jdGlvbiBtKCkgeyByZXR1cm4gaHlwZXJzY3JpcHQuYXBwbHkodGhpcywgYXJndW1lbnRzKSB9XG5tLm0gPSBoeXBlcnNjcmlwdFxubS50cnVzdCA9IGh5cGVyc2NyaXB0LnRydXN0XG5tLmZyYWdtZW50ID0gaHlwZXJzY3JpcHQuZnJhZ21lbnRcbm0ubW91bnQgPSBtb3VudFJlZHJhdy5tb3VudFxubS5yb3V0ZSA9IHJlcXVpcmUoXCIuL3JvdXRlXCIpXG5tLnJlbmRlciA9IHJlcXVpcmUoXCIuL3JlbmRlclwiKVxubS5yZWRyYXcgPSBtb3VudFJlZHJhdy5yZWRyYXdcbm0ucmVxdWVzdCA9IHJlcXVlc3QucmVxdWVzdFxubS5qc29ucCA9IHJlcXVlc3QuanNvbnBcbm0ucGFyc2VRdWVyeVN0cmluZyA9IHJlcXVpcmUoXCIuL3F1ZXJ5c3RyaW5nL3BhcnNlXCIpXG5tLmJ1aWxkUXVlcnlTdHJpbmcgPSByZXF1aXJlKFwiLi9xdWVyeXN0cmluZy9idWlsZFwiKVxubS5wYXJzZVBhdGhuYW1lID0gcmVxdWlyZShcIi4vcGF0aG5hbWUvcGFyc2VcIilcbm0uYnVpbGRQYXRobmFtZSA9IHJlcXVpcmUoXCIuL3BhdGhuYW1lL2J1aWxkXCIpXG5tLnZub2RlID0gcmVxdWlyZShcIi4vcmVuZGVyL3Zub2RlXCIpXG5tLlByb21pc2VQb2x5ZmlsbCA9IHJlcXVpcmUoXCIuL3Byb21pc2UvcG9seWZpbGxcIilcblxubW9kdWxlLmV4cG9ydHMgPSBtXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgcmVuZGVyID0gcmVxdWlyZShcIi4vcmVuZGVyXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vYXBpL21vdW50LXJlZHJhd1wiKShyZW5kZXIsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgY29uc29sZSlcbiIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSkge1xuXHRpZihzb3VyY2UpIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XSB9KVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGJ1aWxkUXVlcnlTdHJpbmcgPSByZXF1aXJlKFwiLi4vcXVlcnlzdHJpbmcvYnVpbGRcIilcbnZhciBhc3NpZ24gPSByZXF1aXJlKFwiLi9hc3NpZ25cIilcblxuLy8gUmV0dXJucyBgcGF0aGAgZnJvbSBgdGVtcGxhdGVgICsgYHBhcmFtc2Bcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGVtcGxhdGUsIHBhcmFtcykge1xuXHRpZiAoKC86KFteXFwvXFwuLV0rKShcXC57M30pPzovKS50ZXN0KHRlbXBsYXRlKSkge1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcIlRlbXBsYXRlIHBhcmFtZXRlciBuYW1lcyAqbXVzdCogYmUgc2VwYXJhdGVkXCIpXG5cdH1cblx0aWYgKHBhcmFtcyA9PSBudWxsKSByZXR1cm4gdGVtcGxhdGVcblx0dmFyIHF1ZXJ5SW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKFwiP1wiKVxuXHR2YXIgaGFzaEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZihcIiNcIilcblx0dmFyIHF1ZXJ5RW5kID0gaGFzaEluZGV4IDwgMCA/IHRlbXBsYXRlLmxlbmd0aCA6IGhhc2hJbmRleFxuXHR2YXIgcGF0aEVuZCA9IHF1ZXJ5SW5kZXggPCAwID8gcXVlcnlFbmQgOiBxdWVyeUluZGV4XG5cdHZhciBwYXRoID0gdGVtcGxhdGUuc2xpY2UoMCwgcGF0aEVuZClcblx0dmFyIHF1ZXJ5ID0ge31cblxuXHRhc3NpZ24ocXVlcnksIHBhcmFtcylcblxuXHR2YXIgcmVzb2x2ZWQgPSBwYXRoLnJlcGxhY2UoLzooW15cXC9cXC4tXSspKFxcLnszfSk/L2csIGZ1bmN0aW9uKG0sIGtleSwgdmFyaWFkaWMpIHtcblx0XHRkZWxldGUgcXVlcnlba2V5XVxuXHRcdC8vIElmIG5vIHN1Y2ggcGFyYW1ldGVyIGV4aXN0cywgZG9uJ3QgaW50ZXJwb2xhdGUgaXQuXG5cdFx0aWYgKHBhcmFtc1trZXldID09IG51bGwpIHJldHVybiBtXG5cdFx0Ly8gRXNjYXBlIG5vcm1hbCBwYXJhbWV0ZXJzLCBidXQgbm90IHZhcmlhZGljIG9uZXMuXG5cdFx0cmV0dXJuIHZhcmlhZGljID8gcGFyYW1zW2tleV0gOiBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHBhcmFtc1trZXldKSlcblx0fSlcblxuXHQvLyBJbiBjYXNlIHRoZSB0ZW1wbGF0ZSBzdWJzdGl0dXRpb24gYWRkcyBuZXcgcXVlcnkvaGFzaCBwYXJhbWV0ZXJzLlxuXHR2YXIgbmV3UXVlcnlJbmRleCA9IHJlc29sdmVkLmluZGV4T2YoXCI/XCIpXG5cdHZhciBuZXdIYXNoSW5kZXggPSByZXNvbHZlZC5pbmRleE9mKFwiI1wiKVxuXHR2YXIgbmV3UXVlcnlFbmQgPSBuZXdIYXNoSW5kZXggPCAwID8gcmVzb2x2ZWQubGVuZ3RoIDogbmV3SGFzaEluZGV4XG5cdHZhciBuZXdQYXRoRW5kID0gbmV3UXVlcnlJbmRleCA8IDAgPyBuZXdRdWVyeUVuZCA6IG5ld1F1ZXJ5SW5kZXhcblx0dmFyIHJlc3VsdCA9IHJlc29sdmVkLnNsaWNlKDAsIG5ld1BhdGhFbmQpXG5cblx0aWYgKHF1ZXJ5SW5kZXggPj0gMCkgcmVzdWx0ICs9IHRlbXBsYXRlLnNsaWNlKHF1ZXJ5SW5kZXgsIHF1ZXJ5RW5kKVxuXHRpZiAobmV3UXVlcnlJbmRleCA+PSAwKSByZXN1bHQgKz0gKHF1ZXJ5SW5kZXggPCAwID8gXCI/XCIgOiBcIiZcIikgKyByZXNvbHZlZC5zbGljZShuZXdRdWVyeUluZGV4LCBuZXdRdWVyeUVuZClcblx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhxdWVyeSlcblx0aWYgKHF1ZXJ5c3RyaW5nKSByZXN1bHQgKz0gKHF1ZXJ5SW5kZXggPCAwICYmIG5ld1F1ZXJ5SW5kZXggPCAwID8gXCI/XCIgOiBcIiZcIikgKyBxdWVyeXN0cmluZ1xuXHRpZiAoaGFzaEluZGV4ID49IDApIHJlc3VsdCArPSB0ZW1wbGF0ZS5zbGljZShoYXNoSW5kZXgpXG5cdGlmIChuZXdIYXNoSW5kZXggPj0gMCkgcmVzdWx0ICs9IChoYXNoSW5kZXggPCAwID8gXCJcIiA6IFwiJlwiKSArIHJlc29sdmVkLnNsaWNlKG5ld0hhc2hJbmRleClcblx0cmV0dXJuIHJlc3VsdFxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIHBhcnNlUGF0aG5hbWUgPSByZXF1aXJlKFwiLi9wYXJzZVwiKVxuXG4vLyBDb21waWxlcyBhIHRlbXBsYXRlIGludG8gYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgcmVzb2x2ZWQgcGF0aCAod2l0aG91dCBxdWVyeVxuLy8gc3RyaW5ncykgYW5kIHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHRlbXBsYXRlIHBhcmFtZXRlcnMgd2l0aCB0aGVpclxuLy8gcGFyc2VkIHZhbHVlcy4gVGhpcyBleHBlY3RzIHRoZSBpbnB1dCBvZiB0aGUgY29tcGlsZWQgdGVtcGxhdGUgdG8gYmUgdGhlXG4vLyBvdXRwdXQgb2YgYHBhcnNlUGF0aG5hbWVgLiBOb3RlIHRoYXQgaXQgZG9lcyAqbm90KiByZW1vdmUgcXVlcnkgcGFyYW1ldGVyc1xuLy8gc3BlY2lmaWVkIGluIHRoZSB0ZW1wbGF0ZS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGVtcGxhdGUpIHtcblx0dmFyIHRlbXBsYXRlRGF0YSA9IHBhcnNlUGF0aG5hbWUodGVtcGxhdGUpXG5cdHZhciB0ZW1wbGF0ZUtleXMgPSBPYmplY3Qua2V5cyh0ZW1wbGF0ZURhdGEucGFyYW1zKVxuXHR2YXIga2V5cyA9IFtdXG5cdHZhciByZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgdGVtcGxhdGVEYXRhLnBhdGgucmVwbGFjZShcblx0XHQvLyBJIGVzY2FwZSBsaXRlcmFsIHRleHQgc28gcGVvcGxlIGNhbiB1c2UgdGhpbmdzIGxpa2UgYDpmaWxlLjpleHRgIG9yXG5cdFx0Ly8gYDpsYW5nLTpsb2NhbGVgIGluIHJvdXRlcy4gVGhpcyBpcyBhbGwgbWVyZ2VkIGludG8gb25lIHBhc3Mgc28gSVxuXHRcdC8vIGRvbid0IGFsc28gYWNjaWRlbnRhbGx5IGVzY2FwZSBgLWAgYW5kIG1ha2UgaXQgaGFyZGVyIHRvIGRldGVjdCBpdCB0b1xuXHRcdC8vIGJhbiBpdCBmcm9tIHRlbXBsYXRlIHBhcmFtZXRlcnMuXG5cdFx0LzooW15cXC8uLV0rKShcXC57M318XFwuKD8hXFwuKXwtKT98W1xcXFxeJCorLigpfFxcW1xcXXt9XS9nLFxuXHRcdGZ1bmN0aW9uKG0sIGtleSwgZXh0cmEpIHtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuIFwiXFxcXFwiICsgbVxuXHRcdFx0a2V5cy5wdXNoKHtrOiBrZXksIHI6IGV4dHJhID09PSBcIi4uLlwifSlcblx0XHRcdGlmIChleHRyYSA9PT0gXCIuLi5cIikgcmV0dXJuIFwiKC4qKVwiXG5cdFx0XHRpZiAoZXh0cmEgPT09IFwiLlwiKSByZXR1cm4gXCIoW14vXSspXFxcXC5cIlxuXHRcdFx0cmV0dXJuIFwiKFteL10rKVwiICsgKGV4dHJhIHx8IFwiXCIpXG5cdFx0fVxuXHQpICsgXCIkXCIpXG5cdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0Ly8gRmlyc3QsIGNoZWNrIHRoZSBwYXJhbXMuIFVzdWFsbHksIHRoZXJlIGlzbid0IGFueSwgYW5kIGl0J3MganVzdFxuXHRcdC8vIGNoZWNraW5nIGEgc3RhdGljIHNldC5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlS2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRlbXBsYXRlRGF0YS5wYXJhbXNbdGVtcGxhdGVLZXlzW2ldXSAhPT0gZGF0YS5wYXJhbXNbdGVtcGxhdGVLZXlzW2ldXSkgcmV0dXJuIGZhbHNlXG5cdFx0fVxuXHRcdC8vIElmIG5vIGludGVycG9sYXRpb25zIGV4aXN0LCBsZXQncyBza2lwIGFsbCB0aGUgY2VyZW1vbnlcblx0XHRpZiAoIWtleXMubGVuZ3RoKSByZXR1cm4gcmVnZXhwLnRlc3QoZGF0YS5wYXRoKVxuXHRcdHZhciB2YWx1ZXMgPSByZWdleHAuZXhlYyhkYXRhLnBhdGgpXG5cdFx0aWYgKHZhbHVlcyA9PSBudWxsKSByZXR1cm4gZmFsc2Vcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGRhdGEucGFyYW1zW2tleXNbaV0ua10gPSBrZXlzW2ldLnIgPyB2YWx1ZXNbaSArIDFdIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpICsgMV0pXG5cdFx0fVxuXHRcdHJldHVybiB0cnVlXG5cdH1cbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBwYXJzZVF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4uL3F1ZXJ5c3RyaW5nL3BhcnNlXCIpXG5cbi8vIFJldHVybnMgYHtwYXRoLCBwYXJhbXN9YCBmcm9tIGB1cmxgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCkge1xuXHR2YXIgcXVlcnlJbmRleCA9IHVybC5pbmRleE9mKFwiP1wiKVxuXHR2YXIgaGFzaEluZGV4ID0gdXJsLmluZGV4T2YoXCIjXCIpXG5cdHZhciBxdWVyeUVuZCA9IGhhc2hJbmRleCA8IDAgPyB1cmwubGVuZ3RoIDogaGFzaEluZGV4XG5cdHZhciBwYXRoRW5kID0gcXVlcnlJbmRleCA8IDAgPyBxdWVyeUVuZCA6IHF1ZXJ5SW5kZXhcblx0dmFyIHBhdGggPSB1cmwuc2xpY2UoMCwgcGF0aEVuZCkucmVwbGFjZSgvXFwvezIsfS9nLCBcIi9cIilcblxuXHRpZiAoIXBhdGgpIHBhdGggPSBcIi9cIlxuXHRlbHNlIHtcblx0XHRpZiAocGF0aFswXSAhPT0gXCIvXCIpIHBhdGggPSBcIi9cIiArIHBhdGhcblx0XHRpZiAocGF0aC5sZW5ndGggPiAxICYmIHBhdGhbcGF0aC5sZW5ndGggLSAxXSA9PT0gXCIvXCIpIHBhdGggPSBwYXRoLnNsaWNlKDAsIC0xKVxuXHR9XG5cdHJldHVybiB7XG5cdFx0cGF0aDogcGF0aCxcblx0XHRwYXJhbXM6IHF1ZXJ5SW5kZXggPCAwXG5cdFx0XHQ/IHt9XG5cdFx0XHQ6IHBhcnNlUXVlcnlTdHJpbmcodXJsLnNsaWNlKHF1ZXJ5SW5kZXggKyAxLCBxdWVyeUVuZCkpLFxuXHR9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuLyoqIEBjb25zdHJ1Y3RvciAqL1xudmFyIFByb21pc2VQb2x5ZmlsbCA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9taXNlIG11c3QgYmUgY2FsbGVkIHdpdGggYG5ld2BcIilcblx0aWYgKHR5cGVvZiBleGVjdXRvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpXG5cblx0dmFyIHNlbGYgPSB0aGlzLCByZXNvbHZlcnMgPSBbXSwgcmVqZWN0b3JzID0gW10sIHJlc29sdmVDdXJyZW50ID0gaGFuZGxlcihyZXNvbHZlcnMsIHRydWUpLCByZWplY3RDdXJyZW50ID0gaGFuZGxlcihyZWplY3RvcnMsIGZhbHNlKVxuXHR2YXIgaW5zdGFuY2UgPSBzZWxmLl9pbnN0YW5jZSA9IHtyZXNvbHZlcnM6IHJlc29sdmVycywgcmVqZWN0b3JzOiByZWplY3RvcnN9XG5cdHZhciBjYWxsQXN5bmMgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRJbW1lZGlhdGUgOiBzZXRUaW1lb3V0XG5cdGZ1bmN0aW9uIGhhbmRsZXIobGlzdCwgc2hvdWxkQWJzb3JiKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGV4ZWN1dGUodmFsdWUpIHtcblx0XHRcdHZhciB0aGVuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoc2hvdWxkQWJzb3JiICYmIHZhbHVlICE9IG51bGwgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikgJiYgdHlwZW9mICh0aGVuID0gdmFsdWUudGhlbikgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gc2VsZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgdy8gaXRzZWxmXCIpXG5cdFx0XHRcdFx0ZXhlY3V0ZU9uY2UodGhlbi5iaW5kKHZhbHVlKSlcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjYWxsQXN5bmMoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpZiAoIXNob3VsZEFic29yYiAmJiBsaXN0Lmxlbmd0aCA9PT0gMCkgY29uc29sZS5lcnJvcihcIlBvc3NpYmxlIHVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbjpcIiwgdmFsdWUpXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIGxpc3RbaV0odmFsdWUpXG5cdFx0XHRcdFx0XHRyZXNvbHZlcnMubGVuZ3RoID0gMCwgcmVqZWN0b3JzLmxlbmd0aCA9IDBcblx0XHRcdFx0XHRcdGluc3RhbmNlLnN0YXRlID0gc2hvdWxkQWJzb3JiXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5yZXRyeSA9IGZ1bmN0aW9uKCkge2V4ZWN1dGUodmFsdWUpfVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdHJlamVjdEN1cnJlbnQoZSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gZXhlY3V0ZU9uY2UodGhlbikge1xuXHRcdHZhciBydW5zID0gMFxuXHRcdGZ1bmN0aW9uIHJ1bihmbikge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGlmIChydW5zKysgPiAwKSByZXR1cm5cblx0XHRcdFx0Zm4odmFsdWUpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBvbmVycm9yID0gcnVuKHJlamVjdEN1cnJlbnQpXG5cdFx0dHJ5IHt0aGVuKHJ1bihyZXNvbHZlQ3VycmVudCksIG9uZXJyb3IpfSBjYXRjaCAoZSkge29uZXJyb3IoZSl9XG5cdH1cblxuXHRleGVjdXRlT25jZShleGVjdXRvcilcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGlvbikge1xuXHR2YXIgc2VsZiA9IHRoaXMsIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2Vcblx0ZnVuY3Rpb24gaGFuZGxlKGNhbGxiYWNrLCBsaXN0LCBuZXh0LCBzdGF0ZSkge1xuXHRcdGxpc3QucHVzaChmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSBuZXh0KHZhbHVlKVxuXHRcdFx0ZWxzZSB0cnkge3Jlc29sdmVOZXh0KGNhbGxiYWNrKHZhbHVlKSl9IGNhdGNoIChlKSB7aWYgKHJlamVjdE5leHQpIHJlamVjdE5leHQoZSl9XG5cdFx0fSlcblx0XHRpZiAodHlwZW9mIGluc3RhbmNlLnJldHJ5ID09PSBcImZ1bmN0aW9uXCIgJiYgc3RhdGUgPT09IGluc3RhbmNlLnN0YXRlKSBpbnN0YW5jZS5yZXRyeSgpXG5cdH1cblx0dmFyIHJlc29sdmVOZXh0LCByZWplY3ROZXh0XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtyZXNvbHZlTmV4dCA9IHJlc29sdmUsIHJlamVjdE5leHQgPSByZWplY3R9KVxuXHRoYW5kbGUob25GdWxmaWxsZWQsIGluc3RhbmNlLnJlc29sdmVycywgcmVzb2x2ZU5leHQsIHRydWUpLCBoYW5kbGUob25SZWplY3Rpb24sIGluc3RhbmNlLnJlamVjdG9ycywgcmVqZWN0TmV4dCwgZmFsc2UpXG5cdHJldHVybiBwcm9taXNlXG59XG5Qcm9taXNlUG9seWZpbGwucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcblx0cmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbilcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuZmluYWxseSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHJldHVybiB0aGlzLnRoZW4oXG5cdFx0ZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHJldHVybiBQcm9taXNlUG9seWZpbGwucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWVcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRmdW5jdGlvbihyZWFzb24pIHtcblx0XHRcdHJldHVybiBQcm9taXNlUG9seWZpbGwucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZVBvbHlmaWxsLnJlamVjdChyZWFzb24pO1xuXHRcdFx0fSlcblx0XHR9XG5cdClcbn1cblByb21pc2VQb2x5ZmlsbC5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZVBvbHlmaWxsKSByZXR1cm4gdmFsdWVcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSkge3Jlc29sdmUodmFsdWUpfSlcbn1cblByb21pc2VQb2x5ZmlsbC5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtyZWplY3QodmFsdWUpfSlcbn1cblByb21pc2VQb2x5ZmlsbC5hbGwgPSBmdW5jdGlvbihsaXN0KSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHZhciB0b3RhbCA9IGxpc3QubGVuZ3RoLCBjb3VudCA9IDAsIHZhbHVlcyA9IFtdXG5cdFx0aWYgKGxpc3QubGVuZ3RoID09PSAwKSByZXNvbHZlKFtdKVxuXHRcdGVsc2UgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHQoZnVuY3Rpb24oaSkge1xuXHRcdFx0XHRmdW5jdGlvbiBjb25zdW1lKHZhbHVlKSB7XG5cdFx0XHRcdFx0Y291bnQrK1xuXHRcdFx0XHRcdHZhbHVlc1tpXSA9IHZhbHVlXG5cdFx0XHRcdFx0aWYgKGNvdW50ID09PSB0b3RhbCkgcmVzb2x2ZSh2YWx1ZXMpXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGxpc3RbaV0gIT0gbnVsbCAmJiAodHlwZW9mIGxpc3RbaV0gPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGxpc3RbaV0gPT09IFwiZnVuY3Rpb25cIikgJiYgdHlwZW9mIGxpc3RbaV0udGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0bGlzdFtpXS50aGVuKGNvbnN1bWUsIHJlamVjdClcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGNvbnN1bWUobGlzdFtpXSlcblx0XHRcdH0pKGkpXG5cdFx0fVxuXHR9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJhY2UgPSBmdW5jdGlvbihsaXN0KSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGlzdFtpXS50aGVuKHJlc29sdmUsIHJlamVjdClcblx0XHR9XG5cdH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZVBvbHlmaWxsXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgUHJvbWlzZVBvbHlmaWxsID0gcmVxdWlyZShcIi4vcG9seWZpbGxcIilcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aWYgKHR5cGVvZiB3aW5kb3cuUHJvbWlzZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdH0gZWxzZSBpZiAoIXdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS5maW5hbGx5KSB7XG5cdFx0d2luZG93LlByb21pc2UucHJvdG90eXBlLmZpbmFsbHkgPSBQcm9taXNlUG9seWZpbGwucHJvdG90eXBlLmZpbmFsbHlcblx0fVxuXHRtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5Qcm9taXNlXG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWwuUHJvbWlzZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdH0gZWxzZSBpZiAoIWdsb2JhbC5Qcm9taXNlLnByb3RvdHlwZS5maW5hbGx5KSB7XG5cdFx0Z2xvYmFsLlByb21pc2UucHJvdG90eXBlLmZpbmFsbHkgPSBQcm9taXNlUG9seWZpbGwucHJvdG90eXBlLmZpbmFsbHlcblx0fVxuXHRtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5Qcm9taXNlXG59IGVsc2Uge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFByb21pc2VQb2x5ZmlsbFxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QpIHtcblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpICE9PSBcIltvYmplY3QgT2JqZWN0XVwiKSByZXR1cm4gXCJcIlxuXG5cdHZhciBhcmdzID0gW11cblx0Zm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuXHRcdGRlc3RydWN0dXJlKGtleSwgb2JqZWN0W2tleV0pXG5cdH1cblxuXHRyZXR1cm4gYXJncy5qb2luKFwiJlwiKVxuXG5cdGZ1bmN0aW9uIGRlc3RydWN0dXJlKGtleSwgdmFsdWUpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0ZGVzdHJ1Y3R1cmUoa2V5ICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRmb3IgKHZhciBpIGluIHZhbHVlKSB7XG5cdFx0XHRcdGRlc3RydWN0dXJlKGtleSArIFwiW1wiICsgaSArIFwiXVwiLCB2YWx1ZVtpXSlcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBhcmdzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gXCJcIiA/IFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSA6IFwiXCIpKVxuXHR9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRpZiAoc3RyaW5nID09PSBcIlwiIHx8IHN0cmluZyA9PSBudWxsKSByZXR1cm4ge31cblx0aWYgKHN0cmluZy5jaGFyQXQoMCkgPT09IFwiP1wiKSBzdHJpbmcgPSBzdHJpbmcuc2xpY2UoMSlcblxuXHR2YXIgZW50cmllcyA9IHN0cmluZy5zcGxpdChcIiZcIiksIGNvdW50ZXJzID0ge30sIGRhdGEgPSB7fVxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZW50cnkgPSBlbnRyaWVzW2ldLnNwbGl0KFwiPVwiKVxuXHRcdHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoZW50cnlbMF0pXG5cdFx0dmFyIHZhbHVlID0gZW50cnkubGVuZ3RoID09PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KGVudHJ5WzFdKSA6IFwiXCJcblxuXHRcdGlmICh2YWx1ZSA9PT0gXCJ0cnVlXCIpIHZhbHVlID0gdHJ1ZVxuXHRcdGVsc2UgaWYgKHZhbHVlID09PSBcImZhbHNlXCIpIHZhbHVlID0gZmFsc2VcblxuXHRcdHZhciBsZXZlbHMgPSBrZXkuc3BsaXQoL1xcXVxcWz98XFxbLylcblx0XHR2YXIgY3Vyc29yID0gZGF0YVxuXHRcdGlmIChrZXkuaW5kZXhPZihcIltcIikgPiAtMSkgbGV2ZWxzLnBvcCgpXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsZXZlbHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBsZXZlbCA9IGxldmVsc1tqXSwgbmV4dExldmVsID0gbGV2ZWxzW2ogKyAxXVxuXHRcdFx0dmFyIGlzTnVtYmVyID0gbmV4dExldmVsID09IFwiXCIgfHwgIWlzTmFOKHBhcnNlSW50KG5leHRMZXZlbCwgMTApKVxuXHRcdFx0aWYgKGxldmVsID09PSBcIlwiKSB7XG5cdFx0XHRcdHZhciBrZXkgPSBsZXZlbHMuc2xpY2UoMCwgaikuam9pbigpXG5cdFx0XHRcdGlmIChjb3VudGVyc1trZXldID09IG51bGwpIHtcblx0XHRcdFx0XHRjb3VudGVyc1trZXldID0gQXJyYXkuaXNBcnJheShjdXJzb3IpID8gY3Vyc29yLmxlbmd0aCA6IDBcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXZlbCA9IGNvdW50ZXJzW2tleV0rK1xuXHRcdFx0fVxuXHRcdFx0Ly8gRGlzYWxsb3cgZGlyZWN0IHByb3RvdHlwZSBwb2xsdXRpb25cblx0XHRcdGVsc2UgaWYgKGxldmVsID09PSBcIl9fcHJvdG9fX1wiKSBicmVha1xuXHRcdFx0aWYgKGogPT09IGxldmVscy5sZW5ndGggLSAxKSBjdXJzb3JbbGV2ZWxdID0gdmFsdWVcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBSZWFkIG93biBwcm9wZXJ0aWVzIGV4Y2x1c2l2ZWx5IHRvIGRpc2FsbG93IGluZGlyZWN0XG5cdFx0XHRcdC8vIHByb3RvdHlwZSBwb2xsdXRpb25cblx0XHRcdFx0dmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGN1cnNvciwgbGV2ZWwpXG5cdFx0XHRcdGlmIChkZXNjICE9IG51bGwpIGRlc2MgPSBkZXNjLnZhbHVlXG5cdFx0XHRcdGlmIChkZXNjID09IG51bGwpIGN1cnNvcltsZXZlbF0gPSBkZXNjID0gaXNOdW1iZXIgPyBbXSA6IHt9XG5cdFx0XHRcdGN1cnNvciA9IGRlc2Ncblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGFcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcmVuZGVyL3JlbmRlclwiKSh3aW5kb3cpXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG52YXIgaHlwZXJzY3JpcHRWbm9kZSA9IHJlcXVpcmUoXCIuL2h5cGVyc2NyaXB0Vm5vZGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHZub2RlID0gaHlwZXJzY3JpcHRWbm9kZS5hcHBseSgwLCBhcmd1bWVudHMpXG5cblx0dm5vZGUudGFnID0gXCJbXCJcblx0dm5vZGUuY2hpbGRyZW4gPSBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbih2bm9kZS5jaGlsZHJlbilcblx0cmV0dXJuIHZub2RlXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG52YXIgaHlwZXJzY3JpcHRWbm9kZSA9IHJlcXVpcmUoXCIuL2h5cGVyc2NyaXB0Vm5vZGVcIilcblxudmFyIHNlbGVjdG9yUGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsoLis/KSg/Olxccyo9XFxzKihcInwnfCkoKD86XFxcXFtcIidcXF1dfC4pKj8pXFw1KT9cXF0pL2dcbnZhciBzZWxlY3RvckNhY2hlID0ge31cbnZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iamVjdCkge1xuXHRmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSBpZiAoaGFzT3duLmNhbGwob2JqZWN0LCBrZXkpKSByZXR1cm4gZmFsc2Vcblx0cmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gY29tcGlsZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG5cdHZhciBtYXRjaCwgdGFnID0gXCJkaXZcIiwgY2xhc3NlcyA9IFtdLCBhdHRycyA9IHt9XG5cdHdoaWxlIChtYXRjaCA9IHNlbGVjdG9yUGFyc2VyLmV4ZWMoc2VsZWN0b3IpKSB7XG5cdFx0dmFyIHR5cGUgPSBtYXRjaFsxXSwgdmFsdWUgPSBtYXRjaFsyXVxuXHRcdGlmICh0eXBlID09PSBcIlwiICYmIHZhbHVlICE9PSBcIlwiKSB0YWcgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiI1wiKSBhdHRycy5pZCA9IHZhbHVlXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaCh2YWx1ZSlcblx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcblx0XHRcdHZhciBhdHRyVmFsdWUgPSBtYXRjaFs2XVxuXHRcdFx0aWYgKGF0dHJWYWx1ZSkgYXR0clZhbHVlID0gYXR0clZhbHVlLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csIFwiJDFcIikucmVwbGFjZSgvXFxcXFxcXFwvZywgXCJcXFxcXCIpXG5cdFx0XHRpZiAobWF0Y2hbNF0gPT09IFwiY2xhc3NcIikgY2xhc3Nlcy5wdXNoKGF0dHJWYWx1ZSlcblx0XHRcdGVsc2UgYXR0cnNbbWF0Y2hbNF1dID0gYXR0clZhbHVlID09PSBcIlwiID8gYXR0clZhbHVlIDogYXR0clZhbHVlIHx8IHRydWVcblx0XHR9XG5cdH1cblx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgYXR0cnMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKVxuXHRyZXR1cm4gc2VsZWN0b3JDYWNoZVtzZWxlY3Rvcl0gPSB7dGFnOiB0YWcsIGF0dHJzOiBhdHRyc31cbn1cblxuZnVuY3Rpb24gZXhlY1NlbGVjdG9yKHN0YXRlLCB2bm9kZSkge1xuXHR2YXIgYXR0cnMgPSB2bm9kZS5hdHRyc1xuXHR2YXIgY2hpbGRyZW4gPSBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbih2bm9kZS5jaGlsZHJlbilcblx0dmFyIGhhc0NsYXNzID0gaGFzT3duLmNhbGwoYXR0cnMsIFwiY2xhc3NcIilcblx0dmFyIGNsYXNzTmFtZSA9IGhhc0NsYXNzID8gYXR0cnMuY2xhc3MgOiBhdHRycy5jbGFzc05hbWVcblxuXHR2bm9kZS50YWcgPSBzdGF0ZS50YWdcblx0dm5vZGUuYXR0cnMgPSBudWxsXG5cdHZub2RlLmNoaWxkcmVuID0gdW5kZWZpbmVkXG5cblx0aWYgKCFpc0VtcHR5KHN0YXRlLmF0dHJzKSAmJiAhaXNFbXB0eShhdHRycykpIHtcblx0XHR2YXIgbmV3QXR0cnMgPSB7fVxuXG5cdFx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0XHRpZiAoaGFzT3duLmNhbGwoYXR0cnMsIGtleSkpIG5ld0F0dHJzW2tleV0gPSBhdHRyc1trZXldXG5cdFx0fVxuXG5cdFx0YXR0cnMgPSBuZXdBdHRyc1xuXHR9XG5cblx0Zm9yICh2YXIga2V5IGluIHN0YXRlLmF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKHN0YXRlLmF0dHJzLCBrZXkpICYmIGtleSAhPT0gXCJjbGFzc05hbWVcIiAmJiAhaGFzT3duLmNhbGwoYXR0cnMsIGtleSkpe1xuXHRcdFx0YXR0cnNba2V5XSA9IHN0YXRlLmF0dHJzW2tleV1cblx0XHR9XG5cdH1cblx0aWYgKGNsYXNzTmFtZSAhPSBudWxsIHx8IHN0YXRlLmF0dHJzLmNsYXNzTmFtZSAhPSBudWxsKSBhdHRycy5jbGFzc05hbWUgPVxuXHRcdGNsYXNzTmFtZSAhPSBudWxsXG5cdFx0XHQ/IHN0YXRlLmF0dHJzLmNsYXNzTmFtZSAhPSBudWxsXG5cdFx0XHRcdD8gU3RyaW5nKHN0YXRlLmF0dHJzLmNsYXNzTmFtZSkgKyBcIiBcIiArIFN0cmluZyhjbGFzc05hbWUpXG5cdFx0XHRcdDogY2xhc3NOYW1lXG5cdFx0XHQ6IHN0YXRlLmF0dHJzLmNsYXNzTmFtZSAhPSBudWxsXG5cdFx0XHRcdD8gc3RhdGUuYXR0cnMuY2xhc3NOYW1lXG5cdFx0XHRcdDogbnVsbFxuXG5cdGlmIChoYXNDbGFzcykgYXR0cnMuY2xhc3MgPSBudWxsXG5cblx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBrZXkpICYmIGtleSAhPT0gXCJrZXlcIikge1xuXHRcdFx0dm5vZGUuYXR0cnMgPSBhdHRyc1xuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblxuXHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIGNoaWxkcmVuWzBdICE9IG51bGwgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIiNcIikge1xuXHRcdHZub2RlLnRleHQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHR9IGVsc2Uge1xuXHRcdHZub2RlLmNoaWxkcmVuID0gY2hpbGRyZW5cblx0fVxuXG5cdHJldHVybiB2bm9kZVxufVxuXG5mdW5jdGlvbiBoeXBlcnNjcmlwdChzZWxlY3Rvcikge1xuXHRpZiAoc2VsZWN0b3IgPT0gbnVsbCB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNlbGVjdG9yLnZpZXcgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHRocm93IEVycm9yKFwiVGhlIHNlbGVjdG9yIG11c3QgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGEgY29tcG9uZW50LlwiKTtcblx0fVxuXG5cdHZhciB2bm9kZSA9IGh5cGVyc2NyaXB0Vm5vZGUuYXBwbHkoMSwgYXJndW1lbnRzKVxuXG5cdGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIpIHtcblx0XHR2bm9kZS5jaGlsZHJlbiA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlLmNoaWxkcmVuKVxuXHRcdGlmIChzZWxlY3RvciAhPT0gXCJbXCIpIHJldHVybiBleGVjU2VsZWN0b3Ioc2VsZWN0b3JDYWNoZVtzZWxlY3Rvcl0gfHwgY29tcGlsZVNlbGVjdG9yKHNlbGVjdG9yKSwgdm5vZGUpXG5cdH1cblxuXHR2bm9kZS50YWcgPSBzZWxlY3RvclxuXHRyZXR1cm4gdm5vZGVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoeXBlcnNjcmlwdFxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFZub2RlID0gcmVxdWlyZShcIi4uL3JlbmRlci92bm9kZVwiKVxuXG4vLyBDYWxsIHZpYSBgaHlwZXJzY3JpcHRWbm9kZS5hcHBseShzdGFydE9mZnNldCwgYXJndW1lbnRzKWBcbi8vXG4vLyBUaGUgcmVhc29uIEkgZG8gaXQgdGhpcyB3YXksIGZvcndhcmRpbmcgdGhlIGFyZ3VtZW50cyBhbmQgcGFzc2luZyB0aGUgc3RhcnRcbi8vIG9mZnNldCBpbiBgdGhpc2AsIGlzIHNvIEkgZG9uJ3QgaGF2ZSB0byBjcmVhdGUgYSB0ZW1wb3JhcnkgYXJyYXkgaW4gYVxuLy8gcGVyZm9ybWFuY2UtY3JpdGljYWwgcGF0aC5cbi8vXG4vLyBJbiBuYXRpdmUgRVM2LCBJJ2QgaW5zdGVhZCBhZGQgYSBmaW5hbCBgLi4uYXJnc2AgcGFyYW1ldGVyIHRvIHRoZVxuLy8gYGh5cGVyc2NyaXB0YCBhbmQgYGZyYWdtZW50YCBmYWN0b3JpZXMgYW5kIGRlZmluZSB0aGlzIGFzXG4vLyBgaHlwZXJzY3JpcHRWbm9kZSguLi5hcmdzKWAsIHNpbmNlIG1vZGVybiBlbmdpbmVzIGRvIG9wdGltaXplIHRoYXQgYXdheS4gQnV0XG4vLyBFUzUgKHdoYXQgTWl0aHJpbCByZXF1aXJlcyB0aGFua3MgdG8gSUUgc3VwcG9ydCkgZG9lc24ndCBnaXZlIG1lIHRoYXQgbHV4dXJ5LFxuLy8gYW5kIGVuZ2luZXMgYXJlbid0IG5lYXJseSBpbnRlbGxpZ2VudCBlbm91Z2ggdG8gZG8gZWl0aGVyIG9mIHRoZXNlOlxuLy9cbi8vIDEuIEVsaWRlIHRoZSBhbGxvY2F0aW9uIGZvciBgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpYCB3aGVuIGl0J3MgcGFzc2VkIHRvXG4vLyAgICBhbm90aGVyIGZ1bmN0aW9uIG9ubHkgdG8gYmUgaW5kZXhlZC5cbi8vIDIuIEVsaWRlIGFuIGBhcmd1bWVudHNgIGFsbG9jYXRpb24gd2hlbiBpdCdzIHBhc3NlZCB0byBhbnkgZnVuY3Rpb24gb3RoZXJcbi8vICAgIHRoYW4gYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAgb3IgYFJlZmxlY3QuYXBwbHlgLlxuLy9cbi8vIEluIEVTNiwgaXQnZCBwcm9iYWJseSBsb29rIGNsb3NlciB0byB0aGlzIChJJ2QgbmVlZCB0byBwcm9maWxlIGl0LCB0aG91Z2gpOlxuLy8gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhdHRycywgLi4uY2hpbGRyZW4pIHtcbi8vICAgICBpZiAoYXR0cnMgPT0gbnVsbCB8fCB0eXBlb2YgYXR0cnMgPT09IFwib2JqZWN0XCIgJiYgYXR0cnMudGFnID09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkoYXR0cnMpKSB7XG4vLyAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgQXJyYXkuaXNBcnJheShjaGlsZHJlblswXSkpIGNoaWxkcmVuID0gY2hpbGRyZW5bMF1cbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLmxlbmd0aCA9PT0gMCAmJiBBcnJheS5pc0FycmF5KGF0dHJzKSA/IGF0dHJzIDogW2F0dHJzLCAuLi5jaGlsZHJlbl1cbi8vICAgICAgICAgYXR0cnMgPSB1bmRlZmluZWRcbi8vICAgICB9XG4vL1xuLy8gICAgIGlmIChhdHRycyA9PSBudWxsKSBhdHRycyA9IHt9XG4vLyAgICAgcmV0dXJuIFZub2RlKFwiXCIsIGF0dHJzLmtleSwgYXR0cnMsIGNoaWxkcmVuKVxuLy8gfVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGF0dHJzID0gYXJndW1lbnRzW3RoaXNdLCBzdGFydCA9IHRoaXMgKyAxLCBjaGlsZHJlblxuXG5cdGlmIChhdHRycyA9PSBudWxsKSB7XG5cdFx0YXR0cnMgPSB7fVxuXHR9IGVsc2UgaWYgKHR5cGVvZiBhdHRycyAhPT0gXCJvYmplY3RcIiB8fCBhdHRycy50YWcgIT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KGF0dHJzKSkge1xuXHRcdGF0dHJzID0ge31cblx0XHRzdGFydCA9IHRoaXNcblx0fVxuXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSBzdGFydCArIDEpIHtcblx0XHRjaGlsZHJlbiA9IGFyZ3VtZW50c1tzdGFydF1cblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSBjaGlsZHJlbiA9IFtjaGlsZHJlbl1cblx0fSBlbHNlIHtcblx0XHRjaGlsZHJlbiA9IFtdXG5cdFx0d2hpbGUgKHN0YXJ0IDwgYXJndW1lbnRzLmxlbmd0aCkgY2hpbGRyZW4ucHVzaChhcmd1bWVudHNbc3RhcnQrK10pXG5cdH1cblxuXHRyZXR1cm4gVm5vZGUoXCJcIiwgYXR0cnMua2V5LCBhdHRycywgY2hpbGRyZW4pXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdykge1xuXHR2YXIgJGRvYyA9ICR3aW5kb3cgJiYgJHdpbmRvdy5kb2N1bWVudFxuXHR2YXIgY3VycmVudFJlZHJhd1xuXG5cdHZhciBuYW1lU3BhY2UgPSB7XG5cdFx0c3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0bWF0aDogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCJcblx0fVxuXG5cdGZ1bmN0aW9uIGdldE5hbWVTcGFjZSh2bm9kZSkge1xuXHRcdHJldHVybiB2bm9kZS5hdHRycyAmJiB2bm9kZS5hdHRycy54bWxucyB8fCBuYW1lU3BhY2Vbdm5vZGUudGFnXVxuXHR9XG5cblx0Ly9zYW5pdHkgY2hlY2sgdG8gZGlzY291cmFnZSBwZW9wbGUgZnJvbSBkb2luZyBgdm5vZGUuc3RhdGUgPSAuLi5gXG5cdGZ1bmN0aW9uIGNoZWNrU3RhdGUodm5vZGUsIG9yaWdpbmFsKSB7XG5cdFx0aWYgKHZub2RlLnN0YXRlICE9PSBvcmlnaW5hbCkgdGhyb3cgbmV3IEVycm9yKFwiYHZub2RlLnN0YXRlYCBtdXN0IG5vdCBiZSBtb2RpZmllZFwiKVxuXHR9XG5cblx0Ly9Ob3RlOiB0aGUgaG9vayBpcyBwYXNzZWQgYXMgdGhlIGB0aGlzYCBhcmd1bWVudCB0byBhbGxvdyBwcm94eWluZyB0aGVcblx0Ly9hcmd1bWVudHMgd2l0aG91dCByZXF1aXJpbmcgYSBmdWxsIGFycmF5IGFsbG9jYXRpb24gdG8gZG8gc28uIEl0IGFsc29cblx0Ly90YWtlcyBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhlIGN1cnJlbnQgYHZub2RlYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQgaW5cblx0Ly9hbGwgbGlmZWN5Y2xlIG1ldGhvZHMuXG5cdGZ1bmN0aW9uIGNhbGxIb29rKHZub2RlKSB7XG5cdFx0dmFyIG9yaWdpbmFsID0gdm5vZGUuc3RhdGVcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXBwbHkob3JpZ2luYWwsIGFyZ3VtZW50cylcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0Y2hlY2tTdGF0ZSh2bm9kZSwgb3JpZ2luYWwpXG5cdFx0fVxuXHR9XG5cblx0Ly8gSUUxMSAoYXQgbGVhc3QpIHRocm93cyBhbiBVbnNwZWNpZmllZEVycm9yIHdoZW4gYWNjZXNzaW5nIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgd2hlblxuXHQvLyBpbnNpZGUgYW4gaWZyYW1lLiBDYXRjaCBhbmQgc3dhbGxvdyB0aGlzIGVycm9yLCBhbmQgaGVhdnktaGFuZGlkbHkgcmV0dXJuIG51bGwuXG5cdGZ1bmN0aW9uIGFjdGl2ZUVsZW1lbnQoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdH1cblx0fVxuXHQvL2NyZWF0ZVxuXHRmdW5jdGlvbiBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG5cdFx0XHR2YXIgdm5vZGUgPSB2bm9kZXNbaV1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdGlmICh0eXBlb2YgdGFnID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgaW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdFx0c3dpdGNoICh0YWcpIHtcblx0XHRcdFx0Y2FzZSBcIiNcIjogY3JlYXRlVGV4dChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdGNhc2UgXCI8XCI6IGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbnMsIG5leHRTaWJsaW5nKTsgYnJlYWtcblx0XHRcdFx0Y2FzZSBcIltcIjogY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdGRlZmF1bHQ6IGNyZWF0ZUVsZW1lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBjcmVhdGVDb21wb25lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVUZXh0KHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKSB7XG5cdFx0dm5vZGUuZG9tID0gJGRvYy5jcmVhdGVUZXh0Tm9kZSh2bm9kZS5jaGlsZHJlbilcblx0XHRpbnNlcnROb2RlKHBhcmVudCwgdm5vZGUuZG9tLCBuZXh0U2libGluZylcblx0fVxuXHR2YXIgcG9zc2libGVQYXJlbnRzID0ge2NhcHRpb246IFwidGFibGVcIiwgdGhlYWQ6IFwidGFibGVcIiwgdGJvZHk6IFwidGFibGVcIiwgdGZvb3Q6IFwidGFibGVcIiwgdHI6IFwidGJvZHlcIiwgdGg6IFwidHJcIiwgdGQ6IFwidHJcIiwgY29sZ3JvdXA6IFwidGFibGVcIiwgY29sOiBcImNvbGdyb3VwXCJ9XG5cdGZ1bmN0aW9uIGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIG1hdGNoID0gdm5vZGUuY2hpbGRyZW4ubWF0Y2goL15cXHMqPzwoXFx3KykvaW0pIHx8IFtdXG5cdFx0Ly8gbm90IHVzaW5nIHRoZSBwcm9wZXIgcGFyZW50IG1ha2VzIHRoZSBjaGlsZCBlbGVtZW50KHMpIHZhbmlzaC5cblx0XHQvLyAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcblx0XHQvLyAgICAgZGl2LmlubmVySFRNTCA9IFwiPHRkPmk8L3RkPjx0ZD5qPC90ZD5cIlxuXHRcdC8vICAgICBjb25zb2xlLmxvZyhkaXYuaW5uZXJIVE1MKVxuXHRcdC8vIC0tPiBcImlqXCIsIG5vIDx0ZD4gaW4gc2lnaHQuXG5cdFx0dmFyIHRlbXAgPSAkZG9jLmNyZWF0ZUVsZW1lbnQocG9zc2libGVQYXJlbnRzW21hdGNoWzFdXSB8fCBcImRpdlwiKVxuXHRcdGlmIChucyA9PT0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKSB7XG5cdFx0XHR0ZW1wLmlubmVySFRNTCA9IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiPlwiICsgdm5vZGUuY2hpbGRyZW4gKyBcIjwvc3ZnPlwiXG5cdFx0XHR0ZW1wID0gdGVtcC5maXJzdENoaWxkXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRlbXAuaW5uZXJIVE1MID0gdm5vZGUuY2hpbGRyZW5cblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gdGVtcC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IHRlbXAuY2hpbGROb2Rlcy5sZW5ndGhcblx0XHQvLyBDYXB0dXJlIG5vZGVzIHRvIHJlbW92ZSwgc28gd2UgZG9uJ3QgY29uZnVzZSB0aGVtLlxuXHRcdHZub2RlLmluc3RhbmNlID0gW11cblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdHZhciBjaGlsZFxuXHRcdHdoaWxlIChjaGlsZCA9IHRlbXAuZmlyc3RDaGlsZCkge1xuXHRcdFx0dm5vZGUuaW5zdGFuY2UucHVzaChjaGlsZClcblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuXHRcdH1cblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZnJhZ21lbnQsIG5leHRTaWJsaW5nKVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdFx0Y3JlYXRlTm9kZXMoZnJhZ21lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gZnJhZ21lbnQuZmlyc3RDaGlsZFxuXHRcdHZub2RlLmRvbVNpemUgPSBmcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aFxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRWxlbWVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdHZhciBhdHRycyA9IHZub2RlLmF0dHJzXG5cdFx0dmFyIGlzID0gYXR0cnMgJiYgYXR0cnMuaXNcblxuXHRcdG5zID0gZ2V0TmFtZVNwYWNlKHZub2RlKSB8fCBuc1xuXG5cdFx0dmFyIGVsZW1lbnQgPSBucyA/XG5cdFx0XHRpcyA/ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcsIHtpczogaXN9KSA6ICRkb2MuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpIDpcblx0XHRcdGlzID8gJGRvYy5jcmVhdGVFbGVtZW50KHRhZywge2lzOiBpc30pIDogJGRvYy5jcmVhdGVFbGVtZW50KHRhZylcblx0XHR2bm9kZS5kb20gPSBlbGVtZW50XG5cblx0XHRpZiAoYXR0cnMgIT0gbnVsbCkge1xuXHRcdFx0c2V0QXR0cnModm5vZGUsIGF0dHJzLCBucylcblx0XHR9XG5cblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZWxlbWVudCwgbmV4dFNpYmxpbmcpXG5cblx0XHRpZiAoIW1heWJlU2V0Q29udGVudEVkaXRhYmxlKHZub2RlKSkge1xuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUudGV4dCAhPT0gXCJcIikgZWxlbWVudC50ZXh0Q29udGVudCA9IHZub2RlLnRleHRcblx0XHRcdFx0ZWxzZSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdH1cblx0XHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRcdGNyZWF0ZU5vZGVzKGVsZW1lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBhdHRycyAhPSBudWxsKSBzZXRMYXRlU2VsZWN0QXR0cnModm5vZGUsIGF0dHJzKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBpbml0Q29tcG9uZW50KHZub2RlLCBob29rcykge1xuXHRcdHZhciBzZW50aW5lbFxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnLnZpZXcgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSBPYmplY3QuY3JlYXRlKHZub2RlLnRhZylcblx0XHRcdHNlbnRpbmVsID0gdm5vZGUuc3RhdGUudmlld1xuXHRcdFx0aWYgKHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkICE9IG51bGwpIHJldHVyblxuXHRcdFx0c2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgPSB0cnVlXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZub2RlLnN0YXRlID0gdm9pZCAwXG5cdFx0XHRzZW50aW5lbCA9IHZub2RlLnRhZ1xuXHRcdFx0aWYgKHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkICE9IG51bGwpIHJldHVyblxuXHRcdFx0c2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgPSB0cnVlXG5cdFx0XHR2bm9kZS5zdGF0ZSA9ICh2bm9kZS50YWcucHJvdG90eXBlICE9IG51bGwgJiYgdHlwZW9mIHZub2RlLnRhZy5wcm90b3R5cGUudmlldyA9PT0gXCJmdW5jdGlvblwiKSA/IG5ldyB2bm9kZS50YWcodm5vZGUpIDogdm5vZGUudGFnKHZub2RlKVxuXHRcdH1cblx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLnN0YXRlLCB2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHR2bm9kZS5pbnN0YW5jZSA9IFZub2RlLm5vcm1hbGl6ZShjYWxsSG9vay5jYWxsKHZub2RlLnN0YXRlLnZpZXcsIHZub2RlKSlcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgPT09IHZub2RlKSB0aHJvdyBFcnJvcihcIkEgdmlldyBjYW5ub3QgcmV0dXJuIHRoZSB2bm9kZSBpdCByZWNlaXZlZCBhcyBhcmd1bWVudFwiKVxuXHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gbnVsbFxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0aW5pdENvbXBvbmVudCh2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZS5pbnN0YW5jZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdHZub2RlLmRvbSA9IHZub2RlLmluc3RhbmNlLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IHZub2RlLmRvbSAhPSBudWxsID8gdm5vZGUuaW5zdGFuY2UuZG9tU2l6ZSA6IDBcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2bm9kZS5kb21TaXplID0gMFxuXHRcdH1cblx0fVxuXG5cdC8vdXBkYXRlXG5cdC8qKlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR8RnJhZ21lbnR9IHBhcmVudCAtIHRoZSBwYXJlbnQgZWxlbWVudFxuXHQgKiBAcGFyYW0ge1Zub2RlW10gfCBudWxsfSBvbGQgLSB0aGUgbGlzdCBvZiB2bm9kZXMgb2YgdGhlIGxhc3QgYHJlbmRlcigpYCBjYWxsIGZvclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIHBhcnQgb2YgdGhlIHRyZWVcblx0ICogQHBhcmFtIHtWbm9kZVtdIHwgbnVsbH0gdm5vZGVzIC0gYXMgYWJvdmUsIGJ1dCBmb3IgdGhlIGN1cnJlbnQgYHJlbmRlcigpYCBjYWxsLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGhvb2tzIC0gYW4gYWNjdW11bGF0b3Igb2YgcG9zdC1yZW5kZXIgaG9va3MgKG9uY3JlYXRlL29udXBkYXRlKVxuXHQgKiBAcGFyYW0ge0VsZW1lbnQgfCBudWxsfSBuZXh0U2libGluZyAtIHRoZSBuZXh0IERPTSBub2RlIGlmIHdlJ3JlIGRlYWxpbmcgd2l0aCBhXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnQgdGhhdCBpcyBub3QgdGhlIGxhc3QgaXRlbSBpbiBpdHNcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRcblx0ICogQHBhcmFtIHsnc3ZnJyB8ICdtYXRoJyB8IFN0cmluZyB8IG51bGx9IG5zKSAtIHRoZSBjdXJyZW50IFhNTCBuYW1lc3BhY2UsIGlmIGFueVxuXHQgKiBAcmV0dXJucyB2b2lkXG5cdCAqL1xuXHQvLyBUaGlzIGZ1bmN0aW9uIGRpZmZzIGFuZCBwYXRjaGVzIGxpc3RzIG9mIHZub2RlcywgYm90aCBrZXllZCBhbmQgdW5rZXllZC5cblx0Ly9cblx0Ly8gV2Ugd2lsbDpcblx0Ly9cblx0Ly8gMS4gZGVzY3JpYmUgaXRzIGdlbmVyYWwgc3RydWN0dXJlXG5cdC8vIDIuIGZvY3VzIG9uIHRoZSBkaWZmIGFsZ29yaXRobSBvcHRpbWl6YXRpb25zXG5cdC8vIDMuIGRpc2N1c3MgRE9NIG5vZGUgb3BlcmF0aW9ucy5cblxuXHQvLyAjIyBPdmVydmlldzpcblx0Ly9cblx0Ly8gVGhlIHVwZGF0ZU5vZGVzKCkgZnVuY3Rpb246XG5cdC8vIC0gZGVhbHMgd2l0aCB0cml2aWFsIGNhc2VzXG5cdC8vIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBsaXN0cyBhcmUga2V5ZWQgb3IgdW5rZXllZCBiYXNlZCBvbiB0aGUgZmlyc3Qgbm9uLW51bGwgbm9kZVxuXHQvLyAgIG9mIGVhY2ggbGlzdC5cblx0Ly8gLSBkaWZmcyB0aGVtIGFuZCBwYXRjaGVzIHRoZSBET00gaWYgbmVlZGVkICh0aGF0J3MgdGhlIGJydW50IG9mIHRoZSBjb2RlKVxuXHQvLyAtIG1hbmFnZXMgdGhlIGxlZnRvdmVyczogYWZ0ZXIgZGlmZmluZywgYXJlIHRoZXJlOlxuXHQvLyAgIC0gb2xkIG5vZGVzIGxlZnQgdG8gcmVtb3ZlP1xuXHQvLyBcdCAtIG5ldyBub2RlcyB0byBpbnNlcnQ/XG5cdC8vIFx0IGRlYWwgd2l0aCB0aGVtIVxuXHQvL1xuXHQvLyBUaGUgbGlzdHMgYXJlIG9ubHkgaXRlcmF0ZWQgb3ZlciBvbmNlLCB3aXRoIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIG5vZGVzIGluIGBvbGRgIHRoYXRcblx0Ly8gYXJlIHZpc2l0ZWQgaW4gdGhlIGZvdXJ0aCBwYXJ0IG9mIHRoZSBkaWZmIGFuZCBpbiB0aGUgYHJlbW92ZU5vZGVzYCBsb29wLlxuXG5cdC8vICMjIERpZmZpbmdcblx0Ly9cblx0Ly8gUmVhZGluZyBodHRwczovL2dpdGh1Yi5jb20vbG9jYWx2b2lkL2l2aS9ibG9iL2RkYzA5ZDA2YWJhZWY0NTI0OGU2MTMzZjcwNDBkMDBkM2M2YmU4NTMvcGFja2FnZXMvaXZpL3NyYy92ZG9tL2ltcGxlbWVudGF0aW9uLnRzI0w2MTctTDgzN1xuXHQvLyBtYXkgYmUgZ29vZCBmb3IgY29udGV4dCBvbiBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2UtYmFzZWQgbG9naWMgZm9yIG1vdmluZyBub2Rlcy5cblx0Ly9cblx0Ly8gSW4gb3JkZXIgdG8gZGlmZiBrZXllZCBsaXN0cywgb25lIGhhcyB0b1xuXHQvL1xuXHQvLyAxKSBtYXRjaCBub2RlcyBpbiBib3RoIGxpc3RzLCBwZXIga2V5LCBhbmQgdXBkYXRlIHRoZW0gYWNjb3JkaW5nbHlcblx0Ly8gMikgY3JlYXRlIHRoZSBub2RlcyBwcmVzZW50IGluIHRoZSBuZXcgbGlzdCwgYnV0IGFic2VudCBpbiB0aGUgb2xkIG9uZVxuXHQvLyAzKSByZW1vdmUgdGhlIG5vZGVzIHByZXNlbnQgaW4gdGhlIG9sZCBsaXN0LCBidXQgYWJzZW50IGluIHRoZSBuZXcgb25lXG5cdC8vIDQpIGZpZ3VyZSBvdXQgd2hhdCBub2RlcyBpbiAxKSB0byBtb3ZlIGluIG9yZGVyIHRvIG1pbmltaXplIHRoZSBET00gb3BlcmF0aW9ucy5cblx0Ly9cblx0Ly8gVG8gYWNoaWV2ZSAxKSBvbmUgY2FuIGNyZWF0ZSBhIGRpY3Rpb25hcnkgb2Yga2V5cyA9PiBpbmRleCAoZm9yIHRoZSBvbGQgbGlzdCksIHRoZW4gaXRlcmF0ZVxuXHQvLyBvdmVyIHRoZSBuZXcgbGlzdCBhbmQgZm9yIGVhY2ggbmV3IHZub2RlLCBmaW5kIHRoZSBjb3JyZXNwb25kaW5nIHZub2RlIGluIHRoZSBvbGQgbGlzdCB1c2luZ1xuXHQvLyB0aGUgbWFwLlxuXHQvLyAyKSBpcyBhY2hpZXZlZCBpbiB0aGUgc2FtZSBzdGVwOiBpZiBhIG5ldyBub2RlIGhhcyBubyBjb3JyZXNwb25kaW5nIGVudHJ5IGluIHRoZSBtYXAsIGl0IGlzIG5ld1xuXHQvLyBhbmQgbXVzdCBiZSBjcmVhdGVkLlxuXHQvLyBGb3IgdGhlIHJlbW92YWxzLCB3ZSBhY3R1YWxseSByZW1vdmUgdGhlIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIHVwZGF0ZWQgZnJvbSB0aGUgb2xkIGxpc3QuXG5cdC8vIFRoZSBub2RlcyB0aGF0IHJlbWFpbiBpbiB0aGF0IGxpc3QgYWZ0ZXIgMSkgYW5kIDIpIGhhdmUgYmVlbiBwZXJmb3JtZWQgY2FuIGJlIHNhZmVseSByZW1vdmVkLlxuXHQvLyBUaGUgZm91cnRoIHN0ZXAgaXMgYSBiaXQgbW9yZSBjb21wbGV4IGFuZCByZWxpZXMgb24gdGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSAoTElTKVxuXHQvLyBhbGdvcml0aG0uXG5cdC8vXG5cdC8vIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2UgaXMgdGhlIGxpc3Qgb2Ygbm9kZXMgdGhhdCBjYW4gcmVtYWluIGluIHBsYWNlLiBJbWFnaW5lIGdvaW5nXG5cdC8vIGZyb20gYDEsMiwzLDQsNWAgdG8gYDQsNSwxLDIsM2Agd2hlcmUgdGhlIG51bWJlcnMgYXJlIG5vdCBuZWNlc3NhcmlseSB0aGUga2V5cywgYnV0IHRoZSBpbmRpY2VzXG5cdC8vIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGtleWVkIG5vZGVzIGluIHRoZSBvbGQgbGlzdCAoa2V5ZWQgbm9kZXMgYGUsZCxjLGIsYWAgPT4gYGIsYSxlLGQsY2Agd291bGRcblx0Ly8gIG1hdGNoIHRoZSBhYm92ZSBsaXN0cywgZm9yIGV4YW1wbGUpLlxuXHQvL1xuXHQvLyBJbiB0aGVyZSBhcmUgdHdvIGluY3JlYXNpbmcgc3Vic2VxdWVuY2VzOiBgNCw1YCBhbmQgYDEsMiwzYCwgdGhlIGxhdHRlciBiZWluZyB0aGUgbG9uZ2VzdC4gV2Vcblx0Ly8gY2FuIHVwZGF0ZSB0aG9zZSBub2RlcyB3aXRob3V0IG1vdmluZyB0aGVtLCBhbmQgb25seSBjYWxsIGBpbnNlcnROb2RlYCBvbiBgNGAgYW5kIGA1YC5cblx0Ly9cblx0Ly8gQGxvY2Fsdm9pZCBhZGFwdGVkIHRoZSBhbGdvIHRvIGFsc28gc3VwcG9ydCBub2RlIGRlbGV0aW9ucyBhbmQgaW5zZXJ0aW9ucyAodGhlIGBsaXNgIGlzIGFjdHVhbGx5XG5cdC8vIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2UgKm9mIG9sZCBub2RlcyBzdGlsbCBwcmVzZW50IGluIHRoZSBuZXcgbGlzdCopLlxuXHQvL1xuXHQvLyBJdCBpcyBhIGdlbmVyYWwgYWxnb3JpdGhtIHRoYXQgaXMgZmlyZXByb29mIGluIGFsbCBjaXJjdW1zdGFuY2VzLCBidXQgaXQgcmVxdWlyZXMgdGhlIGFsbG9jYXRpb25cblx0Ly8gYW5kIHRoZSBjb25zdHJ1Y3Rpb24gb2YgYSBga2V5ID0+IG9sZEluZGV4YCBtYXAsIGFuZCB0aHJlZSBhcnJheXMgKG9uZSB3aXRoIGBuZXdJbmRleCA9PiBvbGRJbmRleGAsXG5cdC8vIHRoZSBgTElTYCBhbmQgYSB0ZW1wb3Jhcnkgb25lIHRvIGNyZWF0ZSB0aGUgTElTKS5cblx0Ly9cblx0Ly8gU28gd2UgY2hlYXQgd2hlcmUgd2UgY2FuOiBpZiB0aGUgdGFpbHMgb2YgdGhlIGxpc3RzIGFyZSBpZGVudGljYWwsIHRoZXkgYXJlIGd1YXJhbnRlZWQgdG8gYmUgcGFydCBvZlxuXHQvLyB0aGUgTElTIGFuZCBjYW4gYmUgdXBkYXRlZCB3aXRob3V0IG1vdmluZyB0aGVtLlxuXHQvL1xuXHQvLyBJZiB0d28gbm9kZXMgYXJlIHN3YXBwZWQsIHRoZXkgYXJlIGd1YXJhbnRlZWQgbm90IHRvIGJlIHBhcnQgb2YgdGhlIExJUywgYW5kIG11c3QgYmUgbW92ZWQgKHdpdGhcblx0Ly8gdGhlIGV4Y2VwdGlvbiBvZiB0aGUgbGFzdCBub2RlIGlmIHRoZSBsaXN0IGlzIGZ1bGx5IHJldmVyc2VkKS5cblx0Ly9cblx0Ly8gIyMgRmluZGluZyB0aGUgbmV4dCBzaWJsaW5nLlxuXHQvL1xuXHQvLyBgdXBkYXRlTm9kZSgpYCBhbmQgYGNyZWF0ZU5vZGUoKWAgZXhwZWN0IGEgbmV4dFNpYmxpbmcgcGFyYW1ldGVyIHRvIHBlcmZvcm0gRE9NIG9wZXJhdGlvbnMuXG5cdC8vIFdoZW4gdGhlIGxpc3QgaXMgYmVpbmcgdHJhdmVyc2VkIHRvcC1kb3duLCBhdCBhbnkgaW5kZXgsIHRoZSBET00gbm9kZXMgdXAgdG8gdGhlIHByZXZpb3VzXG5cdC8vIHZub2RlIHJlZmxlY3QgdGhlIGNvbnRlbnQgb2YgdGhlIG5ldyBsaXN0LCB3aGVyZWFzIHRoZSByZXN0IG9mIHRoZSBET00gbm9kZXMgcmVmbGVjdCB0aGUgb2xkXG5cdC8vIGxpc3QuIFRoZSBuZXh0IHNpYmxpbmcgbXVzdCBiZSBsb29rZWQgZm9yIGluIHRoZSBvbGQgbGlzdCB1c2luZyBgZ2V0TmV4dFNpYmxpbmcoLi4uIG9sZFN0YXJ0ICsgMSAuLi4pYC5cblx0Ly9cblx0Ly8gSW4gdGhlIG90aGVyIHNjZW5hcmlvcyAoc3dhcHMsIHVwd2FyZHMgdHJhdmVyc2FsLCBtYXAtYmFzZWQgZGlmZiksXG5cdC8vIHRoZSBuZXcgdm5vZGVzIGxpc3QgaXMgdHJhdmVyc2VkIHVwd2FyZHMuIFRoZSBET00gbm9kZXMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgbGlzdCByZWZsZWN0IHRoZVxuXHQvLyBib3R0b20gcGFydCBvZiB0aGUgbmV3IHZub2RlcyBsaXN0LCBhbmQgd2UgY2FuIHVzZSB0aGUgYHYuZG9tYCAgdmFsdWUgb2YgdGhlIHByZXZpb3VzIG5vZGVcblx0Ly8gYXMgdGhlIG5leHQgc2libGluZyAoY2FjaGVkIGluIHRoZSBgbmV4dFNpYmxpbmdgIHZhcmlhYmxlKS5cblxuXG5cdC8vICMjIERPTSBub2RlIG1vdmVzXG5cdC8vXG5cdC8vIEluIG1vc3Qgc2NlbmFyaW9zIGB1cGRhdGVOb2RlKClgIGFuZCBgY3JlYXRlTm9kZSgpYCBwZXJmb3JtIHRoZSBET00gb3BlcmF0aW9ucy4gSG93ZXZlcixcblx0Ly8gdGhpcyBpcyBub3QgdGhlIGNhc2UgaWYgdGhlIG5vZGUgbW92ZWQgKHNlY29uZCBhbmQgZm91cnRoIHBhcnQgb2YgdGhlIGRpZmYgYWxnbykuIFdlIG1vdmVcblx0Ly8gdGhlIG9sZCBET00gbm9kZXMgYmVmb3JlIHVwZGF0ZU5vZGUgcnVucyBiZWNhdXNlIGl0IGVuYWJsZXMgdXMgdG8gdXNlIHRoZSBjYWNoZWQgYG5leHRTaWJsaW5nYFxuXHQvLyB2YXJpYWJsZSByYXRoZXIgdGhhbiBmZXRjaGluZyBpdCB1c2luZyBgZ2V0TmV4dFNpYmxpbmcoKWAuXG5cdC8vXG5cdC8vIFRoZSBmb3VydGggcGFydCBvZiB0aGUgZGlmZiBjdXJyZW50bHkgaW5zZXJ0cyBub2RlcyB1bmNvbmRpdGlvbmFsbHksIGxlYWRpbmcgdG8gaXNzdWVzXG5cdC8vIGxpa2UgIzE3OTEgYW5kICMxOTk5LiBXZSBuZWVkIHRvIGJlIHNtYXJ0ZXIgYWJvdXQgdGhvc2Ugc2l0dWF0aW9ucyB3aGVyZSBhZGphc2NlbnQgb2xkXG5cdC8vIG5vZGVzIHJlbWFpbiB0b2dldGhlciBpbiB0aGUgbmV3IGxpc3QgaW4gYSB3YXkgdGhhdCBpc24ndCBjb3ZlcmVkIGJ5IHBhcnRzIG9uZSBhbmRcblx0Ly8gdGhyZWUgb2YgdGhlIGRpZmYgYWxnby5cblxuXHRmdW5jdGlvbiB1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZCwgdm5vZGVzLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0aWYgKG9sZCA9PT0gdm5vZGVzIHx8IG9sZCA9PSBudWxsICYmIHZub2RlcyA9PSBudWxsKSByZXR1cm5cblx0XHRlbHNlIGlmIChvbGQgPT0gbnVsbCB8fCBvbGQubGVuZ3RoID09PSAwKSBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2RlcywgMCwgdm5vZGVzLmxlbmd0aCwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRlbHNlIGlmICh2bm9kZXMgPT0gbnVsbCB8fCB2bm9kZXMubGVuZ3RoID09PSAwKSByZW1vdmVOb2RlcyhwYXJlbnQsIG9sZCwgMCwgb2xkLmxlbmd0aClcblx0XHRlbHNlIHtcblx0XHRcdHZhciBpc09sZEtleWVkID0gb2xkWzBdICE9IG51bGwgJiYgb2xkWzBdLmtleSAhPSBudWxsXG5cdFx0XHR2YXIgaXNLZXllZCA9IHZub2Rlc1swXSAhPSBudWxsICYmIHZub2Rlc1swXS5rZXkgIT0gbnVsbFxuXHRcdFx0dmFyIHN0YXJ0ID0gMCwgb2xkU3RhcnQgPSAwXG5cdFx0XHRpZiAoIWlzT2xkS2V5ZWQpIHdoaWxlIChvbGRTdGFydCA8IG9sZC5sZW5ndGggJiYgb2xkW29sZFN0YXJ0XSA9PSBudWxsKSBvbGRTdGFydCsrXG5cdFx0XHRpZiAoIWlzS2V5ZWQpIHdoaWxlIChzdGFydCA8IHZub2Rlcy5sZW5ndGggJiYgdm5vZGVzW3N0YXJ0XSA9PSBudWxsKSBzdGFydCsrXG5cdFx0XHRpZiAoaXNLZXllZCA9PT0gbnVsbCAmJiBpc09sZEtleWVkID09IG51bGwpIHJldHVybiAvLyBib3RoIGxpc3RzIGFyZSBmdWxsIG9mIG51bGxzXG5cdFx0XHRpZiAoaXNPbGRLZXllZCAhPT0gaXNLZXllZCkge1xuXHRcdFx0XHRyZW1vdmVOb2RlcyhwYXJlbnQsIG9sZCwgb2xkU3RhcnQsIG9sZC5sZW5ndGgpXG5cdFx0XHRcdGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgdm5vZGVzLmxlbmd0aCwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdH0gZWxzZSBpZiAoIWlzS2V5ZWQpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgaW5kZXggcGFzdCB0aGUgZW5kIG9mIGVpdGhlciBsaXN0IChjYXVzZXMgZGVvcHRzKS5cblx0XHRcdFx0dmFyIGNvbW1vbkxlbmd0aCA9IG9sZC5sZW5ndGggPCB2bm9kZXMubGVuZ3RoID8gb2xkLmxlbmd0aCA6IHZub2Rlcy5sZW5ndGhcblx0XHRcdFx0Ly8gUmV3aW5kIGlmIG5lY2Vzc2FyeSB0byB0aGUgZmlyc3Qgbm9uLW51bGwgaW5kZXggb24gZWl0aGVyIHNpZGUuXG5cdFx0XHRcdC8vIFdlIGNvdWxkIGFsdGVybmF0aXZlbHkgZWl0aGVyIGV4cGxpY2l0bHkgY3JlYXRlIG9yIHJlbW92ZSBub2RlcyB3aGVuIGBzdGFydCAhPT0gb2xkU3RhcnRgXG5cdFx0XHRcdC8vIGJ1dCB0aGF0IHdvdWxkIGJlIG9wdGltaXppbmcgZm9yIHNwYXJzZSBsaXN0cyB3aGljaCBhcmUgbW9yZSByYXJlIHRoYW4gZGVuc2Ugb25lcy5cblx0XHRcdFx0c3RhcnQgPSBzdGFydCA8IG9sZFN0YXJ0ID8gc3RhcnQgOiBvbGRTdGFydFxuXHRcdFx0XHRmb3IgKDsgc3RhcnQgPCBjb21tb25MZW5ndGg7IHN0YXJ0KyspIHtcblx0XHRcdFx0XHRvID0gb2xkW3N0YXJ0XVxuXHRcdFx0XHRcdHYgPSB2bm9kZXNbc3RhcnRdXG5cdFx0XHRcdFx0aWYgKG8gPT09IHYgfHwgbyA9PSBudWxsICYmIHYgPT0gbnVsbCkgY29udGludWVcblx0XHRcdFx0XHRlbHNlIGlmIChvID09IG51bGwpIGNyZWF0ZU5vZGUocGFyZW50LCB2LCBob29rcywgbnMsIGdldE5leHRTaWJsaW5nKG9sZCwgc3RhcnQgKyAxLCBuZXh0U2libGluZykpXG5cdFx0XHRcdFx0ZWxzZSBpZiAodiA9PSBudWxsKSByZW1vdmVOb2RlKHBhcmVudCwgbylcblx0XHRcdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBzdGFydCArIDEsIG5leHRTaWJsaW5nKSwgbnMpXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9sZC5sZW5ndGggPiBjb21tb25MZW5ndGgpIHJlbW92ZU5vZGVzKHBhcmVudCwgb2xkLCBzdGFydCwgb2xkLmxlbmd0aClcblx0XHRcdFx0aWYgKHZub2Rlcy5sZW5ndGggPiBjb21tb25MZW5ndGgpIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgdm5vZGVzLmxlbmd0aCwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGtleWVkIGRpZmZcblx0XHRcdFx0dmFyIG9sZEVuZCA9IG9sZC5sZW5ndGggLSAxLCBlbmQgPSB2bm9kZXMubGVuZ3RoIC0gMSwgbWFwLCBvLCB2LCBvZSwgdmUsIHRvcFNpYmxpbmdcblxuXHRcdFx0XHQvLyBib3R0b20tdXBcblx0XHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0XHRvZSA9IG9sZFtvbGRFbmRdXG5cdFx0XHRcdFx0dmUgPSB2bm9kZXNbZW5kXVxuXHRcdFx0XHRcdGlmIChvZS5rZXkgIT09IHZlLmtleSkgYnJlYWtcblx0XHRcdFx0XHRpZiAob2UgIT09IHZlKSB1cGRhdGVOb2RlKHBhcmVudCwgb2UsIHZlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRcdGlmICh2ZS5kb20gIT0gbnVsbCkgbmV4dFNpYmxpbmcgPSB2ZS5kb21cblx0XHRcdFx0XHRvbGRFbmQtLSwgZW5kLS1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyB0b3AtZG93blxuXHRcdFx0XHR3aGlsZSAob2xkRW5kID49IG9sZFN0YXJ0ICYmIGVuZCA+PSBzdGFydCkge1xuXHRcdFx0XHRcdG8gPSBvbGRbb2xkU3RhcnRdXG5cdFx0XHRcdFx0diA9IHZub2Rlc1tzdGFydF1cblx0XHRcdFx0XHRpZiAoby5rZXkgIT09IHYua2V5KSBicmVha1xuXHRcdFx0XHRcdG9sZFN0YXJ0KyssIHN0YXJ0Kytcblx0XHRcdFx0XHRpZiAobyAhPT0gdikgdXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZFN0YXJ0LCBuZXh0U2libGluZyksIG5zKVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHN3YXBzIGFuZCBsaXN0IHJldmVyc2Fsc1xuXHRcdFx0XHR3aGlsZSAob2xkRW5kID49IG9sZFN0YXJ0ICYmIGVuZCA+PSBzdGFydCkge1xuXHRcdFx0XHRcdGlmIChzdGFydCA9PT0gZW5kKSBicmVha1xuXHRcdFx0XHRcdGlmIChvLmtleSAhPT0gdmUua2V5IHx8IG9lLmtleSAhPT0gdi5rZXkpIGJyZWFrXG5cdFx0XHRcdFx0dG9wU2libGluZyA9IGdldE5leHRTaWJsaW5nKG9sZCwgb2xkU3RhcnQsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdG1vdmVOb2RlcyhwYXJlbnQsIG9lLCB0b3BTaWJsaW5nKVxuXHRcdFx0XHRcdGlmIChvZSAhPT0gdikgdXBkYXRlTm9kZShwYXJlbnQsIG9lLCB2LCBob29rcywgdG9wU2libGluZywgbnMpXG5cdFx0XHRcdFx0aWYgKCsrc3RhcnQgPD0gLS1lbmQpIG1vdmVOb2RlcyhwYXJlbnQsIG8sIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdGlmIChvICE9PSB2ZSkgdXBkYXRlTm9kZShwYXJlbnQsIG8sIHZlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRcdGlmICh2ZS5kb20gIT0gbnVsbCkgbmV4dFNpYmxpbmcgPSB2ZS5kb21cblx0XHRcdFx0XHRvbGRTdGFydCsrOyBvbGRFbmQtLVxuXHRcdFx0XHRcdG9lID0gb2xkW29sZEVuZF1cblx0XHRcdFx0XHR2ZSA9IHZub2Rlc1tlbmRdXG5cdFx0XHRcdFx0byA9IG9sZFtvbGRTdGFydF1cblx0XHRcdFx0XHR2ID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGJvdHRvbSB1cCBvbmNlIGFnYWluXG5cdFx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdFx0aWYgKG9lLmtleSAhPT0gdmUua2V5KSBicmVha1xuXHRcdFx0XHRcdGlmIChvZSAhPT0gdmUpIHVwZGF0ZU5vZGUocGFyZW50LCBvZSwgdmUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRcdFx0aWYgKHZlLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IHZlLmRvbVxuXHRcdFx0XHRcdG9sZEVuZC0tLCBlbmQtLVxuXHRcdFx0XHRcdG9lID0gb2xkW29sZEVuZF1cblx0XHRcdFx0XHR2ZSA9IHZub2Rlc1tlbmRdXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN0YXJ0ID4gZW5kKSByZW1vdmVOb2RlcyhwYXJlbnQsIG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEpXG5cdFx0XHRcdGVsc2UgaWYgKG9sZFN0YXJ0ID4gb2xkRW5kKSBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCArIDEsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vIGluc3BpcmVkIGJ5IGl2aSBodHRwczovL2dpdGh1Yi5jb20vaXZpanMvaXZpLyBieSBCb3JpcyBLYXVsXG5cdFx0XHRcdFx0dmFyIG9yaWdpbmFsTmV4dFNpYmxpbmcgPSBuZXh0U2libGluZywgdm5vZGVzTGVuZ3RoID0gZW5kIC0gc3RhcnQgKyAxLCBvbGRJbmRpY2VzID0gbmV3IEFycmF5KHZub2Rlc0xlbmd0aCksIGxpPTAsIGk9MCwgcG9zID0gMjE0NzQ4MzY0NywgbWF0Y2hlZCA9IDAsIG1hcCwgbGlzSW5kaWNlc1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB2bm9kZXNMZW5ndGg7IGkrKykgb2xkSW5kaWNlc1tpXSA9IC0xXG5cdFx0XHRcdFx0Zm9yIChpID0gZW5kOyBpID49IHN0YXJ0OyBpLS0pIHtcblx0XHRcdFx0XHRcdGlmIChtYXAgPT0gbnVsbCkgbWFwID0gZ2V0S2V5TWFwKG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEpXG5cdFx0XHRcdFx0XHR2ZSA9IHZub2Rlc1tpXVxuXHRcdFx0XHRcdFx0dmFyIG9sZEluZGV4ID0gbWFwW3ZlLmtleV1cblx0XHRcdFx0XHRcdGlmIChvbGRJbmRleCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHBvcyA9IChvbGRJbmRleCA8IHBvcykgPyBvbGRJbmRleCA6IC0xIC8vIGJlY29tZXMgLTEgaWYgbm9kZXMgd2VyZSByZS1vcmRlcmVkXG5cdFx0XHRcdFx0XHRcdG9sZEluZGljZXNbaS1zdGFydF0gPSBvbGRJbmRleFxuXHRcdFx0XHRcdFx0XHRvZSA9IG9sZFtvbGRJbmRleF1cblx0XHRcdFx0XHRcdFx0b2xkW29sZEluZGV4XSA9IG51bGxcblx0XHRcdFx0XHRcdFx0aWYgKG9lICE9PSB2ZSkgdXBkYXRlTm9kZShwYXJlbnQsIG9lLCB2ZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdFx0XHRcdFx0aWYgKHZlLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IHZlLmRvbVxuXHRcdFx0XHRcdFx0XHRtYXRjaGVkKytcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bmV4dFNpYmxpbmcgPSBvcmlnaW5hbE5leHRTaWJsaW5nXG5cdFx0XHRcdFx0aWYgKG1hdGNoZWQgIT09IG9sZEVuZCAtIG9sZFN0YXJ0ICsgMSkgcmVtb3ZlTm9kZXMocGFyZW50LCBvbGQsIG9sZFN0YXJ0LCBvbGRFbmQgKyAxKVxuXHRcdFx0XHRcdGlmIChtYXRjaGVkID09PSAwKSBjcmVhdGVOb2RlcyhwYXJlbnQsIHZub2Rlcywgc3RhcnQsIGVuZCArIDEsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAocG9zID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHQvLyB0aGUgaW5kaWNlcyBvZiB0aGUgaW5kaWNlcyBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgcGFydCBvZiB0aGVcblx0XHRcdFx0XHRcdFx0Ly8gbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIGluIHRoZSBvbGRJbmRpY2VzIGxpc3Rcblx0XHRcdFx0XHRcdFx0bGlzSW5kaWNlcyA9IG1ha2VMaXNJbmRpY2VzKG9sZEluZGljZXMpXG5cdFx0XHRcdFx0XHRcdGxpID0gbGlzSW5kaWNlcy5sZW5ndGggLSAxXG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IGVuZDsgaSA+PSBzdGFydDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRcdFx0diA9IHZub2Rlc1tpXVxuXHRcdFx0XHRcdFx0XHRcdGlmIChvbGRJbmRpY2VzW2ktc3RhcnRdID09PSAtMSkgY3JlYXRlTm9kZShwYXJlbnQsIHYsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobGlzSW5kaWNlc1tsaV0gPT09IGkgLSBzdGFydCkgbGktLVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBtb3ZlTm9kZXMocGFyZW50LCB2LCBuZXh0U2libGluZylcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHYuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gdm5vZGVzW2ldLmRvbVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSBlbmQ7IGkgPj0gc3RhcnQ7IGktLSkge1xuXHRcdFx0XHRcdFx0XHRcdHYgPSB2bm9kZXNbaV1cblx0XHRcdFx0XHRcdFx0XHRpZiAob2xkSW5kaWNlc1tpLXN0YXJ0XSA9PT0gLTEpIGNyZWF0ZU5vZGUocGFyZW50LCB2LCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRcdGlmICh2LmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IHZub2Rlc1tpXS5kb21cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVOb2RlKHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdHZhciBvbGRUYWcgPSBvbGQudGFnLCB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAob2xkVGFnID09PSB0YWcpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gb2xkLnN0YXRlXG5cdFx0XHR2bm9kZS5ldmVudHMgPSBvbGQuZXZlbnRzXG5cdFx0XHRpZiAoc2hvdWxkTm90VXBkYXRlKHZub2RlLCBvbGQpKSByZXR1cm5cblx0XHRcdGlmICh0eXBlb2Ygb2xkVGFnID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSB7XG5cdFx0XHRcdFx0dXBkYXRlTGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChvbGRUYWcpIHtcblx0XHRcdFx0XHRjYXNlIFwiI1wiOiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCI8XCI6IHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBucywgbmV4dFNpYmxpbmcpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCJbXCI6IHVwZGF0ZUZyYWdtZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucyk7IGJyZWFrXG5cdFx0XHRcdFx0ZGVmYXVsdDogdXBkYXRlRWxlbWVudChvbGQsIHZub2RlLCBob29rcywgbnMpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgdXBkYXRlQ29tcG9uZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZW1vdmVOb2RlKHBhcmVudCwgb2xkKVxuXHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuLnRvU3RyaW5nKCkgIT09IHZub2RlLmNoaWxkcmVuLnRvU3RyaW5nKCkpIHtcblx0XHRcdG9sZC5kb20ubm9kZVZhbHVlID0gdm5vZGUuY2hpbGRyZW5cblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuICE9PSB2bm9kZS5jaGlsZHJlbikge1xuXHRcdFx0cmVtb3ZlSFRNTChwYXJlbnQsIG9sZClcblx0XHRcdGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbnMsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHRcdFx0dm5vZGUuaW5zdGFuY2UgPSBvbGQuaW5zdGFuY2Vcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0dXBkYXRlTm9kZXMocGFyZW50LCBvbGQuY2hpbGRyZW4sIHZub2RlLmNoaWxkcmVuLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdHZhciBkb21TaXplID0gMCwgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdHZub2RlLmRvbSA9IG51bGxcblx0XHRpZiAoY2hpbGRyZW4gIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuXHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCAmJiBjaGlsZC5kb20gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmICh2bm9kZS5kb20gPT0gbnVsbCkgdm5vZGUuZG9tID0gY2hpbGQuZG9tXG5cdFx0XHRcdFx0ZG9tU2l6ZSArPSBjaGlsZC5kb21TaXplIHx8IDFcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGRvbVNpemUgIT09IDEpIHZub2RlLmRvbVNpemUgPSBkb21TaXplXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnQob2xkLCB2bm9kZSwgaG9va3MsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0bnMgPSBnZXROYW1lU3BhY2Uodm5vZGUpIHx8IG5zXG5cblx0XHRpZiAodm5vZGUudGFnID09PSBcInRleHRhcmVhXCIpIHtcblx0XHRcdGlmICh2bm9kZS5hdHRycyA9PSBudWxsKSB2bm9kZS5hdHRycyA9IHt9XG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdHZub2RlLmF0dHJzLnZhbHVlID0gdm5vZGUudGV4dCAvL0ZJWE1FIGhhbmRsZSBtdWx0aXBsZSBjaGlsZHJlblxuXHRcdFx0XHR2bm9kZS50ZXh0ID0gdW5kZWZpbmVkXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHVwZGF0ZUF0dHJzKHZub2RlLCBvbGQuYXR0cnMsIHZub2RlLmF0dHJzLCBucylcblx0XHRpZiAoIW1heWJlU2V0Q29udGVudEVkaXRhYmxlKHZub2RlKSkge1xuXHRcdFx0aWYgKG9sZC50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPSBudWxsICYmIHZub2RlLnRleHQgIT09IFwiXCIpIHtcblx0XHRcdFx0aWYgKG9sZC50ZXh0LnRvU3RyaW5nKCkgIT09IHZub2RlLnRleHQudG9TdHJpbmcoKSkgb2xkLmRvbS5maXJzdENoaWxkLm5vZGVWYWx1ZSA9IHZub2RlLnRleHRcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAob2xkLnRleHQgIT0gbnVsbCkgb2xkLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgb2xkLnRleHQsIHVuZGVmaW5lZCwgb2xkLmRvbS5maXJzdENoaWxkKV1cblx0XHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkgdm5vZGUuY2hpbGRyZW4gPSBbVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB2bm9kZS50ZXh0LCB1bmRlZmluZWQsIHVuZGVmaW5lZCldXG5cdFx0XHRcdHVwZGF0ZU5vZGVzKGVsZW1lbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIGhvb2tzLCBudWxsLCBucylcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucykge1xuXHRcdHZub2RlLmluc3RhbmNlID0gVm5vZGUubm9ybWFsaXplKGNhbGxIb29rLmNhbGwodm5vZGUuc3RhdGUudmlldywgdm5vZGUpKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSA9PT0gdm5vZGUpIHRocm93IEVycm9yKFwiQSB2aWV3IGNhbm5vdCByZXR1cm4gdGhlIHZub2RlIGl0IHJlY2VpdmVkIGFzIGFyZ3VtZW50XCIpXG5cdFx0dXBkYXRlTGlmZWN5Y2xlKHZub2RlLnN0YXRlLCB2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHRpZiAob2xkLmluc3RhbmNlID09IG51bGwpIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZS5pbnN0YW5jZSwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdGVsc2UgdXBkYXRlTm9kZShwYXJlbnQsIG9sZC5pbnN0YW5jZSwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHR2bm9kZS5kb20gPSB2bm9kZS5pbnN0YW5jZS5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSB2bm9kZS5pbnN0YW5jZS5kb21TaXplXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9sZC5pbnN0YW5jZSAhPSBudWxsKSB7XG5cdFx0XHRyZW1vdmVOb2RlKHBhcmVudCwgb2xkLmluc3RhbmNlKVxuXHRcdFx0dm5vZGUuZG9tID0gdW5kZWZpbmVkXG5cdFx0XHR2bm9kZS5kb21TaXplID0gMFxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBnZXRLZXlNYXAodm5vZGVzLCBzdGFydCwgZW5kKSB7XG5cdFx0dmFyIG1hcCA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRmb3IgKDsgc3RhcnQgPCBlbmQ7IHN0YXJ0KyspIHtcblx0XHRcdHZhciB2bm9kZSA9IHZub2Rlc1tzdGFydF1cblx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBrZXkgPSB2bm9kZS5rZXlcblx0XHRcdFx0aWYgKGtleSAhPSBudWxsKSBtYXBba2V5XSA9IHN0YXJ0XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXBcblx0fVxuXHQvLyBMaWZ0ZWQgZnJvbSBpdmkgaHR0cHM6Ly9naXRodWIuY29tL2l2aWpzL2l2aS9cblx0Ly8gdGFrZXMgYSBsaXN0IG9mIHVuaXF1ZSBudW1iZXJzICgtMSBpcyBzcGVjaWFsIGFuZCBjYW5cblx0Ly8gb2NjdXIgbXVsdGlwbGUgdGltZXMpIGFuZCByZXR1cm5zIGFuIGFycmF5IHdpdGggdGhlIGluZGljZXNcblx0Ly8gb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIHBhcnQgb2YgdGhlIGxvbmdlc3QgaW5jcmVhc2luZ1xuXHQvLyBzdWJzZXF1ZWNlXG5cdHZhciBsaXNUZW1wID0gW11cblx0ZnVuY3Rpb24gbWFrZUxpc0luZGljZXMoYSkge1xuXHRcdHZhciByZXN1bHQgPSBbMF1cblx0XHR2YXIgdSA9IDAsIHYgPSAwLCBpID0gMFxuXHRcdHZhciBpbCA9IGxpc1RlbXAubGVuZ3RoID0gYS5sZW5ndGhcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGlsOyBpKyspIGxpc1RlbXBbaV0gPSBhW2ldXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbDsgKytpKSB7XG5cdFx0XHRpZiAoYVtpXSA9PT0gLTEpIGNvbnRpbnVlXG5cdFx0XHR2YXIgaiA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV1cblx0XHRcdGlmIChhW2pdIDwgYVtpXSkge1xuXHRcdFx0XHRsaXNUZW1wW2ldID0galxuXHRcdFx0XHRyZXN1bHQucHVzaChpKVxuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0fVxuXHRcdFx0dSA9IDBcblx0XHRcdHYgPSByZXN1bHQubGVuZ3RoIC0gMVxuXHRcdFx0d2hpbGUgKHUgPCB2KSB7XG5cdFx0XHRcdC8vIEZhc3QgaW50ZWdlciBhdmVyYWdlIHdpdGhvdXQgb3ZlcmZsb3cuXG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG5cdFx0XHRcdHZhciBjID0gKHUgPj4+IDEpICsgKHYgPj4+IDEpICsgKHUgJiB2ICYgMSlcblx0XHRcdFx0aWYgKGFbcmVzdWx0W2NdXSA8IGFbaV0pIHtcblx0XHRcdFx0XHR1ID0gYyArIDFcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2ID0gY1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoYVtpXSA8IGFbcmVzdWx0W3VdXSkge1xuXHRcdFx0XHRpZiAodSA+IDApIGxpc1RlbXBbaV0gPSByZXN1bHRbdSAtIDFdXG5cdFx0XHRcdHJlc3VsdFt1XSA9IGlcblx0XHRcdH1cblx0XHR9XG5cdFx0dSA9IHJlc3VsdC5sZW5ndGhcblx0XHR2ID0gcmVzdWx0W3UgLSAxXVxuXHRcdHdoaWxlICh1LS0gPiAwKSB7XG5cdFx0XHRyZXN1bHRbdV0gPSB2XG5cdFx0XHR2ID0gbGlzVGVtcFt2XVxuXHRcdH1cblx0XHRsaXNUZW1wLmxlbmd0aCA9IDBcblx0XHRyZXR1cm4gcmVzdWx0XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROZXh0U2libGluZyh2bm9kZXMsIGksIG5leHRTaWJsaW5nKSB7XG5cdFx0Zm9yICg7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh2bm9kZXNbaV0gIT0gbnVsbCAmJiB2bm9kZXNbaV0uZG9tICE9IG51bGwpIHJldHVybiB2bm9kZXNbaV0uZG9tXG5cdFx0fVxuXHRcdHJldHVybiBuZXh0U2libGluZ1xuXHR9XG5cblx0Ly8gVGhpcyBjb3ZlcnMgYSByZWFsbHkgc3BlY2lmaWMgZWRnZSBjYXNlOlxuXHQvLyAtIFBhcmVudCBub2RlIGlzIGtleWVkIGFuZCBjb250YWlucyBjaGlsZFxuXHQvLyAtIENoaWxkIGlzIHJlbW92ZWQsIHJldHVybnMgdW5yZXNvbHZlZCBwcm9taXNlIGluIGBvbmJlZm9yZXJlbW92ZWBcblx0Ly8gLSBQYXJlbnQgbm9kZSBpcyBtb3ZlZCBpbiBrZXllZCBkaWZmXG5cdC8vIC0gUmVtYWluaW5nIGNoaWxkcmVuIHN0aWxsIG5lZWQgbW92ZWQgYXBwcm9wcmlhdGVseVxuXHQvL1xuXHQvLyBJZGVhbGx5LCBJJ2QgdHJhY2sgcmVtb3ZlZCBub2RlcyBhcyB3ZWxsLCBidXQgdGhhdCBpbnRyb2R1Y2VzIGEgbG90IG1vcmVcblx0Ly8gY29tcGxleGl0eSBhbmQgSSdtIG5vdCBleGFjdGx5IGludGVyZXN0ZWQgaW4gZG9pbmcgdGhhdC5cblx0ZnVuY3Rpb24gbW92ZU5vZGVzKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIGZyYWcgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdG1vdmVDaGlsZFRvRnJhZyhwYXJlbnQsIGZyYWcsIHZub2RlKVxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnLCBuZXh0U2libGluZylcblx0fVxuXHRmdW5jdGlvbiBtb3ZlQ2hpbGRUb0ZyYWcocGFyZW50LCBmcmFnLCB2bm9kZSkge1xuXHRcdC8vIERvZGdlIHRoZSByZWN1cnNpb24gb3ZlcmhlYWQgaW4gYSBmZXcgb2YgdGhlIG1vc3QgY29tbW9uIGNhc2VzLlxuXHRcdHdoaWxlICh2bm9kZS5kb20gIT0gbnVsbCAmJiB2bm9kZS5kb20ucGFyZW50Tm9kZSA9PT0gcGFyZW50KSB7XG5cdFx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHR2bm9kZSA9IHZub2RlLmluc3RhbmNlXG5cdFx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSBjb250aW51ZVxuXHRcdFx0fSBlbHNlIGlmICh2bm9kZS50YWcgPT09IFwiPFwiKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm5vZGUuaW5zdGFuY2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKHZub2RlLmluc3RhbmNlW2ldKVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHZub2RlLnRhZyAhPT0gXCJbXCIpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgcmVjdXJzZSBmb3IgdGV4dCBub2RlcyAqb3IqIGVsZW1lbnRzLCBqdXN0IGZyYWdtZW50c1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKHZub2RlLmRvbSlcblx0XHRcdH0gZWxzZSBpZiAodm5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdHZub2RlID0gdm5vZGUuY2hpbGRyZW5bMF1cblx0XHRcdFx0aWYgKHZub2RlICE9IG51bGwpIGNvbnRpbnVlXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkID0gdm5vZGUuY2hpbGRyZW5baV1cblx0XHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCkgbW92ZUNoaWxkVG9GcmFnKHBhcmVudCwgZnJhZywgY2hpbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnQsIGRvbSwgbmV4dFNpYmxpbmcpIHtcblx0XHRpZiAobmV4dFNpYmxpbmcgIT0gbnVsbCkgcGFyZW50Lmluc2VydEJlZm9yZShkb20sIG5leHRTaWJsaW5nKVxuXHRcdGVsc2UgcGFyZW50LmFwcGVuZENoaWxkKGRvbSlcblx0fVxuXG5cdGZ1bmN0aW9uIG1heWJlU2V0Q29udGVudEVkaXRhYmxlKHZub2RlKSB7XG5cdFx0aWYgKHZub2RlLmF0dHJzID09IG51bGwgfHwgKFxuXHRcdFx0dm5vZGUuYXR0cnMuY29udGVudGVkaXRhYmxlID09IG51bGwgJiYgLy8gYXR0cmlidXRlXG5cdFx0XHR2bm9kZS5hdHRycy5jb250ZW50RWRpdGFibGUgPT0gbnVsbCAvLyBwcm9wZXJ0eVxuXHRcdCkpIHJldHVybiBmYWxzZVxuXHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0aWYgKGNoaWxkcmVuICE9IG51bGwgJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIGNoaWxkcmVuWzBdLnRhZyA9PT0gXCI8XCIpIHtcblx0XHRcdHZhciBjb250ZW50ID0gY2hpbGRyZW5bMF0uY2hpbGRyZW5cblx0XHRcdGlmICh2bm9kZS5kb20uaW5uZXJIVE1MICE9PSBjb250ZW50KSB2bm9kZS5kb20uaW5uZXJIVE1MID0gY29udGVudFxuXHRcdH1cblx0XHRlbHNlIGlmICh2bm9kZS50ZXh0ICE9IG51bGwgfHwgY2hpbGRyZW4gIT0gbnVsbCAmJiBjaGlsZHJlbi5sZW5ndGggIT09IDApIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIG5vZGUgb2YgYSBjb250ZW50ZWRpdGFibGUgbXVzdCBiZSB0cnVzdGVkXCIpXG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXG5cdC8vcmVtb3ZlXG5cdGZ1bmN0aW9uIHJlbW92ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kKSB7XG5cdFx0Zm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcblx0XHRcdHZhciB2bm9kZSA9IHZub2Rlc1tpXVxuXHRcdFx0aWYgKHZub2RlICE9IG51bGwpIHJlbW92ZU5vZGUocGFyZW50LCB2bm9kZSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcmVtb3ZlTm9kZShwYXJlbnQsIHZub2RlKSB7XG5cdFx0dmFyIG1hc2sgPSAwXG5cdFx0dmFyIG9yaWdpbmFsID0gdm5vZGUuc3RhdGVcblx0XHR2YXIgc3RhdGVSZXN1bHQsIGF0dHJzUmVzdWx0XG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLnN0YXRlLm9uYmVmb3JlcmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZhciByZXN1bHQgPSBjYWxsSG9vay5jYWxsKHZub2RlLnN0YXRlLm9uYmVmb3JlcmVtb3ZlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRtYXNrID0gMVxuXHRcdFx0XHRzdGF0ZVJlc3VsdCA9IHJlc3VsdFxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodm5vZGUuYXR0cnMgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZhciByZXN1bHQgPSBjYWxsSG9vay5jYWxsKHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuXHRcdFx0XHRtYXNrIHw9IDJcblx0XHRcdFx0YXR0cnNSZXN1bHQgPSByZXN1bHRcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2hlY2tTdGF0ZSh2bm9kZSwgb3JpZ2luYWwpXG5cblx0XHQvLyBJZiB3ZSBjYW4sIHRyeSB0byBmYXN0LXBhdGggaXQgYW5kIGF2b2lkIGFsbCB0aGUgb3ZlcmhlYWQgb2YgYXdhaXRpbmdcblx0XHRpZiAoIW1hc2spIHtcblx0XHRcdG9ucmVtb3ZlKHZub2RlKVxuXHRcdFx0cmVtb3ZlQ2hpbGQocGFyZW50LCB2bm9kZSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHN0YXRlUmVzdWx0ICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2Vcblx0XHRcdFx0XHRpZiAobWFzayAmIDEpIHsgbWFzayAmPSAyOyBpZiAoIW1hc2spIHJlYWxseVJlbW92ZSgpIH1cblx0XHRcdFx0fVxuXHRcdFx0XHRzdGF0ZVJlc3VsdC50aGVuKG5leHQsIG5leHQpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXR0cnNSZXN1bHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuXHRcdFx0XHRcdGlmIChtYXNrICYgMikgeyBtYXNrICY9IDE7IGlmICghbWFzaykgcmVhbGx5UmVtb3ZlKCkgfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGF0dHJzUmVzdWx0LnRoZW4obmV4dCwgbmV4dClcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZWFsbHlSZW1vdmUoKSB7XG5cdFx0XHRjaGVja1N0YXRlKHZub2RlLCBvcmlnaW5hbClcblx0XHRcdG9ucmVtb3ZlKHZub2RlKVxuXHRcdFx0cmVtb3ZlQ2hpbGQocGFyZW50LCB2bm9kZSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcmVtb3ZlSFRNTChwYXJlbnQsIHZub2RlKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZS5pbnN0YW5jZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0cGFyZW50LnJlbW92ZUNoaWxkKHZub2RlLmluc3RhbmNlW2ldKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVDaGlsZChwYXJlbnQsIHZub2RlKSB7XG5cdFx0Ly8gRG9kZ2UgdGhlIHJlY3Vyc2lvbiBvdmVyaGVhZCBpbiBhIGZldyBvZiB0aGUgbW9zdCBjb21tb24gY2FzZXMuXG5cdFx0d2hpbGUgKHZub2RlLmRvbSAhPSBudWxsICYmIHZub2RlLmRvbS5wYXJlbnROb2RlID09PSBwYXJlbnQpIHtcblx0XHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHZub2RlID0gdm5vZGUuaW5zdGFuY2Vcblx0XHRcdFx0aWYgKHZub2RlICE9IG51bGwpIGNvbnRpbnVlXG5cdFx0XHR9IGVsc2UgaWYgKHZub2RlLnRhZyA9PT0gXCI8XCIpIHtcblx0XHRcdFx0cmVtb3ZlSFRNTChwYXJlbnQsIHZub2RlKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHZub2RlLnRhZyAhPT0gXCJbXCIpIHtcblx0XHRcdFx0XHRwYXJlbnQucmVtb3ZlQ2hpbGQodm5vZGUuZG9tKVxuXHRcdFx0XHRcdGlmICghQXJyYXkuaXNBcnJheSh2bm9kZS5jaGlsZHJlbikpIGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHZub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdHZub2RlID0gdm5vZGUuY2hpbGRyZW5bMF1cblx0XHRcdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkgY29udGludWVcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgY2hpbGQgPSB2bm9kZS5jaGlsZHJlbltpXVxuXHRcdFx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwpIHJlbW92ZUNoaWxkKHBhcmVudCwgY2hpbGQpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBvbnJlbW92ZSh2bm9kZSkge1xuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5zdGF0ZS5vbnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSBjYWxsSG9vay5jYWxsKHZub2RlLnN0YXRlLm9ucmVtb3ZlLCB2bm9kZSlcblx0XHRpZiAodm5vZGUuYXR0cnMgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9ucmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIGNhbGxIb29rLmNhbGwodm5vZGUuYXR0cnMub25yZW1vdmUsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkgb25yZW1vdmUodm5vZGUuaW5zdGFuY2UpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG5cdFx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwpIG9ucmVtb3ZlKGNoaWxkKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly9hdHRyc1xuXHRmdW5jdGlvbiBzZXRBdHRycyh2bm9kZSwgYXR0cnMsIG5zKSB7XG5cdFx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0XHRzZXRBdHRyKHZub2RlLCBrZXksIG51bGwsIGF0dHJzW2tleV0sIG5zKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBzZXRBdHRyKHZub2RlLCBrZXksIG9sZCwgdmFsdWUsIG5zKSB7XG5cdFx0aWYgKGtleSA9PT0gXCJrZXlcIiB8fCBrZXkgPT09IFwiaXNcIiB8fCB2YWx1ZSA9PSBudWxsIHx8IGlzTGlmZWN5Y2xlTWV0aG9kKGtleSkgfHwgKG9sZCA9PT0gdmFsdWUgJiYgIWlzRm9ybUF0dHJpYnV0ZSh2bm9kZSwga2V5KSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSByZXR1cm5cblx0XHRpZiAoa2V5WzBdID09PSBcIm9cIiAmJiBrZXlbMV0gPT09IFwiblwiKSByZXR1cm4gdXBkYXRlRXZlbnQodm5vZGUsIGtleSwgdmFsdWUpXG5cdFx0aWYgKGtleS5zbGljZSgwLCA2KSA9PT0gXCJ4bGluazpcIikgdm5vZGUuZG9tLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBrZXkuc2xpY2UoNiksIHZhbHVlKVxuXHRcdGVsc2UgaWYgKGtleSA9PT0gXCJzdHlsZVwiKSB1cGRhdGVTdHlsZSh2bm9kZS5kb20sIG9sZCwgdmFsdWUpXG5cdFx0ZWxzZSBpZiAoaGFzUHJvcGVydHlLZXkodm5vZGUsIGtleSwgbnMpKSB7XG5cdFx0XHRpZiAoa2V5ID09PSBcInZhbHVlXCIpIHtcblx0XHRcdFx0Ly8gT25seSBkbyB0aGUgY29lcmNpb24gaWYgd2UncmUgYWN0dWFsbHkgZ29pbmcgdG8gY2hlY2sgdGhlIHZhbHVlLlxuXHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBuby1pbXBsaWNpdC1jb2VyY2lvbiAqL1xuXHRcdFx0XHQvL3NldHRpbmcgaW5wdXRbdmFsdWVdIHRvIHNhbWUgdmFsdWUgYnkgdHlwaW5nIG9uIGZvY3VzZWQgZWxlbWVudCBtb3ZlcyBjdXJzb3IgdG8gZW5kIGluIENocm9tZVxuXHRcdFx0XHRpZiAoKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiIHx8IHZub2RlLnRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSAmJiB2bm9kZS5kb20udmFsdWUgPT09IFwiXCIgKyB2YWx1ZSAmJiB2bm9kZS5kb20gPT09IGFjdGl2ZUVsZW1lbnQoKSkgcmV0dXJuXG5cdFx0XHRcdC8vc2V0dGluZyBzZWxlY3RbdmFsdWVdIHRvIHNhbWUgdmFsdWUgd2hpbGUgaGF2aW5nIHNlbGVjdCBvcGVuIGJsaW5rcyBzZWxlY3QgZHJvcGRvd24gaW4gQ2hyb21lXG5cdFx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwic2VsZWN0XCIgJiYgb2xkICE9PSBudWxsICYmIHZub2RlLmRvbS52YWx1ZSA9PT0gXCJcIiArIHZhbHVlKSByZXR1cm5cblx0XHRcdFx0Ly9zZXR0aW5nIG9wdGlvblt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSB3aGlsZSBoYXZpbmcgc2VsZWN0IG9wZW4gYmxpbmtzIHNlbGVjdCBkcm9wZG93biBpbiBDaHJvbWVcblx0XHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJvcHRpb25cIiAmJiBvbGQgIT09IG51bGwgJiYgdm5vZGUuZG9tLnZhbHVlID09PSBcIlwiICsgdmFsdWUpIHJldHVyblxuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWltcGxpY2l0LWNvZXJjaW9uICovXG5cdFx0XHR9XG5cdFx0XHQvLyBJZiB5b3UgYXNzaWduIGFuIGlucHV0IHR5cGUgdGhhdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFIDExIHdpdGggYW4gYXNzaWdubWVudCBleHByZXNzaW9uLCBhbiBlcnJvciB3aWxsIG9jY3VyLlxuXHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiICYmIGtleSA9PT0gXCJ0eXBlXCIpIHZub2RlLmRvbS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSlcblx0XHRcdGVsc2Ugdm5vZGUuZG9tW2tleV0gPSB2YWx1ZVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0XHRpZiAodmFsdWUpIHZub2RlLmRvbS5zZXRBdHRyaWJ1dGUoa2V5LCBcIlwiKVxuXHRcdFx0XHRlbHNlIHZub2RlLmRvbS5yZW1vdmVBdHRyaWJ1dGUoa2V5KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB2bm9kZS5kb20uc2V0QXR0cmlidXRlKGtleSA9PT0gXCJjbGFzc05hbWVcIiA/IFwiY2xhc3NcIiA6IGtleSwgdmFsdWUpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZUF0dHIodm5vZGUsIGtleSwgb2xkLCBucykge1xuXHRcdGlmIChrZXkgPT09IFwia2V5XCIgfHwga2V5ID09PSBcImlzXCIgfHwgb2xkID09IG51bGwgfHwgaXNMaWZlY3ljbGVNZXRob2Qoa2V5KSkgcmV0dXJuXG5cdFx0aWYgKGtleVswXSA9PT0gXCJvXCIgJiYga2V5WzFdID09PSBcIm5cIiAmJiAhaXNMaWZlY3ljbGVNZXRob2Qoa2V5KSkgdXBkYXRlRXZlbnQodm5vZGUsIGtleSwgdW5kZWZpbmVkKVxuXHRcdGVsc2UgaWYgKGtleSA9PT0gXCJzdHlsZVwiKSB1cGRhdGVTdHlsZSh2bm9kZS5kb20sIG9sZCwgbnVsbClcblx0XHRlbHNlIGlmIChcblx0XHRcdGhhc1Byb3BlcnR5S2V5KHZub2RlLCBrZXksIG5zKVxuXHRcdFx0JiYga2V5ICE9PSBcImNsYXNzTmFtZVwiXG5cdFx0XHQmJiAhKGtleSA9PT0gXCJ2YWx1ZVwiICYmIChcblx0XHRcdFx0dm5vZGUudGFnID09PSBcIm9wdGlvblwiXG5cdFx0XHRcdHx8IHZub2RlLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiB2bm9kZS5kb20uc2VsZWN0ZWRJbmRleCA9PT0gLTEgJiYgdm5vZGUuZG9tID09PSBhY3RpdmVFbGVtZW50KClcblx0XHRcdCkpXG5cdFx0XHQmJiAhKHZub2RlLnRhZyA9PT0gXCJpbnB1dFwiICYmIGtleSA9PT0gXCJ0eXBlXCIpXG5cdFx0KSB7XG5cdFx0XHR2bm9kZS5kb21ba2V5XSA9IG51bGxcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG5zTGFzdEluZGV4ID0ga2V5LmluZGV4T2YoXCI6XCIpXG5cdFx0XHRpZiAobnNMYXN0SW5kZXggIT09IC0xKSBrZXkgPSBrZXkuc2xpY2UobnNMYXN0SW5kZXggKyAxKVxuXHRcdFx0aWYgKG9sZCAhPT0gZmFsc2UpIHZub2RlLmRvbS5yZW1vdmVBdHRyaWJ1dGUoa2V5ID09PSBcImNsYXNzTmFtZVwiID8gXCJjbGFzc1wiIDoga2V5KVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBzZXRMYXRlU2VsZWN0QXR0cnModm5vZGUsIGF0dHJzKSB7XG5cdFx0aWYgKFwidmFsdWVcIiBpbiBhdHRycykge1xuXHRcdFx0aWYoYXR0cnMudmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0aWYgKHZub2RlLmRvbS5zZWxlY3RlZEluZGV4ICE9PSAtMSkgdm5vZGUuZG9tLnZhbHVlID0gbnVsbFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIG5vcm1hbGl6ZWQgPSBcIlwiICsgYXR0cnMudmFsdWUgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbXBsaWNpdC1jb2VyY2lvblxuXHRcdFx0XHRpZiAodm5vZGUuZG9tLnZhbHVlICE9PSBub3JtYWxpemVkIHx8IHZub2RlLmRvbS5zZWxlY3RlZEluZGV4ID09PSAtMSkge1xuXHRcdFx0XHRcdHZub2RlLmRvbS52YWx1ZSA9IG5vcm1hbGl6ZWRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoXCJzZWxlY3RlZEluZGV4XCIgaW4gYXR0cnMpIHNldEF0dHIodm5vZGUsIFwic2VsZWN0ZWRJbmRleFwiLCBudWxsLCBhdHRycy5zZWxlY3RlZEluZGV4LCB1bmRlZmluZWQpXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlQXR0cnModm5vZGUsIG9sZCwgYXR0cnMsIG5zKSB7XG5cdFx0aWYgKGF0dHJzICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRycykge1xuXHRcdFx0XHRzZXRBdHRyKHZub2RlLCBrZXksIG9sZCAmJiBvbGRba2V5XSwgYXR0cnNba2V5XSwgbnMpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciB2YWxcblx0XHRpZiAob2xkICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiBvbGQpIHtcblx0XHRcdFx0aWYgKCgodmFsID0gb2xkW2tleV0pICE9IG51bGwpICYmIChhdHRycyA9PSBudWxsIHx8IGF0dHJzW2tleV0gPT0gbnVsbCkpIHtcblx0XHRcdFx0XHRyZW1vdmVBdHRyKHZub2RlLCBrZXksIHZhbCwgbnMpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaXNGb3JtQXR0cmlidXRlKHZub2RlLCBhdHRyKSB7XG5cdFx0cmV0dXJuIGF0dHIgPT09IFwidmFsdWVcIiB8fCBhdHRyID09PSBcImNoZWNrZWRcIiB8fCBhdHRyID09PSBcInNlbGVjdGVkSW5kZXhcIiB8fCBhdHRyID09PSBcInNlbGVjdGVkXCIgJiYgdm5vZGUuZG9tID09PSBhY3RpdmVFbGVtZW50KCkgfHwgdm5vZGUudGFnID09PSBcIm9wdGlvblwiICYmIHZub2RlLmRvbS5wYXJlbnROb2RlID09PSAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0fVxuXHRmdW5jdGlvbiBpc0xpZmVjeWNsZU1ldGhvZChhdHRyKSB7XG5cdFx0cmV0dXJuIGF0dHIgPT09IFwib25pbml0XCIgfHwgYXR0ciA9PT0gXCJvbmNyZWF0ZVwiIHx8IGF0dHIgPT09IFwib251cGRhdGVcIiB8fCBhdHRyID09PSBcIm9ucmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXJlbW92ZVwiIHx8IGF0dHIgPT09IFwib25iZWZvcmV1cGRhdGVcIlxuXHR9XG5cdGZ1bmN0aW9uIGhhc1Byb3BlcnR5S2V5KHZub2RlLCBrZXksIG5zKSB7XG5cdFx0Ly8gRmlsdGVyIG91dCBuYW1lc3BhY2VkIGtleXNcblx0XHRyZXR1cm4gbnMgPT09IHVuZGVmaW5lZCAmJiAoXG5cdFx0XHQvLyBJZiBpdCdzIGEgY3VzdG9tIGVsZW1lbnQsIGp1c3Qga2VlcCBpdC5cblx0XHRcdHZub2RlLnRhZy5pbmRleE9mKFwiLVwiKSA+IC0xIHx8IHZub2RlLmF0dHJzICE9IG51bGwgJiYgdm5vZGUuYXR0cnMuaXMgfHxcblx0XHRcdC8vIElmIGl0J3MgYSBub3JtYWwgZWxlbWVudCwgbGV0J3MgdHJ5IHRvIGF2b2lkIGEgZmV3IGJyb3dzZXIgYnVncy5cblx0XHRcdGtleSAhPT0gXCJocmVmXCIgJiYga2V5ICE9PSBcImxpc3RcIiAmJiBrZXkgIT09IFwiZm9ybVwiICYmIGtleSAhPT0gXCJ3aWR0aFwiICYmIGtleSAhPT0gXCJoZWlnaHRcIi8vICYmIGtleSAhPT0gXCJ0eXBlXCJcblx0XHRcdC8vIERlZmVyIHRoZSBwcm9wZXJ0eSBjaGVjayB1bnRpbCAqYWZ0ZXIqIHdlIGNoZWNrIGV2ZXJ5dGhpbmcuXG5cdFx0KSAmJiBrZXkgaW4gdm5vZGUuZG9tXG5cdH1cblxuXHQvL3N0eWxlXG5cdHZhciB1cHBlcmNhc2VSZWdleCA9IC9bQS1aXS9nXG5cdGZ1bmN0aW9uIHRvTG93ZXJDYXNlKGNhcGl0YWwpIHsgcmV0dXJuIFwiLVwiICsgY2FwaXRhbC50b0xvd2VyQ2FzZSgpIH1cblx0ZnVuY3Rpb24gbm9ybWFsaXplS2V5KGtleSkge1xuXHRcdHJldHVybiBrZXlbMF0gPT09IFwiLVwiICYmIGtleVsxXSA9PT0gXCItXCIgPyBrZXkgOlxuXHRcdFx0a2V5ID09PSBcImNzc0Zsb2F0XCIgPyBcImZsb2F0XCIgOlxuXHRcdFx0XHRrZXkucmVwbGFjZSh1cHBlcmNhc2VSZWdleCwgdG9Mb3dlckNhc2UpXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlU3R5bGUoZWxlbWVudCwgb2xkLCBzdHlsZSkge1xuXHRcdGlmIChvbGQgPT09IHN0eWxlKSB7XG5cdFx0XHQvLyBTdHlsZXMgYXJlIGVxdWl2YWxlbnQsIGRvIG5vdGhpbmcuXG5cdFx0fSBlbHNlIGlmIChzdHlsZSA9PSBudWxsKSB7XG5cdFx0XHQvLyBOZXcgc3R5bGUgaXMgbWlzc2luZywganVzdCBjbGVhciBpdC5cblx0XHRcdGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBzdHlsZSAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gTmV3IHN0eWxlIGlzIGEgc3RyaW5nLCBsZXQgZW5naW5lIGRlYWwgd2l0aCBwYXRjaGluZy5cblx0XHRcdGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlXG5cdFx0fSBlbHNlIGlmIChvbGQgPT0gbnVsbCB8fCB0eXBlb2Ygb2xkICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHQvLyBgb2xkYCBpcyBtaXNzaW5nIG9yIGEgc3RyaW5nLCBgc3R5bGVgIGlzIGFuIG9iamVjdC5cblx0XHRcdGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCJcblx0XHRcdC8vIEFkZCBuZXcgc3R5bGUgcHJvcGVydGllc1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IHN0eWxlW2tleV1cblx0XHRcdFx0aWYgKHZhbHVlICE9IG51bGwpIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkobm9ybWFsaXplS2V5KGtleSksIFN0cmluZyh2YWx1ZSkpXG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEJvdGggb2xkICYgbmV3IGFyZSAoZGlmZmVyZW50KSBvYmplY3RzLlxuXHRcdFx0Ly8gVXBkYXRlIHN0eWxlIHByb3BlcnRpZXMgdGhhdCBoYXZlIGNoYW5nZWRcblx0XHRcdGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBzdHlsZVtrZXldXG5cdFx0XHRcdGlmICh2YWx1ZSAhPSBudWxsICYmICh2YWx1ZSA9IFN0cmluZyh2YWx1ZSkpICE9PSBTdHJpbmcob2xkW2tleV0pKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShub3JtYWxpemVLZXkoa2V5KSwgdmFsdWUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIFJlbW92ZSBzdHlsZSBwcm9wZXJ0aWVzIHRoYXQgbm8gbG9uZ2VyIGV4aXN0XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gb2xkKSB7XG5cdFx0XHRcdGlmIChvbGRba2V5XSAhPSBudWxsICYmIHN0eWxlW2tleV0gPT0gbnVsbCkge1xuXHRcdFx0XHRcdGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkobm9ybWFsaXplS2V5KGtleSkpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBIZXJlJ3MgYW4gZXhwbGFuYXRpb24gb2YgaG93IHRoaXMgd29ya3M6XG5cdC8vIDEuIFRoZSBldmVudCBuYW1lcyBhcmUgYWx3YXlzIChieSBkZXNpZ24pIHByZWZpeGVkIGJ5IGBvbmAuXG5cdC8vIDIuIFRoZSBFdmVudExpc3RlbmVyIGludGVyZmFjZSBhY2NlcHRzIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGFuIG9iamVjdFxuXHQvLyAgICB3aXRoIGEgYGhhbmRsZUV2ZW50YCBtZXRob2QuXG5cdC8vIDMuIFRoZSBvYmplY3QgZG9lcyBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYCwgdG8gYXZvaWRcblx0Ly8gICAgYW55IHBvdGVudGlhbCBpbnRlcmZlcmVuY2Ugd2l0aCB0aGF0IChlLmcuIHNldHRlcnMpLlxuXHQvLyA0LiBUaGUgZXZlbnQgbmFtZSBpcyByZW1hcHBlZCB0byB0aGUgaGFuZGxlciBiZWZvcmUgY2FsbGluZyBpdC5cblx0Ly8gNS4gSW4gZnVuY3Rpb24tYmFzZWQgZXZlbnQgaGFuZGxlcnMsIGBldi50YXJnZXQgPT09IHRoaXNgLiBXZSByZXBsaWNhdGVcblx0Ly8gICAgdGhhdCBiZWxvdy5cblx0Ly8gNi4gSW4gZnVuY3Rpb24tYmFzZWQgZXZlbnQgaGFuZGxlcnMsIGByZXR1cm4gZmFsc2VgIHByZXZlbnRzIHRoZSBkZWZhdWx0XG5cdC8vICAgIGFjdGlvbiBhbmQgc3RvcHMgZXZlbnQgcHJvcGFnYXRpb24uIFdlIHJlcGxpY2F0ZSB0aGF0IGJlbG93LlxuXHRmdW5jdGlvbiBFdmVudERpY3QoKSB7XG5cdFx0Ly8gU2F2ZSB0aGlzLCBzbyB0aGUgY3VycmVudCByZWRyYXcgaXMgY29ycmVjdGx5IHRyYWNrZWQuXG5cdFx0dGhpcy5fID0gY3VycmVudFJlZHJhd1xuXHR9XG5cdEV2ZW50RGljdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdEV2ZW50RGljdC5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoZXYpIHtcblx0XHR2YXIgaGFuZGxlciA9IHRoaXNbXCJvblwiICsgZXYudHlwZV1cblx0XHR2YXIgcmVzdWx0XG5cdFx0aWYgKHR5cGVvZiBoYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHJlc3VsdCA9IGhhbmRsZXIuY2FsbChldi5jdXJyZW50VGFyZ2V0LCBldilcblx0XHRlbHNlIGlmICh0eXBlb2YgaGFuZGxlci5oYW5kbGVFdmVudCA9PT0gXCJmdW5jdGlvblwiKSBoYW5kbGVyLmhhbmRsZUV2ZW50KGV2KVxuXHRcdGlmICh0aGlzLl8gJiYgZXYucmVkcmF3ICE9PSBmYWxzZSkgKDAsIHRoaXMuXykoKVxuXHRcdGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdH1cblx0fVxuXG5cdC8vZXZlbnRcblx0ZnVuY3Rpb24gdXBkYXRlRXZlbnQodm5vZGUsIGtleSwgdmFsdWUpIHtcblx0XHRpZiAodm5vZGUuZXZlbnRzICE9IG51bGwpIHtcblx0XHRcdGlmICh2bm9kZS5ldmVudHNba2V5XSA9PT0gdmFsdWUpIHJldHVyblxuXHRcdFx0aWYgKHZhbHVlICE9IG51bGwgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikpIHtcblx0XHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXldID09IG51bGwpIHZub2RlLmRvbS5hZGRFdmVudExpc3RlbmVyKGtleS5zbGljZSgyKSwgdm5vZGUuZXZlbnRzLCBmYWxzZSlcblx0XHRcdFx0dm5vZGUuZXZlbnRzW2tleV0gPSB2YWx1ZVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXldICE9IG51bGwpIHZub2RlLmRvbS5yZW1vdmVFdmVudExpc3RlbmVyKGtleS5zbGljZSgyKSwgdm5vZGUuZXZlbnRzLCBmYWxzZSlcblx0XHRcdFx0dm5vZGUuZXZlbnRzW2tleV0gPSB1bmRlZmluZWRcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikpIHtcblx0XHRcdHZub2RlLmV2ZW50cyA9IG5ldyBFdmVudERpY3QoKVxuXHRcdFx0dm5vZGUuZG9tLmFkZEV2ZW50TGlzdGVuZXIoa2V5LnNsaWNlKDIpLCB2bm9kZS5ldmVudHMsIGZhbHNlKVxuXHRcdFx0dm5vZGUuZXZlbnRzW2tleV0gPSB2YWx1ZVxuXHRcdH1cblx0fVxuXG5cdC8vbGlmZWN5Y2xlXG5cdGZ1bmN0aW9uIGluaXRMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbmluaXQgPT09IFwiZnVuY3Rpb25cIikgY2FsbEhvb2suY2FsbChzb3VyY2Uub25pbml0LCB2bm9kZSlcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKGNhbGxIb29rLmJpbmQoc291cmNlLm9uY3JlYXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTGlmZWN5Y2xlKHNvdXJjZSwgdm5vZGUsIGhvb2tzKSB7XG5cdFx0aWYgKHR5cGVvZiBzb3VyY2Uub251cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgaG9va3MucHVzaChjYWxsSG9vay5iaW5kKHNvdXJjZS5vbnVwZGF0ZSwgdm5vZGUpKVxuXHR9XG5cdGZ1bmN0aW9uIHNob3VsZE5vdFVwZGF0ZSh2bm9kZSwgb2xkKSB7XG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dmFyIGZvcmNlID0gY2FsbEhvb2suY2FsbCh2bm9kZS5hdHRycy5vbmJlZm9yZXVwZGF0ZSwgdm5vZGUsIG9sZClcblx0XHRcdFx0aWYgKGZvcmNlICE9PSB1bmRlZmluZWQgJiYgIWZvcmNlKSBicmVha1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLnN0YXRlLm9uYmVmb3JldXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dmFyIGZvcmNlID0gY2FsbEhvb2suY2FsbCh2bm9kZS5zdGF0ZS5vbmJlZm9yZXVwZGF0ZSwgdm5vZGUsIG9sZClcblx0XHRcdFx0aWYgKGZvcmNlICE9PSB1bmRlZmluZWQgJiYgIWZvcmNlKSBicmVha1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0fSB3aGlsZSAoZmFsc2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuXHRcdHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHR2bm9kZS5pbnN0YW5jZSA9IG9sZC5pbnN0YW5jZVxuXHRcdC8vIE9uZSB3b3VsZCB0aGluayBoYXZpbmcgdGhlIGFjdHVhbCBsYXRlc3QgYXR0cmlidXRlcyB3b3VsZCBiZSBpZGVhbCxcblx0XHQvLyBidXQgaXQgZG9lc24ndCBsZXQgdXMgcHJvcGVybHkgZGlmZiBiYXNlZCBvbiBvdXIgY3VycmVudCBpbnRlcm5hbFxuXHRcdC8vIHJlcHJlc2VudGF0aW9uLiBXZSBoYXZlIHRvIHNhdmUgbm90IG9ubHkgdGhlIG9sZCBET00gaW5mbywgYnV0IGFsc29cblx0XHQvLyB0aGUgYXR0cmlidXRlcyB1c2VkIHRvIGNyZWF0ZSBpdCwgYXMgd2UgZGlmZiAqdGhhdCosIG5vdCBhZ2FpbnN0IHRoZVxuXHRcdC8vIERPTSBkaXJlY3RseSAod2l0aCBhIGZldyBleGNlcHRpb25zIGluIGBzZXRBdHRyYCkuIEFuZCwgb2YgY291cnNlLCB3ZVxuXHRcdC8vIG5lZWQgdG8gc2F2ZSB0aGUgY2hpbGRyZW4gYW5kIHRleHQgYXMgdGhleSBhcmUgY29uY2VwdHVhbGx5IG5vdFxuXHRcdC8vIHVubGlrZSBzcGVjaWFsIFwiYXR0cmlidXRlc1wiIGludGVybmFsbHkuXG5cdFx0dm5vZGUuYXR0cnMgPSBvbGQuYXR0cnNcblx0XHR2bm9kZS5jaGlsZHJlbiA9IG9sZC5jaGlsZHJlblxuXHRcdHZub2RlLnRleHQgPSBvbGQudGV4dFxuXHRcdHJldHVybiB0cnVlXG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24oZG9tLCB2bm9kZXMsIHJlZHJhdykge1xuXHRcdGlmICghZG9tKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpXG5cdFx0dmFyIGhvb2tzID0gW11cblx0XHR2YXIgYWN0aXZlID0gYWN0aXZlRWxlbWVudCgpXG5cdFx0dmFyIG5hbWVzcGFjZSA9IGRvbS5uYW1lc3BhY2VVUklcblxuXHRcdC8vIEZpcnN0IHRpbWUgcmVuZGVyaW5nIGludG8gYSBub2RlIGNsZWFycyBpdCBvdXRcblx0XHRpZiAoZG9tLnZub2RlcyA9PSBudWxsKSBkb20udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHR2bm9kZXMgPSBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihBcnJheS5pc0FycmF5KHZub2RlcykgPyB2bm9kZXMgOiBbdm5vZGVzXSlcblx0XHR2YXIgcHJldlJlZHJhdyA9IGN1cnJlbnRSZWRyYXdcblx0XHR0cnkge1xuXHRcdFx0Y3VycmVudFJlZHJhdyA9IHR5cGVvZiByZWRyYXcgPT09IFwiZnVuY3Rpb25cIiA/IHJlZHJhdyA6IHVuZGVmaW5lZFxuXHRcdFx0dXBkYXRlTm9kZXMoZG9tLCBkb20udm5vZGVzLCB2bm9kZXMsIGhvb2tzLCBudWxsLCBuYW1lc3BhY2UgPT09IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiID8gdW5kZWZpbmVkIDogbmFtZXNwYWNlKVxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRjdXJyZW50UmVkcmF3ID0gcHJldlJlZHJhd1xuXHRcdH1cblx0XHRkb20udm5vZGVzID0gdm5vZGVzXG5cdFx0Ly8gYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGNhbiByZXR1cm4gbnVsbDogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW50ZXJhY3Rpb24uaHRtbCNkb20tZG9jdW1lbnQtYWN0aXZlZWxlbWVudFxuXHRcdGlmIChhY3RpdmUgIT0gbnVsbCAmJiBhY3RpdmVFbGVtZW50KCkgIT09IGFjdGl2ZSAmJiB0eXBlb2YgYWN0aXZlLmZvY3VzID09PSBcImZ1bmN0aW9uXCIpIGFjdGl2ZS5mb2N1cygpXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykgaG9va3NbaV0oKVxuXHR9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaHRtbCkge1xuXHRpZiAoaHRtbCA9PSBudWxsKSBodG1sID0gXCJcIlxuXHRyZXR1cm4gVm5vZGUoXCI8XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBodG1sLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbmZ1bmN0aW9uIFZub2RlKHRhZywga2V5LCBhdHRycywgY2hpbGRyZW4sIHRleHQsIGRvbSkge1xuXHRyZXR1cm4ge3RhZzogdGFnLCBrZXk6IGtleSwgYXR0cnM6IGF0dHJzLCBjaGlsZHJlbjogY2hpbGRyZW4sIHRleHQ6IHRleHQsIGRvbTogZG9tLCBkb21TaXplOiB1bmRlZmluZWQsIHN0YXRlOiB1bmRlZmluZWQsIGV2ZW50czogdW5kZWZpbmVkLCBpbnN0YW5jZTogdW5kZWZpbmVkfVxufVxuVm5vZGUubm9ybWFsaXplID0gZnVuY3Rpb24obm9kZSkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShub2RlKSkgcmV0dXJuIFZub2RlKFwiW1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4obm9kZSksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRpZiAobm9kZSA9PSBudWxsIHx8IHR5cGVvZiBub2RlID09PSBcImJvb2xlYW5cIikgcmV0dXJuIG51bGxcblx0aWYgKHR5cGVvZiBub2RlID09PSBcIm9iamVjdFwiKSByZXR1cm4gbm9kZVxuXHRyZXR1cm4gVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBTdHJpbmcobm9kZSksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxuVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4gPSBmdW5jdGlvbihpbnB1dCkge1xuXHR2YXIgY2hpbGRyZW4gPSBbXVxuXHRpZiAoaW5wdXQubGVuZ3RoKSB7XG5cdFx0dmFyIGlzS2V5ZWQgPSBpbnB1dFswXSAhPSBudWxsICYmIGlucHV0WzBdLmtleSAhPSBudWxsXG5cdFx0Ly8gTm90ZTogdGhpcyBpcyBhICp2ZXJ5KiBwZXJmLXNlbnNpdGl2ZSBjaGVjay5cblx0XHQvLyBGdW4gZmFjdDogbWVyZ2luZyB0aGUgbG9vcCBsaWtlIHRoaXMgaXMgc29tZWhvdyBmYXN0ZXIgdGhhbiBzcGxpdHRpbmdcblx0XHQvLyBpdCwgbm90aWNlYWJseSBzby5cblx0XHRmb3IgKHZhciBpID0gMTsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoKGlucHV0W2ldICE9IG51bGwgJiYgaW5wdXRbaV0ua2V5ICE9IG51bGwpICE9PSBpc0tleWVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJWbm9kZXMgbXVzdCBlaXRoZXIgYWx3YXlzIGhhdmUga2V5cyBvciBuZXZlciBoYXZlIGtleXMhXCIpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNoaWxkcmVuW2ldID0gVm5vZGUubm9ybWFsaXplKGlucHV0W2ldKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2hpbGRyZW5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWbm9kZVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIFByb21pc2VQb2x5ZmlsbCA9IHJlcXVpcmUoXCIuL3Byb21pc2UvcHJvbWlzZVwiKVxudmFyIG1vdW50UmVkcmF3ID0gcmVxdWlyZShcIi4vbW91bnQtcmVkcmF3XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcmVxdWVzdC9yZXF1ZXN0XCIpKHdpbmRvdywgUHJvbWlzZVBvbHlmaWxsLCBtb3VudFJlZHJhdy5yZWRyYXcpXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgYnVpbGRQYXRobmFtZSA9IHJlcXVpcmUoXCIuLi9wYXRobmFtZS9idWlsZFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR3aW5kb3csIFByb21pc2UsIG9uY29tcGxldGlvbikge1xuXHR2YXIgY2FsbGJhY2tDb3VudCA9IDBcblxuXHRmdW5jdGlvbiBQcm9taXNlUHJveHkoZXhlY3V0b3IpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZXhlY3V0b3IpXG5cdH1cblxuXHQvLyBJbiBjYXNlIHRoZSBnbG9iYWwgUHJvbWlzZSBpcyBzb21lIHVzZXJsYW5kIGxpYnJhcnkncyB3aGVyZSB0aGV5IHJlbHkgb25cblx0Ly8gYGZvbyBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3JgLCBgdGhpcy5jb25zdHJ1Y3Rvci5yZXNvbHZlKHZhbHVlKWAsIG9yXG5cdC8vIHNpbWlsYXIuIExldCdzICpub3QqIGJyZWFrIHRoZW0uXG5cdFByb21pc2VQcm94eS5wcm90b3R5cGUgPSBQcm9taXNlLnByb3RvdHlwZVxuXHRQcm9taXNlUHJveHkuX19wcm90b19fID0gUHJvbWlzZSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvXG5cblx0ZnVuY3Rpb24gbWFrZVJlcXVlc3QoZmFjdG9yeSkge1xuXHRcdHJldHVybiBmdW5jdGlvbih1cmwsIGFyZ3MpIHtcblx0XHRcdGlmICh0eXBlb2YgdXJsICE9PSBcInN0cmluZ1wiKSB7IGFyZ3MgPSB1cmw7IHVybCA9IHVybC51cmwgfVxuXHRcdFx0ZWxzZSBpZiAoYXJncyA9PSBudWxsKSBhcmdzID0ge31cblx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGZhY3RvcnkoYnVpbGRQYXRobmFtZSh1cmwsIGFyZ3MucGFyYW1zKSwgYXJncywgZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGFyZ3MudHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhW2ldID0gbmV3IGFyZ3MudHlwZShkYXRhW2ldKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGRhdGEgPSBuZXcgYXJncy50eXBlKGRhdGEpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YSlcblx0XHRcdFx0fSwgcmVqZWN0KVxuXHRcdFx0fSlcblx0XHRcdGlmIChhcmdzLmJhY2tncm91bmQgPT09IHRydWUpIHJldHVybiBwcm9taXNlXG5cdFx0XHR2YXIgY291bnQgPSAwXG5cdFx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpIHtcblx0XHRcdFx0aWYgKC0tY291bnQgPT09IDAgJiYgdHlwZW9mIG9uY29tcGxldGlvbiA9PT0gXCJmdW5jdGlvblwiKSBvbmNvbXBsZXRpb24oKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gd3JhcChwcm9taXNlKVxuXG5cdFx0XHRmdW5jdGlvbiB3cmFwKHByb21pc2UpIHtcblx0XHRcdFx0dmFyIHRoZW4gPSBwcm9taXNlLnRoZW5cblx0XHRcdFx0Ly8gU2V0IHRoZSBjb25zdHJ1Y3Rvciwgc28gZW5naW5lcyBrbm93IHRvIG5vdCBhd2FpdCBvciByZXNvbHZlXG5cdFx0XHRcdC8vIHRoaXMgYXMgYSBuYXRpdmUgcHJvbWlzZS4gQXQgdGhlIHRpbWUgb2Ygd3JpdGluZywgdGhpcyBpc1xuXHRcdFx0XHQvLyBvbmx5IG5lY2Vzc2FyeSBmb3IgVjgsIGJ1dCB0aGVpciBiZWhhdmlvciBpcyB0aGUgY29ycmVjdFxuXHRcdFx0XHQvLyBiZWhhdmlvciBwZXIgc3BlYy4gU2VlIHRoaXMgc3BlYyBpc3N1ZSBmb3IgbW9yZSBkZXRhaWxzOlxuXHRcdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9lY21hMjYyL2lzc3Vlcy8xNTc3LiBBbHNvLCBzZWUgdGhlXG5cdFx0XHRcdC8vIGNvcnJlc3BvbmRpbmcgY29tbWVudCBpbiBgcmVxdWVzdC90ZXN0cy90ZXN0LXJlcXVlc3QuanNgIGZvclxuXHRcdFx0XHQvLyBhIGJpdCBtb3JlIGJhY2tncm91bmQgb24gdGhlIGlzc3VlIGF0IGhhbmQuXG5cdFx0XHRcdHByb21pc2UuY29uc3RydWN0b3IgPSBQcm9taXNlUHJveHlcblx0XHRcdFx0cHJvbWlzZS50aGVuID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y291bnQrK1xuXHRcdFx0XHRcdHZhciBuZXh0ID0gdGhlbi5hcHBseShwcm9taXNlLCBhcmd1bWVudHMpXG5cdFx0XHRcdFx0bmV4dC50aGVuKGNvbXBsZXRlLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHRjb21wbGV0ZSgpXG5cdFx0XHRcdFx0XHRpZiAoY291bnQgPT09IDApIHRocm93IGVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdHJldHVybiB3cmFwKG5leHQpXG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHByb21pc2Vcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNIZWFkZXIoYXJncywgbmFtZSkge1xuXHRcdGZvciAodmFyIGtleSBpbiBhcmdzLmhlYWRlcnMpIHtcblx0XHRcdGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3MuaGVhZGVycywga2V5KSAmJiBuYW1lLnRlc3Qoa2V5KSkgcmV0dXJuIHRydWVcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHJlcXVlc3Q6IG1ha2VSZXF1ZXN0KGZ1bmN0aW9uKHVybCwgYXJncywgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHR2YXIgbWV0aG9kID0gYXJncy5tZXRob2QgIT0gbnVsbCA/IGFyZ3MubWV0aG9kLnRvVXBwZXJDYXNlKCkgOiBcIkdFVFwiXG5cdFx0XHR2YXIgYm9keSA9IGFyZ3MuYm9keVxuXHRcdFx0dmFyIGFzc3VtZUpTT04gPSAoYXJncy5zZXJpYWxpemUgPT0gbnVsbCB8fCBhcmdzLnNlcmlhbGl6ZSA9PT0gSlNPTi5zZXJpYWxpemUpICYmICEoYm9keSBpbnN0YW5jZW9mICR3aW5kb3cuRm9ybURhdGEpXG5cdFx0XHR2YXIgcmVzcG9uc2VUeXBlID0gYXJncy5yZXNwb25zZVR5cGUgfHwgKHR5cGVvZiBhcmdzLmV4dHJhY3QgPT09IFwiZnVuY3Rpb25cIiA/IFwiXCIgOiBcImpzb25cIilcblxuXHRcdFx0dmFyIHhociA9IG5ldyAkd2luZG93LlhNTEh0dHBSZXF1ZXN0KCksIGFib3J0ZWQgPSBmYWxzZVxuXHRcdFx0dmFyIG9yaWdpbmFsID0geGhyLCByZXBsYWNlZEFib3J0XG5cdFx0XHR2YXIgYWJvcnQgPSB4aHIuYWJvcnRcblxuXHRcdFx0eGhyLmFib3J0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFib3J0ZWQgPSB0cnVlXG5cdFx0XHRcdGFib3J0LmNhbGwodGhpcylcblx0XHRcdH1cblxuXHRcdFx0eGhyLm9wZW4obWV0aG9kLCB1cmwsIGFyZ3MuYXN5bmMgIT09IGZhbHNlLCB0eXBlb2YgYXJncy51c2VyID09PSBcInN0cmluZ1wiID8gYXJncy51c2VyIDogdW5kZWZpbmVkLCB0eXBlb2YgYXJncy5wYXNzd29yZCA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MucGFzc3dvcmQgOiB1bmRlZmluZWQpXG5cblx0XHRcdGlmIChhc3N1bWVKU09OICYmIGJvZHkgIT0gbnVsbCAmJiAhaGFzSGVhZGVyKGFyZ3MsIC9eY29udGVudC10eXBlJC9pKSkge1xuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIilcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgYXJncy5kZXNlcmlhbGl6ZSAhPT0gXCJmdW5jdGlvblwiICYmICFoYXNIZWFkZXIoYXJncywgL15hY2NlcHQkL2kpKSB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC8qXCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy53aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSBhcmdzLndpdGhDcmVkZW50aWFsc1xuXHRcdFx0aWYgKGFyZ3MudGltZW91dCkgeGhyLnRpbWVvdXQgPSBhcmdzLnRpbWVvdXRcblx0XHRcdHhoci5yZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGVcblxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZ3MuaGVhZGVycykge1xuXHRcdFx0XHRpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChhcmdzLmhlYWRlcnMsIGtleSkpIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGFyZ3MuaGVhZGVyc1trZXldKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbihldikge1xuXHRcdFx0XHQvLyBEb24ndCB0aHJvdyBlcnJvcnMgb24geGhyLmFib3J0KCkuXG5cdFx0XHRcdGlmIChhYm9ydGVkKSByZXR1cm5cblxuXHRcdFx0XHRpZiAoZXYudGFyZ2V0LnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dmFyIHN1Y2Nlc3MgPSAoZXYudGFyZ2V0LnN0YXR1cyA+PSAyMDAgJiYgZXYudGFyZ2V0LnN0YXR1cyA8IDMwMCkgfHwgZXYudGFyZ2V0LnN0YXR1cyA9PT0gMzA0IHx8ICgvXmZpbGU6XFwvXFwvL2kpLnRlc3QodXJsKVxuXHRcdFx0XHRcdFx0Ly8gV2hlbiB0aGUgcmVzcG9uc2UgdHlwZSBpc24ndCBcIlwiIG9yIFwidGV4dFwiLFxuXHRcdFx0XHRcdFx0Ly8gYHhoci5yZXNwb25zZVRleHRgIGlzIHRoZSB3cm9uZyB0aGluZyB0byB1c2UuXG5cdFx0XHRcdFx0XHQvLyBCcm93c2VycyBkbyB0aGUgcmlnaHQgdGhpbmcgYW5kIHRocm93IGhlcmUsIGFuZCB3ZVxuXHRcdFx0XHRcdFx0Ly8gc2hvdWxkIGhvbm9yIHRoYXQgYW5kIGRvIHRoZSByaWdodCB0aGluZyBieVxuXHRcdFx0XHRcdFx0Ly8gcHJlZmVycmluZyBgeGhyLnJlc3BvbnNlYCB3aGVyZSBwb3NzaWJsZS9wcmFjdGljYWwuXG5cdFx0XHRcdFx0XHR2YXIgcmVzcG9uc2UgPSBldi50YXJnZXQucmVzcG9uc2UsIG1lc3NhZ2VcblxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlVHlwZSA9PT0gXCJqc29uXCIpIHtcblx0XHRcdFx0XHRcdFx0Ly8gRm9yIElFIGFuZCBFZGdlLCB3aGljaCBkb24ndCBpbXBsZW1lbnRcblx0XHRcdFx0XHRcdFx0Ly8gYHJlc3BvbnNlVHlwZTogXCJqc29uXCJgLlxuXHRcdFx0XHRcdFx0XHRpZiAoIWV2LnRhcmdldC5yZXNwb25zZVR5cGUgJiYgdHlwZW9mIGFyZ3MuZXh0cmFjdCAhPT0gXCJmdW5jdGlvblwiKSByZXNwb25zZSA9IEpTT04ucGFyc2UoZXYudGFyZ2V0LnJlc3BvbnNlVGV4dClcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09IFwidGV4dFwiKSB7XG5cdFx0XHRcdFx0XHRcdC8vIE9ubHkgdXNlIHRoaXMgZGVmYXVsdCBpZiBpdCdzIHRleHQuIElmIGEgcGFyc2VkXG5cdFx0XHRcdFx0XHRcdC8vIGRvY3VtZW50IGlzIG5lZWRlZCBvbiBvbGQgSUUgYW5kIGZyaWVuZHMgKGFsbFxuXHRcdFx0XHRcdFx0XHQvLyB1bnN1cHBvcnRlZCksIHRoZSB1c2VyIHNob3VsZCB1c2UgYSBjdXN0b21cblx0XHRcdFx0XHRcdFx0Ly8gYGNvbmZpZ2AgaW5zdGVhZC4gVGhleSdyZSBhbHJlYWR5IHVzaW5nIHRoaXMgYXRcblx0XHRcdFx0XHRcdFx0Ly8gdGhlaXIgb3duIHJpc2suXG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZSA9PSBudWxsKSByZXNwb25zZSA9IGV2LnRhcmdldC5yZXNwb25zZVRleHRcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBhcmdzLmV4dHJhY3QgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IGFyZ3MuZXh0cmFjdChldi50YXJnZXQsIGFyZ3MpXG5cdFx0XHRcdFx0XHRcdHN1Y2Nlc3MgPSB0cnVlXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhcmdzLmRlc2VyaWFsaXplID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBhcmdzLmRlc2VyaWFsaXplKHJlc3BvbnNlKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN1Y2Nlc3MpIHJlc29sdmUocmVzcG9uc2UpXG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHsgbWVzc2FnZSA9IGV2LnRhcmdldC5yZXNwb25zZVRleHQgfVxuXHRcdFx0XHRcdFx0XHRjYXRjaCAoZSkgeyBtZXNzYWdlID0gcmVzcG9uc2UgfVxuXHRcdFx0XHRcdFx0XHR2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSlcblx0XHRcdFx0XHRcdFx0ZXJyb3IuY29kZSA9IGV2LnRhcmdldC5zdGF0dXNcblx0XHRcdFx0XHRcdFx0ZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZVxuXHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLmNvbmZpZyA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHhociA9IGFyZ3MuY29uZmlnKHhociwgYXJncywgdXJsKSB8fCB4aHJcblxuXHRcdFx0XHQvLyBQcm9wYWdhdGUgdGhlIGBhYm9ydGAgdG8gYW55IHJlcGxhY2VtZW50IFhIUiBhcyB3ZWxsLlxuXHRcdFx0XHRpZiAoeGhyICE9PSBvcmlnaW5hbCkge1xuXHRcdFx0XHRcdHJlcGxhY2VkQWJvcnQgPSB4aHIuYWJvcnRcblx0XHRcdFx0XHR4aHIuYWJvcnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGFib3J0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRyZXBsYWNlZEFib3J0LmNhbGwodGhpcylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGJvZHkgPT0gbnVsbCkgeGhyLnNlbmQoKVxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGFyZ3Muc2VyaWFsaXplID09PSBcImZ1bmN0aW9uXCIpIHhoci5zZW5kKGFyZ3Muc2VyaWFsaXplKGJvZHkpKVxuXHRcdFx0ZWxzZSBpZiAoYm9keSBpbnN0YW5jZW9mICR3aW5kb3cuRm9ybURhdGEpIHhoci5zZW5kKGJvZHkpXG5cdFx0XHRlbHNlIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGJvZHkpKVxuXHRcdH0pLFxuXHRcdGpzb25wOiBtYWtlUmVxdWVzdChmdW5jdGlvbih1cmwsIGFyZ3MsIHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dmFyIGNhbGxiYWNrTmFtZSA9IGFyZ3MuY2FsbGJhY2tOYW1lIHx8IFwiX21pdGhyaWxfXCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSArIFwiX1wiICsgY2FsbGJhY2tDb3VudCsrXG5cdFx0XHR2YXIgc2NyaXB0ID0gJHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXG5cdFx0XHQkd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGRlbGV0ZSAkd2luZG93W2NhbGxiYWNrTmFtZV1cblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuXHRcdFx0XHRyZXNvbHZlKGRhdGEpXG5cdFx0XHR9XG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIkpTT05QIHJlcXVlc3QgZmFpbGVkXCIpKVxuXHRcdFx0fVxuXHRcdFx0c2NyaXB0LnNyYyA9IHVybCArICh1cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIikgK1xuXHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoYXJncy5jYWxsYmFja0tleSB8fCBcImNhbGxiYWNrXCIpICsgXCI9XCIgK1xuXHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoY2FsbGJhY2tOYW1lKVxuXHRcdFx0JHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXHRcdH0pLFxuXHR9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgbW91bnRSZWRyYXcgPSByZXF1aXJlKFwiLi9tb3VudC1yZWRyYXdcIilcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9hcGkvcm91dGVyXCIpKHdpbmRvdywgbW91bnRSZWRyYXcpXG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG4vLyBqcy9tb2RlbHMvYXV0aC5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IGFwaUtleSwgYmFzZVVybCB9IGZyb20gXCIuLi92YXJzLmpzXCI7XG5pbXBvcnQgeyBmaWxlTW9kZWwgfSBmcm9tIFwiLi9maWxlbW9kZWwuanNcIjtcbi8vIGltcG9ydCB7IGFwaUtleSwgYmFzZVVybCwgdG9rZW4gfSBmcm9tIFwiLi4vdmFycy5qc1wiO1xuXG5sZXQgYXV0aCA9IHtcbiAgICBiYXNlVXJsOiBiYXNlVXJsLFxuICAgIGFwaUtleTogYXBpS2V5LFxuICAgIHVybExvZ2luOiBgJHtiYXNlVXJsfS9hdXRoL2xvZ2luYCxcbiAgICB1cmxSZWdpc3RlcjogYCR7YmFzZVVybH0vYXV0aC9yZWdpc3RlcmAsXG4gICAgZW1haWw6IFwiXCIsXG4gICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgLy8gVE9ETzogY2hhbmdlIHRva2VuIHRvIFwiXCJcbiAgICB0b2tlbjogXCJcIiwgLy90b2tlbixcbiAgICBjdXJyZW50Rm9ybToge30sXG4gICAgY2FsbGJhY2s6IFwiXCIsXG4gICAgZXJyb3I6IFwiXCIsXG4gICAgbG9naW46IGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IGF1dGgudXJsTG9naW4sXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgZW1haWw6IGF1dGguZW1haWwsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGF1dGgucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgYXBpX2tleTogYXBpS2V5XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YS50b2tlbik7XG4gICAgICAgICAgICBhdXRoLnRva2VuID0gcmVzdWx0LmRhdGEudG9rZW47XG4gICAgICAgICAgICBpZiAoZmlsZU1vZGVsLmZpbGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGxvZ2luIGZpbGVNb2RlbC5maWxlOlwiLCBmaWxlTW9kZWwuZmlsZSk7XG4gICAgICAgICAgICAgICAgZmlsZU1vZGVsLndyaXRlVG9GaWxlKGZpbGVNb2RlbC5maWxlLCBhdXRoLnRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChgLyR7YXV0aC5jYWxsYmFja31gKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZWdpc3RlcjogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogYXV0aC51cmxSZWdpc3RlcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICBlbWFpbDogYXV0aC5lbWFpbCxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogYXV0aC5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICBhcGlfa2V5OiBhcGlLZXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0ZXIucmVzdWx0LmRhdGE6XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoYC8ke2F1dGguY2FsbGJhY2t9YCk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgbGV0IGVyckpzb24gPSBKU09OLnBhcnNlKGVycik7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJySnNvbik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG5hbWU6XCIsIGVyckpzb24ubmFtZSk7XG4gICAgICAgICAgICAvLyByZXR1cm4gbS5yb3V0ZS5zZXQoYC9yZWdpc3RlcmApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGNoZWNrVG9rZW5WYWxpZGl0eTogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChhdXRoLnRva2VuID09PSBcIlwiKSB7XG4gICAgICAgICAgICBhd2FpdCBmaWxlTW9kZWwuY2hlY2tJZkZpbGVFeGlzdChcInRva2VuLnR4dFwiLCBhdXRoLmZpbGVFeGlzdHMsIGF1dGguZmlsZURvZXNOb3RFeGlzdCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbGVFeGlzdHM6IGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuICAgICAgICBmaWxlTW9kZWwuZmlsZSA9IGZpbGVFbnRyeTtcbiAgICAgICAgY29uc29sZS5sb2coXCJmaWxlRW50cnkgaW4gY2FsbGJhY2sgZnJvbSByZWFkRnJvbUZpbGU6IFwiLCBmaWxlRW50cnkpO1xuICAgICAgICBmaWxlTW9kZWwucmVhZEZyb21GaWxlKGZpbGVFbnRyeSwgYXV0aC5jaGVja1Rva2VuKTtcbiAgICB9LFxuICAgIGNoZWNrVG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWZ0ZXIgZmlsZSByZWFkIGluIGZpbGVFeGlzdFwiKTtcbiAgICAgICAgaWYgKHRva2VuICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBhdXRoLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICBpZiAoYXV0aC5nZXRBbGxJbnZvaWNlcygpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb2tlbiBpcyB2YWxpZCFcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF1dGgudG9rZW4gPSBcIlwiO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9rZW4gaXMgaW52YWxpZCFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbGVEb2VzTm90RXhpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImZpbGUgZG9lcyBub3QgZXhpc3RcIik7XG4gICAgICAgIGZpbGVNb2RlbC5jcmVhdGVGaWxlKCk7XG4gICAgfSxcbiAgICBnZXRBbGxJbnZvaWNlczogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L2ludm9pY2VzP2FwaV9rZXk9JHthdXRoLmFwaUtleX1gLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGF1dGgudG9rZW4sXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludm9pY2VzLmdldEFsbEludm9pY2VzOlwiLCByZXN1bHQuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGF1dGgsIGJhc2VVcmwsIGFwaUtleSB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGpzaGludCBicm93c2VyOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZmlsZU1vZGVsID0ge1xuICAgIGN1cnJlbnQ6IFwiXCIsXG4gICAgZmlsZTogbnVsbCxcbiAgICByZWFkVGV4dDogXCJcIixcblxuICAgIGNyZWF0ZUZpbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEZpbGVTeXN0ZW0od2luZG93LkxvY2FsRmlsZVN5c3RlbS5QRVJTSVNURU5ULCAwLCBmdW5jdGlvbiAoZnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaWxlIHN5c3RlbSBvcGVuOiAnICsgZnMubmFtZSk7XG4gICAgICAgICAgICBmcy5yb290LmdldEZpbGUoXG4gICAgICAgICAgICAgICAgXCJ0b2tlbi50eHRcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhjbHVzaXZlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGZpbGVFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbGVFbnRyeTogXCIsIGZpbGVFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVNb2RlbC5maWxlID0gZmlsZUVudHJ5O1xuICAgICAgICAgICAgICAgICAgICAvLyBmaWxlTW9kZWwud3JpdGVUb0ZpbGUoZmlsZU1vZGVsLmZpbGUsIG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsZU1vZGVsLnJlYWRGcm9tRmlsZShmaWxlRW50cnkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEVycm9yKFwiRXJyb3IgbG9hZGluZyBmaWxlXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG91dHB1dEVycm9yKFwiRXJyb3IgbG9hZGluZyBmaWxlc3lzdGVtXCIpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgd3JpdGVUb0ZpbGU6IGZ1bmN0aW9uKGZpbGVFbnRyeSwgZGF0YSwgYXBwZW5kKSB7XG4gICAgICAgIGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIoZnVuY3Rpb24gKGZpbGVXcml0ZXIpIHtcbiAgICAgICAgICAgIGZpbGVXcml0ZXIub253cml0ZWVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bCBmaWxlIHdyaXRlLi4uXCIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsZVdyaXRlci5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZCBmaWxlIHdyaXRlOiBcIiArIGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoYXBwZW5kKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZVdyaXRlci5zZWVrKGZpbGVXcml0ZXIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmlsZSBkb2Vzbid0IGV4aXN0IVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgZmlsZVdyaXRlci53cml0ZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlYWRGcm9tRmlsZTogZnVuY3Rpb24oZmlsZUVudHJ5LCBjYWxsYmFjaykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlYWRGcm9tRmlsZVwiKTtcbiAgICAgICAgZmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzZnVsIGZpbGUgcmVhZDogXCIgKyB0aGlzLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgZmlsZU1vZGVsLnJlYWRUZXh0ID0gdGhpcy5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGJhY2sgaW4gcmVhZEZyb21GaWxlOiBcIiwgdGhpcy5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIG0ucmVkcmF3KCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBvdXRwdXRFcnJvcihcIkVycm9yIHJlYWRpbmcgZnJvbSBmaWxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY2hlY2tJZkZpbGVFeGlzdDogYXN5bmMgZnVuY3Rpb24ocGF0aCwgZmlsZUV4aXN0cywgZmlsZURvZXNOb3RFeGlzdCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEZpbGVTeXN0ZW0od2luZG93LkxvY2FsRmlsZVN5c3RlbS5QRVJTSVNURU5ULCAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0RmlsZVN5c3RlbShcbiAgICAgICAgICAgICAgICB3aW5kb3cuTG9jYWxGaWxlU3lzdGVtLlBFUlNJU1RFTlQsIDAsIGZ1bmN0aW9uKGZpbGVTeXN0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5yb290LmdldEZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBjcmVhdGU6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlRXhpc3RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZURvZXNOb3RFeGlzdFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sIGZpbGVNb2RlbC5nZXRGU0ZhaWwpOyAvL29mIHJlcXVlc3RGaWxlU3lzdGVtXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRGU0ZhaWw6IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBjb25zb2xlLmxvZyhldnQudGFyZ2V0LmVycm9yLmNvZGUpO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIG91dHB1dEVycm9yKGVycm9yTWVzc2FnZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbn1cblxuZXhwb3J0IHsgZmlsZU1vZGVsIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG4vLyBqcy9tb2RlbHMvaW52b2ljZXMuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBvcmRlcnMgfSBmcm9tIFwiLi9vcmRlcnMuanNcIjtcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5cbmxldCBpbnZvaWNlc01vZGVsID0ge1xuICAgIHVybDogYCR7YXV0aC5iYXNlVXJsfS9pbnZvaWNlcz9hcGlfa2V5PSR7YXV0aC5hcGlLZXl9YCxcbiAgICBpbnZvaWNlczogW10sXG5cbiAgICBnZXRBbGxJbnZvaWNlczogYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBhdXRoLnRva2VuOiAke2F1dGgudG9rZW59YCk7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBpbnZvaWNlc01vZGVsLnVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhdXRoLnRva2VuLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZvaWNlcy5nZXRBbGxJbnZvaWNlczpcIiwgcmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgaW52b2ljZXNNb2RlbC5pbnZvaWNlcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2F2ZUludm9pY2U6IGFzeW5jIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICAgIGNvbnN0IGZvcm1hdFltZCA9IGRhdGUgPT4gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICAgICAgbGV0IGN1cnJlbnREYXRlID0gZm9ybWF0WW1kKG5ldyBEYXRlKCkpO1xuXG4gICAgICAgIGxldCBzdW0gPSAwO1xuXG4gICAgICAgIG9yZGVyLm9yZGVyX2l0ZW1zLmZvckVhY2goZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgICAgICAgICAgc3VtICs9ICtwcm9kdWN0LnByaWNlICogK3Byb2R1Y3QuYW1vdW50O1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYm9keSA9IHtcbiAgICAgICAgICAgIG9yZGVyX2lkOiBvcmRlci5pZCxcbiAgICAgICAgICAgIGFwaV9rZXk6IGF1dGguYXBpS2V5LFxuICAgICAgICAgICAgdG90YWxfcHJpY2U6IHN1bSxcbiAgICAgICAgICAgIGNyZWF0aW9uX2RhdGU6IGN1cnJlbnREYXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJzYXZlSW52b2ljZTogYm9keVwiLCBib2R5KTtcblxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vaW52b2ljZXNgLFxuICAgICAgICAgICAgYm9keTogYm9keSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhdXRoLnRva2VuLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlSW52b2ljZTogcmVzdWx0OiBcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIG9yZGVycy51cGRhdGVPcmRlcihvcmRlci5pZCwgNjAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgaW52b2ljZXNNb2RlbCB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuLy8ganMvbW9kZWxzL2xhZ2VyLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5cbmxldCBsYWdlciA9IHtcbiAgICBjdXJyZW50OiB7XG4gICAgICAgIGRlbGl2ZXJpZXM6IFtdLFxuICAgICAgICBwcm9kdWN0czogW11cbiAgICB9LFxuICAgIGN1cnJlbnRGb3JtOiB7fSxcbiAgICBsb2FkQWxsRGVsaXZlcmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L2RlbGl2ZXJpZXM/YXBpX2tleT0ke2F1dGguYXBpS2V5fWBcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGxhZ2VyLmN1cnJlbnQuZGVsaXZlcmllcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9KS5maW5hbGx5IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHVybDogYCR7YXV0aC5iYXNlVXJsfS9wcm9kdWN0cz9hcGlfa2V5PSR7YXV0aC5hcGlLZXl9YFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBsYWdlci5jdXJyZW50LnByb2R1Y3RzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsYWdlci5jdXJyZW50LnByb2R1Y3RzOiBcIiwgbGFnZXIuY3VycmVudC5wcm9kdWN0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhZGRJbmRlbGl2ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGFnZXIuY3VycmVudEZvcm0uYXBpX2tleSA9IGF1dGguYXBpS2V5O1xuICAgICAgICBjb25zb2xlLmxvZyhcImxhZ2VyLmN1cnJlbnRGb3JtOiBcIiwgbGFnZXIuY3VycmVudEZvcm0pO1xuXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogYCR7YXV0aC5iYXNlVXJsfS9kZWxpdmVyaWVzYCxcbiAgICAgICAgICAgIGJvZHk6IGxhZ2VyLmN1cnJlbnRGb3JtXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhZ2VyLmN1cnJlbnRGb3JtOiBcIiwgbGFnZXIuY3VycmVudEZvcm0pO1xuICAgICAgICAgICAgbGV0IHJlcXVlc3RCb2R5ID0ge1xuICAgICAgICAgICAgICAgIGFwaV9rZXk6IGF1dGguYXBpS2V5LFxuICAgICAgICAgICAgICAgIGlkOiBsYWdlci5jdXJyZW50Rm9ybS5wcm9kdWN0X2lkLFxuICAgICAgICAgICAgICAgIG5hbWU6IGxhZ2VyLmN1cnJlbnQucHJvZHVjdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0ID0+IHByb2R1Y3QuaWQgPT0gbGFnZXIuY3VycmVudEZvcm0ucHJvZHVjdF9pZFxuICAgICAgICAgICAgICAgIClbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICBzdG9jazogKCtsYWdlci5jdXJyZW50Rm9ybS5hbW91bnQgKyAvLyBwcmVmaXggK3N0cmluZyBjb252ZXJ0cyBpdCB0byBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgK2xhZ2VyLmN1cnJlbnQucHJvZHVjdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdCA9PiBwcm9kdWN0LmlkID09IGxhZ2VyLmN1cnJlbnRGb3JtLnByb2R1Y3RfaWRcbiAgICAgICAgICAgICAgICAgICAgKVswXS5zdG9jaylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdEJvZHk6IFwiLCByZXF1ZXN0Qm9keSk7XG4gICAgICAgICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vcHJvZHVjdHNgLFxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3RCb2R5XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgcHJvZHVjdCByZXNwb25zZTogXCIsICByZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxhZ2VyLnJlc2V0Q3VycmVudEZvcm0oKTtcblxuICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KFwiL2luZGVsaXZlcnlcIik7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVzZXRDdXJyZW50Rm9ybTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxhZ2VyLmN1cnJlbnRGb3JtID0ge307XG4gICAgfVxufTtcblxuZXhwb3J0IHsgbGFnZXIgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBvcmRlcnMuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuL3Byb2R1Y3RzLmpzXCI7XG4vLyBpbXBvcnQgeyBwaWNrTGlzdHMgfSBmcm9tIFwiLi4vdmlld3MvcGljay1saXN0cy5qc1wiO1xuXG5sZXQgb3JkZXJzID0ge1xuICAgIGFsbE9yZGVyczogW10sXG4gICAgY3VycmVudE9yZGVyOiAnJyxcbiAgICBjdXJyZW50OiB7IG9yZGVyOiAnJ30sXG5cbiAgICBnZXRBbGxPcmRlcnM6IGFzeW5jIGZ1bmN0aW9uKG5vQ2FjaGUgPSBmYWxzZSkge1xuICAgICAgICBpZiAobm9DYWNoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub0NhY2hlXCIsIG5vQ2FjaGUpO1xuICAgICAgICAgICAgcHJvZHVjdHMuYWxsUHJvZHVjdHMgPSBbXTtcbiAgICAgICAgICAgIG9yZGVycy5hbGxPcmRlcnMgPSBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChvcmRlcnMuYWxsT3JkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcmRlcnMuYWxsT3JkZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vb3JkZXJzP2FwaV9rZXk9JHthdXRoLmFwaUtleX1gXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBvcmRlcnMuYWxsT3JkZXJzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGVycy5hbGxPcmRlcnM6IFwiLCBvcmRlcnMuYWxsT3JkZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldE9yZGVyOiBhc3luYyBmdW5jdGlvbihvcmRlcklkKSB7XG4gICAgICAgIGlmIChvcmRlcnMuYWxsT3JkZXJzID09PSBbXSkge1xuICAgICAgICAgICAgYXdhaXQgb3JkZXJzLmdldEFsbE9yZGVycyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBvcmRlcnMuY3VycmVudE9yZGVyID0gb3JkZXJzLmFsbE9yZGVycy5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmRlci5pZCA9PSBvcmRlcklkO1xuICAgICAgICB9KVswXTtcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRPcmRlcjogb3JkZXJzLmN1cnJlbnRPcmRlclwiLCBvcmRlcnMuY3VycmVudE9yZGVyKTtcbiAgICAgICAgcmV0dXJuIG9yZGVycy5jdXJyZW50T3JkZXI7XG4gICAgfSxcblxuICAgIHVwZGF0ZU9yZGVyOiBhc3luYyBmdW5jdGlvbihvcmRlcklkLCBueVN0YXR1c0lkKSB7XG4gICAgICAgIGxldCBvcmRlciA9IHtcbiAgICAgICAgICAgIGlkOiBvcmRlcklkLFxuICAgICAgICAgICAgc3RhdHVzX2lkOiBueVN0YXR1c0lkLFxuICAgICAgICAgICAgYXBpX2tleTogYXV0aC5hcGlLZXlcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm9yZGVyOlwiLCBvcmRlcik7XG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgLy8gYm9keTogSlNPTi5zdHJpbmdpZnkob3JkZXIpLFxuICAgICAgICAgICAgYm9keTogb3JkZXIsXG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L29yZGVyc2BcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICBsZXQgZnVsbE9yZGVyID0gb3JkZXJzLmdldE9yZGVyKG9yZGVySWQpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZ1bGxPcmRlclwiLCBmdWxsT3JkZXIpO1xuXG4gICAgICAgICAgICBmdWxsT3JkZXIub3JkZXJfaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1N0b2NrID0gaXRlbS5zdG9jayAtIGl0ZW0uYW1vdW50O1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0RGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0ucHJvZHVjdF9pZCxcbiAgICAgICAgICAgICAgICAgICAgc3RvY2s6IG5ld1N0b2NrLFxuICAgICAgICAgICAgICAgICAgICBhcGlfa2V5OiBhdXRoLmFwaUtleVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb2R1Y3REZXRhaWxzOlwiLCBwcm9kdWN0RGV0YWlscyk7XG5cbiAgICAgICAgICAgICAgICBwcm9kdWN0cy51cGRhdGVQcm9kdWN0KHByb2R1Y3REZXRhaWxzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb3JkZXJzLmdldEFsbE9yZGVycyh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgb3JkZXJzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gcHJvZHVjdHMuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCI7XG5cbmxldCBwcm9kdWN0cyA9IHtcbiAgICBhbGxQcm9kdWN0czogW10sXG5cbiAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24obm9DYWNoZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChub0NhY2hlKSB7XG4gICAgICAgICAgICBwcm9kdWN0cy5hbGxQcm9kdWN0cyA9IFtdO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2R1Y3RzLmFsbFByb2R1Y3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmV0dXJuOiBnZXRBbGxQcm9kdWN0c1wiKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0cy5hbGxQcm9kdWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgJHthdXRoLmJhc2VVcmx9L3Byb2R1Y3RzP2FwaV9rZXk9JHthdXRoLmFwaUtleX1gXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBwcm9kdWN0cy5hbGxQcm9kdWN0cyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9kdWN0cy5hbGxQcm9kdWN0czogXCIsIHByb2R1Y3RzLmFsbFByb2R1Y3RzKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3RJZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInByb2R1Y3RJZDpcIiwgcHJvZHVjdElkKTtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmFsbFByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvZHVjdC5pZCA9PSBwcm9kdWN0SWQ7XG4gICAgICAgIH0pWzBdO1xuICAgIH0sXG5cbiAgICBhcmVQcm9kdWN0c09uU3RvY2s6IGZ1bmN0aW9uKG9yZGVySXRlbXMpIHtcbiAgICAgICAgaWYgKHByb2R1Y3RzLmFsbFByb2R1Y3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmdldEFsbFByb2R1Y3RzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWxsQXZhaWxhYmxlID0gdHJ1ZTtcblxuICAgICAgICBvcmRlckl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKG9yZGVySXRlbSkge1xuICAgICAgICAgICAgaWYgKG9yZGVySXRlbS5hbW91bnQgPiBvcmRlckl0ZW0uc3RvY2spIHtcbiAgICAgICAgICAgICAgICBhbGxBdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW0gbm90IGF2YWlsYWJsZTogXCIsIG9yZGVySXRlbS5wcm9kdWN0X2lkLCBvcmRlckl0ZW0uc3RvY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlckl0ZW0ucHJvZHVjdF9pZCwgb3JkZXJJdGVtLmFtb3VudCwgb3JkZXJJdGVtLnN0b2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFsbEF2YWlsYWJsZTtcbiAgICB9LFxuXG4gICAgYXJlUHJvZHVjdHNPblN0b2NrQ2FsbGJhY2s6IGZ1bmN0aW9uKG9yZGVySXRlbXMpIHtcbiAgICAgICAgbGV0IGFsbEF2YWlsYWJsZSA9IHRydWU7XG5cbiAgICAgICAgb3JkZXJJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChvcmRlckl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChvcmRlckl0ZW0uYW1vdW50ID4gb3JkZXJJdGVtLnN0b2NrKSB7XG4gICAgICAgICAgICAgICAgYWxsQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJdGVtIG5vdCBhdmFpbGFibGU6IFwiLCBvcmRlckl0ZW0ucHJvZHVjdF9pZCwgb3JkZXJJdGVtLnN0b2NrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cob3JkZXJJdGVtLnByb2R1Y3RfaWQsIG9yZGVySXRlbS5hbW91bnQsIG9yZGVySXRlbS5zdG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhbGxBdmFpbGFibGU7XG4gICAgfSxcblxuICAgIHVwZGF0ZVByb2R1Y3Q6IGZ1bmN0aW9uKHByb2R1Y3REZXRhaWxzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlUHJvZHVjdC5wcm9kdWN0RGV0YWlsczpcIiwgcHJvZHVjdERldGFpbHMpO1xuXG4gICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICB1cmw6IGAke2F1dGguYmFzZVVybH0vcHJvZHVjdHNgLFxuICAgICAgICAgICAgYm9keTogcHJvZHVjdERldGFpbHNcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGUgcHJvZHVjdCByZXNwb25zZTogXCIsICByZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IHByb2R1Y3RzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5jb25zdCBhcGlLZXkgPSBcIjBiZjE5MjJjZThhMzE4YWRkYjM0MGQ2NTAzNmI0YTVlXCI7XG5jb25zdCBiYXNlVXJsID0gXCJodHRwczovL2xhZ2VyLmVtaWxmb2xpbm8uc2UvdjJcIjtcbi8qXG5jb25zdCB0b2tlbiA9IFwiXCI7XG4qL1xuXG4vLyBleHBvcnQgeyBiYXNlVXJsLCBhcGlLZXksIHRva2VuIH07XG5leHBvcnQgeyBiYXNlVXJsLCBhcGlLZXkgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9ob21lLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBvcmRlcnMgfSBmcm9tIFwiLi4vbW9kZWxzL29yZGVycy5qc1wiO1xuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tIFwiLi4vbW9kZWxzL3Byb2R1Y3RzLmpzXCI7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4uL21vZGVscy9hdXRoLmpzXCI7XG5cbmxldCBtYWluID0ge1xuICAgIG9uaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIG9yZGVycy5nZXRBbGxPcmRlcnMoKTtcbiAgICAgICAgcHJvZHVjdHMuZ2V0QWxsUHJvZHVjdHMoKTtcbiAgICAgICAgYXV0aC5jaGVja1Rva2VuVmFsaWRpdHkoKTtcbiAgICAgICAgb3JkZXJzLmN1cnJlbnRPcmRlciA9IG9yZGVycy5hbGxPcmRlcnMuZmlsdGVyKG9yZGVyID0+IG9yZGVyLnN0YXR1c19pZCA8IDYwMClbMF07XG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGdyZWV0aW5nID0gXCJEZXQgaMOkciDDpHIgZW4gU1BBIGbDtnIga3Vyc2VuIFdlYmFwcFwiO1xuICAgICAgICBsZXQgaW1hZ2UgPSB7XG4gICAgICAgICAgICBzcmM6IFwiaW1nL0FJLWhlYWQyLmpwZ1wiLFxuICAgICAgICAgICAgYWx0OiBcIkFJIGhlYWRcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIkxhZ2VyYXBwXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJwXCIsIGdyZWV0aW5nKSxcbiAgICAgICAgICAgICAgICBtKFwiaW1nXCIsIGltYWdlLCBncmVldGluZylcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIkxhZ2VyYXBwXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJwXCIsIGdyZWV0aW5nKSxcbiAgICAgICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgICAgICBcImEuYnV0dG9uLmJsdWUtYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogXCIjIS9sb2dpblwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiTG9nZ2EgaW5cIlxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJhLmJ1dHRvbi5ncmVlbi1idXR0b24uZnVsbC13aWR0aC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgeyBocmVmOiBcIiMhL3JlZ2lzdGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJSZWdpc3RyZXJhXCJcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIG0oXCJpbWdcIiwgaW1hZ2UsIGdyZWV0aW5nKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmxldCBob21lID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGhvbWUgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9pbmRlbGl2ZXJ5LmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgbGFnZXIgfSBmcm9tIFwiLi4vbW9kZWxzL2xhZ2VyLmpzXCI7XG5cbmNvbnN0IGluZGVsaXZlcnlDb21wb25lbnQgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSB2bm9kZS5hdHRycztcblxuICAgICAgICByZXR1cm4gbShcImRpdi5jYXJkXCIsIFtcbiAgICAgICAgICAgIG0oXCJwLmNhcmQtdGl0bGVcIiwgY3VycmVudC5wcm9kdWN0X25hbWUpLFxuICAgICAgICAgICAgbShcImRsLnByb2R1Y3QtaW5mb1wiLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbShcImR0XCIsIFwiUHJvZHVrdFwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIGN1cnJlbnQucHJvZHVjdF9pZCksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkFudGFsXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZGRcIiwgY3VycmVudC5hbW91bnQpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJMZXZlcmFuc2RhdHVtXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZGRcIiwgY3VycmVudC5kZWxpdmVyeV9kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImR0XCIsIFwiS29tbWVudGFyXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZGRcIiwgY3VycmVudC5jb21tZW50KVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICksXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5cbmxldCBtYWluID0ge1xuICAgIG9uaW5pdDogbGFnZXIubG9hZEFsbERlbGl2ZXJpZXMsXG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChsYWdlci5jdXJyZW50LmRlbGl2ZXJpZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgXCJJbmxldmVyYW5zZXJcIiksXG4gICAgICAgICAgICAgICAgbShcInBcIiwgXCJJbmdhIGlubGV2ZXJhbnNlciBmaW5ucyByZWdpc3RyZXJhZGUhXCIpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgXCJJbmxldmVyYW5zZXJcIiksXG4gICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgIFwiYS5idXR0b24uYmx1ZS1idXR0b24uZnVsbC13aWR0aC1idXR0b25cIixcbiAgICAgICAgICAgICAgICB7IGhyZWY6IFwiIyEvbmV3LWluZGVsaXZlcnlcIiB9LFxuICAgICAgICAgICAgICAgIFwiTnkgaW5sZXZlcmFuc1wiXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbShcImRpdi5kZWxpdmVyeS1jb250YWluZXJcIiwgbGFnZXIuY3VycmVudC5kZWxpdmVyaWVzLm1hcChmdW5jdGlvbihkZWxpdmVyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKGluZGVsaXZlcnlDb21wb25lbnQsIGRlbGl2ZXJ5KTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICBdO1xuICAgIH1cbn07XG5cbmxldCBpbmRlbGl2ZXJ5ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGluZGVsaXZlcnkgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9pbnZlbnRvcnkuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSBcIi4uL21vZGVscy9wcm9kdWN0cy5qc1wiO1xuXG5jb25zdCBpbnZlbnRvcnlDb21wb25lbnQgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IHByb2R1Y3QgPSB2bm9kZS5hdHRycztcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2bm9kZS5hdHRyczpcIiwgdm5vZGUuYXR0cnMpO1xuXG4gICAgICAgIHJldHVybiBtKFwiZGl2LmZsZXgtcm93XCIsIHtcbiAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlldzpwcm9kdWN0LWRldGFpbHMvOmlkXCIsIHByb2R1Y3QuaWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChgL3Byb2R1Y3QtZGV0YWlscy8ke3Byb2R1Y3QuaWR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIFtcbiAgICAgICAgICAgIG0oXCJkaXYuZmxleC1pdGVtLmxlZnRcIiwgcHJvZHVjdC5uYW1lKSxcbiAgICAgICAgICAgIG0oXCJkaXYuZmxleC1pdGVtLnJpZ2h0XCIsIHByb2R1Y3Quc3RvY2spLFxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG5sZXQgbWFpbiA9IHtcbiAgICBvbmluaXQ6IHByb2R1Y3RzLmdldEFsbFByb2R1Y3RzLFxuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiTGFnZXJzYWxkb1wiKSxcbiAgICAgICAgICAgIG0oXCJkaXYuaW52LWNvbnRhaW5lclwiLCBwcm9kdWN0cy5hbGxQcm9kdWN0cy5tYXAocHJvZHVjdCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpbnZlbnRvcnkudmlldzpwcm9kdWN0XCIsIHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtKGludmVudG9yeUNvbXBvbmVudCwgcHJvZHVjdCk7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgaW52ZW50b3J5ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGludmVudG9yeSB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGpzL3ZpZXdzL2ludm9pY2UuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgeyBvcmRlcnMgfSBmcm9tIFwiLi4vbW9kZWxzL29yZGVycy5qc1wiO1xuXG5jb25zdCBvcmRlclJvdyA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBsZXQgcHJvZHVjdCA9IHZub2RlLmF0dHJzO1xuXG4gICAgICAgIHJldHVybiBtKFwidHJcIiwgW1xuICAgICAgICAgICAgbShcInRkXCIsIHByb2R1Y3QubmFtZSksXG4gICAgICAgICAgICBtKFwidGQucmlnaHRcIiwgcHJvZHVjdC5hbW91bnQpLFxuICAgICAgICAgICAgbShcInRkLnJpZ2h0XCIsIHByb2R1Y3QucHJpY2UpLFxuICAgICAgICAgICAgbShcInRkLnJpZ2h0XCIsICtwcm9kdWN0LmFtb3VudCAqICtwcm9kdWN0LnByaWNlKVxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG5sZXQgbWFpbiA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBsZXQgb3JkZXIgPSB2bm9kZS5hdHRycztcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgyXCIsIFwiRmFrdHVyYWluZm9cIiksXG4gICAgICAgICAgICBtKFwicC5pbmZvLXJvd1wiLCBvcmRlci5uYW1lKSxcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLmFkZHJlc3MpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIuemlwID8gb3JkZXIuemlwIDogJycgKyAnICcgKyBvcmRlci5jaXR5ID8gb3JkZXIuY2l0eSA6ICcnKSxcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLmNvdW50cnkpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIuYWRyZXNzKSxcbiAgICAgICAgICAgIG0oXCJ0YWJsZS50YWJsZS50YWJsZS1zY3JvbGwudGFibGUtc3RyaXBlZFwiLCBbXG4gICAgICAgICAgICAgICAgbShcInRyXCIsIFtcbiAgICAgICAgICAgICAgICAgICAgbShcInRoXCIsIFwiUHJvZHVjdFwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcInRoXCIsIFwiQW50YWxcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIlByaXNcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIlRvdGFsXCIpXG4gICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgb3JkZXIub3JkZXJfaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0ob3JkZXJSb3csIGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdKVxuICAgICAgICBdO1xuICAgIH1cbn07XG5cbmxldCBpbnZvaWNlID0ge1xuICAgIG9uaW5pdDogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgb3JkZXJzLmdldE9yZGVyKHZub2RlLmF0dHJzLmlkKTtcbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW52b2ljZS52aWV3OiB2bm9kZS5hdHRyc1wiLCB2bm9kZS5hdHRycyk7XG4gICAgICAgIHJldHVybiBtKFwibWFpbi5jb250YWluZXJcIiwgbShtYWluLCBvcmRlcnMuY3VycmVudE9yZGVyKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgaW52b2ljZSB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGpzL3ZpZXdzL2ludm9pY2VzLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBpbnZvaWNlc01vZGVsIH0gZnJvbSBcIi4uL21vZGVscy9pbnZvaWNlcy5qc1wiO1xuXG5jb25zdCBpbnZvaWNlc1JvdyA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBsZXQgaW52b2ljZSA9IHZub2RlLmF0dHJzO1xuXG4gICAgICAgIHJldHVybiBtKFwidHIudHItbGlua1wiLCB7XG4gICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbnZvaWNlKTtcbiAgICAgICAgICAgICAgICBtLnJvdXRlLnNldChgL2ludm9pY2UvJHtpbnZvaWNlLm9yZGVyX2lkfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBbXG4gICAgICAgICAgICBtKFwidGRcIiwgaW52b2ljZS5uYW1lKSxcbiAgICAgICAgICAgIG0oXCJ0ZC5yaWdodFwiLCBpbnZvaWNlLnRvdGFsX3ByaWNlKVxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG5sZXQgbWFpbiA9IHtcbiAgICBvbmluaXQ6IGludm9pY2VzTW9kZWwuZ2V0QWxsSW52b2ljZXMsXG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpbnZvaWNlc01vZGVsLmludm9pY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgXCJGYWt0dXJvclwiKSxcbiAgICAgICAgICAgICAgICBtKFwicFwiLCBcIkluZ2EgZmFrdHVyb3IgZmlubnMgcmVnaXN0cmVyYWRlIVwiKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiRmFrdHVyb3JcIiksXG4gICAgICAgICAgICBtKFwidGFibGUudGFibGUudGFibGUtc2Nyb2xsLnRhYmxlLXN0cmlwZWRcIiwgW1xuICAgICAgICAgICAgICAgIG0oXCJ0clwiLCBbXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIkt1bmRcIiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0aFwiLCBcIlN1bW1hXCIpXG4gICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgaW52b2ljZXNNb2RlbC5pbnZvaWNlcy5tYXAoZnVuY3Rpb24oaW52b2ljZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShpbnZvaWNlc1JvdywgaW52b2ljZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICBcImEuYnV0dG9uLmdyZWVuLWJ1dHRvbi5mdWxsLXdpZHRoLWJ1dHRvbi5zcGFjZVwiLFxuICAgICAgICAgICAgICAgIHsgaHJlZjogXCIjIS9uZXctaW52b2ljZVwiIH0sXG4gICAgICAgICAgICAgICAgXCJTa2FwYSBlbiBmYWt0dXJhXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgaW52b2ljZXMgPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtKFwibWFpbi5jb250YWluZXJcIiwgbShtYWluKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgaW52b2ljZXMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cbi8vIGpzL3ZpZXdzL2xheW91dC5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4uL21vZGVscy9hdXRoLmpzXCI7XG5cbmxldCBsYXlvdXQgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IG5hdkVsZW1lbnRzID0gW1xuICAgICAgICAgICAge25hbWU6IFwiSG9tZVwiLCBjbGFzczogXCJob21lXCIsIGxpbms6IFwiaG9tZVwiLCBuYXY6IFwiIyEvXCJ9XG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgICAgIG5hdkVsZW1lbnRzLnB1c2goe25hbWU6IFwiSW5sZXZlcmFuc1wiLCBjbGFzczogXCJsb2NhbF9zaGlwcGluZ1wiLFxuICAgICAgICAgICAgICAgIGxpbms6IFwiaW5kZWxpdmVyeVwiLCBuYXY6IFwiIyEvaW5kZWxpdmVyeVwifSk7XG4gICAgICAgICAgICBuYXZFbGVtZW50cy5wdXNoKHtuYW1lOiBcIkxhZ2Vyc2FsZG9cIiwgY2xhc3M6IFwiaW52ZW50b3J5XCIsXG4gICAgICAgICAgICAgICAgbGluazogXCJpbnZlbnRvcnlcIiwgbmF2OiBcIiMhL2ludmVudG9yeVwifSk7XG4gICAgICAgICAgICBuYXZFbGVtZW50cy5wdXNoKHtuYW1lOiBcIlBsb2NrbGlzdGFcIiwgY2xhc3M6IFwiY2hlY2tsaXN0XCIsXG4gICAgICAgICAgICAgICAgbGluazogXCJwaWNrLWxpc3RzXCIsIG5hdjogXCIjIS9waWNrLWxpc3RzXCJ9KTtcbiAgICAgICAgICAgIG5hdkVsZW1lbnRzLnB1c2goe25hbWU6IFwiRmFrdHVyYVwiLCBjbGFzczogXCJyZWNlaXB0XCIsXG4gICAgICAgICAgICAgICAgbGluazogXCJpbnZvaWNlc1wiLCBuYXY6IFwiIyEvaW52b2ljZXNcIn0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm91dGU6IFwiLCBtLnJvdXRlLmdldCgpLnNwbGl0KFwiL1wiKSk7XG4gICAgICAgIGxldCBzZWxlY3RlZCA9IG0ucm91dGUuZ2V0KCkuc3BsaXQoXCIvXCIpWzFdIHx8IFwiaG9tZVwiO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWQ6XCIsIHNlbGVjdGVkKTtcblxuICAgICAgICBuYXZFbGVtZW50cyA9IG5hdkVsZW1lbnRzLm1hcChlbGVtZW50ID0+IGdlbmVyYXRlQm90dG9tTmF2RWxlbWVudChlbGVtZW50LCBzZWxlY3RlZCkpO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAvLyBtKFwibWFpbi5jb250YWluZXJcIiwgdm5vZGUuY2hpbGRyZW4pLFxuICAgICAgICAgICAgbShcImRpdiNyb290XCIsIHZub2RlLmNoaWxkcmVuKSxcbiAgICAgICAgICAgIG0oXCJuYXYuYm90dG9tLW5hdlwiLCBuYXZFbGVtZW50cylcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgZ2VuZXJhdGVCb3R0b21OYXZFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdGVkKSB7XG4gICAgbGV0IGJvdHRvbU5hdkVsZW1lbnRzID0gW107XG4gICAgbGV0IGFjdGl2ZSA9IFwiXCI7XG5cbiAgICBpZiAoc2VsZWN0ZWQgPT09IGVsZW1lbnQubGluaykge1xuICAgICAgICBhY3RpdmUgPSBcIi5hY3RpdmVcIjtcbiAgICB9XG5cbiAgICBsZXQgbmF2RWxlbWVudEFuZENsYXNzID0gXCJhXCIgKyBhY3RpdmU7XG5cbiAgICBib3R0b21OYXZFbGVtZW50cy5wdXNoKFxuICAgICAgICBtKFxuICAgICAgICAgICAgbmF2RWxlbWVudEFuZENsYXNzLFxuICAgICAgICAgICAgeyBocmVmOiBlbGVtZW50Lm5hdiB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIG0oXG4gICAgICAgICAgICAgICAgICAgIFwiaS5tYXRlcmlhbC1pY29uc1wiLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgICAgICBcInNwYW4uaWNvbi10ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubmFtZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF1cbiAgICAgICAgKVxuICAgICk7XG5cbiAgICByZXR1cm4gYm90dG9tTmF2RWxlbWVudHM7XG59O1xuXG5leHBvcnQgeyBsYXlvdXQgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9sb2dpbi5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcbmltcG9ydCB7IGF1dGggfSBmcm9tICcuLi9tb2RlbHMvYXV0aC5qcyc7XG5cbmxldCBtYWluID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiTG9nZ2EgaW5cIiksXG4gICAgICAgICAgICBtKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgb25zdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGF1dGgubG9naW4oKTtcbiAgICAgICAgICAgICAgICB9fSwgW1xuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIkUtcG9zdGFkcmVzc1wiKSxcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXQuaW5wdXRbdHlwZT1lbWFpbF1bcGxhY2Vob2xkZXI9RS1wb3N0YWRyZXNzXVtyZXF1aXJlZD1yZXF1aXJlZF1cIiwge1xuICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGguZW1haWwgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdXRoLmVtYWlsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsLmlucHV0LWxhYmVsXCIsIFwiTMO2c2Vub3JkXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJpbnB1dC5pbnB1dFt0eXBlPXBhc3N3b3JkXVtwbGFjZWhvbGRlcj1Mw7ZzZW5vcmRdW3JlcXVpcmVkPXJlcXVpcmVkXVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uaW5wdXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aC5wYXNzd29yZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGF1dGgucGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgICAgICBcImlucHV0LmJ1dHRvbi5ncmVlbi1idXR0b24uZnVsbC13aWR0aC1idXR0b25bdHlwZT1zdWJtaXRdW3ZhbHVlPUxvZ2luXVwiLFxuICAgICAgICAgICAgICAgICAgICBcIkxvZ2dhIGluXCJcbiAgICAgICAgICAgICAgICApXVxuICAgICAgICAgICAgKV07XG4gICAgfVxufTtcblxubGV0IGxvZ2luID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGxvZ2luIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvbmV3LWluZGVsaXZlcnkuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgeyBsYWdlciB9IGZyb20gXCIuLi9tb2RlbHMvbGFnZXIuanNcIjtcblxubGV0IG1haW4gPSB7XG4gICAgb25pbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGFnZXIucmVzZXRDdXJyZW50Rm9ybSgpO1xuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtKFwiZGl2LmZvcm0tY29udGFpbmVyXCIsIFtcbiAgICAgICAgICAgIG0oXCJoMlwiLCBcIk55IGlubGV2ZXJhbnNcIiksXG4gICAgICAgICAgICBtKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgb25zdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxhZ2VyLmFkZEluZGVsaXZlcnkoKTtcbiAgICAgICAgICAgICAgICB9IH0sIFtcbiAgICAgICAgICAgICAgICBtKFwibGFiZWwuaW5wdXQtbGFiZWxcIiwgXCJQcm9kdWt0XCIpLFxuICAgICAgICAgICAgICAgIG0oXCJzZWxlY3QuaW5wdXRbcmVxdWlyZWQ9cmVxdWlyZWRdXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgb25jaGFuZ2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWdlci5jdXJyZW50Rm9ybS5wcm9kdWN0X2lkID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBsYWdlci5jdXJyZW50LnByb2R1Y3RzLm1hcChmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwib3B0aW9uXCIsIHsgdmFsdWU6IHByb2R1Y3QuaWQgfSwgcHJvZHVjdC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsLmlucHV0LWxhYmVsXCIsIFwiQW50YWxcIiksXG4gICAgICAgICAgICAgICAgbShcImlucHV0LmlucHV0W3R5cGU9bnVtYmVyXVtwbGFjZWhvbGRlcj1BbnRhbF1bcmVxdWlyZWQ9cmVxdWlyZWRdW21pbj0xXVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWdlci5jdXJyZW50Rm9ybS5hbW91bnQgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGxhZ2VyLmN1cnJlbnRGb3JtLmFtb3VudFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIkxldmVyYW5zZGF0dW1cIiksXG4gICAgICAgICAgICAgICAgbShcImlucHV0LmlucHV0W3R5cGU9ZGF0ZV1bcGxhY2Vob2xkZXI9TGV2ZXJhbnNkYXR1bV1bcmVxdWlyZWQ9cmVxdWlyZWRdXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgb25pbnB1dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhZ2VyLmN1cnJlbnRGb3JtLmRlbGl2ZXJ5X2RhdGUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGxhZ2VyLmN1cnJlbnRGb3JtLmRhdGVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWwuaW5wdXQtbGFiZWxcIiwgXCJLb21tZW50YXJcIiksXG4gICAgICAgICAgICAgICAgbShcInRleHRhcmVhLmlucHV0W2NvbHM9Ml1bcGxhY2Vob2xkZXI9S29tbWVudGFyXVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWdlci5jdXJyZW50Rm9ybS5jb21tZW50ID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBsYWdlci5jdXJyZW50Rm9ybS5jb21tZW50XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICAgICAgXCJpbnB1dC5idXR0b24uZ3JlZW4tYnV0dG9uLmZ1bGwtd2lkdGgtYnV0dG9uW3R5cGU9c3VibWl0XVt2YWx1ZT1TYXZlXVwiLFxuICAgICAgICAgICAgICAgICAgICBcIkfDtnIgaW5sZXZlcmFuc1wiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxubGV0IG5ld0luZGVsaXZlcnkgPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtKFwibWFpbi5jb250YWluZXJcIiwgbShtYWluKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgbmV3SW5kZWxpdmVyeSB9O1xuIiwiLyoganNoaW50IGVzdmVyc2lvbjogOCAqL1xuLyoganNoaW50IG5vZGU6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGpzL3ZpZXdzL25ldy1pbnZvaWNlLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4uL21vZGVscy9vcmRlcnMuanNcIjtcbmltcG9ydCB7IGludm9pY2VzTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxzL2ludm9pY2VzLmpzXCI7XG5cbmNvbnN0IG9yZGVyUm93ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGxldCBwcm9kdWN0ID0gdm5vZGUuYXR0cnM7XG5cbiAgICAgICAgcmV0dXJuIG0oXCJ0clwiLCBbXG4gICAgICAgICAgICBtKFwidGRcIiwgcHJvZHVjdC5uYW1lKSxcbiAgICAgICAgICAgIG0oXCJ0ZC5yaWdodFwiLCBwcm9kdWN0LmFtb3VudCksXG4gICAgICAgICAgICBtKFwidGQucmlnaHRcIiwgcHJvZHVjdC5wcmljZSksXG4gICAgICAgICAgICBtKFwidGQucmlnaHRcIiwgK3Byb2R1Y3QuYW1vdW50ICogK3Byb2R1Y3QucHJpY2UpXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5cbmxldCBzaG93T3JkZXIgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgbGV0IG9yZGVyID0gdm5vZGUuYXR0cnM7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2hvd09yZGVyOiBvcmRlcnMuY2N1cnJlbnRPcmRlclwiLCBvcmRlcik7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJwLmluZm8tcm93XCIsIG9yZGVyLm5hbWUpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIuYWRkcmVzcyksXG4gICAgICAgICAgICBtKFwicC5pbmZvLXJvd1wiLCBvcmRlci56aXAgPyBvcmRlci56aXAgOiAnJyArICcgJyArIG9yZGVyLmNpdHkgPyBvcmRlci5jaXR5IDogJycpLFxuICAgICAgICAgICAgbShcInAuaW5mby1yb3dcIiwgb3JkZXIuY291bnRyeSksXG4gICAgICAgICAgICBtKFwicC5pbmZvLXJvd1wiLCBvcmRlci5hZHJlc3MpLFxuICAgICAgICAgICAgbShcInRhYmxlLnRhYmxlLnRhYmxlLXNjcm9sbC50YWJsZS1zdHJpcGVkXCIsIFtcbiAgICAgICAgICAgICAgICBtKFwidHJcIiwgW1xuICAgICAgICAgICAgICAgICAgICBtKFwidGhcIiwgXCJQcm9kdWN0XCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwidGhcIiwgXCJBbnRhbFwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcInRoXCIsIFwiUHJpc1wiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcInRoXCIsIFwiVG90YWxcIilcbiAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgICBvcmRlci5vcmRlcl9pdGVtcy5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShvcmRlclJvdywgaXRlbSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbShcbiAgICAgICAgICAgICAgICBcImlucHV0LmJ1dHRvbi5ncmVlbi1idXR0b24uZnVsbC13aWR0aC1idXR0b25bdHlwZT1zdWJtaXRdW3ZhbHVlPSdTa2FwYSBmYWt0dXJhbiddXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgbWFpbiA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IG9yZGVyID0gb3JkZXJzLmN1cnJlbnRPcmRlcjtcblxuICAgICAgICByZXR1cm4gbShcImRpdi5mb3JtLWNvbnRhaW5lclwiLCBbXG4gICAgICAgICAgICBtKFwiaDJcIiwgXCJOeSBmYWt0dXJhXCIpLFxuICAgICAgICAgICAgbShcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIG9uc3VibWl0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpbnZvaWNlc01vZGVsLnNhdmVJbnZvaWNlKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbS5yb3V0ZS5zZXQoXCIvaW52b2ljZXNcIik7XG4gICAgICAgICAgICAgICAgfSB9LCBbXG4gICAgICAgICAgICAgICAgbShcImxhYmVsLmlucHV0LWxhYmVsXCIsIFwiT3JkZXJcIiksXG4gICAgICAgICAgICAgICAgbShcInNlbGVjdC5pbnB1dFtyZXF1aXJlZD1yZXF1aXJlZF1cIiwge1xuICAgICAgICAgICAgICAgICAgICBvbmNoYW5nZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyID0gb3JkZXJzLmdldE9yZGVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFpblwiLCBvcmRlcnMuY3VycmVudE9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIG9yZGVycy5hbGxPcmRlcnMuZmlsdGVyKG9yZGVyID0+IG9yZGVyLnN0YXR1c19pZCA8IDYwMClcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihvcmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJvcHRpb25cIiwgeyB2YWx1ZTogb3JkZXIuaWQgfSwgb3JkZXIubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBtKFwiZGl2I2ludm9pY2UtY29udGFpbmVyXCIsIG0oc2hvd09yZGVyLCBvcmRlcikpXG4gICAgICAgICAgICBdKVxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG5sZXQgbmV3SW52b2ljZSA9IHtcbiAgICBvbmluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAob3JkZXJzLmN1cnJlbnRPcmRlciAhPT0gJycpIHtcbiAgICAgICAgICAgIG9yZGVycy5jdXJyZW50T3JkZXIgPSBvcmRlcnMuYWxsT3JkZXJzLmZpbHRlcihvcmRlciA9PiBvcmRlci5zdGF0dXNfaWQgPCA2MDApWzBdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJtYWluLmNvbnRhaW5lclwiLCBtKG1haW4pKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBuZXdJbnZvaWNlIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gb3JkZXItZGV0YWlscy5qc1xuXG5pbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuLy8gaW1wb3J0IHsgcGlja0xpc3RzIH0gZnJvbSBcIi4vcGljay1saXN0cy5qc1wiO1xuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tIFwiLi4vbW9kZWxzL3Byb2R1Y3RzLmpzXCI7XG5pbXBvcnQgeyBvcmRlcnMgfSBmcm9tIFwiLi4vbW9kZWxzL29yZGVycy5qc1wiO1xuXG5sZXQgb3JkZXJJdGVtcyA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICBsZXQgb3JkZXIgPSB2bm9kZS5hdHRycztcblxuICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGVySXRlbXMtPm9yZGVyLm9yZGVyX2l0ZW1zOlwiLCBvcmRlci5vcmRlcl9pdGVtcyk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtKFwiaDEudGl0bGVcIiwgb3JkZXIubmFtZSksXG4gICAgICAgICAgICBtKFwiZGwucHJvZHVjdC1pbmZvXCIsIG9yZGVyLm9yZGVyX2l0ZW1zLm1hcChmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgbShcImR0XCIsIFwiUHJvZHVjdFwiKSxcbiAgICAgICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QucHJvZHVjdF9pZCksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkh5bGxhXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZGRcIiwgcHJvZHVjdC5sb2NhdGlvbiksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIkJlc2tyaXZuaW5nXCIpLFxuICAgICAgICAgICAgICAgICAgICBtKFwiZGRcIiwgcHJvZHVjdC5kZXNjcmlwdGlvbilcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIF07XG4gICAgfVxufTtcblxubGV0IG1haW4gPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBvcmRlciA9IG9yZGVycy5jdXJyZW50T3JkZXI7XG5cbiAgICAgICAgbGV0IGluZGVsaXZlcnlQb3NzaWJsZSA9IHByb2R1Y3RzLmFyZVByb2R1Y3RzT25TdG9jayhvcmRlci5vcmRlcl9pdGVtcyk7XG5cbiAgICAgICAgaWYgKGluZGVsaXZlcnlQb3NzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtKG9yZGVySXRlbXMsIG9yZGVyKSxcbiAgICAgICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgICAgICBcImEuYnV0dG9uLmdyZWVuLWJ1dHRvbi5mdWxsLXdpZHRoLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcmRlci5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzLnVwZGF0ZU9yZGVyKG9yZGVyLmlkLCAyMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0ucm91dGUuc2V0KCcvcGljay1saXN0cycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcIlPDpHR0IHNvbSBwYWNrYXRcIlxuICAgICAgICAgICAgICAgICldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG0ob3JkZXJJdGVtcywgb3JkZXIpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxubGV0IG9yZGVyRGV0YWlscyA9IHtcbiAgICBvbmluaXQ6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIG9yZGVycy5nZXRPcmRlcih2bm9kZS5hdHRycy5pZCk7XG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbiwgdm5vZGUuYXR0cnMpKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBvcmRlckRldGFpbHMgfTtcbiIsIi8qIGpzaGludCBlc3ZlcnNpb246IDggKi9cbi8qIGpzaGludCBub2RlOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBqcy92aWV3cy9waWNrLWxpc3RzLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBvcmRlcnMgfSBmcm9tIFwiLi4vbW9kZWxzL29yZGVycy5qc1wiO1xuXG5cbmNvbnN0IGdlbmVyYXRlT3JkZXJMaXN0ID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgIGxldCBvcmRlciA9IHZub2RlLmF0dHJzO1xuXG4gICAgICAgIHJldHVybiBtKFwiZGl2LmZsZXgtcm93XCIsIHtcbiAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yZGVyKTtcbiAgICAgICAgICAgICAgICBtLnJvdXRlLnNldChgL29yZGVyLWRldGFpbHMvJHtvcmRlci5pZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgW1xuICAgICAgICAgICAgbShcImRpdi5mbGV4LWl0ZW0ubGVmdFwiLCBvcmRlci5uYW1lKSxcbiAgICAgICAgICAgIG0oXCJkaXYuZmxleC1pdGVtLnJpZ2h0XCIsIG9yZGVyLmlkKSxcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxubGV0IG1haW4gPSB7XG4gICAgb25pbml0OiBvcmRlcnMuZ2V0QWxsT3JkZXJzLFxuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbShcImgxLnRpdGxlXCIsIFwiTnlhIG9yZHJhclwiKSxcbiAgICAgICAgICAgIG0oXCJkaXYuaW52LWNvbnRhaW5lclwiLCAoXG4gICAgICAgICAgICAgICAgb3JkZXJzLmFsbE9yZGVycy5sZW5ndGggPT09IDAgP1xuICAgICAgICAgICAgICAgICAgICBvcmRlcnMuYWxsT3JkZXJzLmZpbHRlcihvcmRlciA9PiBvcmRlci5zdGF0dXNfaWQgPT09IDEwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAob3JkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKGdlbmVyYXRlT3JkZXJMaXN0LCBvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSA6IG0oXCJwXCIsIFwiRmlubnMgaW5nYSBueWEgb3JkcmFyXCIpXG4gICAgICAgICAgICApKVxuICAgICAgICBdO1xuICAgIH1cbn07XG5cbmxldCBwaWNrTGlzdHMgPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtKFwibWFpbi5jb250YWluZXJcIiwgbShtYWluKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBwaWNrTGlzdHNcbn07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gcHJvZHVjdC1kZXRhaWxzLmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBwcm9kdWN0cyB9IGZyb20gXCIuLi9tb2RlbHMvcHJvZHVjdHMuanNcIjtcblxubGV0IG1haW4gPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ2bm9kZTpcIiwgdm5vZGUpO1xuICAgICAgICBsZXQgcHJvZHVjdCA9IHByb2R1Y3RzLmdldFByb2R1Y3Qodm5vZGUuYXR0cnMuaWQpO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtKFwiaDEucHJvZHVjdC1uYW1lXCIsIHByb2R1Y3QubmFtZSksXG4gICAgICAgICAgICBtKFwiZGwucHJvZHVjdC1pbmZvXCIsIFtcbiAgICAgICAgICAgICAgICBtKFwiZHRcIiwgXCJpZFwiKSxcbiAgICAgICAgICAgICAgICBtKFwiZGRcIiwgcHJvZHVjdC5pZCksXG4gICAgICAgICAgICAgICAgbShcImR0XCIsIFwiQXJ0aWtlbG51bW1lclwiKSxcbiAgICAgICAgICAgICAgICBtKFwiZGRcIiwgcHJvZHVjdC5hcnRpY2xlX251bWJlciksXG4gICAgICAgICAgICAgICAgbShcImR0XCIsIFwiQmVza3Jpdm5pbmdcIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QuZGVzY3JpcHRpb24pLFxuICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIlNwZWNpZmlrYXRpb25cIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3Quc3BlY2lmaWVycyksXG4gICAgICAgICAgICAgICAgbShcImR0XCIsIFwiSSBsYWdlclwiKSxcbiAgICAgICAgICAgICAgICBtKFwiZGRcIiwgcHJvZHVjdC5zdG9jayksXG4gICAgICAgICAgICAgICAgbShcImR0XCIsIFwiSHlsbGFcIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QubG9jYXRpb24pLFxuICAgICAgICAgICAgICAgIG0oXCJkdFwiLCBcIlByaXNcIiksXG4gICAgICAgICAgICAgICAgbShcImRkXCIsIHByb2R1Y3QucHJpY2UpLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgXTtcbiAgICB9XG59O1xuXG5sZXQgcHJvZHVjdERldGFpbHMgPSB7XG4gICAgdmlldzogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwcm9kdWN0LWRldGFpbHNcIik7XG4gICAgICAgIHJldHVybiBtKFwibWFpbi5jb250YWluZXJcIiwgbShtYWluLCB2bm9kZS5hdHRycykpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IHByb2R1Y3REZXRhaWxzIH07XG4iLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8ganMvdmlld3MvcmVnaXN0ZXIuanNcblxuaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSAnLi4vbW9kZWxzL2F1dGguanMnO1xuXG5sZXQgbWFpbiA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG0oXCJoMS50aXRsZVwiLCBcIlJlZ2lzdHJlcmluZ1wiKSxcbiAgICAgICAgICAgIG0oXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBvbnN1Ym1pdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYXV0aC5yZWdpc3RlcigpO1xuICAgICAgICAgICAgICAgIH0gfSwgW1xuICAgICAgICAgICAgICAgIG0oXCJsYWJlbC5pbnB1dC1sYWJlbFwiLCBcIkUtcG9zdGFkcmVzc1wiKSxcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXQuaW5wdXRbdHlwZT1lbWFpbF1bcGxhY2Vob2xkZXI9RS1wb3N0YWRyZXNzXVtyZXF1aXJlZD1yZXF1aXJlZF1cIiwge1xuICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGguZW1haWwgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdXRoLmVtYWlsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsLmlucHV0LWxhYmVsXCIsIFwiTMO2c2Vub3JkXCIpLFxuICAgICAgICAgICAgICAgIG0oJ2lucHV0LmlucHV0W3R5cGU9XCJwYXNzd29yZFwiXVtwbGFjZWhvbGRlcj1cIkzDtnNlbm9yZFwiXVtyZXF1aXJlZD1yZXF1aXJlZF0nLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uaW5wdXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aC5wYXNzd29yZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGF1dGgucGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtKFxuICAgICAgICAgICAgICAgICAgICBcImlucHV0LmJ1dHRvbi5ncmVlbi1idXR0b24uZnVsbC13aWR0aC1idXR0b25bdHlwZT1zdWJtaXRdW3ZhbHVlPVJlZ2lzdHJlcmFdXCJcbiAgICAgICAgICAgICAgICApXVxuICAgICAgICAgICAgKV07XG4gICAgfVxufTtcblxubGV0IHJlZ2lzdGVyID0ge1xuICAgIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbShcIm1haW4uY29udGFpbmVyXCIsIG0obWFpbikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IHJlZ2lzdGVyIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBqc2hpbnQgZXN2ZXJzaW9uOiA4ICovXG4vKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGluZGV4LmpzXG5cbmltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgeyBsYXlvdXQgfSBmcm9tIFwiLi92aWV3cy9sYXlvdXQuanNcIjtcbmltcG9ydCB7IGhvbWUgfSBmcm9tIFwiLi92aWV3cy9ob21lLmpzXCI7XG5pbXBvcnQgeyBpbnZlbnRvcnkgfSBmcm9tIFwiLi92aWV3cy9pbnZlbnRvcnkuanNcIjtcbmltcG9ydCB7IHByb2R1Y3REZXRhaWxzIH0gZnJvbSBcIi4vdmlld3MvcHJvZHVjdC1kZXRhaWxzLmpzXCI7XG5pbXBvcnQgeyBwaWNrTGlzdHMgfSBmcm9tIFwiLi92aWV3cy9waWNrLWxpc3RzLmpzXCI7XG5pbXBvcnQgeyBvcmRlckRldGFpbHMgfSBmcm9tIFwiLi92aWV3cy9vcmRlci1kZXRhaWxzLmpzXCI7XG5pbXBvcnQgeyBpbmRlbGl2ZXJ5IH0gZnJvbSBcIi4vdmlld3MvaW5kZWxpdmVyeS5qc1wiO1xuaW1wb3J0IHsgbmV3SW5kZWxpdmVyeSB9IGZyb20gXCIuL3ZpZXdzL25ldy1pbmRlbGl2ZXJ5LmpzXCI7XG5pbXBvcnQgeyBpbnZvaWNlcyB9IGZyb20gXCIuL3ZpZXdzL2ludm9pY2VzLmpzXCI7XG5pbXBvcnQgeyBpbnZvaWNlIH0gZnJvbSBcIi4vdmlld3MvaW52b2ljZS5qc1wiO1xuaW1wb3J0IHsgbmV3SW52b2ljZSB9IGZyb20gXCIuL3ZpZXdzL25ldy1pbnZvaWNlLmpzXCI7XG5pbXBvcnQgeyBsb2dpbiB9IGZyb20gXCIuL3ZpZXdzL2xvZ2luLmpzXCI7XG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gXCIuL3ZpZXdzL3JlZ2lzdGVyLmpzXCI7XG5cbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9tb2RlbHMvYXV0aC5qc1wiO1xuXG4vLyBXYWl0IGZvciB0aGUgZGV2aWNlcmVhZHkgZXZlbnQgYmVmb3JlIHVzaW5nIGFueSBvZiBDb3Jkb3ZhJ3MgZGV2aWNlIEFQSXMuXG4vLyBTZWUgaHR0cHM6Ly9jb3Jkb3ZhLmFwYWNoZS5vcmcvZG9jcy9lbi9sYXRlc3QvY29yZG92YS9ldmVudHMvZXZlbnRzLmh0bWwjZGV2aWNlcmVhZHlcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5Jywgb25EZXZpY2VSZWFkeSwgZmFsc2UpO1xuXG5mdW5jdGlvbiBvbkRldmljZVJlYWR5KCkge1xuICAgIC8vIENvcmRvdmEgaXMgbm93IGluaXRpYWxpemVkLiBIYXZlIGZ1biFcblxuICAgIC8vIGNvbnNvbGUubG9nKCdSdW5uaW5nIGNvcmRvdmEtJyArIGNvcmRvdmEucGxhdGZvcm1JZCArICdAJyArIGNvcmRvdmEudmVyc2lvbik7XG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RldmljZXJlYWR5JykuY2xhc3NMaXN0LmFkZCgncmVhZHknKTtcblxuICAgIG0ucm91dGUoZG9jdW1lbnQuYm9keSwgXCIvXCIsIHtcbiAgICAgICAgXCIvXCI6IHtcbiAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKGhvbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIvaW52ZW50b3J5XCI6IHtcbiAgICAgICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZlbnRvcnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF1dGguY2FsbGJhY2sgPSBcImludmVudG9yeVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShpbnZlbnRvcnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIvcHJvZHVjdC1kZXRhaWxzLzppZFwiOiB7XG4gICAgICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXV0aC50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdERldGFpbHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKHByb2R1Y3REZXRhaWxzLCB2bm9kZS5hdHRycykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIi9waWNrLWxpc3RzXCI6IHtcbiAgICAgICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwaWNrTGlzdHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF1dGguY2FsbGJhY2sgPSBcInBpY2stbGlzdHNcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoXCIvbG9naW5cIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0ocGlja0xpc3RzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiL29yZGVyLWRldGFpbHMvOmlkXCI6IHtcbiAgICAgICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlckRldGFpbHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKHZub2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKG9yZGVyRGV0YWlscywgdm5vZGUuYXR0cnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIvaW5kZWxpdmVyeVwiOiB7XG4gICAgICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXV0aC50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kZWxpdmVyeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV0aC5jYWxsYmFjayA9IFwiaW5kZWxpdmVyeVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBtLnJvdXRlLnNldChcIi9sb2dpblwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShpbmRlbGl2ZXJ5KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiL25ldy1pbmRlbGl2ZXJ5XCI6IHtcbiAgICAgICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdJbmRlbGl2ZXJ5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoXCIvbG9naW5cIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0obmV3SW5kZWxpdmVyeSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIi9pbnZvaWNlc1wiOiB7XG4gICAgICAgICAgICBvbm1hdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXV0aC50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW52b2ljZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF1dGguY2FsbGJhY2sgPSBcImludm9pY2VzXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KFwiL2xvZ2luXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0obGF5b3V0LCBtKGludm9pY2VzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiL2ludm9pY2UvOmlkXCI6IHtcbiAgICAgICAgICAgIG9ubWF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnZvaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdXRoLmNhbGxiYWNrID0gXCJpbnZvaWNlXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KFwiL2xvZ2luXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24odm5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0oaW52b2ljZSwgdm5vZGUuYXR0cnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIvbmV3LWludm9pY2VcIjoge1xuICAgICAgICAgICAgb25tYXRjaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludm9pY2VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbS5yb3V0ZS5zZXQoXCIvbG9naW5cIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShsYXlvdXQsIG0obmV3SW52b2ljZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIi9sb2dpblwiOiB7XG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShsb2dpbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIi9yZWdpc3RlclwiOiB7XG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKGxheW91dCwgbShyZWdpc3RlcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9