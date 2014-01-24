module.exports = typeof window === 'undefined' ?
  require('./node/test-utils') :
  require('./browser/test-utils');
