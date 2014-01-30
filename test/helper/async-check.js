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
