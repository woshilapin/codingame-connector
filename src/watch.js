/**
 * @file Main entry point of Codingame's Connector
 * @author woshilapin <woshilapin@tuziwo.info>
 * @version 0.3.0
 */
import fs from 'fs';
import commander from 'commander';

import configure from './configure.js';
import utils from './utils.js';

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

// Load package.json
new Promise(function(resolve, reject) {
	fs.readFile(`package.json`, `utf8`, function(error, content) {
		if (error) {
			reject(error);
		} else {
			resolve(JSON.parse(content));
		}
	});
})
// Read program options and arguments
.then(function(packagejson) {
	let defaultconfiguration = `.codingamerc`;
	commander
		.version(packagejson.version)
		.command(`cg-watch`)
		.description(`Watch for change on a program and test it against Codingame`)
		.option(`-c, --configuration <path>`, `Configuration file [default=${defaultconfiguration}]`, defaultconfiguration)
		.parse(process.argv);
	return Promise.resolve(commander);
})
// Load configuration file
.then(function(commander) {
	return configure.load(commander.configuration, {});
})
.then(function() {
	return utils.login();
}, utils.kill)
.then(watch, utils.kill);
