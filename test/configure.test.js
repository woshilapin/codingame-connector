import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import mockfs from 'mock-fs';
import sinon from 'sinon';
import sinonchai from 'sinon-chai';
import mute from 'mute';

import readline from 'readline';

import configure from '../src/configure.js';

let expect = chai.expect;
chai.use(chaiaspromised);
chai.use(sinonchai);

describe(`[module] configure`, function() {
	describe(`[method] load`, function() {
		let defaultconfpath = `.codingamerc`;
		let incorrectconfpath = `.codingamerc.txt`;
		let defaultconf = {
			"username": `me`,
			"password": `somepass`,
			"exercise": `5711567e959cf54dd2dd79c1b4c259560d6ba46`,
			"tests": [1, 2],
			"language": `Python`,
			"bundle": `bundle.py`
		};
		before(function() {
			mockfs({
				[defaultconfpath]: JSON.stringify(defaultconf),
				[incorrectconfpath]: `This is not valid JSON!`
			});
		});
		after(function() {
			mockfs.restore();
		});
		afterEach(function() {
			for (let param in defaultconf) {
				configure.forget(param);
			}
		});

		it(`should return the content of file parsed as JSON`, function() {
			let conf = configure.load(defaultconfpath);
			return expect(conf).to.eventually.be.deep.equal(defaultconf);
		});

		it(`should reject because of incorrect file path`, function() {
			let conf = configure.load(`/incorrect/path/.codingamerc`);
			return expect(conf).to.eventually.be.rejected;
		});

		it(`should reject because of incorrect parsing of JSON`, function() {
			let conf = configure.load(incorrectconfpath);
			return expect(conf).to.eventually.be.rejected;
		})

		it(`should return options if path is incorrect and options is defined`, function() {
			let conf = configure.load(undefined, defaultconf);
			return expect(conf).to.eventually.be.deep.equal(defaultconf);
		});
	});
	describe(`[method] get`, function() {
		let filepath = `file.txt`;
		let filecontent = `Hello world!`
		let shellcmd = [`echo`, filecontent];
		let defaultconf = {
			"shell": shellcmd,
			"wrongshell": [`notacommand`],
			"path": filepath,
			"notapath": `/not/a/path`
		};
		let answer = `42`;
		before(function(done) {
			mockfs({
				[filepath]: filecontent
			});
			configure.load(undefined, defaultconf).then(function() {
				done();
			})
		});
		after(function() {
			mockfs.restore();
			for (let param in defaultconf) {
				configure.forget(param);
			}
		});
		let sandbox;
		let createInterface;
		beforeEach(function() {
			sandbox = sinon.sandbox.create()
			createInterface = sandbox.stub(readline, 'createInterface', function() {
				return {
					"question": function(question, cb) {
						cb(answer);
					},
					"close": function() {}
				};
			});
		});
		afterEach(function() {
			sandbox.restore();
		});
		it(`should return the string property as it is`, function() {
			let get = configure.get(`path`);
			return expect(get).to.eventually.be.equal(filepath);
		});
		it(`should return the array property as it is`, function() {
			let get = configure.get(`shell`);
			return expect(get).to.eventually.be.deep.equal(shellcmd);
		});
		it(`should return the result of the shell command`, function() {
			let get = configure.get(`shell`, `shell`);
			return expect(get).to.eventually.be.deep.equal(filecontent);
		});
		it(`should return the content of the file`, function() {
			let get = configure.get(`path`, `file`);
			return expect(get).to.eventually.be.deep.equal({
				"path": filepath,
				"data": filecontent
			});
		});
		it(`should return answer to the question`, function() {
			let ask = `ask something?`;
			let get = configure.get(`questionproperty`, ``, ask);
			expect(createInterface).to.be.calledOnce;
			return expect(get).to.eventually.be.equal(answer);
		});
		it(`should reject because property doesn't exist`, function() {
			let get = configure.get(`notaproperty`);
			return expect(get).to.eventually.be.rejected;
		});
		it(`should reject if first parameter is not a string`, function() {
			let get = configure.get(42);
			return expect(get).to.eventually.be.rejected;
		});
		it(`should reject if shell command is failing`, function() {
			let unmute = mute(process.stderr);
			let get = configure.get(`wrongshell`, `shell`);
			get.catch(unmute);
			return expect(get).to.eventually.be.rejected;
		});
		it(`should reject if file doesn't exist`, function() {
			let unmute = mute(process.stderr);
			let get = configure.get(`notapath`, `file`);
			get.catch(unmute);
			return expect(get).to.eventually.be.rejected;
		});
		it(`should reject if question is not a string`, function() {
			let get = configure.get(`incorrectquestionproperty`, ``, 42);
			expect(createInterface).to.be.calledOnce;
			return expect(get).to.eventually.be.rejected;
		});
	});
	describe(`[method] forget`, function() {
		let conf = {
			"property": `value`
		};
		before(function() {
			configure.load(undefined, conf);
		})
		it(`should forget about the parameter`, function() {
			configure.forget(`property`);
			let get = configure.get(`property`);
			return expect(get).to.eventually.be.rejected;
		});
		it(`should throw an error when the property is not a string`, function() {
			try {
				configure.forget(null);
			} catch(error) {
				return expect(error).to.be.an('error');
			}
			return expect(false).to.be.ok;
		});
	});
});
