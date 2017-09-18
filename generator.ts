/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

import CharRange from './range';
import ComplexityConstraint from './constraint';

/** Represents a password generator */
export default class Generator {

	/** Name of the generator */
	public readonly name: string;

	/** Allowed characters */
	public readonly ranges: CharRange[];

	/** Optional complexity constraints */
	private readonly constraints?: ComplexityConstraint[];

	/** Constructs the generator with a given name
	  * @param {string} name - name of the generator
	  * @param {CharRange[]} ranges - allowed characters
	  * @param {ComplexityConstraint[]} constraints - complexity
	  *                                 constraints (optional)
	  */
	constructor(name: string, ranges: CharRange[], constraints?: ComplexityConstraint[]) {
		this.name = name;
		this.ranges = ranges;
		this.constraints = constraints;	
	}
}
