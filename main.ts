/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Entropy from './entropy';
import Generator from './generator';
import Generators from './generators';
import unidata = require('mjtb-unidata');

const DEFAULT_BITS: number = 88;
const DEFAULT_GENERATOR: string = 'qwerty';
const DEFAULT_ITERS: number = 1000;

function print_syntax_help() {
    console.log();
    console.log(`SYNTAX: pwgen (bits: number = ${DEFAULT_BITS},`);
    console.log(`                (generator: string = ${DEFAULT_GENERATOR},`);
    console.log('                  (password?: string,');
    console.log('                    (site?: string,');
    console.log(`                      (iters: number = ${DEFAULT_ITERS})))))`);
    console.log();
    console.log('Generators:');
    let width: number = 4;
    for (let i: number = 0; i < Generators.count; ++i) {
        let g: Generator = Generators.generatorAt(i);
        width = Math.max(width, g.name.length);
    }
    let buf: Uint8Array = Entropy.random(DEFAULT_BITS);
    for (let i: number = 0; i < Generators.count; ++i) {
        let g: Generator = Generators.generatorAt(i);
        let n: string = g.name;
        if (n.length < width) {
            n = ' '.repeat(width - n.length) + n;
        }
        let q: string = g.encode(buf);
        console.log(`  ${n}:  ${q}`);
    }
    console.log();
}

function pwgen(bits: number, generator: Generator, password?: string, site?: string, iters?: number): number {
    console.log(generator.encode(Entropy.entropy(bits, password, site, iters)));
    return 0;
}

export function main(args: string[]): Promise<number> {
    let help: boolean = false;
    let bits: number = DEFAULT_BITS;
    let generator: Generator = Generators.generatorOf(DEFAULT_GENERATOR);
    let password: string | undefined = undefined;
    let site: string | undefined = undefined;
    let iters: number = DEFAULT_ITERS;
    if (args.length > 1) {
        switch (args[1]) {
            default:
                break;
            case '--help':
            case '-h':
            case '/?':
                print_syntax_help();
                return Promise.resolve(0);
        }
        bits = Number.parseInt(args[1]);
        if (Number.isNaN(bits) || bits < 1) {
            console.error(`ERROR: invalid bit count: ${args[1]}`);
            print_syntax_help();
            return Promise.resolve(1);
        }
        if (args.length > 2) {
            if (!Generators.hasGenerator(args[2])) {
                console.error(`ERROR: generator not found: ${args[2]}`);
                print_syntax_help();
                return Promise.resolve(1);
            }
            generator = Generators.generatorOf(args[2]);
            if (args.length === 4) {
                console.error('ERROR: missing required argument: site');
                print_syntax_help();
                return Promise.resolve(1);
            } else if (args.length > 4) {
                password = args[3];
                site = args[4];
                if (args.length > 5) {
                    iters = Number.parseInt(args[5]);
                    if (Number.isNaN(iters) || iters < 1) {
                        console.error(`ERROR: invalid iteration count: ${args[5]}`);
                        print_syntax_help();
                        return Promise.resolve(1);
                    }
                }
            }
        }
    }
    return unidata.instance().promise().then((u: unidata.UnicodeData): number => {
        return pwgen(bits, generator, password, site, iters);
    });
}
