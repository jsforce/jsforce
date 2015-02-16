/*global process */
var env = process.env;
if (typeof window !== 'undefined') {
  try {
    env = require('./browser/env'); // in browser
  } catch(e) {}
}
module.exports = env;
