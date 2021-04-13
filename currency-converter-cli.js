const dotenv = require('dotenv').config();
const currencyConverter = require('./currency-converter');

const fullArgs = process.argv.reduce((_acc, _eachArg, _i) => {
  if (_i < 2) return '';
  return (_acc + ' ' + _eachArg).trim();
}, '');

currencyConverter.convert(currencyConverter.identifyConversion(fullArgs))
  .then((_) => {
    console.log(_);
  });

// currencyConverter.currentValue()
//   .then((_) => {
//     console.log(_);
//   })
