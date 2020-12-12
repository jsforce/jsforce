export type ReportDescribeResult = {
  attributes: ReportAttributes;
  reportTypeMetadata: ReportTypeMetadata;
  reportExtendedMetadata: ReportExtendedMetadata;
  reportMetadata: ReportMetadata;
};

export type ReportTypeMetadata = {
  categories: ReportTypeCategory[];
  dataTypeFilterOperatorMap: {
    [name: string]: Array<{
      name: string;
      label: string;
    }>;
  };
  dateGranularityInfos: Array<{
    name: string;
    label: string;
  }>;
  divisionInfo: {
    defaultValue: string;
    values: Array<{
      label: string;
      value: string;
    }>;
  } | null;
  scopeInfo: {
    defaultValue: string;
    values: Array<{
      allowsDivision: boolean;
      label: string;
      value: string;
    }>;
  };
  standardDateFilterDurationGroups: StandardDateFilterDurationGroup[];
  standardFilterInfos: string[] | null;
  supportsJoinedFormat: boolean;
};

type StandardDateFilterDurationGroup = {
  label: string;
  standardDateFilterDurations: StandardDateFilterDuration[];
};

type StandardDateFilterDuration = {
  endDate: string;
  label: string;
  startDate: string;
  value: string;
};

type ReportTypeCategory = {
  label: string;
  columns: { [name: string]: ReportTypeColumn };
};

type ReportTypeColumn = {
  allowedInCustomDetailFormula: boolean;
  bucketable: boolean;
  dataType: string;
  entityColumnName: string;
  fieldToFieldFilterable: boolean;
  filterValues: Array<{
    name: string;
    label: string;
  }>;
  filterable: boolean;
  isCustom: boolean;
  isLookup: boolean;
  label: string;
  maxLength: number | null;
  uniqueCountable: boolean;
};

type ReportAttributes = {
  type: 'Report';
  describeUrl: string;
  instancesUrl: string;
  reportName: string;
  reportId: string;
};

type ReportInstanceAttributes = {
  type: 'ReportInstance';
  completionDate: string | null;
  id: string;
  ownerId: string;
  reportId: string;
  reportName: string;
  requestDate: string;
  status: 'New' | 'Success' | 'Running' | 'Error';
};

type ReportResult<Attributes> = {
  attributes: Attributes;
  allData: boolean;
  factMap: { [key: string]: FactMap };
  groupingsAcross: {
    groupings: Grouping[];
  } | null;
  groupingsDown: {
    groupings: Grouping[];
  } | null;
  hasDetailRows: boolean;
  reportExtendedMetadata: ReportExtendedMetadata;
  reportMetadata: ReportMetadata;
};

export type ReportExecuteResult = ReportResult<ReportAttributes>;

export type ReportRetrieveResult = ReportResult<ReportInstanceAttributes>;

type FactMap = {
  aggregates: Array<{
    label: string;
    value: number;
  }>;
  rows?: Array<{
    dataCells: Array<{
      label: string;
      value: any;
    }>;
  }>;
};

type Grouping = {
  key: string;
  label: string;
  value: null | string;
  groupings: Grouping[];
  dategroupings?: any[];
};

export type ReportAsyncResult = {
  id: string;
  status: 'New' | 'Success' | 'Running' | 'Error';
  url: string;
  ownerId: string;
  completionDate: string;
  hasDetailRows: boolean;
  requestDate: string;
};

export type ReportExtendedMetadata = {
  aggregateColumnInfo: { [name: string]: AggregateColumnInfo };
  detailColumnInfo: { [name: string]: DetailColumnInfo };
  groupingColumnInfo: { [name: string]: GroupingColumnInfo };
  historicalColumnInfo?: { [name: string]: HistoricalColumnInfo };
};

type AggregateColumnInfo = {
  dataType: string;
  label: string;
  downGroupingContext?: string | null;
  acrossGroupingContext?: string | null;
};

type DetailColumnInfo = {
  dataType: string;
  entityColumnName: string;
  filterValues: Array<{
    label: string;
    name: string;
  }>;
  filterable: boolean;
  isLookup: boolean;
  label: string;
  uniqueCountable: boolean;
};

type GroupingColumnInfo = {
  dataType: string;
  groupingLevel: number;
  label: string;
};

type HistoricalColumnInfo = {
  baseField: string;
  historicalColumn: string;
  historicalSnapshotDate: string;
  isHistoricalChange: boolean;
};

