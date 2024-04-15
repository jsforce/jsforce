import { Optional } from './util';
import { URLSearchParams } from 'url';
import * as FormData from 'form-data';

/**
 * type defs
 */
export type Callback<T, T2 = undefined> = (
  err: Error | null | undefined,
  ret?: T,
  ret2?: T2,
) => any;

export type HttpBody =
  | Buffer
  | URLSearchParams
  | NodeJS.ReadableStream
  | string
  | FormData
  | null;
//| Blob -- from fetch-blob - can add later if needed

export type HttpMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD';

export type HttpRequest = {
  url: string;
  method: HttpMethods;
  headers?: { [name: string]: string };
  body?: HttpBody;
};

export type HttpRequestOptions = {
  retry?: {
    maxRetries?: number;
    minTimeout?: number;
    timeoutFactor?: number;
    errorCodes?: string[];
    methods?: HttpMethods[];
    statusCodes?: number[];
  };
  httpProxy?: string;
  timeout?: number;
  followRedirect?: boolean | ((redirectUrl: string) => HttpRequest | null);
  encoding?: BufferEncoding;
};

export type HttpResponse = {
  statusCode: number;
  headers: { [name: string]: string };
  body: string;
};

export type Record = {
  [field: string]: any;
  Id?: string;
  attributes?: { type: string; url: string; [prop: string]: any };
};

export type SavedRecord = Record & { Id: string };

export type SaveError = {
  errorCode: string;
  message: string;
  fields?: string[];
};

export type SaveResult =
  | {
      success: true;
      id: string;
      errors: never[];
    }
  | {
      success: false;
      id?: undefined;
      errors: SaveError[];
    };

export type UpsertResult =
  | {
      success: true;
      id: string;
      created: boolean;
      errors: never[];
    }
  | {
      success: false;
      id?: undefined;
      created?: undefined;
      errors: SaveError[];
    };

export type SearchResult = {
  searchRecords: Record[];
};

export type RetrieveOptions = {
  allOrNone?: boolean;
  fields?: string[];
  headers?: { [name: string]: string };
};

export type DmlOptions = {
  allOrNone?: boolean;
  allowRecursive?: boolean;
  headers?: { [name: string]: string };
  multipartFileFields?: { [fieldName: string]: MultipartFileFieldOptions };
};

export type MultipartFileFieldOptions = {
  filename?: string;
  contentType: string;
};

export type SignedRequestObject = {
  client: {
    oauthToken: string;
  };
};

export type Field = {
  aggregatable: boolean;
  autoNumber: boolean;
  byteLength: number;
  calculated: boolean;
  calculatedFormula: Optional<string>;
  cascadeDelete: boolean;
  caseSensitive: boolean;
  compoundFieldName: Optional<string>;
  controllerName: Optional<string>;
  createable: boolean;
  custom: boolean;
  defaultValue: Optional<string>;
  defaultValueFormula: Optional<string>;
  defaultedOnCreate: boolean;
  dependentPicklist: boolean;
  deprecatedAndHidden: boolean;
  digits: number;
  displayLocationInDecimal: boolean;
  encrypted: boolean;
  externalId: boolean;
  extraTypeInfo: Optional<string>;
  filterable: boolean;
  filteredLookupInfo: object;
  groupable: boolean;
  highScaleNumber: boolean;
  htmlFormatted: boolean;
  idLookup: boolean;
  inlineHelpText: Optional<string>;
  label: string;
  length: number;
  mask: Optional<string>;
  maskType: Optional<string>;
  name: string;
  nameField: boolean;
  namePointing: boolean;
  nillable: boolean;
  permissionable: boolean;
  picklistValues: Optional<any[]>;
  precision: number;
  queryByDistance: boolean;
  referenceTargetField: object;
  referenceTo: Optional<string[]>;
  relationshipName: Optional<string>;
  relationshipOrder: Optional<number>;
  restrictedDelete: boolean;
  restrictedPicklist: boolean;
  scale: number;
  soapType: string;
  sortable: boolean;
  type: string;
  unique: boolean;
  updateable: boolean;
  writeRequiresMasterRead: boolean;
};

