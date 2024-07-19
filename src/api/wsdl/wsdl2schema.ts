import fs from 'node:fs';
import xml2js from 'xml2js';
import { castTypeUsingSchema } from '../../soap';
import { SoapSchemaElementType, SoapSchemaDef } from '../../types';
import { isMapObject } from '../../util/function';

/**
 *
 */
const WSDLRestrictionSchema = {
  $: { base: 'string' },
  enumeration: [
    {
      $: { value: 'string' },
    },
  ],
  'xsd:enumeration': [
    {
      $: { value: 'string' },
    },
  ],
} as const;

const WSDLSimpleTypeSchema = {
  $: { name: 'string' },
  restriction: WSDLRestrictionSchema,
  'xsd:restriction': WSDLRestrictionSchema,
} as const;

const WSDLElementSchema = {
  $: {
    name: 'string',
    type: 'string',
    minOccurs: '?number',
    maxOccurs: '?string',
    nillable: '?boolean',
  },
} as const;

const WSDLSequenceSchema = {
  element: ['?', WSDLElementSchema],
  'xsd:element': ['?', WSDLElementSchema],
} as const;

const WSDLExtensionSchema = {
  $: { base: 'string' },
  sequence: { '?': WSDLSequenceSchema },
  'xsd:sequence': { '?': WSDLSequenceSchema },
} as const;

const WSDLComplexContentSchema = {
  extension: { '?': WSDLExtensionSchema },
  'xsd:extension': { '?': WSDLExtensionSchema },
} as const;

const WSDLComplexTypeSchema = {
  $: { name: 'string' },
  sequence: { '?': WSDLSequenceSchema },
  'xsd:sequence': { '?': WSDLSequenceSchema },
  complexContent: { '?': WSDLComplexContentSchema },
  'xsd:complexContent': { '?': WSDLComplexContentSchema },
} as const;

const WSDLSchemaSchema = {
  $: 'any',
  complexType: ['?', 'any'],
  simpleType: ['?', 'any'],
  'xsd:complexType': ['?', 'any'],
  'xsd:simpleType': ['?', 'any'],
} as const;

const WSDLSchema = {
  definitions: {
    $: 'any',
    types: {
      schema: ['?', WSDLSchemaSchema],
      'xsd:schema': ['?', WSDLSchemaSchema],
    },
    message: ['any'],
    portType: {
      $: 'any',
      operation: ['any'],
    },
    binding: {
      $: 'any',
      operation: ['any'],
    },
    service: {
      $: 'any',
      documentation: 'string',
      operation: ['any'],
    },
  },
} as const;

/**
 *
 */
type WSDL = SoapSchemaElementType<typeof WSDLSchema>;

type WSDLElement = SoapSchemaElementType<typeof WSDLElementSchema>;

type WSDLSimpleType = SoapSchemaElementType<typeof WSDLSimpleTypeSchema>;

type WSDLComplexType = SoapSchemaElementType<typeof WSDLComplexTypeSchema>;

/**
 *
 */
function toJsType(xsdType: string, simpleTypes: { [type: string]: string }) {
  switch (xsdType) {
    case 'xsd:boolean':
      return 'boolean';
    case 'xsd:string':
    case 'xsd:date':
    case 'xsd:dateTime':
    case 'xsd:time':
    case 'xsd:base64Binary':
      return 'string';
    case 'xsd:int':
    case 'xsd:long':
    case 'xsd:double':
      return 'number';
    case 'xsd:anyType':
      return 'any';
    default: {
      const [ns, type] = xsdType.split(':');
      if (simpleTypes[type]) {
        return simpleTypes[type];
      }
      if (ns) {
        return type;
      }
      return xsdType;
    }
  }
}

/**
 *
 */
async function readWSDLFile(filePath: string) {
  const xmlData = await fs.promises.readFile(filePath, 'utf8');
  const json = await xml2js.parseStringPromise(xmlData, {
    explicitArray: false,
  });
  return castTypeUsingSchema(json, WSDLSchema) as WSDL;
}

/**
 *
 */
function getTypeInfo(el: WSDLElement, simpleTypes: { [name: string]: string }) {
  const type = toJsType(el.$.type, simpleTypes);
  const isArray = el.$.maxOccurs === 'unbounded';
  const nillable = (!isArray && el.$.minOccurs === 0) || el.$.nillable;
  return isArray
    ? nillable
      ? ['?', type]
      : [type]
    : nillable
    ? `?${type}`
    : type;
}

/**
 *
 */
