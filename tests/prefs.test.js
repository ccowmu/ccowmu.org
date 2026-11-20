const test = require('node:test');
const assert = require('node:assert/strict');
const prefs = require("../assets/js/prefs.js");

function memoryStorage(initial) {
	const store = new Map(Object.entries(initial || {}));
	return {
		getItem: (k) => (store.has(k) ? store.get(k) : null),
		setItem: (k, v) => store.set(k, String(v)),
		dump: () => Object.fromEntries(store)
	};
}

function fakeElement() {
	const attrs = {};
	return {
		attrs,
		setAttribute: (k, v) => { attrs[k] = v; },
		removeAttribute: (k) => { delete attrs[k]; }
	};
}

test('normalize rejects unknown values', () => {
	const p = prefs.normalize({ theme: 'evil', scale: '999', motion: 'maybe', cb: 'yes', holiday: 'no' });
	assert.deepEqual(p, { theme: 'portal', scale: '100', motion: 'system', cb: false, holiday: true });
});

test('normalize keeps valid values', () => {
	const p = prefs.normalize({ theme: 'paper', scale: 130, motion: 'off', cb: true, holiday: false });
	assert.deepEqual(p, { theme: 'paper', scale: '130', motion: 'off', cb: true, holiday: false });
});

test('load survives bad JSON and missing storage', () => {
	assert.deepEqual(prefs.load(memoryStorage({ 'cclub-prefs': '{not json' })), prefs.normalize({}));
	assert.deepEqual(prefs.load({ getItem() { throw new Error('blocked'); } }), prefs.normalize({}));
});

test('save then load round-trips', () => {
	const s = memoryStorage();
	prefs.save(s, { theme: 'rgb', scale: '150', motion: 'on', cb: true, holiday: false });
	assert.deepEqual(prefs.load(s), { theme: 'rgb', scale: '150', motion: 'on', cb: true, holiday: false });
});

test('save swallows storage errors', () => {
	assert.doesNotThrow(() => prefs.save({ setItem() { throw new Error('quota'); } }, {}));
});

test('system motion setting follows the OS signal', () => {
	assert.equal(prefs.attributes({}, true)['data-motion'], 'off');
	assert.equal(prefs.attributes({}, false)['data-motion'], 'on');
});

test('explicit motion setting overrides the OS signal', () => {
	assert.equal(prefs.attributes({ motion: 'on' }, true)['data-motion'], 'on');
	assert.equal(prefs.attributes({ motion: 'off' }, false)['data-motion'], 'off');
	assert.equal(prefs.motionOff({ motion: 'off' }, false), true);
});

test('defaults produce no theme, scale or cb attribute', () => {
	const a = prefs.attributes({}, false);
	assert.equal(a['data-theme'], null);
	assert.equal(a['data-scale'], null);
	assert.equal(a['data-cb'], null);
	assert.equal(a['data-holiday'], null);
});

test('apply sets and clears attributes on the element', () => {
	const el = fakeElement();
	prefs.apply(el, { theme: 'amber', scale: '115', cb: true }, false);
	assert.deepEqual(el.attrs, { 'data-theme': 'amber', 'data-scale': '115', 'data-motion': 'on', 'data-cb': 'on' });
	prefs.apply(el, {}, false);
	assert.deepEqual(el.attrs, { 'data-motion': 'on' });
});

test('every theme in the list is accepted', () => {
	for (const t of prefs.THEMES) assert.equal(prefs.normalize({ theme: t }).theme, t);
	assert.equal(prefs.THEMES.length, 8);
});

test('thanksgiving is the fourth Thursday of November', () => {
	assert.equal(prefs.thanksgiving(2025), 27);
	assert.equal(prefs.thanksgiving(2026), 26);
	assert.equal(prefs.thanksgiving(2027), 25);
	assert.equal(prefs.thanksgiving(2029), 22);
});

test('holidayFor gives each window its holiday', () => {
	assert.equal(prefs.holidayFor(2026, 9, 30), null);
	assert.equal(prefs.holidayFor(2026, 10, 1), 'halloween');
	assert.equal(prefs.holidayFor(2026, 10, 31), 'halloween');
	assert.equal(prefs.holidayFor(2026, 11, 1), null);
	assert.equal(prefs.holidayFor(2026, 11, 11), null);
	assert.equal(prefs.holidayFor(2026, 11, 12), 'thanksgiving');
	assert.equal(prefs.holidayFor(2026, 11, 26), 'thanksgiving');
	assert.equal(prefs.holidayFor(2026, 11, 27), null);
	assert.equal(prefs.holidayFor(2025, 11, 12), null);
	assert.equal(prefs.holidayFor(2025, 11, 13), 'thanksgiving');
	assert.equal(prefs.holidayFor(2026, 12, 1), 'december');
	assert.equal(prefs.holidayFor(2026, 12, 31), 'december');
	assert.equal(prefs.holidayFor(2027, 1, 1), null);
	assert.equal(prefs.holidayFor(2027, 1, 30), null);
	assert.equal(prefs.holidayFor(2027, 1, 31), 'valentines');
	assert.equal(prefs.holidayFor(2027, 2, 14), 'valentines');
	assert.equal(prefs.holidayFor(2027, 2, 15), null);
	assert.equal(prefs.holidayFor(2027, 3, 2), null);
	assert.equal(prefs.holidayFor(2027, 3, 3), 'stpatricks');
	assert.equal(prefs.holidayFor(2027, 3, 17), 'stpatricks');
	assert.equal(prefs.holidayFor(2027, 3, 18), null);
	assert.equal(prefs.holidayFor(2027, 7, 4), null);
});

test('pickHoliday reads the local date and obeys a preview URL', () => {
	const halloween = new Date(2026, 9, 31, 12);
	const summer = new Date(2026, 6, 4, 12);
	assert.equal(prefs.pickHoliday(halloween, ''), 'halloween');
	assert.equal(prefs.pickHoliday(summer, ''), null);
	assert.equal(prefs.pickHoliday(summer, '?holiday=december'), 'december');
	assert.equal(prefs.pickHoliday(summer, '?a=1&holiday=valentines'), 'valentines');
	assert.equal(prefs.pickHoliday(halloween, '?holiday=none'), null);
	assert.equal(prefs.pickHoliday(halloween, '?holiday=evil'), 'halloween');
});

test('a holiday shows only on the default theme with the toggle on', () => {
	assert.equal(prefs.attributes({}, false, 'halloween')['data-holiday'], 'halloween');
	assert.equal(prefs.attributes({ holiday: false }, false, 'halloween')['data-holiday'], null);
	assert.equal(prefs.attributes({ theme: 'phosphor' }, false, 'halloween')['data-holiday'], null);
	assert.equal(prefs.attributes({}, false, 'evil')['data-holiday'], null);
	assert.equal(prefs.attributes({}, false, null)['data-holiday'], null);
});

test('apply keeps the holiday when another pref changes', () => {
	const el = fakeElement();
	prefs.apply(el, {}, false, 'december');
	assert.equal(el.attrs['data-holiday'], 'december');
	prefs.apply(el, { scale: '130' }, false, 'december');
	assert.equal(el.attrs['data-holiday'], 'december');
	prefs.apply(el, { holiday: false }, false, 'december');
	assert.equal(el.attrs['data-holiday'], undefined);
});
