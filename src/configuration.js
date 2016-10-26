import fs from 'fs';
import readline from 'readline';

var conf = {};

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
						conf = JSON.parse(file);
						Object.assign(conf, opts);
						resolve(conf);
					}
				});
			}
		});
	});
};

var get = function get(name, question) {
	return new Promise(function(resolve, reject) {
		if (!name || typeof name !== 'string') {
			reject(new Error(`configuration: 'get' function takes at least one string parameter.`));
		}
		var property = conf[name];
		if (property !== undefined && typeof property === 'string') {
			resolve(property);
		} else if (property !== undefined && Array.isArray(property)) {
			subprocess.exec(property.join(' '), function(error, stdout, stderr) {
				if (error) {
					console.error(stderr);
					reject(error);
				} else {
					var result = stdout.trim();
					conf[name] = result;
					resolve(result);
				}
			});
		} else if (property === undefined) {
			if (question !== undefined && typeof question === 'string') {
				rl.question(question, (result) => {
					conf[name] = result;
					resolve(result);
				});
			} else {
				reject(new Error(`configuration: second parameter of 'get' function must be a string.`));
			}
		}
	});
};

export default {
	'load': load,
	'get': get
};
