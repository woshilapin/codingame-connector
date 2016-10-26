import fs from 'fs';
import options from 'node-options';

import configure from './configure.js';
import cgapi from './codingame-api.js';

var opts = {
	'configuration': '.codingamerc',
};
var result = options.parse(process.argv.slice(2), opts);

if (result.errors) {
	console.log('USAGE: [--configuration=<configuration-file>] <watch|check>');
	process.exit(-1);
}

var tries = 0;
var log = function log() {
	tries += 1;
	return new Promise(function(resolve, reject) {
		var credentials = {};
		configure.get('username', 'login? ', { 'tryShell': true })
		.then(function(username) {
			credentials.username = username;
			return configure.get('password', 'password? ', { 'tryShell': true });
		})
		.then(function(password) {
			credentials.password = password;
			return cgapi.login(credentials.username, credentials.password);
		})
		.then(function(res) {
			if (!res.error) {
				resolve(res);
			} else {
				if (tries < 3) {
					console.warn('Unable to login (try #' + tries + ')')
					configure.forget('username');
					configure.forget('password');
					resolve(log());
				} else {
					reject(new Error('Unable to login (after 3 tries).'))
				}
			}
		});
	});
};

var logged = configure.load(opts.configuration, opts)
.then(function(configuration) {
	return log();
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

var watch = function watch() {
	Promise.all([
		configure.get('exercise'),
		configure.get('tests'),
		configure.get('language'),
		configure.get('bundle')
	])
	.then(function (results) {
		var exercise = results[0];
		var tests = results[1];
		var language = results[2];
		var bundle = results[3];
		fs.stat(bundle, function(error, stats) {
			if ( error || ( stats.isFile && !stats.isFile() ) ) {
				console.log(`---> No such file '${bundle}'.`)
				console.log('---> Retrying in 5s');
				setTimeout(watch, 5000);
			} else {
				var watcher = fs.watch(bundle, {
					'persistent': false,
					'recursive': false,
					'encoding': 'utf8'
				});
				console.log(`Waiting for changes in '${bundle}'...`);
				watcher.on('change', function(event, filename) {
					if (event === 'change') {
						var chain = new Promise(function(resolve) {resolve(true)});
						for (var t of tests) {
							let test = t;
							chain = chain.then(function(passed) {
								if (passed) {
									return check(exercise, test, language, bundle);
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
		});
	});
};

logged.then(watch);
