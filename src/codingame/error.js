/**
 * @file Module 'codingame/error'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Error for Codingame API
 * @module codingame/error
 * @see {@link CodingameError}
 */

class CodingameError extends Error {
	/**
	 * Create an error for reporting Codingame test fails.
	 * Represents errors in a Codingame test which is not a technical error:
	 * - the test didn't pass
	 * - the bundle didn't compile
	 * - the objective of the problem has not been reached
	 * - etc.
	 * @extends Error
	 * @constructs CodingameError
	 * @param {string|Error} error - The message or the parent Error
	 */
	constructor(error) {
		if (typeof error === `string`) {
			super(error);
		} else if (error instanceof Error) {
			super(error.message);
			this.stacktrace = error.stacktrace;
		} else {
			super();
		}
		this.name = `CodingameError`;
	};

	/**
	 * Attach some random metadata to the error, preserving `name` and `message` properties
	 * @method attach
	 * @param {Object} metadata - Some random object
	 * @memberof CodingameError
	 * @instance
	 */
	attach(metadata) {
		let copy = metadata;
		delete copy.name;
		delete copy.message;
		Object.assign(this, copy);
	};
}

export default CodingameError;
