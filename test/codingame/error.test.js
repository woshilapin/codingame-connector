import chai from 'chai';

import CodingameError from '../../src/codingame/error.js';

let expect = chai.expect;

describe(`[module] codingame/error`, function() {
	describe(`[method] constructor`, function() {
		it(`should create a default CodingameError with empty message`, function() {
			let error = new CodingameError();
			expect(error).to.be.an.instanceof(CodingameError).and.has.a.property(`message`).empty;
		});
		it(`should create a CodingameError with the specified message`, function() {
			let message = `Specified message`;
			let error = new CodingameError(message);
			expect(error).to.be.an.instanceof(CodingameError).and.has.a.property(`message`, message);
		});
		it(`should create a CodingameError from an Error`, function() {
			let message = `Some error`;
			let error = new Error(message);
			let cgerror = new CodingameError(error);
			expect(cgerror).to.be.an.instanceof(CodingameError).and.has.a.property(`message`, message);
		});
	});
	describe(`[method] metadata`, function() {
		it(`should attach metadatas to the CodingameError`, function() {
			let value = `42`;
			let meta = { "property": value };
			let error = new CodingameError();
			error.attach(meta);
			expect(error).to.have.a.property(`property`, value);
		});
		it(`should not replace 'name' and 'message' properties`, function() {
			let value = 42;
			let meta = {
				"name": `myname`,
				"message": `Not an error message`
			};
			let message = `Error message`;
			let error = new CodingameError(message);
			error.attach(meta);
			expect(error).to.have.a.property(`name`, `CodingameError`);
			expect(error).to.have.a.property(`message`, message);
		});
	});
});
