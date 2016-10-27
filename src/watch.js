/**
 * @file Main entry point of Codingame's Connector
 * @author woshilapin <woshilapin@tuziwo.info>
 * @version 0.3.0
 */
import fs from 'fs';
import options from 'node-options';

import configure from './configure.js';
import utils from './utils.js';

let opts = {
	"configuration": `.codingamerc`
};
let result = options.parse(process.argv.slice(2), opts);

let help = `USAGE: [--configuration=<configuration-file>] <watch|check>`;
if (result.errors) {
	utils.kill(new Error(help));
}

let logged = configure.load(opts.configuration, opts)
.then(function() {
	return utils.login();
}, utils.kill);


/**
 * Start the watching process of the bundle file
 *
 * @name watch
 * @function
 */
let watch = function watch() {
	Promise.all([
		configure.get(`exercise`),
		configure.get(`tests`),
		configure.get(`language`),
		configure.get(`bundle`, `file`)
	])
	.then(function (results) {
		let [exercise, tests, language, bundle] = results;
		let watcher = fs.watch(bundle.path, {
			"persistent": false,
			"recursive": false,
			"encoding": `utf8`
		});
		console.log(`Watching for changes in '${bundle.path}'...`);
		watcher.on(`change`, function(event) {
			if (event === `change`) {
				console.log(`Launching test suite (${tests.length} tests)...`);
				utils.tests(exercise, tests, language, bundle.content)
				.then(function(results) {
					console.log(`[${results.length} tests] Pass`);
					watcher.close();
					watch();
				}, function(results) {
					let error = results[results.length - 1];
					console.warn(`[test #${error.test}] Fail: ${error.message}`);
					watcher.close();
					watch();
				});
			}
		});
	}, utils.kill);
};

logged.then(watch, utils.kill);
