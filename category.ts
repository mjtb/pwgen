/* mjtb-pwgen - Generates pseudo-random passwords
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import unidata = require('mjtb-unidata');

/** Unicode categories
  * @enum {number}
  */
export enum UnicodeCategory {
	/** Other, Not Assigned (no characters in the file have this property) */
	Cn = 0,
	/** Other, Control */
	Cc,
	/** Other, Format */
	Cf,
	/** Other, Private Use */
	Co,
	/** Other, Surrogate */
	Cs,
	/** Letter, Cased */
	LC,
	/** Letter, Lowercase */
	Ll,
	/** Letter, Modifier */
	Lm,
	/** Letter, Other */
	Lo,
	/** Letter, Titlecase */
	Lt,
	/** Letter, Uppercase */
	Lu,
	/** Mark, Spacing Combining */
	Mc,
	/** Mark, Enclosing */
	Me,
	/** Mark, Nonspacing */
	Mn,
	/** Number, Decimal Digit */
	Nd,
	/** Number, Letter */
	Nl,
	/** Number, Other */
	No,
	/** Punctuation, Connector */
	Pc,
	/** Punctuation, Dash */
	Pd,
	/** Punctuation, Close */
	Pe,
	/** Punctuation, Final quote (may behave like Ps or Pe depending on usage) */
	Pf,
	/** Punctuation, Initial quote (may behave like Ps or Pe depending on usage) */
	Pi,
	/** Punctuation, Other */
	Po,
	/** Punctuation, Open */
	Ps,
	/** Symbol, Currency */
	Sc,
	/** Symbol, Modifier */
	Sk,
	/** Symbol, Math */
	Sm,
	/** Symbol, Other */
	So,
	/** Separator, Line */
	Zl,
	/** Separator, Paragraph */
	Zp,
	/** Separator, Space */
	Zs
}

/** Returns the description of a Unicode category
  * @param {UnicodeCategory} cat - category
  * @returns {string} description e.g., "Separator, Line" for Zl
  * @throws {Error} Unicode category not found
  */
export function unicodeCategoryDescriptionOf(cat: UnicodeCategory): string {
    switch (cat) {
        default:
            throw new Error(`Unicode category ${cat} not found`);
        case UnicodeCategory.Cc:
            return "Other, Control";
        case UnicodeCategory.Cf:
            return "Other, Format";
        case UnicodeCategory.Cn:
            return "Other, Not Assigned (no characters in the file have this property)";
        case UnicodeCategory.Co:
            return "Other, Private Use";
        case UnicodeCategory.Cs:
            return "Other, Surrogate";
        case UnicodeCategory.LC:
            return "Letter, Cased";
        case UnicodeCategory.Ll:
            return "Letter, Lowercase";
        case UnicodeCategory.Lm:
            return "Letter, Modifier";
        case UnicodeCategory.Lo:
            return "Letter, Other";
        case UnicodeCategory.Lt:
            return "Letter, Titlecase";
        case UnicodeCategory.Lu:
            return "Letter, Uppercase";
        case UnicodeCategory.Mc:
            return "Mark, Spacing Combining";
        case UnicodeCategory.Me:
            return "Mark, Enclosing";
        case UnicodeCategory.Mn:
            return "Mark, Nonspacing";
        case UnicodeCategory.Nd:
            return "Number, Decimal Digit";
        case UnicodeCategory.Nl:
            return "Number, Letter";
        case UnicodeCategory.No:
            return "Number, Other";
        case UnicodeCategory.Pc:
            return "Punctuation, Connector";
        case UnicodeCategory.Pd:
            return "Punctuation, Dash";
        case UnicodeCategory.Pe:
            return "Punctuation, Close";
        case UnicodeCategory.Pf:
            return "Punctuation, Final quote (may behave like Ps or Pe depending on usage)";
        case UnicodeCategory.Pi:
            return "Punctuation, Initial quote (may behave like Ps or Pe depending on usage)";
        case UnicodeCategory.Po:
            return "Punctuation, Other";
        case UnicodeCategory.Ps:
            return "Punctuation, Open";
        case UnicodeCategory.Sc:
            return "Symbol, Currency";
        case UnicodeCategory.Sk:
            return "Symbol, Modifier";
        case UnicodeCategory.Sm:
            return "Symbol, Math";
        case UnicodeCategory.So:
            return "Symbol, Other";
        case UnicodeCategory.Zl:
            return "Separator, Line";
        case UnicodeCategory.Zp:
            return "Separator, Paragraph";
        case UnicodeCategory.Zs:
            return "Separator, Space";
    }
}

/** Returns the two-letter symbol for a category
  * @param {UnicodeCategory} cat - category
  * @returns {string} two-letter symbol, e.g., "Zs"
  * @throws {Error} Unicode category not found
  */
