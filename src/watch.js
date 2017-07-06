/**
 * @file Main entry point of Codingame's Connector
 * @author woshilapin <woshilapin@tuziwo.info>
 */
import fs from 'fs';
import commander from 'commander';
import colors from 'colors/safe';
import ansi from 'ansi-escapes';

import configure from './configure.js';
import utils from './utils.js';

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
let watch = async () => {
	let bundle = await configure.get(`bundle`);
	let watcher = fs.watch(bundle, {
		"persistent": false,
		"recursive": false,
		"encoding": `utf8`
	});
	watcher.on(`change`, async (event) => {
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
				// ESlint complains about 'for await loops'
				// https://github.com/babel/babel-eslint/issues/415
				for await (let result of utils.tests(parameters)) { // eslint-disable-line semi
					console.log(`(${colors.success(`✓`)}) test ${result.test}`);
				}
				console.log();
				console.log(colors.bold(`Congratulations!`));
			} catch (error) {
				console.warn(`(${colors.fail(`✗`)}) test ${error.test}\n${error.message}`);
				console.log();
				console.log(colors.bold(`Fix it and try again!`));
			} finally {
				watcher.close();
				watch();
			}
		}
	});
};

// Read program options and arguments
let defaultconfiguration = `.codingamerc`;
commander
	.description(`Watch for change on a program and test it against Codingame`)
	.option(`-c, --configuration <path>`, `Configuration file [default=${defaultconfiguration}]`, defaultconfiguration)
	.parse(process.argv);
Promise.resolve(commander)
// Load configuration file
.then((commander) => {
	return configure.load(commander.configuration, {});
})
// Log in Codingame
.then(() => {
	return utils.login();
}, utils.kill)
// Launch wathing task
.then(async () => {
	let bundle = await configure.get(`bundle`);
	process.stdout.write(ansi.clearScreen);
	console.log(`...watching '${bundle}'...`);
	watch();
}, utils.kill);

// Hold the process running instead of terminating
process.stdin.resume();
