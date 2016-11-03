/**
 * @file Module 'codingame-api'
 * @author woshilapin <woshilapin@tuziwo.info>
 * @version 0.3.0
 */
/**
 * API for Codingame's services
 * @module codingame-api
 */
import request from 'request';

/**
 * Codingame's API to log in
 *
 * @name login
 * @function
 * @param {string} username The login to authenticate
 * @param {string} password The password to authenticate
 * @returns {Promise<Object>} Body of the response
 * @memberof module:codingame-api
 * @instance
 */
let login = function login(username, password) {
	return new Promise(function(resolve, reject) {
		let options = {
			"method": `POST`,
			"baseUrl": `https://www.codingame.com`,
			"uri": `/services/CodingamerRemoteService/loginSiteV2`,
			"headers": {
				"Accept": `application/json`,
				"Content-Type": `application/json;charset=utf-8`
			},
			"body": [username, password, true],
			"jar": true,
			"json": true
		};
		request(options, function(error, response, body) {
			if (response.statusCode >= 400) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});
};

/**
 * Codingame's API for launching a test
 *
 * @name test
 * @function
 * @param {string} exercise Hash of the exercise to test
 * @param {number} test Test's number
 * @param {string} language Language of the program to send
 * @param {string} bundle Content of the program to send
 * @returns {Promise<Object>} The result only if request succeed and test passed
 * @memberof module:codingame-api
 * @instance
 */
let test = function test(exercise, test, language, bundle) {
	return new Promise(function(resolve, reject) {
		let options = {
			"method": `POST`,
			"baseUrl": `https://www.codingame.com`,
			"uri": `/services/TestSessionRemoteService/play`,
			"headers": {
				"Accept": `application/json`,
				"Content-Type": `application/json;charset=utf-8`
			},
			"body": [
				exercise,
				{
					"code": bundle,
					"programmingLanguageId": language,
					"multipleLanguages": {
						"testIndex": test
					}
				}
			],
			"jar": true,
			"json": true
		};
		request(options, function(error, response, body) {
			if (response.statusCode >= 400) {
				reject(error);
			} else {
				let meta = {
					"exercise": exercise,
					"test": test,
					"language": language,
					"bundle": bundle
				};
				let error = new Error(`Codingame may have changed its API, contact owner of this application.`);
				Object.assign(error, meta);
				if (body.success !== undefined) {
					if (body.success.comparison !== undefined) {
						if(body.success.comparison.success) {
							Object.assign(body.success, meta);
							resolve(body.success);
						} else {
							let error = new Error(`Expected <${body.success.comparison.expected}> but found <${body.success.comparison.found}>`);
							Object.assign(error, meta);
							reject(error);
						}
					} else if (body.success.error !== undefined) {
						Object.assign(body.success.error, meta);
						reject(body.success.error);
					} else {
						reject(error);
					}
				}
				reject(error);
			}
		});
	});
};

export default {
	"login": login,
	"test": test
};
