(function () {
	'use strict';

	var list = document.getElementById('m-list');
	if (!list) return;

	var input = document.getElementById('m-q');
	var clear = document.getElementById('m-clear');
	var count = document.getElementById('m-count');
	var status = document.getElementById('m-status');
	var empty = document.getElementById('m-empty');
	var yearBtns = Array.from(document.querySelectorAll('.m-year-btn'));
	var rows = Array.from(list.querySelectorAll('.m-row'));
	var heads = Array.from(list.querySelectorAll('.m-yhead'));
	var total = rows.length;

	var index = null;
	var indexState = 'idle';
	var year = 'all';
	var query = '';
	var PAGE = 100;
	var limit = PAGE;
	var more = document.getElementById('m-more');

	rows.forEach(function (row) {
		var d = row.dataset.d;
		row.dataset.iso = d.slice(0, 4) + '-' + d.slice(4, 6) + '-' + d.slice(6);
	});

	function loadIndex() {
		if (indexState !== 'idle') return Promise.resolve();
		indexState = 'loading';
		render();
		return fetch('/minutes/search.json')
			.then(function (r) { return r.json(); })
			.then(function (data) {
				index = data;
				indexState = 'ready';
			})
			.catch(function () {
				indexState = 'idle';
			})
			.then(render);
	}

	function matches(row, terms) {
		var iso = row.dataset.iso;
		var tokens = index && index[row.dataset.d];
		return terms.every(function (t) {
			if (iso.indexOf(t) !== -1) return true;
			if (!tokens) return false;
			return (' ' + tokens).indexOf(' ' + t) !== -1;
		});
	}

	function render() {
		var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
		var shown = 0;

		rows.forEach(function (row) {
			var ok = (year === 'all' || row.dataset.y === year) &&
				(!terms.length || matches(row, terms));
			if (ok) shown += 1;
			row.hidden = !ok || shown > limit;
		});

		heads.forEach(function (head) {
			var visible = year === 'all' || head.dataset.y === year;
			if (visible) {
				visible = rows.some(function (row) {
					return row.dataset.y === head.dataset.y && !row.hidden;
				});
			}
			head.hidden = !visible;
		});

		count.textContent = shown + ' of ' + total;
		empty.hidden = shown !== 0;

		if (shown > limit) {
			more.hidden = false;
			more.textContent = 'Show the other ' + (shown - limit) + ' matches';
		} else {
			more.hidden = true;
		}

		if (terms.length && indexState === 'loading') {
			status.textContent = 'Searching...';
		} else if (terms.length && indexState === 'failed') {
			status.textContent = 'Searching dates only.';
		} else if (terms.length) {
			status.textContent = shown + (shown === 1 ? ' meeting' : ' meetings');
		} else {
			status.textContent = '';
		}

		clear.hidden = !query;
	}

	more.addEventListener('click', function () {
		limit = Infinity;
		render();
	});

	function syncUrl() {
		var params = new URLSearchParams();
		if (query) params.set('q', query);
		if (year !== 'all') params.set('y', year);
		var qs = params.toString();
		history.replaceState(null, '', qs ? '?' + qs : location.pathname);
	}

	var debounce;

	function onInput() {
		query = input.value.trim();
		limit = PAGE;
		clearTimeout(debounce);
		debounce = setTimeout(function () {
			render();
			syncUrl();
		}, 120);
		if (query) loadIndex();
	}

	input.addEventListener('input', onInput);
	input.addEventListener('focus', loadIndex, { once: true });

	input.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			input.value = '';
			onInput();
		}
	});

	clear.addEventListener('click', function () {
		input.value = '';
		query = '';
		render();
		syncUrl();
		input.focus();
	});

	yearBtns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			year = btn.dataset.year;
			limit = PAGE;
			yearBtns.forEach(function (b) {
				b.setAttribute('aria-pressed', String(b.dataset.year === year));
			});
			render();
			syncUrl();
		});
	});

	var initial = new URLSearchParams(location.search);
	var q0 = initial.get('q');
	var y0 = initial.get('y');

	if (y0) {
		var target = yearBtns.find(function (b) { return b.dataset.year === y0; });
		if (target) {
			year = y0;
			yearBtns.forEach(function (b) {
				b.setAttribute('aria-pressed', String(b.dataset.year === year));
			});
		}
	}

	if (q0) {
		input.value = q0;
		query = q0.trim();
		loadIndex();
	}

	render();
})();