export type ReportMetadata = {
  aggregates: string[];
  buckets: Bucket[];
  chart: Chart[] | null;
  crossFilters: CrossFilter[];
  customDetailFormula: CustomDetailFormula[];
  customSummaryFormula: CustomSummaryFormula[];
  currency: string | null;
  dashboardSetting: { [name: string]: string } | null;
  description: string | null;
  detailColumns: string[];
  developerName: string;
  division: string | null;
  folderId: string | null;
  groupingsAcross: GroupingsAcross[];
  groupingsDown: GroupingsDownElement[];
  hasDetailRows: boolean;
  hasRecordCount: boolean;
  historicalSnapshotDates: string[];
  id: string;
  name: string;
  presentationOptions: {
    hasStackedSummaries: boolean;
    historicalColumns: {
      [name: string]: {
        decreaseIsPositive: boolean;
        showChanges: boolean;
      };
    };
  };
  reportBooleanFilter: string | null;
  reportFilters: ReportFilterDetail[];
  reportFormat: 'TABULAR' | 'SUMMARY' | 'MATRIX' | 'MULTI_BLOCK';
  reportType: {
    label: string;
    type: string;
  };
  scope: string;
  showGrandTotal: boolean;
  showSubtotals: boolean;
  sortBy: Array<{
    sortColumn: string;
    sortOrder: string;
  }>;
  standardDateFilter: StandardDateFilter;
  standardFilters: StandardFilter[];
  supportsRoleHierarchy: boolean;
  topRows?: {
    rowLimit: number;
    direction: string;
  } | null;
  userOrHierarchyFilterId: string | null;
};

type Bucket = {
  bucketType: string;
  devloperName: string;
  label: string;
  nullTreatedAsZero: boolean;
  otherBucketLabel: string | null;
  sourceColumnName: string;
  values: BucketFieldValue[];
};

type BucketFieldValue = {
  label: string;
  sourceDimensionValues: string[];
  rangeUpperBound: number | null;
};

type CrossFilter = {
  criteria: ReportFilterDetail[];
  includesObject: boolean;
  primaryEntityField: string;
  relatedEntity: string;
  relatedEntityJoinField: string;
};

type ReportFilterOperator =
  | 'equals'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessOrEqual'
  | 'greaterOrEqual'
  | 'contains'
  | 'notContain'
  | 'startsWith'
  | 'includes'
  | 'excludes'
  | 'within';

type ReportFilterDetail = {
  column: string;
  filterType?: 'fieldToField' | 'fieldValue' | null;
  isRunPageEditable?: boolean;
  operator: ReportFilterOperator;
  value: string;
};

type Chart = {
  chartType: string;
  groupings: string;
  hasLegend: boolean;
  showChartValues: boolean;
  summaries: string[];
  summaryAxisLocations: 'X' | 'Y';
  title: string;
};

type CustomDetailFormula = {
  decimalPlaces: number | null;
  description: string | null;
  formula: string;
  formulaType: 'date' | 'datetime' | 'number' | 'text';
  label: string;
};

type CustomSummaryFormula = {
  label: string;
  description: string | null;
  formulaType: string;
  decimalPlaces: number | null;
  downGroup: string;
  downGroupType: 'all' | 'custom' | 'grand_total';
  acrossGroup: string;
  acrossGroupType: 'all' | 'custom' | 'grand_total';
  formula: string;
};

type GroupingsAcross = {
  name: string;
  sortOrder: string;
  dateGranularity: string;
};

type GroupingsDownElement = {
  dateGranularity: string;
  name: string;
  sortAggregate: string | null;
  sortOrder: string;
};

type StandardDateFilter = {
  column: string;
  durationValue: string;
  endDate: Date | null;
  startDate: Date | null;
};

type StandardFilter = {
  name: string;
  value: string;
};

type ComponentStatus = {
  dataStatus: 'NODATA' | 'DATA' | 'ERROR';
  errorCode: string | null;
  errorMessage: string | null;
  errorSeverity: 'Error' | 'Warning' | null;
  refreshDate: string | null;
  refreshStatus: 'IDLE' | 'RUNNING';
};

export type ReportInfo = {
  id: string;
  name: string;
  url: string;
  describeUrl: string;
  instancesUrl: string;
};

export type ReportInstanceInfo = {
  id: string;
  status: 'New' | 'Success' | 'Running' | 'Error';
  url: string;
  ownerId: string;
  hasDetailRows: boolean;
  completionDate: string;
  requestDate: string;
};

/*-----------------------------------------------------*/
export type DashboardMetadata = {
  attributes: {
    dashboardId: string;
    dashboardName: string;
    statusUrl: string;
    type: string;
  };
  canChangeRunningUser?: boolean;
  canUseStickyFilter?: boolean;
  chartTheme?: 'light' | 'dark';
  colorPalette?: string;
  components: DashboardComponent[];
  description: string | null;
  developerName: string;
  dashboardType?: 'SpecifiedUser' | 'LoggedInUser' | 'MyTeamUser';
  filters: DashboardFilter[];
  folderId: string;
  id: string;
  layout: DashboardLayout;
  maxFilterOptions?: number;
  name: string;
  runningUser: {
    displayName: string;
    id: string;
  };
};

