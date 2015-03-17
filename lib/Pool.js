'use strict';
var specMap = {},
	pending = {},
	pendingTimers = {};

var PENDING_TIMEOUT = 3000;

var addSpec = (name, Spec) => specMap[name] = Spec;
var hasSpec = name => specMap[name] !== undefined;

function createRequest(name, resolve, reject) {
	let pendingRequest = {name, resolve, reject};

	if (hasSpec(name)) {
		resolveRequest(pendingRequest);
	} else {
		pending[name] = pending[name] || [];
		pending[name].push(pendingRequest);
		pendingTimers[name] = pendingTimers[name] || setTimeout(()=> {
			var requests = pending[name];
			if (requests) {
				console.warn(`A spec for gremlin ${name} is still missing. Did you include it?`);
			}
		}, PENDING_TIMEOUT);
	}
}

function resolveRequest({name, resolve}) {
	var Spec = specMap[name];
	resolve(Object.create(Spec));
}

function resolveAllPendingFor(name) {
	var requests = pending[name];
	clearTimeout(pendingTimers[name]);
	if (requests !== undefined && hasSpec(name)) {
		requests.forEach(resolveRequest);
		delete pending[name];
	}
}

module.exports = {
	add(Spec) {
		var name = Spec.name;

		if (hasSpec(name)) {
			throw new Error(`Trying to add new Gremlin spec, but a spec for ${name} already exists.`);
		}

		addSpec(name, Spec);
		resolveAllPendingFor(name);
		return Spec; //easy chaining
	},


	fetch(name)
	{
		return new Promise((resolve, reject) => {
			setTimeout(()=>createRequest(name, resolve, reject), 10);
		});
	}
};

