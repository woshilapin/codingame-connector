/**
 * @file Module 'codingame/parsers/failcompile'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Parse failed response from Codingame when test found a value different from the compile.
 *
 * The typical response in this case if of the following form.
 * ```json
 * {
 * 	"success": {
 * 		"error": {
 * 			message": `SyntaxError: EOL while scanning string literal`,
 * 			"stacktrace": [{
 * 				"location": `ANSWER`,
 * 				"container": `Answer.py`,
 * 				"function": ` not in a function`,
 * 				"line": 26
 * 			}]
 * 		}
 * 	}
 * }
 * ```
 * @module codingame/parsers/failcompile
 */
import CodingameError from '../error.js';

let name = `fail-compile`;

/**
 * Attempt to parse the body of a successful request to Codingame test API.
 * This function will try to map a response for a failed test because the compilation of bundle failed.
 *
 * @function parse
 * @param {Object} body Body of the response
 * @returns {Promise<CodingameError>} Reject with a CodingameError if parsing was successful
 * @throws {Error} Throw is parsing failed
 * @instance
 */
let parse = function parse(body) {
	try {
		let {
			"error": {
				"message": message,
				"stacktrace": stacktrace
			}
		} = body;
		if (Array.isArray(stacktrace)) {
			message += `\n`;
			for (let st of stacktrace) {
				message += `\t${st.container}:${st.line}:${st.function}`;
			}
			let error = new CodingameError(message);
			return Promise.reject(error);
		} else {
			throw `Stacktrace in the error should be an array`;
		}
	} catch(error) {
		let message = `The body is not of response type '${name}'\n`;
		message += error.message;
		throw new Error(message);
	}
};

export default {
	"name": name,
	"parse": parse
};
