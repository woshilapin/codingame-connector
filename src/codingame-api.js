import request from 'request';
import fs from 'fs';

let login = function login(username, password) {
	return new Promise(function(resolve, reject) {
		let options = {
			'method': 'POST',
			'baseUrl': 'https://www.codingame.com',
			'uri': '/services/CodingamerRemoteService/loginSiteV2',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=utf-8'
			},
			'body': [username, password, true],
			'jar': true,
			'json': true
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

let test = function test(exercise, test, language, bundle) {
	return new Promise(function(resolve, reject) {
		let options = {
			'method': 'POST',
			'baseUrl': 'https://www.codingame.com',
			'uri': '/services/TestSessionRemoteService/play',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json;charset=utf-8'
			},
			'body': [
				exercise,
				{
					'code': bundle,
					'programmingLanguageId': language,
					'multipleLanguages': {
						'testIndex': test
					}
				}
			],
			'jar': true,
			'json': true
		};
		request(options, function(error, response, body) {
			if (response.statusCode >= 400) {
				reject(error);
			} else {
				let meta = {
					'exercise': exercise,
					'test': test,
					'language': language,
					'bundle': bundle
				};
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
					}
				}
				let error = new Error(`Codingame may have change its API, contact owner of this application.`);
				Object.assign(error, meta);
				reject(error);
			}
		});
	});
};

export default {
	'login': login,
	'test': test
};
