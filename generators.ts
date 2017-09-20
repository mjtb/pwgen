/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

import Generator from './generator';
import CharRange from './range';
import { UnicodeCategory } from './category';
import ComplexityConstraint from './constraint';

interface IGeneratorLookup {
	[name: string]: Generator;
}

/** Registry of available password generators */
export default class Generators {

	private static getGeneratorLookup(generators: Generator[]): IGeneratorLookup {
		let map: IGeneratorLookup = {};
		for(let g of generators) {
			let n: string = g.name.toLowerCase();
			map[n] = g;
		}
		return map;
	}

    private static getDefaultGenerators(): Generator[] {
        return [
            new Generator('Decimal', [new CharRange('0', '9')]),
            new Generator('Hexadecimal', [
                new CharRange('0', '9'),
                new CharRange('A', 'F')
            ], [
                    new ComplexityConstraint(UnicodeCategory.Lu),
                    new ComplexityConstraint(UnicodeCategory.No)
                ]),
            new Generator('Alphanumeric',
                [
                    new CharRange('0', '9'),
                    new CharRange('a', 'z')
                ], [
                    new ComplexityConstraint(UnicodeCategory.Ll),
                    new ComplexityConstraint(UnicodeCategory.No)
                ]
            ),
            new Generator('NCName', [
                new CharRange('0', '9'),
                new CharRange('A', 'Z'),
                new CharRange('a', 'z'),
                new CharRange('_'),
                new CharRange('.'),
                new CharRange('-')
            ], [
                    new ComplexityConstraint(UnicodeCategory.Lu),
                    new ComplexityConstraint(UnicodeCategory.Ll),
                    new ComplexityConstraint(UnicodeCategory.No)
                ], [
                    new CharRange('A', 'Z'),
                    new CharRange('a', 'z'),
                    new CharRange('_')
                ]),
            new Generator('QWERTY', [new CharRange('!', '~')], [
                new ComplexityConstraint(UnicodeCategory.Lu),
                new ComplexityConstraint(UnicodeCategory.Ll),
                new ComplexityConstraint(UnicodeCategory.No),
                new ComplexityConstraint(UnicodeCategory.Po),
                new ComplexityConstraint(UnicodeCategory.So)
            ]),
            new Generator('Latin-1', [
                new CharRange('!', '~'),
                new CharRange('\u00A1', '\u00FF')
            ], [
                    new ComplexityConstraint(UnicodeCategory.Lu),
                    new ComplexityConstraint(UnicodeCategory.Ll),
                    new ComplexityConstraint(UnicodeCategory.No),
                    new ComplexityConstraint(UnicodeCategory.Po),
                    new ComplexityConstraint(UnicodeCategory.So)
                ]),
            new Generator('LGC', [
                new CharRange('!', '~'),
                new CharRange('\u00A1', '\u024F'),
                new CharRange('\u0370', '\u0373'),
                new CharRange('\u037B', '\u037F'),
                new CharRange('\u0386'),
                new CharRange('\u0388', '\u038A'),
                new CharRange('\u038C'),
                new CharRange('\u038E', '\u03A1'),
                new CharRange('\u03A3', '\u03FF'),
                new CharRange('\u0400', '\u0482'),
                new CharRange('\u048A', '\u04FF')
            ], [
                    new ComplexityConstraint(UnicodeCategory.Lu),
                    new ComplexityConstraint(UnicodeCategory.Ll),
                    new ComplexityConstraint(UnicodeCategory.No),
                    new ComplexityConstraint(UnicodeCategory.Po),
                    new ComplexityConstraint(UnicodeCategory.So)
                ]),
            new Generator('xml:id', [
                new CharRange('A', 'Z'),
                new CharRange('_'),
                new CharRange('a', 'z'),
                new CharRange('\u00C0', '\u00D6'),
                new CharRange('\u00D8', '\u00F6'),
                new CharRange('\u00F8', '\u02FF'),
                new CharRange('\u0370', '\u037D'),
                new CharRange('\u037F', '\u1FFF'),
                new CharRange('\u200C', '\u200D'),
                new CharRange('\u2070', '\u218F'),
                new CharRange('\u2C00', '\u2FEF'),
                new CharRange('\u3001', '\uD7FF'),
                new CharRange('\uF900', '\uFDCF'),
                new CharRange('\uFDF0', '\uFFFD'),
                new CharRange('-'),
                new CharRange('.'),
                new CharRange('0', '9'),
                new CharRange('\u00B7'),
                new CharRange('\u0300', '\u036F'),
                new CharRange('\u203F', '\u2040')
            ], [
                    new ComplexityConstraint(UnicodeCategory.Lu),
                    new ComplexityConstraint(UnicodeCategory.Ll),
                    new ComplexityConstraint(UnicodeCategory.No)
                ], [
                    new CharRange('A', 'Z'),
                    new CharRange('_'),
                    new CharRange('a', 'z'),
                    new CharRange('\u00C0', '\u00D6'),
                    new CharRange('\u00D8', '\u00F6'),
                    new CharRange('\u00F8', '\u02FF'),
                    new CharRange('\u0370', '\u037D'),
                    new CharRange('\u037F', '\u1FFF'),
                    new CharRange('\u200C', '\u200D'),
                    new CharRange('\u2070', '\u218F'),
                    new CharRange('\u2C00', '\u2FEF'),
                    new CharRange('\u3001', '\uD7FF'),
                    new CharRange('\uF900', '\uFDCF'),
                    new CharRange('\uFDF0', '\uFFFD')
                ]),
            new Generator('Nmtoken', [
                new CharRange('A', 'Z'),
                new CharRange('_'),
                new CharRange('a', 'z'),
                new CharRange('\u00C0', '\u00D6'),
                new CharRange('\u00D8', '\u00F6'),
                new CharRange('\u00F8', '\u02FF'),
                new CharRange('\u0370', '\u037D'),
                new CharRange('\u037F', '\u1FFF'),
                new CharRange('\u200C', '\u200D'),
                new CharRange('\u2070', '\u218F'),
                new CharRange('\u2C00', '\u2FEF'),
                new CharRange('\u3001', '\uD7FF'),
                new CharRange('\uF900', '\uFDCF'),
                new CharRange('\uFDF0', '\uFFFD'),
                new CharRange('-'),
                new CharRange('.'),
                new CharRange('0', '9'),
                new CharRange('\u00B7'),
                new CharRange('\u0300', '\u036F'),
                new CharRange('\u203F', '\u2040')
            ], [
                    new ComplexityConstraint(UnicodeCategory.Lu),
                    new ComplexityConstraint(UnicodeCategory.Ll)
            ])
        ];
    }

	private static readonly list: Generator[] = Generators.getDefaultGenerators();
	private static readonly lookup: IGeneratorLookup = Generators.getGeneratorLookup(Generators.list);


	/** Adds a generator to the registry
	  * @param {Generator} g - generator to added
	  * @return {number} index in the list at which the generator was
	  *                  added
	  * @throws {Error} a generator with the same name has already been
	  *                 added
      */
    public static add(g: Generator): number {
        if (g.name in Generators.lookup) {
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
        let n: string = name.toLowerCase();
        return n in Generators.lookup;
    }

	/** Returns the number of generators registered
	  * @return {number} length of the registry list
	  */
    public static get count(): number {
        return Generators.list.length;
    }

	/** Returns the generator at the given index in the list
	  * @param {number} index - position in the list
	  * @return {Generator} generator at the given position
	  * @throws {Error} index out of range [0,Generators.count)
	  */
    public static generatorAt(index: number): Generator {
        if (index >= 0 && index < Generators.list.length) {
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
        let n: string = name.toLowerCase();
        if (n in Generators.lookup) {
            return Generators.lookup[n];
        } else {
            throw new Error(`Generator named \"${name}\" not found`);
        }
    }
}
