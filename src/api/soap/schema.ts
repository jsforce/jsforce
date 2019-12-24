/**
 * This file is generated from WSDL file by wsdl2schema.ts.
 * Do not modify directly.
 * To generate the file, run "ts-node path/to/wsdl2schema.ts path/to/wsdl.xml path/to/schema.ts"
 */

export const ApiSchemas = {
  sObject: {
    type: 'sObject',
    props: {
      type: 'string',
      fieldsToNull: ['?', 'string'],
      Id: '?string',
    },
  },
  address: {
    type: 'address',
    props: {
      city: '?string',
      country: '?string',
      countryCode: '?string',
      geocodeAccuracy: '?string',
      postalCode: '?string',
      state: '?string',
      stateCode: '?string',
      street: '?string',
    },
    extends: 'location',
  },
  location: {
    type: 'location',
    props: {
      latitude: '?number',
      longitude: '?number',
    },
  },
  QueryResult: {
    type: 'QueryResult',
    props: {
      done: 'boolean',
      queryLocator: '?string',
      records: ['?', 'sObject'],
      size: 'number',
    },
  },
  SearchResult: {
    type: 'SearchResult',
    props: {
      queryId: 'string',
      searchRecords: ['SearchRecord'],
      searchResultsMetadata: '?SearchResultsMetadata',
    },
  },
  SearchRecord: {
    type: 'SearchRecord',
    props: {
      record: 'sObject',
      searchRecordMetadata: '?SearchRecordMetadata',
      snippet: '?SearchSnippet',
    },
  },
  SearchRecordMetadata: {
    type: 'SearchRecordMetadata',
    props: {
      searchPromoted: 'boolean',
      spellCorrected: 'boolean',
    },
  },
  SearchSnippet: {
    type: 'SearchSnippet',
    props: {
      text: '?string',
      wholeFields: ['NameValuePair'],
    },
  },
  SearchResultsMetadata: {
    type: 'SearchResultsMetadata',
    props: {
      entityLabelMetadata: ['LabelsSearchMetadata'],
      entityMetadata: ['EntitySearchMetadata'],
    },
  },
  LabelsSearchMetadata: {
    type: 'LabelsSearchMetadata',
    props: {
      entityFieldLabels: ['NameValuePair'],
      entityName: 'string',
    },
  },
  EntitySearchMetadata: {
    type: 'EntitySearchMetadata',
    props: {
      entityName: 'string',
      errorMetadata: '?EntityErrorMetadata',
      fieldMetadata: ['FieldLevelSearchMetadata'],
      intentQueryMetadata: '?EntityIntentQueryMetadata',
      searchPromotionMetadata: '?EntitySearchPromotionMetadata',
      spellCorrectionMetadata: '?EntitySpellCorrectionMetadata',
    },
  },
  FieldLevelSearchMetadata: {
    type: 'FieldLevelSearchMetadata',
    props: {
      label: '?string',
      name: 'string',
      type: '?string',
    },
  },
  EntitySpellCorrectionMetadata: {
    type: 'EntitySpellCorrectionMetadata',
    props: {
      correctedQuery: 'string',
      hasNonCorrectedResults: 'boolean',
    },
  },
  EntitySearchPromotionMetadata: {
    type: 'EntitySearchPromotionMetadata',
    props: {
      promotedResultCount: 'number',
    },
  },
  EntityIntentQueryMetadata: {
    type: 'EntityIntentQueryMetadata',
    props: {
      intentQuery: 'boolean',
      message: '?string',
    },
  },
  EntityErrorMetadata: {
    type: 'EntityErrorMetadata',
    props: {
      errorCode: '?string',
      message: '?string',
    },
  },
  RelationshipReferenceTo: {
    type: 'RelationshipReferenceTo',
    props: {
      referenceTo: ['string'],
    },
  },
  RecordTypesSupported: {
    type: 'RecordTypesSupported',
    props: {
      recordTypeInfos: ['RecordTypeInfo'],
    },
  },
  JunctionIdListNames: {
    type: 'JunctionIdListNames',
    props: {
      names: ['string'],
    },
  },
  SearchLayoutButtonsDisplayed: {
    type: 'SearchLayoutButtonsDisplayed',
    props: {
      applicable: 'boolean',
      buttons: ['SearchLayoutButton'],
    },
  },
  SearchLayoutButton: {
    type: 'SearchLayoutButton',
    props: {
      apiName: 'string',
      label: 'string',
    },
  },
  SearchLayoutFieldsDisplayed: {
    type: 'SearchLayoutFieldsDisplayed',
    props: {
      applicable: 'boolean',
      fields: ['SearchLayoutField'],
    },
  },
  SearchLayoutField: {
    type: 'SearchLayoutField',
    props: {
      apiName: 'string',
      label: 'string',
      sortable: 'boolean',
    },
  },
  NameValuePair: {
    type: 'NameValuePair',
    props: {
      name: 'string',
      value: 'string',
    },
  },
  NameObjectValuePair: {
    type: 'NameObjectValuePair',
    props: {
      isVisible: '?boolean',
      name: 'string',
      value: ['any'],
    },
  },
  GetUpdatedResult: {
    type: 'GetUpdatedResult',
    props: {
      ids: ['string'],
      latestDateCovered: 'string',
    },
  },
  GetDeletedResult: {
    type: 'GetDeletedResult',
    props: {
      deletedRecords: ['DeletedRecord'],
      earliestDateAvailable: 'string',
      latestDateCovered: 'string',
    },
  },
  DeletedRecord: {
    type: 'DeletedRecord',
    props: {
      deletedDate: 'string',
      id: 'string',
    },
  },
  GetServerTimestampResult: {
    type: 'GetServerTimestampResult',
    props: {
      timestamp: 'string',
    },
  },
  InvalidateSessionsResult: {
    type: 'InvalidateSessionsResult',
    props: {
      errors: ['Error'],
      success: 'boolean',
    },
  },
  SetPasswordResult: {
    type: 'SetPasswordResult',
    props: {},
  },
  ChangeOwnPasswordResult: {
    type: 'ChangeOwnPasswordResult',
    props: {},
  },
  ResetPasswordResult: {
    type: 'ResetPasswordResult',
    props: {
      password: 'string',
    },
  },
  GetUserInfoResult: {
    type: 'GetUserInfoResult',
    props: {
      accessibilityMode: 'boolean',
      chatterExternal: 'boolean',
      currencySymbol: '?string',
      orgAttachmentFileSizeLimit: 'number',
      orgDefaultCurrencyIsoCode: '?string',
      orgDefaultCurrencyLocale: '?string',
      orgDisallowHtmlAttachments: 'boolean',
      orgHasPersonAccounts: 'boolean',
      organizationId: 'string',
      organizationMultiCurrency: 'boolean',
      organizationName: 'string',
      profileId: 'string',
      roleId: '?string',
      sessionSecondsValid: 'number',
      userDefaultCurrencyIsoCode: '?string',
      userEmail: 'string',
      userFullName: 'string',
      userId: 'string',
      userLanguage: 'string',
      userLocale: 'string',
      userName: 'string',
      userTimeZone: 'string',
      userType: 'string',
      userUiSkin: 'string',
    },
  },
  LoginResult: {
    type: 'LoginResult',
    props: {
      metadataServerUrl: '?string',
      passwordExpired: 'boolean',
      sandbox: 'boolean',
      serverUrl: '?string',
      sessionId: '?string',
      userId: '?string',
      userInfo: '?GetUserInfoResult',
    },
  },
  ExtendedErrorDetails: {
    type: 'ExtendedErrorDetails',
    props: {
      extendedErrorCode: 'string',
    },
  },
  Error: {
    type: 'Error',
    props: {
      extendedErrorDetails: ['?', 'ExtendedErrorDetails'],
      fields: ['?', 'string'],
      message: 'string',
      statusCode: 'string',
    },
  },
  SendEmailError: {
    type: 'SendEmailError',
    props: {
      fields: ['?', 'string'],
      message: 'string',
      statusCode: 'string',
      targetObjectId: '?string',
    },
  },
  SaveResult: {
    type: 'SaveResult',
    props: {
      errors: ['Error'],
      id: '?string',
      success: 'boolean',
    },
  },
  RenderEmailTemplateError: {
    type: 'RenderEmailTemplateError',
    props: {
      fieldName: 'string',
      message: 'string',
      offset: 'number',
      statusCode: 'string',
    },
  },
  UpsertResult: {
    type: 'UpsertResult',
    props: {
      created: 'boolean',
      errors: ['Error'],
      id: '?string',
      success: 'boolean',
    },
  },
  PerformQuickActionResult: {
    type: 'PerformQuickActionResult',
    props: {
      contextId: '?string',
      created: 'boolean',
      errors: ['Error'],
      feedItemIds: ['?', 'string'],
      ids: ['?', 'string'],
      success: 'boolean',
      successMessage: '?string',
    },
  },
  QuickActionTemplateResult: {
    type: 'QuickActionTemplateResult',
    props: {
      contextId: '?string',
      defaultValueFormulas: '?sObject',
      defaultValues: '?sObject',
      errors: ['Error'],
      success: 'boolean',
    },
  },
  MergeRequest: {
    type: 'MergeRequest',
    props: {
      additionalInformationMap: ['AdditionalInformationMap'],
      masterRecord: 'sObject',
      recordToMergeIds: ['string'],
    },
  },
  MergeResult: {
    type: 'MergeResult',
    props: {
      errors: ['Error'],
      id: '?string',
      mergedRecordIds: ['string'],
      success: 'boolean',
      updatedRelatedIds: ['string'],
    },
  },
  ProcessRequest: {
    type: 'ProcessRequest',
    props: {
      comments: '?string',
      nextApproverIds: ['?', 'string'],
    },
  },
  ProcessSubmitRequest: {
    type: 'ProcessSubmitRequest',
    props: {
      objectId: 'string',
      submitterId: '?string',
      processDefinitionNameOrId: '?string',
      skipEntryCriteria: '?boolean',
    },
    extends: 'ProcessRequest',
  },
  ProcessWorkitemRequest: {
    type: 'ProcessWorkitemRequest',
    props: {
      action: 'string',
      workitemId: 'string',
    },
    extends: 'ProcessRequest',
  },
  PerformQuickActionRequest: {
    type: 'PerformQuickActionRequest',
    props: {
      contextId: '?string',
      quickActionName: 'string',
      records: ['?', 'sObject'],
    },
  },
  DescribeAvailableQuickActionResult: {
    type: 'DescribeAvailableQuickActionResult',
    props: {
      actionEnumOrId: 'string',
      label: 'string',
      name: 'string',
      type: 'string',
    },
  },
  DescribeQuickActionResult: {
    type: 'DescribeQuickActionResult',
    props: {
      accessLevelRequired: '?string',
      actionEnumOrId: 'string',
      canvasApplicationId: '?string',
      canvasApplicationName: '?string',
      colors: ['DescribeColor'],
      contextSobjectType: '?string',
      defaultValues: ['?', 'DescribeQuickActionDefaultValue'],
      flowDevName: '?string',
      flowRecordIdVar: '?string',
      height: '?number',
      iconName: '?string',
      iconUrl: '?string',
      icons: ['DescribeIcon'],
      label: 'string',
      layout: '?DescribeLayoutSection',
      lightningComponentBundleId: '?string',
      lightningComponentBundleName: '?string',
      lightningComponentQualifiedName: '?string',
      miniIconUrl: '?string',
      mobileExtensionDisplayMode: '?string',
      mobileExtensionId: '?string',
      name: 'string',
      showQuickActionLcHeader: 'boolean',
      showQuickActionVfHeader: 'boolean',
      targetParentField: '?string',
      targetRecordTypeId: '?string',
      targetSobjectType: '?string',
      type: 'string',
      visualforcePageName: '?string',
      visualforcePageUrl: '?string',
      width: '?number',
    },
  },
  DescribeQuickActionDefaultValue: {
    type: 'DescribeQuickActionDefaultValue',
    props: {
      defaultValue: '?string',
      field: 'string',
    },
  },
  DescribeVisualForceResult: {
    type: 'DescribeVisualForceResult',
    props: {
      domain: 'string',
    },
  },
  ProcessResult: {
    type: 'ProcessResult',
    props: {
      actorIds: ['string'],
      entityId: '?string',
      errors: ['Error'],
      instanceId: '?string',
      instanceStatus: '?string',
      newWorkitemIds: ['?', 'string'],
      success: 'boolean',
    },
  },
  DeleteResult: {
    type: 'DeleteResult',
    props: {
      errors: ['?', 'Error'],
      id: '?string',
      success: 'boolean',
    },
  },
  UndeleteResult: {
    type: 'UndeleteResult',
    props: {
      errors: ['Error'],
      id: '?string',
      success: 'boolean',
    },
  },
  DeleteByExampleResult: {
    type: 'DeleteByExampleResult',
    props: {
      entity: '?sObject',
      errors: ['?', 'Error'],
      rowCount: 'number',
      success: 'boolean',
    },
  },
  EmptyRecycleBinResult: {
    type: 'EmptyRecycleBinResult',
    props: {
      errors: ['Error'],
      id: '?string',
      success: 'boolean',
    },
  },
  LeadConvert: {
    type: 'LeadConvert',
    props: {
      accountId: '?string',
      accountRecord: '?sObject',
      bypassAccountDedupeCheck: '?boolean',
      bypassContactDedupeCheck: '?boolean',
      contactId: '?string',
      contactRecord: '?sObject',
      convertedStatus: 'string',
      doNotCreateOpportunity: 'boolean',
      leadId: 'string',
      opportunityId: '?string',
      opportunityName: '?string',
      opportunityRecord: '?sObject',
      overwriteLeadSource: 'boolean',
      ownerId: '?string',
      sendNotificationEmail: 'boolean',
    },
  },
  LeadConvertResult: {
    type: 'LeadConvertResult',
    props: {
      accountId: '?string',
      contactId: '?string',
      errors: ['Error'],
      leadId: '?string',
      opportunityId: '?string',
      success: 'boolean',
    },
  },
  DescribeSObjectResult: {
    type: 'DescribeSObjectResult',
    props: {
      actionOverrides: ['?', 'ActionOverride'],
      activateable: 'boolean',
      childRelationships: ['ChildRelationship'],
      compactLayoutable: 'boolean',
      createable: 'boolean',
      custom: 'boolean',
      customSetting: 'boolean',
      dataTranslationEnabled: '?boolean',
      deepCloneable: 'boolean',
      defaultImplementation: '?string',
      deletable: 'boolean',
      deprecatedAndHidden: 'boolean',
      feedEnabled: 'boolean',
      fields: ['?', 'Field'],
      hasSubtypes: 'boolean',
      idEnabled: 'boolean',
      implementedBy: '?string',
      implementsInterfaces: '?string',
      isInterface: 'boolean',
      isSubtype: 'boolean',
      keyPrefix: '?string',
      label: 'string',
      labelPlural: 'string',
      layoutable: 'boolean',
      mergeable: 'boolean',
      mruEnabled: 'boolean',
      name: 'string',
      namedLayoutInfos: ['NamedLayoutInfo'],
      networkScopeFieldName: '?string',
      queryable: 'boolean',
      recordTypeInfos: ['RecordTypeInfo'],
      replicateable: 'boolean',
      retrieveable: 'boolean',
      searchLayoutable: '?boolean',
      searchable: 'boolean',
      supportedScopes: ['?', 'ScopeInfo'],
      triggerable: '?boolean',
      undeletable: 'boolean',
      updateable: 'boolean',
      urlDetail: '?string',
      urlEdit: '?string',
      urlNew: '?string',
    },
  },
  DescribeGlobalSObjectResult: {
    type: 'DescribeGlobalSObjectResult',
    props: {
      activateable: 'boolean',
      createable: 'boolean',
      custom: 'boolean',
      customSetting: 'boolean',
      dataTranslationEnabled: '?boolean',
      deepCloneable: 'boolean',
      deletable: 'boolean',
      deprecatedAndHidden: 'boolean',
      feedEnabled: 'boolean',
      hasSubtypes: 'boolean',
      idEnabled: 'boolean',
      isInterface: 'boolean',
      isSubtype: 'boolean',
      keyPrefix: '?string',
      label: 'string',
      labelPlural: 'string',
      layoutable: 'boolean',
      mergeable: 'boolean',
      mruEnabled: 'boolean',
      name: 'string',
      queryable: 'boolean',
      replicateable: 'boolean',
      retrieveable: 'boolean',
      searchable: 'boolean',
      triggerable: 'boolean',
      undeletable: 'boolean',
      updateable: 'boolean',
    },
  },
  ChildRelationship: {
    type: 'ChildRelationship',
    props: {
      cascadeDelete: 'boolean',
      childSObject: 'string',
      deprecatedAndHidden: 'boolean',
      field: 'string',
      junctionIdListNames: ['?', 'string'],
      junctionReferenceTo: ['?', 'string'],
      relationshipName: '?string',
      restrictedDelete: '?boolean',
    },
  },
  DescribeGlobalResult: {
    type: 'DescribeGlobalResult',
    props: {
      encoding: '?string',
      maxBatchSize: 'number',
      sobjects: ['DescribeGlobalSObjectResult'],
    },
  },
  DescribeGlobalTheme: {
    type: 'DescribeGlobalTheme',
    props: {
      global: 'DescribeGlobalResult',
      theme: 'DescribeThemeResult',
    },
  },
  ScopeInfo: {
    type: 'ScopeInfo',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  StringList: {
    type: 'StringList',
    props: {
      values: ['string'],
    },
  },
  ChangeEventHeader: {
    type: 'ChangeEventHeader',
    props: {
      entityName: 'string',
      recordIds: ['string'],
      commitTimestamp: 'number',
      commitNumber: 'number',
      commitUser: 'string',
      diffFields: ['string'],
      changeType: 'string',
      changeOrigin: 'string',
      transactionKey: 'string',
      sequenceNumber: 'number',
      nulledFields: ['string'],
      changedFields: ['string'],
    },
  },
  FilteredLookupInfo: {
    type: 'FilteredLookupInfo',
    props: {
      controllingFields: ['string'],
      dependent: 'boolean',
      optionalFilter: 'boolean',
    },
  },
  Field: {
    type: 'Field',
    props: {
      aggregatable: 'boolean',
      aiPredictionField: 'boolean',
      autoNumber: 'boolean',
      byteLength: 'number',
      calculated: 'boolean',
      calculatedFormula: '?string',
      cascadeDelete: '?boolean',
      caseSensitive: 'boolean',
      compoundFieldName: '?string',
      controllerName: '?string',
      createable: 'boolean',
      custom: 'boolean',
      dataTranslationEnabled: '?boolean',
      defaultValue: '?any',
      defaultValueFormula: '?string',
      defaultedOnCreate: 'boolean',
      dependentPicklist: '?boolean',
      deprecatedAndHidden: 'boolean',
      digits: 'number',
      displayLocationInDecimal: '?boolean',
      encrypted: '?boolean',
      externalId: '?boolean',
      extraTypeInfo: '?string',
      filterable: 'boolean',
      filteredLookupInfo: '?FilteredLookupInfo',
      formulaTreatNullNumberAsZero: '?boolean',
      groupable: 'boolean',
      highScaleNumber: '?boolean',
      htmlFormatted: '?boolean',
      idLookup: 'boolean',
      inlineHelpText: '?string',
      label: 'string',
      length: 'number',
      mask: '?string',
      maskType: '?string',
      name: 'string',
      nameField: 'boolean',
      namePointing: '?boolean',
      nillable: 'boolean',
      permissionable: 'boolean',
      picklistValues: ['?', 'PicklistEntry'],
      polymorphicForeignKey: 'boolean',
      precision: 'number',
      queryByDistance: 'boolean',
      referenceTargetField: '?string',
      referenceTo: ['?', 'string'],
      relationshipName: '?string',
      relationshipOrder: '?number',
      restrictedDelete: '?boolean',
      restrictedPicklist: 'boolean',
      scale: 'number',
      searchPrefilterable: 'boolean',
      soapType: 'string',
      sortable: '?boolean',
      type: 'string',
      unique: 'boolean',
      updateable: 'boolean',
      writeRequiresMasterRead: '?boolean',
    },
  },
  PicklistEntry: {
    type: 'PicklistEntry',
    props: {
      active: 'boolean',
      defaultValue: 'boolean',
      label: '?string',
      validFor: '?string',
      value: 'string',
    },
  },
  DescribeDataCategoryGroupResult: {
    type: 'DescribeDataCategoryGroupResult',
    props: {
      categoryCount: 'number',
      description: 'string',
      label: 'string',
      name: 'string',
      sobject: 'string',
    },
  },
  DescribeDataCategoryGroupStructureResult: {
    type: 'DescribeDataCategoryGroupStructureResult',
    props: {
      description: 'string',
      label: 'string',
      name: 'string',
      sobject: 'string',
      topCategories: ['DataCategory'],
    },
  },
  DataCategoryGroupSobjectTypePair: {
    type: 'DataCategoryGroupSobjectTypePair',
    props: {
      dataCategoryGroupName: 'string',
      sobject: 'string',
    },
  },
  DataCategory: {
    type: 'DataCategory',
    props: {
      childCategories: ['DataCategory'],
      label: 'string',
      name: 'string',
    },
  },
  DescribeDataCategoryMappingResult: {
    type: 'DescribeDataCategoryMappingResult',
    props: {
      dataCategoryGroupId: 'string',
      dataCategoryGroupLabel: 'string',
      dataCategoryGroupName: 'string',
      dataCategoryId: 'string',
      dataCategoryLabel: 'string',
      dataCategoryName: 'string',
      id: 'string',
      mappedEntity: 'string',
      mappedField: 'string',
    },
  },
  KnowledgeSettings: {
    type: 'KnowledgeSettings',
    props: {
      defaultLanguage: '?string',
      knowledgeEnabled: 'boolean',
      languages: ['KnowledgeLanguageItem'],
    },
  },
  KnowledgeLanguageItem: {
    type: 'KnowledgeLanguageItem',
    props: {
      active: 'boolean',
      assigneeId: '?string',
      name: 'string',
    },
  },
  FieldDiff: {
    type: 'FieldDiff',
    props: {
      difference: 'string',
      name: 'string',
    },
  },
  AdditionalInformationMap: {
    type: 'AdditionalInformationMap',
    props: {
      name: 'string',
      value: 'string',
    },
  },
  MatchRecord: {
    type: 'MatchRecord',
    props: {
      additionalInformation: ['AdditionalInformationMap'],
      fieldDiffs: ['FieldDiff'],
      matchConfidence: 'number',
      record: 'sObject',
    },
  },
  MatchResult: {
    type: 'MatchResult',
    props: {
      entityType: 'string',
      errors: ['Error'],
      matchEngine: 'string',
      matchRecords: ['MatchRecord'],
      rule: 'string',
      size: 'number',
      success: 'boolean',
    },
  },
  DuplicateResult: {
    type: 'DuplicateResult',
    props: {
      allowSave: 'boolean',
      duplicateRule: 'string',
      duplicateRuleEntityType: 'string',
      errorMessage: '?string',
      matchResults: ['MatchResult'],
    },
  },
  DuplicateError: {
    type: 'DuplicateError',
    props: {
      duplicateResult: 'DuplicateResult',
    },
    extends: 'Error',
  },
  DescribeNounResult: {
    type: 'DescribeNounResult',
    props: {
      caseValues: ['NameCaseValue'],
      developerName: 'string',
      gender: '?string',
      name: 'string',
      pluralAlias: '?string',
      startsWith: '?string',
    },
  },
  NameCaseValue: {
    type: 'NameCaseValue',
    props: {
      article: '?string',
      caseType: '?string',
      number: '?string',
      possessive: '?string',
      value: '?string',
    },
  },
  FindDuplicatesResult: {
    type: 'FindDuplicatesResult',
    props: {
      duplicateResults: ['DuplicateResult'],
      errors: ['Error'],
      success: 'boolean',
    },
  },
  DescribeAppMenuResult: {
    type: 'DescribeAppMenuResult',
    props: {
      appMenuItems: ['DescribeAppMenuItem'],
    },
  },
  DescribeAppMenuItem: {
    type: 'DescribeAppMenuItem',
    props: {
      colors: ['DescribeColor'],
      content: 'string',
      icons: ['DescribeIcon'],
      label: 'string',
      name: 'string',
      type: 'string',
      url: 'string',
    },
  },
  DescribeThemeResult: {
    type: 'DescribeThemeResult',
    props: {
      themeItems: ['DescribeThemeItem'],
    },
  },
  DescribeThemeItem: {
    type: 'DescribeThemeItem',
    props: {
      colors: ['DescribeColor'],
      icons: ['DescribeIcon'],
      name: 'string',
    },
  },
  DescribeSoftphoneLayoutResult: {
    type: 'DescribeSoftphoneLayoutResult',
    props: {
      callTypes: ['DescribeSoftphoneLayoutCallType'],
      id: 'string',
      name: 'string',
    },
  },
  DescribeSoftphoneLayoutCallType: {
    type: 'DescribeSoftphoneLayoutCallType',
    props: {
      infoFields: ['DescribeSoftphoneLayoutInfoField'],
      name: 'string',
      screenPopOptions: ['DescribeSoftphoneScreenPopOption'],
      screenPopsOpenWithin: '?string',
      sections: ['DescribeSoftphoneLayoutSection'],
    },
  },
  DescribeSoftphoneScreenPopOption: {
    type: 'DescribeSoftphoneScreenPopOption',
    props: {
      matchType: 'string',
      screenPopData: 'string',
      screenPopType: 'string',
    },
  },
  DescribeSoftphoneLayoutInfoField: {
    type: 'DescribeSoftphoneLayoutInfoField',
    props: {
      name: 'string',
    },
  },
  DescribeSoftphoneLayoutSection: {
    type: 'DescribeSoftphoneLayoutSection',
    props: {
      entityApiName: 'string',
      items: ['DescribeSoftphoneLayoutItem'],
    },
  },
  DescribeSoftphoneLayoutItem: {
    type: 'DescribeSoftphoneLayoutItem',
    props: {
      itemApiName: 'string',
    },
  },
  DescribeCompactLayoutsResult: {
    type: 'DescribeCompactLayoutsResult',
    props: {
      compactLayouts: ['DescribeCompactLayout'],
      defaultCompactLayoutId: 'string',
      recordTypeCompactLayoutMappings: ['RecordTypeCompactLayoutMapping'],
    },
  },
  DescribeCompactLayout: {
    type: 'DescribeCompactLayout',
    props: {
      actions: ['DescribeLayoutButton'],
      fieldItems: ['DescribeLayoutItem'],
      id: 'string',
      imageItems: ['DescribeLayoutItem'],
      label: 'string',
      name: 'string',
      objectType: 'string',
    },
  },
  RecordTypeCompactLayoutMapping: {
    type: 'RecordTypeCompactLayoutMapping',
    props: {
      available: 'boolean',
      compactLayoutId: '?string',
      compactLayoutName: 'string',
      recordTypeId: 'string',
      recordTypeName: 'string',
    },
  },
  DescribePathAssistantsResult: {
    type: 'DescribePathAssistantsResult',
    props: {
      pathAssistants: ['DescribePathAssistant'],
    },
  },
  DescribePathAssistant: {
    type: 'DescribePathAssistant',
    props: {
      active: 'boolean',
      animationRule: ['?', 'DescribeAnimationRule'],
      apiName: 'string',
      label: 'string',
      pathPicklistField: 'string',
      picklistsForRecordType: ['?', 'PicklistForRecordType'],
      recordTypeId: '?string',
      steps: ['DescribePathAssistantStep'],
    },
  },
  DescribePathAssistantStep: {
    type: 'DescribePathAssistantStep',
    props: {
      closed: 'boolean',
      converted: 'boolean',
      fields: ['DescribePathAssistantField'],
      info: '?string',
      layoutSection: '?DescribeLayoutSection',
      picklistLabel: 'string',
      picklistValue: 'string',
      won: 'boolean',
    },
  },
  DescribePathAssistantField: {
    type: 'DescribePathAssistantField',
    props: {
      apiName: 'string',
      label: 'string',
      readOnly: 'boolean',
      required: 'boolean',
    },
  },
  DescribeAnimationRule: {
    type: 'DescribeAnimationRule',
    props: {
      animationFrequency: 'string',
      isActive: 'boolean',
      recordTypeContext: 'string',
      recordTypeId: '?string',
      targetField: 'string',
      targetFieldChangeToValues: 'string',
    },
  },
  DescribeApprovalLayoutResult: {
    type: 'DescribeApprovalLayoutResult',
    props: {
      approvalLayouts: ['DescribeApprovalLayout'],
    },
  },
  DescribeApprovalLayout: {
    type: 'DescribeApprovalLayout',
    props: {
      id: 'string',
      label: 'string',
      layoutItems: ['DescribeLayoutItem'],
      name: 'string',
    },
  },
  DescribeLayoutResult: {
    type: 'DescribeLayoutResult',
    props: {
      layouts: ['DescribeLayout'],
      recordTypeMappings: ['RecordTypeMapping'],
      recordTypeSelectorRequired: 'boolean',
    },
  },
  DescribeLayout: {
    type: 'DescribeLayout',
    props: {
      buttonLayoutSection: '?DescribeLayoutButtonSection',
      detailLayoutSections: ['DescribeLayoutSection'],
      editLayoutSections: ['DescribeLayoutSection'],
      feedView: '?DescribeLayoutFeedView',
      highlightsPanelLayoutSection: '?DescribeLayoutSection',
      id: '?string',
      quickActionList: '?DescribeQuickActionListResult',
      relatedContent: '?RelatedContent',
      relatedLists: ['RelatedList'],
      saveOptions: ['DescribeLayoutSaveOption'],
    },
  },
  DescribeQuickActionListResult: {
    type: 'DescribeQuickActionListResult',
    props: {
      quickActionListItems: ['DescribeQuickActionListItemResult'],
    },
  },
  DescribeQuickActionListItemResult: {
    type: 'DescribeQuickActionListItemResult',
    props: {
      accessLevelRequired: '?string',
      colors: ['DescribeColor'],
      iconUrl: '?string',
      icons: ['DescribeIcon'],
      label: 'string',
      miniIconUrl: 'string',
      quickActionName: 'string',
      targetSobjectType: '?string',
      type: 'string',
    },
  },
  DescribeLayoutFeedView: {
    type: 'DescribeLayoutFeedView',
    props: {
      feedFilters: ['DescribeLayoutFeedFilter'],
    },
  },
  DescribeLayoutFeedFilter: {
    type: 'DescribeLayoutFeedFilter',
    props: {
      label: 'string',
      name: 'string',
      type: 'string',
    },
  },
  DescribeLayoutSaveOption: {
    type: 'DescribeLayoutSaveOption',
    props: {
      defaultValue: 'boolean',
      isDisplayed: 'boolean',
      label: 'string',
      name: 'string',
      restHeaderName: 'string',
      soapHeaderName: 'string',
    },
  },
  DescribeLayoutSection: {
    type: 'DescribeLayoutSection',
    props: {
      collapsed: 'boolean',
      columns: 'number',
      heading: '?string',
      layoutRows: ['DescribeLayoutRow'],
      layoutSectionId: '?string',
      parentLayoutId: 'string',
      rows: 'number',
      tabOrder: 'string',
      useCollapsibleSection: 'boolean',
      useHeading: 'boolean',
    },
  },
  DescribeLayoutButtonSection: {
    type: 'DescribeLayoutButtonSection',
    props: {
      detailButtons: ['DescribeLayoutButton'],
    },
  },
  DescribeLayoutRow: {
    type: 'DescribeLayoutRow',
    props: {
      layoutItems: ['DescribeLayoutItem'],
      numItems: 'number',
    },
  },
  DescribeLayoutItem: {
    type: 'DescribeLayoutItem',
    props: {
      editableForNew: 'boolean',
      editableForUpdate: 'boolean',
      label: '?string',
      layoutComponents: ['DescribeLayoutComponent'],
      placeholder: 'boolean',
      required: 'boolean',
    },
  },
  DescribeLayoutButton: {
    type: 'DescribeLayoutButton',
    props: {
      behavior: '?string',
      colors: ['DescribeColor'],
      content: '?string',
      contentSource: '?string',
      custom: 'boolean',
      encoding: '?string',
      height: '?number',
      icons: ['DescribeIcon'],
      label: '?string',
      menubar: '?boolean',
      name: '?string',
      overridden: 'boolean',
      resizeable: '?boolean',
      scrollbars: '?boolean',
      showsLocation: '?boolean',
      showsStatus: '?boolean',
      toolbar: '?boolean',
      url: '?string',
      width: '?number',
      windowPosition: '?string',
    },
  },
  DescribeLayoutComponent: {
    type: 'DescribeLayoutComponent',
    props: {
      displayLines: 'number',
      tabOrder: 'number',
      type: 'string',
      value: '?string',
    },
  },
  FieldComponent: {
    type: 'FieldComponent',
    props: {
      field: 'Field',
    },
    extends: 'DescribeLayoutComponent',
  },
  FieldLayoutComponent: {
    type: 'FieldLayoutComponent',
    props: {
      components: ['DescribeLayoutComponent'],
      fieldType: 'string',
    },
    extends: 'DescribeLayoutComponent',
  },
  VisualforcePage: {
    type: 'VisualforcePage',
    props: {
      showLabel: 'boolean',
      showScrollbars: 'boolean',
      suggestedHeight: 'string',
      suggestedWidth: 'string',
      url: 'string',
    },
    extends: 'DescribeLayoutComponent',
  },
  Canvas: {
    type: 'Canvas',
    props: {
      displayLocation: 'string',
      referenceId: 'string',
      showLabel: 'boolean',
      showScrollbars: 'boolean',
      suggestedHeight: 'string',
      suggestedWidth: 'string',
    },
    extends: 'DescribeLayoutComponent',
  },
  ReportChartComponent: {
    type: 'ReportChartComponent',
    props: {
      cacheData: 'boolean',
      contextFilterableField: 'string',
      error: 'string',
      hideOnError: 'boolean',
      includeContext: 'boolean',
      showTitle: 'boolean',
      size: 'string',
    },
    extends: 'DescribeLayoutComponent',
  },
  AnalyticsCloudComponent: {
    type: 'AnalyticsCloudComponent',
    props: {
      error: 'string',
      filter: 'string',
      height: 'string',
      hideOnError: 'boolean',
      showSharing: 'boolean',
      showTitle: 'boolean',
      width: 'string',
    },
    extends: 'DescribeLayoutComponent',
  },
  CustomLinkComponent: {
    type: 'CustomLinkComponent',
    props: {
      customLink: 'DescribeLayoutButton',
    },
    extends: 'DescribeLayoutComponent',
  },
  NamedLayoutInfo: {
    type: 'NamedLayoutInfo',
    props: {
      name: 'string',
    },
  },
  RecordTypeInfo: {
    type: 'RecordTypeInfo',
    props: {
      active: 'boolean',
      available: 'boolean',
      defaultRecordTypeMapping: 'boolean',
      developerName: 'string',
      master: 'boolean',
      name: 'string',
      recordTypeId: '?string',
    },
  },
  RecordTypeMapping: {
    type: 'RecordTypeMapping',
    props: {
      active: 'boolean',
      available: 'boolean',
      defaultRecordTypeMapping: 'boolean',
      developerName: 'string',
      layoutId: 'string',
      master: 'boolean',
      name: 'string',
      picklistsForRecordType: ['?', 'PicklistForRecordType'],
      recordTypeId: '?string',
    },
  },
  PicklistForRecordType: {
    type: 'PicklistForRecordType',
    props: {
      picklistName: 'string',
      picklistValues: ['?', 'PicklistEntry'],
    },
  },
  RelatedContent: {
    type: 'RelatedContent',
    props: {
      relatedContentItems: ['DescribeRelatedContentItem'],
    },
  },
  DescribeRelatedContentItem: {
    type: 'DescribeRelatedContentItem',
    props: {
      describeLayoutItem: 'DescribeLayoutItem',
    },
  },
  RelatedList: {
    type: 'RelatedList',
    props: {
      accessLevelRequiredForCreate: '?string',
      buttons: ['?', 'DescribeLayoutButton'],
      columns: ['RelatedListColumn'],
      custom: 'boolean',
      field: '?string',
      label: 'string',
      limitRows: 'number',
      name: 'string',
      sobject: '?string',
      sort: ['RelatedListSort'],
    },
  },
  RelatedListColumn: {
    type: 'RelatedListColumn',
    props: {
      field: '?string',
      fieldApiName: 'string',
      format: '?string',
      label: 'string',
      lookupId: '?string',
      name: 'string',
      sortable: 'boolean',
    },
  },
  RelatedListSort: {
    type: 'RelatedListSort',
    props: {
      ascending: 'boolean',
      column: 'string',
    },
  },
  EmailFileAttachment: {
    type: 'EmailFileAttachment',
    props: {
      body: '?string',
      contentType: '?string',
      fileName: 'string',
      id: '?string',
      inline: '?boolean',
    },
  },
  Email: {
    type: 'Email',
    props: {
      bccSender: '?boolean',
      emailPriority: '?string',
      replyTo: '?string',
      saveAsActivity: '?boolean',
      senderDisplayName: '?string',
      subject: '?string',
      useSignature: '?boolean',
    },
  },
  MassEmailMessage: {
    type: 'MassEmailMessage',
    props: {
      description: '?string',
      targetObjectIds: '?string',
      templateId: 'string',
      whatIds: '?string',
    },
    extends: 'Email',
  },
  SingleEmailMessage: {
    type: 'SingleEmailMessage',
    props: {
      bccAddresses: '?string',
      ccAddresses: '?string',
      charset: '?string',
      documentAttachments: ['string'],
      entityAttachments: ['string'],
      fileAttachments: ['EmailFileAttachment'],
      htmlBody: '?string',
      inReplyTo: '?string',
      optOutPolicy: '?string',
      orgWideEmailAddressId: '?string',
      plainTextBody: '?string',
      references: '?string',
      targetObjectId: '?string',
      templateId: '?string',
      templateName: '?string',
      toAddresses: '?string',
      treatBodiesAsTemplate: '?boolean',
      treatTargetObjectAsRecipient: '?boolean',
      whatId: '?string',
    },
    extends: 'Email',
  },
  SendEmailResult: {
    type: 'SendEmailResult',
    props: {
      errors: ['SendEmailError'],
      success: 'boolean',
    },
  },
  ListViewColumn: {
    type: 'ListViewColumn',
    props: {
      ascendingLabel: '?string',
      descendingLabel: '?string',
      fieldNameOrPath: 'string',
      hidden: 'boolean',
      label: 'string',
      searchable: 'boolean',
      selectListItem: 'string',
      sortDirection: '?string',
      sortIndex: '?number',
      sortable: 'boolean',
      type: 'string',
    },
  },
  ListViewOrderBy: {
    type: 'ListViewOrderBy',
    props: {
      fieldNameOrPath: 'string',
      nullsPosition: '?string',
      sortDirection: '?string',
    },
  },
  DescribeSoqlListView: {
    type: 'DescribeSoqlListView',
    props: {
      columns: ['ListViewColumn'],
      id: 'string',
      orderBy: ['ListViewOrderBy'],
      query: 'string',
      relatedEntityId: '?string',
      scope: '?string',
      scopeEntityId: '?string',
      sobjectType: 'string',
      whereCondition: '?SoqlWhereCondition',
    },
  },
  DescribeSoqlListViewsRequest: {
    type: 'DescribeSoqlListViewsRequest',
    props: {
      listViewParams: ['DescribeSoqlListViewParams'],
    },
  },
  DescribeSoqlListViewParams: {
    type: 'DescribeSoqlListViewParams',
    props: {
      developerNameOrId: 'string',
      sobjectType: '?string',
    },
  },
  DescribeSoqlListViewResult: {
    type: 'DescribeSoqlListViewResult',
    props: {
      describeSoqlListViews: ['DescribeSoqlListView'],
    },
  },
  ExecuteListViewRequest: {
    type: 'ExecuteListViewRequest',
    props: {
      developerNameOrId: 'string',
      limit: '?number',
      offset: '?number',
      orderBy: ['ListViewOrderBy'],
      sobjectType: 'string',
    },
  },
  ExecuteListViewResult: {
    type: 'ExecuteListViewResult',
    props: {
      columns: ['ListViewColumn'],
      developerName: 'string',
      done: 'boolean',
      id: 'string',
      label: 'string',
      records: ['ListViewRecord'],
      size: 'number',
    },
  },
  ListViewRecord: {
    type: 'ListViewRecord',
    props: {
      columns: ['ListViewRecordColumn'],
    },
  },
  ListViewRecordColumn: {
    type: 'ListViewRecordColumn',
    props: {
      fieldNameOrPath: 'string',
      value: '?string',
    },
  },
  SoqlWhereCondition: {
    type: 'SoqlWhereCondition',
    props: {},
  },
  SoqlCondition: {
    type: 'SoqlCondition',
    props: {
      field: 'string',
      operator: 'string',
      values: ['string'],
    },
    extends: 'SoqlWhereCondition',
  },
  SoqlNotCondition: {
    type: 'SoqlNotCondition',
    props: {
      condition: 'SoqlWhereCondition',
    },
    extends: 'SoqlWhereCondition',
  },
  SoqlConditionGroup: {
    type: 'SoqlConditionGroup',
    props: {
      conditions: ['SoqlWhereCondition'],
      conjunction: 'string',
    },
    extends: 'SoqlWhereCondition',
  },
  SoqlSubQueryCondition: {
    type: 'SoqlSubQueryCondition',
    props: {
      field: 'string',
      operator: 'string',
      subQuery: 'string',
    },
    extends: 'SoqlWhereCondition',
  },
  DescribeSearchLayoutResult: {
    type: 'DescribeSearchLayoutResult',
    props: {
      errorMsg: '?string',
      label: '?string',
      limitRows: '?number',
      objectType: 'string',
      searchColumns: ['?', 'DescribeColumn'],
    },
  },
  DescribeColumn: {
    type: 'DescribeColumn',
    props: {
      field: 'string',
      format: '?string',
      label: 'string',
      name: 'string',
    },
  },
  DescribeSearchScopeOrderResult: {
    type: 'DescribeSearchScopeOrderResult',
    props: {
      keyPrefix: 'string',
      name: 'string',
    },
  },
  DescribeSearchableEntityResult: {
    type: 'DescribeSearchableEntityResult',
    props: {
      label: 'string',
      name: 'string',
      pluralLabel: 'string',
    },
  },
  DescribeTabSetResult: {
    type: 'DescribeTabSetResult',
    props: {
      description: 'string',
      label: 'string',
      logoUrl: 'string',
      namespace: '?string',
      selected: 'boolean',
      tabSetId: 'string',
      tabs: ['DescribeTab'],
    },
  },
  DescribeTab: {
    type: 'DescribeTab',
    props: {
      colors: ['DescribeColor'],
      custom: 'boolean',
      iconUrl: 'string',
      icons: ['DescribeIcon'],
      label: 'string',
      miniIconUrl: 'string',
      name: 'string',
      sobjectName: '?string',
      url: 'string',
    },
  },
  DescribeColor: {
    type: 'DescribeColor',
    props: {
      color: 'string',
      context: 'string',
      theme: 'string',
    },
  },
  DescribeIcon: {
    type: 'DescribeIcon',
    props: {
      contentType: 'string',
      height: '?number',
      theme: 'string',
      url: 'string',
      width: '?number',
    },
  },
  ActionOverride: {
    type: 'ActionOverride',
    props: {
      formFactor: 'string',
      isAvailableInTouch: 'boolean',
      name: 'string',
      pageId: 'string',
      url: '?string',
    },
  },
  RenderEmailTemplateRequest: {
    type: 'RenderEmailTemplateRequest',
    props: {
      escapeHtmlInMergeFields: '?boolean',
      templateBodies: 'string',
      whatId: '?string',
      whoId: '?string',
    },
  },
  RenderEmailTemplateBodyResult: {
    type: 'RenderEmailTemplateBodyResult',
    props: {
      errors: ['RenderEmailTemplateError'],
      mergedBody: '?string',
      success: 'boolean',
    },
  },
  RenderEmailTemplateResult: {
    type: 'RenderEmailTemplateResult',
    props: {
      bodyResults: '?RenderEmailTemplateBodyResult',
      errors: ['Error'],
      success: 'boolean',
    },
  },
  RenderStoredEmailTemplateRequest: {
    type: 'RenderStoredEmailTemplateRequest',
    props: {
      attachmentRetrievalOption: '?string',
      templateId: 'string',
      updateTemplateUsage: '?boolean',
      whatId: '?string',
      whoId: '?string',
    },
  },
  RenderStoredEmailTemplateResult: {
    type: 'RenderStoredEmailTemplateResult',
    props: {
      errors: ['Error'],
      renderedEmail: '?SingleEmailMessage',
      success: 'boolean',
    },
  },
  LimitInfo: {
    type: 'LimitInfo',
    props: {
      current: 'number',
      limit: 'number',
      type: 'string',
    },
  },
  OwnerChangeOption: {
    type: 'OwnerChangeOption',
    props: {
      type: 'string',
      execute: 'boolean',
    },
  },
  ApiFault: {
    type: 'ApiFault',
    props: {
      exceptionCode: 'string',
      exceptionMessage: 'string',
      extendedErrorDetails: ['?', 'ExtendedErrorDetails'],
    },
  },
  ApiQueryFault: {
    type: 'ApiQueryFault',
    props: {
      row: 'number',
      column: 'number',
    },
    extends: 'ApiFault',
  },
  LoginFault: {
    type: 'LoginFault',
    props: {},
    extends: 'ApiFault',
  },
  InvalidQueryLocatorFault: {
    type: 'InvalidQueryLocatorFault',
    props: {},
    extends: 'ApiFault',
  },
  InvalidNewPasswordFault: {
    type: 'InvalidNewPasswordFault',
    props: {},
    extends: 'ApiFault',
  },
  InvalidOldPasswordFault: {
    type: 'InvalidOldPasswordFault',
    props: {},
    extends: 'ApiFault',
  },
  InvalidIdFault: {
    type: 'InvalidIdFault',
    props: {},
    extends: 'ApiFault',
  },
  UnexpectedErrorFault: {
    type: 'UnexpectedErrorFault',
    props: {},
    extends: 'ApiFault',
  },
  InvalidFieldFault: {
    type: 'InvalidFieldFault',
    props: {},
    extends: 'ApiQueryFault',
  },
  InvalidSObjectFault: {
    type: 'InvalidSObjectFault',
    props: {},
    extends: 'ApiQueryFault',
  },
  MalformedQueryFault: {
    type: 'MalformedQueryFault',
    props: {},
    extends: 'ApiQueryFault',
  },
  MalformedSearchFault: {
    type: 'MalformedSearchFault',
    props: {},
    extends: 'ApiQueryFault',
  },
} as const;

export type sObject = {
  type: string;
  fieldsToNull?: string[] | null | undefined;
  Id?: string | null | undefined;
};

export type address = location & {
  city?: string | null | undefined;
  country?: string | null | undefined;
  countryCode?: string | null | undefined;
  geocodeAccuracy?: string | null | undefined;
  postalCode?: string | null | undefined;
  state?: string | null | undefined;
  stateCode?: string | null | undefined;
  street?: string | null | undefined;
};

export type location = {
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
};

export type QueryResult = {
  done: boolean;
  queryLocator?: string | null | undefined;
  records?: sObject[] | null | undefined;
  size: number;
};

export type SearchResult = {
  queryId: string;
  searchRecords: SearchRecord[];
  searchResultsMetadata?: SearchResultsMetadata | null | undefined;
};

export type SearchRecord = {
  record: sObject;
  searchRecordMetadata?: SearchRecordMetadata | null | undefined;
  snippet?: SearchSnippet | null | undefined;
};

export type SearchRecordMetadata = {
  searchPromoted: boolean;
  spellCorrected: boolean;
};

export type SearchSnippet = {
  text?: string | null | undefined;
  wholeFields: NameValuePair[];
};

export type SearchResultsMetadata = {
  entityLabelMetadata: LabelsSearchMetadata[];
  entityMetadata: EntitySearchMetadata[];
};

export type LabelsSearchMetadata = {
  entityFieldLabels: NameValuePair[];
  entityName: string;
};

export type EntitySearchMetadata = {
  entityName: string;
  errorMetadata?: EntityErrorMetadata | null | undefined;
  fieldMetadata: FieldLevelSearchMetadata[];
  intentQueryMetadata?: EntityIntentQueryMetadata | null | undefined;
  searchPromotionMetadata?: EntitySearchPromotionMetadata | null | undefined;
  spellCorrectionMetadata?: EntitySpellCorrectionMetadata | null | undefined;
};

export type FieldLevelSearchMetadata = {
  label?: string | null | undefined;
  name: string;
  type?: string | null | undefined;
};

export type EntitySpellCorrectionMetadata = {
  correctedQuery: string;
  hasNonCorrectedResults: boolean;
};

export type EntitySearchPromotionMetadata = {
  promotedResultCount: number;
};

export type EntityIntentQueryMetadata = {
  intentQuery: boolean;
  message?: string | null | undefined;
};

export type EntityErrorMetadata = {
  errorCode?: string | null | undefined;
  message?: string | null | undefined;
};

export type RelationshipReferenceTo = {
  referenceTo: string[];
};

export type RecordTypesSupported = {
  recordTypeInfos: RecordTypeInfo[];
};

export type JunctionIdListNames = {
  names: string[];
};

export type SearchLayoutButtonsDisplayed = {
  applicable: boolean;
  buttons: SearchLayoutButton[];
};

export type SearchLayoutButton = {
  apiName: string;
  label: string;
};

export type SearchLayoutFieldsDisplayed = {
  applicable: boolean;
  fields: SearchLayoutField[];
};

export type SearchLayoutField = {
  apiName: string;
  label: string;
  sortable: boolean;
};

export type NameValuePair = {
  name: string;
  value: string;
};

export type NameObjectValuePair = {
  isVisible?: boolean | null | undefined;
  name: string;
  value: any[];
};

export type GetUpdatedResult = {
  ids: string[];
  latestDateCovered: string;
};

export type GetDeletedResult = {
  deletedRecords: DeletedRecord[];
  earliestDateAvailable: string;
  latestDateCovered: string;
};

export type DeletedRecord = {
  deletedDate: string;
  id: string;
};

export type GetServerTimestampResult = {
  timestamp: string;
};

export type InvalidateSessionsResult = {
  errors: Error[];
  success: boolean;
};

export type SetPasswordResult = {};

export type ChangeOwnPasswordResult = {};

export type ResetPasswordResult = {
  password: string;
};

export type GetUserInfoResult = {
  accessibilityMode: boolean;
  chatterExternal: boolean;
  currencySymbol?: string | null | undefined;
  orgAttachmentFileSizeLimit: number;
  orgDefaultCurrencyIsoCode?: string | null | undefined;
  orgDefaultCurrencyLocale?: string | null | undefined;
  orgDisallowHtmlAttachments: boolean;
  orgHasPersonAccounts: boolean;
  organizationId: string;
  organizationMultiCurrency: boolean;
  organizationName: string;
  profileId: string;
  roleId?: string | null | undefined;
  sessionSecondsValid: number;
  userDefaultCurrencyIsoCode?: string | null | undefined;
  userEmail: string;
  userFullName: string;
  userId: string;
  userLanguage: string;
  userLocale: string;
  userName: string;
  userTimeZone: string;
  userType: string;
  userUiSkin: string;
};

export type LoginResult = {
  metadataServerUrl?: string | null | undefined;
  passwordExpired: boolean;
  sandbox: boolean;
  serverUrl?: string | null | undefined;
  sessionId?: string | null | undefined;
  userId?: string | null | undefined;
  userInfo?: GetUserInfoResult | null | undefined;
};

export type ExtendedErrorDetails = {
  extendedErrorCode: string;
};

export type Error = {
  extendedErrorDetails?: ExtendedErrorDetails[] | null | undefined;
  fields?: string[] | null | undefined;
  message: string;
  statusCode: string;
};

export type SendEmailError = {
  fields?: string[] | null | undefined;
  message: string;
  statusCode: string;
  targetObjectId?: string | null | undefined;
};

export type SaveResult = {
  errors: Error[];
  id?: string | null | undefined;
  success: boolean;
};

export type RenderEmailTemplateError = {
  fieldName: string;
  message: string;
  offset: number;
  statusCode: string;
};

export type UpsertResult = {
  created: boolean;
  errors: Error[];
  id?: string | null | undefined;
  success: boolean;
};

export type PerformQuickActionResult = {
  contextId?: string | null | undefined;
  created: boolean;
  errors: Error[];
  feedItemIds?: string[] | null | undefined;
  ids?: string[] | null | undefined;
  success: boolean;
  successMessage?: string | null | undefined;
};

export type QuickActionTemplateResult = {
  contextId?: string | null | undefined;
  defaultValueFormulas?: sObject | null | undefined;
  defaultValues?: sObject | null | undefined;
  errors: Error[];
  success: boolean;
};

export type MergeRequest = {
  additionalInformationMap: AdditionalInformationMap[];
  masterRecord: sObject;
  recordToMergeIds: string[];
};

export type MergeResult = {
  errors: Error[];
  id?: string | null | undefined;
  mergedRecordIds: string[];
  success: boolean;
  updatedRelatedIds: string[];
};

export type ProcessRequest = {
  comments?: string | null | undefined;
  nextApproverIds?: string[] | null | undefined;
};

export type ProcessSubmitRequest = ProcessRequest & {
  objectId: string;
  submitterId?: string | null | undefined;
  processDefinitionNameOrId?: string | null | undefined;
  skipEntryCriteria?: boolean | null | undefined;
};

export type ProcessWorkitemRequest = ProcessRequest & {
  action: string;
  workitemId: string;
};

export type PerformQuickActionRequest = {
  contextId?: string | null | undefined;
  quickActionName: string;
  records?: sObject[] | null | undefined;
};

export type DescribeAvailableQuickActionResult = {
  actionEnumOrId: string;
  label: string;
  name: string;
  type: string;
};

export type DescribeQuickActionResult = {
  accessLevelRequired?: string | null | undefined;
  actionEnumOrId: string;
  canvasApplicationId?: string | null | undefined;
  canvasApplicationName?: string | null | undefined;
  colors: DescribeColor[];
  contextSobjectType?: string | null | undefined;
  defaultValues?: DescribeQuickActionDefaultValue[] | null | undefined;
  flowDevName?: string | null | undefined;
  flowRecordIdVar?: string | null | undefined;
  height?: number | null | undefined;
  iconName?: string | null | undefined;
  iconUrl?: string | null | undefined;
  icons: DescribeIcon[];
  label: string;
  layout?: DescribeLayoutSection | null | undefined;
  lightningComponentBundleId?: string | null | undefined;
  lightningComponentBundleName?: string | null | undefined;
  lightningComponentQualifiedName?: string | null | undefined;
  miniIconUrl?: string | null | undefined;
  mobileExtensionDisplayMode?: string | null | undefined;
  mobileExtensionId?: string | null | undefined;
  name: string;
  showQuickActionLcHeader: boolean;
  showQuickActionVfHeader: boolean;
  targetParentField?: string | null | undefined;
  targetRecordTypeId?: string | null | undefined;
  targetSobjectType?: string | null | undefined;
  type: string;
  visualforcePageName?: string | null | undefined;
  visualforcePageUrl?: string | null | undefined;
  width?: number | null | undefined;
};

export type DescribeQuickActionDefaultValue = {
  defaultValue?: string | null | undefined;
  field: string;
};

export type DescribeVisualForceResult = {
  domain: string;
};

export type ProcessResult = {
  actorIds: string[];
  entityId?: string | null | undefined;
  errors: Error[];
  instanceId?: string | null | undefined;
  instanceStatus?: string | null | undefined;
  newWorkitemIds?: string[] | null | undefined;
  success: boolean;
};

export type DeleteResult = {
  errors?: Error[] | null | undefined;
  id?: string | null | undefined;
  success: boolean;
};

export type UndeleteResult = {
  errors: Error[];
  id?: string | null | undefined;
  success: boolean;
};

export type DeleteByExampleResult = {
  entity?: sObject | null | undefined;
  errors?: Error[] | null | undefined;
  rowCount: number;
  success: boolean;
};

export type EmptyRecycleBinResult = {
  errors: Error[];
  id?: string | null | undefined;
  success: boolean;
};

export type LeadConvert = {
  accountId?: string | null | undefined;
  accountRecord?: sObject | null | undefined;
  bypassAccountDedupeCheck?: boolean | null | undefined;
  bypassContactDedupeCheck?: boolean | null | undefined;
  contactId?: string | null | undefined;
  contactRecord?: sObject | null | undefined;
  convertedStatus: string;
  doNotCreateOpportunity: boolean;
  leadId: string;
  opportunityId?: string | null | undefined;
  opportunityName?: string | null | undefined;
  opportunityRecord?: sObject | null | undefined;
  overwriteLeadSource: boolean;
  ownerId?: string | null | undefined;
  sendNotificationEmail: boolean;
};

export type LeadConvertResult = {
  accountId?: string | null | undefined;
  contactId?: string | null | undefined;
  errors: Error[];
  leadId?: string | null | undefined;
  opportunityId?: string | null | undefined;
  success: boolean;
};

export type DescribeSObjectResult = {
  actionOverrides?: ActionOverride[] | null | undefined;
  activateable: boolean;
  childRelationships: ChildRelationship[];
  compactLayoutable: boolean;
  createable: boolean;
  custom: boolean;
  customSetting: boolean;
  dataTranslationEnabled?: boolean | null | undefined;
  deepCloneable: boolean;
  defaultImplementation?: string | null | undefined;
  deletable: boolean;
  deprecatedAndHidden: boolean;
  feedEnabled: boolean;
  fields?: Field[] | null | undefined;
  hasSubtypes: boolean;
  idEnabled: boolean;
  implementedBy?: string | null | undefined;
  implementsInterfaces?: string | null | undefined;
  isInterface: boolean;
  isSubtype: boolean;
  keyPrefix?: string | null | undefined;
  label: string;
  labelPlural: string;
  layoutable: boolean;
  mergeable: boolean;
  mruEnabled: boolean;
  name: string;
  namedLayoutInfos: NamedLayoutInfo[];
  networkScopeFieldName?: string | null | undefined;
  queryable: boolean;
  recordTypeInfos: RecordTypeInfo[];
  replicateable: boolean;
  retrieveable: boolean;
  searchLayoutable?: boolean | null | undefined;
  searchable: boolean;
  supportedScopes?: ScopeInfo[] | null | undefined;
  triggerable?: boolean | null | undefined;
  undeletable: boolean;
  updateable: boolean;
  urlDetail?: string | null | undefined;
  urlEdit?: string | null | undefined;
  urlNew?: string | null | undefined;
};

export type DescribeGlobalSObjectResult = {
  activateable: boolean;
  createable: boolean;
  custom: boolean;
  customSetting: boolean;
  dataTranslationEnabled?: boolean | null | undefined;
  deepCloneable: boolean;
  deletable: boolean;
  deprecatedAndHidden: boolean;
  feedEnabled: boolean;
  hasSubtypes: boolean;
  idEnabled: boolean;
  isInterface: boolean;
  isSubtype: boolean;
  keyPrefix?: string | null | undefined;
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
};

export type ChildRelationship = {
  cascadeDelete: boolean;
  childSObject: string;
  deprecatedAndHidden: boolean;
  field: string;
  junctionIdListNames?: string[] | null | undefined;
  junctionReferenceTo?: string[] | null | undefined;
  relationshipName?: string | null | undefined;
  restrictedDelete?: boolean | null | undefined;
};

export type DescribeGlobalResult = {
  encoding?: string | null | undefined;
  maxBatchSize: number;
  sobjects: DescribeGlobalSObjectResult[];
};

export type DescribeGlobalTheme = {
  global: DescribeGlobalResult;
  theme: DescribeThemeResult;
};

export type ScopeInfo = {
  label: string;
  name: string;
};

export type StringList = {
  values: string[];
};

export type ChangeEventHeader = {
  entityName: string;
  recordIds: string[];
  commitTimestamp: number;
  commitNumber: number;
  commitUser: string;
  diffFields: string[];
  changeType: string;
  changeOrigin: string;
  transactionKey: string;
  sequenceNumber: number;
  nulledFields: string[];
  changedFields: string[];
};

export type FilteredLookupInfo = {
  controllingFields: string[];
  dependent: boolean;
  optionalFilter: boolean;
};

export type Field = {
  aggregatable: boolean;
  aiPredictionField: boolean;
  autoNumber: boolean;
  byteLength: number;
  calculated: boolean;
  calculatedFormula?: string | null | undefined;
  cascadeDelete?: boolean | null | undefined;
  caseSensitive: boolean;
  compoundFieldName?: string | null | undefined;
  controllerName?: string | null | undefined;
  createable: boolean;
  custom: boolean;
  dataTranslationEnabled?: boolean | null | undefined;
  defaultValue?: any | null | undefined;
  defaultValueFormula?: string | null | undefined;
  defaultedOnCreate: boolean;
  dependentPicklist?: boolean | null | undefined;
  deprecatedAndHidden: boolean;
  digits: number;
  displayLocationInDecimal?: boolean | null | undefined;
  encrypted?: boolean | null | undefined;
  externalId?: boolean | null | undefined;
  extraTypeInfo?: string | null | undefined;
  filterable: boolean;
  filteredLookupInfo?: FilteredLookupInfo | null | undefined;
  formulaTreatNullNumberAsZero?: boolean | null | undefined;
  groupable: boolean;
  highScaleNumber?: boolean | null | undefined;
  htmlFormatted?: boolean | null | undefined;
  idLookup: boolean;
  inlineHelpText?: string | null | undefined;
  label: string;
  length: number;
  mask?: string | null | undefined;
  maskType?: string | null | undefined;
  name: string;
  nameField: boolean;
  namePointing?: boolean | null | undefined;
  nillable: boolean;
  permissionable: boolean;
  picklistValues?: PicklistEntry[] | null | undefined;
  polymorphicForeignKey: boolean;
  precision: number;
  queryByDistance: boolean;
  referenceTargetField?: string | null | undefined;
  referenceTo?: string[] | null | undefined;
  relationshipName?: string | null | undefined;
  relationshipOrder?: number | null | undefined;
  restrictedDelete?: boolean | null | undefined;
  restrictedPicklist: boolean;
  scale: number;
  searchPrefilterable: boolean;
  soapType: string;
  sortable?: boolean | null | undefined;
  type: string;
  unique: boolean;
  updateable: boolean;
  writeRequiresMasterRead?: boolean | null | undefined;
};

export type PicklistEntry = {
  active: boolean;
  defaultValue: boolean;
  label?: string | null | undefined;
  validFor?: string | null | undefined;
  value: string;
};

export type DescribeDataCategoryGroupResult = {
  categoryCount: number;
  description: string;
  label: string;
  name: string;
  sobject: string;
};

export type DescribeDataCategoryGroupStructureResult = {
  description: string;
  label: string;
  name: string;
  sobject: string;
  topCategories: DataCategory[];
};

export type DataCategoryGroupSobjectTypePair = {
  dataCategoryGroupName: string;
  sobject: string;
};

export type DataCategory = {
  childCategories: DataCategory[];
  label: string;
  name: string;
};

export type DescribeDataCategoryMappingResult = {
  dataCategoryGroupId: string;
  dataCategoryGroupLabel: string;
  dataCategoryGroupName: string;
  dataCategoryId: string;
  dataCategoryLabel: string;
  dataCategoryName: string;
  id: string;
  mappedEntity: string;
  mappedField: string;
};

export type KnowledgeSettings = {
  defaultLanguage?: string | null | undefined;
  knowledgeEnabled: boolean;
  languages: KnowledgeLanguageItem[];
};

export type KnowledgeLanguageItem = {
  active: boolean;
  assigneeId?: string | null | undefined;
  name: string;
};

export type FieldDiff = {
  difference: string;
  name: string;
};

export type AdditionalInformationMap = {
  name: string;
  value: string;
};

export type MatchRecord = {
  additionalInformation: AdditionalInformationMap[];
  fieldDiffs: FieldDiff[];
  matchConfidence: number;
  record: sObject;
};

export type MatchResult = {
  entityType: string;
  errors: Error[];
  matchEngine: string;
  matchRecords: MatchRecord[];
  rule: string;
  size: number;
  success: boolean;
};

export type DuplicateResult = {
  allowSave: boolean;
  duplicateRule: string;
  duplicateRuleEntityType: string;
  errorMessage?: string | null | undefined;
  matchResults: MatchResult[];
};

export type DuplicateError = Error & {
  duplicateResult: DuplicateResult;
};

export type DescribeNounResult = {
  caseValues: NameCaseValue[];
  developerName: string;
  gender?: string | null | undefined;
  name: string;
  pluralAlias?: string | null | undefined;
  startsWith?: string | null | undefined;
};

export type NameCaseValue = {
  article?: string | null | undefined;
  caseType?: string | null | undefined;
  number?: string | null | undefined;
  possessive?: string | null | undefined;
  value?: string | null | undefined;
};

export type FindDuplicatesResult = {
  duplicateResults: DuplicateResult[];
  errors: Error[];
  success: boolean;
};

export type DescribeAppMenuResult = {
  appMenuItems: DescribeAppMenuItem[];
};

export type DescribeAppMenuItem = {
  colors: DescribeColor[];
  content: string;
  icons: DescribeIcon[];
  label: string;
  name: string;
  type: string;
  url: string;
};

export type DescribeThemeResult = {
  themeItems: DescribeThemeItem[];
};

export type DescribeThemeItem = {
  colors: DescribeColor[];
  icons: DescribeIcon[];
  name: string;
};

export type DescribeSoftphoneLayoutResult = {
  callTypes: DescribeSoftphoneLayoutCallType[];
  id: string;
  name: string;
};

export type DescribeSoftphoneLayoutCallType = {
  infoFields: DescribeSoftphoneLayoutInfoField[];
  name: string;
  screenPopOptions: DescribeSoftphoneScreenPopOption[];
  screenPopsOpenWithin?: string | null | undefined;
  sections: DescribeSoftphoneLayoutSection[];
};

export type DescribeSoftphoneScreenPopOption = {
  matchType: string;
  screenPopData: string;
  screenPopType: string;
};

export type DescribeSoftphoneLayoutInfoField = {
  name: string;
};

export type DescribeSoftphoneLayoutSection = {
  entityApiName: string;
  items: DescribeSoftphoneLayoutItem[];
};

export type DescribeSoftphoneLayoutItem = {
  itemApiName: string;
};

export type DescribeCompactLayoutsResult = {
  compactLayouts: DescribeCompactLayout[];
  defaultCompactLayoutId: string;
  recordTypeCompactLayoutMappings: RecordTypeCompactLayoutMapping[];
};

export type DescribeCompactLayout = {
  actions: DescribeLayoutButton[];
  fieldItems: DescribeLayoutItem[];
  id: string;
  imageItems: DescribeLayoutItem[];
  label: string;
  name: string;
  objectType: string;
};

export type RecordTypeCompactLayoutMapping = {
  available: boolean;
  compactLayoutId?: string | null | undefined;
  compactLayoutName: string;
  recordTypeId: string;
  recordTypeName: string;
};

export type DescribePathAssistantsResult = {
  pathAssistants: DescribePathAssistant[];
};

export type DescribePathAssistant = {
  active: boolean;
  animationRule?: DescribeAnimationRule[] | null | undefined;
  apiName: string;
  label: string;
  pathPicklistField: string;
  picklistsForRecordType?: PicklistForRecordType[] | null | undefined;
  recordTypeId?: string | null | undefined;
  steps: DescribePathAssistantStep[];
};

export type DescribePathAssistantStep = {
  closed: boolean;
  converted: boolean;
  fields: DescribePathAssistantField[];
  info?: string | null | undefined;
  layoutSection?: DescribeLayoutSection | null | undefined;
  picklistLabel: string;
  picklistValue: string;
  won: boolean;
};

export type DescribePathAssistantField = {
  apiName: string;
  label: string;
  readOnly: boolean;
  required: boolean;
};

export type DescribeAnimationRule = {
  animationFrequency: string;
  isActive: boolean;
  recordTypeContext: string;
  recordTypeId?: string | null | undefined;
  targetField: string;
  targetFieldChangeToValues: string;
};

export type DescribeApprovalLayoutResult = {
  approvalLayouts: DescribeApprovalLayout[];
};

export type DescribeApprovalLayout = {
  id: string;
  label: string;
  layoutItems: DescribeLayoutItem[];
  name: string;
};

export type DescribeLayoutResult = {
  layouts: DescribeLayout[];
  recordTypeMappings: RecordTypeMapping[];
  recordTypeSelectorRequired: boolean;
};

export type DescribeLayout = {
  buttonLayoutSection?: DescribeLayoutButtonSection | null | undefined;
  detailLayoutSections: DescribeLayoutSection[];
  editLayoutSections: DescribeLayoutSection[];
  feedView?: DescribeLayoutFeedView | null | undefined;
  highlightsPanelLayoutSection?: DescribeLayoutSection | null | undefined;
  id?: string | null | undefined;
  quickActionList?: DescribeQuickActionListResult | null | undefined;
  relatedContent?: RelatedContent | null | undefined;
  relatedLists: RelatedList[];
  saveOptions: DescribeLayoutSaveOption[];
};

export type DescribeQuickActionListResult = {
  quickActionListItems: DescribeQuickActionListItemResult[];
};

export type DescribeQuickActionListItemResult = {
  accessLevelRequired?: string | null | undefined;
  colors: DescribeColor[];
  iconUrl?: string | null | undefined;
  icons: DescribeIcon[];
  label: string;
  miniIconUrl: string;
  quickActionName: string;
  targetSobjectType?: string | null | undefined;
  type: string;
};

export type DescribeLayoutFeedView = {
  feedFilters: DescribeLayoutFeedFilter[];
};

export type DescribeLayoutFeedFilter = {
  label: string;
  name: string;
  type: string;
};

export type DescribeLayoutSaveOption = {
  defaultValue: boolean;
  isDisplayed: boolean;
  label: string;
  name: string;
  restHeaderName: string;
  soapHeaderName: string;
};

export type DescribeLayoutSection = {
  collapsed: boolean;
  columns: number;
  heading?: string | null | undefined;
  layoutRows: DescribeLayoutRow[];
  layoutSectionId?: string | null | undefined;
  parentLayoutId: string;
  rows: number;
  tabOrder: string;
  useCollapsibleSection: boolean;
  useHeading: boolean;
};

export type DescribeLayoutButtonSection = {
  detailButtons: DescribeLayoutButton[];
};

export type DescribeLayoutRow = {
  layoutItems: DescribeLayoutItem[];
  numItems: number;
};

export type DescribeLayoutItem = {
  editableForNew: boolean;
  editableForUpdate: boolean;
  label?: string | null | undefined;
  layoutComponents: DescribeLayoutComponent[];
  placeholder: boolean;
  required: boolean;
};

export type DescribeLayoutButton = {
  behavior?: string | null | undefined;
  colors: DescribeColor[];
  content?: string | null | undefined;
  contentSource?: string | null | undefined;
  custom: boolean;
  encoding?: string | null | undefined;
  height?: number | null | undefined;
  icons: DescribeIcon[];
  label?: string | null | undefined;
  menubar?: boolean | null | undefined;
  name?: string | null | undefined;
  overridden: boolean;
  resizeable?: boolean | null | undefined;
  scrollbars?: boolean | null | undefined;
  showsLocation?: boolean | null | undefined;
  showsStatus?: boolean | null | undefined;
  toolbar?: boolean | null | undefined;
  url?: string | null | undefined;
  width?: number | null | undefined;
  windowPosition?: string | null | undefined;
};

export type DescribeLayoutComponent = {
  displayLines: number;
  tabOrder: number;
  type: string;
  value?: string | null | undefined;
};

export type FieldComponent = DescribeLayoutComponent & {
  field: Field;
};

export type FieldLayoutComponent = DescribeLayoutComponent & {
  components: DescribeLayoutComponent[];
  fieldType: string;
};

export type VisualforcePage = DescribeLayoutComponent & {
  showLabel: boolean;
  showScrollbars: boolean;
  suggestedHeight: string;
  suggestedWidth: string;
  url: string;
};

export type Canvas = DescribeLayoutComponent & {
  displayLocation: string;
  referenceId: string;
  showLabel: boolean;
  showScrollbars: boolean;
  suggestedHeight: string;
  suggestedWidth: string;
};

export type ReportChartComponent = DescribeLayoutComponent & {
  cacheData: boolean;
  contextFilterableField: string;
  error: string;
  hideOnError: boolean;
  includeContext: boolean;
  showTitle: boolean;
  size: string;
};

export type AnalyticsCloudComponent = DescribeLayoutComponent & {
  error: string;
  filter: string;
  height: string;
  hideOnError: boolean;
  showSharing: boolean;
  showTitle: boolean;
  width: string;
};

export type CustomLinkComponent = DescribeLayoutComponent & {
  customLink: DescribeLayoutButton;
};

export type NamedLayoutInfo = {
  name: string;
};

export type RecordTypeInfo = {
  active: boolean;
  available: boolean;
  defaultRecordTypeMapping: boolean;
  developerName: string;
  master: boolean;
  name: string;
  recordTypeId?: string | null | undefined;
};

export type RecordTypeMapping = {
  active: boolean;
  available: boolean;
  defaultRecordTypeMapping: boolean;
  developerName: string;
  layoutId: string;
  master: boolean;
  name: string;
  picklistsForRecordType?: PicklistForRecordType[] | null | undefined;
  recordTypeId?: string | null | undefined;
};

export type PicklistForRecordType = {
  picklistName: string;
  picklistValues?: PicklistEntry[] | null | undefined;
};

export type RelatedContent = {
  relatedContentItems: DescribeRelatedContentItem[];
};

export type DescribeRelatedContentItem = {
  describeLayoutItem: DescribeLayoutItem;
};

export type RelatedList = {
  accessLevelRequiredForCreate?: string | null | undefined;
  buttons?: DescribeLayoutButton[] | null | undefined;
  columns: RelatedListColumn[];
  custom: boolean;
  field?: string | null | undefined;
  label: string;
  limitRows: number;
  name: string;
  sobject?: string | null | undefined;
  sort: RelatedListSort[];
};

export type RelatedListColumn = {
  field?: string | null | undefined;
  fieldApiName: string;
  format?: string | null | undefined;
  label: string;
  lookupId?: string | null | undefined;
  name: string;
  sortable: boolean;
};

export type RelatedListSort = {
  ascending: boolean;
  column: string;
};

export type EmailFileAttachment = {
  body?: string | null | undefined;
  contentType?: string | null | undefined;
  fileName: string;
  id?: string | null | undefined;
  inline?: boolean | null | undefined;
};

export type Email = {
  bccSender?: boolean | null | undefined;
  emailPriority?: string | null | undefined;
  replyTo?: string | null | undefined;
  saveAsActivity?: boolean | null | undefined;
  senderDisplayName?: string | null | undefined;
  subject?: string | null | undefined;
  useSignature?: boolean | null | undefined;
};

export type MassEmailMessage = Email & {
  description?: string | null | undefined;
  targetObjectIds?: string | null | undefined;
  templateId: string;
  whatIds?: string | null | undefined;
};

export type SingleEmailMessage = Email & {
  bccAddresses?: string | null | undefined;
  ccAddresses?: string | null | undefined;
  charset?: string | null | undefined;
  documentAttachments: string[];
  entityAttachments: string[];
  fileAttachments: EmailFileAttachment[];
  htmlBody?: string | null | undefined;
  inReplyTo?: string | null | undefined;
  optOutPolicy?: string | null | undefined;
  orgWideEmailAddressId?: string | null | undefined;
  plainTextBody?: string | null | undefined;
  references?: string | null | undefined;
  targetObjectId?: string | null | undefined;
  templateId?: string | null | undefined;
  templateName?: string | null | undefined;
  toAddresses?: string | null | undefined;
  treatBodiesAsTemplate?: boolean | null | undefined;
  treatTargetObjectAsRecipient?: boolean | null | undefined;
  whatId?: string | null | undefined;
};

export type SendEmailResult = {
  errors: SendEmailError[];
  success: boolean;
};

export type ListViewColumn = {
  ascendingLabel?: string | null | undefined;
  descendingLabel?: string | null | undefined;
  fieldNameOrPath: string;
  hidden: boolean;
  label: string;
  searchable: boolean;
  selectListItem: string;
  sortDirection?: string | null | undefined;
  sortIndex?: number | null | undefined;
  sortable: boolean;
  type: string;
};

export type ListViewOrderBy = {
  fieldNameOrPath: string;
  nullsPosition?: string | null | undefined;
  sortDirection?: string | null | undefined;
};

export type DescribeSoqlListView = {
  columns: ListViewColumn[];
  id: string;
  orderBy: ListViewOrderBy[];
  query: string;
  relatedEntityId?: string | null | undefined;
  scope?: string | null | undefined;
  scopeEntityId?: string | null | undefined;
  sobjectType: string;
  whereCondition?: SoqlWhereCondition | null | undefined;
};

export type DescribeSoqlListViewsRequest = {
  listViewParams: DescribeSoqlListViewParams[];
};

export type DescribeSoqlListViewParams = {
  developerNameOrId: string;
  sobjectType?: string | null | undefined;
};

export type DescribeSoqlListViewResult = {
  describeSoqlListViews: DescribeSoqlListView[];
};

export type ExecuteListViewRequest = {
  developerNameOrId: string;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  orderBy: ListViewOrderBy[];
  sobjectType: string;
};

export type ExecuteListViewResult = {
  columns: ListViewColumn[];
  developerName: string;
  done: boolean;
  id: string;
  label: string;
  records: ListViewRecord[];
  size: number;
};

export type ListViewRecord = {
  columns: ListViewRecordColumn[];
};

export type ListViewRecordColumn = {
  fieldNameOrPath: string;
  value?: string | null | undefined;
};

export type SoqlWhereCondition = {};

export type SoqlCondition = SoqlWhereCondition & {
  field: string;
  operator: string;
  values: string[];
};

export type SoqlNotCondition = SoqlWhereCondition & {
  condition: SoqlWhereCondition;
};

export type SoqlConditionGroup = SoqlWhereCondition & {
  conditions: SoqlWhereCondition[];
  conjunction: string;
};

export type SoqlSubQueryCondition = SoqlWhereCondition & {
  field: string;
  operator: string;
  subQuery: string;
};

export type DescribeSearchLayoutResult = {
  errorMsg?: string | null | undefined;
  label?: string | null | undefined;
  limitRows?: number | null | undefined;
  objectType: string;
  searchColumns?: DescribeColumn[] | null | undefined;
};

export type DescribeColumn = {
  field: string;
  format?: string | null | undefined;
  label: string;
  name: string;
};

export type DescribeSearchScopeOrderResult = {
  keyPrefix: string;
  name: string;
};

export type DescribeSearchableEntityResult = {
  label: string;
  name: string;
  pluralLabel: string;
};

export type DescribeTabSetResult = {
  description: string;
  label: string;
  logoUrl: string;
  namespace?: string | null | undefined;
  selected: boolean;
  tabSetId: string;
  tabs: DescribeTab[];
};

export type DescribeTab = {
  colors: DescribeColor[];
  custom: boolean;
  iconUrl: string;
  icons: DescribeIcon[];
  label: string;
  miniIconUrl: string;
  name: string;
  sobjectName?: string | null | undefined;
  url: string;
};

export type DescribeColor = {
  color: string;
  context: string;
  theme: string;
};

export type DescribeIcon = {
  contentType: string;
  height?: number | null | undefined;
  theme: string;
  url: string;
  width?: number | null | undefined;
};

export type ActionOverride = {
  formFactor: string;
  isAvailableInTouch: boolean;
  name: string;
  pageId: string;
  url?: string | null | undefined;
};

export type RenderEmailTemplateRequest = {
  escapeHtmlInMergeFields?: boolean | null | undefined;
  templateBodies: string;
  whatId?: string | null | undefined;
  whoId?: string | null | undefined;
};

export type RenderEmailTemplateBodyResult = {
  errors: RenderEmailTemplateError[];
  mergedBody?: string | null | undefined;
  success: boolean;
};

export type RenderEmailTemplateResult = {
  bodyResults?: RenderEmailTemplateBodyResult | null | undefined;
  errors: Error[];
  success: boolean;
};

export type RenderStoredEmailTemplateRequest = {
  attachmentRetrievalOption?: string | null | undefined;
  templateId: string;
  updateTemplateUsage?: boolean | null | undefined;
  whatId?: string | null | undefined;
  whoId?: string | null | undefined;
};

export type RenderStoredEmailTemplateResult = {
  errors: Error[];
  renderedEmail?: SingleEmailMessage | null | undefined;
  success: boolean;
};

export type LimitInfo = {
  current: number;
  limit: number;
  type: string;
};

export type OwnerChangeOption = {
  type: string;
  execute: boolean;
};

export type ApiFault = {
  exceptionCode: string;
  exceptionMessage: string;
  extendedErrorDetails?: ExtendedErrorDetails[] | null | undefined;
};

export type ApiQueryFault = ApiFault & {
  row: number;
  column: number;
};

export type LoginFault = ApiFault & {};

export type InvalidQueryLocatorFault = ApiFault & {};

export type InvalidNewPasswordFault = ApiFault & {};

export type InvalidOldPasswordFault = ApiFault & {};

export type InvalidIdFault = ApiFault & {};

export type UnexpectedErrorFault = ApiFault & {};

export type InvalidFieldFault = ApiQueryFault & {};

export type InvalidSObjectFault = ApiQueryFault & {};

export type MalformedQueryFault = ApiQueryFault & {};

export type MalformedSearchFault = ApiQueryFault & {};

export type ApiSchemaTypes = {
  sObject: sObject;
  address: address;
  location: location;
  QueryResult: QueryResult;
  SearchResult: SearchResult;
  SearchRecord: SearchRecord;
  SearchRecordMetadata: SearchRecordMetadata;
  SearchSnippet: SearchSnippet;
  SearchResultsMetadata: SearchResultsMetadata;
  LabelsSearchMetadata: LabelsSearchMetadata;
  EntitySearchMetadata: EntitySearchMetadata;
  FieldLevelSearchMetadata: FieldLevelSearchMetadata;
  EntitySpellCorrectionMetadata: EntitySpellCorrectionMetadata;
  EntitySearchPromotionMetadata: EntitySearchPromotionMetadata;
  EntityIntentQueryMetadata: EntityIntentQueryMetadata;
  EntityErrorMetadata: EntityErrorMetadata;
  RelationshipReferenceTo: RelationshipReferenceTo;
  RecordTypesSupported: RecordTypesSupported;
  JunctionIdListNames: JunctionIdListNames;
  SearchLayoutButtonsDisplayed: SearchLayoutButtonsDisplayed;
  SearchLayoutButton: SearchLayoutButton;
  SearchLayoutFieldsDisplayed: SearchLayoutFieldsDisplayed;
  SearchLayoutField: SearchLayoutField;
  NameValuePair: NameValuePair;
  NameObjectValuePair: NameObjectValuePair;
  GetUpdatedResult: GetUpdatedResult;
  GetDeletedResult: GetDeletedResult;
  DeletedRecord: DeletedRecord;
  GetServerTimestampResult: GetServerTimestampResult;
  InvalidateSessionsResult: InvalidateSessionsResult;
  SetPasswordResult: SetPasswordResult;
  ChangeOwnPasswordResult: ChangeOwnPasswordResult;
  ResetPasswordResult: ResetPasswordResult;
  GetUserInfoResult: GetUserInfoResult;
  LoginResult: LoginResult;
  ExtendedErrorDetails: ExtendedErrorDetails;
  Error: Error;
  SendEmailError: SendEmailError;
  SaveResult: SaveResult;
  RenderEmailTemplateError: RenderEmailTemplateError;
  UpsertResult: UpsertResult;
  PerformQuickActionResult: PerformQuickActionResult;
  QuickActionTemplateResult: QuickActionTemplateResult;
  MergeRequest: MergeRequest;
  MergeResult: MergeResult;
  ProcessRequest: ProcessRequest;
  ProcessSubmitRequest: ProcessSubmitRequest;
  ProcessWorkitemRequest: ProcessWorkitemRequest;
  PerformQuickActionRequest: PerformQuickActionRequest;
  DescribeAvailableQuickActionResult: DescribeAvailableQuickActionResult;
  DescribeQuickActionResult: DescribeQuickActionResult;
  DescribeQuickActionDefaultValue: DescribeQuickActionDefaultValue;
  DescribeVisualForceResult: DescribeVisualForceResult;
  ProcessResult: ProcessResult;
  DeleteResult: DeleteResult;
  UndeleteResult: UndeleteResult;
  DeleteByExampleResult: DeleteByExampleResult;
  EmptyRecycleBinResult: EmptyRecycleBinResult;
  LeadConvert: LeadConvert;
  LeadConvertResult: LeadConvertResult;
  DescribeSObjectResult: DescribeSObjectResult;
  DescribeGlobalSObjectResult: DescribeGlobalSObjectResult;
  ChildRelationship: ChildRelationship;
  DescribeGlobalResult: DescribeGlobalResult;
  DescribeGlobalTheme: DescribeGlobalTheme;
  ScopeInfo: ScopeInfo;
  StringList: StringList;
  ChangeEventHeader: ChangeEventHeader;
  FilteredLookupInfo: FilteredLookupInfo;
  Field: Field;
  PicklistEntry: PicklistEntry;
  DescribeDataCategoryGroupResult: DescribeDataCategoryGroupResult;
  DescribeDataCategoryGroupStructureResult: DescribeDataCategoryGroupStructureResult;
  DataCategoryGroupSobjectTypePair: DataCategoryGroupSobjectTypePair;
  DataCategory: DataCategory;
  DescribeDataCategoryMappingResult: DescribeDataCategoryMappingResult;
  KnowledgeSettings: KnowledgeSettings;
  KnowledgeLanguageItem: KnowledgeLanguageItem;
  FieldDiff: FieldDiff;
  AdditionalInformationMap: AdditionalInformationMap;
  MatchRecord: MatchRecord;
  MatchResult: MatchResult;
  DuplicateResult: DuplicateResult;
  DuplicateError: DuplicateError;
  DescribeNounResult: DescribeNounResult;
  NameCaseValue: NameCaseValue;
  FindDuplicatesResult: FindDuplicatesResult;
  DescribeAppMenuResult: DescribeAppMenuResult;
  DescribeAppMenuItem: DescribeAppMenuItem;
  DescribeThemeResult: DescribeThemeResult;
  DescribeThemeItem: DescribeThemeItem;
  DescribeSoftphoneLayoutResult: DescribeSoftphoneLayoutResult;
  DescribeSoftphoneLayoutCallType: DescribeSoftphoneLayoutCallType;
  DescribeSoftphoneScreenPopOption: DescribeSoftphoneScreenPopOption;
  DescribeSoftphoneLayoutInfoField: DescribeSoftphoneLayoutInfoField;
  DescribeSoftphoneLayoutSection: DescribeSoftphoneLayoutSection;
  DescribeSoftphoneLayoutItem: DescribeSoftphoneLayoutItem;
  DescribeCompactLayoutsResult: DescribeCompactLayoutsResult;
  DescribeCompactLayout: DescribeCompactLayout;
  RecordTypeCompactLayoutMapping: RecordTypeCompactLayoutMapping;
  DescribePathAssistantsResult: DescribePathAssistantsResult;
  DescribePathAssistant: DescribePathAssistant;
  DescribePathAssistantStep: DescribePathAssistantStep;
  DescribePathAssistantField: DescribePathAssistantField;
  DescribeAnimationRule: DescribeAnimationRule;
  DescribeApprovalLayoutResult: DescribeApprovalLayoutResult;
  DescribeApprovalLayout: DescribeApprovalLayout;
  DescribeLayoutResult: DescribeLayoutResult;
  DescribeLayout: DescribeLayout;
  DescribeQuickActionListResult: DescribeQuickActionListResult;
  DescribeQuickActionListItemResult: DescribeQuickActionListItemResult;
  DescribeLayoutFeedView: DescribeLayoutFeedView;
  DescribeLayoutFeedFilter: DescribeLayoutFeedFilter;
  DescribeLayoutSaveOption: DescribeLayoutSaveOption;
  DescribeLayoutSection: DescribeLayoutSection;
  DescribeLayoutButtonSection: DescribeLayoutButtonSection;
  DescribeLayoutRow: DescribeLayoutRow;
  DescribeLayoutItem: DescribeLayoutItem;
  DescribeLayoutButton: DescribeLayoutButton;
  DescribeLayoutComponent: DescribeLayoutComponent;
  FieldComponent: FieldComponent;
  FieldLayoutComponent: FieldLayoutComponent;
  VisualforcePage: VisualforcePage;
  Canvas: Canvas;
  ReportChartComponent: ReportChartComponent;
  AnalyticsCloudComponent: AnalyticsCloudComponent;
  CustomLinkComponent: CustomLinkComponent;
  NamedLayoutInfo: NamedLayoutInfo;
  RecordTypeInfo: RecordTypeInfo;
  RecordTypeMapping: RecordTypeMapping;
  PicklistForRecordType: PicklistForRecordType;
  RelatedContent: RelatedContent;
  DescribeRelatedContentItem: DescribeRelatedContentItem;
  RelatedList: RelatedList;
  RelatedListColumn: RelatedListColumn;
  RelatedListSort: RelatedListSort;
  EmailFileAttachment: EmailFileAttachment;
  Email: Email;
  MassEmailMessage: MassEmailMessage;
  SingleEmailMessage: SingleEmailMessage;
  SendEmailResult: SendEmailResult;
  ListViewColumn: ListViewColumn;
  ListViewOrderBy: ListViewOrderBy;
  DescribeSoqlListView: DescribeSoqlListView;
  DescribeSoqlListViewsRequest: DescribeSoqlListViewsRequest;
  DescribeSoqlListViewParams: DescribeSoqlListViewParams;
  DescribeSoqlListViewResult: DescribeSoqlListViewResult;
  ExecuteListViewRequest: ExecuteListViewRequest;
  ExecuteListViewResult: ExecuteListViewResult;
  ListViewRecord: ListViewRecord;
  ListViewRecordColumn: ListViewRecordColumn;
  SoqlWhereCondition: SoqlWhereCondition;
  SoqlCondition: SoqlCondition;
  SoqlNotCondition: SoqlNotCondition;
  SoqlConditionGroup: SoqlConditionGroup;
  SoqlSubQueryCondition: SoqlSubQueryCondition;
  DescribeSearchLayoutResult: DescribeSearchLayoutResult;
  DescribeColumn: DescribeColumn;
  DescribeSearchScopeOrderResult: DescribeSearchScopeOrderResult;
  DescribeSearchableEntityResult: DescribeSearchableEntityResult;
  DescribeTabSetResult: DescribeTabSetResult;
  DescribeTab: DescribeTab;
  DescribeColor: DescribeColor;
  DescribeIcon: DescribeIcon;
  ActionOverride: ActionOverride;
  RenderEmailTemplateRequest: RenderEmailTemplateRequest;
  RenderEmailTemplateBodyResult: RenderEmailTemplateBodyResult;
  RenderEmailTemplateResult: RenderEmailTemplateResult;
  RenderStoredEmailTemplateRequest: RenderStoredEmailTemplateRequest;
  RenderStoredEmailTemplateResult: RenderStoredEmailTemplateResult;
  LimitInfo: LimitInfo;
  OwnerChangeOption: OwnerChangeOption;
  ApiFault: ApiFault;
  ApiQueryFault: ApiQueryFault;
  LoginFault: LoginFault;
  InvalidQueryLocatorFault: InvalidQueryLocatorFault;
  InvalidNewPasswordFault: InvalidNewPasswordFault;
  InvalidOldPasswordFault: InvalidOldPasswordFault;
  InvalidIdFault: InvalidIdFault;
  UnexpectedErrorFault: UnexpectedErrorFault;
  InvalidFieldFault: InvalidFieldFault;
  InvalidSObjectFault: InvalidSObjectFault;
  MalformedQueryFault: MalformedQueryFault;
  MalformedSearchFault: MalformedSearchFault;
};
