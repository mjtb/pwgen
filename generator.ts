/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import * as bigInt from 'big-integer';
import CharRange from './range';
import ComplexityConstraint from './constraint';
import { UnicodeCategory, unicodeCategorySymbolOf, unicodeCategoryFromSymbol, unicodeCategoryOf } from './category';

interface CategoryCounts { [name: string]: number } ;

/** Represents a password generator
  * @class
  */
export default class Generator {

	/** Name of the generator */
	public readonly name: string;

	/** Allowed characters */
	public readonly ranges: CharRange[];

	/** Restricted set of characters allowed for the first one */
	public readonly first?: CharRange[];

	/** Optional complexity constraints */
	private readonly constraints?: ComplexityConstraint[];

	/** Constructs the generator with a given name
	  * @param {string} name - name of the generator
	  * @param {CharRange[]} ranges - allowed characters
	  * @param {ComplexityConstraint[]} constraints - complexity
	  *                                 constraints (optional)
	  * @param {CharRange[]} first - characters allowed for the first
	  *                              one (optional, if different from
      *                              any other letter)
	  */
	constructor(name: string, ranges: CharRange[], constraints?: ComplexityConstraint[], first?: CharRange[]) {
		this.name = name;
		this.ranges = ranges;
		this.constraints = constraints;
		this.first = first;
	}

	private static toLittleEndingArray(buf: Uint8Array): number[] {
		let bv: number[] = [];
		for(let x of buf) {
			bv.unshift(Number(x));
		}
		return bv;
	}

	private static toAbsoluteValue(bv: number[]): number[] {
		if(bv[0] >= 0x80) {
			for(let xi: number = 0; xi < bv.length; ++xi) {
				bv[xi] = (255 & ~bv[xi]);
			}
			let carry: boolean = true;
			for(let xi: number = bv.length - 1; carry && xi >= 0; --xi) {
				let n: number = bv[xi] + 1;
				if(n > 255) {
					bv[xi] = 0;
				} else {
					bv[xi] = n;
					carry = false;
				}
			}
			if(carry) {
				bv.unshift(1);
			}
		}
		return bv;
	}

	/** Converts a byte array to a BigInteger in little endian order
	  * @param {Uint8Array} buf = array of bytes
	  * @return {bigInt.BigInteger} big integer
	  * The bytes of buf are treated as one big integer in little endian
	  * order. If that big integer has its high bit set, it is two's
	  * complement negated so that the returned value is always as
	  * positive integer.
	  */
	public static toBigInteger(buf: Uint8Array): bigInt.BigInteger {
		return bigInt.fromArray(Generator.toAbsoluteValue(Generator.toLittleEndingArray(buf)), 256);
	}

	/** Splits a byte array into an array of small numbers
	  * @param {Uint8Array} buf - array of bytes
	  * @param {number} count - number of numbers to produce
	  * @param {number} modulus - range of numbers to produce
	  * @param {number} first - optional range of first number to
	  *                         produce if different
	  * @return {number[]} array of small numbers
	  */
	public static partition(buf: Uint8Array, count: number, modulus: number, first?: number): number[] {
		let i: bigInt.BigInteger = Generator.toBigInteger(buf);
		let b: number, j: number, f: number;
		let g: bigInt.BigInteger;
		let c: string;
		let rv: number[] = [];
		if(first) {
			g = bigInt(first);
			let dm: { quotient: bigInt.BigInteger, remainder: bigInt.BigInteger } = i.divmod(g);
			i = dm.quotient;
			j = dm.remainder.toJSNumber();
			rv.push(j);
			--count;
		}
		g = bigInt(modulus);
		while (count > 0) {
			let dm: { quotient: bigInt.BigInteger, remainder: bigInt.BigInteger } = i.divmod(g);
			i = dm.quotient;
			j = dm.remainder.toJSNumber();
			rv.push(j);
			--count;
		}
		return rv;
	}

	/** Partitions the given byte array into smaller encoding units
	  * @param {Uint8Array} buf = byte array
	  * @return {number[]} partitioning
	  * The numbers returned are clamed to the range [0,n) where n
	  * is the size of the character ranges allowed for this generator.
	  */
	public partition(buf: Uint8Array): number[] {
		return Generator.partition(buf, this.lengthOf(buf.length * 8), CharRange.sizeOf(this.ranges), this.first ? CharRange.sizeOf(this.first) : undefined);
	}

