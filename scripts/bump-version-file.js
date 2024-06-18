const fs = require('node:fs/promises');

exports.preCommit = async (props) => {
  const updatedVersion = (await fs.readFile('./src/VERSION.ts', {
    encoding: 'utf-8'
  })).replace(/'[^']*'/g, `'${props.version}'`)

  await fs.writeFile('./src/VERSION.ts', updatedVersion)
};
