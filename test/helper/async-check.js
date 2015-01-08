/**
 *
 */
Function.prototype.check = function(done) {
  var fn = this;
  return function() {
    fn.apply(this, arguments);
    done();
  };
};