	/** Computes the length of a password needed for the given size of
	  * entropy
	  * @param {number} bits - sizeof entropy
	  * @return {number} length (in characters) of the password that has
	  *                  sufficient entropy
	  */
	public lengthOf(bits: number): number {
		let fs: number|undefined = this.first ? CharRange.sizeOf(this.first) : undefined;
		let cnt: number = 0;
		if(fs) {
			bits -= Math.log2(fs);
			++cnt;
		}
		let rs: number = Math.log2(CharRange.sizeOf(this.ranges));
		cnt += Math.trunc(Math.ceil(bits / rs));
		return cnt;
	}

	/** Encodes bytes of entropy into a password according to this
	  * generator's ranges but does not ensure that it conforms to
	  * its complexity constraints
	  * @param {Uint8Array} buf - bytes of entropy
	  * @return {string} encoded password
	  */
	public encode(buf: Uint8Array): string {
		let ar: number[] = this.partition(buf);
		let rv: string = '';
		if(this.first) {
			rv += CharRange.charAt(this.first, ar[0]);
			ar.shift();
		}
		for(let i: number = 0; i < ar.length; ++i) {
			rv += CharRange.charAt(this.ranges, ar[i]);
		}
		return rv;
	}

	/** Encodes bytes of entropy into a password according to this
	  * generator's ranges and ensures that it conforms to its
	  * complexity constraints
	  * @param {Uint8Array} buf - bytes of entropy
	  * @return {string} encoded password
	  */
	public generate(buf: Uint8Array): string {
		return this.makeAcceptable(this.encode(buf));
	}

	/** Counts the number of characters for each Unicode category
	  * in a string or array of characters
	  * @param {string|string[]} s - string or character array
	  * @return {CategoryCounts} map of category → count
	  */
	public static countCategories(s: string|string[]): CategoryCounts {
		let buf: string[];
		if(typeof(s) === 'string') {
			buf = s.split('');
		} else {
			buf = s;
		}
		let counts: CategoryCounts = {};
		for(let i: number = 0; i < buf.length; ++i) {
			let cat: UnicodeCategory = unicodeCategoryOf(buf[i]);
			let key: string = unicodeCategorySymbolOf(cat);
			if(key in counts) {
				counts[key] = counts[key] + 1;
			} else {
				counts[key] = 1;
			}
		}
		return counts;
	}

	/** Checks that a password satisfies all of this generator's
	  * complexity constraints
	  * @param {string} s - password to checks
	  * @return {boolean} true if this password is acceptable
	  */
	public isAcceptable(s: string): boolean {
		let buf: string[] = s.split('');
		if(this.first) {
			if(CharRange.indexOf(this.first, buf[0].charCodeAt(0)) < 0) {
				return false;
			}
		}
		for(let i: number = this.first ? 1 : 0; i < buf.length; ++i) {
			if(CharRange.indexOf(this.ranges, buf[i].charCodeAt(0)) < 0) {
				return false;
			}
		}
		if(!this.constraints) {
			return true;
		}
		let counts: CategoryCounts = Generator.countCategories(buf);
		for(let c of this.constraints) {
			let key: string = unicodeCategorySymbolOf(c.category);
			let substitutes: string|undefined = Generator.substitutes(c.category);
			let count: number = (key in counts) ? counts[key] : 0;
			if(substitutes && (c.count > 0) && (count < c.count)) {
				return false;
			}
		}
		return true;
	}

	/** Hashes a string or array of characters using a platform
	  * invariant algorithm
	  * @param {string|string[]} s - string or character array
	  * @return {number} hash code
	  * The hash code is guaranteed to be over the range [0,0x7FFFFFFF].
	  */
	public static hashOf(s: string|string[]): number {
		let buf: string[];
		if(typeof(s) === 'string') {
			buf = s.split('');
		} else {
			buf = s;
		}
		let hash: number = 0x6E25B2B1; // an arbitrary prime number
		for(let i: number = 0; i < buf.length; ++i) {
			hash = ((hash << 19) | ((hash >> 13) & 0x7FFFF)) ^ buf[i].charCodeAt(0);
		}
		return hash & 0x7FFFFFFF;
	}