type DashboardComponent = {
  componentData: number;
  footer: string | null;
  header: string | null;
  id: string;
  properties: DashboardComponentProperties;
  reportId: string;
  title: null;
  type: string;
};

type DashboardComponentProperties =
  | ReportComponentProperties
  | VisualforceComponentProperties;

type ReportComponentVisualizationType =
  | 'Bar'
  | 'Column'
  | 'Donut'
  | 'Funnel'
  | 'Gauge'
  | 'Line'
  | 'Metric'
  | 'Pie'
  | 'Scatter'
  | 'Table'
  | 'FlexTable';

type ReportComponentProperties = {
  aggregates: GroupingElement[];
  autoSelectColumns: boolean;
  drillUrl?: string;
  filterColumns: any[];
  groupings: GroupingElement[] | null;
  maxRows: number | null;
  reportFormat?: string;
  sort: SortElement | null;
  useReportChart: boolean;
  visualizationProperties: DashboardComponentVisualizationProperties;
  visualizationType: ReportComponentVisualizationType;
};

type GroupingElement = {
  inheritedReportSort?: string;
  name: string;
  sortAggregate?: string | null;
  sortOrder?: string | null;
};

type SortElement = {
  inheritedReportSort?: string;
  column: string;
  sortAggregate?: string | null;
  sortOrder?: string | null;
};

type VisualforceComponentProperties = {
  pageName: string;
  height: number;
};

type DashboardComponentVisualizationProperties =
  | ChartComponentVisualizationProperties
  | TableComponentVisualizationProperties
  | FlexTableComponentVisualizationProperties
  | MetricComponentVisualizationProperties
  | GaugeComponentVisualizationProperties;

type ChartComponentVisualizationProperties = {
  axisRange: string;
  decimalPrecision: number;
  displayUnits: ComponentDisplayUnit | null;
  drillURL: string | null;
  groupByType: string;
  legendPosition: 'bottom' | 'right' | 'none';
  showValues: boolean;
};

type TableComponentVisualizationProperties = {
  breakPoints: BreakPoint[];
  displayUnits: ComponentDisplayUnit | null;
  drillURL: string | null;
  tableColumns: TableColumn[];
};

type FlexTableComponentVisualizationProperties = {
  displayUnits: ComponentDisplayUnit | null;
  drillURL: string | null;
  flexTableType: 'tabular' | 'summary';
  showChatterPhotos?: boolean;
  tableColumns: TableColumn[];
};

type MetricComponentVisualizationProperties = {
  breakPoints: BreakPoint[];
  displayUnits: ComponentDisplayUnit | null;
  drillURL: string | null;
  metricLabel: string;
};

type GaugeComponentVisualizationProperties = {
  breakPoints: BreakPoint[];
  displayUnits: ComponentDisplayUnit | null;
  drillURL: string | null;
  showPercentages: boolean;
  showTotal: boolean;
};

type ComponentDisplayUnit =
  | 'whole'
  | 'auto'
  | 'hundreds'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

type BreakPoint = {
  aggregateName: string;
  breaks: Array<{
    color: string;
    lowerBound: number;
    upperBound: number;
  }>;
};

type TableColumn = {
  column: string;
  isPercent: boolean;
  scale: number | null;
  showTotal: boolean;
  type: 'detail' | 'aggregate' | 'grouping';
};

type DashboardLayout =
  | {
      gridLayout: true;
      components: DashboardLayoutComponent[];
      numColumns: number;
      rowHeight: number;
    }
  | {
      gridLayout: false;
      columns: Array<{
        components: number[];
      }>;
    };

type DashboardLayoutComponent = {
  colspan: number;
  column: number;
  row: number;
  rowspan: number;
};

type DashboardFilter = {
  errorMessage: string | null;
  name: string;
  options: DashboardFilterOption[];
  selectedOption: null;
};

type DashboardFilterOperation =
  | 'equals'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessOrEqual'
  | 'greaterOrEqual'
  | 'contains'
  | 'notContain'
  | 'startsWith'
  | 'includes'
  | 'excludes'
  | 'within'
  | 'between';

type DashboardFilterOption = {
  alias: string | null;
  id: string;
  operation: DashboardFilterOperation;
  value: string | null;
  startValue: string | null;
  endValue: string | null;
};

export type DashboardResult = {
  componentData: ComponentData[];
  dashboardMetadata: DashboardMetadata;
};

type ComponentData = {
  componentId: string;
  reportResult: ReportExecuteResult;
  status: ComponentStatus;
};

export type DashboardStatusResult = {
  componentStatus: Array<{
    componentId: string;
    refreshDate: string | null;
    refreshStatus: string;
  }>;
};

export type DashboardRefreshResult = {
  statusUrl: string;
};

export type DashboardInfo = {
  id: string;
  name: string;
  statusUrl: string;
  url: string;
};
