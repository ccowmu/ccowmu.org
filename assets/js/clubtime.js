(function (root, factory) {
	var api = factory();
	if (typeof module === 'object' && module.exports) module.exports = api;
	root.clubTimeLib = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
	'use strict';

	var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var MEETING_DAY = 4;
	var MEETING_HOUR = 18;
	var MEETING_END = 21;

	function create(zone) {
		var format = new Intl.DateTimeFormat('en-US', {
			timeZone: zone, hourCycle: 'h23', weekday: 'short', year: 'numeric', month: 'numeric',
			day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short'
		});

		function wall(date) {
			var out = {};
			format.formatToParts(date).forEach(function (part) {
				out[part.type] = part.value;
			});
			return {
				y: +out.year, m: +out.month, d: +out.day, h: +out.hour, mi: +out.minute, s: +out.second,
				wd: DAYS.indexOf(out.weekday), zone: out.timeZoneName
			};
		}

		function offsetMs(date) {
			var w = wall(date);
			return Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s) - Math.floor(date.getTime() / 1000) * 1000;
		}

		function nextMeeting(now) {
			var w = wall(now);
			var delta = (MEETING_DAY - w.wd + 7) % 7;
			if (delta === 0 && w.h >= MEETING_HOUR) delta = 7;
			var wallTarget = Date.UTC(w.y, w.m - 1, w.d + delta, MEETING_HOUR, 0, 0);
			var guess = new Date(wallTarget - offsetMs(now));
			return new Date(wallTarget - offsetMs(guess));
		}

		function meetingNow(now) {
			var w = wall(now);
			return w.wd === MEETING_DAY && w.h >= MEETING_HOUR && w.h < MEETING_END;
		}

		function clock(now) {
			var w = wall(now);
			var pad = function (n) { return String(n).padStart(2, '0'); };
			return pad(w.h) + ':' + pad(w.mi) + ':' + pad(w.s) + ' ' + w.zone;
		}

		return { zone: zone, wall: wall, nextMeeting: nextMeeting, meetingNow: meetingNow, clock: clock };
	}

	return { create: create };
});
