const axios = require('axios');
const currencyConverter = require('./currency-converter');

let result;
let didItFail = false;
(async() => {
  console.log('Expects identifyConversion(\'$10,000.50 ars to usd\') to return an object');
  result = currencyConverter.identifyConversion('$10,000.50 ars to usd');
  if (typeof result !== 'object') throw new Error('Function identifyConversion couldn\'t recognize parts value, currency and to');
  console.log('Ok\n');

  console.log('Expects normalizeValue(10000) to return a number');
  result = currencyConverter.normalizeValue(10000);
  if (typeof result !== 'number') throw new Error('Error 1');
  console.log('Ok\n');

  console.log('Expects normalizeValue() to return an error');
  try {
    result = currencyConverter.normalizeValue();
  }
  catch (e) {
    didItFail = true;
    console.log('Ok\n');
  }
  if (!didItFail)
  if (result) throw new Error('normalizeValue() didn\'t fail');
  didItFail = false;

  console.log('Expects normalizeValue(\'a\') to return an error');
  try {
    result = currencyConverter.normalizeValue('a')
  }
  catch (e) {
    didItFail = true;
    console.log('Ok\n');
  }
  if (!didItFail)
    throw new Error('normalizeValue(\'a\') didn\'t fail');

  console.log('Expects normalizeValue(\'10,000.50\') to return number');
  result = currencyConverter.normalizeValue('10,000.50');
  if (typeof result !== 'number') throw new Error('Error 1');
  console.log('Ok\n');

  console.log('Expects normalizeValue(\'10.000,50\') to return number');
  result = currencyConverter.normalizeValue('10.000,50');
  if (typeof result !== 'number') throw new Error('Error 1');
  console.log('Ok\n');

  console.log('Expects http://localhost:4000/convert-string?q=10.000+ars+to+usd to return status 200');
  await axios.get('http://localhost:4000/convert-string?q=10.000+ars+to+usd')
    .then((_) => {
      // console.log(_.data.r);
      console.log('Ok\n');
    })
    .catch((_err) => {
      console.log(_err);
    });

  console.log('All tests run.');

  // if (typeof result !== 'string') throw new Error('Error 1');
})()
