const { exec } = require('node:child_process');

exports.preCommit = async () => {
  exec('npm run build', (error, _, _b) => {
    if (error) {
      throw error;
    }
  });
};
