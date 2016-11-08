/**
 * @file Module 'utils'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Some utils for Codingame's connector
 * @module utils
 */
import configure from './configure.js';
import cgapi from './codingame-api.js';

/**
 * Display the error and kill the program
 *
 * @name kill
 * @function
 * @param {Error} error The error that caused the problem
 * @memberof module:utils
 * @instance
 */
let kill = function kill(error) {
	console.error(`error: ${error.message}`);
	process.exit(-1);
};

/**
 * Log in Codingame website
 *
 * @name login
 * @function
 * @param {number} tries Number of tries before returning an error
 * @returns {Promise<Object>} The response from the server
 * @memberof module:utils
 * @instance
 */
let login = function login(tries) {
	if (tries === undefined || typeof tries !== `number`) {
		tries = 3;
	}
	let credentials = {};
	return configure.get(`username`, `shell`, `login? `)
	.then(function(username) {
		credentials.username = username;
		return configure.get(`password`, `shell`, `password? `);
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
				console.warn(`Unable to login (${tries} ${tries>1?`tries`:`try`} remaining).`);
				configure.forget(`username`);
				configure.forget(`password`);
				return Promise.resolve(login(tries));
			} else {
				return Promise.reject(new Error(`Unable to login.`));
			}
		}
	});
};

/**
 * Launch the test suite on Codingame
 *
 * @name tests
 * @function
 * @param {Object} parameters Parameters defining the test to launch
 * @param {string} parameters.exercise Hash of the exercise to test
 * @param {Array} parameters.tests The list of test's numbers
 * @param {string} parameters.language The language of the bundle to send
 * @param {string} parameters.bundle Content of the program to send
 * @returns {Promise<Array>} All results; or in case of error, all results until error + the error as last element of the array
 * @memberof module:utils
 * @instance
 */
let tests = async function* tests({
	"exercise": exercise,
	"tests": tests,
	"language": language,
	"bundle": bundle
}) {
	for (let test of tests) {
		yield await cgapi.test(exercise, test, language, bundle);
	}
};

export default {
	"kill": kill,
	"login": login,
	"tests": tests
};
