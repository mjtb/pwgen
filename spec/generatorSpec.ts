/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

/// <reference types="jasmine" />
import Generator from '../generator';
import Generators from '../generators';
import Entropy from '../entropy';
import unidata = require('mjtb-unidata');

describe('generator', () => {

	it('NCName should hash strings', () => {
		expect(Generator.hashOf('abcd')).toBe(439553542);
		expect(Generator.hashOf('aAa')).toBe(1624527684);
		expect(Generator.hashOf('3aB')).toBe(1641301991);
		expect(Generator.hashOf('FaB')).toBe(1641306791);
	});
	it('aB3 should have Ll x1, Lu x1, and No x1', (done) => {
		unidata.instance().promise().then(() => {
			let counts: { [name: string]: number } = Generator.countCategories('aB3');
			expect(counts.Lu).toBe(1);
			expect(counts.Ll).toBe(1);
			expect(counts.No).toBe(1);
			done();
		});
	});
	it('NCName should say aB3 is acceptable', (done) => {
		unidata.instance().promise().then(() => {
			let NCName: Generator = Generators.generatorOf('NCName');
			expect(NCName.isAcceptable('aB3')).toBe(true);
			done();
		});
	});
	it('NCName should say aAa is not acceptable', (done) => {
		unidata.instance().promise().then(() => {
			let NCName: Generator = Generators.generatorOf('NCName');
			expect(NCName.isAcceptable('aAa')).toBe(false);
			done();
		});
	});
	it('NCName should say 3aB is not acceptable', (done) => {
		unidata.instance().promise().then(() => {
			let NCName: Generator = Generators.generatorOf('NCName');
			expect(NCName.isAcceptable('3aB')).toBe(false);
			done();
		});
	});
	it('NCName should not change aB3', (done) => {
		unidata.instance().promise().then(() => {
			let NCName: Generator = Generators.generatorOf('NCName');
			expect(NCName.makeAcceptable('aB3')).toBe('aB3');
			done();
		});
	});
	it('NCName should make aAa acceptable as aA4', (done) => {
		unidata.instance().promise().then(() => {
			let NCName: Generator = Generators.generatorOf('NCName');
			expect(NCName.makeAcceptable('aAa')).toBe('aA4');
			done();
		});
	});
	it('NCName should make 3aB acceptable as Fa1', (done) => {
		unidata.instance().promise().then(() => {
			let NCName: Generator = Generators.generatorOf('NCName');
			expect(NCName.makeAcceptable('3aB')).toBe('Fa1');
			done();
		});
	});
	it('QWERTY should produce acceptable passwords', (done) => {
		unidata.instance().promise().then(() => {
			let qwerty: Generator = Generators.generatorOf('qwerty');
			let buf: Uint8Array = Entropy.pbkdf2(32, 'user', 'https://site.io/', 1000);
			expect(qwerty.lengthOf(32)).toBe(5);
			let ar: number[] = qwerty.partition(buf);
			expect(ar).toEqual([66,76,37,12,26]);
			let ep: string = qwerty.encode(buf);
			expect(ep).toBe('cmF-;');
			let counts: { [name: string]: number } = Generator.countCategories(ep);
			expect(counts.Lu).toBe(1);
			expect(counts.Ll).toBe(2);
			expect(counts.Po).toBe(2);
			let pw: string = qwerty.makeAcceptable(ep);
			counts = Generator.countCategories(pw);
			expect(counts.Lu).toBe(1);
			expect(counts.Ll).toBe(1);
			expect(counts.Po).toBe(1);
			expect(counts.So).toBe(1);
			expect(counts.No).toBe(1);
			expect(qwerty.isAcceptable(pw)).toBe(true);
			done();
		});
	});
	it('xml:id should produce acceptable random passwords', (done) => {
		unidata.instance().promise().then(() => {
			let xmlid: Generator = Generators.generatorOf('xml:id');
			for(let i: number = 0; i < 1000; ++i) {
				let bits: number = Math.floor((55 + Math.floor(Math.random() * 88) + 7) / 8) * 8;
				let buf: Uint8Array = Entropy.random(bits);
				let pw: string = xmlid.generate(buf);
				let a: boolean = xmlid.isAcceptable(pw);
				if(!a) {
					let e: string = xmlid.encode(buf);
					let counts: { [name: string]: number } = Generator.countCategories(e);
					console.info(`bits: ${bits}; entropy: ${buf.toString()}; encoded: ${e}; counts: ${JSON.stringify(Generator.countCategories(e))}; acceptable: ${pw}; counts: ${JSON.stringify(Generator.countCategories(pw))}`);
				}
				expect(a).toBe(true);
			}
			done();
		});
	});
});
