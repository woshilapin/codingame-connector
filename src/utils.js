import configure from './configure.js';
import cgapi from './codingame-api.js';

let kill = function kill(error) {
	console.error(`error: ${error.message}`);
	process.exit(-1);
};

let login = function login(tries) {
	if (tries === undefined || typeof tries !== 'number') {
		tries = 3;
	}
	let credentials = {};
	return configure.get('username', 'shell', 'login? ')
	.then(function(username) {
		credentials.username = username;
		return configure.get('password', 'shell', 'password? ');
	})
	.then(function(password) {
		credentials.password = password;
		return cgapi.login(credentials.username, credentials.password);
	})
	.then(function(res) {
		if (!res.error) {
			return Promise.resolve(res);
		} else {
			tries -= 1;
			if (tries > 0) {
				console.warn(`Unable to login (${tries} ${tries>1?'tries':'try'} remaining).`);
				configure.forget('username');
				configure.forget('password');
				return Promise.resolve(login(tries));
			} else {
				return Promise.reject(new Error('Unable to login.'))
			}
		}
	});
};

let tests = function tests(exercise, tests, language, bundle) {
	let suite = Promise.resolve();
	let failed = false;
	let results = [];
	for (let test of tests) {
		suite = suite.then(function(result) {
			if (result !== undefined) {
				results.push(result);
			}
			return cgapi.test(exercise, test, language, bundle);
		}, function(error) {
			failed = true;
			return Promise.reject(error);
		});
		if (failed) {
			break;
		}
	}
	return suite
	.then(function(result) {
		results.push(result);
		return Promise.resolve(results);
	}, function(error) {
		results.push(error);
		return Promise.reject(results);
	});
};

export default {
	'kill': kill,
	'login': login,
	'tests': tests
};
