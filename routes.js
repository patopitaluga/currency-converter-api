/**
 * Routes for the express server.
 *
 * @param {object} _app - the express instance.
 */
module.exports = (_app) => {
  _app.get('/', (_req, _res) => { _res.send('Api running.') });
  _app.get('/convert-string', require('./controllers/ctrl-convert-string'));
}
