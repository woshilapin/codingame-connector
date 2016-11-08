import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import nock from 'nock';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';

import cgapi from '../../src/codingame/api.js';
import cgparse from '../../src/codingame/parse.js';
import CodingameError from '../../src/codingame/error.js';

let expect = chai.expect;
chai.use(chaiaspromised);
chai.use(sinonchai);

describe(`[module] codingame/api`, function() {
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
		});
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
		let sandbox;
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});
		afterEach(function() {
			sandbox.restore();
			nock.cleanAll();
		});
		it(`should resolve with metadata if test has succeeded`, function() {
			let parse = sandbox.stub(cgparse, `parse`, function() {
				return Promise.resolve(meta);
			})
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, {});
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.fulfilled
				.and.to.eventually.be.deep.equal(meta);
		});
		it(`should reject with CodingameError if response is ok but test failed`, function() {
			let message = `Error message`;
			let parse = sandbox.stub(cgparse, `parse`, function() {
				let error = new CodingameError(message);
				return Promise.reject(error);
			})
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, {});
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected
				.and.to.eventually.be.an.instanceof(CodingameError);
		});
		it(`should reject with Error if parsing failed`, function() {
			let message = `Error message`;
			let parse = sandbox.stub(cgparse, `parse`, function() {
				let error = new Error(message);
				return Promise.reject(error);
			})
			nock(`https://www.codingame.com`)
				.post(`/services/TestSessionRemoteService/play`, body)
				.reply(200, {});
			let test = cgapi.test(exercise, testindex, language, bundle);
			return expect(test).to.be.rejected
				.and.to.eventually.be.an.instanceof(Error);
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
