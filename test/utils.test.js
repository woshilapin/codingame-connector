import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import mockfs from 'mock-fs';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';
import mute from 'mute';

import cgapi from '../src/codingame-api.js';
import configure from '../src/configure.js';

import utils from '../src/utils.js';

let expect = chai.expect;
chai.use(chaiaspromised);
chai.use(sinonchai);

describe(`[module] utils`, function() {
	describe(`[method] kill`, function() {
		let exit;
		beforeEach(function() {
			exit = sinon.stub(process, `exit`);
		});
		afterEach(function() {
			exit.restore();
		});
		it(`should call process.exit with an negative value`, mute(function() {
			let message = `Some error message`;
			utils.kill(new Error(message));
			expect(exit).to.have.been.calledOnce;
			expect(exit.getCall(0).args[0]).to.be.below(0);
		}));
	});
	describe(`[method] login`, function() {
		let login;
		let get;
		afterEach(function() {
			login.restore();
			get.restore();
		});
		it(`should resolve if login is successfull`, function() {
			login = sinon.stub(cgapi, `login`, function() {return Promise.resolve(true)});
			get = sinon.stub(configure, `get`, function(property) {return Promise.resolve(property);});
			let log = utils.login(`username`, `password`)
			let calls = log.then(function() {
				expect(login).to.have.been.calledOnce;
				expect(get).to.have.been.calledTwice;
				return Promise.resolve(true);
			});
			return Promise.all([
				expect(log).to.eventually.be.fullfilled,
				calls
			]);
		});
		it(`should reject after 3 tries if authentication failed`, mute(function() {
			login = sinon.stub(cgapi, `login`, function() {
				return Promise.resolve({
					"error": new Error(`Cannot authenticate`)
				});
			});
			get = sinon.stub(configure, `get`, function(property) {return Promise.resolve(property);});
			let log = utils.login(`username`, `password`)
			let calls = log.catch(function() {
				expect(login).to.have.been.calledThrice;
				return Promise.resolve(true);
			});
			return Promise.all([
				expect(log).to.eventually.be.rejected,
				calls
			]);
		}));
	});
	describe(`[method] tests`, function() {
	});
});
