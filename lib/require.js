'use strict';

// As The webpack builder scans all script files under the directory where dynamic require resides,
// The code is separated to the dedicated directory.
module.exports = require('./dynreq/require');
