import fs from 'fs';
import readline from 'readline';
import subprocess from 'child_process'

let parameters = {};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


let load = function load(path, opts) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path, 'utf8', function(error, file) {
			if (error) {
				reject(error);
			} else {
				parameters = JSON.parse(file);
				Object.assign(parameters, opts);
				resolve(parameters);
			}
		});
	});
};

let get = function get(name, option, question) {
	return new Promise(function(resolve, reject) {
		if (!name || typeof name !== 'string') {
			reject(new Error(`'configure.get()' takes at least one string parameter.`));
		}
		let property = parameters[name];
		if (property !== undefined && option !== undefined && option === 'shell' && Array.isArray(property)) {
			subprocess.exec(property.join(' '), function(error, stdout, stderr) {
				if (error) {
					console.error(stderr);
					reject(error);
				} else {
					let result = stdout.trim();
					parameters[name] = result;
					resolve(result);
				}
			});
		} else if (property !== undefined && option !== undefined && option === 'file') {
			fs.readFile(property, 'utf8', function(error, file) {
				if (error) {
					reject(error);
				} else {
					resolve({'path': property, 'content': file});
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

let forget = function forget(name) {
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
