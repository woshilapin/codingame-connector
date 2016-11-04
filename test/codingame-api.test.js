import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import nock from 'nock';

import cgapi from '../src/codingame-api.js';

let expect = chai.expect;
chai.use(chaiaspromised);

describe(`[module] codingame-api`, function() {
	describe(`[method] login`, function() {
		let credentialsok = {
			"username": `me`,
			"password": `p4ssw0rd`
		};
		let credentialsnotok = {
			"username": `me`,
			"password": `password`
		};
		let response = {
			"success": true
		};
		before(function() {
			nock(`https://www.codingame.com`)
			.post(`/services/CodingamerRemoteService/loginSiteV2`, [credentialsok.username, credentialsok.password, true])
			.reply(200, response)
			.post(`/services/CodingamerRemoteService/loginSiteV2`, [credentialsnotok.username, credentialsnotok.password, true])
			.reply(403);
		});
		after(function() {
			nock.cleanAll();
		})
		it(`should resolve with correct username and password`, function() {
			let login = cgapi.login(credentialsok.username, credentialsok.password);
			return expect(login).to.be.fulfilled;
		});
		it(`should reject with incorrect password`, function() {
			let login = cgapi.login(credentialsnotok.username, credentialsnotok.password);
			return expect(login).to.be.rejected;
		});
	});
	describe(`[method] test`, function() {
		let exercise = `5711567e959cf54dd2dd79c1b4c259560d6ba46`;
		let bundle = `print('1')`;
		let wrongbundle = `print('-1')`;
		let expected = `1`;
		let found = `-`;
		let language = `Python`;
		let testindex = 1;
		let body = [
			exercise,
			{
				"code": bundle,
				"programmingLanguageId": language,
				"multipleLanguages": {
					"testIndex": testindex
				}
			}
		];
		let meta = {
			"exercise": exercise,
			"test": testindex,
			"language": language,
			"bundle": bundle
		};
		after(function() {
			nock.cleanAll();
		});
		it(`should resolve when test succeeded`, function() {
			let success = {
				"comparison": {
					"success": true
				}
			};
			Object.assign(success, meta);
			let responsesuccess = {
				"success": success
			};
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, responsesuccess);
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.eventually.be.deep.equal(success);
		});
		it(`should reject when result of bundle is not the one expected`, function() {
			let failresult = {
				"comparison": {
					"success": false,
					"expected": expected,
					"found": found
				}
			};
			Object.assign(failresult, meta);
			let responsefailresult = {
				"success": failresult
			};
			let errorfailresult = new Error(`Expected <${expected}> but found <${found}>`);
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, responsefailresult);
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected.and.eventually.have.a.property(`message`, errorfailresult.message);
		});
		it(`should reject when bundle does not compile`, function() {
			let responsefailcompile = {
				"success":{
					"error": new Error(`Compilation error`)
				}
			};
			Object.assign(responsefailcompile, meta);
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, responsefailcompile);
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected;
		});
		it(`should reject because API may have change`, function() {
			let responsenewapi = {
				"newproperty": `results`
			};
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, responsenewapi);
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected;
		});
		it(`should reject because API may have change but still contains 'success' property`, function() {
			let responsenewapi = {
				"success": `results`
			};
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, responsenewapi);
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected;
		});
		it(`should reject because server returned an HTTP error code`, function() {
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(403, {});
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected;
		});
	});
});
