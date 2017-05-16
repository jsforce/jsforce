/**
 * type defs
 */
export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  headers?: {[string]: string },
  body?: string
};

export type HttpResponse = {
  statusCode: number,
  headers: {[string]: string },
  body: string,
};

export type Callback<T> = (Error, T) => any;

export type Record = { Id: string };

export type UnsavedRecord = {};

export type SaveError = {
  errorCode: string,
  message: string,
  fields?: string[],
};

export type SaveResult = {
  id: string,
  sucess: boolean,
  errors: SaveError[],
};

export type Field = {
  aggregatable: boolean,
  autoNumber: boolean,
  byteLength: number,
  calculated: boolean,
  calculatedFormula: object,
  cascadeDelete: boolean,
  caseSensitive: boolean,
  compoundFieldName: object,
  controllerName: object,
  createable: boolean,
  custom: boolean,
  defaultValue: object,
  defaultValueFormula: object,
  defaultedOnCreate: boolean,
  dependentPicklist: boolean,
  deprecatedAndHidden: boolean,
  digits: number,
  displayLocationInDecimal: boolean,
  encrypted: boolean,
  externalId: boolean,
  extraTypeInfo: object,
  filterable: boolean,
  filteredLookupInfo: object,
  groupable: boolean,
  highScaleNumber: boolean,
  htmlFormatted: boolean,
  idLookup: boolean,
  inlineHelpText: object,
  label: string,
  length: number,
  mask: object,
  maskType: object,
  name: string,
  nameField: boolean,
  namePointing: boolean,
  nillable: boolean,
  permissionable: boolean,
  picklistValues: object,
  precision: number,
  queryByDistance: boolean,
  referenceTargetField: object,
  referenceTo: object,
  relationshipName: object,
  relationshipOrder: object,
  restrictedDelete: boolean,
  restrictedPicklist: boolean,
  scale: number,
  soapType: string,
  sortable: boolean,
  type: string,
  unique: boolean,
  updateable: boolean,
  writeRequiresMasterRead: boolean
};

type ActionOverride = {
  formFactor: string,
  isAvailableInTouch: boolean,
  name: string,
  pageId: string,
  url: ?string,
};

type ChildRelationship = {
  cascadeDelete: boolean,
  childSObject: ?string,
  deprecatedAndHidden: boolean,
  field: 'WhatId',
  junctionIdListNames: string[],
  junctionReferenceTo: string[],
  relationshipName: ?string,
  restrictedDelete: boolean,
};

type NamedLayoutInfo = {
  name: string,
  urls: {[string]: string },
};

type RecordTypeInfo = {
  available: boolean,
  defaultRecordTypeMapping: boolean,
  master: boolean,
  name: string,
  recordTypeId: string,
  urls: { [string]: string },
};

type DescribeSObjectResult_ = {
  activateable: boolean,
  createable: boolean,
  custom: boolean,
  customSetting: boolean,
  deletable: boolean,
  deprecatedAndHidden: boolean,
  feedEnabled: boolean,
  hasSubtypes: boolean,
  isSubtype: boolean,
  keyPrefix: ?string,
  label: string,
  labelPlural: string,
  layoutable: boolean,
  mergeable: boolean,
  mruEnabled: boolean,
  name: string,
  queryable: boolean,
  replicateable: boolean,
  retrieveable: boolean,
  searchable: boolean,
  triggerable: boolean,
  undeletable: boolean,
  updateable: boolean,
  urls: {[string]: string },
};

export type DescribeSObjectResult = DescribeSObjectResult_ & {
  actionOverrides: ActionOverride[],
  childRelationships: ChildRelationship[],
  compactLayoutable: boolean,
  fields: Field[],
  namedLayoutInfos: NamedLayoutInfo[],
  networkScopeFieldName: ?string,
  recordTypeInfos: RecordTypeInfo[],
  searchLayoutable: boolean,
};

export type DescribeGlobalResult = {
  encoding: string,
  maxBatchSize: number,
  sobjects: DescribeSObjectResult_[],
};

type DescribeColor = {
  color: string,
  context: string,
  theme: string
};

type DescribeIcon = {
  contentType: string,
  height: ?number,
  theme: string,
  url: string,
  width: ?number
};

type WebLinkPosition =
  'fullScreen' | 'none' | 'topLeft';

type WebLinkType =
  'javascript' | 'page' | 'sControl' | 'url';

type WebLinkWindowType =
  'newWindow' | 'noSidebar' | 'onClickJavaScript' | 'replace' | 'sidebar';

type DescribeLayoutButton = {
  behavior: ?WebLinkWindowType,
  colors: ?DescribeColor[],
  content: ?string,
  contentSource: ?WebLinkType,
  custom: boolean,
  encoding: ?string,
  height: ?number,
  icons: ?DescribeIcon[],
  label: string,
  menubar: boolean,
  name: string,
  overridden: boolean,
  resizeable: boolean,
  scrollbars: boolean,
  showsLocation: boolean,
  showsStatus: boolean,
  toolbar: boolean,
  url: ?string,
  width: ?number,
  windowPosition: ?WebLinkPosition,
};

type DescribeLayoutButtonSection = {
  detailButtons: DescribeLayoutButton[],
};

type LayoutComponentType =
  'AnalyticsCloud' | 'Canvas' | 'CustomLink' | 'EmptySpace' |
  'ExpandedLookup' | 'Field' | 'ReportChart' | 'SControl' |
  'Separator' | 'VisualforcePage';

