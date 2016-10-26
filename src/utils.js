import configure from './configure.js';
import cgapi from './codingame-api.js';

var kill = function kill(error) {
	console.error(`error: ${error.message}`);
	process.exit(-1);
};

var login = function login(tries) {
	if (tries === undefined || typeof tries !== 'number') {
		tries = 3;
	}
	return new Promise(function(resolve, reject) {
		var credentials = {};
		configure.get('username', 'login? ', { 'tryShell': true })
		.then(function(username) {
			credentials.username = username;
			return configure.get('password', 'password? ', { 'tryShell': true });
		})
		.then(function(password) {
			credentials.password = password;
			return cgapi.login(credentials.username, credentials.password);
		})
		.then(function(res) {
			if (!res.error) {
				resolve(res);
			} else {
				tries -= 1;
				if (tries > 0) {
					console.warn(`Unable to login (${tries} ${tries>1?'tries':'try'} remaining).`);
					configure.forget('username');
					configure.forget('password');
					resolve(login(tries));
				} else {
					reject(new Error('Unable to login.'))
				}
			}
		});
	});
};

export default {
	'kill': kill,
	'login': login
};
