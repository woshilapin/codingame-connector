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
			return expect(login).to.eventually.be.fullfilled;
		});
		it(`should reject with incorrect password`, function() {
			let login = cgapi.login(credentialsnotok.username, credentialsnotok.password);
			return expect(login).to.eventually.be.rejected;
		});
	});
});