type DescribeLayoutComponent = {
  details?: any,
  displayLines: number,
  tabOrder: number,
  type: LayoutComponentType,
  value: ?string,
};

type DescribeLayoutItem = {
  editableForNew: boolean,
  editableForUpdate: boolean,
  label: string,
  layoutComponents: DescribeLayoutComponent[],
  placeholder: boolean,
  required: boolean,
};

type DescribeLayoutRow = {
  layoutItems: DescribeLayoutItem[],
  numItems: number,
};

type DescribeLayoutSection = {
  columns: number,
  heading: string,
  layoutRows: DescribeLayoutRow[],
  parentLayoutId: string,
  rows: number,
  tabOrder: 'LeftToRight' | 'TopToBottom',
  useCollapsibleSection: boolean,
  useHeading: boolean,
};

type DescribeQuickActionListItemResult = {
  colors: ?DescribeColor[],
  iconUrl: ?string,
  icons: ?DescribeIcon[],
  label: string,
  miniIconUrl: ?string,
  quickActionName: string,
  targetSobjectType: ?string,
  type: 'Create' | 'VisualforcePage',
};

type DescribeQuickActionListResult = {
  quickActionListItems: DescribeQuickActionListItemResult[],
};

type DescribeRelatedContentItem = {
  describeLayoutItem: DescribeLayoutItem,
};

type RelatedContent = {
  relatedContentItems: DescribeRelatedContentItem[],
};

type RelatedListColumn = {
  field: string,
  fieldApiName: string,
  format: string,
  label: string,
  lookupId: ?string,
  name: string,
};

type RelatedListSort = {
  column: string,
  ascending: boolean,
};

type RelatedList = {
  buttons: DescribeLayoutButton[],
  columns: RelatedListColumn[],
  custom: boolean,
  label: string,
  limitRows: number,
  name: ?string,
  sobject: ?string,
  sort: RelatedListSort[],
};

type DescribeLayoutSaveOption = {
  defaultValue: boolean,
  isDisplayed: boolean,
  label: string,
  name: string,
  restHeaderName: string,
  soapHeaderName: string,
};

type DescribeLayout = {
  buttonLayoutSection: DescribeLayoutButtonSection,
  detailLayoutSections: DescribeLayoutSection[],
  editLayoutSections: DescribeLayoutSection[],
  highlightsPanelLayoutSection: DescribeLayoutSection[],
  multirowEditLayoutSections: DescribeLayoutSection[],
  id: string,
  quickActionList: DescribeQuickActionListResult,
  relatedContent: RelatedContent,
  relatedLists: RelatedList[],
  saveOptions: DescribeLayoutSaveOption[],
};

type DescribeLayoutFeedFilter = {
  label: string,
  name: string,
  type: 'AllUpdates' | 'FeedItemType',
};

type DescribeLayoutFeedView = {
  feedFilters: DescribeLayoutFeedFilter[],
};

export type DescribeLayoutResult = {
  feedView: ?DescribeLayoutFeedView[],
  layouts: DescribeLayout[],
  recordTypeMappings: RecordTypeMapping[],
  recordTypeSelectorRequired: boolean[],
};

export type DescribeCompactLayout = {
  actions: DescribeLayoutButton[],
  fieldItems: DescribeLayoutItem[],
  id: ?string,
  imageItems: DescribeLayoutItem[],
  label: string,
  name: string,
  objectType: string,
};

type RecordTypeCompactLayoutMapping = {
  available: boolean,
  compactLayoutId: ?string,
  compactLayoutName: string,
  recordTypeId: string,
  recordTypeName: string,
};

export type DescribeCompactLayoutsResult = {
  compactLayouts: DescribeCompactLayout[],
  defaultCompactLayoutId: ?string,
  recordTypeCompactLayoutMappings: RecordTypeCompactLayoutMapping[],
};

type DescribeApprovalLayout = {
  id: string,
  labe: string,
  layoutItems: DescribeLayoutItem[],
  name: string,
};

export type DescribeApprovalLayoutsResult = {
  approvalLayouts: DescribeApprovalLayout[],
};

export type DescribeTab = {
  colors: ?DescribeColor[],
  custom: boolean,
  iconUrl: string,
  icons: ?DescribeIcon[],
  label: string,
  miniIconUrl: string,
  name: string,
  sobjectName: string,
  url: string,
};

export type DescribeTheme = {
  themeItems: Array<{
    colors: ?DescribeColor[],
    icons: ?DescribeIcon[],
    name: string,
  }>
};

export type DescribeQuickActionResult = {
  actionEnumOrId: string,
  label: string,
  name: string,
  type: string,
  urls: {[string]: string },
};

export type DescribeQuickActionDetailResult = DescribeQuickActionResult & {
  canvasApplicationId: ?string,
  canvasApplicationName: ?string,
  colors: ?DescribeColor[],
  defaultValues: ?DescribeQuickActionDefaultValue[],
  height: ?number,
  iconName: ?string,
  iconUrl: ?string,
  icons: ?DescribeIcon[],
};

export type DeletedResult = {
  deletedRecords: Array<{
    id: string,
    deletedDate: string,
  }>,
  earliestDateAvailable: string,
  latestDateCovered: string,
};

export type UpdatedResult = {
  ids: string[],
  latestDateCovered: string,
};


export type LimitsInfo = {
  [string]: {
    Max: number,
    Remaining: number,
  },
};
