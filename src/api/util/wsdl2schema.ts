import fs from 'fs-extra';
import xml2js from 'xml2js';
import { nillable, convertTypeUsingSchema } from '../../soap';
import { SoapSchemaType } from '../../types';
import { isMapObject } from '../../util/function';

/**
 *
 */
const WSDLSimpleTypeSchema = {
  $: { name: 'string' },
  'xsd:restriction': {
    $: { base: 'string' },
    'xsd:enumeration': [
      {
        $: { value: 'string' },
      },
    ],
  },
} as const;

const WSDLComplexTypeSchema = {
  $: { name: 'string' },
  'xsd:sequence': nillable({
    'xsd:element': [
      {
        $: {
          name: 'string',
          type: 'string',
          minOccurs: nillable('number'),
          maxOccurs: nillable('string'),
          nillable: nillable('boolean'),
        },
      },
    ],
  } as const),
} as const;

const WSDLSchema = {
  definitions: {
    $: 'any',
    types: {
      'xsd:schema': {
        $: 'any',
        'xsd:complexType': ['any'],
        'xsd:simpleType': ['any'],
      },
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
type WSDL = SoapSchemaType<typeof WSDLSchema>;

type WSDLSimpleType = SoapSchemaType<typeof WSDLSimpleTypeSchema>;

type WSDLComplexType = SoapSchemaType<typeof WSDLComplexTypeSchema>;

function toJsType(xsdType: string, simpleTypes: { [type: string]: string }) {
  switch (xsdType) {
    case 'xsd:boolean':
      return 'boolean';
    case 'xsd:string':
    case 'xsd:dateTime':
    case 'xsd:base64Binary':
      return 'string';
    case 'xsd:int':
    case 'xsd:double':
      return 'number';
    default: {
      const [ns, type] = xsdType.split(':');
      if (ns === 'xsd') {
        return type;
      } else if (simpleTypes[type]) {
        return simpleTypes[type];
      } else {
        return xsdType;
      }
    }
  }
}

/**
 *
 */
async function readWSDLFile(filePath: string) {
  const xmlData = await fs.readFile(filePath, 'utf8');
  const json = await xml2js.parseStringPromise(xmlData, {
    explicitArray: false,
  });
  return convertTypeUsingSchema(json, WSDLSchema) as WSDL;
}

/**
 *
 */
function extractComplexTypes(wsdl: WSDL) {
  let schemas: { [name: string]: any } = {};
  const simpleTypes: { [type: string]: string } = {};
  for (const st of wsdl.definitions.types['xsd:schema']['xsd:simpleType']) {
    const simpleType: WSDLSimpleType = convertTypeUsingSchema(
      st,
      WSDLSimpleTypeSchema,
    );
    const base = simpleType['xsd:restriction'].$.base.split(':')[1];
    simpleTypes[simpleType.$.name] = base;
  }
  for (const ct of wsdl.definitions.types['xsd:schema']['xsd:complexType']) {
    const complexType: WSDLComplexType = convertTypeUsingSchema(
      ct,
      WSDLComplexTypeSchema,
    );
    const schema: { [name: string]: any } = {};
    for (const el of complexType['xsd:sequence']?.['xsd:element'] ?? []) {
      let type = toJsType(el.$.type, simpleTypes);
      schema[el.$.name] =
        el.$.maxOccurs === 'unbounded'
          ? [type]
          : (type = el.$.minOccurs === 0 || el.$.nillable ? `?${type}` : type);
      // console.log(el.$.name, el);
    }
    schemas[complexType.$.name] = schema;
  }
  return schemas;
}

/**
 *
 */
function resolveSchemaReference(schemas: { [name: string]: any }) {
  function resolveSchemaRef(v: any): any {
    if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) {
        v[i] = resolveSchemaRef(v[i]);
      }
    } else if (isMapObject(v)) {
      for (const k of Object.keys(v)) {
        v[k] = resolveSchemaRef(v[k]);
      }
    } else if (typeof v === 'string' && /^\??tns:/.test(v)) {
      const ref = v.replace(/^\??tns:/, '');
      return schemas[ref];
    }
    return v;
  }
  return resolveSchemaRef(schemas);
}

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
  return new Promise((resolve, reject) => {
    out.on('error', reject);
    out.on('finish', () => resolve());
    println('import { SoapSchemaType } from "../../types";');
    println();
    print('export const ApiSchemas = ');
    writeSchema(schemas);
    println(' as const;');
    println();
    writeTypeDefs(schemas);
    out.end();
  });

  function writeSchema(o: any, indent: number = 0) {
    if (indent > 20) {
      print('"any"');
      return;
    }
    if (Array.isArray(o)) {
      print('[');
      for (const co of o) {
        writeSchema(co, indent);
      }
      print(']');
    } else if (isMapObject(o)) {
      println('{');
      for (const name of Object.keys(o)) {
        print(`${name}: `, indent + 2);
        writeSchema(o[name], indent + 2);
        println(',');
      }
      print('}', indent);
      return;
    } else {
      print(JSON.stringify(o));
    }
  }

  function writeTypeDefs(schemas: { [name: string]: any }) {
    for (const name of Object.keys(schemas)) {
      println(
        `export type ${name} = SoapSchemaType<typeof ApiSchemas.${name}>;`,
      );
      println();
    }
  }
}

/**
 *
 */
async function main() {
  const wsdlFilePath = process.argv[2];
  const outFilePath = process.argv[3];
  const targetMeta = process.argv[4].split(',');
  const wsdl = await readWSDLFile(wsdlFilePath);
  const schemas = extractComplexTypes(wsdl);
  resolveSchemaReference(schemas);
  const schms: typeof schemas = {};
  for (const name of Object.keys(schemas)) {
    if (targetMeta.includes(name)) {
      schms[name] = schemas[name];
    }
  }
  dumpSchema(schms, outFilePath);
}

main();
