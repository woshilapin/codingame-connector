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
let watch = async function watch() {
	let bundle = await configure.get(`bundle`);
	let watcher = fs.watch(bundle, {
		"persistent": false,
		"recursive": false,
		"encoding": `utf8`
	});
	console.log(`Watching for changes in '${bundle}'...`);
	watcher.on(`change`, async function(event) {
		if (event === `change`) {
			let [exercise, tests, language, bundle] = await Promise.all([
				configure.get(`exercise`),
				configure.get(`tests`),
				configure.get(`language`),
				configure.get(`bundle`, `file`)
			]);
			console.log(`Launching test suite (${tests.length} tests)...`);
			const parameters = {
				"exercise": exercise,
				"tests": tests,
				"language": language,
				"bundle": bundle.content
			}
			try {
				let g = utils.tests(parameters);
				for await (let result of g) {
					console.log(`[ Test #${result.test} ] PASS`);
				}
			} catch (error) {
				console.warn(`[test #${error.test}] Fail: ${error.message}`);
			} finally {
				watcher.close();
				watch();
			}
		}
	});
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
		.description(`Watch for change on a program and test it against Codingame`)
		.option(`-c, --configuration <path>`, `Configuration file [default=${defaultconfiguration}]`, defaultconfiguration)
		.parse(process.argv);
	return Promise.resolve(commander);
})
// Load configuration file
.then(function(commander) {
	return configure.load(commander.configuration, {});
})
// Log in Codingame
.then(function() {
	return utils.login();
}, utils.kill)
// Launch wathing task
.then(watch, utils.kill);
