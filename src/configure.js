import fs from 'fs';
import readline from 'readline';
import subprocess from 'child_process'

var parameters = {};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


var load = function load(path, opts) {
	return new Promise(function(resolve, reject) {
		fs.stat(path, function(error, stats) {
			if ( error || ( stats.isFile && !stats.isFile() ) ) {
				reject(new Error(`No such file '${path}'.`));
			} else {
				fs.readFile(path, 'utf8', function(error, file) {
					if (error) {
						reject(error);
					} else {
						parameters = JSON.parse(file);
						Object.assign(parameters, opts);
						resolve(parameters);
					}
				});
			}
		});
	});
};

var get = function get(name, question, options) {
	return new Promise(function(resolve, reject) {
		if (!name || typeof name !== 'string') {
			reject(new Error(`'configure.get()' takes at least one string parameter.`));
		}
		if (question !== undefined && typeof question === 'object') {
			options = question;
			question = undefined;
		}
		var property = parameters[name];
		if (property !== undefined && options !== undefined && options.tryShell === true && Array.isArray(property)) {
			subprocess.exec(property.join(' '), function(error, stdout, stderr) {
				if (error) {
					console.error(stderr);
					reject(error);
				} else {
					var result = stdout.trim();
					parameters[name] = result;
					resolve(result);
				}
			});
		} else if (property !== undefined) {
			resolve(property);
		} else {
			if (question !== undefined && typeof question === 'string') {
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

var forget = function forget(name) {
	if (!name || typeof name !== 'string') {
		throw new Error(`'configure.forget()' function takes one string parameter.`);
	} else {
		delete parameters[name];
	}
};

export default {
	'load': load,
	'get': get,
	'forget': forget
};
