(function () {
	'use strict';

	var root = document.getElementById('term');
	var dataEl = document.getElementById('term-data');
	if (!root || !dataEl) return;

	var data = JSON.parse(dataEl.textContent);
	var out = root.querySelector('.t-out');
	var input = root.querySelector('.t-in');
	var promptEl = root.querySelector('.t-prompt');
	var commands = {};
	var history = [];
	var cursor = 0;

	data.commands.forEach(function (c) {
		commands[c.name] = c;
	});

	function esc(s) {
		return s.replace(/[&<>"]/g, function (ch) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
		});
	}

	function linkify(s) {
		return esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, text, url) {
			var ext = /^https?:/.test(url) ? ' rel="noopener"' : '';
			return '<a href="' + url + '"' + ext + '>' + text + '</a>';
		});
	}

	function print(text, cls) {
		var line = document.createElement('div');
		if (cls) line.className = cls;
		line.innerHTML = linkify(text.replace(/\s+$/, ''));
		out.appendChild(line);
	}

	function echo(cmd) {
		print(data.prompt + ' ' + cmd, 't-echo');
	}

	function trim() {
		while (out.children.length > 400) out.removeChild(out.firstChild);
	}

	function since1976() {
		var days = Math.floor((Date.now() - Date.UTC(1976, 9, 1)) / 86400000);
		var years = Math.floor(days / 365.25);
		return years + ' years, ' + (days - Math.floor(years * 365.25)) + ' days';
	}

	function nextThursday() {
		if (window.clubTime) return window.clubTime.nextMeeting(new Date());
		var now = new Date();
		var t = new Date(now.getTime());
		t.setHours(18, 0, 0, 0);
		var delta = (4 - t.getDay() + 7) % 7;
		if (delta === 0 && t <= now) delta = 7;
		t.setDate(t.getDate() + delta);
		return t;
	}

	function clubDate(date) {
		var zone = window.clubTime ? window.clubTime.zone : undefined;
		return new Intl.DateTimeFormat('en-US', {
			timeZone: zone, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
			hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
		}).format(date);
	}

	var builtins = {
		help: function () {
			var names = data.commands.filter(function (c) { return !c.hidden; });
			var width = names.reduce(function (w, c) { return Math.max(w, c.name.length); }, 4);
			print('Commands:');
			names.forEach(function (c) {
				print('  ' + c.name + new Array(width - c.name.length + 3).join(' ') + (c.desc || ''));
			});
			print('  clear     wipe the screen');
			print('Some commands are not listed.');
		},
		clear: function () {
			out.innerHTML = '';
		},
		date: function () {
			print(new Date().toString());
		},
		uptime: function () {
			print('up ' + since1976() + ', 1 user, load average: thursday');
		},
		whoami: function () {
			print('guest');
		},
		next: function () {
			var t = nextThursday();
			var ms = t - new Date();
			var d = Math.floor(ms / 86400000);
			var h = Math.floor(ms / 3600000) % 24;
			var m = Math.floor(ms / 60000) % 60;
			print('Next meeting: ' + clubDate(t));
			print('T-' + d + 'd ' + h + 'h ' + m + 'm');
		},
		ls: function () {
			print('about  meeting  join  chat  servers  minutes  history  wiki');
		},
		pwd: function () {
			print('/home/guest');
		},
		cd: function () {
			print('cd: you are already here. Thursdays, 6pm, 2225 Kohrman.');
		},
		cat: function (args) {
			if (args[0] === '/etc/motd') { print(data.motd); return; }
			print('cat: ' + (args[0] || '') + ': Permission denied. Ask in #geeks.');
		},
		echo: function (args) {
			print(args.join(' '));
		},
		man: function (args) {
			print('No manual entry for ' + (args[0] || 'man') + '. The wiki has one: [/wiki/](/wiki/Main_Page)');
		},
		open: function (args) {
			var target = { wiki: '/wiki/Main_Page', chat: '/chat/', minutes: '/minutes/', join: '/join/' }[args[0]];
			if (!target) { print('open: ' + (args[0] || '') + ': not a place'); return; }
			location.href = target;
		}
	};

	function run(raw) {
		var line = raw.trim();
		echo(line);
		if (!line) return;
		history.push(line);
		cursor = history.length;
		var parts = line.split(/\s+/);
		var name = parts[0].toLowerCase();
		var args = parts.slice(1);
		if (name === 'vi') name = 'vim';
		if (name === ':q' || name === ':q!' || name === ':wq') { print('Not in vim. You are free.'); return; }
		if (builtins[name]) { builtins[name](args); return; }
		var cmd = commands[name];
		if (cmd) {
			if (cmd.random) {
				var lines = cmd.out.split('\n').filter(Boolean);
				print(lines[Math.floor(Math.random() * lines.length)]);
			} else {
				print(cmd.out);
			}
			return;
		}
		print(name + ': command not found. Type help.');
	}

	function complete(prefix) {
		var names = Object.keys(builtins).concat(data.commands.map(function (c) { return c.name; }));
		var hits = names.filter(function (n) { return n.indexOf(prefix) === 0; });
		if (hits.length === 1) input.value = hits[0] + ' ';
		if (hits.length > 1) {
			echo(prefix);
			print(hits.sort().join('  '));
		}
	}

	input.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			run(input.value);
			input.value = '';
			trim();
			out.scrollTop = out.scrollHeight;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (cursor > 0) { cursor -= 1; input.value = history[cursor]; }
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (cursor < history.length - 1) { cursor += 1; input.value = history[cursor]; }
			else { cursor = history.length; input.value = ''; }
		} else if (e.key === 'Tab') {
			e.preventDefault();
			complete(input.value.trim().toLowerCase());
		} else if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			builtins.clear();
		} else if (e.key === 'c' && e.ctrlKey) {
			echo(input.value + '^C');
			input.value = '';
		}
	});

	root.addEventListener('click', function (e) {
		if (e.target.tagName !== 'A') input.focus();
	});

	promptEl.textContent = data.prompt;
	print(data.motd);
})();