	/** Ensures an encoded password meets this generator's complexity
	  * constraints by replacing zero or more characters in the string
	  * @param {string} s - string to make acceptable
	  * @return {string} password conforming to complexity constraints
	  */
	public makeAcceptable(s: string): string {
		if(!this.constraints) {
			return s;
		}
		let buf: string[] = s.split('');
		let hash: number = Generator.hashOf(buf);
		// First, make sure every character in the string is in the
		// valid character ranges
		if(this.first) {
			if(CharRange.indexOf(this.first, buf[0].charCodeAt(0)) < 0) {
				buf[0] = String.fromCharCode(CharRange.charCodeAt(this.first, hash % CharRange.sizeOf(this.first)));
				hash = 0x7FFFFFFF & ((hash << 19) | ((hash >> 13) & 0x7FFFF));
			}
		}
		for(let i: number = this.first ? 1 : 0; i < buf.length; ++i) {
			if(CharRange.indexOf(this.ranges, buf[i].charCodeAt(0)) < 0) {
				buf[i] = String.fromCharCode(CharRange.charCodeAt(this.ranges, hash % CharRange.sizeOf(this.ranges)));
				hash = 0x7FFFFFFF & ((hash << 19) | ((hash >> 13) & 0x7FFFF));
			}
		}
		hash = Generator.hashOf(buf);
		let counts: CategoryCounts = Generator.countCategories(buf);
		// Go through each constraint and ensure that it is satisfied
		for(let c of this.constraints) {
			let key: string = unicodeCategorySymbolOf(c.category);
			let substitutes: string|undefined = Generator.substitutes(c.category);
			let count = (key in counts) ? counts[key] : 0;
			if(!substitutes || (c.count < 1) || (count >= c.count)) {
				continue; // already satisifed
			}
			// Find the category cat which is in greatest surplus
			let cat: UnicodeCategory = c.category;
			let surplus: number = -1;
			for(let x in counts) {
				let xcat: UnicodeCategory|undefined = unicodeCategoryFromSymbol(x);
				if(typeof(xcat) === 'undefined') {
					continue;
				}
				if(xcat !== c.category) {
					let xy: ComplexityConstraint|undefined = this.constraints.find((y) => y.category === xcat);
					let s: number = counts[x] - (xy ? xy.count : 0);
					if(s > surplus) {
						cat = xcat;
						surplus = s;
					}
				}
			}
			if(surplus < 1) {
				// No category is in surplus, so find one that is unconstrained
				surplus = -1;
				for(let x in counts) {
					let xcat: UnicodeCategory|undefined = unicodeCategoryFromSymbol(x);
					if(typeof(xcat) === 'undefined') {
						continue;
					}
					let xy: ComplexityConstraint|undefined = this.constraints.find((y) => y.category === xcat);
					if(xy) {
						continue;
					}
					let s: number = counts[x];
					if(s > surplus) {
						cat = xcat;
						surplus = s;
					}
				}
			}
			// Substitute the nth occurrance of a character in category
			// cat with a character from the substitutes set
			let catkey: string = unicodeCategorySymbolOf(cat);
			let nth: number = hash % counts[catkey];
			for(let i: number = 0; i < buf.length; ++i) {
				if(unicodeCategoryOf(buf[i]) === cat) {
					if(nth === 0) {
						if(i > 0) {
							let xn: string = buf[i];
							let si: number = hash % substitutes.length;
							let cn: string = substitutes.charAt(si);
							buf[i] = cn;
							break;
						}
					} else {
						--nth;
					}
				}
			}
			counts[catkey] = counts[catkey] - 1;
			if(key in counts) {
				counts[key] = counts[key] + 1;
			} else {
				counts[key] = 1;
			}
			hash = 0x7FFFFFFF & ((hash << 19) | ((hash >> 13) & 0x7FFFF));
		}
		// In certain scenarios it is still possible for a constraint
		// to be left unsatisified using the steps above, particularly
		// in the case of the xml:id and Nmtoken generators which
		// have large character ranges (so more bits per character and
		// fewer characters in total) and have first-character constraints.
		// In the case, keep appending characters until all constraints
		// are met.
		counts = Generator.countCategories(buf);
		for(let c of this.constraints) {
			let key: string = unicodeCategorySymbolOf(c.category);
			let substitutes: string|undefined = Generator.substitutes(c.category);
			let count = (key in counts) ? counts[key] : 0;
			if(!substitutes || (c.count < 1) || (count >= c.count)) {
				continue;
			}
			while(count < c.count) {
				buf.push(substitutes.charAt(hash % substitutes.length));
				hash = 0x7FFFFFFF & ((hash << 19) | ((hash >> 13) & 0x7FFFF));
				++count;
			}
		}
		return buf.join('');
	}

	/** Gets the ASCII subset of a simpified set of Unicode categories
	  * @param {UnicodeCategory} cat - simplified category
	  * @return {string} set of substitutes
	  */
	public static substitutes(cat: UnicodeCategory): string|undefined {
		switch(cat) {
			default:
				return undefined;
			case UnicodeCategory.Lu:
				return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			case UnicodeCategory.Ll:
				return 'abcdefghijklmnopqrstuvwxyz';
			case UnicodeCategory.No:
				return '0123456789';
			case UnicodeCategory.Po:
				return '!\"#%&\'()*,-./:;?@[\\]_{}';
			case UnicodeCategory.So:
				return '$+<=>^`|~';
		}
	}
}
