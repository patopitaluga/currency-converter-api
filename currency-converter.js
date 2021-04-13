const dotenv = require('dotenv').config();

const mongoose = require('mongoose');

const Measure = mongoose.model('Measure', {
  date: Date,
  values: [{ name: String, value: Number }],
});

/**
 * Given a number will add zeroes to fill two decimal places only if it has decimals.
 *
 * @param {string|number} _num -
 * @return {string}
 */
function addZeroes(_num) {
  let value = Number(_num);
  value = value.toFixed(2);
  if (value.endsWith('.00')) value = value.substr(0, value.length - 3);
  return value;
}

const currencyConverter = {
  /**
   *
   * @return {Promise<array>}
   */
  currentValue: async() => {
    return new Promise((_resolve, _reject) => {
      mongoose.connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      Measure.find().sort({ date: 'descending', }).limit(1).exec((err, _result) => {
        _resolve(_result[0].values);

        mongoose.connection.close();
      });
    });
  },

  /**
   *
   */
  updateValue: async() => {
  },

  /**
   * Given a phrase will identify what currency and value the user wants to convert.
   *
   * @param {string} _rawString - E.g. "$10,000.50 ars to usd" | "$10,000.50 pesos a dólares"
   * @return {object}
   */
  identifyConversion: (_rawString) => {
    const words = _rawString.trim().split(' ');
    if (isNaN(words[0].replace('$', '').replace('.', '').replace(',', '')))
      throw new Error('value was expected to start with a number');
    value = words[0];

    return {
      value: words[0],
      currency: words[1],
      to: words[words.length - 1],
    };
  },

  /**
   * Normalize a "number" as string to a js number.
   *
   * @param {string|number} _rawValue - E.g. "10,000.50" | "10.000,50"
   * @return {number}
   */
  normalizeValue: (_rawValue) => {
    let value = String(_rawValue).trim();
    value = value.replace('$', '');
    if (
      (value.match(/\./g) || []).length > 1 || // more than a .
      value.substr(value.length - 4, 1) === '.'
    ) { // is more than one . then . is used to separate thousands
      value = value.replace(/\./g, '');
    } else {
      // If using comma as decimal separator
      if (value.substr(value.length - 3, 1) === ',')
        value = value.replace(/\,/g, '.');
      // If using comma as thousands separator
      if (value.substr(value.length - 4, 1) === ',')
        value = value.replace(/\,/g, '');
      // If using comma as thousands separator and it's a decimal number
      if (value.indexOf('.') > 0 && value.indexOf(',') > 0 && value.indexOf('.') > value.indexOf(','))
        value = value.replace(/\,/g, ''); // removes commas

      if ((value.match(/\./g) || []).length > 1) { // if more than one dot.
        const partsOfNumber = String(value).split('.');
        const decimalPart = partsOfNumber[partsOfNumber.length - 1];
        partsOfNumber[partsOfNumber.length - 1] = '';
        value = partsOfNumber.join('') + '.' + decimalPart;
      }
    }

    value = value.replace(/\,/g, '.');
    value = Number(value);

    if (!value || typeof value !== 'number') throw new Error('Can\'t identify input number');

    return value;
  },

  /**
   * Given a value in any curency will output the conversion.
   *
   * @param {object} _input - { value: {number}, currency: {string}, to: {string} }
   * @return {Promise<string>}
   */
  convert: async(_input) => {
    if (!_input) throw new Error('_input object was expected.');
    if (typeof _input !== 'object') throw new Error('_input was expected to be object.');
    if (!_input.value) throw new Error('The object _input was expected to have { value: {number} }.');
    if (!_input.currency) throw new Error('The object _input was expected to have { currency: {string} }.');
    if (!_input.to) throw new Error('The object _input was expected to have { to: {string} }.');

    const value = currencyConverter.normalizeValue(_input.value);

    return new Promise(async(_resolve, _reject) => {

      const currentValues = await currencyConverter.currentValue({ curency: _input.currency, to: _input.to })
        .catch((_err) => { throw _err });
      _resolve(
        currentValues.reduce((_acc, _eachMeasure, i) => {
          // Al "dólar blue", 10.000 pesos son x dólares
          return _acc + 'Al ' + _eachMeasure.name + ', ' + addZeroes(value) + ' pesos son ' +
            addZeroes(value / _eachMeasure.value) + ' dólares\n';
        }, '')
      );

    });
  },
};

module.exports = currencyConverter;
