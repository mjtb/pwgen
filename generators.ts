/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

import Generator from './generator';
import CharRange from './range';
import ComplexityConstraint from './constraint';

/** Registry of available password generators */
export default class Generators {
	private static readonly list: Generator[] = [];
	private static readonly lookup: { [name: string]: Generator } = {};

	private static init(): void {
		if(!Generators.list.length) {
			Generators.list.push(
				new Generator('Decimal', [ new CharRange('0', '9') ])
			);
		}
	}

	/** Adds a generator to the registry
	  * @param {Generator} g - generator to added
	  * @return {number} index in the list at which the generator was
	  *                  added
	  * @throws {Error} a generator with the same name has already been
	  *                 added
      */
	public static add(g: Generator): number {
		if(g.name in Generators.lookup) {
			throw new Error(`Generator named ${g.name} already added`);
		}
		let index: number = Generators.list.length;
		Generators.list.push(g);
		let n: string = g.name.toLowerCase();
		Generators.lookup[n] = g;
		return index;
	}

	/** Returns true if a generator with the given name has been
	  * registered
	  * @param {string} name - name to look up (case-insensitve)
	  * @return {boolean} true if there is a generator registered with
	  *                   the given name
	  */
	public static hasGenerator(name: string): boolean {
		Generators.init();
		let n: string = name.toLowerCase();
		return n in Generators.lookup;
	}

	/** Returns the number of generators registered
	  * @return {number} length of the registry list
	  */
	public static get count(): number {
		Generators.init();
		return Generators.list.length;
	}

	/** Returns the generator at the given index in the list
	  * @param {number} index - position in the list
	  * @return {Generator} generator at the given position
	  * @throws {Error} index out of range [0,Generators.count)
	  */
	public static generatorAt(index: number): Generator {
		Generators.init();
		if(index >= 0 && index < Generators.list.length) {
			return Generators.list[index];
		} else {
			throw new Error(`Index ${index} out of range: [0,${Generators.list.length})`);
		}
	}

	/** Returns the generator registered with a given name
	  * @param {string} name - name to look up (case-insensitve)
	  * @returns {Generator} generator registered with that name
	  * @throws {Error} name not found
	  */
	public static generatorOf(name: string): Generator {
		Generators.init();
		let n: string = name.toLowerCase();
		if(n in Generators.lookup) {
			return Generators.lookup[n];
		} else {
			throw new Error(`Generator named \"${name}\" not found`);
		}
	}
}
