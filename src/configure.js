/**
 * @file Module 'configure'
 * @author woshilapin <woshilapin@tuziwo.info>
 * @version 0.3.0
 */
/**
 * Manage global configuration for Codingame's connector
 * @module configure
 */
import fs from 'fs';
import readline from 'readline';
import subprocess from 'child_process';

let parameters = {};

const rl = readline.createInterface({
	"input": process.stdin,
	"output": process.stdout
});


/**
 * Load the configuration file
 *
 * @name load
 * @function
 * @param {string} path Path of the configuration file
 * @param {Object} [options] Additionnal parameters which will replace parameters from configuration file
 * @returns {Promise<Object>} Configuration parameters
 * @memberof module:configure
 * @instance
 */
let load = function load(path, options) {
	return new Promise(function(resolve, reject) {
		let resolvefromerror = function resolvefromerror(error) {
			if (options !== undefined && typeof options === `object`) {
				resolve(options);
			} else {
				reject(error);
			}
		};
		try {
			fs.readFile(path, `utf8`, function(error, file) {
				if (error) {
					resolvefromerror(error);
				} else {
					parameters = JSON.parse(file);
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
 * Get the value from configuration
 *
 * @name get
 * @function
 * @param {string} name Name of the parameter
 * @param {string} [option] 'shell' if value may be executed as shell command, 'file' if value is a path and content of file should be returned
 * @param {string} [question] If present and value not found, will be shown to the user to ask for the value on 'stdin'
 * @returns {Promise<string|Array|Object>} The value of the parameter
 * @memberof module:configure
 * @instance
 */
let get = function get(name, option, question) {
	return new Promise(function(resolve, reject) {
		if (!name || typeof name !== `string`) {
			reject(new Error(`'configure.get()' takes at least one string parameter.`));
		}
		let property = parameters[name];
		if (property !== undefined && option !== undefined && option === `shell` && Array.isArray(property)) {
			subprocess.exec(property.join(` `), function(error, stdout, stderr) {
				if (error) {
					console.error(stderr);
					reject(error);
				} else {
					let result = stdout.trim();
					parameters[name] = result;
					resolve(result);
				}
			});
		} else if (property !== undefined && option !== undefined && option === `file`) {
			fs.readFile(property, `utf8`, function(error, file) {
				if (error) {
					reject(error);
				} else {
					resolve({
						"path": property,
						"content": file
					});
				}
			});
		} else if (property !== undefined) {
			resolve(property);
		} else {
			if (question !== undefined && typeof question === `string`) {
				rl.question(question, (result) => {
					parameters[name] = result;
					resolve(result);
				});
			} else {
				reject(new Error(`'configure.get()' second parameter must be a string.`));
			}
		}
	});
};

/**
 * Ask configure module to delete a parameter
 *
 * @name forget
 * @function
 * @param {string} name Name of the parameter
 * @memberof module:configure
 * @instance
 */
let forget = function forget(name) {
	if (!name || typeof name !== `string`) {
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
