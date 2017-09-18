/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

/** Represents a range of characters defined by a minimum and maximum
  * (inclusive) character code */
export default class CharRange {

	/** Minimum character code (inclusive) */
	public readonly min: number;

	/** Maximum character code (inclusive) */
	public readonly max: number;

	/** Range lower bound (inclusive) as a string */
	public get Min(): string {
		return String.fromCharCode(this.min);
	}

	/** Range upper bound (inclusive) as a string */
	public get Max(): string {
		return String.fromCharCode(this.max);
	}

	/** Constructs the object with its lower and upper bounds
	  * @param {number|string} min - lower bound (inclusive)
	  * @param {number|string} max - upper bound (inclusive)
	  * @throws {Error} Range min or max must be exactly one char long
	  */
	constructor(min: number|string, max: number|string) {
		if(typeof(min) === 'number') {
			this.min = min;
		} else {
			if(min.length === 1) {
				this.min = min.charCodeAt(0);
			} else {
				throw new Error('Range min \"${min}\" must be exactly one char long');
			}
		}
		if(typeof(max) === 'number') {
			this.max = max;
		} else {
			if(max.length === 1) {
				this.max = max.charCodeAt(0);
			} else {
				throw new Error('Range max \"${max}\" must be exactly one char long');
			}
		}
	}
}
