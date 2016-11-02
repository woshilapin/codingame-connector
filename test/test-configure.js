import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import configure from '../src/configure.js';

let expect = chai.expect;
chai.use(chaiaspromised);

describe(`[module] configure`, function() {
	describe(`[method] load`, function() {
		it(`should return options if path is incorrect and options is defined`, function() {
			let options = { "some": true };
			let conf = configure.load(undefined, options);
			return expect(conf).to.eventually.be.deep.equal(options);
		});
	});
});
