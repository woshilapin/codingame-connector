import fs from 'fs';
import subprocess from 'child_process'
import options from 'node-options';

import configuration from './configuration.js';
import cgapi from './codingame-api.js';

var opts = {
	'conf': '.codingamerc',
};
var result = options.parse(process.argv.slice(2), opts);

if (result.errors) {
	console.log('USAGE: [--conf=<conf-file>] <watch|check>');
	process.exit(-1);
}

var tries = 0;
var log = function log(conf) {
	tries += 1;
	return new Promise(function(resolve, reject) {
		configuration.get('username', 'login? ')
		.then(function(username) {
			conf.username = username;
			return configuration.get('password', 'password? ');
		})
		.then(function(password) {
			conf.password = password;
			cgapi.login(conf.username, conf.password)
			.then(function(res) {
				if (!res.error) {
					resolve(conf);
				} else {
					if (tries < 3) {
						console.warn('Unable to login (try #' + tries + ')')
						delete conf.username;
						delete conf.password;
						resolve(log(conf));
					} else {
						reject(new Error('Unable to login (after 3 tries).'))
					}
				}
			});
		});
	});
};

var logged = configuration.load(opts.conf, opts)
.then(function(conf) {
	return log(conf);
}, function(error) {
	console.error(error.message);
	process.exit(-1);
});

var display = function display(test, results) {
	if (results.success) {
		var success = results.success;
		if (success.error) {
			var error = success.error;
			console.error(`---> Test #${test}: ERROR: ${error.message}`);
			if (error.stacktrace) {
				for (var st of error.stacktrace) {
					console.error(`--->     ${st.container}: ${st.line}: ${st.function}`);
				}
			}
		} else if (success.output && success.comparison) {
			var output = success.output;
			var comparison = success.comparison;
			if (comparison.success) {
				console.log(`---> Test #${test}: PASS`);
				return true;
			} else {
				console.warn(`---> Test #${test}: FAIL`);
				console.warn(`--->     Expected: <${comparison.expected}>`);
				console.warn(`--->     Found   : <${comparison.found}>`);
			}
		}
	}
	return false;
};

var check = function check(exercise, test, language, bundle) {
	return new Promise(function(resolve, reject) {
		cgapi.check(exercise, test, language, bundle)
		.then(function(result) {
			resolve(display(test, result));
		}, function(error) {
			reject(error);
		});
	});
};

var watch = function watch(opts) {
	fs.stat(opts.bundle, function(error, stats) {
		if ( error || ( stats.isFile && !stats.isFile() ) ) {
			console.log(`---> No such file '${opts.bundle}'.`)
			console.log('---> Retrying in 5s');
			setTimeout(watch, 5000, opts);
		} else {
			var watcher = fs.watch(opts.bundle, {
				'persistent': false,
				'recursive': false,
				'encoding': 'utf8'
			});
			console.log(`Waiting for changes in '${opts.bundle}'...`);
			watcher.on('change', function(event, filename) {
				if (event === 'change') {
					var chain = new Promise(function(resolve) {resolve(true)});
					for (var test of opts.tests) {
						let index = test;
						chain = chain.then(function(passed) {
							if (passed) {
								return check(opts.exercise, index, opts.language, opts.bundle);
							} else {
								return new Promise(function(resolve) {resolve(false)});
							}
						}, function(error) {
							return new Promise(function(resolve, reject) { reject(error) });
						});
					}
					chain.then(function() {
						watcher.close();
						watch(opts);
					}, function(error) {
						console.error(error);
					});
				}
			});
		}
	})
};

logged.then(watch);