export function unicodeCategorySymbolOf(cat: UnicodeCategory): string {
    switch (cat) {
        default:
            throw new Error(`Unicode category ${cat} not found`);
        case UnicodeCategory.Cc:
            return "Cc";
        case UnicodeCategory.Cf:
            return "Cf";
        case UnicodeCategory.Cn:
            return "Cn";
        case UnicodeCategory.Co:
            return "Co";
        case UnicodeCategory.Cs:
            return "Cs";
        case UnicodeCategory.LC:
            return "LC";
        case UnicodeCategory.Ll:
            return "Ll";
        case UnicodeCategory.Lm:
            return "Lm";
        case UnicodeCategory.Lo:
            return "Lo";
        case UnicodeCategory.Lt:
            return "Lt";
        case UnicodeCategory.Lu:
            return "Lu";
        case UnicodeCategory.Mc:
            return "Mc";
        case UnicodeCategory.Me:
            return "Me";
        case UnicodeCategory.Mn:
            return "Mn";
        case UnicodeCategory.Nd:
            return "Nd";
        case UnicodeCategory.Nl:
            return "Nl";
        case UnicodeCategory.No:
            return "No";
        case UnicodeCategory.Pc:
            return "Pc";
        case UnicodeCategory.Pd:
            return "Pd";
        case UnicodeCategory.Pe:
            return "Pe";
        case UnicodeCategory.Pf:
            return "Pf";
        case UnicodeCategory.Pi:
            return "Pi";
        case UnicodeCategory.Po:
            return "Po";
        case UnicodeCategory.Ps:
            return "Ps";
        case UnicodeCategory.Sc:
            return "Sc";
        case UnicodeCategory.Sk:
            return "Sk";
        case UnicodeCategory.Sm:
            return "Sm";
        case UnicodeCategory.So:
            return "So";
        case UnicodeCategory.Zl:
            return "Zl";
        case UnicodeCategory.Zp:
            return "Zp";
        case UnicodeCategory.Zs:
            return "Zs";

    }
}

/** Returns the Unicode category given its two-letter symbol
  * @param {string} sym - two-letter Unicode Category symbol e.g., "Zp"
  * @returns {UnicodeCategory} category for sym
  *
  * The Javascript undefined value is returned if there is no Unicode
  * category associated with the symbol
  */
export function unicodeCategoryFromSymbol(sym: string): UnicodeCategory | undefined {
    switch (sym) {
        default:
            return undefined;
        case "Cc":
            return UnicodeCategory.Cc;
        case "Cf":
            return UnicodeCategory.Cf;
        case "Cn":
            return UnicodeCategory.Cn;
        case "Co":
            return UnicodeCategory.Co;
        case "Cs":
            return UnicodeCategory.Cs;
        case "LC":
            return UnicodeCategory.LC;
        case "Ll":
            return UnicodeCategory.Ll;
        case "Lm":
            return UnicodeCategory.Lm;
        case "Lo":
            return UnicodeCategory.Lo;
        case "Lt":
            return UnicodeCategory.Lt;
        case "Lu":
            return UnicodeCategory.Lu;
        case "Mc":
            return UnicodeCategory.Mc;
        case "Me":
            return UnicodeCategory.Me;
        case "Mn":
            return UnicodeCategory.Mn;
        case "Nd":
            return UnicodeCategory.Nd;
        case "Nl":
            return UnicodeCategory.Nl;
        case "No":
            return UnicodeCategory.No;
        case "Pc":
            return UnicodeCategory.Pc;
        case "Pd":
            return UnicodeCategory.Pd;
        case "Pe":
            return UnicodeCategory.Pe;
        case "Pf":
            return UnicodeCategory.Pf;
        case "Pi":
            return UnicodeCategory.Pi;
        case "Po":
            return UnicodeCategory.Po;
        case "Ps":
            return UnicodeCategory.Ps;
        case "Sc":
            return UnicodeCategory.Sc;
        case "Sk":
            return UnicodeCategory.Sk;
        case "Sm":
            return UnicodeCategory.Sm;
        case "So":
            return UnicodeCategory.So;
        case "Zl":
            return UnicodeCategory.Zl;
        case "Zp":
            return UnicodeCategory.Zp;
        case "Zs":
            return UnicodeCategory.Zs;
    }
}

/** Returns the Unicode category of a character
  * @param {string|number} c - Unicode character or code point
  * @return {UnicodeCategory} Unicode category
  */
export function unicodeCategoryOf(c: string|number): UnicodeCategory {
	let n: number;
	if(typeof(c) === 'string') {
		n = c.charCodeAt(0);
	} else {
		n = c;
	}
	let uc: unidata.UnicodeCharacter|null = unidata.instance().get(n);
	if(uc) {
		let sym: string|undefined = uc.general;
		if(typeof(sym) !== 'undefined') {
			let cat: UnicodeCategory|undefined = unicodeCategoryFromSymbol(sym);
			if(typeof(cat) !== 'undefined') {
				return unicodeCategorySimplify(cat);
			}
		}
	}
	return UnicodeCategory.Cn;
}

/** Maps a Unicode category to a smaller set comprising Co, Lu, Ll, Po,
  * No, and So
  * @param {UnicodeCategory} cat - an arbitrary Unicode category
  * @return {UnicodeCategory} whichever of Co, Lu, Ll, Po, No, or So is
  *                           is closest
  */
export function unicodeCategorySimplify(cat: UnicodeCategory): UnicodeCategory {
	switch(cat) {
		default:
			return UnicodeCategory.Co;
		case UnicodeCategory.Lu:
		case UnicodeCategory.Lt:
			return UnicodeCategory.Lu;
		case UnicodeCategory.Ll:
		case UnicodeCategory.Lo:
			return UnicodeCategory.Ll;
		case UnicodeCategory.Pe:
		case UnicodeCategory.Pc:
		case UnicodeCategory.Pd:
		case UnicodeCategory.Pf:
		case UnicodeCategory.Pi:
		case UnicodeCategory.Ps:
		case UnicodeCategory.Po:
			return UnicodeCategory.Po;
		case UnicodeCategory.Sc:
		case UnicodeCategory.Sk:
		case UnicodeCategory.Sm:
		case UnicodeCategory.So:
			return UnicodeCategory.So;
		case UnicodeCategory.Nd:
		case UnicodeCategory.Nl:
		case UnicodeCategory.No:
			return UnicodeCategory.No;
	}
}