type ActionOverride = {
  formFactor: string;
  isAvailableInTouch: boolean;
  name: string;
  pageId: string;
  url: Optional<string>;
};

type ChildRelationship = {
  cascadeDelete: boolean;
  childSObject: string;
  deprecatedAndHidden: boolean;
  field: string;
  junctionIdListNames: string[];
  junctionReferenceTo: string[];
  relationshipName: Optional<string>;
  restrictedDelete: boolean;
};

type NamedLayoutInfo = {
  name: string;
  urls: { [key: string]: string };
};

type RecordTypeInfo = {
  available: boolean;
  defaultRecordTypeMapping: boolean;
  master: boolean;
  name: string;
  recordTypeId: string;
  urls: { [key: string]: string };
};

type ScopeInfo = {
  label: string;
  name: string;
};

type DescribeGlobalSObjectResult = {
  activateable: boolean;
  createable: boolean;
  custom: boolean;
  customSetting: boolean;
  deepCloneable: boolean;
  deletable: boolean;
  deprecatedAndHidden: boolean;
  feedEnabled: boolean;
  hasSubtypes: boolean;
  idEnabled: boolean;
  isInterface: boolean;
  isSubtype: boolean;
  keyPrefix: Optional<string>;
  label: string;
  labelPlural: string;
  layoutable: boolean;
  mergeable: boolean;
  mruEnabled: boolean;
  name: string;
  queryable: boolean;
  replicateable: boolean;
  retrieveable: boolean;
  searchable: boolean;
  triggerable: boolean;
  undeletable: boolean;
  updateable: boolean;
  urls: { [key: string]: string };
};

export type DescribeSObjectResult = DescribeGlobalSObjectResult & {
  actionOverrides: ActionOverride[];
  childRelationships: ChildRelationship[];
  compactLayoutable: boolean;
  fields: Field[];
  listviewable: boolean;
  lookupLayoutable: boolean;
  namedLayoutInfos: NamedLayoutInfo[];
  networkScopeFieldName: Optional<string>;
  recordTypeInfos: RecordTypeInfo[];
  searchLayoutable: boolean;
  supportedScopes: Optional<ScopeInfo[]>;
};

export type DescribeGlobalResult = {
  encoding: string;
  maxBatchSize: number;
  sobjects: DescribeGlobalSObjectResult[];
};

type DescribeColor = {
  color: string;
  context: string;
  theme: string;
};

type DescribeIcon = {
  contentType: string;
  height: Optional<number>;
  theme: string;
  url: string;
  width: Optional<number>;
};

type WebLinkPosition = 'fullScreen' | 'none' | 'topLeft';

type WebLinkType = 'javascript' | 'page' | 'sControl' | 'url';

type WebLinkWindowType =
  | 'newWindow'
  | 'noSidebar'
  | 'onClickJavaScript'
  | 'replace'
  | 'sidebar';

type DescribeLayoutButton = {
  behavior: Optional<WebLinkWindowType>;
  colors: Optional<DescribeColor[]>;
  content: Optional<string>;
  contentSource: Optional<WebLinkType>;
  custom: boolean;
  encoding: Optional<string>;
  height: Optional<number>;
  icons: Optional<DescribeIcon[]>;
  label: string;
  menubar: boolean;
  name: string;
  overridden: boolean;
  resizeable: boolean;
  scrollbars: boolean;
  showsLocation: boolean;
  showsStatus: boolean;
  toolbar: boolean;
  url: Optional<string>;
  width: Optional<number>;
  windowPosition: Optional<WebLinkPosition>;
};

type DescribeLayoutButtonSection = {
  detailButtons: DescribeLayoutButton[];
};

type LayoutComponentType =
  | 'AnalyticsCloud'
  | 'Canvas'
  | 'CustomLink'
  | 'EmptySpace'
  | 'ExpandedLookup'
  | 'Field'
  | 'ReportChart'
  | 'SControl'
  | 'Separator'
  | 'VisualforcePage';

