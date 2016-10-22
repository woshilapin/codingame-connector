import request from 'request';
import fs from 'fs';

var login = function login(username, password) {
	return new Promise(function(resolve, reject) {
		var options = {
			'method': 'POST',
			'baseUrl': 'https://www.codingame.com',
			'uri': '/services/CodingamerRemoteService/loginSiteV2',
			'headers': {
				'Accept': 'application/json, text/plain, */*',
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

var check = function check(exo_hash, test_index, language, file) {
	return new Promise(function(resolve, reject) {
		fs.readFile(file, 'utf8', function(error, code) {
			var options = {
				'method': 'POST',
				'baseUrl': 'https://www.codingame.com',
				'uri': '/services/TestSessionRemoteService/play',
				'headers': {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json;charset=utf-8'
				},
				'body': [
					exo_hash,
					{
						'code': code,
						'programmingLanguageId': language,
						'multipleLanguages': {
							'testIndex': test_index
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
					resolve(body);
				}
			});
		});
	});
};

export default {
	'login': login,
	'check': check
};
