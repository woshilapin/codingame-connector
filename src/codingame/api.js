/**
 * @file Module 'codingame/api'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * API for Codingame's services
 * @module codingame/api
 */
import request from 'request';

import cgparse from './parse.js';
import CodingameError from './error.js';

/**
 * Codingame's API to log in
 *
 * @name login
 * @function
 * @param {string} username - The login to authenticate
 * @param {string} password - The password to authenticate
 * @returns {Promise<Object>} Body of the response
 * @memberof module:codingame/api
 * @instance
 */
let login = (username, password) => {
	return new Promise((resolve, reject) => {
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
		request(options, (error, response, body) => {
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
 * @param {string} exercise - Hash of the exercise to test
 * @param {number} test - Test's number
 * @param {string} language - Language of the program to send
 * @param {string} bundle - Content of the program to send
 * @returns {Promise<Object>} The result only if request succeed and test passed
 * @memberof module:codingame/api
 * @instance
 */
let test = (exercise, test, language, bundle) => {
	return new Promise((resolve, reject) => {
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
		request(options, (error, response, body) => {
			if (response.statusCode >= 400) {
				reject(error);
			} else {
				let meta = {
					"exercise": exercise,
					"test": test,
					"language": language,
					"bundle": bundle
				};
				cgparse.parse(body)
					.then((success) => {
						resolve(meta);
					}, (error) => {
						if (error instanceof CodingameError) {
							error.attach(meta);
						}
						reject(error);
					});
			}
		});
	});
};

export default {
	"login": login,
	"test": test
};
