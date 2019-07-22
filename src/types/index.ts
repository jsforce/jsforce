/**
 * type defs
 */
export type Optional<T> = T | null | undefined;

export type Callback<T, T2 = undefined> = (
  err: Error | null | undefined,
  ret?: T,
  ret2?: T2,
) => any;

export type HttpMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

export type HttpRequest = {
  url: string;
  method: HttpMethods;
  headers?: { [name: string]: string };
  body?: string;
};

export type HttpResponse = {
  statusCode: number;
  headers: { [name: string]: string };
  body: string;
};

export type Record = {
  [field: string]: any;
  Id: string;
  attributes?: { type: string };
};

export type UnsavedRecord = {
  [field: string]: any;
  attributes?: { type: string };
};

export type SaveError = {
  errorCode: string;
  message: string;
  fields?: string[];
};

export type SaveResult = {
  success: boolean;
  id?: string;
  errors: SaveError[];
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
  childSObject: Optional<string>;
  deprecatedAndHidden: boolean;
  field: 'WhatId';
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

type DescribeSObjectResult_ = {
  activateable: boolean;
  createable: boolean;
  custom: boolean;
  customSetting: boolean;
  deletable: boolean;
  deprecatedAndHidden: boolean;
  feedEnabled: boolean;
  hasSubtypes: boolean;
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

export type DescribeSObjectResult = DescribeSObjectResult_ & {
  actionOverrides: ActionOverride[];
  childRelationships: ChildRelationship[];
  compactLayoutable: boolean;
  fields: Field[];
  namedLayoutInfos: NamedLayoutInfo[];
  networkScopeFieldName: Optional<string>;
  recordTypeInfos: RecordTypeInfo[];
  searchLayoutable: boolean;
};

export type DescribeGlobalResult = {
  encoding: string;
  maxBatchSize: number;
  sobjects: DescribeSObjectResult_[];
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
  field: string;
  fieldApiName: string;
  format: string;
  label: string;
  lookupId: Optional<string>;
  name: string;
};

type RelatedListSort = {
  column: string;
  ascending: boolean;
};

type RelatedList = {
  buttons: DescribeLayoutButton[];
  columns: RelatedListColumn[];
  custom: boolean;
  label: string;
  limitRows: number;
  name: Optional<string>;
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
  buttonLayoutSection: DescribeLayoutButtonSection;
  detailLayoutSections: DescribeLayoutSection[];
  editLayoutSections: DescribeLayoutSection[];
  highlightsPanelLayoutSection: DescribeLayoutSection[];
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
  feedView: Optional<DescribeLayoutFeedView[]>;
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
  labe: string;
  layoutItems: DescribeLayoutItem[];
  name: string;
};

export type DescribeApprovalLayoutsResult = {
  approvalLayouts: DescribeApprovalLayout[];
};

export type DescribeTab = {
  colors: Optional<DescribeColor[]>;
  custom: boolean;
  iconUrl: string;
  icons: Optional<DescribeIcon[]>;
  label: string;
  miniIconUrl: string;
  name: string;
  sobjectName: string;
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

export type DescribeQuickActionDetailResult = DescribeQuickActionResult & {
  canvasApplicationId: Optional<string>;
  canvasApplicationName: Optional<string>;
  colors: Optional<DescribeColor[]>;
  defaultValues: Optional<DescribeQuickActionDefaultValue[]>;
  height: Optional<number>;
  iconName: Optional<string>;
  iconUrl: Optional<string>;
  icons: Optional<DescribeIcon[]>;
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

export type LimitsInfo = {
  [key: string]: {
    Max: number;
    Remaining: number;
  };
};
