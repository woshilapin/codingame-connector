/**
 * @file Main entry point of Codingame's Connector
 * @author woshilapin <woshilapin@tuziwo.info>
 * @version 0.3.0
 */
import fs from 'fs';
import commander from 'commander';
import colors from 'colors/safe';
import ansi from 'ansi-escapes';
import readline from 'readline2';

import configure from './configure.js';
import utils from './utils.js';

const rl = readline.createInterface({
	"stdin": process.stdin,
	"stdout": process.stdout
});

colors.setTheme({
	"success": [`green`, `bold`],
	"fail": [`red`, `bold`]
});

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
	watcher.on(`change`, async function(event) {
		if (event === `change`) {
			process.stdout.write(ansi.clearScreen);
			let [exercise, tests, language, bundle] = await Promise.all([
				configure.get(`exercise`),
				configure.get(`tests`),
				configure.get(`language`),
				configure.get(`bundle`, `file`)
			]);
			const parameters = {
				"exercise": exercise,
				"tests": tests,
				"language": language,
				"bundle": bundle.data
			};
			try {
				for await (let result of utils.tests(parameters)) {
					console.log(`(${colors.success(`✓`)}) test ${result.test}`);
				}
				console.log();
				console.log(colors.bold(`Congratulations!`));
			} catch (error) {
				console.warn(`(${colors.fail(`✗`)}) test ${error.test}\t${error.message}`);
				console.log();
				console.log(colors.bold(`Fix it and try again!`));
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
.then(async function() {
	let bundle = await configure.get(`bundle`);
	process.stdout.write(ansi.clearScreen);
	console.log(`...watching '${bundle}'...`);
	watch();
}, utils.kill);
