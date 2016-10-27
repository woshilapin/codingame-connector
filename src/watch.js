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


var watch = function watch() {
	Promise.all([
		configure.get('exercise'),
		configure.get('tests'),
		configure.get('language'),
		configure.get('bundle', 'file')
	])
	.then(function (results) {
		var exercise = results[0];
		var tests = results[1];
		var language = results[2];
		var bundle = results[3];
		var watcher = fs.watch(bundle.path, {
			'persistent': false,
			'recursive': false,
			'encoding': 'utf8'
		});
		console.log(`Watching for changes in '${bundle.path}'...`);
		watcher.on('change', function(event, filename) {
			if (event === 'change') {
				console.log(`Launching test suite (${tests.length} tests)...`);
				utils.tests(exercise, tests, language, bundle.content)
				.then(function(results) {
					console.log(`[${results.length} tests] Pass`);
					watcher.close();
					watch();
				}, function(results) {
					var error = results[results.length - 1];
					console.warn(`[test #${error.test}] Fail: ${error.message}`);
					watcher.close();
					watch();
				});
			}
		});
	}, utils.kill);
};

logged.then(watch, utils.kill);
