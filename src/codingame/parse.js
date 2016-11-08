/**
 * @file Module 'codingame/parse'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Parse response coming from Codingame's services
 * @module codingame/parse
 */
import CodingameError from './error.js';
import parse_failcompile from './parsers/failcompile.js';
import parse_failexpected from './parsers/failexpected.js';
import parse_success from './parsers/success.js';

let parsers = [];
parsers.push(parse_failcompile);
parsers.push(parse_failexpected);
parsers.push(parse_success);

/**
 * Parse response coming from tests sent to Codingame website
 *
 * @name parse
 * @function
 * @param {Object} response Body of the response
 * @returns {Promise<Object|CodingameError>} Resolve if test is a success, reject with a CodingameError if test failed or parsing was impossible
 */
let parse = function parse(response) {
	let body = response.success;
	for (let parser of parsers) {
		try {
			let promise = parser.parse(body);
			return Promise.resolve(promise); // Resume loop if not Error has been thrown
		} catch (error) {
			continue;
		}
	}
	let message = `Unknown error. Codingame may have changed its API.  Please contact 'codingame-connector' developer.`;
	let error = new Error(message);
	return Promise.reject(error);
};

export default {
	"parse": parse
};
