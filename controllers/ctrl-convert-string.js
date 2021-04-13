const currencyConverter = require('../currency-converter');

/**
 * Given a sttring Will return a string with the different currency exchanges.
 *
 * @param {object} _req -
 * @param {object} _res -
 */
module.exports = (_req, _res) => {
  currencyConverter.convert(currencyConverter.identifyConversion(_req.query.q))
    .then((_) => {
      _res.send({ r: _ });
    })
    .catch((_) => {
      _res.status(400).send('Bad request.');
    });
};
