/**
 * @file Module 'codingame/parsers/failexpected'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Parse failed response from Codingame when test found a value different from the expected.
 *
 * The typical response in this case if of the following form.
 * ```json
 * {
 * 	"success": {
 * 		"output": '43',
 * 		"comparison": {
 * 			"success": false,
 * 			"found": '43',
 * 			"expected": '42'
 * 		}
 * 	}
 * }
 * ```
 * @module codingame/parsers/failexpected
 */
import CodingameError from '../error.js';

let name = `fail-expected`;

/**
 * Attempt to parse the body of a successful request to Codingame test API.
 * This function will try to map a response for a failed test because of a unexpected result for the test.
 *
 * @function parse
 * @param {Object} body Body of the response
 * @returns {Promise<CodingameError>} Reject with a CodingameError if parsing was successful
 * @throws {Error} Throw is parsing failed
 * @instance
 */
let parse = (body) => {
	try {
		let {
			"output": output,
			"comparison": {
				"success": success,
				"expected": expected,
				"found": found
			}
		} = body;
		if (!success && expected !== undefined && found !== undefined) {
			let error = new CodingameError(`Expected <${body.comparison.expected}> but found <${body.comparison.found}>`);
			return Promise.reject(error);
		} else {
			throw `Success value should be false when expected and found properties are provided`;
		}
	} catch (error) {
		let message = `The body is not of response type '${name}'\n`;
		message += error.message;
		throw new Error(message);
	}
};

export default {
	"name": name,
	"parse": parse
};
