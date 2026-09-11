const test = require('node:test');
const assert = require('node:assert/strict');
const lib = require('../assets/js/clubtime.js');

const ct = lib.create('America/Detroit');
const at = (iso) => new Date(iso);

test('clock shows club wall time with the zone name', () => {
	assert.equal(ct.clock(at('2026-09-10T22:30:05Z')), '18:30:05 EDT');
	assert.equal(ct.clock(at('2026-01-15T23:05:09Z')), '18:05:09 EST');
});

test('countdown targets Thursday 18:00 club time from any zone', () => {
	assert.equal(ct.nextMeeting(at('2026-09-10T12:00:00Z')).toISOString(), '2026-09-10T22:00:00.000Z');
	assert.equal(ct.nextMeeting(at('2026-09-08T03:00:00Z')).toISOString(), '2026-09-10T22:00:00.000Z');
});

test('a Thursday after 18:00 rolls to next week', () => {
	assert.equal(ct.nextMeeting(at('2026-09-10T22:00:00Z')).toISOString(), '2026-09-17T22:00:00.000Z');
	assert.equal(ct.nextMeeting(at('2026-09-11T01:30:00Z')).toISOString(), '2026-09-17T22:00:00.000Z');
});

test('the target keeps 18:00 across the spring DST change', () => {
	assert.equal(ct.nextMeeting(at('2026-03-05T23:30:00Z')).toISOString(), '2026-03-12T22:00:00.000Z');
});

test('the target keeps 18:00 across the autumn DST change', () => {
	assert.equal(ct.nextMeeting(at('2026-10-29T23:30:00Z')).toISOString(), '2026-11-05T23:00:00.000Z');
	assert.equal(ct.nextMeeting(at('2026-11-05T21:00:00Z')).toISOString(), '2026-11-05T23:00:00.000Z');
});

test('meeting window is Thursday 18:00 to 21:00 club time', () => {
	assert.equal(ct.meetingNow(at('2026-09-10T22:30:00Z')), true);
	assert.equal(ct.meetingNow(at('2026-09-11T00:59:00Z')), true);
	assert.equal(ct.meetingNow(at('2026-09-11T01:00:00Z')), false);
	assert.equal(ct.meetingNow(at('2026-09-10T21:59:00Z')), false);
	assert.equal(ct.meetingNow(at('2026-09-09T22:30:00Z')), false);
});

test('another zone gives different wall time for the same instant', () => {
	const tokyo = lib.create('Asia/Tokyo');
	assert.equal(tokyo.wall(at('2026-09-10T22:30:00Z')).h, 7);
	assert.equal(ct.wall(at('2026-09-10T22:30:00Z')).h, 18);
});
