(function (root, factory) {
	var api = factory();
	if (typeof module === 'object' && module.exports) module.exports = api;
	root.portalPrefs = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
	'use strict';

	var KEY = 'cclub-prefs';
	var THEMES = ['portal', 'midnight', 'phosphor', 'amber', 'bluescreen', 'vaporwave', 'paper', 'rgb'];
	var SCALES = ['100', '115', '130', '150'];

	function normalize(raw) {
		var p = raw && typeof raw === 'object' ? raw : {};
		return {
			theme: THEMES.indexOf(p.theme) === -1 ? 'portal' : p.theme,
			scale: SCALES.indexOf(String(p.scale)) === -1 ? '100' : String(p.scale),
			motion: p.motion === 'on' || p.motion === 'off' ? p.motion : 'system',
			cb: p.cb === true
		};
	}

	function load(storage) {
		try {
			return normalize(JSON.parse(storage.getItem(KEY) || '{}'));
		} catch (e) {
			return normalize({});
		}
	}

	function save(storage, prefs) {
		try {
			storage.setItem(KEY, JSON.stringify(normalize(prefs)));
		} catch (e) { /* storage blocked */ }
	}

	function attributes(prefs, systemReducesMotion) {
		var p = normalize(prefs);
		var motion = p.motion === 'system' ? (systemReducesMotion ? 'off' : 'on') : p.motion;
		return {
			'data-theme': p.theme === 'portal' ? null : p.theme,
			'data-scale': p.scale === '100' ? null : p.scale,
			'data-motion': motion,
			'data-cb': p.cb ? 'on' : null
		};
	}

	function apply(el, prefs, systemReducesMotion) {
		var attrs = attributes(prefs, systemReducesMotion);
		Object.keys(attrs).forEach(function (name) {
			if (attrs[name] === null) el.removeAttribute(name);
			else el.setAttribute(name, attrs[name]);
		});
		return attrs;
	}

	function motionOff(prefs, systemReducesMotion) {
		return attributes(prefs, systemReducesMotion)['data-motion'] === 'off';
	}

	return {
		KEY: KEY,
		THEMES: THEMES,
		SCALES: SCALES,
		normalize: normalize,
		load: load,
		save: save,
		attributes: attributes,
		apply: apply,
		motionOff: motionOff
	};
});
