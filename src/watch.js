import fs from 'fs';
import readline from 'readline';
import subprocess from 'child_process'
import options from 'node-options';
import cgapi from './codingame-api.js';

var opts = {
	'conf': '.codingame.json',
	'verbose': false
};
var result = options.parse(process.argv.slice(2), opts);

if (result.errors) {
	console.log('USAGE: [--verbose] [--conf=<conf-file>] <watch|check>');
	process.exit(-1);
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var loadConfigurationFile = function loadConfigurationFile(opts) {
	return new Promise(function(resolve, reject) {
		if (opts.verbose) {
			console.log(`---> Reading config file '${opts.conf}'...`);
		}
		fs.readFile(opts.conf, 'utf8', function(error, file) {
			if (error) {
				if (opts.verbose) {
					console.log(`---> Error when loading the config file '${opts.conf}'.`);
				}
				reject(error);
			} else {
				var conf = JSON.parse(file);
				if (opts.verbose) {
					console.log(`---> Config file '${opts.conf}' loaded.`);
				}
				Object.assign(opts, conf);
				resolve(opts);
			}
		});
	});
};

var getConfigurationField = function getConfigurationField(type, field) {
	return new Promise(function(resolve, reject) {
		if (field && typeof field === 'string') {
			resolve(field);
		} else if (field && Array.isArray(field)) {
			subprocess.exec(field.join(' '), function(error, stdout, stderr) {
				if (error) {
					console.error(stderr);
					reject(error);
				} else {
					resolve(stdout.trim());
				}
			});
		} else {
			rl.question(`What is your ${type}? `, (field) => {
				resolve(field);
			});
		}
	});
};

var tries = 0;
var log = function log(conf) {
	tries += 1;
	return new Promise(function(resolve, reject) {
		getConfigurationField('username', conf.username)
		.then(function(username) {
			conf.username = username;
			return getConfigurationField('password', conf.password);
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

var logged = loadConfigurationFile(opts)
.then(function(conf) {
	return log(conf);
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
	var watcher = fs.watch(opts.bundle, {'persistent': false, 'recursive': false, 'encoding': 'utf8'});
	watcher.on('change', function(event, filename) {
		if (opts.verbose) {
			console.log(`---> File '${filename}' has been '${event}'.`);
		}
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
			});
		}
	});
};

logged.then(watch);
