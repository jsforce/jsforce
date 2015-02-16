/**
 *
 */
Function.prototype.check = function(done) {
  var fn = this;
  return function() {
    try {
      fn.apply(this, arguments);
    } catch(e) {
      return done(e);
    }
    done();
  };
};
