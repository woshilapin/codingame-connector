import chai from 'chai';
import chaiaspromised from 'chai-as-promised';

import cgparse from '../../src/codingame/parse.js';
import CodingameError from '../../src/codingame/error.js';

let expect = chai.expect;
chai.use(chaiaspromised);

describe(`[module] codingame/parse`, function() {
	describe(`[method] parse`, function() {
		it(`should succeed with a successful response and a successful test`, function() {
			let output = `42`;
			let response = {
				success: {
					"output": output,
					"comparison": {
						"success": true
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.fulfilled
				.and.to.eventually.be.equal(output);
		});
		it(`should reject if success-like response is malformed`, function() {
			let output = `42`;
			let response = {
				success: {
					"output": output,
					"comparison": {
						"success": false
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.be.an.instanceof(Error);
		});
		it(`should reject when found value is not the expected one`, function() {
			let expected = `42`;
			let found = `43`;
			let response = {
				"success": {
					"output": found,
					"comparison": {
						"success": false,
						"found": found,
						"expected": expected
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.be.an.instanceof(CodingameError)
				.and.to.have.property(`message`)
					.with.string(expected)
					.and.with.string(found);
		});
		it(`should reject if expected-like response is malformed`, function() {
			let found = `43`;
			let response = {
				"success": {
					"output": found,
					"comparison": {
						"success": false,
						"found": found
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.be.an.instanceof(Error);
		});
		it(`should reject when bundle cannot compile`, function() {
			let message = `SyntaxError: EOL while scanning string literal`;
			let stacktrace = [{
				"location": `ANSWER`,
				"container": `Answer.py`,
				"function": ` not in a function`,
				"line": 26
			}];
			let response = {
				"success": {
					"error": {
						"message": message,
						"stacktrace": stacktrace
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.be.an.instanceof(CodingameError)
				.and.to.have.property(`message`)
				.with.string(message);
		});
		it(`should reject with an error when compile-like response is malformed`, function() {
			let message = `SyntaxError: EOL while scanning string literal`;
			let stacktrace = {
				"location": `ANSWER`,
				"container": `Answer.py`,
				"function": ` not in a function`,
				"line": 26
			};
			let response = {
				"success": {
					"error": {
						"message": message,
						"stacktrace": stacktrace
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.be.an.instanceof(Error)
				.and.to.have.property(`message`);
		});
		it(`should reject with an error when fail to parse the response`, function() {
			let response = { "fakeproperty": false };
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.be.an.instanceof(Error)
				.and.to.have.property(`message`);
		});
	});
});
