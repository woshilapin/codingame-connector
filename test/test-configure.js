import assert from 'assert';
import configure from '../src/configure.js';

describe(`[module] configure`, function() {
	describe(`[method] load`, function() {
		it(`should return options if path is incorrect and options is defined`, function(done) {
			let options = { "some": true };
			configure.load(undefined, options).then(function(conf) {
				assert.equal(conf, options);
				done();
			}, function(error) {
				done(error);
			})
		});
	});
});
