/**
 * @file Module 'codingame/parsers/frames'
 * @author woshilapin <woshilapin@tuziwo.info>
 */
/**
 * Parse response with frames from Codingame.
 *
 * The typical response in this case if of the following form.
 * ```json
 * {
 * 	"success": {
 * 		"frames": [{
 * 			"gameInformation": `Landing phase starting\nX=2500m, Y=2700m, HSpeed=0m/s VSpeed=0m/s\nFuel=550l, Angle=0°, Power=0 (0.0m/s2)\n`,
 * 			"view": ` 0\n7000 3000 3.711 1.0 1.0 1 0 4 -90 90\n20 40 10 20 DIRECT 15 1\n7\n0 100\n1000 500\n1500 1500\n3000 1000\n4000 150\n5500 150\n6999 800\n2500 2700 0 0 550 0 0\n`,
 * 			"keyframe": true
 * 		}],
 * 		"gameId": 154447808,
 * 		"scores": [ 1 ],
 * 		"metadata": {
 * 			"fuel": 0
 * 		}
 * 	}
 * }
 * ```
 * @module codingame/parsers/failexpected
 */
import colors from 'colors/safe';

import CodingameError from '../error.js';

let name = `frames`;

/**
 * Attempt to parse the body of a successful request to Codingame test API.
 * This function will try to map a response with frames.
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
			"frames": frames,
			"gameId": gameId,
			"scores": scores,
			"metadata": metadata
		} = body;
		if (Array.isArray(frames) && gameId !== undefined && Array.isArray(scores) && typeof metadata === `object`) {
			if (scores[0] === 1) {
				let message = frames[frames.length - 1].gameInformation;
				return Promise.resolve(message);
			} else {
				let message = ``;
				for(let frame of frames) {
					let gi = frame.gameInformation.trim();
					let pattern = /¤RED¤.*§RED§/.exec(gi);
					if (pattern !== null) {
						let r = colors.red(pattern);
						gi = gi.replace(pattern, r);
						gi = gi.replace(/(¤|§)RED\1/g, '');
					}
					message += gi;
					message += `\n\n`;
				}
				let error = new CodingameError(message.trim());
				return Promise.reject(error);
			}
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
