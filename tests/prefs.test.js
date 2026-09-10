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
	const p = prefs.normalize({ theme: 'evil', scale: '999', motion: 'maybe', cb: 'yes' });
	assert.deepEqual(p, { theme: 'portal', scale: '100', motion: 'system', cb: false });
});

test('normalize keeps valid values', () => {
	const p = prefs.normalize({ theme: 'paper', scale: 130, motion: 'off', cb: true });
	assert.deepEqual(p, { theme: 'paper', scale: '130', motion: 'off', cb: true });
});

test('load survives bad JSON and missing storage', () => {
	assert.deepEqual(prefs.load(memoryStorage({ 'cclub-prefs': '{not json' })), prefs.normalize({}));
	assert.deepEqual(prefs.load({ getItem() { throw new Error('blocked'); } }), prefs.normalize({}));
});

test('save then load round-trips', () => {
	const s = memoryStorage();
	prefs.save(s, { theme: 'rgb', scale: '150', motion: 'on', cb: true });
	assert.deepEqual(prefs.load(s), { theme: 'rgb', scale: '150', motion: 'on', cb: true });
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
