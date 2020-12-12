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
  reportResult: ReportResult;
  status: ComponentStatus;
};

type ReportResult = {
  attributes: null;
  allData: boolean;
  factMap: { [key: string]: FactMap };
  groupingsAcross: null;
  groupingsDown: ReportResultGroupingsDown;
  hasDetailRows: boolean;
  reportExtendedMetadata: ReportExtendedMetadata;
  reportMetadata: ReportMetadata;
};

type FactMap = {
  aggregates: Array<{
    label: string;
    value: number;
  }>;
};

type ReportResultGroupingsDown = {
  groupings: Grouping[];
};

type Grouping = {
  groupings: Grouping[];
  key: string;
  label: string;
  value: null | string;
};

type ReportExtendedMetadata = {
  aggregateColumnInfo: AggregateColumnInfo;
  detailColumnInfo: DetailColumnInfo;
  groupingColumnInfo: GroupingColumnInfo;
};

type AggregateColumnInfo = {
  [name: string]: {
    dataType: string;
    label: string;
  };
};

type DetailColumnInfo = {};

type GroupingColumnInfo = {
  [name: string]: {
    dataType: string;
    groupingLevel: number;
    label: string;
  };
};

type ReportMetadata = {
  aggregates: string[];
  buckets: Bucket[];
  chart: null;
  crossFilters: any[];
  currency: null;
  description: null;
  detailColumns: any[];
  developerName: string;
  division: null;
  folderId: string;
  groupingsAcross: any[];
  groupingsDown: GroupingsDownElement[];
  hasDetailRows: boolean;
  hasRecordCount: boolean;
  historicalSnapshotDates: any[];
  id: string;
  name: string;
  reportBooleanFilter: null;
  reportFilters: ReportFilter[];
  reportFormat: string;
  reportType: ReportType;
  scope: string;
  showGrandTotal: boolean;
  showSubtotals: boolean;
  sortBy: any[];
  standardDateFilter: StandardDateFilter;
  standardFilters: StandardFilter[];
};

type Bucket = {
  bucketType: string;
  devloperName: string;
  label: string;
  nullTreatedAsZero: boolean;
  otherBucketLabel: null;
  sourceColumnName: string;
  values: Value[];
};

type Value = {
  label: string;
  rangeUpperBound: null;
  sourceDimensionValues: string[];
};

type GroupingsDownElement = {
  dateGranularity: string;
  name: string;
  sortAggregate: null;
  sortOrder: string;
};

type ReportFilter = {
  column: string;
  isRunPageEditable: boolean;
  operator: string;
  value: string;
};

type ReportType = {
  label: string;
  type: string;
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

export type DashboardListItem = {
  id: string;
  name: string;
  statusUrl: string;
  url: string;
};
