/**
 * Routes for the express server.
 *
 * @param {object} _app - the express instance.
 */
module.exports = (_app) => {
  _app.get('/convert-string', require('./controllers/ctrl-convert-string'));
}
