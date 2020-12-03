import { Schema, SObjectDefinition, DateString, BlobString, Address } from 'jsforce';

type Fields$AcceptedEventRelation = {
  //
  Id: string;
  RelationId: string | null;
  EventId: string | null;
  RespondedDate: DateString | null;
  Response: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  Type: string | null;
};

type ParentReferences$AcceptedEventRelation = {
  //
  Relation: SObjectDefinition$Name | null;
  Event: SObjectDefinition$Event | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AcceptedEventRelation = {
  //
};

interface SObjectDefinition$AcceptedEventRelation extends SObjectDefinition<'AcceptedEventRelation'> {
    Name: 'AcceptedEventRelation';
    Fields: Fields$AcceptedEventRelation;
    ParentReferences: ParentReferences$AcceptedEventRelation;
    ChildRelationships: ChildRelationships$AcceptedEventRelation;
  }

type Fields$Account = {
  //
  Id: string;
  IsDeleted: boolean;
  MasterRecordId: string | null;
  Name: string;
  Type: string | null;
  ParentId: string | null;
  BillingStreet: string | null;
  BillingCity: string | null;
  BillingState: string | null;
  BillingPostalCode: string | null;
  BillingCountry: string | null;
  BillingLatitude: number | null;
  BillingLongitude: number | null;
  BillingGeocodeAccuracy: string | null;
  BillingAddress: Address | null;
  ShippingStreet: string | null;
  ShippingCity: string | null;
  ShippingState: string | null;
  ShippingPostalCode: string | null;
  ShippingCountry: string | null;
  ShippingLatitude: number | null;
  ShippingLongitude: number | null;
  ShippingGeocodeAccuracy: string | null;
  ShippingAddress: Address | null;
  Phone: string | null;
  Fax: string | null;
  AccountNumber: string | null;
  Website: string | null;
  PhotoUrl: string | null;
  Sic: string | null;
  Industry: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  Ownership: string | null;
  TickerSymbol: string | null;
  Description: string | null;
  Rating: string | null;
  Site: string | null;
  CurrencyIsoCode: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Jigsaw: string | null;
  JigsawCompanyId: string | null;
  CleanStatus: string | null;
  AccountSource: string | null;
  DunsNumber: string | null;
  Tradestyle: string | null;
  NaicsCode: string | null;
  NaicsDesc: string | null;
  YearStarted: string | null;
  SicDesc: string | null;
  DandbCompanyId: string | null;
  OperatingHoursId: string | null;
};

type ParentReferences$Account = {
  //
  MasterRecord: SObjectDefinition$Account | null;
  Parent: SObjectDefinition$Account | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DandbCompany: SObjectDefinition$DandBCompany | null;
  OperatingHours: SObjectDefinition$OperatingHours | null;
};

type ChildRelationships$Account = {
  //
  ChildAccounts: SObjectDefinition$Account;
  AccountCleanInfos: SObjectDefinition$AccountCleanInfo;
  AccountContactRoles: SObjectDefinition$AccountContactRole;
  Feeds: SObjectDefinition$AccountFeed;
  Histories: SObjectDefinition$AccountHistory;
  AccountPartnersFrom: SObjectDefinition$AccountPartner;
  AccountPartnersTo: SObjectDefinition$AccountPartner;
  Shares: SObjectDefinition$AccountShare;
  ActivityHistories: SObjectDefinition$ActivityHistory;
  Assets: SObjectDefinition$Asset;
  ProvidedAssets: SObjectDefinition$Asset;
  ServicedAssets: SObjectDefinition$Asset;
  AssociatedLocations: SObjectDefinition$AssociatedLocation;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  Cases: SObjectDefinition$Case;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  Contacts: SObjectDefinition$Contact;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Contracts: SObjectDefinition$Contract;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  MaintenancePlans: SObjectDefinition$MaintenancePlan;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  Opportunities: SObjectDefinition$Opportunity;
  OpportunityPartnersTo: SObjectDefinition$OpportunityPartner;
  Orders: SObjectDefinition$Order;
  PartnersFrom: SObjectDefinition$Partner;
  PartnersTo: SObjectDefinition$Partner;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductRequests: SObjectDefinition$ProductRequest;
  ProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  RecordActions: SObjectDefinition$RecordAction;
  ResourcePreferences: SObjectDefinition$ResourcePreference;
  ReturnOrders: SObjectDefinition$ReturnOrder;
  ServiceAppointmentAccount: SObjectDefinition$ServiceAppointment;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  Users: SObjectDefinition$User;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$Account extends SObjectDefinition<'Account'> {
    Name: 'Account';
    Fields: Fields$Account;
    ParentReferences: ParentReferences$Account;
    ChildRelationships: ChildRelationships$Account;
  }

type Fields$AccountChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  LastName: string | null;
  FirstName: string | null;
  Salutation: string | null;
  Type: string | null;
  ParentId: string | null;
  BillingStreet: string | null;
  BillingCity: string | null;
  BillingState: string | null;
  BillingPostalCode: string | null;
  BillingCountry: string | null;
  BillingLatitude: number | null;
  BillingLongitude: number | null;
  BillingGeocodeAccuracy: string | null;
  BillingAddress: Address | null;
  ShippingStreet: string | null;
  ShippingCity: string | null;
  ShippingState: string | null;
  ShippingPostalCode: string | null;
  ShippingCountry: string | null;
  ShippingLatitude: number | null;
  ShippingLongitude: number | null;
  ShippingGeocodeAccuracy: string | null;
  ShippingAddress: Address | null;
  Phone: string | null;
  Fax: string | null;
  AccountNumber: string | null;
  Website: string | null;
  Sic: string | null;
  Industry: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  Ownership: string | null;
  TickerSymbol: string | null;
  Description: string | null;
  Rating: string | null;
  Site: string | null;
  CurrencyIsoCode: string | null;
  OwnerId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Jigsaw: string | null;
  JigsawCompanyId: string | null;
  CleanStatus: string | null;
  AccountSource: string | null;
  DunsNumber: string | null;
  Tradestyle: string | null;
  NaicsCode: string | null;
  NaicsDesc: string | null;
  YearStarted: string | null;
  SicDesc: string | null;
  DandbCompanyId: string | null;
  OperatingHoursId: string | null;
};

type ParentReferences$AccountChangeEvent = {
  //
};

type ChildRelationships$AccountChangeEvent = {
  //
};

interface SObjectDefinition$AccountChangeEvent extends SObjectDefinition<'AccountChangeEvent'> {
    Name: 'AccountChangeEvent';
    Fields: Fields$AccountChangeEvent;
    ParentReferences: ParentReferences$AccountChangeEvent;
    ChildRelationships: ChildRelationships$AccountChangeEvent;
  }

type Fields$AccountCleanInfo = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AccountId: string;
  LastMatchedDate: DateString;
  LastStatusChangedDate: DateString | null;
  LastStatusChangedById: string | null;
  IsInactive: boolean;
  CompanyName: string | null;
  Phone: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Website: string | null;
  TickerSymbol: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  Industry: string | null;
  Ownership: string | null;
  DunsNumber: string | null;
  Sic: string | null;
  SicDescription: string | null;
  NaicsCode: string | null;
  NaicsDescription: string | null;
  YearStarted: string | null;
  Fax: string | null;
  AccountSite: string | null;
  Description: string | null;
  Tradestyle: string | null;
  DandBCompanyDunsNumber: string | null;
  DunsRightMatchGrade: string | null;
  DunsRightMatchConfidence: number | null;
  CompanyStatusDataDotCom: string | null;
  IsReviewedCompanyName: boolean;
  IsReviewedPhone: boolean;
  IsReviewedAddress: boolean;
  IsReviewedWebsite: boolean;
  IsReviewedTickerSymbol: boolean;
  IsReviewedAnnualRevenue: boolean;
  IsReviewedNumberOfEmployees: boolean;
  IsReviewedIndustry: boolean;
  IsReviewedOwnership: boolean;
  IsReviewedDunsNumber: boolean;
  IsReviewedSic: boolean;
  IsReviewedSicDescription: boolean;
  IsReviewedNaicsCode: boolean;
  IsReviewedNaicsDescription: boolean;
  IsReviewedYearStarted: boolean;
  IsReviewedFax: boolean;
  IsReviewedAccountSite: boolean;
  IsReviewedDescription: boolean;
  IsReviewedTradestyle: boolean;
  IsReviewedDandBCompanyDunsNumber: boolean;
  IsDifferentCompanyName: boolean;
  IsDifferentPhone: boolean;
  IsDifferentStreet: boolean;
  IsDifferentCity: boolean;
  IsDifferentState: boolean;
  IsDifferentPostalCode: boolean;
  IsDifferentCountry: boolean;
  IsDifferentWebsite: boolean;
  IsDifferentTickerSymbol: boolean;
  IsDifferentAnnualRevenue: boolean;
  IsDifferentNumberOfEmployees: boolean;
  IsDifferentIndustry: boolean;
  IsDifferentOwnership: boolean;
  IsDifferentDunsNumber: boolean;
  IsDifferentSic: boolean;
  IsDifferentSicDescription: boolean;
  IsDifferentNaicsCode: boolean;
  IsDifferentNaicsDescription: boolean;
  IsDifferentYearStarted: boolean;
  IsDifferentFax: boolean;
  IsDifferentAccountSite: boolean;
  IsDifferentDescription: boolean;
  IsDifferentTradestyle: boolean;
  IsDifferentDandBCompanyDunsNumber: boolean;
  IsDifferentStateCode: boolean;
  IsDifferentCountryCode: boolean;
  CleanedByJob: boolean;
  CleanedByUser: boolean;
  IsFlaggedWrongCompanyName: boolean;
  IsFlaggedWrongPhone: boolean;
  IsFlaggedWrongAddress: boolean;
  IsFlaggedWrongWebsite: boolean;
  IsFlaggedWrongTickerSymbol: boolean;
  IsFlaggedWrongAnnualRevenue: boolean;
  IsFlaggedWrongNumberOfEmployees: boolean;
  IsFlaggedWrongIndustry: boolean;
  IsFlaggedWrongOwnership: boolean;
  IsFlaggedWrongDunsNumber: boolean;
  IsFlaggedWrongSic: boolean;
  IsFlaggedWrongSicDescription: boolean;
  IsFlaggedWrongNaicsCode: boolean;
  IsFlaggedWrongNaicsDescription: boolean;
  IsFlaggedWrongYearStarted: boolean;
  IsFlaggedWrongFax: boolean;
  IsFlaggedWrongAccountSite: boolean;
  IsFlaggedWrongDescription: boolean;
  IsFlaggedWrongTradestyle: boolean;
  DataDotComId: string | null;
};

type ParentReferences$AccountCleanInfo = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account;
  LastStatusChangedBy: SObjectDefinition$User | null;
};

type ChildRelationships$AccountCleanInfo = {
  //
};

interface SObjectDefinition$AccountCleanInfo extends SObjectDefinition<'AccountCleanInfo'> {
    Name: 'AccountCleanInfo';
    Fields: Fields$AccountCleanInfo;
    ParentReferences: ParentReferences$AccountCleanInfo;
    ChildRelationships: ChildRelationships$AccountCleanInfo;
  }

type Fields$AccountContactRole = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AccountId: string;
  ContactId: string;
  Role: string | null;
  IsPrimary: boolean;
};

type ParentReferences$AccountContactRole = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account;
  Contact: SObjectDefinition$Contact;
};

type ChildRelationships$AccountContactRole = {
  //
};

interface SObjectDefinition$AccountContactRole extends SObjectDefinition<'AccountContactRole'> {
    Name: 'AccountContactRole';
    Fields: Fields$AccountContactRole;
    ParentReferences: ParentReferences$AccountContactRole;
    ChildRelationships: ChildRelationships$AccountContactRole;
  }

type Fields$AccountContactRoleChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  AccountId: string | null;
  ContactId: string | null;
  Role: string | null;
  IsPrimary: boolean;
};

type ParentReferences$AccountContactRoleChangeEvent = {
  //
};

type ChildRelationships$AccountContactRoleChangeEvent = {
  //
};

interface SObjectDefinition$AccountContactRoleChangeEvent extends SObjectDefinition<'AccountContactRoleChangeEvent'> {
    Name: 'AccountContactRoleChangeEvent';
    Fields: Fields$AccountContactRoleChangeEvent;
    ParentReferences: ParentReferences$AccountContactRoleChangeEvent;
    ChildRelationships: ChildRelationships$AccountContactRoleChangeEvent;
  }

type Fields$AccountFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$AccountFeed = {
  //
  Parent: SObjectDefinition$Account;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$AccountFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$AccountFeed extends SObjectDefinition<'AccountFeed'> {
    Name: 'AccountFeed';
    Fields: Fields$AccountFeed;
    ParentReferences: ParentReferences$AccountFeed;
    ChildRelationships: ChildRelationships$AccountFeed;
  }

type Fields$AccountHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  AccountId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$AccountHistory = {
  //
  Account: SObjectDefinition$Account;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$AccountHistory = {
  //
};

interface SObjectDefinition$AccountHistory extends SObjectDefinition<'AccountHistory'> {
    Name: 'AccountHistory';
    Fields: Fields$AccountHistory;
    ParentReferences: ParentReferences$AccountHistory;
    ChildRelationships: ChildRelationships$AccountHistory;
  }

type Fields$AccountPartner = {
  //
  Id: string;
  AccountFromId: string;
  AccountToId: string;
  OpportunityId: string | null;
  Role: string | null;
  IsPrimary: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  ReversePartnerId: string | null;
};

type ParentReferences$AccountPartner = {
  //
  AccountFrom: SObjectDefinition$Account;
  AccountTo: SObjectDefinition$Account;
  Opportunity: SObjectDefinition$Opportunity | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AccountPartner = {
  //
};

interface SObjectDefinition$AccountPartner extends SObjectDefinition<'AccountPartner'> {
    Name: 'AccountPartner';
    Fields: Fields$AccountPartner;
    ParentReferences: ParentReferences$AccountPartner;
    ChildRelationships: ChildRelationships$AccountPartner;
  }

type Fields$AccountShare = {
  //
  Id: string;
  AccountId: string;
  UserOrGroupId: string;
  AccountAccessLevel: string;
  OpportunityAccessLevel: string;
  CaseAccessLevel: string;
  ContactAccessLevel: string | null;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$AccountShare = {
  //
  Account: SObjectDefinition$Account;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AccountShare = {
  //
};

interface SObjectDefinition$AccountShare extends SObjectDefinition<'AccountShare'> {
    Name: 'AccountShare';
    Fields: Fields$AccountShare;
    ParentReferences: ParentReferences$AccountShare;
    ChildRelationships: ChildRelationships$AccountShare;
  }

type Fields$ActionLinkGroupTemplate = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExecutionsAllowed: string;
  HoursUntilExpiration: number | null;
  Category: string;
  IsPublished: boolean;
};

type ParentReferences$ActionLinkGroupTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ActionLinkGroupTemplate = {
  //
  ActionLinkTemplates: SObjectDefinition$ActionLinkTemplate;
};

interface SObjectDefinition$ActionLinkGroupTemplate extends SObjectDefinition<'ActionLinkGroupTemplate'> {
    Name: 'ActionLinkGroupTemplate';
    Fields: Fields$ActionLinkGroupTemplate;
    ParentReferences: ParentReferences$ActionLinkGroupTemplate;
    ChildRelationships: ChildRelationships$ActionLinkGroupTemplate;
  }

type Fields$ActionLinkTemplate = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ActionLinkGroupTemplateId: string;
  LabelKey: string;
  Method: string;
  LinkType: string;
  Position: number;
  IsConfirmationRequired: boolean;
  IsGroupDefault: boolean;
  UserVisibility: string;
  UserAlias: string | null;
  Label: string | null;
  ActionUrl: string;
  RequestBody: string | null;
  Headers: string | null;
};

type ParentReferences$ActionLinkTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ActionLinkGroupTemplate: SObjectDefinition$ActionLinkGroupTemplate;
};

type ChildRelationships$ActionLinkTemplate = {
  //
};

interface SObjectDefinition$ActionLinkTemplate extends SObjectDefinition<'ActionLinkTemplate'> {
    Name: 'ActionLinkTemplate';
    Fields: Fields$ActionLinkTemplate;
    ParentReferences: ParentReferences$ActionLinkTemplate;
    ChildRelationships: ChildRelationships$ActionLinkTemplate;
  }

type Fields$ActivityHistory = {
  //
  Id: string;
  AccountId: string | null;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  IsTask: boolean;
  ActivityDate: DateString | null;
  OwnerId: string | null;
  Status: string | null;
  Priority: string | null;
  IsHighPriority: boolean;
  ActivityType: string | null;
  IsClosed: boolean;
  IsAllDayEvent: boolean;
  IsVisibleInSelfService: boolean;
  DurationInMinutes: number | null;
  Location: string | null;
  Description: string | null;
  CurrencyIsoCode: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CallDurationInSeconds: number | null;
  CallType: string | null;
  CallDisposition: string | null;
  CallObject: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
  EndDateTime: DateString | null;
  StartDateTime: DateString | null;
  ActivitySubtype: string | null;
  AlternateDetailId: string | null;
};

type ParentReferences$ActivityHistory = {
  //
  Account: SObjectDefinition$Account | null;
  Who: SObjectDefinition$Name | null;
  What: SObjectDefinition$Name | null;
  Owner: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AlternateDetail: SObjectDefinition$EmailMessage | null;
};

type ChildRelationships$ActivityHistory = {
  //
};

interface SObjectDefinition$ActivityHistory extends SObjectDefinition<'ActivityHistory'> {
    Name: 'ActivityHistory';
    Fields: Fields$ActivityHistory;
    ParentReferences: ParentReferences$ActivityHistory;
    ChildRelationships: ChildRelationships$ActivityHistory;
  }

type Fields$AdditionalNumber = {
  //
  Id: string;
  IsDeleted: boolean;
  CallCenterId: string | null;
  Name: string;
  Description: string | null;
  Phone: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$AdditionalNumber = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AdditionalNumber = {
  //
};

interface SObjectDefinition$AdditionalNumber extends SObjectDefinition<'AdditionalNumber'> {
    Name: 'AdditionalNumber';
    Fields: Fields$AdditionalNumber;
    ParentReferences: ParentReferences$AdditionalNumber;
    ChildRelationships: ChildRelationships$AdditionalNumber;
  }

type Fields$Address = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  LocationType: string;
  AddressType: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Description: string | null;
  DrivingDirections: string | null;
  TimeZone: string | null;
};

type ParentReferences$Address = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$Location;
};

type ChildRelationships$Address = {
  //
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$Address extends SObjectDefinition<'Address'> {
    Name: 'Address';
    Fields: Fields$Address;
    ParentReferences: ParentReferences$Address;
    ChildRelationships: ChildRelationships$Address;
  }

type Fields$AggregateResult = {
  //
  Id: string;
};

type ParentReferences$AggregateResult = {
  //
};

type ChildRelationships$AggregateResult = {
  //
};

interface SObjectDefinition$AggregateResult extends SObjectDefinition<'AggregateResult'> {
    Name: 'AggregateResult';
    Fields: Fields$AggregateResult;
    ParentReferences: ParentReferences$AggregateResult;
    ChildRelationships: ChildRelationships$AggregateResult;
  }

type Fields$Announcement = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  FeedItemId: string;
  ExpirationDate: DateString;
  SendEmails: boolean;
  IsArchived: boolean;
  ParentId: string | null;
};

type ParentReferences$Announcement = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  FeedItem: SObjectDefinition$FeedItem;
  Parent: SObjectDefinition$CollaborationGroup | null;
};

type ChildRelationships$Announcement = {
  //
};

interface SObjectDefinition$Announcement extends SObjectDefinition<'Announcement'> {
    Name: 'Announcement';
    Fields: Fields$Announcement;
    ParentReferences: ParentReferences$Announcement;
    ChildRelationships: ChildRelationships$Announcement;
  }

type Fields$ApexClass = {
  //
  Id: string;
  NamespacePrefix: string | null;
  Name: string;
  ApiVersion: number;
  Status: string;
  IsValid: boolean;
  BodyCrc: number | null;
  Body: string | null;
  LengthWithoutComments: number;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ApexClass = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ApexClass = {
  //
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$ApexClass extends SObjectDefinition<'ApexClass'> {
    Name: 'ApexClass';
    Fields: Fields$ApexClass;
    ParentReferences: ParentReferences$ApexClass;
    ChildRelationships: ChildRelationships$ApexClass;
  }

type Fields$ApexComponent = {
  //
  Id: string;
  NamespacePrefix: string | null;
  Name: string;
  ApiVersion: number;
  MasterLabel: string;
  Description: string | null;
  ControllerType: string;
  ControllerKey: string | null;
  Markup: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ApexComponent = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ApexComponent = {
  //
};

interface SObjectDefinition$ApexComponent extends SObjectDefinition<'ApexComponent'> {
    Name: 'ApexComponent';
    Fields: Fields$ApexComponent;
    ParentReferences: ParentReferences$ApexComponent;
    ChildRelationships: ChildRelationships$ApexComponent;
  }

type Fields$ApexEmailNotification = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserId: string | null;
  Email: string | null;
};

type ParentReferences$ApexEmailNotification = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$ApexEmailNotification = {
  //
};

interface SObjectDefinition$ApexEmailNotification extends SObjectDefinition<'ApexEmailNotification'> {
    Name: 'ApexEmailNotification';
    Fields: Fields$ApexEmailNotification;
    ParentReferences: ParentReferences$ApexEmailNotification;
    ChildRelationships: ChildRelationships$ApexEmailNotification;
  }

type Fields$ApexLog = {
  //
  Id: string;
  LogUserId: string | null;
  LogLength: number;
  LastModifiedDate: DateString;
  Request: string;
  Operation: string;
  Application: string;
  Status: string;
  DurationMilliseconds: number;
  SystemModstamp: DateString;
  StartTime: DateString;
  Location: string | null;
};

type ParentReferences$ApexLog = {
  //
  LogUser: SObjectDefinition$User | null;
};

type ChildRelationships$ApexLog = {
  //
};

interface SObjectDefinition$ApexLog extends SObjectDefinition<'ApexLog'> {
    Name: 'ApexLog';
    Fields: Fields$ApexLog;
    ParentReferences: ParentReferences$ApexLog;
    ChildRelationships: ChildRelationships$ApexLog;
  }

type Fields$ApexPage = {
  //
  Id: string;
  NamespacePrefix: string | null;
  Name: string;
  ApiVersion: number;
  MasterLabel: string;
  Description: string | null;
  ControllerType: string;
  ControllerKey: string | null;
  IsAvailableInTouch: boolean;
  IsConfirmationTokenRequired: boolean;
  Markup: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ApexPage = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ApexPage = {
  //
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$ApexPage extends SObjectDefinition<'ApexPage'> {
    Name: 'ApexPage';
    Fields: Fields$ApexPage;
    ParentReferences: ParentReferences$ApexPage;
    ChildRelationships: ChildRelationships$ApexPage;
  }

type Fields$ApexPageInfo = {
  //
  Id: string;
  DurableId: string | null;
  ApexPageId: string;
  Name: string;
  NameSpacePrefix: string | null;
  ApiVersion: number;
  Description: string | null;
  IsAvailableInTouch: boolean;
  MasterLabel: string | null;
  IsShowHeader: string | null;
};

type ParentReferences$ApexPageInfo = {
  //
};

type ChildRelationships$ApexPageInfo = {
  //
};

interface SObjectDefinition$ApexPageInfo extends SObjectDefinition<'ApexPageInfo'> {
    Name: 'ApexPageInfo';
    Fields: Fields$ApexPageInfo;
    ParentReferences: ParentReferences$ApexPageInfo;
    ChildRelationships: ChildRelationships$ApexPageInfo;
  }

type Fields$ApexTestQueueItem = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
  ApexClassId: string;
  Status: string;
  ExtendedStatus: string | null;
  ParentJobId: string | null;
  TestRunResultId: string | null;
  ShouldSkipCodeCoverage: boolean;
};

type ParentReferences$ApexTestQueueItem = {
  //
  CreatedBy: SObjectDefinition$User;
  ApexClass: SObjectDefinition$ApexClass;
};

type ChildRelationships$ApexTestQueueItem = {
  //
};

interface SObjectDefinition$ApexTestQueueItem extends SObjectDefinition<'ApexTestQueueItem'> {
    Name: 'ApexTestQueueItem';
    Fields: Fields$ApexTestQueueItem;
    ParentReferences: ParentReferences$ApexTestQueueItem;
    ChildRelationships: ChildRelationships$ApexTestQueueItem;
  }

type Fields$ApexTestResult = {
  //
  Id: string;
  SystemModstamp: DateString;
  TestTimestamp: DateString;
  Outcome: string;
  ApexClassId: string;
  MethodName: string | null;
  Message: string | null;
  StackTrace: string | null;
  AsyncApexJobId: string | null;
  QueueItemId: string | null;
  ApexLogId: string | null;
  ApexTestRunResultId: string | null;
  RunTime: number | null;
};

type ParentReferences$ApexTestResult = {
  //
  ApexClass: SObjectDefinition$ApexClass;
  AsyncApexJob: SObjectDefinition$AsyncApexJob | null;
  QueueItem: SObjectDefinition$ApexTestQueueItem | null;
  ApexLog: SObjectDefinition$ApexLog | null;
  ApexTestRunResult: SObjectDefinition$ApexTestRunResult | null;
};

type ChildRelationships$ApexTestResult = {
  //
  ApexTestResults: SObjectDefinition$ApexTestResultLimits;
};

interface SObjectDefinition$ApexTestResult extends SObjectDefinition<'ApexTestResult'> {
    Name: 'ApexTestResult';
    Fields: Fields$ApexTestResult;
    ParentReferences: ParentReferences$ApexTestResult;
    ChildRelationships: ChildRelationships$ApexTestResult;
  }

type Fields$ApexTestResultLimits = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ApexTestResultId: string;
  Soql: number;
  QueryRows: number;
  Sosl: number;
  Dml: number;
  DmlRows: number;
  Cpu: number;
  Callouts: number;
  Email: number;
  AsyncCalls: number;
  MobilePush: number;
  LimitContext: string | null;
  LimitExceptions: string | null;
};

type ParentReferences$ApexTestResultLimits = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ApexTestResult: SObjectDefinition$ApexTestResult;
};

type ChildRelationships$ApexTestResultLimits = {
  //
};

interface SObjectDefinition$ApexTestResultLimits extends SObjectDefinition<'ApexTestResultLimits'> {
    Name: 'ApexTestResultLimits';
    Fields: Fields$ApexTestResultLimits;
    ParentReferences: ParentReferences$ApexTestResultLimits;
    ChildRelationships: ChildRelationships$ApexTestResultLimits;
  }

type Fields$ApexTestRunResult = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AsyncApexJobId: string | null;
  UserId: string | null;
  JobName: string | null;
  IsAllTests: boolean;
  Source: string | null;
  StartTime: DateString;
  EndTime: DateString | null;
  TestTime: number | null;
  Status: string;
  ClassesEnqueued: number;
  ClassesCompleted: number | null;
  MethodsEnqueued: number | null;
  MethodsCompleted: number | null;
  MethodsFailed: number | null;
};

type ParentReferences$ApexTestRunResult = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AsyncApexJob: SObjectDefinition$AsyncApexJob | null;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$ApexTestRunResult = {
  //
};

interface SObjectDefinition$ApexTestRunResult extends SObjectDefinition<'ApexTestRunResult'> {
    Name: 'ApexTestRunResult';
    Fields: Fields$ApexTestRunResult;
    ParentReferences: ParentReferences$ApexTestRunResult;
    ChildRelationships: ChildRelationships$ApexTestRunResult;
  }

type Fields$ApexTestSuite = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  TestSuiteName: string;
};

type ParentReferences$ApexTestSuite = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ApexTestSuite = {
  //
  ApexClassJunctions: SObjectDefinition$TestSuiteMembership;
};

interface SObjectDefinition$ApexTestSuite extends SObjectDefinition<'ApexTestSuite'> {
    Name: 'ApexTestSuite';
    Fields: Fields$ApexTestSuite;
    ParentReferences: ParentReferences$ApexTestSuite;
    ChildRelationships: ChildRelationships$ApexTestSuite;
  }

type Fields$ApexTrigger = {
  //
  Id: string;
  NamespacePrefix: string | null;
  Name: string;
  TableEnumOrId: string | null;
  UsageBeforeInsert: boolean;
  UsageAfterInsert: boolean;
  UsageBeforeUpdate: boolean;
  UsageAfterUpdate: boolean;
  UsageBeforeDelete: boolean;
  UsageAfterDelete: boolean;
  UsageIsBulk: boolean;
  UsageAfterUndelete: boolean;
  ApiVersion: number;
  Status: string;
  IsValid: boolean;
  BodyCrc: number | null;
  Body: string | null;
  LengthWithoutComments: number;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ApexTrigger = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ApexTrigger = {
  //
};

interface SObjectDefinition$ApexTrigger extends SObjectDefinition<'ApexTrigger'> {
    Name: 'ApexTrigger';
    Fields: Fields$ApexTrigger;
    ParentReferences: ParentReferences$ApexTrigger;
    ChildRelationships: ChildRelationships$ApexTrigger;
  }

type Fields$AppDefinition = {
  //
  Id: string;
  DurableId: string | null;
  Label: string | null;
  MasterLabel: string | null;
  NamespacePrefix: string | null;
  DeveloperName: string | null;
  LogoUrl: string | null;
  Description: string | null;
  UiType: string | null;
  NavType: string | null;
  UtilityBar: string | null;
  HeaderColor: string | null;
  IsOverrideOrgTheme: boolean;
  IsSmallFormFactorSupported: boolean;
  IsMediumFormFactorSupported: boolean;
  IsLargeFormFactorSupported: boolean;
  IsNavPersonalizationDisabled: boolean;
  IsNavAutoTempTabsDisabled: boolean;
};

type ParentReferences$AppDefinition = {
  //
};

type ChildRelationships$AppDefinition = {
  //
  AppTabs: SObjectDefinition$AppTabMember;
};

interface SObjectDefinition$AppDefinition extends SObjectDefinition<'AppDefinition'> {
    Name: 'AppDefinition';
    Fields: Fields$AppDefinition;
    ParentReferences: ParentReferences$AppDefinition;
    ChildRelationships: ChildRelationships$AppDefinition;
  }

type Fields$AppExtension = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  FieldServiceMobileSettingsId: string;
  AppExtensionName: string;
  Type: string;
  LaunchValue: string;
  ScopedToObjectTypes: string | null;
  InstallationUrl: string | null;
  AppExtensionLabel: string;
};

type ParentReferences$AppExtension = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  FieldServiceMobileSettings: SObjectDefinition$FieldServiceMobileSettings;
};

type ChildRelationships$AppExtension = {
  //
};

interface SObjectDefinition$AppExtension extends SObjectDefinition<'AppExtension'> {
    Name: 'AppExtension';
    Fields: Fields$AppExtension;
    ParentReferences: ParentReferences$AppExtension;
    ChildRelationships: ChildRelationships$AppExtension;
  }

type Fields$AppMenuItem = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SortOrder: number;
  Name: string | null;
  NamespacePrefix: string | null;
  Label: string | null;
  Description: string | null;
  StartUrl: string | null;
  MobileStartUrl: string | null;
  LogoUrl: string | null;
  IconUrl: string | null;
  InfoUrl: string | null;
  IsUsingAdminAuthorization: boolean;
  MobilePlatform: string | null;
  MobileMinOsVer: string | null;
  MobileDeviceType: string | null;
  IsRegisteredDeviceOnly: boolean;
  MobileAppVer: string | null;
  MobileAppInstalledDate: DateString | null;
  MobileAppInstalledVersion: string | null;
  MobileAppBinaryId: string | null;
  MobileAppInstallUrl: string | null;
  CanvasEnabled: boolean;
  CanvasReferenceId: string | null;
  CanvasUrl: string | null;
  CanvasAccessMethod: string | null;
  CanvasSelectedLocations: string | null;
  CanvasOptions: string | null;
  Type: string | null;
  ApplicationId: string | null;
  UserSortOrder: number | null;
  IsVisible: boolean;
  IsAccessible: boolean;
};

type ParentReferences$AppMenuItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AppMenuItem = {
  //
};

interface SObjectDefinition$AppMenuItem extends SObjectDefinition<'AppMenuItem'> {
    Name: 'AppMenuItem';
    Fields: Fields$AppMenuItem;
    ParentReferences: ParentReferences$AppMenuItem;
    ChildRelationships: ChildRelationships$AppMenuItem;
  }

type Fields$AppTabMember = {
  //
  Id: string;
  DurableId: string | null;
  AppDefinitionId: string | null;
  TabDefinitionId: string | null;
  SortOrder: number | null;
  WorkspaceDriverField: string | null;
};

type ParentReferences$AppTabMember = {
  //
};

type ChildRelationships$AppTabMember = {
  //
};

interface SObjectDefinition$AppTabMember extends SObjectDefinition<'AppTabMember'> {
    Name: 'AppTabMember';
    Fields: Fields$AppTabMember;
    ParentReferences: ParentReferences$AppTabMember;
    ChildRelationships: ChildRelationships$AppTabMember;
  }

type Fields$Asset = {
  //
  Id: string;
  ContactId: string | null;
  AccountId: string | null;
  ParentId: string | null;
  RootAssetId: string | null;
  Product2Id: string | null;
  ProductCode: string | null;
  IsCompetitorProduct: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  Name: string;
  SerialNumber: string | null;
  InstallDate: DateString | null;
  PurchaseDate: DateString | null;
  UsageEndDate: DateString | null;
  Status: string | null;
  Price: number | null;
  Quantity: number | null;
  Description: string | null;
  OwnerId: string;
  LocationId: string | null;
  AssetProvidedById: string | null;
  AssetServicedById: string | null;
  IsInternal: boolean;
  AssetLevel: number | null;
  StockKeepingUnit: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Asset = {
  //
  Contact: SObjectDefinition$Contact | null;
  Account: SObjectDefinition$Account | null;
  Parent: SObjectDefinition$Asset | null;
  RootAsset: SObjectDefinition$Asset | null;
  Product2: SObjectDefinition$Product2 | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Owner: SObjectDefinition$User;
  Location: SObjectDefinition$Location | null;
  AssetProvidedBy: SObjectDefinition$Account | null;
  AssetServicedBy: SObjectDefinition$Account | null;
};

type ChildRelationships$Asset = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  ChildAssets: SObjectDefinition$Asset;
  Feeds: SObjectDefinition$AssetFeed;
  Histories: SObjectDefinition$AssetHistory;
  PrimaryAssets: SObjectDefinition$AssetRelationship;
  RelatedAssets: SObjectDefinition$AssetRelationship;
  Shares: SObjectDefinition$AssetShare;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  Cases: SObjectDefinition$Case;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  MaintenanceAssets: SObjectDefinition$MaintenanceAsset;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$Asset extends SObjectDefinition<'Asset'> {
    Name: 'Asset';
    Fields: Fields$Asset;
    ParentReferences: ParentReferences$Asset;
    ChildRelationships: ChildRelationships$Asset;
  }

type Fields$AssetChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  ContactId: string | null;
  AccountId: string | null;
  ParentId: string | null;
  RootAssetId: string | null;
  Product2Id: string | null;
  IsCompetitorProduct: boolean;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  CurrencyIsoCode: string | null;
  Name: string | null;
  SerialNumber: string | null;
  InstallDate: DateString | null;
  PurchaseDate: DateString | null;
  UsageEndDate: DateString | null;
  Status: string | null;
  Price: number | null;
  Quantity: number | null;
  Description: string | null;
  OwnerId: string | null;
  LocationId: string | null;
  AssetProvidedById: string | null;
  AssetServicedById: string | null;
  IsInternal: boolean;
};

type ParentReferences$AssetChangeEvent = {
  //
};

type ChildRelationships$AssetChangeEvent = {
  //
};

interface SObjectDefinition$AssetChangeEvent extends SObjectDefinition<'AssetChangeEvent'> {
    Name: 'AssetChangeEvent';
    Fields: Fields$AssetChangeEvent;
    ParentReferences: ParentReferences$AssetChangeEvent;
    ChildRelationships: ChildRelationships$AssetChangeEvent;
  }

type Fields$AssetFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$AssetFeed = {
  //
  Parent: SObjectDefinition$Asset;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$AssetFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$AssetFeed extends SObjectDefinition<'AssetFeed'> {
    Name: 'AssetFeed';
    Fields: Fields$AssetFeed;
    ParentReferences: ParentReferences$AssetFeed;
    ChildRelationships: ChildRelationships$AssetFeed;
  }

type Fields$AssetHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  AssetId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$AssetHistory = {
  //
  Asset: SObjectDefinition$Asset;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$AssetHistory = {
  //
};

interface SObjectDefinition$AssetHistory extends SObjectDefinition<'AssetHistory'> {
    Name: 'AssetHistory';
    Fields: Fields$AssetHistory;
    ParentReferences: ParentReferences$AssetHistory;
    ChildRelationships: ChildRelationships$AssetHistory;
  }

type Fields$AssetRelationship = {
  //
  Id: string;
  IsDeleted: boolean;
  AssetRelationshipNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  AssetId: string;
  RelatedAssetId: string;
  FromDate: DateString | null;
  ToDate: DateString | null;
  RelationshipType: string | null;
};

type ParentReferences$AssetRelationship = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Asset: SObjectDefinition$Asset;
  RelatedAsset: SObjectDefinition$Asset;
};

type ChildRelationships$AssetRelationship = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  Feeds: SObjectDefinition$AssetRelationshipFeed;
  Histories: SObjectDefinition$AssetRelationshipHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
};

interface SObjectDefinition$AssetRelationship extends SObjectDefinition<'AssetRelationship'> {
    Name: 'AssetRelationship';
    Fields: Fields$AssetRelationship;
    ParentReferences: ParentReferences$AssetRelationship;
    ChildRelationships: ChildRelationships$AssetRelationship;
  }

type Fields$AssetRelationshipFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$AssetRelationshipFeed = {
  //
  Parent: SObjectDefinition$AssetRelationship;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$AssetRelationshipFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$AssetRelationshipFeed extends SObjectDefinition<'AssetRelationshipFeed'> {
    Name: 'AssetRelationshipFeed';
    Fields: Fields$AssetRelationshipFeed;
    ParentReferences: ParentReferences$AssetRelationshipFeed;
    ChildRelationships: ChildRelationships$AssetRelationshipFeed;
  }

type Fields$AssetRelationshipHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  AssetRelationshipId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$AssetRelationshipHistory = {
  //
  AssetRelationship: SObjectDefinition$AssetRelationship;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$AssetRelationshipHistory = {
  //
};

interface SObjectDefinition$AssetRelationshipHistory extends SObjectDefinition<'AssetRelationshipHistory'> {
    Name: 'AssetRelationshipHistory';
    Fields: Fields$AssetRelationshipHistory;
    ParentReferences: ParentReferences$AssetRelationshipHistory;
    ChildRelationships: ChildRelationships$AssetRelationshipHistory;
  }

type Fields$AssetShare = {
  //
  Id: string;
  AssetId: string;
  UserOrGroupId: string;
  AssetAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$AssetShare = {
  //
  Asset: SObjectDefinition$Asset;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AssetShare = {
  //
};

interface SObjectDefinition$AssetShare extends SObjectDefinition<'AssetShare'> {
    Name: 'AssetShare';
    Fields: Fields$AssetShare;
    ParentReferences: ParentReferences$AssetShare;
    ChildRelationships: ChildRelationships$AssetShare;
  }

type Fields$AssetTokenEvent = {
  //
  ReplayId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  ConnectedAppId: string | null;
  UserId: string | null;
  AssetId: string | null;
  Name: string | null;
  DeviceId: string | null;
  DeviceKey: string | null;
  Expiration: DateString | null;
  AssetSerialNumber: string | null;
  AssetName: string | null;
  ActorTokenPayload: string | null;
};

type ParentReferences$AssetTokenEvent = {
  //
  CreatedBy: SObjectDefinition$User;
  ConnectedApp: SObjectDefinition$ConnectedApplication | null;
  User: SObjectDefinition$User | null;
  Asset: SObjectDefinition$Asset | null;
};

type ChildRelationships$AssetTokenEvent = {
  //
};

interface SObjectDefinition$AssetTokenEvent extends SObjectDefinition<'AssetTokenEvent'> {
    Name: 'AssetTokenEvent';
    Fields: Fields$AssetTokenEvent;
    ParentReferences: ParentReferences$AssetTokenEvent;
    ChildRelationships: ChildRelationships$AssetTokenEvent;
  }

type Fields$AssignedResource = {
  //
  Id: string;
  IsDeleted: boolean;
  AssignedResourceNumber: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ServiceAppointmentId: string;
  ServiceResourceId: string;
  EstimatedTravelTime: number | null;
  ActualTravelTime: number | null;
  ServiceCrewId: string | null;
};

type ParentReferences$AssignedResource = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceAppointment: SObjectDefinition$ServiceAppointment;
  ServiceResource: SObjectDefinition$ServiceResource;
  ServiceCrew: SObjectDefinition$ServiceCrew | null;
};

type ChildRelationships$AssignedResource = {
  //
  Feeds: SObjectDefinition$AssignedResourceFeed;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$AssignedResource extends SObjectDefinition<'AssignedResource'> {
    Name: 'AssignedResource';
    Fields: Fields$AssignedResource;
    ParentReferences: ParentReferences$AssignedResource;
    ChildRelationships: ChildRelationships$AssignedResource;
  }

type Fields$AssignedResourceFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$AssignedResourceFeed = {
  //
  Parent: SObjectDefinition$AssignedResource;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$AssignedResourceFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$AssignedResourceFeed extends SObjectDefinition<'AssignedResourceFeed'> {
    Name: 'AssignedResourceFeed';
    Fields: Fields$AssignedResourceFeed;
    ParentReferences: ParentReferences$AssignedResourceFeed;
    ChildRelationships: ChildRelationships$AssignedResourceFeed;
  }

type Fields$AssignmentRule = {
  //
  Id: string;
  Name: string | null;
  SobjectType: string | null;
  Active: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$AssignmentRule = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AssignmentRule = {
  //
};

interface SObjectDefinition$AssignmentRule extends SObjectDefinition<'AssignmentRule'> {
    Name: 'AssignmentRule';
    Fields: Fields$AssignmentRule;
    ParentReferences: ParentReferences$AssignmentRule;
    ChildRelationships: ChildRelationships$AssignmentRule;
  }

type Fields$AssociatedLocation = {
  //
  Id: string;
  IsDeleted: boolean;
  AssociatedLocationNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentRecordId: string;
  LocationId: string;
  Type: string | null;
  ActiveFrom: DateString | null;
  ActiveTo: DateString | null;
};

type ParentReferences$AssociatedLocation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentRecord: SObjectDefinition$Account;
  Location: SObjectDefinition$Location;
};

type ChildRelationships$AssociatedLocation = {
  //
  Histories: SObjectDefinition$AssociatedLocationHistory;
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$AssociatedLocation extends SObjectDefinition<'AssociatedLocation'> {
    Name: 'AssociatedLocation';
    Fields: Fields$AssociatedLocation;
    ParentReferences: ParentReferences$AssociatedLocation;
    ChildRelationships: ChildRelationships$AssociatedLocation;
  }

type Fields$AssociatedLocationHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  AssociatedLocationId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$AssociatedLocationHistory = {
  //
  AssociatedLocation: SObjectDefinition$AssociatedLocation;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$AssociatedLocationHistory = {
  //
};

interface SObjectDefinition$AssociatedLocationHistory extends SObjectDefinition<'AssociatedLocationHistory'> {
    Name: 'AssociatedLocationHistory';
    Fields: Fields$AssociatedLocationHistory;
    ParentReferences: ParentReferences$AssociatedLocationHistory;
    ChildRelationships: ChildRelationships$AssociatedLocationHistory;
  }

type Fields$AsyncApexJob = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  JobType: string;
  ApexClassId: string | null;
  Status: string;
  JobItemsProcessed: number;
  TotalJobItems: number | null;
  NumberOfErrors: number | null;
  CompletedDate: DateString | null;
  MethodName: string | null;
  ExtendedStatus: string | null;
  ParentJobId: string | null;
  LastProcessed: string | null;
  LastProcessedOffset: number | null;
};

type ParentReferences$AsyncApexJob = {
  //
  CreatedBy: SObjectDefinition$User;
  ApexClass: SObjectDefinition$ApexClass | null;
};

type ChildRelationships$AsyncApexJob = {
  //
  AsyncApex: SObjectDefinition$ApexTestRunResult;
};

interface SObjectDefinition$AsyncApexJob extends SObjectDefinition<'AsyncApexJob'> {
    Name: 'AsyncApexJob';
    Fields: Fields$AsyncApexJob;
    ParentReferences: ParentReferences$AsyncApexJob;
    ChildRelationships: ChildRelationships$AsyncApexJob;
  }

type Fields$AttachedContentDocument = {
  //
  Id: string;
  IsDeleted: boolean;
  LinkedEntityId: string;
  ContentDocumentId: string | null;
  Title: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  FileType: string | null;
  ContentSize: number | null;
  FileExtension: string | null;
  ContentUrl: string | null;
  ExternalDataSourceName: string | null;
  ExternalDataSourceType: string | null;
  SharingOption: string | null;
};

type ParentReferences$AttachedContentDocument = {
  //
  LinkedEntity: SObjectDefinition$Name;
  ContentDocument: SObjectDefinition$ContentDocument | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AttachedContentDocument = {
  //
};

interface SObjectDefinition$AttachedContentDocument extends SObjectDefinition<'AttachedContentDocument'> {
    Name: 'AttachedContentDocument';
    Fields: Fields$AttachedContentDocument;
    ParentReferences: ParentReferences$AttachedContentDocument;
    ChildRelationships: ChildRelationships$AttachedContentDocument;
  }

type Fields$Attachment = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  Name: string;
  IsPrivate: boolean;
  ContentType: string | null;
  BodyLength: number | null;
  Body: BlobString;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
};

type ParentReferences$Attachment = {
  //
  Parent: SObjectDefinition$Name;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Attachment = {
  //
};

interface SObjectDefinition$Attachment extends SObjectDefinition<'Attachment'> {
    Name: 'Attachment';
    Fields: Fields$Attachment;
    ParentReferences: ParentReferences$Attachment;
    ChildRelationships: ChildRelationships$Attachment;
  }

type Fields$AuraDefinition = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AuraDefinitionBundleId: string;
  DefType: string;
  Format: string;
  Source: string;
};

type ParentReferences$AuraDefinition = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AuraDefinitionBundle: SObjectDefinition$AuraDefinitionBundle;
};

type ChildRelationships$AuraDefinition = {
  //
};

interface SObjectDefinition$AuraDefinition extends SObjectDefinition<'AuraDefinition'> {
    Name: 'AuraDefinition';
    Fields: Fields$AuraDefinition;
    ParentReferences: ParentReferences$AuraDefinition;
    ChildRelationships: ChildRelationships$AuraDefinition;
  }

type Fields$AuraDefinitionBundle = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ApiVersion: number;
  Description: string;
};

type ParentReferences$AuraDefinitionBundle = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AuraDefinitionBundle = {
  //
};

interface SObjectDefinition$AuraDefinitionBundle extends SObjectDefinition<'AuraDefinitionBundle'> {
    Name: 'AuraDefinitionBundle';
    Fields: Fields$AuraDefinitionBundle;
    ParentReferences: ParentReferences$AuraDefinitionBundle;
    ChildRelationships: ChildRelationships$AuraDefinitionBundle;
  }

type Fields$AuraDefinitionBundleInfo = {
  //
  Id: string;
  DurableId: string | null;
  AuraDefinitionBundleId: string;
  ApiVersion: number;
  DeveloperName: string | null;
  NamespacePrefix: string | null;
};

type ParentReferences$AuraDefinitionBundleInfo = {
  //
};

type ChildRelationships$AuraDefinitionBundleInfo = {
  //
  Bundle: SObjectDefinition$AuraDefinitionInfo;
};

interface SObjectDefinition$AuraDefinitionBundleInfo extends SObjectDefinition<'AuraDefinitionBundleInfo'> {
    Name: 'AuraDefinitionBundleInfo';
    Fields: Fields$AuraDefinitionBundleInfo;
    ParentReferences: ParentReferences$AuraDefinitionBundleInfo;
    ChildRelationships: ChildRelationships$AuraDefinitionBundleInfo;
  }

type Fields$AuraDefinitionInfo = {
  //
  Id: string;
  DurableId: string | null;
  AuraDefinitionBundleInfoId: string | null;
  AuraDefinitionId: string;
  DefType: string;
  Format: string;
  Source: string;
  LastModifiedDate: DateString;
  DeveloperName: string | null;
  NamespacePrefix: string | null;
};

type ParentReferences$AuraDefinitionInfo = {
  //
};

type ChildRelationships$AuraDefinitionInfo = {
  //
};

interface SObjectDefinition$AuraDefinitionInfo extends SObjectDefinition<'AuraDefinitionInfo'> {
    Name: 'AuraDefinitionInfo';
    Fields: Fields$AuraDefinitionInfo;
    ParentReferences: ParentReferences$AuraDefinitionInfo;
    ChildRelationships: ChildRelationships$AuraDefinitionInfo;
  }

type Fields$AuthConfig = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Url: string;
  AuthOptionsUsernamePassword: boolean;
  AuthOptionsSaml: boolean;
  AuthOptionsAuthProvider: boolean;
  IsActive: boolean;
  Type: string;
};

type ParentReferences$AuthConfig = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AuthConfig = {
  //
  AuthProvidersForConfig: SObjectDefinition$AuthConfigProviders;
};

interface SObjectDefinition$AuthConfig extends SObjectDefinition<'AuthConfig'> {
    Name: 'AuthConfig';
    Fields: Fields$AuthConfig;
    ParentReferences: ParentReferences$AuthConfig;
    ChildRelationships: ChildRelationships$AuthConfig;
  }

type Fields$AuthConfigProviders = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AuthConfigId: string;
  AuthProviderId: string;
};

type ParentReferences$AuthConfigProviders = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AuthConfig: SObjectDefinition$AuthConfig;
  AuthProvider: SObjectDefinition$Name;
};

type ChildRelationships$AuthConfigProviders = {
  //
};

interface SObjectDefinition$AuthConfigProviders extends SObjectDefinition<'AuthConfigProviders'> {
    Name: 'AuthConfigProviders';
    Fields: Fields$AuthConfigProviders;
    ParentReferences: ParentReferences$AuthConfigProviders;
    ChildRelationships: ChildRelationships$AuthConfigProviders;
  }

type Fields$AuthProvider = {
  //
  Id: string;
  CreatedDate: DateString;
  ProviderType: string;
  FriendlyName: string;
  DeveloperName: string;
  RegistrationHandlerId: string | null;
  ExecutionUserId: string | null;
  ConsumerKey: string | null;
  ConsumerSecret: string | null;
  ErrorUrl: string | null;
  AuthorizeUrl: string | null;
  TokenUrl: string | null;
  UserInfoUrl: string | null;
  DefaultScopes: string | null;
  IdTokenIssuer: string | null;
  OptionsSendAccessTokenInHeader: boolean;
  OptionsSendClientCredentialsInHeader: boolean;
  OptionsIncludeOrgIdInId: boolean;
  IconUrl: string | null;
  LogoutUrl: string | null;
  PluginId: string | null;
  CustomMetadataTypeRecord: string | null;
  SsoKickoffUrl: string | null;
  LinkKickoffUrl: string | null;
  OauthKickoffUrl: string | null;
};

type ParentReferences$AuthProvider = {
  //
};

type ChildRelationships$AuthProvider = {
  //
};

interface SObjectDefinition$AuthProvider extends SObjectDefinition<'AuthProvider'> {
    Name: 'AuthProvider';
    Fields: Fields$AuthProvider;
    ParentReferences: ParentReferences$AuthProvider;
    ChildRelationships: ChildRelationships$AuthProvider;
  }

type Fields$AuthSession = {
  //
  Id: string;
  UsersId: string | null;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  NumSecondsValid: number;
  UserType: string;
  SourceIp: string;
  LoginType: string | null;
  SessionType: string | null;
  SessionSecurityLevel: string | null;
  LogoutUrl: string | null;
  ParentId: string | null;
  LoginHistoryId: string | null;
  LoginGeoId: string | null;
  IsCurrent: boolean;
};

type ParentReferences$AuthSession = {
  //
  Users: SObjectDefinition$User | null;
  LoginHistory: SObjectDefinition$LoginHistory | null;
  LoginGeo: SObjectDefinition$LoginGeo | null;
};

type ChildRelationships$AuthSession = {
  //
  SessionPermSetActivations: SObjectDefinition$SessionPermSetActivation;
};

interface SObjectDefinition$AuthSession extends SObjectDefinition<'AuthSession'> {
    Name: 'AuthSession';
    Fields: Fields$AuthSession;
    ParentReferences: ParentReferences$AuthSession;
    ChildRelationships: ChildRelationships$AuthSession;
  }

type Fields$BackgroundOperation = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SubmittedAt: DateString | null;
  Status: string | null;
  ExecutionGroup: string | null;
  SequenceGroup: string | null;
  SequenceNumber: number | null;
  GroupLeaderId: string | null;
  StartedAt: DateString | null;
  FinishedAt: DateString | null;
  WorkerUri: string | null;
  Timeout: number | null;
  ExpiresAt: DateString | null;
  NumFollowers: number | null;
  ProcessAfter: DateString | null;
  ParentKey: string | null;
  RetryLimit: number | null;
  RetryCount: number | null;
  RetryBackoff: number | null;
  Error: string | null;
};

type ParentReferences$BackgroundOperation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  GroupLeader: SObjectDefinition$BackgroundOperation | null;
};

type ChildRelationships$BackgroundOperation = {
  //
  MergedOperations: SObjectDefinition$BackgroundOperation;
};

interface SObjectDefinition$BackgroundOperation extends SObjectDefinition<'BackgroundOperation'> {
    Name: 'BackgroundOperation';
    Fields: Fields$BackgroundOperation;
    ParentReferences: ParentReferences$BackgroundOperation;
    ChildRelationships: ChildRelationships$BackgroundOperation;
  }

type Fields$BigTable__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Checkbox1__c: boolean;
  Currency1__c: number | null;
  Date1__c: DateString | null;
  DateTime1__c: DateString | null;
  Email1__c: string | null;
  LongTextarea1__c: string | null;
  Lookup1__c: string | null;
  MultiPicklist1__c: string | null;
  Number1__c: number | null;
  Parent01__c: string | null;
  Percent1__c: number | null;
  Phone1__c: string | null;
  Picklist1__c: string | null;
  RichTextarea1__c: string | null;
  Text1__c: string | null;
  TextEncrypted1__c: string | null;
  Textarea1__c: string | null;
  Time1__c: DateString | null;
  Url1__c: string | null;
};

type ParentReferences$BigTable__ChangeEvent = {
  //
};

type ChildRelationships$BigTable__ChangeEvent = {
  //
};

interface SObjectDefinition$BigTable__ChangeEvent extends SObjectDefinition<'BigTable__ChangeEvent'> {
    Name: 'BigTable__ChangeEvent';
    Fields: Fields$BigTable__ChangeEvent;
    ParentReferences: ParentReferences$BigTable__ChangeEvent;
    ChildRelationships: ChildRelationships$BigTable__ChangeEvent;
  }

type Fields$BigTable__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$BigTable__Share = {
  //
  Parent: SObjectDefinition$BigTable__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$BigTable__Share = {
  //
};

interface SObjectDefinition$BigTable__Share extends SObjectDefinition<'BigTable__Share'> {
    Name: 'BigTable__Share';
    Fields: Fields$BigTable__Share;
    ParentReferences: ParentReferences$BigTable__Share;
    ChildRelationships: ChildRelationships$BigTable__Share;
  }

type Fields$BigTable__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  Checkbox1__c: boolean;
  Currency1__c: number | null;
  Date1__c: DateString | null;
  DateTime1__c: DateString | null;
  Email1__c: string | null;
  LongTextarea1__c: string | null;
  Lookup1__c: string | null;
  MultiPicklist1__c: string | null;
  Number1__c: number | null;
  Parent01__c: string | null;
  Percent1__c: number | null;
  Phone1__c: string | null;
  Picklist1__c: string | null;
  RichTextarea1__c: string | null;
  Text1__c: string | null;
  TextEncrypted1__c: string | null;
  Textarea1__c: string | null;
  Time1__c: DateString | null;
  Url1__c: string | null;
};

type ParentReferences$BigTable__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Lookup1__r: SObjectDefinition$Account | null;
  Parent01__r: SObjectDefinition$BigTable__c | null;
};

type ChildRelationships$BigTable__c = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  Shares: SObjectDefinition$BigTable__Share;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$BigTable__c extends SObjectDefinition<'BigTable__c'> {
    Name: 'BigTable__c';
    Fields: Fields$BigTable__c;
    ParentReferences: ParentReferences$BigTable__c;
    ChildRelationships: ChildRelationships$BigTable__c;
  }

type Fields$BrandTemplate = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  IsActive: boolean;
  Description: string | null;
  Value: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$BrandTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$BrandTemplate = {
  //
};

interface SObjectDefinition$BrandTemplate extends SObjectDefinition<'BrandTemplate'> {
    Name: 'BrandTemplate';
    Fields: Fields$BrandTemplate;
    ParentReferences: ParentReferences$BrandTemplate;
    ChildRelationships: ChildRelationships$BrandTemplate;
  }

type Fields$BrandingSet = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
};

type ParentReferences$BrandingSet = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$BrandingSet = {
  //
};

interface SObjectDefinition$BrandingSet extends SObjectDefinition<'BrandingSet'> {
    Name: 'BrandingSet';
    Fields: Fields$BrandingSet;
    ParentReferences: ParentReferences$BrandingSet;
    ChildRelationships: ChildRelationships$BrandingSet;
  }

type Fields$BrandingSetProperty = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  BrandingSetId: string;
  PropertyName: string;
  PropertyValue: string | null;
};

type ParentReferences$BrandingSetProperty = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  BrandingSet: SObjectDefinition$BrandingSet;
};

type ChildRelationships$BrandingSetProperty = {
  //
};

interface SObjectDefinition$BrandingSetProperty extends SObjectDefinition<'BrandingSetProperty'> {
    Name: 'BrandingSetProperty';
    Fields: Fields$BrandingSetProperty;
    ParentReferences: ParentReferences$BrandingSetProperty;
    ChildRelationships: ChildRelationships$BrandingSetProperty;
  }

type Fields$BudgetAndAchievement__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Account__c: string | null;
  Achievement__c: number | null;
  Budget__c: number | null;
  TargetMonth__c: DateString | null;
};

type ParentReferences$BudgetAndAchievement__ChangeEvent = {
  //
};

type ChildRelationships$BudgetAndAchievement__ChangeEvent = {
  //
};

interface SObjectDefinition$BudgetAndAchievement__ChangeEvent extends SObjectDefinition<'BudgetAndAchievement__ChangeEvent'> {
    Name: 'BudgetAndAchievement__ChangeEvent';
    Fields: Fields$BudgetAndAchievement__ChangeEvent;
    ParentReferences: ParentReferences$BudgetAndAchievement__ChangeEvent;
    ChildRelationships: ChildRelationships$BudgetAndAchievement__ChangeEvent;
  }

type Fields$BudgetAndAchievement__c = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Account__c: string;
  Achievement__c: number | null;
  Budget__c: number | null;
  TargetMonth__c: DateString;
};

type ParentReferences$BudgetAndAchievement__c = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account__r: SObjectDefinition$Account;
};

type ChildRelationships$BudgetAndAchievement__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$BudgetAndAchievement__c extends SObjectDefinition<'BudgetAndAchievement__c'> {
    Name: 'BudgetAndAchievement__c';
    Fields: Fields$BudgetAndAchievement__c;
    ParentReferences: ParentReferences$BudgetAndAchievement__c;
    ChildRelationships: ChildRelationships$BudgetAndAchievement__c;
  }

type Fields$BusinessHours = {
  //
  Id: string;
  Name: string;
  IsActive: boolean;
  IsDefault: boolean;
  SundayStartTime: DateString | null;
  SundayEndTime: DateString | null;
  MondayStartTime: DateString | null;
  MondayEndTime: DateString | null;
  TuesdayStartTime: DateString | null;
  TuesdayEndTime: DateString | null;
  WednesdayStartTime: DateString | null;
  WednesdayEndTime: DateString | null;
  ThursdayStartTime: DateString | null;
  ThursdayEndTime: DateString | null;
  FridayStartTime: DateString | null;
  FridayEndTime: DateString | null;
  SaturdayStartTime: DateString | null;
  SaturdayEndTime: DateString | null;
  TimeZoneSidKey: string;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  LastViewedDate: DateString | null;
};

type ParentReferences$BusinessHours = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$BusinessHours = {
  //
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$BusinessHours extends SObjectDefinition<'BusinessHours'> {
    Name: 'BusinessHours';
    Fields: Fields$BusinessHours;
    ParentReferences: ParentReferences$BusinessHours;
    ChildRelationships: ChildRelationships$BusinessHours;
  }

type Fields$BusinessProcess = {
  //
  Id: string;
  Name: string;
  NamespacePrefix: string | null;
  Description: string | null;
  TableEnumOrId: string;
  IsActive: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$BusinessProcess = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$BusinessProcess = {
  //
};

interface SObjectDefinition$BusinessProcess extends SObjectDefinition<'BusinessProcess'> {
    Name: 'BusinessProcess';
    Fields: Fields$BusinessProcess;
    ParentReferences: ParentReferences$BusinessProcess;
    ChildRelationships: ChildRelationships$BusinessProcess;
  }

type Fields$CallCenter = {
  //
  Id: string;
  Name: string;
  InternalName: string;
  Version: number | null;
  AdapterUrl: string | null;
  CustomSettings: string | null;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$CallCenter = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CallCenter = {
  //
};

interface SObjectDefinition$CallCenter extends SObjectDefinition<'CallCenter'> {
    Name: 'CallCenter';
    Fields: Fields$CallCenter;
    ParentReferences: ParentReferences$CallCenter;
    ChildRelationships: ChildRelationships$CallCenter;
  }

type Fields$Campaign = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  ParentId: string | null;
  Type: string | null;
  Status: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  CurrencyIsoCode: string | null;
  ExpectedRevenue: number | null;
  BudgetedCost: number | null;
  ActualCost: number | null;
  ExpectedResponse: number | null;
  NumberSent: number | null;
  IsActive: boolean;
  Description: string | null;
  NumberOfLeads: number;
  NumberOfConvertedLeads: number;
  NumberOfContacts: number;
  NumberOfResponses: number;
  NumberOfOpportunities: number;
  NumberOfWonOpportunities: number;
  AmountAllOpportunities: number;
  AmountWonOpportunities: number;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  CampaignMemberRecordTypeId: string | null;
};

type ParentReferences$Campaign = {
  //
  Parent: SObjectDefinition$Campaign | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  CampaignMemberRecordType: SObjectDefinition$RecordType | null;
};

type ChildRelationships$Campaign = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  ChildCampaigns: SObjectDefinition$Campaign;
  Feeds: SObjectDefinition$CampaignFeed;
  Histories: SObjectDefinition$CampaignHistory;
  CampaignMembers: SObjectDefinition$CampaignMember;
  CampaignMemberStatuses: SObjectDefinition$CampaignMemberStatus;
  Shares: SObjectDefinition$CampaignShare;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  ListEmails: SObjectDefinition$ListEmail;
  ListEmailRecipientSources: SObjectDefinition$ListEmailRecipientSource;
  OpenActivities: SObjectDefinition$OpenActivity;
  Opportunities: SObjectDefinition$Opportunity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Campaign extends SObjectDefinition<'Campaign'> {
    Name: 'Campaign';
    Fields: Fields$Campaign;
    ParentReferences: ParentReferences$Campaign;
    ChildRelationships: ChildRelationships$Campaign;
  }

type Fields$CampaignChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  ParentId: string | null;
  Type: string | null;
  Status: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  CurrencyIsoCode: string | null;
  ExpectedRevenue: number | null;
  BudgetedCost: number | null;
  ActualCost: number | null;
  ExpectedResponse: number | null;
  NumberSent: number | null;
  IsActive: boolean;
  Description: string | null;
  NumberOfLeads: number | null;
  NumberOfConvertedLeads: number | null;
  NumberOfContacts: number | null;
  NumberOfResponses: number | null;
  NumberOfOpportunities: number | null;
  NumberOfWonOpportunities: number | null;
  AmountAllOpportunities: number | null;
  AmountWonOpportunities: number | null;
  OwnerId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  CampaignMemberRecordTypeId: string | null;
};

type ParentReferences$CampaignChangeEvent = {
  //
};

type ChildRelationships$CampaignChangeEvent = {
  //
};

interface SObjectDefinition$CampaignChangeEvent extends SObjectDefinition<'CampaignChangeEvent'> {
    Name: 'CampaignChangeEvent';
    Fields: Fields$CampaignChangeEvent;
    ParentReferences: ParentReferences$CampaignChangeEvent;
    ChildRelationships: ChildRelationships$CampaignChangeEvent;
  }

type Fields$CampaignFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$CampaignFeed = {
  //
  Parent: SObjectDefinition$Campaign;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$CampaignFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$CampaignFeed extends SObjectDefinition<'CampaignFeed'> {
    Name: 'CampaignFeed';
    Fields: Fields$CampaignFeed;
    ParentReferences: ParentReferences$CampaignFeed;
    ChildRelationships: ChildRelationships$CampaignFeed;
  }

type Fields$CampaignHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  CampaignId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$CampaignHistory = {
  //
  Campaign: SObjectDefinition$Campaign;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$CampaignHistory = {
  //
};

interface SObjectDefinition$CampaignHistory extends SObjectDefinition<'CampaignHistory'> {
    Name: 'CampaignHistory';
    Fields: Fields$CampaignHistory;
    ParentReferences: ParentReferences$CampaignHistory;
    ChildRelationships: ChildRelationships$CampaignHistory;
  }

type Fields$CampaignMember = {
  //
  Id: string;
  IsDeleted: boolean;
  CampaignId: string;
  LeadId: string | null;
  ContactId: string | null;
  Status: string | null;
  HasResponded: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  FirstRespondedDate: DateString | null;
  CurrencyIsoCode: string | null;
  Salutation: string | null;
  Name: string | null;
  FirstName: string | null;
  LastName: string | null;
  Title: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Email: string | null;
  Phone: string | null;
  Fax: string | null;
  MobilePhone: string | null;
  Description: string | null;
  DoNotCall: boolean;
  HasOptedOutOfEmail: boolean;
  HasOptedOutOfFax: boolean;
  LeadSource: string | null;
  CompanyOrAccount: string | null;
  Type: string | null;
  LeadOrContactId: string | null;
  LeadOrContactOwnerId: string | null;
};

type ParentReferences$CampaignMember = {
  //
  Campaign: SObjectDefinition$Campaign;
  Lead: SObjectDefinition$Lead | null;
  Contact: SObjectDefinition$Contact | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  LeadOrContactOwner: SObjectDefinition$Name | null;
};

type ChildRelationships$CampaignMember = {
  //
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$CampaignMember extends SObjectDefinition<'CampaignMember'> {
    Name: 'CampaignMember';
    Fields: Fields$CampaignMember;
    ParentReferences: ParentReferences$CampaignMember;
    ChildRelationships: ChildRelationships$CampaignMember;
  }

type Fields$CampaignMemberStatus = {
  //
  Id: string;
  IsDeleted: boolean;
  CampaignId: string;
  Label: string;
  SortOrder: number | null;
  IsDefault: boolean;
  HasResponded: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CampaignMemberStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CampaignMemberStatus = {
  //
};

interface SObjectDefinition$CampaignMemberStatus extends SObjectDefinition<'CampaignMemberStatus'> {
    Name: 'CampaignMemberStatus';
    Fields: Fields$CampaignMemberStatus;
    ParentReferences: ParentReferences$CampaignMemberStatus;
    ChildRelationships: ChildRelationships$CampaignMemberStatus;
  }

type Fields$CampaignShare = {
  //
  Id: string;
  CampaignId: string;
  UserOrGroupId: string;
  CampaignAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$CampaignShare = {
  //
  Campaign: SObjectDefinition$Campaign;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CampaignShare = {
  //
};

interface SObjectDefinition$CampaignShare extends SObjectDefinition<'CampaignShare'> {
    Name: 'CampaignShare';
    Fields: Fields$CampaignShare;
    ParentReferences: ParentReferences$CampaignShare;
    ChildRelationships: ChildRelationships$CampaignShare;
  }

type Fields$Case = {
  //
  Id: string;
  IsDeleted: boolean;
  CaseNumber: string;
  ContactId: string | null;
  AccountId: string | null;
  AssetId: string | null;
  ParentId: string | null;
  SuppliedName: string | null;
  SuppliedEmail: string | null;
  SuppliedPhone: string | null;
  SuppliedCompany: string | null;
  Type: string | null;
  Status: string | null;
  Reason: string | null;
  Origin: string | null;
  Subject: string | null;
  Priority: string | null;
  Description: string | null;
  IsClosed: boolean;
  ClosedDate: DateString | null;
  IsEscalated: boolean;
  CurrencyIsoCode: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ContactPhone: string | null;
  ContactMobile: string | null;
  ContactEmail: string | null;
  ContactFax: string | null;
  Comments: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Case = {
  //
  Contact: SObjectDefinition$Contact | null;
  Account: SObjectDefinition$Account | null;
  Asset: SObjectDefinition$Asset | null;
  Parent: SObjectDefinition$Case | null;
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Case = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  Cases: SObjectDefinition$Case;
  CaseComments: SObjectDefinition$CaseComment;
  CaseContactRoles: SObjectDefinition$CaseContactRole;
  Feeds: SObjectDefinition$CaseFeed;
  Histories: SObjectDefinition$CaseHistory;
  Shares: SObjectDefinition$CaseShare;
  CaseSolutions: SObjectDefinition$CaseSolution;
  TeamMembers: SObjectDefinition$CaseTeamMember;
  TeamTemplateRecords: SObjectDefinition$CaseTeamTemplateRecord;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  EmailMessages: SObjectDefinition$EmailMessage;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductRequests: SObjectDefinition$ProductRequest;
  ProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrders: SObjectDefinition$ReturnOrder;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$Case extends SObjectDefinition<'Case'> {
    Name: 'Case';
    Fields: Fields$Case;
    ParentReferences: ParentReferences$Case;
    ChildRelationships: ChildRelationships$Case;
  }

type Fields$CaseChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  CaseNumber: string;
  ContactId: string | null;
  AccountId: string | null;
  AssetId: string | null;
  ParentId: string | null;
  SuppliedName: string | null;
  SuppliedEmail: string | null;
  SuppliedPhone: string | null;
  SuppliedCompany: string | null;
  Type: string | null;
  Status: string | null;
  Reason: string | null;
  Origin: string | null;
  Subject: string | null;
  Priority: string | null;
  Description: string | null;
  IsClosed: boolean;
  ClosedDate: DateString | null;
  IsEscalated: boolean;
  CurrencyIsoCode: string | null;
  OwnerId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
};

type ParentReferences$CaseChangeEvent = {
  //
};

type ChildRelationships$CaseChangeEvent = {
  //
};

interface SObjectDefinition$CaseChangeEvent extends SObjectDefinition<'CaseChangeEvent'> {
    Name: 'CaseChangeEvent';
    Fields: Fields$CaseChangeEvent;
    ParentReferences: ParentReferences$CaseChangeEvent;
    ChildRelationships: ChildRelationships$CaseChangeEvent;
  }

type Fields$CaseComment = {
  //
  Id: string;
  ParentId: string;
  IsPublished: boolean;
  CommentBody: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  SystemModstamp: DateString;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$CaseComment = {
  //
  Parent: SObjectDefinition$Case;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseComment = {
  //
};

interface SObjectDefinition$CaseComment extends SObjectDefinition<'CaseComment'> {
    Name: 'CaseComment';
    Fields: Fields$CaseComment;
    ParentReferences: ParentReferences$CaseComment;
    ChildRelationships: ChildRelationships$CaseComment;
  }

type Fields$CaseContactRole = {
  //
  Id: string;
  CasesId: string;
  ContactId: string;
  Role: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$CaseContactRole = {
  //
  Cases: SObjectDefinition$Case;
  Contact: SObjectDefinition$Contact;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseContactRole = {
  //
};

interface SObjectDefinition$CaseContactRole extends SObjectDefinition<'CaseContactRole'> {
    Name: 'CaseContactRole';
    Fields: Fields$CaseContactRole;
    ParentReferences: ParentReferences$CaseContactRole;
    ChildRelationships: ChildRelationships$CaseContactRole;
  }

type Fields$CaseFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$CaseFeed = {
  //
  Parent: SObjectDefinition$Case;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$CaseFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$CaseFeed extends SObjectDefinition<'CaseFeed'> {
    Name: 'CaseFeed';
    Fields: Fields$CaseFeed;
    ParentReferences: ParentReferences$CaseFeed;
    ChildRelationships: ChildRelationships$CaseFeed;
  }

type Fields$CaseHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  CaseId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$CaseHistory = {
  //
  Case: SObjectDefinition$Case;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseHistory = {
  //
};

interface SObjectDefinition$CaseHistory extends SObjectDefinition<'CaseHistory'> {
    Name: 'CaseHistory';
    Fields: Fields$CaseHistory;
    ParentReferences: ParentReferences$CaseHistory;
    ChildRelationships: ChildRelationships$CaseHistory;
  }

type Fields$CaseShare = {
  //
  Id: string;
  CaseId: string;
  UserOrGroupId: string;
  CaseAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$CaseShare = {
  //
  Case: SObjectDefinition$Case;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseShare = {
  //
};

interface SObjectDefinition$CaseShare extends SObjectDefinition<'CaseShare'> {
    Name: 'CaseShare';
    Fields: Fields$CaseShare;
    ParentReferences: ParentReferences$CaseShare;
    ChildRelationships: ChildRelationships$CaseShare;
  }

type Fields$CaseSolution = {
  //
  Id: string;
  CaseId: string;
  SolutionId: string;
  CreatedById: string;
  CreatedDate: DateString;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$CaseSolution = {
  //
  Case: SObjectDefinition$Case;
  Solution: SObjectDefinition$Solution;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseSolution = {
  //
};

interface SObjectDefinition$CaseSolution extends SObjectDefinition<'CaseSolution'> {
    Name: 'CaseSolution';
    Fields: Fields$CaseSolution;
    ParentReferences: ParentReferences$CaseSolution;
    ChildRelationships: ChildRelationships$CaseSolution;
  }

type Fields$CaseStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  IsClosed: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$CaseStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseStatus = {
  //
};

interface SObjectDefinition$CaseStatus extends SObjectDefinition<'CaseStatus'> {
    Name: 'CaseStatus';
    Fields: Fields$CaseStatus;
    ParentReferences: ParentReferences$CaseStatus;
    ChildRelationships: ChildRelationships$CaseStatus;
  }

type Fields$CaseTeamMember = {
  //
  Id: string;
  ParentId: string;
  MemberId: string;
  TeamTemplateMemberId: string | null;
  TeamRoleId: string;
  TeamTemplateId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CaseTeamMember = {
  //
  Parent: SObjectDefinition$Case;
  Member: SObjectDefinition$Name;
  TeamTemplateMember: SObjectDefinition$CaseTeamTemplateMember | null;
  TeamRole: SObjectDefinition$CaseTeamRole;
  TeamTemplate: SObjectDefinition$CaseTeamTemplate | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseTeamMember = {
  //
};

interface SObjectDefinition$CaseTeamMember extends SObjectDefinition<'CaseTeamMember'> {
    Name: 'CaseTeamMember';
    Fields: Fields$CaseTeamMember;
    ParentReferences: ParentReferences$CaseTeamMember;
    ChildRelationships: ChildRelationships$CaseTeamMember;
  }

type Fields$CaseTeamRole = {
  //
  Id: string;
  Name: string;
  AccessLevel: string;
  PreferencesVisibleInCSP: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CaseTeamRole = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseTeamRole = {
  //
};

interface SObjectDefinition$CaseTeamRole extends SObjectDefinition<'CaseTeamRole'> {
    Name: 'CaseTeamRole';
    Fields: Fields$CaseTeamRole;
    ParentReferences: ParentReferences$CaseTeamRole;
    ChildRelationships: ChildRelationships$CaseTeamRole;
  }

type Fields$CaseTeamTemplate = {
  //
  Id: string;
  Name: string;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CaseTeamTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseTeamTemplate = {
  //
};

interface SObjectDefinition$CaseTeamTemplate extends SObjectDefinition<'CaseTeamTemplate'> {
    Name: 'CaseTeamTemplate';
    Fields: Fields$CaseTeamTemplate;
    ParentReferences: ParentReferences$CaseTeamTemplate;
    ChildRelationships: ChildRelationships$CaseTeamTemplate;
  }

type Fields$CaseTeamTemplateMember = {
  //
  Id: string;
  TeamTemplateId: string;
  MemberId: string;
  TeamRoleId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CaseTeamTemplateMember = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseTeamTemplateMember = {
  //
};

interface SObjectDefinition$CaseTeamTemplateMember extends SObjectDefinition<'CaseTeamTemplateMember'> {
    Name: 'CaseTeamTemplateMember';
    Fields: Fields$CaseTeamTemplateMember;
    ParentReferences: ParentReferences$CaseTeamTemplateMember;
    ChildRelationships: ChildRelationships$CaseTeamTemplateMember;
  }

type Fields$CaseTeamTemplateRecord = {
  //
  Id: string;
  ParentId: string;
  TeamTemplateId: string;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CaseTeamTemplateRecord = {
  //
  Parent: SObjectDefinition$Case;
  TeamTemplate: SObjectDefinition$CaseTeamTemplate;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseTeamTemplateRecord = {
  //
};

interface SObjectDefinition$CaseTeamTemplateRecord extends SObjectDefinition<'CaseTeamTemplateRecord'> {
    Name: 'CaseTeamTemplateRecord';
    Fields: Fields$CaseTeamTemplateRecord;
    ParentReferences: ParentReferences$CaseTeamTemplateRecord;
    ChildRelationships: ChildRelationships$CaseTeamTemplateRecord;
  }

type Fields$CategoryData = {
  //
  Id: string;
  CategoryNodeId: string;
  RelatedSobjectId: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CategoryData = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CategoryData = {
  //
};

interface SObjectDefinition$CategoryData extends SObjectDefinition<'CategoryData'> {
    Name: 'CategoryData';
    Fields: Fields$CategoryData;
    ParentReferences: ParentReferences$CategoryData;
    ChildRelationships: ChildRelationships$CategoryData;
  }

type Fields$CategoryNode = {
  //
  Id: string;
  ParentId: string | null;
  MasterLabel: string;
  SortOrder: number | null;
  SortStyle: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CategoryNode = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CategoryNode = {
  //
};

interface SObjectDefinition$CategoryNode extends SObjectDefinition<'CategoryNode'> {
    Name: 'CategoryNode';
    Fields: Fields$CategoryNode;
    ParentReferences: ParentReferences$CategoryNode;
    ChildRelationships: ChildRelationships$CategoryNode;
  }

type Fields$ChatterActivity = {
  //
  Id: string;
  ParentId: string | null;
  PostCount: number;
  CommentCount: number;
  CommentReceivedCount: number;
  LikeReceivedCount: number;
  InfluenceRawRank: number;
  SystemModstamp: DateString;
};

type ParentReferences$ChatterActivity = {
  //
};

type ChildRelationships$ChatterActivity = {
  //
};

interface SObjectDefinition$ChatterActivity extends SObjectDefinition<'ChatterActivity'> {
    Name: 'ChatterActivity';
    Fields: Fields$ChatterActivity;
    ParentReferences: ParentReferences$ChatterActivity;
    ChildRelationships: ChildRelationships$ChatterActivity;
  }

type Fields$ChatterExtension = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  IsProtected: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExtensionName: string;
  Type: string;
  IconId: string | null;
  Description: string;
  CompositionComponentEnumOrId: string | null;
  RenderComponentEnumOrId: string | null;
  HoverText: string | null;
  HeaderText: string | null;
};

type ParentReferences$ChatterExtension = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Icon: SObjectDefinition$ContentAsset | null;
};

type ChildRelationships$ChatterExtension = {
  //
};

interface SObjectDefinition$ChatterExtension extends SObjectDefinition<'ChatterExtension'> {
    Name: 'ChatterExtension';
    Fields: Fields$ChatterExtension;
    ParentReferences: ParentReferences$ChatterExtension;
    ChildRelationships: ChildRelationships$ChatterExtension;
  }

type Fields$ChatterExtensionConfig = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ChatterExtensionId: string | null;
  CanCreate: boolean;
  CanRead: boolean;
  Position: number | null;
};

type ParentReferences$ChatterExtensionConfig = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ChatterExtension: SObjectDefinition$ChatterExtension | null;
};

type ChildRelationships$ChatterExtensionConfig = {
  //
};

interface SObjectDefinition$ChatterExtensionConfig extends SObjectDefinition<'ChatterExtensionConfig'> {
    Name: 'ChatterExtensionConfig';
    Fields: Fields$ChatterExtensionConfig;
    ParentReferences: ParentReferences$ChatterExtensionConfig;
    ChildRelationships: ChildRelationships$ChatterExtensionConfig;
  }

type Fields$ClientBrowser = {
  //
  Id: string;
  UsersId: string;
  FullUserAgent: string | null;
  ProxyInfo: string | null;
  LastUpdate: DateString | null;
  CreatedDate: DateString;
};

type ParentReferences$ClientBrowser = {
  //
  Users: SObjectDefinition$User;
};

type ChildRelationships$ClientBrowser = {
  //
};

interface SObjectDefinition$ClientBrowser extends SObjectDefinition<'ClientBrowser'> {
    Name: 'ClientBrowser';
    Fields: Fields$ClientBrowser;
    ParentReferences: ParentReferences$ClientBrowser;
    ChildRelationships: ChildRelationships$ClientBrowser;
  }

type Fields$CollaborationGroup = {
  //
  Id: string;
  Name: string;
  MemberCount: number | null;
  OwnerId: string;
  CollaborationType: string;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  FullPhotoUrl: string | null;
  MediumPhotoUrl: string | null;
  SmallPhotoUrl: string | null;
  LastFeedModifiedDate: DateString;
  InformationTitle: string | null;
  InformationBody: string | null;
  HasPrivateFieldsAccess: boolean;
  CanHaveGuests: boolean;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  IsArchived: boolean;
  IsAutoArchiveDisabled: boolean;
  AnnouncementId: string | null;
  GroupEmail: string | null;
  BannerPhotoUrl: string | null;
  IsBroadcast: boolean;
};

type ParentReferences$CollaborationGroup = {
  //
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Announcement: SObjectDefinition$Announcement | null;
};

type ChildRelationships$CollaborationGroup = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Feeds: SObjectDefinition$CollaborationGroupFeed;
  GroupMembers: SObjectDefinition$CollaborationGroupMember;
  GroupMemberRequests: SObjectDefinition$CollaborationGroupMemberRequest;
  CollaborationGroupRecords: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$CollaborationGroup extends SObjectDefinition<'CollaborationGroup'> {
    Name: 'CollaborationGroup';
    Fields: Fields$CollaborationGroup;
    ParentReferences: ParentReferences$CollaborationGroup;
    ChildRelationships: ChildRelationships$CollaborationGroup;
  }

type Fields$CollaborationGroupFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$CollaborationGroupFeed = {
  //
  Parent: SObjectDefinition$CollaborationGroup;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$CollaborationGroupFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$CollaborationGroupFeed extends SObjectDefinition<'CollaborationGroupFeed'> {
    Name: 'CollaborationGroupFeed';
    Fields: Fields$CollaborationGroupFeed;
    ParentReferences: ParentReferences$CollaborationGroupFeed;
    ChildRelationships: ChildRelationships$CollaborationGroupFeed;
  }

type Fields$CollaborationGroupMember = {
  //
  Id: string;
  CollaborationGroupId: string;
  MemberId: string;
  CollaborationRole: string | null;
  NotificationFrequency: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastFeedAccessDate: DateString | null;
};

type ParentReferences$CollaborationGroupMember = {
  //
  CollaborationGroup: SObjectDefinition$CollaborationGroup;
  Member: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CollaborationGroupMember = {
  //
};

interface SObjectDefinition$CollaborationGroupMember extends SObjectDefinition<'CollaborationGroupMember'> {
    Name: 'CollaborationGroupMember';
    Fields: Fields$CollaborationGroupMember;
    ParentReferences: ParentReferences$CollaborationGroupMember;
    ChildRelationships: ChildRelationships$CollaborationGroupMember;
  }

type Fields$CollaborationGroupMemberRequest = {
  //
  Id: string;
  CollaborationGroupId: string;
  RequesterId: string;
  ResponseMessage: string | null;
  Status: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CollaborationGroupMemberRequest = {
  //
  CollaborationGroup: SObjectDefinition$CollaborationGroup;
  Requester: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CollaborationGroupMemberRequest = {
  //
};

interface SObjectDefinition$CollaborationGroupMemberRequest extends SObjectDefinition<'CollaborationGroupMemberRequest'> {
    Name: 'CollaborationGroupMemberRequest';
    Fields: Fields$CollaborationGroupMemberRequest;
    ParentReferences: ParentReferences$CollaborationGroupMemberRequest;
    ChildRelationships: ChildRelationships$CollaborationGroupMemberRequest;
  }

type Fields$CollaborationGroupRecord = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CollaborationGroupId: string;
  RecordId: string;
};

type ParentReferences$CollaborationGroupRecord = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  CollaborationGroup: SObjectDefinition$CollaborationGroup;
  Record: SObjectDefinition$Name;
};

type ChildRelationships$CollaborationGroupRecord = {
  //
};

interface SObjectDefinition$CollaborationGroupRecord extends SObjectDefinition<'CollaborationGroupRecord'> {
    Name: 'CollaborationGroupRecord';
    Fields: Fields$CollaborationGroupRecord;
    ParentReferences: ParentReferences$CollaborationGroupRecord;
    ChildRelationships: ChildRelationships$CollaborationGroupRecord;
  }

type Fields$CollaborationInvitation = {
  //
  Id: string;
  ParentId: string | null;
  SharedEntityId: string;
  InviterId: string;
  InvitedUserEmail: string;
  InvitedUserEmailNormalized: string;
  Status: string;
  OptionalMessage: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CollaborationInvitation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CollaborationInvitation = {
  //
};

interface SObjectDefinition$CollaborationInvitation extends SObjectDefinition<'CollaborationInvitation'> {
    Name: 'CollaborationInvitation';
    Fields: Fields$CollaborationInvitation;
    ParentReferences: ParentReferences$CollaborationInvitation;
    ChildRelationships: ChildRelationships$CollaborationInvitation;
  }

type Fields$ColorDefinition = {
  //
  Id: string;
  DurableId: string | null;
  TabDefinitionId: string | null;
  Color: string | null;
  Theme: string | null;
  Context: string | null;
};

type ParentReferences$ColorDefinition = {
  //
};

type ChildRelationships$ColorDefinition = {
  //
};

interface SObjectDefinition$ColorDefinition extends SObjectDefinition<'ColorDefinition'> {
    Name: 'ColorDefinition';
    Fields: Fields$ColorDefinition;
    ParentReferences: ParentReferences$ColorDefinition;
    ChildRelationships: ChildRelationships$ColorDefinition;
  }

type Fields$CombinedAttachment = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  RecordType: string | null;
  Title: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  FileType: string | null;
  ContentSize: number | null;
  FileExtension: string | null;
  ContentUrl: string | null;
  ExternalDataSourceName: string | null;
  ExternalDataSourceType: string | null;
  SharingOption: string | null;
};

type ParentReferences$CombinedAttachment = {
  //
  Parent: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CombinedAttachment = {
  //
};

interface SObjectDefinition$CombinedAttachment extends SObjectDefinition<'CombinedAttachment'> {
    Name: 'CombinedAttachment';
    Fields: Fields$CombinedAttachment;
    ParentReferences: ParentReferences$CombinedAttachment;
    ChildRelationships: ChildRelationships$CombinedAttachment;
  }

type Fields$Community = {
  //
  Id: string;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  Name: string;
  Description: string | null;
  IsActive: boolean;
  IsPublished: boolean;
};

type ParentReferences$Community = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Community = {
  //
};

interface SObjectDefinition$Community extends SObjectDefinition<'Community'> {
    Name: 'Community';
    Fields: Fields$Community;
    ParentReferences: ParentReferences$Community;
    ChildRelationships: ChildRelationships$Community;
  }

type Fields$ConferenceNumber = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExternalEventId: string | null;
  Label: string | null;
  Number: string | null;
  AccessCode: string | null;
  Vendor: string | null;
};

type ParentReferences$ConferenceNumber = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ExternalEvent: SObjectDefinition$ExternalEvent | null;
};

type ChildRelationships$ConferenceNumber = {
  //
};

interface SObjectDefinition$ConferenceNumber extends SObjectDefinition<'ConferenceNumber'> {
    Name: 'ConferenceNumber';
    Fields: Fields$ConferenceNumber;
    ParentReferences: ParentReferences$ConferenceNumber;
    ChildRelationships: ChildRelationships$ConferenceNumber;
  }

type Fields$ConnectedApplication = {
  //
  Id: string;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  OptionsAllowAdminApprovedUsersOnly: boolean;
  OptionsRefreshTokenValidityMetric: boolean;
  OptionsHasSessionLevelPolicy: boolean;
  OptionsIsInternal: boolean;
  OptionsFullContentPushNotifications: boolean;
  MobileSessionTimeout: string | null;
  PinLength: string | null;
  StartUrl: string | null;
  MobileStartUrl: string | null;
  RefreshTokenValidityPeriod: number | null;
};

type ParentReferences$ConnectedApplication = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ConnectedApplication = {
  //
  InstalledMobileApps: SObjectDefinition$InstalledMobileApp;
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$ConnectedApplication extends SObjectDefinition<'ConnectedApplication'> {
    Name: 'ConnectedApplication';
    Fields: Fields$ConnectedApplication;
    ParentReferences: ParentReferences$ConnectedApplication;
    ChildRelationships: ChildRelationships$ConnectedApplication;
  }

type Fields$Contact = {
  //
  Id: string;
  IsDeleted: boolean;
  MasterRecordId: string | null;
  AccountId: string | null;
  LastName: string;
  FirstName: string | null;
  Salutation: string | null;
  Name: string;
  OtherStreet: string | null;
  OtherCity: string | null;
  OtherState: string | null;
  OtherPostalCode: string | null;
  OtherCountry: string | null;
  OtherLatitude: number | null;
  OtherLongitude: number | null;
  OtherGeocodeAccuracy: string | null;
  OtherAddress: Address | null;
  MailingStreet: string | null;
  MailingCity: string | null;
  MailingState: string | null;
  MailingPostalCode: string | null;
  MailingCountry: string | null;
  MailingLatitude: number | null;
  MailingLongitude: number | null;
  MailingGeocodeAccuracy: string | null;
  MailingAddress: Address | null;
  Phone: string | null;
  Fax: string | null;
  MobilePhone: string | null;
  HomePhone: string | null;
  OtherPhone: string | null;
  AssistantPhone: string | null;
  ReportsToId: string | null;
  Email: string | null;
  Title: string | null;
  Department: string | null;
  AssistantName: string | null;
  LeadSource: string | null;
  Birthdate: DateString | null;
  Description: string | null;
  CurrencyIsoCode: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  LastCURequestDate: DateString | null;
  LastCUUpdateDate: DateString | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  EmailBouncedReason: string | null;
  EmailBouncedDate: DateString | null;
  IsEmailBounced: boolean;
  PhotoUrl: string | null;
  Jigsaw: string | null;
  JigsawContactId: string | null;
  CleanStatus: string | null;
  IndividualId: string | null;
};

type ParentReferences$Contact = {
  //
  MasterRecord: SObjectDefinition$Contact | null;
  Account: SObjectDefinition$Account | null;
  ReportsTo: SObjectDefinition$Contact | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Individual: SObjectDefinition$Individual | null;
};

type ChildRelationships$Contact = {
  //
  AcceptedEventRelations: SObjectDefinition$AcceptedEventRelation;
  AccountContactRoles: SObjectDefinition$AccountContactRole;
  ActivityHistories: SObjectDefinition$ActivityHistory;
  Assets: SObjectDefinition$Asset;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CampaignMembers: SObjectDefinition$CampaignMember;
  Cases: SObjectDefinition$Case;
  CaseContactRoles: SObjectDefinition$CaseContactRole;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactCleanInfos: SObjectDefinition$ContactCleanInfo;
  Feeds: SObjectDefinition$ContactFeed;
  Histories: SObjectDefinition$ContactHistory;
  ContactRequests: SObjectDefinition$ContactRequest;
  Shares: SObjectDefinition$ContactShare;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContractsSigned: SObjectDefinition$Contract;
  ContractContactRoles: SObjectDefinition$ContractContactRole;
  DeclinedEventRelations: SObjectDefinition$DeclinedEventRelation;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  EmailMessageRelations: SObjectDefinition$EmailMessageRelation;
  EmailStatuses: SObjectDefinition$EmailStatus;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  EventRelations: SObjectDefinition$EventRelation;
  MaintenancePlans: SObjectDefinition$MaintenancePlan;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  OpportunityContactRoles: SObjectDefinition$OpportunityContactRole;
  OutgoingEmailRelations: SObjectDefinition$OutgoingEmailRelation;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrders: SObjectDefinition$ReturnOrder;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  UndecidedEventRelations: SObjectDefinition$UndecidedEventRelation;
  Users: SObjectDefinition$User;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$Contact extends SObjectDefinition<'Contact'> {
    Name: 'Contact';
    Fields: Fields$Contact;
    ParentReferences: ParentReferences$Contact;
    ChildRelationships: ChildRelationships$Contact;
  }

type Fields$ContactChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  AccountId: string | null;
  LastName: string | null;
  FirstName: string | null;
  Salutation: string | null;
  Name: string | null;
  OtherStreet: string | null;
  OtherCity: string | null;
  OtherState: string | null;
  OtherPostalCode: string | null;
  OtherCountry: string | null;
  OtherLatitude: number | null;
  OtherLongitude: number | null;
  OtherGeocodeAccuracy: string | null;
  OtherAddress: Address | null;
  MailingStreet: string | null;
  MailingCity: string | null;
  MailingState: string | null;
  MailingPostalCode: string | null;
  MailingCountry: string | null;
  MailingLatitude: number | null;
  MailingLongitude: number | null;
  MailingGeocodeAccuracy: string | null;
  MailingAddress: Address | null;
  Phone: string | null;
  Fax: string | null;
  MobilePhone: string | null;
  HomePhone: string | null;
  OtherPhone: string | null;
  AssistantPhone: string | null;
  ReportsToId: string | null;
  Email: string | null;
  Title: string | null;
  Department: string | null;
  AssistantName: string | null;
  LeadSource: string | null;
  Birthdate: DateString | null;
  Description: string | null;
  CurrencyIsoCode: string | null;
  OwnerId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  LastCURequestDate: DateString | null;
  LastCUUpdateDate: DateString | null;
  EmailBouncedReason: string | null;
  EmailBouncedDate: DateString | null;
  Jigsaw: string | null;
  JigsawContactId: string | null;
  CleanStatus: string | null;
  IndividualId: string | null;
};

type ParentReferences$ContactChangeEvent = {
  //
};

type ChildRelationships$ContactChangeEvent = {
  //
};

interface SObjectDefinition$ContactChangeEvent extends SObjectDefinition<'ContactChangeEvent'> {
    Name: 'ContactChangeEvent';
    Fields: Fields$ContactChangeEvent;
    ParentReferences: ParentReferences$ContactChangeEvent;
    ChildRelationships: ChildRelationships$ContactChangeEvent;
  }

type Fields$ContactCleanInfo = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ContactId: string;
  LastMatchedDate: DateString;
  LastStatusChangedDate: DateString | null;
  LastStatusChangedById: string | null;
  IsInactive: boolean;
  FirstName: string | null;
  LastName: string | null;
  Email: string | null;
  Phone: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Title: string | null;
  ContactStatusDataDotCom: string | null;
  IsReviewedName: boolean;
  IsReviewedEmail: boolean;
  IsReviewedPhone: boolean;
  IsReviewedAddress: boolean;
  IsReviewedTitle: boolean;
  IsDifferentFirstName: boolean;
  IsDifferentLastName: boolean;
  IsDifferentEmail: boolean;
  IsDifferentPhone: boolean;
  IsDifferentStreet: boolean;
  IsDifferentCity: boolean;
  IsDifferentState: boolean;
  IsDifferentPostalCode: boolean;
  IsDifferentCountry: boolean;
  IsDifferentTitle: boolean;
  IsDifferentStateCode: boolean;
  IsDifferentCountryCode: boolean;
  CleanedByJob: boolean;
  CleanedByUser: boolean;
  IsFlaggedWrongName: boolean;
  IsFlaggedWrongEmail: boolean;
  IsFlaggedWrongPhone: boolean;
  IsFlaggedWrongAddress: boolean;
  IsFlaggedWrongTitle: boolean;
  DataDotComId: string | null;
};

type ParentReferences$ContactCleanInfo = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Contact: SObjectDefinition$Contact;
  LastStatusChangedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ContactCleanInfo = {
  //
};

interface SObjectDefinition$ContactCleanInfo extends SObjectDefinition<'ContactCleanInfo'> {
    Name: 'ContactCleanInfo';
    Fields: Fields$ContactCleanInfo;
    ParentReferences: ParentReferences$ContactCleanInfo;
    ChildRelationships: ChildRelationships$ContactCleanInfo;
  }

type Fields$ContactFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ContactFeed = {
  //
  Parent: SObjectDefinition$Contact;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ContactFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ContactFeed extends SObjectDefinition<'ContactFeed'> {
    Name: 'ContactFeed';
    Fields: Fields$ContactFeed;
    ParentReferences: ParentReferences$ContactFeed;
    ChildRelationships: ChildRelationships$ContactFeed;
  }

type Fields$ContactHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ContactId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ContactHistory = {
  //
  Contact: SObjectDefinition$Contact;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContactHistory = {
  //
};

interface SObjectDefinition$ContactHistory extends SObjectDefinition<'ContactHistory'> {
    Name: 'ContactHistory';
    Fields: Fields$ContactHistory;
    ParentReferences: ParentReferences$ContactHistory;
    ChildRelationships: ChildRelationships$ContactHistory;
  }

type Fields$ContactRequest = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  WhatId: string | null;
  WhoId: string | null;
  PreferredPhone: string | null;
  PreferredChannel: string;
  Status: string;
};

type ParentReferences$ContactRequest = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  What: SObjectDefinition$Name | null;
  Who: SObjectDefinition$Name | null;
};

type ChildRelationships$ContactRequest = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  Emails: SObjectDefinition$EmailMessage;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
};

interface SObjectDefinition$ContactRequest extends SObjectDefinition<'ContactRequest'> {
    Name: 'ContactRequest';
    Fields: Fields$ContactRequest;
    ParentReferences: ParentReferences$ContactRequest;
    ChildRelationships: ChildRelationships$ContactRequest;
  }

type Fields$ContactRequestShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ContactRequestShare = {
  //
  Parent: SObjectDefinition$ContactRequest;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContactRequestShare = {
  //
};

interface SObjectDefinition$ContactRequestShare extends SObjectDefinition<'ContactRequestShare'> {
    Name: 'ContactRequestShare';
    Fields: Fields$ContactRequestShare;
    ParentReferences: ParentReferences$ContactRequestShare;
    ChildRelationships: ChildRelationships$ContactRequestShare;
  }

type Fields$ContactShare = {
  //
  Id: string;
  ContactId: string;
  UserOrGroupId: string;
  ContactAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ContactShare = {
  //
  Contact: SObjectDefinition$Contact;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContactShare = {
  //
};

interface SObjectDefinition$ContactShare extends SObjectDefinition<'ContactShare'> {
    Name: 'ContactShare';
    Fields: Fields$ContactShare;
    ParentReferences: ParentReferences$ContactShare;
    ChildRelationships: ChildRelationships$ContactShare;
  }

type Fields$ContentAsset = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ContentDocumentId: string | null;
  IsVisibleByExternalUsers: boolean;
};

type ParentReferences$ContentAsset = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ContentDocument: SObjectDefinition$ContentDocument | null;
};

type ChildRelationships$ContentAsset = {
  //
};

interface SObjectDefinition$ContentAsset extends SObjectDefinition<'ContentAsset'> {
    Name: 'ContentAsset';
    Fields: Fields$ContentAsset;
    ParentReferences: ParentReferences$ContentAsset;
    ChildRelationships: ChildRelationships$ContentAsset;
  }

type Fields$ContentBody = {
  //
  Id: string;
};

type ParentReferences$ContentBody = {
  //
};

type ChildRelationships$ContentBody = {
  //
};

interface SObjectDefinition$ContentBody extends SObjectDefinition<'ContentBody'> {
    Name: 'ContentBody';
    Fields: Fields$ContentBody;
    ParentReferences: ParentReferences$ContentBody;
    ChildRelationships: ChildRelationships$ContentBody;
  }

type Fields$ContentDistribution = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  OwnerId: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Name: string;
  IsDeleted: boolean;
  ContentVersionId: string;
  ContentDocumentId: string | null;
  RelatedRecordId: string | null;
  PreferencesAllowPDFDownload: boolean;
  PreferencesAllowOriginalDownload: boolean;
  PreferencesPasswordRequired: boolean;
  PreferencesNotifyOnVisit: boolean;
  PreferencesLinkLatestVersion: boolean;
  PreferencesAllowViewInBrowser: boolean;
  PreferencesExpires: boolean;
  PreferencesNotifyRndtnComplete: boolean;
  ExpiryDate: DateString | null;
  Password: string | null;
  ViewCount: number | null;
  FirstViewDate: DateString | null;
  LastViewDate: DateString | null;
  DistributionPublicUrl: string | null;
  ContentDownloadUrl: string | null;
  PdfDownloadUrl: string | null;
};

type ParentReferences$ContentDistribution = {
  //
  CreatedBy: SObjectDefinition$User;
  Owner: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ContentVersion: SObjectDefinition$ContentVersion;
  RelatedRecord: SObjectDefinition$Name | null;
};

type ChildRelationships$ContentDistribution = {
  //
  ContentDistributionViews: SObjectDefinition$ContentDistributionView;
};

interface SObjectDefinition$ContentDistribution extends SObjectDefinition<'ContentDistribution'> {
    Name: 'ContentDistribution';
    Fields: Fields$ContentDistribution;
    ParentReferences: ParentReferences$ContentDistribution;
    ChildRelationships: ChildRelationships$ContentDistribution;
  }

type Fields$ContentDistributionView = {
  //
  Id: string;
  DistributionId: string;
  ParentViewId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  IsInternal: boolean;
  IsDownload: boolean;
};

type ParentReferences$ContentDistributionView = {
  //
  Distribution: SObjectDefinition$ContentDistribution;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentDistributionView = {
  //
};

interface SObjectDefinition$ContentDistributionView extends SObjectDefinition<'ContentDistributionView'> {
    Name: 'ContentDistributionView';
    Fields: Fields$ContentDistributionView;
    ParentReferences: ParentReferences$ContentDistributionView;
    ChildRelationships: ChildRelationships$ContentDistributionView;
  }

type Fields$ContentDocument = {
  //
  Id: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  IsArchived: boolean;
  ArchivedById: string | null;
  ArchivedDate: DateString | null;
  IsDeleted: boolean;
  OwnerId: string;
  SystemModstamp: DateString;
  Title: string;
  PublishStatus: string;
  LatestPublishedVersionId: string | null;
  ParentId: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Description: string | null;
  ContentSize: number | null;
  FileType: string | null;
  FileExtension: string | null;
  SharingOption: string | null;
  SharingPrivacy: string | null;
  ContentModifiedDate: DateString | null;
  ContentAssetId: string | null;
};

type ParentReferences$ContentDocument = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Owner: SObjectDefinition$User;
  LatestPublishedVersion: SObjectDefinition$ContentVersion | null;
  ContentAsset: SObjectDefinition$ContentAsset | null;
};

type ChildRelationships$ContentDocument = {
  //
  ContentDistributions: SObjectDefinition$ContentDistribution;
  Feeds: SObjectDefinition$ContentDocumentFeed;
  Histories: SObjectDefinition$ContentDocumentHistory;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContentVersions: SObjectDefinition$ContentVersion;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ContentDocument extends SObjectDefinition<'ContentDocument'> {
    Name: 'ContentDocument';
    Fields: Fields$ContentDocument;
    ParentReferences: ParentReferences$ContentDocument;
    ChildRelationships: ChildRelationships$ContentDocument;
  }

type Fields$ContentDocumentFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ContentDocumentFeed = {
  //
  Parent: SObjectDefinition$ContentDocument;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ContentDocumentFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ContentDocumentFeed extends SObjectDefinition<'ContentDocumentFeed'> {
    Name: 'ContentDocumentFeed';
    Fields: Fields$ContentDocumentFeed;
    ParentReferences: ParentReferences$ContentDocumentFeed;
    ChildRelationships: ChildRelationships$ContentDocumentFeed;
  }

type Fields$ContentDocumentHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ContentDocumentId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ContentDocumentHistory = {
  //
  ContentDocument: SObjectDefinition$ContentDocument;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentDocumentHistory = {
  //
};

interface SObjectDefinition$ContentDocumentHistory extends SObjectDefinition<'ContentDocumentHistory'> {
    Name: 'ContentDocumentHistory';
    Fields: Fields$ContentDocumentHistory;
    ParentReferences: ParentReferences$ContentDocumentHistory;
    ChildRelationships: ChildRelationships$ContentDocumentHistory;
  }

type Fields$ContentDocumentLink = {
  //
  Id: string;
  LinkedEntityId: string;
  ContentDocumentId: string;
  IsDeleted: boolean;
  SystemModstamp: DateString;
  ShareType: string | null;
  Visibility: string | null;
};

type ParentReferences$ContentDocumentLink = {
  //
  LinkedEntity: SObjectDefinition$Name;
  ContentDocument: SObjectDefinition$ContentDocument;
};

type ChildRelationships$ContentDocumentLink = {
  //
};

interface SObjectDefinition$ContentDocumentLink extends SObjectDefinition<'ContentDocumentLink'> {
    Name: 'ContentDocumentLink';
    Fields: Fields$ContentDocumentLink;
    ParentReferences: ParentReferences$ContentDocumentLink;
    ChildRelationships: ChildRelationships$ContentDocumentLink;
  }

type Fields$ContentDocumentSubscription = {
  //
  Id: string;
  UserId: string;
  ContentDocumentId: string;
  IsCommentSub: boolean;
  IsDocumentSub: boolean;
};

type ParentReferences$ContentDocumentSubscription = {
  //
  User: SObjectDefinition$User;
  ContentDocument: SObjectDefinition$ContentDocument;
};

type ChildRelationships$ContentDocumentSubscription = {
  //
};

interface SObjectDefinition$ContentDocumentSubscription extends SObjectDefinition<'ContentDocumentSubscription'> {
    Name: 'ContentDocumentSubscription';
    Fields: Fields$ContentDocumentSubscription;
    ParentReferences: ParentReferences$ContentDocumentSubscription;
    ChildRelationships: ChildRelationships$ContentDocumentSubscription;
  }

type Fields$ContentFolder = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentContentFolderId: string | null;
};

type ParentReferences$ContentFolder = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentContentFolder: SObjectDefinition$ContentFolder | null;
};

type ChildRelationships$ContentFolder = {
  //
  ContentFolderLinks: SObjectDefinition$ContentFolderLink;
};

interface SObjectDefinition$ContentFolder extends SObjectDefinition<'ContentFolder'> {
    Name: 'ContentFolder';
    Fields: Fields$ContentFolder;
    ParentReferences: ParentReferences$ContentFolder;
    ChildRelationships: ChildRelationships$ContentFolder;
  }

type Fields$ContentFolderItem = {
  //
  Id: string;
  IsDeleted: boolean;
  IsFolder: boolean;
  ParentContentFolderId: string | null;
  Title: string;
  FileType: string | null;
  ContentSize: number | null;
  FileExtension: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ContentFolderItem = {
  //
  ParentContentFolder: SObjectDefinition$ContentFolder | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentFolderItem = {
  //
};

interface SObjectDefinition$ContentFolderItem extends SObjectDefinition<'ContentFolderItem'> {
    Name: 'ContentFolderItem';
    Fields: Fields$ContentFolderItem;
    ParentReferences: ParentReferences$ContentFolderItem;
    ChildRelationships: ChildRelationships$ContentFolderItem;
  }

type Fields$ContentFolderLink = {
  //
  Id: string;
  ParentEntityId: string;
  ContentFolderId: string;
  IsDeleted: boolean;
  EnableFolderStatus: string | null;
};

type ParentReferences$ContentFolderLink = {
  //
  ContentFolder: SObjectDefinition$ContentFolder;
};

type ChildRelationships$ContentFolderLink = {
  //
};

interface SObjectDefinition$ContentFolderLink extends SObjectDefinition<'ContentFolderLink'> {
    Name: 'ContentFolderLink';
    Fields: Fields$ContentFolderLink;
    ParentReferences: ParentReferences$ContentFolderLink;
    ChildRelationships: ChildRelationships$ContentFolderLink;
  }

type Fields$ContentFolderMember = {
  //
  Id: string;
  ParentContentFolderId: string;
  ChildRecordId: string;
  IsDeleted: boolean;
  SystemModstamp: DateString;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
};

type ParentReferences$ContentFolderMember = {
  //
  ParentContentFolder: SObjectDefinition$ContentFolder;
  ChildRecord: SObjectDefinition$ContentDocument;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentFolderMember = {
  //
};

interface SObjectDefinition$ContentFolderMember extends SObjectDefinition<'ContentFolderMember'> {
    Name: 'ContentFolderMember';
    Fields: Fields$ContentFolderMember;
    ParentReferences: ParentReferences$ContentFolderMember;
    ChildRelationships: ChildRelationships$ContentFolderMember;
  }

type Fields$ContentNotification = {
  //
  Id: string;
  Nature: string | null;
  UsersId: string;
  CreatedDate: DateString;
  EntityType: string | null;
  EntityIdentifierId: string | null;
  Subject: string | null;
  Text: string | null;
};

type ParentReferences$ContentNotification = {
  //
  Users: SObjectDefinition$User;
};

type ChildRelationships$ContentNotification = {
  //
};

interface SObjectDefinition$ContentNotification extends SObjectDefinition<'ContentNotification'> {
    Name: 'ContentNotification';
    Fields: Fields$ContentNotification;
    ParentReferences: ParentReferences$ContentNotification;
    ChildRelationships: ChildRelationships$ContentNotification;
  }

type Fields$ContentTagSubscription = {
  //
  Id: string;
  UserId: string | null;
};

type ParentReferences$ContentTagSubscription = {
  //
  User: SObjectDefinition$User | null;
};

type ChildRelationships$ContentTagSubscription = {
  //
};

interface SObjectDefinition$ContentTagSubscription extends SObjectDefinition<'ContentTagSubscription'> {
    Name: 'ContentTagSubscription';
    Fields: Fields$ContentTagSubscription;
    ParentReferences: ParentReferences$ContentTagSubscription;
    ChildRelationships: ChildRelationships$ContentTagSubscription;
  }

type Fields$ContentUserSubscription = {
  //
  Id: string;
  SubscriberUserId: string;
  SubscribedToUserId: string;
};

type ParentReferences$ContentUserSubscription = {
  //
  SubscriberUser: SObjectDefinition$User;
  SubscribedToUser: SObjectDefinition$User;
};

type ChildRelationships$ContentUserSubscription = {
  //
};

interface SObjectDefinition$ContentUserSubscription extends SObjectDefinition<'ContentUserSubscription'> {
    Name: 'ContentUserSubscription';
    Fields: Fields$ContentUserSubscription;
    ParentReferences: ParentReferences$ContentUserSubscription;
    ChildRelationships: ChildRelationships$ContentUserSubscription;
  }

type Fields$ContentVersion = {
  //
  Id: string;
  ContentDocumentId: string;
  IsLatest: boolean;
  ContentUrl: string | null;
  ContentBodyId: string | null;
  VersionNumber: string | null;
  Title: string;
  Description: string | null;
  ReasonForChange: string | null;
  SharingOption: string;
  SharingPrivacy: string;
  PathOnClient: string | null;
  RatingCount: number | null;
  IsDeleted: boolean;
  ContentModifiedDate: DateString | null;
  ContentModifiedById: string | null;
  PositiveRatingCount: number | null;
  NegativeRatingCount: number | null;
  FeaturedContentBoost: number | null;
  FeaturedContentDate: DateString | null;
  CurrencyIsoCode: string;
  OwnerId: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  TagCsv: string | null;
  FileType: string;
  PublishStatus: string;
  VersionData: BlobString | null;
  ContentSize: number | null;
  FileExtension: string | null;
  FirstPublishLocationId: string | null;
  Origin: string;
  ContentLocation: string;
  TextPreview: string | null;
  ExternalDocumentInfo1: string | null;
  ExternalDocumentInfo2: string | null;
  ExternalDataSourceId: string | null;
  Checksum: string | null;
  IsMajorVersion: boolean;
  IsAssetEnabled: boolean;
};

type ParentReferences$ContentVersion = {
  //
  ContentDocument: SObjectDefinition$ContentDocument;
  ContentBody: SObjectDefinition$ContentBody | null;
  ContentModifiedBy: SObjectDefinition$User | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  FirstPublishLocation: SObjectDefinition$Name | null;
  ExternalDataSource: SObjectDefinition$ExternalDataSource | null;
};

type ChildRelationships$ContentVersion = {
  //
  Histories: SObjectDefinition$ContentVersionHistory;
};

interface SObjectDefinition$ContentVersion extends SObjectDefinition<'ContentVersion'> {
    Name: 'ContentVersion';
    Fields: Fields$ContentVersion;
    ParentReferences: ParentReferences$ContentVersion;
    ChildRelationships: ChildRelationships$ContentVersion;
  }

type Fields$ContentVersionComment = {
  //
  Id: string;
  ContentDocumentId: string;
  ContentVersionId: string;
  UserComment: string | null;
  CreatedDate: DateString;
};

type ParentReferences$ContentVersionComment = {
  //
  ContentDocument: SObjectDefinition$ContentDocument;
  ContentVersion: SObjectDefinition$ContentVersion;
};

type ChildRelationships$ContentVersionComment = {
  //
};

interface SObjectDefinition$ContentVersionComment extends SObjectDefinition<'ContentVersionComment'> {
    Name: 'ContentVersionComment';
    Fields: Fields$ContentVersionComment;
    ParentReferences: ParentReferences$ContentVersionComment;
    ChildRelationships: ChildRelationships$ContentVersionComment;
  }

type Fields$ContentVersionHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ContentVersionId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ContentVersionHistory = {
  //
  ContentVersion: SObjectDefinition$ContentVersion;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentVersionHistory = {
  //
};

interface SObjectDefinition$ContentVersionHistory extends SObjectDefinition<'ContentVersionHistory'> {
    Name: 'ContentVersionHistory';
    Fields: Fields$ContentVersionHistory;
    ParentReferences: ParentReferences$ContentVersionHistory;
    ChildRelationships: ChildRelationships$ContentVersionHistory;
  }

type Fields$ContentVersionRating = {
  //
  Id: string;
  UserId: string;
  ContentVersionId: string;
  Rating: number | null;
  UserComment: string | null;
  LastModifiedDate: DateString;
};

type ParentReferences$ContentVersionRating = {
  //
  User: SObjectDefinition$User;
  ContentVersion: SObjectDefinition$ContentVersion;
};

type ChildRelationships$ContentVersionRating = {
  //
};

interface SObjectDefinition$ContentVersionRating extends SObjectDefinition<'ContentVersionRating'> {
    Name: 'ContentVersionRating';
    Fields: Fields$ContentVersionRating;
    ParentReferences: ParentReferences$ContentVersionRating;
    ChildRelationships: ChildRelationships$ContentVersionRating;
  }

type Fields$ContentWorkspace = {
  //
  Id: string;
  Name: string;
  Description: string | null;
  TagModel: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastModifiedDate: DateString;
  DefaultRecordTypeId: string | null;
  IsRestrictContentTypes: boolean;
  IsRestrictLinkedContentTypes: boolean;
  WorkspaceType: string | null;
  ShouldAddCreatorMembership: boolean;
  LastWorkspaceActivityDate: DateString | null;
  RootContentFolderId: string | null;
  NamespacePrefix: string | null;
  DeveloperName: string | null;
  WorkspaceImageId: string | null;
};

type ParentReferences$ContentWorkspace = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  WorkspaceImage: SObjectDefinition$ContentAsset | null;
};

type ChildRelationships$ContentWorkspace = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContentFolderLinks: SObjectDefinition$ContentFolderLink;
  ContentWorkspaceMembers: SObjectDefinition$ContentWorkspaceMember;
};

interface SObjectDefinition$ContentWorkspace extends SObjectDefinition<'ContentWorkspace'> {
    Name: 'ContentWorkspace';
    Fields: Fields$ContentWorkspace;
    ParentReferences: ParentReferences$ContentWorkspace;
    ChildRelationships: ChildRelationships$ContentWorkspace;
  }

type Fields$ContentWorkspaceDoc = {
  //
  Id: string;
  ContentWorkspaceId: string;
  ContentDocumentId: string;
  CreatedDate: DateString;
  SystemModstamp: DateString;
  IsOwner: boolean;
  IsDeleted: boolean;
};

type ParentReferences$ContentWorkspaceDoc = {
  //
  ContentWorkspace: SObjectDefinition$ContentWorkspace;
  ContentDocument: SObjectDefinition$ContentDocument;
};

type ChildRelationships$ContentWorkspaceDoc = {
  //
};

interface SObjectDefinition$ContentWorkspaceDoc extends SObjectDefinition<'ContentWorkspaceDoc'> {
    Name: 'ContentWorkspaceDoc';
    Fields: Fields$ContentWorkspaceDoc;
    ParentReferences: ParentReferences$ContentWorkspaceDoc;
    ChildRelationships: ChildRelationships$ContentWorkspaceDoc;
  }

type Fields$ContentWorkspaceMember = {
  //
  Id: string;
  ContentWorkspaceId: string;
  ContentWorkspacePermissionId: string | null;
  MemberId: string;
  MemberType: string | null;
  CreatedById: string;
  CreatedDate: DateString;
};

type ParentReferences$ContentWorkspaceMember = {
  //
  ContentWorkspace: SObjectDefinition$ContentWorkspace;
  ContentWorkspacePermission: SObjectDefinition$ContentWorkspacePermission | null;
  Member: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentWorkspaceMember = {
  //
};

interface SObjectDefinition$ContentWorkspaceMember extends SObjectDefinition<'ContentWorkspaceMember'> {
    Name: 'ContentWorkspaceMember';
    Fields: Fields$ContentWorkspaceMember;
    ParentReferences: ParentReferences$ContentWorkspaceMember;
    ChildRelationships: ChildRelationships$ContentWorkspaceMember;
  }

type Fields$ContentWorkspacePermission = {
  //
  Id: string;
  Name: string;
  Type: string | null;
  PermissionsManageWorkspace: boolean;
  PermissionsAddContent: boolean;
  PermissionsAddContentOBO: boolean;
  PermissionsArchiveContent: boolean;
  PermissionsDeleteContent: boolean;
  PermissionsFeatureContent: boolean;
  PermissionsViewComments: boolean;
  PermissionsAddComment: boolean;
  PermissionsModifyComments: boolean;
  PermissionsTagContent: boolean;
  PermissionsDeliverContent: boolean;
  PermissionsChatterSharing: boolean;
  PermissionsOrganizeFileAndFolder: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  LastModifiedById: string;
  Description: string | null;
};

type ParentReferences$ContentWorkspacePermission = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentWorkspacePermission = {
  //
};

interface SObjectDefinition$ContentWorkspacePermission extends SObjectDefinition<'ContentWorkspacePermission'> {
    Name: 'ContentWorkspacePermission';
    Fields: Fields$ContentWorkspacePermission;
    ParentReferences: ParentReferences$ContentWorkspacePermission;
    ChildRelationships: ChildRelationships$ContentWorkspacePermission;
  }

type Fields$ContentWorkspaceSubscription = {
  //
  Id: string;
  UserId: string;
  ContentWorkspaceId: string;
};

type ParentReferences$ContentWorkspaceSubscription = {
  //
  User: SObjectDefinition$User;
  ContentWorkspace: SObjectDefinition$ContentWorkspace;
};

type ChildRelationships$ContentWorkspaceSubscription = {
  //
};

interface SObjectDefinition$ContentWorkspaceSubscription extends SObjectDefinition<'ContentWorkspaceSubscription'> {
    Name: 'ContentWorkspaceSubscription';
    Fields: Fields$ContentWorkspaceSubscription;
    ParentReferences: ParentReferences$ContentWorkspaceSubscription;
    ChildRelationships: ChildRelationships$ContentWorkspaceSubscription;
  }

type Fields$Contract = {
  //
  Id: string;
  AccountId: string;
  CurrencyIsoCode: string | null;
  Pricebook2Id: string | null;
  OwnerExpirationNotice: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  BillingStreet: string | null;
  BillingCity: string | null;
  BillingState: string | null;
  BillingPostalCode: string | null;
  BillingCountry: string | null;
  BillingLatitude: number | null;
  BillingLongitude: number | null;
  BillingGeocodeAccuracy: string | null;
  BillingAddress: Address | null;
  ContractTerm: number | null;
  OwnerId: string;
  Status: string;
  CompanySignedId: string | null;
  CompanySignedDate: DateString | null;
  CustomerSignedId: string | null;
  CustomerSignedTitle: string | null;
  CustomerSignedDate: DateString | null;
  SpecialTerms: string | null;
  ActivatedById: string | null;
  ActivatedDate: DateString | null;
  StatusCode: string;
  Description: string | null;
  IsDeleted: boolean;
  ContractNumber: string;
  LastApprovedDate: DateString | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Contract = {
  //
  Account: SObjectDefinition$Account;
  Pricebook2: SObjectDefinition$Pricebook2 | null;
  Owner: SObjectDefinition$User;
  CompanySigned: SObjectDefinition$User | null;
  CustomerSigned: SObjectDefinition$Contact | null;
  ActivatedBy: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Contract = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContractContactRoles: SObjectDefinition$ContractContactRole;
  Feeds: SObjectDefinition$ContractFeed;
  Histories: SObjectDefinition$ContractHistory;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  Orders: SObjectDefinition$Order;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Contract extends SObjectDefinition<'Contract'> {
    Name: 'Contract';
    Fields: Fields$Contract;
    ParentReferences: ParentReferences$Contract;
    ChildRelationships: ChildRelationships$Contract;
  }

type Fields$ContractContactRole = {
  //
  Id: string;
  ContractId: string;
  ContactId: string;
  Role: string | null;
  IsPrimary: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$ContractContactRole = {
  //
  Contract: SObjectDefinition$Contract;
  Contact: SObjectDefinition$Contact;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContractContactRole = {
  //
};

interface SObjectDefinition$ContractContactRole extends SObjectDefinition<'ContractContactRole'> {
    Name: 'ContractContactRole';
    Fields: Fields$ContractContactRole;
    ParentReferences: ParentReferences$ContractContactRole;
    ChildRelationships: ChildRelationships$ContractContactRole;
  }

type Fields$ContractFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ContractFeed = {
  //
  Parent: SObjectDefinition$Contract;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ContractFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ContractFeed extends SObjectDefinition<'ContractFeed'> {
    Name: 'ContractFeed';
    Fields: Fields$ContractFeed;
    ParentReferences: ParentReferences$ContractFeed;
    ChildRelationships: ChildRelationships$ContractFeed;
  }

type Fields$ContractHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ContractId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ContractHistory = {
  //
  Contract: SObjectDefinition$Contract;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContractHistory = {
  //
};

interface SObjectDefinition$ContractHistory extends SObjectDefinition<'ContractHistory'> {
    Name: 'ContractHistory';
    Fields: Fields$ContractHistory;
    ParentReferences: ParentReferences$ContractHistory;
    ChildRelationships: ChildRelationships$ContractHistory;
  }

type Fields$ContractStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  StatusCode: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$ContractStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContractStatus = {
  //
};

interface SObjectDefinition$ContractStatus extends SObjectDefinition<'ContractStatus'> {
    Name: 'ContractStatus';
    Fields: Fields$ContractStatus;
    ParentReferences: ParentReferences$ContractStatus;
    ChildRelationships: ChildRelationships$ContractStatus;
  }

type Fields$CorsWhitelistEntry = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UrlPattern: string;
};

type ParentReferences$CorsWhitelistEntry = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CorsWhitelistEntry = {
  //
};

interface SObjectDefinition$CorsWhitelistEntry extends SObjectDefinition<'CorsWhitelistEntry'> {
    Name: 'CorsWhitelistEntry';
    Fields: Fields$CorsWhitelistEntry;
    ParentReferences: ParentReferences$CorsWhitelistEntry;
    ChildRelationships: ChildRelationships$CorsWhitelistEntry;
  }

type Fields$CronJobDetail = {
  //
  Id: string;
  Name: string;
  JobType: string | null;
};

type ParentReferences$CronJobDetail = {
  //
};

type ChildRelationships$CronJobDetail = {
  //
};

interface SObjectDefinition$CronJobDetail extends SObjectDefinition<'CronJobDetail'> {
    Name: 'CronJobDetail';
    Fields: Fields$CronJobDetail;
    ParentReferences: ParentReferences$CronJobDetail;
    ChildRelationships: ChildRelationships$CronJobDetail;
  }

type Fields$CronTrigger = {
  //
  Id: string;
  CronJobDetailId: string | null;
  NextFireTime: DateString | null;
  PreviousFireTime: DateString | null;
  State: string | null;
  StartTime: DateString | null;
  EndTime: DateString | null;
  CronExpression: string | null;
  TimeZoneSidKey: string | null;
  OwnerId: string | null;
  LastModifiedById: string;
  CreatedById: string;
  CreatedDate: DateString;
  TimesTriggered: number | null;
};

type ParentReferences$CronTrigger = {
  //
  CronJobDetail: SObjectDefinition$CronJobDetail | null;
  LastModifiedBy: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$CronTrigger = {
  //
};

interface SObjectDefinition$CronTrigger extends SObjectDefinition<'CronTrigger'> {
    Name: 'CronTrigger';
    Fields: Fields$CronTrigger;
    ParentReferences: ParentReferences$CronTrigger;
    ChildRelationships: ChildRelationships$CronTrigger;
  }

type Fields$CspTrustedSite = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  EndpointUrl: string;
  Description: string | null;
  IsActive: boolean;
};

type ParentReferences$CspTrustedSite = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CspTrustedSite = {
  //
};

interface SObjectDefinition$CspTrustedSite extends SObjectDefinition<'CspTrustedSite'> {
    Name: 'CspTrustedSite';
    Fields: Fields$CspTrustedSite;
    ParentReferences: ParentReferences$CspTrustedSite;
    ChildRelationships: ChildRelationships$CspTrustedSite;
  }

type Fields$CurrencyType = {
  //
  Id: string;
  IsoCode: string;
  ConversionRate: number;
  DecimalPlaces: number;
  IsActive: boolean;
  IsCorporate: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$CurrencyType = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CurrencyType = {
  //
};

interface SObjectDefinition$CurrencyType extends SObjectDefinition<'CurrencyType'> {
    Name: 'CurrencyType';
    Fields: Fields$CurrencyType;
    ParentReferences: ParentReferences$CurrencyType;
    ChildRelationships: ChildRelationships$CurrencyType;
  }

type Fields$CustomBrand = {
  //
  Id: string;
  ParentId: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$CustomBrand = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CustomBrand = {
  //
  CustomBrandAssets: SObjectDefinition$CustomBrandAsset;
};

interface SObjectDefinition$CustomBrand extends SObjectDefinition<'CustomBrand'> {
    Name: 'CustomBrand';
    Fields: Fields$CustomBrand;
    ParentReferences: ParentReferences$CustomBrand;
    ChildRelationships: ChildRelationships$CustomBrand;
  }

type Fields$CustomBrandAsset = {
  //
  Id: string;
  CustomBrandId: string;
  AssetCategory: string;
  TextAsset: string | null;
  AssetSourceId: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$CustomBrandAsset = {
  //
  CustomBrand: SObjectDefinition$CustomBrand;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CustomBrandAsset = {
  //
};

interface SObjectDefinition$CustomBrandAsset extends SObjectDefinition<'CustomBrandAsset'> {
    Name: 'CustomBrandAsset';
    Fields: Fields$CustomBrandAsset;
    ParentReferences: ParentReferences$CustomBrandAsset;
    ChildRelationships: ChildRelationships$CustomBrandAsset;
  }

type Fields$CustomHttpHeader = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  HeaderFieldName: string;
  HeaderFieldValue: string;
  IsActive: boolean;
  Description: string | null;
};

type ParentReferences$CustomHttpHeader = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$Name;
};

type ChildRelationships$CustomHttpHeader = {
  //
};

interface SObjectDefinition$CustomHttpHeader extends SObjectDefinition<'CustomHttpHeader'> {
    Name: 'CustomHttpHeader';
    Fields: Fields$CustomHttpHeader;
    ParentReferences: ParentReferences$CustomHttpHeader;
    ChildRelationships: ChildRelationships$CustomHttpHeader;
  }

type Fields$CustomObjectUserLicenseMetrics = {
  //
  Id: string;
  MetricsDate: DateString;
  UserLicenseId: string;
  CustomObjectId: string | null;
  SystemModstamp: DateString;
  CustomObjectType: string | null;
  CustomObjectName: string | null;
  ObjectCount: number | null;
};

type ParentReferences$CustomObjectUserLicenseMetrics = {
  //
  UserLicense: SObjectDefinition$UserLicense;
};

type ChildRelationships$CustomObjectUserLicenseMetrics = {
  //
};

interface SObjectDefinition$CustomObjectUserLicenseMetrics extends SObjectDefinition<'CustomObjectUserLicenseMetrics'> {
    Name: 'CustomObjectUserLicenseMetrics';
    Fields: Fields$CustomObjectUserLicenseMetrics;
    ParentReferences: ParentReferences$CustomObjectUserLicenseMetrics;
    ChildRelationships: ChildRelationships$CustomObjectUserLicenseMetrics;
  }

type Fields$CustomPermission = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  IsProtected: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
};

type ParentReferences$CustomPermission = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CustomPermission = {
  //
  CustomPermissionItem: SObjectDefinition$CustomPermissionDependency;
  CustomPermissionDependencyItem: SObjectDefinition$CustomPermissionDependency;
  GrantedByLicenses: SObjectDefinition$GrantedByLicense;
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$CustomPermission extends SObjectDefinition<'CustomPermission'> {
    Name: 'CustomPermission';
    Fields: Fields$CustomPermission;
    ParentReferences: ParentReferences$CustomPermission;
    ChildRelationships: ChildRelationships$CustomPermission;
  }

type Fields$CustomPermissionDependency = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CustomPermissionId: string;
  RequiredCustomPermissionId: string;
};

type ParentReferences$CustomPermissionDependency = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  CustomPermission: SObjectDefinition$CustomPermission;
  RequiredCustomPermission: SObjectDefinition$CustomPermission;
};

type ChildRelationships$CustomPermissionDependency = {
  //
};

interface SObjectDefinition$CustomPermissionDependency extends SObjectDefinition<'CustomPermissionDependency'> {
    Name: 'CustomPermissionDependency';
    Fields: Fields$CustomPermissionDependency;
    ParentReferences: ParentReferences$CustomPermissionDependency;
    ChildRelationships: ChildRelationships$CustomPermissionDependency;
  }

type Fields$DailyManhourAssignment__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  ResourceAssignment__c: string | null;
  Manhours__c: number | null;
  TargetDate__c: DateString | null;
};

type ParentReferences$DailyManhourAssignment__ChangeEvent = {
  //
};

type ChildRelationships$DailyManhourAssignment__ChangeEvent = {
  //
};

interface SObjectDefinition$DailyManhourAssignment__ChangeEvent extends SObjectDefinition<'DailyManhourAssignment__ChangeEvent'> {
    Name: 'DailyManhourAssignment__ChangeEvent';
    Fields: Fields$DailyManhourAssignment__ChangeEvent;
    ParentReferences: ParentReferences$DailyManhourAssignment__ChangeEvent;
    ChildRelationships: ChildRelationships$DailyManhourAssignment__ChangeEvent;
  }

type Fields$DailyManhourAssignment__c = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ResourceAssignment__c: string;
  Manhours__c: number | null;
  TargetDate__c: DateString;
};

type ParentReferences$DailyManhourAssignment__c = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ResourceAssignment__r: SObjectDefinition$ResourceAssignment__c;
};

type ChildRelationships$DailyManhourAssignment__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$DailyManhourAssignment__c extends SObjectDefinition<'DailyManhourAssignment__c'> {
    Name: 'DailyManhourAssignment__c';
    Fields: Fields$DailyManhourAssignment__c;
    ParentReferences: ParentReferences$DailyManhourAssignment__c;
    ChildRelationships: ChildRelationships$DailyManhourAssignment__c;
  }

type Fields$DandBCompany = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  DunsNumber: string;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  GeocodeAccuracyStandard: string | null;
  Address: Address | null;
  Phone: string | null;
  Fax: string | null;
  CountryAccessCode: string | null;
  PublicIndicator: string | null;
  StockSymbol: string | null;
  StockExchange: string | null;
  SalesVolume: number | null;
  URL: string | null;
  OutOfBusiness: string | null;
  EmployeesTotal: number | null;
  FipsMsaCode: string | null;
  FipsMsaDesc: string | null;
  TradeStyle1: string | null;
  YearStarted: string | null;
  MailingStreet: string | null;
  MailingCity: string | null;
  MailingState: string | null;
  MailingPostalCode: string | null;
  MailingCountry: string | null;
  MailingGeocodeAccuracy: string | null;
  MailingAddress: Address | null;
  Latitude: string | null;
  Longitude: string | null;
  PrimarySic: string | null;
  PrimarySicDesc: string | null;
  SecondSic: string | null;
  SecondSicDesc: string | null;
  ThirdSic: string | null;
  ThirdSicDesc: string | null;
  FourthSic: string | null;
  FourthSicDesc: string | null;
  FifthSic: string | null;
  FifthSicDesc: string | null;
  SixthSic: string | null;
  SixthSicDesc: string | null;
  PrimaryNaics: string | null;
  PrimaryNaicsDesc: string | null;
  SecondNaics: string | null;
  SecondNaicsDesc: string | null;
  ThirdNaics: string | null;
  ThirdNaicsDesc: string | null;
  FourthNaics: string | null;
  FourthNaicsDesc: string | null;
  FifthNaics: string | null;
  FifthNaicsDesc: string | null;
  SixthNaics: string | null;
  SixthNaicsDesc: string | null;
  OwnOrRent: string | null;
  EmployeesHere: number | null;
  EmployeesHereReliability: string | null;
  SalesVolumeReliability: string | null;
  CurrencyCode: string | null;
  LegalStatus: string | null;
  GlobalUltimateTotalEmployees: number | null;
  EmployeesTotalReliability: string | null;
  MinorityOwned: string | null;
  WomenOwned: string | null;
  SmallBusiness: string | null;
  MarketingSegmentationCluster: string | null;
  ImportExportAgent: string | null;
  Subsidiary: string | null;
  TradeStyle2: string | null;
  TradeStyle3: string | null;
  TradeStyle4: string | null;
  TradeStyle5: string | null;
  NationalId: string | null;
  NationalIdType: string | null;
  UsTaxId: string | null;
  GeoCodeAccuracy: string | null;
  FamilyMembers: number | null;
  MarketingPreScreen: string | null;
  GlobalUltimateDunsNumber: string | null;
  GlobalUltimateBusinessName: string | null;
  ParentOrHqDunsNumber: string | null;
  ParentOrHqBusinessName: string | null;
  DomesticUltimateDunsNumber: string | null;
  DomesticUltimateBusinessName: string | null;
  LocationStatus: string | null;
  CompanyCurrencyIsoCode: string | null;
  Description: string | null;
  FortuneRank: number | null;
  IncludedInSnP500: string | null;
  PremisesMeasure: number | null;
  PremisesMeasureReliability: string | null;
  PremisesMeasureUnit: string | null;
  EmployeeQuantityGrowthRate: number | null;
  SalesTurnoverGrowthRate: number | null;
  PrimarySic8: string | null;
  PrimarySic8Desc: string | null;
  SecondSic8: string | null;
  SecondSic8Desc: string | null;
  ThirdSic8: string | null;
  ThirdSic8Desc: string | null;
  FourthSic8: string | null;
  FourthSic8Desc: string | null;
  FifthSic8: string | null;
  FifthSic8Desc: string | null;
  SixthSic8: string | null;
  SixthSic8Desc: string | null;
  PriorYearEmployees: number | null;
  PriorYearRevenue: number | null;
};

type ParentReferences$DandBCompany = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DandBCompany = {
  //
  Accounts: SObjectDefinition$Account;
  Leads: SObjectDefinition$Lead;
};

interface SObjectDefinition$DandBCompany extends SObjectDefinition<'DandBCompany'> {
    Name: 'DandBCompany';
    Fields: Fields$DandBCompany;
    ParentReferences: ParentReferences$DandBCompany;
    ChildRelationships: ChildRelationships$DandBCompany;
  }

type Fields$Dashboard = {
  //
  Id: string;
  IsDeleted: boolean;
  FolderId: string;
  FolderName: string | null;
  Title: string;
  DeveloperName: string;
  NamespacePrefix: string | null;
  Description: string | null;
  LeftSize: string;
  MiddleSize: string | null;
  RightSize: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  RunningUserId: string;
  TitleColor: number;
  TitleSize: number;
  TextColor: number;
  BackgroundStart: number;
  BackgroundEnd: number;
  BackgroundDirection: string;
  Type: string;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  DashboardResultRefreshedDate: string | null;
  DashboardResultRunningUser: string | null;
  ColorPalette: string | null;
  ChartTheme: string | null;
};

type ParentReferences$Dashboard = {
  //
  Folder: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  RunningUser: SObjectDefinition$User;
};

type ChildRelationships$Dashboard = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DashboardComponents: SObjectDefinition$DashboardComponent;
  Feeds: SObjectDefinition$DashboardFeed;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
};

interface SObjectDefinition$Dashboard extends SObjectDefinition<'Dashboard'> {
    Name: 'Dashboard';
    Fields: Fields$Dashboard;
    ParentReferences: ParentReferences$Dashboard;
    ChildRelationships: ChildRelationships$Dashboard;
  }

type Fields$DashboardComponent = {
  //
  Id: string;
  Name: string | null;
  DashboardId: string;
  CustomReportId: string | null;
};

type ParentReferences$DashboardComponent = {
  //
  Dashboard: SObjectDefinition$Dashboard;
};

type ChildRelationships$DashboardComponent = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Feeds: SObjectDefinition$DashboardComponentFeed;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
};

interface SObjectDefinition$DashboardComponent extends SObjectDefinition<'DashboardComponent'> {
    Name: 'DashboardComponent';
    Fields: Fields$DashboardComponent;
    ParentReferences: ParentReferences$DashboardComponent;
    ChildRelationships: ChildRelationships$DashboardComponent;
  }

type Fields$DashboardComponentFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$DashboardComponentFeed = {
  //
  Parent: SObjectDefinition$DashboardComponent;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$DashboardComponentFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$DashboardComponentFeed extends SObjectDefinition<'DashboardComponentFeed'> {
    Name: 'DashboardComponentFeed';
    Fields: Fields$DashboardComponentFeed;
    ParentReferences: ParentReferences$DashboardComponentFeed;
    ChildRelationships: ChildRelationships$DashboardComponentFeed;
  }

type Fields$DashboardFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$DashboardFeed = {
  //
  Parent: SObjectDefinition$Dashboard;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$DashboardFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$DashboardFeed extends SObjectDefinition<'DashboardFeed'> {
    Name: 'DashboardFeed';
    Fields: Fields$DashboardFeed;
    ParentReferences: ParentReferences$DashboardFeed;
    ChildRelationships: ChildRelationships$DashboardFeed;
  }

type Fields$DataAssessmentFieldMetric = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DataAssessmentMetricId: string;
  FieldName: string | null;
  NumMatchedInSync: number | null;
  NumMatchedDifferent: number | null;
  NumMatchedBlanks: number | null;
  NumUnmatchedBlanks: number | null;
};

type ParentReferences$DataAssessmentFieldMetric = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DataAssessmentMetric: SObjectDefinition$DataAssessmentMetric;
};

type ChildRelationships$DataAssessmentFieldMetric = {
  //
  DataAssessmentValueMetrics: SObjectDefinition$DataAssessmentValueMetric;
};

interface SObjectDefinition$DataAssessmentFieldMetric extends SObjectDefinition<'DataAssessmentFieldMetric'> {
    Name: 'DataAssessmentFieldMetric';
    Fields: Fields$DataAssessmentFieldMetric;
    ParentReferences: ParentReferences$DataAssessmentFieldMetric;
    ChildRelationships: ChildRelationships$DataAssessmentFieldMetric;
  }

type Fields$DataAssessmentMetric = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  NumTotal: number | null;
  NumProcessed: number | null;
  NumMatched: number | null;
  NumMatchedDifferent: number | null;
  NumUnmatched: number | null;
  NumDuplicates: number | null;
};

type ParentReferences$DataAssessmentMetric = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DataAssessmentMetric = {
  //
  DataAssessmentMetrics: SObjectDefinition$DataAssessmentFieldMetric;
};

interface SObjectDefinition$DataAssessmentMetric extends SObjectDefinition<'DataAssessmentMetric'> {
    Name: 'DataAssessmentMetric';
    Fields: Fields$DataAssessmentMetric;
    ParentReferences: ParentReferences$DataAssessmentMetric;
    ChildRelationships: ChildRelationships$DataAssessmentMetric;
  }

type Fields$DataAssessmentValueMetric = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DataAssessmentFieldMetricId: string;
  FieldValue: string | null;
  ValueCount: number | null;
};

type ParentReferences$DataAssessmentValueMetric = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DataAssessmentFieldMetric: SObjectDefinition$DataAssessmentFieldMetric;
};

type ChildRelationships$DataAssessmentValueMetric = {
  //
};

interface SObjectDefinition$DataAssessmentValueMetric extends SObjectDefinition<'DataAssessmentValueMetric'> {
    Name: 'DataAssessmentValueMetric';
    Fields: Fields$DataAssessmentValueMetric;
    ParentReferences: ParentReferences$DataAssessmentValueMetric;
    ChildRelationships: ChildRelationships$DataAssessmentValueMetric;
  }

type Fields$DataStatistics = {
  //
  Id: string;
  ExternalId: string | null;
  StatType: string | null;
  UserId: string | null;
  Type: string | null;
  StatValue: number | null;
};

type ParentReferences$DataStatistics = {
  //
  User: SObjectDefinition$User | null;
};

type ChildRelationships$DataStatistics = {
  //
};

interface SObjectDefinition$DataStatistics extends SObjectDefinition<'DataStatistics'> {
    Name: 'DataStatistics';
    Fields: Fields$DataStatistics;
    ParentReferences: ParentReferences$DataStatistics;
    ChildRelationships: ChildRelationships$DataStatistics;
  }

type Fields$DataType = {
  //
  Id: string;
  DurableId: string | null;
  DeveloperName: string | null;
  IsComplex: boolean;
  ContextServiceDataTypeId: string | null;
  ContextWsdlDataTypeId: string | null;
};

type ParentReferences$DataType = {
  //
};

type ChildRelationships$DataType = {
  //
};

interface SObjectDefinition$DataType extends SObjectDefinition<'DataType'> {
    Name: 'DataType';
    Fields: Fields$DataType;
    ParentReferences: ParentReferences$DataType;
    ChildRelationships: ChildRelationships$DataType;
  }

type Fields$DatacloudAddress = {
  //
  Id: string;
  CurrencyIsoCode: string;
  ExternalId: string | null;
  AddressLine1: string | null;
  AddressLine2: string | null;
  City: string | null;
  State: string | null;
  Country: string | null;
  PostalCode: string | null;
  Latitude: string | null;
  Longitude: string | null;
  GeoAccuracyCode: string | null;
  GeoAccuracyNum: string | null;
};

type ParentReferences$DatacloudAddress = {
  //
};

type ChildRelationships$DatacloudAddress = {
  //
};

interface SObjectDefinition$DatacloudAddress extends SObjectDefinition<'DatacloudAddress'> {
    Name: 'DatacloudAddress';
    Fields: Fields$DatacloudAddress;
    ParentReferences: ParentReferences$DatacloudAddress;
    ChildRelationships: ChildRelationships$DatacloudAddress;
  }

type Fields$DatacloudCompany = {
  //
  Id: string;
  CurrencyIsoCode: string;
  ExternalId: string | null;
  CompanyId: string | null;
  Name: string | null;
  Description: string | null;
  IsInactive: boolean;
  Phone: string | null;
  Fax: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  StateCode: string | null;
  Country: string | null;
  CountryCode: string | null;
  Zip: string | null;
  Site: string | null;
  Industry: string | null;
  NumberOfEmployees: number | null;
  AnnualRevenue: number | null;
  DunsNumber: string | null;
  NaicsCode: string | null;
  NaicsDesc: string | null;
  Sic: string | null;
  SicDesc: string | null;
  Ownership: string | null;
  IsOwned: boolean;
  TickerSymbol: string | null;
  TradeStyle: string | null;
  Website: string | null;
  YearStarted: string | null;
  ActiveContacts: number | null;
  UpdatedDate: DateString | null;
  FortuneRank: number | null;
  IncludedInSnP500: string | null;
  PremisesMeasure: number | null;
  PremisesMeasureReliability: string | null;
  PremisesMeasureUnit: string | null;
  EmployeeQuantityGrowthRate: number | null;
  SalesTurnoverGrowthRate: number | null;
  PriorYearEmployees: number | null;
  PriorYearRevenue: number | null;
  IsInCrm: boolean;
  FullAddress: string | null;
  SicCodeDesc: string | null;
};

type ParentReferences$DatacloudCompany = {
  //
};

type ChildRelationships$DatacloudCompany = {
  //
};

interface SObjectDefinition$DatacloudCompany extends SObjectDefinition<'DatacloudCompany'> {
    Name: 'DatacloudCompany';
    Fields: Fields$DatacloudCompany;
    ParentReferences: ParentReferences$DatacloudCompany;
    ChildRelationships: ChildRelationships$DatacloudCompany;
  }

type Fields$DatacloudContact = {
  //
  Id: string;
  CurrencyIsoCode: string;
  ExternalId: string | null;
  CompanyId: string | null;
  ContactId: string | null;
  CompanyName: string;
  Title: string | null;
  IsInactive: boolean;
  FirstName: string | null;
  LastName: string | null;
  Phone: string | null;
  Email: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  Country: string | null;
  Zip: string | null;
  Department: string | null;
  Level: string | null;
  IsOwned: boolean;
  UpdatedDate: DateString | null;
  IsInCrm: boolean;
};

type ParentReferences$DatacloudContact = {
  //
};

type ChildRelationships$DatacloudContact = {
  //
};

interface SObjectDefinition$DatacloudContact extends SObjectDefinition<'DatacloudContact'> {
    Name: 'DatacloudContact';
    Fields: Fields$DatacloudContact;
    ParentReferences: ParentReferences$DatacloudContact;
    ChildRelationships: ChildRelationships$DatacloudContact;
  }

type Fields$DatacloudDandBCompany = {
  //
  Id: string;
  CurrencyIsoCode: string;
  ExternalId: string | null;
  Name: string | null;
  DunsNumber: string | null;
  CompanyId: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  StateCode: string | null;
  Country: string | null;
  CountryCode: string | null;
  Zip: string | null;
  Phone: string | null;
  Fax: string | null;
  CountryAccessCode: string | null;
  PublicIndicator: string | null;
  StockSymbol: string | null;
  StockExchange: string | null;
  SalesVolume: number | null;
  URL: string | null;
  OutOfBusiness: string | null;
  EmployeesTotal: number | null;
  FipsMsaCode: string | null;
  FipsMsaDesc: string | null;
  TradeStyle1: string | null;
  YearStarted: string | null;
  MailingStreet: string | null;
  MailingCity: string | null;
  MailingState: string | null;
  MailingStateCode: string | null;
  MailingCountry: string | null;
  MailingCountryCode: string | null;
  MailingZip: string | null;
  Latitude: string | null;
  Longitude: string | null;
  PrimarySic: string | null;
  PrimarySicDesc: string | null;
  SecondSic: string | null;
  SecondSicDesc: string | null;
  ThirdSic: string | null;
  ThirdSicDesc: string | null;
  FourthSic: string | null;
  FourthSicDesc: string | null;
  FifthSic: string | null;
  FifthSicDesc: string | null;
  SixthSic: string | null;
  SixthSicDesc: string | null;
  PrimaryNaics: string | null;
  PrimaryNaicsDesc: string | null;
  SecondNaics: string | null;
  SecondNaicsDesc: string | null;
  ThirdNaics: string | null;
  ThirdNaicsDesc: string | null;
  FourthNaics: string | null;
  FourthNaicsDesc: string | null;
  FifthNaics: string | null;
  FifthNaicsDesc: string | null;
  SixthNaics: string | null;
  SixthNaicsDesc: string | null;
  OwnOrRent: string | null;
  EmployeesHere: number | null;
  EmployeesHereReliability: string | null;
  SalesVolumeReliability: string | null;
  CurrencyCode: string | null;
  LegalStatus: string | null;
  GlobalUltimateTotalEmployees: number | null;
  EmployeesTotalReliability: string | null;
  MinorityOwned: string | null;
  WomenOwned: string | null;
  SmallBusiness: string | null;
  MarketingSegmentationCluster: string | null;
  ImportExportAgent: string | null;
  Subsidiary: string | null;
  TradeStyle2: string | null;
  TradeStyle3: string | null;
  TradeStyle4: string | null;
  TradeStyle5: string | null;
  NationalId: string | null;
  NationalIdType: string | null;
  UsTaxId: string | null;
  GeoCodeAccuracy: string | null;
  FamilyMembers: number | null;
  MarketingPreScreen: string | null;
  GlobalUltimateDunsNumber: string | null;
  GlobalUltimateBusinessName: string | null;
  ParentOrHqDunsNumber: string | null;
  ParentOrHqBusinessName: string | null;
  DomesticUltimateDunsNumber: string | null;
  DomesticUltimateBusinessName: string | null;
  LocationStatus: string | null;
  CompanyCurrencyIsoCode: string | null;
  Description: string | null;
  IsOwned: boolean;
  IsParent: boolean;
  FortuneRank: number | null;
  IncludedInSnP500: string | null;
  PremisesMeasure: number | null;
  PremisesMeasureReliability: string | null;
  PremisesMeasureUnit: string | null;
  EmployeeQuantityGrowthRate: number | null;
  SalesTurnoverGrowthRate: number | null;
  PrimarySic8: string | null;
  PrimarySic8Desc: string | null;
  SecondSic8: string | null;
  SecondSic8Desc: string | null;
  ThirdSic8: string | null;
  ThirdSic8Desc: string | null;
  FourthSic8: string | null;
  FourthSic8Desc: string | null;
  FifthSic8: string | null;
  FifthSic8Desc: string | null;
  SixthSic8: string | null;
  SixthSic8Desc: string | null;
  PriorYearEmployees: number | null;
  PriorYearRevenue: number | null;
  Industry: string | null;
  Revenue: number | null;
  IsInCrm: boolean;
  FullAddress: string | null;
  SicCodeDesc: string | null;
};

type ParentReferences$DatacloudDandBCompany = {
  //
};

type ChildRelationships$DatacloudDandBCompany = {
  //
};

interface SObjectDefinition$DatacloudDandBCompany extends SObjectDefinition<'DatacloudDandBCompany'> {
    Name: 'DatacloudDandBCompany';
    Fields: Fields$DatacloudDandBCompany;
    ParentReferences: ParentReferences$DatacloudDandBCompany;
    ChildRelationships: ChildRelationships$DatacloudDandBCompany;
  }

type Fields$DatacloudOwnedEntity = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DataDotComKey: string;
  DatacloudEntityType: string;
  UserId: string;
  PurchaseUsageId: string | null;
  PurchaseType: string | null;
};

type ParentReferences$DatacloudOwnedEntity = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
  PurchaseUsage: SObjectDefinition$DatacloudPurchaseUsage | null;
};

type ChildRelationships$DatacloudOwnedEntity = {
  //
};

interface SObjectDefinition$DatacloudOwnedEntity extends SObjectDefinition<'DatacloudOwnedEntity'> {
    Name: 'DatacloudOwnedEntity';
    Fields: Fields$DatacloudOwnedEntity;
    ParentReferences: ParentReferences$DatacloudOwnedEntity;
    ChildRelationships: ChildRelationships$DatacloudOwnedEntity;
  }

type Fields$DatacloudPurchaseUsage = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserId: string;
  UserType: string;
  PurchaseType: string;
  DatacloudEntityType: string;
  Usage: number;
  Description: string | null;
};

type ParentReferences$DatacloudPurchaseUsage = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
};

type ChildRelationships$DatacloudPurchaseUsage = {
  //
};

interface SObjectDefinition$DatacloudPurchaseUsage extends SObjectDefinition<'DatacloudPurchaseUsage'> {
    Name: 'DatacloudPurchaseUsage';
    Fields: Fields$DatacloudPurchaseUsage;
    ParentReferences: ParentReferences$DatacloudPurchaseUsage;
    ChildRelationships: ChildRelationships$DatacloudPurchaseUsage;
  }

type Fields$DatasetExport = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PublisherType: string;
  MetadataLength: number | null;
  CompressedMetadataLength: number | null;
  Status: string;
  Owner: string | null;
  PublisherInfo: string;
  Metadata: BlobString | null;
};

type ParentReferences$DatasetExport = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DatasetExport = {
  //
  DatasetExportParts: SObjectDefinition$DatasetExportPart;
};

interface SObjectDefinition$DatasetExport extends SObjectDefinition<'DatasetExport'> {
    Name: 'DatasetExport';
    Fields: Fields$DatasetExport;
    ParentReferences: ParentReferences$DatasetExport;
    ChildRelationships: ChildRelationships$DatasetExport;
  }

type Fields$DatasetExportEvent = {
  //
  ReplayId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  DataflowInstanceId: string | null;
  DatasetExportId: string | null;
  Owner: string | null;
  Status: string | null;
  Message: string | null;
  PublisherType: string | null;
  PublisherInfo: string | null;
};

type ParentReferences$DatasetExportEvent = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$DatasetExportEvent = {
  //
};

interface SObjectDefinition$DatasetExportEvent extends SObjectDefinition<'DatasetExportEvent'> {
    Name: 'DatasetExportEvent';
    Fields: Fields$DatasetExportEvent;
    ParentReferences: ParentReferences$DatasetExportEvent;
    ChildRelationships: ChildRelationships$DatasetExportEvent;
  }

type Fields$DatasetExportPart = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DatasetExportId: string;
  DataFileLength: number;
  CompressedDataFileLength: number;
  PartNumber: number;
  Owner: string;
  DataFile: BlobString;
};

type ParentReferences$DatasetExportPart = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DatasetExport: SObjectDefinition$DatasetExport;
};

type ChildRelationships$DatasetExportPart = {
  //
};

interface SObjectDefinition$DatasetExportPart extends SObjectDefinition<'DatasetExportPart'> {
    Name: 'DatasetExportPart';
    Fields: Fields$DatasetExportPart;
    ParentReferences: ParentReferences$DatasetExportPart;
    ChildRelationships: ChildRelationships$DatasetExportPart;
  }

type Fields$DatedConversionRate = {
  //
  Id: string;
  IsoCode: string;
  StartDate: DateString;
  NextStartDate: DateString | null;
  ConversionRate: number;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$DatedConversionRate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DatedConversionRate = {
  //
};

interface SObjectDefinition$DatedConversionRate extends SObjectDefinition<'DatedConversionRate'> {
    Name: 'DatedConversionRate';
    Fields: Fields$DatedConversionRate;
    ParentReferences: ParentReferences$DatedConversionRate;
    ChildRelationships: ChildRelationships$DatedConversionRate;
  }

type Fields$DeclinedEventRelation = {
  //
  Id: string;
  RelationId: string | null;
  EventId: string | null;
  RespondedDate: DateString | null;
  Response: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  Type: string | null;
};

type ParentReferences$DeclinedEventRelation = {
  //
  Relation: SObjectDefinition$Name | null;
  Event: SObjectDefinition$Event | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DeclinedEventRelation = {
  //
};

interface SObjectDefinition$DeclinedEventRelation extends SObjectDefinition<'DeclinedEventRelation'> {
    Name: 'DeclinedEventRelation';
    Fields: Fields$DeclinedEventRelation;
    ParentReferences: ParentReferences$DeclinedEventRelation;
    ChildRelationships: ChildRelationships$DeclinedEventRelation;
  }

type Fields$DigitalSignature = {
  //
  Id: string;
  IsDeleted: boolean;
  DigitalSignatureNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  DocumentName: string;
  DocumentContentType: string;
  DocumentLength: number | null;
  DocumentBody: BlobString;
  SignedBy: string | null;
  Place: string | null;
  SignedDate: DateString | null;
  SignatureType: string | null;
};

type ParentReferences$DigitalSignature = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$Name;
};

type ChildRelationships$DigitalSignature = {
  //
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$DigitalSignature extends SObjectDefinition<'DigitalSignature'> {
    Name: 'DigitalSignature';
    Fields: Fields$DigitalSignature;
    ParentReferences: ParentReferences$DigitalSignature;
    ChildRelationships: ChildRelationships$DigitalSignature;
  }

type Fields$Document = {
  //
  Id: string;
  FolderId: string;
  IsDeleted: boolean;
  Name: string;
  DeveloperName: string;
  NamespacePrefix: string | null;
  ContentType: string | null;
  Type: string | null;
  IsPublic: boolean;
  BodyLength: number;
  Body: BlobString | null;
  Url: string | null;
  Description: string | null;
  Keywords: string | null;
  IsInternalUseOnly: boolean;
  AuthorId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsBodySearchable: boolean;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Document = {
  //
  Folder: SObjectDefinition$Name;
  Author: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Document = {
  //
};

interface SObjectDefinition$Document extends SObjectDefinition<'Document'> {
    Name: 'Document';
    Fields: Fields$Document;
    ParentReferences: ParentReferences$Document;
    ChildRelationships: ChildRelationships$Document;
  }

type Fields$DocumentAttachmentMap = {
  //
  Id: string;
  ParentId: string;
  DocumentId: string;
  DocumentSequence: number;
  CreatedDate: DateString;
  CreatedById: string;
};

type ParentReferences$DocumentAttachmentMap = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$DocumentAttachmentMap = {
  //
};

interface SObjectDefinition$DocumentAttachmentMap extends SObjectDefinition<'DocumentAttachmentMap'> {
    Name: 'DocumentAttachmentMap';
    Fields: Fields$DocumentAttachmentMap;
    ParentReferences: ParentReferences$DocumentAttachmentMap;
    ChildRelationships: ChildRelationships$DocumentAttachmentMap;
  }

type Fields$Domain = {
  //
  Id: string;
  DomainType: string;
  Domain: string;
  OptionsExternalHttps: boolean;
  CnameTarget: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Domain = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Domain = {
  //
  DomainSites: SObjectDefinition$DomainSite;
};

interface SObjectDefinition$Domain extends SObjectDefinition<'Domain'> {
    Name: 'Domain';
    Fields: Fields$Domain;
    ParentReferences: ParentReferences$Domain;
    ChildRelationships: ChildRelationships$Domain;
  }

type Fields$DomainSite = {
  //
  Id: string;
  DomainId: string;
  SiteId: string;
  PathPrefix: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$DomainSite = {
  //
  Domain: SObjectDefinition$Domain;
  Site: SObjectDefinition$Site;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DomainSite = {
  //
};

interface SObjectDefinition$DomainSite extends SObjectDefinition<'DomainSite'> {
    Name: 'DomainSite';
    Fields: Fields$DomainSite;
    ParentReferences: ParentReferences$DomainSite;
    ChildRelationships: ChildRelationships$DomainSite;
  }

type Fields$DuplicateRecordItem = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DuplicateRecordSetId: string;
  RecordId: string;
};

type ParentReferences$DuplicateRecordItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DuplicateRecordSet: SObjectDefinition$DuplicateRecordSet;
  Record: SObjectDefinition$Name;
};

type ChildRelationships$DuplicateRecordItem = {
  //
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$DuplicateRecordItem extends SObjectDefinition<'DuplicateRecordItem'> {
    Name: 'DuplicateRecordItem';
    Fields: Fields$DuplicateRecordItem;
    ParentReferences: ParentReferences$DuplicateRecordItem;
    ChildRelationships: ChildRelationships$DuplicateRecordItem;
  }

type Fields$DuplicateRecordSet = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  DuplicateRuleId: string | null;
  RecordCount: number | null;
};

type ParentReferences$DuplicateRecordSet = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DuplicateRule: SObjectDefinition$DuplicateRule | null;
};

type ChildRelationships$DuplicateRecordSet = {
  //
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$DuplicateRecordSet extends SObjectDefinition<'DuplicateRecordSet'> {
    Name: 'DuplicateRecordSet';
    Fields: Fields$DuplicateRecordSet;
    ParentReferences: ParentReferences$DuplicateRecordSet;
    ChildRelationships: ChildRelationships$DuplicateRecordSet;
  }

type Fields$DuplicateRule = {
  //
  Id: string;
  IsDeleted: boolean;
  SobjectType: string;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsActive: boolean;
  SobjectSubtype: string | null;
  LastViewedDate: DateString | null;
};

type ParentReferences$DuplicateRule = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$DuplicateRule = {
  //
  DuplicateRecordSets: SObjectDefinition$DuplicateRecordSet;
};

interface SObjectDefinition$DuplicateRule extends SObjectDefinition<'DuplicateRule'> {
    Name: 'DuplicateRule';
    Fields: Fields$DuplicateRule;
    ParentReferences: ParentReferences$DuplicateRule;
    ChildRelationships: ChildRelationships$DuplicateRule;
  }

type Fields$EmailCapture = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsActive: boolean;
  ToPattern: string;
  FromPattern: string | null;
  Sender: string | null;
  Recipient: string | null;
  CaptureDate: DateString | null;
  RawMessageLength: number | null;
  RawMessage: BlobString | null;
};

type ParentReferences$EmailCapture = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailCapture = {
  //
};

interface SObjectDefinition$EmailCapture extends SObjectDefinition<'EmailCapture'> {
    Name: 'EmailCapture';
    Fields: Fields$EmailCapture;
    ParentReferences: ParentReferences$EmailCapture;
    ChildRelationships: ChildRelationships$EmailCapture;
  }

type Fields$EmailDomainFilter = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PriorityNumber: number | null;
  EmailRelayId: string;
  ToDomain: string | null;
  FromDomain: string | null;
  IsActive: boolean;
};

type ParentReferences$EmailDomainFilter = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  EmailRelay: SObjectDefinition$EmailRelay;
};

type ChildRelationships$EmailDomainFilter = {
  //
};

interface SObjectDefinition$EmailDomainFilter extends SObjectDefinition<'EmailDomainFilter'> {
    Name: 'EmailDomainFilter';
    Fields: Fields$EmailDomainFilter;
    ParentReferences: ParentReferences$EmailDomainFilter;
    ChildRelationships: ChildRelationships$EmailDomainFilter;
  }

type Fields$EmailDomainKey = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Selector: string;
  Domain: string;
  DomainMatch: string;
  IsActive: boolean;
  PublicKey: string | null;
};

type ParentReferences$EmailDomainKey = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailDomainKey = {
  //
};

interface SObjectDefinition$EmailDomainKey extends SObjectDefinition<'EmailDomainKey'> {
    Name: 'EmailDomainKey';
    Fields: Fields$EmailDomainKey;
    ParentReferences: ParentReferences$EmailDomainKey;
    ChildRelationships: ChildRelationships$EmailDomainKey;
  }

type Fields$EmailMessage = {
  //
  Id: string;
  ParentId: string | null;
  ActivityId: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  TextBody: string | null;
  HtmlBody: string | null;
  Headers: string | null;
  Subject: string | null;
  FromName: string | null;
  FromAddress: string | null;
  ValidatedFromAddress: string | null;
  ToAddress: string | null;
  CcAddress: string | null;
  BccAddress: string | null;
  Incoming: boolean;
  HasAttachment: boolean;
  Status: string;
  MessageDate: DateString | null;
  IsDeleted: boolean;
  ReplyToEmailMessageId: string | null;
  IsExternallyVisible: boolean;
  MessageIdentifier: string | null;
  ThreadIdentifier: string | null;
  IsClientManaged: boolean;
  RelatedToId: string | null;
};

type ParentReferences$EmailMessage = {
  //
  Parent: SObjectDefinition$Case | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ReplyToEmailMessage: SObjectDefinition$EmailMessage | null;
  RelatedTo: SObjectDefinition$Name | null;
};

type ChildRelationships$EmailMessage = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  EmailMessageRelations: SObjectDefinition$EmailMessageRelation;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$EmailMessage extends SObjectDefinition<'EmailMessage'> {
    Name: 'EmailMessage';
    Fields: Fields$EmailMessage;
    ParentReferences: ParentReferences$EmailMessage;
    ChildRelationships: ChildRelationships$EmailMessage;
  }

type Fields$EmailMessageRelation = {
  //
  Id: string;
  EmailMessageId: string;
  RelationId: string | null;
  RelationType: string;
  RelationAddress: string | null;
  RelationObjectType: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$EmailMessageRelation = {
  //
  EmailMessage: SObjectDefinition$EmailMessage;
  Relation: SObjectDefinition$Name | null;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailMessageRelation = {
  //
};

interface SObjectDefinition$EmailMessageRelation extends SObjectDefinition<'EmailMessageRelation'> {
    Name: 'EmailMessageRelation';
    Fields: Fields$EmailMessageRelation;
    ParentReferences: ParentReferences$EmailMessageRelation;
    ChildRelationships: ChildRelationships$EmailMessageRelation;
  }

type Fields$EmailRelay = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Host: string;
  Port: string;
  TlsSetting: string;
  IsRequireAuth: boolean;
  Username: string | null;
  Password: string | null;
};

type ParentReferences$EmailRelay = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailRelay = {
  //
  Filters: SObjectDefinition$EmailDomainFilter;
};

interface SObjectDefinition$EmailRelay extends SObjectDefinition<'EmailRelay'> {
    Name: 'EmailRelay';
    Fields: Fields$EmailRelay;
    ParentReferences: ParentReferences$EmailRelay;
    ChildRelationships: ChildRelationships$EmailRelay;
  }

type Fields$EmailServicesAddress = {
  //
  Id: string;
  IsActive: boolean;
  LocalPart: string;
  EmailDomainName: string | null;
  AuthorizedSenders: string | null;
  RunAsUserId: string;
  FunctionId: string;
  DeveloperName: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$EmailServicesAddress = {
  //
  Function: SObjectDefinition$EmailServicesFunction;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailServicesAddress = {
  //
};

interface SObjectDefinition$EmailServicesAddress extends SObjectDefinition<'EmailServicesAddress'> {
    Name: 'EmailServicesAddress';
    Fields: Fields$EmailServicesAddress;
    ParentReferences: ParentReferences$EmailServicesAddress;
    ChildRelationships: ChildRelationships$EmailServicesAddress;
  }

type Fields$EmailServicesFunction = {
  //
  Id: string;
  IsActive: boolean;
  FunctionName: string;
  AuthorizedSenders: string | null;
  IsAuthenticationRequired: boolean;
  IsTlsRequired: boolean;
  AttachmentOption: string;
  ApexClassId: string | null;
  OverLimitAction: string | null;
  FunctionInactiveAction: string | null;
  AddressInactiveAction: string | null;
  AuthenticationFailureAction: string | null;
  AuthorizationFailureAction: string | null;
  IsErrorRoutingEnabled: boolean;
  ErrorRoutingAddress: string | null;
  IsTextAttachmentsAsBinary: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$EmailServicesFunction = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailServicesFunction = {
  //
  Addresses: SObjectDefinition$EmailServicesAddress;
};

interface SObjectDefinition$EmailServicesFunction extends SObjectDefinition<'EmailServicesFunction'> {
    Name: 'EmailServicesFunction';
    Fields: Fields$EmailServicesFunction;
    ParentReferences: ParentReferences$EmailServicesFunction;
    ChildRelationships: ChildRelationships$EmailServicesFunction;
  }

type Fields$EmailStatus = {
  //
  Id: string;
  TaskId: string;
  WhoId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  TimesOpened: number;
  FirstOpenDate: DateString | null;
  LastOpenDate: DateString | null;
  EmailTemplateName: string | null;
};

type ParentReferences$EmailStatus = {
  //
  Task: SObjectDefinition$Task;
  Who: SObjectDefinition$Name | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailStatus = {
  //
};

interface SObjectDefinition$EmailStatus extends SObjectDefinition<'EmailStatus'> {
    Name: 'EmailStatus';
    Fields: Fields$EmailStatus;
    ParentReferences: ParentReferences$EmailStatus;
    ChildRelationships: ChildRelationships$EmailStatus;
  }

type Fields$EmailTemplate = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  NamespacePrefix: string | null;
  OwnerId: string;
  FolderId: string;
  BrandTemplateId: string | null;
  TemplateStyle: string;
  IsActive: boolean;
  TemplateType: string;
  Encoding: string | null;
  Description: string | null;
  Subject: string | null;
  HtmlValue: string | null;
  Body: string | null;
  TimesUsed: number | null;
  LastUsedDate: DateString | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ApiVersion: number | null;
  Markup: string | null;
  UiType: string | null;
  RelatedEntityType: string | null;
};

type ParentReferences$EmailTemplate = {
  //
  Owner: SObjectDefinition$User;
  Folder: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EmailTemplate = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
};

interface SObjectDefinition$EmailTemplate extends SObjectDefinition<'EmailTemplate'> {
    Name: 'EmailTemplate';
    Fields: Fields$EmailTemplate;
    ParentReferences: ParentReferences$EmailTemplate;
    ChildRelationships: ChildRelationships$EmailTemplate;
  }

type Fields$EmbeddedServiceDetail = {
  //
  Id: string;
  DurableId: string | null;
  Site: string | null;
  PrimaryColor: string | null;
  SecondaryColor: string | null;
  ContrastPrimaryColor: string | null;
  ContrastInvertedColor: string | null;
  NavBarColor: string | null;
  Font: string | null;
  IsLiveAgentEnabled: boolean;
  IsFieldServiceEnabled: boolean;
  Width: number | null;
  Height: number | null;
  IsPrechatEnabled: boolean;
  CustomPrechatComponent: string | null;
  AvatarImg: string | null;
  SmallCompanyLogoImg: string | null;
  PrechatBackgroundImg: string | null;
  WaitingStateBackgroundImg: string | null;
  HeaderBackgroundImg: string | null;
  FontSize: string | null;
  OfflineCaseBackgroundImg: string | null;
  IsOfflineCaseEnabled: boolean;
  IsQueuePositionEnabled: boolean;
  ShouldShowNewAppointment: boolean;
  ShouldShowExistingAppointment: boolean;
  FlowDeveloperName: string | null;
  ModifyApptBookingFlowName: string | null;
  CancelApptBookingFlowName: string | null;
  FieldServiceHomeImg: string | null;
  FieldServiceLogoImg: string | null;
  FieldServiceConfirmCardImg: string | null;
  ShouldHideAuthDialog: boolean;
  CustomMinimizedComponent: string | null;
};

type ParentReferences$EmbeddedServiceDetail = {
  //
};

type ChildRelationships$EmbeddedServiceDetail = {
  //
};

interface SObjectDefinition$EmbeddedServiceDetail extends SObjectDefinition<'EmbeddedServiceDetail'> {
    Name: 'EmbeddedServiceDetail';
    Fields: Fields$EmbeddedServiceDetail;
    ParentReferences: ParentReferences$EmbeddedServiceDetail;
    ChildRelationships: ChildRelationships$EmbeddedServiceDetail;
  }

type Fields$Employee__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Department__c: string | null;
  Email__c: string | null;
  Title__c: string | null;
};

type ParentReferences$Employee__ChangeEvent = {
  //
};

type ChildRelationships$Employee__ChangeEvent = {
  //
};

interface SObjectDefinition$Employee__ChangeEvent extends SObjectDefinition<'Employee__ChangeEvent'> {
    Name: 'Employee__ChangeEvent';
    Fields: Fields$Employee__ChangeEvent;
    ParentReferences: ParentReferences$Employee__ChangeEvent;
    ChildRelationships: ChildRelationships$Employee__ChangeEvent;
  }

type Fields$Employee__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$Employee__Share = {
  //
  Parent: SObjectDefinition$Employee__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Employee__Share = {
  //
};

interface SObjectDefinition$Employee__Share extends SObjectDefinition<'Employee__Share'> {
    Name: 'Employee__Share';
    Fields: Fields$Employee__Share;
    ParentReferences: ParentReferences$Employee__Share;
    ChildRelationships: ChildRelationships$Employee__Share;
  }

type Fields$Employee__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  Department__c: string | null;
  Email__c: string | null;
  Title__c: string | null;
};

type ParentReferences$Employee__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Employee__c = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  Emails: SObjectDefinition$EmailMessage;
  Shares: SObjectDefinition$Employee__Share;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Employee__c extends SObjectDefinition<'Employee__c'> {
    Name: 'Employee__c';
    Fields: Fields$Employee__c;
    ParentReferences: ParentReferences$Employee__c;
    ChildRelationships: ChildRelationships$Employee__c;
  }

type Fields$EntityDefinition = {
  //
  Id: string;
  DurableId: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  QualifiedApiName: string;
  NamespacePrefix: string | null;
  DeveloperName: string | null;
  MasterLabel: string;
  Label: string | null;
  PluralLabel: string | null;
  DefaultCompactLayoutId: string | null;
  IsCustomizable: boolean;
  IsApexTriggerable: boolean;
  IsWorkflowEnabled: boolean;
  IsProcessEnabled: boolean;
  IsCompactLayoutable: boolean;
  KeyPrefix: string | null;
  IsCustomSetting: boolean;
  IsDeprecatedAndHidden: boolean;
  IsReplicateable: boolean;
  IsRetrieveable: boolean;
  IsSearchLayoutable: boolean;
  IsSearchable: boolean;
  IsTriggerable: boolean;
  IsIdEnabled: boolean;
  IsEverCreatable: boolean;
  IsEverUpdatable: boolean;
  IsEverDeletable: boolean;
  IsFeedEnabled: boolean;
  IsQueryable: boolean;
  IsMruEnabled: boolean;
  DetailUrl: string | null;
  EditUrl: string | null;
  NewUrl: string | null;
  EditDefinitionUrl: string | null;
  HelpSettingPageName: string | null;
  HelpSettingPageUrl: string | null;
  RunningUserEntityAccessId: string | null;
  PublisherId: string | null;
  IsLayoutable: boolean;
  RecordTypesSupported: any | null;
  InternalSharingModel: string;
  ExternalSharingModel: string;
  HasSubtypes: boolean;
  IsSubtype: boolean;
  IsAutoActivityCaptureEnabled: boolean;
  DataStewardId: string | null;
};

type ParentReferences$EntityDefinition = {
  //
  LastModifiedBy: SObjectDefinition$User;
  DataSteward: SObjectDefinition$Name | null;
};

type ChildRelationships$EntityDefinition = {
  //
  Particles: SObjectDefinition$EntityParticle;
  Fields: SObjectDefinition$FieldDefinition;
  OwnerChangeOptions: SObjectDefinition$OwnerChangeOptionInfo;
  RelationshipDomains: SObjectDefinition$RelationshipDomain;
  ChildRelationships: SObjectDefinition$RelationshipInfo;
  SearchLayouts: SObjectDefinition$SearchLayout;
};

interface SObjectDefinition$EntityDefinition extends SObjectDefinition<'EntityDefinition'> {
    Name: 'EntityDefinition';
    Fields: Fields$EntityDefinition;
    ParentReferences: ParentReferences$EntityDefinition;
    ChildRelationships: ChildRelationships$EntityDefinition;
  }

type Fields$EntityParticle = {
  //
  Id: string;
  DurableId: string | null;
  QualifiedApiName: string;
  EntityDefinitionId: string | null;
  FieldDefinitionId: string | null;
  NamespacePrefix: string | null;
  DeveloperName: string | null;
  MasterLabel: string;
  Label: string | null;
  Length: number | null;
  DataType: string | null;
  ServiceDataTypeId: string | null;
  ValueTypeId: string | null;
  ExtraTypeInfo: string | null;
  IsAutonumber: boolean;
  ByteLength: number | null;
  IsCaseSensitive: boolean;
  IsUnique: boolean;
  IsCreatable: boolean;
  IsUpdatable: boolean;
  IsDefaultedOnCreate: boolean;
  IsWriteRequiresMasterRead: boolean;
  IsCalculated: boolean;
  IsHighScaleNumber: boolean;
  IsHtmlFormatted: boolean;
  IsNameField: boolean;
  IsNillable: boolean;
  IsPermissionable: boolean;
  IsEncrypted: boolean;
  Digits: number | null;
  InlineHelpText: string | null;
  RelationshipName: string | null;
  ReferenceTargetField: string | null;
  Name: string | null;
  Mask: string | null;
  MaskType: string | null;
  IsWorkflowFilterable: boolean;
  IsCompactLayoutable: boolean;
  Precision: number | null;
  Scale: number | null;
  IsFieldHistoryTracked: boolean;
  IsApiFilterable: boolean;
  IsApiSortable: boolean;
  IsApiGroupable: boolean;
  IsListVisible: boolean;
  IsLayoutable: boolean;
  IsDependentPicklist: boolean;
  IsDeprecatedAndHidden: boolean;
  IsDisplayLocationInDecimal: boolean;
  DefaultValueFormula: string | null;
  IsIdLookup: boolean;
  IsNamePointing: boolean;
  RelationshipOrder: number | null;
  ReferenceTo: any | null;
  IsComponent: boolean;
  IsCompound: boolean;
};

type ParentReferences$EntityParticle = {
  //
};

type ChildRelationships$EntityParticle = {
  //
  PicklistValues: SObjectDefinition$PicklistValueInfo;
};

interface SObjectDefinition$EntityParticle extends SObjectDefinition<'EntityParticle'> {
    Name: 'EntityParticle';
    Fields: Fields$EntityParticle;
    ParentReferences: ParentReferences$EntityParticle;
    ChildRelationships: ChildRelationships$EntityParticle;
  }

type Fields$EntitySubscription = {
  //
  Id: string;
  ParentId: string;
  SubscriberId: string;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
};

type ParentReferences$EntitySubscription = {
  //
  Parent: SObjectDefinition$Name;
  Subscriber: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$EntitySubscription = {
  //
};

interface SObjectDefinition$EntitySubscription extends SObjectDefinition<'EntitySubscription'> {
    Name: 'EntitySubscription';
    Fields: Fields$EntitySubscription;
    ParentReferences: ParentReferences$EntitySubscription;
    ChildRelationships: ChildRelationships$EntitySubscription;
  }

type Fields$Event = {
  //
  Id: string;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  Location: string | null;
  IsAllDayEvent: boolean;
  ActivityDateTime: DateString | null;
  ActivityDate: DateString | null;
  DurationInMinutes: number | null;
  StartDateTime: DateString | null;
  EndDateTime: DateString | null;
  Description: string | null;
  AccountId: string | null;
  OwnerId: string;
  CurrencyIsoCode: string | null;
  IsPrivate: boolean;
  ShowAs: string | null;
  IsDeleted: boolean;
  IsChild: boolean;
  IsGroupEvent: boolean;
  GroupEventType: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsArchived: boolean;
  RecurrenceActivityId: string | null;
  IsRecurrence: boolean;
  RecurrenceStartDateTime: DateString | null;
  RecurrenceEndDateOnly: DateString | null;
  RecurrenceTimeZoneSidKey: string | null;
  RecurrenceType: string | null;
  RecurrenceInterval: number | null;
  RecurrenceDayOfWeekMask: number | null;
  RecurrenceDayOfMonth: number | null;
  RecurrenceInstance: string | null;
  RecurrenceMonthOfYear: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
  EventSubtype: string | null;
};

type ParentReferences$Event = {
  //
  Who: SObjectDefinition$Name | null;
  What: SObjectDefinition$Name | null;
  Account: SObjectDefinition$Account | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Event = {
  //
  AcceptedEventRelations: SObjectDefinition$AcceptedEventRelation;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DeclinedEventRelations: SObjectDefinition$DeclinedEventRelation;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  RecurringEvents: SObjectDefinition$Event;
  Feeds: SObjectDefinition$EventFeed;
  EventRelations: SObjectDefinition$EventRelation;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  UndecidedEventRelations: SObjectDefinition$UndecidedEventRelation;
};

interface SObjectDefinition$Event extends SObjectDefinition<'Event'> {
    Name: 'Event';
    Fields: Fields$Event;
    ParentReferences: ParentReferences$Event;
    ChildRelationships: ChildRelationships$Event;
  }

type Fields$EventBusSubscriber = {
  //
  Id: string;
  CurrencyIsoCode: string;
  ExternalId: string | null;
  Name: string | null;
  Type: string | null;
  Topic: string | null;
  Position: number | null;
  Tip: number | null;
  Retries: number | null;
  LastError: string | null;
  Status: string | null;
};

type ParentReferences$EventBusSubscriber = {
  //
};

type ChildRelationships$EventBusSubscriber = {
  //
};

interface SObjectDefinition$EventBusSubscriber extends SObjectDefinition<'EventBusSubscriber'> {
    Name: 'EventBusSubscriber';
    Fields: Fields$EventBusSubscriber;
    ParentReferences: ParentReferences$EventBusSubscriber;
    ChildRelationships: ChildRelationships$EventBusSubscriber;
  }

type Fields$EventChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  Location: string | null;
  IsAllDayEvent: boolean;
  ActivityDateTime: DateString | null;
  ActivityDate: DateString | null;
  DurationInMinutes: number | null;
  Description: string | null;
  AccountId: string | null;
  OwnerId: string | null;
  CurrencyIsoCode: string | null;
  IsPrivate: boolean;
  ShowAs: string | null;
  IsChild: boolean;
  IsGroupEvent: boolean;
  GroupEventType: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  RecurrenceActivityId: string | null;
  IsRecurrence: boolean;
  RecurrenceStartDateTime: DateString | null;
  RecurrenceEndDateOnly: DateString | null;
  RecurrenceTimeZoneSidKey: string | null;
  RecurrenceType: string | null;
  RecurrenceInterval: number | null;
  RecurrenceDayOfWeekMask: number | null;
  RecurrenceDayOfMonth: number | null;
  RecurrenceInstance: string | null;
  RecurrenceMonthOfYear: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
};

type ParentReferences$EventChangeEvent = {
  //
};

type ChildRelationships$EventChangeEvent = {
  //
};

interface SObjectDefinition$EventChangeEvent extends SObjectDefinition<'EventChangeEvent'> {
    Name: 'EventChangeEvent';
    Fields: Fields$EventChangeEvent;
    ParentReferences: ParentReferences$EventChangeEvent;
    ChildRelationships: ChildRelationships$EventChangeEvent;
  }

type Fields$EventFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$EventFeed = {
  //
  Parent: SObjectDefinition$Event;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$EventFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$EventFeed extends SObjectDefinition<'EventFeed'> {
    Name: 'EventFeed';
    Fields: Fields$EventFeed;
    ParentReferences: ParentReferences$EventFeed;
    ChildRelationships: ChildRelationships$EventFeed;
  }

type Fields$EventLogFile = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  EventType: string;
  LogDate: DateString;
  LogFileLength: number;
  LogFileContentType: string;
  ApiVersion: number;
  Sequence: number;
  Interval: string | null;
  LogFileFieldNames: string | null;
  LogFileFieldTypes: string | null;
  LogFile: BlobString;
};

type ParentReferences$EventLogFile = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EventLogFile = {
  //
};

interface SObjectDefinition$EventLogFile extends SObjectDefinition<'EventLogFile'> {
    Name: 'EventLogFile';
    Fields: Fields$EventLogFile;
    ParentReferences: ParentReferences$EventLogFile;
    ChildRelationships: ChildRelationships$EventLogFile;
  }

type Fields$EventRelation = {
  //
  Id: string;
  RelationId: string;
  EventId: string;
  Status: string | null;
  RespondedDate: DateString | null;
  Response: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$EventRelation = {
  //
  Relation: SObjectDefinition$Name;
  Event: SObjectDefinition$Event;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EventRelation = {
  //
};

interface SObjectDefinition$EventRelation extends SObjectDefinition<'EventRelation'> {
    Name: 'EventRelation';
    Fields: Fields$EventRelation;
    ParentReferences: ParentReferences$EventRelation;
    ChildRelationships: ChildRelationships$EventRelation;
  }

type Fields$EventRelationChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  RelationId: string | null;
  EventId: string | null;
  Status: string | null;
  RespondedDate: DateString | null;
  Response: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
};

type ParentReferences$EventRelationChangeEvent = {
  //
};

type ChildRelationships$EventRelationChangeEvent = {
  //
};

interface SObjectDefinition$EventRelationChangeEvent extends SObjectDefinition<'EventRelationChangeEvent'> {
    Name: 'EventRelationChangeEvent';
    Fields: Fields$EventRelationChangeEvent;
    ParentReferences: ParentReferences$EventRelationChangeEvent;
    ChildRelationships: ChildRelationships$EventRelationChangeEvent;
  }

type Fields$Expense__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  RecordTypeId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Amount__c: number | null;
  Description__c: string | null;
  Status__c: string | null;
  SubmitDate__c: DateString | null;
  TargetDate__c: DateString | null;
  Type__c: string | null;
};

type ParentReferences$Expense__ChangeEvent = {
  //
};

type ChildRelationships$Expense__ChangeEvent = {
  //
};

interface SObjectDefinition$Expense__ChangeEvent extends SObjectDefinition<'Expense__ChangeEvent'> {
    Name: 'Expense__ChangeEvent';
    Fields: Fields$Expense__ChangeEvent;
    ParentReferences: ParentReferences$Expense__ChangeEvent;
    ChildRelationships: ChildRelationships$Expense__ChangeEvent;
  }

type Fields$Expense__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  RecordTypeId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  Amount__c: number | null;
  Description__c: string | null;
  Status__c: string;
  SubmitDate__c: DateString | null;
  TargetDate__c: DateString | null;
  Type__c: string | null;
};

type ParentReferences$Expense__c = {
  //
  Owner: SObjectDefinition$Name;
  RecordType: SObjectDefinition$RecordType | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Expense__c = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Expense__c extends SObjectDefinition<'Expense__c'> {
    Name: 'Expense__c';
    Fields: Fields$Expense__c;
    ParentReferences: ParentReferences$Expense__c;
    ChildRelationships: ChildRelationships$Expense__c;
  }

type Fields$ExternalDataSource = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Type: string;
  Endpoint: string | null;
  Repository: string | null;
  IsWritable: boolean;
  PrincipalType: string;
  Protocol: string;
  AuthProviderId: string | null;
  LargeIconId: string | null;
  SmallIconId: string | null;
  CustomConfiguration: string | null;
};

type ParentReferences$ExternalDataSource = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AuthProvider: SObjectDefinition$AuthProvider | null;
  LargeIcon: SObjectDefinition$StaticResource | null;
  SmallIcon: SObjectDefinition$StaticResource | null;
};

type ChildRelationships$ExternalDataSource = {
  //
  CustomHttpHeaders: SObjectDefinition$CustomHttpHeader;
  UserAuths: SObjectDefinition$ExternalDataUserAuth;
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$ExternalDataSource extends SObjectDefinition<'ExternalDataSource'> {
    Name: 'ExternalDataSource';
    Fields: Fields$ExternalDataSource;
    ParentReferences: ParentReferences$ExternalDataSource;
    ChildRelationships: ChildRelationships$ExternalDataSource;
  }

type Fields$ExternalDataUserAuth = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExternalDataSourceId: string;
  UserId: string | null;
  Protocol: string | null;
  Username: string | null;
  Password: string | null;
  AuthProviderId: string | null;
};

type ParentReferences$ExternalDataUserAuth = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ExternalDataSource: SObjectDefinition$Name;
  User: SObjectDefinition$User | null;
  AuthProvider: SObjectDefinition$AuthProvider | null;
};

type ChildRelationships$ExternalDataUserAuth = {
  //
};

interface SObjectDefinition$ExternalDataUserAuth extends SObjectDefinition<'ExternalDataUserAuth'> {
    Name: 'ExternalDataUserAuth';
    Fields: Fields$ExternalDataUserAuth;
    ParentReferences: ParentReferences$ExternalDataUserAuth;
    ChildRelationships: ChildRelationships$ExternalDataUserAuth;
  }

type Fields$ExternalEvent = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExternalId: string | null;
  Title: string | null;
  Location: string | null;
  Notes: string | null;
  Time: string | null;
};

type ParentReferences$ExternalEvent = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ExternalEvent = {
  //
  ConferenceNumbers: SObjectDefinition$ConferenceNumber;
};

interface SObjectDefinition$ExternalEvent extends SObjectDefinition<'ExternalEvent'> {
    Name: 'ExternalEvent';
    Fields: Fields$ExternalEvent;
    ParentReferences: ParentReferences$ExternalEvent;
    ChildRelationships: ChildRelationships$ExternalEvent;
  }

type Fields$ExternalEventMapping = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExternalId: string | null;
  EventId: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  IsRecurring: boolean;
};

type ParentReferences$ExternalEventMapping = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Event: SObjectDefinition$Event | null;
};

type ChildRelationships$ExternalEventMapping = {
  //
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$ExternalEventMapping extends SObjectDefinition<'ExternalEventMapping'> {
    Name: 'ExternalEventMapping';
    Fields: Fields$ExternalEventMapping;
    ParentReferences: ParentReferences$ExternalEventMapping;
    ChildRelationships: ChildRelationships$ExternalEventMapping;
  }

type Fields$ExternalEventMappingShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ExternalEventMappingShare = {
  //
  Parent: SObjectDefinition$ExternalEventMapping;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ExternalEventMappingShare = {
  //
};

interface SObjectDefinition$ExternalEventMappingShare extends SObjectDefinition<'ExternalEventMappingShare'> {
    Name: 'ExternalEventMappingShare';
    Fields: Fields$ExternalEventMappingShare;
    ParentReferences: ParentReferences$ExternalEventMappingShare;
    ChildRelationships: ChildRelationships$ExternalEventMappingShare;
  }

type Fields$FeedAttachment = {
  //
  Id: string;
  FeedEntityId: string;
  Type: string;
  RecordId: string | null;
  Title: string | null;
  Value: string | null;
  IsDeleted: boolean;
};

type ParentReferences$FeedAttachment = {
  //
};

type ChildRelationships$FeedAttachment = {
  //
};

interface SObjectDefinition$FeedAttachment extends SObjectDefinition<'FeedAttachment'> {
    Name: 'FeedAttachment';
    Fields: Fields$FeedAttachment;
    ParentReferences: ParentReferences$FeedAttachment;
    ChildRelationships: ChildRelationships$FeedAttachment;
  }

type Fields$FeedComment = {
  //
  Id: string;
  FeedItemId: string;
  ParentId: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  SystemModstamp: DateString;
  Revision: number | null;
  LastEditById: string | null;
  LastEditDate: DateString | null;
  CommentBody: string;
  IsDeleted: boolean;
  InsertedById: string;
  CommentType: string | null;
  RelatedRecordId: string | null;
  IsRichText: boolean;
  IsVerified: boolean;
  HasEntityLinks: boolean;
  Status: string | null;
  ThreadParentId: string | null;
  ThreadLevel: number | null;
  ThreadChildrenCount: number | null;
  ThreadLastUpdatedDate: DateString | null;
};

type ParentReferences$FeedComment = {
  //
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User;
  ThreadParent: SObjectDefinition$FeedComment | null;
};

type ChildRelationships$FeedComment = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedThreadedComments: SObjectDefinition$FeedComment;
  FeedRevisions: SObjectDefinition$FeedRevision;
};

interface SObjectDefinition$FeedComment extends SObjectDefinition<'FeedComment'> {
    Name: 'FeedComment';
    Fields: Fields$FeedComment;
    ParentReferences: ParentReferences$FeedComment;
    ChildRelationships: ChildRelationships$FeedComment;
  }

type Fields$FeedItem = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  Revision: number | null;
  LastEditById: string | null;
  LastEditDate: DateString | null;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string;
  BestCommentId: string | null;
  HasContent: boolean;
  HasLink: boolean;
  HasFeedEntity: boolean;
  HasVerifiedComment: boolean;
  IsClosed: boolean;
  Status: string | null;
};

type ParentReferences$FeedItem = {
  //
  Parent: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User;
  BestComment: SObjectDefinition$FeedComment | null;
};

type ChildRelationships$FeedItem = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedRevisions: SObjectDefinition$FeedRevision;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  FeedItemThanks: SObjectDefinition$WorkThanks;
};

interface SObjectDefinition$FeedItem extends SObjectDefinition<'FeedItem'> {
    Name: 'FeedItem';
    Fields: Fields$FeedItem;
    ParentReferences: ParentReferences$FeedItem;
    ChildRelationships: ChildRelationships$FeedItem;
  }

type Fields$FeedLike = {
  //
  Id: string;
  FeedItemId: string | null;
  FeedEntityId: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  InsertedById: string;
};

type ParentReferences$FeedLike = {
  //
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User;
};

type ChildRelationships$FeedLike = {
  //
};

interface SObjectDefinition$FeedLike extends SObjectDefinition<'FeedLike'> {
    Name: 'FeedLike';
    Fields: Fields$FeedLike;
    ParentReferences: ParentReferences$FeedLike;
    ChildRelationships: ChildRelationships$FeedLike;
  }

type Fields$FeedPollChoice = {
  //
  Id: string;
  FeedItemId: string;
  Position: number;
  ChoiceBody: string;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
};

type ParentReferences$FeedPollChoice = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$FeedPollChoice = {
  //
  FeedPollVotes: SObjectDefinition$FeedPollVote;
};

interface SObjectDefinition$FeedPollChoice extends SObjectDefinition<'FeedPollChoice'> {
    Name: 'FeedPollChoice';
    Fields: Fields$FeedPollChoice;
    ParentReferences: ParentReferences$FeedPollChoice;
    ChildRelationships: ChildRelationships$FeedPollChoice;
  }

type Fields$FeedPollVote = {
  //
  Id: string;
  FeedItemId: string;
  ChoiceId: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  IsDeleted: boolean;
};

type ParentReferences$FeedPollVote = {
  //
  Choice: SObjectDefinition$FeedPollChoice;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$FeedPollVote = {
  //
};

interface SObjectDefinition$FeedPollVote extends SObjectDefinition<'FeedPollVote'> {
    Name: 'FeedPollVote';
    Fields: Fields$FeedPollVote;
    ParentReferences: ParentReferences$FeedPollVote;
    ChildRelationships: ChildRelationships$FeedPollVote;
  }

type Fields$FeedRevision = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  FeedEntityId: string;
  Revision: number | null;
  Action: string | null;
  EditedAttribute: string | null;
  Value: string | null;
  IsValueRichText: boolean;
};

type ParentReferences$FeedRevision = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$FeedRevision = {
  //
};

interface SObjectDefinition$FeedRevision extends SObjectDefinition<'FeedRevision'> {
    Name: 'FeedRevision';
    Fields: Fields$FeedRevision;
    ParentReferences: ParentReferences$FeedRevision;
    ChildRelationships: ChildRelationships$FeedRevision;
  }

type Fields$FeedSignal = {
  //
  Id: string;
  FeedItemId: string | null;
  FeedEntityId: string | null;
  SignalValue: number | null;
  SignalType: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  InsertedById: string;
};

type ParentReferences$FeedSignal = {
  //
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User;
};

type ChildRelationships$FeedSignal = {
  //
};

interface SObjectDefinition$FeedSignal extends SObjectDefinition<'FeedSignal'> {
    Name: 'FeedSignal';
    Fields: Fields$FeedSignal;
    ParentReferences: ParentReferences$FeedSignal;
    ChildRelationships: ChildRelationships$FeedSignal;
  }

type Fields$FeedTrackedChange = {
  //
  Id: string;
  FeedItemId: string;
  FieldName: string;
  OldValue: string | null;
  NewValue: string | null;
  CurrencyIsoCode: string;
  OldCurrencyIsoCode: string | null;
};

type ParentReferences$FeedTrackedChange = {
  //
};

type ChildRelationships$FeedTrackedChange = {
  //
};

interface SObjectDefinition$FeedTrackedChange extends SObjectDefinition<'FeedTrackedChange'> {
    Name: 'FeedTrackedChange';
    Fields: Fields$FeedTrackedChange;
    ParentReferences: ParentReferences$FeedTrackedChange;
    ChildRelationships: ChildRelationships$FeedTrackedChange;
  }

type Fields$FieldDefinition = {
  //
  Id: string;
  DurableId: string | null;
  QualifiedApiName: string;
  EntityDefinitionId: string | null;
  NamespacePrefix: string | null;
  DeveloperName: string | null;
  MasterLabel: string;
  Label: string | null;
  Length: number | null;
  DataType: string | null;
  ServiceDataTypeId: string | null;
  ValueTypeId: string | null;
  ExtraTypeInfo: string | null;
  IsCalculated: boolean;
  IsHighScaleNumber: boolean;
  IsHtmlFormatted: boolean;
  IsNameField: boolean;
  IsNillable: boolean;
  IsWorkflowFilterable: boolean;
  IsCompactLayoutable: boolean;
  Precision: number | null;
  Scale: number | null;
  IsFieldHistoryTracked: boolean;
  IsIndexed: boolean;
  IsApiFilterable: boolean;
  IsApiSortable: boolean;
  IsListFilterable: boolean;
  IsListSortable: boolean;
  IsApiGroupable: boolean;
  IsListVisible: boolean;
  ControllingFieldDefinitionId: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  PublisherId: string | null;
  RunningUserFieldAccessId: string | null;
  RelationshipName: string | null;
  ReferenceTo: any | null;
  ReferenceTargetField: string | null;
  IsCompound: boolean;
  IsSearchPrefilterable: boolean;
  IsPolymorphicForeignKey: boolean;
  BusinessOwnerId: string | null;
  BusinessStatus: string | null;
  SecurityClassification: string | null;
  Description: string | null;
};

type ParentReferences$FieldDefinition = {
  //
  LastModifiedBy: SObjectDefinition$User;
  BusinessOwner: SObjectDefinition$Name | null;
};

type ChildRelationships$FieldDefinition = {
  //
};

interface SObjectDefinition$FieldDefinition extends SObjectDefinition<'FieldDefinition'> {
    Name: 'FieldDefinition';
    Fields: Fields$FieldDefinition;
    ParentReferences: ParentReferences$FieldDefinition;
    ChildRelationships: ChildRelationships$FieldDefinition;
  }

type Fields$FieldPermissions = {
  //
  Id: string;
  ParentId: string;
  SobjectType: string;
  Field: string;
  PermissionsEdit: boolean;
  PermissionsRead: boolean;
  SystemModstamp: DateString;
};

type ParentReferences$FieldPermissions = {
  //
  Parent: SObjectDefinition$PermissionSet;
};

type ChildRelationships$FieldPermissions = {
  //
};

interface SObjectDefinition$FieldPermissions extends SObjectDefinition<'FieldPermissions'> {
    Name: 'FieldPermissions';
    Fields: Fields$FieldPermissions;
    ParentReferences: ParentReferences$FieldPermissions;
    ChildRelationships: ChildRelationships$FieldPermissions;
  }

type Fields$FieldServiceMobileSettings = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  NavbarBackgroundColor: string;
  BrandInvertedColor: string;
  FeedbackPrimaryColor: string;
  FeedbackSecondaryColor: string;
  PrimaryBrandColor: string;
  SecondaryBrandColor: string;
  ContrastPrimaryColor: string;
  ContrastSecondaryColor: string;
  ContrastTertiaryColor: string;
  ContrastQuaternaryColor: string;
  ContrastQuinaryColor: string;
  ContrastInvertedColor: string;
  IsSendLocationHistory: boolean;
  GeoLocationMinUpdateFreqMins: number;
  GeoLocationAccuracy: string;
  RecordDataCacheTimeMins: number;
  MetadataCacheTimeDays: number;
  UpdateScheduleTimeMins: number;
  IsShowEditFullRecord: boolean;
  TimeIntervalSetupMins: string;
  DefaultListViewDeveloperName: string | null;
  NavbarInvertedColor: string;
  FeedbackSelectedColor: string;
  FutureDaysInDatePicker: number;
  PastDaysInDatePicker: number;
  IsDefault: boolean;
  BgGeoLocationMinUpdateFreqMins: number;
  BgGeoLocationAccuracy: string;
  IsUseSalesforceMobileActions: boolean;
};

type ParentReferences$FieldServiceMobileSettings = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$FieldServiceMobileSettings = {
  //
  AppExtensions: SObjectDefinition$AppExtension;
  MobileSettingsAssignments: SObjectDefinition$MobileSettingsAssignment;
};

interface SObjectDefinition$FieldServiceMobileSettings extends SObjectDefinition<'FieldServiceMobileSettings'> {
    Name: 'FieldServiceMobileSettings';
    Fields: Fields$FieldServiceMobileSettings;
    ParentReferences: ParentReferences$FieldServiceMobileSettings;
    ChildRelationships: ChildRelationships$FieldServiceMobileSettings;
  }

type Fields$FileSearchActivity = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SearchTerm: string;
  QueryDate: DateString;
  CountQueries: number;
  CountUsers: number;
  AvgNumResults: number;
  Period: string;
  QueryLanguage: string;
  ClickRank: number | null;
};

type ParentReferences$FileSearchActivity = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$FileSearchActivity = {
  //
};

interface SObjectDefinition$FileSearchActivity extends SObjectDefinition<'FileSearchActivity'> {
    Name: 'FileSearchActivity';
    Fields: Fields$FileSearchActivity;
    ParentReferences: ParentReferences$FileSearchActivity;
    ChildRelationships: ChildRelationships$FileSearchActivity;
  }

type Fields$FiscalYearSettings = {
  //
  Id: string;
  PeriodId: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  Name: string;
  IsStandardYear: boolean;
  YearType: string | null;
  QuarterLabelScheme: string | null;
  PeriodLabelScheme: string | null;
  WeekLabelScheme: string | null;
  QuarterPrefix: string | null;
  PeriodPrefix: string | null;
  WeekStartDay: number | null;
  Description: string | null;
  SystemModstamp: DateString;
};

type ParentReferences$FiscalYearSettings = {
  //
};

type ChildRelationships$FiscalYearSettings = {
  //
  Periods: SObjectDefinition$Period;
};

interface SObjectDefinition$FiscalYearSettings extends SObjectDefinition<'FiscalYearSettings'> {
    Name: 'FiscalYearSettings';
    Fields: Fields$FiscalYearSettings;
    ParentReferences: ParentReferences$FiscalYearSettings;
    ChildRelationships: ChildRelationships$FiscalYearSettings;
  }

type Fields$FlexQueueItem = {
  //
  Id: string;
  FlexQueueItemId: string | null;
  JobType: string;
  AsyncApexJobId: string;
  JobPosition: number;
};

type ParentReferences$FlexQueueItem = {
  //
  AsyncApexJob: SObjectDefinition$AsyncApexJob;
};

type ChildRelationships$FlexQueueItem = {
  //
};

interface SObjectDefinition$FlexQueueItem extends SObjectDefinition<'FlexQueueItem'> {
    Name: 'FlexQueueItem';
    Fields: Fields$FlexQueueItem;
    ParentReferences: ParentReferences$FlexQueueItem;
    ChildRelationships: ChildRelationships$FlexQueueItem;
  }

type Fields$FlowInterview = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CurrentElement: string | null;
  InterviewLabel: string | null;
  PauseLabel: string | null;
  Guid: string | null;
};

type ParentReferences$FlowInterview = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$FlowInterview = {
  //
  RecordRelations: SObjectDefinition$FlowRecordRelation;
  StageRelations: SObjectDefinition$FlowStageRelation;
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$FlowInterview extends SObjectDefinition<'FlowInterview'> {
    Name: 'FlowInterview';
    Fields: Fields$FlowInterview;
    ParentReferences: ParentReferences$FlowInterview;
    ChildRelationships: ChildRelationships$FlowInterview;
  }

type Fields$FlowInterviewShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$FlowInterviewShare = {
  //
  Parent: SObjectDefinition$FlowInterview;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$FlowInterviewShare = {
  //
};

interface SObjectDefinition$FlowInterviewShare extends SObjectDefinition<'FlowInterviewShare'> {
    Name: 'FlowInterviewShare';
    Fields: Fields$FlowInterviewShare;
    ParentReferences: ParentReferences$FlowInterviewShare;
    ChildRelationships: ChildRelationships$FlowInterviewShare;
  }

type Fields$FlowRecordRelation = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  RelatedRecordId: string;
};

type ParentReferences$FlowRecordRelation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$FlowInterview;
  RelatedRecord: SObjectDefinition$Name;
};

type ChildRelationships$FlowRecordRelation = {
  //
};

interface SObjectDefinition$FlowRecordRelation extends SObjectDefinition<'FlowRecordRelation'> {
    Name: 'FlowRecordRelation';
    Fields: Fields$FlowRecordRelation;
    ParentReferences: ParentReferences$FlowRecordRelation;
    ChildRelationships: ChildRelationships$FlowRecordRelation;
  }

type Fields$FlowStageRelation = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  StageOrder: number;
  StageType: string | null;
  StageLabel: string | null;
  FlexIndex: string | null;
};

type ParentReferences$FlowStageRelation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$FlowInterview;
};

type ChildRelationships$FlowStageRelation = {
  //
};

interface SObjectDefinition$FlowStageRelation extends SObjectDefinition<'FlowStageRelation'> {
    Name: 'FlowStageRelation';
    Fields: Fields$FlowStageRelation;
    ParentReferences: ParentReferences$FlowStageRelation;
    ChildRelationships: ChildRelationships$FlowStageRelation;
  }

type Fields$Folder = {
  //
  Id: string;
  ParentId: string | null;
  Name: string;
  DeveloperName: string | null;
  AccessType: string;
  IsReadonly: boolean;
  Type: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Folder = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Folder = {
  //
  SubFolders: SObjectDefinition$Folder;
};

interface SObjectDefinition$Folder extends SObjectDefinition<'Folder'> {
    Name: 'Folder';
    Fields: Fields$Folder;
    ParentReferences: ParentReferences$Folder;
    ChildRelationships: ChildRelationships$Folder;
  }

type Fields$FolderedContentDocument = {
  //
  Id: string;
  IsFolder: boolean;
  ContentDocumentId: string;
  ParentContentFolderId: string | null;
  IsDeleted: boolean;
  Title: string;
  FileType: string | null;
  ContentSize: number | null;
  FileExtension: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$FolderedContentDocument = {
  //
  ContentDocument: SObjectDefinition$ContentDocument;
  ParentContentFolder: SObjectDefinition$ContentFolder | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$FolderedContentDocument = {
  //
};

interface SObjectDefinition$FolderedContentDocument extends SObjectDefinition<'FolderedContentDocument'> {
    Name: 'FolderedContentDocument';
    Fields: Fields$FolderedContentDocument;
    ParentReferences: ParentReferences$FolderedContentDocument;
    ChildRelationships: ChildRelationships$FolderedContentDocument;
  }

type Fields$ForecastShare = {
  //
  Id: string;
  UserRoleId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  CanSubmit: boolean;
  RowCause: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$ForecastShare = {
  //
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ForecastShare = {
  //
};

interface SObjectDefinition$ForecastShare extends SObjectDefinition<'ForecastShare'> {
    Name: 'ForecastShare';
    Fields: Fields$ForecastShare;
    ParentReferences: ParentReferences$ForecastShare;
    ChildRelationships: ChildRelationships$ForecastShare;
  }

type Fields$GrantedByLicense = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PermissionSetLicenseId: string;
  CustomPermissionId: string;
};

type ParentReferences$GrantedByLicense = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  PermissionSetLicense: SObjectDefinition$PermissionSetLicense;
  CustomPermission: SObjectDefinition$CustomPermission;
};

type ChildRelationships$GrantedByLicense = {
  //
};

interface SObjectDefinition$GrantedByLicense extends SObjectDefinition<'GrantedByLicense'> {
    Name: 'GrantedByLicense';
    Fields: Fields$GrantedByLicense;
    ParentReferences: ParentReferences$GrantedByLicense;
    ChildRelationships: ChildRelationships$GrantedByLicense;
  }

type Fields$Group = {
  //
  Id: string;
  Name: string;
  DeveloperName: string | null;
  RelatedId: string | null;
  Type: string;
  Email: string | null;
  OwnerId: string;
  DoesSendEmailToMembers: boolean;
  DoesIncludeBosses: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Group = {
  //
  Related: SObjectDefinition$Name | null;
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Group = {
  //
  GroupMembers: SObjectDefinition$GroupMember;
  QueueSobjects: SObjectDefinition$QueueSobject;
  DelegatedUsers: SObjectDefinition$User;
};

interface SObjectDefinition$Group extends SObjectDefinition<'Group'> {
    Name: 'Group';
    Fields: Fields$Group;
    ParentReferences: ParentReferences$Group;
    ChildRelationships: ChildRelationships$Group;
  }

type Fields$GroupMember = {
  //
  Id: string;
  GroupId: string;
  UserOrGroupId: string;
  SystemModstamp: DateString;
};

type ParentReferences$GroupMember = {
  //
  Group: SObjectDefinition$Group;
};

type ChildRelationships$GroupMember = {
  //
};

interface SObjectDefinition$GroupMember extends SObjectDefinition<'GroupMember'> {
    Name: 'GroupMember';
    Fields: Fields$GroupMember;
    ParentReferences: ParentReferences$GroupMember;
    ChildRelationships: ChildRelationships$GroupMember;
  }

type Fields$Holiday = {
  //
  Id: string;
  Name: string;
  Description: string | null;
  IsAllDay: boolean;
  ActivityDate: DateString | null;
  StartTimeInMinutes: number | null;
  EndTimeInMinutes: number | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsRecurrence: boolean;
  RecurrenceStartDate: DateString | null;
  RecurrenceEndDateOnly: DateString | null;
  RecurrenceType: string | null;
  RecurrenceInterval: number | null;
  RecurrenceDayOfWeekMask: number | null;
  RecurrenceDayOfMonth: number | null;
  RecurrenceInstance: string | null;
  RecurrenceMonthOfYear: string | null;
};

type ParentReferences$Holiday = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Holiday = {
  //
};

interface SObjectDefinition$Holiday extends SObjectDefinition<'Holiday'> {
    Name: 'Holiday';
    Fields: Fields$Holiday;
    ParentReferences: ParentReferences$Holiday;
    ChildRelationships: ChildRelationships$Holiday;
  }

type Fields$IconDefinition = {
  //
  Id: string;
  DurableId: string | null;
  TabDefinitionId: string | null;
  Url: string | null;
  ContentType: string | null;
  Theme: string | null;
  Height: number | null;
  Width: number | null;
};

type ParentReferences$IconDefinition = {
  //
};

type ChildRelationships$IconDefinition = {
  //
};

interface SObjectDefinition$IconDefinition extends SObjectDefinition<'IconDefinition'> {
    Name: 'IconDefinition';
    Fields: Fields$IconDefinition;
    ParentReferences: ParentReferences$IconDefinition;
    ChildRelationships: ChildRelationships$IconDefinition;
  }

type Fields$Idea = {
  //
  Id: string;
  IsDeleted: boolean;
  Title: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  CommunityId: string;
  Body: string | null;
  NumComments: number | null;
  VoteScore: number | null;
  VoteTotal: number | null;
  Categories: string | null;
  Status: string | null;
  LastCommentDate: DateString | null;
  LastCommentId: string | null;
  ParentIdeaId: string | null;
  IsHtml: boolean;
  IsMerged: boolean;
  CreatorFullPhotoUrl: string | null;
  CreatorSmallPhotoUrl: string | null;
  CreatorName: string | null;
};

type ParentReferences$Idea = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Community: SObjectDefinition$Community;
  LastComment: SObjectDefinition$IdeaComment | null;
  ParentIdea: SObjectDefinition$Idea | null;
};

type ChildRelationships$Idea = {
  //
  Comments: SObjectDefinition$IdeaComment;
  Votes: SObjectDefinition$Vote;
};

interface SObjectDefinition$Idea extends SObjectDefinition<'Idea'> {
    Name: 'Idea';
    Fields: Fields$Idea;
    ParentReferences: ParentReferences$Idea;
    ChildRelationships: ChildRelationships$Idea;
  }

type Fields$IdeaComment = {
  //
  Id: string;
  IdeaId: string;
  CommunityId: string | null;
  CommentBody: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  IsHtml: boolean;
  CreatorFullPhotoUrl: string | null;
  CreatorSmallPhotoUrl: string | null;
  CreatorName: string | null;
  UpVotes: number | null;
};

type ParentReferences$IdeaComment = {
  //
  Idea: SObjectDefinition$Idea;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$IdeaComment = {
  //
  Votes: SObjectDefinition$Vote;
};

interface SObjectDefinition$IdeaComment extends SObjectDefinition<'IdeaComment'> {
    Name: 'IdeaComment';
    Fields: Fields$IdeaComment;
    ParentReferences: ParentReferences$IdeaComment;
    ChildRelationships: ChildRelationships$IdeaComment;
  }

type Fields$IdpEventLog = {
  //
  Id: string;
  InitiatedBy: string;
  Timestamp: DateString | null;
  ErrorCode: string;
  SamlEntityUrl: string;
  UserId: string | null;
  AuthSessionId: string | null;
  SsoType: string | null;
  AppId: string | null;
  IdentityUsed: string | null;
  OptionsHasLogoutUrl: boolean;
};

type ParentReferences$IdpEventLog = {
  //
};

type ChildRelationships$IdpEventLog = {
  //
};

interface SObjectDefinition$IdpEventLog extends SObjectDefinition<'IdpEventLog'> {
    Name: 'IdpEventLog';
    Fields: Fields$IdpEventLog;
    ParentReferences: ParentReferences$IdpEventLog;
    ChildRelationships: ChildRelationships$IdpEventLog;
  }

type Fields$Individual = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  LastName: string;
  FirstName: string | null;
  Salutation: string | null;
  Name: string;
  HasOptedOutTracking: boolean;
  HasOptedOutProfiling: boolean;
  HasOptedOutProcessing: boolean;
  HasOptedOutSolicit: boolean;
  ShouldForget: boolean;
  SendIndividualData: boolean;
  CanStorePiiElsewhere: boolean;
  HasOptedOutGeoTracking: boolean;
  BirthDate: DateString | null;
  IndividualsAge: string | null;
  LastViewedDate: DateString | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Individual = {
  //
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Individual = {
  //
  Contacts: SObjectDefinition$Contact;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  Histories: SObjectDefinition$IndividualHistory;
  Shares: SObjectDefinition$IndividualShare;
  Leads: SObjectDefinition$Lead;
};

interface SObjectDefinition$Individual extends SObjectDefinition<'Individual'> {
    Name: 'Individual';
    Fields: Fields$Individual;
    ParentReferences: ParentReferences$Individual;
    ChildRelationships: ChildRelationships$Individual;
  }

type Fields$IndividualHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  IndividualId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$IndividualHistory = {
  //
  Individual: SObjectDefinition$Individual;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$IndividualHistory = {
  //
};

interface SObjectDefinition$IndividualHistory extends SObjectDefinition<'IndividualHistory'> {
    Name: 'IndividualHistory';
    Fields: Fields$IndividualHistory;
    ParentReferences: ParentReferences$IndividualHistory;
    ChildRelationships: ChildRelationships$IndividualHistory;
  }

type Fields$IndividualShare = {
  //
  Id: string;
  IndividualId: string;
  UserOrGroupId: string;
  IndividualAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$IndividualShare = {
  //
  Individual: SObjectDefinition$Individual;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$IndividualShare = {
  //
};

interface SObjectDefinition$IndividualShare extends SObjectDefinition<'IndividualShare'> {
    Name: 'IndividualShare';
    Fields: Fields$IndividualShare;
    ParentReferences: ParentReferences$IndividualShare;
    ChildRelationships: ChildRelationships$IndividualShare;
  }

type Fields$InstalledMobileApp = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Status: string;
  UserId: string;
  ConnectedApplicationId: string;
  Version: string | null;
};

type ParentReferences$InstalledMobileApp = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
  ConnectedApplication: SObjectDefinition$ConnectedApplication;
};

type ChildRelationships$InstalledMobileApp = {
  //
};

interface SObjectDefinition$InstalledMobileApp extends SObjectDefinition<'InstalledMobileApp'> {
    Name: 'InstalledMobileApp';
    Fields: Fields$InstalledMobileApp;
    ParentReferences: ParentReferences$InstalledMobileApp;
    ChildRelationships: ChildRelationships$InstalledMobileApp;
  }

type Fields$InvoiceItem__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Invoice__c: string | null;
  AmountWithTax__c: number | null;
  Amount__c: number | null;
  Description__c: string | null;
  IsTaxable__c: boolean;
  ListPrice__c: number | null;
  Price__c: number | null;
  Product__c: string | null;
  Quantity__c: number | null;
  TaxRate__c: number | null;
};

type ParentReferences$InvoiceItem__ChangeEvent = {
  //
};

type ChildRelationships$InvoiceItem__ChangeEvent = {
  //
};

interface SObjectDefinition$InvoiceItem__ChangeEvent extends SObjectDefinition<'InvoiceItem__ChangeEvent'> {
    Name: 'InvoiceItem__ChangeEvent';
    Fields: Fields$InvoiceItem__ChangeEvent;
    ParentReferences: ParentReferences$InvoiceItem__ChangeEvent;
    ChildRelationships: ChildRelationships$InvoiceItem__ChangeEvent;
  }

type Fields$InvoiceItem__c = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Invoice__c: string;
  AmountWithTax__c: number | null;
  Amount__c: number | null;
  Description__c: string | null;
  IsTaxable__c: boolean;
  ListPrice__c: number | null;
  Price__c: number | null;
  Product__c: string | null;
  Quantity__c: number | null;
  TaxRate__c: number | null;
};

type ParentReferences$InvoiceItem__c = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Invoice__r: SObjectDefinition$Invoice__c;
  Product__r: SObjectDefinition$Product__c | null;
};

type ChildRelationships$InvoiceItem__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$InvoiceItem__c extends SObjectDefinition<'InvoiceItem__c'> {
    Name: 'InvoiceItem__c';
    Fields: Fields$InvoiceItem__c;
    ParentReferences: ParentReferences$InvoiceItem__c;
    ChildRelationships: ChildRelationships$InvoiceItem__c;
  }

type Fields$Invoice__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Account__c: string | null;
  BallanceAmount__c: number | null;
  Contact__c: string | null;
  InvoiceDate__c: DateString | null;
  IsInvoiceSent__c: boolean;
  PaymentConfirmDate__c: DateString | null;
  TotalAmountWithTax__c: number | null;
  TotalAmount__c: number | null;
  TotalPaymentAmount__c: number | null;
};

type ParentReferences$Invoice__ChangeEvent = {
  //
};

type ChildRelationships$Invoice__ChangeEvent = {
  //
};

interface SObjectDefinition$Invoice__ChangeEvent extends SObjectDefinition<'Invoice__ChangeEvent'> {
    Name: 'Invoice__ChangeEvent';
    Fields: Fields$Invoice__ChangeEvent;
    ParentReferences: ParentReferences$Invoice__ChangeEvent;
    ChildRelationships: ChildRelationships$Invoice__ChangeEvent;
  }

type Fields$Invoice__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Account__c: string;
  BallanceAmount__c: number | null;
  Contact__c: string | null;
  InvoiceDate__c: DateString | null;
  IsInvoiceSent__c: boolean;
  PaymentConfirmDate__c: DateString | null;
  TotalAmountWithTax__c: number | null;
  TotalAmount__c: number | null;
  TotalPaymentAmount__c: number | null;
};

type ParentReferences$Invoice__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account__r: SObjectDefinition$Account;
  Contact__r: SObjectDefinition$Contact | null;
};

type ChildRelationships$Invoice__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Invoice__c extends SObjectDefinition<'Invoice__c'> {
    Name: 'Invoice__c';
    Fields: Fields$Invoice__c;
    ParentReferences: ParentReferences$Invoice__c;
    ChildRelationships: ChildRelationships$Invoice__c;
  }

type Fields$KnowledgeableUser = {
  //
  Id: string;
  UserId: string;
  TopicId: string;
  RawRank: number | null;
  SystemModstamp: DateString;
};

type ParentReferences$KnowledgeableUser = {
  //
};

type ChildRelationships$KnowledgeableUser = {
  //
};

interface SObjectDefinition$KnowledgeableUser extends SObjectDefinition<'KnowledgeableUser'> {
    Name: 'KnowledgeableUser';
    Fields: Fields$KnowledgeableUser;
    ParentReferences: ParentReferences$KnowledgeableUser;
    ChildRelationships: ChildRelationships$KnowledgeableUser;
  }

type Fields$Lead = {
  //
  Id: string;
  IsDeleted: boolean;
  MasterRecordId: string | null;
  LastName: string;
  FirstName: string | null;
  Salutation: string | null;
  Name: string;
  Title: string | null;
  Company: string;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Phone: string | null;
  MobilePhone: string | null;
  Fax: string | null;
  Email: string | null;
  Website: string | null;
  PhotoUrl: string | null;
  Description: string | null;
  LeadSource: string | null;
  Status: string;
  Industry: string | null;
  Rating: string | null;
  CurrencyIsoCode: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  OwnerId: string;
  IsConverted: boolean;
  ConvertedDate: DateString | null;
  ConvertedAccountId: string | null;
  ConvertedContactId: string | null;
  ConvertedOpportunityId: string | null;
  IsUnreadByOwner: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Jigsaw: string | null;
  JigsawContactId: string | null;
  CleanStatus: string | null;
  CompanyDunsNumber: string | null;
  DandbCompanyId: string | null;
  EmailBouncedReason: string | null;
  EmailBouncedDate: DateString | null;
  IndividualId: string | null;
};

type ParentReferences$Lead = {
  //
  MasterRecord: SObjectDefinition$Lead | null;
  Owner: SObjectDefinition$Name;
  ConvertedAccount: SObjectDefinition$Account | null;
  ConvertedContact: SObjectDefinition$Contact | null;
  ConvertedOpportunity: SObjectDefinition$Opportunity | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DandbCompany: SObjectDefinition$DandBCompany | null;
  Individual: SObjectDefinition$Individual | null;
};

type ChildRelationships$Lead = {
  //
  AcceptedEventRelations: SObjectDefinition$AcceptedEventRelation;
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CampaignMembers: SObjectDefinition$CampaignMember;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DeclinedEventRelations: SObjectDefinition$DeclinedEventRelation;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  EmailMessageRelations: SObjectDefinition$EmailMessageRelation;
  EmailStatuses: SObjectDefinition$EmailStatus;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  EventRelations: SObjectDefinition$EventRelation;
  LeadCleanInfos: SObjectDefinition$LeadCleanInfo;
  Feeds: SObjectDefinition$LeadFeed;
  Histories: SObjectDefinition$LeadHistory;
  Shares: SObjectDefinition$LeadShare;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  OutgoingEmailRelations: SObjectDefinition$OutgoingEmailRelation;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  UndecidedEventRelations: SObjectDefinition$UndecidedEventRelation;
};

interface SObjectDefinition$Lead extends SObjectDefinition<'Lead'> {
    Name: 'Lead';
    Fields: Fields$Lead;
    ParentReferences: ParentReferences$Lead;
    ChildRelationships: ChildRelationships$Lead;
  }

type Fields$LeadChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  LastName: string | null;
  FirstName: string | null;
  Salutation: string | null;
  Name: string | null;
  Title: string | null;
  Company: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Phone: string | null;
  MobilePhone: string | null;
  Fax: string | null;
  Email: string | null;
  Website: string | null;
  Description: string | null;
  LeadSource: string | null;
  Status: string | null;
  Industry: string | null;
  Rating: string | null;
  CurrencyIsoCode: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  OwnerId: string | null;
  IsConverted: boolean;
  ConvertedDate: DateString | null;
  ConvertedAccountId: string | null;
  ConvertedContactId: string | null;
  ConvertedOpportunityId: string | null;
  IsUnreadByOwner: boolean;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Jigsaw: string | null;
  JigsawContactId: string | null;
  CleanStatus: string | null;
  CompanyDunsNumber: string | null;
  DandbCompanyId: string | null;
  EmailBouncedReason: string | null;
  EmailBouncedDate: DateString | null;
  IndividualId: string | null;
};

type ParentReferences$LeadChangeEvent = {
  //
};

type ChildRelationships$LeadChangeEvent = {
  //
};

interface SObjectDefinition$LeadChangeEvent extends SObjectDefinition<'LeadChangeEvent'> {
    Name: 'LeadChangeEvent';
    Fields: Fields$LeadChangeEvent;
    ParentReferences: ParentReferences$LeadChangeEvent;
    ChildRelationships: ChildRelationships$LeadChangeEvent;
  }

type Fields$LeadCleanInfo = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LeadId: string;
  LastMatchedDate: DateString;
  LastStatusChangedDate: DateString | null;
  LastStatusChangedById: string | null;
  IsInactive: boolean;
  FirstName: string | null;
  LastName: string | null;
  Email: string | null;
  Phone: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Title: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  Industry: string | null;
  CompanyName: string | null;
  CompanyDunsNumber: string | null;
  ContactStatusDataDotCom: string | null;
  IsReviewedName: boolean;
  IsReviewedEmail: boolean;
  IsReviewedPhone: boolean;
  IsReviewedAddress: boolean;
  IsReviewedTitle: boolean;
  IsReviewedAnnualRevenue: boolean;
  IsReviewedNumberOfEmployees: boolean;
  IsReviewedIndustry: boolean;
  IsReviewedCompanyName: boolean;
  IsReviewedCompanyDunsNumber: boolean;
  IsReviewedDandBCompanyDunsNumber: boolean;
  IsDifferentFirstName: boolean;
  IsDifferentLastName: boolean;
  IsDifferentEmail: boolean;
  IsDifferentPhone: boolean;
  IsDifferentStreet: boolean;
  IsDifferentCity: boolean;
  IsDifferentState: boolean;
  IsDifferentPostalCode: boolean;
  IsDifferentCountry: boolean;
  IsDifferentTitle: boolean;
  IsDifferentAnnualRevenue: boolean;
  IsDifferentNumberOfEmployees: boolean;
  IsDifferentIndustry: boolean;
  IsDifferentCompanyName: boolean;
  IsDifferentCompanyDunsNumber: boolean;
  IsDifferentDandBCompanyDunsNumber: boolean;
  IsDifferentStateCode: boolean;
  IsDifferentCountryCode: boolean;
  CleanedByJob: boolean;
  CleanedByUser: boolean;
  DandBCompanyDunsNumber: string | null;
  DataDotComCompanyId: string | null;
  IsFlaggedWrongName: boolean;
  IsFlaggedWrongEmail: boolean;
  IsFlaggedWrongPhone: boolean;
  IsFlaggedWrongAddress: boolean;
  IsFlaggedWrongTitle: boolean;
  IsFlaggedWrongAnnualRevenue: boolean;
  IsFlaggedWrongNumberOfEmployees: boolean;
  IsFlaggedWrongIndustry: boolean;
  IsFlaggedWrongCompanyName: boolean;
  IsFlaggedWrongCompanyDunsNumber: boolean;
  DataDotComId: string | null;
};

type ParentReferences$LeadCleanInfo = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Lead: SObjectDefinition$Lead;
  LastStatusChangedBy: SObjectDefinition$User | null;
};

type ChildRelationships$LeadCleanInfo = {
  //
};

interface SObjectDefinition$LeadCleanInfo extends SObjectDefinition<'LeadCleanInfo'> {
    Name: 'LeadCleanInfo';
    Fields: Fields$LeadCleanInfo;
    ParentReferences: ParentReferences$LeadCleanInfo;
    ChildRelationships: ChildRelationships$LeadCleanInfo;
  }

type Fields$LeadFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$LeadFeed = {
  //
  Parent: SObjectDefinition$Lead;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$LeadFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$LeadFeed extends SObjectDefinition<'LeadFeed'> {
    Name: 'LeadFeed';
    Fields: Fields$LeadFeed;
    ParentReferences: ParentReferences$LeadFeed;
    ChildRelationships: ChildRelationships$LeadFeed;
  }

type Fields$LeadHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  LeadId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$LeadHistory = {
  //
  Lead: SObjectDefinition$Lead;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$LeadHistory = {
  //
};

interface SObjectDefinition$LeadHistory extends SObjectDefinition<'LeadHistory'> {
    Name: 'LeadHistory';
    Fields: Fields$LeadHistory;
    ParentReferences: ParentReferences$LeadHistory;
    ChildRelationships: ChildRelationships$LeadHistory;
  }

type Fields$LeadShare = {
  //
  Id: string;
  LeadId: string;
  UserOrGroupId: string;
  LeadAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$LeadShare = {
  //
  Lead: SObjectDefinition$Lead;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$LeadShare = {
  //
};

interface SObjectDefinition$LeadShare extends SObjectDefinition<'LeadShare'> {
    Name: 'LeadShare';
    Fields: Fields$LeadShare;
    ParentReferences: ParentReferences$LeadShare;
    ChildRelationships: ChildRelationships$LeadShare;
  }

type Fields$LeadStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  IsConverted: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$LeadStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$LeadStatus = {
  //
};

interface SObjectDefinition$LeadStatus extends SObjectDefinition<'LeadStatus'> {
    Name: 'LeadStatus';
    Fields: Fields$LeadStatus;
    ParentReferences: ParentReferences$LeadStatus;
    ChildRelationships: ChildRelationships$LeadStatus;
  }

type Fields$LightningExperienceTheme = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DefaultBrandingSetId: string | null;
  ShouldOverrideLoadingImage: boolean;
  Description: string | null;
};

type ParentReferences$LightningExperienceTheme = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DefaultBrandingSet: SObjectDefinition$BrandingSet | null;
};

type ChildRelationships$LightningExperienceTheme = {
  //
};

interface SObjectDefinition$LightningExperienceTheme extends SObjectDefinition<'LightningExperienceTheme'> {
    Name: 'LightningExperienceTheme';
    Fields: Fields$LightningExperienceTheme;
    ParentReferences: ParentReferences$LightningExperienceTheme;
    ChildRelationships: ChildRelationships$LightningExperienceTheme;
  }

type Fields$ListEmail = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Subject: string | null;
  HtmlBody: string | null;
  TextBody: string | null;
  FromName: string | null;
  FromAddress: string;
  Status: string;
  HasAttachment: boolean;
  ScheduledDate: DateString | null;
  TotalSent: number | null;
  CampaignId: string | null;
};

type ParentReferences$ListEmail = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Campaign: SObjectDefinition$Campaign | null;
};

type ChildRelationships$ListEmail = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  Tasks: SObjectDefinition$Task;
};

interface SObjectDefinition$ListEmail extends SObjectDefinition<'ListEmail'> {
    Name: 'ListEmail';
    Fields: Fields$ListEmail;
    ParentReferences: ParentReferences$ListEmail;
    ChildRelationships: ChildRelationships$ListEmail;
  }

type Fields$ListEmailChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Subject: string | null;
  HtmlBody: string | null;
  TextBody: string | null;
  FromName: string | null;
  FromAddress: string | null;
  Status: string | null;
  HasAttachment: boolean;
  ScheduledDate: DateString | null;
  TotalSent: number | null;
  CampaignId: string | null;
};

type ParentReferences$ListEmailChangeEvent = {
  //
};

type ChildRelationships$ListEmailChangeEvent = {
  //
};

interface SObjectDefinition$ListEmailChangeEvent extends SObjectDefinition<'ListEmailChangeEvent'> {
    Name: 'ListEmailChangeEvent';
    Fields: Fields$ListEmailChangeEvent;
    ParentReferences: ParentReferences$ListEmailChangeEvent;
    ChildRelationships: ChildRelationships$ListEmailChangeEvent;
  }

type Fields$ListEmailRecipientSource = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ListEmailId: string;
  SourceListId: string;
  SourceType: string;
};

type ParentReferences$ListEmailRecipientSource = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ListEmail: SObjectDefinition$ListEmail;
  SourceList: SObjectDefinition$Name;
};

type ChildRelationships$ListEmailRecipientSource = {
  //
};

interface SObjectDefinition$ListEmailRecipientSource extends SObjectDefinition<'ListEmailRecipientSource'> {
    Name: 'ListEmailRecipientSource';
    Fields: Fields$ListEmailRecipientSource;
    ParentReferences: ParentReferences$ListEmailRecipientSource;
    ChildRelationships: ChildRelationships$ListEmailRecipientSource;
  }

type Fields$ListEmailShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ListEmailShare = {
  //
  Parent: SObjectDefinition$ListEmail;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ListEmailShare = {
  //
};

interface SObjectDefinition$ListEmailShare extends SObjectDefinition<'ListEmailShare'> {
    Name: 'ListEmailShare';
    Fields: Fields$ListEmailShare;
    ParentReferences: ParentReferences$ListEmailShare;
    ChildRelationships: ChildRelationships$ListEmailShare;
  }

type Fields$ListView = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  NamespacePrefix: string | null;
  SobjectType: string | null;
  IsSoqlCompatible: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$ListView = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ListView = {
  //
  ListEmailRecipientSources: SObjectDefinition$ListEmailRecipientSource;
};

interface SObjectDefinition$ListView extends SObjectDefinition<'ListView'> {
    Name: 'ListView';
    Fields: Fields$ListView;
    ParentReferences: ParentReferences$ListView;
    ChildRelationships: ChildRelationships$ListView;
  }

type Fields$ListViewChart = {
  //
  Id: string;
  IsDeleted: boolean;
  SobjectType: string;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  OwnerId: string;
  ChartType: string;
  GroupingField: string | null;
  AggregateField: string | null;
  AggregateType: string;
};

type ParentReferences$ListViewChart = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Owner: SObjectDefinition$User;
};

type ChildRelationships$ListViewChart = {
  //
};

interface SObjectDefinition$ListViewChart extends SObjectDefinition<'ListViewChart'> {
    Name: 'ListViewChart';
    Fields: Fields$ListViewChart;
    ParentReferences: ParentReferences$ListViewChart;
    ChildRelationships: ChildRelationships$ListViewChart;
  }

type Fields$ListViewChartInstance = {
  //
  Id: string;
  ExternalId: string | null;
  ListViewChartId: string;
  Label: string;
  DeveloperName: string;
  SourceEntity: string;
  ListViewContextId: string;
  ChartType: string;
  IsLastViewed: boolean;
  DataQuery: string | null;
  DataQueryWithoutUserFilters: string | null;
  IsEditable: boolean;
  IsDeletable: boolean;
  GroupingField: string;
  AggregateField: string;
  AggregateType: string;
};

type ParentReferences$ListViewChartInstance = {
  //
  ListViewChart: SObjectDefinition$ListViewChart;
  ListViewContext: SObjectDefinition$ListView;
};

type ChildRelationships$ListViewChartInstance = {
  //
};

interface SObjectDefinition$ListViewChartInstance extends SObjectDefinition<'ListViewChartInstance'> {
    Name: 'ListViewChartInstance';
    Fields: Fields$ListViewChartInstance;
    ParentReferences: ParentReferences$ListViewChartInstance;
    ChildRelationships: ChildRelationships$ListViewChartInstance;
  }

type Fields$LocalGov__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  RecordTypeId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Account__c: string | null;
  IsGrantTarget__c: boolean;
  Pref__c: string | null;
  Rank__c: string | null;
  Region__c: string | null;
  Type__c: string | null;
};

type ParentReferences$LocalGov__ChangeEvent = {
  //
};

type ChildRelationships$LocalGov__ChangeEvent = {
  //
};

interface SObjectDefinition$LocalGov__ChangeEvent extends SObjectDefinition<'LocalGov__ChangeEvent'> {
    Name: 'LocalGov__ChangeEvent';
    Fields: Fields$LocalGov__ChangeEvent;
    ParentReferences: ParentReferences$LocalGov__ChangeEvent;
    ChildRelationships: ChildRelationships$LocalGov__ChangeEvent;
  }

type Fields$LocalGov__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$LocalGov__Share = {
  //
  Parent: SObjectDefinition$LocalGov__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$LocalGov__Share = {
  //
};

interface SObjectDefinition$LocalGov__Share extends SObjectDefinition<'LocalGov__Share'> {
    Name: 'LocalGov__Share';
    Fields: Fields$LocalGov__Share;
    ParentReferences: ParentReferences$LocalGov__Share;
    ChildRelationships: ChildRelationships$LocalGov__Share;
  }

type Fields$LocalGov__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  RecordTypeId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Account__c: string | null;
  IsGrantTarget__c: boolean;
  Pref__c: string | null;
  Rank__c: string | null;
  Region__c: string;
  Type__c: string | null;
};

type ParentReferences$LocalGov__c = {
  //
  Owner: SObjectDefinition$Name;
  RecordType: SObjectDefinition$RecordType | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account__r: SObjectDefinition$Account | null;
};

type ChildRelationships$LocalGov__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Shares: SObjectDefinition$LocalGov__Share;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$LocalGov__c extends SObjectDefinition<'LocalGov__c'> {
    Name: 'LocalGov__c';
    Fields: Fields$LocalGov__c;
    ParentReferences: ParentReferences$LocalGov__c;
    ChildRelationships: ChildRelationships$LocalGov__c;
  }

type Fields$Location = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  LocationType: string;
  Latitude: number | null;
  Longitude: number | null;
  Location: string | null;
  Description: string | null;
  DrivingDirections: string | null;
  TimeZone: string | null;
  ParentLocationId: string | null;
  PossessionDate: DateString | null;
  ConstructionStartDate: DateString | null;
  ConstructionEndDate: DateString | null;
  OpenDate: DateString | null;
  CloseDate: DateString | null;
  RemodelStartDate: DateString | null;
  RemodelEndDate: DateString | null;
  IsMobile: boolean;
  IsInventoryLocation: boolean;
  VisitorAddressId: string | null;
  RootLocationId: string | null;
  LocationLevel: number | null;
};

type ParentReferences$Location = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentLocation: SObjectDefinition$Location | null;
  VisitorAddress: SObjectDefinition$Address | null;
  RootLocation: SObjectDefinition$Location | null;
};

type ChildRelationships$Location = {
  //
  Addresses: SObjectDefinition$Address;
  Assets: SObjectDefinition$Asset;
  AssociatedLocations: SObjectDefinition$AssociatedLocation;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ChildLocations: SObjectDefinition$Location;
  Feeds: SObjectDefinition$LocationFeed;
  Histories: SObjectDefinition$LocationHistory;
  MaintenancePlans: SObjectDefinition$MaintenancePlan;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductItems: SObjectDefinition$ProductItem;
  DestinationProductRequests: SObjectDefinition$ProductRequest;
  SourceProductRequests: SObjectDefinition$ProductRequest;
  DestinationProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  SourceProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  DestinationProductTransfers: SObjectDefinition$ProductTransfer;
  SourceProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  DestinationReturnOrders: SObjectDefinition$ReturnOrder;
  SourceReturnOrders: SObjectDefinition$ReturnOrder;
  DestinationReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  SourceReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  ServiceResources: SObjectDefinition$ServiceResource;
  ServiceTerritories: SObjectDefinition$ServiceTerritoryLocation;
  DestinationLocationShipments: SObjectDefinition$Shipment;
  SourceLocationShipments: SObjectDefinition$Shipment;
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$Location extends SObjectDefinition<'Location'> {
    Name: 'Location';
    Fields: Fields$Location;
    ParentReferences: ParentReferences$Location;
    ChildRelationships: ChildRelationships$Location;
  }

type Fields$LocationFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$LocationFeed = {
  //
  Parent: SObjectDefinition$Location;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$LocationFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$LocationFeed extends SObjectDefinition<'LocationFeed'> {
    Name: 'LocationFeed';
    Fields: Fields$LocationFeed;
    ParentReferences: ParentReferences$LocationFeed;
    ChildRelationships: ChildRelationships$LocationFeed;
  }

type Fields$LocationHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  LocationId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$LocationHistory = {
  //
  Location: SObjectDefinition$Location;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$LocationHistory = {
  //
};

interface SObjectDefinition$LocationHistory extends SObjectDefinition<'LocationHistory'> {
    Name: 'LocationHistory';
    Fields: Fields$LocationHistory;
    ParentReferences: ParentReferences$LocationHistory;
    ChildRelationships: ChildRelationships$LocationHistory;
  }

type Fields$LocationShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$LocationShare = {
  //
  Parent: SObjectDefinition$Location;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$LocationShare = {
  //
};

interface SObjectDefinition$LocationShare extends SObjectDefinition<'LocationShare'> {
    Name: 'LocationShare';
    Fields: Fields$LocationShare;
    ParentReferences: ParentReferences$LocationShare;
    ChildRelationships: ChildRelationships$LocationShare;
  }

type Fields$LoginEvent = {
  //
  Id: string;
  CreatedDate: DateString;
  EventIdentifier: string;
  UserId: string | null;
  Username: string | null;
  EventDate: DateString;
  RelatedEventIdentifier: string | null;
  PolicyId: string | null;
  PolicyOutcome: string | null;
  EvaluationTime: number | null;
  SessionKey: string | null;
  LoginKey: string | null;
  SessionLevel: string | null;
  SourceIp: string | null;
  AdditionalInfo: string | null;
  ApiType: string | null;
  ApiVersion: string | null;
  Application: string | null;
  AuthServiceId: string | null;
  Browser: string | null;
  CipherSuite: string | null;
  ClientVersion: string | null;
  LoginGeoId: string | null;
  LoginHistoryId: string | null;
  LoginType: string | null;
  LoginUrl: string | null;
  Platform: string | null;
  Status: string | null;
  TlsProtocol: string | null;
  UserType: string | null;
};

type ParentReferences$LoginEvent = {
  //
  User: SObjectDefinition$User | null;
  Policy: SObjectDefinition$TransactionSecurityPolicy | null;
};

type ChildRelationships$LoginEvent = {
  //
};

interface SObjectDefinition$LoginEvent extends SObjectDefinition<'LoginEvent'> {
    Name: 'LoginEvent';
    Fields: Fields$LoginEvent;
    ParentReferences: ParentReferences$LoginEvent;
    ChildRelationships: ChildRelationships$LoginEvent;
  }

type Fields$LoginGeo = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  IsDeleted: boolean;
  SystemModstamp: DateString;
  LoginTime: DateString;
  CountryIso: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  City: string | null;
  PostalCode: string | null;
  Subdivision: string | null;
};

type ParentReferences$LoginGeo = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$LoginGeo = {
  //
};

interface SObjectDefinition$LoginGeo extends SObjectDefinition<'LoginGeo'> {
    Name: 'LoginGeo';
    Fields: Fields$LoginGeo;
    ParentReferences: ParentReferences$LoginGeo;
    ChildRelationships: ChildRelationships$LoginGeo;
  }

type Fields$LoginHistory = {
  //
  Id: string;
  UserId: string | null;
  LoginTime: DateString;
  LoginType: string;
  SourceIp: string | null;
  LoginUrl: string | null;
  AuthenticationServiceId: string | null;
  LoginGeoId: string | null;
  TlsProtocol: string | null;
  CipherSuite: string | null;
  Browser: string | null;
  Platform: string | null;
  Status: string | null;
  Application: string | null;
  ClientVersion: string | null;
  ApiType: string | null;
  ApiVersion: string | null;
  CountryIso: string | null;
};

type ParentReferences$LoginHistory = {
  //
  LoginGeo: SObjectDefinition$LoginGeo | null;
};

type ChildRelationships$LoginHistory = {
  //
};

interface SObjectDefinition$LoginHistory extends SObjectDefinition<'LoginHistory'> {
    Name: 'LoginHistory';
    Fields: Fields$LoginHistory;
    ParentReferences: ParentReferences$LoginHistory;
    ChildRelationships: ChildRelationships$LoginHistory;
  }

type Fields$LoginIp = {
  //
  Id: string;
  UsersId: string;
  SourceIp: string | null;
  CreatedDate: DateString;
  IsAuthenticated: boolean;
  ChallengeSentDate: DateString | null;
  ChallengeMethod: string | null;
};

type ParentReferences$LoginIp = {
  //
  Users: SObjectDefinition$User;
};

type ChildRelationships$LoginIp = {
  //
};

interface SObjectDefinition$LoginIp extends SObjectDefinition<'LoginIp'> {
    Name: 'LoginIp';
    Fields: Fields$LoginIp;
    ParentReferences: ParentReferences$LoginIp;
    ChildRelationships: ChildRelationships$LoginIp;
  }

type Fields$LogoutEventStream = {
  //
  ReplayId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  EventIdentifier: string | null;
  UserId: string | null;
  Username: string | null;
  EventDate: DateString | null;
  RelatedEventIdentifier: string | null;
  SessionKey: string | null;
  LoginKey: string | null;
  SessionLevel: string | null;
  SourceIp: string | null;
};

type ParentReferences$LogoutEventStream = {
  //
  CreatedBy: SObjectDefinition$User;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$LogoutEventStream = {
  //
};

interface SObjectDefinition$LogoutEventStream extends SObjectDefinition<'LogoutEventStream'> {
    Name: 'LogoutEventStream';
    Fields: Fields$LogoutEventStream;
    ParentReferences: ParentReferences$LogoutEventStream;
    ChildRelationships: ChildRelationships$LogoutEventStream;
  }

type Fields$LookedUpFromActivity = {
  //
  Id: string;
  AccountId: string | null;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  IsTask: boolean;
  ActivityDate: DateString | null;
  OwnerId: string | null;
  Status: string | null;
  Priority: string | null;
  IsHighPriority: boolean;
  ActivityType: string | null;
  IsClosed: boolean;
  IsAllDayEvent: boolean;
  IsVisibleInSelfService: boolean;
  DurationInMinutes: number | null;
  Location: string | null;
  Description: string | null;
  CurrencyIsoCode: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CallDurationInSeconds: number | null;
  CallType: string | null;
  CallDisposition: string | null;
  CallObject: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
  EndDateTime: DateString | null;
  StartDateTime: DateString | null;
  ActivitySubtype: string | null;
};

type ParentReferences$LookedUpFromActivity = {
  //
  Account: SObjectDefinition$Account | null;
  Who: SObjectDefinition$Name | null;
  What: SObjectDefinition$Name | null;
  Owner: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$LookedUpFromActivity = {
  //
};

interface SObjectDefinition$LookedUpFromActivity extends SObjectDefinition<'LookedUpFromActivity'> {
    Name: 'LookedUpFromActivity';
    Fields: Fields$LookedUpFromActivity;
    ParentReferences: ParentReferences$LookedUpFromActivity;
    ChildRelationships: ChildRelationships$LookedUpFromActivity;
  }

type Fields$Macro = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Description: string | null;
  IsAlohaSupported: boolean;
  IsLightningSupported: boolean;
  StartingContext: string | null;
};

type ParentReferences$Macro = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Macro = {
  //
  Histories: SObjectDefinition$MacroHistory;
};

interface SObjectDefinition$Macro extends SObjectDefinition<'Macro'> {
    Name: 'Macro';
    Fields: Fields$Macro;
    ParentReferences: ParentReferences$Macro;
    ChildRelationships: ChildRelationships$Macro;
  }

type Fields$MacroHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  MacroId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$MacroHistory = {
  //
  Macro: SObjectDefinition$Macro;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$MacroHistory = {
  //
};

interface SObjectDefinition$MacroHistory extends SObjectDefinition<'MacroHistory'> {
    Name: 'MacroHistory';
    Fields: Fields$MacroHistory;
    ParentReferences: ParentReferences$MacroHistory;
    ChildRelationships: ChildRelationships$MacroHistory;
  }

type Fields$MacroInstruction = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  MacroId: string;
  Operation: string;
  Target: string | null;
  Value: string | null;
  ValueRecord: string | null;
  SortOrder: number;
};

type ParentReferences$MacroInstruction = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Macro: SObjectDefinition$Macro;
};

type ChildRelationships$MacroInstruction = {
  //
};

interface SObjectDefinition$MacroInstruction extends SObjectDefinition<'MacroInstruction'> {
    Name: 'MacroInstruction';
    Fields: Fields$MacroInstruction;
    ParentReferences: ParentReferences$MacroInstruction;
    ChildRelationships: ChildRelationships$MacroInstruction;
  }

type Fields$MacroShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$MacroShare = {
  //
  Parent: SObjectDefinition$Macro;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MacroShare = {
  //
};

interface SObjectDefinition$MacroShare extends SObjectDefinition<'MacroShare'> {
    Name: 'MacroShare';
    Fields: Fields$MacroShare;
    ParentReferences: ParentReferences$MacroShare;
    ChildRelationships: ChildRelationships$MacroShare;
  }

type Fields$MailmergeTemplate = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  Description: string | null;
  Filename: string;
  BodyLength: number | null;
  Body: BlobString;
  LastUsedDate: DateString | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SecurityOptionsAttachmentScannedForXSS: boolean;
  SecurityOptionsAttachmentHasXSSThreat: boolean;
  SecurityOptionsAttachmentScannedforFlash: boolean;
  SecurityOptionsAttachmentHasFlash: boolean;
};

type ParentReferences$MailmergeTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MailmergeTemplate = {
  //
};

interface SObjectDefinition$MailmergeTemplate extends SObjectDefinition<'MailmergeTemplate'> {
    Name: 'MailmergeTemplate';
    Fields: Fields$MailmergeTemplate;
    ParentReferences: ParentReferences$MailmergeTemplate;
    ChildRelationships: ChildRelationships$MailmergeTemplate;
  }

type Fields$MaintenanceAsset = {
  //
  Id: string;
  IsDeleted: boolean;
  MaintenanceAssetNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  MaintenancePlanId: string;
  AssetId: string;
  WorkTypeId: string | null;
  NextSuggestedMaintenanceDate: DateString | null;
};

type ParentReferences$MaintenanceAsset = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  MaintenancePlan: SObjectDefinition$MaintenancePlan;
  Asset: SObjectDefinition$Asset;
  WorkType: SObjectDefinition$WorkType | null;
};

type ChildRelationships$MaintenanceAsset = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Feeds: SObjectDefinition$MaintenanceAssetFeed;
  Histories: SObjectDefinition$MaintenanceAssetHistory;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$MaintenanceAsset extends SObjectDefinition<'MaintenanceAsset'> {
    Name: 'MaintenanceAsset';
    Fields: Fields$MaintenanceAsset;
    ParentReferences: ParentReferences$MaintenanceAsset;
    ChildRelationships: ChildRelationships$MaintenanceAsset;
  }

type Fields$MaintenanceAssetFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$MaintenanceAssetFeed = {
  //
  Parent: SObjectDefinition$MaintenanceAsset;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$MaintenanceAssetFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$MaintenanceAssetFeed extends SObjectDefinition<'MaintenanceAssetFeed'> {
    Name: 'MaintenanceAssetFeed';
    Fields: Fields$MaintenanceAssetFeed;
    ParentReferences: ParentReferences$MaintenanceAssetFeed;
    ChildRelationships: ChildRelationships$MaintenanceAssetFeed;
  }

type Fields$MaintenanceAssetHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  MaintenanceAssetId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$MaintenanceAssetHistory = {
  //
  MaintenanceAsset: SObjectDefinition$MaintenanceAsset;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$MaintenanceAssetHistory = {
  //
};

interface SObjectDefinition$MaintenanceAssetHistory extends SObjectDefinition<'MaintenanceAssetHistory'> {
    Name: 'MaintenanceAssetHistory';
    Fields: Fields$MaintenanceAssetHistory;
    ParentReferences: ParentReferences$MaintenanceAssetHistory;
    ChildRelationships: ChildRelationships$MaintenanceAssetHistory;
  }

type Fields$MaintenancePlan = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  MaintenancePlanNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  WorkTypeId: string | null;
  AccountId: string | null;
  FrequencyType: string;
  Frequency: number;
  StartDate: DateString;
  EndDate: DateString | null;
  NextSuggestedMaintenanceDate: DateString;
  MaintenanceWindowStartDays: number | null;
  MaintenanceWindowEndDays: number | null;
  WorkOrderGenerationStatus: string | null;
  GenerationTimeframeType: string;
  GenerationTimeframe: number;
  Description: string | null;
  LocationId: string | null;
  ContactId: string | null;
  MaintenancePlanTitle: string | null;
  GenerationHorizon: number | null;
  DoesGenerateUponCompletion: boolean;
  DoesAutoGenerateWorkOrders: boolean;
};

type ParentReferences$MaintenancePlan = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  WorkType: SObjectDefinition$WorkType | null;
  Account: SObjectDefinition$Account | null;
  Location: SObjectDefinition$Location | null;
  Contact: SObjectDefinition$Contact | null;
};

type ChildRelationships$MaintenancePlan = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  MaintenanceAssets: SObjectDefinition$MaintenanceAsset;
  Feeds: SObjectDefinition$MaintenancePlanFeed;
  Histories: SObjectDefinition$MaintenancePlanHistory;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$MaintenancePlan extends SObjectDefinition<'MaintenancePlan'> {
    Name: 'MaintenancePlan';
    Fields: Fields$MaintenancePlan;
    ParentReferences: ParentReferences$MaintenancePlan;
    ChildRelationships: ChildRelationships$MaintenancePlan;
  }

type Fields$MaintenancePlanFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$MaintenancePlanFeed = {
  //
  Parent: SObjectDefinition$MaintenancePlan;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$MaintenancePlanFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$MaintenancePlanFeed extends SObjectDefinition<'MaintenancePlanFeed'> {
    Name: 'MaintenancePlanFeed';
    Fields: Fields$MaintenancePlanFeed;
    ParentReferences: ParentReferences$MaintenancePlanFeed;
    ChildRelationships: ChildRelationships$MaintenancePlanFeed;
  }

type Fields$MaintenancePlanHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  MaintenancePlanId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$MaintenancePlanHistory = {
  //
  MaintenancePlan: SObjectDefinition$MaintenancePlan;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$MaintenancePlanHistory = {
  //
};

interface SObjectDefinition$MaintenancePlanHistory extends SObjectDefinition<'MaintenancePlanHistory'> {
    Name: 'MaintenancePlanHistory';
    Fields: Fields$MaintenancePlanHistory;
    ParentReferences: ParentReferences$MaintenancePlanHistory;
    ChildRelationships: ChildRelationships$MaintenancePlanHistory;
  }

type Fields$MaintenancePlanShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$MaintenancePlanShare = {
  //
  Parent: SObjectDefinition$MaintenancePlan;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MaintenancePlanShare = {
  //
};

interface SObjectDefinition$MaintenancePlanShare extends SObjectDefinition<'MaintenancePlanShare'> {
    Name: 'MaintenancePlanShare';
    Fields: Fields$MaintenancePlanShare;
    ParentReferences: ParentReferences$MaintenancePlanShare;
    ChildRelationships: ChildRelationships$MaintenancePlanShare;
  }

type Fields$MatchingInformation = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  EmailAddress: string | null;
  ExternalId: string | null;
  SFDCIdId: string | null;
  IsPickedAsPreferred: boolean;
  UserId: string | null;
  PreferenceUsed: string | null;
};

type ParentReferences$MatchingInformation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SFDCId: SObjectDefinition$Contact | null;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$MatchingInformation = {
  //
};

interface SObjectDefinition$MatchingInformation extends SObjectDefinition<'MatchingInformation'> {
    Name: 'MatchingInformation';
    Fields: Fields$MatchingInformation;
    ParentReferences: ParentReferences$MatchingInformation;
    ChildRelationships: ChildRelationships$MatchingInformation;
  }

type Fields$MatchingRule = {
  //
  Id: string;
  IsDeleted: boolean;
  SobjectType: string;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  MatchEngine: string | null;
  BooleanFilter: string | null;
  Description: string | null;
  RuleStatus: string;
  SobjectSubtype: string | null;
};

type ParentReferences$MatchingRule = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MatchingRule = {
  //
  MatchingRuleItems: SObjectDefinition$MatchingRuleItem;
};

interface SObjectDefinition$MatchingRule extends SObjectDefinition<'MatchingRule'> {
    Name: 'MatchingRule';
    Fields: Fields$MatchingRule;
    ParentReferences: ParentReferences$MatchingRule;
    ChildRelationships: ChildRelationships$MatchingRule;
  }

type Fields$MatchingRuleItem = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  MatchingRuleId: string;
  SortOrder: number;
  Field: string | null;
  MatchingMethod: string | null;
  BlankValueBehavior: string;
};

type ParentReferences$MatchingRuleItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  MatchingRule: SObjectDefinition$MatchingRule;
};

type ChildRelationships$MatchingRuleItem = {
  //
};

interface SObjectDefinition$MatchingRuleItem extends SObjectDefinition<'MatchingRuleItem'> {
    Name: 'MatchingRuleItem';
    Fields: Fields$MatchingRuleItem;
    ParentReferences: ParentReferences$MatchingRuleItem;
    ChildRelationships: ChildRelationships$MatchingRuleItem;
  }

type Fields$MobileApplicationDetail = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Version: string;
  DevicePlatform: string;
  MinimumOsVersion: string | null;
  DeviceType: string | null;
  ApplicationFileLength: number | null;
  ApplicationIcon: string | null;
  IsEnterpriseApp: boolean;
  AppInstallUrl: string | null;
  ApplicationBundleIdentifier: string | null;
  ApplicationBinaryFileName: string | null;
  ApplicationIconFileName: string | null;
  ApplicationBinary: BlobString | null;
};

type ParentReferences$MobileApplicationDetail = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MobileApplicationDetail = {
  //
};

interface SObjectDefinition$MobileApplicationDetail extends SObjectDefinition<'MobileApplicationDetail'> {
    Name: 'MobileApplicationDetail';
    Fields: Fields$MobileApplicationDetail;
    ParentReferences: ParentReferences$MobileApplicationDetail;
    ChildRelationships: ChildRelationships$MobileApplicationDetail;
  }

type Fields$MobileSettingsAssignment = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  FieldServiceMobileSettingsId: string;
  ProfileId: string | null;
};

type ParentReferences$MobileSettingsAssignment = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  FieldServiceMobileSettings: SObjectDefinition$FieldServiceMobileSettings;
  Profile: SObjectDefinition$Profile | null;
};

type ChildRelationships$MobileSettingsAssignment = {
  //
};

interface SObjectDefinition$MobileSettingsAssignment extends SObjectDefinition<'MobileSettingsAssignment'> {
    Name: 'MobileSettingsAssignment';
    Fields: Fields$MobileSettingsAssignment;
    ParentReferences: ParentReferences$MobileSettingsAssignment;
    ChildRelationships: ChildRelationships$MobileSettingsAssignment;
  }

type Fields$MsmxBook__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Config__c: string | null;
  Folder__c: string | null;
  SharedTo__c: string | null;
};

type ParentReferences$MsmxBook__ChangeEvent = {
  //
};

type ChildRelationships$MsmxBook__ChangeEvent = {
  //
};

interface SObjectDefinition$MsmxBook__ChangeEvent extends SObjectDefinition<'MsmxBook__ChangeEvent'> {
    Name: 'MsmxBook__ChangeEvent';
    Fields: Fields$MsmxBook__ChangeEvent;
    ParentReferences: ParentReferences$MsmxBook__ChangeEvent;
    ChildRelationships: ChildRelationships$MsmxBook__ChangeEvent;
  }

type Fields$MsmxBook__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$MsmxBook__Share = {
  //
  Parent: SObjectDefinition$MsmxBook__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MsmxBook__Share = {
  //
};

interface SObjectDefinition$MsmxBook__Share extends SObjectDefinition<'MsmxBook__Share'> {
    Name: 'MsmxBook__Share';
    Fields: Fields$MsmxBook__Share;
    ParentReferences: ParentReferences$MsmxBook__Share;
    ChildRelationships: ChildRelationships$MsmxBook__Share;
  }

type Fields$MsmxBook__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Config__c: string | null;
  Folder__c: string | null;
  SharedTo__c: string | null;
};

type ParentReferences$MsmxBook__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Folder__r: SObjectDefinition$MsmxFolder__c | null;
};

type ChildRelationships$MsmxBook__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Shares: SObjectDefinition$MsmxBook__Share;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$MsmxBook__c extends SObjectDefinition<'MsmxBook__c'> {
    Name: 'MsmxBook__c';
    Fields: Fields$MsmxBook__c;
    ParentReferences: ParentReferences$MsmxBook__c;
    ChildRelationships: ChildRelationships$MsmxBook__c;
  }

type Fields$MsmxFolder__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Account__c: string | null;
  SharedTo__c: string | null;
};

type ParentReferences$MsmxFolder__ChangeEvent = {
  //
};

type ChildRelationships$MsmxFolder__ChangeEvent = {
  //
};

interface SObjectDefinition$MsmxFolder__ChangeEvent extends SObjectDefinition<'MsmxFolder__ChangeEvent'> {
    Name: 'MsmxFolder__ChangeEvent';
    Fields: Fields$MsmxFolder__ChangeEvent;
    ParentReferences: ParentReferences$MsmxFolder__ChangeEvent;
    ChildRelationships: ChildRelationships$MsmxFolder__ChangeEvent;
  }

type Fields$MsmxFolder__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$MsmxFolder__Share = {
  //
  Parent: SObjectDefinition$MsmxFolder__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MsmxFolder__Share = {
  //
};

interface SObjectDefinition$MsmxFolder__Share extends SObjectDefinition<'MsmxFolder__Share'> {
    Name: 'MsmxFolder__Share';
    Fields: Fields$MsmxFolder__Share;
    ParentReferences: ParentReferences$MsmxFolder__Share;
    ChildRelationships: ChildRelationships$MsmxFolder__Share;
  }

type Fields$MsmxFolder__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Account__c: string | null;
  SharedTo__c: string | null;
};

type ParentReferences$MsmxFolder__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account__r: SObjectDefinition$Account | null;
};

type ChildRelationships$MsmxFolder__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Shares: SObjectDefinition$MsmxFolder__Share;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$MsmxFolder__c extends SObjectDefinition<'MsmxFolder__c'> {
    Name: 'MsmxFolder__c';
    Fields: Fields$MsmxFolder__c;
    ParentReferences: ParentReferences$MsmxFolder__c;
    ChildRelationships: ChildRelationships$MsmxFolder__c;
  }

type Fields$MsmxInstantData__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Book__c: string | null;
  Checkbox01__c: boolean;
  Checkbox02__c: boolean;
  Checkbox03__c: boolean;
  Checkbox04__c: boolean;
  Checkbox05__c: boolean;
  Checkbox06__c: boolean;
  Checkbox07__c: boolean;
  Checkbox08__c: boolean;
  Checkbox09__c: boolean;
  Checkbox10__c: boolean;
  Date01__c: DateString | null;
  Date02__c: DateString | null;
  Date03__c: DateString | null;
  Date04__c: DateString | null;
  Date05__c: DateString | null;
  Date06__c: DateString | null;
  Date07__c: DateString | null;
  Date08__c: DateString | null;
  Date09__c: DateString | null;
  Date10__c: DateString | null;
  Datetime01__c: DateString | null;
  Datetime02__c: DateString | null;
  Datetime03__c: DateString | null;
  Datetime04__c: DateString | null;
  Datetime05__c: DateString | null;
  Datetime06__c: DateString | null;
  Datetime07__c: DateString | null;
  Datetime08__c: DateString | null;
  Datetime09__c: DateString | null;
  Datetime10__c: DateString | null;
  Number01__c: number | null;
  Number02__c: number | null;
  Number03__c: number | null;
  Number04__c: number | null;
  Number05__c: number | null;
  Number06__c: number | null;
  Number07__c: number | null;
  Number08__c: number | null;
  Number09__c: number | null;
  Number10__c: number | null;
  Parent__c: string | null;
  RecordKey__c: string | null;
  SheetKey__c: string | null;
  Sheet__c: string | null;
  Text01__c: string | null;
  Text02__c: string | null;
  Text03__c: string | null;
  Text04__c: string | null;
  Text05__c: string | null;
  Text06__c: string | null;
  Text07__c: string | null;
  Text08__c: string | null;
  Text09__c: string | null;
  Text10__c: string | null;
  Textarea01__c: string | null;
  Textarea02__c: string | null;
  Textarea03__c: string | null;
  Textarea04__c: string | null;
  Textarea05__c: string | null;
  Textarea06__c: string | null;
  Textarea07__c: string | null;
  Textarea08__c: string | null;
  Textarea09__c: string | null;
  Textarea10__c: string | null;
};

type ParentReferences$MsmxInstantData__ChangeEvent = {
  //
};

type ChildRelationships$MsmxInstantData__ChangeEvent = {
  //
};

interface SObjectDefinition$MsmxInstantData__ChangeEvent extends SObjectDefinition<'MsmxInstantData__ChangeEvent'> {
    Name: 'MsmxInstantData__ChangeEvent';
    Fields: Fields$MsmxInstantData__ChangeEvent;
    ParentReferences: ParentReferences$MsmxInstantData__ChangeEvent;
    ChildRelationships: ChildRelationships$MsmxInstantData__ChangeEvent;
  }

type Fields$MsmxInstantData__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$MsmxInstantData__Share = {
  //
  Parent: SObjectDefinition$MsmxInstantData__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MsmxInstantData__Share = {
  //
};

interface SObjectDefinition$MsmxInstantData__Share extends SObjectDefinition<'MsmxInstantData__Share'> {
    Name: 'MsmxInstantData__Share';
    Fields: Fields$MsmxInstantData__Share;
    ParentReferences: ParentReferences$MsmxInstantData__Share;
    ChildRelationships: ChildRelationships$MsmxInstantData__Share;
  }

type Fields$MsmxInstantData__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Book__c: string;
  Checkbox01__c: boolean;
  Checkbox02__c: boolean;
  Checkbox03__c: boolean;
  Checkbox04__c: boolean;
  Checkbox05__c: boolean;
  Checkbox06__c: boolean;
  Checkbox07__c: boolean;
  Checkbox08__c: boolean;
  Checkbox09__c: boolean;
  Checkbox10__c: boolean;
  Date01__c: DateString | null;
  Date02__c: DateString | null;
  Date03__c: DateString | null;
  Date04__c: DateString | null;
  Date05__c: DateString | null;
  Date06__c: DateString | null;
  Date07__c: DateString | null;
  Date08__c: DateString | null;
  Date09__c: DateString | null;
  Date10__c: DateString | null;
  Datetime01__c: DateString | null;
  Datetime02__c: DateString | null;
  Datetime03__c: DateString | null;
  Datetime04__c: DateString | null;
  Datetime05__c: DateString | null;
  Datetime06__c: DateString | null;
  Datetime07__c: DateString | null;
  Datetime08__c: DateString | null;
  Datetime09__c: DateString | null;
  Datetime10__c: DateString | null;
  Number01__c: number | null;
  Number02__c: number | null;
  Number03__c: number | null;
  Number04__c: number | null;
  Number05__c: number | null;
  Number06__c: number | null;
  Number07__c: number | null;
  Number08__c: number | null;
  Number09__c: number | null;
  Number10__c: number | null;
  Parent__c: string | null;
  RecordKey__c: string;
  SheetKey__c: string;
  Sheet__c: string;
  Text01__c: string | null;
  Text02__c: string | null;
  Text03__c: string | null;
  Text04__c: string | null;
  Text05__c: string | null;
  Text06__c: string | null;
  Text07__c: string | null;
  Text08__c: string | null;
  Text09__c: string | null;
  Text10__c: string | null;
  Textarea01__c: string | null;
  Textarea02__c: string | null;
  Textarea03__c: string | null;
  Textarea04__c: string | null;
  Textarea05__c: string | null;
  Textarea06__c: string | null;
  Textarea07__c: string | null;
  Textarea08__c: string | null;
  Textarea09__c: string | null;
  Textarea10__c: string | null;
};

type ParentReferences$MsmxInstantData__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Book__r: SObjectDefinition$MsmxBook__c;
};

type ChildRelationships$MsmxInstantData__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Shares: SObjectDefinition$MsmxInstantData__Share;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$MsmxInstantData__c extends SObjectDefinition<'MsmxInstantData__c'> {
    Name: 'MsmxInstantData__c';
    Fields: Fields$MsmxInstantData__c;
    ParentReferences: ParentReferences$MsmxInstantData__c;
    ChildRelationships: ChildRelationships$MsmxInstantData__c;
  }

type Fields$MsmxSheet__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Book__c: string | null;
  Config__c: string | null;
  Key__c: string | null;
  Order__c: number | null;
  SheetId__c: string | null;
};

type ParentReferences$MsmxSheet__ChangeEvent = {
  //
};

type ChildRelationships$MsmxSheet__ChangeEvent = {
  //
};

interface SObjectDefinition$MsmxSheet__ChangeEvent extends SObjectDefinition<'MsmxSheet__ChangeEvent'> {
    Name: 'MsmxSheet__ChangeEvent';
    Fields: Fields$MsmxSheet__ChangeEvent;
    ParentReferences: ParentReferences$MsmxSheet__ChangeEvent;
    ChildRelationships: ChildRelationships$MsmxSheet__ChangeEvent;
  }

type Fields$MsmxSheet__c = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Book__c: string;
  Config__c: string | null;
  Key__c: string;
  Order__c: number;
  SheetId__c: string;
};

type ParentReferences$MsmxSheet__c = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Book__r: SObjectDefinition$MsmxBook__c;
};

type ChildRelationships$MsmxSheet__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$MsmxSheet__c extends SObjectDefinition<'MsmxSheet__c'> {
    Name: 'MsmxSheet__c';
    Fields: Fields$MsmxSheet__c;
    ParentReferences: ParentReferences$MsmxSheet__c;
    ChildRelationships: ChildRelationships$MsmxSheet__c;
  }

type Fields$MsmxViewset__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Config__c: string | null;
  Private__c: boolean;
  Sheet__c: string | null;
  ViewsetId__c: string | null;
};

type ParentReferences$MsmxViewset__ChangeEvent = {
  //
};

type ChildRelationships$MsmxViewset__ChangeEvent = {
  //
};

interface SObjectDefinition$MsmxViewset__ChangeEvent extends SObjectDefinition<'MsmxViewset__ChangeEvent'> {
    Name: 'MsmxViewset__ChangeEvent';
    Fields: Fields$MsmxViewset__ChangeEvent;
    ParentReferences: ParentReferences$MsmxViewset__ChangeEvent;
    ChildRelationships: ChildRelationships$MsmxViewset__ChangeEvent;
  }

type Fields$MsmxViewset__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$MsmxViewset__Share = {
  //
  Parent: SObjectDefinition$MsmxViewset__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MsmxViewset__Share = {
  //
};

interface SObjectDefinition$MsmxViewset__Share extends SObjectDefinition<'MsmxViewset__Share'> {
    Name: 'MsmxViewset__Share';
    Fields: Fields$MsmxViewset__Share;
    ParentReferences: ParentReferences$MsmxViewset__Share;
    ChildRelationships: ChildRelationships$MsmxViewset__Share;
  }

type Fields$MsmxViewset__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Config__c: string | null;
  Private__c: boolean;
  Sheet__c: string;
  ViewsetId__c: string;
};

type ParentReferences$MsmxViewset__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Sheet__r: SObjectDefinition$MsmxSheet__c;
};

type ChildRelationships$MsmxViewset__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Shares: SObjectDefinition$MsmxViewset__Share;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$MsmxViewset__c extends SObjectDefinition<'MsmxViewset__c'> {
    Name: 'MsmxViewset__c';
    Fields: Fields$MsmxViewset__c;
    ParentReferences: ParentReferences$MsmxViewset__c;
    ChildRelationships: ChildRelationships$MsmxViewset__c;
  }

type Fields$Name = {
  //
  Id: string;
  Name: string | null;
  LastName: string | null;
  FirstName: string | null;
  Type: string | null;
  Alias: string | null;
  UserRoleId: string | null;
  RecordTypeId: string | null;
  IsActive: boolean;
  ProfileId: string | null;
  Title: string | null;
  Email: string | null;
  Phone: string | null;
  NameOrAlias: string | null;
  Username: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Name = {
  //
  UserRole: SObjectDefinition$UserRole | null;
  RecordType: SObjectDefinition$RecordType | null;
  Profile: SObjectDefinition$Profile | null;
};

type ChildRelationships$Name = {
  //
};

interface SObjectDefinition$Name extends SObjectDefinition<'Name'> {
    Name: 'Name';
    Fields: Fields$Name;
    ParentReferences: ParentReferences$Name;
    ChildRelationships: ChildRelationships$Name;
  }

type Fields$NamedCredential = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Endpoint: string | null;
  PrincipalType: string;
  CalloutOptionsGenerateAuthorizationHeader: boolean;
  CalloutOptionsAllowMergeFieldsInHeader: boolean;
  CalloutOptionsAllowMergeFieldsInBody: boolean;
  AuthProviderId: string | null;
};

type ParentReferences$NamedCredential = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AuthProvider: SObjectDefinition$AuthProvider | null;
};

type ChildRelationships$NamedCredential = {
  //
  CustomHttpHeaders: SObjectDefinition$CustomHttpHeader;
  UserAuths: SObjectDefinition$ExternalDataUserAuth;
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$NamedCredential extends SObjectDefinition<'NamedCredential'> {
    Name: 'NamedCredential';
    Fields: Fields$NamedCredential;
    ParentReferences: ParentReferences$NamedCredential;
    ChildRelationships: ChildRelationships$NamedCredential;
  }

type Fields$Note = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  Title: string;
  IsPrivate: boolean;
  Body: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Note = {
  //
  Parent: SObjectDefinition$Name;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Note = {
  //
};

interface SObjectDefinition$Note extends SObjectDefinition<'Note'> {
    Name: 'Note';
    Fields: Fields$Note;
    ParentReferences: ParentReferences$Note;
    ChildRelationships: ChildRelationships$Note;
  }

type Fields$NoteAndAttachment = {
  //
  Id: string;
  IsDeleted: boolean;
  IsNote: boolean;
  ParentId: string;
  Title: string | null;
  IsPrivate: boolean;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$NoteAndAttachment = {
  //
  Parent: SObjectDefinition$Name;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$NoteAndAttachment = {
  //
};

interface SObjectDefinition$NoteAndAttachment extends SObjectDefinition<'NoteAndAttachment'> {
    Name: 'NoteAndAttachment';
    Fields: Fields$NoteAndAttachment;
    ParentReferences: ParentReferences$NoteAndAttachment;
    ChildRelationships: ChildRelationships$NoteAndAttachment;
  }

type Fields$OauthToken = {
  //
  Id: string;
  AccessToken: string | null;
  UserId: string | null;
  RequestToken: string | null;
  CreatedDate: DateString | null;
  AppName: string | null;
  LastUsedDate: DateString | null;
  UseCount: number | null;
  DeleteToken: string | null;
  AppMenuItemId: string | null;
};

type ParentReferences$OauthToken = {
  //
  User: SObjectDefinition$User | null;
  AppMenuItem: SObjectDefinition$AppMenuItem | null;
};

type ChildRelationships$OauthToken = {
  //
};

interface SObjectDefinition$OauthToken extends SObjectDefinition<'OauthToken'> {
    Name: 'OauthToken';
    Fields: Fields$OauthToken;
    ParentReferences: ParentReferences$OauthToken;
    ChildRelationships: ChildRelationships$OauthToken;
  }

type Fields$ObjectPermissions = {
  //
  Id: string;
  ParentId: string;
  SobjectType: string;
  PermissionsCreate: boolean;
  PermissionsRead: boolean;
  PermissionsEdit: boolean;
  PermissionsDelete: boolean;
  PermissionsViewAllRecords: boolean;
  PermissionsModifyAllRecords: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ObjectPermissions = {
  //
  Parent: SObjectDefinition$PermissionSet;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ObjectPermissions = {
  //
};

interface SObjectDefinition$ObjectPermissions extends SObjectDefinition<'ObjectPermissions'> {
    Name: 'ObjectPermissions';
    Fields: Fields$ObjectPermissions;
    ParentReferences: ParentReferences$ObjectPermissions;
    ChildRelationships: ChildRelationships$ObjectPermissions;
  }

type Fields$OpenActivity = {
  //
  Id: string;
  AccountId: string | null;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  IsTask: boolean;
  ActivityDate: DateString | null;
  OwnerId: string | null;
  Status: string | null;
  Priority: string | null;
  IsHighPriority: boolean;
  ActivityType: string | null;
  IsClosed: boolean;
  IsAllDayEvent: boolean;
  IsVisibleInSelfService: boolean;
  DurationInMinutes: number | null;
  Location: string | null;
  Description: string | null;
  CurrencyIsoCode: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CallDurationInSeconds: number | null;
  CallType: string | null;
  CallDisposition: string | null;
  CallObject: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
  EndDateTime: DateString | null;
  StartDateTime: DateString | null;
  ActivitySubtype: string | null;
  AlternateDetailId: string | null;
};

type ParentReferences$OpenActivity = {
  //
  Account: SObjectDefinition$Account | null;
  Who: SObjectDefinition$Name | null;
  What: SObjectDefinition$Name | null;
  Owner: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AlternateDetail: SObjectDefinition$EmailMessage | null;
};

type ChildRelationships$OpenActivity = {
  //
};

interface SObjectDefinition$OpenActivity extends SObjectDefinition<'OpenActivity'> {
    Name: 'OpenActivity';
    Fields: Fields$OpenActivity;
    ParentReferences: ParentReferences$OpenActivity;
    ChildRelationships: ChildRelationships$OpenActivity;
  }

type Fields$OperatingHours = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Description: string | null;
  TimeZone: string;
};

type ParentReferences$OperatingHours = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OperatingHours = {
  //
  Accounts: SObjectDefinition$Account;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Feeds: SObjectDefinition$OperatingHoursFeed;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceTerritories: SObjectDefinition$ServiceTerritory;
  TimeSlots: SObjectDefinition$TimeSlot;
};

interface SObjectDefinition$OperatingHours extends SObjectDefinition<'OperatingHours'> {
    Name: 'OperatingHours';
    Fields: Fields$OperatingHours;
    ParentReferences: ParentReferences$OperatingHours;
    ChildRelationships: ChildRelationships$OperatingHours;
  }

type Fields$OperatingHoursFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$OperatingHoursFeed = {
  //
  Parent: SObjectDefinition$OperatingHours;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$OperatingHoursFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$OperatingHoursFeed extends SObjectDefinition<'OperatingHoursFeed'> {
    Name: 'OperatingHoursFeed';
    Fields: Fields$OperatingHoursFeed;
    ParentReferences: ParentReferences$OperatingHoursFeed;
    ChildRelationships: ChildRelationships$OperatingHoursFeed;
  }

type Fields$Opportunity = {
  //
  Id: string;
  IsDeleted: boolean;
  AccountId: string | null;
  IsPrivate: boolean;
  Name: string;
  Description: string | null;
  StageName: string;
  Amount: number | null;
  Probability: number | null;
  ExpectedRevenue: number | null;
  TotalOpportunityQuantity: number | null;
  CloseDate: DateString;
  Type: string | null;
  NextStep: string | null;
  LeadSource: string | null;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string;
  ForecastCategoryName: string | null;
  CurrencyIsoCode: string | null;
  CampaignId: string | null;
  HasOpportunityLineItem: boolean;
  Pricebook2Id: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  FiscalQuarter: number | null;
  FiscalYear: number | null;
  Fiscal: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  HasOpenActivity: boolean;
  HasOverdueTask: boolean;
};

type ParentReferences$Opportunity = {
  //
  Account: SObjectDefinition$Account | null;
  Campaign: SObjectDefinition$Campaign | null;
  Pricebook2: SObjectDefinition$Pricebook2 | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Opportunity = {
  //
  AccountPartners: SObjectDefinition$AccountPartner;
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  OpportunityCompetitors: SObjectDefinition$OpportunityCompetitor;
  OpportunityContactRoles: SObjectDefinition$OpportunityContactRole;
  Feeds: SObjectDefinition$OpportunityFeed;
  Histories: SObjectDefinition$OpportunityFieldHistory;
  OpportunityHistories: SObjectDefinition$OpportunityHistory;
  OpportunityLineItems: SObjectDefinition$OpportunityLineItem;
  OpportunityPartnersFrom: SObjectDefinition$OpportunityPartner;
  Shares: SObjectDefinition$OpportunityShare;
  Partners: SObjectDefinition$Partner;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Opportunity extends SObjectDefinition<'Opportunity'> {
    Name: 'Opportunity';
    Fields: Fields$Opportunity;
    ParentReferences: ParentReferences$Opportunity;
    ChildRelationships: ChildRelationships$Opportunity;
  }

type Fields$OpportunityChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  AccountId: string | null;
  IsPrivate: boolean;
  Name: string | null;
  Description: string | null;
  StageName: string | null;
  Amount: number | null;
  Probability: number | null;
  ExpectedRevenue: number | null;
  TotalOpportunityQuantity: number | null;
  CloseDate: DateString | null;
  Type: string | null;
  NextStep: string | null;
  LeadSource: string | null;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string | null;
  ForecastCategoryName: string | null;
  CurrencyIsoCode: string | null;
  CampaignId: string | null;
  HasOpportunityLineItem: boolean;
  Pricebook2Id: string | null;
  OwnerId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
};

type ParentReferences$OpportunityChangeEvent = {
  //
};

type ChildRelationships$OpportunityChangeEvent = {
  //
};

interface SObjectDefinition$OpportunityChangeEvent extends SObjectDefinition<'OpportunityChangeEvent'> {
    Name: 'OpportunityChangeEvent';
    Fields: Fields$OpportunityChangeEvent;
    ParentReferences: ParentReferences$OpportunityChangeEvent;
    ChildRelationships: ChildRelationships$OpportunityChangeEvent;
  }

type Fields$OpportunityCompetitor = {
  //
  Id: string;
  OpportunityId: string;
  CompetitorName: string | null;
  Strengths: string | null;
  Weaknesses: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$OpportunityCompetitor = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityCompetitor = {
  //
};

interface SObjectDefinition$OpportunityCompetitor extends SObjectDefinition<'OpportunityCompetitor'> {
    Name: 'OpportunityCompetitor';
    Fields: Fields$OpportunityCompetitor;
    ParentReferences: ParentReferences$OpportunityCompetitor;
    ChildRelationships: ChildRelationships$OpportunityCompetitor;
  }

type Fields$OpportunityContactRole = {
  //
  Id: string;
  OpportunityId: string;
  ContactId: string;
  Role: string | null;
  IsPrimary: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$OpportunityContactRole = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  Contact: SObjectDefinition$Contact;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityContactRole = {
  //
};

interface SObjectDefinition$OpportunityContactRole extends SObjectDefinition<'OpportunityContactRole'> {
    Name: 'OpportunityContactRole';
    Fields: Fields$OpportunityContactRole;
    ParentReferences: ParentReferences$OpportunityContactRole;
    ChildRelationships: ChildRelationships$OpportunityContactRole;
  }

type Fields$OpportunityContactRoleChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OpportunityId: string | null;
  ContactId: string | null;
  Role: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
};

type ParentReferences$OpportunityContactRoleChangeEvent = {
  //
};

type ChildRelationships$OpportunityContactRoleChangeEvent = {
  //
};

interface SObjectDefinition$OpportunityContactRoleChangeEvent extends SObjectDefinition<'OpportunityContactRoleChangeEvent'> {
    Name: 'OpportunityContactRoleChangeEvent';
    Fields: Fields$OpportunityContactRoleChangeEvent;
    ParentReferences: ParentReferences$OpportunityContactRoleChangeEvent;
    ChildRelationships: ChildRelationships$OpportunityContactRoleChangeEvent;
  }

type Fields$OpportunityFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$OpportunityFeed = {
  //
  Parent: SObjectDefinition$Opportunity;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$OpportunityFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$OpportunityFeed extends SObjectDefinition<'OpportunityFeed'> {
    Name: 'OpportunityFeed';
    Fields: Fields$OpportunityFeed;
    ParentReferences: ParentReferences$OpportunityFeed;
    ChildRelationships: ChildRelationships$OpportunityFeed;
  }

type Fields$OpportunityFieldHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  OpportunityId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$OpportunityFieldHistory = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityFieldHistory = {
  //
};

interface SObjectDefinition$OpportunityFieldHistory extends SObjectDefinition<'OpportunityFieldHistory'> {
    Name: 'OpportunityFieldHistory';
    Fields: Fields$OpportunityFieldHistory;
    ParentReferences: ParentReferences$OpportunityFieldHistory;
    ChildRelationships: ChildRelationships$OpportunityFieldHistory;
  }

type Fields$OpportunityHistory = {
  //
  Id: string;
  OpportunityId: string;
  CreatedById: string;
  CreatedDate: DateString;
  StageName: string;
  Amount: number | null;
  ExpectedRevenue: number | null;
  CloseDate: DateString | null;
  Probability: number | null;
  ForecastCategory: string | null;
  CurrencyIsoCode: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$OpportunityHistory = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityHistory = {
  //
};

interface SObjectDefinition$OpportunityHistory extends SObjectDefinition<'OpportunityHistory'> {
    Name: 'OpportunityHistory';
    Fields: Fields$OpportunityHistory;
    ParentReferences: ParentReferences$OpportunityHistory;
    ChildRelationships: ChildRelationships$OpportunityHistory;
  }

type Fields$OpportunityLineItem = {
  //
  Id: string;
  OpportunityId: string;
  SortOrder: number | null;
  PricebookEntryId: string | null;
  Product2Id: string | null;
  ProductCode: string | null;
  Name: string | null;
  CurrencyIsoCode: string;
  Quantity: number;
  TotalPrice: number | null;
  UnitPrice: number | null;
  ListPrice: number | null;
  ServiceDate: DateString | null;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$OpportunityLineItem = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  PricebookEntry: SObjectDefinition$PricebookEntry | null;
  Product2: SObjectDefinition$Product2 | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityLineItem = {
  //
};

interface SObjectDefinition$OpportunityLineItem extends SObjectDefinition<'OpportunityLineItem'> {
    Name: 'OpportunityLineItem';
    Fields: Fields$OpportunityLineItem;
    ParentReferences: ParentReferences$OpportunityLineItem;
    ChildRelationships: ChildRelationships$OpportunityLineItem;
  }

type Fields$OpportunityPartner = {
  //
  Id: string;
  OpportunityId: string;
  AccountToId: string;
  Role: string | null;
  IsPrimary: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  ReversePartnerId: string | null;
};

type ParentReferences$OpportunityPartner = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  AccountTo: SObjectDefinition$Account;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityPartner = {
  //
};

interface SObjectDefinition$OpportunityPartner extends SObjectDefinition<'OpportunityPartner'> {
    Name: 'OpportunityPartner';
    Fields: Fields$OpportunityPartner;
    ParentReferences: ParentReferences$OpportunityPartner;
    ChildRelationships: ChildRelationships$OpportunityPartner;
  }

type Fields$OpportunityShare = {
  //
  Id: string;
  OpportunityId: string;
  UserOrGroupId: string;
  OpportunityAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$OpportunityShare = {
  //
  Opportunity: SObjectDefinition$Opportunity;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityShare = {
  //
};

interface SObjectDefinition$OpportunityShare extends SObjectDefinition<'OpportunityShare'> {
    Name: 'OpportunityShare';
    Fields: Fields$OpportunityShare;
    ParentReferences: ParentReferences$OpportunityShare;
    ChildRelationships: ChildRelationships$OpportunityShare;
  }

type Fields$OpportunityStage = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  IsActive: boolean;
  SortOrder: number | null;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string;
  ForecastCategoryName: string;
  DefaultProbability: number | null;
  Description: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$OpportunityStage = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OpportunityStage = {
  //
};

interface SObjectDefinition$OpportunityStage extends SObjectDefinition<'OpportunityStage'> {
    Name: 'OpportunityStage';
    Fields: Fields$OpportunityStage;
    ParentReferences: ParentReferences$OpportunityStage;
    ChildRelationships: ChildRelationships$OpportunityStage;
  }

type Fields$Order = {
  //
  Id: string;
  OwnerId: string;
  ContractId: string | null;
  AccountId: string | null;
  Pricebook2Id: string | null;
  OriginalOrderId: string | null;
  EffectiveDate: DateString;
  EndDate: DateString | null;
  IsReductionOrder: boolean;
  Status: string;
  Description: string | null;
  CustomerAuthorizedById: string | null;
  CustomerAuthorizedDate: DateString | null;
  CompanyAuthorizedById: string | null;
  CompanyAuthorizedDate: DateString | null;
  Type: string | null;
  BillingStreet: string | null;
  BillingCity: string | null;
  BillingState: string | null;
  BillingPostalCode: string | null;
  BillingCountry: string | null;
  BillingLatitude: number | null;
  BillingLongitude: number | null;
  BillingGeocodeAccuracy: string | null;
  BillingAddress: Address | null;
  ShippingStreet: string | null;
  ShippingCity: string | null;
  ShippingState: string | null;
  ShippingPostalCode: string | null;
  ShippingCountry: string | null;
  ShippingLatitude: number | null;
  ShippingLongitude: number | null;
  ShippingGeocodeAccuracy: string | null;
  ShippingAddress: Address | null;
  Name: string | null;
  PoDate: DateString | null;
  PoNumber: string | null;
  OrderReferenceNumber: string | null;
  BillToContactId: string | null;
  ShipToContactId: string | null;
  ActivatedDate: DateString | null;
  ActivatedById: string | null;
  StatusCode: string;
  CurrencyIsoCode: string;
  OrderNumber: string;
  TotalAmount: number;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Order = {
  //
  Owner: SObjectDefinition$Name;
  Contract: SObjectDefinition$Contract | null;
  Account: SObjectDefinition$Account | null;
  Pricebook2: SObjectDefinition$Pricebook2 | null;
  OriginalOrder: SObjectDefinition$Order | null;
  CustomerAuthorizedBy: SObjectDefinition$Contact | null;
  CompanyAuthorizedBy: SObjectDefinition$User | null;
  BillToContact: SObjectDefinition$Contact | null;
  ShipToContact: SObjectDefinition$Contact | null;
  ActivatedBy: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Order = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  Orders: SObjectDefinition$Order;
  Feeds: SObjectDefinition$OrderFeed;
  Histories: SObjectDefinition$OrderHistory;
  OrderItems: SObjectDefinition$OrderItem;
  Shares: SObjectDefinition$OrderShare;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrders: SObjectDefinition$ReturnOrder;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$Order extends SObjectDefinition<'Order'> {
    Name: 'Order';
    Fields: Fields$Order;
    ParentReferences: ParentReferences$Order;
    ChildRelationships: ChildRelationships$Order;
  }

type Fields$OrderChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  ContractId: string | null;
  AccountId: string | null;
  Pricebook2Id: string | null;
  OriginalOrderId: string | null;
  EffectiveDate: DateString | null;
  EndDate: DateString | null;
  IsReductionOrder: boolean;
  Status: string | null;
  Description: string | null;
  CustomerAuthorizedById: string | null;
  CustomerAuthorizedDate: DateString | null;
  CompanyAuthorizedById: string | null;
  CompanyAuthorizedDate: DateString | null;
  Type: string | null;
  BillingStreet: string | null;
  BillingCity: string | null;
  BillingState: string | null;
  BillingPostalCode: string | null;
  BillingCountry: string | null;
  BillingLatitude: number | null;
  BillingLongitude: number | null;
  BillingGeocodeAccuracy: string | null;
  BillingAddress: Address | null;
  ShippingStreet: string | null;
  ShippingCity: string | null;
  ShippingState: string | null;
  ShippingPostalCode: string | null;
  ShippingCountry: string | null;
  ShippingLatitude: number | null;
  ShippingLongitude: number | null;
  ShippingGeocodeAccuracy: string | null;
  ShippingAddress: Address | null;
  Name: string | null;
  PoDate: DateString | null;
  PoNumber: string | null;
  OrderReferenceNumber: string | null;
  BillToContactId: string | null;
  ShipToContactId: string | null;
  ActivatedDate: DateString | null;
  ActivatedById: string | null;
  StatusCode: string | null;
  CurrencyIsoCode: string | null;
  OrderNumber: string;
  TotalAmount: number | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
};

type ParentReferences$OrderChangeEvent = {
  //
};

type ChildRelationships$OrderChangeEvent = {
  //
};

interface SObjectDefinition$OrderChangeEvent extends SObjectDefinition<'OrderChangeEvent'> {
    Name: 'OrderChangeEvent';
    Fields: Fields$OrderChangeEvent;
    ParentReferences: ParentReferences$OrderChangeEvent;
    ChildRelationships: ChildRelationships$OrderChangeEvent;
  }

type Fields$OrderFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$OrderFeed = {
  //
  Parent: SObjectDefinition$Order;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$OrderFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$OrderFeed extends SObjectDefinition<'OrderFeed'> {
    Name: 'OrderFeed';
    Fields: Fields$OrderFeed;
    ParentReferences: ParentReferences$OrderFeed;
    ChildRelationships: ChildRelationships$OrderFeed;
  }

type Fields$OrderHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  OrderId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$OrderHistory = {
  //
  Order: SObjectDefinition$Order;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$OrderHistory = {
  //
};

interface SObjectDefinition$OrderHistory extends SObjectDefinition<'OrderHistory'> {
    Name: 'OrderHistory';
    Fields: Fields$OrderHistory;
    ParentReferences: ParentReferences$OrderHistory;
    ChildRelationships: ChildRelationships$OrderHistory;
  }

type Fields$OrderItem = {
  //
  Id: string;
  Product2Id: string | null;
  IsDeleted: boolean;
  OrderId: string;
  PricebookEntryId: string;
  OriginalOrderItemId: string | null;
  AvailableQuantity: number | null;
  Quantity: number;
  CurrencyIsoCode: string;
  UnitPrice: number | null;
  ListPrice: number | null;
  TotalPrice: number | null;
  ServiceDate: DateString | null;
  EndDate: DateString | null;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  OrderItemNumber: string;
};

type ParentReferences$OrderItem = {
  //
  Product2: SObjectDefinition$Product2 | null;
  Order: SObjectDefinition$Order;
  PricebookEntry: SObjectDefinition$PricebookEntry;
  OriginalOrderItem: SObjectDefinition$OrderItem | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OrderItem = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ChildOrderItems: SObjectDefinition$OrderItem;
  Feeds: SObjectDefinition$OrderItemFeed;
  Histories: SObjectDefinition$OrderItemHistory;
  ReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
};

interface SObjectDefinition$OrderItem extends SObjectDefinition<'OrderItem'> {
    Name: 'OrderItem';
    Fields: Fields$OrderItem;
    ParentReferences: ParentReferences$OrderItem;
    ChildRelationships: ChildRelationships$OrderItem;
  }

type Fields$OrderItemChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OrderId: string | null;
  PricebookEntryId: string | null;
  OriginalOrderItemId: string | null;
  AvailableQuantity: number | null;
  Quantity: number | null;
  CurrencyIsoCode: string | null;
  UnitPrice: number | null;
  ListPrice: number | null;
  ServiceDate: DateString | null;
  EndDate: DateString | null;
  Description: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  OrderItemNumber: string;
};

type ParentReferences$OrderItemChangeEvent = {
  //
};

type ChildRelationships$OrderItemChangeEvent = {
  //
};

interface SObjectDefinition$OrderItemChangeEvent extends SObjectDefinition<'OrderItemChangeEvent'> {
    Name: 'OrderItemChangeEvent';
    Fields: Fields$OrderItemChangeEvent;
    ParentReferences: ParentReferences$OrderItemChangeEvent;
    ChildRelationships: ChildRelationships$OrderItemChangeEvent;
  }

type Fields$OrderItemFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$OrderItemFeed = {
  //
  Parent: SObjectDefinition$OrderItem;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$OrderItemFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$OrderItemFeed extends SObjectDefinition<'OrderItemFeed'> {
    Name: 'OrderItemFeed';
    Fields: Fields$OrderItemFeed;
    ParentReferences: ParentReferences$OrderItemFeed;
    ChildRelationships: ChildRelationships$OrderItemFeed;
  }

type Fields$OrderItemHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  OrderItemId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$OrderItemHistory = {
  //
  OrderItem: SObjectDefinition$OrderItem;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$OrderItemHistory = {
  //
};

interface SObjectDefinition$OrderItemHistory extends SObjectDefinition<'OrderItemHistory'> {
    Name: 'OrderItemHistory';
    Fields: Fields$OrderItemHistory;
    ParentReferences: ParentReferences$OrderItemHistory;
    ChildRelationships: ChildRelationships$OrderItemHistory;
  }

type Fields$OrderShare = {
  //
  Id: string;
  OrderId: string;
  UserOrGroupId: string;
  OrderAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$OrderShare = {
  //
  Order: SObjectDefinition$Order;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OrderShare = {
  //
};

interface SObjectDefinition$OrderShare extends SObjectDefinition<'OrderShare'> {
    Name: 'OrderShare';
    Fields: Fields$OrderShare;
    ParentReferences: ParentReferences$OrderShare;
    ChildRelationships: ChildRelationships$OrderShare;
  }

type Fields$OrgLifecycleNotification = {
  //
  ReplayId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LifecycleRequestType: string | null;
  LifecycleRequestId: string | null;
  OrgId: string | null;
  Status: string | null;
  StatusCode: string | null;
};

type ParentReferences$OrgLifecycleNotification = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$OrgLifecycleNotification = {
  //
};

interface SObjectDefinition$OrgLifecycleNotification extends SObjectDefinition<'OrgLifecycleNotification'> {
    Name: 'OrgLifecycleNotification';
    Fields: Fields$OrgLifecycleNotification;
    ParentReferences: ParentReferences$OrgLifecycleNotification;
    ChildRelationships: ChildRelationships$OrgLifecycleNotification;
  }

type Fields$OrgWideEmailAddress = {
  //
  Id: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Address: string;
  DisplayName: string;
  IsAllowAllProfiles: boolean;
};

type ParentReferences$OrgWideEmailAddress = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OrgWideEmailAddress = {
  //
};

interface SObjectDefinition$OrgWideEmailAddress extends SObjectDefinition<'OrgWideEmailAddress'> {
    Name: 'OrgWideEmailAddress';
    Fields: Fields$OrgWideEmailAddress;
    ParentReferences: ParentReferences$OrgWideEmailAddress;
    ChildRelationships: ChildRelationships$OrgWideEmailAddress;
  }

type Fields$Organization = {
  //
  Id: string;
  Name: string;
  Division: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Phone: string | null;
  Fax: string | null;
  PrimaryContact: string | null;
  DefaultLocaleSidKey: string;
  TimeZoneSidKey: string;
  LanguageLocaleKey: string;
  ReceivesInfoEmails: boolean;
  ReceivesAdminInfoEmails: boolean;
  PreferencesRequireOpportunityProducts: boolean;
  PreferencesTransactionSecurityPolicy: boolean;
  PreferencesTerminateOldestSession: boolean;
  PreferencesConsentManagementEnabled: boolean;
  PreferencesIndividualAutoCreateEnabled: boolean;
  PreferencesAutoSelectIndividualOnMerge: boolean;
  PreferencesLightningLoginEnabled: boolean;
  PreferencesOnlyLLPermUserAllowed: boolean;
  FiscalYearStartMonth: number | null;
  UsesStartDateAsFiscalYearName: boolean;
  DefaultAccountAccess: string | null;
  DefaultContactAccess: string | null;
  DefaultOpportunityAccess: string | null;
  DefaultLeadAccess: string | null;
  DefaultCaseAccess: string | null;
  DefaultCalendarAccess: string | null;
  DefaultPricebookAccess: string | null;
  DefaultCampaignAccess: string | null;
  SystemModstamp: DateString;
  ComplianceBccEmail: string | null;
  UiSkin: string | null;
  SignupCountryIsoCode: string | null;
  TrialExpirationDate: DateString | null;
  NumKnowledgeService: number | null;
  OrganizationType: string | null;
  NamespacePrefix: string | null;
  InstanceName: string | null;
  IsSandbox: boolean;
  WebToCaseDefaultOrigin: string | null;
  MonthlyPageViewsUsed: number | null;
  MonthlyPageViewsEntitlement: number | null;
  IsReadOnly: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$Organization = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Organization = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  CustomBrands: SObjectDefinition$CustomBrand;
};

interface SObjectDefinition$Organization extends SObjectDefinition<'Organization'> {
    Name: 'Organization';
    Fields: Fields$Organization;
    ParentReferences: ParentReferences$Organization;
    ChildRelationships: ChildRelationships$Organization;
  }

type Fields$OutgoingEmail = {
  //
  Id: string;
  ExternalId: string | null;
  ValidatedFromAddress: string | null;
  ToAddress: string | null;
  CcAddress: string | null;
  BccAddress: string | null;
  Subject: string | null;
  TextBody: string | null;
  HtmlBody: string | null;
  RelatedToId: string | null;
  WhoId: string | null;
  EmailTemplateId: string | null;
};

type ParentReferences$OutgoingEmail = {
  //
  RelatedTo: SObjectDefinition$Name | null;
  Who: SObjectDefinition$Name | null;
  EmailTemplate: SObjectDefinition$EmailTemplate | null;
};

type ChildRelationships$OutgoingEmail = {
  //
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  OutgoingEmailRelations: SObjectDefinition$OutgoingEmailRelation;
};

interface SObjectDefinition$OutgoingEmail extends SObjectDefinition<'OutgoingEmail'> {
    Name: 'OutgoingEmail';
    Fields: Fields$OutgoingEmail;
    ParentReferences: ParentReferences$OutgoingEmail;
    ChildRelationships: ChildRelationships$OutgoingEmail;
  }

type Fields$OutgoingEmailRelation = {
  //
  Id: string;
  ExternalId: string | null;
  OutgoingEmailId: string | null;
  RelationId: string | null;
  RelationAddress: string | null;
};

type ParentReferences$OutgoingEmailRelation = {
  //
  Relation: SObjectDefinition$Name | null;
};

type ChildRelationships$OutgoingEmailRelation = {
  //
};

interface SObjectDefinition$OutgoingEmailRelation extends SObjectDefinition<'OutgoingEmailRelation'> {
    Name: 'OutgoingEmailRelation';
    Fields: Fields$OutgoingEmailRelation;
    ParentReferences: ParentReferences$OutgoingEmailRelation;
    ChildRelationships: ChildRelationships$OutgoingEmailRelation;
  }

type Fields$OwnedContentDocument = {
  //
  Id: string;
  IsDeleted: boolean;
  OwnerId: string;
  ContentDocumentId: string | null;
  Title: string;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  FileType: string | null;
  ContentSize: number | null;
  FileExtension: string | null;
  ContentUrl: string | null;
  ExternalDataSourceName: string | null;
  ExternalDataSourceType: string | null;
};

type ParentReferences$OwnedContentDocument = {
  //
  Owner: SObjectDefinition$User;
  ContentDocument: SObjectDefinition$ContentDocument | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$OwnedContentDocument = {
  //
};

interface SObjectDefinition$OwnedContentDocument extends SObjectDefinition<'OwnedContentDocument'> {
    Name: 'OwnedContentDocument';
    Fields: Fields$OwnedContentDocument;
    ParentReferences: ParentReferences$OwnedContentDocument;
    ChildRelationships: ChildRelationships$OwnedContentDocument;
  }

type Fields$OwnerChangeOptionInfo = {
  //
  Id: string;
  DurableId: string | null;
  EntityDefinitionId: string | null;
  Name: string | null;
  Label: string | null;
  IsEditable: boolean;
  DefaultValue: boolean;
};

type ParentReferences$OwnerChangeOptionInfo = {
  //
};

type ChildRelationships$OwnerChangeOptionInfo = {
  //
};

interface SObjectDefinition$OwnerChangeOptionInfo extends SObjectDefinition<'OwnerChangeOptionInfo'> {
    Name: 'OwnerChangeOptionInfo';
    Fields: Fields$OwnerChangeOptionInfo;
    ParentReferences: ParentReferences$OwnerChangeOptionInfo;
    ChildRelationships: ChildRelationships$OwnerChangeOptionInfo;
  }

type Fields$PackageLicense = {
  //
  Id: string;
  Status: string;
  IsProvisioned: boolean;
  AllowedLicenses: number;
  UsedLicenses: number;
  ExpirationDate: DateString | null;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  NamespacePrefix: string;
};

type ParentReferences$PackageLicense = {
  //
};

type ChildRelationships$PackageLicense = {
  //
};

interface SObjectDefinition$PackageLicense extends SObjectDefinition<'PackageLicense'> {
    Name: 'PackageLicense';
    Fields: Fields$PackageLicense;
    ParentReferences: ParentReferences$PackageLicense;
    ChildRelationships: ChildRelationships$PackageLicense;
  }

type Fields$Partner = {
  //
  Id: string;
  OpportunityId: string | null;
  AccountFromId: string | null;
  AccountToId: string;
  Role: string | null;
  IsPrimary: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  ReversePartnerId: string | null;
};

type ParentReferences$Partner = {
  //
  Opportunity: SObjectDefinition$Opportunity | null;
  AccountFrom: SObjectDefinition$Account | null;
  AccountTo: SObjectDefinition$Account;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Partner = {
  //
};

interface SObjectDefinition$Partner extends SObjectDefinition<'Partner'> {
    Name: 'Partner';
    Fields: Fields$Partner;
    ParentReferences: ParentReferences$Partner;
    ChildRelationships: ChildRelationships$Partner;
  }

type Fields$PartnerRole = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  ReverseRole: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$PartnerRole = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PartnerRole = {
  //
};

interface SObjectDefinition$PartnerRole extends SObjectDefinition<'PartnerRole'> {
    Name: 'PartnerRole';
    Fields: Fields$PartnerRole;
    ParentReferences: ParentReferences$PartnerRole;
    ChildRelationships: ChildRelationships$PartnerRole;
  }

type Fields$Payment__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Invoice__c: string | null;
  AccountName__c: string | null;
  Amount__c: number | null;
  PaymentDate__c: DateString | null;
};

type ParentReferences$Payment__ChangeEvent = {
  //
};

type ChildRelationships$Payment__ChangeEvent = {
  //
};

interface SObjectDefinition$Payment__ChangeEvent extends SObjectDefinition<'Payment__ChangeEvent'> {
    Name: 'Payment__ChangeEvent';
    Fields: Fields$Payment__ChangeEvent;
    ParentReferences: ParentReferences$Payment__ChangeEvent;
    ChildRelationships: ChildRelationships$Payment__ChangeEvent;
  }

type Fields$Payment__c = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Invoice__c: string;
  AccountName__c: string | null;
  Amount__c: number;
  PaymentDate__c: DateString | null;
};

type ParentReferences$Payment__c = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Invoice__r: SObjectDefinition$Invoice__c;
};

type ChildRelationships$Payment__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Payment__c extends SObjectDefinition<'Payment__c'> {
    Name: 'Payment__c';
    Fields: Fields$Payment__c;
    ParentReferences: ParentReferences$Payment__c;
    ChildRelationships: ChildRelationships$Payment__c;
  }

type Fields$Period = {
  //
  Id: string;
  FiscalYearSettingsId: string | null;
  Type: string | null;
  StartDate: DateString;
  EndDate: DateString;
  SystemModstamp: DateString;
  IsForecastPeriod: boolean;
  QuarterLabel: string | null;
  PeriodLabel: string | null;
  Number: number | null;
  FullyQualifiedLabel: string | null;
};

type ParentReferences$Period = {
  //
  FiscalYearSettings: SObjectDefinition$FiscalYearSettings | null;
};

type ChildRelationships$Period = {
  //
};

interface SObjectDefinition$Period extends SObjectDefinition<'Period'> {
    Name: 'Period';
    Fields: Fields$Period;
    ParentReferences: ParentReferences$Period;
    ChildRelationships: ChildRelationships$Period;
  }

type Fields$PermissionSet = {
  //
  Id: string;
  Name: string;
  Label: string;
  LicenseId: string | null;
  ProfileId: string | null;
  IsOwnedByProfile: boolean;
  IsCustom: boolean;
  PermissionsEmailSingle: boolean;
  PermissionsEmailMass: boolean;
  PermissionsEditTask: boolean;
  PermissionsEditEvent: boolean;
  PermissionsExportReport: boolean;
  PermissionsImportPersonal: boolean;
  PermissionsDataExport: boolean;
  PermissionsManageUsers: boolean;
  PermissionsEditPublicFilters: boolean;
  PermissionsEditPublicTemplates: boolean;
  PermissionsModifyAllData: boolean;
  PermissionsManageCases: boolean;
  PermissionsMassInlineEdit: boolean;
  PermissionsEditKnowledge: boolean;
  PermissionsManageKnowledge: boolean;
  PermissionsManageSolutions: boolean;
  PermissionsCustomizeApplication: boolean;
  PermissionsEditReadonlyFields: boolean;
  PermissionsRunReports: boolean;
  PermissionsViewSetup: boolean;
  PermissionsTransferAnyEntity: boolean;
  PermissionsNewReportBuilder: boolean;
  PermissionsActivateContract: boolean;
  PermissionsActivateOrder: boolean;
  PermissionsImportLeads: boolean;
  PermissionsManageLeads: boolean;
  PermissionsTransferAnyLead: boolean;
  PermissionsViewAllData: boolean;
  PermissionsEditPublicDocuments: boolean;
  PermissionsContentHubOnPremiseUser: boolean;
  PermissionsViewEncryptedData: boolean;
  PermissionsEditBrandTemplates: boolean;
  PermissionsEditHtmlTemplates: boolean;
  PermissionsChatterInternalUser: boolean;
  PermissionsManageEncryptionKeys: boolean;
  PermissionsDeleteActivatedContract: boolean;
  PermissionsChatterInviteExternalUsers: boolean;
  PermissionsSendSitRequests: boolean;
  PermissionsManageRemoteAccess: boolean;
  PermissionsCanUseNewDashboardBuilder: boolean;
  PermissionsManageCategories: boolean;
  PermissionsConvertLeads: boolean;
  PermissionsPasswordNeverExpires: boolean;
  PermissionsUseTeamReassignWizards: boolean;
  PermissionsEditActivatedOrders: boolean;
  PermissionsInstallPackaging: boolean;
  PermissionsChatterOwnGroups: boolean;
  PermissionsEditOppLineItemUnitPrice: boolean;
  PermissionsBulkApiHardDelete: boolean;
  PermissionsSolutionImport: boolean;
  PermissionsManageCallCenters: boolean;
  PermissionsManageSynonyms: boolean;
  PermissionsViewContent: boolean;
  PermissionsManageEmailClientConfig: boolean;
  PermissionsEnableNotifications: boolean;
  PermissionsManageDataIntegrations: boolean;
  PermissionsDistributeFromPersWksp: boolean;
  PermissionsViewDataCategories: boolean;
  PermissionsManageDataCategories: boolean;
  PermissionsAuthorApex: boolean;
  PermissionsManageMobile: boolean;
  PermissionsApiEnabled: boolean;
  PermissionsManageCustomReportTypes: boolean;
  PermissionsEditCaseComments: boolean;
  PermissionsTransferAnyCase: boolean;
  PermissionsContentAdministrator: boolean;
  PermissionsCreateWorkspaces: boolean;
  PermissionsManageContentPermissions: boolean;
  PermissionsManageContentProperties: boolean;
  PermissionsManageContentTypes: boolean;
  PermissionsManageExchangeConfig: boolean;
  PermissionsManageAnalyticSnapshots: boolean;
  PermissionsScheduleReports: boolean;
  PermissionsManageBusinessHourHolidays: boolean;
  PermissionsManageDynamicDashboards: boolean;
  PermissionsCustomSidebarOnAllPages: boolean;
  PermissionsManageInteraction: boolean;
  PermissionsViewMyTeamsDashboards: boolean;
  PermissionsModerateChatter: boolean;
  PermissionsResetPasswords: boolean;
  PermissionsFlowUFLRequired: boolean;
  PermissionsCanInsertFeedSystemFields: boolean;
  PermissionsManageKnowledgeImportExport: boolean;
  PermissionsEmailTemplateManagement: boolean;
  PermissionsEmailAdministration: boolean;
  PermissionsManageChatterMessages: boolean;
  PermissionsAllowEmailIC: boolean;
  PermissionsChatterFileLink: boolean;
  PermissionsForceTwoFactor: boolean;
  PermissionsViewEventLogFiles: boolean;
  PermissionsManageNetworks: boolean;
  PermissionsManageAuthProviders: boolean;
  PermissionsRunFlow: boolean;
  PermissionsCreateCustomizeDashboards: boolean;
  PermissionsCreateDashboardFolders: boolean;
  PermissionsViewPublicDashboards: boolean;
  PermissionsManageDashbdsInPubFolders: boolean;
  PermissionsCreateCustomizeReports: boolean;
  PermissionsCreateReportFolders: boolean;
  PermissionsViewPublicReports: boolean;
  PermissionsManageReportsInPubFolders: boolean;
  PermissionsEditMyDashboards: boolean;
  PermissionsEditMyReports: boolean;
  PermissionsViewAllUsers: boolean;
  PermissionsAllowUniversalSearch: boolean;
  PermissionsConnectOrgToEnvironmentHub: boolean;
  PermissionsWorkCalibrationUser: boolean;
  PermissionsCreateCustomizeFilters: boolean;
  PermissionsWorkDotComUserPerm: boolean;
  PermissionsContentHubUser: boolean;
  PermissionsGovernNetworks: boolean;
  PermissionsSalesConsole: boolean;
  PermissionsTwoFactorApi: boolean;
  PermissionsDeleteTopics: boolean;
  PermissionsEditTopics: boolean;
  PermissionsCreateTopics: boolean;
  PermissionsAssignTopics: boolean;
  PermissionsIdentityEnabled: boolean;
  PermissionsIdentityConnect: boolean;
  PermissionsAllowViewKnowledge: boolean;
  PermissionsContentWorkspaces: boolean;
  PermissionsCreateWorkBadgeDefinition: boolean;
  PermissionsManageSearchPromotionRules: boolean;
  PermissionsCustomMobileAppsAccess: boolean;
  PermissionsViewHelpLink: boolean;
  PermissionsManageProfilesPermissionsets: boolean;
  PermissionsAssignPermissionSets: boolean;
  PermissionsManageRoles: boolean;
  PermissionsManageIpAddresses: boolean;
  PermissionsManageSharing: boolean;
  PermissionsManageInternalUsers: boolean;
  PermissionsManagePasswordPolicies: boolean;
  PermissionsManageLoginAccessPolicies: boolean;
  PermissionsManageCustomPermissions: boolean;
  PermissionsCanVerifyComment: boolean;
  PermissionsManageUnlistedGroups: boolean;
  PermissionsModifySecureAgents: boolean;
  PermissionsInsightsAppDashboardEditor: boolean;
  PermissionsManageTwoFactor: boolean;
  PermissionsInsightsAppUser: boolean;
  PermissionsInsightsAppAdmin: boolean;
  PermissionsInsightsAppEltEditor: boolean;
  PermissionsInsightsAppUploadUser: boolean;
  PermissionsInsightsCreateApplication: boolean;
  PermissionsLightningExperienceUser: boolean;
  PermissionsViewDataLeakageEvents: boolean;
  PermissionsConfigCustomRecs: boolean;
  PermissionsSubmitMacrosAllowed: boolean;
  PermissionsBulkMacrosAllowed: boolean;
  PermissionsShareInternalArticles: boolean;
  PermissionsManageSessionPermissionSets: boolean;
  PermissionsManageTemplatedApp: boolean;
  PermissionsUseTemplatedApp: boolean;
  PermissionsSendAnnouncementEmails: boolean;
  PermissionsChatterEditOwnPost: boolean;
  PermissionsChatterEditOwnRecordPost: boolean;
  PermissionsWaveTabularDownload: boolean;
  PermissionsImportCustomObjects: boolean;
  PermissionsDelegatedTwoFactor: boolean;
  PermissionsChatterComposeUiCodesnippet: boolean;
  PermissionsSelectFilesFromSalesforce: boolean;
  PermissionsModerateNetworkUsers: boolean;
  PermissionsMergeTopics: boolean;
  PermissionsSubscribeToLightningReports: boolean;
  PermissionsManagePvtRptsAndDashbds: boolean;
  PermissionsAllowLightningLogin: boolean;
  PermissionsCampaignInfluence2: boolean;
  PermissionsViewDataAssessment: boolean;
  PermissionsRemoveDirectMessageMembers: boolean;
  PermissionsCanApproveFeedPost: boolean;
  PermissionsAddDirectMessageMembers: boolean;
  PermissionsAllowViewEditConvertedLeads: boolean;
  PermissionsFieldServiceAccess: boolean;
  PermissionsFieldServiceScheduling: boolean;
  PermissionsFieldServiceDispatcher: boolean;
  PermissionsFieldServiceMobileApp: boolean;
  PermissionsShowCompanyNameAsUserBadge: boolean;
  PermissionsAccessCMC: boolean;
  PermissionsOptOutGeoLocationTracking: boolean;
  PermissionsViewHealthCheck: boolean;
  PermissionsManageHealthCheck: boolean;
  PermissionsPackaging2: boolean;
  PermissionsManageCertificates: boolean;
  PermissionsCreateReportInLightning: boolean;
  PermissionsPreventClassicExperience: boolean;
  PermissionsHideReadByList: boolean;
  PermissionsListEmailSend: boolean;
  PermissionsFeedPinning: boolean;
  PermissionsChangeDashboardColors: boolean;
  PermissionsIotUser: boolean;
  PermissionsManageRecommendationStrategies: boolean;
  PermissionsManagePropositions: boolean;
  PermissionsCloseConversations: boolean;
  PermissionsUseWebLink: boolean;
  PermissionsViewOnlyEmbeddedAppUser: boolean;
  PermissionsSendExternalEmailAvailable: boolean;
  PermissionsViewAllActivities: boolean;
  PermissionsSubscribeReportToOtherUsers: boolean;
  PermissionsLightningConsoleAllowedForUser: boolean;
  PermissionsSubscribeReportsRunAsUser: boolean;
  PermissionsSubscribeToLightningDashboards: boolean;
  PermissionsSubscribeDashboardToOtherUsers: boolean;
  PermissionsApexRestServices: boolean;
  PermissionsEnableCommunityAppLauncher: boolean;
  PermissionsLtngPromoReserved01UserPerm: boolean;
  PermissionsCanEditDataPrepRecipe: boolean;
  PermissionsAddAnalyticsRemoteConnections: boolean;
  PermissionsManageSurveys: boolean;
  PermissionsRecordVisibilityAPI: boolean;
  PermissionsViewRoles: boolean;
  PermissionsModifyMetadata: boolean;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  NamespacePrefix: string | null;
  HasActivationRequired: boolean;
  PermissionSetGroupId: string | null;
};

type ParentReferences$PermissionSet = {
  //
  License: SObjectDefinition$Name | null;
  Profile: SObjectDefinition$Profile | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  PermissionSetGroup: SObjectDefinition$PermissionSetGroup | null;
};

type ChildRelationships$PermissionSet = {
  //
  FieldPerms: SObjectDefinition$FieldPermissions;
  ObjectPerms: SObjectDefinition$ObjectPermissions;
  Assignments: SObjectDefinition$PermissionSetAssignment;
  PermissionSetGroupComponents: SObjectDefinition$PermissionSetGroupComponent;
  SessionActivations: SObjectDefinition$SessionPermSetActivation;
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$PermissionSet extends SObjectDefinition<'PermissionSet'> {
    Name: 'PermissionSet';
    Fields: Fields$PermissionSet;
    ParentReferences: ParentReferences$PermissionSet;
    ChildRelationships: ChildRelationships$PermissionSet;
  }

type Fields$PermissionSetAssignment = {
  //
  Id: string;
  PermissionSetId: string | null;
  PermissionSetGroupId: string | null;
  AssigneeId: string;
  SystemModstamp: DateString;
};

type ParentReferences$PermissionSetAssignment = {
  //
  PermissionSet: SObjectDefinition$PermissionSet | null;
  PermissionSetGroup: SObjectDefinition$PermissionSetGroup | null;
  Assignee: SObjectDefinition$User;
};

type ChildRelationships$PermissionSetAssignment = {
  //
};

interface SObjectDefinition$PermissionSetAssignment extends SObjectDefinition<'PermissionSetAssignment'> {
    Name: 'PermissionSetAssignment';
    Fields: Fields$PermissionSetAssignment;
    ParentReferences: ParentReferences$PermissionSetAssignment;
    ChildRelationships: ChildRelationships$PermissionSetAssignment;
  }

type Fields$PermissionSetGroup = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
  Status: string;
};

type ParentReferences$PermissionSetGroup = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PermissionSetGroup = {
  //
  Assignments: SObjectDefinition$PermissionSetAssignment;
  PermissionSetGroupComponents: SObjectDefinition$PermissionSetGroupComponent;
};

interface SObjectDefinition$PermissionSetGroup extends SObjectDefinition<'PermissionSetGroup'> {
    Name: 'PermissionSetGroup';
    Fields: Fields$PermissionSetGroup;
    ParentReferences: ParentReferences$PermissionSetGroup;
    ChildRelationships: ChildRelationships$PermissionSetGroup;
  }

type Fields$PermissionSetGroupComponent = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PermissionSetGroupId: string;
  PermissionSetId: string;
};

type ParentReferences$PermissionSetGroupComponent = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  PermissionSetGroup: SObjectDefinition$PermissionSetGroup;
  PermissionSet: SObjectDefinition$PermissionSet;
};

type ChildRelationships$PermissionSetGroupComponent = {
  //
};

interface SObjectDefinition$PermissionSetGroupComponent extends SObjectDefinition<'PermissionSetGroupComponent'> {
    Name: 'PermissionSetGroupComponent';
    Fields: Fields$PermissionSetGroupComponent;
    ParentReferences: ParentReferences$PermissionSetGroupComponent;
    ChildRelationships: ChildRelationships$PermissionSetGroupComponent;
  }

type Fields$PermissionSetLicense = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PermissionSetLicenseKey: string;
  TotalLicenses: number;
  Status: string;
  ExpirationDate: DateString | null;
  MaximumPermissionsEmailSingle: boolean;
  MaximumPermissionsEmailMass: boolean;
  MaximumPermissionsEditTask: boolean;
  MaximumPermissionsEditEvent: boolean;
  MaximumPermissionsExportReport: boolean;
  MaximumPermissionsImportPersonal: boolean;
  MaximumPermissionsDataExport: boolean;
  MaximumPermissionsManageUsers: boolean;
  MaximumPermissionsEditPublicFilters: boolean;
  MaximumPermissionsEditPublicTemplates: boolean;
  MaximumPermissionsModifyAllData: boolean;
  MaximumPermissionsManageCases: boolean;
  MaximumPermissionsMassInlineEdit: boolean;
  MaximumPermissionsEditKnowledge: boolean;
  MaximumPermissionsManageKnowledge: boolean;
  MaximumPermissionsManageSolutions: boolean;
  MaximumPermissionsCustomizeApplication: boolean;
  MaximumPermissionsEditReadonlyFields: boolean;
  MaximumPermissionsRunReports: boolean;
  MaximumPermissionsViewSetup: boolean;
  MaximumPermissionsTransferAnyEntity: boolean;
  MaximumPermissionsNewReportBuilder: boolean;
  MaximumPermissionsActivateContract: boolean;
  MaximumPermissionsActivateOrder: boolean;
  MaximumPermissionsImportLeads: boolean;
  MaximumPermissionsManageLeads: boolean;
  MaximumPermissionsTransferAnyLead: boolean;
  MaximumPermissionsViewAllData: boolean;
  MaximumPermissionsEditPublicDocuments: boolean;
  MaximumPermissionsContentHubOnPremiseUser: boolean;
  MaximumPermissionsViewEncryptedData: boolean;
  MaximumPermissionsEditBrandTemplates: boolean;
  MaximumPermissionsEditHtmlTemplates: boolean;
  MaximumPermissionsChatterInternalUser: boolean;
  MaximumPermissionsManageEncryptionKeys: boolean;
  MaximumPermissionsDeleteActivatedContract: boolean;
  MaximumPermissionsChatterInviteExternalUsers: boolean;
  MaximumPermissionsSendSitRequests: boolean;
  MaximumPermissionsManageRemoteAccess: boolean;
  MaximumPermissionsCanUseNewDashboardBuilder: boolean;
  MaximumPermissionsManageCategories: boolean;
  MaximumPermissionsConvertLeads: boolean;
  MaximumPermissionsPasswordNeverExpires: boolean;
  MaximumPermissionsUseTeamReassignWizards: boolean;
  MaximumPermissionsEditActivatedOrders: boolean;
  MaximumPermissionsInstallPackaging: boolean;
  MaximumPermissionsChatterOwnGroups: boolean;
  MaximumPermissionsEditOppLineItemUnitPrice: boolean;
  MaximumPermissionsBulkApiHardDelete: boolean;
  MaximumPermissionsSolutionImport: boolean;
  MaximumPermissionsManageCallCenters: boolean;
  MaximumPermissionsManageSynonyms: boolean;
  MaximumPermissionsViewContent: boolean;
  MaximumPermissionsManageEmailClientConfig: boolean;
  MaximumPermissionsEnableNotifications: boolean;
  MaximumPermissionsManageDataIntegrations: boolean;
  MaximumPermissionsDistributeFromPersWksp: boolean;
  MaximumPermissionsViewDataCategories: boolean;
  MaximumPermissionsManageDataCategories: boolean;
  MaximumPermissionsAuthorApex: boolean;
  MaximumPermissionsManageMobile: boolean;
  MaximumPermissionsApiEnabled: boolean;
  MaximumPermissionsManageCustomReportTypes: boolean;
  MaximumPermissionsEditCaseComments: boolean;
  MaximumPermissionsTransferAnyCase: boolean;
  MaximumPermissionsContentAdministrator: boolean;
  MaximumPermissionsCreateWorkspaces: boolean;
  MaximumPermissionsManageContentPermissions: boolean;
  MaximumPermissionsManageContentProperties: boolean;
  MaximumPermissionsManageContentTypes: boolean;
  MaximumPermissionsManageExchangeConfig: boolean;
  MaximumPermissionsManageAnalyticSnapshots: boolean;
  MaximumPermissionsScheduleReports: boolean;
  MaximumPermissionsManageBusinessHourHolidays: boolean;
  MaximumPermissionsManageDynamicDashboards: boolean;
  MaximumPermissionsCustomSidebarOnAllPages: boolean;
  MaximumPermissionsManageInteraction: boolean;
  MaximumPermissionsViewMyTeamsDashboards: boolean;
  MaximumPermissionsModerateChatter: boolean;
  MaximumPermissionsResetPasswords: boolean;
  MaximumPermissionsFlowUFLRequired: boolean;
  MaximumPermissionsCanInsertFeedSystemFields: boolean;
  MaximumPermissionsManageKnowledgeImportExport: boolean;
  MaximumPermissionsEmailTemplateManagement: boolean;
  MaximumPermissionsEmailAdministration: boolean;
  MaximumPermissionsManageChatterMessages: boolean;
  MaximumPermissionsAllowEmailIC: boolean;
  MaximumPermissionsChatterFileLink: boolean;
  MaximumPermissionsForceTwoFactor: boolean;
  MaximumPermissionsViewEventLogFiles: boolean;
  MaximumPermissionsManageNetworks: boolean;
  MaximumPermissionsManageAuthProviders: boolean;
  MaximumPermissionsRunFlow: boolean;
  MaximumPermissionsCreateCustomizeDashboards: boolean;
  MaximumPermissionsCreateDashboardFolders: boolean;
  MaximumPermissionsViewPublicDashboards: boolean;
  MaximumPermissionsManageDashbdsInPubFolders: boolean;
  MaximumPermissionsCreateCustomizeReports: boolean;
  MaximumPermissionsCreateReportFolders: boolean;
  MaximumPermissionsViewPublicReports: boolean;
  MaximumPermissionsManageReportsInPubFolders: boolean;
  MaximumPermissionsEditMyDashboards: boolean;
  MaximumPermissionsEditMyReports: boolean;
  MaximumPermissionsViewAllUsers: boolean;
  MaximumPermissionsAllowUniversalSearch: boolean;
  MaximumPermissionsConnectOrgToEnvironmentHub: boolean;
  MaximumPermissionsWorkCalibrationUser: boolean;
  MaximumPermissionsCreateCustomizeFilters: boolean;
  MaximumPermissionsWorkDotComUserPerm: boolean;
  MaximumPermissionsContentHubUser: boolean;
  MaximumPermissionsGovernNetworks: boolean;
  MaximumPermissionsSalesConsole: boolean;
  MaximumPermissionsTwoFactorApi: boolean;
  MaximumPermissionsDeleteTopics: boolean;
  MaximumPermissionsEditTopics: boolean;
  MaximumPermissionsCreateTopics: boolean;
  MaximumPermissionsAssignTopics: boolean;
  MaximumPermissionsIdentityEnabled: boolean;
  MaximumPermissionsIdentityConnect: boolean;
  MaximumPermissionsAllowViewKnowledge: boolean;
  MaximumPermissionsContentWorkspaces: boolean;
  MaximumPermissionsCreateWorkBadgeDefinition: boolean;
  MaximumPermissionsManageSearchPromotionRules: boolean;
  MaximumPermissionsCustomMobileAppsAccess: boolean;
  MaximumPermissionsViewHelpLink: boolean;
  MaximumPermissionsManageProfilesPermissionsets: boolean;
  MaximumPermissionsAssignPermissionSets: boolean;
  MaximumPermissionsManageRoles: boolean;
  MaximumPermissionsManageIpAddresses: boolean;
  MaximumPermissionsManageSharing: boolean;
  MaximumPermissionsManageInternalUsers: boolean;
  MaximumPermissionsManagePasswordPolicies: boolean;
  MaximumPermissionsManageLoginAccessPolicies: boolean;
  MaximumPermissionsManageCustomPermissions: boolean;
  MaximumPermissionsCanVerifyComment: boolean;
  MaximumPermissionsManageUnlistedGroups: boolean;
  MaximumPermissionsModifySecureAgents: boolean;
  MaximumPermissionsInsightsAppDashboardEditor: boolean;
  MaximumPermissionsManageTwoFactor: boolean;
  MaximumPermissionsInsightsAppUser: boolean;
  MaximumPermissionsInsightsAppAdmin: boolean;
  MaximumPermissionsInsightsAppEltEditor: boolean;
  MaximumPermissionsInsightsAppUploadUser: boolean;
  MaximumPermissionsInsightsCreateApplication: boolean;
  MaximumPermissionsLightningExperienceUser: boolean;
  MaximumPermissionsViewDataLeakageEvents: boolean;
  MaximumPermissionsConfigCustomRecs: boolean;
  MaximumPermissionsSubmitMacrosAllowed: boolean;
  MaximumPermissionsBulkMacrosAllowed: boolean;
  MaximumPermissionsShareInternalArticles: boolean;
  MaximumPermissionsManageSessionPermissionSets: boolean;
  MaximumPermissionsManageTemplatedApp: boolean;
  MaximumPermissionsUseTemplatedApp: boolean;
  MaximumPermissionsSendAnnouncementEmails: boolean;
  MaximumPermissionsChatterEditOwnPost: boolean;
  MaximumPermissionsChatterEditOwnRecordPost: boolean;
  MaximumPermissionsWaveTabularDownload: boolean;
  MaximumPermissionsImportCustomObjects: boolean;
  MaximumPermissionsDelegatedTwoFactor: boolean;
  MaximumPermissionsChatterComposeUiCodesnippet: boolean;
  MaximumPermissionsSelectFilesFromSalesforce: boolean;
  MaximumPermissionsModerateNetworkUsers: boolean;
  MaximumPermissionsMergeTopics: boolean;
  MaximumPermissionsSubscribeToLightningReports: boolean;
  MaximumPermissionsManagePvtRptsAndDashbds: boolean;
  MaximumPermissionsAllowLightningLogin: boolean;
  MaximumPermissionsCampaignInfluence2: boolean;
  MaximumPermissionsViewDataAssessment: boolean;
  MaximumPermissionsRemoveDirectMessageMembers: boolean;
  MaximumPermissionsCanApproveFeedPost: boolean;
  MaximumPermissionsAddDirectMessageMembers: boolean;
  MaximumPermissionsAllowViewEditConvertedLeads: boolean;
  MaximumPermissionsFieldServiceAccess: boolean;
  MaximumPermissionsFieldServiceScheduling: boolean;
  MaximumPermissionsFieldServiceDispatcher: boolean;
  MaximumPermissionsFieldServiceMobileApp: boolean;
  MaximumPermissionsShowCompanyNameAsUserBadge: boolean;
  MaximumPermissionsAccessCMC: boolean;
  MaximumPermissionsOptOutGeoLocationTracking: boolean;
  MaximumPermissionsViewHealthCheck: boolean;
  MaximumPermissionsManageHealthCheck: boolean;
  MaximumPermissionsPackaging2: boolean;
  MaximumPermissionsManageCertificates: boolean;
  MaximumPermissionsCreateReportInLightning: boolean;
  MaximumPermissionsPreventClassicExperience: boolean;
  MaximumPermissionsHideReadByList: boolean;
  MaximumPermissionsListEmailSend: boolean;
  MaximumPermissionsFeedPinning: boolean;
  MaximumPermissionsChangeDashboardColors: boolean;
  MaximumPermissionsIotUser: boolean;
  MaximumPermissionsManageRecommendationStrategies: boolean;
  MaximumPermissionsManagePropositions: boolean;
  MaximumPermissionsCloseConversations: boolean;
  MaximumPermissionsUseWebLink: boolean;
  MaximumPermissionsViewOnlyEmbeddedAppUser: boolean;
  MaximumPermissionsSendExternalEmailAvailable: boolean;
  MaximumPermissionsViewAllActivities: boolean;
  MaximumPermissionsSubscribeReportToOtherUsers: boolean;
  MaximumPermissionsLightningConsoleAllowedForUser: boolean;
  MaximumPermissionsSubscribeReportsRunAsUser: boolean;
  MaximumPermissionsSubscribeToLightningDashboards: boolean;
  MaximumPermissionsSubscribeDashboardToOtherUsers: boolean;
  MaximumPermissionsApexRestServices: boolean;
  MaximumPermissionsEnableCommunityAppLauncher: boolean;
  MaximumPermissionsLtngPromoReserved01UserPerm: boolean;
  MaximumPermissionsCanEditDataPrepRecipe: boolean;
  MaximumPermissionsAddAnalyticsRemoteConnections: boolean;
  MaximumPermissionsManageSurveys: boolean;
  MaximumPermissionsRecordVisibilityAPI: boolean;
  MaximumPermissionsViewRoles: boolean;
  MaximumPermissionsModifyMetadata: boolean;
  UsedLicenses: number;
};

type ParentReferences$PermissionSetLicense = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PermissionSetLicense = {
  //
  GrantedByLicenses: SObjectDefinition$GrantedByLicense;
  PermissionSetLicenseAssignments: SObjectDefinition$PermissionSetLicenseAssign;
};

interface SObjectDefinition$PermissionSetLicense extends SObjectDefinition<'PermissionSetLicense'> {
    Name: 'PermissionSetLicense';
    Fields: Fields$PermissionSetLicense;
    ParentReferences: ParentReferences$PermissionSetLicense;
    ChildRelationships: ChildRelationships$PermissionSetLicense;
  }

type Fields$PermissionSetLicenseAssign = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PermissionSetLicenseId: string;
  AssigneeId: string;
};

type ParentReferences$PermissionSetLicenseAssign = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  PermissionSetLicense: SObjectDefinition$PermissionSetLicense;
  Assignee: SObjectDefinition$User;
};

type ChildRelationships$PermissionSetLicenseAssign = {
  //
};

interface SObjectDefinition$PermissionSetLicenseAssign extends SObjectDefinition<'PermissionSetLicenseAssign'> {
    Name: 'PermissionSetLicenseAssign';
    Fields: Fields$PermissionSetLicenseAssign;
    ParentReferences: ParentReferences$PermissionSetLicenseAssign;
    ChildRelationships: ChildRelationships$PermissionSetLicenseAssign;
  }

type Fields$PicklistValueInfo = {
  //
  Id: string;
  DurableId: string | null;
  Value: string | null;
  Label: string | null;
  IsDefaultValue: boolean;
  IsActive: boolean;
  ValidFor: string | null;
  EntityParticleId: string | null;
};

type ParentReferences$PicklistValueInfo = {
  //
};

type ChildRelationships$PicklistValueInfo = {
  //
};

interface SObjectDefinition$PicklistValueInfo extends SObjectDefinition<'PicklistValueInfo'> {
    Name: 'PicklistValueInfo';
    Fields: Fields$PicklistValueInfo;
    ParentReferences: ParentReferences$PicklistValueInfo;
    ChildRelationships: ChildRelationships$PicklistValueInfo;
  }

type Fields$PlatformAction = {
  //
  Id: string;
  ExternalId: string | null;
  LastModifiedDate: DateString | null;
  Label: string;
  Type: string;
  Subtype: string | null;
  ApiName: string | null;
  ActionTarget: string | null;
  ActionTargetType: string | null;
  ConfirmationMessage: string | null;
  GroupId: string | null;
  IsGroupDefault: boolean;
  Category: string | null;
  InvocationStatus: string | null;
  InvokedByUserId: string | null;
  SourceEntity: string;
  ActionListContext: string | null;
  DeviceFormat: string | null;
  IconContentType: string | null;
  IconHeight: number | null;
  IconWidth: number | null;
  IconUrl: string | null;
  IsMassAction: boolean;
  PrimaryColor: string | null;
  RelatedSourceEntity: string | null;
  Section: string | null;
  RelatedListRecordId: string | null;
  TargetUrl: string | null;
  TargetObject: string | null;
};

type ParentReferences$PlatformAction = {
  //
  InvokedByUser: SObjectDefinition$User | null;
};

type ChildRelationships$PlatformAction = {
  //
};

interface SObjectDefinition$PlatformAction extends SObjectDefinition<'PlatformAction'> {
    Name: 'PlatformAction';
    Fields: Fields$PlatformAction;
    ParentReferences: ParentReferences$PlatformAction;
    ChildRelationships: ChildRelationships$PlatformAction;
  }

type Fields$PlatformCachePartition = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
  IsDefaultPartition: boolean;
};

type ParentReferences$PlatformCachePartition = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PlatformCachePartition = {
  //
  PlatforCachePartitionTypes: SObjectDefinition$PlatformCachePartitionType;
};

interface SObjectDefinition$PlatformCachePartition extends SObjectDefinition<'PlatformCachePartition'> {
    Name: 'PlatformCachePartition';
    Fields: Fields$PlatformCachePartition;
    ParentReferences: ParentReferences$PlatformCachePartition;
    ChildRelationships: ChildRelationships$PlatformCachePartition;
  }

type Fields$PlatformCachePartitionType = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  PlatformCachePartitionId: string;
  CacheType: string;
  AllocatedCapacity: number | null;
  AllocatedPurchasedCapacity: number | null;
  AllocatedTrialCapacity: number | null;
};

type ParentReferences$PlatformCachePartitionType = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  PlatformCachePartition: SObjectDefinition$PlatformCachePartition;
};

type ChildRelationships$PlatformCachePartitionType = {
  //
};

interface SObjectDefinition$PlatformCachePartitionType extends SObjectDefinition<'PlatformCachePartitionType'> {
    Name: 'PlatformCachePartitionType';
    Fields: Fields$PlatformCachePartitionType;
    ParentReferences: ParentReferences$PlatformCachePartitionType;
    ChildRelationships: ChildRelationships$PlatformCachePartitionType;
  }

type Fields$Pricebook2 = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  IsActive: boolean;
  IsArchived: boolean;
  Description: string | null;
  IsStandard: boolean;
};

type ParentReferences$Pricebook2 = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Pricebook2 = {
  //
  Contracts: SObjectDefinition$Contract;
  Opportunities: SObjectDefinition$Opportunity;
  Orders: SObjectDefinition$Order;
  Histories: SObjectDefinition$Pricebook2History;
  PricebookEntries: SObjectDefinition$PricebookEntry;
  RecordActions: SObjectDefinition$RecordAction;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$Pricebook2 extends SObjectDefinition<'Pricebook2'> {
    Name: 'Pricebook2';
    Fields: Fields$Pricebook2;
    ParentReferences: ParentReferences$Pricebook2;
    ChildRelationships: ChildRelationships$Pricebook2;
  }

type Fields$Pricebook2History = {
  //
  Id: string;
  IsDeleted: boolean;
  Pricebook2Id: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$Pricebook2History = {
  //
  Pricebook2: SObjectDefinition$Pricebook2;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$Pricebook2History = {
  //
};

interface SObjectDefinition$Pricebook2History extends SObjectDefinition<'Pricebook2History'> {
    Name: 'Pricebook2History';
    Fields: Fields$Pricebook2History;
    ParentReferences: ParentReferences$Pricebook2History;
    ChildRelationships: ChildRelationships$Pricebook2History;
  }

type Fields$PricebookEntry = {
  //
  Id: string;
  Name: string | null;
  Pricebook2Id: string;
  Product2Id: string;
  CurrencyIsoCode: string;
  UnitPrice: number;
  IsActive: boolean;
  UseStandardPrice: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ProductCode: string | null;
  IsDeleted: boolean;
};

type ParentReferences$PricebookEntry = {
  //
  Pricebook2: SObjectDefinition$Pricebook2;
  Product2: SObjectDefinition$Product2;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PricebookEntry = {
  //
  OpportunityLineItems: SObjectDefinition$OpportunityLineItem;
  OrderItems: SObjectDefinition$OrderItem;
  ProductsConsumed: SObjectDefinition$ProductConsumed;
  RecordActions: SObjectDefinition$RecordAction;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$PricebookEntry extends SObjectDefinition<'PricebookEntry'> {
    Name: 'PricebookEntry';
    Fields: Fields$PricebookEntry;
    ParentReferences: ParentReferences$PricebookEntry;
    ChildRelationships: ChildRelationships$PricebookEntry;
  }

type Fields$ProcessDefinition = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  Type: string;
  Description: string | null;
  TableEnumOrId: string;
  LockType: string;
  State: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ProcessDefinition = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProcessDefinition = {
  //
};

interface SObjectDefinition$ProcessDefinition extends SObjectDefinition<'ProcessDefinition'> {
    Name: 'ProcessDefinition';
    Fields: Fields$ProcessDefinition;
    ParentReferences: ParentReferences$ProcessDefinition;
    ChildRelationships: ChildRelationships$ProcessDefinition;
  }

type Fields$ProcessInstance = {
  //
  Id: string;
  ProcessDefinitionId: string;
  TargetObjectId: string;
  Status: string;
  CompletedDate: DateString | null;
  LastActorId: string | null;
  ElapsedTimeInDays: number | null;
  ElapsedTimeInHours: number | null;
  ElapsedTimeInMinutes: number | null;
  SubmittedById: string | null;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ProcessInstance = {
  //
  ProcessDefinition: SObjectDefinition$ProcessDefinition;
  TargetObject: SObjectDefinition$Name;
  LastActor: SObjectDefinition$User | null;
  SubmittedBy: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProcessInstance = {
  //
  StepsAndWorkitems: SObjectDefinition$ProcessInstanceHistory;
  Nodes: SObjectDefinition$ProcessInstanceNode;
  Steps: SObjectDefinition$ProcessInstanceStep;
  Workitems: SObjectDefinition$ProcessInstanceWorkitem;
};

interface SObjectDefinition$ProcessInstance extends SObjectDefinition<'ProcessInstance'> {
    Name: 'ProcessInstance';
    Fields: Fields$ProcessInstance;
    ParentReferences: ParentReferences$ProcessInstance;
    ChildRelationships: ChildRelationships$ProcessInstance;
  }

type Fields$ProcessInstanceHistory = {
  //
  Id: string;
  IsPending: boolean;
  ProcessInstanceId: string;
  TargetObjectId: string | null;
  StepStatus: string | null;
  ProcessNodeId: string | null;
  OriginalActorId: string;
  ActorId: string;
  RemindersSent: number | null;
  ElapsedTimeInDays: number | null;
  ElapsedTimeInHours: number | null;
  ElapsedTimeInMinutes: number | null;
  Comments: string | null;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ProcessInstanceHistory = {
  //
  ProcessInstance: SObjectDefinition$ProcessInstance;
  TargetObject: SObjectDefinition$Name | null;
  ProcessNode: SObjectDefinition$ProcessNode | null;
  OriginalActor: SObjectDefinition$Name;
  Actor: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProcessInstanceHistory = {
  //
};

interface SObjectDefinition$ProcessInstanceHistory extends SObjectDefinition<'ProcessInstanceHistory'> {
    Name: 'ProcessInstanceHistory';
    Fields: Fields$ProcessInstanceHistory;
    ParentReferences: ParentReferences$ProcessInstanceHistory;
    ChildRelationships: ChildRelationships$ProcessInstanceHistory;
  }

type Fields$ProcessInstanceNode = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ProcessInstanceId: string;
  ProcessNodeId: string;
  NodeStatus: string | null;
  CompletedDate: DateString | null;
  LastActorId: string | null;
  ProcessNodeName: string | null;
  ElapsedTimeInDays: number | null;
  ElapsedTimeInHours: number | null;
  ElapsedTimeInMinutes: number | null;
};

type ParentReferences$ProcessInstanceNode = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ProcessInstance: SObjectDefinition$ProcessInstance;
  ProcessNode: SObjectDefinition$ProcessNode;
  LastActor: SObjectDefinition$User | null;
};

type ChildRelationships$ProcessInstanceNode = {
  //
};

interface SObjectDefinition$ProcessInstanceNode extends SObjectDefinition<'ProcessInstanceNode'> {
    Name: 'ProcessInstanceNode';
    Fields: Fields$ProcessInstanceNode;
    ParentReferences: ParentReferences$ProcessInstanceNode;
    ChildRelationships: ChildRelationships$ProcessInstanceNode;
  }

type Fields$ProcessInstanceStep = {
  //
  Id: string;
  ProcessInstanceId: string;
  StepStatus: string | null;
  OriginalActorId: string;
  ActorId: string;
  Comments: string | null;
  StepNodeId: string | null;
  ElapsedTimeInDays: number | null;
  ElapsedTimeInHours: number | null;
  ElapsedTimeInMinutes: number | null;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ProcessInstanceStep = {
  //
  ProcessInstance: SObjectDefinition$ProcessInstance;
  OriginalActor: SObjectDefinition$Name;
  Actor: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProcessInstanceStep = {
  //
};

interface SObjectDefinition$ProcessInstanceStep extends SObjectDefinition<'ProcessInstanceStep'> {
    Name: 'ProcessInstanceStep';
    Fields: Fields$ProcessInstanceStep;
    ParentReferences: ParentReferences$ProcessInstanceStep;
    ChildRelationships: ChildRelationships$ProcessInstanceStep;
  }

type Fields$ProcessInstanceWorkitem = {
  //
  Id: string;
  ProcessInstanceId: string;
  OriginalActorId: string;
  ActorId: string;
  ElapsedTimeInDays: number | null;
  ElapsedTimeInHours: number | null;
  ElapsedTimeInMinutes: number | null;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$ProcessInstanceWorkitem = {
  //
  ProcessInstance: SObjectDefinition$ProcessInstance;
  OriginalActor: SObjectDefinition$Name;
  Actor: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProcessInstanceWorkitem = {
  //
};

interface SObjectDefinition$ProcessInstanceWorkitem extends SObjectDefinition<'ProcessInstanceWorkitem'> {
    Name: 'ProcessInstanceWorkitem';
    Fields: Fields$ProcessInstanceWorkitem;
    ParentReferences: ParentReferences$ProcessInstanceWorkitem;
    ChildRelationships: ChildRelationships$ProcessInstanceWorkitem;
  }

type Fields$ProcessNode = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  ProcessDefinitionId: string;
  Description: string | null;
  SystemModstamp: DateString;
};

type ParentReferences$ProcessNode = {
  //
  ProcessDefinition: SObjectDefinition$ProcessDefinition;
};

type ChildRelationships$ProcessNode = {
  //
};

interface SObjectDefinition$ProcessNode extends SObjectDefinition<'ProcessNode'> {
    Name: 'ProcessNode';
    Fields: Fields$ProcessNode;
    ParentReferences: ParentReferences$ProcessNode;
    ChildRelationships: ChildRelationships$ProcessNode;
  }

type Fields$Product2 = {
  //
  Id: string;
  Name: string;
  ProductCode: string | null;
  Description: string | null;
  IsActive: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Family: string | null;
  CurrencyIsoCode: string;
  ExternalDataSourceId: string | null;
  ExternalId: string | null;
  DisplayUrl: string | null;
  QuantityUnitOfMeasure: string | null;
  IsDeleted: boolean;
  IsArchived: boolean;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  StockKeepingUnit: string | null;
};

type ParentReferences$Product2 = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Product2 = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  Assets: SObjectDefinition$Asset;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  PricebookEntries: SObjectDefinition$PricebookEntry;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$Product2Feed;
  Histories: SObjectDefinition$Product2History;
  ProductsConsumed: SObjectDefinition$ProductConsumed;
  ProductItems: SObjectDefinition$ProductItem;
  ProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  ProductsRequired: SObjectDefinition$ProductRequired;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  Tasks: SObjectDefinition$Task;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$Product2 extends SObjectDefinition<'Product2'> {
    Name: 'Product2';
    Fields: Fields$Product2;
    ParentReferences: ParentReferences$Product2;
    ChildRelationships: ChildRelationships$Product2;
  }

type Fields$Product2ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  ProductCode: string | null;
  Description: string | null;
  IsActive: boolean;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Family: string | null;
  CurrencyIsoCode: string | null;
  ExternalDataSourceId: string | null;
  ExternalId: string | null;
  DisplayUrl: string | null;
  QuantityUnitOfMeasure: string | null;
  IsArchived: boolean;
  StockKeepingUnit: string | null;
};

type ParentReferences$Product2ChangeEvent = {
  //
};

type ChildRelationships$Product2ChangeEvent = {
  //
};

interface SObjectDefinition$Product2ChangeEvent extends SObjectDefinition<'Product2ChangeEvent'> {
    Name: 'Product2ChangeEvent';
    Fields: Fields$Product2ChangeEvent;
    ParentReferences: ParentReferences$Product2ChangeEvent;
    ChildRelationships: ChildRelationships$Product2ChangeEvent;
  }

type Fields$Product2Feed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$Product2Feed = {
  //
  Parent: SObjectDefinition$Product2;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$Product2Feed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$Product2Feed extends SObjectDefinition<'Product2Feed'> {
    Name: 'Product2Feed';
    Fields: Fields$Product2Feed;
    ParentReferences: ParentReferences$Product2Feed;
    ChildRelationships: ChildRelationships$Product2Feed;
  }

type Fields$Product2History = {
  //
  Id: string;
  IsDeleted: boolean;
  Product2Id: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$Product2History = {
  //
  Product2: SObjectDefinition$Product2;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$Product2History = {
  //
};

interface SObjectDefinition$Product2History extends SObjectDefinition<'Product2History'> {
    Name: 'Product2History';
    Fields: Fields$Product2History;
    ParentReferences: ParentReferences$Product2History;
    ChildRelationships: ChildRelationships$Product2History;
  }

type Fields$ProductConsumed = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductConsumedNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  WorkOrderId: string;
  WorkOrderLineItemId: string | null;
  ProductItemId: string | null;
  PricebookEntryId: string | null;
  Product2Id: string | null;
  ProductName: string | null;
  QuantityUnitOfMeasure: string | null;
  QuantityConsumed: number;
  UnitPrice: number | null;
  Description: string | null;
};

type ParentReferences$ProductConsumed = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  WorkOrder: SObjectDefinition$WorkOrder;
  WorkOrderLineItem: SObjectDefinition$WorkOrderLineItem | null;
  ProductItem: SObjectDefinition$ProductItem | null;
  PricebookEntry: SObjectDefinition$PricebookEntry | null;
  Product2: SObjectDefinition$Product2 | null;
};

type ChildRelationships$ProductConsumed = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProductConsumedFeed;
  Histories: SObjectDefinition$ProductConsumedHistory;
  ProductItemTransactions: SObjectDefinition$ProductItemTransaction;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductConsumed extends SObjectDefinition<'ProductConsumed'> {
    Name: 'ProductConsumed';
    Fields: Fields$ProductConsumed;
    ParentReferences: ParentReferences$ProductConsumed;
    ChildRelationships: ChildRelationships$ProductConsumed;
  }

type Fields$ProductConsumedFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductConsumedFeed = {
  //
  Parent: SObjectDefinition$ProductConsumed;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductConsumedFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductConsumedFeed extends SObjectDefinition<'ProductConsumedFeed'> {
    Name: 'ProductConsumedFeed';
    Fields: Fields$ProductConsumedFeed;
    ParentReferences: ParentReferences$ProductConsumedFeed;
    ChildRelationships: ChildRelationships$ProductConsumedFeed;
  }

type Fields$ProductConsumedHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductConsumedId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductConsumedHistory = {
  //
  ProductConsumed: SObjectDefinition$ProductConsumed;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductConsumedHistory = {
  //
};

interface SObjectDefinition$ProductConsumedHistory extends SObjectDefinition<'ProductConsumedHistory'> {
    Name: 'ProductConsumedHistory';
    Fields: Fields$ProductConsumedHistory;
    ParentReferences: ParentReferences$ProductConsumedHistory;
    ChildRelationships: ChildRelationships$ProductConsumedHistory;
  }

type Fields$ProductItem = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  ProductItemNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  LocationId: string;
  Product2Id: string;
  ProductName: string | null;
  SerialNumber: string | null;
  QuantityOnHand: number;
  QuantityUnitOfMeasure: string | null;
};

type ParentReferences$ProductItem = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Location: SObjectDefinition$Location;
  Product2: SObjectDefinition$Product2;
};

type ChildRelationships$ProductItem = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductsConsumed: SObjectDefinition$ProductConsumed;
  Feeds: SObjectDefinition$ProductItemFeed;
  Histories: SObjectDefinition$ProductItemHistory;
  ProductItemTransactions: SObjectDefinition$ProductItemTransaction;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductItem extends SObjectDefinition<'ProductItem'> {
    Name: 'ProductItem';
    Fields: Fields$ProductItem;
    ParentReferences: ParentReferences$ProductItem;
    ChildRelationships: ChildRelationships$ProductItem;
  }

type Fields$ProductItemFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductItemFeed = {
  //
  Parent: SObjectDefinition$ProductItem;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductItemFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductItemFeed extends SObjectDefinition<'ProductItemFeed'> {
    Name: 'ProductItemFeed';
    Fields: Fields$ProductItemFeed;
    ParentReferences: ParentReferences$ProductItemFeed;
    ChildRelationships: ChildRelationships$ProductItemFeed;
  }

type Fields$ProductItemHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductItemId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductItemHistory = {
  //
  ProductItem: SObjectDefinition$ProductItem;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductItemHistory = {
  //
};

interface SObjectDefinition$ProductItemHistory extends SObjectDefinition<'ProductItemHistory'> {
    Name: 'ProductItemHistory';
    Fields: Fields$ProductItemHistory;
    ParentReferences: ParentReferences$ProductItemHistory;
    ChildRelationships: ChildRelationships$ProductItemHistory;
  }

type Fields$ProductItemShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ProductItemShare = {
  //
  Parent: SObjectDefinition$ProductItem;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductItemShare = {
  //
};

interface SObjectDefinition$ProductItemShare extends SObjectDefinition<'ProductItemShare'> {
    Name: 'ProductItemShare';
    Fields: Fields$ProductItemShare;
    ParentReferences: ParentReferences$ProductItemShare;
    ChildRelationships: ChildRelationships$ProductItemShare;
  }

type Fields$ProductItemTransaction = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductItemTransactionNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ProductItemId: string;
  RelatedRecordId: string | null;
  TransactionType: string;
  Description: string | null;
  Quantity: number;
};

type ParentReferences$ProductItemTransaction = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ProductItem: SObjectDefinition$ProductItem;
  RelatedRecord: SObjectDefinition$Name | null;
};

type ChildRelationships$ProductItemTransaction = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProductItemTransactionFeed;
  Histories: SObjectDefinition$ProductItemTransactionHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductItemTransaction extends SObjectDefinition<'ProductItemTransaction'> {
    Name: 'ProductItemTransaction';
    Fields: Fields$ProductItemTransaction;
    ParentReferences: ParentReferences$ProductItemTransaction;
    ChildRelationships: ChildRelationships$ProductItemTransaction;
  }

type Fields$ProductItemTransactionFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductItemTransactionFeed = {
  //
  Parent: SObjectDefinition$ProductItemTransaction;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductItemTransactionFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductItemTransactionFeed extends SObjectDefinition<'ProductItemTransactionFeed'> {
    Name: 'ProductItemTransactionFeed';
    Fields: Fields$ProductItemTransactionFeed;
    ParentReferences: ParentReferences$ProductItemTransactionFeed;
    ChildRelationships: ChildRelationships$ProductItemTransactionFeed;
  }

type Fields$ProductItemTransactionHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductItemTransactionId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductItemTransactionHistory = {
  //
  ProductItemTransaction: SObjectDefinition$ProductItemTransaction;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductItemTransactionHistory = {
  //
};

interface SObjectDefinition$ProductItemTransactionHistory extends SObjectDefinition<'ProductItemTransactionHistory'> {
    Name: 'ProductItemTransactionHistory';
    Fields: Fields$ProductItemTransactionHistory;
    ParentReferences: ParentReferences$ProductItemTransactionHistory;
    ChildRelationships: ChildRelationships$ProductItemTransactionHistory;
  }

type Fields$ProductRequest = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  ProductRequestNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  WorkOrderId: string | null;
  WorkOrderLineItemId: string | null;
  NeedByDate: DateString | null;
  Status: string | null;
  ShipmentType: string | null;
  ShipToStreet: string | null;
  ShipToCity: string | null;
  ShipToState: string | null;
  ShipToPostalCode: string | null;
  ShipToCountry: string | null;
  ShipToLatitude: number | null;
  ShipToLongitude: number | null;
  ShipToGeocodeAccuracy: string | null;
  ShipToAddress: Address | null;
  Description: string | null;
  DestinationLocationId: string | null;
  SourceLocationId: string | null;
  CaseId: string | null;
  AccountId: string | null;
};

type ParentReferences$ProductRequest = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  WorkOrder: SObjectDefinition$WorkOrder | null;
  WorkOrderLineItem: SObjectDefinition$WorkOrderLineItem | null;
  DestinationLocation: SObjectDefinition$Location | null;
  SourceLocation: SObjectDefinition$Location | null;
  Case: SObjectDefinition$Case | null;
  Account: SObjectDefinition$Account | null;
};

type ChildRelationships$ProductRequest = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProductRequestFeed;
  Histories: SObjectDefinition$ProductRequestHistory;
  ProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrders: SObjectDefinition$ReturnOrder;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductRequest extends SObjectDefinition<'ProductRequest'> {
    Name: 'ProductRequest';
    Fields: Fields$ProductRequest;
    ParentReferences: ParentReferences$ProductRequest;
    ChildRelationships: ChildRelationships$ProductRequest;
  }

type Fields$ProductRequestFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductRequestFeed = {
  //
  Parent: SObjectDefinition$ProductRequest;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductRequestFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductRequestFeed extends SObjectDefinition<'ProductRequestFeed'> {
    Name: 'ProductRequestFeed';
    Fields: Fields$ProductRequestFeed;
    ParentReferences: ParentReferences$ProductRequestFeed;
    ChildRelationships: ChildRelationships$ProductRequestFeed;
  }

type Fields$ProductRequestHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductRequestId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductRequestHistory = {
  //
  ProductRequest: SObjectDefinition$ProductRequest;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductRequestHistory = {
  //
};

interface SObjectDefinition$ProductRequestHistory extends SObjectDefinition<'ProductRequestHistory'> {
    Name: 'ProductRequestHistory';
    Fields: Fields$ProductRequestHistory;
    ParentReferences: ParentReferences$ProductRequestHistory;
    ChildRelationships: ChildRelationships$ProductRequestHistory;
  }

type Fields$ProductRequestLineItem = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductRequestLineItemNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentId: string;
  Product2Id: string;
  QuantityRequested: number;
  QuantityUnitOfMeasure: string | null;
  WorkOrderId: string | null;
  WorkOrderLineItemId: string | null;
  NeedByDate: DateString | null;
  Status: string | null;
  ShipmentType: string | null;
  ShipToStreet: string | null;
  ShipToCity: string | null;
  ShipToState: string | null;
  ShipToPostalCode: string | null;
  ShipToCountry: string | null;
  ShipToLatitude: number | null;
  ShipToLongitude: number | null;
  ShipToGeocodeAccuracy: string | null;
  ShipToAddress: Address | null;
  Description: string | null;
  DestinationLocationId: string | null;
  SourceLocationId: string | null;
  CaseId: string | null;
  AccountId: string | null;
};

type ParentReferences$ProductRequestLineItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$ProductRequest;
  Product2: SObjectDefinition$Product2;
  WorkOrder: SObjectDefinition$WorkOrder | null;
  WorkOrderLineItem: SObjectDefinition$WorkOrderLineItem | null;
  DestinationLocation: SObjectDefinition$Location | null;
  SourceLocation: SObjectDefinition$Location | null;
  Case: SObjectDefinition$Case | null;
  Account: SObjectDefinition$Account | null;
};

type ChildRelationships$ProductRequestLineItem = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProductRequestLineItemFeed;
  Histories: SObjectDefinition$ProductRequestLineItemHistory;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  ReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductRequestLineItem extends SObjectDefinition<'ProductRequestLineItem'> {
    Name: 'ProductRequestLineItem';
    Fields: Fields$ProductRequestLineItem;
    ParentReferences: ParentReferences$ProductRequestLineItem;
    ChildRelationships: ChildRelationships$ProductRequestLineItem;
  }

type Fields$ProductRequestLineItemFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductRequestLineItemFeed = {
  //
  Parent: SObjectDefinition$ProductRequestLineItem;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductRequestLineItemFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductRequestLineItemFeed extends SObjectDefinition<'ProductRequestLineItemFeed'> {
    Name: 'ProductRequestLineItemFeed';
    Fields: Fields$ProductRequestLineItemFeed;
    ParentReferences: ParentReferences$ProductRequestLineItemFeed;
    ChildRelationships: ChildRelationships$ProductRequestLineItemFeed;
  }

type Fields$ProductRequestLineItemHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductRequestLineItemId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductRequestLineItemHistory = {
  //
  ProductRequestLineItem: SObjectDefinition$ProductRequestLineItem;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductRequestLineItemHistory = {
  //
};

interface SObjectDefinition$ProductRequestLineItemHistory extends SObjectDefinition<'ProductRequestLineItemHistory'> {
    Name: 'ProductRequestLineItemHistory';
    Fields: Fields$ProductRequestLineItemHistory;
    ParentReferences: ParentReferences$ProductRequestLineItemHistory;
    ChildRelationships: ChildRelationships$ProductRequestLineItemHistory;
  }

type Fields$ProductRequestShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ProductRequestShare = {
  //
  Parent: SObjectDefinition$ProductRequest;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductRequestShare = {
  //
};

interface SObjectDefinition$ProductRequestShare extends SObjectDefinition<'ProductRequestShare'> {
    Name: 'ProductRequestShare';
    Fields: Fields$ProductRequestShare;
    ParentReferences: ParentReferences$ProductRequestShare;
    ChildRelationships: ChildRelationships$ProductRequestShare;
  }

type Fields$ProductRequired = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductRequiredNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentRecordId: string;
  ParentRecordType: string | null;
  Product2Id: string;
  ProductName: string | null;
  QuantityRequired: number | null;
  QuantityUnitOfMeasure: string | null;
};

type ParentReferences$ProductRequired = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentRecord: SObjectDefinition$Name;
  Product2: SObjectDefinition$Product2;
};

type ChildRelationships$ProductRequired = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProductRequiredFeed;
  Histories: SObjectDefinition$ProductRequiredHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductRequired extends SObjectDefinition<'ProductRequired'> {
    Name: 'ProductRequired';
    Fields: Fields$ProductRequired;
    ParentReferences: ParentReferences$ProductRequired;
    ChildRelationships: ChildRelationships$ProductRequired;
  }

type Fields$ProductRequiredFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductRequiredFeed = {
  //
  Parent: SObjectDefinition$ProductRequired;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductRequiredFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductRequiredFeed extends SObjectDefinition<'ProductRequiredFeed'> {
    Name: 'ProductRequiredFeed';
    Fields: Fields$ProductRequiredFeed;
    ParentReferences: ParentReferences$ProductRequiredFeed;
    ChildRelationships: ChildRelationships$ProductRequiredFeed;
  }

type Fields$ProductRequiredHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductRequiredId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductRequiredHistory = {
  //
  ProductRequired: SObjectDefinition$ProductRequired;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductRequiredHistory = {
  //
};

interface SObjectDefinition$ProductRequiredHistory extends SObjectDefinition<'ProductRequiredHistory'> {
    Name: 'ProductRequiredHistory';
    Fields: Fields$ProductRequiredHistory;
    ParentReferences: ParentReferences$ProductRequiredHistory;
    ChildRelationships: ChildRelationships$ProductRequiredHistory;
  }

type Fields$ProductTransfer = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  ProductTransferNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ProductRequestLineItemId: string | null;
  ProductRequestId: string | null;
  SourceProductItemId: string | null;
  Product2Id: string | null;
  QuantitySent: number;
  QuantityReceived: number | null;
  SourceLocationId: string | null;
  DestinationLocationId: string | null;
  IsReceived: boolean;
  ReceivedById: string | null;
  Description: string | null;
  QuantityUnitOfMeasure: string | null;
  ShipmentId: string | null;
  ExpectedPickupDate: DateString | null;
  Status: string | null;
  ShipmentExpectedDeliveryDate: DateString | null;
  ShipmentStatus: string | null;
  ShipmentTrackingNumber: string | null;
  ShipmentTrackingUrl: string | null;
  ReturnOrderLineItemId: string | null;
  ReturnOrderId: string | null;
};

type ParentReferences$ProductTransfer = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ProductRequestLineItem: SObjectDefinition$ProductRequestLineItem | null;
  ProductRequest: SObjectDefinition$ProductRequest | null;
  SourceProductItem: SObjectDefinition$ProductItem | null;
  Product2: SObjectDefinition$Product2 | null;
  SourceLocation: SObjectDefinition$Location | null;
  DestinationLocation: SObjectDefinition$Location | null;
  ReceivedBy: SObjectDefinition$Name | null;
  Shipment: SObjectDefinition$Shipment | null;
  ReturnOrderLineItem: SObjectDefinition$ReturnOrderLineItem | null;
  ReturnOrder: SObjectDefinition$ReturnOrder | null;
};

type ChildRelationships$ProductTransfer = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductItemTransactions: SObjectDefinition$ProductItemTransaction;
  Feeds: SObjectDefinition$ProductTransferFeed;
  Histories: SObjectDefinition$ProductTransferHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ProductTransfer extends SObjectDefinition<'ProductTransfer'> {
    Name: 'ProductTransfer';
    Fields: Fields$ProductTransfer;
    ParentReferences: ParentReferences$ProductTransfer;
    ChildRelationships: ChildRelationships$ProductTransfer;
  }

type Fields$ProductTransferFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ProductTransferFeed = {
  //
  Parent: SObjectDefinition$ProductTransfer;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProductTransferFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProductTransferFeed extends SObjectDefinition<'ProductTransferFeed'> {
    Name: 'ProductTransferFeed';
    Fields: Fields$ProductTransferFeed;
    ParentReferences: ParentReferences$ProductTransferFeed;
    ChildRelationships: ChildRelationships$ProductTransferFeed;
  }

type Fields$ProductTransferHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProductTransferId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProductTransferHistory = {
  //
  ProductTransfer: SObjectDefinition$ProductTransfer;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductTransferHistory = {
  //
};

interface SObjectDefinition$ProductTransferHistory extends SObjectDefinition<'ProductTransferHistory'> {
    Name: 'ProductTransferHistory';
    Fields: Fields$ProductTransferHistory;
    ParentReferences: ParentReferences$ProductTransferHistory;
    ChildRelationships: ChildRelationships$ProductTransferHistory;
  }

type Fields$ProductTransferShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ProductTransferShare = {
  //
  Parent: SObjectDefinition$ProductTransfer;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductTransferShare = {
  //
};

interface SObjectDefinition$ProductTransferShare extends SObjectDefinition<'ProductTransferShare'> {
    Name: 'ProductTransferShare';
    Fields: Fields$ProductTransferShare;
    ParentReferences: ParentReferences$ProductTransferShare;
    ChildRelationships: ChildRelationships$ProductTransferShare;
  }

type Fields$Product__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  IsTaxable__c: boolean;
  UnitPrice__c: number | null;
};

type ParentReferences$Product__ChangeEvent = {
  //
};

type ChildRelationships$Product__ChangeEvent = {
  //
};

interface SObjectDefinition$Product__ChangeEvent extends SObjectDefinition<'Product__ChangeEvent'> {
    Name: 'Product__ChangeEvent';
    Fields: Fields$Product__ChangeEvent;
    ParentReferences: ParentReferences$Product__ChangeEvent;
    ChildRelationships: ChildRelationships$Product__ChangeEvent;
  }

type Fields$Product__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsTaxable__c: boolean;
  UnitPrice__c: number | null;
};

type ParentReferences$Product__c = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Product__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Product__c extends SObjectDefinition<'Product__c'> {
    Name: 'Product__c';
    Fields: Fields$Product__c;
    ParentReferences: ParentReferences$Product__c;
    ChildRelationships: ChildRelationships$Product__c;
  }

type Fields$Profile = {
  //
  Id: string;
  Name: string;
  PermissionsEmailSingle: boolean;
  PermissionsEmailMass: boolean;
  PermissionsEditTask: boolean;
  PermissionsEditEvent: boolean;
  PermissionsExportReport: boolean;
  PermissionsImportPersonal: boolean;
  PermissionsDataExport: boolean;
  PermissionsManageUsers: boolean;
  PermissionsEditPublicFilters: boolean;
  PermissionsEditPublicTemplates: boolean;
  PermissionsModifyAllData: boolean;
  PermissionsManageCases: boolean;
  PermissionsMassInlineEdit: boolean;
  PermissionsEditKnowledge: boolean;
  PermissionsManageKnowledge: boolean;
  PermissionsManageSolutions: boolean;
  PermissionsCustomizeApplication: boolean;
  PermissionsEditReadonlyFields: boolean;
  PermissionsRunReports: boolean;
  PermissionsViewSetup: boolean;
  PermissionsTransferAnyEntity: boolean;
  PermissionsNewReportBuilder: boolean;
  PermissionsActivateContract: boolean;
  PermissionsActivateOrder: boolean;
  PermissionsImportLeads: boolean;
  PermissionsManageLeads: boolean;
  PermissionsTransferAnyLead: boolean;
  PermissionsViewAllData: boolean;
  PermissionsEditPublicDocuments: boolean;
  PermissionsContentHubOnPremiseUser: boolean;
  PermissionsViewEncryptedData: boolean;
  PermissionsEditBrandTemplates: boolean;
  PermissionsEditHtmlTemplates: boolean;
  PermissionsChatterInternalUser: boolean;
  PermissionsManageEncryptionKeys: boolean;
  PermissionsDeleteActivatedContract: boolean;
  PermissionsChatterInviteExternalUsers: boolean;
  PermissionsSendSitRequests: boolean;
  PermissionsManageRemoteAccess: boolean;
  PermissionsCanUseNewDashboardBuilder: boolean;
  PermissionsManageCategories: boolean;
  PermissionsConvertLeads: boolean;
  PermissionsPasswordNeverExpires: boolean;
  PermissionsUseTeamReassignWizards: boolean;
  PermissionsEditActivatedOrders: boolean;
  PermissionsInstallMultiforce: boolean;
  PermissionsChatterOwnGroups: boolean;
  PermissionsEditOppLineItemUnitPrice: boolean;
  PermissionsBulkApiHardDelete: boolean;
  PermissionsSolutionImport: boolean;
  PermissionsManageCallCenters: boolean;
  PermissionsManageSynonyms: boolean;
  PermissionsViewContent: boolean;
  PermissionsManageEmailClientConfig: boolean;
  PermissionsEnableNotifications: boolean;
  PermissionsManageDataIntegrations: boolean;
  PermissionsDistributeFromPersWksp: boolean;
  PermissionsViewDataCategories: boolean;
  PermissionsManageDataCategories: boolean;
  PermissionsAuthorApex: boolean;
  PermissionsManageMobile: boolean;
  PermissionsApiEnabled: boolean;
  PermissionsManageCustomReportTypes: boolean;
  PermissionsEditCaseComments: boolean;
  PermissionsTransferAnyCase: boolean;
  PermissionsContentAdministrator: boolean;
  PermissionsCreateWorkspaces: boolean;
  PermissionsManageContentPermissions: boolean;
  PermissionsManageContentProperties: boolean;
  PermissionsManageContentTypes: boolean;
  PermissionsManageExchangeConfig: boolean;
  PermissionsManageAnalyticSnapshots: boolean;
  PermissionsScheduleReports: boolean;
  PermissionsManageBusinessHourHolidays: boolean;
  PermissionsManageDynamicDashboards: boolean;
  PermissionsCustomSidebarOnAllPages: boolean;
  PermissionsManageInteraction: boolean;
  PermissionsViewMyTeamsDashboards: boolean;
  PermissionsModerateChatter: boolean;
  PermissionsResetPasswords: boolean;
  PermissionsFlowUFLRequired: boolean;
  PermissionsCanInsertFeedSystemFields: boolean;
  PermissionsManageKnowledgeImportExport: boolean;
  PermissionsEmailTemplateManagement: boolean;
  PermissionsEmailAdministration: boolean;
  PermissionsManageChatterMessages: boolean;
  PermissionsAllowEmailIC: boolean;
  PermissionsChatterFileLink: boolean;
  PermissionsForceTwoFactor: boolean;
  PermissionsViewEventLogFiles: boolean;
  PermissionsManageNetworks: boolean;
  PermissionsManageAuthProviders: boolean;
  PermissionsRunFlow: boolean;
  PermissionsCreateCustomizeDashboards: boolean;
  PermissionsCreateDashboardFolders: boolean;
  PermissionsViewPublicDashboards: boolean;
  PermissionsManageDashbdsInPubFolders: boolean;
  PermissionsCreateCustomizeReports: boolean;
  PermissionsCreateReportFolders: boolean;
  PermissionsViewPublicReports: boolean;
  PermissionsManageReportsInPubFolders: boolean;
  PermissionsEditMyDashboards: boolean;
  PermissionsEditMyReports: boolean;
  PermissionsViewAllUsers: boolean;
  PermissionsAllowUniversalSearch: boolean;
  PermissionsConnectOrgToEnvironmentHub: boolean;
  PermissionsWorkCalibrationUser: boolean;
  PermissionsCreateCustomizeFilters: boolean;
  PermissionsWorkDotComUserPerm: boolean;
  PermissionsContentHubUser: boolean;
  PermissionsGovernNetworks: boolean;
  PermissionsSalesConsole: boolean;
  PermissionsTwoFactorApi: boolean;
  PermissionsDeleteTopics: boolean;
  PermissionsEditTopics: boolean;
  PermissionsCreateTopics: boolean;
  PermissionsAssignTopics: boolean;
  PermissionsIdentityEnabled: boolean;
  PermissionsIdentityConnect: boolean;
  PermissionsAllowViewKnowledge: boolean;
  PermissionsContentWorkspaces: boolean;
  PermissionsCreateWorkBadgeDefinition: boolean;
  PermissionsManageSearchPromotionRules: boolean;
  PermissionsCustomMobileAppsAccess: boolean;
  PermissionsViewHelpLink: boolean;
  PermissionsManageProfilesPermissionsets: boolean;
  PermissionsAssignPermissionSets: boolean;
  PermissionsManageRoles: boolean;
  PermissionsManageIpAddresses: boolean;
  PermissionsManageSharing: boolean;
  PermissionsManageInternalUsers: boolean;
  PermissionsManagePasswordPolicies: boolean;
  PermissionsManageLoginAccessPolicies: boolean;
  PermissionsManageCustomPermissions: boolean;
  PermissionsCanVerifyComment: boolean;
  PermissionsManageUnlistedGroups: boolean;
  PermissionsModifySecureAgents: boolean;
  PermissionsInsightsAppDashboardEditor: boolean;
  PermissionsManageTwoFactor: boolean;
  PermissionsInsightsAppUser: boolean;
  PermissionsInsightsAppAdmin: boolean;
  PermissionsInsightsAppEltEditor: boolean;
  PermissionsInsightsAppUploadUser: boolean;
  PermissionsInsightsCreateApplication: boolean;
  PermissionsLightningExperienceUser: boolean;
  PermissionsViewDataLeakageEvents: boolean;
  PermissionsConfigCustomRecs: boolean;
  PermissionsSubmitMacrosAllowed: boolean;
  PermissionsBulkMacrosAllowed: boolean;
  PermissionsShareInternalArticles: boolean;
  PermissionsManageSessionPermissionSets: boolean;
  PermissionsManageTemplatedApp: boolean;
  PermissionsUseTemplatedApp: boolean;
  PermissionsSendAnnouncementEmails: boolean;
  PermissionsChatterEditOwnPost: boolean;
  PermissionsChatterEditOwnRecordPost: boolean;
  PermissionsWaveTabularDownload: boolean;
  PermissionsImportCustomObjects: boolean;
  PermissionsDelegatedTwoFactor: boolean;
  PermissionsChatterComposeUiCodesnippet: boolean;
  PermissionsSelectFilesFromSalesforce: boolean;
  PermissionsModerateNetworkUsers: boolean;
  PermissionsMergeTopics: boolean;
  PermissionsSubscribeToLightningReports: boolean;
  PermissionsManagePvtRptsAndDashbds: boolean;
  PermissionsAllowLightningLogin: boolean;
  PermissionsCampaignInfluence2: boolean;
  PermissionsViewDataAssessment: boolean;
  PermissionsRemoveDirectMessageMembers: boolean;
  PermissionsCanApproveFeedPost: boolean;
  PermissionsAddDirectMessageMembers: boolean;
  PermissionsAllowViewEditConvertedLeads: boolean;
  PermissionsFieldServiceAccess: boolean;
  PermissionsFieldServiceScheduling: boolean;
  PermissionsFieldServiceDispatcher: boolean;
  PermissionsFieldServiceMobileApp: boolean;
  PermissionsShowCompanyNameAsUserBadge: boolean;
  PermissionsAccessCMC: boolean;
  PermissionsOptOutGeoLocationTracking: boolean;
  PermissionsViewHealthCheck: boolean;
  PermissionsManageHealthCheck: boolean;
  PermissionsPackaging2: boolean;
  PermissionsManageCertificates: boolean;
  PermissionsCreateReportInLightning: boolean;
  PermissionsPreventClassicExperience: boolean;
  PermissionsHideReadByList: boolean;
  PermissionsListEmailSend: boolean;
  PermissionsFeedPinning: boolean;
  PermissionsChangeDashboardColors: boolean;
  PermissionsIotUser: boolean;
  PermissionsManageRecommendationStrategies: boolean;
  PermissionsManagePropositions: boolean;
  PermissionsCloseConversations: boolean;
  PermissionsUseWebLink: boolean;
  PermissionsViewOnlyEmbeddedAppUser: boolean;
  PermissionsSendExternalEmailAvailable: boolean;
  PermissionsViewAllActivities: boolean;
  PermissionsSubscribeReportToOtherUsers: boolean;
  PermissionsLightningConsoleAllowedForUser: boolean;
  PermissionsSubscribeReportsRunAsUser: boolean;
  PermissionsSubscribeToLightningDashboards: boolean;
  PermissionsSubscribeDashboardToOtherUsers: boolean;
  PermissionsApexRestServices: boolean;
  PermissionsEnableCommunityAppLauncher: boolean;
  PermissionsLtngPromoReserved01UserPerm: boolean;
  PermissionsCanEditDataPrepRecipe: boolean;
  PermissionsAddAnalyticsRemoteConnections: boolean;
  PermissionsManageSurveys: boolean;
  PermissionsRecordVisibilityAPI: boolean;
  PermissionsViewRoles: boolean;
  PermissionsModifyMetadata: boolean;
  UserLicenseId: string;
  UserType: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Profile = {
  //
  UserLicense: SObjectDefinition$UserLicense;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Profile = {
  //
  MobileSettingsAssignments: SObjectDefinition$MobileSettingsAssignment;
  Users: SObjectDefinition$User;
};

interface SObjectDefinition$Profile extends SObjectDefinition<'Profile'> {
    Name: 'Profile';
    Fields: Fields$Profile;
    ParentReferences: ParentReferences$Profile;
    ChildRelationships: ChildRelationships$Profile;
  }

type Fields$Project__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CurrencyIsoCode: string | null;
  RecordTypeId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Account__c: string | null;
  EndDate__c: DateString | null;
  IsActive__c: boolean;
  MainContact__c: string | null;
  ProjectManager__c: string | null;
  StartDate__c: DateString | null;
};

type ParentReferences$Project__ChangeEvent = {
  //
};

type ChildRelationships$Project__ChangeEvent = {
  //
};

interface SObjectDefinition$Project__ChangeEvent extends SObjectDefinition<'Project__ChangeEvent'> {
    Name: 'Project__ChangeEvent';
    Fields: Fields$Project__ChangeEvent;
    ParentReferences: ParentReferences$Project__ChangeEvent;
    ChildRelationships: ChildRelationships$Project__ChangeEvent;
  }

type Fields$Project__Share = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$Project__Share = {
  //
  Parent: SObjectDefinition$Project__c;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Project__Share = {
  //
};

interface SObjectDefinition$Project__Share extends SObjectDefinition<'Project__Share'> {
    Name: 'Project__Share';
    Fields: Fields$Project__Share;
    ParentReferences: ParentReferences$Project__Share;
    ChildRelationships: ChildRelationships$Project__Share;
  }

type Fields$Project__c = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string | null;
  CurrencyIsoCode: string | null;
  RecordTypeId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  Account__c: string | null;
  EndDate__c: DateString | null;
  IsActive__c: boolean;
  MainContact__c: string | null;
  ProjectManager__c: string | null;
  StartDate__c: DateString | null;
};

type ParentReferences$Project__c = {
  //
  Owner: SObjectDefinition$Name;
  RecordType: SObjectDefinition$RecordType | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account__r: SObjectDefinition$Account | null;
  MainContact__r: SObjectDefinition$Contact | null;
  ProjectManager__r: SObjectDefinition$Employee__c | null;
};

type ChildRelationships$Project__c = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Shares: SObjectDefinition$Project__Share;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Project__c extends SObjectDefinition<'Project__c'> {
    Name: 'Project__c';
    Fields: Fields$Project__c;
    ParentReferences: ParentReferences$Project__c;
    ChildRelationships: ChildRelationships$Project__c;
  }

type Fields$Publisher = {
  //
  Id: string;
  DurableId: string | null;
  Name: string | null;
  NamespacePrefix: string | null;
  IsSalesforce: boolean;
  MajorVersion: number | null;
  MinorVersion: number | null;
};

type ParentReferences$Publisher = {
  //
};

type ChildRelationships$Publisher = {
  //
  InstalledEntityDefinitions: SObjectDefinition$EntityDefinition;
  InstalledFieldDefinitions: SObjectDefinition$FieldDefinition;
};

interface SObjectDefinition$Publisher extends SObjectDefinition<'Publisher'> {
    Name: 'Publisher';
    Fields: Fields$Publisher;
    ParentReferences: ParentReferences$Publisher;
    ChildRelationships: ChildRelationships$Publisher;
  }

type Fields$PushTopic = {
  //
  Id: string;
  Name: string;
  Query: string;
  ApiVersion: number;
  IsActive: boolean;
  NotifyForFields: string;
  NotifyForOperations: string;
  Description: string | null;
  NotifyForOperationCreate: boolean;
  NotifyForOperationUpdate: boolean;
  NotifyForOperationDelete: boolean;
  NotifyForOperationUndelete: boolean;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$PushTopic = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PushTopic = {
  //
};

interface SObjectDefinition$PushTopic extends SObjectDefinition<'PushTopic'> {
    Name: 'PushTopic';
    Fields: Fields$PushTopic;
    ParentReferences: ParentReferences$PushTopic;
    ChildRelationships: ChildRelationships$PushTopic;
  }

type Fields$QueueSobject = {
  //
  Id: string;
  QueueId: string;
  SobjectType: string;
  CreatedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$QueueSobject = {
  //
  Queue: SObjectDefinition$Group;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$QueueSobject = {
  //
};

interface SObjectDefinition$QueueSobject extends SObjectDefinition<'QueueSobject'> {
    Name: 'QueueSobject';
    Fields: Fields$QueueSobject;
    ParentReferences: ParentReferences$QueueSobject;
    ChildRelationships: ChildRelationships$QueueSobject;
  }

type Fields$QuickText = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Message: string;
  Category: string | null;
  Channel: string | null;
};

type ParentReferences$QuickText = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$QuickText = {
  //
  Histories: SObjectDefinition$QuickTextHistory;
};

interface SObjectDefinition$QuickText extends SObjectDefinition<'QuickText'> {
    Name: 'QuickText';
    Fields: Fields$QuickText;
    ParentReferences: ParentReferences$QuickText;
    ChildRelationships: ChildRelationships$QuickText;
  }

type Fields$QuickTextHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  QuickTextId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$QuickTextHistory = {
  //
  QuickText: SObjectDefinition$QuickText;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$QuickTextHistory = {
  //
};

interface SObjectDefinition$QuickTextHistory extends SObjectDefinition<'QuickTextHistory'> {
    Name: 'QuickTextHistory';
    Fields: Fields$QuickTextHistory;
    ParentReferences: ParentReferences$QuickTextHistory;
    ChildRelationships: ChildRelationships$QuickTextHistory;
  }

type Fields$QuickTextShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$QuickTextShare = {
  //
  Parent: SObjectDefinition$QuickText;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$QuickTextShare = {
  //
};

interface SObjectDefinition$QuickTextShare extends SObjectDefinition<'QuickTextShare'> {
    Name: 'QuickTextShare';
    Fields: Fields$QuickTextShare;
    ParentReferences: ParentReferences$QuickTextShare;
    ChildRelationships: ChildRelationships$QuickTextShare;
  }

type Fields$QuoteTemplateRichTextData = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Data: string | null;
};

type ParentReferences$QuoteTemplateRichTextData = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$QuoteTemplateRichTextData = {
  //
};

interface SObjectDefinition$QuoteTemplateRichTextData extends SObjectDefinition<'QuoteTemplateRichTextData'> {
    Name: 'QuoteTemplateRichTextData';
    Fields: Fields$QuoteTemplateRichTextData;
    ParentReferences: ParentReferences$QuoteTemplateRichTextData;
    ChildRelationships: ChildRelationships$QuoteTemplateRichTextData;
  }

type Fields$RecentlyViewed = {
  //
  Id: string;
  Name: string | null;
  LastName: string | null;
  FirstName: string | null;
  Type: string | null;
  Alias: string | null;
  UserRoleId: string | null;
  RecordTypeId: string | null;
  IsActive: boolean;
  ProfileId: string | null;
  Title: string | null;
  Email: string | null;
  Phone: string | null;
  NameOrAlias: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Language: string | null;
};

type ParentReferences$RecentlyViewed = {
  //
  UserRole: SObjectDefinition$UserRole | null;
  RecordType: SObjectDefinition$RecordType | null;
  Profile: SObjectDefinition$Profile | null;
};

type ChildRelationships$RecentlyViewed = {
  //
};

interface SObjectDefinition$RecentlyViewed extends SObjectDefinition<'RecentlyViewed'> {
    Name: 'RecentlyViewed';
    Fields: Fields$RecentlyViewed;
    ParentReferences: ParentReferences$RecentlyViewed;
    ChildRelationships: ChildRelationships$RecentlyViewed;
  }

type Fields$RecordAction = {
  //
  Id: string;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  RecordId: string;
  FlowDefinition: string | null;
  FlowInterviewId: string | null;
  Order: number;
  Status: string | null;
  Pinned: string | null;
  ActionType: string | null;
  ActionDefinition: string | null;
};

type ParentReferences$RecordAction = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Record: SObjectDefinition$Name;
  FlowInterview: SObjectDefinition$FlowInterview | null;
};

type ChildRelationships$RecordAction = {
  //
};

interface SObjectDefinition$RecordAction extends SObjectDefinition<'RecordAction'> {
    Name: 'RecordAction';
    Fields: Fields$RecordAction;
    ParentReferences: ParentReferences$RecordAction;
    ChildRelationships: ChildRelationships$RecordAction;
  }

type Fields$RecordType = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  NamespacePrefix: string | null;
  Description: string | null;
  BusinessProcessId: string | null;
  SobjectType: string;
  IsActive: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$RecordType = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$RecordType = {
  //
};

interface SObjectDefinition$RecordType extends SObjectDefinition<'RecordType'> {
    Name: 'RecordType';
    Fields: Fields$RecordType;
    ParentReferences: ParentReferences$RecordType;
    ChildRelationships: ChildRelationships$RecordType;
  }

type Fields$RelationshipDomain = {
  //
  Id: string;
  DurableId: string | null;
  ParentSobjectId: string | null;
  ChildSobjectId: string | null;
  FieldId: string | null;
  RelationshipInfoId: string | null;
  RelationshipName: string | null;
  IsCascadeDelete: boolean;
  IsDeprecatedAndHidden: boolean;
  IsRestrictedDelete: boolean;
  JunctionIdListNames: any | null;
};

type ParentReferences$RelationshipDomain = {
  //
};

type ChildRelationships$RelationshipDomain = {
  //
};

interface SObjectDefinition$RelationshipDomain extends SObjectDefinition<'RelationshipDomain'> {
    Name: 'RelationshipDomain';
    Fields: Fields$RelationshipDomain;
    ParentReferences: ParentReferences$RelationshipDomain;
    ChildRelationships: ChildRelationships$RelationshipDomain;
  }

type Fields$RelationshipInfo = {
  //
  Id: string;
  DurableId: string | null;
  ChildSobjectId: string | null;
  FieldId: string | null;
  IsCascadeDelete: boolean;
  IsDeprecatedAndHidden: boolean;
  IsRestrictedDelete: boolean;
  JunctionIdListNames: any | null;
};

type ParentReferences$RelationshipInfo = {
  //
};

type ChildRelationships$RelationshipInfo = {
  //
  RelationshipDomains: SObjectDefinition$RelationshipDomain;
};

interface SObjectDefinition$RelationshipInfo extends SObjectDefinition<'RelationshipInfo'> {
    Name: 'RelationshipInfo';
    Fields: Fields$RelationshipInfo;
    ParentReferences: ParentReferences$RelationshipInfo;
    ChildRelationships: ChildRelationships$RelationshipInfo;
  }

type Fields$Report = {
  //
  Id: string;
  OwnerId: string;
  FolderName: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
  Name: string;
  Description: string | null;
  DeveloperName: string;
  NamespacePrefix: string | null;
  LastRunDate: DateString | null;
  SystemModstamp: DateString;
  Format: string;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
};

type ParentReferences$Report = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Report = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Feeds: SObjectDefinition$ReportFeed;
};

interface SObjectDefinition$Report extends SObjectDefinition<'Report'> {
    Name: 'Report';
    Fields: Fields$Report;
    ParentReferences: ParentReferences$Report;
    ChildRelationships: ChildRelationships$Report;
  }

type Fields$ReportFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ReportFeed = {
  //
  Parent: SObjectDefinition$Report;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ReportFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ReportFeed extends SObjectDefinition<'ReportFeed'> {
    Name: 'ReportFeed';
    Fields: Fields$ReportFeed;
    ParentReferences: ParentReferences$ReportFeed;
    ChildRelationships: ChildRelationships$ReportFeed;
  }

type Fields$ResourceAbsence = {
  //
  Id: string;
  IsDeleted: boolean;
  AbsenceNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ResourceId: string;
  Type: string;
  Description: string | null;
  Start: DateString;
  End: DateString;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address;
};

type ParentReferences$ResourceAbsence = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Resource: SObjectDefinition$ServiceResource;
};

type ChildRelationships$ResourceAbsence = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ResourceAbsenceFeed;
  Histories: SObjectDefinition$ResourceAbsenceHistory;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ResourceAbsence extends SObjectDefinition<'ResourceAbsence'> {
    Name: 'ResourceAbsence';
    Fields: Fields$ResourceAbsence;
    ParentReferences: ParentReferences$ResourceAbsence;
    ChildRelationships: ChildRelationships$ResourceAbsence;
  }

type Fields$ResourceAbsenceFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ResourceAbsenceFeed = {
  //
  Parent: SObjectDefinition$ResourceAbsence;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ResourceAbsenceFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ResourceAbsenceFeed extends SObjectDefinition<'ResourceAbsenceFeed'> {
    Name: 'ResourceAbsenceFeed';
    Fields: Fields$ResourceAbsenceFeed;
    ParentReferences: ParentReferences$ResourceAbsenceFeed;
    ChildRelationships: ChildRelationships$ResourceAbsenceFeed;
  }

type Fields$ResourceAbsenceHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ResourceAbsenceId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ResourceAbsenceHistory = {
  //
  ResourceAbsence: SObjectDefinition$ResourceAbsence;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ResourceAbsenceHistory = {
  //
};

interface SObjectDefinition$ResourceAbsenceHistory extends SObjectDefinition<'ResourceAbsenceHistory'> {
    Name: 'ResourceAbsenceHistory';
    Fields: Fields$ResourceAbsenceHistory;
    ParentReferences: ParentReferences$ResourceAbsenceHistory;
    ChildRelationships: ChildRelationships$ResourceAbsenceHistory;
  }

type Fields$ResourceAssignment__ChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Project__c: string | null;
  Resource__c: string | null;
  Role__c: string | null;
};

type ParentReferences$ResourceAssignment__ChangeEvent = {
  //
};

type ChildRelationships$ResourceAssignment__ChangeEvent = {
  //
};

interface SObjectDefinition$ResourceAssignment__ChangeEvent extends SObjectDefinition<'ResourceAssignment__ChangeEvent'> {
    Name: 'ResourceAssignment__ChangeEvent';
    Fields: Fields$ResourceAssignment__ChangeEvent;
    ParentReferences: ParentReferences$ResourceAssignment__ChangeEvent;
    ChildRelationships: ChildRelationships$ResourceAssignment__ChangeEvent;
  }

type Fields$ResourceAssignment__c = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Project__c: string;
  Resource__c: string | null;
  Role__c: string | null;
};

type ParentReferences$ResourceAssignment__c = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Project__r: SObjectDefinition$Project__c;
  Resource__r: SObjectDefinition$Employee__c | null;
};

type ChildRelationships$ResourceAssignment__c = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  RecordAssociatedGroups: SObjectDefinition$CollaborationGroupRecord;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DuplicateRecordItems: SObjectDefinition$DuplicateRecordItem;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ResourceAssignment__c extends SObjectDefinition<'ResourceAssignment__c'> {
    Name: 'ResourceAssignment__c';
    Fields: Fields$ResourceAssignment__c;
    ParentReferences: ParentReferences$ResourceAssignment__c;
    ChildRelationships: ChildRelationships$ResourceAssignment__c;
  }

type Fields$ResourcePreference = {
  //
  Id: string;
  IsDeleted: boolean;
  ResourcePreferenceNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceResourceId: string;
  RelatedRecordId: string;
  PreferenceType: string;
};

type ParentReferences$ResourcePreference = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceResource: SObjectDefinition$ServiceResource;
  RelatedRecord: SObjectDefinition$Name;
};

type ChildRelationships$ResourcePreference = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ResourcePreferenceFeed;
  Histories: SObjectDefinition$ResourcePreferenceHistory;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ResourcePreference extends SObjectDefinition<'ResourcePreference'> {
    Name: 'ResourcePreference';
    Fields: Fields$ResourcePreference;
    ParentReferences: ParentReferences$ResourcePreference;
    ChildRelationships: ChildRelationships$ResourcePreference;
  }

type Fields$ResourcePreferenceFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ResourcePreferenceFeed = {
  //
  Parent: SObjectDefinition$ResourcePreference;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ResourcePreferenceFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ResourcePreferenceFeed extends SObjectDefinition<'ResourcePreferenceFeed'> {
    Name: 'ResourcePreferenceFeed';
    Fields: Fields$ResourcePreferenceFeed;
    ParentReferences: ParentReferences$ResourcePreferenceFeed;
    ChildRelationships: ChildRelationships$ResourcePreferenceFeed;
  }

type Fields$ResourcePreferenceHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ResourcePreferenceId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ResourcePreferenceHistory = {
  //
  ResourcePreference: SObjectDefinition$ResourcePreference;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ResourcePreferenceHistory = {
  //
};

interface SObjectDefinition$ResourcePreferenceHistory extends SObjectDefinition<'ResourcePreferenceHistory'> {
    Name: 'ResourcePreferenceHistory';
    Fields: Fields$ResourcePreferenceHistory;
    ParentReferences: ParentReferences$ResourcePreferenceHistory;
    ChildRelationships: ChildRelationships$ResourcePreferenceHistory;
  }

type Fields$ReturnOrder = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  ReturnOrderNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  AccountId: string | null;
  ContactId: string | null;
  ProductRequestId: string | null;
  CaseId: string | null;
  OrderId: string | null;
  SourceLocationId: string | null;
  DestinationLocationId: string | null;
  ShipmentType: string | null;
  ShipFromStreet: string | null;
  ShipFromCity: string | null;
  ShipFromState: string | null;
  ShipFromPostalCode: string | null;
  ShipFromCountry: string | null;
  ShipFromLatitude: number | null;
  ShipFromLongitude: number | null;
  ShipFromGeocodeAccuracy: string | null;
  ShipFromAddress: Address | null;
  ReturnedById: string | null;
  Description: string | null;
  ExpectedArrivalDate: DateString | null;
  Status: string | null;
};

type ParentReferences$ReturnOrder = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account | null;
  Contact: SObjectDefinition$Contact | null;
  ProductRequest: SObjectDefinition$ProductRequest | null;
  Case: SObjectDefinition$Case | null;
  Order: SObjectDefinition$Order | null;
  SourceLocation: SObjectDefinition$Location | null;
  DestinationLocation: SObjectDefinition$Location | null;
  ReturnedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ReturnOrder = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ReturnOrderFeed;
  Histories: SObjectDefinition$ReturnOrderHistory;
  ReturnOrderLineItems: SObjectDefinition$ReturnOrderLineItem;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$ReturnOrder extends SObjectDefinition<'ReturnOrder'> {
    Name: 'ReturnOrder';
    Fields: Fields$ReturnOrder;
    ParentReferences: ParentReferences$ReturnOrder;
    ChildRelationships: ChildRelationships$ReturnOrder;
  }

type Fields$ReturnOrderFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ReturnOrderFeed = {
  //
  Parent: SObjectDefinition$ReturnOrder;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ReturnOrderFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ReturnOrderFeed extends SObjectDefinition<'ReturnOrderFeed'> {
    Name: 'ReturnOrderFeed';
    Fields: Fields$ReturnOrderFeed;
    ParentReferences: ParentReferences$ReturnOrderFeed;
    ChildRelationships: ChildRelationships$ReturnOrderFeed;
  }

type Fields$ReturnOrderHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ReturnOrderId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ReturnOrderHistory = {
  //
  ReturnOrder: SObjectDefinition$ReturnOrder;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ReturnOrderHistory = {
  //
};

interface SObjectDefinition$ReturnOrderHistory extends SObjectDefinition<'ReturnOrderHistory'> {
    Name: 'ReturnOrderHistory';
    Fields: Fields$ReturnOrderHistory;
    ParentReferences: ParentReferences$ReturnOrderHistory;
    ChildRelationships: ChildRelationships$ReturnOrderHistory;
  }

type Fields$ReturnOrderLineItem = {
  //
  Id: string;
  IsDeleted: boolean;
  ReturnOrderLineItemNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ReturnOrderId: string;
  ProductRequestLineItemId: string | null;
  OrderItemId: string | null;
  ProductItemId: string | null;
  Product2Id: string | null;
  QuantityReturned: number;
  QuantityUnitOfMeasure: string | null;
  SourceLocationId: string | null;
  DestinationLocationId: string | null;
  AssetId: string | null;
  Description: string | null;
  ReasonForReturn: string | null;
  ProcessingPlan: string | null;
  RepaymentMethod: string | null;
};

type ParentReferences$ReturnOrderLineItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ReturnOrder: SObjectDefinition$ReturnOrder;
  ProductRequestLineItem: SObjectDefinition$ProductRequestLineItem | null;
  OrderItem: SObjectDefinition$OrderItem | null;
  ProductItem: SObjectDefinition$ProductItem | null;
  Product2: SObjectDefinition$Product2 | null;
  SourceLocation: SObjectDefinition$Location | null;
  DestinationLocation: SObjectDefinition$Location | null;
  Asset: SObjectDefinition$Asset | null;
};

type ChildRelationships$ReturnOrderLineItem = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ReturnOrderLineItemFeed;
  Histories: SObjectDefinition$ReturnOrderLineItemHistory;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$ReturnOrderLineItem extends SObjectDefinition<'ReturnOrderLineItem'> {
    Name: 'ReturnOrderLineItem';
    Fields: Fields$ReturnOrderLineItem;
    ParentReferences: ParentReferences$ReturnOrderLineItem;
    ChildRelationships: ChildRelationships$ReturnOrderLineItem;
  }

type Fields$ReturnOrderLineItemFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ReturnOrderLineItemFeed = {
  //
  Parent: SObjectDefinition$ReturnOrderLineItem;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ReturnOrderLineItemFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ReturnOrderLineItemFeed extends SObjectDefinition<'ReturnOrderLineItemFeed'> {
    Name: 'ReturnOrderLineItemFeed';
    Fields: Fields$ReturnOrderLineItemFeed;
    ParentReferences: ParentReferences$ReturnOrderLineItemFeed;
    ChildRelationships: ChildRelationships$ReturnOrderLineItemFeed;
  }

type Fields$ReturnOrderLineItemHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ReturnOrderLineItemId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ReturnOrderLineItemHistory = {
  //
  ReturnOrderLineItem: SObjectDefinition$ReturnOrderLineItem;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ReturnOrderLineItemHistory = {
  //
};

interface SObjectDefinition$ReturnOrderLineItemHistory extends SObjectDefinition<'ReturnOrderLineItemHistory'> {
    Name: 'ReturnOrderLineItemHistory';
    Fields: Fields$ReturnOrderLineItemHistory;
    ParentReferences: ParentReferences$ReturnOrderLineItemHistory;
    ChildRelationships: ChildRelationships$ReturnOrderLineItemHistory;
  }

type Fields$ReturnOrderShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ReturnOrderShare = {
  //
  Parent: SObjectDefinition$ReturnOrder;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ReturnOrderShare = {
  //
};

interface SObjectDefinition$ReturnOrderShare extends SObjectDefinition<'ReturnOrderShare'> {
    Name: 'ReturnOrderShare';
    Fields: Fields$ReturnOrderShare;
    ParentReferences: ParentReferences$ReturnOrderShare;
    ChildRelationships: ChildRelationships$ReturnOrderShare;
  }

type Fields$SamlSsoConfig = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Version: string;
  Issuer: string;
  OptionsSpInitBinding: boolean;
  OptionsUserProvisioning: boolean;
  AttributeFormat: string | null;
  AttributeName: string | null;
  Audience: string;
  IdentityMapping: string;
  IdentityLocation: string;
  SamlJitHandlerId: string | null;
  ExecutionUserId: string | null;
  LoginUrl: string | null;
  LogoutUrl: string | null;
  ErrorUrl: string | null;
  ValidationCert: string;
  RequestSignatureMethod: string | null;
  SingleLogoutUrl: string | null;
  SingleLogoutBinding: string | null;
};

type ParentReferences$SamlSsoConfig = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SamlJitHandler: SObjectDefinition$ApexClass | null;
  ExecutionUser: SObjectDefinition$User | null;
};

type ChildRelationships$SamlSsoConfig = {
  //
};

interface SObjectDefinition$SamlSsoConfig extends SObjectDefinition<'SamlSsoConfig'> {
    Name: 'SamlSsoConfig';
    Fields: Fields$SamlSsoConfig;
    ParentReferences: ParentReferences$SamlSsoConfig;
    ChildRelationships: ChildRelationships$SamlSsoConfig;
  }

type Fields$Scontrol = {
  //
  Id: string;
  Name: string;
  DeveloperName: string;
  Description: string | null;
  EncodingKey: string;
  HtmlWrapper: string;
  Filename: string | null;
  BodyLength: number;
  Binary: BlobString | null;
  ContentSource: string | null;
  SupportsCaching: boolean;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
};

type ParentReferences$Scontrol = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Scontrol = {
  //
};

interface SObjectDefinition$Scontrol extends SObjectDefinition<'Scontrol'> {
    Name: 'Scontrol';
    Fields: Fields$Scontrol;
    ParentReferences: ParentReferences$Scontrol;
    ChildRelationships: ChildRelationships$Scontrol;
  }

type Fields$SearchLayout = {
  //
  Id: string;
  DurableId: string | null;
  Label: string | null;
  LayoutType: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  EntityDefinitionId: string | null;
  FieldsDisplayed: any | null;
  ButtonsDisplayed: any | null;
};

type ParentReferences$SearchLayout = {
  //
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$SearchLayout = {
  //
};

interface SObjectDefinition$SearchLayout extends SObjectDefinition<'SearchLayout'> {
    Name: 'SearchLayout';
    Fields: Fields$SearchLayout;
    ParentReferences: ParentReferences$SearchLayout;
    ChildRelationships: ChildRelationships$SearchLayout;
  }

type Fields$SearchPromotionRule = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Query: string;
};

type ParentReferences$SearchPromotionRule = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$SearchPromotionRule = {
  //
};

interface SObjectDefinition$SearchPromotionRule extends SObjectDefinition<'SearchPromotionRule'> {
    Name: 'SearchPromotionRule';
    Fields: Fields$SearchPromotionRule;
    ParentReferences: ParentReferences$SearchPromotionRule;
    ChildRelationships: ChildRelationships$SearchPromotionRule;
  }

type Fields$SecureAgent = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AgentKey: string | null;
  ProxyUserId: string | null;
  SecureAgentsClusterId: string | null;
  Priority: number | null;
};

type ParentReferences$SecureAgent = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ProxyUser: SObjectDefinition$User | null;
  SecureAgentsCluster: SObjectDefinition$SecureAgentsCluster | null;
};

type ChildRelationships$SecureAgent = {
  //
  SecureAgentPlugins: SObjectDefinition$SecureAgentPlugin;
};

interface SObjectDefinition$SecureAgent extends SObjectDefinition<'SecureAgent'> {
    Name: 'SecureAgent';
    Fields: Fields$SecureAgent;
    ParentReferences: ParentReferences$SecureAgent;
    ChildRelationships: ChildRelationships$SecureAgent;
  }

type Fields$SecureAgentPlugin = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SecureAgentId: string;
  PluginName: string | null;
  PluginType: string | null;
  RequestedVersion: string | null;
  UpdateWindowStart: DateString | null;
  UpdateWindowEnd: DateString | null;
};

type ParentReferences$SecureAgentPlugin = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SecureAgent: SObjectDefinition$SecureAgent;
};

type ChildRelationships$SecureAgentPlugin = {
  //
  SecureAgentPluginProperties: SObjectDefinition$SecureAgentPluginProperty;
};

interface SObjectDefinition$SecureAgentPlugin extends SObjectDefinition<'SecureAgentPlugin'> {
    Name: 'SecureAgentPlugin';
    Fields: Fields$SecureAgentPlugin;
    ParentReferences: ParentReferences$SecureAgentPlugin;
    ChildRelationships: ChildRelationships$SecureAgentPlugin;
  }

type Fields$SecureAgentPluginProperty = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SecureAgentPluginId: string;
  PropertyName: string | null;
  PropertyValue: string | null;
};

type ParentReferences$SecureAgentPluginProperty = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SecureAgentPlugin: SObjectDefinition$SecureAgentPlugin;
};

type ChildRelationships$SecureAgentPluginProperty = {
  //
};

interface SObjectDefinition$SecureAgentPluginProperty extends SObjectDefinition<'SecureAgentPluginProperty'> {
    Name: 'SecureAgentPluginProperty';
    Fields: Fields$SecureAgentPluginProperty;
    ParentReferences: ParentReferences$SecureAgentPluginProperty;
    ChildRelationships: ChildRelationships$SecureAgentPluginProperty;
  }

type Fields$SecureAgentsCluster = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
};

type ParentReferences$SecureAgentsCluster = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$SecureAgentsCluster = {
  //
};

interface SObjectDefinition$SecureAgentsCluster extends SObjectDefinition<'SecureAgentsCluster'> {
    Name: 'SecureAgentsCluster';
    Fields: Fields$SecureAgentsCluster;
    ParentReferences: ParentReferences$SecureAgentsCluster;
    ChildRelationships: ChildRelationships$SecureAgentsCluster;
  }

type Fields$SecurityCustomBaseline = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Baseline: string | null;
  IsDefault: boolean;
};

type ParentReferences$SecurityCustomBaseline = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$SecurityCustomBaseline = {
  //
};

interface SObjectDefinition$SecurityCustomBaseline extends SObjectDefinition<'SecurityCustomBaseline'> {
    Name: 'SecurityCustomBaseline';
    Fields: Fields$SecurityCustomBaseline;
    ParentReferences: ParentReferences$SecurityCustomBaseline;
    ChildRelationships: ChildRelationships$SecurityCustomBaseline;
  }

type Fields$ServiceAppointment = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  AppointmentNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentRecordId: string | null;
  ParentRecordType: string | null;
  AccountId: string | null;
  WorkTypeId: string | null;
  ContactId: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address;
  Description: string | null;
  EarliestStartTime: DateString;
  DueDate: DateString;
  Duration: number | null;
  ArrivalWindowStartTime: DateString | null;
  ArrivalWindowEndTime: DateString | null;
  Status: string | null;
  SchedStartTime: DateString | null;
  SchedEndTime: DateString | null;
  ActualStartTime: DateString | null;
  ActualEndTime: DateString | null;
  ActualDuration: number | null;
  DurationType: string | null;
  DurationInMinutes: number | null;
  ServiceTerritoryId: string | null;
  Subject: string | null;
  ParentRecordStatusCategory: string | null;
  StatusCategory: string | null;
  ServiceNote: string | null;
};

type ParentReferences$ServiceAppointment = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentRecord: SObjectDefinition$Name | null;
  Account: SObjectDefinition$Account | null;
  WorkType: SObjectDefinition$WorkType | null;
  Contact: SObjectDefinition$Contact | null;
  ServiceTerritory: SObjectDefinition$ServiceTerritory | null;
};

type ChildRelationships$ServiceAppointment = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  ServiceResources: SObjectDefinition$AssignedResource;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DigitalSignatures: SObjectDefinition$DigitalSignature;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ServiceAppointmentFeed;
  Histories: SObjectDefinition$ServiceAppointmentHistory;
  ServiceReports: SObjectDefinition$ServiceReport;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceAppointment extends SObjectDefinition<'ServiceAppointment'> {
    Name: 'ServiceAppointment';
    Fields: Fields$ServiceAppointment;
    ParentReferences: ParentReferences$ServiceAppointment;
    ChildRelationships: ChildRelationships$ServiceAppointment;
  }

type Fields$ServiceAppointmentFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceAppointmentFeed = {
  //
  Parent: SObjectDefinition$ServiceAppointment;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceAppointmentFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceAppointmentFeed extends SObjectDefinition<'ServiceAppointmentFeed'> {
    Name: 'ServiceAppointmentFeed';
    Fields: Fields$ServiceAppointmentFeed;
    ParentReferences: ParentReferences$ServiceAppointmentFeed;
    ChildRelationships: ChildRelationships$ServiceAppointmentFeed;
  }

type Fields$ServiceAppointmentHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceAppointmentId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceAppointmentHistory = {
  //
  ServiceAppointment: SObjectDefinition$ServiceAppointment;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceAppointmentHistory = {
  //
};

interface SObjectDefinition$ServiceAppointmentHistory extends SObjectDefinition<'ServiceAppointmentHistory'> {
    Name: 'ServiceAppointmentHistory';
    Fields: Fields$ServiceAppointmentHistory;
    ParentReferences: ParentReferences$ServiceAppointmentHistory;
    ChildRelationships: ChildRelationships$ServiceAppointmentHistory;
  }

type Fields$ServiceAppointmentShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ServiceAppointmentShare = {
  //
  Parent: SObjectDefinition$ServiceAppointment;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceAppointmentShare = {
  //
};

interface SObjectDefinition$ServiceAppointmentShare extends SObjectDefinition<'ServiceAppointmentShare'> {
    Name: 'ServiceAppointmentShare';
    Fields: Fields$ServiceAppointmentShare;
    ParentReferences: ParentReferences$ServiceAppointmentShare;
    ChildRelationships: ChildRelationships$ServiceAppointmentShare;
  }

type Fields$ServiceAppointmentStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  StatusCode: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$ServiceAppointmentStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceAppointmentStatus = {
  //
};

interface SObjectDefinition$ServiceAppointmentStatus extends SObjectDefinition<'ServiceAppointmentStatus'> {
    Name: 'ServiceAppointmentStatus';
    Fields: Fields$ServiceAppointmentStatus;
    ParentReferences: ParentReferences$ServiceAppointmentStatus;
    ChildRelationships: ChildRelationships$ServiceAppointmentStatus;
  }

type Fields$ServiceCrew = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  CrewSize: number;
};

type ParentReferences$ServiceCrew = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceCrew = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AssignedResources: SObjectDefinition$AssignedResource;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ServiceCrewFeed;
  Histories: SObjectDefinition$ServiceCrewHistory;
  ServiceCrewMembers: SObjectDefinition$ServiceCrewMember;
  ServiceResources: SObjectDefinition$ServiceResource;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceCrew extends SObjectDefinition<'ServiceCrew'> {
    Name: 'ServiceCrew';
    Fields: Fields$ServiceCrew;
    ParentReferences: ParentReferences$ServiceCrew;
    ChildRelationships: ChildRelationships$ServiceCrew;
  }

type Fields$ServiceCrewFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceCrewFeed = {
  //
  Parent: SObjectDefinition$ServiceCrew;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceCrewFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceCrewFeed extends SObjectDefinition<'ServiceCrewFeed'> {
    Name: 'ServiceCrewFeed';
    Fields: Fields$ServiceCrewFeed;
    ParentReferences: ParentReferences$ServiceCrewFeed;
    ChildRelationships: ChildRelationships$ServiceCrewFeed;
  }

type Fields$ServiceCrewHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceCrewId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceCrewHistory = {
  //
  ServiceCrew: SObjectDefinition$ServiceCrew;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceCrewHistory = {
  //
};

interface SObjectDefinition$ServiceCrewHistory extends SObjectDefinition<'ServiceCrewHistory'> {
    Name: 'ServiceCrewHistory';
    Fields: Fields$ServiceCrewHistory;
    ParentReferences: ParentReferences$ServiceCrewHistory;
    ChildRelationships: ChildRelationships$ServiceCrewHistory;
  }

type Fields$ServiceCrewMember = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceCrewMemberNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceCrewId: string;
  ServiceResourceId: string;
  StartDate: DateString;
  EndDate: DateString | null;
  IsLeader: boolean;
};

type ParentReferences$ServiceCrewMember = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceCrew: SObjectDefinition$ServiceCrew;
  ServiceResource: SObjectDefinition$ServiceResource;
};

type ChildRelationships$ServiceCrewMember = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ServiceCrewMemberFeed;
  Histories: SObjectDefinition$ServiceCrewMemberHistory;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceCrewMember extends SObjectDefinition<'ServiceCrewMember'> {
    Name: 'ServiceCrewMember';
    Fields: Fields$ServiceCrewMember;
    ParentReferences: ParentReferences$ServiceCrewMember;
    ChildRelationships: ChildRelationships$ServiceCrewMember;
  }

type Fields$ServiceCrewMemberFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceCrewMemberFeed = {
  //
  Parent: SObjectDefinition$ServiceCrewMember;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceCrewMemberFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceCrewMemberFeed extends SObjectDefinition<'ServiceCrewMemberFeed'> {
    Name: 'ServiceCrewMemberFeed';
    Fields: Fields$ServiceCrewMemberFeed;
    ParentReferences: ParentReferences$ServiceCrewMemberFeed;
    ChildRelationships: ChildRelationships$ServiceCrewMemberFeed;
  }

type Fields$ServiceCrewMemberHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceCrewMemberId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceCrewMemberHistory = {
  //
  ServiceCrewMember: SObjectDefinition$ServiceCrewMember;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceCrewMemberHistory = {
  //
};

interface SObjectDefinition$ServiceCrewMemberHistory extends SObjectDefinition<'ServiceCrewMemberHistory'> {
    Name: 'ServiceCrewMemberHistory';
    Fields: Fields$ServiceCrewMemberHistory;
    ParentReferences: ParentReferences$ServiceCrewMemberHistory;
    ChildRelationships: ChildRelationships$ServiceCrewMemberHistory;
  }

type Fields$ServiceCrewShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ServiceCrewShare = {
  //
  Parent: SObjectDefinition$ServiceCrew;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceCrewShare = {
  //
};

interface SObjectDefinition$ServiceCrewShare extends SObjectDefinition<'ServiceCrewShare'> {
    Name: 'ServiceCrewShare';
    Fields: Fields$ServiceCrewShare;
    ParentReferences: ParentReferences$ServiceCrewShare;
    ChildRelationships: ChildRelationships$ServiceCrewShare;
  }

type Fields$ServiceReport = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceReportNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  ContentVersionDocumentId: string | null;
  DocumentName: string | null;
  DocumentContentType: string | null;
  DocumentLength: number | null;
  DocumentBody: BlobString | null;
  Template: string | null;
};

type ParentReferences$ServiceReport = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$Name;
  ContentVersionDocument: SObjectDefinition$ContentVersion | null;
};

type ChildRelationships$ServiceReport = {
  //
  Histories: SObjectDefinition$ServiceReportHistory;
};

interface SObjectDefinition$ServiceReport extends SObjectDefinition<'ServiceReport'> {
    Name: 'ServiceReport';
    Fields: Fields$ServiceReport;
    ParentReferences: ParentReferences$ServiceReport;
    ChildRelationships: ChildRelationships$ServiceReport;
  }

type Fields$ServiceReportHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceReportId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceReportHistory = {
  //
  ServiceReport: SObjectDefinition$ServiceReport;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceReportHistory = {
  //
};

interface SObjectDefinition$ServiceReportHistory extends SObjectDefinition<'ServiceReportHistory'> {
    Name: 'ServiceReportHistory';
    Fields: Fields$ServiceReportHistory;
    ParentReferences: ParentReferences$ServiceReportHistory;
    ChildRelationships: ChildRelationships$ServiceReportHistory;
  }

type Fields$ServiceReportLayout = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
};

type ParentReferences$ServiceReportLayout = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceReportLayout = {
  //
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
  WorkTypes: SObjectDefinition$WorkType;
};

interface SObjectDefinition$ServiceReportLayout extends SObjectDefinition<'ServiceReportLayout'> {
    Name: 'ServiceReportLayout';
    Fields: Fields$ServiceReportLayout;
    ParentReferences: ParentReferences$ServiceReportLayout;
    ChildRelationships: ChildRelationships$ServiceReportLayout;
  }

type Fields$ServiceResource = {
  //
  Id: string;
  OwnerId: string;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  RelatedRecordId: string | null;
  ResourceType: string | null;
  Description: string | null;
  IsActive: boolean;
  IsCapacityBased: boolean;
  IsOptimizationCapable: boolean;
  LastKnownLatitude: number | null;
  LastKnownLongitude: number | null;
  LastKnownLocation: string | null;
  LastKnownLocationDate: DateString | null;
  LocationId: string | null;
  ServiceCrewId: string | null;
};

type ParentReferences$ServiceResource = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  RelatedRecord: SObjectDefinition$User | null;
  Location: SObjectDefinition$Location | null;
  ServiceCrew: SObjectDefinition$ServiceCrew | null;
};

type ChildRelationships$ServiceResource = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  ServiceAppointments: SObjectDefinition$AssignedResource;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ResourceAbsences: SObjectDefinition$ResourceAbsence;
  ResourcePreferences: SObjectDefinition$ResourcePreference;
  ServiceCrewMembers: SObjectDefinition$ServiceCrewMember;
  ServiceResourceCapacities: SObjectDefinition$ServiceResourceCapacity;
  Feeds: SObjectDefinition$ServiceResourceFeed;
  Histories: SObjectDefinition$ServiceResourceHistory;
  ServiceResourceSkills: SObjectDefinition$ServiceResourceSkill;
  ServiceTerritories: SObjectDefinition$ServiceTerritoryMember;
  Tasks: SObjectDefinition$Task;
  TimeSheets: SObjectDefinition$TimeSheet;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceResource extends SObjectDefinition<'ServiceResource'> {
    Name: 'ServiceResource';
    Fields: Fields$ServiceResource;
    ParentReferences: ParentReferences$ServiceResource;
    ChildRelationships: ChildRelationships$ServiceResource;
  }

type Fields$ServiceResourceCapacity = {
  //
  Id: string;
  IsDeleted: boolean;
  CapacityNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceResourceId: string;
  StartDate: DateString;
  EndDate: DateString | null;
  CapacityInHours: number | null;
  CapacityInWorkItems: number | null;
  TimePeriod: string | null;
};

type ParentReferences$ServiceResourceCapacity = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceResource: SObjectDefinition$ServiceResource;
};

type ChildRelationships$ServiceResourceCapacity = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ServiceResourceCapacityFeed;
  Histories: SObjectDefinition$ServiceResourceCapacityHistory;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceResourceCapacity extends SObjectDefinition<'ServiceResourceCapacity'> {
    Name: 'ServiceResourceCapacity';
    Fields: Fields$ServiceResourceCapacity;
    ParentReferences: ParentReferences$ServiceResourceCapacity;
    ChildRelationships: ChildRelationships$ServiceResourceCapacity;
  }

type Fields$ServiceResourceCapacityFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceResourceCapacityFeed = {
  //
  Parent: SObjectDefinition$ServiceResourceCapacity;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceResourceCapacityFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceResourceCapacityFeed extends SObjectDefinition<'ServiceResourceCapacityFeed'> {
    Name: 'ServiceResourceCapacityFeed';
    Fields: Fields$ServiceResourceCapacityFeed;
    ParentReferences: ParentReferences$ServiceResourceCapacityFeed;
    ChildRelationships: ChildRelationships$ServiceResourceCapacityFeed;
  }

type Fields$ServiceResourceCapacityHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceResourceCapacityId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceResourceCapacityHistory = {
  //
  ServiceResourceCapacity: SObjectDefinition$ServiceResourceCapacity;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceResourceCapacityHistory = {
  //
};

interface SObjectDefinition$ServiceResourceCapacityHistory extends SObjectDefinition<'ServiceResourceCapacityHistory'> {
    Name: 'ServiceResourceCapacityHistory';
    Fields: Fields$ServiceResourceCapacityHistory;
    ParentReferences: ParentReferences$ServiceResourceCapacityHistory;
    ChildRelationships: ChildRelationships$ServiceResourceCapacityHistory;
  }

type Fields$ServiceResourceFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceResourceFeed = {
  //
  Parent: SObjectDefinition$ServiceResource;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceResourceFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceResourceFeed extends SObjectDefinition<'ServiceResourceFeed'> {
    Name: 'ServiceResourceFeed';
    Fields: Fields$ServiceResourceFeed;
    ParentReferences: ParentReferences$ServiceResourceFeed;
    ChildRelationships: ChildRelationships$ServiceResourceFeed;
  }

type Fields$ServiceResourceHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceResourceId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceResourceHistory = {
  //
  ServiceResource: SObjectDefinition$ServiceResource;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceResourceHistory = {
  //
};

interface SObjectDefinition$ServiceResourceHistory extends SObjectDefinition<'ServiceResourceHistory'> {
    Name: 'ServiceResourceHistory';
    Fields: Fields$ServiceResourceHistory;
    ParentReferences: ParentReferences$ServiceResourceHistory;
    ChildRelationships: ChildRelationships$ServiceResourceHistory;
  }

type Fields$ServiceResourceShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ServiceResourceShare = {
  //
  Parent: SObjectDefinition$ServiceResource;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceResourceShare = {
  //
};

interface SObjectDefinition$ServiceResourceShare extends SObjectDefinition<'ServiceResourceShare'> {
    Name: 'ServiceResourceShare';
    Fields: Fields$ServiceResourceShare;
    ParentReferences: ParentReferences$ServiceResourceShare;
    ChildRelationships: ChildRelationships$ServiceResourceShare;
  }

type Fields$ServiceResourceSkill = {
  //
  Id: string;
  IsDeleted: boolean;
  SkillNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceResourceId: string;
  SkillId: string;
  SkillLevel: number | null;
  EffectiveStartDate: DateString;
  EffectiveEndDate: DateString | null;
};

type ParentReferences$ServiceResourceSkill = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceResource: SObjectDefinition$ServiceResource;
  Skill: SObjectDefinition$Skill;
};

type ChildRelationships$ServiceResourceSkill = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ServiceResourceSkillFeed;
  Histories: SObjectDefinition$ServiceResourceSkillHistory;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceResourceSkill extends SObjectDefinition<'ServiceResourceSkill'> {
    Name: 'ServiceResourceSkill';
    Fields: Fields$ServiceResourceSkill;
    ParentReferences: ParentReferences$ServiceResourceSkill;
    ChildRelationships: ChildRelationships$ServiceResourceSkill;
  }

type Fields$ServiceResourceSkillFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceResourceSkillFeed = {
  //
  Parent: SObjectDefinition$ServiceResourceSkill;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceResourceSkillFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceResourceSkillFeed extends SObjectDefinition<'ServiceResourceSkillFeed'> {
    Name: 'ServiceResourceSkillFeed';
    Fields: Fields$ServiceResourceSkillFeed;
    ParentReferences: ParentReferences$ServiceResourceSkillFeed;
    ChildRelationships: ChildRelationships$ServiceResourceSkillFeed;
  }

type Fields$ServiceResourceSkillHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceResourceSkillId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceResourceSkillHistory = {
  //
  ServiceResourceSkill: SObjectDefinition$ServiceResourceSkill;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceResourceSkillHistory = {
  //
};

interface SObjectDefinition$ServiceResourceSkillHistory extends SObjectDefinition<'ServiceResourceSkillHistory'> {
    Name: 'ServiceResourceSkillHistory';
    Fields: Fields$ServiceResourceSkillHistory;
    ParentReferences: ParentReferences$ServiceResourceSkillHistory;
    ChildRelationships: ChildRelationships$ServiceResourceSkillHistory;
  }

type Fields$ServiceTerritory = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentTerritoryId: string | null;
  TopLevelTerritoryId: string | null;
  Description: string | null;
  OperatingHoursId: string;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address;
  IsActive: boolean;
};

type ParentReferences$ServiceTerritory = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentTerritory: SObjectDefinition$ServiceTerritory | null;
  TopLevelTerritory: SObjectDefinition$ServiceTerritory | null;
  OperatingHours: SObjectDefinition$OperatingHours;
};

type ChildRelationships$ServiceTerritory = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  ChildServiceTerritories: SObjectDefinition$ServiceTerritory;
  DescendantTerritories: SObjectDefinition$ServiceTerritory;
  Feeds: SObjectDefinition$ServiceTerritoryFeed;
  Histories: SObjectDefinition$ServiceTerritoryHistory;
  Locations: SObjectDefinition$ServiceTerritoryLocation;
  ServiceResources: SObjectDefinition$ServiceTerritoryMember;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$ServiceTerritory extends SObjectDefinition<'ServiceTerritory'> {
    Name: 'ServiceTerritory';
    Fields: Fields$ServiceTerritory;
    ParentReferences: ParentReferences$ServiceTerritory;
    ChildRelationships: ChildRelationships$ServiceTerritory;
  }

type Fields$ServiceTerritoryFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceTerritoryFeed = {
  //
  Parent: SObjectDefinition$ServiceTerritory;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceTerritoryFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceTerritoryFeed extends SObjectDefinition<'ServiceTerritoryFeed'> {
    Name: 'ServiceTerritoryFeed';
    Fields: Fields$ServiceTerritoryFeed;
    ParentReferences: ParentReferences$ServiceTerritoryFeed;
    ChildRelationships: ChildRelationships$ServiceTerritoryFeed;
  }

type Fields$ServiceTerritoryHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceTerritoryId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceTerritoryHistory = {
  //
  ServiceTerritory: SObjectDefinition$ServiceTerritory;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceTerritoryHistory = {
  //
};

interface SObjectDefinition$ServiceTerritoryHistory extends SObjectDefinition<'ServiceTerritoryHistory'> {
    Name: 'ServiceTerritoryHistory';
    Fields: Fields$ServiceTerritoryHistory;
    ParentReferences: ParentReferences$ServiceTerritoryHistory;
    ChildRelationships: ChildRelationships$ServiceTerritoryHistory;
  }

type Fields$ServiceTerritoryLocation = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceTerritoryLocationNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ServiceTerritoryId: string;
  LocationId: string;
};

type ParentReferences$ServiceTerritoryLocation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceTerritory: SObjectDefinition$ServiceTerritory;
  Location: SObjectDefinition$Location;
};

type ChildRelationships$ServiceTerritoryLocation = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ServiceTerritoryLocationFeed;
  Histories: SObjectDefinition$ServiceTerritoryLocationHistory;
};

interface SObjectDefinition$ServiceTerritoryLocation extends SObjectDefinition<'ServiceTerritoryLocation'> {
    Name: 'ServiceTerritoryLocation';
    Fields: Fields$ServiceTerritoryLocation;
    ParentReferences: ParentReferences$ServiceTerritoryLocation;
    ChildRelationships: ChildRelationships$ServiceTerritoryLocation;
  }

type Fields$ServiceTerritoryLocationFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceTerritoryLocationFeed = {
  //
  Parent: SObjectDefinition$ServiceTerritoryLocation;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceTerritoryLocationFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceTerritoryLocationFeed extends SObjectDefinition<'ServiceTerritoryLocationFeed'> {
    Name: 'ServiceTerritoryLocationFeed';
    Fields: Fields$ServiceTerritoryLocationFeed;
    ParentReferences: ParentReferences$ServiceTerritoryLocationFeed;
    ChildRelationships: ChildRelationships$ServiceTerritoryLocationFeed;
  }

type Fields$ServiceTerritoryLocationHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceTerritoryLocationId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceTerritoryLocationHistory = {
  //
  ServiceTerritoryLocation: SObjectDefinition$ServiceTerritoryLocation;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceTerritoryLocationHistory = {
  //
};

interface SObjectDefinition$ServiceTerritoryLocationHistory extends SObjectDefinition<'ServiceTerritoryLocationHistory'> {
    Name: 'ServiceTerritoryLocationHistory';
    Fields: Fields$ServiceTerritoryLocationHistory;
    ParentReferences: ParentReferences$ServiceTerritoryLocationHistory;
    ChildRelationships: ChildRelationships$ServiceTerritoryLocationHistory;
  }

type Fields$ServiceTerritoryMember = {
  //
  Id: string;
  IsDeleted: boolean;
  MemberNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceTerritoryId: string;
  ServiceResourceId: string;
  TerritoryType: string | null;
  EffectiveStartDate: DateString;
  EffectiveEndDate: DateString | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address;
  OperatingHoursId: string | null;
};

type ParentReferences$ServiceTerritoryMember = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceTerritory: SObjectDefinition$ServiceTerritory;
  ServiceResource: SObjectDefinition$ServiceResource;
  OperatingHours: SObjectDefinition$OperatingHours | null;
};

type ChildRelationships$ServiceTerritoryMember = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ServiceTerritoryMemberFeed;
  Histories: SObjectDefinition$ServiceTerritoryMemberHistory;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$ServiceTerritoryMember extends SObjectDefinition<'ServiceTerritoryMember'> {
    Name: 'ServiceTerritoryMember';
    Fields: Fields$ServiceTerritoryMember;
    ParentReferences: ParentReferences$ServiceTerritoryMember;
    ChildRelationships: ChildRelationships$ServiceTerritoryMember;
  }

type Fields$ServiceTerritoryMemberFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ServiceTerritoryMemberFeed = {
  //
  Parent: SObjectDefinition$ServiceTerritoryMember;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceTerritoryMemberFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceTerritoryMemberFeed extends SObjectDefinition<'ServiceTerritoryMemberFeed'> {
    Name: 'ServiceTerritoryMemberFeed';
    Fields: Fields$ServiceTerritoryMemberFeed;
    ParentReferences: ParentReferences$ServiceTerritoryMemberFeed;
    ChildRelationships: ChildRelationships$ServiceTerritoryMemberFeed;
  }

type Fields$ServiceTerritoryMemberHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceTerritoryMemberId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceTerritoryMemberHistory = {
  //
  ServiceTerritoryMember: SObjectDefinition$ServiceTerritoryMember;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceTerritoryMemberHistory = {
  //
};

interface SObjectDefinition$ServiceTerritoryMemberHistory extends SObjectDefinition<'ServiceTerritoryMemberHistory'> {
    Name: 'ServiceTerritoryMemberHistory';
    Fields: Fields$ServiceTerritoryMemberHistory;
    ParentReferences: ParentReferences$ServiceTerritoryMemberHistory;
    ChildRelationships: ChildRelationships$ServiceTerritoryMemberHistory;
  }

type Fields$ServiceTerritoryShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ServiceTerritoryShare = {
  //
  Parent: SObjectDefinition$ServiceTerritory;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceTerritoryShare = {
  //
};

interface SObjectDefinition$ServiceTerritoryShare extends SObjectDefinition<'ServiceTerritoryShare'> {
    Name: 'ServiceTerritoryShare';
    Fields: Fields$ServiceTerritoryShare;
    ParentReferences: ParentReferences$ServiceTerritoryShare;
    ChildRelationships: ChildRelationships$ServiceTerritoryShare;
  }

type Fields$SessionPermSetActivation = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  AuthSessionId: string;
  PermissionSetId: string;
  UserId: string;
  Description: string | null;
};

type ParentReferences$SessionPermSetActivation = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  AuthSession: SObjectDefinition$AuthSession;
  PermissionSet: SObjectDefinition$PermissionSet;
  User: SObjectDefinition$User;
};

type ChildRelationships$SessionPermSetActivation = {
  //
};

interface SObjectDefinition$SessionPermSetActivation extends SObjectDefinition<'SessionPermSetActivation'> {
    Name: 'SessionPermSetActivation';
    Fields: Fields$SessionPermSetActivation;
    ParentReferences: ParentReferences$SessionPermSetActivation;
    ChildRelationships: ChildRelationships$SessionPermSetActivation;
  }

type Fields$SetupAuditTrail = {
  //
  Id: string;
  Action: string;
  Section: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  Display: string | null;
  DelegateUser: string | null;
  ResponsibleNamespacePrefix: string | null;
};

type ParentReferences$SetupAuditTrail = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SetupAuditTrail = {
  //
};

interface SObjectDefinition$SetupAuditTrail extends SObjectDefinition<'SetupAuditTrail'> {
    Name: 'SetupAuditTrail';
    Fields: Fields$SetupAuditTrail;
    ParentReferences: ParentReferences$SetupAuditTrail;
    ChildRelationships: ChildRelationships$SetupAuditTrail;
  }

type Fields$SetupEntityAccess = {
  //
  Id: string;
  ParentId: string;
  SetupEntityId: string;
  SetupEntityType: string | null;
  SystemModstamp: DateString;
};

type ParentReferences$SetupEntityAccess = {
  //
  Parent: SObjectDefinition$PermissionSet;
};

type ChildRelationships$SetupEntityAccess = {
  //
};

interface SObjectDefinition$SetupEntityAccess extends SObjectDefinition<'SetupEntityAccess'> {
    Name: 'SetupEntityAccess';
    Fields: Fields$SetupEntityAccess;
    ParentReferences: ParentReferences$SetupEntityAccess;
    ChildRelationships: ChildRelationships$SetupEntityAccess;
  }

type Fields$Shipment = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  ShipmentNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ShipFromStreet: string | null;
  ShipFromCity: string | null;
  ShipFromState: string | null;
  ShipFromPostalCode: string | null;
  ShipFromCountry: string | null;
  ShipFromLatitude: number | null;
  ShipFromLongitude: number | null;
  ShipFromGeocodeAccuracy: string | null;
  ShipFromAddress: Address | null;
  ShipToStreet: string | null;
  ShipToCity: string | null;
  ShipToState: string | null;
  ShipToPostalCode: string | null;
  ShipToCountry: string | null;
  ShipToLatitude: number | null;
  ShipToLongitude: number | null;
  ShipToGeocodeAccuracy: string | null;
  ShipToAddress: Address | null;
  SourceLocationId: string | null;
  DestinationLocationId: string | null;
  TrackingNumber: string | null;
  TrackingUrl: string | null;
  ExpectedDeliveryDate: DateString | null;
  ActualDeliveryDate: DateString | null;
  Provider: string | null;
  Status: string | null;
  ShipToName: string;
  Description: string | null;
  DeliveredToId: string | null;
};

type ParentReferences$Shipment = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SourceLocation: SObjectDefinition$Location | null;
  DestinationLocation: SObjectDefinition$Location | null;
  DeliveredTo: SObjectDefinition$Name | null;
};

type ChildRelationships$Shipment = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$ShipmentFeed;
  Histories: SObjectDefinition$ShipmentHistory;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Shipment extends SObjectDefinition<'Shipment'> {
    Name: 'Shipment';
    Fields: Fields$Shipment;
    ParentReferences: ParentReferences$Shipment;
    ChildRelationships: ChildRelationships$Shipment;
  }

type Fields$ShipmentFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$ShipmentFeed = {
  //
  Parent: SObjectDefinition$Shipment;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ShipmentFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ShipmentFeed extends SObjectDefinition<'ShipmentFeed'> {
    Name: 'ShipmentFeed';
    Fields: Fields$ShipmentFeed;
    ParentReferences: ParentReferences$ShipmentFeed;
    ChildRelationships: ChildRelationships$ShipmentFeed;
  }

type Fields$ShipmentHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ShipmentId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ShipmentHistory = {
  //
  Shipment: SObjectDefinition$Shipment;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ShipmentHistory = {
  //
};

interface SObjectDefinition$ShipmentHistory extends SObjectDefinition<'ShipmentHistory'> {
    Name: 'ShipmentHistory';
    Fields: Fields$ShipmentHistory;
    ParentReferences: ParentReferences$ShipmentHistory;
    ChildRelationships: ChildRelationships$ShipmentHistory;
  }

type Fields$ShipmentShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$ShipmentShare = {
  //
  Parent: SObjectDefinition$Shipment;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ShipmentShare = {
  //
};

interface SObjectDefinition$ShipmentShare extends SObjectDefinition<'ShipmentShare'> {
    Name: 'ShipmentShare';
    Fields: Fields$ShipmentShare;
    ParentReferences: ParentReferences$ShipmentShare;
    ChildRelationships: ChildRelationships$ShipmentShare;
  }

type Fields$Site = {
  //
  Id: string;
  Name: string;
  Subdomain: string | null;
  UrlPathPrefix: string | null;
  GuestUserId: string | null;
  Status: string;
  AdminId: string;
  OptionsEnableFeeds: boolean;
  OptionsRequireHttps: boolean;
  OptionsAllowHomePage: boolean;
  OptionsAllowStandardIdeasPages: boolean;
  OptionsAllowStandardSearch: boolean;
  OptionsAllowStandardLookups: boolean;
  OptionsAllowStandardAnswersPages: boolean;
  OptionsAllowGuestSupportApi: boolean;
  OptionsAllowStandardPortalPages: boolean;
  OptionsCspUpgradeInsecureRequests: boolean;
  OptionsContentSniffingProtection: boolean;
  OptionsBrowserXssProtection: boolean;
  OptionsReferrerPolicyOriginWhenCrossOrigin: boolean;
  Description: string | null;
  MasterLabel: string;
  AnalyticsTrackingCode: string | null;
  SiteType: string;
  ClickjackProtectionLevel: string;
  DailyBandwidthLimit: number | null;
  DailyBandwidthUsed: number | null;
  DailyRequestTimeLimit: number | null;
  DailyRequestTimeUsed: number | null;
  MonthlyPageViewsEntitlement: number | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Site = {
  //
  GuestUser: SObjectDefinition$User | null;
  Admin: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Site = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  SiteDomainPaths: SObjectDefinition$DomainSite;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Feeds: SObjectDefinition$SiteFeed;
  Histories: SObjectDefinition$SiteHistory;
};

interface SObjectDefinition$Site extends SObjectDefinition<'Site'> {
    Name: 'Site';
    Fields: Fields$Site;
    ParentReferences: ParentReferences$Site;
    ChildRelationships: ChildRelationships$Site;
  }

type Fields$SiteDetail = {
  //
  Id: string;
  DurableId: string | null;
  IsRegistrationEnabled: boolean;
  SecureUrl: string | null;
};

type ParentReferences$SiteDetail = {
  //
};

type ChildRelationships$SiteDetail = {
  //
};

interface SObjectDefinition$SiteDetail extends SObjectDefinition<'SiteDetail'> {
    Name: 'SiteDetail';
    Fields: Fields$SiteDetail;
    ParentReferences: ParentReferences$SiteDetail;
    ChildRelationships: ChildRelationships$SiteDetail;
  }

type Fields$SiteFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$SiteFeed = {
  //
  Parent: SObjectDefinition$Site;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$SiteFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$SiteFeed extends SObjectDefinition<'SiteFeed'> {
    Name: 'SiteFeed';
    Fields: Fields$SiteFeed;
    ParentReferences: ParentReferences$SiteFeed;
    ChildRelationships: ChildRelationships$SiteFeed;
  }

type Fields$SiteHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  SiteId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$SiteHistory = {
  //
  Site: SObjectDefinition$Site;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SiteHistory = {
  //
};

interface SObjectDefinition$SiteHistory extends SObjectDefinition<'SiteHistory'> {
    Name: 'SiteHistory';
    Fields: Fields$SiteHistory;
    ParentReferences: ParentReferences$SiteHistory;
    ChildRelationships: ChildRelationships$SiteHistory;
  }

type Fields$Skill = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  Description: string | null;
};

type ParentReferences$Skill = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Skill = {
  //
  ServiceResources: SObjectDefinition$ServiceResourceSkill;
  SkillRequirements: SObjectDefinition$SkillRequirement;
};

interface SObjectDefinition$Skill extends SObjectDefinition<'Skill'> {
    Name: 'Skill';
    Fields: Fields$Skill;
    ParentReferences: ParentReferences$Skill;
    ChildRelationships: ChildRelationships$Skill;
  }

type Fields$SkillRequirement = {
  //
  Id: string;
  IsDeleted: boolean;
  SkillNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  RelatedRecordId: string;
  SkillId: string;
  SkillLevel: number | null;
};

type ParentReferences$SkillRequirement = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  RelatedRecord: SObjectDefinition$Name;
  Skill: SObjectDefinition$Skill;
};

type ChildRelationships$SkillRequirement = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Feeds: SObjectDefinition$SkillRequirementFeed;
  Histories: SObjectDefinition$SkillRequirementHistory;
};

interface SObjectDefinition$SkillRequirement extends SObjectDefinition<'SkillRequirement'> {
    Name: 'SkillRequirement';
    Fields: Fields$SkillRequirement;
    ParentReferences: ParentReferences$SkillRequirement;
    ChildRelationships: ChildRelationships$SkillRequirement;
  }

type Fields$SkillRequirementFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$SkillRequirementFeed = {
  //
  Parent: SObjectDefinition$SkillRequirement;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$SkillRequirementFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$SkillRequirementFeed extends SObjectDefinition<'SkillRequirementFeed'> {
    Name: 'SkillRequirementFeed';
    Fields: Fields$SkillRequirementFeed;
    ParentReferences: ParentReferences$SkillRequirementFeed;
    ChildRelationships: ChildRelationships$SkillRequirementFeed;
  }

type Fields$SkillRequirementHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  SkillRequirementId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$SkillRequirementHistory = {
  //
  SkillRequirement: SObjectDefinition$SkillRequirement;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SkillRequirementHistory = {
  //
};

interface SObjectDefinition$SkillRequirementHistory extends SObjectDefinition<'SkillRequirementHistory'> {
    Name: 'SkillRequirementHistory';
    Fields: Fields$SkillRequirementHistory;
    ParentReferences: ParentReferences$SkillRequirementHistory;
    ChildRelationships: ChildRelationships$SkillRequirementHistory;
  }

type Fields$Solution = {
  //
  Id: string;
  IsDeleted: boolean;
  SolutionNumber: string;
  SolutionName: string;
  IsPublished: boolean;
  IsPublishedInPublicKb: boolean;
  Status: string;
  IsReviewed: boolean;
  SolutionNote: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  TimesUsed: number;
  CurrencyIsoCode: string | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  IsHtml: boolean;
};

type ParentReferences$Solution = {
  //
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Solution = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CaseSolutions: SObjectDefinition$CaseSolution;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$SolutionFeed;
  Histories: SObjectDefinition$SolutionHistory;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  Votes: SObjectDefinition$Vote;
};

interface SObjectDefinition$Solution extends SObjectDefinition<'Solution'> {
    Name: 'Solution';
    Fields: Fields$Solution;
    ParentReferences: ParentReferences$Solution;
    ChildRelationships: ChildRelationships$Solution;
  }

type Fields$SolutionFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$SolutionFeed = {
  //
  Parent: SObjectDefinition$Solution;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$SolutionFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$SolutionFeed extends SObjectDefinition<'SolutionFeed'> {
    Name: 'SolutionFeed';
    Fields: Fields$SolutionFeed;
    ParentReferences: ParentReferences$SolutionFeed;
    ChildRelationships: ChildRelationships$SolutionFeed;
  }

type Fields$SolutionHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  SolutionId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$SolutionHistory = {
  //
  Solution: SObjectDefinition$Solution;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SolutionHistory = {
  //
};

interface SObjectDefinition$SolutionHistory extends SObjectDefinition<'SolutionHistory'> {
    Name: 'SolutionHistory';
    Fields: Fields$SolutionHistory;
    ParentReferences: ParentReferences$SolutionHistory;
    ChildRelationships: ChildRelationships$SolutionHistory;
  }

type Fields$SolutionStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  IsReviewed: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$SolutionStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$SolutionStatus = {
  //
};

interface SObjectDefinition$SolutionStatus extends SObjectDefinition<'SolutionStatus'> {
    Name: 'SolutionStatus';
    Fields: Fields$SolutionStatus;
    ParentReferences: ParentReferences$SolutionStatus;
    ChildRelationships: ChildRelationships$SolutionStatus;
  }

type Fields$SourceChangeNotification = {
  //
  ReplayId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  MemberType: string | null;
  MemberName: string | null;
  IsNameObsolete: boolean;
  RevisionNum: number | null;
};

type ParentReferences$SourceChangeNotification = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SourceChangeNotification = {
  //
};

interface SObjectDefinition$SourceChangeNotification extends SObjectDefinition<'SourceChangeNotification'> {
    Name: 'SourceChangeNotification';
    Fields: Fields$SourceChangeNotification;
    ParentReferences: ParentReferences$SourceChangeNotification;
    ChildRelationships: ChildRelationships$SourceChangeNotification;
  }

type Fields$Stamp = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  MasterLabel: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Description: string | null;
};

type ParentReferences$Stamp = {
  //
  Parent: SObjectDefinition$Organization;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Stamp = {
  //
  CustomBrands: SObjectDefinition$CustomBrand;
};

interface SObjectDefinition$Stamp extends SObjectDefinition<'Stamp'> {
    Name: 'Stamp';
    Fields: Fields$Stamp;
    ParentReferences: ParentReferences$Stamp;
    ChildRelationships: ChildRelationships$Stamp;
  }

type Fields$StampAssignment = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  StampId: string;
  SubjectId: string;
};

type ParentReferences$StampAssignment = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Stamp: SObjectDefinition$Stamp;
  Subject: SObjectDefinition$User;
};

type ChildRelationships$StampAssignment = {
  //
};

interface SObjectDefinition$StampAssignment extends SObjectDefinition<'StampAssignment'> {
    Name: 'StampAssignment';
    Fields: Fields$StampAssignment;
    ParentReferences: ParentReferences$StampAssignment;
    ChildRelationships: ChildRelationships$StampAssignment;
  }

type Fields$StaticResource = {
  //
  Id: string;
  NamespacePrefix: string | null;
  Name: string;
  ContentType: string;
  BodyLength: number;
  Body: BlobString | null;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CacheControl: string;
};

type ParentReferences$StaticResource = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$StaticResource = {
  //
};

interface SObjectDefinition$StaticResource extends SObjectDefinition<'StaticResource'> {
    Name: 'StaticResource';
    Fields: Fields$StaticResource;
    ParentReferences: ParentReferences$StaticResource;
    ChildRelationships: ChildRelationships$StaticResource;
  }

type Fields$StreamingChannel = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  IsDynamic: boolean;
  Description: string | null;
};

type ParentReferences$StreamingChannel = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$StreamingChannel = {
  //
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$StreamingChannel extends SObjectDefinition<'StreamingChannel'> {
    Name: 'StreamingChannel';
    Fields: Fields$StreamingChannel;
    ParentReferences: ParentReferences$StreamingChannel;
    ChildRelationships: ChildRelationships$StreamingChannel;
  }

type Fields$StreamingChannelShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$StreamingChannelShare = {
  //
  Parent: SObjectDefinition$StreamingChannel;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$StreamingChannelShare = {
  //
};

interface SObjectDefinition$StreamingChannelShare extends SObjectDefinition<'StreamingChannelShare'> {
    Name: 'StreamingChannelShare';
    Fields: Fields$StreamingChannelShare;
    ParentReferences: ParentReferences$StreamingChannelShare;
    ChildRelationships: ChildRelationships$StreamingChannelShare;
  }

type Fields$TabDefinition = {
  //
  Id: string;
  DurableId: string | null;
  Name: string | null;
  Label: string | null;
  IsCustom: boolean;
  SobjectName: string | null;
  Url: string | null;
  IsAvailableInAloha: boolean;
  IsAvailableInLightning: boolean;
};

type ParentReferences$TabDefinition = {
  //
};

type ChildRelationships$TabDefinition = {
  //
  AppTabs: SObjectDefinition$AppTabMember;
  Colors: SObjectDefinition$ColorDefinition;
  Icons: SObjectDefinition$IconDefinition;
};

interface SObjectDefinition$TabDefinition extends SObjectDefinition<'TabDefinition'> {
    Name: 'TabDefinition';
    Fields: Fields$TabDefinition;
    ParentReferences: ParentReferences$TabDefinition;
    ChildRelationships: ChildRelationships$TabDefinition;
  }

type Fields$Task = {
  //
  Id: string;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  ActivityDate: DateString | null;
  Status: string;
  Priority: string;
  IsHighPriority: boolean;
  OwnerId: string;
  Description: string | null;
  CurrencyIsoCode: string | null;
  IsDeleted: boolean;
  AccountId: string | null;
  IsClosed: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsArchived: boolean;
  CallDurationInSeconds: number | null;
  CallType: string | null;
  CallDisposition: string | null;
  CallObject: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
  RecurrenceActivityId: string | null;
  IsRecurrence: boolean;
  RecurrenceStartDateOnly: DateString | null;
  RecurrenceEndDateOnly: DateString | null;
  RecurrenceTimeZoneSidKey: string | null;
  RecurrenceType: string | null;
  RecurrenceInterval: number | null;
  RecurrenceDayOfWeekMask: number | null;
  RecurrenceDayOfMonth: number | null;
  RecurrenceInstance: string | null;
  RecurrenceMonthOfYear: string | null;
  RecurrenceRegeneratedType: string | null;
  TaskSubtype: string | null;
};

type ParentReferences$Task = {
  //
  Who: SObjectDefinition$Name | null;
  What: SObjectDefinition$Name | null;
  Owner: SObjectDefinition$User;
  Account: SObjectDefinition$Account | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Task = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  RecurringTasks: SObjectDefinition$Task;
  Feeds: SObjectDefinition$TaskFeed;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Task extends SObjectDefinition<'Task'> {
    Name: 'Task';
    Fields: Fields$Task;
    ParentReferences: ParentReferences$Task;
    ChildRelationships: ChildRelationships$Task;
  }

type Fields$TaskChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  WhoId: string | null;
  WhatId: string | null;
  Subject: string | null;
  ActivityDate: DateString | null;
  Status: string | null;
  Priority: string | null;
  OwnerId: string | null;
  Description: string | null;
  CurrencyIsoCode: string | null;
  AccountId: string | null;
  IsClosed: boolean;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  CallDurationInSeconds: number | null;
  CallType: string | null;
  CallDisposition: string | null;
  CallObject: string | null;
  ReminderDateTime: DateString | null;
  IsReminderSet: boolean;
  RecurrenceActivityId: string | null;
  IsRecurrence: boolean;
  RecurrenceStartDateOnly: DateString | null;
  RecurrenceEndDateOnly: DateString | null;
  RecurrenceTimeZoneSidKey: string | null;
  RecurrenceType: string | null;
  RecurrenceInterval: number | null;
  RecurrenceDayOfWeekMask: number | null;
  RecurrenceDayOfMonth: number | null;
  RecurrenceInstance: string | null;
  RecurrenceMonthOfYear: string | null;
  RecurrenceRegeneratedType: string | null;
};

type ParentReferences$TaskChangeEvent = {
  //
};

type ChildRelationships$TaskChangeEvent = {
  //
};

interface SObjectDefinition$TaskChangeEvent extends SObjectDefinition<'TaskChangeEvent'> {
    Name: 'TaskChangeEvent';
    Fields: Fields$TaskChangeEvent;
    ParentReferences: ParentReferences$TaskChangeEvent;
    ChildRelationships: ChildRelationships$TaskChangeEvent;
  }

type Fields$TaskFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$TaskFeed = {
  //
  Parent: SObjectDefinition$Task;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$TaskFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$TaskFeed extends SObjectDefinition<'TaskFeed'> {
    Name: 'TaskFeed';
    Fields: Fields$TaskFeed;
    ParentReferences: ParentReferences$TaskFeed;
    ChildRelationships: ChildRelationships$TaskFeed;
  }

type Fields$TaskPriority = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  IsHighPriority: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$TaskPriority = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$TaskPriority = {
  //
};

interface SObjectDefinition$TaskPriority extends SObjectDefinition<'TaskPriority'> {
    Name: 'TaskPriority';
    Fields: Fields$TaskPriority;
    ParentReferences: ParentReferences$TaskPriority;
    ChildRelationships: ChildRelationships$TaskPriority;
  }

type Fields$TaskStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  IsClosed: boolean;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$TaskStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$TaskStatus = {
  //
};

interface SObjectDefinition$TaskStatus extends SObjectDefinition<'TaskStatus'> {
    Name: 'TaskStatus';
    Fields: Fields$TaskStatus;
    ParentReferences: ParentReferences$TaskStatus;
    ChildRelationships: ChildRelationships$TaskStatus;
  }

type Fields$TenantUsageEntitlement = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ResourceGroupKey: string;
  Setting: string;
  StartDate: DateString;
  EndDate: DateString | null;
  CurrentAmountAllowed: number;
  Frequency: string | null;
  IsPersistentResource: boolean;
  HasRollover: boolean;
  OverageGrace: number | null;
  AmountUsed: number | null;
  UsageDate: DateString | null;
  MasterLabel: string | null;
};

type ParentReferences$TenantUsageEntitlement = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$TenantUsageEntitlement = {
  //
};

interface SObjectDefinition$TenantUsageEntitlement extends SObjectDefinition<'TenantUsageEntitlement'> {
    Name: 'TenantUsageEntitlement';
    Fields: Fields$TenantUsageEntitlement;
    ParentReferences: ParentReferences$TenantUsageEntitlement;
    ChildRelationships: ChildRelationships$TenantUsageEntitlement;
  }

type Fields$TestSuiteMembership = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ApexTestSuiteId: string;
  ApexClassId: string;
};

type ParentReferences$TestSuiteMembership = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ApexTestSuite: SObjectDefinition$ApexTestSuite;
  ApexClass: SObjectDefinition$ApexClass;
};

type ChildRelationships$TestSuiteMembership = {
  //
};

interface SObjectDefinition$TestSuiteMembership extends SObjectDefinition<'TestSuiteMembership'> {
    Name: 'TestSuiteMembership';
    Fields: Fields$TestSuiteMembership;
    ParentReferences: ParentReferences$TestSuiteMembership;
    ChildRelationships: ChildRelationships$TestSuiteMembership;
  }

type Fields$ThirdPartyAccountLink = {
  //
  Id: string;
  ThirdPartyAccountLinkKey: string | null;
  UserId: string | null;
  SsoProviderId: string | null;
  Handle: string | null;
  RemoteIdentifier: string | null;
  Provider: string | null;
  SsoProviderName: string | null;
  IsNotSsoUsable: boolean;
};

type ParentReferences$ThirdPartyAccountLink = {
  //
  User: SObjectDefinition$User | null;
  SsoProvider: SObjectDefinition$AuthProvider | null;
};

type ChildRelationships$ThirdPartyAccountLink = {
  //
};

interface SObjectDefinition$ThirdPartyAccountLink extends SObjectDefinition<'ThirdPartyAccountLink'> {
    Name: 'ThirdPartyAccountLink';
    Fields: Fields$ThirdPartyAccountLink;
    ParentReferences: ParentReferences$ThirdPartyAccountLink;
    ChildRelationships: ChildRelationships$ThirdPartyAccountLink;
  }

type Fields$TimeSheet = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  TimeSheetNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceResourceId: string;
  StartDate: DateString;
  Status: string | null;
  EndDate: DateString;
  TimeSheetEntryCount: number | null;
};

type ParentReferences$TimeSheet = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceResource: SObjectDefinition$ServiceResource;
};

type ChildRelationships$TimeSheet = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TimeSheetEntries: SObjectDefinition$TimeSheetEntry;
  Feeds: SObjectDefinition$TimeSheetFeed;
  Histories: SObjectDefinition$TimeSheetHistory;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$TimeSheet extends SObjectDefinition<'TimeSheet'> {
    Name: 'TimeSheet';
    Fields: Fields$TimeSheet;
    ParentReferences: ParentReferences$TimeSheet;
    ChildRelationships: ChildRelationships$TimeSheet;
  }

type Fields$TimeSheetEntry = {
  //
  Id: string;
  IsDeleted: boolean;
  TimeSheetEntryNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  TimeSheetId: string;
  StartTime: DateString | null;
  EndTime: DateString | null;
  Status: string | null;
  Type: string | null;
  WorkOrderId: string | null;
  WorkOrderLineItemId: string | null;
  Description: string | null;
  Subject: string | null;
  DurationInMinutes: number | null;
};

type ParentReferences$TimeSheetEntry = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  TimeSheet: SObjectDefinition$TimeSheet;
  WorkOrder: SObjectDefinition$WorkOrder | null;
  WorkOrderLineItem: SObjectDefinition$WorkOrderLineItem | null;
};

type ChildRelationships$TimeSheetEntry = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  Feeds: SObjectDefinition$TimeSheetEntryFeed;
  Histories: SObjectDefinition$TimeSheetEntryHistory;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$TimeSheetEntry extends SObjectDefinition<'TimeSheetEntry'> {
    Name: 'TimeSheetEntry';
    Fields: Fields$TimeSheetEntry;
    ParentReferences: ParentReferences$TimeSheetEntry;
    ChildRelationships: ChildRelationships$TimeSheetEntry;
  }

type Fields$TimeSheetEntryFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$TimeSheetEntryFeed = {
  //
  Parent: SObjectDefinition$TimeSheetEntry;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$TimeSheetEntryFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$TimeSheetEntryFeed extends SObjectDefinition<'TimeSheetEntryFeed'> {
    Name: 'TimeSheetEntryFeed';
    Fields: Fields$TimeSheetEntryFeed;
    ParentReferences: ParentReferences$TimeSheetEntryFeed;
    ChildRelationships: ChildRelationships$TimeSheetEntryFeed;
  }

type Fields$TimeSheetEntryHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  TimeSheetEntryId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$TimeSheetEntryHistory = {
  //
  TimeSheetEntry: SObjectDefinition$TimeSheetEntry;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$TimeSheetEntryHistory = {
  //
};

interface SObjectDefinition$TimeSheetEntryHistory extends SObjectDefinition<'TimeSheetEntryHistory'> {
    Name: 'TimeSheetEntryHistory';
    Fields: Fields$TimeSheetEntryHistory;
    ParentReferences: ParentReferences$TimeSheetEntryHistory;
    ChildRelationships: ChildRelationships$TimeSheetEntryHistory;
  }

type Fields$TimeSheetFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$TimeSheetFeed = {
  //
  Parent: SObjectDefinition$TimeSheet;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$TimeSheetFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$TimeSheetFeed extends SObjectDefinition<'TimeSheetFeed'> {
    Name: 'TimeSheetFeed';
    Fields: Fields$TimeSheetFeed;
    ParentReferences: ParentReferences$TimeSheetFeed;
    ChildRelationships: ChildRelationships$TimeSheetFeed;
  }

type Fields$TimeSheetHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  TimeSheetId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$TimeSheetHistory = {
  //
  TimeSheet: SObjectDefinition$TimeSheet;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$TimeSheetHistory = {
  //
};

interface SObjectDefinition$TimeSheetHistory extends SObjectDefinition<'TimeSheetHistory'> {
    Name: 'TimeSheetHistory';
    Fields: Fields$TimeSheetHistory;
    ParentReferences: ParentReferences$TimeSheetHistory;
    ChildRelationships: ChildRelationships$TimeSheetHistory;
  }

type Fields$TimeSheetShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$TimeSheetShare = {
  //
  Parent: SObjectDefinition$TimeSheet;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$TimeSheetShare = {
  //
};

interface SObjectDefinition$TimeSheetShare extends SObjectDefinition<'TimeSheetShare'> {
    Name: 'TimeSheetShare';
    Fields: Fields$TimeSheetShare;
    ParentReferences: ParentReferences$TimeSheetShare;
    ChildRelationships: ChildRelationships$TimeSheetShare;
  }

type Fields$TimeSlot = {
  //
  Id: string;
  IsDeleted: boolean;
  TimeSlotNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  OperatingHoursId: string;
  StartTime: DateString;
  EndTime: DateString;
  DayOfWeek: string;
  Type: string;
};

type ParentReferences$TimeSlot = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  OperatingHours: SObjectDefinition$OperatingHours;
};

type ChildRelationships$TimeSlot = {
  //
  RecordActions: SObjectDefinition$RecordAction;
};

interface SObjectDefinition$TimeSlot extends SObjectDefinition<'TimeSlot'> {
    Name: 'TimeSlot';
    Fields: Fields$TimeSlot;
    ParentReferences: ParentReferences$TimeSlot;
    ChildRelationships: ChildRelationships$TimeSlot;
  }

type Fields$TodayGoal = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Value: number | null;
  UserId: string;
};

type ParentReferences$TodayGoal = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
};

type ChildRelationships$TodayGoal = {
  //
};

interface SObjectDefinition$TodayGoal extends SObjectDefinition<'TodayGoal'> {
    Name: 'TodayGoal';
    Fields: Fields$TodayGoal;
    ParentReferences: ParentReferences$TodayGoal;
    ChildRelationships: ChildRelationships$TodayGoal;
  }

type Fields$TodayGoalShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$TodayGoalShare = {
  //
  Parent: SObjectDefinition$TodayGoal;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$TodayGoalShare = {
  //
};

interface SObjectDefinition$TodayGoalShare extends SObjectDefinition<'TodayGoalShare'> {
    Name: 'TodayGoalShare';
    Fields: Fields$TodayGoalShare;
    ParentReferences: ParentReferences$TodayGoalShare;
    ChildRelationships: ChildRelationships$TodayGoalShare;
  }

type Fields$Topic = {
  //
  Id: string;
  Name: string;
  Description: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  TalkingAbout: number;
  SystemModstamp: DateString;
};

type ParentReferences$Topic = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$Topic = {
  //
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  CustomBrands: SObjectDefinition$CustomBrand;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ListEmailRecipientSources: SObjectDefinition$ListEmailRecipientSource;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  Feeds: SObjectDefinition$TopicFeed;
};

interface SObjectDefinition$Topic extends SObjectDefinition<'Topic'> {
    Name: 'Topic';
    Fields: Fields$Topic;
    ParentReferences: ParentReferences$Topic;
    ChildRelationships: ChildRelationships$Topic;
  }

type Fields$TopicAssignment = {
  //
  Id: string;
  TopicId: string;
  EntityId: string;
  EntityKeyPrefix: string;
  EntityType: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  IsDeleted: boolean;
  SystemModstamp: DateString;
};

type ParentReferences$TopicAssignment = {
  //
  Topic: SObjectDefinition$Topic;
  Entity: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$TopicAssignment = {
  //
};

interface SObjectDefinition$TopicAssignment extends SObjectDefinition<'TopicAssignment'> {
    Name: 'TopicAssignment';
    Fields: Fields$TopicAssignment;
    ParentReferences: ParentReferences$TopicAssignment;
    ChildRelationships: ChildRelationships$TopicAssignment;
  }

type Fields$TopicFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$TopicFeed = {
  //
  Parent: SObjectDefinition$Topic;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$TopicFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$TopicFeed extends SObjectDefinition<'TopicFeed'> {
    Name: 'TopicFeed';
    Fields: Fields$TopicFeed;
    ParentReferences: ParentReferences$TopicFeed;
    ChildRelationships: ChildRelationships$TopicFeed;
  }

type Fields$TopicUserEvent = {
  //
  Id: string;
  UserId: string;
  TopicId: string;
  ActionEnum: string;
  CreatedDate: DateString;
};

type ParentReferences$TopicUserEvent = {
  //
};

type ChildRelationships$TopicUserEvent = {
  //
};

interface SObjectDefinition$TopicUserEvent extends SObjectDefinition<'TopicUserEvent'> {
    Name: 'TopicUserEvent';
    Fields: Fields$TopicUserEvent;
    ParentReferences: ParentReferences$TopicUserEvent;
    ChildRelationships: ChildRelationships$TopicUserEvent;
  }

type Fields$TransactionSecurityPolicy = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Type: string;
  State: string;
  ActionConfig: string;
  ApexPolicyId: string | null;
  EventType: string | null;
  ResourceName: string | null;
  ExecutionUserId: string | null;
  Description: string | null;
  EventName: string | null;
};

type ParentReferences$TransactionSecurityPolicy = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ApexPolicy: SObjectDefinition$ApexClass | null;
  ExecutionUser: SObjectDefinition$User | null;
};

type ChildRelationships$TransactionSecurityPolicy = {
  //
};

interface SObjectDefinition$TransactionSecurityPolicy extends SObjectDefinition<'TransactionSecurityPolicy'> {
    Name: 'TransactionSecurityPolicy';
    Fields: Fields$TransactionSecurityPolicy;
    ParentReferences: ParentReferences$TransactionSecurityPolicy;
    ChildRelationships: ChildRelationships$TransactionSecurityPolicy;
  }

type Fields$UndecidedEventRelation = {
  //
  Id: string;
  RelationId: string | null;
  EventId: string | null;
  RespondedDate: DateString | null;
  Response: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  Type: string | null;
};

type ParentReferences$UndecidedEventRelation = {
  //
  Relation: SObjectDefinition$Name | null;
  Event: SObjectDefinition$Event | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UndecidedEventRelation = {
  //
};

interface SObjectDefinition$UndecidedEventRelation extends SObjectDefinition<'UndecidedEventRelation'> {
    Name: 'UndecidedEventRelation';
    Fields: Fields$UndecidedEventRelation;
    ParentReferences: ParentReferences$UndecidedEventRelation;
    ChildRelationships: ChildRelationships$UndecidedEventRelation;
  }

type Fields$User = {
  //
  Id: string;
  Username: string;
  LastName: string;
  FirstName: string | null;
  Name: string;
  CompanyName: string | null;
  Division: string | null;
  Department: string | null;
  Title: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Email: string;
  EmailPreferencesAutoBcc: boolean;
  EmailPreferencesAutoBccStayInTouch: boolean;
  EmailPreferencesStayInTouchReminder: boolean;
  SenderEmail: string | null;
  SenderName: string | null;
  Signature: string | null;
  StayInTouchSubject: string | null;
  StayInTouchSignature: string | null;
  StayInTouchNote: string | null;
  Phone: string | null;
  Fax: string | null;
  MobilePhone: string | null;
  Alias: string;
  CommunityNickname: string;
  BadgeText: string | null;
  IsActive: boolean;
  TimeZoneSidKey: string;
  UserRoleId: string | null;
  LocaleSidKey: string;
  ReceivesInfoEmails: boolean;
  ReceivesAdminInfoEmails: boolean;
  EmailEncodingKey: string;
  DefaultCurrencyIsoCode: string | null;
  CurrencyIsoCode: string;
  ProfileId: string;
  UserType: string | null;
  LanguageLocaleKey: string;
  EmployeeNumber: string | null;
  DelegatedApproverId: string | null;
  ManagerId: string | null;
  LastLoginDate: DateString | null;
  LastPasswordChangeDate: DateString | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  OfflineTrialExpirationDate: DateString | null;
  OfflinePdaTrialExpirationDate: DateString | null;
  UserPermissionsMarketingUser: boolean;
  UserPermissionsOfflineUser: boolean;
  UserPermissionsCallCenterAutoLogin: boolean;
  UserPermissionsMobileUser: boolean;
  UserPermissionsSFContentUser: boolean;
  UserPermissionsKnowledgeUser: boolean;
  UserPermissionsInteractionUser: boolean;
  UserPermissionsSupportUser: boolean;
  UserPermissionsJigsawProspectingUser: boolean;
  UserPermissionsSiteforceContributorUser: boolean;
  UserPermissionsSiteforcePublisherUser: boolean;
  UserPermissionsWorkDotComUserFeature: boolean;
  ForecastEnabled: boolean;
  UserPreferencesActivityRemindersPopup: boolean;
  UserPreferencesEventRemindersCheckboxDefault: boolean;
  UserPreferencesTaskRemindersCheckboxDefault: boolean;
  UserPreferencesReminderSoundOff: boolean;
  UserPreferencesDisableAllFeedsEmail: boolean;
  UserPreferencesDisableFollowersEmail: boolean;
  UserPreferencesDisableProfilePostEmail: boolean;
  UserPreferencesDisableChangeCommentEmail: boolean;
  UserPreferencesDisableLaterCommentEmail: boolean;
  UserPreferencesDisProfPostCommentEmail: boolean;
  UserPreferencesContentNoEmail: boolean;
  UserPreferencesContentEmailAsAndWhen: boolean;
  UserPreferencesApexPagesDeveloperMode: boolean;
  UserPreferencesHideCSNGetChatterMobileTask: boolean;
  UserPreferencesDisableMentionsPostEmail: boolean;
  UserPreferencesDisMentionsCommentEmail: boolean;
  UserPreferencesHideCSNDesktopTask: boolean;
  UserPreferencesHideChatterOnboardingSplash: boolean;
  UserPreferencesHideSecondChatterOnboardingSplash: boolean;
  UserPreferencesDisCommentAfterLikeEmail: boolean;
  UserPreferencesDisableLikeEmail: boolean;
  UserPreferencesSortFeedByComment: boolean;
  UserPreferencesDisableMessageEmail: boolean;
  UserPreferencesJigsawListUser: boolean;
  UserPreferencesDisableBookmarkEmail: boolean;
  UserPreferencesDisableSharePostEmail: boolean;
  UserPreferencesEnableAutoSubForFeeds: boolean;
  UserPreferencesDisableFileShareNotificationsForApi: boolean;
  UserPreferencesShowTitleToExternalUsers: boolean;
  UserPreferencesShowManagerToExternalUsers: boolean;
  UserPreferencesShowEmailToExternalUsers: boolean;
  UserPreferencesShowWorkPhoneToExternalUsers: boolean;
  UserPreferencesShowMobilePhoneToExternalUsers: boolean;
  UserPreferencesShowFaxToExternalUsers: boolean;
  UserPreferencesShowStreetAddressToExternalUsers: boolean;
  UserPreferencesShowCityToExternalUsers: boolean;
  UserPreferencesShowStateToExternalUsers: boolean;
  UserPreferencesShowPostalCodeToExternalUsers: boolean;
  UserPreferencesShowCountryToExternalUsers: boolean;
  UserPreferencesShowProfilePicToGuestUsers: boolean;
  UserPreferencesShowTitleToGuestUsers: boolean;
  UserPreferencesShowCityToGuestUsers: boolean;
  UserPreferencesShowStateToGuestUsers: boolean;
  UserPreferencesShowPostalCodeToGuestUsers: boolean;
  UserPreferencesShowCountryToGuestUsers: boolean;
  UserPreferencesDisableFeedbackEmail: boolean;
  UserPreferencesDisableWorkEmail: boolean;
  UserPreferencesHideS1BrowserUI: boolean;
  UserPreferencesDisableEndorsementEmail: boolean;
  UserPreferencesPathAssistantCollapsed: boolean;
  UserPreferencesCacheDiagnostics: boolean;
  UserPreferencesShowEmailToGuestUsers: boolean;
  UserPreferencesShowManagerToGuestUsers: boolean;
  UserPreferencesShowWorkPhoneToGuestUsers: boolean;
  UserPreferencesShowMobilePhoneToGuestUsers: boolean;
  UserPreferencesShowFaxToGuestUsers: boolean;
  UserPreferencesShowStreetAddressToGuestUsers: boolean;
  UserPreferencesLightningExperiencePreferred: boolean;
  UserPreferencesPreviewLightning: boolean;
  UserPreferencesHideEndUserOnboardingAssistantModal: boolean;
  UserPreferencesHideLightningMigrationModal: boolean;
  UserPreferencesHideSfxWelcomeMat: boolean;
  UserPreferencesHideBiggerPhotoCallout: boolean;
  UserPreferencesGlobalNavBarWTShown: boolean;
  UserPreferencesGlobalNavGridMenuWTShown: boolean;
  UserPreferencesCreateLEXAppsWTShown: boolean;
  UserPreferencesFavoritesWTShown: boolean;
  UserPreferencesRecordHomeSectionCollapseWTShown: boolean;
  UserPreferencesRecordHomeReservedWTShown: boolean;
  UserPreferencesFavoritesShowTopFavorites: boolean;
  UserPreferencesExcludeMailAppAttachments: boolean;
  UserPreferencesSuppressTaskSFXReminders: boolean;
  UserPreferencesSuppressEventSFXReminders: boolean;
  UserPreferencesPreviewCustomTheme: boolean;
  UserPreferencesHasCelebrationBadge: boolean;
  UserPreferencesUserDebugModePref: boolean;
  UserPreferencesNewLightningReportRunPageEnabled: boolean;
  ContactId: string | null;
  AccountId: string | null;
  CallCenterId: string | null;
  Extension: string | null;
  FederationIdentifier: string | null;
  AboutMe: string | null;
  FullPhotoUrl: string | null;
  SmallPhotoUrl: string | null;
  IsExtIndicatorVisible: boolean;
  OutOfOfficeMessage: string | null;
  MediumPhotoUrl: string | null;
  DigestFrequency: string;
  DefaultGroupNotificationFrequency: string;
  JigsawImportLimitOverride: number | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  BannerPhotoUrl: string | null;
  SmallBannerPhotoUrl: string | null;
  MediumBannerPhotoUrl: string | null;
  IsProfilePhotoActive: boolean;
  IndividualId: string | null;
};

type ParentReferences$User = {
  //
  UserRole: SObjectDefinition$UserRole | null;
  Profile: SObjectDefinition$Profile;
  Manager: SObjectDefinition$User | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Contact: SObjectDefinition$Contact | null;
  Account: SObjectDefinition$Account | null;
  Individual: SObjectDefinition$Individual | null;
};

type ChildRelationships$User = {
  //
  AcceptedEventRelations: SObjectDefinition$AcceptedEventRelation;
  AccountCleanInfoReviewers: SObjectDefinition$AccountCleanInfo;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  GroupMemberships: SObjectDefinition$CollaborationGroupMember;
  GroupMembershipRequests: SObjectDefinition$CollaborationGroupMemberRequest;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactCleanInfoReviewers: SObjectDefinition$ContactCleanInfo;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContractsSigned: SObjectDefinition$Contract;
  DeclinedEventRelations: SObjectDefinition$DeclinedEventRelation;
  EmailMessageRelations: SObjectDefinition$EmailMessageRelation;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  FeedSubscriptions: SObjectDefinition$EntitySubscription;
  EventRelations: SObjectDefinition$EventRelation;
  ExternalDataUserAuths: SObjectDefinition$ExternalDataUserAuth;
  InstalledMobileApps: SObjectDefinition$InstalledMobileApp;
  LeadCleanInfoReviewers: SObjectDefinition$LeadCleanInfo;
  OutgoingEmailRelations: SObjectDefinition$OutgoingEmailRelation;
  OwnedContentDocuments: SObjectDefinition$OwnedContentDocument;
  PermissionSetAssignments: SObjectDefinition$PermissionSetAssignment;
  PermissionSetLicenseAssignments: SObjectDefinition$PermissionSetLicenseAssign;
  ReceivedByProductTransfers: SObjectDefinition$ProductTransfer;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceResources: SObjectDefinition$ServiceResource;
  SessionPermSetActivations: SObjectDefinition$SessionPermSetActivation;
  DeliveredToShipments: SObjectDefinition$Shipment;
  UserSites: SObjectDefinition$Site;
  UndecidedEventRelations: SObjectDefinition$UndecidedEventRelation;
  DelegatedUsers: SObjectDefinition$User;
  ManagedUsers: SObjectDefinition$User;
  UserEntityAccessRights: SObjectDefinition$UserEntityAccess;
  Feeds: SObjectDefinition$UserFeed;
  UserFieldAccessRights: SObjectDefinition$UserFieldAccess;
  UserPreferences: SObjectDefinition$UserPreference;
  Shares: SObjectDefinition$UserShare;
  Badges: SObjectDefinition$WorkBadge;
  GivenThanks: SObjectDefinition$WorkThanks;
};

interface SObjectDefinition$User extends SObjectDefinition<'User'> {
    Name: 'User';
    Fields: Fields$User;
    ParentReferences: ParentReferences$User;
    ChildRelationships: ChildRelationships$User;
  }

type Fields$UserAppInfo = {
  //
  Id: string;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserId: string;
  FormFactor: string;
  AppDefinitionId: string | null;
};

type ParentReferences$UserAppInfo = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
  AppDefinition: SObjectDefinition$AppDefinition | null;
};

type ChildRelationships$UserAppInfo = {
  //
};

interface SObjectDefinition$UserAppInfo extends SObjectDefinition<'UserAppInfo'> {
    Name: 'UserAppInfo';
    Fields: Fields$UserAppInfo;
    ParentReferences: ParentReferences$UserAppInfo;
    ChildRelationships: ChildRelationships$UserAppInfo;
  }

type Fields$UserAppMenuCustomization = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ApplicationId: string | null;
  SortOrder: number | null;
};

type ParentReferences$UserAppMenuCustomization = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Application: SObjectDefinition$ConnectedApplication | null;
};

type ChildRelationships$UserAppMenuCustomization = {
  //
};

interface SObjectDefinition$UserAppMenuCustomization extends SObjectDefinition<'UserAppMenuCustomization'> {
    Name: 'UserAppMenuCustomization';
    Fields: Fields$UserAppMenuCustomization;
    ParentReferences: ParentReferences$UserAppMenuCustomization;
    ChildRelationships: ChildRelationships$UserAppMenuCustomization;
  }

type Fields$UserAppMenuCustomizationShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$UserAppMenuCustomizationShare = {
  //
  Parent: SObjectDefinition$UserAppMenuCustomization;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserAppMenuCustomizationShare = {
  //
};

interface SObjectDefinition$UserAppMenuCustomizationShare extends SObjectDefinition<'UserAppMenuCustomizationShare'> {
    Name: 'UserAppMenuCustomizationShare';
    Fields: Fields$UserAppMenuCustomizationShare;
    ParentReferences: ParentReferences$UserAppMenuCustomizationShare;
    ChildRelationships: ChildRelationships$UserAppMenuCustomizationShare;
  }

type Fields$UserAppMenuItem = {
  //
  Id: string;
  AppMenuItemId: string | null;
  ApplicationId: string | null;
  Label: string | null;
  Description: string | null;
  Name: string | null;
  UserSortOrder: number | null;
  SortOrder: number | null;
  Type: string | null;
  LogoUrl: string | null;
  IconUrl: string | null;
  InfoUrl: string | null;
  StartUrl: string | null;
  MobileStartUrl: string | null;
  IsVisible: boolean;
  IsUsingAdminAuthorization: boolean;
};

type ParentReferences$UserAppMenuItem = {
  //
};

type ChildRelationships$UserAppMenuItem = {
  //
};

interface SObjectDefinition$UserAppMenuItem extends SObjectDefinition<'UserAppMenuItem'> {
    Name: 'UserAppMenuItem';
    Fields: Fields$UserAppMenuItem;
    ParentReferences: ParentReferences$UserAppMenuItem;
    ChildRelationships: ChildRelationships$UserAppMenuItem;
  }

type Fields$UserChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Username: string | null;
  LastName: string | null;
  FirstName: string | null;
  Name: string | null;
  CompanyName: string | null;
  Division: string | null;
  Department: string | null;
  Title: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Email: string | null;
  EmailPreferencesAutoBcc: boolean;
  EmailPreferencesAutoBccStayInTouch: boolean;
  EmailPreferencesStayInTouchReminder: boolean;
  SenderEmail: string | null;
  SenderName: string | null;
  Signature: string | null;
  StayInTouchSubject: string | null;
  StayInTouchSignature: string | null;
  StayInTouchNote: string | null;
  Phone: string | null;
  Fax: string | null;
  MobilePhone: string | null;
  Alias: string | null;
  CommunityNickname: string | null;
  IsActive: boolean;
  TimeZoneSidKey: string | null;
  UserRoleId: string | null;
  LocaleSidKey: string | null;
  ReceivesInfoEmails: boolean;
  ReceivesAdminInfoEmails: boolean;
  EmailEncodingKey: string | null;
  DefaultCurrencyIsoCode: string | null;
  CurrencyIsoCode: string | null;
  ProfileId: string | null;
  UserType: string | null;
  LanguageLocaleKey: string | null;
  EmployeeNumber: string | null;
  DelegatedApproverId: string | null;
  ManagerId: string | null;
  LastLoginDate: DateString | null;
  LastPasswordChangeDate: DateString | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  OfflineTrialExpirationDate: DateString | null;
  OfflinePdaTrialExpirationDate: DateString | null;
  UserPermissionsMarketingUser: boolean;
  UserPermissionsOfflineUser: boolean;
  UserPermissionsCallCenterAutoLogin: boolean;
  UserPermissionsMobileUser: boolean;
  UserPermissionsSFContentUser: boolean;
  UserPermissionsKnowledgeUser: boolean;
  UserPermissionsInteractionUser: boolean;
  UserPermissionsSupportUser: boolean;
  UserPermissionsJigsawProspectingUser: boolean;
  UserPermissionsSiteforceContributorUser: boolean;
  UserPermissionsSiteforcePublisherUser: boolean;
  UserPermissionsWorkDotComUserFeature: boolean;
  ForecastEnabled: boolean;
  UserPreferencesActivityRemindersPopup: boolean;
  UserPreferencesEventRemindersCheckboxDefault: boolean;
  UserPreferencesTaskRemindersCheckboxDefault: boolean;
  UserPreferencesReminderSoundOff: boolean;
  UserPreferencesDisableAllFeedsEmail: boolean;
  UserPreferencesDisableFollowersEmail: boolean;
  UserPreferencesDisableProfilePostEmail: boolean;
  UserPreferencesDisableChangeCommentEmail: boolean;
  UserPreferencesDisableLaterCommentEmail: boolean;
  UserPreferencesDisProfPostCommentEmail: boolean;
  UserPreferencesContentNoEmail: boolean;
  UserPreferencesContentEmailAsAndWhen: boolean;
  UserPreferencesApexPagesDeveloperMode: boolean;
  UserPreferencesHideCSNGetChatterMobileTask: boolean;
  UserPreferencesDisableMentionsPostEmail: boolean;
  UserPreferencesDisMentionsCommentEmail: boolean;
  UserPreferencesHideCSNDesktopTask: boolean;
  UserPreferencesHideChatterOnboardingSplash: boolean;
  UserPreferencesHideSecondChatterOnboardingSplash: boolean;
  UserPreferencesDisCommentAfterLikeEmail: boolean;
  UserPreferencesDisableLikeEmail: boolean;
  UserPreferencesSortFeedByComment: boolean;
  UserPreferencesDisableMessageEmail: boolean;
  UserPreferencesJigsawListUser: boolean;
  UserPreferencesDisableBookmarkEmail: boolean;
  UserPreferencesDisableSharePostEmail: boolean;
  UserPreferencesEnableAutoSubForFeeds: boolean;
  UserPreferencesDisableFileShareNotificationsForApi: boolean;
  UserPreferencesShowTitleToExternalUsers: boolean;
  UserPreferencesShowManagerToExternalUsers: boolean;
  UserPreferencesShowEmailToExternalUsers: boolean;
  UserPreferencesShowWorkPhoneToExternalUsers: boolean;
  UserPreferencesShowMobilePhoneToExternalUsers: boolean;
  UserPreferencesShowFaxToExternalUsers: boolean;
  UserPreferencesShowStreetAddressToExternalUsers: boolean;
  UserPreferencesShowCityToExternalUsers: boolean;
  UserPreferencesShowStateToExternalUsers: boolean;
  UserPreferencesShowPostalCodeToExternalUsers: boolean;
  UserPreferencesShowCountryToExternalUsers: boolean;
  UserPreferencesShowProfilePicToGuestUsers: boolean;
  UserPreferencesShowTitleToGuestUsers: boolean;
  UserPreferencesShowCityToGuestUsers: boolean;
  UserPreferencesShowStateToGuestUsers: boolean;
  UserPreferencesShowPostalCodeToGuestUsers: boolean;
  UserPreferencesShowCountryToGuestUsers: boolean;
  UserPreferencesDisableFeedbackEmail: boolean;
  UserPreferencesDisableWorkEmail: boolean;
  UserPreferencesHideS1BrowserUI: boolean;
  UserPreferencesDisableEndorsementEmail: boolean;
  UserPreferencesPathAssistantCollapsed: boolean;
  UserPreferencesCacheDiagnostics: boolean;
  UserPreferencesShowEmailToGuestUsers: boolean;
  UserPreferencesShowManagerToGuestUsers: boolean;
  UserPreferencesShowWorkPhoneToGuestUsers: boolean;
  UserPreferencesShowMobilePhoneToGuestUsers: boolean;
  UserPreferencesShowFaxToGuestUsers: boolean;
  UserPreferencesShowStreetAddressToGuestUsers: boolean;
  UserPreferencesLightningExperiencePreferred: boolean;
  UserPreferencesPreviewLightning: boolean;
  UserPreferencesHideEndUserOnboardingAssistantModal: boolean;
  UserPreferencesHideLightningMigrationModal: boolean;
  UserPreferencesHideSfxWelcomeMat: boolean;
  UserPreferencesHideBiggerPhotoCallout: boolean;
  UserPreferencesGlobalNavBarWTShown: boolean;
  UserPreferencesGlobalNavGridMenuWTShown: boolean;
  UserPreferencesCreateLEXAppsWTShown: boolean;
  UserPreferencesFavoritesWTShown: boolean;
  UserPreferencesRecordHomeSectionCollapseWTShown: boolean;
  UserPreferencesRecordHomeReservedWTShown: boolean;
  UserPreferencesFavoritesShowTopFavorites: boolean;
  UserPreferencesExcludeMailAppAttachments: boolean;
  UserPreferencesSuppressTaskSFXReminders: boolean;
  UserPreferencesSuppressEventSFXReminders: boolean;
  UserPreferencesPreviewCustomTheme: boolean;
  UserPreferencesHasCelebrationBadge: boolean;
  UserPreferencesUserDebugModePref: boolean;
  UserPreferencesNewLightningReportRunPageEnabled: boolean;
  ContactId: string | null;
  AccountId: string | null;
  CallCenterId: string | null;
  Extension: string | null;
  FederationIdentifier: string | null;
  AboutMe: string | null;
  DigestFrequency: string | null;
  DefaultGroupNotificationFrequency: string | null;
  JigsawImportLimitOverride: number | null;
  IsProfilePhotoActive: boolean;
  IndividualId: string | null;
};

type ParentReferences$UserChangeEvent = {
  //
};

type ChildRelationships$UserChangeEvent = {
  //
};

interface SObjectDefinition$UserChangeEvent extends SObjectDefinition<'UserChangeEvent'> {
    Name: 'UserChangeEvent';
    Fields: Fields$UserChangeEvent;
    ParentReferences: ParentReferences$UserChangeEvent;
    ChildRelationships: ChildRelationships$UserChangeEvent;
  }

type Fields$UserEntityAccess = {
  //
  Id: string;
  DurableId: string | null;
  UserId: string | null;
  IsMergeable: boolean;
  IsUpdatable: boolean;
  IsActivateable: boolean;
  IsReadable: boolean;
  IsCreatable: boolean;
  IsEditable: boolean;
  IsDeletable: boolean;
  IsUndeletable: boolean;
  IsFlsUpdatable: boolean;
  EntityDefinitionId: string | null;
};

type ParentReferences$UserEntityAccess = {
  //
  User: SObjectDefinition$User | null;
};

type ChildRelationships$UserEntityAccess = {
  //
};

interface SObjectDefinition$UserEntityAccess extends SObjectDefinition<'UserEntityAccess'> {
    Name: 'UserEntityAccess';
    Fields: Fields$UserEntityAccess;
    ParentReferences: ParentReferences$UserEntityAccess;
    ChildRelationships: ChildRelationships$UserEntityAccess;
  }

type Fields$UserFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$UserFeed = {
  //
  Parent: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$UserFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$UserFeed extends SObjectDefinition<'UserFeed'> {
    Name: 'UserFeed';
    Fields: Fields$UserFeed;
    ParentReferences: ParentReferences$UserFeed;
    ChildRelationships: ChildRelationships$UserFeed;
  }

type Fields$UserFieldAccess = {
  //
  Id: string;
  DurableId: string | null;
  UserId: string | null;
  IsUpdatable: boolean;
  IsCreatable: boolean;
  IsAccessible: boolean;
  EntityDefinitionId: string | null;
  FieldDefinitionId: string | null;
};

type ParentReferences$UserFieldAccess = {
  //
  User: SObjectDefinition$User | null;
};

type ChildRelationships$UserFieldAccess = {
  //
};

interface SObjectDefinition$UserFieldAccess extends SObjectDefinition<'UserFieldAccess'> {
    Name: 'UserFieldAccess';
    Fields: Fields$UserFieldAccess;
    ParentReferences: ParentReferences$UserFieldAccess;
    ChildRelationships: ChildRelationships$UserFieldAccess;
  }

type Fields$UserLicense = {
  //
  Id: string;
  LicenseDefinitionKey: string;
  TotalLicenses: number;
  Status: string;
  UsedLicenses: number;
  UsedLicensesLastUpdated: DateString;
  Name: string;
  MasterLabel: string;
  MonthlyLoginsUsed: number | null;
  MonthlyLoginsEntitlement: number | null;
  CreatedDate: DateString;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$UserLicense = {
  //
};

type ChildRelationships$UserLicense = {
  //
};

interface SObjectDefinition$UserLicense extends SObjectDefinition<'UserLicense'> {
    Name: 'UserLicense';
    Fields: Fields$UserLicense;
    ParentReferences: ParentReferences$UserLicense;
    ChildRelationships: ChildRelationships$UserLicense;
  }

type Fields$UserListView = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserId: string;
  ListViewId: string;
  SobjectType: string | null;
  LastViewedChart: string | null;
};

type ParentReferences$UserListView = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
  ListView: SObjectDefinition$ListView;
};

type ChildRelationships$UserListView = {
  //
};

interface SObjectDefinition$UserListView extends SObjectDefinition<'UserListView'> {
    Name: 'UserListView';
    Fields: Fields$UserListView;
    ParentReferences: ParentReferences$UserListView;
    ChildRelationships: ChildRelationships$UserListView;
  }

type Fields$UserListViewCriterion = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserListViewId: string;
  SortOrder: number;
  ColumnName: string;
  Operation: string;
  Value: string | null;
};

type ParentReferences$UserListViewCriterion = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  UserListView: SObjectDefinition$UserListView;
};

type ChildRelationships$UserListViewCriterion = {
  //
};

interface SObjectDefinition$UserListViewCriterion extends SObjectDefinition<'UserListViewCriterion'> {
    Name: 'UserListViewCriterion';
    Fields: Fields$UserListViewCriterion;
    ParentReferences: ParentReferences$UserListViewCriterion;
    ChildRelationships: ChildRelationships$UserListViewCriterion;
  }

type Fields$UserLogin = {
  //
  Id: string;
  UserId: string | null;
  IsFrozen: boolean;
  IsPasswordLocked: boolean;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$UserLogin = {
  //
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserLogin = {
  //
};

interface SObjectDefinition$UserLogin extends SObjectDefinition<'UserLogin'> {
    Name: 'UserLogin';
    Fields: Fields$UserLogin;
    ParentReferences: ParentReferences$UserLogin;
    ChildRelationships: ChildRelationships$UserLogin;
  }

type Fields$UserPackageLicense = {
  //
  Id: string;
  PackageLicenseId: string;
  UserId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$UserPackageLicense = {
  //
  PackageLicense: SObjectDefinition$PackageLicense;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserPackageLicense = {
  //
};

interface SObjectDefinition$UserPackageLicense extends SObjectDefinition<'UserPackageLicense'> {
    Name: 'UserPackageLicense';
    Fields: Fields$UserPackageLicense;
    ParentReferences: ParentReferences$UserPackageLicense;
    ChildRelationships: ChildRelationships$UserPackageLicense;
  }

type Fields$UserPermissionAccess = {
  //
  Id: string;
  LastCacheUpdate: DateString | null;
  PermissionsEmailSingle: boolean;
  PermissionsEmailMass: boolean;
  PermissionsEditTask: boolean;
  PermissionsEditEvent: boolean;
  PermissionsExportReport: boolean;
  PermissionsImportPersonal: boolean;
  PermissionsDataExport: boolean;
  PermissionsManageUsers: boolean;
  PermissionsEditPublicFilters: boolean;
  PermissionsEditPublicTemplates: boolean;
  PermissionsModifyAllData: boolean;
  PermissionsManageCases: boolean;
  PermissionsMassInlineEdit: boolean;
  PermissionsEditKnowledge: boolean;
  PermissionsManageKnowledge: boolean;
  PermissionsManageSolutions: boolean;
  PermissionsCustomizeApplication: boolean;
  PermissionsEditReadonlyFields: boolean;
  PermissionsRunReports: boolean;
  PermissionsViewSetup: boolean;
  PermissionsTransferAnyEntity: boolean;
  PermissionsNewReportBuilder: boolean;
  PermissionsActivateContract: boolean;
  PermissionsActivateOrder: boolean;
  PermissionsImportLeads: boolean;
  PermissionsManageLeads: boolean;
  PermissionsTransferAnyLead: boolean;
  PermissionsViewAllData: boolean;
  PermissionsEditPublicDocuments: boolean;
  PermissionsContentHubOnPremiseUser: boolean;
  PermissionsViewEncryptedData: boolean;
  PermissionsEditBrandTemplates: boolean;
  PermissionsEditHtmlTemplates: boolean;
  PermissionsChatterInternalUser: boolean;
  PermissionsManageEncryptionKeys: boolean;
  PermissionsDeleteActivatedContract: boolean;
  PermissionsChatterInviteExternalUsers: boolean;
  PermissionsSendSitRequests: boolean;
  PermissionsManageRemoteAccess: boolean;
  PermissionsCanUseNewDashboardBuilder: boolean;
  PermissionsManageCategories: boolean;
  PermissionsConvertLeads: boolean;
  PermissionsPasswordNeverExpires: boolean;
  PermissionsUseTeamReassignWizards: boolean;
  PermissionsEditActivatedOrders: boolean;
  PermissionsInstallPackaging: boolean;
  PermissionsChatterOwnGroups: boolean;
  PermissionsEditOppLineItemUnitPrice: boolean;
  PermissionsBulkApiHardDelete: boolean;
  PermissionsSolutionImport: boolean;
  PermissionsManageCallCenters: boolean;
  PermissionsManageSynonyms: boolean;
  PermissionsViewContent: boolean;
  PermissionsManageEmailClientConfig: boolean;
  PermissionsEnableNotifications: boolean;
  PermissionsManageDataIntegrations: boolean;
  PermissionsDistributeFromPersWksp: boolean;
  PermissionsViewDataCategories: boolean;
  PermissionsManageDataCategories: boolean;
  PermissionsAuthorApex: boolean;
  PermissionsManageMobile: boolean;
  PermissionsApiEnabled: boolean;
  PermissionsManageCustomReportTypes: boolean;
  PermissionsEditCaseComments: boolean;
  PermissionsTransferAnyCase: boolean;
  PermissionsContentAdministrator: boolean;
  PermissionsCreateWorkspaces: boolean;
  PermissionsManageContentPermissions: boolean;
  PermissionsManageContentProperties: boolean;
  PermissionsManageContentTypes: boolean;
  PermissionsManageExchangeConfig: boolean;
  PermissionsManageAnalyticSnapshots: boolean;
  PermissionsScheduleReports: boolean;
  PermissionsManageBusinessHourHolidays: boolean;
  PermissionsManageDynamicDashboards: boolean;
  PermissionsCustomSidebarOnAllPages: boolean;
  PermissionsManageInteraction: boolean;
  PermissionsViewMyTeamsDashboards: boolean;
  PermissionsModerateChatter: boolean;
  PermissionsResetPasswords: boolean;
  PermissionsFlowUFLRequired: boolean;
  PermissionsCanInsertFeedSystemFields: boolean;
  PermissionsManageKnowledgeImportExport: boolean;
  PermissionsEmailTemplateManagement: boolean;
  PermissionsEmailAdministration: boolean;
  PermissionsManageChatterMessages: boolean;
  PermissionsAllowEmailIC: boolean;
  PermissionsChatterFileLink: boolean;
  PermissionsForceTwoFactor: boolean;
  PermissionsViewEventLogFiles: boolean;
  PermissionsManageNetworks: boolean;
  PermissionsManageAuthProviders: boolean;
  PermissionsRunFlow: boolean;
  PermissionsCreateCustomizeDashboards: boolean;
  PermissionsCreateDashboardFolders: boolean;
  PermissionsViewPublicDashboards: boolean;
  PermissionsManageDashbdsInPubFolders: boolean;
  PermissionsCreateCustomizeReports: boolean;
  PermissionsCreateReportFolders: boolean;
  PermissionsViewPublicReports: boolean;
  PermissionsManageReportsInPubFolders: boolean;
  PermissionsEditMyDashboards: boolean;
  PermissionsEditMyReports: boolean;
  PermissionsViewAllUsers: boolean;
  PermissionsAllowUniversalSearch: boolean;
  PermissionsConnectOrgToEnvironmentHub: boolean;
  PermissionsWorkCalibrationUser: boolean;
  PermissionsCreateCustomizeFilters: boolean;
  PermissionsWorkDotComUserPerm: boolean;
  PermissionsContentHubUser: boolean;
  PermissionsGovernNetworks: boolean;
  PermissionsSalesConsole: boolean;
  PermissionsTwoFactorApi: boolean;
  PermissionsDeleteTopics: boolean;
  PermissionsEditTopics: boolean;
  PermissionsCreateTopics: boolean;
  PermissionsAssignTopics: boolean;
  PermissionsIdentityEnabled: boolean;
  PermissionsIdentityConnect: boolean;
  PermissionsAllowViewKnowledge: boolean;
  PermissionsContentWorkspaces: boolean;
  PermissionsCreateWorkBadgeDefinition: boolean;
  PermissionsManageSearchPromotionRules: boolean;
  PermissionsCustomMobileAppsAccess: boolean;
  PermissionsViewHelpLink: boolean;
  PermissionsManageProfilesPermissionsets: boolean;
  PermissionsAssignPermissionSets: boolean;
  PermissionsManageRoles: boolean;
  PermissionsManageIpAddresses: boolean;
  PermissionsManageSharing: boolean;
  PermissionsManageInternalUsers: boolean;
  PermissionsManagePasswordPolicies: boolean;
  PermissionsManageLoginAccessPolicies: boolean;
  PermissionsManageCustomPermissions: boolean;
  PermissionsCanVerifyComment: boolean;
  PermissionsManageUnlistedGroups: boolean;
  PermissionsModifySecureAgents: boolean;
  PermissionsInsightsAppDashboardEditor: boolean;
  PermissionsManageTwoFactor: boolean;
  PermissionsInsightsAppUser: boolean;
  PermissionsInsightsAppAdmin: boolean;
  PermissionsInsightsAppEltEditor: boolean;
  PermissionsInsightsAppUploadUser: boolean;
  PermissionsInsightsCreateApplication: boolean;
  PermissionsLightningExperienceUser: boolean;
  PermissionsViewDataLeakageEvents: boolean;
  PermissionsConfigCustomRecs: boolean;
  PermissionsSubmitMacrosAllowed: boolean;
  PermissionsBulkMacrosAllowed: boolean;
  PermissionsShareInternalArticles: boolean;
  PermissionsManageSessionPermissionSets: boolean;
  PermissionsManageTemplatedApp: boolean;
  PermissionsUseTemplatedApp: boolean;
  PermissionsSendAnnouncementEmails: boolean;
  PermissionsChatterEditOwnPost: boolean;
  PermissionsChatterEditOwnRecordPost: boolean;
  PermissionsWaveTabularDownload: boolean;
  PermissionsImportCustomObjects: boolean;
  PermissionsDelegatedTwoFactor: boolean;
  PermissionsChatterComposeUiCodesnippet: boolean;
  PermissionsSelectFilesFromSalesforce: boolean;
  PermissionsModerateNetworkUsers: boolean;
  PermissionsMergeTopics: boolean;
  PermissionsSubscribeToLightningReports: boolean;
  PermissionsManagePvtRptsAndDashbds: boolean;
  PermissionsAllowLightningLogin: boolean;
  PermissionsCampaignInfluence2: boolean;
  PermissionsViewDataAssessment: boolean;
  PermissionsRemoveDirectMessageMembers: boolean;
  PermissionsCanApproveFeedPost: boolean;
  PermissionsAddDirectMessageMembers: boolean;
  PermissionsAllowViewEditConvertedLeads: boolean;
  PermissionsFieldServiceAccess: boolean;
  PermissionsFieldServiceScheduling: boolean;
  PermissionsFieldServiceDispatcher: boolean;
  PermissionsFieldServiceMobileApp: boolean;
  PermissionsShowCompanyNameAsUserBadge: boolean;
  PermissionsAccessCMC: boolean;
  PermissionsOptOutGeoLocationTracking: boolean;
  PermissionsViewHealthCheck: boolean;
  PermissionsManageHealthCheck: boolean;
  PermissionsPackaging2: boolean;
  PermissionsManageCertificates: boolean;
  PermissionsCreateReportInLightning: boolean;
  PermissionsPreventClassicExperience: boolean;
  PermissionsHideReadByList: boolean;
  PermissionsListEmailSend: boolean;
  PermissionsFeedPinning: boolean;
  PermissionsChangeDashboardColors: boolean;
  PermissionsIotUser: boolean;
  PermissionsManageRecommendationStrategies: boolean;
  PermissionsManagePropositions: boolean;
  PermissionsCloseConversations: boolean;
  PermissionsUseWebLink: boolean;
  PermissionsViewOnlyEmbeddedAppUser: boolean;
  PermissionsSendExternalEmailAvailable: boolean;
  PermissionsViewAllActivities: boolean;
  PermissionsSubscribeReportToOtherUsers: boolean;
  PermissionsLightningConsoleAllowedForUser: boolean;
  PermissionsSubscribeReportsRunAsUser: boolean;
  PermissionsSubscribeToLightningDashboards: boolean;
  PermissionsSubscribeDashboardToOtherUsers: boolean;
  PermissionsApexRestServices: boolean;
  PermissionsEnableCommunityAppLauncher: boolean;
  PermissionsLtngPromoReserved01UserPerm: boolean;
  PermissionsCanEditDataPrepRecipe: boolean;
  PermissionsAddAnalyticsRemoteConnections: boolean;
  PermissionsManageSurveys: boolean;
  PermissionsRecordVisibilityAPI: boolean;
  PermissionsViewRoles: boolean;
  PermissionsModifyMetadata: boolean;
};

type ParentReferences$UserPermissionAccess = {
  //
};

type ChildRelationships$UserPermissionAccess = {
  //
};

interface SObjectDefinition$UserPermissionAccess extends SObjectDefinition<'UserPermissionAccess'> {
    Name: 'UserPermissionAccess';
    Fields: Fields$UserPermissionAccess;
    ParentReferences: ParentReferences$UserPermissionAccess;
    ChildRelationships: ChildRelationships$UserPermissionAccess;
  }

type Fields$UserPreference = {
  //
  Id: string;
  UserId: string;
  Preference: string;
  Value: string | null;
  SystemModstamp: DateString;
};

type ParentReferences$UserPreference = {
  //
};

type ChildRelationships$UserPreference = {
  //
};

interface SObjectDefinition$UserPreference extends SObjectDefinition<'UserPreference'> {
    Name: 'UserPreference';
    Fields: Fields$UserPreference;
    ParentReferences: ParentReferences$UserPreference;
    ChildRelationships: ChildRelationships$UserPreference;
  }

type Fields$UserProvAccount = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SalesforceUserId: string | null;
  ConnectedAppId: string | null;
  ExternalUserId: string | null;
  ExternalUsername: string | null;
  ExternalEmail: string | null;
  ExternalFirstName: string | null;
  ExternalLastName: string | null;
  LinkState: string;
  Status: string;
  DeletedDate: DateString | null;
  IsKnownLink: boolean;
};

type ParentReferences$UserProvAccount = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SalesforceUser: SObjectDefinition$User | null;
  ConnectedApp: SObjectDefinition$ConnectedApplication | null;
};

type ChildRelationships$UserProvAccount = {
  //
};

interface SObjectDefinition$UserProvAccount extends SObjectDefinition<'UserProvAccount'> {
    Name: 'UserProvAccount';
    Fields: Fields$UserProvAccount;
    ParentReferences: ParentReferences$UserProvAccount;
    ChildRelationships: ChildRelationships$UserProvAccount;
  }

type Fields$UserProvAccountStaging = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ConnectedAppId: string | null;
  SalesforceUserId: string | null;
  ExternalUserId: string | null;
  ExternalUsername: string | null;
  ExternalEmail: string | null;
  ExternalFirstName: string | null;
  ExternalLastName: string | null;
  LinkState: string;
  Status: string;
};

type ParentReferences$UserProvAccountStaging = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ConnectedApp: SObjectDefinition$ConnectedApplication | null;
  SalesforceUser: SObjectDefinition$User | null;
};

type ChildRelationships$UserProvAccountStaging = {
  //
};

interface SObjectDefinition$UserProvAccountStaging extends SObjectDefinition<'UserProvAccountStaging'> {
    Name: 'UserProvAccountStaging';
    Fields: Fields$UserProvAccountStaging;
    ParentReferences: ParentReferences$UserProvAccountStaging;
    ChildRelationships: ChildRelationships$UserProvAccountStaging;
  }

type Fields$UserProvMockTarget = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ExternalUserId: string | null;
  ExternalUsername: string | null;
  ExternalEmail: string | null;
  ExternalFirstName: string | null;
  ExternalLastName: string | null;
};

type ParentReferences$UserProvMockTarget = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserProvMockTarget = {
  //
};

interface SObjectDefinition$UserProvMockTarget extends SObjectDefinition<'UserProvMockTarget'> {
    Name: 'UserProvMockTarget';
    Fields: Fields$UserProvMockTarget;
    ParentReferences: ParentReferences$UserProvMockTarget;
    ChildRelationships: ChildRelationships$UserProvMockTarget;
  }

type Fields$UserProvisioningConfig = {
  //
  Id: string;
  IsDeleted: boolean;
  DeveloperName: string;
  Language: string | null;
  MasterLabel: string;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ConnectedAppId: string | null;
  Notes: string | null;
  Enabled: boolean;
  ApprovalRequired: string | null;
  UserAccountMapping: string | null;
  EnabledOperations: string | null;
  OnUpdateAttributes: string | null;
  LastReconDateTime: DateString | null;
  NamedCredentialId: string | null;
  ReconFilter: string | null;
};

type ParentReferences$UserProvisioningConfig = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ConnectedApp: SObjectDefinition$ConnectedApplication | null;
  NamedCredential: SObjectDefinition$NamedCredential | null;
};

type ChildRelationships$UserProvisioningConfig = {
  //
};

interface SObjectDefinition$UserProvisioningConfig extends SObjectDefinition<'UserProvisioningConfig'> {
    Name: 'UserProvisioningConfig';
    Fields: Fields$UserProvisioningConfig;
    ParentReferences: ParentReferences$UserProvisioningConfig;
    ChildRelationships: ChildRelationships$UserProvisioningConfig;
  }

type Fields$UserProvisioningLog = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserProvisioningRequestId: string | null;
  ExternalUserId: string | null;
  ExternalUsername: string | null;
  UserId: string | null;
  Status: string | null;
  Details: string | null;
};

type ParentReferences$UserProvisioningLog = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  UserProvisioningRequest: SObjectDefinition$UserProvisioningRequest | null;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$UserProvisioningLog = {
  //
};

interface SObjectDefinition$UserProvisioningLog extends SObjectDefinition<'UserProvisioningLog'> {
    Name: 'UserProvisioningLog';
    Fields: Fields$UserProvisioningLog;
    ParentReferences: ParentReferences$UserProvisioningLog;
    ChildRelationships: ChildRelationships$UserProvisioningLog;
  }

type Fields$UserProvisioningRequest = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  SalesforceUserId: string | null;
  ExternalUserId: string | null;
  AppName: string | null;
  State: string;
  Operation: string;
  ScheduleDate: DateString | null;
  ConnectedAppId: string | null;
  UserProvConfigId: string | null;
  UserProvAccountId: string | null;
  ApprovalStatus: string;
  ManagerId: string | null;
  RetryCount: number | null;
  ParentId: string | null;
};

type ParentReferences$UserProvisioningRequest = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  SalesforceUser: SObjectDefinition$User | null;
  ConnectedApp: SObjectDefinition$ConnectedApplication | null;
  UserProvConfig: SObjectDefinition$UserProvisioningConfig | null;
  UserProvAccount: SObjectDefinition$UserProvAccount | null;
  Manager: SObjectDefinition$User | null;
  Parent: SObjectDefinition$UserProvisioningRequest | null;
};

type ChildRelationships$UserProvisioningRequest = {
  //
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$UserProvisioningRequest extends SObjectDefinition<'UserProvisioningRequest'> {
    Name: 'UserProvisioningRequest';
    Fields: Fields$UserProvisioningRequest;
    ParentReferences: ParentReferences$UserProvisioningRequest;
    ChildRelationships: ChildRelationships$UserProvisioningRequest;
  }

type Fields$UserProvisioningRequestShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$UserProvisioningRequestShare = {
  //
  Parent: SObjectDefinition$UserProvisioningRequest;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserProvisioningRequestShare = {
  //
};

interface SObjectDefinition$UserProvisioningRequestShare extends SObjectDefinition<'UserProvisioningRequestShare'> {
    Name: 'UserProvisioningRequestShare';
    Fields: Fields$UserProvisioningRequestShare;
    ParentReferences: ParentReferences$UserProvisioningRequestShare;
    ChildRelationships: ChildRelationships$UserProvisioningRequestShare;
  }

type Fields$UserRecordAccess = {
  //
  Id: string;
  UserId: string;
  RecordId: string;
  HasReadAccess: boolean;
  HasEditAccess: boolean;
  HasDeleteAccess: boolean;
  HasTransferAccess: boolean;
  HasAllAccess: boolean;
  MaxAccessLevel: string | null;
};

type ParentReferences$UserRecordAccess = {
  //
};

type ChildRelationships$UserRecordAccess = {
  //
};

interface SObjectDefinition$UserRecordAccess extends SObjectDefinition<'UserRecordAccess'> {
    Name: 'UserRecordAccess';
    Fields: Fields$UserRecordAccess;
    ParentReferences: ParentReferences$UserRecordAccess;
    ChildRelationships: ChildRelationships$UserRecordAccess;
  }

type Fields$UserRole = {
  //
  Id: string;
  Name: string;
  ParentRoleId: string | null;
  RollupDescription: string | null;
  OpportunityAccessForAccountOwner: string;
  CaseAccessForAccountOwner: string | null;
  ContactAccessForAccountOwner: string | null;
  ForecastUserId: string | null;
  MayForecastManagerShare: boolean;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  DeveloperName: string | null;
  PortalAccountId: string | null;
  PortalType: string | null;
  PortalAccountOwnerId: string | null;
};

type ParentReferences$UserRole = {
  //
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserRole = {
  //
  Users: SObjectDefinition$User;
};

interface SObjectDefinition$UserRole extends SObjectDefinition<'UserRole'> {
    Name: 'UserRole';
    Fields: Fields$UserRole;
    ParentReferences: ParentReferences$UserRole;
    ChildRelationships: ChildRelationships$UserRole;
  }

type Fields$UserShare = {
  //
  Id: string;
  UserId: string;
  UserOrGroupId: string;
  UserAccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsActive: boolean;
};

type ParentReferences$UserShare = {
  //
  User: SObjectDefinition$User;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$UserShare = {
  //
};

interface SObjectDefinition$UserShare extends SObjectDefinition<'UserShare'> {
    Name: 'UserShare';
    Fields: Fields$UserShare;
    ParentReferences: ParentReferences$UserShare;
    ChildRelationships: ChildRelationships$UserShare;
  }

type Fields$VerificationHistory = {
  //
  Id: string;
  EventGroup: number;
  VerificationTime: DateString;
  VerificationMethod: string | null;
  UserId: string;
  Activity: string;
  Status: string;
  LoginHistoryId: string;
  SourceIp: string;
  LoginGeoId: string | null;
  Remarks: string | null;
  ResourceId: string | null;
  Policy: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  IsDeleted: boolean;
  SystemModstamp: DateString;
};

type ParentReferences$VerificationHistory = {
  //
  User: SObjectDefinition$User;
  LoginHistory: SObjectDefinition$LoginHistory;
  LoginGeo: SObjectDefinition$LoginGeo | null;
  Resource: SObjectDefinition$ConnectedApplication | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$VerificationHistory = {
  //
};

interface SObjectDefinition$VerificationHistory extends SObjectDefinition<'VerificationHistory'> {
    Name: 'VerificationHistory';
    Fields: Fields$VerificationHistory;
    ParentReferences: ParentReferences$VerificationHistory;
    ChildRelationships: ChildRelationships$VerificationHistory;
  }

type Fields$VisualforceAccessMetrics = {
  //
  Id: string;
  MetricsDate: DateString;
  ApexPageId: string;
  SystemModstamp: DateString;
  DailyPageViewCount: number | null;
};

type ParentReferences$VisualforceAccessMetrics = {
  //
  ApexPage: SObjectDefinition$ApexPage;
};

type ChildRelationships$VisualforceAccessMetrics = {
  //
};

interface SObjectDefinition$VisualforceAccessMetrics extends SObjectDefinition<'VisualforceAccessMetrics'> {
    Name: 'VisualforceAccessMetrics';
    Fields: Fields$VisualforceAccessMetrics;
    ParentReferences: ParentReferences$VisualforceAccessMetrics;
    ChildRelationships: ChildRelationships$VisualforceAccessMetrics;
  }

type Fields$Vote = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  Type: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$Vote = {
  //
  Parent: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Vote = {
  //
};

interface SObjectDefinition$Vote extends SObjectDefinition<'Vote'> {
    Name: 'Vote';
    Fields: Fields$Vote;
    ParentReferences: ParentReferences$Vote;
    ChildRelationships: ChildRelationships$Vote;
  }

type Fields$WaveAutoInstallRequest = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  TemplateApiName: string | null;
  TemplateVersion: string | null;
  FolderId: string | null;
  RequestType: string;
  RequestStatus: string;
  FailedReason: string | null;
  Configuration: string | null;
  RequestLog: string | null;
};

type ParentReferences$WaveAutoInstallRequest = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Folder: SObjectDefinition$Folder | null;
};

type ChildRelationships$WaveAutoInstallRequest = {
  //
  WaveCompatibilityCheckItems: SObjectDefinition$WaveCompatibilityCheckItem;
};

interface SObjectDefinition$WaveAutoInstallRequest extends SObjectDefinition<'WaveAutoInstallRequest'> {
    Name: 'WaveAutoInstallRequest';
    Fields: Fields$WaveAutoInstallRequest;
    ParentReferences: ParentReferences$WaveAutoInstallRequest;
    ChildRelationships: ChildRelationships$WaveAutoInstallRequest;
  }

type Fields$WaveCompatibilityCheckItem = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  TaskName: string;
  TaskResult: string;
  TemplateApiName: string;
  TemplateVersion: string | null;
  Payload: string | null;
  WaveAutoInstallRequestId: string | null;
};

type ParentReferences$WaveCompatibilityCheckItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  WaveAutoInstallRequest: SObjectDefinition$WaveAutoInstallRequest | null;
};

type ChildRelationships$WaveCompatibilityCheckItem = {
  //
};

interface SObjectDefinition$WaveCompatibilityCheckItem extends SObjectDefinition<'WaveCompatibilityCheckItem'> {
    Name: 'WaveCompatibilityCheckItem';
    Fields: Fields$WaveCompatibilityCheckItem;
    ParentReferences: ParentReferences$WaveCompatibilityCheckItem;
    ChildRelationships: ChildRelationships$WaveCompatibilityCheckItem;
  }

type Fields$WebLink = {
  //
  Id: string;
  PageOrSobjectType: string;
  Name: string;
  IsProtected: boolean;
  Url: string | null;
  EncodingKey: string;
  LinkType: string;
  OpenType: string;
  Height: number | null;
  Width: number | null;
  ShowsLocation: boolean;
  HasScrollbars: boolean;
  HasToolbar: boolean;
  HasMenubar: boolean;
  ShowsStatus: boolean;
  IsResizable: boolean;
  Position: string | null;
  ScontrolId: string | null;
  MasterLabel: string | null;
  Description: string | null;
  DisplayType: string;
  RequireRowSelection: boolean;
  NamespacePrefix: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
};

type ParentReferences$WebLink = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WebLink = {
  //
};

interface SObjectDefinition$WebLink extends SObjectDefinition<'WebLink'> {
    Name: 'WebLink';
    Fields: Fields$WebLink;
    ParentReferences: ParentReferences$WebLink;
    ChildRelationships: ChildRelationships$WebLink;
  }

type Fields$WorkAccess = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentId: string;
  AccessType: string;
};

type ParentReferences$WorkAccess = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$WorkBadgeDefinition;
};

type ChildRelationships$WorkAccess = {
  //
};

interface SObjectDefinition$WorkAccess extends SObjectDefinition<'WorkAccess'> {
    Name: 'WorkAccess';
    Fields: Fields$WorkAccess;
    ParentReferences: ParentReferences$WorkAccess;
    ChildRelationships: ChildRelationships$WorkAccess;
  }

type Fields$WorkAccessShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$WorkAccessShare = {
  //
  Parent: SObjectDefinition$WorkAccess;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkAccessShare = {
  //
};

interface SObjectDefinition$WorkAccessShare extends SObjectDefinition<'WorkAccessShare'> {
    Name: 'WorkAccessShare';
    Fields: Fields$WorkAccessShare;
    ParentReferences: ParentReferences$WorkAccessShare;
    ChildRelationships: ChildRelationships$WorkAccessShare;
  }

type Fields$WorkBadge = {
  //
  Id: string;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  SourceId: string;
  DefinitionId: string;
  RecipientId: string;
  GiverId: string | null;
  ImageUrl: string | null;
  Description: string | null;
  Message: string | null;
};

type ParentReferences$WorkBadge = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Source: SObjectDefinition$WorkThanks;
  Definition: SObjectDefinition$WorkBadgeDefinition;
  Recipient: SObjectDefinition$User;
  Giver: SObjectDefinition$User | null;
};

type ChildRelationships$WorkBadge = {
  //
};

interface SObjectDefinition$WorkBadge extends SObjectDefinition<'WorkBadge'> {
    Name: 'WorkBadge';
    Fields: Fields$WorkBadge;
    ParentReferences: ParentReferences$WorkBadge;
    ChildRelationships: ChildRelationships$WorkBadge;
  }

type Fields$WorkBadgeDefinition = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  IsCompanyWide: boolean;
  Description: string;
  ImageUrl: string;
  IsActive: boolean;
  LimitNumber: number | null;
  IsLimitPerUser: boolean;
  LimitStartDate: DateString | null;
  GivenBadgeCount: number | null;
  IsRewardBadge: boolean;
};

type ParentReferences$WorkBadgeDefinition = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkBadgeDefinition = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  WorkAccesses: SObjectDefinition$WorkAccess;
  Badges: SObjectDefinition$WorkBadge;
  Feeds: SObjectDefinition$WorkBadgeDefinitionFeed;
  Histories: SObjectDefinition$WorkBadgeDefinitionHistory;
};

interface SObjectDefinition$WorkBadgeDefinition extends SObjectDefinition<'WorkBadgeDefinition'> {
    Name: 'WorkBadgeDefinition';
    Fields: Fields$WorkBadgeDefinition;
    ParentReferences: ParentReferences$WorkBadgeDefinition;
    ChildRelationships: ChildRelationships$WorkBadgeDefinition;
  }

type Fields$WorkBadgeDefinitionFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$WorkBadgeDefinitionFeed = {
  //
  Parent: SObjectDefinition$WorkBadgeDefinition;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$WorkBadgeDefinitionFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$WorkBadgeDefinitionFeed extends SObjectDefinition<'WorkBadgeDefinitionFeed'> {
    Name: 'WorkBadgeDefinitionFeed';
    Fields: Fields$WorkBadgeDefinitionFeed;
    ParentReferences: ParentReferences$WorkBadgeDefinitionFeed;
    ChildRelationships: ChildRelationships$WorkBadgeDefinitionFeed;
  }

type Fields$WorkBadgeDefinitionHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  WorkBadgeDefinitionId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$WorkBadgeDefinitionHistory = {
  //
  WorkBadgeDefinition: SObjectDefinition$WorkBadgeDefinition;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkBadgeDefinitionHistory = {
  //
};

interface SObjectDefinition$WorkBadgeDefinitionHistory extends SObjectDefinition<'WorkBadgeDefinitionHistory'> {
    Name: 'WorkBadgeDefinitionHistory';
    Fields: Fields$WorkBadgeDefinitionHistory;
    ParentReferences: ParentReferences$WorkBadgeDefinitionHistory;
    ChildRelationships: ChildRelationships$WorkBadgeDefinitionHistory;
  }

type Fields$WorkBadgeDefinitionShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$WorkBadgeDefinitionShare = {
  //
  Parent: SObjectDefinition$WorkBadgeDefinition;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkBadgeDefinitionShare = {
  //
};

interface SObjectDefinition$WorkBadgeDefinitionShare extends SObjectDefinition<'WorkBadgeDefinitionShare'> {
    Name: 'WorkBadgeDefinitionShare';
    Fields: Fields$WorkBadgeDefinitionShare;
    ParentReferences: ParentReferences$WorkBadgeDefinitionShare;
    ChildRelationships: ChildRelationships$WorkBadgeDefinitionShare;
  }

type Fields$WorkOrder = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  WorkOrderNumber: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  AccountId: string | null;
  ContactId: string | null;
  CaseId: string | null;
  AssetId: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Description: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  Subject: string | null;
  RootWorkOrderId: string | null;
  Status: string | null;
  Priority: string | null;
  Tax: number | null;
  Subtotal: number | null;
  TotalPrice: number | null;
  LineItemCount: number | null;
  Pricebook2Id: string | null;
  Discount: number | null;
  GrandTotal: number | null;
  ParentWorkOrderId: string | null;
  IsClosed: boolean;
  BusinessHoursId: string | null;
  Duration: number | null;
  DurationType: string | null;
  DurationInMinutes: number | null;
  ServiceAppointmentCount: number | null;
  WorkTypeId: string | null;
  ServiceTerritoryId: string | null;
  StatusCategory: string | null;
  LocationId: string | null;
  MaintenancePlanId: string | null;
  SuggestedMaintenanceDate: DateString | null;
  MinimumCrewSize: number | null;
  RecommendedCrewSize: number | null;
  ServiceReportTemplateId: string | null;
  ReturnOrderLineItemId: string | null;
  ReturnOrderId: string | null;
  IsGeneratedFromMaintenancePlan: boolean;
};

type ParentReferences$WorkOrder = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account | null;
  Contact: SObjectDefinition$Contact | null;
  Case: SObjectDefinition$Case | null;
  Asset: SObjectDefinition$Asset | null;
  RootWorkOrder: SObjectDefinition$WorkOrder | null;
  Pricebook2: SObjectDefinition$Pricebook2 | null;
  ParentWorkOrder: SObjectDefinition$WorkOrder | null;
  BusinessHours: SObjectDefinition$BusinessHours | null;
  WorkType: SObjectDefinition$WorkType | null;
  ServiceTerritory: SObjectDefinition$ServiceTerritory | null;
  Location: SObjectDefinition$Location | null;
  MaintenancePlan: SObjectDefinition$MaintenancePlan | null;
  ServiceReportTemplate: SObjectDefinition$ServiceReportLayout | null;
  ReturnOrderLineItem: SObjectDefinition$ReturnOrderLineItem | null;
  ReturnOrder: SObjectDefinition$ReturnOrder | null;
};

type ChildRelationships$WorkOrder = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DigitalSignatures: SObjectDefinition$DigitalSignature;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductsConsumed: SObjectDefinition$ProductConsumed;
  ProductRequests: SObjectDefinition$ProductRequest;
  ProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  ProductsRequired: SObjectDefinition$ProductRequired;
  RecordActions: SObjectDefinition$RecordAction;
  ResourcePreferences: SObjectDefinition$ResourcePreference;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  ServiceReports: SObjectDefinition$ServiceReport;
  SkillRequirements: SObjectDefinition$SkillRequirement;
  Tasks: SObjectDefinition$Task;
  TimeSheetEntries: SObjectDefinition$TimeSheetEntry;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  ChildWorkOrders: SObjectDefinition$WorkOrder;
  DescendantWorkOrders: SObjectDefinition$WorkOrder;
  Feeds: SObjectDefinition$WorkOrderFeed;
  Histories: SObjectDefinition$WorkOrderHistory;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$WorkOrder extends SObjectDefinition<'WorkOrder'> {
    Name: 'WorkOrder';
    Fields: Fields$WorkOrder;
    ParentReferences: ParentReferences$WorkOrder;
    ChildRelationships: ChildRelationships$WorkOrder;
  }

type Fields$WorkOrderFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$WorkOrderFeed = {
  //
  Parent: SObjectDefinition$WorkOrder;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$WorkOrderFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$WorkOrderFeed extends SObjectDefinition<'WorkOrderFeed'> {
    Name: 'WorkOrderFeed';
    Fields: Fields$WorkOrderFeed;
    ParentReferences: ParentReferences$WorkOrderFeed;
    ChildRelationships: ChildRelationships$WorkOrderFeed;
  }

type Fields$WorkOrderHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  WorkOrderId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$WorkOrderHistory = {
  //
  WorkOrder: SObjectDefinition$WorkOrder;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkOrderHistory = {
  //
};

interface SObjectDefinition$WorkOrderHistory extends SObjectDefinition<'WorkOrderHistory'> {
    Name: 'WorkOrderHistory';
    Fields: Fields$WorkOrderHistory;
    ParentReferences: ParentReferences$WorkOrderHistory;
    ChildRelationships: ChildRelationships$WorkOrderHistory;
  }

type Fields$WorkOrderLineItem = {
  //
  Id: string;
  IsDeleted: boolean;
  LineItemNumber: string;
  CurrencyIsoCode: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  WorkOrderId: string;
  ParentWorkOrderLineItemId: string | null;
  Product2Id: string | null;
  AssetId: string | null;
  OrderId: string | null;
  RootWorkOrderLineItemId: string | null;
  Description: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  Status: string | null;
  PricebookEntryId: string | null;
  Quantity: number | null;
  UnitPrice: number | null;
  Discount: number | null;
  ListPrice: number | null;
  Subtotal: number | null;
  TotalPrice: number | null;
  Duration: number | null;
  DurationType: string | null;
  DurationInMinutes: number | null;
  WorkTypeId: string | null;
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  ServiceTerritoryId: string | null;
  Subject: string | null;
  StatusCategory: string | null;
  IsClosed: boolean;
  Priority: string | null;
  ServiceAppointmentCount: number | null;
  LocationId: string | null;
  MinimumCrewSize: number | null;
  RecommendedCrewSize: number | null;
  ServiceReportTemplateId: string | null;
  ReturnOrderLineItemId: string | null;
  ReturnOrderId: string | null;
};

type ParentReferences$WorkOrderLineItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  WorkOrder: SObjectDefinition$WorkOrder;
  ParentWorkOrderLineItem: SObjectDefinition$WorkOrderLineItem | null;
  Product2: SObjectDefinition$Product2 | null;
  Asset: SObjectDefinition$Asset | null;
  Order: SObjectDefinition$Order | null;
  RootWorkOrderLineItem: SObjectDefinition$WorkOrderLineItem | null;
  PricebookEntry: SObjectDefinition$PricebookEntry | null;
  WorkType: SObjectDefinition$WorkType | null;
  ServiceTerritory: SObjectDefinition$ServiceTerritory | null;
  Location: SObjectDefinition$Location | null;
  ServiceReportTemplate: SObjectDefinition$ServiceReportLayout | null;
  ReturnOrderLineItem: SObjectDefinition$ReturnOrderLineItem | null;
  ReturnOrder: SObjectDefinition$ReturnOrder | null;
};

type ChildRelationships$WorkOrderLineItem = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DigitalSignatures: SObjectDefinition$DigitalSignature;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductsConsumed: SObjectDefinition$ProductConsumed;
  ProductRequests: SObjectDefinition$ProductRequest;
  ProductRequestLineItems: SObjectDefinition$ProductRequestLineItem;
  ProductsRequired: SObjectDefinition$ProductRequired;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceAppointments: SObjectDefinition$ServiceAppointment;
  ServiceReports: SObjectDefinition$ServiceReport;
  SkillRequirements: SObjectDefinition$SkillRequirement;
  Tasks: SObjectDefinition$Task;
  TimeSheetEntries: SObjectDefinition$TimeSheetEntry;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  ChildWorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
  DescendantWorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
  Feeds: SObjectDefinition$WorkOrderLineItemFeed;
  Histories: SObjectDefinition$WorkOrderLineItemHistory;
};

interface SObjectDefinition$WorkOrderLineItem extends SObjectDefinition<'WorkOrderLineItem'> {
    Name: 'WorkOrderLineItem';
    Fields: Fields$WorkOrderLineItem;
    ParentReferences: ParentReferences$WorkOrderLineItem;
    ChildRelationships: ChildRelationships$WorkOrderLineItem;
  }

type Fields$WorkOrderLineItemFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$WorkOrderLineItemFeed = {
  //
  Parent: SObjectDefinition$WorkOrderLineItem;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$WorkOrderLineItemFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$WorkOrderLineItemFeed extends SObjectDefinition<'WorkOrderLineItemFeed'> {
    Name: 'WorkOrderLineItemFeed';
    Fields: Fields$WorkOrderLineItemFeed;
    ParentReferences: ParentReferences$WorkOrderLineItemFeed;
    ChildRelationships: ChildRelationships$WorkOrderLineItemFeed;
  }

type Fields$WorkOrderLineItemHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  WorkOrderLineItemId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$WorkOrderLineItemHistory = {
  //
  WorkOrderLineItem: SObjectDefinition$WorkOrderLineItem;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkOrderLineItemHistory = {
  //
};

interface SObjectDefinition$WorkOrderLineItemHistory extends SObjectDefinition<'WorkOrderLineItemHistory'> {
    Name: 'WorkOrderLineItemHistory';
    Fields: Fields$WorkOrderLineItemHistory;
    ParentReferences: ParentReferences$WorkOrderLineItemHistory;
    ChildRelationships: ChildRelationships$WorkOrderLineItemHistory;
  }

type Fields$WorkOrderLineItemStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  StatusCode: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$WorkOrderLineItemStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkOrderLineItemStatus = {
  //
};

interface SObjectDefinition$WorkOrderLineItemStatus extends SObjectDefinition<'WorkOrderLineItemStatus'> {
    Name: 'WorkOrderLineItemStatus';
    Fields: Fields$WorkOrderLineItemStatus;
    ParentReferences: ParentReferences$WorkOrderLineItemStatus;
    ChildRelationships: ChildRelationships$WorkOrderLineItemStatus;
  }

type Fields$WorkOrderShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$WorkOrderShare = {
  //
  Parent: SObjectDefinition$WorkOrder;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkOrderShare = {
  //
};

interface SObjectDefinition$WorkOrderShare extends SObjectDefinition<'WorkOrderShare'> {
    Name: 'WorkOrderShare';
    Fields: Fields$WorkOrderShare;
    ParentReferences: ParentReferences$WorkOrderShare;
    ChildRelationships: ChildRelationships$WorkOrderShare;
  }

type Fields$WorkOrderStatus = {
  //
  Id: string;
  MasterLabel: string | null;
  ApiName: string;
  SortOrder: number | null;
  IsDefault: boolean;
  StatusCode: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  LastModifiedById: string;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
};

type ParentReferences$WorkOrderStatus = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkOrderStatus = {
  //
};

interface SObjectDefinition$WorkOrderStatus extends SObjectDefinition<'WorkOrderStatus'> {
    Name: 'WorkOrderStatus';
    Fields: Fields$WorkOrderStatus;
    ParentReferences: ParentReferences$WorkOrderStatus;
    ChildRelationships: ChildRelationships$WorkOrderStatus;
  }

type Fields$WorkThanks = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  GiverId: string;
  Message: string;
  FeedItemId: string | null;
};

type ParentReferences$WorkThanks = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Giver: SObjectDefinition$User;
  FeedItem: SObjectDefinition$FeedItem | null;
};

type ChildRelationships$WorkThanks = {
  //
  Badges: SObjectDefinition$WorkBadge;
};

interface SObjectDefinition$WorkThanks extends SObjectDefinition<'WorkThanks'> {
    Name: 'WorkThanks';
    Fields: Fields$WorkThanks;
    ParentReferences: ParentReferences$WorkThanks;
    ChildRelationships: ChildRelationships$WorkThanks;
  }

type Fields$WorkThanksShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$WorkThanksShare = {
  //
  Parent: SObjectDefinition$WorkThanks;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkThanksShare = {
  //
};

interface SObjectDefinition$WorkThanksShare extends SObjectDefinition<'WorkThanksShare'> {
    Name: 'WorkThanksShare';
    Fields: Fields$WorkThanksShare;
    ParentReferences: ParentReferences$WorkThanksShare;
    ChildRelationships: ChildRelationships$WorkThanksShare;
  }

type Fields$WorkType = {
  //
  Id: string;
  OwnerId: string;
  IsDeleted: boolean;
  Name: string;
  CurrencyIsoCode: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  Description: string | null;
  EstimatedDuration: number;
  DurationType: string;
  DurationInMinutes: number | null;
  ShouldAutoCreateSvcAppt: boolean;
  ServiceReportTemplateId: string | null;
  MinimumCrewSize: number | null;
  RecommendedCrewSize: number | null;
};

type ParentReferences$WorkType = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceReportTemplate: SObjectDefinition$ServiceReportLayout | null;
};

type ChildRelationships$WorkType = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  MaintenanceAssets: SObjectDefinition$MaintenanceAsset;
  MaintenancePlans: SObjectDefinition$MaintenancePlan;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProductsRequired: SObjectDefinition$ProductRequired;
  RecordActions: SObjectDefinition$RecordAction;
  SkillRequirements: SObjectDefinition$SkillRequirement;
  WorkOrders: SObjectDefinition$WorkOrder;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
  Feeds: SObjectDefinition$WorkTypeFeed;
  Histories: SObjectDefinition$WorkTypeHistory;
};

interface SObjectDefinition$WorkType extends SObjectDefinition<'WorkType'> {
    Name: 'WorkType';
    Fields: Fields$WorkType;
    ParentReferences: ParentReferences$WorkType;
    ChildRelationships: ChildRelationships$WorkType;
  }

type Fields$WorkTypeFeed = {
  //
  Id: string;
  ParentId: string;
  Type: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  IsDeleted: boolean;
  LastModifiedDate: DateString;
  SystemModstamp: DateString;
  CommentCount: number;
  LikeCount: number;
  Title: string | null;
  Body: string | null;
  LinkUrl: string | null;
  IsRichText: boolean;
  RelatedRecordId: string | null;
  InsertedById: string | null;
};

type ParentReferences$WorkTypeFeed = {
  //
  Parent: SObjectDefinition$WorkType;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$WorkTypeFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$WorkTypeFeed extends SObjectDefinition<'WorkTypeFeed'> {
    Name: 'WorkTypeFeed';
    Fields: Fields$WorkTypeFeed;
    ParentReferences: ParentReferences$WorkTypeFeed;
    ChildRelationships: ChildRelationships$WorkTypeFeed;
  }

type Fields$WorkTypeHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  WorkTypeId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$WorkTypeHistory = {
  //
  WorkType: SObjectDefinition$WorkType;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkTypeHistory = {
  //
};

interface SObjectDefinition$WorkTypeHistory extends SObjectDefinition<'WorkTypeHistory'> {
    Name: 'WorkTypeHistory';
    Fields: Fields$WorkTypeHistory;
    ParentReferences: ParentReferences$WorkTypeHistory;
    ChildRelationships: ChildRelationships$WorkTypeHistory;
  }

type Fields$WorkTypeShare = {
  //
  Id: string;
  ParentId: string;
  UserOrGroupId: string;
  AccessLevel: string;
  RowCause: string | null;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
};

type ParentReferences$WorkTypeShare = {
  //
  Parent: SObjectDefinition$WorkType;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$WorkTypeShare = {
  //
};

interface SObjectDefinition$WorkTypeShare extends SObjectDefinition<'WorkTypeShare'> {
    Name: 'WorkTypeShare';
    Fields: Fields$WorkTypeShare;
    ParentReferences: ParentReferences$WorkTypeShare;
    ChildRelationships: ChildRelationships$WorkTypeShare;
  }


export interface MySchema extends Schema {
  SObjects: {
    AcceptedEventRelation: SObjectDefinition$AcceptedEventRelation;
    Account: SObjectDefinition$Account;
    AccountChangeEvent: SObjectDefinition$AccountChangeEvent;
    AccountCleanInfo: SObjectDefinition$AccountCleanInfo;
    AccountContactRole: SObjectDefinition$AccountContactRole;
    AccountContactRoleChangeEvent: SObjectDefinition$AccountContactRoleChangeEvent;
    AccountFeed: SObjectDefinition$AccountFeed;
    AccountHistory: SObjectDefinition$AccountHistory;
    AccountPartner: SObjectDefinition$AccountPartner;
    AccountShare: SObjectDefinition$AccountShare;
    ActionLinkGroupTemplate: SObjectDefinition$ActionLinkGroupTemplate;
    ActionLinkTemplate: SObjectDefinition$ActionLinkTemplate;
    ActivityHistory: SObjectDefinition$ActivityHistory;
    AdditionalNumber: SObjectDefinition$AdditionalNumber;
    Address: SObjectDefinition$Address;
    AggregateResult: SObjectDefinition$AggregateResult;
    Announcement: SObjectDefinition$Announcement;
    ApexClass: SObjectDefinition$ApexClass;
    ApexComponent: SObjectDefinition$ApexComponent;
    ApexEmailNotification: SObjectDefinition$ApexEmailNotification;
    ApexLog: SObjectDefinition$ApexLog;
    ApexPage: SObjectDefinition$ApexPage;
    ApexPageInfo: SObjectDefinition$ApexPageInfo;
    ApexTestQueueItem: SObjectDefinition$ApexTestQueueItem;
    ApexTestResult: SObjectDefinition$ApexTestResult;
    ApexTestResultLimits: SObjectDefinition$ApexTestResultLimits;
    ApexTestRunResult: SObjectDefinition$ApexTestRunResult;
    ApexTestSuite: SObjectDefinition$ApexTestSuite;
    ApexTrigger: SObjectDefinition$ApexTrigger;
    AppDefinition: SObjectDefinition$AppDefinition;
    AppExtension: SObjectDefinition$AppExtension;
    AppMenuItem: SObjectDefinition$AppMenuItem;
    AppTabMember: SObjectDefinition$AppTabMember;
    Asset: SObjectDefinition$Asset;
    AssetChangeEvent: SObjectDefinition$AssetChangeEvent;
    AssetFeed: SObjectDefinition$AssetFeed;
    AssetHistory: SObjectDefinition$AssetHistory;
    AssetRelationship: SObjectDefinition$AssetRelationship;
    AssetRelationshipFeed: SObjectDefinition$AssetRelationshipFeed;
    AssetRelationshipHistory: SObjectDefinition$AssetRelationshipHistory;
    AssetShare: SObjectDefinition$AssetShare;
    AssetTokenEvent: SObjectDefinition$AssetTokenEvent;
    AssignedResource: SObjectDefinition$AssignedResource;
    AssignedResourceFeed: SObjectDefinition$AssignedResourceFeed;
    AssignmentRule: SObjectDefinition$AssignmentRule;
    AssociatedLocation: SObjectDefinition$AssociatedLocation;
    AssociatedLocationHistory: SObjectDefinition$AssociatedLocationHistory;
    AsyncApexJob: SObjectDefinition$AsyncApexJob;
    AttachedContentDocument: SObjectDefinition$AttachedContentDocument;
    Attachment: SObjectDefinition$Attachment;
    AuraDefinition: SObjectDefinition$AuraDefinition;
    AuraDefinitionBundle: SObjectDefinition$AuraDefinitionBundle;
    AuraDefinitionBundleInfo: SObjectDefinition$AuraDefinitionBundleInfo;
    AuraDefinitionInfo: SObjectDefinition$AuraDefinitionInfo;
    AuthConfig: SObjectDefinition$AuthConfig;
    AuthConfigProviders: SObjectDefinition$AuthConfigProviders;
    AuthProvider: SObjectDefinition$AuthProvider;
    AuthSession: SObjectDefinition$AuthSession;
    BackgroundOperation: SObjectDefinition$BackgroundOperation;
    BigTable__ChangeEvent: SObjectDefinition$BigTable__ChangeEvent;
    BigTable__Share: SObjectDefinition$BigTable__Share;
    BigTable__c: SObjectDefinition$BigTable__c;
    BrandTemplate: SObjectDefinition$BrandTemplate;
    BrandingSet: SObjectDefinition$BrandingSet;
    BrandingSetProperty: SObjectDefinition$BrandingSetProperty;
    BudgetAndAchievement__ChangeEvent: SObjectDefinition$BudgetAndAchievement__ChangeEvent;
    BudgetAndAchievement__c: SObjectDefinition$BudgetAndAchievement__c;
    BusinessHours: SObjectDefinition$BusinessHours;
    BusinessProcess: SObjectDefinition$BusinessProcess;
    CallCenter: SObjectDefinition$CallCenter;
    Campaign: SObjectDefinition$Campaign;
    CampaignChangeEvent: SObjectDefinition$CampaignChangeEvent;
    CampaignFeed: SObjectDefinition$CampaignFeed;
    CampaignHistory: SObjectDefinition$CampaignHistory;
    CampaignMember: SObjectDefinition$CampaignMember;
    CampaignMemberStatus: SObjectDefinition$CampaignMemberStatus;
    CampaignShare: SObjectDefinition$CampaignShare;
    Case: SObjectDefinition$Case;
    CaseChangeEvent: SObjectDefinition$CaseChangeEvent;
    CaseComment: SObjectDefinition$CaseComment;
    CaseContactRole: SObjectDefinition$CaseContactRole;
    CaseFeed: SObjectDefinition$CaseFeed;
    CaseHistory: SObjectDefinition$CaseHistory;
    CaseShare: SObjectDefinition$CaseShare;
    CaseSolution: SObjectDefinition$CaseSolution;
    CaseStatus: SObjectDefinition$CaseStatus;
    CaseTeamMember: SObjectDefinition$CaseTeamMember;
    CaseTeamRole: SObjectDefinition$CaseTeamRole;
    CaseTeamTemplate: SObjectDefinition$CaseTeamTemplate;
    CaseTeamTemplateMember: SObjectDefinition$CaseTeamTemplateMember;
    CaseTeamTemplateRecord: SObjectDefinition$CaseTeamTemplateRecord;
    CategoryData: SObjectDefinition$CategoryData;
    CategoryNode: SObjectDefinition$CategoryNode;
    ChatterActivity: SObjectDefinition$ChatterActivity;
    ChatterExtension: SObjectDefinition$ChatterExtension;
    ChatterExtensionConfig: SObjectDefinition$ChatterExtensionConfig;
    ClientBrowser: SObjectDefinition$ClientBrowser;
    CollaborationGroup: SObjectDefinition$CollaborationGroup;
    CollaborationGroupFeed: SObjectDefinition$CollaborationGroupFeed;
    CollaborationGroupMember: SObjectDefinition$CollaborationGroupMember;
    CollaborationGroupMemberRequest: SObjectDefinition$CollaborationGroupMemberRequest;
    CollaborationGroupRecord: SObjectDefinition$CollaborationGroupRecord;
    CollaborationInvitation: SObjectDefinition$CollaborationInvitation;
    ColorDefinition: SObjectDefinition$ColorDefinition;
    CombinedAttachment: SObjectDefinition$CombinedAttachment;
    Community: SObjectDefinition$Community;
    ConferenceNumber: SObjectDefinition$ConferenceNumber;
    ConnectedApplication: SObjectDefinition$ConnectedApplication;
    Contact: SObjectDefinition$Contact;
    ContactChangeEvent: SObjectDefinition$ContactChangeEvent;
    ContactCleanInfo: SObjectDefinition$ContactCleanInfo;
    ContactFeed: SObjectDefinition$ContactFeed;
    ContactHistory: SObjectDefinition$ContactHistory;
    ContactRequest: SObjectDefinition$ContactRequest;
    ContactRequestShare: SObjectDefinition$ContactRequestShare;
    ContactShare: SObjectDefinition$ContactShare;
    ContentAsset: SObjectDefinition$ContentAsset;
    ContentBody: SObjectDefinition$ContentBody;
    ContentDistribution: SObjectDefinition$ContentDistribution;
    ContentDistributionView: SObjectDefinition$ContentDistributionView;
    ContentDocument: SObjectDefinition$ContentDocument;
    ContentDocumentFeed: SObjectDefinition$ContentDocumentFeed;
    ContentDocumentHistory: SObjectDefinition$ContentDocumentHistory;
    ContentDocumentLink: SObjectDefinition$ContentDocumentLink;
    ContentDocumentSubscription: SObjectDefinition$ContentDocumentSubscription;
    ContentFolder: SObjectDefinition$ContentFolder;
    ContentFolderItem: SObjectDefinition$ContentFolderItem;
    ContentFolderLink: SObjectDefinition$ContentFolderLink;
    ContentFolderMember: SObjectDefinition$ContentFolderMember;
    ContentNotification: SObjectDefinition$ContentNotification;
    ContentTagSubscription: SObjectDefinition$ContentTagSubscription;
    ContentUserSubscription: SObjectDefinition$ContentUserSubscription;
    ContentVersion: SObjectDefinition$ContentVersion;
    ContentVersionComment: SObjectDefinition$ContentVersionComment;
    ContentVersionHistory: SObjectDefinition$ContentVersionHistory;
    ContentVersionRating: SObjectDefinition$ContentVersionRating;
    ContentWorkspace: SObjectDefinition$ContentWorkspace;
    ContentWorkspaceDoc: SObjectDefinition$ContentWorkspaceDoc;
    ContentWorkspaceMember: SObjectDefinition$ContentWorkspaceMember;
    ContentWorkspacePermission: SObjectDefinition$ContentWorkspacePermission;
    ContentWorkspaceSubscription: SObjectDefinition$ContentWorkspaceSubscription;
    Contract: SObjectDefinition$Contract;
    ContractContactRole: SObjectDefinition$ContractContactRole;
    ContractFeed: SObjectDefinition$ContractFeed;
    ContractHistory: SObjectDefinition$ContractHistory;
    ContractStatus: SObjectDefinition$ContractStatus;
    CorsWhitelistEntry: SObjectDefinition$CorsWhitelistEntry;
    CronJobDetail: SObjectDefinition$CronJobDetail;
    CronTrigger: SObjectDefinition$CronTrigger;
    CspTrustedSite: SObjectDefinition$CspTrustedSite;
    CurrencyType: SObjectDefinition$CurrencyType;
    CustomBrand: SObjectDefinition$CustomBrand;
    CustomBrandAsset: SObjectDefinition$CustomBrandAsset;
    CustomHttpHeader: SObjectDefinition$CustomHttpHeader;
    CustomObjectUserLicenseMetrics: SObjectDefinition$CustomObjectUserLicenseMetrics;
    CustomPermission: SObjectDefinition$CustomPermission;
    CustomPermissionDependency: SObjectDefinition$CustomPermissionDependency;
    DailyManhourAssignment__ChangeEvent: SObjectDefinition$DailyManhourAssignment__ChangeEvent;
    DailyManhourAssignment__c: SObjectDefinition$DailyManhourAssignment__c;
    DandBCompany: SObjectDefinition$DandBCompany;
    Dashboard: SObjectDefinition$Dashboard;
    DashboardComponent: SObjectDefinition$DashboardComponent;
    DashboardComponentFeed: SObjectDefinition$DashboardComponentFeed;
    DashboardFeed: SObjectDefinition$DashboardFeed;
    DataAssessmentFieldMetric: SObjectDefinition$DataAssessmentFieldMetric;
    DataAssessmentMetric: SObjectDefinition$DataAssessmentMetric;
    DataAssessmentValueMetric: SObjectDefinition$DataAssessmentValueMetric;
    DataStatistics: SObjectDefinition$DataStatistics;
    DataType: SObjectDefinition$DataType;
    DatacloudAddress: SObjectDefinition$DatacloudAddress;
    DatacloudCompany: SObjectDefinition$DatacloudCompany;
    DatacloudContact: SObjectDefinition$DatacloudContact;
    DatacloudDandBCompany: SObjectDefinition$DatacloudDandBCompany;
    DatacloudOwnedEntity: SObjectDefinition$DatacloudOwnedEntity;
    DatacloudPurchaseUsage: SObjectDefinition$DatacloudPurchaseUsage;
    DatasetExport: SObjectDefinition$DatasetExport;
    DatasetExportEvent: SObjectDefinition$DatasetExportEvent;
    DatasetExportPart: SObjectDefinition$DatasetExportPart;
    DatedConversionRate: SObjectDefinition$DatedConversionRate;
    DeclinedEventRelation: SObjectDefinition$DeclinedEventRelation;
    DigitalSignature: SObjectDefinition$DigitalSignature;
    Document: SObjectDefinition$Document;
    DocumentAttachmentMap: SObjectDefinition$DocumentAttachmentMap;
    Domain: SObjectDefinition$Domain;
    DomainSite: SObjectDefinition$DomainSite;
    DuplicateRecordItem: SObjectDefinition$DuplicateRecordItem;
    DuplicateRecordSet: SObjectDefinition$DuplicateRecordSet;
    DuplicateRule: SObjectDefinition$DuplicateRule;
    EmailCapture: SObjectDefinition$EmailCapture;
    EmailDomainFilter: SObjectDefinition$EmailDomainFilter;
    EmailDomainKey: SObjectDefinition$EmailDomainKey;
    EmailMessage: SObjectDefinition$EmailMessage;
    EmailMessageRelation: SObjectDefinition$EmailMessageRelation;
    EmailRelay: SObjectDefinition$EmailRelay;
    EmailServicesAddress: SObjectDefinition$EmailServicesAddress;
    EmailServicesFunction: SObjectDefinition$EmailServicesFunction;
    EmailStatus: SObjectDefinition$EmailStatus;
    EmailTemplate: SObjectDefinition$EmailTemplate;
    EmbeddedServiceDetail: SObjectDefinition$EmbeddedServiceDetail;
    Employee__ChangeEvent: SObjectDefinition$Employee__ChangeEvent;
    Employee__Share: SObjectDefinition$Employee__Share;
    Employee__c: SObjectDefinition$Employee__c;
    EntityDefinition: SObjectDefinition$EntityDefinition;
    EntityParticle: SObjectDefinition$EntityParticle;
    EntitySubscription: SObjectDefinition$EntitySubscription;
    Event: SObjectDefinition$Event;
    EventBusSubscriber: SObjectDefinition$EventBusSubscriber;
    EventChangeEvent: SObjectDefinition$EventChangeEvent;
    EventFeed: SObjectDefinition$EventFeed;
    EventLogFile: SObjectDefinition$EventLogFile;
    EventRelation: SObjectDefinition$EventRelation;
    EventRelationChangeEvent: SObjectDefinition$EventRelationChangeEvent;
    Expense__ChangeEvent: SObjectDefinition$Expense__ChangeEvent;
    Expense__c: SObjectDefinition$Expense__c;
    ExternalDataSource: SObjectDefinition$ExternalDataSource;
    ExternalDataUserAuth: SObjectDefinition$ExternalDataUserAuth;
    ExternalEvent: SObjectDefinition$ExternalEvent;
    ExternalEventMapping: SObjectDefinition$ExternalEventMapping;
    ExternalEventMappingShare: SObjectDefinition$ExternalEventMappingShare;
    FeedAttachment: SObjectDefinition$FeedAttachment;
    FeedComment: SObjectDefinition$FeedComment;
    FeedItem: SObjectDefinition$FeedItem;
    FeedLike: SObjectDefinition$FeedLike;
    FeedPollChoice: SObjectDefinition$FeedPollChoice;
    FeedPollVote: SObjectDefinition$FeedPollVote;
    FeedRevision: SObjectDefinition$FeedRevision;
    FeedSignal: SObjectDefinition$FeedSignal;
    FeedTrackedChange: SObjectDefinition$FeedTrackedChange;
    FieldDefinition: SObjectDefinition$FieldDefinition;
    FieldPermissions: SObjectDefinition$FieldPermissions;
    FieldServiceMobileSettings: SObjectDefinition$FieldServiceMobileSettings;
    FileSearchActivity: SObjectDefinition$FileSearchActivity;
    FiscalYearSettings: SObjectDefinition$FiscalYearSettings;
    FlexQueueItem: SObjectDefinition$FlexQueueItem;
    FlowInterview: SObjectDefinition$FlowInterview;
    FlowInterviewShare: SObjectDefinition$FlowInterviewShare;
    FlowRecordRelation: SObjectDefinition$FlowRecordRelation;
    FlowStageRelation: SObjectDefinition$FlowStageRelation;
    Folder: SObjectDefinition$Folder;
    FolderedContentDocument: SObjectDefinition$FolderedContentDocument;
    ForecastShare: SObjectDefinition$ForecastShare;
    GrantedByLicense: SObjectDefinition$GrantedByLicense;
    Group: SObjectDefinition$Group;
    GroupMember: SObjectDefinition$GroupMember;
    Holiday: SObjectDefinition$Holiday;
    IconDefinition: SObjectDefinition$IconDefinition;
    Idea: SObjectDefinition$Idea;
    IdeaComment: SObjectDefinition$IdeaComment;
    IdpEventLog: SObjectDefinition$IdpEventLog;
    Individual: SObjectDefinition$Individual;
    IndividualHistory: SObjectDefinition$IndividualHistory;
    IndividualShare: SObjectDefinition$IndividualShare;
    InstalledMobileApp: SObjectDefinition$InstalledMobileApp;
    InvoiceItem__ChangeEvent: SObjectDefinition$InvoiceItem__ChangeEvent;
    InvoiceItem__c: SObjectDefinition$InvoiceItem__c;
    Invoice__ChangeEvent: SObjectDefinition$Invoice__ChangeEvent;
    Invoice__c: SObjectDefinition$Invoice__c;
    KnowledgeableUser: SObjectDefinition$KnowledgeableUser;
    Lead: SObjectDefinition$Lead;
    LeadChangeEvent: SObjectDefinition$LeadChangeEvent;
    LeadCleanInfo: SObjectDefinition$LeadCleanInfo;
    LeadFeed: SObjectDefinition$LeadFeed;
    LeadHistory: SObjectDefinition$LeadHistory;
    LeadShare: SObjectDefinition$LeadShare;
    LeadStatus: SObjectDefinition$LeadStatus;
    LightningExperienceTheme: SObjectDefinition$LightningExperienceTheme;
    ListEmail: SObjectDefinition$ListEmail;
    ListEmailChangeEvent: SObjectDefinition$ListEmailChangeEvent;
    ListEmailRecipientSource: SObjectDefinition$ListEmailRecipientSource;
    ListEmailShare: SObjectDefinition$ListEmailShare;
    ListView: SObjectDefinition$ListView;
    ListViewChart: SObjectDefinition$ListViewChart;
    ListViewChartInstance: SObjectDefinition$ListViewChartInstance;
    LocalGov__ChangeEvent: SObjectDefinition$LocalGov__ChangeEvent;
    LocalGov__Share: SObjectDefinition$LocalGov__Share;
    LocalGov__c: SObjectDefinition$LocalGov__c;
    Location: SObjectDefinition$Location;
    LocationFeed: SObjectDefinition$LocationFeed;
    LocationHistory: SObjectDefinition$LocationHistory;
    LocationShare: SObjectDefinition$LocationShare;
    LoginEvent: SObjectDefinition$LoginEvent;
    LoginGeo: SObjectDefinition$LoginGeo;
    LoginHistory: SObjectDefinition$LoginHistory;
    LoginIp: SObjectDefinition$LoginIp;
    LogoutEventStream: SObjectDefinition$LogoutEventStream;
    LookedUpFromActivity: SObjectDefinition$LookedUpFromActivity;
    Macro: SObjectDefinition$Macro;
    MacroHistory: SObjectDefinition$MacroHistory;
    MacroInstruction: SObjectDefinition$MacroInstruction;
    MacroShare: SObjectDefinition$MacroShare;
    MailmergeTemplate: SObjectDefinition$MailmergeTemplate;
    MaintenanceAsset: SObjectDefinition$MaintenanceAsset;
    MaintenanceAssetFeed: SObjectDefinition$MaintenanceAssetFeed;
    MaintenanceAssetHistory: SObjectDefinition$MaintenanceAssetHistory;
    MaintenancePlan: SObjectDefinition$MaintenancePlan;
    MaintenancePlanFeed: SObjectDefinition$MaintenancePlanFeed;
    MaintenancePlanHistory: SObjectDefinition$MaintenancePlanHistory;
    MaintenancePlanShare: SObjectDefinition$MaintenancePlanShare;
    MatchingInformation: SObjectDefinition$MatchingInformation;
    MatchingRule: SObjectDefinition$MatchingRule;
    MatchingRuleItem: SObjectDefinition$MatchingRuleItem;
    MobileApplicationDetail: SObjectDefinition$MobileApplicationDetail;
    MobileSettingsAssignment: SObjectDefinition$MobileSettingsAssignment;
    MsmxBook__ChangeEvent: SObjectDefinition$MsmxBook__ChangeEvent;
    MsmxBook__Share: SObjectDefinition$MsmxBook__Share;
    MsmxBook__c: SObjectDefinition$MsmxBook__c;
    MsmxFolder__ChangeEvent: SObjectDefinition$MsmxFolder__ChangeEvent;
    MsmxFolder__Share: SObjectDefinition$MsmxFolder__Share;
    MsmxFolder__c: SObjectDefinition$MsmxFolder__c;
    MsmxInstantData__ChangeEvent: SObjectDefinition$MsmxInstantData__ChangeEvent;
    MsmxInstantData__Share: SObjectDefinition$MsmxInstantData__Share;
    MsmxInstantData__c: SObjectDefinition$MsmxInstantData__c;
    MsmxSheet__ChangeEvent: SObjectDefinition$MsmxSheet__ChangeEvent;
    MsmxSheet__c: SObjectDefinition$MsmxSheet__c;
    MsmxViewset__ChangeEvent: SObjectDefinition$MsmxViewset__ChangeEvent;
    MsmxViewset__Share: SObjectDefinition$MsmxViewset__Share;
    MsmxViewset__c: SObjectDefinition$MsmxViewset__c;
    Name: SObjectDefinition$Name;
    NamedCredential: SObjectDefinition$NamedCredential;
    Note: SObjectDefinition$Note;
    NoteAndAttachment: SObjectDefinition$NoteAndAttachment;
    OauthToken: SObjectDefinition$OauthToken;
    ObjectPermissions: SObjectDefinition$ObjectPermissions;
    OpenActivity: SObjectDefinition$OpenActivity;
    OperatingHours: SObjectDefinition$OperatingHours;
    OperatingHoursFeed: SObjectDefinition$OperatingHoursFeed;
    Opportunity: SObjectDefinition$Opportunity;
    OpportunityChangeEvent: SObjectDefinition$OpportunityChangeEvent;
    OpportunityCompetitor: SObjectDefinition$OpportunityCompetitor;
    OpportunityContactRole: SObjectDefinition$OpportunityContactRole;
    OpportunityContactRoleChangeEvent: SObjectDefinition$OpportunityContactRoleChangeEvent;
    OpportunityFeed: SObjectDefinition$OpportunityFeed;
    OpportunityFieldHistory: SObjectDefinition$OpportunityFieldHistory;
    OpportunityHistory: SObjectDefinition$OpportunityHistory;
    OpportunityLineItem: SObjectDefinition$OpportunityLineItem;
    OpportunityPartner: SObjectDefinition$OpportunityPartner;
    OpportunityShare: SObjectDefinition$OpportunityShare;
    OpportunityStage: SObjectDefinition$OpportunityStage;
    Order: SObjectDefinition$Order;
    OrderChangeEvent: SObjectDefinition$OrderChangeEvent;
    OrderFeed: SObjectDefinition$OrderFeed;
    OrderHistory: SObjectDefinition$OrderHistory;
    OrderItem: SObjectDefinition$OrderItem;
    OrderItemChangeEvent: SObjectDefinition$OrderItemChangeEvent;
    OrderItemFeed: SObjectDefinition$OrderItemFeed;
    OrderItemHistory: SObjectDefinition$OrderItemHistory;
    OrderShare: SObjectDefinition$OrderShare;
    OrgLifecycleNotification: SObjectDefinition$OrgLifecycleNotification;
    OrgWideEmailAddress: SObjectDefinition$OrgWideEmailAddress;
    Organization: SObjectDefinition$Organization;
    OutgoingEmail: SObjectDefinition$OutgoingEmail;
    OutgoingEmailRelation: SObjectDefinition$OutgoingEmailRelation;
    OwnedContentDocument: SObjectDefinition$OwnedContentDocument;
    OwnerChangeOptionInfo: SObjectDefinition$OwnerChangeOptionInfo;
    PackageLicense: SObjectDefinition$PackageLicense;
    Partner: SObjectDefinition$Partner;
    PartnerRole: SObjectDefinition$PartnerRole;
    Payment__ChangeEvent: SObjectDefinition$Payment__ChangeEvent;
    Payment__c: SObjectDefinition$Payment__c;
    Period: SObjectDefinition$Period;
    PermissionSet: SObjectDefinition$PermissionSet;
    PermissionSetAssignment: SObjectDefinition$PermissionSetAssignment;
    PermissionSetGroup: SObjectDefinition$PermissionSetGroup;
    PermissionSetGroupComponent: SObjectDefinition$PermissionSetGroupComponent;
    PermissionSetLicense: SObjectDefinition$PermissionSetLicense;
    PermissionSetLicenseAssign: SObjectDefinition$PermissionSetLicenseAssign;
    PicklistValueInfo: SObjectDefinition$PicklistValueInfo;
    PlatformAction: SObjectDefinition$PlatformAction;
    PlatformCachePartition: SObjectDefinition$PlatformCachePartition;
    PlatformCachePartitionType: SObjectDefinition$PlatformCachePartitionType;
    Pricebook2: SObjectDefinition$Pricebook2;
    Pricebook2History: SObjectDefinition$Pricebook2History;
    PricebookEntry: SObjectDefinition$PricebookEntry;
    ProcessDefinition: SObjectDefinition$ProcessDefinition;
    ProcessInstance: SObjectDefinition$ProcessInstance;
    ProcessInstanceHistory: SObjectDefinition$ProcessInstanceHistory;
    ProcessInstanceNode: SObjectDefinition$ProcessInstanceNode;
    ProcessInstanceStep: SObjectDefinition$ProcessInstanceStep;
    ProcessInstanceWorkitem: SObjectDefinition$ProcessInstanceWorkitem;
    ProcessNode: SObjectDefinition$ProcessNode;
    Product2: SObjectDefinition$Product2;
    Product2ChangeEvent: SObjectDefinition$Product2ChangeEvent;
    Product2Feed: SObjectDefinition$Product2Feed;
    Product2History: SObjectDefinition$Product2History;
    ProductConsumed: SObjectDefinition$ProductConsumed;
    ProductConsumedFeed: SObjectDefinition$ProductConsumedFeed;
    ProductConsumedHistory: SObjectDefinition$ProductConsumedHistory;
    ProductItem: SObjectDefinition$ProductItem;
    ProductItemFeed: SObjectDefinition$ProductItemFeed;
    ProductItemHistory: SObjectDefinition$ProductItemHistory;
    ProductItemShare: SObjectDefinition$ProductItemShare;
    ProductItemTransaction: SObjectDefinition$ProductItemTransaction;
    ProductItemTransactionFeed: SObjectDefinition$ProductItemTransactionFeed;
    ProductItemTransactionHistory: SObjectDefinition$ProductItemTransactionHistory;
    ProductRequest: SObjectDefinition$ProductRequest;
    ProductRequestFeed: SObjectDefinition$ProductRequestFeed;
    ProductRequestHistory: SObjectDefinition$ProductRequestHistory;
    ProductRequestLineItem: SObjectDefinition$ProductRequestLineItem;
    ProductRequestLineItemFeed: SObjectDefinition$ProductRequestLineItemFeed;
    ProductRequestLineItemHistory: SObjectDefinition$ProductRequestLineItemHistory;
    ProductRequestShare: SObjectDefinition$ProductRequestShare;
    ProductRequired: SObjectDefinition$ProductRequired;
    ProductRequiredFeed: SObjectDefinition$ProductRequiredFeed;
    ProductRequiredHistory: SObjectDefinition$ProductRequiredHistory;
    ProductTransfer: SObjectDefinition$ProductTransfer;
    ProductTransferFeed: SObjectDefinition$ProductTransferFeed;
    ProductTransferHistory: SObjectDefinition$ProductTransferHistory;
    ProductTransferShare: SObjectDefinition$ProductTransferShare;
    Product__ChangeEvent: SObjectDefinition$Product__ChangeEvent;
    Product__c: SObjectDefinition$Product__c;
    Profile: SObjectDefinition$Profile;
    Project__ChangeEvent: SObjectDefinition$Project__ChangeEvent;
    Project__Share: SObjectDefinition$Project__Share;
    Project__c: SObjectDefinition$Project__c;
    Publisher: SObjectDefinition$Publisher;
    PushTopic: SObjectDefinition$PushTopic;
    QueueSobject: SObjectDefinition$QueueSobject;
    QuickText: SObjectDefinition$QuickText;
    QuickTextHistory: SObjectDefinition$QuickTextHistory;
    QuickTextShare: SObjectDefinition$QuickTextShare;
    QuoteTemplateRichTextData: SObjectDefinition$QuoteTemplateRichTextData;
    RecentlyViewed: SObjectDefinition$RecentlyViewed;
    RecordAction: SObjectDefinition$RecordAction;
    RecordType: SObjectDefinition$RecordType;
    RelationshipDomain: SObjectDefinition$RelationshipDomain;
    RelationshipInfo: SObjectDefinition$RelationshipInfo;
    Report: SObjectDefinition$Report;
    ReportFeed: SObjectDefinition$ReportFeed;
    ResourceAbsence: SObjectDefinition$ResourceAbsence;
    ResourceAbsenceFeed: SObjectDefinition$ResourceAbsenceFeed;
    ResourceAbsenceHistory: SObjectDefinition$ResourceAbsenceHistory;
    ResourceAssignment__ChangeEvent: SObjectDefinition$ResourceAssignment__ChangeEvent;
    ResourceAssignment__c: SObjectDefinition$ResourceAssignment__c;
    ResourcePreference: SObjectDefinition$ResourcePreference;
    ResourcePreferenceFeed: SObjectDefinition$ResourcePreferenceFeed;
    ResourcePreferenceHistory: SObjectDefinition$ResourcePreferenceHistory;
    ReturnOrder: SObjectDefinition$ReturnOrder;
    ReturnOrderFeed: SObjectDefinition$ReturnOrderFeed;
    ReturnOrderHistory: SObjectDefinition$ReturnOrderHistory;
    ReturnOrderLineItem: SObjectDefinition$ReturnOrderLineItem;
    ReturnOrderLineItemFeed: SObjectDefinition$ReturnOrderLineItemFeed;
    ReturnOrderLineItemHistory: SObjectDefinition$ReturnOrderLineItemHistory;
    ReturnOrderShare: SObjectDefinition$ReturnOrderShare;
    SamlSsoConfig: SObjectDefinition$SamlSsoConfig;
    Scontrol: SObjectDefinition$Scontrol;
    SearchLayout: SObjectDefinition$SearchLayout;
    SearchPromotionRule: SObjectDefinition$SearchPromotionRule;
    SecureAgent: SObjectDefinition$SecureAgent;
    SecureAgentPlugin: SObjectDefinition$SecureAgentPlugin;
    SecureAgentPluginProperty: SObjectDefinition$SecureAgentPluginProperty;
    SecureAgentsCluster: SObjectDefinition$SecureAgentsCluster;
    SecurityCustomBaseline: SObjectDefinition$SecurityCustomBaseline;
    ServiceAppointment: SObjectDefinition$ServiceAppointment;
    ServiceAppointmentFeed: SObjectDefinition$ServiceAppointmentFeed;
    ServiceAppointmentHistory: SObjectDefinition$ServiceAppointmentHistory;
    ServiceAppointmentShare: SObjectDefinition$ServiceAppointmentShare;
    ServiceAppointmentStatus: SObjectDefinition$ServiceAppointmentStatus;
    ServiceCrew: SObjectDefinition$ServiceCrew;
    ServiceCrewFeed: SObjectDefinition$ServiceCrewFeed;
    ServiceCrewHistory: SObjectDefinition$ServiceCrewHistory;
    ServiceCrewMember: SObjectDefinition$ServiceCrewMember;
    ServiceCrewMemberFeed: SObjectDefinition$ServiceCrewMemberFeed;
    ServiceCrewMemberHistory: SObjectDefinition$ServiceCrewMemberHistory;
    ServiceCrewShare: SObjectDefinition$ServiceCrewShare;
    ServiceReport: SObjectDefinition$ServiceReport;
    ServiceReportHistory: SObjectDefinition$ServiceReportHistory;
    ServiceReportLayout: SObjectDefinition$ServiceReportLayout;
    ServiceResource: SObjectDefinition$ServiceResource;
    ServiceResourceCapacity: SObjectDefinition$ServiceResourceCapacity;
    ServiceResourceCapacityFeed: SObjectDefinition$ServiceResourceCapacityFeed;
    ServiceResourceCapacityHistory: SObjectDefinition$ServiceResourceCapacityHistory;
    ServiceResourceFeed: SObjectDefinition$ServiceResourceFeed;
    ServiceResourceHistory: SObjectDefinition$ServiceResourceHistory;
    ServiceResourceShare: SObjectDefinition$ServiceResourceShare;
    ServiceResourceSkill: SObjectDefinition$ServiceResourceSkill;
    ServiceResourceSkillFeed: SObjectDefinition$ServiceResourceSkillFeed;
    ServiceResourceSkillHistory: SObjectDefinition$ServiceResourceSkillHistory;
    ServiceTerritory: SObjectDefinition$ServiceTerritory;
    ServiceTerritoryFeed: SObjectDefinition$ServiceTerritoryFeed;
    ServiceTerritoryHistory: SObjectDefinition$ServiceTerritoryHistory;
    ServiceTerritoryLocation: SObjectDefinition$ServiceTerritoryLocation;
    ServiceTerritoryLocationFeed: SObjectDefinition$ServiceTerritoryLocationFeed;
    ServiceTerritoryLocationHistory: SObjectDefinition$ServiceTerritoryLocationHistory;
    ServiceTerritoryMember: SObjectDefinition$ServiceTerritoryMember;
    ServiceTerritoryMemberFeed: SObjectDefinition$ServiceTerritoryMemberFeed;
    ServiceTerritoryMemberHistory: SObjectDefinition$ServiceTerritoryMemberHistory;
    ServiceTerritoryShare: SObjectDefinition$ServiceTerritoryShare;
    SessionPermSetActivation: SObjectDefinition$SessionPermSetActivation;
    SetupAuditTrail: SObjectDefinition$SetupAuditTrail;
    SetupEntityAccess: SObjectDefinition$SetupEntityAccess;
    Shipment: SObjectDefinition$Shipment;
    ShipmentFeed: SObjectDefinition$ShipmentFeed;
    ShipmentHistory: SObjectDefinition$ShipmentHistory;
    ShipmentShare: SObjectDefinition$ShipmentShare;
    Site: SObjectDefinition$Site;
    SiteDetail: SObjectDefinition$SiteDetail;
    SiteFeed: SObjectDefinition$SiteFeed;
    SiteHistory: SObjectDefinition$SiteHistory;
    Skill: SObjectDefinition$Skill;
    SkillRequirement: SObjectDefinition$SkillRequirement;
    SkillRequirementFeed: SObjectDefinition$SkillRequirementFeed;
    SkillRequirementHistory: SObjectDefinition$SkillRequirementHistory;
    Solution: SObjectDefinition$Solution;
    SolutionFeed: SObjectDefinition$SolutionFeed;
    SolutionHistory: SObjectDefinition$SolutionHistory;
    SolutionStatus: SObjectDefinition$SolutionStatus;
    SourceChangeNotification: SObjectDefinition$SourceChangeNotification;
    Stamp: SObjectDefinition$Stamp;
    StampAssignment: SObjectDefinition$StampAssignment;
    StaticResource: SObjectDefinition$StaticResource;
    StreamingChannel: SObjectDefinition$StreamingChannel;
    StreamingChannelShare: SObjectDefinition$StreamingChannelShare;
    TabDefinition: SObjectDefinition$TabDefinition;
    Task: SObjectDefinition$Task;
    TaskChangeEvent: SObjectDefinition$TaskChangeEvent;
    TaskFeed: SObjectDefinition$TaskFeed;
    TaskPriority: SObjectDefinition$TaskPriority;
    TaskStatus: SObjectDefinition$TaskStatus;
    TenantUsageEntitlement: SObjectDefinition$TenantUsageEntitlement;
    TestSuiteMembership: SObjectDefinition$TestSuiteMembership;
    ThirdPartyAccountLink: SObjectDefinition$ThirdPartyAccountLink;
    TimeSheet: SObjectDefinition$TimeSheet;
    TimeSheetEntry: SObjectDefinition$TimeSheetEntry;
    TimeSheetEntryFeed: SObjectDefinition$TimeSheetEntryFeed;
    TimeSheetEntryHistory: SObjectDefinition$TimeSheetEntryHistory;
    TimeSheetFeed: SObjectDefinition$TimeSheetFeed;
    TimeSheetHistory: SObjectDefinition$TimeSheetHistory;
    TimeSheetShare: SObjectDefinition$TimeSheetShare;
    TimeSlot: SObjectDefinition$TimeSlot;
    TodayGoal: SObjectDefinition$TodayGoal;
    TodayGoalShare: SObjectDefinition$TodayGoalShare;
    Topic: SObjectDefinition$Topic;
    TopicAssignment: SObjectDefinition$TopicAssignment;
    TopicFeed: SObjectDefinition$TopicFeed;
    TopicUserEvent: SObjectDefinition$TopicUserEvent;
    TransactionSecurityPolicy: SObjectDefinition$TransactionSecurityPolicy;
    UndecidedEventRelation: SObjectDefinition$UndecidedEventRelation;
    User: SObjectDefinition$User;
    UserAppInfo: SObjectDefinition$UserAppInfo;
    UserAppMenuCustomization: SObjectDefinition$UserAppMenuCustomization;
    UserAppMenuCustomizationShare: SObjectDefinition$UserAppMenuCustomizationShare;
    UserAppMenuItem: SObjectDefinition$UserAppMenuItem;
    UserChangeEvent: SObjectDefinition$UserChangeEvent;
    UserEntityAccess: SObjectDefinition$UserEntityAccess;
    UserFeed: SObjectDefinition$UserFeed;
    UserFieldAccess: SObjectDefinition$UserFieldAccess;
    UserLicense: SObjectDefinition$UserLicense;
    UserListView: SObjectDefinition$UserListView;
    UserListViewCriterion: SObjectDefinition$UserListViewCriterion;
    UserLogin: SObjectDefinition$UserLogin;
    UserPackageLicense: SObjectDefinition$UserPackageLicense;
    UserPermissionAccess: SObjectDefinition$UserPermissionAccess;
    UserPreference: SObjectDefinition$UserPreference;
    UserProvAccount: SObjectDefinition$UserProvAccount;
    UserProvAccountStaging: SObjectDefinition$UserProvAccountStaging;
    UserProvMockTarget: SObjectDefinition$UserProvMockTarget;
    UserProvisioningConfig: SObjectDefinition$UserProvisioningConfig;
    UserProvisioningLog: SObjectDefinition$UserProvisioningLog;
    UserProvisioningRequest: SObjectDefinition$UserProvisioningRequest;
    UserProvisioningRequestShare: SObjectDefinition$UserProvisioningRequestShare;
    UserRecordAccess: SObjectDefinition$UserRecordAccess;
    UserRole: SObjectDefinition$UserRole;
    UserShare: SObjectDefinition$UserShare;
    VerificationHistory: SObjectDefinition$VerificationHistory;
    VisualforceAccessMetrics: SObjectDefinition$VisualforceAccessMetrics;
    Vote: SObjectDefinition$Vote;
    WaveAutoInstallRequest: SObjectDefinition$WaveAutoInstallRequest;
    WaveCompatibilityCheckItem: SObjectDefinition$WaveCompatibilityCheckItem;
    WebLink: SObjectDefinition$WebLink;
    WorkAccess: SObjectDefinition$WorkAccess;
    WorkAccessShare: SObjectDefinition$WorkAccessShare;
    WorkBadge: SObjectDefinition$WorkBadge;
    WorkBadgeDefinition: SObjectDefinition$WorkBadgeDefinition;
    WorkBadgeDefinitionFeed: SObjectDefinition$WorkBadgeDefinitionFeed;
    WorkBadgeDefinitionHistory: SObjectDefinition$WorkBadgeDefinitionHistory;
    WorkBadgeDefinitionShare: SObjectDefinition$WorkBadgeDefinitionShare;
    WorkOrder: SObjectDefinition$WorkOrder;
    WorkOrderFeed: SObjectDefinition$WorkOrderFeed;
    WorkOrderHistory: SObjectDefinition$WorkOrderHistory;
    WorkOrderLineItem: SObjectDefinition$WorkOrderLineItem;
    WorkOrderLineItemFeed: SObjectDefinition$WorkOrderLineItemFeed;
    WorkOrderLineItemHistory: SObjectDefinition$WorkOrderLineItemHistory;
    WorkOrderLineItemStatus: SObjectDefinition$WorkOrderLineItemStatus;
    WorkOrderShare: SObjectDefinition$WorkOrderShare;
    WorkOrderStatus: SObjectDefinition$WorkOrderStatus;
    WorkThanks: SObjectDefinition$WorkThanks;
    WorkThanksShare: SObjectDefinition$WorkThanksShare;
    WorkType: SObjectDefinition$WorkType;
    WorkTypeFeed: SObjectDefinition$WorkTypeFeed;
    WorkTypeHistory: SObjectDefinition$WorkTypeHistory;
    WorkTypeShare: SObjectDefinition$WorkTypeShare;
  };
}
