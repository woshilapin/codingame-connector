/**
 * @file Module 'codingame/parsers/success'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Parse successful response from Codingame when test pass.
 *
 * The typical response in this case if of the following form.
 * ```json
 * {
 * 	success: {
 * 		"output": output,
 * 		"comparison": {
 * 			"success": true
 * 		}
 * 	}
 * }
 * ```
 * @module codingame/parsers/success
 */

let name = `success`;

/**
 * Attempt to parse the body of a successful request to Codingame test API.
 * This function will try to map a response for a successful test.
 *
 * @function parse
 * @param {Object} body Body of the response
 * @returns {Promise<string>} Resolve with the successful result value
 * @throws {Error} Throw is parsing failed
 * @instance
 */
let parse = (body) => {
	try {
		let {
			"output": output,
			"comparison": {
				"success": success
			}
		} = body;
		if (success) {
			return Promise.resolve(output);
		} else {
			throw `Success property must be true`;
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
