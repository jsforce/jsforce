/*global process */
var env = process.env;
if (typeof window !== 'undefiend') {
  try {
    env = require('./browser/env'); // in browser
  } catch(e) {}
}
module.exports = env;
