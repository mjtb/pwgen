/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

import { UnicodeCategory } from './category';

/** Password complexity requirements in terms of a Unicode characters
  * category and the minimum number of characters required */
export default class ComplexityConstraint {

	/** Unicode character category required */
	public readonly category: UnicodeCategory;

	/** Number of times a character in this category is required */
	public readonly count: number;

	/** Constructs the object with a category and count
	  * @param {UnicodeCategory} category - character category required
	  * @param {number} count - number of times characters in this
	  *                         category are required
	  * @throws {Error} invalid count; must be >= 1
	  */
	constructor(category: UnicodeCategory, count: number = 1) {
		if(count < 1) {
			throw new Error(`Invalid character count: ${count}; must be >= 1`);
		}
		this.category = category;
		this.count = count;
	}
}
