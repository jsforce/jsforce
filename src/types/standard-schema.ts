import {
  Schema,
  SObjectDefinition,
  DateString,
  BlobString,
  Address,
} from './schema';

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

interface SObjectDefinition$AcceptedEventRelation
  extends SObjectDefinition<'AcceptedEventRelation'> {
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
  Website: string | null;
  PhotoUrl: string | null;
  Industry: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  Description: string | null;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastActivityDate: DateString | null;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  IsCustomerPortal: boolean;
  Jigsaw: string | null;
  JigsawCompanyId: string | null;
  AccountSource: string | null;
  SicDesc: string | null;
};

type ParentReferences$Account = {
  //
  MasterRecord: SObjectDefinition$Account | null;
  Parent: SObjectDefinition$Account | null;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Account = {
  //
  ChildAccounts: SObjectDefinition$Account;
  AccountBrands: SObjectDefinition$AccountBrand;
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
  Entitlements: SObjectDefinition$Entitlement;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
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
  RecordActions: SObjectDefinition$RecordAction;
  ServiceContracts: SObjectDefinition$ServiceContract;
  Personas: SObjectDefinition$SocialPersona;
  Posts: SObjectDefinition$SocialPost;
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

type Fields$AccountBrand = {
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
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  AccountId: string;
  CompanyName: string | null;
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
  Email: string | null;
  Phone: string | null;
  LogoId: string | null;
};

type ParentReferences$AccountBrand = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account;
  Logo: SObjectDefinition$ContentAsset | null;
};

type ChildRelationships$AccountBrand = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
};

interface SObjectDefinition$AccountBrand
  extends SObjectDefinition<'AccountBrand'> {
  Name: 'AccountBrand';
  Fields: Fields$AccountBrand;
  ParentReferences: ParentReferences$AccountBrand;
  ChildRelationships: ChildRelationships$AccountBrand;
}