type DescribeLayoutComponent = {
  details?: any;
  displayLines: number;
  tabOrder: number;
  type: LayoutComponentType;
  value: Optional<string>;
};

type DescribeLayoutItem = {
  editableForNew: boolean;
  editableForUpdate: boolean;
  label: string;
  layoutComponents: DescribeLayoutComponent[];
  placeholder: boolean;
  required: boolean;
};

type DescribeLayoutRow = {
  layoutItems: DescribeLayoutItem[];
  numItems: number;
};

type DescribeLayoutSection = {
  columns: number;
  heading: string;
  layoutRows: DescribeLayoutRow[];
  parentLayoutId: string;
  rows: number;
  tabOrder: 'LeftToRight' | 'TopToBottom';
  useCollapsibleSection: boolean;
  useHeading: boolean;
};

type DescribeQuickActionListItemResult = {
  colors: Optional<DescribeColor[]>;
  iconUrl: Optional<string>;
  icons: Optional<DescribeIcon[]>;
  label: string;
  miniIconUrl: Optional<string>;
  quickActionName: string;
  targetSobjectType: Optional<string>;
  type: 'Create' | 'VisualforcePage';
};

type DescribeQuickActionListResult = {
  quickActionListItems: DescribeQuickActionListItemResult[];
};

type DescribeRelatedContentItem = {
  describeLayoutItem: DescribeLayoutItem;
};

type RelatedContent = {
  relatedContentItems: DescribeRelatedContentItem[];
};

type RelatedListColumn = {
  field: Optional<string>;
  fieldApiName: string;
  format: Optional<string>;
  label: string;
  lookupId: Optional<string>;
  name: string;
  sortable: boolean;
};

type RelatedListSort = {
  column: string;
  ascending: boolean;
};

type RelatedList = {
  accessLevelRequiredForCreate: Optional<string>;
  buttons: DescribeLayoutButton[];
  columns: RelatedListColumn[];
  custom: boolean;
  field: Optional<string>;
  label: string;
  limitRows: number;
  name: string;
  sobject: Optional<string>;
  sort: RelatedListSort[];
};

type DescribeLayoutSaveOption = {
  defaultValue: boolean;
  isDisplayed: boolean;
  label: string;
  name: string;
  restHeaderName: string;
  soapHeaderName: string;
};

type DescribeLayout = {
  buttonLayoutSection: Optional<DescribeLayoutButtonSection>;
  detailLayoutSections: DescribeLayoutSection[];
  editLayoutSections: DescribeLayoutSection[];
  feedView: Optional<DescribeLayoutFeedView>;
  highlightsPanelLayoutSection: Optional<DescribeLayoutSection>;
  multirowEditLayoutSections: DescribeLayoutSection[];
  id: string;
  quickActionList: DescribeQuickActionListResult;
  relatedContent: RelatedContent;
  relatedLists: RelatedList[];
  saveOptions: DescribeLayoutSaveOption[];
};

type DescribeLayoutFeedFilter = {
  label: string;
  name: string;
  type: 'AllUpdates' | 'FeedItemType';
};

type DescribeLayoutFeedView = {
  feedFilters: DescribeLayoutFeedFilter[];
};

type RecordTypeMapping = any; // TODO

export type DescribeLayoutResult = {
  layouts: DescribeLayout[];
  recordTypeMappings: RecordTypeMapping[];
  recordTypeSelectorRequired: boolean[];
};

export type DescribeCompactLayout = {
  actions: DescribeLayoutButton[];
  fieldItems: DescribeLayoutItem[];
  id: Optional<string>;
  imageItems: DescribeLayoutItem[];
  label: string;
  name: string;
  objectType: string;
};

type RecordTypeCompactLayoutMapping = {
  available: boolean;
  compactLayoutId: Optional<string>;
  compactLayoutName: string;
  recordTypeId: string;
  recordTypeName: string;
};