function extractComplexTypes(wsdl: WSDL) {
  console.log(wsdl.definitions.types['xsd:schema']);
  const schemas: { [name: string]: SoapSchemaDef } = {};
  const simpleTypes: { [type: string]: string } = {};
  const types = wsdl.definitions.types;
  for (const sc of types.schema ?? types['xsd:schema'] ?? []) {
    for (const st of sc.simpleType ?? sc['xsd:simpleType'] ?? []) {
      const simpleType: WSDLSimpleType = castTypeUsingSchema(
        st,
        WSDLSimpleTypeSchema,
      );
      const rs = simpleType.restriction ?? simpleType['xsd:restriction'];
      const base = rs.$.base.split(':')[1];
      simpleTypes[simpleType.$.name] = base;
    }
  }
  console.log({ simpleTypes });
  for (const sc of types.schema ?? types['xsd:schema'] ?? []) {
    for (const ct of sc.complexType ?? sc['xsd:complexType'] ?? []) {
      const complexType: WSDLComplexType = castTypeUsingSchema(
        ct,
        WSDLComplexTypeSchema,
      );
      const schema: {
        type: string;
        extends?: string;
        props: { [name: string]: any };
      } = {
        type: complexType.$.name,
        props: {},
      };
      const seq = complexType.sequence ?? complexType['xsd:sequence'];
      const els = seq?.element ?? seq?.['xsd:element'];
      for (const el of els ?? []) {
        schema.props[el.$.name] = getTypeInfo(el, simpleTypes);
      }
      const cc =
        complexType.complexContent ?? complexType['xsd:complexContent'];
      if (cc) {
        const extension = cc.extension ?? cc['xsd:extension'];
        if (extension) {
          schema.extends = extension.$.base.split(':')[1];
          const seq = extension.sequence ?? extension['xsd:sequence'];
          const els = seq?.element ?? seq?.['xsd:element'];
          for (const el of els ?? []) {
            schema.props[el.$.name] = getTypeInfo(el, simpleTypes);
          }
        }
      }
      schemas[complexType.$.name] = schema;
    }
  }
  return schemas;
}

/**
 *
 */
const GENERATED_MESSAGE_COMMENT = `/**
 * This file is generated from WSDL file by wsdl2schema.ts.
 * Do not modify directly.
 * To generate the file, run "ts-node path/to/wsdl2schema.ts path/to/wsdl.xml path/to/schema.ts"
 */
`;

/**
 *
 */
async function dumpSchema(schemas: { [name: string]: any }, outFile: string) {
  const out = fs.createWriteStream(outFile, 'utf8');
  const print = (str: string, indent: number = 0) => {
    for (let i = 0; i < indent; i++) {
      out.write(' ');
    }
    out.write(str);
  };
  const println = (str: string = '', indent: number = 0) => {
    print(str + '\n', indent);
  };
  return new Promise<void>((resolve, reject) => {
    out.on('error', reject);
    out.on('finish', () => resolve());
    println(GENERATED_MESSAGE_COMMENT);
    print('export const ApiSchemas = ');
    writeSchema(schemas);
    println(' as const;');
    println();
    writeTypeDefs(schemas);
    out.end();
  });

  function writeSchema(o: any, indent: number = 0) {
    if (indent > 20) {
      print("'any'");
      return;
    }
    if (Array.isArray(o)) {
      print('[');
      let i = 0;
      for (const co of o) {
        if (i > 0) {
          print(', ');
        }
        writeSchema(co, indent);
        i++;
      }
      print(']');
    } else if (isMapObject(o)) {
      const keys = Object.keys(o);
      if (keys.length > 0) {
        println('{');
        for (const name of keys) {
          const co = o[name];
          const nameId = /^[\w_$]+$/.test(name) ? name : `'${name}'`;
          print(`${nameId}: `, indent + 2);
          writeSchema(co, indent + 2);
          println(',');
        }
        print('}', indent);
      } else {
        print('{}');
      }
    } else {
      print(JSON.stringify(o).replace(/"/g, "'"));
    }
  }

  function writeTypeDef(
    o: any,
    schemas: { [name: string]: SoapSchemaDef },
    indent: number = 0,
  ) {
    if (typeof o === 'string') {
      print(o);
    } else if (isMapObject(o)) {
      if ('type' in o && 'props' in o) {
        if ('extends' in o && typeof o.extends === 'string') {
          print(`${o.extends} & `);
        }
        writeTypeDef(o.props, schemas, indent);
        return;
      }
      const keys = Object.keys(o);
      if (keys.length > 0) {
        println('{');
        for (const prop of Object.keys(o)) {
          let value: any = o[prop];
          let nillable = false;
          let isArray = false;
          if (Array.isArray(value)) {
            isArray = true;
            const len = value.length;
            if (len === 2 && value[0] === '?') {
              nillable = true;
              value = value[1];
            } else {
              value = value[0];
            }
          } else if (isMapObject(value)) {
            if ('?' in value) {
              nillable = true;
              value = value['?'];
            }
          }
          if (typeof value === 'string' && value.startsWith('?')) {
            nillable = true;
            value = value.substring(1);
          }
          print(`${prop}${nillable ? '?' : ''}: `, indent + 2);
          writeTypeDef(value, schemas, indent + 2);
          if (isArray) {
            print('[]');
          }
          if (nillable) {
            print(' | null | undefined');
          }
          println(';');
        }
        print('}', indent);
      } else {
        print('{}');
      }
    }
  }

  function writeTypeDefs(schemas: { [name: string]: SoapSchemaDef }) {
    for (const name of Object.keys(schemas)) {
      const schema = schemas[name];
      print(`export type ${name} = `);
      writeTypeDef(schema, schemas);
      println(';');
      println();
    }
    println('export type ApiSchemaTypes = {');
    for (const name of Object.keys(schemas)) {
      println(`${name}: ${name};`, 2);
    }
    println('};');
  }
}

/**
 *
 */
async function main() {
  const wsdlFilePath = process.argv[2];
  if (!wsdlFilePath) {
    console.error('No input WSDL file is specified.');
    return;
  }
  const outFilePath = process.argv[3];
  if (!wsdlFilePath) {
    console.error('No output typescript schema file is specified.');
    return;
  }
  const wsdl = await readWSDLFile(wsdlFilePath);
  const schemas = extractComplexTypes(wsdl);
  dumpSchema(schemas, outFilePath);
}

main();
