/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

import crypto = require('crypto');

/** Provides static methods for generating entropy i.e., pseudo-random
  * byte values */
export default class Entropy {

	/** Gets a buffer containing pseudo-random password entropy bytes
	  * @param {number} bits - number of bits of entropy to generator
	  * @returns {Uint8Array} entropy
	  */
	public static random(bits: number): Uint8Array {
		let buf: Uint8Array = new Uint8Array(new ArrayBuffer((bits + 7) / 8));
		crypto.randomFillSync(buf);
		return buf;
	}

	/** Gets a buffer containing pseudo-random password entropy bytes
	  * derived from a password and salt using PBKDF2
	  * @param {number} bits - number of bits of entropy to generator
	  * @param {string} password - password from which to derive entropy
	  * @param {string} salt - salt to include when deriving entropy
	  *                        from a password
	  * @param {number} iters - number of iteratoions of the PBKDF2
	  *                         algorithm to run
	  * @returns {Uint8Array} entropy
	  */
	public static pbkdf2(bits: number, password: string, salt: string, iters: number): Uint8Array {
		return new Uint8Array(crypto.pbkdf2Sync(password, salt, iters, (bits + 7) / 8, 'sha1'));
	}

	/** Gets a buffer containing pseudo-random password entropy bytes
	  * which may or may not have been derived from a password and salt
	  * @param {number} bits - number of bits of entropy to Generates
	  * @param {string} password - password from which to derive entropy
	  *                            (optional)
	  * @param {string} salt - salt to include when deriving entropy
	  *                        from a password (optional)
	  * @param {number} iters - number of iteratoions of the PBKDF2
	  *                         algorithm to run (optional)
	  * @returns {Uint8Array} entropy
	  *
	  * All of password, salt and iters must be defined in order for
	  * PBKDF2 to be used.
	  */
	public static entropy(bits: number, password?: string, salt?: string, iters?: number): Uint8Array {
		let buf: Uint8Array;
		if(typeof(password) === 'undefined' || typeof(salt) === 'undefined' || typeof(iters) === 'undefined') {
			return Entropy.random(bits);
		} else {
			return Entropy.pbkdf2(bits, password, salt, iters);
		}
	}
}
