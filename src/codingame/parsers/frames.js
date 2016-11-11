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
 * 			"stdout": "0 0",
 * 			"stderr": "debug: speed 0",
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
 * Replace coloring tags from Codingame with ANSI colors for terminal
 *
 * @name colorize
 * @function
 * @param {String} message Input message with Codingame formatting
 * @returns {String} Output message with ANSI coloring format
 */
let colorize = function colorize(message) {
	const colorlist = `(RED|GREEN)`;
	const beginchar = `¤`;
	const endchar = `§`;
	let regexp = new RegExp(`${beginchar}${colorlist}${beginchar}(.*)${endchar}${colorlist}${endchar}`)
	let pattern = regexp.exec(message);
	if (pattern !== null) {
		let text = pattern[0];
		let color = pattern[1].toLowerCase();
		let subtext = pattern[2];
		message = message.replace(text, colors[color](subtext))
	}
	return message;
};

/**
 * Format the display of game frames
 *
 * @name formatFrames
 * @function
 * @param {Array} frames List of frames to display
 * @returns {String} Formatted string to display information about the frames
 */
let formatFrames = function formatFrames(frames) {
	let message = ``;
	for(let frame of frames) {
		let {
			"gameInformation": gameInformation,
			"stdout": stdout,
			"stderr": stderr,
			"view": view,
			"keyframe": keyframe
		} = frame;
		if (stdout !== undefined) {
			message += colors.bold(`Standard Output\n`);
			message += stdout.trim();
			message += `\n\n`;
		}
		if (stderr !== undefined) {
			message += colors.bold(`Standard Error\n`);
			message += colors.red(stderr.trim());
			message += `\n\n`;
		}
		message += colors.bold(`Game Information\n`);
		message += colorize(gameInformation.trim());
		message += `\n\n`;
		console.log(message);
	}
	return message;
};

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
			let message = formatFrames(frames);
			if (scores[0] === 1) {
				return Promise.resolve(message.trim());
			} else {
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
