/** @module lib/complex
 *
 * @file
 * A class for Complex numbers.
 */

'use strict';

import Vector, {initVector} from "./vector.js";  initVector();


/**
 * Class representing a complex number.
 *
 * Complex numbers behave like vectors of length two, in that they can be added
 * and scaled componentwise.  However, complex numbers can also be multiplied
 * together and divided to form new complex numbers.
 *
 * @example {@lang javascript}
 * new Complex(1, 2).toString(1); // "1.0 + 2.0 i"
 *
 * @extends Vector
 */
class Complex extends Vector {
    /**
     * Create a new Complex number with prescribed polar coordinates.
     *
     * Cartesian and polar coordinates are related by the formula
     * `(x, y) = (r cos(θ), r sin(θ))`.  According to Euler's formula, the
     * output of `Complex.fromPolar(r, θ)` is equal to `r e^{i θ}`.
     *
     * @example {@lang javascript}
     * Complex.fromPolar(1, Math.PI/2);  // Complex.i
     *
     * @param {number} r - The radial coordinate.
     * @param {number} θ - The angular coordinate.
     * @return {Complex} The complex number `r e^{i θ}`.
     */
    static fromPolar(r, θ) {
        return new Complex(r * Math.cos(θ), r * Math.sin(θ));
    }

    /**
     * A copy of `i = new Complex(0, 1)`, a square root of -1.
     *
     * This returns a new object each time it is accessed.
     *
     * @type {Complex}
     */
    static get i() {
        return new Complex(0, 1);
    }

    /**
     * The real part (first entry) of the complex number.
     *
     * @example {@lang javascript}
     * let z = new Complex(3, 4);
     * z.Re;           // 3
     * z.Re = 5;
     * z.toString(1);  // "5.0 + 4.0 i"
     *
     * @type {number}
     */
    get Re() { return this[0]; }
    set Re(x) { this[0] = x; }

    /**
     * The imaginary part part (second entry) of the complex number.
     *
     * @example {@lang javascript}
     * let z = new Complex(3, 4);
     * z.Im;           // 4
     * z.Im = 5;
     * z.toString(1);  // "3.0 + 5.0 i"
     *
     * @type {number}
     */
    get Im() { return this[1]; }
    set Im(x) { this[1] = x; }

    /**
     * The modulus of the complex number.
     *
     * This is an alias for the inherited property `this.size`.
     *
     * @example {@lang javascript}
     * new Complex(3, 4).mod;  // 5
     *
     * @type {number}
     */
    get mod() { return this.size; }

    /**
     * The argument of the complex number.
     *
     * This is the angle component of the polar coordinates for the point
     * `(this.Re, this.Im)`.
     *
     * The value is between -π and π.
     *
     * @example {@lang javascript}
     * new Complex(1, 1).arg;  // Math.PI/4
     *
     * @type {number}
     */
    get arg() { return Math.atan2(this.Im, this.Re); }

    /**
     * @param {number} a - The real part.
     * @param {number} [b=0] - The imaginary part.
     */
    constructor(a, b=0) {
        super(a, b);
    }

    /**
     * Check if this complex number is equal to `other`.
     *
     * This is the same as {@link Vector#equals}, except that if `other` is a
     * number, it is promoted to a Complex number first.
     *
     * @example {@lang javascript}
     * new Complex(1, 0).equals(1);  // true
     *
     * @param {(Complex|number)} other - The number to compare.
     * @param {number} [ε=0] - Entries will test as equal if they are within `ε`
     *   of each other.  This is provided in order to account for rounding
     *   errors.
     * @return {boolean} True if `this` equals `other`.
     */
    equals(other, ε=0) {
        if(typeof other === "number")
            other = new Complex(other, 0);
        return super.equals(other, ε);
    }

