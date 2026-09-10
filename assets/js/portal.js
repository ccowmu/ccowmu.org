(function () {
	'use strict';

	var root = document.getElementById('portal');
	if (!root) return;

	var api = (root.dataset.api || '').replace(/\/$/, '');
	var seedHits = parseInt(root.dataset.hitsSeed, 10) || 0;
	var hitKey = 'cclub-portal-hit';
	var reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
	var prefs = portalPrefs.load(localStorage);
	var still = portalPrefs.motionOff(prefs, reduceQuery.matches);

	function freezeGif(img) {
		if (img.dataset.gif || !img.complete || !img.naturalWidth) return;
		var canvas = document.createElement('canvas');
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		try {
			canvas.getContext('2d').drawImage(img, 0, 0);
			img.dataset.gif = img.src;
			img.src = canvas.toDataURL('image/png');
		} catch (e) { /* tainted canvas */ }
	}

	function setGifs(freeze) {
		Array.prototype.forEach.call(document.querySelectorAll('img[src$=".gif"], img[data-gif]'), function (img) {
			if (freeze) {
				if (img.complete) freezeGif(img);
				else img.addEventListener('load', function () { if (still) freezeGif(img); }, { once: true });
			} else if (img.dataset.gif) {
				img.src = img.dataset.gif;
				delete img.dataset.gif;
			}
		});
	}

	setGifs(still);

	function pad(n) {
		return String(n).padStart(2, '0');
	}

	function store(area, fn) {
		try {
			return fn(window[area]);
		} catch (e) {
			return null;
		}
	}

	var clockEl = document.getElementById('portal-clock');
	var countdownEl = document.getElementById('portal-countdown');
	var binaryEl = document.querySelector('.p-binary');

	function binary(seed) {
		var out = '';
		for (var r = 0; r < 8; r++) {
			for (var i = 0; i < 90; i++) {
				out += ((seed * 7919 + r * 131 + i * 31) % 7) < 3 ? '1' : '0';
			}
			out += '\n';
		}
		return out;
	}

	function nextMeeting(now) {
		var target = new Date(now.getTime());
		target.setHours(18, 0, 0, 0);
		var delta = (4 - target.getDay() + 7) % 7;
		if (delta === 0 && target.getTime() <= now.getTime()) delta = 7;
		target.setDate(target.getDate() + delta);
		return target;
	}

	function tick() {
		var now = new Date();
		if (binaryEl && !still) {
			binaryEl.textContent = binary(Math.floor(now.getTime() / 900));
		}
		if (clockEl) {
			clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ' EST';
		}
		if (countdownEl) {
			var ms = Math.max(0, nextMeeting(now) - now);
			countdownEl.textContent = 'T-' + Math.floor(ms / 86400000) + 'd ' +
				pad(Math.floor(ms / 3600000) % 24) + ':' +
				pad(Math.floor(ms / 60000) % 60) + ':' +
				pad(Math.floor(ms / 1000) % 60);
		}
	}

	if (clockEl || countdownEl || binaryEl) {
		tick();
		setInterval(tick, 1000);
	}

	var digits = Array.from(document.querySelectorAll('#portal-odometer span'));
	var shown = 0;
	var roll;

	var odometer = document.getElementById('portal-odometer');

	function paintCount(n) {
		var s = String(Math.max(0, n)).padStart(digits.length, '0');
		digits.forEach(function (el, i) {
			el.textContent = s.charAt(i);
		});
		if (odometer) odometer.setAttribute('aria-label', String(Math.max(0, n)));
	}

	function rollTo(target) {
		if (!digits.length) return;
		cancelAnimationFrame(roll);
		if (still) {
			shown = target;
			paintCount(target);
			return;
		}
		var from = shown;
		var start = performance.now();
		var duration = 1600;
		function step(now) {
			var k = Math.min(1, (now - start) / duration);
			shown = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
			paintCount(shown);
			if (k < 1) roll = requestAnimationFrame(step);
		}
		roll = requestAnimationFrame(step);
	}

	function post(path, body) {
		return fetch(api + path, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'portal' },
			body: JSON.stringify(body)
		}).then(function (r) { return r.json(); }).catch(function () { return null; });
	}

	function json(path) {
		return fetch(api + path).then(function (r) { return r.json(); }).catch(function () { return null; });
	}

	function countVisit() {
		if (store('sessionStorage', function (s) { return s.getItem(hitKey); })) return;
		setTimeout(function () {
			post('/hit', { t: Date.now(), w: innerWidth, ref: document.referrer.slice(0, 200) }).then(function (data) {
				store('sessionStorage', function (s) { return s.setItem(hitKey, '1'); });
				if (data && typeof data.count === 'number') rollTo(data.count);
			});
		}, 1500);
	}

	function paintStatus(hosts) {
		var up = 0;
		Object.keys(hosts).forEach(function (name) {
			var row = document.querySelector('.p-status-row[data-host="' + name + '"]');
			if (!row) return;
			var ok = hosts[name] === 'up';
			if (ok) up += 1;
			row.classList.toggle('is-down', !ok);
			row.lastElementChild.textContent = ok ? 'UP' : 'DOWN';
		});
		var label = document.getElementById('portal-upcount');
		if (label) label.textContent = up + ' up';
		var matrix = document.getElementById('portal-matrix');
		if (matrix && hosts[matrix.dataset.host]) {
			var ok = hosts[matrix.dataset.host] === 'up';
			matrix.classList.toggle('is-down', !ok);
			matrix.firstChild.textContent = ok ? '\u2713 Matrix homeserver: ' : '\u2717 Matrix homeserver: ';
			matrix.lastElementChild.textContent = ok ? 'UP' : 'DOWN';
		}
	}

	if (!api) {
		rollTo(seedHits);
	} else {
		json('/hits').then(function (hits) {
			rollTo(hits && typeof hits.count === 'number' ? hits.count : seedHits);
			countVisit();
		});
		json('/status').then(function (status) {
			if (status && status.hosts) paintStatus(status.hosts);
		});
	}

	var menu = document.getElementById('a11y');
	var form = document.getElementById('a11y-form');

	function fillForm() {
		form.elements.theme.value = prefs.theme;
		form.elements.scale.value = prefs.scale;
		form.elements.motion.checked = portalPrefs.motionOff(prefs, reduceQuery.matches);
		form.elements.cb.checked = prefs.cb;
	}

	function readForm() {
		var systemOff = reduceQuery.matches;
		var wantOff = form.elements.motion.checked;
		return {
			theme: form.elements.theme.value,
			scale: form.elements.scale.value,
			motion: wantOff === systemOff ? 'system' : (wantOff ? 'off' : 'on'),
			cb: form.elements.cb.checked
		};
	}

	function commit(next) {
		prefs = portalPrefs.normalize(next);
		portalPrefs.save(localStorage, prefs);
		portalPrefs.apply(document.documentElement, prefs, reduceQuery.matches);
		still = portalPrefs.motionOff(prefs, reduceQuery.matches);
		setGifs(still);
		if (still) tick();
	}

	if (menu && form) {
		fillForm();
		form.addEventListener('change', function () { commit(readForm()); });
		form.addEventListener('reset', function (e) {
			e.preventDefault();
			commit({});
			fillForm();
		});
		form.addEventListener('submit', function (e) { e.preventDefault(); });
		menu.addEventListener('toggle', function () {
			if (menu.open) {
				var checked = form.querySelector('input[name="theme"]:checked') || form.elements.theme[0];
				checked.focus();
			}
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && menu.open) {
				menu.open = false;
				menu.querySelector('summary').focus();
			}
		});
		document.addEventListener('click', function (e) {
			if (menu.open && !menu.contains(e.target)) menu.open = false;
		});
		reduceQuery.addEventListener('change', function () {
			portalPrefs.apply(document.documentElement, prefs, reduceQuery.matches);
			still = portalPrefs.motionOff(prefs, reduceQuery.matches);
			setGifs(still);
			fillForm();
		});
	}

	var stream = document.getElementById('stream');
	var loadBtn = document.getElementById('stream-load');

	function meetingNow(now) {
		return now.getDay() === 4 && now.getHours() >= 18 && now.getHours() < 21;
	}

	if (stream) {
		var liveCheck = function () {
			stream.classList.toggle('is-live', meetingNow(new Date()));
		};
		liveCheck();
		setInterval(liveCheck, 60000);
	}

	if (loadBtn) {
		loadBtn.addEventListener('click', function () {
			var frame = document.createElement('iframe');
			frame.className = 'p-stream-frame';
			frame.src = loadBtn.dataset.src;
			frame.title = 'Twitch stream';
			frame.allow = 'autoplay; fullscreen; picture-in-picture';
			frame.setAttribute('allowfullscreen', '');
			loadBtn.replaceWith(frame);
		});
	}

	var copyBtn = document.getElementById('portal-copy');
	var embedEl = document.getElementById('portal-embed');

	if (copyBtn && embedEl) {
		copyBtn.addEventListener('click', function () {
			var done = function () {
				copyBtn.textContent = 'copied';
				setTimeout(function () { copyBtn.textContent = 'copy html'; }, 1500);
			};
			if (navigator.clipboard) {
				navigator.clipboard.writeText(embedEl.value).then(done, done);
			} else {
				embedEl.select();
				document.execCommand('copy');
				done();
			}
		});
	}
})();
