const { exec } = require('node:child_process');

exports.preCommit = async (props) => {
  exec('npm run build', (error, _, _) => {
    if (error) {
      throw error
    }
  })
}

