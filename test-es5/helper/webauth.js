module.exports = typeof window === 'undefined' ?
  require('./node/webauth') :
  require('./browser/webauth');
