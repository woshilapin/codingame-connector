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
		it(`should call process.exit with an negative value`, function() {
			let exit = sandbox.stub(process, `exit`);
			let message = `Some error message`;
			let unmute = mute(process.stderr);
			utils.kill(new Error(message));
			unmute();
			expect(exit).to.have.been.calledOnce;
			expect(exit.getCall(0).args[0]).to.be.below(0);
		});
	});
	describe(`[method] login`, function() {
		let sandbox;
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		})
		afterEach(function() {
			sandbox.restore();
		});
		it(`should resolve if login is successful`, function() {
			let login = sandbox.stub(cgapi, `login`, function() {return Promise.resolve(true)});
			let get = sandbox.stub(configure, `get`, function(property) {return Promise.resolve(property);});
			let log = utils.login(`username`, `password`)
			let calls = log.then(function() {
				expect(login).to.have.been.calledOnce;
				expect(get).to.have.been.calledTwice;
				return Promise.resolve(true);
			});
			return Promise.all([
				expect(log).to.be.fulfilled,
				calls
			]);
		});
		it(`should reject after 3 tries if authentication failed`, function() {
			let login = sandbox.stub(cgapi, `login`, function() {
				return Promise.resolve({
					"error": new Error(`Cannot authenticate`)
				});
			});
			let get = sandbox.stub(configure, `get`, function(property) {return Promise.resolve(property);});
			let unmute = mute(process.stderr);
			let log = utils.login(`username`, `password`)
			let calls = log.catch(function() {
				unmute();
				expect(login).to.have.been.calledThrice;
				return Promise.resolve(true);
			});
			return Promise.all([
				expect(log).to.be.rejectedWith(Error),
				calls
			]);
		});
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
			expect(test).to.have.been.calledThrice;
		});
	});
});
