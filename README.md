# mjtb-pwgen

Generates pseudo-random passwords

Copyright (C) 2017 Michael Trenholm-Boyle. Redistributable under a
permissive open source (MIT) license. See the [LICENSE](LICENSE) file
for full license text.


## About this package

The `mjtb-pwgen` package exports classes \(written in TypeScript\) and
an executable for generating pseudo-random passwords in a variety of
formats. Passwords may be generated randomly or derived from source
material \(a password seed and a URL\) using the
[PBKDF2](https://www.ietf.org/rfc/rfc2898.txt) derivation function.


## Pre-requisites

*       [Node.js 8.4](https://nodejs.org/en/)
*       [TypeScript 2.5](https://www.typescriptlang.org/)
*       [Gulp 1.4](https://gulpjs.com/)
*       [Jasmine 2.8](https://jasmine.github.io/)
*       [Istanbul 11.2](https://istanbul.js.org/)


## Build & test

Uses `gulp` as its build system and `jasmine` as its test runner and
`nyc` for code coverage.

```
npm build .
npm test
```

JSDoc3 documentation is output to the `docs` folder.


## Command-line interface

The `pwgen` tool exposes a command-line interface for generating
pseudo-random passwords.

Command-line syntax help is available from `pwgen --help` as below:

```
SYNTAX: pwgen (bits: number = 88,
                (generator: string = qwerty,
                  (password?: string,
                    (site?: string,
                      (iters: number = 1000)))))

Generators:
       Decimal:  265501658910087041542376911
   Hexadecimal:  A50E25FE148165E9BCDF26
  Alphanumeric:  ya9xzsgtq2dskrb1f0
        NCName:  aq9cVbLKGNlF.66
        QWERTY:  %@F[.*[6RHvK`#
       Latin-1:  L­ø?Bº÷¹±Äê+
           LGC:  ;ъoϫĹΜͿȱŖ
        xml:id:  嶻颩夼䀠】Ə
       Nmtoken:  삧㱃˱緅荭Ǝ
```

Running `pwgen` without any arguments will output an 88-bit password
formatted using the built-in QWERTY generator.

The various generators differ on the characters allowed and the  minimum
number of each kind of character that must be present in the generated
password. For example, the QWERTY generator can encode using any of the
characters from ! to ~ and requires the encoded password to have at
least one character of each of the following kinds, based on their
Unicode categories:

*	Lu, Lt (i.e., uppercase letters)
*	Ll, Lo (i.e., lowercase letters)
*	No, Nd, Nl (i.e., decimal digits)
* 	Po, Pc, Pd, Pe, Pf, Pi, Ps (i.e., punctuation)
*	So, Sc, Sm (i.e., symbols)

The number of bits argument controls how many bits of pseudo-random
entropy are generated. The actual number of bits encoded may be slightly
higher depending on the size of the character sets allowed by a
generator. If too few bits of entropy are provided to an encoder, the
output may not meet all of the requirements of the encoder. For example,
the QWERTY generator requires a minimum of 25 bits of entropy to
reliably satisfy all of its requirements.

By default, `pwgen` generates a pseudo-random entropy from the
best available PRNG source on the system producing one-time passwords
i.e., they change every time the program is run. To produce repeatable
passwords, add two additional arguments which are used as input to
the PBKDF2 algorithm: the first is used as the “password” in PBKDF2
and the second is used as the “salt”. An optional third additional
parameter gives the iteration count used in the PBKDF2 algorithm.

For example: `pwgen 88 qwerty user https://site.io/` generates this
password every time it is run:

```
eZBr`t0cw^i8G#
```


## Class library

Consult the JSDoc documentation for full specification of the classes
and methods available.

Use the `Entropy` class to generate pseudo-random or PBKDF2 derived
bits of your desired length.

Then, find a generator to use from the list of available generators
managed by the `Generators` class. Or, alternatively, constructor
your own `Generator` instance specifying the `CharRange` character
ranges allowed and the `ComplexityConstraint` requirements \(i.e.,
the minimum number of characters for various Unicode categories\).

Finally, pass your entropy to the generator’s `generate` method to
generate the password string.

You can test that a password meets all the character set and complexity
requirements of a generator by passing the candidate password to the
generator’s `isAcceptable` method. You can make a candidate password
acceptable by calling the generator’s `makeAcceptable` method.

This package depends on the [mjtb-unidata](https://www.npmjs.com/package/mjtb-unidata)
package to provide character to Unicode category lookups. Since
mjtb-unidata loads the Unicode Character Database asynchronously, callers
of the mjtb-pwgen APIs should ensure that the `unidata.promise()` method
exposed by mjtb-unidata has resolved before attempting to use
the methods of the `Generator` class.

For example:

```javascript
import pwgen = require('mjtb-pwgen');
import unidata = require('mjtb-unidata');

unidata.promise().then(() => {
	// print 88 bits of a qwerty password
	let qwerty: pwgen.Generator = pwgen.Generators.generatorOf('qwerty');
	console.log(qwerty.generate(pwgen.Entropy.random(88));
});
```


## Contributing

Pull requests gratefully appreciated. Issues should be noted through the
standard GitHub mechanism.
