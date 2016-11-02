import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import mockfs from 'mock-fs';

import configure from '../src/configure.js';

let expect = chai.expect;
chai.use(chaiaspromised);

describe(`[module] configure`, function() {
	describe(`[method] load`, function() {
		let defaultconfpath = `.codingamerc`;
		let defaultconf = {
			"username": `me`,
			"password": `somepass`,
			"exercise": `5711567e959cf54dd2dd79c1b4c259560d6ba46`,
			"tests": [1, 2],
			"language": `Python`,
			"bundle": `bundle.py`
		};
		before(function () {
			mockfs({
				[defaultconfpath]: JSON.stringify(defaultconf)
			});
		});
		after(function () {
			mockfs.restore();
		});

		it(`should return the content of file parsed as JSON`, function() {
			let conf = configure.load(defaultconfpath);
			return expect(conf).to.eventually.be.deep.equal(defaultconf);
		});

		it(`should return options if path is incorrect and options is defined`, function() {
			let conf = configure.load(undefined, defaultconf);
			return expect(conf).to.eventually.be.deep.equal(defaultconf);
		});
	});
});
