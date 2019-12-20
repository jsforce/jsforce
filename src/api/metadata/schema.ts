import { SoapSchemaType } from '../../types';

export const ApiSchemas = {
  DeployResult: {
    canceledBy: '?string',
    canceledByName: '?string',
    checkOnly: 'boolean',
    completedDate: '?string',
    createdBy: 'string',
    createdByName: 'string',
    createdDate: 'string',
    details: {
      componentFailures: [
        {
          changed: 'boolean',
          columnNumber: '?number',
          componentType: '?string',
          created: 'boolean',
          createdDate: 'string',
          deleted: 'boolean',
          fileName: 'string',
          fullName: 'string',
          id: '?string',
          lineNumber: '?number',
          problem: '?string',
          problemType: '?string',
          success: 'boolean',
        },
      ],
      componentSuccesses: [
        {
          changed: 'boolean',
          columnNumber: '?number',
          componentType: '?string',
          created: 'boolean',
          createdDate: 'string',
          deleted: 'boolean',
          fileName: 'string',
          fullName: 'string',
          id: '?string',
          lineNumber: '?number',
          problem: '?string',
          problemType: '?string',
          success: 'boolean',
        },
      ],
      retrieveResult: {
        '?': {
          done: 'boolean',
          errorMessage: '?string',
          errorStatusCode: '?string',
          fileProperties: [
            {
              createdById: 'string',
              createdByName: 'string',
              createdDate: 'string',
              fileName: 'string',
              fullName: 'string',
              id: 'string',
              lastModifiedById: 'string',
              lastModifiedByName: 'string',
              lastModifiedDate: 'string',
              manageableState: '?string',
              namespacePrefix: '?string',
              type: 'string',
            },
          ],
          id: 'string',
          messages: [
            {
              fileName: 'string',
              problem: 'string',
            },
          ],
          status: 'string',
          success: 'boolean',
          zipFile: 'string',
        },
      },
      runTestResult: {
        '?': {
          apexLogId: '?string',
          codeCoverage: [
            {
              dmlInfo: [
                {
                  column: 'number',
                  line: 'number',
                  numExecutions: 'number',
                  time: 'number',
                },
              ],
              id: 'string',
              locationsNotCovered: [
                {
                  column: 'number',
                  line: 'number',
                  numExecutions: 'number',
                  time: 'number',
                },
              ],
              methodInfo: [
                {
                  column: 'number',
                  line: 'number',
                  numExecutions: 'number',
                  time: 'number',
                },
              ],
              name: 'string',
              namespace: '?string',
              numLocations: 'number',
              numLocationsNotCovered: 'number',
              soqlInfo: [
                {
                  column: 'number',
                  line: 'number',
                  numExecutions: 'number',
                  time: 'number',
                },
              ],
              soslInfo: [
                {
                  column: 'number',
                  line: 'number',
                  numExecutions: 'number',
                  time: 'number',
                },
              ],
              type: 'string',
            },
          ],
          codeCoverageWarnings: [
            {
              id: 'string',
              message: 'string',
              name: '?string',
              namespace: '?string',
            },
          ],
          failures: [
            {
              id: 'string',
              message: 'string',
              methodName: '?string',
              name: 'string',
              namespace: '?string',
              packageName: 'string',
              seeAllData: '?boolean',
              stackTrace: '?string',
              time: 'number',
              type: 'string',
            },
          ],
          flowCoverage: [
            {
              elementsNotCovered: ['string'],
              flowId: 'string',
              flowName: 'string',
              flowNamespace: '?string',
              numElements: 'number',
              numElementsNotCovered: 'number',
              processType: 'string',
            },
          ],
          flowCoverageWarnings: [
            {
              flowId: '?string',
              flowName: '?string',
              flowNamespace: '?string',
              message: 'string',
            },
          ],
          numFailures: 'number',
          numTestsRun: 'number',
          successes: [
            {
              id: 'string',
              methodName: 'string',
              name: 'string',
              namespace: '?string',
              seeAllData: '?boolean',
              time: 'number',
            },
          ],
          totalTime: 'number',
        },
      },
    },
    done: 'boolean',
    errorMessage: '?string',
    errorStatusCode: '?string',
    id: 'string',
    ignoreWarnings: 'boolean',
    lastModifiedDate: '?string',
    numberComponentErrors: 'number',
    numberComponentsDeployed: 'number',
    numberComponentsTotal: 'number',
    numberTestErrors: 'number',
    numberTestsCompleted: 'number',
    numberTestsTotal: 'number',
    rollbackOnError: 'boolean',
    runTestsEnabled: 'boolean',
    startDate: '?string',
    stateDetail: '?string',
    status: 'string',
    success: 'boolean',
  },
  RetrieveResult: {
    done: 'boolean',
    errorMessage: '?string',
    errorStatusCode: '?string',
    fileProperties: [
      {
        createdById: 'string',
        createdByName: 'string',
        createdDate: 'string',
        fileName: 'string',
        fullName: 'string',
        id: 'string',
        lastModifiedById: 'string',
        lastModifiedByName: 'string',
        lastModifiedDate: 'string',
        manageableState: '?string',
        namespacePrefix: '?string',
        type: 'string',
      },
    ],
    id: 'string',
    messages: [
      {
        fileName: 'string',
        problem: 'string',
      },
    ],
    status: 'string',
    success: 'boolean',
    zipFile: 'string',
  },
  FileProperties: {
    createdById: 'string',
    createdByName: 'string',
    createdDate: 'string',
    fileName: 'string',
    fullName: 'string',
    id: 'string',
    lastModifiedById: 'string',
    lastModifiedByName: 'string',
    lastModifiedDate: 'string',
    manageableState: '?string',
    namespacePrefix: '?string',
    type: 'string',
  },
  SaveResult: {
    errors: [
      {
        extendedErrorDetails: [
          {
            extendedErrorCode: 'string',
          },
        ],
        fields: ['string'],
        message: 'string',
        statusCode: 'string',
      },
    ],
    fullName: 'string',
    success: 'boolean',
  },
  DeployOptions: {
    allowMissingFiles: 'boolean',
    autoUpdatePackage: 'boolean',
    checkOnly: 'boolean',
    ignoreWarnings: 'boolean',
    performRetrieve: 'boolean',
    purgeOnDelete: 'boolean',
    rollbackOnError: 'boolean',
    runTests: ['string'],
    singlePackage: 'boolean',
    testLevel: 'string',
  },
  AsyncResult: {
    done: 'boolean',
    id: 'string',
    message: '?string',
    state: 'string',
    statusCode: '?string',
  },
  DescribeMetadataResult: {
    metadataObjects: [
      {
        childXmlNames: ['string'],
        directoryName: 'string',
        inFolder: 'boolean',
        metaFile: 'boolean',
        suffix: '?string',
        xmlName: 'string',
      },
    ],
    organizationNamespace: 'string',
    partialSaveAllowed: 'boolean',
    testRequired: 'boolean',
  },
  ListMetadataQuery: {
    folder: '?string',
    type: 'string',
  },
  RetrieveRequest: {
    apiVersion: 'number',
    packageNames: ['string'],
    singlePackage: 'boolean',
    specificFiles: ['string'],
    unpackaged: {
      '?': {},
    },
  },
  UpsertResult: {
    created: 'boolean',
    errors: [
      {
        extendedErrorDetails: [
          {
            extendedErrorCode: 'string',
          },
        ],
        fields: ['string'],
        message: 'string',
        statusCode: 'string',
      },
    ],
    fullName: 'string',
    success: 'boolean',
  },
} as const;

export type DeployResult = SoapSchemaType<typeof ApiSchemas.DeployResult>;

export type RetrieveResult = SoapSchemaType<typeof ApiSchemas.RetrieveResult>;

export type FileProperties = SoapSchemaType<typeof ApiSchemas.FileProperties>;

export type SaveResult = SoapSchemaType<typeof ApiSchemas.SaveResult>;

export type DeployOptions = SoapSchemaType<typeof ApiSchemas.DeployOptions>;

export type AsyncResult = SoapSchemaType<typeof ApiSchemas.AsyncResult>;

export type DescribeMetadataResult = SoapSchemaType<
  typeof ApiSchemas.DescribeMetadataResult
>;

export type ListMetadataQuery = SoapSchemaType<
  typeof ApiSchemas.ListMetadataQuery
>;

export type RetrieveRequest = SoapSchemaType<typeof ApiSchemas.RetrieveRequest>;

export type UpsertResult = SoapSchemaType<typeof ApiSchemas.UpsertResult>;
