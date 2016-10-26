import fs from 'fs';
import options from 'node-options';

import configure from './configure.js';
import cgapi from './codingame-api.js';
import utils from './utils.js';

var opts = {
	'configuration': '.codingamerc',
};
var result = options.parse(process.argv.slice(2), opts);

var help = 'USAGE: [--configuration=<configuration-file>] <watch|check>';
if (result.errors) {
	utils.kill(new Error(help));
}

var logged = configure.load(opts.configuration, opts)
.then(function(configuration) {
	return utils.login();
}, utils.kill);

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

logged.then(watch, utils.kill);
