(function (root, factory) {
	var api = factory();
	if (typeof module === 'object' && module.exports) module.exports = api;
	root.portalPrefs = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
	'use strict';

	var KEY = 'cclub-prefs';
	var THEMES = ['portal', 'midnight', 'phosphor', 'amber', 'bluescreen', 'vaporwave', 'paper', 'rgb'];
	var SCALES = ['100', '115', '130', '150'];
	var HOLIDAYS = ['halloween', 'thanksgiving', 'december', 'valentines', 'stpatricks'];

	// Thanksgiving is the fourth Thursday of November.
	function thanksgiving(year) {
		var firstDay = new Date(Date.UTC(year, 10, 1)).getUTCDay();
		return 1 + (4 - firstDay + 7) % 7 + 21;
	}

	var DAY = 86400000;
	var LEAD_DAYS = 14;

	// True if the date is on the holiday or in the LEAD_DAYS days before it. Month is 1 to 12.
	function leadsUpTo(date, year, month, day) {
		var holiday = Date.UTC(year, month - 1, day);
		return date >= holiday - LEAD_DAYS * DAY && date <= holiday;
	}

	// Month is 1 to 12. Returns the holiday name or null.
	// Halloween and December last the whole month. The other holidays start LEAD_DAYS days early.
	function holidayFor(year, month, day) {
		var date = Date.UTC(year, month - 1, day);
		if (month === 10) return 'halloween';
		if (month === 12) return 'december';
		if (leadsUpTo(date, year, 11, thanksgiving(year))) return 'thanksgiving';
		if (leadsUpTo(date, year, 2, 14)) return 'valentines';
		if (leadsUpTo(date, year, 3, 17)) return 'stpatricks';
		return null;
	}

	// A ?holiday=name URL previews one holiday. ?holiday=none shows no holiday.
	function pickHoliday(date, search) {
		var m = /[?&]holiday=([a-z]+)/.exec(search || '');
		if (m && m[1] === 'none') return null;
		if (m && HOLIDAYS.indexOf(m[1]) !== -1) return m[1];
		return holidayFor(date.getFullYear(), date.getMonth() + 1, date.getDate());
	}

	function normalize(raw) {
		var p = raw && typeof raw === 'object' ? raw : {};
		return {
			theme: THEMES.indexOf(p.theme) === -1 ? 'portal' : p.theme,
			scale: SCALES.indexOf(String(p.scale)) === -1 ? '100' : String(p.scale),
			motion: p.motion === 'on' || p.motion === 'off' ? p.motion : 'system',
			cb: p.cb === true,
			holiday: p.holiday !== false
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

	// A holiday replaces only the default theme. A theme that the visitor picks always wins.
	function attributes(prefs, systemReducesMotion, holiday) {
		var p = normalize(prefs);
		var motion = p.motion === 'system' ? (systemReducesMotion ? 'off' : 'on') : p.motion;
		var showHoliday = p.holiday && p.theme === 'portal' && HOLIDAYS.indexOf(holiday) !== -1;
		return {
			'data-theme': p.theme === 'portal' ? null : p.theme,
			'data-scale': p.scale === '100' ? null : p.scale,
			'data-motion': motion,
			'data-cb': p.cb ? 'on' : null,
			'data-holiday': showHoliday ? holiday : null
		};
	}

	function apply(el, prefs, systemReducesMotion, holiday) {
		var attrs = attributes(prefs, systemReducesMotion, holiday);
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
		HOLIDAYS: HOLIDAYS,
		thanksgiving: thanksgiving,
		holidayFor: holidayFor,
		pickHoliday: pickHoliday,
		normalize: normalize,
		load: load,
		save: save,
		attributes: attributes,
		apply: apply,
		motionOff: motionOff
	};
});
