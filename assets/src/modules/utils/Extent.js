import { ValidationError } from './../Errors.js';
import { convertNumber } from './Converters.js';

/**
 * Class representing an extent
 * @class
 * @augments Array
 **/
export class Extent extends Array {

    /**
     * Create an extent
     * @param {...(number|string)} args - the 4 values describing the extent
     *
     * @throws {ValidationError} for number of args different of 4
     * @throws {ConversionError} for values not number
     **/
    constructor(...args) {
        if (args.length < 4) {
            throw new ValidationError('Not enough arguments for Extent constructor!');
        } else if (args.length > 4) {
            throw new ValidationError('Too many arguments for Extent constructor!');
        }
        let values = [];
        for (const val of args) {
            values.push(convertNumber(val));
        }
        super(...values);
    }

    /**
     * @type {Number}
     **/
    get xmin() {
        return this[0];
    }

    /**
     * @type {Number}
     **/
    get ymin() {
        return this[1];
    }

    /**
     * @type {Number}
     **/
    get xmax() {
        return this[2];
    }

    /**
     * @type {Number}
     **/
    get ymax() {
        return this[3];
    }

    equals(anOther) {
        return ( anOther instanceof Array
            && anOther.length == 4
            && anOther[0] == this[0]
            && anOther[1] == this[1]
            && anOther[2] == this[2]
            && anOther[3] == this[3])
    }
}