type Fields$AccountBrandShare = {
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

type ParentReferences$AccountBrandShare = {
  //
  Parent: SObjectDefinition$AccountBrand;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$AccountBrandShare = {
  //
};

interface SObjectDefinition$AccountBrandShare
  extends SObjectDefinition<'AccountBrandShare'> {
  Name: 'AccountBrandShare';
  Fields: Fields$AccountBrandShare;
  ParentReferences: ParentReferences$AccountBrandShare;
  ChildRelationships: ChildRelationships$AccountBrandShare;
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
  Website: string | null;
  Industry: string | null;
  AnnualRevenue: number | null;
  NumberOfEmployees: number | null;
  Description: string | null;
  OwnerId: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  Jigsaw: string | null;
  JigsawCompanyId: string | null;
  AccountSource: string | null;
  SicDesc: string | null;
};

type ParentReferences$AccountChangeEvent = {
  //
};

type ChildRelationships$AccountChangeEvent = {
  //
};

interface SObjectDefinition$AccountChangeEvent
  extends SObjectDefinition<'AccountChangeEvent'> {
  Name: 'AccountChangeEvent';
  Fields: Fields$AccountChangeEvent;
  ParentReferences: ParentReferences$AccountChangeEvent;
  ChildRelationships: ChildRelationships$AccountChangeEvent;
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

interface SObjectDefinition$AccountContactRole
  extends SObjectDefinition<'AccountContactRole'> {
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

interface SObjectDefinition$AccountContactRoleChangeEvent
  extends SObjectDefinition<'AccountContactRoleChangeEvent'> {
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

interface SObjectDefinition$AccountFeed
  extends SObjectDefinition<'AccountFeed'> {
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

interface SObjectDefinition$AccountHistory
  extends SObjectDefinition<'AccountHistory'> {
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

interface SObjectDefinition$AccountPartner
  extends SObjectDefinition<'AccountPartner'> {
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

interface SObjectDefinition$AccountShare
  extends SObjectDefinition<'AccountShare'> {
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

interface SObjectDefinition$ActionLinkGroupTemplate
  extends SObjectDefinition<'ActionLinkGroupTemplate'> {
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

interface SObjectDefinition$ActionLinkTemplate
  extends SObjectDefinition<'ActionLinkTemplate'> {
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
  DurationInMinutes: number | null;
  Location: string | null;
  Description: string | null;
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

interface SObjectDefinition$ActivityHistory
  extends SObjectDefinition<'ActivityHistory'> {
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

interface SObjectDefinition$AdditionalNumber
  extends SObjectDefinition<'AdditionalNumber'> {
  Name: 'AdditionalNumber';
  Fields: Fields$AdditionalNumber;
  ParentReferences: ParentReferences$AdditionalNumber;
  ChildRelationships: ChildRelationships$AdditionalNumber;
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

interface SObjectDefinition$AggregateResult
  extends SObjectDefinition<'AggregateResult'> {
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

interface SObjectDefinition$Announcement
  extends SObjectDefinition<'Announcement'> {
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

interface SObjectDefinition$ApexComponent
  extends SObjectDefinition<'ApexComponent'> {
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

interface SObjectDefinition$ApexEmailNotification
  extends SObjectDefinition<'ApexEmailNotification'> {
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

interface SObjectDefinition$ApexPageInfo
  extends SObjectDefinition<'ApexPageInfo'> {
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

interface SObjectDefinition$ApexTestQueueItem
  extends SObjectDefinition<'ApexTestQueueItem'> {
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

interface SObjectDefinition$ApexTestResult
  extends SObjectDefinition<'ApexTestResult'> {
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

interface SObjectDefinition$ApexTestResultLimits
  extends SObjectDefinition<'ApexTestResultLimits'> {
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

interface SObjectDefinition$ApexTestRunResult
  extends SObjectDefinition<'ApexTestRunResult'> {
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

interface SObjectDefinition$ApexTestSuite
  extends SObjectDefinition<'ApexTestSuite'> {
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

interface SObjectDefinition$ApexTrigger
  extends SObjectDefinition<'ApexTrigger'> {
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

interface SObjectDefinition$AppDefinition
  extends SObjectDefinition<'AppDefinition'> {
  Name: 'AppDefinition';
  Fields: Fields$AppDefinition;
  ParentReferences: ParentReferences$AppDefinition;
  ChildRelationships: ChildRelationships$AppDefinition;
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

interface SObjectDefinition$AppMenuItem
  extends SObjectDefinition<'AppMenuItem'> {
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

interface SObjectDefinition$AppTabMember
  extends SObjectDefinition<'AppTabMember'> {
  Name: 'AppTabMember';
  Fields: Fields$AppTabMember;
  ParentReferences: ParentReferences$AppTabMember;
  ChildRelationships: ChildRelationships$AppTabMember;
}

type Fields$Approval = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  OwnerId: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  Status: string;
  RequestComment: string | null;
  ApproveComment: string | null;
  SystemModstamp: DateString;
};

type ParentReferences$Approval = {
  //
  Parent: SObjectDefinition$Contract;
  Owner: SObjectDefinition$User;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Approval = {
  //
};

interface SObjectDefinition$Approval extends SObjectDefinition<'Approval'> {
  Name: 'Approval';
  Fields: Fields$Approval;
  ParentReferences: ParentReferences$Approval;
  ChildRelationships: ChildRelationships$Approval;
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
  ContractLineItems: SObjectDefinition$ContractLineItem;
  Emails: SObjectDefinition$EmailMessage;
  Entitlements: SObjectDefinition$Entitlement;
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

interface SObjectDefinition$AssetChangeEvent
  extends SObjectDefinition<'AssetChangeEvent'> {
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

interface SObjectDefinition$AssetHistory
  extends SObjectDefinition<'AssetHistory'> {
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

interface SObjectDefinition$AssetRelationship
  extends SObjectDefinition<'AssetRelationship'> {
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

interface SObjectDefinition$AssetRelationshipFeed
  extends SObjectDefinition<'AssetRelationshipFeed'> {
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

interface SObjectDefinition$AssetRelationshipHistory
  extends SObjectDefinition<'AssetRelationshipHistory'> {
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

interface SObjectDefinition$AssetTokenEvent
  extends SObjectDefinition<'AssetTokenEvent'> {
  Name: 'AssetTokenEvent';
  Fields: Fields$AssetTokenEvent;
  ParentReferences: ParentReferences$AssetTokenEvent;
  ChildRelationships: ChildRelationships$AssetTokenEvent;
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

interface SObjectDefinition$AssignmentRule
  extends SObjectDefinition<'AssignmentRule'> {
  Name: 'AssignmentRule';
  Fields: Fields$AssignmentRule;
  ParentReferences: ParentReferences$AssignmentRule;
  ChildRelationships: ChildRelationships$AssignmentRule;
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

interface SObjectDefinition$AsyncApexJob
  extends SObjectDefinition<'AsyncApexJob'> {
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

interface SObjectDefinition$AttachedContentDocument
  extends SObjectDefinition<'AttachedContentDocument'> {
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

interface SObjectDefinition$AuraDefinition
  extends SObjectDefinition<'AuraDefinition'> {
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

interface SObjectDefinition$AuraDefinitionBundle
  extends SObjectDefinition<'AuraDefinitionBundle'> {
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

interface SObjectDefinition$AuraDefinitionBundleInfo
  extends SObjectDefinition<'AuraDefinitionBundleInfo'> {
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

interface SObjectDefinition$AuraDefinitionInfo
  extends SObjectDefinition<'AuraDefinitionInfo'> {
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

interface SObjectDefinition$AuthConfigProviders
  extends SObjectDefinition<'AuthConfigProviders'> {
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

interface SObjectDefinition$AuthProvider
  extends SObjectDefinition<'AuthProvider'> {
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

interface SObjectDefinition$AuthSession
  extends SObjectDefinition<'AuthSession'> {
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

interface SObjectDefinition$BackgroundOperation
  extends SObjectDefinition<'BackgroundOperation'> {
  Name: 'BackgroundOperation';
  Fields: Fields$BackgroundOperation;
  ParentReferences: ParentReferences$BackgroundOperation;
  ChildRelationships: ChildRelationships$BackgroundOperation;
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

interface SObjectDefinition$BrandTemplate
  extends SObjectDefinition<'BrandTemplate'> {
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

interface SObjectDefinition$BrandingSet
  extends SObjectDefinition<'BrandingSet'> {
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

interface SObjectDefinition$BrandingSetProperty
  extends SObjectDefinition<'BrandingSetProperty'> {
  Name: 'BrandingSetProperty';
  Fields: Fields$BrandingSetProperty;
  ParentReferences: ParentReferences$BrandingSetProperty;
  ChildRelationships: ChildRelationships$BrandingSetProperty;
}

type Fields$BusinessHours = {
  //
  Id: string;
  Name: string;
  IsActive: boolean;
  IsDefault: boolean;
  SundayStartTime: string | null;
  SundayEndTime: string | null;
  MondayStartTime: string | null;
  MondayEndTime: string | null;
  TuesdayStartTime: string | null;
  TuesdayEndTime: string | null;
  WednesdayStartTime: string | null;
  WednesdayEndTime: string | null;
  ThursdayStartTime: string | null;
  ThursdayEndTime: string | null;
  FridayStartTime: string | null;
  FridayEndTime: string | null;
  SaturdayStartTime: string | null;
  SaturdayEndTime: string | null;
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
  Cases: SObjectDefinition$Case;
  Entitlements: SObjectDefinition$Entitlement;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$BusinessHours
  extends SObjectDefinition<'BusinessHours'> {
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

interface SObjectDefinition$BusinessProcess
  extends SObjectDefinition<'BusinessProcess'> {
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

interface SObjectDefinition$CampaignChangeEvent
  extends SObjectDefinition<'CampaignChangeEvent'> {
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

interface SObjectDefinition$CampaignFeed
  extends SObjectDefinition<'CampaignFeed'> {
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

interface SObjectDefinition$CampaignHistory
  extends SObjectDefinition<'CampaignHistory'> {
  Name: 'CampaignHistory';
  Fields: Fields$CampaignHistory;
  ParentReferences: ParentReferences$CampaignHistory;
  ChildRelationships: ChildRelationships$CampaignHistory;
}

type Fields$CampaignInfluenceModel = {
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
  ModelType: string | null;
  ModelDescription: string | null;
  IsDefaultModel: boolean;
  IsModelLocked: boolean;
  IsActive: boolean;
  RecordPreference: string;
};

type ParentReferences$CampaignInfluenceModel = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CampaignInfluenceModel = {
  //
};

interface SObjectDefinition$CampaignInfluenceModel
  extends SObjectDefinition<'CampaignInfluenceModel'> {
  Name: 'CampaignInfluenceModel';
  Fields: Fields$CampaignInfluenceModel;
  ParentReferences: ParentReferences$CampaignInfluenceModel;
  ChildRelationships: ChildRelationships$CampaignInfluenceModel;
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

interface SObjectDefinition$CampaignMember
  extends SObjectDefinition<'CampaignMember'> {
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

interface SObjectDefinition$CampaignMemberStatus
  extends SObjectDefinition<'CampaignMemberStatus'> {
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

interface SObjectDefinition$CampaignShare
  extends SObjectDefinition<'CampaignShare'> {
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
  ProductId: string | null;
  EntitlementId: string | null;
  SourceId: string | null;
  BusinessHoursId: string;
  ParentId: string | null;
  SuppliedName: string | null;
  SuppliedEmail: string | null;
  SuppliedPhone: string | null;
  SuppliedCompany: string | null;
  Type: string | null;
  Status: string | null;
  Reason: string | null;
  Origin: string | null;
  IsVisibleInSelfService: boolean;
  Subject: string | null;
  Priority: string | null;
  Description: string | null;
  IsClosed: boolean;
  ClosedDate: DateString | null;
  IsEscalated: boolean;
  HasCommentsUnreadByOwner: boolean;
  HasSelfServiceComments: boolean;
  OwnerId: string;
  IsClosedOnCreate: boolean;
  IsSelfServiceClosed: boolean;
  SlaStartDate: DateString | null;
  SlaExitDate: DateString | null;
  IsStopped: boolean;
  StopStartDate: DateString | null;
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
  MilestoneStatus: string | null;
};

type ParentReferences$Case = {
  //
  Contact: SObjectDefinition$Contact | null;
  Account: SObjectDefinition$Account | null;
  Asset: SObjectDefinition$Asset | null;
  Product: SObjectDefinition$Product2 | null;
  Entitlement: SObjectDefinition$Entitlement | null;
  Source: SObjectDefinition$Name | null;
  BusinessHours: SObjectDefinition$BusinessHours;
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
  CaseArticles: SObjectDefinition$CaseArticle;
  CaseComments: SObjectDefinition$CaseComment;
  CaseContactRoles: SObjectDefinition$CaseContactRole;
  CaseExternalDocuments: SObjectDefinition$CaseExternalDocument;
  Feeds: SObjectDefinition$CaseFeed;
  Histories: SObjectDefinition$CaseHistory;
  CaseMilestones: SObjectDefinition$CaseMilestone;
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
  RecordActions: SObjectDefinition$RecordAction;
  Posts: SObjectDefinition$SocialPost;
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

type Fields$CaseArticle = {
  //
  Id: string;
  CaseId: string;
  KnowledgeArticleId: string;
  KnowledgeArticleVersionId: string | null;
  CreatedById: string;
  CreatedDate: DateString;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  ArticleLanguage: string | null;
  ArticleVersionNumber: number | null;
  IsSharedByEmail: boolean;
};

type ParentReferences$CaseArticle = {
  //
  Case: SObjectDefinition$Case;
  KnowledgeArticle: SObjectDefinition$Knowledge__ka;
  KnowledgeArticleVersion: SObjectDefinition$Knowledge__kav | null;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseArticle = {
  //
};

interface SObjectDefinition$CaseArticle
  extends SObjectDefinition<'CaseArticle'> {
  Name: 'CaseArticle';
  Fields: Fields$CaseArticle;
  ParentReferences: ParentReferences$CaseArticle;
  ChildRelationships: ChildRelationships$CaseArticle;
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
  ProductId: string | null;
  EntitlementId: string | null;
  SourceId: string | null;
  BusinessHoursId: string | null;
  ParentId: string | null;
  SuppliedName: string | null;
  SuppliedEmail: string | null;
  SuppliedPhone: string | null;
  SuppliedCompany: string | null;
  Type: string | null;
  Status: string | null;
  Reason: string | null;
  Origin: string | null;
  IsVisibleInSelfService: boolean;
  Subject: string | null;
  Priority: string | null;
  Description: string | null;
  IsClosed: boolean;
  ClosedDate: DateString | null;
  IsEscalated: boolean;
  HasCommentsUnreadByOwner: boolean;
  HasSelfServiceComments: boolean;
  OwnerId: string | null;
  IsClosedOnCreate: boolean;
  IsSelfServiceClosed: boolean;
  SlaStartDate: DateString | null;
  SlaExitDate: DateString | null;
  IsStopped: boolean;
  StopStartDate: DateString | null;
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

interface SObjectDefinition$CaseChangeEvent
  extends SObjectDefinition<'CaseChangeEvent'> {
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

interface SObjectDefinition$CaseComment
  extends SObjectDefinition<'CaseComment'> {
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

interface SObjectDefinition$CaseContactRole
  extends SObjectDefinition<'CaseContactRole'> {
  Name: 'CaseContactRole';
  Fields: Fields$CaseContactRole;
  ParentReferences: ParentReferences$CaseContactRole;
  ChildRelationships: ChildRelationships$CaseContactRole;
}

type Fields$CaseExternalDocument = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  CaseId: string;
  ExternalId: string | null;
  Title: string | null;
  DisplayUrl: string | null;
  ExternalDocumentUid: string | null;
};

type ParentReferences$CaseExternalDocument = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Case: SObjectDefinition$Case;
};

type ChildRelationships$CaseExternalDocument = {
  //
};

interface SObjectDefinition$CaseExternalDocument
  extends SObjectDefinition<'CaseExternalDocument'> {
  Name: 'CaseExternalDocument';
  Fields: Fields$CaseExternalDocument;
  ParentReferences: ParentReferences$CaseExternalDocument;
  ChildRelationships: ChildRelationships$CaseExternalDocument;
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

interface SObjectDefinition$CaseHistory
  extends SObjectDefinition<'CaseHistory'> {
  Name: 'CaseHistory';
  Fields: Fields$CaseHistory;
  ParentReferences: ParentReferences$CaseHistory;
  ChildRelationships: ChildRelationships$CaseHistory;
}

type Fields$CaseMilestone = {
  //
  Id: string;
  CaseId: string;
  StartDate: DateString | null;
  TargetDate: DateString;
  CompletionDate: DateString | null;
  MilestoneTypeId: string | null;
  IsCompleted: boolean;
  IsViolated: boolean;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  IsDeleted: boolean;
  TargetResponseInMins: number | null;
  TargetResponseInHrs: number | null;
  TargetResponseInDays: number | null;
  TimeRemainingInMins: string | null;
  ElapsedTimeInMins: number | null;
  ElapsedTimeInHrs: number | null;
  ElapsedTimeInDays: number | null;
  TimeSinceTargetInMins: string | null;
  BusinessHoursId: string | null;
  StoppedTimeInMins: number | null;
  StoppedTimeInHrs: number | null;
  StoppedTimeInDays: number | null;
  ActualElapsedTimeInMins: number | null;
  ActualElapsedTimeInHrs: number | null;
  ActualElapsedTimeInDays: number | null;
};

type ParentReferences$CaseMilestone = {
  //
  Case: SObjectDefinition$Case;
  MilestoneType: SObjectDefinition$MilestoneType | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  BusinessHours: SObjectDefinition$BusinessHours | null;
};

type ChildRelationships$CaseMilestone = {
  //
};

interface SObjectDefinition$CaseMilestone
  extends SObjectDefinition<'CaseMilestone'> {
  Name: 'CaseMilestone';
  Fields: Fields$CaseMilestone;
  ParentReferences: ParentReferences$CaseMilestone;
  ChildRelationships: ChildRelationships$CaseMilestone;
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

interface SObjectDefinition$CaseSolution
  extends SObjectDefinition<'CaseSolution'> {
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

type Fields$CaseSubjectParticle = {
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
  Index: number;
  Type: string;
  TextField: string | null;
};

type ParentReferences$CaseSubjectParticle = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$CaseSubjectParticle = {
  //
};

interface SObjectDefinition$CaseSubjectParticle
  extends SObjectDefinition<'CaseSubjectParticle'> {
  Name: 'CaseSubjectParticle';
  Fields: Fields$CaseSubjectParticle;
  ParentReferences: ParentReferences$CaseSubjectParticle;
  ChildRelationships: ChildRelationships$CaseSubjectParticle;
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

interface SObjectDefinition$CaseTeamMember
  extends SObjectDefinition<'CaseTeamMember'> {
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

interface SObjectDefinition$CaseTeamRole
  extends SObjectDefinition<'CaseTeamRole'> {
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

interface SObjectDefinition$CaseTeamTemplate
  extends SObjectDefinition<'CaseTeamTemplate'> {
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

interface SObjectDefinition$CaseTeamTemplateMember
  extends SObjectDefinition<'CaseTeamTemplateMember'> {
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

interface SObjectDefinition$CaseTeamTemplateRecord
  extends SObjectDefinition<'CaseTeamTemplateRecord'> {
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

interface SObjectDefinition$CategoryData
  extends SObjectDefinition<'CategoryData'> {
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

interface SObjectDefinition$CategoryNode
  extends SObjectDefinition<'CategoryNode'> {
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

interface SObjectDefinition$ChatterActivity
  extends SObjectDefinition<'ChatterActivity'> {
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

interface SObjectDefinition$ChatterExtension
  extends SObjectDefinition<'ChatterExtension'> {
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

interface SObjectDefinition$ChatterExtensionConfig
  extends SObjectDefinition<'ChatterExtensionConfig'> {
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

interface SObjectDefinition$ClientBrowser
  extends SObjectDefinition<'ClientBrowser'> {
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
};

interface SObjectDefinition$CollaborationGroup
  extends SObjectDefinition<'CollaborationGroup'> {
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

interface SObjectDefinition$CollaborationGroupFeed
  extends SObjectDefinition<'CollaborationGroupFeed'> {
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

interface SObjectDefinition$CollaborationGroupMember
  extends SObjectDefinition<'CollaborationGroupMember'> {
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

interface SObjectDefinition$CollaborationGroupMemberRequest
  extends SObjectDefinition<'CollaborationGroupMemberRequest'> {
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

interface SObjectDefinition$CollaborationGroupRecord
  extends SObjectDefinition<'CollaborationGroupRecord'> {
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

interface SObjectDefinition$CollaborationInvitation
  extends SObjectDefinition<'CollaborationInvitation'> {
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

interface SObjectDefinition$ColorDefinition
  extends SObjectDefinition<'ColorDefinition'> {
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

interface SObjectDefinition$CombinedAttachment
  extends SObjectDefinition<'CombinedAttachment'> {
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

interface SObjectDefinition$ConnectedApplication
  extends SObjectDefinition<'ConnectedApplication'> {
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
  OwnerId: string;
  HasOptedOutOfEmail: boolean;
  HasOptedOutOfFax: boolean;
  DoNotCall: boolean;
  CanAllowPortalSelfReg: boolean;
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
  EntitlementContacts: SObjectDefinition$EntitlementContact;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  EventRelations: SObjectDefinition$EventRelation;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  OpportunityContactRoles: SObjectDefinition$OpportunityContactRole;
  OutgoingEmailRelations: SObjectDefinition$OutgoingEmailRelation;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceContracts: SObjectDefinition$ServiceContract;
  Personas: SObjectDefinition$SocialPersona;
  Posts: SObjectDefinition$SocialPost;
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
  OwnerId: string | null;
  HasOptedOutOfEmail: boolean;
  HasOptedOutOfFax: boolean;
  DoNotCall: boolean;
  CanAllowPortalSelfReg: boolean;
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
  IndividualId: string | null;
};

type ParentReferences$ContactChangeEvent = {
  //
};

type ChildRelationships$ContactChangeEvent = {
  //
};

interface SObjectDefinition$ContactChangeEvent
  extends SObjectDefinition<'ContactChangeEvent'> {
  Name: 'ContactChangeEvent';
  Fields: Fields$ContactChangeEvent;
  ParentReferences: ParentReferences$ContactChangeEvent;
  ChildRelationships: ChildRelationships$ContactChangeEvent;
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

interface SObjectDefinition$ContactFeed
  extends SObjectDefinition<'ContactFeed'> {
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

interface SObjectDefinition$ContactHistory
  extends SObjectDefinition<'ContactHistory'> {
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

interface SObjectDefinition$ContactRequest
  extends SObjectDefinition<'ContactRequest'> {
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

interface SObjectDefinition$ContactRequestShare
  extends SObjectDefinition<'ContactRequestShare'> {
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

interface SObjectDefinition$ContactShare
  extends SObjectDefinition<'ContactShare'> {
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

interface SObjectDefinition$ContentAsset
  extends SObjectDefinition<'ContentAsset'> {
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

interface SObjectDefinition$ContentBody
  extends SObjectDefinition<'ContentBody'> {
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

interface SObjectDefinition$ContentDistribution
  extends SObjectDefinition<'ContentDistribution'> {
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

interface SObjectDefinition$ContentDistributionView
  extends SObjectDefinition<'ContentDistributionView'> {
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

interface SObjectDefinition$ContentDocument
  extends SObjectDefinition<'ContentDocument'> {
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

interface SObjectDefinition$ContentDocumentFeed
  extends SObjectDefinition<'ContentDocumentFeed'> {
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

interface SObjectDefinition$ContentDocumentHistory
  extends SObjectDefinition<'ContentDocumentHistory'> {
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

interface SObjectDefinition$ContentDocumentLink
  extends SObjectDefinition<'ContentDocumentLink'> {
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

interface SObjectDefinition$ContentDocumentSubscription
  extends SObjectDefinition<'ContentDocumentSubscription'> {
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

interface SObjectDefinition$ContentFolder
  extends SObjectDefinition<'ContentFolder'> {
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

interface SObjectDefinition$ContentFolderItem
  extends SObjectDefinition<'ContentFolderItem'> {
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

interface SObjectDefinition$ContentFolderLink
  extends SObjectDefinition<'ContentFolderLink'> {
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

interface SObjectDefinition$ContentFolderMember
  extends SObjectDefinition<'ContentFolderMember'> {
  Name: 'ContentFolderMember';
  Fields: Fields$ContentFolderMember;
  ParentReferences: ParentReferences$ContentFolderMember;
  ChildRelationships: ChildRelationships$ContentFolderMember;
}

type Fields$ContentHubItem = {
  //
  Id: string;
  ExternalId: string | null;
  ContentHubRepositoryId: string | null;
  ParentId: string | null;
  Owner: string | null;
  Description: string | null;
  ContentSize: number | null;
  CreatedDate: DateString | null;
  ExternalDocumentUrl: string | null;
  ExternalContentUrl: string | null;
  IsFolder: boolean;
  FileType: string | null;
  MimeType: string | null;
  Title: string | null;
  LastModifiedDate: DateString | null;
  ContentModifiedDate: DateString | null;
  UpdatedBy: string | null;
  Name: string | null;
  FileExtension: string | null;
};

type ParentReferences$ContentHubItem = {
  //
  ContentHubRepository: SObjectDefinition$ContentHubRepository | null;
};

type ChildRelationships$ContentHubItem = {
  //
};

interface SObjectDefinition$ContentHubItem
  extends SObjectDefinition<'ContentHubItem'> {
  Name: 'ContentHubItem';
  Fields: Fields$ContentHubItem;
  ParentReferences: ParentReferences$ContentHubItem;
  ChildRelationships: ChildRelationships$ContentHubItem;
}

type Fields$ContentHubRepository = {
  //
  Id: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  DeveloperName: string;
  MasterLabel: string | null;
  Type: string | null;
};

type ParentReferences$ContentHubRepository = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ContentHubRepository = {
  //
};

interface SObjectDefinition$ContentHubRepository
  extends SObjectDefinition<'ContentHubRepository'> {
  Name: 'ContentHubRepository';
  Fields: Fields$ContentHubRepository;
  ParentReferences: ParentReferences$ContentHubRepository;
  ChildRelationships: ChildRelationships$ContentHubRepository;
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

interface SObjectDefinition$ContentNotification
  extends SObjectDefinition<'ContentNotification'> {
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

interface SObjectDefinition$ContentTagSubscription
  extends SObjectDefinition<'ContentTagSubscription'> {
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

interface SObjectDefinition$ContentUserSubscription
  extends SObjectDefinition<'ContentUserSubscription'> {
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

interface SObjectDefinition$ContentVersion
  extends SObjectDefinition<'ContentVersion'> {
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

interface SObjectDefinition$ContentVersionComment
  extends SObjectDefinition<'ContentVersionComment'> {
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

interface SObjectDefinition$ContentVersionHistory
  extends SObjectDefinition<'ContentVersionHistory'> {
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

interface SObjectDefinition$ContentVersionRating
  extends SObjectDefinition<'ContentVersionRating'> {
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

interface SObjectDefinition$ContentWorkspace
  extends SObjectDefinition<'ContentWorkspace'> {
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

interface SObjectDefinition$ContentWorkspaceDoc
  extends SObjectDefinition<'ContentWorkspaceDoc'> {
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

interface SObjectDefinition$ContentWorkspaceMember
  extends SObjectDefinition<'ContentWorkspaceMember'> {
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

interface SObjectDefinition$ContentWorkspacePermission
  extends SObjectDefinition<'ContentWorkspacePermission'> {
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

interface SObjectDefinition$ContentWorkspaceSubscription
  extends SObjectDefinition<'ContentWorkspaceSubscription'> {
  Name: 'ContentWorkspaceSubscription';
  Fields: Fields$ContentWorkspaceSubscription;
  ParentReferences: ParentReferences$ContentWorkspaceSubscription;
  ChildRelationships: ChildRelationships$ContentWorkspaceSubscription;
}

type Fields$Contract = {
  //
  Id: string;
  AccountId: string;
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
  ShippingStreet: string | null;
  ShippingCity: string | null;
  ShippingState: string | null;
  ShippingPostalCode: string | null;
  ShippingCountry: string | null;
  ShippingLatitude: number | null;
  ShippingLongitude: number | null;
  ShippingGeocodeAccuracy: string | null;
  ShippingAddress: Address | null;
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
  Approvals: SObjectDefinition$Approval;
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

interface SObjectDefinition$ContractContactRole
  extends SObjectDefinition<'ContractContactRole'> {
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

interface SObjectDefinition$ContractFeed
  extends SObjectDefinition<'ContractFeed'> {
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

interface SObjectDefinition$ContractHistory
  extends SObjectDefinition<'ContractHistory'> {
  Name: 'ContractHistory';
  Fields: Fields$ContractHistory;
  ParentReferences: ParentReferences$ContractHistory;
  ChildRelationships: ChildRelationships$ContractHistory;
}

type Fields$ContractLineItem = {
  //
  Id: string;
  IsDeleted: boolean;
  LineItemNumber: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ServiceContractId: string;
  Product2Id: string | null;
  AssetId: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  Description: string | null;
  PricebookEntryId: string;
  Quantity: number;
  UnitPrice: number;
  Discount: number | null;
  ListPrice: number | null;
  Subtotal: number | null;
  TotalPrice: number | null;
  Status: string | null;
  ParentContractLineItemId: string | null;
  RootContractLineItemId: string | null;
};

type ParentReferences$ContractLineItem = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ServiceContract: SObjectDefinition$ServiceContract;
  Product2: SObjectDefinition$Product2 | null;
  Asset: SObjectDefinition$Asset | null;
  PricebookEntry: SObjectDefinition$PricebookEntry;
  ParentContractLineItem: SObjectDefinition$ContractLineItem | null;
  RootContractLineItem: SObjectDefinition$ContractLineItem | null;
};

type ChildRelationships$ContractLineItem = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ChildContractLineItems: SObjectDefinition$ContractLineItem;
  DescendantContractLineItems: SObjectDefinition$ContractLineItem;
  Histories: SObjectDefinition$ContractLineItemHistory;
  Emails: SObjectDefinition$EmailMessage;
  Entitlements: SObjectDefinition$Entitlement;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
};

interface SObjectDefinition$ContractLineItem
  extends SObjectDefinition<'ContractLineItem'> {
  Name: 'ContractLineItem';
  Fields: Fields$ContractLineItem;
  ParentReferences: ParentReferences$ContractLineItem;
  ChildRelationships: ChildRelationships$ContractLineItem;
}

type Fields$ContractLineItemChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  LineItemNumber: string;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  ServiceContractId: string | null;
  AssetId: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  Description: string | null;
  PricebookEntryId: string | null;
  Quantity: number | null;
  UnitPrice: number | null;
  Discount: number | null;
  ParentContractLineItemId: string | null;
  RootContractLineItemId: string | null;
};

type ParentReferences$ContractLineItemChangeEvent = {
  //
};

type ChildRelationships$ContractLineItemChangeEvent = {
  //
};

interface SObjectDefinition$ContractLineItemChangeEvent
  extends SObjectDefinition<'ContractLineItemChangeEvent'> {
  Name: 'ContractLineItemChangeEvent';
  Fields: Fields$ContractLineItemChangeEvent;
  ParentReferences: ParentReferences$ContractLineItemChangeEvent;
  ChildRelationships: ChildRelationships$ContractLineItemChangeEvent;
}

type Fields$ContractLineItemHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ContractLineItemId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ContractLineItemHistory = {
  //
  ContractLineItem: SObjectDefinition$ContractLineItem;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ContractLineItemHistory = {
  //
};

interface SObjectDefinition$ContractLineItemHistory
  extends SObjectDefinition<'ContractLineItemHistory'> {
  Name: 'ContractLineItemHistory';
  Fields: Fields$ContractLineItemHistory;
  ParentReferences: ParentReferences$ContractLineItemHistory;
  ChildRelationships: ChildRelationships$ContractLineItemHistory;
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

interface SObjectDefinition$ContractStatus
  extends SObjectDefinition<'ContractStatus'> {
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

interface SObjectDefinition$CorsWhitelistEntry
  extends SObjectDefinition<'CorsWhitelistEntry'> {
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

interface SObjectDefinition$CronJobDetail
  extends SObjectDefinition<'CronJobDetail'> {
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

interface SObjectDefinition$CronTrigger
  extends SObjectDefinition<'CronTrigger'> {
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

interface SObjectDefinition$CspTrustedSite
  extends SObjectDefinition<'CspTrustedSite'> {
  Name: 'CspTrustedSite';
  Fields: Fields$CspTrustedSite;
  ParentReferences: ParentReferences$CspTrustedSite;
  ChildRelationships: ChildRelationships$CspTrustedSite;
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

interface SObjectDefinition$CustomBrand
  extends SObjectDefinition<'CustomBrand'> {
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

interface SObjectDefinition$CustomBrandAsset
  extends SObjectDefinition<'CustomBrandAsset'> {
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

interface SObjectDefinition$CustomHttpHeader
  extends SObjectDefinition<'CustomHttpHeader'> {
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

interface SObjectDefinition$CustomObjectUserLicenseMetrics
  extends SObjectDefinition<'CustomObjectUserLicenseMetrics'> {
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

interface SObjectDefinition$CustomPermission
  extends SObjectDefinition<'CustomPermission'> {
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

interface SObjectDefinition$CustomPermissionDependency
  extends SObjectDefinition<'CustomPermissionDependency'> {
  Name: 'CustomPermissionDependency';
  Fields: Fields$CustomPermissionDependency;
  ParentReferences: ParentReferences$CustomPermissionDependency;
  ChildRelationships: ChildRelationships$CustomPermissionDependency;
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

interface SObjectDefinition$DashboardComponent
  extends SObjectDefinition<'DashboardComponent'> {
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

interface SObjectDefinition$DashboardComponentFeed
  extends SObjectDefinition<'DashboardComponentFeed'> {
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

interface SObjectDefinition$DashboardFeed
  extends SObjectDefinition<'DashboardFeed'> {
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

interface SObjectDefinition$DataAssessmentFieldMetric
  extends SObjectDefinition<'DataAssessmentFieldMetric'> {
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

interface SObjectDefinition$DataAssessmentMetric
  extends SObjectDefinition<'DataAssessmentMetric'> {
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

interface SObjectDefinition$DataAssessmentValueMetric
  extends SObjectDefinition<'DataAssessmentValueMetric'> {
  Name: 'DataAssessmentValueMetric';
  Fields: Fields$DataAssessmentValueMetric;
  ParentReferences: ParentReferences$DataAssessmentValueMetric;
  ChildRelationships: ChildRelationships$DataAssessmentValueMetric;
}

type Fields$DataIntegrationRecordPurchasePermission = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserId: string;
  ExternalObject: string | null;
  UserRecordPurchaseLimit: number | null;
};

type ParentReferences$DataIntegrationRecordPurchasePermission = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  User: SObjectDefinition$User;
};

type ChildRelationships$DataIntegrationRecordPurchasePermission = {
  //
};

interface SObjectDefinition$DataIntegrationRecordPurchasePermission
  extends SObjectDefinition<'DataIntegrationRecordPurchasePermission'> {
  Name: 'DataIntegrationRecordPurchasePermission';
  Fields: Fields$DataIntegrationRecordPurchasePermission;
  ParentReferences: ParentReferences$DataIntegrationRecordPurchasePermission;
  ChildRelationships: ChildRelationships$DataIntegrationRecordPurchasePermission;
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

interface SObjectDefinition$DataStatistics
  extends SObjectDefinition<'DataStatistics'> {
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

interface SObjectDefinition$DatacloudAddress
  extends SObjectDefinition<'DatacloudAddress'> {
  Name: 'DatacloudAddress';
  Fields: Fields$DatacloudAddress;
  ParentReferences: ParentReferences$DatacloudAddress;
  ChildRelationships: ChildRelationships$DatacloudAddress;
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

interface SObjectDefinition$DatasetExport
  extends SObjectDefinition<'DatasetExport'> {
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

interface SObjectDefinition$DatasetExportEvent
  extends SObjectDefinition<'DatasetExportEvent'> {
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

interface SObjectDefinition$DatasetExportPart
  extends SObjectDefinition<'DatasetExportPart'> {
  Name: 'DatasetExportPart';
  Fields: Fields$DatasetExportPart;
  ParentReferences: ParentReferences$DatasetExportPart;
  ChildRelationships: ChildRelationships$DatasetExportPart;
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

interface SObjectDefinition$DeclinedEventRelation
  extends SObjectDefinition<'DeclinedEventRelation'> {
  Name: 'DeclinedEventRelation';
  Fields: Fields$DeclinedEventRelation;
  ParentReferences: ParentReferences$DeclinedEventRelation;
  ChildRelationships: ChildRelationships$DeclinedEventRelation;
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

interface SObjectDefinition$DocumentAttachmentMap
  extends SObjectDefinition<'DocumentAttachmentMap'> {
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

interface SObjectDefinition$DuplicateRecordItem
  extends SObjectDefinition<'DuplicateRecordItem'> {
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

interface SObjectDefinition$DuplicateRecordSet
  extends SObjectDefinition<'DuplicateRecordSet'> {
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

interface SObjectDefinition$DuplicateRule
  extends SObjectDefinition<'DuplicateRule'> {
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

interface SObjectDefinition$EmailCapture
  extends SObjectDefinition<'EmailCapture'> {
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

interface SObjectDefinition$EmailDomainFilter
  extends SObjectDefinition<'EmailDomainFilter'> {
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

interface SObjectDefinition$EmailDomainKey
  extends SObjectDefinition<'EmailDomainKey'> {
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
  IsPrivateDraft: boolean;
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

interface SObjectDefinition$EmailMessage
  extends SObjectDefinition<'EmailMessage'> {
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

interface SObjectDefinition$EmailMessageRelation
  extends SObjectDefinition<'EmailMessageRelation'> {
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

interface SObjectDefinition$EmailServicesAddress
  extends SObjectDefinition<'EmailServicesAddress'> {
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

interface SObjectDefinition$EmailServicesFunction
  extends SObjectDefinition<'EmailServicesFunction'> {
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

interface SObjectDefinition$EmailStatus
  extends SObjectDefinition<'EmailStatus'> {
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

interface SObjectDefinition$EmailTemplate
  extends SObjectDefinition<'EmailTemplate'> {
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

interface SObjectDefinition$EmbeddedServiceDetail
  extends SObjectDefinition<'EmbeddedServiceDetail'> {
  Name: 'EmbeddedServiceDetail';
  Fields: Fields$EmbeddedServiceDetail;
  ParentReferences: ParentReferences$EmbeddedServiceDetail;
  ChildRelationships: ChildRelationships$EmbeddedServiceDetail;
}

type Fields$Entitlement = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  AccountId: string;
  Type: string | null;
  ServiceContractId: string | null;
  ContractLineItemId: string | null;
  AssetId: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  SlaProcessId: string | null;
  BusinessHoursId: string | null;
  IsPerIncident: boolean;
  CasesPerEntitlement: number | null;
  RemainingCases: number | null;
  Status: string | null;
};

type ParentReferences$Entitlement = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account;
  ServiceContract: SObjectDefinition$ServiceContract | null;
  ContractLineItem: SObjectDefinition$ContractLineItem | null;
  Asset: SObjectDefinition$Asset | null;
  SlaProcess: SObjectDefinition$SlaProcess | null;
  BusinessHours: SObjectDefinition$BusinessHours | null;
};

type ChildRelationships$Entitlement = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  Cases: SObjectDefinition$Case;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  EntitlementContacts: SObjectDefinition$EntitlementContact;
  Feeds: SObjectDefinition$EntitlementFeed;
  Histories: SObjectDefinition$EntitlementHistory;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$Entitlement
  extends SObjectDefinition<'Entitlement'> {
  Name: 'Entitlement';
  Fields: Fields$Entitlement;
  ParentReferences: ParentReferences$Entitlement;
  ChildRelationships: ChildRelationships$Entitlement;
}

type Fields$EntitlementChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  Name: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  AccountId: string | null;
  Type: string | null;
  ServiceContractId: string | null;
  ContractLineItemId: string | null;
  AssetId: string | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  SlaProcessId: string | null;
  BusinessHoursId: string | null;
  IsPerIncident: boolean;
  CasesPerEntitlement: number | null;
  RemainingCases: number | null;
};

type ParentReferences$EntitlementChangeEvent = {
  //
};

type ChildRelationships$EntitlementChangeEvent = {
  //
};

interface SObjectDefinition$EntitlementChangeEvent
  extends SObjectDefinition<'EntitlementChangeEvent'> {
  Name: 'EntitlementChangeEvent';
  Fields: Fields$EntitlementChangeEvent;
  ParentReferences: ParentReferences$EntitlementChangeEvent;
  ChildRelationships: ChildRelationships$EntitlementChangeEvent;
}

type Fields$EntitlementContact = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  EntitlementId: string;
  ContactId: string;
};

type ParentReferences$EntitlementContact = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Entitlement: SObjectDefinition$Entitlement;
  Contact: SObjectDefinition$Contact;
};

type ChildRelationships$EntitlementContact = {
  //
};

interface SObjectDefinition$EntitlementContact
  extends SObjectDefinition<'EntitlementContact'> {
  Name: 'EntitlementContact';
  Fields: Fields$EntitlementContact;
  ParentReferences: ParentReferences$EntitlementContact;
  ChildRelationships: ChildRelationships$EntitlementContact;
}

type Fields$EntitlementFeed = {
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

type ParentReferences$EntitlementFeed = {
  //
  Parent: SObjectDefinition$Entitlement;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$EntitlementFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$EntitlementFeed
  extends SObjectDefinition<'EntitlementFeed'> {
  Name: 'EntitlementFeed';
  Fields: Fields$EntitlementFeed;
  ParentReferences: ParentReferences$EntitlementFeed;
  ChildRelationships: ChildRelationships$EntitlementFeed;
}

type Fields$EntitlementHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  EntitlementId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$EntitlementHistory = {
  //
  Entitlement: SObjectDefinition$Entitlement;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$EntitlementHistory = {
  //
};

interface SObjectDefinition$EntitlementHistory
  extends SObjectDefinition<'EntitlementHistory'> {
  Name: 'EntitlementHistory';
  Fields: Fields$EntitlementHistory;
  ParentReferences: ParentReferences$EntitlementHistory;
  ChildRelationships: ChildRelationships$EntitlementHistory;
}

type Fields$EntitlementTemplate = {
  //
  Id: string;
  Name: string;
  BusinessHoursId: string | null;
  Type: string | null;
  SlaProcessId: string | null;
  IsPerIncident: boolean;
  CasesPerEntitlement: number | null;
  Term: number | null;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  NamespacePrefix: string | null;
};

type ParentReferences$EntitlementTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$EntitlementTemplate = {
  //
};

interface SObjectDefinition$EntitlementTemplate
  extends SObjectDefinition<'EntitlementTemplate'> {
  Name: 'EntitlementTemplate';
  Fields: Fields$EntitlementTemplate;
  ParentReferences: ParentReferences$EntitlementTemplate;
  ChildRelationships: ChildRelationships$EntitlementTemplate;
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

interface SObjectDefinition$EntityDefinition
  extends SObjectDefinition<'EntityDefinition'> {
  Name: 'EntityDefinition';
  Fields: Fields$EntityDefinition;
  ParentReferences: ParentReferences$EntityDefinition;
  ChildRelationships: ChildRelationships$EntityDefinition;
}

type Fields$EntityMilestone = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ParentEntityId: string;
  StartDate: DateString | null;
  TargetDate: DateString | null;
  CompletionDate: DateString | null;
  SlaProcessId: string | null;
  MilestoneTypeId: string | null;
  IsCompleted: boolean;
  IsViolated: boolean;
  TargetResponseInMins: number | null;
  TargetResponseInHrs: number | null;
  TargetResponseInDays: number | null;
  TimeRemainingInMins: string | null;
  TimeRemainingInHrs: string | null;
  TimeRemainingInDays: number | null;
  ElapsedTimeInMins: number | null;
  ElapsedTimeInHrs: number | null;
  ElapsedTimeInDays: number | null;
  TimeSinceTargetInMins: string | null;
  TimeSinceTargetInHrs: string | null;
  TimeSinceTargetInDays: number | null;
  BusinessHoursId: string | null;
  StoppedTimeInMins: number | null;
  StoppedTimeInHrs: number | null;
  StoppedTimeInDays: number | null;
  ActualElapsedTimeInMins: number | null;
  ActualElapsedTimeInHrs: number | null;
  ActualElapsedTimeInDays: number | null;
};

type ParentReferences$EntityMilestone = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ParentEntity: SObjectDefinition$WorkOrder;
  SlaProcess: SObjectDefinition$SlaProcess | null;
  MilestoneType: SObjectDefinition$MilestoneType | null;
  BusinessHours: SObjectDefinition$BusinessHours | null;
};

type ChildRelationships$EntityMilestone = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Feeds: SObjectDefinition$EntityMilestoneFeed;
  Histories: SObjectDefinition$EntityMilestoneHistory;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
};

interface SObjectDefinition$EntityMilestone
  extends SObjectDefinition<'EntityMilestone'> {
  Name: 'EntityMilestone';
  Fields: Fields$EntityMilestone;
  ParentReferences: ParentReferences$EntityMilestone;
  ChildRelationships: ChildRelationships$EntityMilestone;
}

type Fields$EntityMilestoneFeed = {
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

type ParentReferences$EntityMilestoneFeed = {
  //
  Parent: SObjectDefinition$EntityMilestone;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$EntityMilestoneFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$EntityMilestoneFeed
  extends SObjectDefinition<'EntityMilestoneFeed'> {
  Name: 'EntityMilestoneFeed';
  Fields: Fields$EntityMilestoneFeed;
  ParentReferences: ParentReferences$EntityMilestoneFeed;
  ChildRelationships: ChildRelationships$EntityMilestoneFeed;
}

type Fields$EntityMilestoneHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  EntityMilestoneId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$EntityMilestoneHistory = {
  //
  EntityMilestone: SObjectDefinition$EntityMilestone;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$EntityMilestoneHistory = {
  //
};

interface SObjectDefinition$EntityMilestoneHistory
  extends SObjectDefinition<'EntityMilestoneHistory'> {
  Name: 'EntityMilestoneHistory';
  Fields: Fields$EntityMilestoneHistory;
  ParentReferences: ParentReferences$EntityMilestoneHistory;
  ChildRelationships: ChildRelationships$EntityMilestoneHistory;
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

interface SObjectDefinition$EntityParticle
  extends SObjectDefinition<'EntityParticle'> {
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

interface SObjectDefinition$EntitySubscription
  extends SObjectDefinition<'EntitySubscription'> {
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

interface SObjectDefinition$EventBusSubscriber
  extends SObjectDefinition<'EventBusSubscriber'> {
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

interface SObjectDefinition$EventChangeEvent
  extends SObjectDefinition<'EventChangeEvent'> {
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

interface SObjectDefinition$EventLogFile
  extends SObjectDefinition<'EventLogFile'> {
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

interface SObjectDefinition$EventRelation
  extends SObjectDefinition<'EventRelation'> {
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

interface SObjectDefinition$EventRelationChangeEvent
  extends SObjectDefinition<'EventRelationChangeEvent'> {
  Name: 'EventRelationChangeEvent';
  Fields: Fields$EventRelationChangeEvent;
  ParentReferences: ParentReferences$EventRelationChangeEvent;
  ChildRelationships: ChildRelationships$EventRelationChangeEvent;
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

interface SObjectDefinition$ExternalDataSource
  extends SObjectDefinition<'ExternalDataSource'> {
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

interface SObjectDefinition$ExternalDataUserAuth
  extends SObjectDefinition<'ExternalDataUserAuth'> {
  Name: 'ExternalDataUserAuth';
  Fields: Fields$ExternalDataUserAuth;
  ParentReferences: ParentReferences$ExternalDataUserAuth;
  ChildRelationships: ChildRelationships$ExternalDataUserAuth;
}

type Fields$ExternalSocialAccount = {
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
  ExternalAccountId: string;
  Username: string | null;
  Provider: string;
  ProviderUserId: string;
  ExternalPictureURL: string | null;
  IsActive: boolean;
  SocialPropertyId: string | null;
  IsAuthenticated: boolean;
  TopicId: string | null;
  DataSourceId: string | null;
  RuleId: string | null;
  IsDataSourceActive: boolean;
  UniqueName: string | null;
  DefaultResponseAccountId: string | null;
  ProfileUrl: string | null;
  AuthorizedBy: string | null;
  IsCaseCreationEnabled: boolean;
};

type ParentReferences$ExternalSocialAccount = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  DefaultResponseAccount: SObjectDefinition$ExternalSocialAccount | null;
};

type ChildRelationships$ExternalSocialAccount = {
  //
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$ExternalSocialAccount
  extends SObjectDefinition<'ExternalSocialAccount'> {
  Name: 'ExternalSocialAccount';
  Fields: Fields$ExternalSocialAccount;
  ParentReferences: ParentReferences$ExternalSocialAccount;
  ChildRelationships: ChildRelationships$ExternalSocialAccount;
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

interface SObjectDefinition$FeedAttachment
  extends SObjectDefinition<'FeedAttachment'> {
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

interface SObjectDefinition$FeedComment
  extends SObjectDefinition<'FeedComment'> {
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

interface SObjectDefinition$FeedPollChoice
  extends SObjectDefinition<'FeedPollChoice'> {
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

interface SObjectDefinition$FeedPollVote
  extends SObjectDefinition<'FeedPollVote'> {
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

interface SObjectDefinition$FeedRevision
  extends SObjectDefinition<'FeedRevision'> {
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
};

type ParentReferences$FeedTrackedChange = {
  //
};

type ChildRelationships$FeedTrackedChange = {
  //
};

interface SObjectDefinition$FeedTrackedChange
  extends SObjectDefinition<'FeedTrackedChange'> {
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

interface SObjectDefinition$FieldDefinition
  extends SObjectDefinition<'FieldDefinition'> {
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

interface SObjectDefinition$FieldPermissions
  extends SObjectDefinition<'FieldPermissions'> {
  Name: 'FieldPermissions';
  Fields: Fields$FieldPermissions;
  ParentReferences: ParentReferences$FieldPermissions;
  ChildRelationships: ChildRelationships$FieldPermissions;
}

type Fields$FileSearchActivity = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
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

interface SObjectDefinition$FileSearchActivity
  extends SObjectDefinition<'FileSearchActivity'> {
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

interface SObjectDefinition$FiscalYearSettings
  extends SObjectDefinition<'FiscalYearSettings'> {
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

interface SObjectDefinition$FlexQueueItem
  extends SObjectDefinition<'FlexQueueItem'> {
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

interface SObjectDefinition$FlowInterview
  extends SObjectDefinition<'FlowInterview'> {
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

interface SObjectDefinition$FlowInterviewShare
  extends SObjectDefinition<'FlowInterviewShare'> {
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

interface SObjectDefinition$FlowRecordRelation
  extends SObjectDefinition<'FlowRecordRelation'> {
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

interface SObjectDefinition$FlowStageRelation
  extends SObjectDefinition<'FlowStageRelation'> {
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

interface SObjectDefinition$FolderedContentDocument
  extends SObjectDefinition<'FolderedContentDocument'> {
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

interface SObjectDefinition$ForecastShare
  extends SObjectDefinition<'ForecastShare'> {
  Name: 'ForecastShare';
  Fields: Fields$ForecastShare;
  ParentReferences: ParentReferences$ForecastShare;
  ChildRelationships: ChildRelationships$ForecastShare;
}

type Fields$ForecastingShare = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  UserOrGroupId: string;
  SharedForecastManagerRoleId: string;
};

type ParentReferences$ForecastingShare = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  UserOrGroup: SObjectDefinition$User;
  SharedForecastManagerRole: SObjectDefinition$UserRole;
};

type ChildRelationships$ForecastingShare = {
  //
};

interface SObjectDefinition$ForecastingShare
  extends SObjectDefinition<'ForecastingShare'> {
  Name: 'ForecastingShare';
  Fields: Fields$ForecastingShare;
  ParentReferences: ParentReferences$ForecastingShare;
  ChildRelationships: ChildRelationships$ForecastingShare;
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

interface SObjectDefinition$GrantedByLicense
  extends SObjectDefinition<'GrantedByLicense'> {
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

interface SObjectDefinition$GroupMember
  extends SObjectDefinition<'GroupMember'> {
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

interface SObjectDefinition$IconDefinition
  extends SObjectDefinition<'IconDefinition'> {
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

interface SObjectDefinition$IdeaComment
  extends SObjectDefinition<'IdeaComment'> {
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

interface SObjectDefinition$IdpEventLog
  extends SObjectDefinition<'IdpEventLog'> {
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

interface SObjectDefinition$IndividualHistory
  extends SObjectDefinition<'IndividualHistory'> {
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

interface SObjectDefinition$IndividualShare
  extends SObjectDefinition<'IndividualShare'> {
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

interface SObjectDefinition$InstalledMobileApp
  extends SObjectDefinition<'InstalledMobileApp'> {
  Name: 'InstalledMobileApp';
  Fields: Fields$InstalledMobileApp;
  ParentReferences: ParentReferences$InstalledMobileApp;
  ChildRelationships: ChildRelationships$InstalledMobileApp;
}

type Fields$KnowledgeArticle = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ArticleNumber: string;
  ArchivedDate: DateString | null;
  ArchivedById: string | null;
  FirstPublishedDate: DateString | null;
  LastPublishedDate: DateString | null;
  CaseAssociationCount: number;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  MigratedToFromArticle: string | null;
  TotalViewCount: number | null;
};

type ParentReferences$KnowledgeArticle = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$KnowledgeArticle = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CaseArticles: SObjectDefinition$CaseArticle;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  VersionHistories: SObjectDefinition$KnowledgeArticleVersionHistory;
  ViewStats: SObjectDefinition$KnowledgeArticleViewStat;
  VoteStats: SObjectDefinition$KnowledgeArticleVoteStat;
  LinkedArticles: SObjectDefinition$LinkedArticle;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Votes: SObjectDefinition$Vote;
};

interface SObjectDefinition$KnowledgeArticle
  extends SObjectDefinition<'KnowledgeArticle'> {
  Name: 'KnowledgeArticle';
  Fields: Fields$KnowledgeArticle;
  ParentReferences: ParentReferences$KnowledgeArticle;
  ChildRelationships: ChildRelationships$KnowledgeArticle;
}

type Fields$KnowledgeArticleVersion = {
  //
  Id: string;
  KnowledgeArticleId: string;
  OwnerId: string;
  IsDeleted: boolean;
  ValidationStatus: string;
  PublishStatus: string;
  VersionNumber: number;
  IsLatestVersion: boolean;
  IsVisibleInApp: boolean;
  IsVisibleInPkb: boolean;
  IsVisibleInCsp: boolean;
  IsVisibleInPrm: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Language: string;
  Title: string;
  UrlName: string;
  ArchivedDate: DateString | null;
  ArchivedById: string | null;
  Summary: string | null;
  ArticleNumber: string;
  FirstPublishedDate: DateString | null;
  LastPublishedDate: DateString | null;
  ArticleArchivedById: string | null;
  ArticleArchivedDate: DateString | null;
  ArticleCaseAttachCount: number | null;
  ArticleCreatedById: string | null;
  ArticleCreatedDate: DateString | null;
  ArticleMasterLanguage: string | null;
  ArticleTotalViewCount: number | null;
  SourceId: string | null;
  ArticleType: string;
  AssignedToId: string | null;
  AssignedById: string | null;
  AssignmentDate: DateString | null;
  AssignmentDueDate: DateString | null;
  AssignmentNote: string | null;
  MigratedToFromArticleVersion: string | null;
};

type ParentReferences$KnowledgeArticleVersion = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ArchivedBy: SObjectDefinition$User | null;
  ArticleArchivedBy: SObjectDefinition$User | null;
  ArticleCreatedBy: SObjectDefinition$User | null;
  AssignedTo: SObjectDefinition$Name | null;
  AssignedBy: SObjectDefinition$User | null;
};

type ChildRelationships$KnowledgeArticleVersion = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CaseArticles: SObjectDefinition$CaseArticle;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  LinkedArticles: SObjectDefinition$LinkedArticle;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  SearchPromotionRules: SObjectDefinition$SearchPromotionRule;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$KnowledgeArticleVersion
  extends SObjectDefinition<'KnowledgeArticleVersion'> {
  Name: 'KnowledgeArticleVersion';
  Fields: Fields$KnowledgeArticleVersion;
  ParentReferences: ParentReferences$KnowledgeArticleVersion;
  ChildRelationships: ChildRelationships$KnowledgeArticleVersion;
}

type Fields$KnowledgeArticleVersionHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  Language: string;
  VersionNumber: number;
  ParentSobjectType: string;
  CreatedById: string;
  CreatedDate: DateString;
  EventType: string;
  FieldName: string | null;
  OldValue: string | null;
  NewValue: string | null;
  VersionId: string | null;
};

type ParentReferences$KnowledgeArticleVersionHistory = {
  //
  Parent: SObjectDefinition$KnowledgeArticle;
  CreatedBy: SObjectDefinition$User;
  Version: SObjectDefinition$Knowledge__kav | null;
};

type ChildRelationships$KnowledgeArticleVersionHistory = {
  //
};

interface SObjectDefinition$KnowledgeArticleVersionHistory
  extends SObjectDefinition<'KnowledgeArticleVersionHistory'> {
  Name: 'KnowledgeArticleVersionHistory';
  Fields: Fields$KnowledgeArticleVersionHistory;
  ParentReferences: ParentReferences$KnowledgeArticleVersionHistory;
  ChildRelationships: ChildRelationships$KnowledgeArticleVersionHistory;
}

type Fields$KnowledgeArticleViewStat = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  NormalizedScore: number | null;
  Channel: string;
  ViewCount: number;
};

type ParentReferences$KnowledgeArticleViewStat = {
  //
  Parent: SObjectDefinition$KnowledgeArticle;
};

type ChildRelationships$KnowledgeArticleViewStat = {
  //
};

interface SObjectDefinition$KnowledgeArticleViewStat
  extends SObjectDefinition<'KnowledgeArticleViewStat'> {
  Name: 'KnowledgeArticleViewStat';
  Fields: Fields$KnowledgeArticleViewStat;
  ParentReferences: ParentReferences$KnowledgeArticleViewStat;
  ChildRelationships: ChildRelationships$KnowledgeArticleViewStat;
}

type Fields$KnowledgeArticleVoteStat = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  NormalizedScore: number | null;
  Channel: string;
};

type ParentReferences$KnowledgeArticleVoteStat = {
  //
  Parent: SObjectDefinition$KnowledgeArticle;
};

type ChildRelationships$KnowledgeArticleVoteStat = {
  //
};

interface SObjectDefinition$KnowledgeArticleVoteStat
  extends SObjectDefinition<'KnowledgeArticleVoteStat'> {
  Name: 'KnowledgeArticleVoteStat';
  Fields: Fields$KnowledgeArticleVoteStat;
  ParentReferences: ParentReferences$KnowledgeArticleVoteStat;
  ChildRelationships: ChildRelationships$KnowledgeArticleVoteStat;
}

type Fields$Knowledge__DataCategorySelection = {
  //
  Id: string;
  ParentId: string;
  DataCategoryGroupName: string;
  DataCategoryName: string;
  CreatedDate: DateString;
  CreatedById: string;
  IsDeleted: boolean;
  SystemModstamp: DateString;
};

type ParentReferences$Knowledge__DataCategorySelection = {
  //
  Parent: SObjectDefinition$Knowledge__kav;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$Knowledge__DataCategorySelection = {
  //
};

interface SObjectDefinition$Knowledge__DataCategorySelection
  extends SObjectDefinition<'Knowledge__DataCategorySelection'> {
  Name: 'Knowledge__DataCategorySelection';
  Fields: Fields$Knowledge__DataCategorySelection;
  ParentReferences: ParentReferences$Knowledge__DataCategorySelection;
  ChildRelationships: ChildRelationships$Knowledge__DataCategorySelection;
}

type Fields$Knowledge__ViewStat = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  NormalizedScore: number | null;
  Channel: string;
  ViewCount: number;
};

type ParentReferences$Knowledge__ViewStat = {
  //
  Parent: SObjectDefinition$Knowledge__ka;
};

type ChildRelationships$Knowledge__ViewStat = {
  //
};

interface SObjectDefinition$Knowledge__ViewStat
  extends SObjectDefinition<'Knowledge__ViewStat'> {
  Name: 'Knowledge__ViewStat';
  Fields: Fields$Knowledge__ViewStat;
  ParentReferences: ParentReferences$Knowledge__ViewStat;
  ChildRelationships: ChildRelationships$Knowledge__ViewStat;
}

type Fields$Knowledge__VoteStat = {
  //
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  NormalizedScore: number | null;
  Channel: string;
};

type ParentReferences$Knowledge__VoteStat = {
  //
  Parent: SObjectDefinition$Knowledge__ka;
};

type ChildRelationships$Knowledge__VoteStat = {
  //
};

interface SObjectDefinition$Knowledge__VoteStat
  extends SObjectDefinition<'Knowledge__VoteStat'> {
  Name: 'Knowledge__VoteStat';
  Fields: Fields$Knowledge__VoteStat;
  ParentReferences: ParentReferences$Knowledge__VoteStat;
  ChildRelationships: ChildRelationships$Knowledge__VoteStat;
}

type Fields$Knowledge__ka = {
  //
  Id: string;
  IsDeleted: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ArticleNumber: string;
  ArchivedDate: DateString | null;
  ArchivedById: string | null;
  FirstPublishedDate: DateString | null;
  LastPublishedDate: DateString | null;
  CaseAssociationCount: number;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  MigratedToFromArticle: string | null;
  TotalViewCount: number | null;
};

type ParentReferences$Knowledge__ka = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$Knowledge__ka = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CaseArticles: SObjectDefinition$CaseArticle;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ViewStats: SObjectDefinition$Knowledge__ViewStat;
  VoteStats: SObjectDefinition$Knowledge__VoteStat;
  LinkedArticles: SObjectDefinition$LinkedArticle;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Votes: SObjectDefinition$Vote;
};

interface SObjectDefinition$Knowledge__ka
  extends SObjectDefinition<'Knowledge__ka'> {
  Name: 'Knowledge__ka';
  Fields: Fields$Knowledge__ka;
  ParentReferences: ParentReferences$Knowledge__ka;
  ChildRelationships: ChildRelationships$Knowledge__ka;
}

type Fields$Knowledge__kav = {
  //
  Id: string;
  KnowledgeArticleId: string;
  OwnerId: string;
  IsDeleted: boolean;
  ValidationStatus: string;
  PublishStatus: string;
  VersionNumber: number;
  IsLatestVersion: boolean;
  IsVisibleInApp: boolean;
  IsVisibleInPkb: boolean;
  IsVisibleInCsp: boolean;
  IsVisibleInPrm: boolean;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  Language: string;
  Title: string;
  UrlName: string;
  ArchivedDate: DateString | null;
  ArchivedById: string | null;
  Summary: string | null;
  ArticleNumber: string;
  FirstPublishedDate: DateString | null;
  LastPublishedDate: DateString | null;
  ArticleArchivedById: string | null;
  ArticleArchivedDate: DateString | null;
  ArticleCaseAttachCount: number | null;
  ArticleCreatedById: string | null;
  ArticleCreatedDate: DateString | null;
  ArticleMasterLanguage: string | null;
  ArticleTotalViewCount: number | null;
  SourceId: string | null;
  ArticleType: string;
  AssignedToId: string | null;
  AssignedById: string | null;
  AssignmentDate: DateString | null;
  AssignmentDueDate: DateString | null;
  AssignmentNote: string | null;
  MigratedToFromArticleVersion: string | null;
};

type ParentReferences$Knowledge__kav = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ArchivedBy: SObjectDefinition$User | null;
  ArticleArchivedBy: SObjectDefinition$User | null;
  ArticleCreatedBy: SObjectDefinition$User | null;
  AssignedTo: SObjectDefinition$Name | null;
  AssignedBy: SObjectDefinition$User | null;
};

type ChildRelationships$Knowledge__kav = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CaseArticles: SObjectDefinition$CaseArticle;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  DataCategorySelections: SObjectDefinition$Knowledge__DataCategorySelection;
  LinkedArticles: SObjectDefinition$LinkedArticle;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  SearchPromotionRules: SObjectDefinition$SearchPromotionRule;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Knowledge__kav
  extends SObjectDefinition<'Knowledge__kav'> {
  Name: 'Knowledge__kav';
  Fields: Fields$Knowledge__kav;
  ParentReferences: ParentReferences$Knowledge__kav;
  ChildRelationships: ChildRelationships$Knowledge__kav;
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

interface SObjectDefinition$KnowledgeableUser
  extends SObjectDefinition<'KnowledgeableUser'> {
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
  Email: string | null;
  Website: string | null;
  PhotoUrl: string | null;
  Description: string | null;
  LeadSource: string | null;
  Status: string;
  Industry: string | null;
  Rating: string | null;
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
  Personas: SObjectDefinition$SocialPersona;
  Posts: SObjectDefinition$SocialPost;
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
  Email: string | null;
  Website: string | null;
  Description: string | null;
  LeadSource: string | null;
  Status: string | null;
  Industry: string | null;
  Rating: string | null;
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

interface SObjectDefinition$LeadChangeEvent
  extends SObjectDefinition<'LeadChangeEvent'> {
  Name: 'LeadChangeEvent';
  Fields: Fields$LeadChangeEvent;
  ParentReferences: ParentReferences$LeadChangeEvent;
  ChildRelationships: ChildRelationships$LeadChangeEvent;
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

interface SObjectDefinition$LeadHistory
  extends SObjectDefinition<'LeadHistory'> {
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

interface SObjectDefinition$LightningExperienceTheme
  extends SObjectDefinition<'LightningExperienceTheme'> {
  Name: 'LightningExperienceTheme';
  Fields: Fields$LightningExperienceTheme;
  ParentReferences: ParentReferences$LightningExperienceTheme;
  ChildRelationships: ChildRelationships$LightningExperienceTheme;
}

type Fields$LinkedArticle = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  KnowledgeArticleVersionId: string | null;
  LinkedEntityId: string | null;
  KnowledgeArticleId: string | null;
  Type: string | null;
};

type ParentReferences$LinkedArticle = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  KnowledgeArticleVersion: SObjectDefinition$Knowledge__kav | null;
  LinkedEntity: SObjectDefinition$Name | null;
  KnowledgeArticle: SObjectDefinition$Knowledge__ka | null;
};

type ChildRelationships$LinkedArticle = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Feeds: SObjectDefinition$LinkedArticleFeed;
  Histories: SObjectDefinition$LinkedArticleHistory;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$LinkedArticle
  extends SObjectDefinition<'LinkedArticle'> {
  Name: 'LinkedArticle';
  Fields: Fields$LinkedArticle;
  ParentReferences: ParentReferences$LinkedArticle;
  ChildRelationships: ChildRelationships$LinkedArticle;
}

type Fields$LinkedArticleFeed = {
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

type ParentReferences$LinkedArticleFeed = {
  //
  Parent: SObjectDefinition$LinkedArticle;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$LinkedArticleFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$LinkedArticleFeed
  extends SObjectDefinition<'LinkedArticleFeed'> {
  Name: 'LinkedArticleFeed';
  Fields: Fields$LinkedArticleFeed;
  ParentReferences: ParentReferences$LinkedArticleFeed;
  ChildRelationships: ChildRelationships$LinkedArticleFeed;
}

type Fields$LinkedArticleHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  LinkedArticleId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$LinkedArticleHistory = {
  //
  LinkedArticle: SObjectDefinition$LinkedArticle;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$LinkedArticleHistory = {
  //
};

interface SObjectDefinition$LinkedArticleHistory
  extends SObjectDefinition<'LinkedArticleHistory'> {
  Name: 'LinkedArticleHistory';
  Fields: Fields$LinkedArticleHistory;
  ParentReferences: ParentReferences$LinkedArticleHistory;
  ChildRelationships: ChildRelationships$LinkedArticleHistory;
}

type Fields$ListEmail = {
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

interface SObjectDefinition$ListEmailChangeEvent
  extends SObjectDefinition<'ListEmailChangeEvent'> {
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

interface SObjectDefinition$ListEmailRecipientSource
  extends SObjectDefinition<'ListEmailRecipientSource'> {
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

interface SObjectDefinition$ListEmailShare
  extends SObjectDefinition<'ListEmailShare'> {
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

interface SObjectDefinition$ListViewChart
  extends SObjectDefinition<'ListViewChart'> {
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

interface SObjectDefinition$ListViewChartInstance
  extends SObjectDefinition<'ListViewChartInstance'> {
  Name: 'ListViewChartInstance';
  Fields: Fields$ListViewChartInstance;
  ParentReferences: ParentReferences$ListViewChartInstance;
  ChildRelationships: ChildRelationships$ListViewChartInstance;
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

interface SObjectDefinition$LoginHistory
  extends SObjectDefinition<'LoginHistory'> {
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

interface SObjectDefinition$LogoutEventStream
  extends SObjectDefinition<'LogoutEventStream'> {
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

interface SObjectDefinition$LookedUpFromActivity
  extends SObjectDefinition<'LookedUpFromActivity'> {
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

interface SObjectDefinition$MacroHistory
  extends SObjectDefinition<'MacroHistory'> {
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

interface SObjectDefinition$MacroInstruction
  extends SObjectDefinition<'MacroInstruction'> {
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
  Category: string | null;
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

interface SObjectDefinition$MailmergeTemplate
  extends SObjectDefinition<'MailmergeTemplate'> {
  Name: 'MailmergeTemplate';
  Fields: Fields$MailmergeTemplate;
  ParentReferences: ParentReferences$MailmergeTemplate;
  ChildRelationships: ChildRelationships$MailmergeTemplate;
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

interface SObjectDefinition$MatchingRule
  extends SObjectDefinition<'MatchingRule'> {
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

interface SObjectDefinition$MatchingRuleItem
  extends SObjectDefinition<'MatchingRuleItem'> {
  Name: 'MatchingRuleItem';
  Fields: Fields$MatchingRuleItem;
  ParentReferences: ParentReferences$MatchingRuleItem;
  ChildRelationships: ChildRelationships$MatchingRuleItem;
}

type Fields$MilestoneType = {
  //
  Id: string;
  Name: string;
  Description: string | null;
  RecurrenceType: string | null;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
};

type ParentReferences$MilestoneType = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$MilestoneType = {
  //
};

interface SObjectDefinition$MilestoneType
  extends SObjectDefinition<'MilestoneType'> {
  Name: 'MilestoneType';
  Fields: Fields$MilestoneType;
  ParentReferences: ParentReferences$MilestoneType;
  ChildRelationships: ChildRelationships$MilestoneType;
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

interface SObjectDefinition$NamedCredential
  extends SObjectDefinition<'NamedCredential'> {
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

interface SObjectDefinition$NoteAndAttachment
  extends SObjectDefinition<'NoteAndAttachment'> {
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

interface SObjectDefinition$ObjectPermissions
  extends SObjectDefinition<'ObjectPermissions'> {
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
  DurationInMinutes: number | null;
  Location: string | null;
  Description: string | null;
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

interface SObjectDefinition$OpenActivity
  extends SObjectDefinition<'OpenActivity'> {
  Name: 'OpenActivity';
  Fields: Fields$OpenActivity;
  ParentReferences: ParentReferences$OpenActivity;
  ChildRelationships: ChildRelationships$OpenActivity;
}

type Fields$Opportunity = {
  //
  Id: string;
  IsDeleted: boolean;
  AccountId: string | null;
  Name: string;
  Description: string | null;
  StageName: string;
  Amount: number | null;
  Probability: number | null;
  CloseDate: DateString;
  Type: string | null;
  NextStep: string | null;
  LeadSource: string | null;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string;
  ForecastCategoryName: string | null;
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
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
};

interface SObjectDefinition$Opportunity
  extends SObjectDefinition<'Opportunity'> {
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
  Name: string | null;
  Description: string | null;
  StageName: string | null;
  Amount: number | null;
  Probability: number | null;
  CloseDate: DateString | null;
  Type: string | null;
  NextStep: string | null;
  LeadSource: string | null;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string | null;
  ForecastCategoryName: string | null;
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

interface SObjectDefinition$OpportunityChangeEvent
  extends SObjectDefinition<'OpportunityChangeEvent'> {
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

interface SObjectDefinition$OpportunityCompetitor
  extends SObjectDefinition<'OpportunityCompetitor'> {
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

interface SObjectDefinition$OpportunityContactRole
  extends SObjectDefinition<'OpportunityContactRole'> {
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

interface SObjectDefinition$OpportunityContactRoleChangeEvent
  extends SObjectDefinition<'OpportunityContactRoleChangeEvent'> {
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

interface SObjectDefinition$OpportunityFeed
  extends SObjectDefinition<'OpportunityFeed'> {
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

interface SObjectDefinition$OpportunityFieldHistory
  extends SObjectDefinition<'OpportunityFieldHistory'> {
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

interface SObjectDefinition$OpportunityHistory
  extends SObjectDefinition<'OpportunityHistory'> {
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

interface SObjectDefinition$OpportunityLineItem
  extends SObjectDefinition<'OpportunityLineItem'> {
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

interface SObjectDefinition$OpportunityPartner
  extends SObjectDefinition<'OpportunityPartner'> {
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

interface SObjectDefinition$OpportunityShare
  extends SObjectDefinition<'OpportunityShare'> {
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

interface SObjectDefinition$OpportunityStage
  extends SObjectDefinition<'OpportunityStage'> {
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
  CompanyAuthorizedById: string | null;
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
  ActivatedDate: DateString | null;
  ActivatedById: string | null;
  StatusCode: string;
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
  CompanyAuthorizedById: string | null;
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
  ActivatedDate: DateString | null;
  ActivatedById: string | null;
  StatusCode: string | null;
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

interface SObjectDefinition$OrderChangeEvent
  extends SObjectDefinition<'OrderChangeEvent'> {
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

interface SObjectDefinition$OrderHistory
  extends SObjectDefinition<'OrderHistory'> {
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

interface SObjectDefinition$OrderItemChangeEvent
  extends SObjectDefinition<'OrderItemChangeEvent'> {
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

interface SObjectDefinition$OrderItemFeed
  extends SObjectDefinition<'OrderItemFeed'> {
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

interface SObjectDefinition$OrderItemHistory
  extends SObjectDefinition<'OrderItemHistory'> {
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

interface SObjectDefinition$OrgLifecycleNotification
  extends SObjectDefinition<'OrgLifecycleNotification'> {
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

interface SObjectDefinition$OrgWideEmailAddress
  extends SObjectDefinition<'OrgWideEmailAddress'> {
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

interface SObjectDefinition$Organization
  extends SObjectDefinition<'Organization'> {
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

interface SObjectDefinition$OutgoingEmail
  extends SObjectDefinition<'OutgoingEmail'> {
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

interface SObjectDefinition$OutgoingEmailRelation
  extends SObjectDefinition<'OutgoingEmailRelation'> {
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

interface SObjectDefinition$OwnedContentDocument
  extends SObjectDefinition<'OwnedContentDocument'> {
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

interface SObjectDefinition$OwnerChangeOptionInfo
  extends SObjectDefinition<'OwnerChangeOptionInfo'> {
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

interface SObjectDefinition$PackageLicense
  extends SObjectDefinition<'PackageLicense'> {
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

interface SObjectDefinition$PartnerRole
  extends SObjectDefinition<'PartnerRole'> {
  Name: 'PartnerRole';
  Fields: Fields$PartnerRole;
  ParentReferences: ParentReferences$PartnerRole;
  ChildRelationships: ChildRelationships$PartnerRole;
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
  PermissionsManageCssUsers: boolean;
  PermissionsActivateContract: boolean;
  PermissionsActivateOrder: boolean;
  PermissionsImportLeads: boolean;
  PermissionsManageLeads: boolean;
  PermissionsTransferAnyLead: boolean;
  PermissionsViewAllData: boolean;
  PermissionsEditPublicDocuments: boolean;
  PermissionsViewEncryptedData: boolean;
  PermissionsEditBrandTemplates: boolean;
  PermissionsEditHtmlTemplates: boolean;
  PermissionsChatterInternalUser: boolean;
  PermissionsDeleteActivatedContract: boolean;
  PermissionsChatterInviteExternalUsers: boolean;
  PermissionsSendSitRequests: boolean;
  PermissionsApiUserOnly: boolean;
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
  PermissionsInboundMigrationToolsUser: boolean;
  PermissionsSolutionImport: boolean;
  PermissionsManageCallCenters: boolean;
  PermissionsPortalSuperUser: boolean;
  PermissionsManageSynonyms: boolean;
  PermissionsOutboundMigrationToolsUser: boolean;
  PermissionsDelegatedPortalUserAdmin: boolean;
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
  PermissionsScheduleJob: boolean;
  PermissionsManageExchangeConfig: boolean;
  PermissionsManageAnalyticSnapshots: boolean;
  PermissionsScheduleReports: boolean;
  PermissionsManageBusinessHourHolidays: boolean;
  PermissionsManageEntitlements: boolean;
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
  PermissionsViewCaseInteraction: boolean;
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
  PermissionsBypassEmailApproval: boolean;
  PermissionsAllowUniversalSearch: boolean;
  PermissionsConnectOrgToEnvironmentHub: boolean;
  PermissionsCreateCustomizeFilters: boolean;
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
  PermissionsInsightsAppDashboardEditor: boolean;
  PermissionsManageTwoFactor: boolean;
  PermissionsInsightsAppUser: boolean;
  PermissionsInsightsAppAdmin: boolean;
  PermissionsInsightsAppEltEditor: boolean;
  PermissionsInsightsAppUploadUser: boolean;
  PermissionsInsightsCreateApplication: boolean;
  PermissionsLightningExperienceUser: boolean;
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
  PermissionsWaveTrendReports: boolean;
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
  PermissionsShowCompanyNameAsUserBadge: boolean;
  PermissionsAccessCMC: boolean;
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
};

type ParentReferences$PermissionSet = {
  //
  License: SObjectDefinition$Name | null;
  Profile: SObjectDefinition$Profile | null;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$PermissionSet = {
  //
  FieldPerms: SObjectDefinition$FieldPermissions;
  ObjectPerms: SObjectDefinition$ObjectPermissions;
  Assignments: SObjectDefinition$PermissionSetAssignment;
  SessionActivations: SObjectDefinition$SessionPermSetActivation;
  SetupEntityAccessItems: SObjectDefinition$SetupEntityAccess;
};

interface SObjectDefinition$PermissionSet
  extends SObjectDefinition<'PermissionSet'> {
  Name: 'PermissionSet';
  Fields: Fields$PermissionSet;
  ParentReferences: ParentReferences$PermissionSet;
  ChildRelationships: ChildRelationships$PermissionSet;
}

type Fields$PermissionSetAssignment = {
  //
  Id: string;
  PermissionSetId: string | null;
  AssigneeId: string;
  SystemModstamp: DateString;
};

type ParentReferences$PermissionSetAssignment = {
  //
  PermissionSet: SObjectDefinition$PermissionSet | null;
  Assignee: SObjectDefinition$User;
};

type ChildRelationships$PermissionSetAssignment = {
  //
};

interface SObjectDefinition$PermissionSetAssignment
  extends SObjectDefinition<'PermissionSetAssignment'> {
  Name: 'PermissionSetAssignment';
  Fields: Fields$PermissionSetAssignment;
  ParentReferences: ParentReferences$PermissionSetAssignment;
  ChildRelationships: ChildRelationships$PermissionSetAssignment;
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
  MaximumPermissionsManageCssUsers: boolean;
  MaximumPermissionsActivateContract: boolean;
  MaximumPermissionsActivateOrder: boolean;
  MaximumPermissionsImportLeads: boolean;
  MaximumPermissionsManageLeads: boolean;
  MaximumPermissionsTransferAnyLead: boolean;
  MaximumPermissionsViewAllData: boolean;
  MaximumPermissionsEditPublicDocuments: boolean;
  MaximumPermissionsViewEncryptedData: boolean;
  MaximumPermissionsEditBrandTemplates: boolean;
  MaximumPermissionsEditHtmlTemplates: boolean;
  MaximumPermissionsChatterInternalUser: boolean;
  MaximumPermissionsDeleteActivatedContract: boolean;
  MaximumPermissionsChatterInviteExternalUsers: boolean;
  MaximumPermissionsSendSitRequests: boolean;
  MaximumPermissionsApiUserOnly: boolean;
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
  MaximumPermissionsInboundMigrationToolsUser: boolean;
  MaximumPermissionsSolutionImport: boolean;
  MaximumPermissionsManageCallCenters: boolean;
  MaximumPermissionsPortalSuperUser: boolean;
  MaximumPermissionsManageSynonyms: boolean;
  MaximumPermissionsOutboundMigrationToolsUser: boolean;
  MaximumPermissionsDelegatedPortalUserAdmin: boolean;
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
  MaximumPermissionsScheduleJob: boolean;
  MaximumPermissionsManageExchangeConfig: boolean;
  MaximumPermissionsManageAnalyticSnapshots: boolean;
  MaximumPermissionsScheduleReports: boolean;
  MaximumPermissionsManageBusinessHourHolidays: boolean;
  MaximumPermissionsManageEntitlements: boolean;
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
  MaximumPermissionsViewCaseInteraction: boolean;
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
  MaximumPermissionsBypassEmailApproval: boolean;
  MaximumPermissionsAllowUniversalSearch: boolean;
  MaximumPermissionsConnectOrgToEnvironmentHub: boolean;
  MaximumPermissionsCreateCustomizeFilters: boolean;
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
  MaximumPermissionsInsightsAppDashboardEditor: boolean;
  MaximumPermissionsManageTwoFactor: boolean;
  MaximumPermissionsInsightsAppUser: boolean;
  MaximumPermissionsInsightsAppAdmin: boolean;
  MaximumPermissionsInsightsAppEltEditor: boolean;
  MaximumPermissionsInsightsAppUploadUser: boolean;
  MaximumPermissionsInsightsCreateApplication: boolean;
  MaximumPermissionsLightningExperienceUser: boolean;
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
  MaximumPermissionsWaveTrendReports: boolean;
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
  MaximumPermissionsShowCompanyNameAsUserBadge: boolean;
  MaximumPermissionsAccessCMC: boolean;
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

interface SObjectDefinition$PermissionSetLicense
  extends SObjectDefinition<'PermissionSetLicense'> {
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

interface SObjectDefinition$PermissionSetLicenseAssign
  extends SObjectDefinition<'PermissionSetLicenseAssign'> {
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

interface SObjectDefinition$PicklistValueInfo
  extends SObjectDefinition<'PicklistValueInfo'> {
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

interface SObjectDefinition$PlatformAction
  extends SObjectDefinition<'PlatformAction'> {
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

interface SObjectDefinition$PlatformCachePartition
  extends SObjectDefinition<'PlatformCachePartition'> {
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

interface SObjectDefinition$PlatformCachePartitionType
  extends SObjectDefinition<'PlatformCachePartitionType'> {
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
  Opportunities: SObjectDefinition$Opportunity;
  Orders: SObjectDefinition$Order;
  Histories: SObjectDefinition$Pricebook2History;
  PricebookEntries: SObjectDefinition$PricebookEntry;
  RecordActions: SObjectDefinition$RecordAction;
  ServiceContracts: SObjectDefinition$ServiceContract;
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

interface SObjectDefinition$Pricebook2History
  extends SObjectDefinition<'Pricebook2History'> {
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
  ContractLineItems: SObjectDefinition$ContractLineItem;
  OpportunityLineItems: SObjectDefinition$OpportunityLineItem;
  OrderItems: SObjectDefinition$OrderItem;
  RecordActions: SObjectDefinition$RecordAction;
  WorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
};

interface SObjectDefinition$PricebookEntry
  extends SObjectDefinition<'PricebookEntry'> {
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

interface SObjectDefinition$ProcessDefinition
  extends SObjectDefinition<'ProcessDefinition'> {
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

interface SObjectDefinition$ProcessInstance
  extends SObjectDefinition<'ProcessInstance'> {
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

interface SObjectDefinition$ProcessInstanceHistory
  extends SObjectDefinition<'ProcessInstanceHistory'> {
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

interface SObjectDefinition$ProcessInstanceNode
  extends SObjectDefinition<'ProcessInstanceNode'> {
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

interface SObjectDefinition$ProcessInstanceStep
  extends SObjectDefinition<'ProcessInstanceStep'> {
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

interface SObjectDefinition$ProcessInstanceWorkitem
  extends SObjectDefinition<'ProcessInstanceWorkitem'> {
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

interface SObjectDefinition$ProcessNode
  extends SObjectDefinition<'ProcessNode'> {
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
  Cases: SObjectDefinition$Case;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContractLineItems: SObjectDefinition$ContractLineItem;
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
  RecordActions: SObjectDefinition$RecordAction;
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

interface SObjectDefinition$Product2ChangeEvent
  extends SObjectDefinition<'Product2ChangeEvent'> {
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

interface SObjectDefinition$Product2Feed
  extends SObjectDefinition<'Product2Feed'> {
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

interface SObjectDefinition$Product2History
  extends SObjectDefinition<'Product2History'> {
  Name: 'Product2History';
  Fields: Fields$Product2History;
  ParentReferences: ParentReferences$Product2History;
  ChildRelationships: ChildRelationships$Product2History;
}

type Fields$ProductEntitlementTemplate = {
  //
  Id: string;
  Product2Id: string;
  EntitlementTemplateId: string;
  SystemModstamp: DateString;
  CreatedDate: DateString;
  CreatedById: string;
};

type ParentReferences$ProductEntitlementTemplate = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProductEntitlementTemplate = {
  //
};

interface SObjectDefinition$ProductEntitlementTemplate
  extends SObjectDefinition<'ProductEntitlementTemplate'> {
  Name: 'ProductEntitlementTemplate';
  Fields: Fields$ProductEntitlementTemplate;
  ParentReferences: ParentReferences$ProductEntitlementTemplate;
  ChildRelationships: ChildRelationships$ProductEntitlementTemplate;
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
  PermissionsManageCssUsers: boolean;
  PermissionsActivateContract: boolean;
  PermissionsActivateOrder: boolean;
  PermissionsImportLeads: boolean;
  PermissionsManageLeads: boolean;
  PermissionsTransferAnyLead: boolean;
  PermissionsViewAllData: boolean;
  PermissionsEditPublicDocuments: boolean;
  PermissionsViewEncryptedData: boolean;
  PermissionsEditBrandTemplates: boolean;
  PermissionsEditHtmlTemplates: boolean;
  PermissionsChatterInternalUser: boolean;
  PermissionsDeleteActivatedContract: boolean;
  PermissionsChatterInviteExternalUsers: boolean;
  PermissionsSendSitRequests: boolean;
  PermissionsApiUserOnly: boolean;
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
  PermissionsInboundMigrationToolsUser: boolean;
  PermissionsSolutionImport: boolean;
  PermissionsManageCallCenters: boolean;
  PermissionsPortalSuperUser: boolean;
  PermissionsManageSynonyms: boolean;
  PermissionsOutboundMigrationToolsUser: boolean;
  PermissionsDelegatedPortalUserAdmin: boolean;
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
  PermissionsScheduleJob: boolean;
  PermissionsManageExchangeConfig: boolean;
  PermissionsManageAnalyticSnapshots: boolean;
  PermissionsScheduleReports: boolean;
  PermissionsManageBusinessHourHolidays: boolean;
  PermissionsManageEntitlements: boolean;
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
  PermissionsViewCaseInteraction: boolean;
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
  PermissionsBypassEmailApproval: boolean;
  PermissionsAllowUniversalSearch: boolean;
  PermissionsConnectOrgToEnvironmentHub: boolean;
  PermissionsCreateCustomizeFilters: boolean;
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
  PermissionsInsightsAppDashboardEditor: boolean;
  PermissionsManageTwoFactor: boolean;
  PermissionsInsightsAppUser: boolean;
  PermissionsInsightsAppAdmin: boolean;
  PermissionsInsightsAppEltEditor: boolean;
  PermissionsInsightsAppUploadUser: boolean;
  PermissionsInsightsCreateApplication: boolean;
  PermissionsLightningExperienceUser: boolean;
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
  PermissionsWaveTrendReports: boolean;
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
  PermissionsShowCompanyNameAsUserBadge: boolean;
  PermissionsAccessCMC: boolean;
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
  Users: SObjectDefinition$User;
};

interface SObjectDefinition$Profile extends SObjectDefinition<'Profile'> {
  Name: 'Profile';
  Fields: Fields$Profile;
  ParentReferences: ParentReferences$Profile;
  ChildRelationships: ChildRelationships$Profile;
}

type Fields$ProfileSkill = {
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
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  UserCount: number | null;
  Description: string | null;
};

type ParentReferences$ProfileSkill = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProfileSkill = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProfileSkillFeed;
  Histories: SObjectDefinition$ProfileSkillHistory;
  ProfileSkillUserChildren: SObjectDefinition$ProfileSkillUser;
};

interface SObjectDefinition$ProfileSkill
  extends SObjectDefinition<'ProfileSkill'> {
  Name: 'ProfileSkill';
  Fields: Fields$ProfileSkill;
  ParentReferences: ParentReferences$ProfileSkill;
  ChildRelationships: ChildRelationships$ProfileSkill;
}

type Fields$ProfileSkillEndorsement = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ProfileSkillUserId: string;
  UserId: string | null;
};

type ParentReferences$ProfileSkillEndorsement = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ProfileSkillUser: SObjectDefinition$ProfileSkillUser;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$ProfileSkillEndorsement = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  Feeds: SObjectDefinition$ProfileSkillEndorsementFeed;
  Histories: SObjectDefinition$ProfileSkillEndorsementHistory;
};

interface SObjectDefinition$ProfileSkillEndorsement
  extends SObjectDefinition<'ProfileSkillEndorsement'> {
  Name: 'ProfileSkillEndorsement';
  Fields: Fields$ProfileSkillEndorsement;
  ParentReferences: ParentReferences$ProfileSkillEndorsement;
  ChildRelationships: ChildRelationships$ProfileSkillEndorsement;
}

type Fields$ProfileSkillEndorsementFeed = {
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

type ParentReferences$ProfileSkillEndorsementFeed = {
  //
  Parent: SObjectDefinition$ProfileSkillEndorsement;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProfileSkillEndorsementFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProfileSkillEndorsementFeed
  extends SObjectDefinition<'ProfileSkillEndorsementFeed'> {
  Name: 'ProfileSkillEndorsementFeed';
  Fields: Fields$ProfileSkillEndorsementFeed;
  ParentReferences: ParentReferences$ProfileSkillEndorsementFeed;
  ChildRelationships: ChildRelationships$ProfileSkillEndorsementFeed;
}

type Fields$ProfileSkillEndorsementHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProfileSkillEndorsementId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProfileSkillEndorsementHistory = {
  //
  ProfileSkillEndorsement: SObjectDefinition$ProfileSkillEndorsement;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProfileSkillEndorsementHistory = {
  //
};

interface SObjectDefinition$ProfileSkillEndorsementHistory
  extends SObjectDefinition<'ProfileSkillEndorsementHistory'> {
  Name: 'ProfileSkillEndorsementHistory';
  Fields: Fields$ProfileSkillEndorsementHistory;
  ParentReferences: ParentReferences$ProfileSkillEndorsementHistory;
  ChildRelationships: ChildRelationships$ProfileSkillEndorsementHistory;
}

type Fields$ProfileSkillFeed = {
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

type ParentReferences$ProfileSkillFeed = {
  //
  Parent: SObjectDefinition$ProfileSkill;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProfileSkillFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProfileSkillFeed
  extends SObjectDefinition<'ProfileSkillFeed'> {
  Name: 'ProfileSkillFeed';
  Fields: Fields$ProfileSkillFeed;
  ParentReferences: ParentReferences$ProfileSkillFeed;
  ChildRelationships: ChildRelationships$ProfileSkillFeed;
}

type Fields$ProfileSkillHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProfileSkillId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProfileSkillHistory = {
  //
  ProfileSkill: SObjectDefinition$ProfileSkill;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProfileSkillHistory = {
  //
};

interface SObjectDefinition$ProfileSkillHistory
  extends SObjectDefinition<'ProfileSkillHistory'> {
  Name: 'ProfileSkillHistory';
  Fields: Fields$ProfileSkillHistory;
  ParentReferences: ParentReferences$ProfileSkillHistory;
  ChildRelationships: ChildRelationships$ProfileSkillHistory;
}

type Fields$ProfileSkillShare = {
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

type ParentReferences$ProfileSkillShare = {
  //
  Parent: SObjectDefinition$ProfileSkill;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ProfileSkillShare = {
  //
};

interface SObjectDefinition$ProfileSkillShare
  extends SObjectDefinition<'ProfileSkillShare'> {
  Name: 'ProfileSkillShare';
  Fields: Fields$ProfileSkillShare;
  ParentReferences: ParentReferences$ProfileSkillShare;
  ChildRelationships: ChildRelationships$ProfileSkillShare;
}

type Fields$ProfileSkillUser = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  ProfileSkillId: string;
  UserId: string | null;
  EndorsementCount: number | null;
};

type ParentReferences$ProfileSkillUser = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ProfileSkill: SObjectDefinition$ProfileSkill;
  User: SObjectDefinition$User | null;
};

type ChildRelationships$ProfileSkillUser = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  ProfileSkillUserEndorsements: SObjectDefinition$ProfileSkillEndorsement;
  Feeds: SObjectDefinition$ProfileSkillUserFeed;
  Histories: SObjectDefinition$ProfileSkillUserHistory;
};

interface SObjectDefinition$ProfileSkillUser
  extends SObjectDefinition<'ProfileSkillUser'> {
  Name: 'ProfileSkillUser';
  Fields: Fields$ProfileSkillUser;
  ParentReferences: ParentReferences$ProfileSkillUser;
  ChildRelationships: ChildRelationships$ProfileSkillUser;
}

type Fields$ProfileSkillUserFeed = {
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

type ParentReferences$ProfileSkillUserFeed = {
  //
  Parent: SObjectDefinition$ProfileSkillUser;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ProfileSkillUserFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ProfileSkillUserFeed
  extends SObjectDefinition<'ProfileSkillUserFeed'> {
  Name: 'ProfileSkillUserFeed';
  Fields: Fields$ProfileSkillUserFeed;
  ParentReferences: ParentReferences$ProfileSkillUserFeed;
  ChildRelationships: ChildRelationships$ProfileSkillUserFeed;
}

type Fields$ProfileSkillUserHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ProfileSkillUserId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ProfileSkillUserHistory = {
  //
  ProfileSkillUser: SObjectDefinition$ProfileSkillUser;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ProfileSkillUserHistory = {
  //
};

interface SObjectDefinition$ProfileSkillUserHistory
  extends SObjectDefinition<'ProfileSkillUserHistory'> {
  Name: 'ProfileSkillUserHistory';
  Fields: Fields$ProfileSkillUserHistory;
  ParentReferences: ParentReferences$ProfileSkillUserHistory;
  ChildRelationships: ChildRelationships$ProfileSkillUserHistory;
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

interface SObjectDefinition$QueueSobject
  extends SObjectDefinition<'QueueSobject'> {
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

interface SObjectDefinition$QuickTextHistory
  extends SObjectDefinition<'QuickTextHistory'> {
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

interface SObjectDefinition$QuickTextShare
  extends SObjectDefinition<'QuickTextShare'> {
  Name: 'QuickTextShare';
  Fields: Fields$QuickTextShare;
  ParentReferences: ParentReferences$QuickTextShare;
  ChildRelationships: ChildRelationships$QuickTextShare;
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

interface SObjectDefinition$RecentlyViewed
  extends SObjectDefinition<'RecentlyViewed'> {
  Name: 'RecentlyViewed';
  Fields: Fields$RecentlyViewed;
  ParentReferences: ParentReferences$RecentlyViewed;
  ChildRelationships: ChildRelationships$RecentlyViewed;
}

type Fields$RecordAction = {
  //
  Id: string;
  IsDeleted: boolean;
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

interface SObjectDefinition$RecordAction
  extends SObjectDefinition<'RecordAction'> {
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

interface SObjectDefinition$RelationshipDomain
  extends SObjectDefinition<'RelationshipDomain'> {
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

interface SObjectDefinition$RelationshipInfo
  extends SObjectDefinition<'RelationshipInfo'> {
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

interface SObjectDefinition$SamlSsoConfig
  extends SObjectDefinition<'SamlSsoConfig'> {
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

type Fields$SearchActivity = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
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
  KbChannel: string;
  Period: string;
  ClickRank: number | null;
  ClickedRecordId: string | null;
  QueryLanguage: string;
  ClickedRecordName: string | null;
};

type ParentReferences$SearchActivity = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  ClickedRecord: SObjectDefinition$Knowledge__kav | null;
};

type ChildRelationships$SearchActivity = {
  //
};

interface SObjectDefinition$SearchActivity
  extends SObjectDefinition<'SearchActivity'> {
  Name: 'SearchActivity';
  Fields: Fields$SearchActivity;
  ParentReferences: ParentReferences$SearchActivity;
  ChildRelationships: ChildRelationships$SearchActivity;
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

interface SObjectDefinition$SearchLayout
  extends SObjectDefinition<'SearchLayout'> {
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
  PromotedEntityId: string | null;
};

type ParentReferences$SearchPromotionRule = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  PromotedEntity: SObjectDefinition$Knowledge__kav | null;
};

type ChildRelationships$SearchPromotionRule = {
  //
};

interface SObjectDefinition$SearchPromotionRule
  extends SObjectDefinition<'SearchPromotionRule'> {
  Name: 'SearchPromotionRule';
  Fields: Fields$SearchPromotionRule;
  ParentReferences: ParentReferences$SearchPromotionRule;
  ChildRelationships: ChildRelationships$SearchPromotionRule;
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

interface SObjectDefinition$SecureAgentsCluster
  extends SObjectDefinition<'SecureAgentsCluster'> {
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

interface SObjectDefinition$SecurityCustomBaseline
  extends SObjectDefinition<'SecurityCustomBaseline'> {
  Name: 'SecurityCustomBaseline';
  Fields: Fields$SecurityCustomBaseline;
  ParentReferences: ParentReferences$SecurityCustomBaseline;
  ChildRelationships: ChildRelationships$SecurityCustomBaseline;
}

type Fields$ServiceContract = {
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
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  AccountId: string | null;
  ContactId: string | null;
  Term: number | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  ActivationDate: DateString | null;
  ApprovalStatus: string | null;
  Description: string | null;
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
  Pricebook2Id: string | null;
  ShippingHandling: number | null;
  Tax: number | null;
  Subtotal: number | null;
  TotalPrice: number | null;
  LineItemCount: number | null;
  ContractNumber: string;
  SpecialTerms: string | null;
  Discount: number | null;
  GrandTotal: number | null;
  Status: string | null;
  ParentServiceContractId: string | null;
  RootServiceContractId: string | null;
};

type ParentReferences$ServiceContract = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account | null;
  Contact: SObjectDefinition$Contact | null;
  Pricebook2: SObjectDefinition$Pricebook2 | null;
  ParentServiceContract: SObjectDefinition$ServiceContract | null;
  RootServiceContract: SObjectDefinition$ServiceContract | null;
};

type ChildRelationships$ServiceContract = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  ContractLineItems: SObjectDefinition$ContractLineItem;
  Emails: SObjectDefinition$EmailMessage;
  Entitlements: SObjectDefinition$Entitlement;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  ChildServiceContracts: SObjectDefinition$ServiceContract;
  DescendantServiceContracts: SObjectDefinition$ServiceContract;
  Feeds: SObjectDefinition$ServiceContractFeed;
  Histories: SObjectDefinition$ServiceContractHistory;
  Tasks: SObjectDefinition$Task;
  WorkOrders: SObjectDefinition$WorkOrder;
};

interface SObjectDefinition$ServiceContract
  extends SObjectDefinition<'ServiceContract'> {
  Name: 'ServiceContract';
  Fields: Fields$ServiceContract;
  ParentReferences: ParentReferences$ServiceContract;
  ChildRelationships: ChildRelationships$ServiceContract;
}

type Fields$ServiceContractChangeEvent = {
  //
  Id: string | null;
  ReplayId: string | null;
  ChangeEventHeader: any;
  OwnerId: string | null;
  Name: string | null;
  CreatedDate: DateString | null;
  CreatedById: string | null;
  LastModifiedDate: DateString | null;
  LastModifiedById: string | null;
  AccountId: string | null;
  ContactId: string | null;
  Term: number | null;
  StartDate: DateString | null;
  EndDate: DateString | null;
  ActivationDate: DateString | null;
  ApprovalStatus: string | null;
  Description: string | null;
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
  Pricebook2Id: string | null;
  ShippingHandling: number | null;
  Tax: number | null;
  Subtotal: number | null;
  TotalPrice: number | null;
  LineItemCount: number | null;
  ContractNumber: string;
  SpecialTerms: string | null;
  ParentServiceContractId: string | null;
  RootServiceContractId: string | null;
};

type ParentReferences$ServiceContractChangeEvent = {
  //
};

type ChildRelationships$ServiceContractChangeEvent = {
  //
};

interface SObjectDefinition$ServiceContractChangeEvent
  extends SObjectDefinition<'ServiceContractChangeEvent'> {
  Name: 'ServiceContractChangeEvent';
  Fields: Fields$ServiceContractChangeEvent;
  ParentReferences: ParentReferences$ServiceContractChangeEvent;
  ChildRelationships: ChildRelationships$ServiceContractChangeEvent;
}

type Fields$ServiceContractFeed = {
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

type ParentReferences$ServiceContractFeed = {
  //
  Parent: SObjectDefinition$ServiceContract;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$ServiceContractFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$ServiceContractFeed
  extends SObjectDefinition<'ServiceContractFeed'> {
  Name: 'ServiceContractFeed';
  Fields: Fields$ServiceContractFeed;
  ParentReferences: ParentReferences$ServiceContractFeed;
  ChildRelationships: ChildRelationships$ServiceContractFeed;
}

type Fields$ServiceContractHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  ServiceContractId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$ServiceContractHistory = {
  //
  ServiceContract: SObjectDefinition$ServiceContract;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceContractHistory = {
  //
};

interface SObjectDefinition$ServiceContractHistory
  extends SObjectDefinition<'ServiceContractHistory'> {
  Name: 'ServiceContractHistory';
  Fields: Fields$ServiceContractHistory;
  ParentReferences: ParentReferences$ServiceContractHistory;
  ChildRelationships: ChildRelationships$ServiceContractHistory;
}

type Fields$ServiceContractShare = {
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

type ParentReferences$ServiceContractShare = {
  //
  Parent: SObjectDefinition$ServiceContract;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$ServiceContractShare = {
  //
};

interface SObjectDefinition$ServiceContractShare
  extends SObjectDefinition<'ServiceContractShare'> {
  Name: 'ServiceContractShare';
  Fields: Fields$ServiceContractShare;
  ParentReferences: ParentReferences$ServiceContractShare;
  ChildRelationships: ChildRelationships$ServiceContractShare;
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

interface SObjectDefinition$SessionPermSetActivation
  extends SObjectDefinition<'SessionPermSetActivation'> {
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

interface SObjectDefinition$SetupAuditTrail
  extends SObjectDefinition<'SetupAuditTrail'> {
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

interface SObjectDefinition$SetupEntityAccess
  extends SObjectDefinition<'SetupEntityAccess'> {
  Name: 'SetupEntityAccess';
  Fields: Fields$SetupEntityAccess;
  ParentReferences: ParentReferences$SetupEntityAccess;
  ChildRelationships: ChildRelationships$SetupEntityAccess;
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

interface SObjectDefinition$SiteHistory
  extends SObjectDefinition<'SiteHistory'> {
  Name: 'SiteHistory';
  Fields: Fields$SiteHistory;
  ParentReferences: ParentReferences$SiteHistory;
  ChildRelationships: ChildRelationships$SiteHistory;
}

type Fields$SlaProcess = {
  //
  Id: string;
  Name: string;
  NameNorm: string;
  Description: string | null;
  IsActive: boolean;
  StartDateField: string;
  SobjectType: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  IsDeleted: boolean;
  BusinessHoursId: string | null;
  LastViewedDate: DateString | null;
};

type ParentReferences$SlaProcess = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  BusinessHours: SObjectDefinition$BusinessHours | null;
};

type ChildRelationships$SlaProcess = {
  //
  EntityMilestones: SObjectDefinition$EntityMilestone;
};

interface SObjectDefinition$SlaProcess extends SObjectDefinition<'SlaProcess'> {
  Name: 'SlaProcess';
  Fields: Fields$SlaProcess;
  ParentReferences: ParentReferences$SlaProcess;
  ChildRelationships: ChildRelationships$SlaProcess;
}

type Fields$SocialPersona = {
  //
  Id: string;
  IsDeleted: boolean;
  Name: string;
  CreatedDate: DateString;
  CreatedById: string;
  LastModifiedDate: DateString;
  LastModifiedById: string;
  SystemModstamp: DateString;
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentId: string;
  Provider: string;
  ExternalId: string | null;
  IsDefault: boolean;
  ExternalPictureURL: string | null;
  ProfileUrl: string | null;
  TopicType: string | null;
  IsBlacklisted: boolean;
  Klout: number | null;
  RealName: string | null;
  IsFollowingUs: boolean;
  AreWeFollowing: boolean;
  MediaType: string | null;
  Bio: string | null;
  Followers: number | null;
  Following: number | null;
  NumberOfFriends: number | null;
  ListedCount: number | null;
  MediaProvider: string | null;
  ProfileType: string | null;
  R6SourceId: string | null;
  NumberOfTweets: number | null;
  SourceApp: string | null;
  AuthorLabels: string | null;
  IsVerified: boolean;
  InfluencerScore: number | null;
};

type ParentReferences$SocialPersona = {
  //
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$Name;
};

type ChildRelationships$SocialPersona = {
  //
  RecordActions: SObjectDefinition$RecordAction;
  Histories: SObjectDefinition$SocialPersonaHistory;
  Posts: SObjectDefinition$SocialPost;
};

interface SObjectDefinition$SocialPersona
  extends SObjectDefinition<'SocialPersona'> {
  Name: 'SocialPersona';
  Fields: Fields$SocialPersona;
  ParentReferences: ParentReferences$SocialPersona;
  ChildRelationships: ChildRelationships$SocialPersona;
}

type Fields$SocialPersonaHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  SocialPersonaId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$SocialPersonaHistory = {
  //
  SocialPersona: SObjectDefinition$SocialPersona;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SocialPersonaHistory = {
  //
};

interface SObjectDefinition$SocialPersonaHistory
  extends SObjectDefinition<'SocialPersonaHistory'> {
  Name: 'SocialPersonaHistory';
  Fields: Fields$SocialPersonaHistory;
  ParentReferences: ParentReferences$SocialPersonaHistory;
  ChildRelationships: ChildRelationships$SocialPersonaHistory;
}

type Fields$SocialPost = {
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
  LastViewedDate: DateString | null;
  LastReferencedDate: DateString | null;
  ParentId: string | null;
  PersonaId: string | null;
  WhoId: string | null;
  ReplyToId: string | null;
  Headline: string | null;
  Content: string | null;
  Posted: DateString;
  PostUrl: string | null;
  Provider: string | null;
  Handle: string | null;
  SpamRating: string | null;
  MediaType: string | null;
  MediaProvider: string | null;
  Sentiment: string | null;
  PostPriority: string | null;
  Status: string | null;
  StatusMessage: string | null;
  Recipient: string | null;
  RecipientType: string | null;
  MessageType: string | null;
  R6PostId: string | null;
  R6TopicId: string | null;
  R6SourceId: string | null;
  TopicType: string | null;
  ExternalPostId: string | null;
  HarvestDate: DateString | null;
  IsOutbound: boolean;
  PostTags: string | null;
  SourceTags: string | null;
  Classification: string | null;
  ThreadSize: number | null;
  CommentCount: number | null;
  Shares: number | null;
  ViewCount: number | null;
  InboundLinkCount: number | null;
  UniqueCommentors: number | null;
  LikesAndVotes: number | null;
  TopicProfileName: string | null;
  KeywordGroupName: string | null;
  EngagementLevel: string | null;
  AssignedTo: string | null;
  OutboundSocialAccountId: string | null;
  ReviewedStatus: string | null;
  AttachmentUrl: string | null;
  AttachmentType: string | null;
  DeletedById: string | null;
  ResponseContextExternalId: string | null;
  LikedBy: string | null;
  AnalyzerScore: number | null;
  Language: string | null;
  ReviewScore: number | null;
  ReviewScale: number | null;
  HiddenById: string | null;
  Notes: string | null;
  TruncatedContent: string | null;
};

type ParentReferences$SocialPost = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Parent: SObjectDefinition$Case | null;
  Persona: SObjectDefinition$SocialPersona | null;
  Who: SObjectDefinition$Name | null;
  ReplyTo: SObjectDefinition$SocialPost | null;
  OutboundSocialAccount: SObjectDefinition$ExternalSocialAccount | null;
  DeletedBy: SObjectDefinition$User | null;
  HiddenBy: SObjectDefinition$User | null;
};

type ChildRelationships$SocialPost = {
  //
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Personas: SObjectDefinition$SocialPersona;
  Replies: SObjectDefinition$SocialPost;
  Feeds: SObjectDefinition$SocialPostFeed;
  Histories: SObjectDefinition$SocialPostHistory;
};

interface SObjectDefinition$SocialPost extends SObjectDefinition<'SocialPost'> {
  Name: 'SocialPost';
  Fields: Fields$SocialPost;
  ParentReferences: ParentReferences$SocialPost;
  ChildRelationships: ChildRelationships$SocialPost;
}

type Fields$SocialPostFeed = {
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

type ParentReferences$SocialPostFeed = {
  //
  Parent: SObjectDefinition$SocialPost;
  CreatedBy: SObjectDefinition$User;
  InsertedBy: SObjectDefinition$User | null;
};

type ChildRelationships$SocialPostFeed = {
  //
  FeedAttachments: SObjectDefinition$FeedAttachment;
  FeedComments: SObjectDefinition$FeedComment;
  FeedLikes: SObjectDefinition$FeedLike;
  FeedSignals: SObjectDefinition$FeedSignal;
  FeedTrackedChanges: SObjectDefinition$FeedTrackedChange;
};

interface SObjectDefinition$SocialPostFeed
  extends SObjectDefinition<'SocialPostFeed'> {
  Name: 'SocialPostFeed';
  Fields: Fields$SocialPostFeed;
  ParentReferences: ParentReferences$SocialPostFeed;
  ChildRelationships: ChildRelationships$SocialPostFeed;
}

type Fields$SocialPostHistory = {
  //
  Id: string;
  IsDeleted: boolean;
  SocialPostId: string;
  CreatedById: string;
  CreatedDate: DateString;
  Field: string;
  OldValue: string | null;
  NewValue: string | null;
};

type ParentReferences$SocialPostHistory = {
  //
  SocialPost: SObjectDefinition$SocialPost;
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$SocialPostHistory = {
  //
};

interface SObjectDefinition$SocialPostHistory
  extends SObjectDefinition<'SocialPostHistory'> {
  Name: 'SocialPostHistory';
  Fields: Fields$SocialPostHistory;
  ParentReferences: ParentReferences$SocialPostHistory;
  ChildRelationships: ChildRelationships$SocialPostHistory;
}

type Fields$SocialPostShare = {
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

type ParentReferences$SocialPostShare = {
  //
  Parent: SObjectDefinition$SocialPost;
  UserOrGroup: SObjectDefinition$Name;
  LastModifiedBy: SObjectDefinition$User;
};

type ChildRelationships$SocialPostShare = {
  //
};

interface SObjectDefinition$SocialPostShare
  extends SObjectDefinition<'SocialPostShare'> {
  Name: 'SocialPostShare';
  Fields: Fields$SocialPostShare;
  ParentReferences: ParentReferences$SocialPostShare;
  ChildRelationships: ChildRelationships$SocialPostShare;
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

interface SObjectDefinition$SolutionFeed
  extends SObjectDefinition<'SolutionFeed'> {
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

interface SObjectDefinition$SolutionHistory
  extends SObjectDefinition<'SolutionHistory'> {
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

interface SObjectDefinition$SolutionStatus
  extends SObjectDefinition<'SolutionStatus'> {
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

interface SObjectDefinition$SourceChangeNotification
  extends SObjectDefinition<'SourceChangeNotification'> {
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

interface SObjectDefinition$StampAssignment
  extends SObjectDefinition<'StampAssignment'> {
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

interface SObjectDefinition$StaticResource
  extends SObjectDefinition<'StaticResource'> {
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

interface SObjectDefinition$StreamingChannel
  extends SObjectDefinition<'StreamingChannel'> {
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

interface SObjectDefinition$StreamingChannelShare
  extends SObjectDefinition<'StreamingChannelShare'> {
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

interface SObjectDefinition$TabDefinition
  extends SObjectDefinition<'TabDefinition'> {
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

interface SObjectDefinition$TaskChangeEvent
  extends SObjectDefinition<'TaskChangeEvent'> {
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

interface SObjectDefinition$TaskPriority
  extends SObjectDefinition<'TaskPriority'> {
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

interface SObjectDefinition$TenantUsageEntitlement
  extends SObjectDefinition<'TenantUsageEntitlement'> {
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

interface SObjectDefinition$TestSuiteMembership
  extends SObjectDefinition<'TestSuiteMembership'> {
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

interface SObjectDefinition$ThirdPartyAccountLink
  extends SObjectDefinition<'ThirdPartyAccountLink'> {
  Name: 'ThirdPartyAccountLink';
  Fields: Fields$ThirdPartyAccountLink;
  ParentReferences: ParentReferences$ThirdPartyAccountLink;
  ChildRelationships: ChildRelationships$ThirdPartyAccountLink;
}

type Fields$TodayGoal = {
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

interface SObjectDefinition$TodayGoalShare
  extends SObjectDefinition<'TodayGoalShare'> {
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

interface SObjectDefinition$TopicAssignment
  extends SObjectDefinition<'TopicAssignment'> {
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

interface SObjectDefinition$TopicUserEvent
  extends SObjectDefinition<'TopicUserEvent'> {
  Name: 'TopicUserEvent';
  Fields: Fields$TopicUserEvent;
  ParentReferences: ParentReferences$TopicUserEvent;
  ChildRelationships: ChildRelationships$TopicUserEvent;
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

interface SObjectDefinition$UndecidedEventRelation
  extends SObjectDefinition<'UndecidedEventRelation'> {
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
  UserPermissionsAvantgoUser: boolean;
  UserPermissionsCallCenterAutoLogin: boolean;
  UserPermissionsMobileUser: boolean;
  UserPermissionsSFContentUser: boolean;
  UserPermissionsKnowledgeUser: boolean;
  UserPermissionsInteractionUser: boolean;
  UserPermissionsSupportUser: boolean;
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
  PortalRole: string | null;
  IsPortalEnabled: boolean;
  IsPortalSelfRegistered: boolean;
  FederationIdentifier: string | null;
  AboutMe: string | null;
  FullPhotoUrl: string | null;
  SmallPhotoUrl: string | null;
  IsExtIndicatorVisible: boolean;
  OutOfOfficeMessage: string | null;
  MediumPhotoUrl: string | null;
  DigestFrequency: string;
  DefaultGroupNotificationFrequency: string;
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
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  GroupMemberships: SObjectDefinition$CollaborationGroupMember;
  GroupMembershipRequests: SObjectDefinition$CollaborationGroupMemberRequest;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
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
  OutgoingEmailRelations: SObjectDefinition$OutgoingEmailRelation;
  OwnedContentDocuments: SObjectDefinition$OwnedContentDocument;
  PermissionSetAssignments: SObjectDefinition$PermissionSetAssignment;
  PermissionSetLicenseAssignments: SObjectDefinition$PermissionSetLicenseAssign;
  UserProfileSkillUserEndorsements: SObjectDefinition$ProfileSkillEndorsement;
  UserProfileSkillChildren: SObjectDefinition$ProfileSkillUser;
  RecordActions: SObjectDefinition$RecordAction;
  SessionPermSetActivations: SObjectDefinition$SessionPermSetActivation;
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

interface SObjectDefinition$UserAppInfo
  extends SObjectDefinition<'UserAppInfo'> {
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

interface SObjectDefinition$UserAppMenuCustomization
  extends SObjectDefinition<'UserAppMenuCustomization'> {
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

interface SObjectDefinition$UserAppMenuCustomizationShare
  extends SObjectDefinition<'UserAppMenuCustomizationShare'> {
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

interface SObjectDefinition$UserAppMenuItem
  extends SObjectDefinition<'UserAppMenuItem'> {
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
  UserPermissionsAvantgoUser: boolean;
  UserPermissionsCallCenterAutoLogin: boolean;
  UserPermissionsMobileUser: boolean;
  UserPermissionsSFContentUser: boolean;
  UserPermissionsKnowledgeUser: boolean;
  UserPermissionsInteractionUser: boolean;
  UserPermissionsSupportUser: boolean;
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
  IsPortalSelfRegistered: boolean;
  FederationIdentifier: string | null;
  AboutMe: string | null;
  DigestFrequency: string | null;
  DefaultGroupNotificationFrequency: string | null;
  IsProfilePhotoActive: boolean;
  IndividualId: string | null;
};

type ParentReferences$UserChangeEvent = {
  //
};

type ChildRelationships$UserChangeEvent = {
  //
};

interface SObjectDefinition$UserChangeEvent
  extends SObjectDefinition<'UserChangeEvent'> {
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

interface SObjectDefinition$UserEntityAccess
  extends SObjectDefinition<'UserEntityAccess'> {
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

interface SObjectDefinition$UserFieldAccess
  extends SObjectDefinition<'UserFieldAccess'> {
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

interface SObjectDefinition$UserLicense
  extends SObjectDefinition<'UserLicense'> {
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

interface SObjectDefinition$UserListView
  extends SObjectDefinition<'UserListView'> {
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

interface SObjectDefinition$UserListViewCriterion
  extends SObjectDefinition<'UserListViewCriterion'> {
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

interface SObjectDefinition$UserPackageLicense
  extends SObjectDefinition<'UserPackageLicense'> {
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
  PermissionsManageCssUsers: boolean;
  PermissionsActivateContract: boolean;
  PermissionsActivateOrder: boolean;
  PermissionsImportLeads: boolean;
  PermissionsManageLeads: boolean;
  PermissionsTransferAnyLead: boolean;
  PermissionsViewAllData: boolean;
  PermissionsEditPublicDocuments: boolean;
  PermissionsViewEncryptedData: boolean;
  PermissionsEditBrandTemplates: boolean;
  PermissionsEditHtmlTemplates: boolean;
  PermissionsChatterInternalUser: boolean;
  PermissionsDeleteActivatedContract: boolean;
  PermissionsChatterInviteExternalUsers: boolean;
  PermissionsSendSitRequests: boolean;
  PermissionsApiUserOnly: boolean;
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
  PermissionsInboundMigrationToolsUser: boolean;
  PermissionsSolutionImport: boolean;
  PermissionsManageCallCenters: boolean;
  PermissionsPortalSuperUser: boolean;
  PermissionsManageSynonyms: boolean;
  PermissionsOutboundMigrationToolsUser: boolean;
  PermissionsDelegatedPortalUserAdmin: boolean;
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
  PermissionsScheduleJob: boolean;
  PermissionsManageExchangeConfig: boolean;
  PermissionsManageAnalyticSnapshots: boolean;
  PermissionsScheduleReports: boolean;
  PermissionsManageBusinessHourHolidays: boolean;
  PermissionsManageEntitlements: boolean;
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
  PermissionsViewCaseInteraction: boolean;
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
  PermissionsBypassEmailApproval: boolean;
  PermissionsAllowUniversalSearch: boolean;
  PermissionsConnectOrgToEnvironmentHub: boolean;
  PermissionsCreateCustomizeFilters: boolean;
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
  PermissionsInsightsAppDashboardEditor: boolean;
  PermissionsManageTwoFactor: boolean;
  PermissionsInsightsAppUser: boolean;
  PermissionsInsightsAppAdmin: boolean;
  PermissionsInsightsAppEltEditor: boolean;
  PermissionsInsightsAppUploadUser: boolean;
  PermissionsInsightsCreateApplication: boolean;
  PermissionsLightningExperienceUser: boolean;
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
  PermissionsWaveTrendReports: boolean;
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
  PermissionsShowCompanyNameAsUserBadge: boolean;
  PermissionsAccessCMC: boolean;
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

interface SObjectDefinition$UserPermissionAccess
  extends SObjectDefinition<'UserPermissionAccess'> {
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

interface SObjectDefinition$UserPreference
  extends SObjectDefinition<'UserPreference'> {
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

interface SObjectDefinition$UserProvAccount
  extends SObjectDefinition<'UserProvAccount'> {
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

interface SObjectDefinition$UserProvAccountStaging
  extends SObjectDefinition<'UserProvAccountStaging'> {
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

interface SObjectDefinition$UserProvMockTarget
  extends SObjectDefinition<'UserProvMockTarget'> {
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

interface SObjectDefinition$UserProvisioningConfig
  extends SObjectDefinition<'UserProvisioningConfig'> {
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

interface SObjectDefinition$UserProvisioningLog
  extends SObjectDefinition<'UserProvisioningLog'> {
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

interface SObjectDefinition$UserProvisioningRequest
  extends SObjectDefinition<'UserProvisioningRequest'> {
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

interface SObjectDefinition$UserProvisioningRequestShare
  extends SObjectDefinition<'UserProvisioningRequestShare'> {
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

interface SObjectDefinition$UserRecordAccess
  extends SObjectDefinition<'UserRecordAccess'> {
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
  PortalRole: string | null;
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

interface SObjectDefinition$VerificationHistory
  extends SObjectDefinition<'VerificationHistory'> {
  Name: 'VerificationHistory';
  Fields: Fields$VerificationHistory;
  ParentReferences: ParentReferences$VerificationHistory;
  ChildRelationships: ChildRelationships$VerificationHistory;
}

type Fields$VisibilityChangeNotification = {
  //
  ReplayId: string | null;
  CreatedDate: DateString;
  CreatedById: string;
  RecordId: string | null;
  KeyPrefix: string | null;
  ChangeType: string | null;
  ChangeTimestamp: DateString | null;
  ChangeTypeDetail: string | null;
};

type ParentReferences$VisibilityChangeNotification = {
  //
  CreatedBy: SObjectDefinition$User;
};

type ChildRelationships$VisibilityChangeNotification = {
  //
};

interface SObjectDefinition$VisibilityChangeNotification
  extends SObjectDefinition<'VisibilityChangeNotification'> {
  Name: 'VisibilityChangeNotification';
  Fields: Fields$VisibilityChangeNotification;
  ParentReferences: ParentReferences$VisibilityChangeNotification;
  ChildRelationships: ChildRelationships$VisibilityChangeNotification;
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

interface SObjectDefinition$VisualforceAccessMetrics
  extends SObjectDefinition<'VisualforceAccessMetrics'> {
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

interface SObjectDefinition$WaveAutoInstallRequest
  extends SObjectDefinition<'WaveAutoInstallRequest'> {
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

interface SObjectDefinition$WaveCompatibilityCheckItem
  extends SObjectDefinition<'WaveCompatibilityCheckItem'> {
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

interface SObjectDefinition$WorkAccessShare
  extends SObjectDefinition<'WorkAccessShare'> {
  Name: 'WorkAccessShare';
  Fields: Fields$WorkAccessShare;
  ParentReferences: ParentReferences$WorkAccessShare;
  ChildRelationships: ChildRelationships$WorkAccessShare;
}

type Fields$WorkBadge = {
  //
  Id: string;
  IsDeleted: boolean;
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

interface SObjectDefinition$WorkBadgeDefinition
  extends SObjectDefinition<'WorkBadgeDefinition'> {
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

interface SObjectDefinition$WorkBadgeDefinitionFeed
  extends SObjectDefinition<'WorkBadgeDefinitionFeed'> {
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

interface SObjectDefinition$WorkBadgeDefinitionHistory
  extends SObjectDefinition<'WorkBadgeDefinitionHistory'> {
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

interface SObjectDefinition$WorkBadgeDefinitionShare
  extends SObjectDefinition<'WorkBadgeDefinitionShare'> {
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
  EntitlementId: string | null;
  ServiceContractId: string | null;
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
  IsStopped: boolean;
  StopStartDate: DateString | null;
  SlaStartDate: DateString | null;
  SlaExitDate: DateString | null;
  BusinessHoursId: string | null;
  MilestoneStatus: string | null;
  Duration: number | null;
  DurationType: string | null;
  DurationInMinutes: number | null;
  ServiceAppointmentCount: number | null;
  StatusCategory: string | null;
};

type ParentReferences$WorkOrder = {
  //
  Owner: SObjectDefinition$Name;
  CreatedBy: SObjectDefinition$User;
  LastModifiedBy: SObjectDefinition$User;
  Account: SObjectDefinition$Account | null;
  Contact: SObjectDefinition$Contact | null;
  Case: SObjectDefinition$Case | null;
  Entitlement: SObjectDefinition$Entitlement | null;
  ServiceContract: SObjectDefinition$ServiceContract | null;
  Asset: SObjectDefinition$Asset | null;
  RootWorkOrder: SObjectDefinition$WorkOrder | null;
  Pricebook2: SObjectDefinition$Pricebook2 | null;
  ParentWorkOrder: SObjectDefinition$WorkOrder | null;
  BusinessHours: SObjectDefinition$BusinessHours | null;
};

type ChildRelationships$WorkOrder = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContactRequests: SObjectDefinition$ContactRequest;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  EntityMilestones: SObjectDefinition$EntityMilestone;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  LinkedArticles: SObjectDefinition$LinkedArticle;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
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

interface SObjectDefinition$WorkOrderFeed
  extends SObjectDefinition<'WorkOrderFeed'> {
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

interface SObjectDefinition$WorkOrderHistory
  extends SObjectDefinition<'WorkOrderHistory'> {
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
  Street: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  Country: string | null;
  Latitude: number | null;
  Longitude: number | null;
  GeocodeAccuracy: string | null;
  Address: Address | null;
  Subject: string | null;
  StatusCategory: string | null;
  IsClosed: boolean;
  Priority: string | null;
  ServiceAppointmentCount: number | null;
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
};

type ChildRelationships$WorkOrderLineItem = {
  //
  ActivityHistories: SObjectDefinition$ActivityHistory;
  AttachedContentDocuments: SObjectDefinition$AttachedContentDocument;
  Attachments: SObjectDefinition$Attachment;
  CombinedAttachments: SObjectDefinition$CombinedAttachment;
  ContentDocumentLinks: SObjectDefinition$ContentDocumentLink;
  Emails: SObjectDefinition$EmailMessage;
  FeedSubscriptionsForEntity: SObjectDefinition$EntitySubscription;
  Events: SObjectDefinition$Event;
  LinkedArticles: SObjectDefinition$LinkedArticle;
  Notes: SObjectDefinition$Note;
  NotesAndAttachments: SObjectDefinition$NoteAndAttachment;
  OpenActivities: SObjectDefinition$OpenActivity;
  ProcessInstances: SObjectDefinition$ProcessInstance;
  ProcessSteps: SObjectDefinition$ProcessInstanceHistory;
  RecordActions: SObjectDefinition$RecordAction;
  Tasks: SObjectDefinition$Task;
  TopicAssignments: SObjectDefinition$TopicAssignment;
  ChildWorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
  DescendantWorkOrderLineItems: SObjectDefinition$WorkOrderLineItem;
  Feeds: SObjectDefinition$WorkOrderLineItemFeed;
  Histories: SObjectDefinition$WorkOrderLineItemHistory;
};

interface SObjectDefinition$WorkOrderLineItem
  extends SObjectDefinition<'WorkOrderLineItem'> {
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

interface SObjectDefinition$WorkOrderLineItemFeed
  extends SObjectDefinition<'WorkOrderLineItemFeed'> {
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

interface SObjectDefinition$WorkOrderLineItemHistory
  extends SObjectDefinition<'WorkOrderLineItemHistory'> {
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

interface SObjectDefinition$WorkOrderLineItemStatus
  extends SObjectDefinition<'WorkOrderLineItemStatus'> {
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

interface SObjectDefinition$WorkOrderShare
  extends SObjectDefinition<'WorkOrderShare'> {
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

interface SObjectDefinition$WorkOrderStatus
  extends SObjectDefinition<'WorkOrderStatus'> {
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

interface SObjectDefinition$WorkThanksShare
  extends SObjectDefinition<'WorkThanksShare'> {
  Name: 'WorkThanksShare';
  Fields: Fields$WorkThanksShare;
  ParentReferences: ParentReferences$WorkThanksShare;
  ChildRelationships: ChildRelationships$WorkThanksShare;
}

export interface StandardSchema extends Schema {
  SObjects: {
    AcceptedEventRelation: SObjectDefinition$AcceptedEventRelation;
    Account: SObjectDefinition$Account;
    AccountBrand: SObjectDefinition$AccountBrand;
    AccountBrandShare: SObjectDefinition$AccountBrandShare;
    AccountChangeEvent: SObjectDefinition$AccountChangeEvent;
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
    AppMenuItem: SObjectDefinition$AppMenuItem;
    AppTabMember: SObjectDefinition$AppTabMember;
    Approval: SObjectDefinition$Approval;
    Asset: SObjectDefinition$Asset;
    AssetChangeEvent: SObjectDefinition$AssetChangeEvent;
    AssetFeed: SObjectDefinition$AssetFeed;
    AssetHistory: SObjectDefinition$AssetHistory;
    AssetRelationship: SObjectDefinition$AssetRelationship;
    AssetRelationshipFeed: SObjectDefinition$AssetRelationshipFeed;
    AssetRelationshipHistory: SObjectDefinition$AssetRelationshipHistory;
    AssetShare: SObjectDefinition$AssetShare;
    AssetTokenEvent: SObjectDefinition$AssetTokenEvent;
    AssignmentRule: SObjectDefinition$AssignmentRule;
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
    BrandTemplate: SObjectDefinition$BrandTemplate;
    BrandingSet: SObjectDefinition$BrandingSet;
    BrandingSetProperty: SObjectDefinition$BrandingSetProperty;
    BusinessHours: SObjectDefinition$BusinessHours;
    BusinessProcess: SObjectDefinition$BusinessProcess;
    CallCenter: SObjectDefinition$CallCenter;
    Campaign: SObjectDefinition$Campaign;
    CampaignChangeEvent: SObjectDefinition$CampaignChangeEvent;
    CampaignFeed: SObjectDefinition$CampaignFeed;
    CampaignHistory: SObjectDefinition$CampaignHistory;
    CampaignInfluenceModel: SObjectDefinition$CampaignInfluenceModel;
    CampaignMember: SObjectDefinition$CampaignMember;
    CampaignMemberStatus: SObjectDefinition$CampaignMemberStatus;
    CampaignShare: SObjectDefinition$CampaignShare;
    Case: SObjectDefinition$Case;
    CaseArticle: SObjectDefinition$CaseArticle;
    CaseChangeEvent: SObjectDefinition$CaseChangeEvent;
    CaseComment: SObjectDefinition$CaseComment;
    CaseContactRole: SObjectDefinition$CaseContactRole;
    CaseExternalDocument: SObjectDefinition$CaseExternalDocument;
    CaseFeed: SObjectDefinition$CaseFeed;
    CaseHistory: SObjectDefinition$CaseHistory;
    CaseMilestone: SObjectDefinition$CaseMilestone;
    CaseShare: SObjectDefinition$CaseShare;
    CaseSolution: SObjectDefinition$CaseSolution;
    CaseStatus: SObjectDefinition$CaseStatus;
    CaseSubjectParticle: SObjectDefinition$CaseSubjectParticle;
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
    ConnectedApplication: SObjectDefinition$ConnectedApplication;
    Contact: SObjectDefinition$Contact;
    ContactChangeEvent: SObjectDefinition$ContactChangeEvent;
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
    ContentHubItem: SObjectDefinition$ContentHubItem;
    ContentHubRepository: SObjectDefinition$ContentHubRepository;
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
    ContractLineItem: SObjectDefinition$ContractLineItem;
    ContractLineItemChangeEvent: SObjectDefinition$ContractLineItemChangeEvent;
    ContractLineItemHistory: SObjectDefinition$ContractLineItemHistory;
    ContractStatus: SObjectDefinition$ContractStatus;
    CorsWhitelistEntry: SObjectDefinition$CorsWhitelistEntry;
    CronJobDetail: SObjectDefinition$CronJobDetail;
    CronTrigger: SObjectDefinition$CronTrigger;
    CspTrustedSite: SObjectDefinition$CspTrustedSite;
    CustomBrand: SObjectDefinition$CustomBrand;
    CustomBrandAsset: SObjectDefinition$CustomBrandAsset;
    CustomHttpHeader: SObjectDefinition$CustomHttpHeader;
    CustomObjectUserLicenseMetrics: SObjectDefinition$CustomObjectUserLicenseMetrics;
    CustomPermission: SObjectDefinition$CustomPermission;
    CustomPermissionDependency: SObjectDefinition$CustomPermissionDependency;
    Dashboard: SObjectDefinition$Dashboard;
    DashboardComponent: SObjectDefinition$DashboardComponent;
    DashboardComponentFeed: SObjectDefinition$DashboardComponentFeed;
    DashboardFeed: SObjectDefinition$DashboardFeed;
    DataAssessmentFieldMetric: SObjectDefinition$DataAssessmentFieldMetric;
    DataAssessmentMetric: SObjectDefinition$DataAssessmentMetric;
    DataAssessmentValueMetric: SObjectDefinition$DataAssessmentValueMetric;
    DataIntegrationRecordPurchasePermission: SObjectDefinition$DataIntegrationRecordPurchasePermission;
    DataStatistics: SObjectDefinition$DataStatistics;
    DataType: SObjectDefinition$DataType;
    DatacloudAddress: SObjectDefinition$DatacloudAddress;
    DatasetExport: SObjectDefinition$DatasetExport;
    DatasetExportEvent: SObjectDefinition$DatasetExportEvent;
    DatasetExportPart: SObjectDefinition$DatasetExportPart;
    DeclinedEventRelation: SObjectDefinition$DeclinedEventRelation;
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
    Entitlement: SObjectDefinition$Entitlement;
    EntitlementChangeEvent: SObjectDefinition$EntitlementChangeEvent;
    EntitlementContact: SObjectDefinition$EntitlementContact;
    EntitlementFeed: SObjectDefinition$EntitlementFeed;
    EntitlementHistory: SObjectDefinition$EntitlementHistory;
    EntitlementTemplate: SObjectDefinition$EntitlementTemplate;
    EntityDefinition: SObjectDefinition$EntityDefinition;
    EntityMilestone: SObjectDefinition$EntityMilestone;
    EntityMilestoneFeed: SObjectDefinition$EntityMilestoneFeed;
    EntityMilestoneHistory: SObjectDefinition$EntityMilestoneHistory;
    EntityParticle: SObjectDefinition$EntityParticle;
    EntitySubscription: SObjectDefinition$EntitySubscription;
    Event: SObjectDefinition$Event;
    EventBusSubscriber: SObjectDefinition$EventBusSubscriber;
    EventChangeEvent: SObjectDefinition$EventChangeEvent;
    EventFeed: SObjectDefinition$EventFeed;
    EventLogFile: SObjectDefinition$EventLogFile;
    EventRelation: SObjectDefinition$EventRelation;
    EventRelationChangeEvent: SObjectDefinition$EventRelationChangeEvent;
    ExternalDataSource: SObjectDefinition$ExternalDataSource;
    ExternalDataUserAuth: SObjectDefinition$ExternalDataUserAuth;
    ExternalSocialAccount: SObjectDefinition$ExternalSocialAccount;
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
    ForecastingShare: SObjectDefinition$ForecastingShare;
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
    KnowledgeArticle: SObjectDefinition$KnowledgeArticle;
    KnowledgeArticleVersion: SObjectDefinition$KnowledgeArticleVersion;
    KnowledgeArticleVersionHistory: SObjectDefinition$KnowledgeArticleVersionHistory;
    KnowledgeArticleViewStat: SObjectDefinition$KnowledgeArticleViewStat;
    KnowledgeArticleVoteStat: SObjectDefinition$KnowledgeArticleVoteStat;
    Knowledge__DataCategorySelection: SObjectDefinition$Knowledge__DataCategorySelection;
    Knowledge__ViewStat: SObjectDefinition$Knowledge__ViewStat;
    Knowledge__VoteStat: SObjectDefinition$Knowledge__VoteStat;
    Knowledge__ka: SObjectDefinition$Knowledge__ka;
    Knowledge__kav: SObjectDefinition$Knowledge__kav;
    KnowledgeableUser: SObjectDefinition$KnowledgeableUser;
    Lead: SObjectDefinition$Lead;
    LeadChangeEvent: SObjectDefinition$LeadChangeEvent;
    LeadFeed: SObjectDefinition$LeadFeed;
    LeadHistory: SObjectDefinition$LeadHistory;
    LeadShare: SObjectDefinition$LeadShare;
    LeadStatus: SObjectDefinition$LeadStatus;
    LightningExperienceTheme: SObjectDefinition$LightningExperienceTheme;
    LinkedArticle: SObjectDefinition$LinkedArticle;
    LinkedArticleFeed: SObjectDefinition$LinkedArticleFeed;
    LinkedArticleHistory: SObjectDefinition$LinkedArticleHistory;
    ListEmail: SObjectDefinition$ListEmail;
    ListEmailChangeEvent: SObjectDefinition$ListEmailChangeEvent;
    ListEmailRecipientSource: SObjectDefinition$ListEmailRecipientSource;
    ListEmailShare: SObjectDefinition$ListEmailShare;
    ListView: SObjectDefinition$ListView;
    ListViewChart: SObjectDefinition$ListViewChart;
    ListViewChartInstance: SObjectDefinition$ListViewChartInstance;
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
    MatchingRule: SObjectDefinition$MatchingRule;
    MatchingRuleItem: SObjectDefinition$MatchingRuleItem;
    MilestoneType: SObjectDefinition$MilestoneType;
    Name: SObjectDefinition$Name;
    NamedCredential: SObjectDefinition$NamedCredential;
    Note: SObjectDefinition$Note;
    NoteAndAttachment: SObjectDefinition$NoteAndAttachment;
    OauthToken: SObjectDefinition$OauthToken;
    ObjectPermissions: SObjectDefinition$ObjectPermissions;
    OpenActivity: SObjectDefinition$OpenActivity;
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
    Period: SObjectDefinition$Period;
    PermissionSet: SObjectDefinition$PermissionSet;
    PermissionSetAssignment: SObjectDefinition$PermissionSetAssignment;
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
    ProductEntitlementTemplate: SObjectDefinition$ProductEntitlementTemplate;
    Profile: SObjectDefinition$Profile;
    ProfileSkill: SObjectDefinition$ProfileSkill;
    ProfileSkillEndorsement: SObjectDefinition$ProfileSkillEndorsement;
    ProfileSkillEndorsementFeed: SObjectDefinition$ProfileSkillEndorsementFeed;
    ProfileSkillEndorsementHistory: SObjectDefinition$ProfileSkillEndorsementHistory;
    ProfileSkillFeed: SObjectDefinition$ProfileSkillFeed;
    ProfileSkillHistory: SObjectDefinition$ProfileSkillHistory;
    ProfileSkillShare: SObjectDefinition$ProfileSkillShare;
    ProfileSkillUser: SObjectDefinition$ProfileSkillUser;
    ProfileSkillUserFeed: SObjectDefinition$ProfileSkillUserFeed;
    ProfileSkillUserHistory: SObjectDefinition$ProfileSkillUserHistory;
    Publisher: SObjectDefinition$Publisher;
    PushTopic: SObjectDefinition$PushTopic;
    QueueSobject: SObjectDefinition$QueueSobject;
    QuickText: SObjectDefinition$QuickText;
    QuickTextHistory: SObjectDefinition$QuickTextHistory;
    QuickTextShare: SObjectDefinition$QuickTextShare;
    RecentlyViewed: SObjectDefinition$RecentlyViewed;
    RecordAction: SObjectDefinition$RecordAction;
    RecordType: SObjectDefinition$RecordType;
    RelationshipDomain: SObjectDefinition$RelationshipDomain;
    RelationshipInfo: SObjectDefinition$RelationshipInfo;
    Report: SObjectDefinition$Report;
    ReportFeed: SObjectDefinition$ReportFeed;
    SamlSsoConfig: SObjectDefinition$SamlSsoConfig;
    Scontrol: SObjectDefinition$Scontrol;
    SearchActivity: SObjectDefinition$SearchActivity;
    SearchLayout: SObjectDefinition$SearchLayout;
    SearchPromotionRule: SObjectDefinition$SearchPromotionRule;
    SecureAgentsCluster: SObjectDefinition$SecureAgentsCluster;
    SecurityCustomBaseline: SObjectDefinition$SecurityCustomBaseline;
    ServiceContract: SObjectDefinition$ServiceContract;
    ServiceContractChangeEvent: SObjectDefinition$ServiceContractChangeEvent;
    ServiceContractFeed: SObjectDefinition$ServiceContractFeed;
    ServiceContractHistory: SObjectDefinition$ServiceContractHistory;
    ServiceContractShare: SObjectDefinition$ServiceContractShare;
    SessionPermSetActivation: SObjectDefinition$SessionPermSetActivation;
    SetupAuditTrail: SObjectDefinition$SetupAuditTrail;
    SetupEntityAccess: SObjectDefinition$SetupEntityAccess;
    Site: SObjectDefinition$Site;
    SiteDetail: SObjectDefinition$SiteDetail;
    SiteFeed: SObjectDefinition$SiteFeed;
    SiteHistory: SObjectDefinition$SiteHistory;
    SlaProcess: SObjectDefinition$SlaProcess;
    SocialPersona: SObjectDefinition$SocialPersona;
    SocialPersonaHistory: SObjectDefinition$SocialPersonaHistory;
    SocialPost: SObjectDefinition$SocialPost;
    SocialPostFeed: SObjectDefinition$SocialPostFeed;
    SocialPostHistory: SObjectDefinition$SocialPostHistory;
    SocialPostShare: SObjectDefinition$SocialPostShare;
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
    TodayGoal: SObjectDefinition$TodayGoal;
    TodayGoalShare: SObjectDefinition$TodayGoalShare;
    Topic: SObjectDefinition$Topic;
    TopicAssignment: SObjectDefinition$TopicAssignment;
    TopicFeed: SObjectDefinition$TopicFeed;
    TopicUserEvent: SObjectDefinition$TopicUserEvent;
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
    VisibilityChangeNotification: SObjectDefinition$VisibilityChangeNotification;
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
  };
}