    /**
     * Return a string representation of the complex number.
     *
     * @example {@lang javascript}
     * new Complex(1, 2).toString(2);  // "1.00 + 2.00 i"
     *
     * @param {integer} [precision=4] - The number of decimal places to include.
     * @return {string} A string representation of the complex number.
     */
    toString(precision=4) {
        if(this.Im >= 0)
            return `${this.Re.toFixed(precision)} + ${this.Im.toFixed(precision)} i`;
        return `${this.Re.toFixed(precision)} - ${(-this.Im).toFixed(precision)} i`;
    }

    /**
     * Replace the Complex number with its complex conjugate.
     *
     * This modifies `this` in place by negating the imaginary part.
     *
     * @example {@lang javascript}
     * let z = new Complex(1, 2);
     * z.conj();
     * z.toString(1);  // "1.0 - 2.0 i"
     *
     * @return {Complex} `this`
     */
    conj() {
        this.Im *= -1;
        return this;
    }

    /**
     * Add another complex number in-place.
     *
     * This is the same as {@link Vector#add}, except that if `other` is a
     * number, it is promoted to a Complex number first.
     *
     * @example {@lang javascript}
     * let z = new Complex(1, 2);
     * z.add(1);
     * z.toString(1);  // "2.0 + 2.0 i"
     *
     * @param {(Complex|number)} other - The number to add.
     * @param {number} [factor=1] - Add `factor` times `other` instead of just
     *   adding `other`.
     * @return {Complex} `this`
     */
    add(other, factor=1) {
        if(typeof other === "number") {
            this.Re += other * factor;
            return this;
        }
        return super.add(other, factor);
    }

    /**
     * Multiply by a complex number in-place.
     *
     * Multiplication of complex numbers is defined by the formula
     * `(a + b i) (c + d i) = (ac - bd) + (ad + bc) i`.
     *
     * @example {@lang javascript}
     * let z = new Complex(1, 2), w = new Complex(3, 4);
     * z.mult(w);
     * z.toString(1);  // "-5.00 + 10.00 i"
     * z.mult(-2);
     * z.toString(1);  // "10.00 - 20.00 i"
     *
     * @param {(Complex|number)} other - The number to multiply.
     * @return {Complex} `this`
     */
    mult(other) {
        if(typeof other === "number")
            return this.scale(other);
        [this.Re, this.Im] = [
            this.Re * other.Re - this.Im * other.Im,
            this.Re * other.Im + this.Im * other.Re];
        return this;
    }

    /**
     * Replace the Complex number by its reciprocal.
     *
     * The reciprocal of a nonzero complex number `a + b i` is
     * `(a - b i)/(a^2 + b^2)`.
     *
     * @example {@lang javascript}
     * let z = new Complex(3, 4);
     * z.recip();
     * z.toString();  // "0.1200 - 0.1600 i"
     *
     * @return {Complex} `this`
     * @throws Will throw an error if `this` is zero.
     */
    recip() {
        const s = 1/this.sizesq;
        if(!isFinite(s))
            throw new Error("Tried to divide by zero");
        this.Re *= s;
        this.Im *= -s;
        return this;
    }

    /**
     * Divide by a complex number in-place.
     *
     * This is the same as `this.mult(other.recip())`, except `other` is not
     * modified.
     *
     * @example {@lang javascript}
     * let z = new Complex(1, 2), w = new Complex(3, 4);
     * z.div(w);
     * z.toString();  // "0.440 + 0.0800 i"
     *
     * @param {(Complex|number)} other - The number to divide.
     * @return {Complex} `this`
     * @throws Will throw an error if `other` is zero.
     */
    div(other) {
        if(typeof other === "number") {
            const s = 1/other;
            if(!isFinite(s))
                throw new Error("Tried to divide by zero");
            return this.scale(s);
        }
        const s = 1/other.sizesq;
        if(!isFinite(s))
            throw new Error("Tried to divide by zero");
        [this.Re, this.Im] = [
            ( this.Re * other.Re + this.Im * other.Im) * s,
            (-this.Re * other.Im + this.Im * other.Re) * s
        ];
        return this;
    }
}


export default Complex;