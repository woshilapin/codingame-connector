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
		let sandbox;
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});
		afterEach(function() {
			sandbox.restore();
		});
		it(`should call process.exit with an negative value`, mute(function() {
			let exit = sandbox.stub(process, `exit`);
			let message = `Some error message`;
			utils.kill(new Error(message));
			expect(exit).to.have.been.calledOnce;
			expect(exit.getCall(0).args[0]).to.be.below(0);
		}));
	});
	describe(`[method] login`, function() {
		let sandbox;
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		})
		afterEach(function() {
			sandbox.restore();
		});
		it(`should resolve if login is successfull`, function() {
			let login = sinon.stub(cgapi, `login`, function() {return Promise.resolve(true)});
			let get = sinon.stub(configure, `get`, function(property) {return Promise.resolve(property);});
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
			let login = sandbox.stub(cgapi, `login`, function() {
				return Promise.resolve({
					"error": new Error(`Cannot authenticate`)
				});
			});
			get = sandbox.stub(configure, `get`, function(property) {return Promise.resolve(property);});
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
		let sandbox;
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});
		afterEach(function() {
			sandbox.restore();
		});
		it(`should yield a result for each of the 3 tests`, async function() {
			let parameters = {
				"exercise": `aaa`,
				"tests": [1, 2, 3],
				"language": `Python`,
				"bundle": `print('Hello world!')`
			};
			let test = sandbox.stub(cgapi, `test`, function() {return Promise.resolve(true)});
			for await (let result of utils.tests(parameters)) {
				expect(result).to.have.be.ok;
			}
			expect(test).to.have.callCount(3);
		});
	});
});
