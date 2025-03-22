import os from 'os';
import fs from 'node:fs';
import path from 'path';
import { DescribeSObjectResult } from '../types';
import { Cli } from '../cli/cli';
import { Connection, VERSION } from '..';
import { Command } from 'commander';
import { mkdir } from 'fs';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

function getCacheFileDir() {
  return path.join(os.tmpdir(), 'jsforce-gen-schema-cache');
}

function getCacheFilePath(orgId: string) {
  return path.join(getCacheFileDir(), orgId, 'describe.json');
}

async function readDescribedCache(
  orgId: string,
): Promise<UnwrapPromise<ReturnType<typeof loadDescribeResult>> | null> {
  try {
    const cacheFile = getCacheFilePath(orgId);
    const data = await fs.promises.readFile(cacheFile, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

async function loadDescribeResult(
  conn: Connection,
  orgId: string,
  cache?: boolean,
) {
  console.info('describing global');
  const { sobjects: sos } = await conn.describeGlobal();
  const sobjects = [];
  for (const { name } of sos) {
    console.info('describing ' + name);
    const so = await conn.describe(name);
    sobjects.push(so);
  }
  if (cache) {
    const cacheFile = getCacheFilePath(orgId);
    await fs.promises.mkdir(path.dirname(cacheFile), { recursive: true });
    await fs.promises.writeFile(
      cacheFile,
      JSON.stringify(sobjects, null, 2),
      'utf8',
    );
  }
  return sobjects;
}

function getParentReferences(sobject: DescribeSObjectResult) {
  const parentReferences = [];
  for (const {
    type,
    nillable,
    relationshipName,
    referenceTo,
  } of sobject.fields) {
    if (
      type === 'reference' &&
      relationshipName &&
      referenceTo &&
      referenceTo.length > 0
    ) {
      const parentSObject = referenceTo.length > 1 ? 'Name' : referenceTo[0];
      parentReferences.push({ nillable, parentSObject, relationshipName });
    }
  }
  return parentReferences;
}

function getTSTypeString(type: string): string {
  return type === 'double' ||
    type === 'int' ||
    type === 'currency' ||
    type === 'percent'
    ? 'number'
    : type === 'boolean'
    ? 'boolean'
    : type === 'date' || type === 'datetime' || type === 'time'
    ? 'DateString'
    : type === 'base64'
    ? 'BlobString'
    : type === 'address'
    ? 'Address'
    : type === 'complexvalue'
    ? 'any'
    : 'string';
}

async function dumpSchema(
  conn: Connection,
  orgId: string,
  outputFile: string,
  schemaName: string,
  cache?: boolean,
) {
  const sobjects =
    (cache ? await readDescribedCache(orgId) : null) ||
    (await loadDescribeResult(conn, orgId, cache));
  if (!fs.existsSync(outputFile)) {
    await fs.promises.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.promises.writeFile(outputFile, '', 'utf8');
  }
  const out = fs.createWriteStream(outputFile, 'utf8');
  return new Promise((resolve, reject) => {
    out.on('error', (err) => reject(err));
    out.on('finish', resolve);
    const writeLine = (message: string) => out.write(message + '\n');
    writeLine(
      "import { Schema, SObjectDefinition, DateString, BlobString, Address } from 'jsforce';",
    );
    writeLine('');
    for (const sobject of sobjects) {
      const { name, fields, childRelationships } = sobject;
      writeLine(`type Fields$${name} = {`);
      writeLine('  //');
      for (const { name, type, nillable } of fields) {
        const tsType = getTSTypeString(type);
        const orNull = nillable ? ' | null' : '';
        writeLine(`  ${name}: ${tsType}${orNull};`);
      }
      writeLine('};');
      writeLine('');
      writeLine(`type ParentReferences$${name} = {`);
      writeLine('  //');
      const parentReferences = getParentReferences(sobject);
      for (const {
        nillable,
        parentSObject,
        relationshipName,
      } of parentReferences) {
        const orNull = nillable ? ' | null' : '';
        writeLine(
          `  ${relationshipName}: SObjectDefinition$${parentSObject}${orNull};`,
        );
      }
      writeLine('};');
      writeLine('');
      writeLine(`type ChildRelationships$${name} = {`);
      writeLine('  //');
      for (const {
        field,
        childSObject,
        relationshipName,
      } of childRelationships) {
        if (
          field &&
          childSObject &&
          relationshipName &&
          !field.endsWith('__c')
        ) {
          writeLine(
            `  ${relationshipName}: SObjectDefinition$${childSObject};`,
          );
        }
      }
      writeLine('};');
      writeLine('');
      writeLine(
        `interface SObjectDefinition$${name} extends SObjectDefinition<'${name}'> {
    Name: '${name}';
    Fields: Fields$${name};
    ParentReferences: ParentReferences$${name};
    ChildRelationships: ChildRelationships$${name};
  }`,
      );
      writeLine('');
    }
    writeLine('');
    writeLine(`export interface ${schemaName} extends Schema {`);
    writeLine('  SObjects: {');
    for (const { name } of sobjects) {
      writeLine(`    ${name}: SObjectDefinition$${name};`);
    }
    writeLine('  };');
    writeLine('}');
    out.end();
  });
}

type GeneratorCommand = {
  connection?: string;
  username?: string;
  password?: string;
  loginUrl?: string;
  sandbox?: boolean;
  outputFile: string;
  cache?: boolean;
  clearCache?: boolean;
} & Command;

/**
 *
 */
function readCommand(): GeneratorCommand {
  return new Command()
    .option('-u, --username [username]', 'Salesforce username')
    .option(
      '-p, --password [password]',
      'Salesforce password (and security token, if available)',
    )
    .option(
      '-c, --connection [connection]',
      'Connection name stored in connection registry',
    )
    .option('-l, --loginUrl [loginUrl]', 'Salesforce login url')
    .option('-n, --schemaName [schemaName]', 'Name of schema type', 'MySchema')
    .requiredOption(
      '-o, --outputFile <outputFile>',
      'Generated schema file path',
      './schema.d.ts',
    )
    .option('--sandbox', 'Login to Salesforce sandbox')
    .option(
      '--no-cache',
      'Do not generate cache file for described result in tmp directory',
    )
    .option('--clearCache', 'Clear all existing described cache files')
    .version(VERSION)
    .parse(process.argv) as GeneratorCommand;
}

/**
 *
 */
export default async function main() {
  const program = readCommand();
  const cli = new Cli();
  await cli.connect(program);
  const conn = cli.getCurrentConnection();
  if (!conn.userInfo) {
    console.error('Cannot connect to Salesforce');
    return;
  }
  await dumpSchema(
    conn,
    conn.userInfo.organizationId,
    program.outputFile,
    program.schemaName,
    program.cache,
  );
  if (program.clearCache) {
    console.log('removing cache files');
    await fs.promises.rm(getCacheFileDir(), { recursive: true });
  }
  console.log(`Dumped to: ${program.outputFile}`);
}
