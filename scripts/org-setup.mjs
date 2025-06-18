import 'zx/globals';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EOL } from 'node:os';

$.verbose = false;

// node >= v21 deprecates the `punycode` module:
// https://nodejs.org/en/blog/announcements/v21-release-announce#deprecations
// The `sf` CLI is getting it via node-fetch v2 so we disable deprecations on node >= v21
// to be able to parse JSON output.
//
// Remove once `sf` no longer depends on node-fetch v2.
if (parseInt(process.versions.node.split('.')[0]) > 21) {
  process.env.NODE_OPTIONS = '--no-deprecation';
}

if (
  process.env.SF_HUB_USERNAME &&
  process.env.SF_OAUTH2_JWT_KEY &&
  process.env.SF_OAUTH2_CLIENT_ID
) {
  const hubOpts = {
    username: process.env.SF_HUB_USERNAME,
    clientId: process.env.SF_OAUTH2_CLIENT_ID,
    jwtKeyFile: join(process.cwd(), 'jwtKey.txt'),
  };

  await writeFile(hubOpts.jwtKeyFile, formatJwtKey());

  console.log('Logging into devhub using JWT...');
  await $`sf org login jwt --username ${hubOpts.username} --jwt-key-file "jwtKey.txt" --set-default-dev-hub --client-id ${hubOpts.clientId}`;
} else {
  // ensure there's a default devhub
  const defaultHub = JSON.parse(await $`sf config get target-dev-hub --json`);

  console.log('Logging into devhub using username and password...');
  if (defaultHub.result.find((res) => res.sucesss && res.value) !== undefined) {
    throw new Error(
      'Set SF_HUB_USERNAME, SF_OAUTH2_JWT_KEY and SF_OAUTH2_CLIENT_ID env vars.',
    );
  }
}

const orgDefinitionFile = join('test', 'test-org-setup', 'config', 'project-scratch-def.json');
console.log(`Creating scratch org using the definition ${orgDefinitionFile} file...`);
await $`sf org create scratch --definition-file ${orgDefinitionFile} --wait 20 --duration-days 1 --alias jsforce-test-org --json`;

console.log(`Generating password for the scratch org...`);
await $`sf org generate password --target-org jsforce-test-org --json`;

console.log(`Assigning the scratch org to the default devhub...`);
await $`sf project deploy start --metadata-dir ${join(
  'test',
  'package',
  'JSforceTestSuite',
)} --wait 20 --target-org jsforce-test-org`;

console.log(`Assigning the permission set JSForceTestPowerUser to the test user...`);
await $`sf org assign permset --name JSForceTestPowerUser --target-org jsforce-test-org`;

const orgDisplayUserRes = JSON.parse(
  await $`sf org display user --target-org jsforce-test-org --json`,
);

const userId = orgDisplayUserRes.result.id;

let csv = 'OwnerId' + EOL;

for (let i = 0; i <= 5000; i++) {
  csv += userId + EOL;
}

const bigTableCsv = join('test', 'data', 'BigTable.csv');
await fs.writeFile(bigTableCsv, csv);

console.log(`Inserting 5000 rows into BigTable__c...`);
await $`sf force data bulk upsert --file ${bigTableCsv} --sobject BigTable__c --external-id Id --target-org jsforce-test-org`;
await $`sf force data bulk upsert --file ${bigTableCsv} --sobject BigTable__c --external-id Id --target-org jsforce-test-org`;
await $`sf force data bulk upsert --file ${bigTableCsv} --sobject BigTable__c --external-id Id --target-org jsforce-test-org`;
await $`sf force data bulk upsert --file ${bigTableCsv} --sobject BigTable__c --external-id Id --target-org jsforce-test-org`;
await $`sf force data bulk upsert --file ${bigTableCsv} --sobject BigTable__c --external-id Id --target-org jsforce-test-org`;

if (!process.env.CI) {
  console.log(
    `Run tests using this scratch org by appending SF_LOGIN_URL=${orgDisplayUserRes.result.instanceUrl} SF_USERNAME=${orgDisplayUserRes.result.username} SF_PASSWORD=${orgDisplayUserRes.result.password}`,
  );
}

/**
 * Function examines the env var SF_OAUTH2_JWT_KEY to determine if it needs to be
 * reformatted so when saved to a file the RSA key file contents are formatted
 * properly.
 *
 * Throws an error if function is called and the env var is undefined
 *
 * returns a string that complies with RSA private key file format
 */
function formatJwtKey() {
  if (process.env.SF_OAUTH2_JWT_KEY) {
    const jwtKey = process.env.SF_OAUTH2_JWT_KEY;
    let keyLines = jwtKey.split(os.EOL);
    if (keyLines.length <= 1) {
      const footer = '-----END RSA PRIVATE KEY-----';
      const header = '-----BEGIN RSA PRIVATE KEY-----';
      // strip out header, footer and spaces
      const newKeyContents = jwtKey
        .replace(header, '')
        .replace(footer, '')
        .replace(/\s/g, '');
      // one big string, split into 64 byte chucks
      // const chunks = newKeyContents.match(/.{1,64}/g) as string[];
      keyLines = [header, ...newKeyContents.match(/.{1,64}/g), footer];
    }
    return keyLines.join('\n');
  } else {
    throw new Error('Set SF_OAUTH2_JWT_KEY env var.');
  }
}
