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
		it(`should resolve with last information when frames are arriving`, function() {
			let infos = `Landing phase starting\nX=2500m, Y=2700m, HSpeed=0m/s VSpeed=0m/s\nFuel=550l, Angle=0°, Power=0 (0.0m/s2)\n`;
			let stdout = `0 0`;
			let stderr = `debug information`;
			let view = ` 0\n7000 3000 3.711 1.0 1.0 1 0 4 -90 90\n20 40 10 20 DIRECT 15 1\n7\n0 100\n1000 500\n1500 1500\n3000 1000\n4000 150\n5500 150\n6999 800\n2500 2700 0 0 550 0 0\n`;
			let response = {
				"success": {
					"frames": [{
						"gameInformation": infos,
						"stdout": stdout,
						"stderr": stderr,
						"view": view,
						"keyframe": true
					}],
					"gameId": 154447808,
					"scores": [ 1 ],
					"metadata": {
						"fuel": 0
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.fulfilled
				.and.to.eventually.be.with.a.string(infos.trim())
					.and.with.a.string(stdout)
					.and.with.a.string(stderr);
		})
		it(`should reject when frames are arriving but score is 0`, function() {
			let subinfo = `Success: Mars Lander landed hard but Opportunity is ok!`;
			let infos = `¤GREEN¤${subinfo}§GREEN§\nX=2500m, Y=1167m, HSpeed=0m/s VSpeed=-47m/s\nFuel=456l, Angle=0°, Power=4 (4.0m/s2)\n`;
			let stdout = `0 0`;
			let stderr = `debug information`;
			let view = ` 0\n7000 3000 3.711 1.0 1.0 1 0 4 -90 90\n20 40 10 20 DIRECT 15 1\n7\n0 100\n1000 500\n1500 1500\n3000 1000\n4000 150\n5500 150\n6999 800\n2500 2700 0 0 550 0 0\n`;
			let response = {
				"success": {
					"frames": [{
						"gameInformation": infos,
						"stdout": stdout,
						"stderr": stderr,
						"view": view,
						"keyframe": true
					}],
					"gameId": 154447808,
					"scores": [ 0 ],
					"metadata": {
						"fuel": 0
					}
				}
			};
			let parse = cgparse.parse(response);
			return expect(parse).to.be.rejected
				.and.to.eventually.have.a.property(`message`)
					.with.string(subinfo)
					.and.with.a.string(stdout)
					.and.with.a.string(stderr);
		})
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