export type DescribeCompactLayoutsResult = {
  compactLayouts: DescribeCompactLayout[];
  defaultCompactLayoutId: Optional<string>;
  recordTypeCompactLayoutMappings: RecordTypeCompactLayoutMapping[];
};

type DescribeApprovalLayout = {
  id: string;
  label: string;
  layoutItems: DescribeLayoutItem[];
  name: string;
};

export type DescribeApprovalLayoutsResult = {
  approvalLayouts: DescribeApprovalLayout[];
};

export type DescribeTab = {
  colors: DescribeColor[];
  custom: boolean;
  iconUrl: string;
  icons: DescribeIcon[];
  label: string;
  miniIconUrl: string;
  name: string;
  sobjectName: Optional<string>;
  url: string;
};

export type DescribeTheme = {
  themeItems: Array<{
    colors: Optional<DescribeColor[]>;
    icons: Optional<DescribeIcon[]>;
    name: string;
  }>;
};

export type DescribeQuickActionResult = {
  actionEnumOrId: string;
  label: string;
  name: string;
  type: string;
  urls: { [key: string]: string };
};

type DescribeQuickActionDefaultValue = any; // TODO

type QuickActionLayout = {
  collapsed: boolean;
  columns: number;
  heading: string | null;
  layoutRows: any[];
  layoutSectionId: string | null;
  parentLayoutId: string | null;
  rows: number;
  tabOrder: string; // 'LeftToRight',
  useCollapsibleSection: boolean;
  useHeading: boolean;
};

export type DescribeQuickActionDetailResult = DescribeQuickActionResult & {
  canvasApplicationId: string | null;
  canvasApplicationName: string | null;
  colors: DescribeColor[];
  contextSobjectType: string | null;
  defaultValues: DescribeQuickActionDefaultValue[];
  flowDevName: string | null;
  flowRecordIdVar: string | null;
  height: number;
  iconName: string | null;
  iconUrl: string | null;
  icons: DescribeIcon[];
  layout: QuickActionLayout;
  lightningComponentBundleId: string | null;
  lightningComponentBundleName: string | null;
  lightningComponentQualifiedName: string | null;
  lightningWebComponentBundleId: string | null;
  lightningWebComponentBundleName: string | null;
  lightningWebComponentQualifiedName: string | null;
  miniIconUrl: string;
  mobileExtensionId: string | null;
  showQuickActionLcHeader: boolean;
  showQuickActionVfHeader: boolean;
  targetParentField: string | null;
  targetRecordTypeId: string | null;
  targetSobjectType: string;
  type: string;
  visualforcePageName: string | null;
  visualforcePageUrl: string | null;
  width: number | null;
};

export type DeletedResult = {
  deletedRecords: Array<{
    id: string;
    deletedDate: string;
  }>;
  earliestDateAvailable: string;
  latestDateCovered: string;
};

export type UpdatedResult = {
  ids: string[];
  latestDateCovered: string;
};

export type OrganizationLimitsInfo = {
  [key: string]: {
    Max: number;
    Remaining: number;
  };
};

// https://help.salesforce.com/articleView?id=sf.remoteaccess_using_openid.htm&type=5
export type IdentityInfo = {
  user_id: string;
  organization_id: string;
  id: string;
  username: string;
  display_name: string;
  nick_name: string;
  email: string;
  photos: {
    picture: string;
    thumbnail: string;
  };
  urls: {
    enterprise: string;
    metadata: string;
    partner: string;
    rest: string;
    sobjects: string;
    search: string;
    query: string;
    profile: string;
  };
  user_type: string;
  language: string;
};

export type UserInfo = {
  id: string;
  organizationId: string;
  url: string;
};

export type LimitInfo = {
  apiUsage?: {
    used: number;
    limit: number;
  };
};

// https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_process_rules.htm
export type ProcessRule = {
  actions: {
    id: string;
    name: string;
    type: string;
  };
  description: string | null;
  id: string;
  name: string;
  namespacePrefix: string | null;
  object: string;
};

// https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_process_rules.htm
export type ProcessRules = {
  [index: string]: ProcessRule;
};
