/**
 * @file Module 'configure'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Manage global configuration for Codingame's connector
 * @module configure
 */
import fs from 'fs';
import readline from 'readline';
import subprocess from 'child_process';

let parameters = {};

/**
 * Load the configuration file
 *
 * @name load
 * @function
 * @param {string} path - Path of the configuration file
 * @param {Object} [options] - Additionnal parameters which will replace parameters from configuration file
 * @returns {Promise<Object>} Configuration parameters
 * @memberof module:configure
 * @instance
 */
let load = (path, options) => {
	return new Promise((resolve, reject) => {
		let resolvefromerror = (error) => {
			if (options !== undefined && typeof options === `object`) {
				Object.assign(parameters, options);
				resolve(options);
			} else {
				reject(error);
			}
		};
		try {
			fs.readFile(path, `utf8`, (error, file) => {
				if (error) {
					resolvefromerror(error);
				} else {
					try {
						parameters = JSON.parse(file);
					} catch (error) {
						reject(error);
					}
					Object.assign(parameters, options);
					resolve(parameters);
				}
			});
		} catch (error) {
			resolvefromerror(error);
		}
	});
};

/**
 * Get result of a shell command
 *
 * @name getShell
 * @function
 * @param {string} cmd - Shell command to run
 * @returns {Promise<string>} A promise of the output of the shell command
 */
let getShell = (cmd) => {
	return new Promise((resolve, reject) => {
		subprocess.exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				reject(error);
			} else {
				let result = stdout.trim();
				resolve(result);
			}
		});
	});
};

/**
 * Get content of a file
 *
 * @name getFile
 * @function
 * @param {string} path - Path to the file
 * @returns {Promise<Object>} A promise of an object with `path` and `content`
 */
let getFile = (path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, `utf8`, (error, data) => {
			if (error) {
				console.error(error.message);
				reject(error);
			} else {
				resolve({
					"path": path,
					"data": data
				});
			}
		});
	});
};

/**
 * Get answer to a question asked to the end-user
 *
 * @name getQuestion
 * @function
 * @param {string} question - Question to ask to the end-user
 * @returns {Promise<string>} A promise of the answer of the end-user
 */
let getQuestion = (question) => {
	return new Promise((resolve, reject) => {
		const rl = readline.createInterface({
			"input": process.stdin,
			"output": process.stdout
		});
		if (question !== undefined && typeof question === `string`) {
			rl.question(question, (result) => {
				rl.close();
				resolve(result);
			});
		} else {
			rl.close();
			reject(new Error(`'configure.get()' second parameter must be a string.`));
		}
	});
};

/**
 * Get the value from configuration
 *
 * @name get
 * @function
 * @param {string} name - Name of the parameter
 * @param {string} [option] - 'shell' if value may be executed as shell command, 'file' if value is a path and content of file should be returned
 * @param {string} [question] - If present and value not found, will be shown to the user to ask for the value on 'stdin'
 * @returns {Promise<string|Array|Object>} The value of the parameter
 * @memberof module:configure
 * @instance
 */
let get = (name, option, question) => {
	return new Promise((resolve, reject) => {
		if (!name || typeof name !== `string`) {
			reject(new Error(`'configure.get()' takes at least one string parameter.`));
		}
		let property = parameters[name];
		if (property !== undefined && option !== undefined && option === `shell` && Array.isArray(property)) {
			getShell(property.join(` `)).then((result) => {
				parameters[name] = result;
				resolve(result);
			}, (error) => {
				reject(error);
			});
		} else if (property !== undefined && option !== undefined && option === `file`) {
			resolve(getFile(property));
		} else if (property !== undefined) {
			resolve(property);
		} else {
			getQuestion(question).then((result) => {
				parameters[name] = result;
				resolve(result);
			}, (error) => {
				reject(error);
			});
		}
	});
};

/**
 * Ask configure module to delete a parameter
 *
 * @name forget
 * @function
 * @param {string} name - Name of the parameter
 * @memberof module:configure
 * @instance
 */
let forget = (name) => {
	if (typeof name !== `string`) {
		throw new Error(`'configure.forget()' function takes one string parameter.`);
	} else {
		delete parameters[name];
	}
};

export default {
	"load": load,
	"get": get,
	"forget": forget
};
