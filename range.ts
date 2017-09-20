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
	  *
	  * If max is omitted, min is assumed.
	  */
	constructor(min: number|string, max?: number|string) {
		if(typeof(min) === 'number') {
			this.min = min;
		} else {
			if(min.length === 1) {
				this.min = min.charCodeAt(0);
			} else {
				throw new Error('Range min \"${min}\" must be exactly one char long');
			}
		}
		if(typeof(max) === 'undefined') {
			this.max = this.min;
		} else if(typeof(max) === 'number') {
			this.max = max;
		} else {
			if(max.length === 1) {
				this.max = max.charCodeAt(0);
			} else {
				throw new Error('Range max \"${max}\" must be exactly one char long');
			}
		}
	}

	/** Gets the number of characters in this range */
	public get size(): number {
		return this.max - this.min + 1;
	}

	/** Returns the sum of the sizes of an array of ranges
	  * @param {CharRange[]} r - ranges
	  * @return {number} Σ rⱼ.size for j := [0, r.length)
	  */
	public static sizeOf(r: CharRange[]): number {
		return r.reduce((a: number,c: CharRange): number => a + c.size, 0);
	}

	/** Returns the Unicode code point at the given index in the ranges
	  * @param {CharRange[]} r - ranges
	  * @param {number} index = index in the set of ranges
	  * @returns {number} Unicode code point
	  * @throws {Error} index is less than zero
	  *
	  * If index is greater than or equal to the size of the ranges then
	  * zero is returned.
	  */
	public static charCodeAt(r: CharRange[], index: number): number {
		if(index < 0) {
			throw new Error(`Invalid index: ${index}`);
		}
		for(let c of r) {
			let n: number = c.size;
			if(index < n) {
				return c.min + index;
			}
			index -= n;
		}
		return 0;
	}

	/** Returns the Unicode character at the given index in the ranges
	  * @param {CharRange[]} r - ranges
	  * @param {number} index = index in the set of ranges
	  * @returns {string} Unicode character
	  * @throws {Error} index is less than zero
	  *
	  * If index is greater than or equal to the size of the ranges then
	  * an empty string is returned.
	  */
	public static charAt(r: CharRange[], index: number): string {
		let c: number = CharRange.charCodeAt(r, index);
		if(c) {
			return String.fromCharCode(c);
		} else {
			return '';
		}
	}

	/** Determines the position of a code point in a set of character
	  * ranges
	  * @param {CharRange[]} r - ranges
	  * @param {number} c - code point
	  * @return {number} index of c in r or -1 if not in r
	  */
	public static indexOf(r: CharRange[], c: number): number {
		let index: number = 0;
		for(let ri: number = 0; ri < r.length; ++ri) {
			let rr: CharRange = r[ri];
			if(c >= rr.min && c <= rr.max) {
				return index + (c - rr.min);
			} else {
				index += rr.size;
			}
		}
		return -1;
	}
}
