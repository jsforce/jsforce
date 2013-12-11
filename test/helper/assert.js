require('espower-loader')({
  // directory where match starts with
  cwd: process.cwd(),
  // glob pattern using minimatch module
  pattern: 'test/**/*.test.js'
});

/**
 *
 */
Function.prototype.check = function(done) {
  var fn = this;
  return function() {
    try {
      fn.apply(this, arguments);
      return done();
    } catch(e) {
      done(e);
      throw e;
    }
  };
};
