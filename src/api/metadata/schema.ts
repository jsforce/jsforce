/**
 * This file is generated from WSDL file by wsdl2schema.ts.
 * Do not modify directly.
 * To generate the file, run "ts-node path/to/wsdl2schema.ts path/to/wsdl.xml path/to/schema.ts"
 */

export const ApiSchemas = {
  CancelDeployResult: {
    type: 'CancelDeployResult',
    props: {
      done: 'boolean',
      id: 'string',
    },
  },
  DeployResult: {
    type: 'DeployResult',
    props: {
      canceledBy: '?string',
      canceledByName: '?string',
      checkOnly: 'boolean',
      completedDate: '?string',
      createdBy: 'string',
      createdByName: 'string',
      createdDate: 'string',
      details: 'DeployDetails',
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
  },
  DeployDetails: {
    type: 'DeployDetails',
    props: {
      componentFailures: ['DeployMessage'],
      componentSuccesses: ['DeployMessage'],
      retrieveResult: '?RetrieveResult',
      runTestResult: '?RunTestsResult',
    },
  },
  DeployMessage: {
    type: 'DeployMessage',
    props: {
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
  },
  RetrieveResult: {
    type: 'RetrieveResult',
    props: {
      done: 'boolean',
      errorMessage: '?string',
      errorStatusCode: '?string',
      fileProperties: ['FileProperties'],
      id: 'string',
      messages: ['RetrieveMessage'],
      status: 'string',
      success: 'boolean',
      zipFile: 'string',
    },
  },
  FileProperties: {
    type: 'FileProperties',
    props: {
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
  },
  RetrieveMessage: {
    type: 'RetrieveMessage',
    props: {
      fileName: 'string',
      problem: 'string',
    },
  },
  RunTestsResult: {
    type: 'RunTestsResult',
    props: {
      apexLogId: '?string',
      codeCoverage: ['CodeCoverageResult'],
      codeCoverageWarnings: ['CodeCoverageWarning'],
      failures: ['RunTestFailure'],
      flowCoverage: ['FlowCoverageResult'],
      flowCoverageWarnings: ['FlowCoverageWarning'],
      numFailures: 'number',
      numTestsRun: 'number',
      successes: ['RunTestSuccess'],
      totalTime: 'number',
    },
  },
  CodeCoverageResult: {
    type: 'CodeCoverageResult',
    props: {
      dmlInfo: ['CodeLocation'],
      id: 'string',
      locationsNotCovered: ['CodeLocation'],
      methodInfo: ['CodeLocation'],
      name: 'string',
      namespace: '?string',
      numLocations: 'number',
      numLocationsNotCovered: 'number',
      soqlInfo: ['CodeLocation'],
      soslInfo: ['CodeLocation'],
      type: 'string',
    },
  },
  CodeLocation: {
    type: 'CodeLocation',
    props: {
      column: 'number',
      line: 'number',
      numExecutions: 'number',
      time: 'number',
    },
  },
  CodeCoverageWarning: {
    type: 'CodeCoverageWarning',
    props: {
      id: 'string',
      message: 'string',
      name: '?string',
      namespace: '?string',
    },
  },
  RunTestFailure: {
    type: 'RunTestFailure',
    props: {
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
  },
  FlowCoverageResult: {
    type: 'FlowCoverageResult',
    props: {
      elementsNotCovered: ['string'],
      flowId: 'string',
      flowName: 'string',
      flowNamespace: '?string',
      numElements: 'number',
      numElementsNotCovered: 'number',
      processType: 'string',
    },
  },
  FlowCoverageWarning: {
    type: 'FlowCoverageWarning',
    props: {
      flowId: '?string',
      flowName: '?string',
      flowNamespace: '?string',
      message: 'string',
    },
  },
  RunTestSuccess: {
    type: 'RunTestSuccess',
    props: {
      id: 'string',
      methodName: 'string',
      name: 'string',
      namespace: '?string',
      seeAllData: '?boolean',
      time: 'number',
    },
  },
  Metadata: {
    type: 'Metadata',
    props: {
      fullName: '?string',
    },
  },
  AccountRelationshipShareRule: {
    type: 'AccountRelationshipShareRule',
    props: {
      accessLevel: 'string',
      accountToCriteriaField: 'string',
      description: '?string',
      entityType: 'string',
      masterLabel: 'string',
      staticFormulaCriteria: '?string',
      type: 'string',
    },
    extends: 'Metadata',
  },
  AccountSettings: {
    type: 'AccountSettings',
    props: {
      enableAccountHistoryTracking: '?boolean',
      enableAccountInsightsInMobile: '?boolean',
      enableAccountOwnerReport: '?boolean',
      enableAccountTeams: '?boolean',
      enableContactHistoryTracking: '?boolean',
      enableRelateContactToMultipleAccounts: '?boolean',
      showViewHierarchyLink: '?boolean',
    },
    extends: 'Metadata',
  },
  ActionLinkGroupTemplate: {
    type: 'ActionLinkGroupTemplate',
    props: {
      actionLinkTemplates: ['ActionLinkTemplate'],
      category: 'string',
      executionsAllowed: 'string',
      hoursUntilExpiration: '?number',
      isPublished: 'boolean',
      name: 'string',
    },
    extends: 'Metadata',
  },
  ActionLinkTemplate: {
    type: 'ActionLinkTemplate',
    props: {
      actionUrl: 'string',
      headers: '?string',
      isConfirmationRequired: 'boolean',
      isGroupDefault: 'boolean',
      label: '?string',
      labelKey: 'string',
      linkType: 'string',
      method: 'string',
      position: 'number',
      requestBody: '?string',
      userAlias: '?string',
      userVisibility: 'string',
    },
  },
  ActionPlanTemplate: {
    type: 'ActionPlanTemplate',
    props: {
      actionPlanTemplateItem: ['ActionPlanTemplateItem'],
      description: '?string',
      name: 'string',
      targetEntityType: 'string',
      uniqueName: 'string',
    },
    extends: 'Metadata',
  },
  ActionPlanTemplateItem: {
    type: 'ActionPlanTemplateItem',
    props: {
      actionPlanTemplateItemValue: ['ActionPlanTemplateItemValue'],
      displayOrder: '?number',
      isRequired: '?boolean',
      name: 'string',
      uniqueName: 'string',
    },
  },
  ActionPlanTemplateItemValue: {
    type: 'ActionPlanTemplateItemValue',
    props: {
      name: 'string',
      valueFormula: '?string',
      valueLiteral: '?string',
    },
  },
  ActionsSettings: {
    type: 'ActionsSettings',
    props: {
      enableDefaultQuickActionsOn: '?boolean',
      enableMdpEnabled: '?boolean',
      enableThirdPartyActions: '?boolean',
    },
    extends: 'Metadata',
  },
  ActivitiesSettings: {
    type: 'ActivitiesSettings',
    props: {
      allowUsersToRelateMultipleContactsToTasksAndEvents: '?boolean',
      autoRelateEventAttendees: '?boolean',
      enableActivityReminders: '?boolean',
      enableClickCreateEvents: '?boolean',
      enableDragAndDropScheduling: '?boolean',
      enableEmailTracking: '?boolean',
      enableGroupTasks: '?boolean',
      enableListViewScheduling: '?boolean',
      enableLogNote: '?boolean',
      enableMultidayEvents: '?boolean',
      enableRecurringEvents: '?boolean',
      enableRecurringTasks: '?boolean',
      enableRollUpActivToContactsAcct: '?boolean',
      enableSidebarCalendarShortcut: '?boolean',
      enableSimpleTaskCreateUI: '?boolean',
      enableUNSTaskDelegatedToNotifications: '?boolean',
      enableUserListViewCalendars: '?boolean',
      meetingRequestsLogo: '?string',
      showCustomLogoMeetingRequests: '?boolean',
      showEventDetailsMultiUserCalendar: '?boolean',
      showHomePageHoverLinksForEvents: '?boolean',
      showMyTasksHoverLinks: '?boolean',
    },
    extends: 'Metadata',
  },
  AddressSettings: {
    type: 'AddressSettings',
    props: {
      countriesAndStates: 'CountriesAndStates',
    },
    extends: 'Metadata',
  },
  CountriesAndStates: {
    type: 'CountriesAndStates',
    props: {
      countries: ['Country'],
    },
  },
  Country: {
    type: 'Country',
    props: {
      active: 'boolean',
      integrationValue: 'string',
      isoCode: 'string',
      label: 'string',
      orgDefault: 'boolean',
      standard: 'boolean',
      states: ['State'],
      visible: 'boolean',
    },
  },
  State: {
    type: 'State',
    props: {
      active: 'boolean',
      integrationValue: 'string',
      isoCode: 'string',
      label: 'string',
      standard: 'boolean',
      visible: 'boolean',
    },
  },
  AnalyticSnapshot: {
    type: 'AnalyticSnapshot',
    props: {
      description: '?string',
      groupColumn: '?string',
      mappings: ['AnalyticSnapshotMapping'],
      name: 'string',
      runningUser: '?string',
      sourceReport: 'string',
      targetObject: 'string',
    },
    extends: 'Metadata',
  },
  AnalyticSnapshotMapping: {
    type: 'AnalyticSnapshotMapping',
    props: {
      aggregateType: '?string',
      sourceField: 'string',
      sourceType: 'string',
      targetField: 'string',
    },
  },
  AnalyticsSettings: {
    type: 'AnalyticsSettings',
    props: {
      alwaysGenPreviews: '?boolean',
      analyticsAdoptionMetadata: '?boolean',
      canAccessAnalyticsViaAPI: '?boolean',
      canAnnotateDashboards: '?boolean',
      canEnableSavedView: '?boolean',
      canExploreDataConversationally: '?boolean',
      canShareAppsWithCommunities: '?boolean',
      canSubscribeDashboardWidgets: '?boolean',
      canViewThumbnailAssets: '?boolean',
      enableAnalyticsSubtotals: '?boolean',
      enableAutoCompleteCombo: '?boolean',
      enableDashboardComponentSnapshot: '?boolean',
      enableDashboardFlexiTable: '?boolean',
      enableEmailReportsToPortalUsers: '?boolean',
      enableFloatingReportHeaders: '?boolean',
      enableInsights: '?boolean',
      enableLightningReportBuilder: '?boolean',
      enableLotusNotesImages: '?boolean',
      enableMassEnableReportBuilder: '?boolean',
      enableNewChartsEngine: '?boolean',
      enablePowerInsights: '?boolean',
      enableRemoveFooterForRepDisplay: '?boolean',
      enableRemoveFooterFromRepExp: '?boolean',
      enableReportFieldToFieldPref: '?boolean',
      enableReportUniqueRowCountPref: '?boolean',
      enableSFXJoinedReportsEnable: '?boolean',
      enableSmartDataDiscovery: '?boolean',
      enableUseOldChartsLookAndFeel: '?boolean',
      enableWaveReplication: '?boolean',
      enableWaveSharingInheritance: '?boolean',
      enableWaveTemplate: '?boolean',
      enableWaveTrendedDatasetCleanup: '?boolean',
    },
    extends: 'Metadata',
  },
  AnimationRule: {
    type: 'AnimationRule',
    props: {
      animationFrequency: 'string',
      developerName: 'string',
      isActive: 'boolean',
      masterLabel: 'string',
      recordTypeContext: 'string',
      recordTypeName: '?string',
      sobjectType: 'string',
      targetField: 'string',
      targetFieldChangeToValues: 'string',
    },
    extends: 'Metadata',
  },
  ApexSettings: {
    type: 'ApexSettings',
    props: {
      enableAggregateCodeCoverageOnly: '?boolean',
      enableApexAccessRightsPref: '?boolean',
      enableApexApprovalLockUnlock: '?boolean',
      enableApexCtrlImplicitWithSharingPref: '?boolean',
      enableApexPropertyGetterPref: '?boolean',
      enableAuraApexCtrlAuthUserAccessCheckPref: '?boolean',
      enableAuraApexCtrlGuestUserAccessCheckPref: '?boolean',
      enableCompileOnDeploy: '?boolean',
      enableDisableParallelApexTesting: '?boolean',
      enableDoNotEmailDebugLog: '?boolean',
      enableGaplessTestAutoNum: '?boolean',
      enableMngdCtrlActionAccessPref: '?boolean',
      enableNonCertifiedApexMdCrud: '?boolean',
    },
    extends: 'Metadata',
  },
  ApexTestSuite: {
    type: 'ApexTestSuite',
    props: {
      testClassName: ['string'],
    },
    extends: 'Metadata',
  },
  AppExperienceSettings: {
    type: 'AppExperienceSettings',
    props: {
      doesHideAllAppsInAppLauncher: '?boolean',
    },
    extends: 'Metadata',
  },
  AppMenu: {
    type: 'AppMenu',
    props: {
      appMenuItems: ['AppMenuItem'],
    },
    extends: 'Metadata',
  },
  AppMenuItem: {
    type: 'AppMenuItem',
    props: {
      name: 'string',
      type: 'string',
    },
  },
  AppointmentSchedulingPolicy: {
    type: 'AppointmentSchedulingPolicy',
    props: {
      appointmentStartTimeInterval: 'string',
      masterLabel: 'string',
      shouldConsiderCalendarEvents: 'boolean',
      shouldEnforceExcludedResource: 'boolean',
      shouldEnforceRequiredResource: 'boolean',
      shouldMatchSkill: 'boolean',
      shouldMatchSkillLevel: 'boolean',
      shouldRespectVisitingHours: 'boolean',
      shouldUsePrimaryMembers: 'boolean',
      shouldUseSecondaryMembers: 'boolean',
    },
    extends: 'Metadata',
  },
  ApprovalProcess: {
    type: 'ApprovalProcess',
    props: {
      active: 'boolean',
      allowRecall: '?boolean',
      allowedSubmitters: ['ApprovalSubmitter'],
      approvalPageFields: '?ApprovalPageField',
      approvalStep: ['ApprovalStep'],
      description: '?string',
      emailTemplate: '?string',
      enableMobileDeviceAccess: '?boolean',
      entryCriteria: '?ApprovalEntryCriteria',
      finalApprovalActions: '?ApprovalAction',
      finalApprovalRecordLock: '?boolean',
      finalRejectionActions: '?ApprovalAction',
      finalRejectionRecordLock: '?boolean',
      initialSubmissionActions: '?ApprovalAction',
      label: 'string',
      nextAutomatedApprover: '?NextAutomatedApprover',
      postTemplate: '?string',
      recallActions: '?ApprovalAction',
      recordEditability: 'string',
      showApprovalHistory: '?boolean',
    },
    extends: 'Metadata',
  },
  ApprovalSubmitter: {
    type: 'ApprovalSubmitter',
    props: {
      submitter: '?string',
      type: 'string',
    },
  },
  ApprovalPageField: {
    type: 'ApprovalPageField',
    props: {
      field: ['string'],
    },
  },
  ApprovalStep: {
    type: 'ApprovalStep',
    props: {
      allowDelegate: '?boolean',
      approvalActions: '?ApprovalAction',
      assignedApprover: 'ApprovalStepApprover',
      description: '?string',
      entryCriteria: '?ApprovalEntryCriteria',
      ifCriteriaNotMet: '?string',
      label: 'string',
      name: 'string',
      rejectBehavior: '?ApprovalStepRejectBehavior',
      rejectionActions: '?ApprovalAction',
    },
  },
  ApprovalAction: {
    type: 'ApprovalAction',
    props: {
      action: ['WorkflowActionReference'],
    },
  },
  WorkflowActionReference: {
    type: 'WorkflowActionReference',
    props: {
      name: 'string',
      type: 'string',
    },
  },
  ApprovalStepApprover: {
    type: 'ApprovalStepApprover',
    props: {
      approver: ['Approver'],
      whenMultipleApprovers: '?string',
    },
  },
  Approver: {
    type: 'Approver',
    props: {
      name: '?string',
      type: 'string',
    },
  },
  ApprovalEntryCriteria: {
    type: 'ApprovalEntryCriteria',
    props: {
      booleanFilter: '?string',
      criteriaItems: ['FilterItem'],
      formula: '?string',
    },
  },
  FilterItem: {
    type: 'FilterItem',
    props: {
      field: 'string',
      operation: 'string',
      value: '?string',
      valueField: '?string',
    },
  },
  DuplicateRuleFilterItem: {
    type: 'DuplicateRuleFilterItem',
    props: {
      sortOrder: 'number',
      table: 'string',
    },
    extends: 'FilterItem',
  },
  ApprovalStepRejectBehavior: {
    type: 'ApprovalStepRejectBehavior',
    props: {
      type: 'string',
    },
  },
  NextAutomatedApprover: {
    type: 'NextAutomatedApprover',
    props: {
      useApproverFieldOfRecordOwner: '?boolean',
      userHierarchyField: 'string',
    },
  },
  ArchiveSettings: {
    type: 'ArchiveSettings',
    props: {
      enableEntityArchivingEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  AssignmentRule: {
    type: 'AssignmentRule',
    props: {
      active: '?boolean',
      ruleEntry: ['RuleEntry'],
    },
    extends: 'Metadata',
  },
  RuleEntry: {
    type: 'RuleEntry',
    props: {
      assignedTo: '?string',
      assignedToType: '?string',
      booleanFilter: '?string',
      businessHours: '?string',
      businessHoursSource: '?string',
      criteriaItems: ['FilterItem'],
      disableEscalationWhenModified: '?boolean',
      escalationAction: ['EscalationAction'],
      escalationStartTime: '?string',
      formula: '?string',
      notifyCcRecipients: '?boolean',
      overrideExistingTeams: '?boolean',
      replyToEmail: '?string',
      senderEmail: '?string',
      senderName: '?string',
      team: ['string'],
      template: '?string',
    },
  },
  EscalationAction: {
    type: 'EscalationAction',
    props: {
      assignedTo: '?string',
      assignedToTemplate: '?string',
      assignedToType: '?string',
      minutesToEscalation: '?number',
      notifyCaseOwner: '?boolean',
      notifyEmail: ['string'],
      notifyTo: '?string',
      notifyToTemplate: '?string',
    },
  },
  AssignmentRules: {
    type: 'AssignmentRules',
    props: {
      assignmentRule: ['AssignmentRule'],
    },
    extends: 'Metadata',
  },
  Audience: {
    type: 'Audience',
    props: {
      audienceName: 'string',
      container: 'string',
      criteria: 'AudienceCriteria',
      description: '?string',
      formula: '?string',
      formulaFilterType: '?string',
      targets: '?PersonalizationTargetInfos',
    },
    extends: 'Metadata',
  },
  AudienceCriteria: {
    type: 'AudienceCriteria',
    props: {
      criterion: ['AudienceCriterion'],
    },
  },
  AudienceCriterion: {
    type: 'AudienceCriterion',
    props: {
      criteriaNumber: '?number',
      criterionValue: '?AudienceCriteriaValue',
      operator: '?string',
      type: 'string',
    },
  },
  AudienceCriteriaValue: {
    type: 'AudienceCriteriaValue',
    props: {
      city: '?string',
      country: '?string',
      domain: '?string',
      entityField: '?string',
      entityType: '?string',
      fieldValue: '?string',
      isEnabled: '?string',
      permissionName: '?string',
      permissionType: '?string',
      profile: '?string',
      subdivision: '?string',
    },
  },
  PersonalizationTargetInfos: {
    type: 'PersonalizationTargetInfos',
    props: {
      target: ['PersonalizationTargetInfo'],
    },
  },
  PersonalizationTargetInfo: {
    type: 'PersonalizationTargetInfo',
    props: {
      groupName: 'string',
      priority: '?number',
      targetType: 'string',
      targetValue: 'string',
    },
  },
  AuraDefinitionBundle: {
    type: 'AuraDefinitionBundle',
    props: {
      SVGContent: '?string',
      apiVersion: '?number',
      controllerContent: '?string',
      description: '?string',
      designContent: '?string',
      documentationContent: '?string',
      helperContent: '?string',
      markup: '?string',
      modelContent: '?string',
      packageVersions: ['PackageVersion'],
      rendererContent: '?string',
      styleContent: '?string',
      testsuiteContent: '?string',
      type: '?string',
    },
    extends: 'Metadata',
  },
  PackageVersion: {
    type: 'PackageVersion',
    props: {
      majorNumber: 'number',
      minorNumber: 'number',
      namespace: 'string',
    },
  },
  AuthProvider: {
    type: 'AuthProvider',
    props: {
      appleTeam: '?string',
      authorizeUrl: '?string',
      consumerKey: '?string',
      consumerSecret: '?string',
      customMetadataTypeRecord: '?string',
      defaultScopes: '?string',
      ecKey: '?string',
      errorUrl: '?string',
      executionUser: '?string',
      friendlyName: 'string',
      iconUrl: '?string',
      idTokenIssuer: '?string',
      includeOrgIdInIdentifier: '?boolean',
      linkKickoffUrl: '?string',
      logoutUrl: '?string',
      oauthKickoffUrl: '?string',
      plugin: '?string',
      portal: '?string',
      providerType: 'string',
      registrationHandler: '?string',
      sendAccessTokenInHeader: '?boolean',
      sendClientCredentialsInHeader: '?boolean',
      sendSecretInApis: '?boolean',
      ssoKickoffUrl: '?string',
      tokenUrl: '?string',
      userInfoUrl: '?string',
    },
    extends: 'Metadata',
  },
  AutoResponseRule: {
    type: 'AutoResponseRule',
    props: {
      active: '?boolean',
      ruleEntry: ['RuleEntry'],
    },
    extends: 'Metadata',
  },
  AutoResponseRules: {
    type: 'AutoResponseRules',
    props: {
      autoResponseRule: ['AutoResponseRule'],
    },
    extends: 'Metadata',
  },
  BlockchainSettings: {
    type: 'BlockchainSettings',
    props: {
      enableBcp: '?boolean',
      enableBcpCoin: '?boolean',
    },
    extends: 'Metadata',
  },
  Bot: {
    type: 'Bot',
    props: {
      botMlDomain: '?LocalMlDomain',
      botUser: '?string',
      botVersions: ['BotVersion'],
      contextVariables: ['ConversationContextVariable'],
      description: '?string',
      label: '?string',
    },
    extends: 'Metadata',
  },
  LocalMlDomain: {
    type: 'LocalMlDomain',
    props: {
      label: 'string',
      mlIntents: ['MlIntent'],
      mlSlotClasses: ['MlSlotClass'],
      name: 'string',
    },
  },
  MlIntent: {
    type: 'MlIntent',
    props: {
      description: '?string',
      developerName: 'string',
      label: 'string',
      mlIntentUtterances: ['MlIntentUtterance'],
      relatedMlIntents: ['MlRelatedIntent'],
    },
  },
  MlIntentUtterance: {
    type: 'MlIntentUtterance',
    props: {
      utterance: 'string',
    },
  },
  MlRelatedIntent: {
    type: 'MlRelatedIntent',
    props: {
      relatedMlIntent: 'string',
    },
  },
  MlSlotClass: {
    type: 'MlSlotClass',
    props: {
      dataType: 'string',
      description: '?string',
      developerName: 'string',
      extractionRegex: '?string',
      extractionType: '?string',
      label: 'string',
      mlSlotClassValues: ['MlSlotClassValue'],
    },
  },
  MlSlotClassValue: {
    type: 'MlSlotClassValue',
    props: {
      synonymGroup: '?SynonymGroup',
      value: 'string',
    },
  },
  SynonymGroup: {
    type: 'SynonymGroup',
    props: {
      languages: ['string'],
      terms: ['string'],
    },
  },
  BotVersion: {
    type: 'BotVersion',
    props: {
      botDialogGroups: ['BotDialogGroup'],
      botDialogs: ['BotDialog'],
      conversationVariables: ['ConversationVariable'],
      entryDialog: 'string',
      mainMenuDialog: 'string',
      responseDelayMilliseconds: '?number',
    },
    extends: 'Metadata',
  },
  BotDialogGroup: {
    type: 'BotDialogGroup',
    props: {
      description: '?string',
      developerName: 'string',
      label: 'string',
    },
  },
  BotDialog: {
    type: 'BotDialog',
    props: {
      botDialogGroup: '?string',
      botSteps: ['BotStep'],
      description: '?string',
      developerName: 'string',
      label: 'string',
      mlIntent: '?string',
      mlIntentTrainingEnabled: '?boolean',
      showInFooterMenu: '?boolean',
    },
  },
  BotStep: {
    type: 'BotStep',
    props: {
      booleanFilter: '?string',
      botInvocation: '?BotInvocation',
      botMessages: ['BotMessage'],
      botNavigation: '?BotNavigation',
      botStepConditions: ['BotStepCondition'],
      botSteps: ['BotStep'],
      botVariableOperation: '?BotVariableOperation',
      conversationRecordLookup: '?ConversationRecordLookup',
      conversationSystemMessage: '?ConversationSystemMessage',
      type: 'string',
    },
  },
  BotInvocation: {
    type: 'BotInvocation',
    props: {
      invocationActionName: '?string',
      invocationActionType: '?string',
      invocationMappings: ['BotInvocationMapping'],
    },
  },
  BotInvocationMapping: {
    type: 'BotInvocationMapping',
    props: {
      parameterName: 'string',
      type: 'string',
      value: '?string',
      variableName: '?string',
      variableType: '?string',
    },
  },
  BotMessage: {
    type: 'BotMessage',
    props: {
      message: 'string',
    },
  },
  BotNavigation: {
    type: 'BotNavigation',
    props: {
      botNavigationLinks: ['BotNavigationLink'],
      type: 'string',
    },
  },
  BotNavigationLink: {
    type: 'BotNavigationLink',
    props: {
      label: '?string',
      targetBotDialog: 'string',
    },
  },
  BotStepCondition: {
    type: 'BotStepCondition',
    props: {
      leftOperandName: 'string',
      leftOperandType: 'string',
      operatorType: 'string',
      rightOperandValue: '?string',
    },
  },
  BotVariableOperation: {
    type: 'BotVariableOperation',
    props: {
      botInvocation: '?BotInvocation',
      botMessages: ['BotMessage'],
      botQuickReplyOptions: ['BotQuickReplyOption'],
      botVariableOperands: ['BotVariableOperand'],
      invalidInputBotNavigation: '?BotNavigation',
      quickReplyOptionTemplate: '?string',
      quickReplyType: '?string',
      quickReplyWidgetType: '?string',
      sourceVariableName: '?string',
      sourceVariableType: '?string',
      type: 'string',
    },
  },
  BotQuickReplyOption: {
    type: 'BotQuickReplyOption',
    props: {
      literalValue: 'string',
    },
  },
  BotVariableOperand: {
    type: 'BotVariableOperand',
    props: {
      disableAutoFill: '?boolean',
      sourceName: '?string',
      sourceType: '?string',
      sourceValue: '?string',
      targetName: 'string',
      targetType: 'string',
    },
  },
  ConversationRecordLookup: {
    type: 'ConversationRecordLookup',
    props: {
      SObjectType: 'string',
      lookupFields: ['ConversationRecordLookupField'],
      maxLookupResults: 'number',
      sourceVariableName: 'string',
      sourceVariableType: 'string',
      targetVariableName: 'string',
    },
  },
  ConversationRecordLookupField: {
    type: 'ConversationRecordLookupField',
    props: {
      fieldName: 'string',
    },
  },
  ConversationSystemMessage: {
    type: 'ConversationSystemMessage',
    props: {
      systemMessageMappings: ['ConversationSystemMessageMapping'],
      type: 'string',
    },
  },
  ConversationSystemMessageMapping: {
    type: 'ConversationSystemMessageMapping',
    props: {
      mappingType: 'string',
      parameterType: 'string',
      variableName: 'string',
    },
  },
  ConversationVariable: {
    type: 'ConversationVariable',
    props: {
      SObjectType: '?string',
      collectionType: '?string',
      dataType: 'string',
      developerName: 'string',
      label: 'string',
    },
  },
  ConversationContextVariable: {
    type: 'ConversationContextVariable',
    props: {
      SObjectType: '?string',
      contextVariableMappings: ['ConversationContextVariableMapping'],
      dataType: 'string',
      developerName: 'string',
      label: 'string',
    },
  },
  ConversationContextVariableMapping: {
    type: 'ConversationContextVariableMapping',
    props: {
      SObjectType: 'string',
      fieldName: 'string',
      messageType: 'string',
    },
  },
  BotSettings: {
    type: 'BotSettings',
    props: {
      enableBots: '?boolean',
    },
    extends: 'Metadata',
  },
  BrandingSet: {
    type: 'BrandingSet',
    props: {
      brandingSetProperty: ['BrandingSetProperty'],
      description: '?string',
      masterLabel: 'string',
      type: '?string',
    },
    extends: 'Metadata',
  },
  BrandingSetProperty: {
    type: 'BrandingSetProperty',
    props: {
      propertyName: 'string',
      propertyValue: '?string',
    },
  },
  BusinessHoursEntry: {
    type: 'BusinessHoursEntry',
    props: {
      active: '?boolean',
      default: 'boolean',
      fridayEndTime: '?string',
      fridayStartTime: '?string',
      mondayEndTime: '?string',
      mondayStartTime: '?string',
      name: '?string',
      saturdayEndTime: '?string',
      saturdayStartTime: '?string',
      sundayEndTime: '?string',
      sundayStartTime: '?string',
      thursdayEndTime: '?string',
      thursdayStartTime: '?string',
      timeZoneId: '?string',
      tuesdayEndTime: '?string',
      tuesdayStartTime: '?string',
      wednesdayEndTime: '?string',
      wednesdayStartTime: '?string',
    },
    extends: 'Metadata',
  },
  BusinessHoursSettings: {
    type: 'BusinessHoursSettings',
    props: {
      businessHours: ['BusinessHoursEntry'],
      holidays: ['Holiday'],
    },
    extends: 'Metadata',
  },
  Holiday: {
    type: 'Holiday',
    props: {
      activityDate: '?string',
      businessHours: ['string'],
      description: '?string',
      endTime: '?string',
      isRecurring: '?boolean',
      name: '?string',
      recurrenceDayOfMonth: '?number',
      recurrenceDayOfWeek: ['string'],
      recurrenceDayOfWeekMask: '?number',
      recurrenceEndDate: '?string',
      recurrenceInstance: '?string',
      recurrenceInterval: '?number',
      recurrenceMonthOfYear: '?string',
      recurrenceStartDate: '?string',
      recurrenceType: '?string',
      startTime: '?string',
    },
  },
  BusinessProcess: {
    type: 'BusinessProcess',
    props: {
      description: '?string',
      isActive: '?boolean',
      values: ['PicklistValue'],
    },
    extends: 'Metadata',
  },
  PicklistValue: {
    type: 'PicklistValue',
    props: {
      color: '?string',
      default: 'boolean',
      description: '?string',
      isActive: '?boolean',
      allowEmail: '?boolean',
      closed: '?boolean',
      controllingFieldValues: ['string'],
      converted: '?boolean',
      cssExposed: '?boolean',
      forecastCategory: '?string',
      highPriority: '?boolean',
      probability: '?number',
      reverseRole: '?string',
      reviewed: '?boolean',
      won: '?boolean',
    },
    extends: 'Metadata',
  },
  CMSConnectSource: {
    type: 'CMSConnectSource',
    props: {
      cmsConnectAsset: ['CMSConnectAsset'],
      cmsConnectLanguage: ['CMSConnectLanguage'],
      cmsConnectPersonalization: '?CMSConnectPersonalization',
      cmsConnectResourceType: ['CMSConnectResourceType'],
      connectionType: 'string',
      cssScope: '?string',
      developerName: 'string',
      languageEnabled: '?string',
      masterLabel: 'string',
      namedCredential: '?string',
      personalizationEnabled: '?string',
      rootPath: '?string',
      sortOrder: 'number',
      status: 'string',
      type: 'string',
      websiteUrl: '?string',
    },
    extends: 'Metadata',
  },
  CMSConnectAsset: {
    type: 'CMSConnectAsset',
    props: {
      assetPath: 'string',
      assetType: 'string',
      sortOrder: 'number',
    },
  },
  CMSConnectLanguage: {
    type: 'CMSConnectLanguage',
    props: {
      cmsLanguage: 'string',
      language: 'string',
    },
  },
  CMSConnectPersonalization: {
    type: 'CMSConnectPersonalization',
    props: {
      connectorPage: 'string',
      connectorPageAsset: 'string',
    },
  },
  CMSConnectResourceType: {
    type: 'CMSConnectResourceType',
    props: {
      cmsConnectResourceDefinition: ['CMSConnectResourceDefinition'],
      developerName: 'string',
      masterLabel: 'string',
      resourceType: 'string',
    },
  },
  CMSConnectResourceDefinition: {
    type: 'CMSConnectResourceDefinition',
    props: {
      developerName: 'string',
      masterLabel: 'string',
      options: 'number',
      payloadType: 'string',
      resourceIdPath: '?string',
      resourceNamePath: '?string',
      resourcePath: 'string',
      rootNodePath: '?string',
    },
  },
  CallCenter: {
    type: 'CallCenter',
    props: {
      adapterUrl: '?string',
      customSettings: '?string',
      displayName: 'string',
      displayNameLabel: 'string',
      internalNameLabel: 'string',
      sections: ['CallCenterSection'],
      version: '?string',
    },
    extends: 'Metadata',
  },
  CallCenterSection: {
    type: 'CallCenterSection',
    props: {
      items: ['CallCenterItem'],
      label: 'string',
      name: 'string',
    },
  },
  CallCenterItem: {
    type: 'CallCenterItem',
    props: {
      label: 'string',
      name: 'string',
      value: 'string',
    },
  },
  CampaignInfluenceModel: {
    type: 'CampaignInfluenceModel',
    props: {
      isActive: '?boolean',
      isDefaultModel: 'boolean',
      isModelLocked: 'boolean',
      modelDescription: '?string',
      name: 'string',
      recordPreference: '?string',
    },
    extends: 'Metadata',
  },
  CampaignSettings: {
    type: 'CampaignSettings',
    props: {
      enableAutoCampInfluenceDisabled: '?boolean',
      enableB2bmaCampaignInfluence2: '?boolean',
      enableCampaignHistoryTrackEnabled: '?boolean',
      enableCampaignInfluence2: '?boolean',
      enableCampaignMemberTWCF: '?boolean',
      enableSuppressNoValueCI2: '?boolean',
    },
    extends: 'Metadata',
  },
  CanvasMetadata: {
    type: 'CanvasMetadata',
    props: {
      accessMethod: 'string',
      canvasOptions: '?string',
      canvasUrl: 'string',
      lifecycleClass: '?string',
      locationOptions: '?string',
      samlInitiationMethod: '?string',
    },
    extends: 'Metadata',
  },
  CaseClassificationSettings: {
    type: 'CaseClassificationSettings',
    props: {
      caseClassificationRecommendations: '?boolean',
      reRunAttributeBasedRules: '?boolean',
      runAssignmentRules: '?boolean',
    },
    extends: 'Metadata',
  },
  CaseSettings: {
    type: 'CaseSettings',
    props: {
      caseAssignNotificationTemplate: '?string',
      caseAutoProcUser: '?boolean',
      caseCloseNotificationTemplate: '?string',
      caseCommentNotificationTemplate: '?string',
      caseCreateNotificationTemplate: '?string',
      caseFeedItemSettings: ['FeedItemSettings'],
      caseFeedReadUnreadLtng: '?boolean',
      caseMergeInLightning: '?boolean',
      closeCaseThroughStatusChange: '?boolean',
      defaultCaseFeedLayoutOn: '?boolean',
      defaultCaseOwner: '?string',
      defaultCaseOwnerType: '?string',
      defaultCaseUser: '?string',
      emailActionDefaultsHandlerClass: '?string',
      emailToCase: '?EmailToCaseSettings',
      enableCaseFeed: '?boolean',
      enableCollapseEmailThread: '?boolean',
      enableDraftEmails: '?boolean',
      enableEarlyEscalationRuleTriggers: '?boolean',
      enableEmailActionDefaultsHandler: '?boolean',
      enableSuggestedArticlesApplication: '?boolean',
      enableSuggestedArticlesCustomerPortal: '?boolean',
      enableSuggestedArticlesPartnerPortal: '?boolean',
      enableSuggestedSolutions: '?boolean',
      escalateCaseBefore: '?boolean',
      genericMessageEnabled: '?boolean',
      keepRecordTypeOnAssignmentRule: '?boolean',
      notifyContactOnCaseComment: '?boolean',
      notifyDefaultCaseOwner: '?boolean',
      notifyOwnerOnCaseComment: '?boolean',
      notifyOwnerOnCaseOwnerChange: '?boolean',
      predictiveSupportEnabled: '?boolean',
      showEmailAttachmentsInCaseAttachmentsRL: '?boolean',
      showFewerCloseActions: '?boolean',
      systemUserEmail: '?string',
      useSystemEmailAddress: '?boolean',
      useSystemUserAsDefaultCaseUser: '?boolean',
      webToCase: '?WebToCaseSettings',
    },
    extends: 'Metadata',
  },
  FeedItemSettings: {
    type: 'FeedItemSettings',
    props: {
      characterLimit: '?number',
      displayFormat: '?string',
      feedItemType: 'string',
    },
  },
  EmailToCaseSettings: {
    type: 'EmailToCaseSettings',
    props: {
      enableE2CAttachmentAsFile: '?boolean',
      enableE2CSourceTracking: '?boolean',
      enableEmailToCase: '?boolean',
      enableHtmlEmail: '?boolean',
      enableOnDemandEmailToCase: '?boolean',
      enableThreadIDInBody: '?boolean',
      enableThreadIDInSubject: '?boolean',
      notifyOwnerOnNewCaseEmail: '?boolean',
      overEmailLimitAction: '?string',
      preQuoteSignature: '?boolean',
      routingAddresses: ['EmailToCaseRoutingAddress'],
      unauthorizedSenderAction: '?string',
    },
  },
  EmailToCaseRoutingAddress: {
    type: 'EmailToCaseRoutingAddress',
    props: {
      addressType: '?string',
      authorizedSenders: '?string',
      caseOrigin: '?string',
      caseOwner: '?string',
      caseOwnerType: '?string',
      casePriority: '?string',
      createTask: '?boolean',
      emailAddress: '?string',
      emailServicesAddress: '?string',
      isVerified: '?boolean',
      routingName: '?string',
      saveEmailHeaders: '?boolean',
      taskStatus: '?string',
    },
  },
  WebToCaseSettings: {
    type: 'WebToCaseSettings',
    props: {
      caseOrigin: '?string',
      defaultResponseTemplate: '?string',
      enableWebToCase: '?boolean',
    },
  },
  CaseSubjectParticle: {
    type: 'CaseSubjectParticle',
    props: {
      index: 'number',
      textField: '?string',
      type: 'string',
    },
    extends: 'Metadata',
  },
  ChannelLayout: {
    type: 'ChannelLayout',
    props: {
      enabledChannels: ['string'],
      label: 'string',
      layoutItems: ['ChannelLayoutItem'],
      recordType: '?string',
    },
    extends: 'Metadata',
  },
  ChannelLayoutItem: {
    type: 'ChannelLayoutItem',
    props: {
      field: 'string',
    },
  },
  ChatterAnswersSettings: {
    type: 'ChatterAnswersSettings',
    props: {
      emailFollowersOnBestAnswer: '?boolean',
      emailFollowersOnReply: '?boolean',
      emailOwnerOnPrivateReply: '?boolean',
      emailOwnerOnReply: '?boolean',
      enableAnswerViaEmail: '?boolean',
      enableChatterAnswers: 'boolean',
      enableFacebookSSO: '?boolean',
      enableInlinePublisher: '?boolean',
      enableReputation: '?boolean',
      enableRichTextEditor: '?boolean',
      facebookAuthProvider: '?string',
      showInPortals: '?boolean',
    },
    extends: 'Metadata',
  },
  ChatterEmailsMDSettings: {
    type: 'ChatterEmailsMDSettings',
    props: {
      enableChatterDigestEmailsApiOnly: '?boolean',
      enableChatterEmailAttachment: '?boolean',
      enableCollaborationEmail: '?boolean',
      enableDisplayAppDownloadBadges: '?boolean',
      enableEmailReplyToChatter: '?boolean',
      enableEmailToChatter: '?boolean',
    },
    extends: 'Metadata',
  },
  ChatterExtension: {
    type: 'ChatterExtension',
    props: {
      compositionComponent: 'string',
      description: 'string',
      extensionName: 'string',
      headerText: '?string',
      hoverText: '?string',
      icon: 'string',
      isProtected: '?boolean',
      masterLabel: 'string',
      renderComponent: 'string',
      type: 'string',
    },
    extends: 'Metadata',
  },
  ChatterSettings: {
    type: 'ChatterSettings',
    props: {
      allowChatterGroupArchiving: '?boolean',
      allowRecordsInChatterGroup: '?boolean',
      allowSharingInChatterGroup: '?boolean',
      enableApprovalRequest: '?boolean',
      enableChatter: '?boolean',
      enableChatterEmoticons: '?boolean',
      enableFeedEdit: '?boolean',
      enableFeedPinning: '?boolean',
      enableFeedsDraftPosts: '?boolean',
      enableFeedsRichText: '?boolean',
      enableInviteCsnUsers: '?boolean',
      enableOutOfOfficeEnabledPref: '?boolean',
      enableRichLinkPreviewsInFeed: '?boolean',
      enableTodayRecsInFeed: '?boolean',
      unlistedGroupsEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  CleanDataService: {
    type: 'CleanDataService',
    props: {
      cleanRules: ['CleanRule'],
      description: 'string',
      masterLabel: 'string',
      matchEngine: 'string',
    },
    extends: 'Metadata',
  },
  CleanRule: {
    type: 'CleanRule',
    props: {
      bulkEnabled: 'boolean',
      bypassTriggers: 'boolean',
      bypassWorkflow: 'boolean',
      description: 'string',
      developerName: 'string',
      fieldMappings: ['FieldMapping'],
      masterLabel: 'string',
      matchRule: 'string',
      sourceSobjectType: 'string',
      status: 'string',
      targetSobjectType: 'string',
    },
  },
  FieldMapping: {
    type: 'FieldMapping',
    props: {
      SObjectType: 'string',
      developerName: 'string',
      fieldMappingRows: ['FieldMappingRow'],
      masterLabel: 'string',
    },
  },
  FieldMappingRow: {
    type: 'FieldMappingRow',
    props: {
      SObjectType: 'string',
      fieldMappingFields: ['FieldMappingField'],
      fieldName: 'string',
      mappingOperation: 'string',
    },
  },
  FieldMappingField: {
    type: 'FieldMappingField',
    props: {
      dataServiceField: 'string',
      dataServiceObjectName: 'string',
      priority: 'number',
    },
  },
  CommandAction: {
    type: 'CommandAction',
    props: {
      actionType: 'string',
      description: '?string',
      intents: ['CommandActionIntent'],
      label: 'string',
      parameters: ['CommandActionParam'],
      responseTemplates: ['CommandActionResponse'],
      target: '?string',
    },
    extends: 'Metadata',
  },
  CommandActionIntent: {
    type: 'CommandActionIntent',
    props: {
      phrase: 'string',
      responseTemplates: ['CommandActionResponse'],
    },
  },
  CommandActionResponse: {
    type: 'CommandActionResponse',
    props: {
      template: 'string',
    },
  },
  CommandActionParam: {
    type: 'CommandActionParam',
    props: {
      defaultValue: '?string',
      description: '?string',
      name: 'string',
      required: '?boolean',
      type: 'string',
    },
  },
  CommunitiesSettings: {
    type: 'CommunitiesSettings',
    props: {
      canModerateAllFeedPosts: '?boolean',
      canModerateInternalFeedPosts: '?boolean',
      embeddedVisualforcePages: '?boolean',
      enableCommunityWorkspaces: '?boolean',
      enableCspContactVisibilityPref: '?boolean',
      enableCspNotesOnAccConPref: '?boolean',
      enableEnablePRM: '?boolean',
      enableExternalAccHierPref: '?boolean',
      enableGuestRecordReassignOrgPref: '?boolean',
      enableInviteChatterGuestEnabled: '?boolean',
      enableNetPortalUserReportOpts: '?boolean',
      enableNetworksEnabled: '?boolean',
      enableOotbProfExtUserOpsEnable: '?boolean',
      enablePRMAccRelPref: '?boolean',
      enablePowerCustomerCaseStatus: '?boolean',
      enableRelaxPartnerAccountFieldPref: '?boolean',
      enableUsernameUniqForOrgPref: '?boolean',
    },
    extends: 'Metadata',
  },
  Community: {
    type: 'Community',
    props: {
      active: '?boolean',
      chatterAnswersFacebookSsoUrl: '?string',
      communityFeedPage: '?string',
      dataCategoryName: '?string',
      description: '?string',
      emailFooterDocument: '?string',
      emailHeaderDocument: '?string',
      emailNotificationUrl: '?string',
      enableChatterAnswers: '?boolean',
      enablePrivateQuestions: '?boolean',
      expertsGroup: '?string',
      portal: '?string',
      reputationLevels: '?ReputationLevels',
      showInPortal: '?boolean',
      site: '?string',
    },
    extends: 'Metadata',
  },
  ReputationLevels: {
    type: 'ReputationLevels',
    props: {
      chatterAnswersReputationLevels: ['ChatterAnswersReputationLevel'],
      ideaReputationLevels: ['IdeaReputationLevel'],
    },
  },
  ChatterAnswersReputationLevel: {
    type: 'ChatterAnswersReputationLevel',
    props: {
      name: 'string',
      value: 'number',
    },
  },
  IdeaReputationLevel: {
    type: 'IdeaReputationLevel',
    props: {
      name: 'string',
      value: 'number',
    },
  },
  CommunityTemplateDefinition: {
    type: 'CommunityTemplateDefinition',
    props: {
      baseTemplate: '?string',
      bundlesInfo: ['CommunityTemplateBundleInfo'],
      category: 'string',
      defaultBrandingSet: '?string',
      defaultThemeDefinition: 'string',
      description: '?string',
      enableExtendedCleanUpOnDelete: '?boolean',
      masterLabel: 'string',
      navigationLinkSet: ['NavigationLinkSet'],
      pageSetting: ['CommunityTemplatePageSetting'],
      publisher: '?string',
    },
    extends: 'Metadata',
  },
  CommunityTemplateBundleInfo: {
    type: 'CommunityTemplateBundleInfo',
    props: {
      description: '?string',
      image: '?string',
      order: 'number',
      title: 'string',
      type: 'string',
    },
  },
  CommunityThemeBundleInfo: {
    type: 'CommunityThemeBundleInfo',
    props: {},
    extends: 'CommunityTemplateBundleInfo',
  },
  NavigationLinkSet: {
    type: 'NavigationLinkSet',
    props: {
      navigationMenuItem: ['NavigationMenuItem'],
    },
  },
  NavigationMenuItem: {
    type: 'NavigationMenuItem',
    props: {
      defaultListViewId: '?string',
      label: 'string',
      menuItemBranding: '?NavigationMenuItemBranding',
      position: 'number',
      publiclyAvailable: '?boolean',
      subMenu: '?NavigationSubMenu',
      target: '?string',
      targetPreference: '?string',
      type: 'string',
    },
  },
  NavigationMenuItemBranding: {
    type: 'NavigationMenuItemBranding',
    props: {
      tileImage: '?string',
    },
  },
  NavigationSubMenu: {
    type: 'NavigationSubMenu',
    props: {
      navigationMenuItem: ['NavigationMenuItem'],
    },
  },
  CommunityTemplatePageSetting: {
    type: 'CommunityTemplatePageSetting',
    props: {
      page: 'string',
      themeLayout: 'string',
    },
  },
  CommunityThemeDefinition: {
    type: 'CommunityThemeDefinition',
    props: {
      bundlesInfo: ['CommunityThemeBundleInfo'],
      customThemeLayoutType: ['CommunityCustomThemeLayoutType'],
      defaultBrandingSet: '?string',
      description: '?string',
      enableExtendedCleanUpOnDelete: '?boolean',
      masterLabel: 'string',
      publisher: '?string',
      themeRouteOverride: ['CommunityThemeRouteOverride'],
      themeSetting: ['CommunityThemeSetting'],
    },
    extends: 'Metadata',
  },
  CommunityCustomThemeLayoutType: {
    type: 'CommunityCustomThemeLayoutType',
    props: {
      description: '?string',
      label: 'string',
    },
  },
  CommunityThemeRouteOverride: {
    type: 'CommunityThemeRouteOverride',
    props: {
      customThemeLayoutType: '?string',
      pageAttributes: 'string',
      pageType: 'string',
      themeLayoutType: '?string',
    },
  },
  CommunityThemeSetting: {
    type: 'CommunityThemeSetting',
    props: {
      customThemeLayoutType: '?string',
      themeLayout: 'string',
      themeLayoutType: '?string',
    },
  },
  CompactLayout: {
    type: 'CompactLayout',
    props: {
      fields: ['string'],
      label: 'string',
    },
    extends: 'Metadata',
  },
  CompanySettings: {
    type: 'CompanySettings',
    props: {
      enableCustomFiscalYear: 'boolean',
      fiscalYear: '?FiscalYearSettings',
    },
    extends: 'Metadata',
  },
  FiscalYearSettings: {
    type: 'FiscalYearSettings',
    props: {
      fiscalYearNameBasedOn: '?string',
      startMonth: '?string',
    },
  },
  ConnectedApp: {
    type: 'ConnectedApp',
    props: {
      attributes: ['ConnectedAppAttribute'],
      canvas: '?CanvasMetadata',
      canvasConfig: '?ConnectedAppCanvasConfig',
      contactEmail: 'string',
      contactPhone: '?string',
      description: '?string',
      iconUrl: '?string',
      infoUrl: '?string',
      ipRanges: ['ConnectedAppIpRange'],
      label: 'string',
      logoUrl: '?string',
      mobileAppConfig: '?ConnectedAppMobileDetailConfig',
      mobileStartUrl: '?string',
      oauthConfig: '?ConnectedAppOauthConfig',
      permissionSetName: ['string'],
      plugin: '?string',
      pluginExecutionUser: '?string',
      profileName: ['string'],
      samlConfig: '?ConnectedAppSamlConfig',
      startUrl: '?string',
    },
    extends: 'Metadata',
  },
  ConnectedAppAttribute: {
    type: 'ConnectedAppAttribute',
    props: {
      formula: 'string',
      key: 'string',
    },
  },
  ConnectedAppCanvasConfig: {
    type: 'ConnectedAppCanvasConfig',
    props: {
      accessMethod: 'string',
      canvasUrl: 'string',
      lifecycleClass: '?string',
      locations: ['string'],
      options: ['string'],
      samlInitiationMethod: '?string',
    },
  },
  ConnectedAppIpRange: {
    type: 'ConnectedAppIpRange',
    props: {
      description: '?string',
      end: 'string',
      start: 'string',
    },
  },
  ConnectedAppMobileDetailConfig: {
    type: 'ConnectedAppMobileDetailConfig',
    props: {
      applicationBinaryFile: '?string',
      applicationBinaryFileName: '?string',
      applicationBundleIdentifier: '?string',
      applicationFileLength: '?number',
      applicationIconFile: '?string',
      applicationIconFileName: '?string',
      applicationInstallUrl: '?string',
      devicePlatform: 'string',
      deviceType: '?string',
      minimumOsVersion: '?string',
      privateApp: '?boolean',
      version: 'string',
    },
  },
  ConnectedAppOauthConfig: {
    type: 'ConnectedAppOauthConfig',
    props: {
      callbackUrl: 'string',
      certificate: '?string',
      consumerKey: '?string',
      consumerSecret: '?string',
      idTokenConfig: '?ConnectedAppOauthIdToken',
      isAdminApproved: '?boolean',
      scopes: ['string'],
      singleLogoutUrl: '?string',
    },
  },
  ConnectedAppOauthIdToken: {
    type: 'ConnectedAppOauthIdToken',
    props: {
      idTokenAudience: '?string',
      idTokenIncludeAttributes: '?boolean',
      idTokenIncludeCustomPerms: '?boolean',
      idTokenIncludeStandardClaims: '?boolean',
      idTokenValidity: '?number',
    },
  },
  ConnectedAppSamlConfig: {
    type: 'ConnectedAppSamlConfig',
    props: {
      acsUrl: 'string',
      certificate: '?string',
      encryptionCertificate: '?string',
      encryptionType: '?string',
      entityUrl: 'string',
      issuer: '?string',
      samlIdpSLOBindingEnum: '?string',
      samlNameIdFormat: '?string',
      samlSloUrl: '?string',
      samlSubjectCustomAttr: '?string',
      samlSubjectType: 'string',
    },
  },
  ConnectedAppSettings: {
    type: 'ConnectedAppSettings',
    props: {
      enableAdminApprovedAppsOnly: '?boolean',
      enableSkipUserProvisioningWizardWelcomePage: '?boolean',
    },
    extends: 'Metadata',
  },
  ContentSettings: {
    type: 'ContentSettings',
    props: {
      enableChatterFileLink: '?boolean',
      enableContent: '?boolean',
      enableContentAutoAssign: '?boolean',
      enableContentDistForPortalUsers: '?boolean',
      enableContentDistPwOptionsBit1: '?boolean',
      enableContentDistPwOptionsBit2: '?boolean',
      enableContentDistribution: '?boolean',
      enableContentSupportMultiLanguage: '?boolean',
      enableContentWorkspaceAccess: '?boolean',
      enableFileShareSetByRecord: '?boolean',
      enableFilesUsrShareNetRestricted: '?boolean',
      enableJPGPreviews: '?boolean',
      enableLibraryManagedFiles: '?boolean',
      enableSiteGuestUserToUploadFiles: '?boolean',
      enableUploadFilesOnAttachments: '?boolean',
      skipContentAssetTriggers: '?boolean',
      skipContentAssetTriggersOnDeploy: '?boolean',
    },
    extends: 'Metadata',
  },
  ContractSettings: {
    type: 'ContractSettings',
    props: {
      autoCalculateEndDate: '?boolean',
      autoExpirationDelay: '?string',
      autoExpirationRecipient: '?string',
      autoExpireContracts: '?boolean',
      enableContractHistoryTracking: '?boolean',
      notifyOwnersOnContractExpiration: '?boolean',
    },
    extends: 'Metadata',
  },
  CorsWhitelistOrigin: {
    type: 'CorsWhitelistOrigin',
    props: {
      urlPattern: 'string',
    },
    extends: 'Metadata',
  },
  CspTrustedSite: {
    type: 'CspTrustedSite',
    props: {
      context: '?string',
      description: '?string',
      endpointUrl: 'string',
      isActive: 'boolean',
    },
    extends: 'Metadata',
  },
  CurrencySettings: {
    type: 'CurrencySettings',
    props: {
      enableCurrencyEffectiveDates: '?boolean',
      enableCurrencySymbolWithMultiCurrency: '?boolean',
      enableMultiCurrency: '?boolean',
      isMultiCurrencyActivationAllowed: '?boolean',
      isParenCurrencyConvDisabled: '?boolean',
    },
    extends: 'Metadata',
  },
  CustomApplication: {
    type: 'CustomApplication',
    props: {
      actionOverrides: ['AppActionOverride'],
      brand: '?AppBrand',
      consoleConfig: '?ServiceCloudConsoleConfig',
      defaultLandingTab: '?string',
      description: '?string',
      formFactors: ['string'],
      isNavAutoTempTabsDisabled: '?boolean',
      isNavPersonalizationDisabled: '?boolean',
      isServiceCloudConsole: '?boolean',
      label: '?string',
      logo: '?string',
      navType: '?string',
      preferences: '?AppPreferences',
      profileActionOverrides: ['AppProfileActionOverride'],
      setupExperience: '?string',
      subscriberTabs: ['string'],
      tabs: ['string'],
      uiType: '?string',
      utilityBar: '?string',
      workspaceConfig: '?AppWorkspaceConfig',
    },
    extends: 'Metadata',
  },
  AppActionOverride: {
    type: 'AppActionOverride',
    props: {
      pageOrSobjectType: 'string',
    },
    extends: 'ActionOverride',
  },
  ActionOverride: {
    type: 'ActionOverride',
    props: {
      actionName: '?string',
      comment: '?string',
      content: '?string',
      formFactor: '?string',
      skipRecordTypeSelect: '?boolean',
      type: '?string',
    },
  },
  AppBrand: {
    type: 'AppBrand',
    props: {
      footerColor: '?string',
      headerColor: '?string',
      logo: '?string',
      logoVersion: '?number',
      shouldOverrideOrgTheme: '?boolean',
    },
  },
  ServiceCloudConsoleConfig: {
    type: 'ServiceCloudConsoleConfig',
    props: {
      componentList: '?AppComponentList',
      detailPageRefreshMethod: 'string',
      footerColor: '?string',
      headerColor: '?string',
      keyboardShortcuts: 'KeyboardShortcuts',
      listPlacement: 'ListPlacement',
      listRefreshMethod: 'string',
      liveAgentConfig: '?LiveAgentConfig',
      primaryTabColor: '?string',
      pushNotifications: ['PushNotification'],
      tabLimitConfig: '?TabLimitConfig',
      whitelistedDomains: ['string'],
    },
  },
  AppComponentList: {
    type: 'AppComponentList',
    props: {
      alignment: 'string',
      components: ['string'],
    },
  },
  KeyboardShortcuts: {
    type: 'KeyboardShortcuts',
    props: {
      customShortcuts: ['CustomShortcut'],
      defaultShortcuts: ['DefaultShortcut'],
    },
  },
  CustomShortcut: {
    type: 'CustomShortcut',
    props: {
      description: '?string',
      eventName: 'string',
    },
    extends: 'DefaultShortcut',
  },
  DefaultShortcut: {
    type: 'DefaultShortcut',
    props: {
      action: 'string',
      active: 'boolean',
      keyCommand: 'string',
    },
  },
  ListPlacement: {
    type: 'ListPlacement',
    props: {
      height: '?number',
      location: 'string',
      units: '?string',
      width: '?number',
    },
  },
  LiveAgentConfig: {
    type: 'LiveAgentConfig',
    props: {
      enableLiveChat: '?boolean',
      openNewAccountSubtab: '?boolean',
      openNewCaseSubtab: '?boolean',
      openNewContactSubtab: '?boolean',
      openNewLeadSubtab: '?boolean',
      openNewVFPageSubtab: '?boolean',
      pageNamesToOpen: ['string'],
      showKnowledgeArticles: '?boolean',
    },
  },
  PushNotification: {
    type: 'PushNotification',
    props: {
      fieldNames: ['string'],
      objectName: 'string',
    },
  },
  TabLimitConfig: {
    type: 'TabLimitConfig',
    props: {
      maxNumberOfPrimaryTabs: '?string',
      maxNumberOfSubTabs: '?string',
    },
  },
  AppPreferences: {
    type: 'AppPreferences',
    props: {
      enableCustomizeMyTabs: 'boolean',
      enableKeyboardShortcuts: 'boolean',
      enableListViewHover: 'boolean',
      enableListViewReskin: 'boolean',
      enableMultiMonitorComponents: 'boolean',
      enablePinTabs: 'boolean',
      enableTabHover: 'boolean',
      enableTabLimits: 'boolean',
      saveUserSessions: 'boolean',
    },
  },
  AppProfileActionOverride: {
    type: 'AppProfileActionOverride',
    props: {
      profile: 'string',
    },
    extends: 'ProfileActionOverride',
  },
  ProfileActionOverride: {
    type: 'ProfileActionOverride',
    props: {
      actionName: 'string',
      content: '?string',
      formFactor: 'string',
      pageOrSobjectType: 'string',
      recordType: '?string',
      type: 'string',
    },
  },
  AppWorkspaceConfig: {
    type: 'AppWorkspaceConfig',
    props: {
      mappings: ['WorkspaceMapping'],
    },
  },
  WorkspaceMapping: {
    type: 'WorkspaceMapping',
    props: {
      fieldName: '?string',
      tab: 'string',
    },
  },
  CustomApplicationComponent: {
    type: 'CustomApplicationComponent',
    props: {
      buttonIconUrl: '?string',
      buttonStyle: '?string',
      buttonText: '?string',
      buttonWidth: '?number',
      height: '?number',
      isHeightFixed: 'boolean',
      isHidden: 'boolean',
      isWidthFixed: 'boolean',
      visualforcePage: 'string',
      width: '?number',
    },
    extends: 'Metadata',
  },
  CustomFeedFilter: {
    type: 'CustomFeedFilter',
    props: {
      criteria: ['FeedFilterCriterion'],
      description: '?string',
      isProtected: '?boolean',
      label: 'string',
    },
    extends: 'Metadata',
  },
  FeedFilterCriterion: {
    type: 'FeedFilterCriterion',
    props: {
      feedItemType: 'string',
      feedItemVisibility: '?string',
      relatedSObjectType: '?string',
    },
  },
  CustomField: {
    type: 'CustomField',
    props: {
      businessOwnerGroup: '?string',
      businessOwnerUser: '?string',
      businessStatus: '?string',
      caseSensitive: '?boolean',
      complianceGroup: '?string',
      customDataType: '?string',
      defaultValue: '?string',
      deleteConstraint: '?string',
      deprecated: '?boolean',
      description: '?string',
      displayFormat: '?string',
      encryptionScheme: '?string',
      escapeMarkup: '?boolean',
      externalDeveloperName: '?string',
      externalId: '?boolean',
      fieldManageability: '?string',
      formula: '?string',
      formulaTreatBlanksAs: '?string',
      inlineHelpText: '?string',
      isAIPredictionField: '?boolean',
      isConvertLeadDisabled: '?boolean',
      isFilteringDisabled: '?boolean',
      isNameField: '?boolean',
      isSortingDisabled: '?boolean',
      label: '?string',
      length: '?number',
      lookupFilter: '?LookupFilter',
      maskChar: '?string',
      maskType: '?string',
      metadataRelationshipControllingField: '?string',
      populateExistingRows: '?boolean',
      precision: '?number',
      referenceTargetField: '?string',
      referenceTo: '?string',
      relationshipLabel: '?string',
      relationshipName: '?string',
      relationshipOrder: '?number',
      reparentableMasterDetail: '?boolean',
      required: '?boolean',
      restrictedAdminField: '?boolean',
      scale: '?number',
      securityClassification: '?string',
      startingNumber: '?number',
      stripMarkup: '?boolean',
      summarizedField: '?string',
      summaryFilterItems: ['FilterItem'],
      summaryForeignKey: '?string',
      summaryOperation: '?string',
      trackFeedHistory: '?boolean',
      trackHistory: '?boolean',
      trackTrending: '?boolean',
      translateData: '?boolean',
      type: '?string',
      unique: '?boolean',
      valueSet: '?ValueSet',
      visibleLines: '?number',
      writeRequiresMasterRead: '?boolean',
    },
    extends: 'Metadata',
  },
  LookupFilter: {
    type: 'LookupFilter',
    props: {
      active: 'boolean',
      booleanFilter: '?string',
      description: '?string',
      errorMessage: '?string',
      filterItems: ['FilterItem'],
      infoMessage: '?string',
      isOptional: 'boolean',
    },
  },
  ValueSet: {
    type: 'ValueSet',
    props: {
      controllingField: '?string',
      restricted: '?boolean',
      valueSetDefinition: '?ValueSetValuesDefinition',
      valueSetName: '?string',
      valueSettings: ['ValueSettings'],
    },
  },
  ValueSetValuesDefinition: {
    type: 'ValueSetValuesDefinition',
    props: {
      sorted: 'boolean',
      value: ['CustomValue'],
    },
  },
  CustomValue: {
    type: 'CustomValue',
    props: {
      color: '?string',
      default: 'boolean',
      description: '?string',
      isActive: '?boolean',
      label: '?string',
    },
    extends: 'Metadata',
  },
  StandardValue: {
    type: 'StandardValue',
    props: {
      allowEmail: '?boolean',
      closed: '?boolean',
      converted: '?boolean',
      cssExposed: '?boolean',
      forecastCategory: '?string',
      groupingString: '?string',
      highPriority: '?boolean',
      probability: '?number',
      reverseRole: '?string',
      reviewed: '?boolean',
      won: '?boolean',
    },
    extends: 'CustomValue',
  },
  ValueSettings: {
    type: 'ValueSettings',
    props: {
      controllingFieldValue: ['string'],
      valueName: 'string',
    },
  },
  CustomHelpMenuSection: {
    type: 'CustomHelpMenuSection',
    props: {
      customHelpMenuItems: ['CustomHelpMenuItem'],
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  CustomHelpMenuItem: {
    type: 'CustomHelpMenuItem',
    props: {
      linkUrl: 'string',
      masterLabel: 'string',
      sortOrder: 'number',
    },
  },
  CustomLabel: {
    type: 'CustomLabel',
    props: {
      categories: '?string',
      language: 'string',
      protected: 'boolean',
      shortDescription: 'string',
      value: 'string',
    },
    extends: 'Metadata',
  },
  CustomLabels: {
    type: 'CustomLabels',
    props: {
      labels: ['CustomLabel'],
    },
    extends: 'Metadata',
  },
  CustomMetadata: {
    type: 'CustomMetadata',
    props: {
      description: '?string',
      label: '?string',
      protected: '?boolean',
      values: ['CustomMetadataValue'],
    },
    extends: 'Metadata',
  },
  CustomMetadataValue: {
    type: 'CustomMetadataValue',
    props: {
      field: 'string',
      value: '?any',
    },
  },
  CustomNotificationType: {
    type: 'CustomNotificationType',
    props: {
      customNotifTypeName: 'string',
      description: '?string',
      desktop: 'boolean',
      masterLabel: 'string',
      mobile: 'boolean',
    },
    extends: 'Metadata',
  },
  CustomObject: {
    type: 'CustomObject',
    props: {
      actionOverrides: ['ActionOverride'],
      allowInChatterGroups: '?boolean',
      articleTypeChannelDisplay: '?ArticleTypeChannelDisplay',
      businessProcesses: ['BusinessProcess'],
      compactLayoutAssignment: '?string',
      compactLayouts: ['CompactLayout'],
      customHelp: '?string',
      customHelpPage: '?string',
      customSettingsType: '?string',
      deploymentStatus: '?string',
      deprecated: '?boolean',
      description: '?string',
      enableActivities: '?boolean',
      enableBulkApi: '?boolean',
      enableDataTranslation: '?boolean',
      enableDivisions: '?boolean',
      enableEnhancedLookup: '?boolean',
      enableFeeds: '?boolean',
      enableHistory: '?boolean',
      enableLicensing: '?boolean',
      enableReports: '?boolean',
      enableSearch: '?boolean',
      enableSharing: '?boolean',
      enableStreamingApi: '?boolean',
      eventType: '?string',
      externalDataSource: '?string',
      externalName: '?string',
      externalRepository: '?string',
      externalSharingModel: '?string',
      fieldSets: ['FieldSet'],
      fields: ['CustomField'],
      gender: '?string',
      historyRetentionPolicy: '?HistoryRetentionPolicy',
      household: '?boolean',
      indexes: ['Index'],
      label: '?string',
      listViews: ['ListView'],
      nameField: '?CustomField',
      pluralLabel: '?string',
      profileSearchLayouts: ['ProfileSearchLayouts'],
      publishBehavior: '?string',
      recordTypeTrackFeedHistory: '?boolean',
      recordTypeTrackHistory: '?boolean',
      recordTypes: ['RecordType'],
      searchLayouts: '?SearchLayouts',
      sharingModel: '?string',
      sharingReasons: ['SharingReason'],
      sharingRecalculations: ['SharingRecalculation'],
      startsWith: '?string',
      validationRules: ['ValidationRule'],
      visibility: '?string',
      webLinks: ['WebLink'],
    },
    extends: 'Metadata',
  },
  ArticleTypeChannelDisplay: {
    type: 'ArticleTypeChannelDisplay',
    props: {
      articleTypeTemplates: ['ArticleTypeTemplate'],
    },
  },
  ArticleTypeTemplate: {
    type: 'ArticleTypeTemplate',
    props: {
      channel: 'string',
      page: '?string',
      template: 'string',
    },
  },
  FieldSet: {
    type: 'FieldSet',
    props: {
      availableFields: ['FieldSetItem'],
      description: 'string',
      displayedFields: ['FieldSetItem'],
      label: 'string',
    },
    extends: 'Metadata',
  },
  FieldSetItem: {
    type: 'FieldSetItem',
    props: {
      field: '?string',
      isFieldManaged: '?boolean',
      isRequired: '?boolean',
    },
  },
  HistoryRetentionPolicy: {
    type: 'HistoryRetentionPolicy',
    props: {
      archiveAfterMonths: 'number',
      archiveRetentionYears: 'number',
      description: '?string',
    },
  },
  Index: {
    type: 'Index',
    props: {
      fields: ['IndexField'],
      label: 'string',
    },
    extends: 'Metadata',
  },
  IndexField: {
    type: 'IndexField',
    props: {
      name: 'string',
      sortDirection: 'string',
    },
  },
  ListView: {
    type: 'ListView',
    props: {
      booleanFilter: '?string',
      columns: ['string'],
      division: '?string',
      filterScope: 'string',
      filters: ['ListViewFilter'],
      label: 'string',
      language: '?string',
      queue: '?string',
      sharedTo: '?SharedTo',
    },
    extends: 'Metadata',
  },
  ListViewFilter: {
    type: 'ListViewFilter',
    props: {
      field: 'string',
      operation: 'string',
      value: '?string',
    },
  },
  SharedTo: {
    type: 'SharedTo',
    props: {
      allCustomerPortalUsers: '?string',
      allInternalUsers: '?string',
      allPartnerUsers: '?string',
      channelProgramGroup: ['string'],
      channelProgramGroups: ['string'],
      group: ['string'],
      groups: ['string'],
      guestUser: ['string'],
      managerSubordinates: ['string'],
      managers: ['string'],
      portalRole: ['string'],
      portalRoleAndSubordinates: ['string'],
      queue: ['string'],
      role: ['string'],
      roleAndSubordinates: ['string'],
      roleAndSubordinatesInternal: ['string'],
      roles: ['string'],
      rolesAndSubordinates: ['string'],
      territories: ['string'],
      territoriesAndSubordinates: ['string'],
      territory: ['string'],
      territoryAndSubordinates: ['string'],
    },
  },
  ProfileSearchLayouts: {
    type: 'ProfileSearchLayouts',
    props: {
      fields: ['string'],
      profileName: '?string',
    },
  },
  RecordType: {
    type: 'RecordType',
    props: {
      active: 'boolean',
      businessProcess: '?string',
      compactLayoutAssignment: '?string',
      description: '?string',
      label: 'string',
      picklistValues: ['RecordTypePicklistValue'],
    },
    extends: 'Metadata',
  },
  RecordTypePicklistValue: {
    type: 'RecordTypePicklistValue',
    props: {
      picklist: 'string',
      values: ['PicklistValue'],
    },
  },
  SearchLayouts: {
    type: 'SearchLayouts',
    props: {
      customTabListAdditionalFields: ['string'],
      excludedStandardButtons: ['string'],
      listViewButtons: ['string'],
      lookupDialogsAdditionalFields: ['string'],
      lookupFilterFields: ['string'],
      lookupPhoneDialogsAdditionalFields: ['string'],
      massQuickActions: ['string'],
      searchFilterFields: ['string'],
      searchResultsAdditionalFields: ['string'],
      searchResultsCustomButtons: ['string'],
    },
  },
  SharingReason: {
    type: 'SharingReason',
    props: {
      label: 'string',
    },
    extends: 'Metadata',
  },
  SharingRecalculation: {
    type: 'SharingRecalculation',
    props: {
      className: 'string',
    },
  },
  ValidationRule: {
    type: 'ValidationRule',
    props: {
      active: 'boolean',
      description: '?string',
      errorConditionFormula: 'string',
      errorDisplayField: '?string',
      errorMessage: 'string',
    },
    extends: 'Metadata',
  },
  WebLink: {
    type: 'WebLink',
    props: {
      availability: 'string',
      description: '?string',
      displayType: 'string',
      encodingKey: '?string',
      hasMenubar: '?boolean',
      hasScrollbars: '?boolean',
      hasToolbar: '?boolean',
      height: '?number',
      isResizable: '?boolean',
      linkType: 'string',
      masterLabel: '?string',
      openType: 'string',
      page: '?string',
      position: '?string',
      protected: 'boolean',
      requireRowSelection: '?boolean',
      scontrol: '?string',
      showsLocation: '?boolean',
      showsStatus: '?boolean',
      url: '?string',
      width: '?number',
    },
    extends: 'Metadata',
  },
  CustomObjectTranslation: {
    type: 'CustomObjectTranslation',
    props: {
      caseValues: ['ObjectNameCaseValue'],
      fieldSets: ['FieldSetTranslation'],
      fields: ['CustomFieldTranslation'],
      gender: '?string',
      layouts: ['LayoutTranslation'],
      nameFieldLabel: '?string',
      quickActions: ['QuickActionTranslation'],
      recordTypes: ['RecordTypeTranslation'],
      sharingReasons: ['SharingReasonTranslation'],
      standardFields: ['StandardFieldTranslation'],
      startsWith: '?string',
      validationRules: ['ValidationRuleTranslation'],
      webLinks: ['WebLinkTranslation'],
      workflowTasks: ['WorkflowTaskTranslation'],
    },
    extends: 'Metadata',
  },
  ObjectNameCaseValue: {
    type: 'ObjectNameCaseValue',
    props: {
      article: '?string',
      caseType: '?string',
      plural: '?boolean',
      possessive: '?string',
      value: 'string',
    },
  },
  FieldSetTranslation: {
    type: 'FieldSetTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  CustomFieldTranslation: {
    type: 'CustomFieldTranslation',
    props: {
      caseValues: ['ObjectNameCaseValue'],
      gender: '?string',
      help: '?string',
      label: '?string',
      lookupFilter: '?LookupFilterTranslation',
      name: 'string',
      picklistValues: ['PicklistValueTranslation'],
      relationshipLabel: '?string',
      startsWith: '?string',
    },
  },
  LookupFilterTranslation: {
    type: 'LookupFilterTranslation',
    props: {
      errorMessage: 'string',
      informationalMessage: 'string',
    },
  },
  PicklistValueTranslation: {
    type: 'PicklistValueTranslation',
    props: {
      masterLabel: 'string',
      translation: '?string',
    },
  },
  LayoutTranslation: {
    type: 'LayoutTranslation',
    props: {
      layout: 'string',
      layoutType: '?string',
      sections: ['LayoutSectionTranslation'],
    },
  },
  LayoutSectionTranslation: {
    type: 'LayoutSectionTranslation',
    props: {
      label: 'string',
      section: 'string',
    },
  },
  QuickActionTranslation: {
    type: 'QuickActionTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  RecordTypeTranslation: {
    type: 'RecordTypeTranslation',
    props: {
      description: '?string',
      label: 'string',
      name: 'string',
    },
  },
  SharingReasonTranslation: {
    type: 'SharingReasonTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  StandardFieldTranslation: {
    type: 'StandardFieldTranslation',
    props: {
      label: '?string',
      name: 'string',
    },
  },
  ValidationRuleTranslation: {
    type: 'ValidationRuleTranslation',
    props: {
      errorMessage: 'string',
      name: 'string',
    },
  },
  WebLinkTranslation: {
    type: 'WebLinkTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  WorkflowTaskTranslation: {
    type: 'WorkflowTaskTranslation',
    props: {
      description: '?string',
      name: 'string',
      subject: '?string',
    },
  },
  CustomPageWebLink: {
    type: 'CustomPageWebLink',
    props: {
      availability: 'string',
      description: '?string',
      displayType: 'string',
      encodingKey: '?string',
      hasMenubar: '?boolean',
      hasScrollbars: '?boolean',
      hasToolbar: '?boolean',
      height: '?number',
      isResizable: '?boolean',
      linkType: 'string',
      masterLabel: '?string',
      openType: 'string',
      page: '?string',
      position: '?string',
      protected: 'boolean',
      requireRowSelection: '?boolean',
      scontrol: '?string',
      showsLocation: '?boolean',
      showsStatus: '?boolean',
      url: '?string',
      width: '?number',
    },
    extends: 'Metadata',
  },
  CustomPermission: {
    type: 'CustomPermission',
    props: {
      connectedApp: '?string',
      description: '?string',
      label: 'string',
      requiredPermission: ['CustomPermissionDependencyRequired'],
    },
    extends: 'Metadata',
  },
  CustomPermissionDependencyRequired: {
    type: 'CustomPermissionDependencyRequired',
    props: {
      customPermission: 'string',
      dependency: 'boolean',
    },
  },
  CustomSite: {
    type: 'CustomSite',
    props: {
      active: 'boolean',
      allowHomePage: 'boolean',
      allowStandardAnswersPages: '?boolean',
      allowStandardIdeasPages: 'boolean',
      allowStandardLookups: 'boolean',
      allowStandardPortalPages: 'boolean',
      allowStandardSearch: 'boolean',
      analyticsTrackingCode: '?string',
      authorizationRequiredPage: '?string',
      bandwidthExceededPage: '?string',
      browserXssProtection: 'boolean',
      changePasswordPage: '?string',
      chatterAnswersForgotPasswordConfirmPage: '?string',
      chatterAnswersForgotPasswordPage: '?string',
      chatterAnswersHelpPage: '?string',
      chatterAnswersLoginPage: '?string',
      chatterAnswersRegistrationPage: '?string',
      clickjackProtectionLevel: 'string',
      contentSniffingProtection: 'boolean',
      cspUpgradeInsecureRequests: 'boolean',
      customWebAddresses: ['SiteWebAddress'],
      description: '?string',
      enableAuraRequests: '?boolean',
      favoriteIcon: '?string',
      fileNotFoundPage: '?string',
      forgotPasswordPage: '?string',
      genericErrorPage: '?string',
      guestProfile: '?string',
      inMaintenancePage: '?string',
      inactiveIndexPage: '?string',
      indexPage: 'string',
      masterLabel: 'string',
      myProfilePage: '?string',
      portal: '?string',
      referrerPolicyOriginWhenCrossOrigin: 'boolean',
      requireHttps: 'boolean',
      requireInsecurePortalAccess: 'boolean',
      robotsTxtPage: '?string',
      rootComponent: '?string',
      selfRegPage: '?string',
      serverIsDown: '?string',
      siteAdmin: '?string',
      siteRedirectMappings: ['SiteRedirectMapping'],
      siteTemplate: '?string',
      siteType: 'string',
      subdomain: '?string',
      urlPathPrefix: '?string',
    },
    extends: 'Metadata',
  },
  SiteWebAddress: {
    type: 'SiteWebAddress',
    props: {
      certificate: '?string',
      domainName: 'string',
      primary: 'boolean',
    },
  },
  SiteRedirectMapping: {
    type: 'SiteRedirectMapping',
    props: {
      action: 'string',
      isActive: '?boolean',
      source: 'string',
      target: 'string',
    },
  },
  CustomTab: {
    type: 'CustomTab',
    props: {
      actionOverrides: ['ActionOverride'],
      auraComponent: '?string',
      customObject: '?boolean',
      description: '?string',
      flexiPage: '?string',
      frameHeight: '?number',
      hasSidebar: '?boolean',
      icon: '?string',
      label: '?string',
      lwcComponent: '?string',
      motif: '?string',
      page: '?string',
      scontrol: '?string',
      splashPageLink: '?string',
      url: '?string',
      urlEncodingKey: '?string',
    },
    extends: 'Metadata',
  },
  Dashboard: {
    type: 'Dashboard',
    props: {
      backgroundEndColor: 'string',
      backgroundFadeDirection: 'string',
      backgroundStartColor: 'string',
      chartTheme: '?string',
      colorPalette: '?string',
      dashboardChartTheme: '?string',
      dashboardColorPalette: '?string',
      dashboardFilters: ['DashboardFilter'],
      dashboardGridLayout: '?DashboardGridLayout',
      dashboardResultRefreshedDate: '?string',
      dashboardResultRunningUser: '?string',
      dashboardType: '?string',
      description: '?string',
      folderName: '?string',
      isGridLayout: '?boolean',
      leftSection: '?DashboardComponentSection',
      middleSection: '?DashboardComponentSection',
      numSubscriptions: '?number',
      rightSection: '?DashboardComponentSection',
      runningUser: '?string',
      textColor: 'string',
      title: 'string',
      titleColor: 'string',
      titleSize: 'number',
    },
    extends: 'Metadata',
  },
  DashboardFilter: {
    type: 'DashboardFilter',
    props: {
      dashboardFilterOptions: ['DashboardFilterOption'],
      name: 'string',
    },
  },
  DashboardFilterOption: {
    type: 'DashboardFilterOption',
    props: {
      operator: 'string',
      values: ['string'],
    },
  },
  DashboardGridLayout: {
    type: 'DashboardGridLayout',
    props: {
      dashboardGridComponents: ['DashboardGridComponent'],
      numberOfColumns: 'number',
      rowHeight: 'number',
    },
  },
  DashboardGridComponent: {
    type: 'DashboardGridComponent',
    props: {
      colSpan: 'number',
      columnIndex: 'number',
      dashboardComponent: 'DashboardComponent',
      rowIndex: 'number',
      rowSpan: 'number',
    },
  },
  DashboardComponent: {
    type: 'DashboardComponent',
    props: {
      autoselectColumnsFromReport: '?boolean',
      chartAxisRange: '?string',
      chartAxisRangeMax: '?number',
      chartAxisRangeMin: '?number',
      chartSummary: ['ChartSummary'],
      componentChartTheme: '?string',
      componentType: 'string',
      dashboardFilterColumns: ['DashboardFilterColumn'],
      dashboardTableColumn: ['DashboardTableColumn'],
      decimalPrecision: '?number',
      displayUnits: '?string',
      drillDownUrl: '?string',
      drillEnabled: '?boolean',
      drillToDetailEnabled: '?boolean',
      enableHover: '?boolean',
      expandOthers: '?boolean',
      flexComponentProperties: '?DashboardFlexTableComponentProperties',
      footer: '?string',
      gaugeMax: '?number',
      gaugeMin: '?number',
      groupingColumn: ['string'],
      groupingSortProperties: '?DashboardComponentGroupingSortProperties',
      header: '?string',
      indicatorBreakpoint1: '?number',
      indicatorBreakpoint2: '?number',
      indicatorHighColor: '?string',
      indicatorLowColor: '?string',
      indicatorMiddleColor: '?string',
      legendPosition: '?string',
      maxValuesDisplayed: '?number',
      metricLabel: '?string',
      page: '?string',
      pageHeightInPixels: '?number',
      report: '?string',
      scontrol: '?string',
      scontrolHeightInPixels: '?number',
      showPercentage: '?boolean',
      showPicturesOnCharts: '?boolean',
      showPicturesOnTables: '?boolean',
      showRange: '?boolean',
      showTotal: '?boolean',
      showValues: '?boolean',
      sortBy: '?string',
      title: '?string',
      useReportChart: '?boolean',
    },
  },
  ChartSummary: {
    type: 'ChartSummary',
    props: {
      aggregate: '?string',
      axisBinding: '?string',
      column: 'string',
    },
  },
  DashboardFilterColumn: {
    type: 'DashboardFilterColumn',
    props: {
      column: 'string',
    },
  },
  DashboardTableColumn: {
    type: 'DashboardTableColumn',
    props: {
      aggregateType: '?string',
      calculatePercent: '?boolean',
      column: 'string',
      decimalPlaces: '?number',
      showSubTotal: '?boolean',
      showTotal: '?boolean',
      sortBy: '?string',
    },
  },
  DashboardFlexTableComponentProperties: {
    type: 'DashboardFlexTableComponentProperties',
    props: {
      decimalPrecision: '?number',
      flexTableColumn: ['DashboardComponentColumn'],
      flexTableSortInfo: '?DashboardComponentSortInfo',
      hideChatterPhotos: '?boolean',
    },
  },
  DashboardComponentColumn: {
    type: 'DashboardComponentColumn',
    props: {
      breakPoint1: '?number',
      breakPoint2: '?number',
      breakPointOrder: '?number',
      highRangeColor: '?number',
      lowRangeColor: '?number',
      midRangeColor: '?number',
      reportColumn: 'string',
      showSubTotal: '?boolean',
      showTotal: '?boolean',
      type: 'string',
    },
  },
  DashboardComponentSortInfo: {
    type: 'DashboardComponentSortInfo',
    props: {
      sortColumn: '?string',
      sortOrder: '?string',
    },
  },
  DashboardComponentGroupingSortProperties: {
    type: 'DashboardComponentGroupingSortProperties',
    props: {
      groupingSorts: ['DashboardComponentGroupingSort'],
    },
  },
  DashboardComponentGroupingSort: {
    type: 'DashboardComponentGroupingSort',
    props: {
      groupingLevel: 'string',
      inheritedReportGroupingSort: '?string',
      sortColumn: '?string',
      sortOrder: '?string',
    },
  },
  DashboardComponentSection: {
    type: 'DashboardComponentSection',
    props: {
      columnSize: 'string',
      components: ['DashboardComponent'],
    },
  },
  DataCategoryGroup: {
    type: 'DataCategoryGroup',
    props: {
      active: 'boolean',
      dataCategory: 'DataCategory',
      description: '?string',
      label: 'string',
      objectUsage: '?ObjectUsage',
    },
    extends: 'Metadata',
  },
  DataCategory: {
    type: 'DataCategory',
    props: {
      dataCategory: ['DataCategory'],
      label: 'string',
      name: 'string',
    },
  },
  ObjectUsage: {
    type: 'ObjectUsage',
    props: {
      object: ['string'],
    },
  },
  DataDotComSettings: {
    type: 'DataDotComSettings',
    props: {
      enableAccountExportButtonOff: '?boolean',
      enableAccountImportButtonOff: '?boolean',
      enableAllowDupeContactFromLead: '?boolean',
      enableAllowDupeLeadFromContact: '?boolean',
      enableCleanUpgradeRequested: '?boolean',
      enableContactExportButtonOff: '?boolean',
      enableContactImportButtonOff: '?boolean',
    },
    extends: 'Metadata',
  },
  DelegateGroup: {
    type: 'DelegateGroup',
    props: {
      customObjects: ['string'],
      groups: ['string'],
      label: 'string',
      loginAccess: 'boolean',
      permissionSets: ['string'],
      profiles: ['string'],
      roles: ['string'],
    },
    extends: 'Metadata',
  },
  DeploymentSettings: {
    type: 'DeploymentSettings',
    props: {
      doesSkipAsyncApexValidation: '?boolean',
    },
    extends: 'Metadata',
  },
  DevHubSettings: {
    type: 'DevHubSettings',
    props: {
      enableShapeExportPref: '?boolean',
    },
    extends: 'Metadata',
  },
  DiscoverySettings: {
    type: 'DiscoverySettings',
    props: {
      enableEinsteinAnswersPref: '?boolean',
    },
    extends: 'Metadata',
  },
  DocumentType: {
    type: 'DocumentType',
    props: {
      description: 'string',
      isActive: 'boolean',
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  DuplicateRule: {
    type: 'DuplicateRule',
    props: {
      actionOnInsert: 'string',
      actionOnUpdate: 'string',
      alertText: '?string',
      description: '?string',
      duplicateRuleFilter: '?DuplicateRuleFilter',
      duplicateRuleMatchRules: ['?', 'DuplicateRuleMatchRule'],
      isActive: 'boolean',
      masterLabel: 'string',
      operationsOnInsert: ['string'],
      operationsOnUpdate: ['string'],
      securityOption: 'string',
      sortOrder: 'number',
    },
    extends: 'Metadata',
  },
  DuplicateRuleFilter: {
    type: 'DuplicateRuleFilter',
    props: {
      booleanFilter: '?string',
      duplicateRuleFilterItems: ['DuplicateRuleFilterItem'],
    },
  },
  DuplicateRuleMatchRule: {
    type: 'DuplicateRuleMatchRule',
    props: {
      matchRuleSObjectType: 'string',
      matchingRule: 'string',
      objectMapping: '?ObjectMapping',
    },
  },
  ObjectMapping: {
    type: 'ObjectMapping',
    props: {
      inputObject: 'string',
      mappingFields: ['ObjectMappingField'],
      outputObject: 'string',
    },
  },
  ObjectMappingField: {
    type: 'ObjectMappingField',
    props: {
      inputField: 'string',
      outputField: 'string',
    },
  },
  EACSettings: {
    type: 'EACSettings',
    props: {
      enableEACForEveryonePref: '?boolean',
      enableInboxActivitySharing: '?boolean',
      enableInsightsInTimeline: '?boolean',
      enableInsightsInTimelineEacStd: '?boolean',
    },
    extends: 'Metadata',
  },
  EmailAdministrationSettings: {
    type: 'EmailAdministrationSettings',
    props: {
      enableComplianceBcc: '?boolean',
      enableEmailConsentManagement: '?boolean',
      enableEmailSenderIdCompliance: '?boolean',
      enableEmailSpfCompliance: '?boolean',
      enableEmailToSalesforce: '?boolean',
      enableEmailWorkflowApproval: '?boolean',
      enableEnhancedEmailEnabled: '?boolean',
      enableHandleBouncedEmails: '?boolean',
      enableHtmlEmail: '?boolean',
      enableListEmailLogActivities: '?boolean',
      enableResendBouncedEmails: '?boolean',
      enableRestrictTlsToDomains: '?boolean',
      enableSendThroughGmailPref: '?boolean',
      enableSendViaExchangePref: '?boolean',
      enableSendViaGmailPref: '?boolean',
      enableSetMatchingEmailsOnBounce: '?boolean',
      enableUseOrgFootersForExtTrans: '?boolean',
      sendEmailsEvenWhenAutomationUpdatesSameRecord: '?boolean',
      sendMassEmailNotification: '?boolean',
      sendTextOnlySystemEmails: '?boolean',
    },
    extends: 'Metadata',
  },
  EmailIntegrationSettings: {
    type: 'EmailIntegrationSettings',
    props: {
      doesEmailLogAsEmailMessageInOutlook: '?boolean',
      doesGmailStayConnectedToSalesforce: '?boolean',
      enableContactAndEventSync: '?boolean',
      enableEmailTrackingInMobile: '?boolean',
      enableEngageForOutlook: '?boolean',
      enableGmailIntegration: '?boolean',
      enableOutlookIntegration: '?boolean',
      enableProductivityFeatures: '?boolean',
      enableSupplementalContactInfoInMobile: '?boolean',
      isLayoutCustomizationAllowed: '?boolean',
      shouldUseTrustedDomainsList: '?boolean',
    },
    extends: 'Metadata',
  },
  EmailServicesFunction: {
    type: 'EmailServicesFunction',
    props: {
      apexClass: 'string',
      attachmentOption: 'string',
      authenticationFailureAction: 'string',
      authorizationFailureAction: 'string',
      authorizedSenders: '?string',
      emailServicesAddresses: ['EmailServicesAddress'],
      errorRoutingAddress: '?string',
      functionInactiveAction: 'string',
      functionName: 'string',
      isActive: '?boolean',
      isAuthenticationRequired: '?boolean',
      isErrorRoutingEnabled: '?boolean',
      isTextAttachmentsAsBinary: '?boolean',
      isTlsRequired: '?boolean',
      overLimitAction: 'string',
    },
    extends: 'Metadata',
  },
  EmailServicesAddress: {
    type: 'EmailServicesAddress',
    props: {
      authorizedSenders: '?string',
      developerName: 'string',
      isActive: '?boolean',
      localPart: 'string',
      runAsUser: 'string',
    },
  },
  EmailTemplateSettings: {
    type: 'EmailTemplateSettings',
    props: {
      enableLwcEmailTemplateBuilder: '?boolean',
      enableTemplateEnhancedFolderPref: '?boolean',
    },
    extends: 'Metadata',
  },
  EmbeddedServiceBranding: {
    type: 'EmbeddedServiceBranding',
    props: {
      contrastInvertedColor: '?string',
      contrastPrimaryColor: '?string',
      embeddedServiceConfig: 'string',
      font: '?string',
      height: '?number',
      masterLabel: 'string',
      navBarColor: '?string',
      primaryColor: '?string',
      secondaryColor: '?string',
      width: '?number',
    },
    extends: 'Metadata',
  },
  EmbeddedServiceConfig: {
    type: 'EmbeddedServiceConfig',
    props: {
      areGuestUsersAllowed: '?boolean',
      authMethod: '?string',
      embeddedServiceAppointmentSettings: '?EmbeddedServiceAppointmentSettings',
      embeddedServiceCustomComponents: ['EmbeddedServiceCustomComponent'],
      embeddedServiceCustomLabels: ['EmbeddedServiceCustomLabel'],
      embeddedServiceFlowConfig: '?EmbeddedServiceFlowConfig',
      embeddedServiceFlows: ['EmbeddedServiceFlow'],
      embeddedServiceLayouts: ['EmbeddedServiceLayout'],
      masterLabel: 'string',
      shouldHideAuthDialog: '?boolean',
      site: 'string',
    },
    extends: 'Metadata',
  },
  EmbeddedServiceAppointmentSettings: {
    type: 'EmbeddedServiceAppointmentSettings',
    props: {
      appointmentConfirmImg: '?string',
      enabled: 'boolean',
      homeImg: '?string',
      logoImg: '?string',
      shouldShowExistingAppointment: '?boolean',
      shouldShowNewAppointment: '?boolean',
    },
  },
  EmbeddedServiceCustomComponent: {
    type: 'EmbeddedServiceCustomComponent',
    props: {
      componentBundleType: '?string',
      customComponent: '?string',
      customComponentType: '?string',
    },
  },
  EmbeddedServiceCustomLabel: {
    type: 'EmbeddedServiceCustomLabel',
    props: {
      customLabel: '?string',
      feature: '?string',
      labelKey: '?string',
    },
  },
  EmbeddedServiceFlowConfig: {
    type: 'EmbeddedServiceFlowConfig',
    props: {
      enabled: 'boolean',
    },
    extends: 'Metadata',
  },
  EmbeddedServiceFlow: {
    type: 'EmbeddedServiceFlow',
    props: {
      flow: 'string',
      flowType: 'string',
      isAuthenticationRequired: 'boolean',
    },
  },
  EmbeddedServiceLayout: {
    type: 'EmbeddedServiceLayout',
    props: {
      embeddedServiceLayoutRules: ['EmbeddedServiceLayoutRule'],
      layout: 'string',
      layoutType: '?string',
    },
  },
  EmbeddedServiceLayoutRule: {
    type: 'EmbeddedServiceLayoutRule',
    props: {
      appointmentStatus: 'string',
    },
  },
  EmbeddedServiceLiveAgent: {
    type: 'EmbeddedServiceLiveAgent',
    props: {
      avatarImg: '?string',
      embeddedServiceConfig: 'string',
      embeddedServiceQuickActions: ['EmbeddedServiceQuickAction'],
      enabled: 'boolean',
      fontSize: 'string',
      headerBackgroundImg: '?string',
      isOfflineCaseEnabled: '?boolean',
      isQueuePositionEnabled: '?boolean',
      liveAgentChatUrl: '?string',
      liveAgentContentUrl: '?string',
      liveChatButton: 'string',
      liveChatDeployment: 'string',
      masterLabel: 'string',
      offlineCaseBackgroundImg: '?string',
      prechatBackgroundImg: '?string',
      prechatEnabled: 'boolean',
      prechatJson: '?string',
      scenario: 'string',
      smallCompanyLogoImg: '?string',
      waitingStateBackgroundImg: '?string',
    },
    extends: 'Metadata',
  },
  EmbeddedServiceQuickAction: {
    type: 'EmbeddedServiceQuickAction',
    props: {
      embeddedServiceLiveAgent: 'string',
      order: 'number',
      quickActionDefinition: 'string',
      quickActionType: '?string',
    },
  },
  EmbeddedServiceMenuSettings: {
    type: 'EmbeddedServiceMenuSettings',
    props: {
      branding: '?string',
      embeddedServiceMenuItems: ['EmbeddedServiceMenuItem'],
      isEnabled: '?boolean',
      masterLabel: '?string',
      site: '?string',
    },
    extends: 'Metadata',
  },
  EmbeddedServiceMenuItem: {
    type: 'EmbeddedServiceMenuItem',
    props: {
      channel: '?string',
      channelType: '?string',
      displayOrder: '?number',
      phoneNumber: '?string',
    },
  },
  EncryptionKeySettings: {
    type: 'EncryptionKeySettings',
    props: {
      canOptOutOfDerivationWithBYOK: '?boolean',
      enableCacheOnlyKeys: '?boolean',
      enableReplayDetection: '?boolean',
    },
    extends: 'Metadata',
  },
  EnhancedNotesSettings: {
    type: 'EnhancedNotesSettings',
    props: {
      enableEnhancedNotes: '?boolean',
      enableTasksOnEnhancedNotes: '?boolean',
    },
    extends: 'Metadata',
  },
  EntitlementProcess: {
    type: 'EntitlementProcess',
    props: {
      SObjectType: '?string',
      active: '?boolean',
      businessHours: '?string',
      description: '?string',
      entryStartDateField: '?string',
      exitCriteriaBooleanFilter: '?string',
      exitCriteriaFilterItems: ['FilterItem'],
      exitCriteriaFormula: '?string',
      isRecordTypeApplied: '?boolean',
      isVersionDefault: '?boolean',
      milestones: ['EntitlementProcessMilestoneItem'],
      name: '?string',
      recordType: '?string',
      versionMaster: '?string',
      versionNotes: '?string',
      versionNumber: '?number',
    },
    extends: 'Metadata',
  },
  EntitlementProcessMilestoneItem: {
    type: 'EntitlementProcessMilestoneItem',
    props: {
      businessHours: '?string',
      criteriaBooleanFilter: '?string',
      milestoneCriteriaFilterItems: ['FilterItem'],
      milestoneCriteriaFormula: '?string',
      milestoneName: '?string',
      minutesCustomClass: '?string',
      minutesToComplete: '?number',
      successActions: ['WorkflowActionReference'],
      timeTriggers: ['EntitlementProcessMilestoneTimeTrigger'],
      useCriteriaStartTime: '?boolean',
    },
  },
  EntitlementProcessMilestoneTimeTrigger: {
    type: 'EntitlementProcessMilestoneTimeTrigger',
    props: {
      actions: ['WorkflowActionReference'],
      timeLength: '?number',
      workflowTimeTriggerUnit: 'string',
    },
  },
  EntitlementSettings: {
    type: 'EntitlementSettings',
    props: {
      assetLookupLimitedToActiveEntitlementsOnAccount: '?boolean',
      assetLookupLimitedToActiveEntitlementsOnContact: '?boolean',
      assetLookupLimitedToSameAccount: '?boolean',
      assetLookupLimitedToSameContact: '?boolean',
      enableEntitlementVersioning: 'boolean',
      enableEntitlements: 'boolean',
      enableMilestoneFeedItem: '?boolean',
      enableMilestoneStoppedTime: '?boolean',
      entitlementLookupLimitedToActiveStatus: '?boolean',
      entitlementLookupLimitedToSameAccount: '?boolean',
      entitlementLookupLimitedToSameAsset: '?boolean',
      entitlementLookupLimitedToSameContact: '?boolean',
      ignoreMilestoneBusinessHours: '?boolean',
    },
    extends: 'Metadata',
  },
  EntitlementTemplate: {
    type: 'EntitlementTemplate',
    props: {
      businessHours: '?string',
      casesPerEntitlement: '?number',
      entitlementProcess: '?string',
      isPerIncident: '?boolean',
      term: '?number',
      type: '?string',
    },
    extends: 'Metadata',
  },
  EntityImplements: {
    type: 'EntityImplements',
    props: {
      fieldMap: ['FieldImplements'],
      interface: '?string',
      isDefault: '?boolean',
    },
    extends: 'Metadata',
  },
  FieldImplements: {
    type: 'FieldImplements',
    props: {
      field: '?string',
      interfaceField: '?string',
    },
  },
  EscalationRule: {
    type: 'EscalationRule',
    props: {
      active: '?boolean',
      ruleEntry: ['RuleEntry'],
    },
    extends: 'Metadata',
  },
  EscalationRules: {
    type: 'EscalationRules',
    props: {
      escalationRule: ['EscalationRule'],
    },
    extends: 'Metadata',
  },
  EssentialsSettings: {
    type: 'EssentialsSettings',
    props: {
      emailConnectorEnabled: '?boolean',
      essentialsAppEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  EssentialsTrialOrgSettings: {
    type: 'EssentialsTrialOrgSettings',
    props: {
      enableSampleDataDeleted: '?boolean',
    },
    extends: 'Metadata',
  },
  EventSettings: {
    type: 'EventSettings',
    props: {
      enableApexLimitEvents: '?boolean',
      enableDeleteMonitoringData: '?boolean',
      enableDynamicStreamingChannel: '?boolean',
      enableEventLogWaveIntegration: '?boolean',
      enableLoginForensics: '?boolean',
      enableStreamingApi: '?boolean',
      enableTerminateOldestSession: '?boolean',
      enableTransactionSecurityPolicies: '?boolean',
    },
    extends: 'Metadata',
  },
  ExperienceBundleSettings: {
    type: 'ExperienceBundleSettings',
    props: {
      enableExperienceBundleMetadata: '?boolean',
    },
    extends: 'Metadata',
  },
  ExternalDataSource: {
    type: 'ExternalDataSource',
    props: {
      authProvider: '?string',
      certificate: '?string',
      customConfiguration: '?string',
      customHttpHeaders: ['CustomHttpHeader'],
      endpoint: '?string',
      isWritable: '?boolean',
      label: 'string',
      oauthRefreshToken: '?string',
      oauthScope: '?string',
      oauthToken: '?string',
      password: '?string',
      principalType: 'string',
      protocol: 'string',
      repository: '?string',
      type: 'string',
      username: '?string',
      version: '?string',
    },
    extends: 'Metadata',
  },
  CustomHttpHeader: {
    type: 'CustomHttpHeader',
    props: {
      description: '?string',
      headerFieldName: 'string',
      headerFieldValue: 'string',
      isActive: '?boolean',
    },
  },
  ExternalServiceRegistration: {
    type: 'ExternalServiceRegistration',
    props: {
      description: '?string',
      label: 'string',
      namedCredential: '?string',
      schema: '?string',
      schemaType: '?string',
      schemaUrl: '?string',
      status: 'string',
    },
    extends: 'Metadata',
  },
  ExternalServicesSettings: {
    type: 'ExternalServicesSettings',
    props: {
      enableEnhancedExternalServices: '?boolean',
    },
    extends: 'Metadata',
  },
  FieldServiceSettings: {
    type: 'FieldServiceSettings',
    props: {
      capacityUsageCalcClassId: '?string',
      doesAllowEditSaForCrew: '?boolean',
      doesShareSaParentWoWithAr: '?boolean',
      doesShareSaWithAr: '?boolean',
      enableWorkOrders: '?boolean',
      fieldServiceNotificationsOrgPref: '?boolean',
      fieldServiceOrgPref: '?boolean',
      isGeoCodeSyncEnabled: '?boolean',
      isLocationHistoryEnabled: '?boolean',
      serviceAppointmentsDueDateOffsetOrgValue: '?number',
      workOrderLineItemSearchFields: ['string'],
      workOrderSearchFields: ['string'],
    },
    extends: 'Metadata',
  },
  FileUploadAndDownloadSecuritySettings: {
    type: 'FileUploadAndDownloadSecuritySettings',
    props: {
      dispositions: ['FileTypeDispositionAssignmentBean'],
      noHtmlUploadAsAttachment: 'boolean',
    },
    extends: 'Metadata',
  },
  FileTypeDispositionAssignmentBean: {
    type: 'FileTypeDispositionAssignmentBean',
    props: {
      behavior: 'string',
      fileType: 'string',
      securityRiskFileType: 'boolean',
    },
  },
  FilesConnectSettings: {
    type: 'FilesConnectSettings',
    props: {
      enableContentHubAllowed: '?boolean',
      enableContentHubCvtLinksAllowed: '?boolean',
      enableContentHubEOSearchLayout: '?boolean',
    },
    extends: 'Metadata',
  },
  FlexiPage: {
    type: 'FlexiPage',
    props: {
      description: '?string',
      flexiPageRegions: ['FlexiPageRegion'],
      masterLabel: 'string',
      parentFlexiPage: '?string',
      platformActionlist: '?PlatformActionList',
      quickActionList: '?QuickActionList',
      sobjectType: '?string',
      template: 'FlexiPageTemplateInstance',
      type: 'string',
    },
    extends: 'Metadata',
  },
  FlexiPageRegion: {
    type: 'FlexiPageRegion',
    props: {
      appendable: '?string',
      componentInstances: ['ComponentInstance'],
      mode: '?string',
      name: 'string',
      prependable: '?string',
      replaceable: '?string',
      type: 'string',
    },
  },
  ComponentInstance: {
    type: 'ComponentInstance',
    props: {
      componentInstanceProperties: ['ComponentInstanceProperty'],
      componentName: 'string',
      visibilityRule: '?UiFormulaRule',
    },
  },
  ComponentInstanceProperty: {
    type: 'ComponentInstanceProperty',
    props: {
      name: '?string',
      type: '?string',
      value: '?string',
    },
  },
  UiFormulaRule: {
    type: 'UiFormulaRule',
    props: {
      booleanFilter: '?string',
      criteria: ['UiFormulaCriterion'],
    },
  },
  UiFormulaCriterion: {
    type: 'UiFormulaCriterion',
    props: {
      leftValue: 'string',
      operator: 'string',
      rightValue: '?string',
    },
  },
  PlatformActionList: {
    type: 'PlatformActionList',
    props: {
      actionListContext: 'string',
      platformActionListItems: ['PlatformActionListItem'],
      relatedSourceEntity: '?string',
    },
    extends: 'Metadata',
  },
  PlatformActionListItem: {
    type: 'PlatformActionListItem',
    props: {
      actionName: 'string',
      actionType: 'string',
      sortOrder: 'number',
      subtype: '?string',
    },
  },
  QuickActionList: {
    type: 'QuickActionList',
    props: {
      quickActionListItems: ['QuickActionListItem'],
    },
  },
  QuickActionListItem: {
    type: 'QuickActionListItem',
    props: {
      quickActionName: 'string',
    },
  },
  FlexiPageTemplateInstance: {
    type: 'FlexiPageTemplateInstance',
    props: {
      name: 'string',
      properties: ['ComponentInstanceProperty'],
    },
  },
  Flow: {
    type: 'Flow',
    props: {
      actionCalls: ['FlowActionCall'],
      apexPluginCalls: ['FlowApexPluginCall'],
      assignments: ['FlowAssignment'],
      choices: ['FlowChoice'],
      constants: ['FlowConstant'],
      decisions: ['FlowDecision'],
      description: '?string',
      dynamicChoiceSets: ['FlowDynamicChoiceSet'],
      formulas: ['FlowFormula'],
      interviewLabel: '?string',
      isAdditionalPermissionRequiredToRun: '?boolean',
      isTemplate: '?boolean',
      label: 'string',
      loops: ['FlowLoop'],
      processMetadataValues: ['FlowMetadataValue'],
      processType: '?string',
      recordCreates: ['FlowRecordCreate'],
      recordDeletes: ['FlowRecordDelete'],
      recordLookups: ['FlowRecordLookup'],
      recordUpdates: ['FlowRecordUpdate'],
      screens: ['FlowScreen'],
      stages: ['FlowStage'],
      start: '?FlowStart',
      startElementReference: '?string',
      status: '?string',
      steps: ['FlowStep'],
      subflows: ['FlowSubflow'],
      textTemplates: ['FlowTextTemplate'],
      variables: ['FlowVariable'],
      waits: ['FlowWait'],
    },
    extends: 'Metadata',
  },
  FlowActionCall: {
    type: 'FlowActionCall',
    props: {
      actionName: 'string',
      actionType: 'string',
      connector: '?FlowConnector',
      faultConnector: '?FlowConnector',
      inputParameters: ['FlowActionCallInputParameter'],
      outputParameters: ['FlowActionCallOutputParameter'],
    },
    extends: 'FlowNode',
  },
  FlowNode: {
    type: 'FlowNode',
    props: {
      label: '?string',
      locationX: 'number',
      locationY: 'number',
    },
    extends: 'FlowElement',
  },
  FlowElement: {
    type: 'FlowElement',
    props: {
      description: '?string',
      name: '?string',
    },
    extends: 'FlowBaseElement',
  },
  FlowBaseElement: {
    type: 'FlowBaseElement',
    props: {
      processMetadataValues: ['FlowMetadataValue'],
    },
  },
  FlowMetadataValue: {
    type: 'FlowMetadataValue',
    props: {
      name: 'string',
      value: '?FlowElementReferenceOrValue',
    },
  },
  FlowElementReferenceOrValue: {
    type: 'FlowElementReferenceOrValue',
    props: {
      booleanValue: '?boolean',
      dateTimeValue: '?string',
      dateValue: '?string',
      elementReference: '?string',
      numberValue: '?number',
      stringValue: '?string',
    },
  },
  FlowActionCallInputParameter: {
    type: 'FlowActionCallInputParameter',
    props: {
      name: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowActionCallOutputParameter: {
    type: 'FlowActionCallOutputParameter',
    props: {
      assignToReference: 'string',
      name: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowApexPluginCallInputParameter: {
    type: 'FlowApexPluginCallInputParameter',
    props: {
      name: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowApexPluginCallOutputParameter: {
    type: 'FlowApexPluginCallOutputParameter',
    props: {
      assignToReference: 'string',
      name: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowAssignmentItem: {
    type: 'FlowAssignmentItem',
    props: {
      assignToReference: 'string',
      operator: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowChoiceUserInput: {
    type: 'FlowChoiceUserInput',
    props: {
      isRequired: '?boolean',
      promptText: '?string',
      validationRule: '?FlowInputValidationRule',
    },
    extends: 'FlowBaseElement',
  },
  FlowInputValidationRule: {
    type: 'FlowInputValidationRule',
    props: {
      errorMessage: 'string',
      formulaExpression: 'string',
    },
  },
  FlowCondition: {
    type: 'FlowCondition',
    props: {
      leftValueReference: 'string',
      operator: 'string',
      rightValue: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowConnector: {
    type: 'FlowConnector',
    props: {
      targetReference: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowInputFieldAssignment: {
    type: 'FlowInputFieldAssignment',
    props: {
      field: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowOutputFieldAssignment: {
    type: 'FlowOutputFieldAssignment',
    props: {
      assignToReference: 'string',
      field: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowRecordFilter: {
    type: 'FlowRecordFilter',
    props: {
      field: 'string',
      operator: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowScreenFieldInputParameter: {
    type: 'FlowScreenFieldInputParameter',
    props: {
      name: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowScreenFieldOutputParameter: {
    type: 'FlowScreenFieldOutputParameter',
    props: {
      assignToReference: 'string',
      name: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowScreenRule: {
    type: 'FlowScreenRule',
    props: {
      conditionLogic: '?string',
      conditions: ['FlowCondition'],
      label: 'string',
      ruleActions: ['FlowScreenRuleAction'],
    },
    extends: 'FlowBaseElement',
  },
  FlowScreenRuleAction: {
    type: 'FlowScreenRuleAction',
    props: {
      attribute: 'string',
      fieldReference: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowSubflowInputAssignment: {
    type: 'FlowSubflowInputAssignment',
    props: {
      name: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowSubflowOutputAssignment: {
    type: 'FlowSubflowOutputAssignment',
    props: {
      assignToReference: 'string',
      name: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowVisibilityRule: {
    type: 'FlowVisibilityRule',
    props: {
      conditionLogic: '?string',
      conditions: ['FlowCondition'],
    },
    extends: 'FlowBaseElement',
  },
  FlowWaitEventInputParameter: {
    type: 'FlowWaitEventInputParameter',
    props: {
      name: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowBaseElement',
  },
  FlowWaitEventOutputParameter: {
    type: 'FlowWaitEventOutputParameter',
    props: {
      assignToReference: 'string',
      name: 'string',
    },
    extends: 'FlowBaseElement',
  },
  FlowChoice: {
    type: 'FlowChoice',
    props: {
      choiceText: 'string',
      dataType: 'string',
      userInput: '?FlowChoiceUserInput',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowElement',
  },
  FlowConstant: {
    type: 'FlowConstant',
    props: {
      dataType: 'string',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowElement',
  },
  FlowDynamicChoiceSet: {
    type: 'FlowDynamicChoiceSet',
    props: {
      dataType: 'string',
      displayField: 'string',
      filters: ['FlowRecordFilter'],
      limit: '?number',
      object: 'string',
      outputAssignments: ['FlowOutputFieldAssignment'],
      picklistField: '?string',
      picklistObject: '?string',
      sortField: '?string',
      sortOrder: '?string',
      valueField: '?string',
    },
    extends: 'FlowElement',
  },
  FlowFormula: {
    type: 'FlowFormula',
    props: {
      dataType: '?string',
      expression: 'string',
      scale: '?number',
    },
    extends: 'FlowElement',
  },
  FlowRule: {
    type: 'FlowRule',
    props: {
      conditionLogic: 'string',
      conditions: ['FlowCondition'],
      connector: '?FlowConnector',
      label: 'string',
    },
    extends: 'FlowElement',
  },
  FlowScreenField: {
    type: 'FlowScreenField',
    props: {
      choiceReferences: ['string'],
      dataType: '?string',
      defaultSelectedChoiceReference: '?string',
      defaultValue: '?FlowElementReferenceOrValue',
      extensionName: '?string',
      fieldText: '?string',
      fieldType: 'string',
      helpText: '?string',
      inputParameters: ['FlowScreenFieldInputParameter'],
      isRequired: '?boolean',
      isVisible: '?boolean',
      outputParameters: ['FlowScreenFieldOutputParameter'],
      scale: '?number',
      storeOutputAutomatically: '?boolean',
      validationRule: '?FlowInputValidationRule',
      visibilityRule: '?FlowVisibilityRule',
    },
    extends: 'FlowElement',
  },
  FlowStage: {
    type: 'FlowStage',
    props: {
      isActive: 'boolean',
      label: 'string',
      stageOrder: 'number',
    },
    extends: 'FlowElement',
  },
  FlowTextTemplate: {
    type: 'FlowTextTemplate',
    props: {
      text: 'string',
    },
    extends: 'FlowElement',
  },
  FlowVariable: {
    type: 'FlowVariable',
    props: {
      apexClass: '?string',
      dataType: 'string',
      isCollection: '?boolean',
      isInput: '?boolean',
      isOutput: '?boolean',
      objectType: '?string',
      scale: '?number',
      value: '?FlowElementReferenceOrValue',
    },
    extends: 'FlowElement',
  },
  FlowWaitEvent: {
    type: 'FlowWaitEvent',
    props: {
      conditionLogic: '?string',
      conditions: ['FlowCondition'],
      connector: 'FlowConnector',
      eventType: 'string',
      inputParameters: ['FlowWaitEventInputParameter'],
      label: 'string',
      outputParameters: ['FlowWaitEventOutputParameter'],
    },
    extends: 'FlowElement',
  },
  FlowApexPluginCall: {
    type: 'FlowApexPluginCall',
    props: {
      apexClass: 'string',
      connector: '?FlowConnector',
      faultConnector: '?FlowConnector',
      inputParameters: ['FlowApexPluginCallInputParameter'],
      outputParameters: ['FlowApexPluginCallOutputParameter'],
    },
    extends: 'FlowNode',
  },
  FlowAssignment: {
    type: 'FlowAssignment',
    props: {
      assignmentItems: ['FlowAssignmentItem'],
      connector: '?FlowConnector',
    },
    extends: 'FlowNode',
  },
  FlowDecision: {
    type: 'FlowDecision',
    props: {
      defaultConnector: '?FlowConnector',
      defaultConnectorLabel: '?string',
      rules: ['FlowRule'],
    },
    extends: 'FlowNode',
  },
  FlowLoop: {
    type: 'FlowLoop',
    props: {
      assignNextValueToReference: 'string',
      collectionReference: 'string',
      iterationOrder: '?string',
      nextValueConnector: '?FlowConnector',
      noMoreValuesConnector: '?FlowConnector',
    },
    extends: 'FlowNode',
  },
  FlowRecordCreate: {
    type: 'FlowRecordCreate',
    props: {
      assignRecordIdToReference: '?string',
      connector: '?FlowConnector',
      faultConnector: '?FlowConnector',
      inputAssignments: ['FlowInputFieldAssignment'],
      inputReference: '?string',
      object: '?string',
    },
    extends: 'FlowNode',
  },
  FlowRecordDelete: {
    type: 'FlowRecordDelete',
    props: {
      connector: '?FlowConnector',
      faultConnector: '?FlowConnector',
      filters: ['FlowRecordFilter'],
      inputReference: '?string',
      object: '?string',
    },
    extends: 'FlowNode',
  },
  FlowRecordLookup: {
    type: 'FlowRecordLookup',
    props: {
      assignNullValuesIfNoRecordsFound: '?boolean',
      connector: '?FlowConnector',
      faultConnector: '?FlowConnector',
      filters: ['FlowRecordFilter'],
      getFirstRecordOnly: '?boolean',
      object: 'string',
      outputAssignments: ['FlowOutputFieldAssignment'],
      outputReference: '?string',
      queriedFields: ['string'],
      sortField: '?string',
      sortOrder: '?string',
      storeOutputAutomatically: '?boolean',
    },
    extends: 'FlowNode',
  },
  FlowRecordUpdate: {
    type: 'FlowRecordUpdate',
    props: {
      connector: '?FlowConnector',
      faultConnector: '?FlowConnector',
      filters: ['FlowRecordFilter'],
      inputAssignments: ['FlowInputFieldAssignment'],
      inputReference: '?string',
      object: '?string',
    },
    extends: 'FlowNode',
  },
  FlowScreen: {
    type: 'FlowScreen',
    props: {
      allowBack: '?boolean',
      allowFinish: '?boolean',
      allowPause: '?boolean',
      connector: '?FlowConnector',
      fields: ['FlowScreenField'],
      helpText: '?string',
      pausedText: '?string',
      rules: ['FlowScreenRule'],
      showFooter: '?boolean',
      showHeader: '?boolean',
    },
    extends: 'FlowNode',
  },
  FlowStart: {
    type: 'FlowStart',
    props: {
      connector: '?FlowConnector',
      filters: ['FlowRecordFilter'],
      object: '?string',
      schedule: '?FlowSchedule',
      triggerType: '?string',
    },
    extends: 'FlowNode',
  },
  FlowSchedule: {
    type: 'FlowSchedule',
    props: {
      frequency: '?string',
      startDate: '?string',
      startTime: '?string',
    },
  },
  FlowStep: {
    type: 'FlowStep',
    props: {
      connectors: ['FlowConnector'],
    },
    extends: 'FlowNode',
  },
  FlowSubflow: {
    type: 'FlowSubflow',
    props: {
      connector: '?FlowConnector',
      flowName: 'string',
      inputAssignments: ['FlowSubflowInputAssignment'],
      outputAssignments: ['FlowSubflowOutputAssignment'],
    },
    extends: 'FlowNode',
  },
  FlowWait: {
    type: 'FlowWait',
    props: {
      defaultConnector: '?FlowConnector',
      defaultConnectorLabel: 'string',
      faultConnector: '?FlowConnector',
      waitEvents: ['FlowWaitEvent'],
    },
    extends: 'FlowNode',
  },
  FlowCategory: {
    type: 'FlowCategory',
    props: {
      description: '?string',
      flowCategoryItems: ['FlowCategoryItems'],
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  FlowCategoryItems: {
    type: 'FlowCategoryItems',
    props: {
      flow: 'string',
    },
  },
  FlowDefinition: {
    type: 'FlowDefinition',
    props: {
      activeVersionNumber: '?number',
      description: '?string',
      masterLabel: '?string',
    },
    extends: 'Metadata',
  },
  FlowSettings: {
    type: 'FlowSettings',
    props: {
      enableFlowBREncodedFixEnabled: '?boolean',
      enableFlowDeployAsActiveEnabled: '?boolean',
      enableFlowFieldFilterEnabled: '?boolean',
      enableFlowFormulasFixEnabled: '?boolean',
      enableFlowInterviewSharingEnabled: '?boolean',
      enableFlowNullPreviousValueFix: '?boolean',
      enableFlowPauseEnabled: '?boolean',
      enableFlowUseApexExceptionEmail: '?boolean',
      enableInvocableFlowFixEnabled: '?boolean',
      enableLightningRuntimeEnabled: '?boolean',
      enableUseFlowBuilder: '?boolean',
      isAccessToInvokedApexRequired: '?boolean',
      isEnhancedFlowListViewVisible: '?boolean',
      isManageFlowRequiredForAutomationCharts: '?boolean',
    },
    extends: 'Metadata',
  },
  Folder: {
    type: 'Folder',
    props: {
      accessType: '?string',
      folderShares: ['FolderShare'],
      name: 'string',
      publicFolderAccess: '?string',
      sharedTo: '?SharedTo',
    },
    extends: 'Metadata',
  },
  FolderShare: {
    type: 'FolderShare',
    props: {
      accessLevel: 'string',
      sharedTo: 'string',
      sharedToType: 'string',
    },
  },
  DashboardFolder: {
    type: 'DashboardFolder',
    props: {},
    extends: 'Folder',
  },
  DocumentFolder: {
    type: 'DocumentFolder',
    props: {},
    extends: 'Folder',
  },
  EmailFolder: {
    type: 'EmailFolder',
    props: {},
    extends: 'Folder',
  },
  ReportFolder: {
    type: 'ReportFolder',
    props: {},
    extends: 'Folder',
  },
  ForecastingSettings: {
    type: 'ForecastingSettings',
    props: {
      defaultToPersonalCurrency: '?boolean',
      enableForecasts: '?boolean',
      forecastingCategoryMappings: ['ForecastingCategoryMapping'],
      forecastingDisplayedFamilySettings: [
        'ForecastingDisplayedFamilySettings',
      ],
      forecastingTypeSettings: ['ForecastingTypeSettings'],
    },
    extends: 'Metadata',
  },
  ForecastingCategoryMapping: {
    type: 'ForecastingCategoryMapping',
    props: {
      forecastingItemCategoryApiName: 'string',
      weightedSourceCategories: ['WeightedSourceCategory'],
    },
  },
  WeightedSourceCategory: {
    type: 'WeightedSourceCategory',
    props: {
      sourceCategoryApiName: 'string',
      weight: 'number',
    },
  },
  ForecastingDisplayedFamilySettings: {
    type: 'ForecastingDisplayedFamilySettings',
    props: {
      productFamily: '?string',
    },
  },
  ForecastingTypeSettings: {
    type: 'ForecastingTypeSettings',
    props: {
      active: 'boolean',
      adjustmentsSettings: 'AdjustmentsSettings',
      displayedCategoryApiNames: ['string'],
      forecastRangeSettings: 'ForecastRangeSettings',
      forecastedCategoryApiNames: ['string'],
      forecastingDateType: 'string',
      hasProductFamily: 'boolean',
      isAmount: 'boolean',
      isAvailable: 'boolean',
      isQuantity: 'boolean',
      managerAdjustableCategoryApiNames: ['string'],
      masterLabel: 'string',
      name: 'string',
      opportunityListFieldsLabelMappings: ['OpportunityListFieldsLabelMapping'],
      opportunityListFieldsSelectedSettings:
        'OpportunityListFieldsSelectedSettings',
      opportunityListFieldsUnselectedSettings:
        'OpportunityListFieldsUnselectedSettings',
      opportunitySplitName: '?string',
      ownerAdjustableCategoryApiNames: ['string'],
      quotasSettings: 'QuotasSettings',
      territory2ModelName: '?string',
    },
  },
  AdjustmentsSettings: {
    type: 'AdjustmentsSettings',
    props: {
      enableAdjustments: 'boolean',
      enableOwnerAdjustments: 'boolean',
    },
  },
  ForecastRangeSettings: {
    type: 'ForecastRangeSettings',
    props: {
      beginning: 'number',
      displaying: 'number',
      periodType: 'string',
    },
  },
  OpportunityListFieldsLabelMapping: {
    type: 'OpportunityListFieldsLabelMapping',
    props: {
      field: 'string',
      label: 'string',
    },
  },
  OpportunityListFieldsSelectedSettings: {
    type: 'OpportunityListFieldsSelectedSettings',
    props: {
      field: ['string'],
    },
  },
  OpportunityListFieldsUnselectedSettings: {
    type: 'OpportunityListFieldsUnselectedSettings',
    props: {
      field: ['string'],
    },
  },
  QuotasSettings: {
    type: 'QuotasSettings',
    props: {
      showQuotas: 'boolean',
    },
  },
  Form: {
    type: 'Form',
    props: {
      description: '?string',
      formSections: ['FormSection'],
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  FormSection: {
    type: 'FormSection',
    props: {
      formColumns: ['FormColumn'],
      masterLabel: 'string',
      tabOrderType: 'string',
    },
    extends: 'Metadata',
  },
  FormColumn: {
    type: 'FormColumn',
    props: {
      formItems: ['FormItem'],
    },
  },
  FormItem: {
    type: 'FormItem',
    props: {
      emptySpace: '?boolean',
      expression: '?string',
      formLayoutableItem: '?string',
      helpText: '?string',
    },
  },
  FormulaSettings: {
    type: 'FormulaSettings',
    props: {
      enableDSTAwareDatevalue: '?boolean',
    },
    extends: 'Metadata',
  },
  GlobalValueSet: {
    type: 'GlobalValueSet',
    props: {
      customValue: ['CustomValue'],
      description: '?string',
      masterLabel: 'string',
      sorted: 'boolean',
    },
    extends: 'Metadata',
  },
  GlobalValueSetTranslation: {
    type: 'GlobalValueSetTranslation',
    props: {
      valueTranslation: ['ValueTranslation'],
    },
    extends: 'Metadata',
  },
  ValueTranslation: {
    type: 'ValueTranslation',
    props: {
      masterLabel: 'string',
      translation: '?string',
    },
  },
  GoogleAppsSettings: {
    type: 'GoogleAppsSettings',
    props: {
      enableGmailButtons: '?boolean',
      enableGmailButtonsAndLinks: '?boolean',
      enableGmailLinks: '?boolean',
      enableGoogleDocs: '?boolean',
      enableGoogleDocsTab: '?boolean',
      enableGoogleTalk: '?boolean',
      googleAppsDomain: '?string',
      googleAppsDomainLinked: '?boolean',
      googleAppsDomainValidated: '?boolean',
    },
    extends: 'Metadata',
  },
  Group: {
    type: 'Group',
    props: {
      doesIncludeBosses: '?boolean',
      name: 'string',
    },
    extends: 'Metadata',
  },
  HighVelocitySalesSettings: {
    type: 'HighVelocitySalesSettings',
    props: {
      enableDispositionCategory: '?boolean',
      enableEngagementWaveAnalyticsPref: '?boolean',
      enableHighVelocitySales: '?boolean',
      enableHighVelocitySalesSetup: '?boolean',
    },
    extends: 'Metadata',
  },
  HomePageComponent: {
    type: 'HomePageComponent',
    props: {
      body: '?string',
      height: '?number',
      links: ['string'],
      page: '?string',
      pageComponentType: 'string',
      showLabel: '?boolean',
      showScrollbars: '?boolean',
      width: '?string',
    },
    extends: 'Metadata',
  },
  HomePageLayout: {
    type: 'HomePageLayout',
    props: {
      narrowComponents: ['string'],
      wideComponents: ['string'],
    },
    extends: 'Metadata',
  },
  IdeasSettings: {
    type: 'IdeasSettings',
    props: {
      enableChatterProfile: '?boolean',
      enableHtmlIdea: '?boolean',
      enableIdeaMultipleCategory: '?boolean',
      enableIdeaThemes: '?boolean',
      enableIdeas: '?boolean',
      enableIdeasControllerExtensions: '?boolean',
      enableIdeasReputation: '?boolean',
      halfLife: '?number',
      ideasProfilePage: '?string',
    },
    extends: 'Metadata',
  },
  IndustriesManufacturingSettings: {
    type: 'IndustriesManufacturingSettings',
    props: {
      enableIndManufacturing: '?boolean',
      enableIndustriesMfgAccountForecast: '?boolean',
    },
    extends: 'Metadata',
  },
  IndustriesSettings: {
    type: 'IndustriesSettings',
    props: {
      allowMultipleProducersToWorkOnSamePolicy: '?boolean',
      enableAccessToMasterListOfCoverageTypes: '?boolean',
      enableBlockResourceAvailabilityOrgPref: '?boolean',
      enableEventManagementOrgPref: '?boolean',
      enableHCReferralScoring: '?boolean',
      enableManyToManyRelationships: '?boolean',
      enableMortgageRlaTotalsOrgPref: '?boolean',
      enableMultiResourceOrgPref: '?boolean',
      enableObjectDetection: '?boolean',
      enableOverbookingOrgPref: '?boolean',
      enableProviderSearchSyncOrgPref: '?boolean',
      enableReferralScoring: '?boolean',
      enableSentimentAnalysis: '?boolean',
    },
    extends: 'Metadata',
  },
  InstalledPackage: {
    type: 'InstalledPackage',
    props: {
      activateRSS: 'boolean',
      password: '?string',
      versionNumber: 'string',
    },
    extends: 'Metadata',
  },
  IntegrationHubSettings: {
    type: 'IntegrationHubSettings',
    props: {
      canonicalName: '?string',
      canonicalNameBindingChar: '?string',
      description: '?string',
      isEnabled: '?boolean',
      isProtected: '?boolean',
      masterLabel: 'string',
      setupData: '?string',
      setupDefinition: '?string',
      setupNamespace: '?string',
      setupSimpleName: 'string',
      uUID: '?string',
      version: '?string',
      versionBuild: '?number',
      versionMajor: '?number',
      versionMinor: '?number',
      versionSetUuid: '?string',
    },
    extends: 'Metadata',
  },
  IntegrationHubSettingsType: {
    type: 'IntegrationHubSettingsType',
    props: {
      canonicalName: '?string',
      canonicalNameBindingChar: '?string',
      description: '?string',
      isEnabled: '?boolean',
      isProtected: '?boolean',
      masterLabel: 'string',
      setupNamespace: '?string',
      setupSimpleName: 'string',
      uUID: '?string',
      version: '?string',
      versionBuild: '?number',
      versionMajor: '?number',
      versionMinor: '?number',
      versionSetUuid: '?string',
    },
    extends: 'Metadata',
  },
  InvocableActionSettings: {
    type: 'InvocableActionSettings',
    props: {
      isPartialSaveAllowed: '?boolean',
    },
    extends: 'Metadata',
  },
  IoTSettings: {
    type: 'IoTSettings',
    props: {
      enableIoT: '?boolean',
      enableIoTInsightsPilot: '?boolean',
      enableIoTUsageEmail: '?boolean',
    },
    extends: 'Metadata',
  },
  IsvHammerSettings: {
    type: 'IsvHammerSettings',
    props: {
      enableIsvHammerSubIsOptedOut: '?boolean',
    },
    extends: 'Metadata',
  },
  KeywordList: {
    type: 'KeywordList',
    props: {
      description: '?string',
      keywords: ['Keyword'],
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  Keyword: {
    type: 'Keyword',
    props: {
      keyword: 'string',
    },
  },
  KnowledgeSettings: {
    type: 'KnowledgeSettings',
    props: {
      answers: '?KnowledgeAnswerSettings',
      cases: '?KnowledgeCaseSettings',
      defaultLanguage: '?string',
      enableChatterQuestionKBDeflection: '?boolean',
      enableCreateEditOnArticlesTab: '?boolean',
      enableExternalMediaContent: '?boolean',
      enableKnowledge: '?boolean',
      enableKnowledgeArticleTextHighlights: '?boolean',
      enableKnowledgeKeywordAutoComplete: '?boolean',
      enableKnowledgeTitleAutoComplete: '?boolean',
      enableLightningKbAutoLoadRichTextField: '?boolean',
      enableLightningKnowledge: '?boolean',
      languages: '?KnowledgeLanguageSettings',
      showArticleSummariesCustomerPortal: '?boolean',
      showArticleSummariesInternalApp: '?boolean',
      showArticleSummariesPartnerPortal: '?boolean',
      showValidationStatusField: '?boolean',
      suggestedArticles: '?KnowledgeSuggestedArticlesSettings',
    },
    extends: 'Metadata',
  },
  KnowledgeAnswerSettings: {
    type: 'KnowledgeAnswerSettings',
    props: {
      assignTo: '?string',
      defaultArticleType: '?string',
      enableArticleCreation: '?boolean',
    },
  },
  KnowledgeCaseSettings: {
    type: 'KnowledgeCaseSettings',
    props: {
      articlePDFCreationProfile: '?string',
      articlePublicSharingCommunities: '?KnowledgeCommunitiesSettings',
      articlePublicSharingSites: '?KnowledgeSitesSettings',
      articlePublicSharingSitesChatterAnswers: '?KnowledgeSitesSettings',
      assignTo: '?string',
      customizationClass: '?string',
      defaultContributionArticleType: '?string',
      editor: '?string',
      enableArticleCreation: '?boolean',
      enableArticlePublicSharingSites: '?boolean',
      enableCaseDataCategoryMapping: '?boolean',
      useProfileForPDFCreation: '?boolean',
    },
  },
  KnowledgeCommunitiesSettings: {
    type: 'KnowledgeCommunitiesSettings',
    props: {
      community: ['string'],
    },
  },
  KnowledgeSitesSettings: {
    type: 'KnowledgeSitesSettings',
    props: {
      site: ['string'],
    },
  },
  KnowledgeLanguageSettings: {
    type: 'KnowledgeLanguageSettings',
    props: {
      language: ['KnowledgeLanguage'],
    },
  },
  KnowledgeLanguage: {
    type: 'KnowledgeLanguage',
    props: {
      active: '?boolean',
      defaultAssignee: '?string',
      defaultAssigneeType: '?string',
      defaultReviewer: '?string',
      defaultReviewerType: '?string',
      name: 'string',
    },
  },
  KnowledgeSuggestedArticlesSettings: {
    type: 'KnowledgeSuggestedArticlesSettings',
    props: {
      caseFields: '?KnowledgeCaseFieldsSettings',
      useSuggestedArticlesForCase: '?boolean',
      workOrderFields: '?KnowledgeWorkOrderFieldsSettings',
      workOrderLineItemFields: '?KnowledgeWorkOrderLineItemFieldsSettings',
    },
  },
  KnowledgeCaseFieldsSettings: {
    type: 'KnowledgeCaseFieldsSettings',
    props: {
      field: ['KnowledgeCaseField'],
    },
  },
  KnowledgeCaseField: {
    type: 'KnowledgeCaseField',
    props: {
      name: '?string',
    },
  },
  KnowledgeWorkOrderFieldsSettings: {
    type: 'KnowledgeWorkOrderFieldsSettings',
    props: {
      field: ['KnowledgeWorkOrderField'],
    },
  },
  KnowledgeWorkOrderField: {
    type: 'KnowledgeWorkOrderField',
    props: {
      name: '?string',
    },
  },
  KnowledgeWorkOrderLineItemFieldsSettings: {
    type: 'KnowledgeWorkOrderLineItemFieldsSettings',
    props: {
      field: ['KnowledgeWorkOrderLineItemField'],
    },
  },
  KnowledgeWorkOrderLineItemField: {
    type: 'KnowledgeWorkOrderLineItemField',
    props: {
      name: '?string',
    },
  },
  LanguageSettings: {
    type: 'LanguageSettings',
    props: {
      enableCanadaIcuFormat: '?boolean',
      enableEndUserLanguages: '?boolean',
      enableICULocaleDateFormat: '?boolean',
      enablePlatformLanguages: '?boolean',
      enableTranslationWorkbench: '?boolean',
      useLanguageFallback: '?boolean',
    },
    extends: 'Metadata',
  },
  Layout: {
    type: 'Layout',
    props: {
      customButtons: ['string'],
      customConsoleComponents: '?CustomConsoleComponents',
      emailDefault: '?boolean',
      excludeButtons: ['string'],
      feedLayout: '?FeedLayout',
      headers: ['string'],
      layoutSections: ['LayoutSection'],
      miniLayout: '?MiniLayout',
      multilineLayoutFields: ['string'],
      platformActionList: '?PlatformActionList',
      quickActionList: '?QuickActionList',
      relatedContent: '?RelatedContent',
      relatedLists: ['RelatedListItem'],
      relatedObjects: ['string'],
      runAssignmentRulesDefault: '?boolean',
      showEmailCheckbox: '?boolean',
      showHighlightsPanel: '?boolean',
      showInteractionLogPanel: '?boolean',
      showKnowledgeComponent: '?boolean',
      showRunAssignmentRulesCheckbox: '?boolean',
      showSolutionSection: '?boolean',
      showSubmitAndAttachButton: '?boolean',
      summaryLayout: '?SummaryLayout',
    },
    extends: 'Metadata',
  },
  CustomConsoleComponents: {
    type: 'CustomConsoleComponents',
    props: {
      primaryTabComponents: '?PrimaryTabComponents',
      subtabComponents: '?SubtabComponents',
    },
  },
  PrimaryTabComponents: {
    type: 'PrimaryTabComponents',
    props: {
      containers: ['Container'],
    },
  },
  Container: {
    type: 'Container',
    props: {
      height: '?number',
      isContainerAutoSizeEnabled: 'boolean',
      region: 'string',
      sidebarComponents: ['SidebarComponent'],
      style: 'string',
      unit: 'string',
      width: '?number',
    },
  },
  SidebarComponent: {
    type: 'SidebarComponent',
    props: {
      componentType: 'string',
      createAction: '?string',
      enableLinking: '?boolean',
      height: '?number',
      label: '?string',
      lookup: '?string',
      page: '?string',
      relatedLists: ['RelatedList'],
      unit: '?string',
      updateAction: '?string',
      width: '?number',
    },
  },
  RelatedList: {
    type: 'RelatedList',
    props: {
      hideOnDetail: 'boolean',
      name: 'string',
    },
  },
  SubtabComponents: {
    type: 'SubtabComponents',
    props: {
      containers: ['Container'],
    },
  },
  FeedLayout: {
    type: 'FeedLayout',
    props: {
      autocollapsePublisher: '?boolean',
      compactFeed: '?boolean',
      feedFilterPosition: '?string',
      feedFilters: ['FeedLayoutFilter'],
      fullWidthFeed: '?boolean',
      hideSidebar: '?boolean',
      highlightExternalFeedItems: '?boolean',
      leftComponents: ['FeedLayoutComponent'],
      rightComponents: ['FeedLayoutComponent'],
      useInlineFiltersInConsole: '?boolean',
    },
  },
  FeedLayoutFilter: {
    type: 'FeedLayoutFilter',
    props: {
      feedFilterName: '?string',
      feedFilterType: 'string',
      feedItemType: '?string',
    },
  },
  FeedLayoutComponent: {
    type: 'FeedLayoutComponent',
    props: {
      componentType: 'string',
      height: '?number',
      page: '?string',
    },
  },
  LayoutSection: {
    type: 'LayoutSection',
    props: {
      customLabel: '?boolean',
      detailHeading: '?boolean',
      editHeading: '?boolean',
      label: '?string',
      layoutColumns: ['LayoutColumn'],
      style: 'string',
    },
  },
  LayoutColumn: {
    type: 'LayoutColumn',
    props: {
      layoutItems: ['LayoutItem'],
      reserved: '?string',
    },
  },
  LayoutItem: {
    type: 'LayoutItem',
    props: {
      analyticsCloudComponent: '?AnalyticsCloudComponentLayoutItem',
      behavior: '?string',
      canvas: '?string',
      component: '?string',
      customLink: '?string',
      emptySpace: '?boolean',
      field: '?string',
      height: '?number',
      page: '?string',
      reportChartComponent: '?ReportChartComponentLayoutItem',
      scontrol: '?string',
      showLabel: '?boolean',
      showScrollbars: '?boolean',
      width: '?string',
    },
  },
  AnalyticsCloudComponentLayoutItem: {
    type: 'AnalyticsCloudComponentLayoutItem',
    props: {
      assetType: 'string',
      devName: 'string',
      error: '?string',
      filter: '?string',
      height: '?number',
      hideOnError: '?boolean',
      showHeader: '?boolean',
      showSharing: '?boolean',
      showTitle: '?boolean',
      width: '?string',
    },
  },
  ReportChartComponentLayoutItem: {
    type: 'ReportChartComponentLayoutItem',
    props: {
      cacheData: '?boolean',
      contextFilterableField: '?string',
      error: '?string',
      hideOnError: '?boolean',
      includeContext: '?boolean',
      reportName: 'string',
      showTitle: '?boolean',
      size: '?string',
    },
  },
  MiniLayout: {
    type: 'MiniLayout',
    props: {
      fields: ['string'],
      relatedLists: ['RelatedListItem'],
    },
  },
  RelatedListItem: {
    type: 'RelatedListItem',
    props: {
      customButtons: ['string'],
      excludeButtons: ['string'],
      fields: ['string'],
      relatedList: 'string',
      sortField: '?string',
      sortOrder: '?string',
    },
  },
  RelatedContent: {
    type: 'RelatedContent',
    props: {
      relatedContentItems: ['RelatedContentItem'],
    },
  },
  RelatedContentItem: {
    type: 'RelatedContentItem',
    props: {
      layoutItem: 'LayoutItem',
    },
  },
  SummaryLayout: {
    type: 'SummaryLayout',
    props: {
      masterLabel: 'string',
      sizeX: 'number',
      sizeY: '?number',
      sizeZ: '?number',
      summaryLayoutItems: ['SummaryLayoutItem'],
      summaryLayoutStyle: 'string',
    },
  },
  SummaryLayoutItem: {
    type: 'SummaryLayoutItem',
    props: {
      customLink: '?string',
      field: '?string',
      posX: 'number',
      posY: '?number',
      posZ: '?number',
    },
  },
  LeadConfigSettings: {
    type: 'LeadConfigSettings',
    props: {
      doesEnableLeadConvertDefaultSubjectBlankTaskCreation: '?boolean',
      doesHideOpportunityInConvertLeadWindow: '?boolean',
      doesPreserveLeadStatus: '?boolean',
      doesSelectNoOpportunityOnConvertLead: '?boolean',
      doesTrackHistory: '?boolean',
      enableConversionsOnMobile: '?boolean',
      enableOrgWideMergeAndDelete: '?boolean',
      shouldLeadConvertRequireValidation: '?boolean',
    },
    extends: 'Metadata',
  },
  LeadConvertSettings: {
    type: 'LeadConvertSettings',
    props: {
      allowOwnerChange: '?boolean',
      objectMapping: ['ObjectMapping'],
      opportunityCreationOptions: '?string',
    },
    extends: 'Metadata',
  },
  Letterhead: {
    type: 'Letterhead',
    props: {
      available: 'boolean',
      backgroundColor: 'string',
      bodyColor: 'string',
      bottomLine: 'LetterheadLine',
      description: '?string',
      footer: 'LetterheadHeaderFooter',
      header: 'LetterheadHeaderFooter',
      middleLine: 'LetterheadLine',
      name: 'string',
      topLine: 'LetterheadLine',
    },
    extends: 'Metadata',
  },
  LetterheadLine: {
    type: 'LetterheadLine',
    props: {
      color: 'string',
      height: 'number',
    },
  },
  LetterheadHeaderFooter: {
    type: 'LetterheadHeaderFooter',
    props: {
      backgroundColor: 'string',
      height: 'number',
      horizontalAlignment: '?string',
      logo: '?string',
      verticalAlignment: '?string',
    },
  },
  LicenseDefinition: {
    type: 'LicenseDefinition',
    props: {
      aggregationGroup: 'string',
      description: '?string',
      isPublished: 'boolean',
      label: 'string',
      licensedCustomPermissions: ['LicensedCustomPermissions'],
      licensingAuthority: 'string',
      licensingAuthorityProvider: 'string',
      minPlatformVersion: 'number',
      origin: 'string',
      revision: 'number',
      trialLicenseDuration: 'number',
      trialLicenseQuantity: 'number',
    },
    extends: 'Metadata',
  },
  LicensedCustomPermissions: {
    type: 'LicensedCustomPermissions',
    props: {
      customPermission: 'string',
      licenseDefinition: 'string',
    },
  },
  LightningBolt: {
    type: 'LightningBolt',
    props: {
      category: 'string',
      lightningBoltFeatures: ['LightningBoltFeatures'],
      lightningBoltImages: ['LightningBoltImages'],
      lightningBoltItems: ['LightningBoltItems'],
      masterLabel: 'string',
      publisher: 'string',
      summary: 'string',
    },
    extends: 'Metadata',
  },
  LightningBoltFeatures: {
    type: 'LightningBoltFeatures',
    props: {
      description: '?string',
      order: 'number',
      title: 'string',
    },
  },
  LightningBoltImages: {
    type: 'LightningBoltImages',
    props: {
      image: 'string',
      order: 'number',
    },
  },
  LightningBoltItems: {
    type: 'LightningBoltItems',
    props: {
      name: 'string',
      type: 'string',
    },
  },
  LightningComponentBundle: {
    type: 'LightningComponentBundle',
    props: {
      apiVersion: '?number',
      description: '?string',
      isExplicitImport: '?boolean',
      isExposed: '?boolean',
      lwcResources: '?LwcResources',
      masterLabel: '?string',
      runtimeNamespace: '?string',
      targetConfigs: '?string',
      targets: '?Targets',
    },
    extends: 'Metadata',
  },
  LwcResources: {
    type: 'LwcResources',
    props: {
      lwcResource: ['LwcResource'],
    },
  },
  LwcResource: {
    type: 'LwcResource',
    props: {
      filePath: 'string',
      source: 'string',
    },
  },
  Targets: {
    type: 'Targets',
    props: {
      target: ['string'],
    },
  },
  LightningExperienceSettings: {
    type: 'LightningExperienceSettings',
    props: {
      enableAccessCheckCrucPref: '?boolean',
      enableApiUserLtngOutAccessPref: '?boolean',
      enableAuraCDNPref: '?boolean',
      enableFeedbackInMobile: '?boolean',
      enableIE11DeprecationMsgHidden: '?boolean',
      enableIE11LEXCrucPref: '?boolean',
      enableInAppTooltips: '?boolean',
      enableLEXOnIpadEnabled: '?boolean',
      enableLexEndUsersNoSwitching: '?boolean',
      enableNavPersonalizationOptOut: '?boolean',
      enableRemoveThemeBrandBanner: '?boolean',
      enableS1BannerPref: '?boolean',
      enableS1BrowserEnabled: '?boolean',
      enableS1DesktopEnabled: '?boolean',
      enableS1UiLoggingEnabled: '?boolean',
      enableTryLightningOptOut: '?boolean',
      enableUseS1AlohaDesktop: '?boolean',
      enableUsersAreLightningOnly: '?boolean',
    },
    extends: 'Metadata',
  },
  LightningExperienceTheme: {
    type: 'LightningExperienceTheme',
    props: {
      defaultBrandingSet: 'string',
      description: '?string',
      masterLabel: 'string',
      shouldOverrideLoadingImage: '?boolean',
    },
    extends: 'Metadata',
  },
  LightningMessageChannel: {
    type: 'LightningMessageChannel',
    props: {
      description: '?string',
      isExposed: '?boolean',
      lightningMessageFields: ['LightningMessageField'],
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  LightningMessageField: {
    type: 'LightningMessageField',
    props: {
      description: '?string',
      fieldName: 'string',
    },
  },
  LightningOnboardingConfig: {
    type: 'LightningOnboardingConfig',
    props: {
      collaborationGroup: '?string',
      customQuestion: 'string',
      feedbackFormDaysFrequency: 'number',
      isCustom: 'boolean',
      masterLabel: 'string',
      sendFeedbackToSalesforce: 'boolean',
    },
    extends: 'Metadata',
  },
  LiveAgentSettings: {
    type: 'LiveAgentSettings',
    props: {
      enableLiveAgent: '?boolean',
      enableQuickTextEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  LiveChatAgentConfig: {
    type: 'LiveChatAgentConfig',
    props: {
      assignments: '?AgentConfigAssignments',
      autoGreeting: '?string',
      capacity: '?number',
      criticalWaitTime: '?number',
      customAgentName: '?string',
      enableAgentFileTransfer: '?boolean',
      enableAgentSneakPeek: '?boolean',
      enableAssistanceFlag: '?boolean',
      enableAutoAwayOnDecline: '?boolean',
      enableAutoAwayOnPushTimeout: '?boolean',
      enableChatConferencing: '?boolean',
      enableChatMonitoring: '?boolean',
      enableChatTransferToAgent: '?boolean',
      enableChatTransferToButton: '?boolean',
      enableChatTransferToSkill: '?boolean',
      enableLogoutSound: '?boolean',
      enableNotifications: '?boolean',
      enableRequestSound: '?boolean',
      enableSneakPeek: '?boolean',
      enableVisitorBlocking: '?boolean',
      enableWhisperMessage: '?boolean',
      label: 'string',
      supervisorDefaultAgentStatusFilter: '?string',
      supervisorDefaultButtonFilter: '?string',
      supervisorDefaultSkillFilter: '?string',
      supervisorSkills: '?SupervisorAgentConfigSkills',
      transferableButtons: '?AgentConfigButtons',
      transferableSkills: '?AgentConfigSkills',
    },
    extends: 'Metadata',
  },
  AgentConfigAssignments: {
    type: 'AgentConfigAssignments',
    props: {
      profiles: '?AgentConfigProfileAssignments',
      users: '?AgentConfigUserAssignments',
    },
  },
  AgentConfigProfileAssignments: {
    type: 'AgentConfigProfileAssignments',
    props: {
      profile: ['string'],
    },
  },
  AgentConfigUserAssignments: {
    type: 'AgentConfigUserAssignments',
    props: {
      user: ['string'],
    },
  },
  SupervisorAgentConfigSkills: {
    type: 'SupervisorAgentConfigSkills',
    props: {
      skill: ['string'],
    },
  },
  AgentConfigButtons: {
    type: 'AgentConfigButtons',
    props: {
      button: ['string'],
    },
  },
  AgentConfigSkills: {
    type: 'AgentConfigSkills',
    props: {
      skill: ['string'],
    },
  },
  LiveChatButton: {
    type: 'LiveChatButton',
    props: {
      animation: '?string',
      autoGreeting: '?string',
      chasitorIdleTimeout: '?number',
      chasitorIdleTimeoutWarning: '?number',
      chatPage: '?string',
      customAgentName: '?string',
      deployments: '?LiveChatButtonDeployments',
      enableQueue: '?boolean',
      inviteEndPosition: '?string',
      inviteImage: '?string',
      inviteStartPosition: '?string',
      isActive: '?boolean',
      label: 'string',
      numberOfReroutingAttempts: '?number',
      offlineImage: '?string',
      onlineImage: '?string',
      optionsCustomRoutingIsEnabled: '?boolean',
      optionsHasChasitorIdleTimeout: 'boolean',
      optionsHasInviteAfterAccept: '?boolean',
      optionsHasInviteAfterReject: '?boolean',
      optionsHasRerouteDeclinedRequest: '?boolean',
      optionsIsAutoAccept: '?boolean',
      optionsIsInviteAutoRemove: '?boolean',
      overallQueueLength: '?number',
      perAgentQueueLength: '?number',
      postChatPage: '?string',
      postChatUrl: '?string',
      preChatFormPage: '?string',
      preChatFormUrl: '?string',
      pushTimeOut: '?number',
      routingType: 'string',
      site: '?string',
      skills: '?LiveChatButtonSkills',
      timeToRemoveInvite: '?number',
      type: 'string',
      windowLanguage: '?string',
    },
    extends: 'Metadata',
  },
  LiveChatButtonDeployments: {
    type: 'LiveChatButtonDeployments',
    props: {
      deployment: ['string'],
    },
  },
  LiveChatButtonSkills: {
    type: 'LiveChatButtonSkills',
    props: {
      skill: ['string'],
    },
  },
  LiveChatDeployment: {
    type: 'LiveChatDeployment',
    props: {
      brandingImage: '?string',
      connectionTimeoutDuration: '?number',
      connectionWarningDuration: '?number',
      displayQueuePosition: '?boolean',
      domainWhiteList: '?LiveChatDeploymentDomainWhitelist',
      enablePrechatApi: '?boolean',
      enableTranscriptSave: '?boolean',
      label: 'string',
      mobileBrandingImage: '?string',
      site: '?string',
      windowTitle: 'string',
    },
    extends: 'Metadata',
  },
  LiveChatDeploymentDomainWhitelist: {
    type: 'LiveChatDeploymentDomainWhitelist',
    props: {
      domain: ['string'],
    },
  },
  LiveChatSensitiveDataRule: {
    type: 'LiveChatSensitiveDataRule',
    props: {
      actionType: 'string',
      description: '?string',
      enforceOn: 'number',
      isEnabled: 'boolean',
      pattern: 'string',
      priority: 'number',
      replacement: '?string',
    },
    extends: 'Metadata',
  },
  LiveMessageSettings: {
    type: 'LiveMessageSettings',
    props: {
      enableLiveMessage: '?boolean',
    },
    extends: 'Metadata',
  },
  MacroSettings: {
    type: 'MacroSettings',
    props: {
      enableAdvancedSearch: '?boolean',
      macrosInFolders: '?boolean',
    },
    extends: 'Metadata',
  },
  ManagedContentType: {
    type: 'ManagedContentType',
    props: {
      description: '?string',
      developerName: 'string',
      managedContentNodeTypes: ['ManagedContentNodeType'],
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  ManagedContentNodeType: {
    type: 'ManagedContentNodeType',
    props: {
      helpText: '?string',
      isLocalizable: '?boolean',
      isRequired: '?boolean',
      nodeLabel: 'string',
      nodeName: 'string',
      nodeType: 'string',
      placeholderText: '?string',
    },
  },
  ManagedTopic: {
    type: 'ManagedTopic',
    props: {
      managedTopicType: 'string',
      name: 'string',
      parentName: 'string',
      position: 'number',
      topicDescription: 'string',
    },
    extends: 'Metadata',
  },
  ManagedTopics: {
    type: 'ManagedTopics',
    props: {
      managedTopic: ['ManagedTopic'],
    },
    extends: 'Metadata',
  },
  SourceTrackingSettings: {
    type: 'SourceTrackingSettings',
    props: {
      enableSourceTrackingSandboxes: '?boolean',
    },
    extends: 'Metadata',
  },
  MapsAndLocationSettings: {
    type: 'MapsAndLocationSettings',
    props: {
      enableAddressAutoComplete: '?boolean',
      enableMapsAndLocation: '?boolean',
    },
    extends: 'Metadata',
  },
  MatchingRule: {
    type: 'MatchingRule',
    props: {
      booleanFilter: '?string',
      description: '?string',
      label: 'string',
      matchingRuleItems: ['MatchingRuleItem'],
      ruleStatus: 'string',
    },
    extends: 'Metadata',
  },
  MatchingRuleItem: {
    type: 'MatchingRuleItem',
    props: {
      blankValueBehavior: '?string',
      fieldName: 'string',
      matchingMethod: 'string',
    },
  },
  MatchingRules: {
    type: 'MatchingRules',
    props: {
      matchingRules: ['MatchingRule'],
    },
    extends: 'Metadata',
  },
  MetadataWithContent: {
    type: 'MetadataWithContent',
    props: {
      content: '?string',
    },
    extends: 'Metadata',
  },
  AccessControlPolicy: {
    type: 'AccessControlPolicy',
    props: {
      active: 'boolean',
      deploymentStatus: 'string',
      description: '?string',
      masterLabel: 'string',
      targetEntity: 'string',
      version: 'number',
    },
    extends: 'MetadataWithContent',
  },
  ApexClass: {
    type: 'ApexClass',
    props: {
      apiVersion: 'number',
      packageVersions: ['PackageVersion'],
      status: 'string',
    },
    extends: 'MetadataWithContent',
  },
  ApexComponent: {
    type: 'ApexComponent',
    props: {
      apiVersion: '?number',
      description: '?string',
      label: 'string',
      packageVersions: ['PackageVersion'],
    },
    extends: 'MetadataWithContent',
  },
  ApexPage: {
    type: 'ApexPage',
    props: {
      apiVersion: 'number',
      availableInTouch: '?boolean',
      confirmationTokenRequired: '?boolean',
      description: '?string',
      label: 'string',
      packageVersions: ['PackageVersion'],
    },
    extends: 'MetadataWithContent',
  },
  ApexTrigger: {
    type: 'ApexTrigger',
    props: {
      apiVersion: 'number',
      packageVersions: ['PackageVersion'],
      status: 'string',
    },
    extends: 'MetadataWithContent',
  },
  Certificate: {
    type: 'Certificate',
    props: {
      caSigned: 'boolean',
      encryptedWithPlatformEncryption: '?boolean',
      expirationDate: '?string',
      keySize: '?number',
      masterLabel: 'string',
      privateKeyExportable: '?boolean',
    },
    extends: 'MetadataWithContent',
  },
  ContentAsset: {
    type: 'ContentAsset',
    props: {
      format: '?string',
      isVisibleByExternalUsers: '?boolean',
      language: 'string',
      masterLabel: 'string',
      originNetwork: '?string',
      relationships: '?ContentAssetRelationships',
      versions: 'ContentAssetVersions',
    },
    extends: 'MetadataWithContent',
  },
  ContentAssetRelationships: {
    type: 'ContentAssetRelationships',
    props: {
      insightsApplication: ['ContentAssetLink'],
      network: ['ContentAssetLink'],
      organization: '?ContentAssetLink',
      workspace: ['ContentAssetLink'],
    },
  },
  ContentAssetLink: {
    type: 'ContentAssetLink',
    props: {
      access: 'string',
      isManagingWorkspace: '?boolean',
      name: '?string',
    },
  },
  ContentAssetVersions: {
    type: 'ContentAssetVersions',
    props: {
      version: ['ContentAssetVersion'],
    },
  },
  ContentAssetVersion: {
    type: 'ContentAssetVersion',
    props: {
      number: 'string',
      pathOnClient: 'string',
      zipEntry: '?string',
    },
  },
  Document: {
    type: 'Document',
    props: {
      description: '?string',
      internalUseOnly: 'boolean',
      keywords: '?string',
      name: '?string',
      public: 'boolean',
    },
    extends: 'MetadataWithContent',
  },
  EclairGeoData: {
    type: 'EclairGeoData',
    props: {
      maps: ['EclairMap'],
      masterLabel: 'string',
    },
    extends: 'MetadataWithContent',
  },
  EclairMap: {
    type: 'EclairMap',
    props: {
      boundingBoxBottom: '?number',
      boundingBoxLeft: '?number',
      boundingBoxRight: '?number',
      boundingBoxTop: '?number',
      mapLabel: '?string',
      mapName: 'string',
      projection: 'string',
    },
  },
  EmailTemplate: {
    type: 'EmailTemplate',
    props: {
      apiVersion: '?number',
      attachedDocuments: ['string'],
      attachments: ['Attachment'],
      available: 'boolean',
      description: '?string',
      encodingKey: 'string',
      letterhead: '?string',
      name: 'string',
      packageVersions: ['PackageVersion'],
      relatedEntityType: '?string',
      style: 'string',
      subject: '?string',
      textOnly: '?string',
      type: 'string',
      uiType: '?string',
    },
    extends: 'MetadataWithContent',
  },
  Attachment: {
    type: 'Attachment',
    props: {
      content: 'string',
      name: 'string',
    },
  },
  NetworkBranding: {
    type: 'NetworkBranding',
    props: {
      loginBackgroundImageUrl: '?string',
      loginFooterText: '?string',
      loginLogo: '?string',
      loginLogoName: '?string',
      loginPrimaryColor: '?string',
      loginQuaternaryColor: '?string',
      loginRightFrameUrl: '?string',
      network: '?string',
      pageFooter: '?string',
      pageHeader: '?string',
      primaryColor: 'string',
      primaryComplementColor: 'string',
      quaternaryColor: 'string',
      quaternaryComplementColor: 'string',
      secondaryColor: 'string',
      staticLogoImageUrl: '?string',
      tertiaryColor: 'string',
      tertiaryComplementColor: 'string',
      zeronaryColor: 'string',
      zeronaryComplementColor: 'string',
    },
    extends: 'MetadataWithContent',
  },
  Orchestration: {
    type: 'Orchestration',
    props: {
      context: 'string',
      masterLabel: 'string',
    },
    extends: 'MetadataWithContent',
  },
  Scontrol: {
    type: 'Scontrol',
    props: {
      contentSource: 'string',
      description: '?string',
      encodingKey: 'string',
      fileContent: '?string',
      fileName: '?string',
      name: 'string',
      supportsCaching: 'boolean',
    },
    extends: 'MetadataWithContent',
  },
  SiteDotCom: {
    type: 'SiteDotCom',
    props: {
      label: 'string',
      siteType: 'string',
    },
    extends: 'MetadataWithContent',
  },
  StaticResource: {
    type: 'StaticResource',
    props: {
      cacheControl: 'string',
      contentType: 'string',
      description: '?string',
    },
    extends: 'MetadataWithContent',
  },
  UiPlugin: {
    type: 'UiPlugin',
    props: {
      description: '?string',
      extensionPointIdentifier: 'string',
      isEnabled: 'boolean',
      language: 'string',
      masterLabel: 'string',
    },
    extends: 'MetadataWithContent',
  },
  WaveDashboard: {
    type: 'WaveDashboard',
    props: {
      application: 'string',
      description: '?string',
      masterLabel: 'string',
      templateAssetSourceName: '?string',
    },
    extends: 'MetadataWithContent',
  },
  WaveDataflow: {
    type: 'WaveDataflow',
    props: {
      dataflowType: '?string',
      description: '?string',
      masterLabel: 'string',
    },
    extends: 'MetadataWithContent',
  },
  WaveLens: {
    type: 'WaveLens',
    props: {
      application: 'string',
      datasets: ['string'],
      description: '?string',
      masterLabel: 'string',
      templateAssetSourceName: '?string',
      visualizationType: 'string',
    },
    extends: 'MetadataWithContent',
  },
  WaveRecipe: {
    type: 'WaveRecipe',
    props: {
      dataflow: 'string',
      masterLabel: 'string',
      securityPredicate: '?string',
      targetDatasetAlias: 'string',
    },
    extends: 'MetadataWithContent',
  },
  MilestoneType: {
    type: 'MilestoneType',
    props: {
      description: '?string',
      recurrenceType: '?string',
    },
    extends: 'Metadata',
  },
  MlDomain: {
    type: 'MlDomain',
    props: {
      description: '?string',
      label: 'string',
      mlIntents: ['MlIntent'],
      mlSlotClasses: ['MlSlotClass'],
    },
    extends: 'Metadata',
  },
  MobileApplicationDetail: {
    type: 'MobileApplicationDetail',
    props: {
      applicationBinaryFile: '?string',
      applicationBinaryFileName: '?string',
      applicationBundleIdentifier: '?string',
      applicationFileLength: '?number',
      applicationIconFile: '?string',
      applicationIconFileName: '?string',
      applicationInstallUrl: '?string',
      devicePlatform: 'string',
      deviceType: '?string',
      minimumOsVersion: '?string',
      privateApp: '?boolean',
      version: 'string',
    },
    extends: 'Metadata',
  },
  MobileSettings: {
    type: 'MobileSettings',
    props: {
      dashboardMobile: '?DashboardMobileSettings',
      enableImportContactFromDevice: '?boolean',
      enableLightningOnMobile: '?boolean',
      enableOfflineDraftsEnabled: '?boolean',
      enablePopulateNameManuallyInToday: '?boolean',
      enableS1EncryptedStoragePref2: '?boolean',
      enableS1OfflinePref: '?boolean',
    },
    extends: 'Metadata',
  },
  DashboardMobileSettings: {
    type: 'DashboardMobileSettings',
    props: {
      enableDashboardIPadApp: '?boolean',
    },
  },
  ModerationRule: {
    type: 'ModerationRule',
    props: {
      action: 'string',
      actionLimit: '?number',
      active: 'boolean',
      description: '?string',
      entitiesAndFields: ['ModeratedEntityField'],
      masterLabel: 'string',
      notifyLimit: '?number',
      timePeriod: '?string',
      type: '?string',
      userCriteria: ['string'],
      userMessage: '?string',
    },
    extends: 'Metadata',
  },
  ModeratedEntityField: {
    type: 'ModeratedEntityField',
    props: {
      entityName: 'string',
      fieldName: '?string',
      keywordList: '?string',
    },
  },
  MyDomainSettings: {
    type: 'MyDomainSettings',
    props: {
      canOnlyLoginWithMyDomainUrl: '?boolean',
      doesApiLoginRequireOrgDomain: '?boolean',
      enableNativeBrowserForAuthOnAndroid: '?boolean',
      enableNativeBrowserForAuthOnIos: '?boolean',
      useStabilizedMyDomainHostnames: '?boolean',
      useStabilizedSandboxMyDomainHostnames: '?boolean',
    },
    extends: 'Metadata',
  },
  NameSettings: {
    type: 'NameSettings',
    props: {
      enableMiddleName: '?boolean',
      enableNameSuffix: '?boolean',
    },
    extends: 'Metadata',
  },
  NamedCredential: {
    type: 'NamedCredential',
    props: {
      allowMergeFieldsInBody: '?boolean',
      allowMergeFieldsInHeader: '?boolean',
      authProvider: '?string',
      authTokenEndpointUrl: '?string',
      awsAccessKey: '?string',
      awsAccessSecret: '?string',
      awsRegion: '?string',
      awsService: '?string',
      certificate: '?string',
      endpoint: '?string',
      generateAuthorizationHeader: '?boolean',
      jwtAudience: '?string',
      jwtFormulaSubject: '?string',
      jwtIssuer: '?string',
      jwtSigningCertificate: '?string',
      jwtTextSubject: '?string',
      jwtValidityPeriodSeconds: '?number',
      label: 'string',
      oauthRefreshToken: '?string',
      oauthScope: '?string',
      oauthToken: '?string',
      password: '?string',
      principalType: 'string',
      privateConnection: '?string',
      protocol: 'string',
      username: '?string',
    },
    extends: 'Metadata',
  },
  NavigationMenu: {
    type: 'NavigationMenu',
    props: {
      container: 'string',
      containerType: 'string',
      label: 'string',
      navigationMenuItem: ['NavigationMenuItem'],
    },
    extends: 'Metadata',
  },
  Network: {
    type: 'Network',
    props: {
      allowInternalUserLogin: '?boolean',
      allowMembersToFlag: '?boolean',
      allowedExtensions: '?string',
      caseCommentEmailTemplate: '?string',
      changePasswordTemplate: 'string',
      communityRoles: '?CommunityRoles',
      description: '?string',
      disableReputationRecordConversations: '?boolean',
      emailFooterLogo: '?string',
      emailFooterText: '?string',
      emailSenderAddress: 'string',
      emailSenderName: 'string',
      enableCustomVFErrorPageOverrides: '?boolean',
      enableDirectMessages: '?boolean',
      enableGuestChatter: '?boolean',
      enableGuestFileAccess: '?boolean',
      enableGuestMemberVisibility: '?boolean',
      enableInvitation: '?boolean',
      enableKnowledgeable: '?boolean',
      enableMemberVisibility: '?boolean',
      enableNicknameDisplay: '?boolean',
      enablePrivateMessages: '?boolean',
      enableReputation: '?boolean',
      enableShowAllNetworkSettings: '?boolean',
      enableSiteAsContainer: '?boolean',
      enableTalkingAboutStats: '?boolean',
      enableTopicAssignmentRules: '?boolean',
      enableTopicSuggestions: '?boolean',
      enableUpDownVote: '?boolean',
      feedChannel: '?string',
      forgotPasswordTemplate: 'string',
      gatherCustomerSentimentData: '?boolean',
      lockoutTemplate: '?string',
      logoutUrl: '?string',
      maxFileSizeKb: '?number',
      navigationLinkSet: '?NavigationLinkSet',
      networkMemberGroups: '?NetworkMemberGroup',
      networkPageOverrides: '?NetworkPageOverride',
      newSenderAddress: '?string',
      picassoSite: '?string',
      recommendationAudience: '?RecommendationAudience',
      recommendationDefinition: '?RecommendationDefinition',
      reputationLevels: '?ReputationLevelDefinitions',
      reputationPointsRules: '?ReputationPointsRules',
      selfRegProfile: '?string',
      selfRegistration: '?boolean',
      sendWelcomeEmail: '?boolean',
      site: 'string',
      status: 'string',
      tabs: 'NetworkTabSet',
      urlPathPrefix: '?string',
      verificationTemplate: '?string',
      welcomeTemplate: 'string',
    },
    extends: 'Metadata',
  },
  CommunityRoles: {
    type: 'CommunityRoles',
    props: {
      customerUserRole: '?string',
      employeeUserRole: '?string',
      partnerUserRole: '?string',
    },
  },
  NetworkMemberGroup: {
    type: 'NetworkMemberGroup',
    props: {
      permissionSet: ['string'],
      profile: ['string'],
    },
  },
  NetworkPageOverride: {
    type: 'NetworkPageOverride',
    props: {
      changePasswordPageOverrideSetting: '?string',
      forgotPasswordPageOverrideSetting: '?string',
      homePageOverrideSetting: '?string',
      loginPageOverrideSetting: '?string',
      selfRegProfilePageOverrideSetting: '?string',
    },
  },
  RecommendationAudience: {
    type: 'RecommendationAudience',
    props: {
      recommendationAudienceDetails: ['RecommendationAudienceDetail'],
    },
  },
  RecommendationAudienceDetail: {
    type: 'RecommendationAudienceDetail',
    props: {
      audienceCriteriaType: '?string',
      audienceCriteriaValue: '?string',
      setupName: '?string',
    },
  },
  RecommendationDefinition: {
    type: 'RecommendationDefinition',
    props: {
      recommendationDefinitionDetails: ['RecommendationDefinitionDetail'],
    },
  },
  RecommendationDefinitionDetail: {
    type: 'RecommendationDefinitionDetail',
    props: {
      actionUrl: '?string',
      description: '?string',
      linkText: '?string',
      scheduledRecommendations: '?ScheduledRecommendation',
      setupName: '?string',
      title: '?string',
    },
  },
  ScheduledRecommendation: {
    type: 'ScheduledRecommendation',
    props: {
      scheduledRecommendationDetails: ['ScheduledRecommendationDetail'],
    },
  },
  ScheduledRecommendationDetail: {
    type: 'ScheduledRecommendationDetail',
    props: {
      channel: '?string',
      enabled: '?boolean',
      rank: '?number',
      recommendationAudience: '?string',
    },
  },
  ReputationLevelDefinitions: {
    type: 'ReputationLevelDefinitions',
    props: {
      level: ['ReputationLevel'],
    },
  },
  ReputationLevel: {
    type: 'ReputationLevel',
    props: {
      branding: '?ReputationBranding',
      label: '?string',
      lowerThreshold: 'number',
    },
  },
  ReputationBranding: {
    type: 'ReputationBranding',
    props: {
      smallImage: '?string',
    },
  },
  ReputationPointsRules: {
    type: 'ReputationPointsRules',
    props: {
      pointsRule: ['ReputationPointsRule'],
    },
  },
  ReputationPointsRule: {
    type: 'ReputationPointsRule',
    props: {
      eventType: 'string',
      points: 'number',
    },
  },
  NetworkTabSet: {
    type: 'NetworkTabSet',
    props: {
      customTab: ['string'],
      defaultTab: 'string',
      standardTab: ['string'],
    },
  },
  NotificationsSettings: {
    type: 'NotificationsSettings',
    props: {
      enableMobileAppPushNotifications: '?boolean',
      enableNotifications: '?boolean',
    },
    extends: 'Metadata',
  },
  OauthCustomScope: {
    type: 'OauthCustomScope',
    props: {
      description: 'string',
      developerName: 'string',
      isProtected: '?boolean',
      isPublic: '?boolean',
      masterLabel: 'string',
    },
    extends: 'Metadata',
  },
  ObjectLinkingSettings: {
    type: 'ObjectLinkingSettings',
    props: {
      enableObjectLinking: '?boolean',
    },
    extends: 'Metadata',
  },
  OmniChannelSettings: {
    type: 'OmniChannelSettings',
    props: {
      enableOmniAutoLoginPrompt: '?boolean',
      enableOmniChannel: '?boolean',
      enableOmniSecondaryRoutingPriority: '?boolean',
      enableOmniSkillsRouting: '?boolean',
    },
    extends: 'Metadata',
  },
  OpportunitySettings: {
    type: 'OpportunitySettings',
    props: {
      autoActivateNewReminders: '?boolean',
      customizableProductSchedulesEnabled: '?boolean',
      doesAutoAddSplitOwnerAsOpportunityTeamMember: '?boolean',
      doesEnforceStandardOpportunitySaveLogic: '?boolean',
      enableFindSimilarOpportunities: '?boolean',
      enableOpportunityFieldHistoryTracking: '?boolean',
      enableOpportunityInsightsInMobile: '?boolean',
      enableOpportunityTeam: '?boolean',
      enableUpdateReminders: '?boolean',
      findSimilarOppFilter: '?FindSimilarOppFilter',
      promptToAddProducts: '?boolean',
    },
    extends: 'Metadata',
  },
  FindSimilarOppFilter: {
    type: 'FindSimilarOppFilter',
    props: {
      similarOpportunitiesDisplayColumns: ['string'],
      similarOpportunitiesMatchFields: ['string'],
    },
  },
  OrchestrationContext: {
    type: 'OrchestrationContext',
    props: {
      datasets: ['OrchestrationContextDataset'],
      description: '?string',
      events: ['OrchestrationContextEvent'],
      imageFile: 'string',
      imageScale: 'number',
      masterLabel: 'string',
      runtimeType: 'string',
      salesforceObject: '?string',
      salesforceObjectPrimaryKey: '?string',
    },
    extends: 'Metadata',
  },
  OrchestrationContextDataset: {
    type: 'OrchestrationContextDataset',
    props: {
      datasetType: 'string',
      orchestrationDataset: 'string',
    },
  },
  OrchestrationContextEvent: {
    type: 'OrchestrationContextEvent',
    props: {
      eventType: 'string',
      orchestrationEvent: 'string',
      platformEvent: 'string',
      platformEventPrimaryKey: 'string',
    },
  },
  OrderManagementSettings: {
    type: 'OrderManagementSettings',
    props: {
      enableOrderManagement: '?boolean',
    },
    extends: 'Metadata',
  },
  OrderSettings: {
    type: 'OrderSettings',
    props: {
      enableNegativeQuantity: '?boolean',
      enableOrders: '?boolean',
      enableReductionOrders: '?boolean',
      enableZeroQuantity: '?boolean',
    },
    extends: 'Metadata',
  },
  OrgPreferenceSettings: {
    type: 'OrgPreferenceSettings',
    props: {
      preferences: ['OrganizationSettingsDetail'],
    },
    extends: 'Metadata',
  },
  OrganizationSettingsDetail: {
    type: 'OrganizationSettingsDetail',
    props: {
      settingName: 'string',
      settingValue: 'boolean',
    },
  },
  OrgSettings: {
    type: 'OrgSettings',
    props: {
      enableCustomerSuccessPortal: '?boolean',
      enableExtendedMailMerge: '?boolean',
      enableIncludeContractStatus: '?boolean',
      enableMakeDeploymentsMandatory: '?boolean',
      enableManageSelfServiceUsers: '?boolean',
      enableOrgFeedSentimentAnalysis: '?boolean',
      enableRADeploymentAttributeOnly: '?boolean',
      enableResetDivisionOnLogin: '?boolean',
      saveMailMergeDocsAsSalesforceDocs: '?boolean',
    },
    extends: 'Metadata',
  },
  Package: {
    type: 'Package',
    props: {
      apiAccessLevel: '?string',
      description: '?string',
      namespacePrefix: '?string',
      objectPermissions: ['ProfileObjectPermissions'],
      packageType: '?string',
      postInstallClass: '?string',
      setupWeblink: '?string',
      types: ['PackageTypeMembers'],
      uninstallClass: '?string',
      version: 'string',
    },
    extends: 'Metadata',
  },
  ProfileObjectPermissions: {
    type: 'ProfileObjectPermissions',
    props: {
      allowCreate: '?boolean',
      allowDelete: '?boolean',
      allowEdit: '?boolean',
      allowRead: '?boolean',
      modifyAllRecords: '?boolean',
      object: 'string',
      viewAllRecords: '?boolean',
    },
  },
  PackageTypeMembers: {
    type: 'PackageTypeMembers',
    props: {
      members: ['string'],
      name: 'string',
    },
  },
  PardotEinsteinSettings: {
    type: 'PardotEinsteinSettings',
    props: {
      enableCampaignInsight: '?boolean',
      enableEngagementScore: '?boolean',
    },
    extends: 'Metadata',
  },
  PardotSettings: {
    type: 'PardotSettings',
    props: {
      enableB2bmaAppEnabled: '?boolean',
      enableEngagementHistoryDashboards: '?boolean',
      enablePardotAppV1Enabled: '?boolean',
      enablePardotEnabled: '?boolean',
      enableProspectActivityDataset: '?boolean',
    },
    extends: 'Metadata',
  },
  PartyDataModelSettings: {
    type: 'PartyDataModelSettings',
    props: {
      enableAutoSelectIndividualOnMerge: '?boolean',
      enableConsentManagement: '?boolean',
    },
    extends: 'Metadata',
  },
  PathAssistant: {
    type: 'PathAssistant',
    props: {
      active: 'boolean',
      entityName: 'string',
      fieldName: 'string',
      masterLabel: 'string',
      pathAssistantSteps: ['PathAssistantStep'],
      recordTypeName: 'string',
    },
    extends: 'Metadata',
  },
  PathAssistantStep: {
    type: 'PathAssistantStep',
    props: {
      fieldNames: ['string'],
      info: '?string',
      picklistValueName: 'string',
    },
  },
  PathAssistantSettings: {
    type: 'PathAssistantSettings',
    props: {
      canOverrideAutoPathCollapseWithUserPref: '?boolean',
      pathAssistantEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  PermissionSet: {
    type: 'PermissionSet',
    props: {
      applicationVisibilities: ['PermissionSetApplicationVisibility'],
      classAccesses: ['PermissionSetApexClassAccess'],
      customMetadataTypeAccesses: ['PermissionSetCustomMetadataTypeAccess'],
      customPermissions: ['PermissionSetCustomPermissions'],
      description: '?string',
      externalDataSourceAccesses: ['PermissionSetExternalDataSourceAccess'],
      fieldPermissions: ['PermissionSetFieldPermissions'],
      flowAccesses: ['PermissionSetFlowAccess'],
      hasActivationRequired: '?boolean',
      label: 'string',
      license: '?string',
      objectPermissions: ['PermissionSetObjectPermissions'],
      pageAccesses: ['PermissionSetApexPageAccess'],
      recordTypeVisibilities: ['PermissionSetRecordTypeVisibility'],
      tabSettings: ['PermissionSetTabSetting'],
      userPermissions: ['PermissionSetUserPermission'],
    },
    extends: 'Metadata',
  },
  PermissionSetApplicationVisibility: {
    type: 'PermissionSetApplicationVisibility',
    props: {
      application: 'string',
      visible: 'boolean',
    },
  },
  PermissionSetApexClassAccess: {
    type: 'PermissionSetApexClassAccess',
    props: {
      apexClass: 'string',
      enabled: 'boolean',
    },
  },
  PermissionSetCustomMetadataTypeAccess: {
    type: 'PermissionSetCustomMetadataTypeAccess',
    props: {
      enabled: 'boolean',
      name: 'string',
    },
  },
  PermissionSetCustomPermissions: {
    type: 'PermissionSetCustomPermissions',
    props: {
      enabled: 'boolean',
      name: 'string',
    },
  },
  PermissionSetExternalDataSourceAccess: {
    type: 'PermissionSetExternalDataSourceAccess',
    props: {
      enabled: 'boolean',
      externalDataSource: 'string',
    },
  },
  PermissionSetFieldPermissions: {
    type: 'PermissionSetFieldPermissions',
    props: {
      editable: 'boolean',
      field: 'string',
      readable: '?boolean',
    },
  },
  PermissionSetFlowAccess: {
    type: 'PermissionSetFlowAccess',
    props: {
      enabled: 'boolean',
      flow: 'string',
    },
  },
  PermissionSetObjectPermissions: {
    type: 'PermissionSetObjectPermissions',
    props: {
      allowCreate: 'boolean',
      allowDelete: 'boolean',
      allowEdit: 'boolean',
      allowRead: 'boolean',
      modifyAllRecords: 'boolean',
      object: 'string',
      viewAllRecords: 'boolean',
    },
  },
  PermissionSetApexPageAccess: {
    type: 'PermissionSetApexPageAccess',
    props: {
      apexPage: 'string',
      enabled: 'boolean',
    },
  },
  PermissionSetRecordTypeVisibility: {
    type: 'PermissionSetRecordTypeVisibility',
    props: {
      recordType: 'string',
      visible: 'boolean',
    },
  },
  PermissionSetTabSetting: {
    type: 'PermissionSetTabSetting',
    props: {
      tab: 'string',
      visibility: 'string',
    },
  },
  PermissionSetUserPermission: {
    type: 'PermissionSetUserPermission',
    props: {
      enabled: 'boolean',
      name: 'string',
    },
  },
  MutingPermissionSet: {
    type: 'MutingPermissionSet',
    props: {
      label: 'string',
    },
    extends: 'PermissionSet',
  },
  PermissionSetGroup: {
    type: 'PermissionSetGroup',
    props: {
      description: '?string',
      label: 'string',
      mutingPermissionSets: ['string'],
      permissionSets: ['string'],
      status: '?string',
    },
    extends: 'Metadata',
  },
  PersonListSettings: {
    type: 'PersonListSettings',
    props: {
      enablePersonList: 'boolean',
    },
    extends: 'Metadata',
  },
  PicklistSettings: {
    type: 'PicklistSettings',
    props: {
      isPicklistApiNameEditDisabled: '?boolean',
    },
    extends: 'Metadata',
  },
  PlatformCachePartition: {
    type: 'PlatformCachePartition',
    props: {
      description: '?string',
      isDefaultPartition: 'boolean',
      masterLabel: 'string',
      platformCachePartitionTypes: ['PlatformCachePartitionType'],
    },
    extends: 'Metadata',
  },
  PlatformCachePartitionType: {
    type: 'PlatformCachePartitionType',
    props: {
      allocatedCapacity: 'number',
      allocatedPurchasedCapacity: 'number',
      allocatedTrialCapacity: 'number',
      cacheType: 'string',
    },
  },
  PlatformEncryptionSettings: {
    type: 'PlatformEncryptionSettings',
    props: {
      canEncryptManagedPackageFields: '?boolean',
      enableDeterministicEncryption: '?boolean',
      enableEncryptFieldHistory: '?boolean',
      enableEventBusEncryption: '?boolean',
      isMEKForEncryptionRequired: '?boolean',
      isUseHighAssuranceKeysRequired: '?boolean',
    },
    extends: 'Metadata',
  },
  PlatformEventChannel: {
    type: 'PlatformEventChannel',
    props: {
      channelType: 'string',
      label: 'string',
    },
    extends: 'Metadata',
  },
  PlatformEventChannelMember: {
    type: 'PlatformEventChannelMember',
    props: {
      eventChannel: 'string',
      selectedEntity: 'string',
    },
    extends: 'Metadata',
  },
  Portal: {
    type: 'Portal',
    props: {
      active: 'boolean',
      admin: '?string',
      defaultLanguage: '?string',
      description: '?string',
      emailSenderAddress: 'string',
      emailSenderName: 'string',
      enableSelfCloseCase: '?boolean',
      footerDocument: '?string',
      forgotPassTemplate: '?string',
      headerDocument: '?string',
      isSelfRegistrationActivated: '?boolean',
      loginHeaderDocument: '?string',
      logoDocument: '?string',
      logoutUrl: '?string',
      newCommentTemplate: '?string',
      newPassTemplate: '?string',
      newUserTemplate: '?string',
      ownerNotifyTemplate: '?string',
      selfRegNewUserUrl: '?string',
      selfRegUserDefaultProfile: '?string',
      selfRegUserDefaultRole: '?string',
      selfRegUserTemplate: '?string',
      showActionConfirmation: '?boolean',
      stylesheetDocument: '?string',
      type: 'string',
    },
    extends: 'Metadata',
  },
  PostTemplate: {
    type: 'PostTemplate',
    props: {
      default: '?boolean',
      description: '?string',
      fields: ['string'],
      label: 'string',
    },
    extends: 'Metadata',
  },
  PresenceDeclineReason: {
    type: 'PresenceDeclineReason',
    props: {
      label: 'string',
    },
    extends: 'Metadata',
  },
  PresenceUserConfig: {
    type: 'PresenceUserConfig',
    props: {
      assignments: '?PresenceConfigAssignments',
      capacity: 'number',
      declineReasons: ['string'],
      enableAutoAccept: '?boolean',
      enableDecline: '?boolean',
      enableDeclineReason: '?boolean',
      enableDisconnectSound: '?boolean',
      enableRequestSound: '?boolean',
      label: 'string',
      presenceStatusOnDecline: '?string',
      presenceStatusOnPushTimeout: '?string',
    },
    extends: 'Metadata',
  },
  PresenceConfigAssignments: {
    type: 'PresenceConfigAssignments',
    props: {
      profiles: '?PresenceConfigProfileAssignments',
      users: '?PresenceConfigUserAssignments',
    },
  },
  PresenceConfigProfileAssignments: {
    type: 'PresenceConfigProfileAssignments',
    props: {
      profile: ['string'],
    },
  },
  PresenceConfigUserAssignments: {
    type: 'PresenceConfigUserAssignments',
    props: {
      user: ['string'],
    },
  },
  PrivacySettings: {
    type: 'PrivacySettings',
    props: {
      enableConsentAuditTrail: '?boolean',
      enableConsentEventStream: '?boolean',
      enableDefaultMetadataValues: '?boolean',
    },
    extends: 'Metadata',
  },
  PrivateConnection: {
    type: 'PrivateConnection',
    props: {
      description: '?string',
      direction: 'string',
      externalConnectionProperties: ['ExternalConnectionProperty'],
      label: 'string',
      status: 'string',
      type: 'string',
    },
    extends: 'Metadata',
  },
  ExternalConnectionProperty: {
    type: 'ExternalConnectionProperty',
    props: {
      propertyName: 'string',
      propertyValue: 'string',
    },
  },
  ProductSettings: {
    type: 'ProductSettings',
    props: {
      enableCascadeActivateToRelatedPrices: '?boolean',
      enableMySettings: '?boolean',
      enableQuantitySchedule: '?boolean',
      enableRevenueSchedule: '?boolean',
    },
    extends: 'Metadata',
  },
  Profile: {
    type: 'Profile',
    props: {
      applicationVisibilities: ['ProfileApplicationVisibility'],
      categoryGroupVisibilities: ['ProfileCategoryGroupVisibility'],
      classAccesses: ['ProfileApexClassAccess'],
      custom: '?boolean',
      customMetadataTypeAccesses: ['ProfileCustomMetadataTypeAccess'],
      customPermissions: ['ProfileCustomPermissions'],
      description: '?string',
      externalDataSourceAccesses: ['ProfileExternalDataSourceAccess'],
      fieldPermissions: ['ProfileFieldLevelSecurity'],
      flowAccesses: ['ProfileFlowAccess'],
      layoutAssignments: ['ProfileLayoutAssignment'],
      loginHours: '?ProfileLoginHours',
      loginIpRanges: ['ProfileLoginIpRange'],
      objectPermissions: ['ProfileObjectPermissions'],
      pageAccesses: ['ProfileApexPageAccess'],
      profileActionOverrides: ['ProfileActionOverride'],
      recordTypeVisibilities: ['ProfileRecordTypeVisibility'],
      tabVisibilities: ['ProfileTabVisibility'],
      userLicense: '?string',
      userPermissions: ['ProfileUserPermission'],
    },
    extends: 'Metadata',
  },
  ProfileApplicationVisibility: {
    type: 'ProfileApplicationVisibility',
    props: {
      application: 'string',
      default: 'boolean',
      visible: 'boolean',
    },
  },
  ProfileCategoryGroupVisibility: {
    type: 'ProfileCategoryGroupVisibility',
    props: {
      dataCategories: ['string'],
      dataCategoryGroup: 'string',
      visibility: 'string',
    },
  },
  ProfileApexClassAccess: {
    type: 'ProfileApexClassAccess',
    props: {
      apexClass: 'string',
      enabled: 'boolean',
    },
  },
  ProfileCustomMetadataTypeAccess: {
    type: 'ProfileCustomMetadataTypeAccess',
    props: {
      enabled: 'boolean',
      name: 'string',
    },
  },
  ProfileCustomPermissions: {
    type: 'ProfileCustomPermissions',
    props: {
      enabled: 'boolean',
      name: 'string',
    },
  },
  ProfileExternalDataSourceAccess: {
    type: 'ProfileExternalDataSourceAccess',
    props: {
      enabled: 'boolean',
      externalDataSource: 'string',
    },
  },
  ProfileFieldLevelSecurity: {
    type: 'ProfileFieldLevelSecurity',
    props: {
      editable: 'boolean',
      field: 'string',
      readable: '?boolean',
    },
  },
  ProfileFlowAccess: {
    type: 'ProfileFlowAccess',
    props: {
      enabled: 'boolean',
      flow: 'string',
    },
  },
  ProfileLayoutAssignment: {
    type: 'ProfileLayoutAssignment',
    props: {
      layout: 'string',
      recordType: '?string',
    },
  },
  ProfileLoginHours: {
    type: 'ProfileLoginHours',
    props: {
      fridayEnd: '?string',
      fridayStart: '?string',
      mondayEnd: '?string',
      mondayStart: '?string',
      saturdayEnd: '?string',
      saturdayStart: '?string',
      sundayEnd: '?string',
      sundayStart: '?string',
      thursdayEnd: '?string',
      thursdayStart: '?string',
      tuesdayEnd: '?string',
      tuesdayStart: '?string',
      wednesdayEnd: '?string',
      wednesdayStart: '?string',
    },
  },
  ProfileLoginIpRange: {
    type: 'ProfileLoginIpRange',
    props: {
      description: '?string',
      endAddress: 'string',
      startAddress: 'string',
    },
  },
  ProfileApexPageAccess: {
    type: 'ProfileApexPageAccess',
    props: {
      apexPage: 'string',
      enabled: 'boolean',
    },
  },
  ProfileRecordTypeVisibility: {
    type: 'ProfileRecordTypeVisibility',
    props: {
      default: 'boolean',
      personAccountDefault: '?boolean',
      recordType: 'string',
      visible: 'boolean',
    },
  },
  ProfileTabVisibility: {
    type: 'ProfileTabVisibility',
    props: {
      tab: 'string',
      visibility: 'string',
    },
  },
  ProfileUserPermission: {
    type: 'ProfileUserPermission',
    props: {
      enabled: 'boolean',
      name: 'string',
    },
  },
  ProfilePasswordPolicy: {
    type: 'ProfilePasswordPolicy',
    props: {
      forgotPasswordRedirect: '?boolean',
      lockoutInterval: 'number',
      maxLoginAttempts: 'number',
      minimumPasswordLength: 'number',
      minimumPasswordLifetime: '?boolean',
      obscure: '?boolean',
      passwordComplexity: 'number',
      passwordExpiration: 'number',
      passwordHistory: 'number',
      passwordQuestion: 'number',
      profile: 'string',
    },
    extends: 'Metadata',
  },
  ProfileSessionSetting: {
    type: 'ProfileSessionSetting',
    props: {
      externalCommunityUserIdentityVerif: 'boolean',
      forceLogout: 'boolean',
      profile: 'string',
      requiredSessionLevel: '?string',
      sessionPersistence: 'boolean',
      sessionTimeout: 'number',
      sessionTimeoutWarning: 'boolean',
    },
    extends: 'Metadata',
  },
  Prompt: {
    type: 'Prompt',
    props: {
      masterLabel: 'string',
      promptVersions: ['PromptVersion'],
    },
    extends: 'Metadata',
  },
  PromptVersion: {
    type: 'PromptVersion',
    props: {
      actionButtonLabel: '?string',
      actionButtonLink: '?string',
      body: 'string',
      customApplication: '?string',
      delayDays: 'number',
      description: '?string',
      dismissButtonLabel: '?string',
      displayPosition: '?string',
      displayType: 'string',
      endDate: '?string',
      header: '?string',
      indexWithIsPublished: '?string',
      indexWithoutIsPublished: '?string',
      isPublished: '?boolean',
      masterLabel: 'string',
      publishedByUser: '?string',
      publishedDate: '?string',
      shouldDisplayActionButton: 'boolean',
      startDate: 'string',
      targetAppDeveloperName: 'string',
      targetAppNamespacePrefix: '?string',
      targetPageKey1: 'string',
      targetPageKey2: '?string',
      targetPageType: 'string',
      timesToDisplay: 'number',
      title: 'string',
      uiFormulaRule: '?UiFormulaRule',
      userAccess: 'string',
      versionNumber: 'number',
    },
  },
  Queue: {
    type: 'Queue',
    props: {
      doesSendEmailToMembers: '?boolean',
      email: '?string',
      name: 'string',
      queueMembers: '?QueueMembers',
      queueRoutingConfig: '?string',
      queueSobject: ['QueueSobject'],
    },
    extends: 'Metadata',
  },
  QueueMembers: {
    type: 'QueueMembers',
    props: {
      publicGroups: '?PublicGroups',
      roleAndSubordinates: '?RoleAndSubordinates',
      roleAndSubordinatesInternal: '?RoleAndSubordinatesInternal',
      roles: '?Roles',
      users: '?Users',
    },
  },
  PublicGroups: {
    type: 'PublicGroups',
    props: {
      publicGroup: ['string'],
    },
  },
  RoleAndSubordinates: {
    type: 'RoleAndSubordinates',
    props: {
      roleAndSubordinate: ['string'],
    },
  },
  RoleAndSubordinatesInternal: {
    type: 'RoleAndSubordinatesInternal',
    props: {
      roleAndSubordinateInternal: ['string'],
    },
  },
  Roles: {
    type: 'Roles',
    props: {
      role: ['string'],
    },
  },
  Users: {
    type: 'Users',
    props: {
      user: ['string'],
    },
  },
  QueueSobject: {
    type: 'QueueSobject',
    props: {
      sobjectType: 'string',
    },
  },
  QueueRoutingConfig: {
    type: 'QueueRoutingConfig',
    props: {
      capacityPercentage: '?number',
      capacityWeight: '?number',
      dropAdditionalSkillsTimeout: '?number',
      isAttributeBased: '?boolean',
      label: 'string',
      pushTimeout: '?number',
      queueOverflowAssignee: '?string',
      routingModel: 'string',
      routingPriority: 'number',
      userOverflowAssignee: '?string',
    },
    extends: 'Metadata',
  },
  QuickAction: {
    type: 'QuickAction',
    props: {
      canvas: '?string',
      description: '?string',
      fieldOverrides: ['FieldOverride'],
      flowDefinition: '?string',
      height: '?number',
      icon: '?string',
      isProtected: '?boolean',
      label: '?string',
      lightningComponent: '?string',
      mobExtDisplayMode: '?string',
      optionsCreateFeedItem: 'boolean',
      page: '?string',
      quickActionLayout: '?QuickActionLayout',
      quickActionSendEmailOptions: '?QuickActionSendEmailOptions',
      standardLabel: '?string',
      successMessage: '?string',
      targetObject: '?string',
      targetParentField: '?string',
      targetRecordType: '?string',
      type: 'string',
      width: '?number',
    },
    extends: 'Metadata',
  },
  FieldOverride: {
    type: 'FieldOverride',
    props: {
      field: 'string',
      formula: '?string',
      literalValue: '?string',
    },
  },
  QuickActionLayout: {
    type: 'QuickActionLayout',
    props: {
      layoutSectionStyle: 'string',
      quickActionLayoutColumns: ['QuickActionLayoutColumn'],
    },
  },
  QuickActionLayoutColumn: {
    type: 'QuickActionLayoutColumn',
    props: {
      quickActionLayoutItems: ['QuickActionLayoutItem'],
    },
  },
  QuickActionLayoutItem: {
    type: 'QuickActionLayoutItem',
    props: {
      emptySpace: '?boolean',
      field: '?string',
      uiBehavior: '?string',
    },
  },
  QuickActionSendEmailOptions: {
    type: 'QuickActionSendEmailOptions',
    props: {
      defaultEmailTemplateName: '?string',
      ignoreDefaultEmailTemplateSubject: 'boolean',
    },
  },
  QuoteSettings: {
    type: 'QuoteSettings',
    props: {
      enableQuote: 'boolean',
      enableQuotesWithoutOppEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  RecommendationStrategy: {
    type: 'RecommendationStrategy',
    props: {
      actionContext: ['StrategyAction'],
      contextRecordType: '?string',
      description: '?string',
      filter: ['StrategyNodeFilter'],
      if: ['StrategyNodeIf'],
      invocableAction: ['StrategyNodeInvocableAction'],
      isTemplate: '?boolean',
      label: 'string',
      map: ['StrategyNodeMap'],
      mutuallyExclusive: ['StrategyNodeExclusive'],
      onBehalfOfExpression: '?string',
      recommendationLimit: ['StrategyNodeRecommendationLimit'],
      recommendationLoad: ['StrategyNodeRecommendationLoad'],
      sort: ['StrategyNodeSort'],
      union: ['StrategyNodeUnion'],
    },
    extends: 'Metadata',
  },
  StrategyAction: {
    type: 'StrategyAction',
    props: {
      action: 'string',
      argument: ['StrategyActionArg'],
      description: '?string',
      label: '?string',
      name: 'string',
      type: 'string',
    },
  },
  StrategyActionArg: {
    type: 'StrategyActionArg',
    props: {
      name: 'string',
      value: 'string',
    },
  },
  StrategyNodeFilter: {
    type: 'StrategyNodeFilter',
    props: {
      expression: 'string',
    },
    extends: 'StrategyNodeUnionBase',
  },
  StrategyNodeUnionBase: {
    type: 'StrategyNodeUnionBase',
    props: {
      limit: '?number',
    },
    extends: 'StrategyNodeBase',
  },
  StrategyNodeBase: {
    type: 'StrategyNodeBase',
    props: {
      childNode: ['string'],
      description: '?string',
      label: '?string',
      name: 'string',
    },
  },
  StrategyNodeExclusive: {
    type: 'StrategyNodeExclusive',
    props: {},
    extends: 'StrategyNodeUnionBase',
  },
  StrategyNodeIf: {
    type: 'StrategyNodeIf',
    props: {
      childNodeExpression: ['IfExpression'],
      onlyFirstMatch: '?boolean',
    },
    extends: 'StrategyNodeUnionBase',
  },
  IfExpression: {
    type: 'IfExpression',
    props: {
      childName: 'string',
      expression: 'string',
    },
  },
  StrategyNodeInvocableAction: {
    type: 'StrategyNodeInvocableAction',
    props: {
      action: 'string',
      argument: ['StrategyNodeInvocableActionArg'],
      isGenerator: 'boolean',
      type: 'string',
    },
    extends: 'StrategyNodeUnionBase',
  },
  StrategyNodeInvocableActionArg: {
    type: 'StrategyNodeInvocableActionArg',
    props: {
      name: 'string',
      value: 'string',
    },
  },
  StrategyNodeMap: {
    type: 'StrategyNodeMap',
    props: {
      mapExpression: ['MapExpression'],
    },
    extends: 'StrategyNodeUnionBase',
  },
  MapExpression: {
    type: 'MapExpression',
    props: {
      expression: 'string',
      name: 'string',
      type: 'string',
    },
  },
  StrategyNodeRecommendationLimit: {
    type: 'StrategyNodeRecommendationLimit',
    props: {
      filterMode: ['string'],
      lookbackDuration: '?number',
      maxRecommendationCount: '?number',
    },
    extends: 'StrategyNodeUnionBase',
  },
  StrategyNodeRecommendationLoad: {
    type: 'StrategyNodeRecommendationLoad',
    props: {
      condition: ['RecommendationLoadCondition'],
      conditionLogic: '?string',
    },
    extends: 'StrategyNodeUnionBase',
  },
  RecommendationLoadCondition: {
    type: 'RecommendationLoadCondition',
    props: {
      field: 'string',
      operator: 'string',
      value: 'RecommendationConditionValue',
    },
  },
  RecommendationConditionValue: {
    type: 'RecommendationConditionValue',
    props: {
      type: 'string',
      value: '?string',
    },
  },
  StrategyNodeSort: {
    type: 'StrategyNodeSort',
    props: {
      field: ['StrategyNodeSortField'],
    },
    extends: 'StrategyNodeUnionBase',
  },
  StrategyNodeSortField: {
    type: 'StrategyNodeSortField',
    props: {
      name: 'string',
      nullsFirst: '?boolean',
      order: '?string',
    },
  },
  StrategyNodeUnion: {
    type: 'StrategyNodeUnion',
    props: {},
    extends: 'StrategyNodeUnionBase',
  },
  RecordActionDeployment: {
    type: 'RecordActionDeployment',
    props: {
      channelConfigurations: ['RecordActionDeploymentChannel'],
      deploymentContexts: ['RecordActionDeploymentContext'],
      hasGuidedActions: '?boolean',
      hasRecommendations: '?boolean',
      masterLabel: 'string',
      recommendation: '?RecordActionRecommendation',
      selectableItems: ['RecordActionSelectableItem'],
    },
    extends: 'Metadata',
  },
  RecordActionDeploymentChannel: {
    type: 'RecordActionDeploymentChannel',
    props: {
      channel: 'string',
      channelItems: ['RecordActionDefaultItem'],
      isAutopopEnabled: '?boolean',
    },
  },
  RecordActionDefaultItem: {
    type: 'RecordActionDefaultItem',
    props: {
      action: 'string',
      isMandatory: '?boolean',
      isUiRemoveHidden: '?boolean',
      pinned: 'string',
      position: 'number',
      type: 'string',
    },
  },
  RecordActionDeploymentContext: {
    type: 'RecordActionDeploymentContext',
    props: {
      entityName: 'string',
      recommendationStrategy: '?string',
    },
  },
  RecordActionRecommendation: {
    type: 'RecordActionRecommendation',
    props: {
      defaultStrategy: '?string',
      hasDescription: 'boolean',
      hasImage: 'boolean',
      hasRejectAction: 'boolean',
      hasTitle: 'boolean',
      maxDisplayRecommendations: 'number',
    },
  },
  RecordActionSelectableItem: {
    type: 'RecordActionSelectableItem',
    props: {
      action: 'string',
      type: 'string',
    },
  },
  RecordPageSettings: {
    type: 'RecordPageSettings',
    props: {
      enableActivityRelatedList: '?boolean',
      enableFullRecordView: '?boolean',
    },
    extends: 'Metadata',
  },
  RemoteSiteSetting: {
    type: 'RemoteSiteSetting',
    props: {
      description: '?string',
      disableProtocolSecurity: 'boolean',
      isActive: 'boolean',
      url: 'string',
    },
    extends: 'Metadata',
  },
  Report: {
    type: 'Report',
    props: {
      aggregates: ['ReportAggregate'],
      block: ['Report'],
      blockInfo: '?ReportBlockInfo',
      buckets: ['ReportBucketField'],
      chart: '?ReportChart',
      colorRanges: ['ReportColorRange'],
      columns: ['ReportColumn'],
      crossFilters: ['ReportCrossFilter'],
      currency: '?string',
      customDetailFormulas: ['ReportCustomDetailFormula'],
      dataCategoryFilters: ['ReportDataCategoryFilter'],
      description: '?string',
      division: '?string',
      filter: '?ReportFilter',
      folderName: '?string',
      format: 'string',
      formattingRules: ['ReportFormattingRule'],
      groupingsAcross: ['ReportGrouping'],
      groupingsDown: ['ReportGrouping'],
      historicalSelector: '?ReportHistoricalSelector',
      name: 'string',
      numSubscriptions: '?number',
      params: ['ReportParam'],
      reportType: 'string',
      roleHierarchyFilter: '?string',
      rowLimit: '?number',
      scope: '?string',
      showCurrentDate: '?boolean',
      showDetails: '?boolean',
      showGrandTotal: '?boolean',
      showSubTotals: '?boolean',
      sortColumn: '?string',
      sortOrder: '?string',
      territoryHierarchyFilter: '?string',
      timeFrameFilter: '?ReportTimeFrameFilter',
      userFilter: '?string',
    },
    extends: 'Metadata',
  },
  ReportAggregate: {
    type: 'ReportAggregate',
    props: {
      acrossGroupingContext: '?string',
      calculatedFormula: 'string',
      datatype: 'string',
      description: '?string',
      developerName: 'string',
      downGroupingContext: '?string',
      isActive: 'boolean',
      isCrossBlock: '?boolean',
      masterLabel: 'string',
      reportType: '?string',
      scale: '?number',
    },
  },
  ReportBlockInfo: {
    type: 'ReportBlockInfo',
    props: {
      aggregateReferences: ['ReportAggregateReference'],
      blockId: 'string',
      joinTable: 'string',
    },
  },
  ReportAggregateReference: {
    type: 'ReportAggregateReference',
    props: {
      aggregate: 'string',
    },
  },
  ReportBucketField: {
    type: 'ReportBucketField',
    props: {
      bucketType: 'string',
      developerName: 'string',
      masterLabel: 'string',
      nullTreatment: '?string',
      otherBucketLabel: '?string',
      sourceColumnName: 'string',
      useOther: '?boolean',
      values: ['ReportBucketFieldValue'],
    },
  },
  ReportBucketFieldValue: {
    type: 'ReportBucketFieldValue',
    props: {
      sourceValues: ['ReportBucketFieldSourceValue'],
      value: 'string',
    },
  },
  ReportBucketFieldSourceValue: {
    type: 'ReportBucketFieldSourceValue',
    props: {
      from: '?string',
      sourceValue: '?string',
      to: '?string',
    },
  },
  ReportChart: {
    type: 'ReportChart',
    props: {
      backgroundColor1: '?string',
      backgroundColor2: '?string',
      backgroundFadeDir: '?string',
      chartSummaries: ['ChartSummary'],
      chartType: 'string',
      enableHoverLabels: '?boolean',
      expandOthers: '?boolean',
      groupingColumn: '?string',
      legendPosition: '?string',
      location: '?string',
      secondaryGroupingColumn: '?string',
      showAxisLabels: '?boolean',
      showPercentage: '?boolean',
      showTotal: '?boolean',
      showValues: '?boolean',
      size: '?string',
      summaryAxisManualRangeEnd: '?number',
      summaryAxisManualRangeStart: '?number',
      summaryAxisRange: '?string',
      textColor: '?string',
      textSize: '?number',
      title: '?string',
      titleColor: '?string',
      titleSize: '?number',
    },
  },
  ReportColorRange: {
    type: 'ReportColorRange',
    props: {
      aggregate: '?string',
      columnName: 'string',
      highBreakpoint: '?number',
      highColor: 'string',
      lowBreakpoint: '?number',
      lowColor: 'string',
      midColor: 'string',
    },
  },
  ReportColumn: {
    type: 'ReportColumn',
    props: {
      aggregateTypes: ['string'],
      field: 'string',
      reverseColors: '?boolean',
      showChanges: '?boolean',
    },
  },
  ReportCrossFilter: {
    type: 'ReportCrossFilter',
    props: {
      criteriaItems: ['ReportFilterItem'],
      operation: 'string',
      primaryTableColumn: 'string',
      relatedTable: 'string',
      relatedTableJoinColumn: 'string',
    },
  },
  ReportFilterItem: {
    type: 'ReportFilterItem',
    props: {
      column: 'string',
      columnToColumn: '?boolean',
      isUnlocked: '?boolean',
      operator: 'string',
      snapshot: '?string',
      value: '?string',
    },
  },
  ReportCustomDetailFormula: {
    type: 'ReportCustomDetailFormula',
    props: {
      calculatedFormula: 'string',
      dataType: 'string',
      description: '?string',
      developerName: 'string',
      label: 'string',
      scale: 'number',
    },
  },
  ReportDataCategoryFilter: {
    type: 'ReportDataCategoryFilter',
    props: {
      dataCategory: 'string',
      dataCategoryGroup: 'string',
      operator: 'string',
    },
  },
  ReportFilter: {
    type: 'ReportFilter',
    props: {
      booleanFilter: '?string',
      criteriaItems: ['ReportFilterItem'],
      language: '?string',
    },
  },
  ReportFormattingRule: {
    type: 'ReportFormattingRule',
    props: {
      aggregate: '?string',
      columnName: 'string',
      values: ['ReportFormattingRuleValue'],
    },
  },
  ReportFormattingRuleValue: {
    type: 'ReportFormattingRuleValue',
    props: {
      backgroundColor: '?string',
      rangeUpperBound: '?number',
    },
  },
  ReportGrouping: {
    type: 'ReportGrouping',
    props: {
      aggregateType: '?string',
      dateGranularity: '?string',
      field: 'string',
      sortByName: '?string',
      sortOrder: 'string',
      sortType: '?string',
    },
  },
  ReportHistoricalSelector: {
    type: 'ReportHistoricalSelector',
    props: {
      snapshot: ['string'],
    },
  },
  ReportParam: {
    type: 'ReportParam',
    props: {
      name: 'string',
      value: 'string',
    },
  },
  ReportTimeFrameFilter: {
    type: 'ReportTimeFrameFilter',
    props: {
      dateColumn: 'string',
      endDate: '?string',
      interval: 'string',
      startDate: '?string',
    },
  },
  ReportType: {
    type: 'ReportType',
    props: {
      autogenerated: '?boolean',
      baseObject: 'string',
      category: 'string',
      deployed: 'boolean',
      description: '?string',
      join: '?ObjectRelationship',
      label: 'string',
      sections: ['ReportLayoutSection'],
    },
    extends: 'Metadata',
  },
  ObjectRelationship: {
    type: 'ObjectRelationship',
    props: {
      join: '?ObjectRelationship',
      outerJoin: 'boolean',
      relationship: 'string',
    },
  },
  ReportLayoutSection: {
    type: 'ReportLayoutSection',
    props: {
      columns: ['ReportTypeColumn'],
      masterLabel: 'string',
    },
  },
  ReportTypeColumn: {
    type: 'ReportTypeColumn',
    props: {
      checkedByDefault: 'boolean',
      displayNameOverride: '?string',
      field: 'string',
      table: 'string',
    },
  },
  RestrictionRule: {
    type: 'RestrictionRule',
    props: {
      active: 'boolean',
      description: 'string',
      enforcementType: 'string',
      masterLabel: 'string',
      recordFilter: 'string',
      targetEntity: 'string',
      userCriteria: 'string',
      version: 'number',
    },
    extends: 'Metadata',
  },
  RetailExecutionSettings: {
    type: 'RetailExecutionSettings',
    props: {
      enableRetailExecution: '?boolean',
    },
    extends: 'Metadata',
  },
  RoleOrTerritory: {
    type: 'RoleOrTerritory',
    props: {
      caseAccessLevel: '?string',
      contactAccessLevel: '?string',
      description: '?string',
      mayForecastManagerShare: '?boolean',
      name: 'string',
      opportunityAccessLevel: '?string',
    },
    extends: 'Metadata',
  },
  Role: {
    type: 'Role',
    props: {
      parentRole: '?string',
    },
    extends: 'RoleOrTerritory',
  },
  Territory: {
    type: 'Territory',
    props: {
      accountAccessLevel: '?string',
      parentTerritory: '?string',
    },
    extends: 'RoleOrTerritory',
  },
  SamlSsoConfig: {
    type: 'SamlSsoConfig',
    props: {
      attributeName: '?string',
      attributeNameIdFormat: '?string',
      decryptionCertificate: '?string',
      errorUrl: '?string',
      executionUserId: '?string',
      identityLocation: 'string',
      identityMapping: 'string',
      issuer: 'string',
      loginUrl: '?string',
      logoutUrl: '?string',
      name: 'string',
      oauthTokenEndpoint: '?string',
      redirectBinding: '?boolean',
      requestSignatureMethod: '?string',
      requestSigningCertId: '?string',
      salesforceLoginUrl: '?string',
      samlEntityId: 'string',
      samlJitHandlerId: '?string',
      samlVersion: 'string',
      singleLogoutBinding: '?string',
      singleLogoutUrl: '?string',
      userProvisioning: '?boolean',
      validationCert: 'string',
    },
    extends: 'Metadata',
  },
  SchemaSettings: {
    type: 'SchemaSettings',
    props: {
      enableAdvancedCMTSecurity: '?boolean',
      enableAdvancedCSSecurity: '?boolean',
      enableListCustomSettingCreation: '?boolean',
      enableSOSLOnCustomSettings: '?boolean',
    },
    extends: 'Metadata',
  },
  SearchSettings: {
    type: 'SearchSettings',
    props: {
      documentContentSearchEnabled: 'boolean',
      enableAdvancedSearchInAlohaSidebar: '?boolean',
      enableEinsteinSearchPersonalization: '?boolean',
      enableQuerySuggestionPigOn: '?boolean',
      enableSalesforceGeneratedSynonyms: '?boolean',
      enableSetupSearch: '?boolean',
      optimizeSearchForCJKEnabled: 'boolean',
      recentlyViewedUsersForBlankLookupEnabled: 'boolean',
      searchSettingsByObject: 'SearchSettingsByObject',
      sidebarAutoCompleteEnabled: 'boolean',
      sidebarDropDownListEnabled: 'boolean',
      sidebarLimitToItemsIOwnCheckboxEnabled: 'boolean',
      singleSearchResultShortcutEnabled: 'boolean',
      spellCorrectKnowledgeSearchEnabled: 'boolean',
    },
    extends: 'Metadata',
  },
  SearchSettingsByObject: {
    type: 'SearchSettingsByObject',
    props: {
      searchSettingsByObject: ['ObjectSearchSetting'],
    },
  },
  ObjectSearchSetting: {
    type: 'ObjectSearchSetting',
    props: {
      enhancedLookupEnabled: 'boolean',
      lookupAutoCompleteEnabled: 'boolean',
      name: 'string',
      resultsPerPageCount: 'number',
    },
  },
  SecuritySettings: {
    type: 'SecuritySettings',
    props: {
      canUsersGrantLoginAccess: '?boolean',
      enableAdminLoginAsAnyUser: '?boolean',
      enableAuditFieldsInactiveOwner: '?boolean',
      enableAuraSecureEvalPref: '?boolean',
      enableRequireHttpsConnection: '?boolean',
      isTLSv12Required: '?boolean',
      isTLSv12RequiredCommunities: '?boolean',
      networkAccess: '?NetworkAccess',
      passwordPolicies: '?PasswordPolicies',
      sessionSettings: '?SessionSettings',
      singleSignOnSettings: '?SingleSignOnSettings',
    },
    extends: 'Metadata',
  },
  NetworkAccess: {
    type: 'NetworkAccess',
    props: {
      ipRanges: ['IpRange'],
    },
  },
  IpRange: {
    type: 'IpRange',
    props: {
      description: '?string',
      end: '?string',
      start: '?string',
    },
  },
  PasswordPolicies: {
    type: 'PasswordPolicies',
    props: {
      apiOnlyUserHomePageURL: '?string',
      complexity: '?string',
      enableSetPasswordInApi: '?boolean',
      expiration: '?string',
      historyRestriction: '?string',
      lockoutInterval: '?string',
      maxLoginAttempts: '?string',
      minimumPasswordLength: '?string',
      minimumPasswordLifetime: '?boolean',
      obscureSecretAnswer: '?boolean',
      passwordAssistanceMessage: '?string',
      passwordAssistanceURL: '?string',
      questionRestriction: '?string',
    },
  },
  SessionSettings: {
    type: 'SessionSettings',
    props: {
      allowUserAuthenticationByCertificate: '?boolean',
      canConfirmEmailChangeInLightningCommunities: '?boolean',
      disableTimeoutWarning: '?boolean',
      enableCSPOnEmail: '?boolean',
      enableCSRFOnGet: '?boolean',
      enableCSRFOnPost: '?boolean',
      enableCacheAndAutocomplete: '?boolean',
      enableClickjackNonsetupSFDC: '?boolean',
      enableClickjackNonsetupUser: '?boolean',
      enableClickjackNonsetupUserHeaderless: '?boolean',
      enableClickjackSetup: '?boolean',
      enableContentSniffingProtection: '?boolean',
      enableLightningLogin: '?boolean',
      enableLightningLoginOnlyWithUserPerm: '?boolean',
      enablePostForSessions: '?boolean',
      enableSMSIdentity: '?boolean',
      enableU2F: '?boolean',
      enableUpgradeInsecureRequests: '?boolean',
      enableXssProtection: '?boolean',
      enforceIpRangesEveryRequest: '?boolean',
      forceLogoutOnSessionTimeout: '?boolean',
      forceRelogin: '?boolean',
      hasRetainedLoginHints: '?boolean',
      hasUserSwitching: '?boolean',
      hstsOnForcecomSites: '?boolean',
      identityConfirmationOnEmailChange: '?boolean',
      identityConfirmationOnTwoFactorRegistrationEnabled: '?boolean',
      lockSessionsToDomain: '?boolean',
      lockSessionsToIp: '?boolean',
      lockerServiceAPIVersion: '?string',
      lockerServiceCSP: '?boolean',
      lockerServiceFrozenRealm: '?boolean',
      logoutURL: '?string',
      redirectionWarning: '?boolean',
      referrerPolicy: '?boolean',
      requireHttpOnly: '?boolean',
      requireHttps: '?boolean',
      securityCentralKillSession: '?boolean',
      sessionTimeout: '?string',
    },
  },
  SingleSignOnSettings: {
    type: 'SingleSignOnSettings',
    props: {
      enableForceDelegatedCallout: '?boolean',
      enableMultipleSamlConfigs: '?boolean',
      enableSamlJitProvisioning: '?boolean',
      enableSamlLogin: '?boolean',
    },
  },
  ServiceChannel: {
    type: 'ServiceChannel',
    props: {
      interactionComponent: '?string',
      label: 'string',
      relatedEntityType: 'string',
      secondaryRoutingPriorityField: '?string',
      serviceChannelFieldPriorities: ['ServiceChannelFieldPriority'],
    },
    extends: 'Metadata',
  },
  ServiceChannelFieldPriority: {
    type: 'ServiceChannelFieldPriority',
    props: {
      priority: 'number',
      value: 'string',
    },
  },
  ServicePresenceStatus: {
    type: 'ServicePresenceStatus',
    props: {
      channels: '?ServiceChannelStatus',
      label: 'string',
    },
    extends: 'Metadata',
  },
  ServiceChannelStatus: {
    type: 'ServiceChannelStatus',
    props: {
      channel: ['string'],
    },
  },
  SharingBaseRule: {
    type: 'SharingBaseRule',
    props: {
      accessLevel: 'string',
      accountSettings: '?AccountSharingRuleSettings',
      description: '?string',
      label: 'string',
      sharedTo: 'SharedTo',
    },
    extends: 'Metadata',
  },
  AccountSharingRuleSettings: {
    type: 'AccountSharingRuleSettings',
    props: {
      caseAccessLevel: 'string',
      contactAccessLevel: 'string',
      opportunityAccessLevel: 'string',
    },
  },
  SharingCriteriaRule: {
    type: 'SharingCriteriaRule',
    props: {
      booleanFilter: '?string',
      criteriaItems: ['FilterItem'],
    },
    extends: 'SharingBaseRule',
  },
  SharingGuestRule: {
    type: 'SharingGuestRule',
    props: {
      booleanFilter: '?string',
      criteriaItems: ['FilterItem'],
    },
    extends: 'SharingBaseRule',
  },
  SharingOwnerRule: {
    type: 'SharingOwnerRule',
    props: {
      sharedFrom: 'SharedTo',
    },
    extends: 'SharingBaseRule',
  },
  SharingTerritoryRule: {
    type: 'SharingTerritoryRule',
    props: {},
    extends: 'SharingOwnerRule',
  },
  SharingRules: {
    type: 'SharingRules',
    props: {
      sharingCriteriaRules: ['SharingCriteriaRule'],
      sharingGuestRules: ['SharingGuestRule'],
      sharingOwnerRules: ['SharingOwnerRule'],
      sharingTerritoryRules: ['SharingTerritoryRule'],
    },
    extends: 'Metadata',
  },
  SharingSet: {
    type: 'SharingSet',
    props: {
      accessMappings: ['AccessMapping'],
      description: '?string',
      name: 'string',
      profiles: ['string'],
    },
    extends: 'Metadata',
  },
  AccessMapping: {
    type: 'AccessMapping',
    props: {
      accessLevel: 'string',
      object: 'string',
      objectField: 'string',
      userField: 'string',
    },
  },
  SharingSettings: {
    type: 'SharingSettings',
    props: {
      enableAccountRoleOptimization: '?boolean',
      enableAssetSharing: '?boolean',
      enableCommunityUserVisibility: '?boolean',
      enableExternalSharingModel: '?boolean',
      enableManagerGroups: '?boolean',
      enableManualUserRecordSharing: '?boolean',
      enablePartnerSuperUserAccess: '?boolean',
      enablePortalUserCaseSharing: '?boolean',
      enablePortalUserVisibility: '?boolean',
      enableRemoveTMGroupMembership: '?boolean',
      enableSecureGuestAccess: '?boolean',
      enableStandardReportVisibility: '?boolean',
      enableTerritoryForecastManager: '?boolean',
    },
    extends: 'Metadata',
  },
  SiteSettings: {
    type: 'SiteSettings',
    props: {
      enableProxyLoginICHeader: '?boolean',
      enableTopicsInSites: '?boolean',
      enableVisualforceApiAccessAllowed: '?boolean',
    },
    extends: 'Metadata',
  },
  Skill: {
    type: 'Skill',
    props: {
      assignments: '?SkillAssignments',
      description: '?string',
      label: 'string',
    },
    extends: 'Metadata',
  },
  SkillAssignments: {
    type: 'SkillAssignments',
    props: {
      profiles: '?SkillProfileAssignments',
      users: '?SkillUserAssignments',
    },
  },
  SkillProfileAssignments: {
    type: 'SkillProfileAssignments',
    props: {
      profile: ['string'],
    },
  },
  SkillUserAssignments: {
    type: 'SkillUserAssignments',
    props: {
      user: ['string'],
    },
  },
  SocialCustomerServiceSettings: {
    type: 'SocialCustomerServiceSettings',
    props: {
      caseSubjectOption: 'string',
      enableSocialApprovals: '?boolean',
      enableSocialCaseAssignmentRules: '?boolean',
      enableSocialCustomerService: '?boolean',
      enableSocialPersonaHistoryTracking: '?boolean',
      enableSocialPostHistoryTracking: '?boolean',
      enableSocialReceiveParentPost: '?boolean',
    },
    extends: 'Metadata',
  },
  SocialProfileSettings: {
    type: 'SocialProfileSettings',
    props: {
      enableSocialProfiles: '?boolean',
      isFacebookSocialProfilesDisabled: '?boolean',
      isLinkedInSocialProfilesDisabled: '?boolean',
      isTwitterSocialProfilesDisabled: '?boolean',
      isYouTubeSocialProfilesDisabled: '?boolean',
    },
    extends: 'Metadata',
  },
  StandardValueSet: {
    type: 'StandardValueSet',
    props: {
      groupingStringEnum: '?string',
      sorted: 'boolean',
      standardValue: ['StandardValue'],
    },
    extends: 'Metadata',
  },
  StandardValueSetTranslation: {
    type: 'StandardValueSetTranslation',
    props: {
      valueTranslation: ['ValueTranslation'],
    },
    extends: 'Metadata',
  },
  SurveySettings: {
    type: 'SurveySettings',
    props: {
      enableSurvey: '?boolean',
      enableSurveyOwnerCanManageResponse: '?boolean',
    },
    extends: 'Metadata',
  },
  SynonymDictionary: {
    type: 'SynonymDictionary',
    props: {
      groups: ['SynonymGroup'],
      isProtected: '?boolean',
      label: 'string',
    },
    extends: 'Metadata',
  },
  SystemNotificationSettings: {
    type: 'SystemNotificationSettings',
    props: {
      disableDowntimeNotifications: '?boolean',
      disableMaintenanceNotifications: '?boolean',
    },
    extends: 'Metadata',
  },
  Territory2: {
    type: 'Territory2',
    props: {
      accountAccessLevel: '?string',
      caseAccessLevel: '?string',
      contactAccessLevel: '?string',
      customFields: ['FieldValue'],
      description: '?string',
      name: 'string',
      opportunityAccessLevel: '?string',
      parentTerritory: '?string',
      ruleAssociations: ['Territory2RuleAssociation'],
      territory2Type: 'string',
    },
    extends: 'Metadata',
  },
  FieldValue: {
    type: 'FieldValue',
    props: {
      name: 'string',
      value: '?any',
    },
  },
  Territory2RuleAssociation: {
    type: 'Territory2RuleAssociation',
    props: {
      inherited: 'boolean',
      ruleName: 'string',
    },
  },
  Territory2Model: {
    type: 'Territory2Model',
    props: {
      customFields: ['FieldValue'],
      description: '?string',
      name: 'string',
    },
    extends: 'Metadata',
  },
  Territory2Rule: {
    type: 'Territory2Rule',
    props: {
      active: 'boolean',
      booleanFilter: '?string',
      name: 'string',
      objectType: 'string',
      ruleItems: ['Territory2RuleItem'],
    },
    extends: 'Metadata',
  },
  Territory2RuleItem: {
    type: 'Territory2RuleItem',
    props: {
      field: 'string',
      operation: 'string',
      value: '?string',
    },
  },
  Territory2Settings: {
    type: 'Territory2Settings',
    props: {
      defaultAccountAccessLevel: '?string',
      defaultCaseAccessLevel: '?string',
      defaultContactAccessLevel: '?string',
      defaultOpportunityAccessLevel: '?string',
      enableTerritoryManagement2: '?boolean',
      opportunityFilterSettings: '?Territory2SettingsOpportunityFilter',
    },
    extends: 'Metadata',
  },
  Territory2SettingsOpportunityFilter: {
    type: 'Territory2SettingsOpportunityFilter',
    props: {
      apexClassName: '?string',
      enableFilter: 'boolean',
      runOnCreate: 'boolean',
    },
  },
  Territory2Type: {
    type: 'Territory2Type',
    props: {
      description: '?string',
      name: 'string',
      priority: 'number',
    },
    extends: 'Metadata',
  },
  TimeSheetTemplate: {
    type: 'TimeSheetTemplate',
    props: {
      active: 'boolean',
      description: '?string',
      frequency: 'string',
      masterLabel: 'string',
      startDate: 'string',
      timeSheetTemplateAssignments: ['TimeSheetTemplateAssignment'],
      workWeekEndDay: 'string',
      workWeekStartDay: 'string',
    },
    extends: 'Metadata',
  },
  TimeSheetTemplateAssignment: {
    type: 'TimeSheetTemplateAssignment',
    props: {
      assignedTo: '?string',
    },
  },
  TopicsForObjects: {
    type: 'TopicsForObjects',
    props: {
      enableTopics: 'boolean',
      entityApiName: 'string',
    },
    extends: 'Metadata',
  },
  TrailheadSettings: {
    type: 'TrailheadSettings',
    props: {
      enableMyTrailheadPref: '?boolean',
    },
    extends: 'Metadata',
  },
  TransactionSecurityPolicy: {
    type: 'TransactionSecurityPolicy',
    props: {
      action: 'TransactionSecurityAction',
      active: 'boolean',
      apexClass: '?string',
      description: '?string',
      developerName: '?string',
      eventName: '?string',
      eventType: '?string',
      executionUser: '?string',
      flow: '?string',
      masterLabel: '?string',
      resourceName: '?string',
      type: '?string',
    },
    extends: 'Metadata',
  },
  TransactionSecurityAction: {
    type: 'TransactionSecurityAction',
    props: {
      block: 'boolean',
      endSession: 'boolean',
      freezeUser: 'boolean',
      notifications: ['TransactionSecurityNotification'],
      twoFactorAuthentication: 'boolean',
    },
  },
  TransactionSecurityNotification: {
    type: 'TransactionSecurityNotification',
    props: {
      inApp: 'boolean',
      sendEmail: 'boolean',
      user: 'string',
    },
  },
  Translations: {
    type: 'Translations',
    props: {
      customApplications: ['CustomApplicationTranslation'],
      customDataTypeTranslations: ['CustomDataTypeTranslation'],
      customLabels: ['CustomLabelTranslation'],
      customPageWebLinks: ['CustomPageWebLinkTranslation'],
      customTabs: ['CustomTabTranslation'],
      flowDefinitions: ['FlowDefinitionTranslation'],
      quickActions: ['GlobalQuickActionTranslation'],
      reportTypes: ['ReportTypeTranslation'],
      scontrols: ['ScontrolTranslation'],
    },
    extends: 'Metadata',
  },
  CustomApplicationTranslation: {
    type: 'CustomApplicationTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  CustomDataTypeTranslation: {
    type: 'CustomDataTypeTranslation',
    props: {
      components: ['CustomDataTypeComponentTranslation'],
      customDataTypeName: 'string',
      description: '?string',
      label: '?string',
    },
  },
  CustomDataTypeComponentTranslation: {
    type: 'CustomDataTypeComponentTranslation',
    props: {
      developerSuffix: 'string',
      label: '?string',
    },
  },
  CustomLabelTranslation: {
    type: 'CustomLabelTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  CustomPageWebLinkTranslation: {
    type: 'CustomPageWebLinkTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  CustomTabTranslation: {
    type: 'CustomTabTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  FlowDefinitionTranslation: {
    type: 'FlowDefinitionTranslation',
    props: {
      flows: ['FlowTranslation'],
      fullName: 'string',
      label: '?string',
    },
  },
  FlowTranslation: {
    type: 'FlowTranslation',
    props: {
      choices: ['FlowChoiceTranslation'],
      fullName: 'string',
      label: '?string',
      screens: ['FlowScreenTranslation'],
      stages: ['FlowStageTranslation'],
      textTemplates: ['FlowTextTemplateTranslation'],
    },
  },
  FlowChoiceTranslation: {
    type: 'FlowChoiceTranslation',
    props: {
      choiceText: '?string',
      name: 'string',
      userInput: '?FlowChoiceUserInputTranslation',
    },
  },
  FlowChoiceUserInputTranslation: {
    type: 'FlowChoiceUserInputTranslation',
    props: {
      promptText: '?string',
      validationRule: '?FlowInputValidationRuleTranslation',
    },
  },
  FlowInputValidationRuleTranslation: {
    type: 'FlowInputValidationRuleTranslation',
    props: {
      errorMessage: '?string',
    },
  },
  FlowScreenTranslation: {
    type: 'FlowScreenTranslation',
    props: {
      fields: ['FlowScreenFieldTranslation'],
      helpText: '?string',
      name: 'string',
      pausedText: '?string',
    },
  },
  FlowScreenFieldTranslation: {
    type: 'FlowScreenFieldTranslation',
    props: {
      fieldText: '?string',
      helpText: '?string',
      name: 'string',
      validationRule: '?FlowInputValidationRuleTranslation',
    },
  },
  FlowStageTranslation: {
    type: 'FlowStageTranslation',
    props: {
      label: '?string',
      name: 'string',
    },
  },
  FlowTextTemplateTranslation: {
    type: 'FlowTextTemplateTranslation',
    props: {
      name: 'string',
      text: '?string',
    },
  },
  GlobalQuickActionTranslation: {
    type: 'GlobalQuickActionTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  ReportTypeTranslation: {
    type: 'ReportTypeTranslation',
    props: {
      description: '?string',
      label: '?string',
      name: 'string',
      sections: ['ReportTypeSectionTranslation'],
    },
  },
  ReportTypeSectionTranslation: {
    type: 'ReportTypeSectionTranslation',
    props: {
      columns: ['ReportTypeColumnTranslation'],
      label: '?string',
      name: 'string',
    },
  },
  ReportTypeColumnTranslation: {
    type: 'ReportTypeColumnTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  ScontrolTranslation: {
    type: 'ScontrolTranslation',
    props: {
      label: 'string',
      name: 'string',
    },
  },
  UIObjectRelationConfig: {
    type: 'UIObjectRelationConfig',
    props: {
      UIObjectRelationFieldConfigs: ['UIObjectRelationFieldConfig'],
      contextObject: 'string',
      contextObjectRecordType: '?string',
      directRelationshipField: '?string',
      indirectObjectContextField: '?string',
      indirectObjectRelatedField: '?string',
      indirectRelationshipObject: '?string',
      isActive: 'boolean',
      masterLabel: 'string',
      relatedObject: 'string',
      relatedObjectRecordType: '?string',
      relationshipType: 'string',
    },
    extends: 'Metadata',
  },
  UIObjectRelationFieldConfig: {
    type: 'UIObjectRelationFieldConfig',
    props: {
      displayLabel: 'string',
      queryText: 'string',
      rowOrder: 'number',
    },
  },
  UserCriteria: {
    type: 'UserCriteria',
    props: {
      creationAgeInSeconds: '?number',
      description: '?string',
      lastChatterActivityAgeInSeconds: '?number',
      masterLabel: 'string',
      profiles: ['string'],
      userTypes: ['string'],
    },
    extends: 'Metadata',
  },
  UserEngagementSettings: {
    type: 'UserEngagementSettings',
    props: {
      canGovCloudUseAdoptionApps: '?boolean',
      doesScheduledSwitcherRunDaily: '?boolean',
      enableCustomHelpGlobalSection: '?boolean',
      enableHelpMenuShowFeedback: '?boolean',
      enableHelpMenuShowHelp: '?boolean',
      enableHelpMenuShowNewUser: '?boolean',
      enableHelpMenuShowSearch: '?boolean',
      enableHelpMenuShowSfdcContent: '?boolean',
      enableHelpMenuShowShortcut: '?boolean',
      enableHelpMenuShowSupport: '?boolean',
      enableHelpMenuShowTrailhead: '?boolean',
      enableIBILOptOutDashboards: '?boolean',
      enableIBILOptOutEvents: '?boolean',
      enableIBILOptOutReports: '?boolean',
      enableIBILOptOutTasks: '?boolean',
      enableLexToClassicFeedbackEnable: '?boolean',
      enableOrchestrationInSandbox: '?boolean',
      enableOrgUserAssistEnabled: '?boolean',
      enableScheduledSwitcher: '?boolean',
      enableSfdcProductFeedbackSurvey: '?boolean',
      enableShowSalesforceUserAssist: '?boolean',
      isAutoTransitionDelayed: '?boolean',
      isCrucNotificationDisabled: '?boolean',
      isCustomProfileAutoTransitionDelayed: '?boolean',
      isLEXWelcomeMatDisabled: '?boolean',
      isMeetTheAssistantDisabledInClassic: '?boolean',
      isMeetTheAssistantDisabledInLightning: '?boolean',
      optimizerAppEnabled: '?boolean',
    },
    extends: 'Metadata',
  },
  UserInterfaceSettings: {
    type: 'UserInterfaceSettings',
    props: {
      alternateAlohaListView: '?boolean',
      enableAsyncRelatedLists: '?boolean',
      enableClickjackUserPageHeaderless: '?boolean',
      enableCollapsibleSections: '?boolean',
      enableCollapsibleSideBar: '?boolean',
      enableCustomObjectTruncate: '?boolean',
      enableCustomeSideBarOnAllPages: '?boolean',
      enableDeleteFieldHistory: '?boolean',
      enableHoverDetails: '?boolean',
      enableInlineEdit: '?boolean',
      enableNewPageLayoutEditor: '?boolean',
      enablePersonalCanvas: '?boolean',
      enablePrintableListViews: '?boolean',
      enableProfileCustomTabsets: '?boolean',
      enableQuickCreate: '?boolean',
      enableTabOrganizer: '?boolean',
    },
    extends: 'Metadata',
  },
  UserManagementSettings: {
    type: 'UserManagementSettings',
    props: {
      enableCanAnswerContainUsername: '?boolean',
      enableCanSaveUserPerm: '?boolean',
      enableConcealPersonalInfo: '?boolean',
      enableContactlessExternalIdentityUsers: '?boolean',
      enableEnhancedPermsetMgmt: '?boolean',
      enableEnhancedProfileMgmt: '?boolean',
      enableNewProfileUI: '?boolean',
      enableScrambleUserData: '?boolean',
      enableUserSelfDeactivate: '?boolean',
    },
    extends: 'Metadata',
  },
  VoiceSettings: {
    type: 'VoiceSettings',
    props: {
      enableCallDisposition: '?boolean',
      enableVoiceCallList: '?boolean',
      enableVoiceCallRecording: '?boolean',
      enableVoiceCoaching: '?boolean',
      enableVoiceConferencing: '?boolean',
      enableVoiceLocalPresence: '?boolean',
      enableVoiceMail: '?boolean',
      enableVoiceMailDrop: '?boolean',
    },
    extends: 'Metadata',
  },
  WaveApplication: {
    type: 'WaveApplication',
    props: {
      assetIcon: '?string',
      description: '?string',
      folder: 'string',
      masterLabel: 'string',
      shares: ['FolderShare'],
      templateOrigin: '?string',
      templateVersion: '?string',
    },
    extends: 'Metadata',
  },
  WaveDataset: {
    type: 'WaveDataset',
    props: {
      application: 'string',
      description: '?string',
      masterLabel: 'string',
      templateAssetSourceName: '?string',
    },
    extends: 'Metadata',
  },
  WaveTemplateBundle: {
    type: 'WaveTemplateBundle',
    props: {
      assetIcon: '?string',
      assetVersion: '?number',
      description: '?string',
      label: 'string',
      templateType: 'string',
    },
    extends: 'Metadata',
  },
  WaveXmd: {
    type: 'WaveXmd',
    props: {
      application: '?string',
      dataset: 'string',
      datasetConnector: '?string',
      datasetFullyQualifiedName: '?string',
      dates: ['WaveXmdDate'],
      dimensions: ['WaveXmdDimension'],
      measures: ['WaveXmdMeasure'],
      organizations: ['WaveXmdOrganization'],
      origin: '?string',
      type: '?string',
      waveVisualization: '?string',
    },
    extends: 'Metadata',
  },
  WaveXmdDate: {
    type: 'WaveXmdDate',
    props: {
      alias: 'string',
      compact: '?boolean',
      dateFieldDay: '?string',
      dateFieldEpochDay: '?string',
      dateFieldEpochSecond: '?string',
      dateFieldFiscalMonth: '?string',
      dateFieldFiscalQuarter: '?string',
      dateFieldFiscalWeek: '?string',
      dateFieldFiscalYear: '?string',
      dateFieldFullYear: '?string',
      dateFieldHour: '?string',
      dateFieldMinute: '?string',
      dateFieldMonth: '?string',
      dateFieldQuarter: '?string',
      dateFieldSecond: '?string',
      dateFieldWeek: '?string',
      dateFieldYear: '?string',
      description: '?string',
      firstDayOfWeek: 'number',
      fiscalMonthOffset: 'number',
      isYearEndFiscalYear: '?boolean',
      label: '?string',
      showInExplorer: '?boolean',
      sortIndex: 'number',
      type: 'string',
    },
  },
  WaveXmdDimension: {
    type: 'WaveXmdDimension',
    props: {
      conditionalFormatting: ['WaveXmdFormattingProperty'],
      customActions: ['WaveXmdDimensionCustomAction'],
      customActionsEnabled: '?boolean',
      dateFormat: '?string',
      description: '?string',
      field: 'string',
      fullyQualifiedName: '?string',
      imageTemplate: '?string',
      isDerived: 'boolean',
      isMultiValue: '?boolean',
      label: '?string',
      linkTemplate: '?string',
      linkTemplateEnabled: '?boolean',
      linkTooltip: '?string',
      members: ['WaveXmdDimensionMember'],
      origin: '?string',
      recordDisplayFields: ['WaveXmdRecordDisplayLookup'],
      recordIdField: '?string',
      recordOrganizationIdField: '?string',
      salesforceActions: ['WaveXmdDimensionSalesforceAction'],
      salesforceActionsEnabled: '?boolean',
      showDetailsDefaultFieldIndex: '?number',
      showInExplorer: '?boolean',
      sortIndex: 'number',
    },
  },
  WaveXmdFormattingProperty: {
    type: 'WaveXmdFormattingProperty',
    props: {
      formattingBins: ['WaveXmdFormattingBin'],
      formattingPredicates: ['WaveXmdFormattingPredicate'],
      property: 'string',
      referenceField: 'string',
      sortIndex: 'number',
      type: 'string',
    },
  },
  WaveXmdFormattingBin: {
    type: 'WaveXmdFormattingBin',
    props: {
      bin: 'string',
      formatValue: 'string',
      label: 'string',
      sortIndex: 'number',
    },
  },
  WaveXmdFormattingPredicate: {
    type: 'WaveXmdFormattingPredicate',
    props: {
      formatValue: 'string',
      operator: 'string',
      sortIndex: 'number',
      value: 'string',
    },
  },
  WaveXmdDimensionCustomAction: {
    type: 'WaveXmdDimensionCustomAction',
    props: {
      customActionName: 'string',
      enabled: 'boolean',
      icon: '?string',
      method: '?string',
      sortIndex: 'number',
      target: '?string',
      tooltip: '?string',
      url: '?string',
    },
  },
  WaveXmdDimensionMember: {
    type: 'WaveXmdDimensionMember',
    props: {
      color: '?string',
      label: '?string',
      member: 'string',
      sortIndex: 'number',
    },
  },
  WaveXmdRecordDisplayLookup: {
    type: 'WaveXmdRecordDisplayLookup',
    props: {
      recordDisplayField: 'string',
    },
  },
  WaveXmdDimensionSalesforceAction: {
    type: 'WaveXmdDimensionSalesforceAction',
    props: {
      enabled: 'boolean',
      salesforceActionName: 'string',
      sortIndex: 'number',
    },
  },
  WaveXmdMeasure: {
    type: 'WaveXmdMeasure',
    props: {
      conditionalFormatting: ['WaveXmdFormattingProperty'],
      dateFormat: '?string',
      description: '?string',
      field: 'string',
      formatCustomFormat: '?string',
      formatDecimalDigits: '?number',
      formatIsNegativeParens: '?boolean',
      formatPrefix: '?string',
      formatSuffix: '?string',
      formatUnit: '?string',
      formatUnitMultiplier: '?number',
      fullyQualifiedName: '?string',
      isDerived: 'boolean',
      label: '?string',
      origin: '?string',
      showDetailsDefaultFieldIndex: '?number',
      showInExplorer: '?boolean',
      sortIndex: 'number',
    },
  },
  WaveXmdOrganization: {
    type: 'WaveXmdOrganization',
    props: {
      instanceUrl: 'string',
      label: 'string',
      organizationIdentifier: 'string',
      sortIndex: 'number',
    },
  },
  WorkDotComSettings: {
    type: 'WorkDotComSettings',
    props: {
      enableCoachingManagerGroupAccess: '?boolean',
      enableGoalManagerGroupAccess: '?boolean',
      enableProfileSkills: '?boolean',
      enableProfileSkillsAddFeedPost: '?boolean',
      enableProfileSkillsAutoSuggest: '?boolean',
      enableProfileSkillsUsePlatform: '?boolean',
      enableWorkBadgeDefRestrictPref: '?boolean',
      enableWorkCalibration: '?boolean',
      enableWorkCanvasPref: '?boolean',
      enableWorkCertification: '?boolean',
      enableWorkCertificationNotification: '?boolean',
      enableWorkRewardsPref: '?boolean',
      enableWorkThanksPref: '?boolean',
      enableWorkUseObjectivesForGoals: '?boolean',
    },
    extends: 'Metadata',
  },
  Workflow: {
    type: 'Workflow',
    props: {
      alerts: ['WorkflowAlert'],
      fieldUpdates: ['WorkflowFieldUpdate'],
      flowActions: ['WorkflowFlowAction'],
      knowledgePublishes: ['WorkflowKnowledgePublish'],
      outboundMessages: ['WorkflowOutboundMessage'],
      rules: ['WorkflowRule'],
      send: ['WorkflowSend'],
      tasks: ['WorkflowTask'],
    },
    extends: 'Metadata',
  },
  WorkflowAlert: {
    type: 'WorkflowAlert',
    props: {
      ccEmails: ['string'],
      description: 'string',
      protected: 'boolean',
      recipients: ['WorkflowEmailRecipient'],
      senderAddress: '?string',
      senderType: '?string',
      template: 'string',
    },
    extends: 'WorkflowAction',
  },
  WorkflowAction: {
    type: 'WorkflowAction',
    props: {},
    extends: 'Metadata',
  },
  WorkflowFieldUpdate: {
    type: 'WorkflowFieldUpdate',
    props: {
      description: '?string',
      field: 'string',
      formula: '?string',
      literalValue: '?string',
      lookupValue: '?string',
      lookupValueType: '?string',
      name: 'string',
      notifyAssignee: 'boolean',
      operation: 'string',
      protected: 'boolean',
      reevaluateOnChange: '?boolean',
      targetObject: '?string',
    },
    extends: 'WorkflowAction',
  },
  WorkflowFlowAction: {
    type: 'WorkflowFlowAction',
    props: {
      description: '?string',
      flow: 'string',
      flowInputs: ['WorkflowFlowActionParameter'],
      label: 'string',
      language: '?string',
      protected: 'boolean',
    },
    extends: 'WorkflowAction',
  },
  WorkflowFlowActionParameter: {
    type: 'WorkflowFlowActionParameter',
    props: {
      name: 'string',
      value: '?string',
    },
  },
  WorkflowKnowledgePublish: {
    type: 'WorkflowKnowledgePublish',
    props: {
      action: 'string',
      description: '?string',
      label: 'string',
      language: '?string',
      protected: 'boolean',
    },
    extends: 'WorkflowAction',
  },
  WorkflowOutboundMessage: {
    type: 'WorkflowOutboundMessage',
    props: {
      apiVersion: 'number',
      description: '?string',
      endpointUrl: 'string',
      fields: ['string'],
      includeSessionId: 'boolean',
      integrationUser: 'string',
      name: 'string',
      protected: 'boolean',
      useDeadLetterQueue: '?boolean',
    },
    extends: 'WorkflowAction',
  },
  WorkflowSend: {
    type: 'WorkflowSend',
    props: {
      action: 'string',
      description: '?string',
      label: 'string',
      language: '?string',
      protected: 'boolean',
    },
    extends: 'WorkflowAction',
  },
  WorkflowTask: {
    type: 'WorkflowTask',
    props: {
      assignedTo: '?string',
      assignedToType: 'string',
      description: '?string',
      dueDateOffset: 'number',
      notifyAssignee: 'boolean',
      offsetFromField: '?string',
      priority: 'string',
      protected: 'boolean',
      status: 'string',
      subject: 'string',
    },
    extends: 'WorkflowAction',
  },
  WorkflowEmailRecipient: {
    type: 'WorkflowEmailRecipient',
    props: {
      field: '?string',
      recipient: '?string',
      type: 'string',
    },
  },
  WorkflowRule: {
    type: 'WorkflowRule',
    props: {
      actions: ['WorkflowActionReference'],
      active: 'boolean',
      booleanFilter: '?string',
      criteriaItems: ['FilterItem'],
      description: '?string',
      formula: '?string',
      triggerType: 'string',
      workflowTimeTriggers: ['WorkflowTimeTrigger'],
    },
    extends: 'Metadata',
  },
  WorkflowTimeTrigger: {
    type: 'WorkflowTimeTrigger',
    props: {
      actions: ['WorkflowActionReference'],
      offsetFromField: '?string',
      timeLength: '?string',
      workflowTimeTriggerUnit: 'string',
    },
  },
  SaveResult: {
    type: 'SaveResult',
    props: {
      errors: ['Error'],
      fullName: 'string',
      success: 'boolean',
    },
  },
  Error: {
    type: 'Error',
    props: {
      extendedErrorDetails: ['ExtendedErrorDetails'],
      fields: ['string'],
      message: 'string',
      statusCode: 'string',
    },
  },
  ExtendedErrorDetails: {
    type: 'ExtendedErrorDetails',
    props: {
      extendedErrorCode: 'string',
    },
  },
  DeleteResult: {
    type: 'DeleteResult',
    props: {
      errors: ['Error'],
      fullName: 'string',
      success: 'boolean',
    },
  },
  DeployOptions: {
    type: 'DeployOptions',
    props: {
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
  },
  AsyncResult: {
    type: 'AsyncResult',
    props: {
      done: 'boolean',
      id: 'string',
      message: '?string',
      state: 'string',
      statusCode: '?string',
    },
  },
  DescribeMetadataResult: {
    type: 'DescribeMetadataResult',
    props: {
      metadataObjects: ['DescribeMetadataObject'],
      organizationNamespace: 'string',
      partialSaveAllowed: 'boolean',
      testRequired: 'boolean',
    },
  },
  DescribeMetadataObject: {
    type: 'DescribeMetadataObject',
    props: {
      childXmlNames: ['string'],
      directoryName: 'string',
      inFolder: 'boolean',
      metaFile: 'boolean',
      suffix: '?string',
      xmlName: 'string',
    },
  },
  DescribeValueTypeResult: {
    type: 'DescribeValueTypeResult',
    props: {
      apiCreatable: 'boolean',
      apiDeletable: 'boolean',
      apiReadable: 'boolean',
      apiUpdatable: 'boolean',
      parentField: '?ValueTypeField',
      valueTypeFields: ['ValueTypeField'],
    },
  },
  ValueTypeField: {
    type: 'ValueTypeField',
    props: {
      fields: ['ValueTypeField'],
      foreignKeyDomain: ['string'],
      isForeignKey: 'boolean',
      isNameField: 'boolean',
      minOccurs: 'number',
      name: 'string',
      picklistValues: ['PicklistEntry'],
      soapType: 'string',
      valueRequired: 'boolean',
    },
  },
  PicklistEntry: {
    type: 'PicklistEntry',
    props: {
      active: 'boolean',
      defaultValue: 'boolean',
      label: 'string',
      validFor: '?string',
      value: 'string',
    },
  },
  ListMetadataQuery: {
    type: 'ListMetadataQuery',
    props: {
      folder: '?string',
      type: 'string',
    },
  },
  ReadResult: {
    type: 'ReadResult',
    props: {
      records: ['Metadata'],
    },
  },
  RetrieveRequest: {
    type: 'RetrieveRequest',
    props: {
      apiVersion: 'number',
      packageNames: ['string'],
      singlePackage: 'boolean',
      specificFiles: ['string'],
      unpackaged: '?Package',
    },
  },
  UpsertResult: {
    type: 'UpsertResult',
    props: {
      created: 'boolean',
      errors: ['Error'],
      fullName: 'string',
      success: 'boolean',
    },
  },
  LogInfo: {
    type: 'LogInfo',
    props: {
      category: 'string',
      level: 'string',
    },
  },
} as const;

export type CancelDeployResult = {
  done: boolean;
  id: string;
};

export type DeployResult = {
  canceledBy?: string | null | undefined;
  canceledByName?: string | null | undefined;
  checkOnly: boolean;
  completedDate?: string | null | undefined;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  details: DeployDetails;
  done: boolean;
  errorMessage?: string | null | undefined;
  errorStatusCode?: string | null | undefined;
  id: string;
  ignoreWarnings: boolean;
  lastModifiedDate?: string | null | undefined;
  numberComponentErrors: number;
  numberComponentsDeployed: number;
  numberComponentsTotal: number;
  numberTestErrors: number;
  numberTestsCompleted: number;
  numberTestsTotal: number;
  rollbackOnError: boolean;
  runTestsEnabled: boolean;
  startDate?: string | null | undefined;
  stateDetail?: string | null | undefined;
  status: string;
  success: boolean;
};

export type DeployDetails = {
  componentFailures: DeployMessage[];
  componentSuccesses: DeployMessage[];
  retrieveResult?: RetrieveResult | null | undefined;
  runTestResult?: RunTestsResult | null | undefined;
};

export type DeployMessage = {
  changed: boolean;
  columnNumber?: number | null | undefined;
  componentType?: string | null | undefined;
  created: boolean;
  createdDate: string;
  deleted: boolean;
  fileName: string;
  fullName: string;
  id?: string | null | undefined;
  lineNumber?: number | null | undefined;
  problem?: string | null | undefined;
  problemType?: string | null | undefined;
  success: boolean;
};

export type RetrieveResult = {
  done: boolean;
  errorMessage?: string | null | undefined;
  errorStatusCode?: string | null | undefined;
  fileProperties: FileProperties[];
  id: string;
  messages: RetrieveMessage[];
  status: string;
  success: boolean;
  zipFile: string;
};

export type FileProperties = {
  createdById: string;
  createdByName: string;
  createdDate: string;
  fileName: string;
  fullName: string;
  id: string;
  lastModifiedById: string;
  lastModifiedByName: string;
  lastModifiedDate: string;
  manageableState?: string | null | undefined;
  namespacePrefix?: string | null | undefined;
  type: string;
};

export type RetrieveMessage = {
  fileName: string;
  problem: string;
};

export type RunTestsResult = {
  apexLogId?: string | null | undefined;
  codeCoverage: CodeCoverageResult[];
  codeCoverageWarnings: CodeCoverageWarning[];
  failures: RunTestFailure[];
  flowCoverage: FlowCoverageResult[];
  flowCoverageWarnings: FlowCoverageWarning[];
  numFailures: number;
  numTestsRun: number;
  successes: RunTestSuccess[];
  totalTime: number;
};

export type CodeCoverageResult = {
  dmlInfo: CodeLocation[];
  id: string;
  locationsNotCovered: CodeLocation[];
  methodInfo: CodeLocation[];
  name: string;
  namespace?: string | null | undefined;
  numLocations: number;
  numLocationsNotCovered: number;
  soqlInfo: CodeLocation[];
  soslInfo: CodeLocation[];
  type: string;
};

export type CodeLocation = {
  column: number;
  line: number;
  numExecutions: number;
  time: number;
};

export type CodeCoverageWarning = {
  id: string;
  message: string;
  name?: string | null | undefined;
  namespace?: string | null | undefined;
};

export type RunTestFailure = {
  id: string;
  message: string;
  methodName?: string | null | undefined;
  name: string;
  namespace?: string | null | undefined;
  packageName: string;
  seeAllData?: boolean | null | undefined;
  stackTrace?: string | null | undefined;
  time: number;
  type: string;
};

export type FlowCoverageResult = {
  elementsNotCovered: string[];
  flowId: string;
  flowName: string;
  flowNamespace?: string | null | undefined;
  numElements: number;
  numElementsNotCovered: number;
  processType: string;
};

export type FlowCoverageWarning = {
  flowId?: string | null | undefined;
  flowName?: string | null | undefined;
  flowNamespace?: string | null | undefined;
  message: string;
};

export type RunTestSuccess = {
  id: string;
  methodName: string;
  name: string;
  namespace?: string | null | undefined;
  seeAllData?: boolean | null | undefined;
  time: number;
};

export type Metadata = {
  fullName?: string | null | undefined;
};

export type AccountRelationshipShareRule = Metadata & {
  accessLevel: string;
  accountToCriteriaField: string;
  description?: string | null | undefined;
  entityType: string;
  masterLabel: string;
  staticFormulaCriteria?: string | null | undefined;
  type: string;
};

export type AccountSettings = Metadata & {
  enableAccountHistoryTracking?: boolean | null | undefined;
  enableAccountInsightsInMobile?: boolean | null | undefined;
  enableAccountOwnerReport?: boolean | null | undefined;
  enableAccountTeams?: boolean | null | undefined;
  enableContactHistoryTracking?: boolean | null | undefined;
  enableRelateContactToMultipleAccounts?: boolean | null | undefined;
  showViewHierarchyLink?: boolean | null | undefined;
};

export type ActionLinkGroupTemplate = Metadata & {
  actionLinkTemplates: ActionLinkTemplate[];
  category: string;
  executionsAllowed: string;
  hoursUntilExpiration?: number | null | undefined;
  isPublished: boolean;
  name: string;
};

export type ActionLinkTemplate = {
  actionUrl: string;
  headers?: string | null | undefined;
  isConfirmationRequired: boolean;
  isGroupDefault: boolean;
  label?: string | null | undefined;
  labelKey: string;
  linkType: string;
  method: string;
  position: number;
  requestBody?: string | null | undefined;
  userAlias?: string | null | undefined;
  userVisibility: string;
};

export type ActionPlanTemplate = Metadata & {
  actionPlanTemplateItem: ActionPlanTemplateItem[];
  description?: string | null | undefined;
  name: string;
  targetEntityType: string;
  uniqueName: string;
};

export type ActionPlanTemplateItem = {
  actionPlanTemplateItemValue: ActionPlanTemplateItemValue[];
  displayOrder?: number | null | undefined;
  isRequired?: boolean | null | undefined;
  name: string;
  uniqueName: string;
};

export type ActionPlanTemplateItemValue = {
  name: string;
  valueFormula?: string | null | undefined;
  valueLiteral?: string | null | undefined;
};

export type ActionsSettings = Metadata & {
  enableDefaultQuickActionsOn?: boolean | null | undefined;
  enableMdpEnabled?: boolean | null | undefined;
  enableThirdPartyActions?: boolean | null | undefined;
};

export type ActivitiesSettings = Metadata & {
  allowUsersToRelateMultipleContactsToTasksAndEvents?:
    | boolean
    | null
    | undefined;
  autoRelateEventAttendees?: boolean | null | undefined;
  enableActivityReminders?: boolean | null | undefined;
  enableClickCreateEvents?: boolean | null | undefined;
  enableDragAndDropScheduling?: boolean | null | undefined;
  enableEmailTracking?: boolean | null | undefined;
  enableGroupTasks?: boolean | null | undefined;
  enableListViewScheduling?: boolean | null | undefined;
  enableLogNote?: boolean | null | undefined;
  enableMultidayEvents?: boolean | null | undefined;
  enableRecurringEvents?: boolean | null | undefined;
  enableRecurringTasks?: boolean | null | undefined;
  enableRollUpActivToContactsAcct?: boolean | null | undefined;
  enableSidebarCalendarShortcut?: boolean | null | undefined;
  enableSimpleTaskCreateUI?: boolean | null | undefined;
  enableUNSTaskDelegatedToNotifications?: boolean | null | undefined;
  enableUserListViewCalendars?: boolean | null | undefined;
  meetingRequestsLogo?: string | null | undefined;
  showCustomLogoMeetingRequests?: boolean | null | undefined;
  showEventDetailsMultiUserCalendar?: boolean | null | undefined;
  showHomePageHoverLinksForEvents?: boolean | null | undefined;
  showMyTasksHoverLinks?: boolean | null | undefined;
};

export type AddressSettings = Metadata & {
  countriesAndStates: CountriesAndStates;
};

export type CountriesAndStates = {
  countries: Country[];
};

export type Country = {
  active: boolean;
  integrationValue: string;
  isoCode: string;
  label: string;
  orgDefault: boolean;
  standard: boolean;
  states: State[];
  visible: boolean;
};

export type State = {
  active: boolean;
  integrationValue: string;
  isoCode: string;
  label: string;
  standard: boolean;
  visible: boolean;
};

export type AnalyticSnapshot = Metadata & {
  description?: string | null | undefined;
  groupColumn?: string | null | undefined;
  mappings: AnalyticSnapshotMapping[];
  name: string;
  runningUser?: string | null | undefined;
  sourceReport: string;
  targetObject: string;
};

export type AnalyticSnapshotMapping = {
  aggregateType?: string | null | undefined;
  sourceField: string;
  sourceType: string;
  targetField: string;
};

export type AnalyticsSettings = Metadata & {
  alwaysGenPreviews?: boolean | null | undefined;
  analyticsAdoptionMetadata?: boolean | null | undefined;
  canAccessAnalyticsViaAPI?: boolean | null | undefined;
  canAnnotateDashboards?: boolean | null | undefined;
  canEnableSavedView?: boolean | null | undefined;
  canExploreDataConversationally?: boolean | null | undefined;
  canShareAppsWithCommunities?: boolean | null | undefined;
  canSubscribeDashboardWidgets?: boolean | null | undefined;
  canViewThumbnailAssets?: boolean | null | undefined;
  enableAnalyticsSubtotals?: boolean | null | undefined;
  enableAutoCompleteCombo?: boolean | null | undefined;
  enableDashboardComponentSnapshot?: boolean | null | undefined;
  enableDashboardFlexiTable?: boolean | null | undefined;
  enableEmailReportsToPortalUsers?: boolean | null | undefined;
  enableFloatingReportHeaders?: boolean | null | undefined;
  enableInsights?: boolean | null | undefined;
  enableLightningReportBuilder?: boolean | null | undefined;
  enableLotusNotesImages?: boolean | null | undefined;
  enableMassEnableReportBuilder?: boolean | null | undefined;
  enableNewChartsEngine?: boolean | null | undefined;
  enablePowerInsights?: boolean | null | undefined;
  enableRemoveFooterForRepDisplay?: boolean | null | undefined;
  enableRemoveFooterFromRepExp?: boolean | null | undefined;
  enableReportFieldToFieldPref?: boolean | null | undefined;
  enableReportUniqueRowCountPref?: boolean | null | undefined;
  enableSFXJoinedReportsEnable?: boolean | null | undefined;
  enableSmartDataDiscovery?: boolean | null | undefined;
  enableUseOldChartsLookAndFeel?: boolean | null | undefined;
  enableWaveReplication?: boolean | null | undefined;
  enableWaveSharingInheritance?: boolean | null | undefined;
  enableWaveTemplate?: boolean | null | undefined;
  enableWaveTrendedDatasetCleanup?: boolean | null | undefined;
};

export type AnimationRule = Metadata & {
  animationFrequency: string;
  developerName: string;
  isActive: boolean;
  masterLabel: string;
  recordTypeContext: string;
  recordTypeName?: string | null | undefined;
  sobjectType: string;
  targetField: string;
  targetFieldChangeToValues: string;
};

export type ApexSettings = Metadata & {
  enableAggregateCodeCoverageOnly?: boolean | null | undefined;
  enableApexAccessRightsPref?: boolean | null | undefined;
  enableApexApprovalLockUnlock?: boolean | null | undefined;
  enableApexCtrlImplicitWithSharingPref?: boolean | null | undefined;
  enableApexPropertyGetterPref?: boolean | null | undefined;
  enableAuraApexCtrlAuthUserAccessCheckPref?: boolean | null | undefined;
  enableAuraApexCtrlGuestUserAccessCheckPref?: boolean | null | undefined;
  enableCompileOnDeploy?: boolean | null | undefined;
  enableDisableParallelApexTesting?: boolean | null | undefined;
  enableDoNotEmailDebugLog?: boolean | null | undefined;
  enableGaplessTestAutoNum?: boolean | null | undefined;
  enableMngdCtrlActionAccessPref?: boolean | null | undefined;
  enableNonCertifiedApexMdCrud?: boolean | null | undefined;
};

export type ApexTestSuite = Metadata & {
  testClassName: string[];
};

export type AppExperienceSettings = Metadata & {
  doesHideAllAppsInAppLauncher?: boolean | null | undefined;
};

export type AppMenu = Metadata & {
  appMenuItems: AppMenuItem[];
};

export type AppMenuItem = {
  name: string;
  type: string;
};

export type AppointmentSchedulingPolicy = Metadata & {
  appointmentStartTimeInterval: string;
  masterLabel: string;
  shouldConsiderCalendarEvents: boolean;
  shouldEnforceExcludedResource: boolean;
  shouldEnforceRequiredResource: boolean;
  shouldMatchSkill: boolean;
  shouldMatchSkillLevel: boolean;
  shouldRespectVisitingHours: boolean;
  shouldUsePrimaryMembers: boolean;
  shouldUseSecondaryMembers: boolean;
};

export type ApprovalProcess = Metadata & {
  active: boolean;
  allowRecall?: boolean | null | undefined;
  allowedSubmitters: ApprovalSubmitter[];
  approvalPageFields?: ApprovalPageField | null | undefined;
  approvalStep: ApprovalStep[];
  description?: string | null | undefined;
  emailTemplate?: string | null | undefined;
  enableMobileDeviceAccess?: boolean | null | undefined;
  entryCriteria?: ApprovalEntryCriteria | null | undefined;
  finalApprovalActions?: ApprovalAction | null | undefined;
  finalApprovalRecordLock?: boolean | null | undefined;
  finalRejectionActions?: ApprovalAction | null | undefined;
  finalRejectionRecordLock?: boolean | null | undefined;
  initialSubmissionActions?: ApprovalAction | null | undefined;
  label: string;
  nextAutomatedApprover?: NextAutomatedApprover | null | undefined;
  postTemplate?: string | null | undefined;
  recallActions?: ApprovalAction | null | undefined;
  recordEditability: string;
  showApprovalHistory?: boolean | null | undefined;
};

export type ApprovalSubmitter = {
  submitter?: string | null | undefined;
  type: string;
};

export type ApprovalPageField = {
  field: string[];
};

export type ApprovalStep = {
  allowDelegate?: boolean | null | undefined;
  approvalActions?: ApprovalAction | null | undefined;
  assignedApprover: ApprovalStepApprover;
  description?: string | null | undefined;
  entryCriteria?: ApprovalEntryCriteria | null | undefined;
  ifCriteriaNotMet?: string | null | undefined;
  label: string;
  name: string;
  rejectBehavior?: ApprovalStepRejectBehavior | null | undefined;
  rejectionActions?: ApprovalAction | null | undefined;
};

export type ApprovalAction = {
  action: WorkflowActionReference[];
};

export type WorkflowActionReference = {
  name: string;
  type: string;
};

export type ApprovalStepApprover = {
  approver: Approver[];
  whenMultipleApprovers?: string | null | undefined;
};

export type Approver = {
  name?: string | null | undefined;
  type: string;
};

export type ApprovalEntryCriteria = {
  booleanFilter?: string | null | undefined;
  criteriaItems: FilterItem[];
  formula?: string | null | undefined;
};

export type FilterItem = {
  field: string;
  operation: string;
  value?: string | null | undefined;
  valueField?: string | null | undefined;
};

export type DuplicateRuleFilterItem = FilterItem & {
  sortOrder: number;
  table: string;
};

export type ApprovalStepRejectBehavior = {
  type: string;
};

export type NextAutomatedApprover = {
  useApproverFieldOfRecordOwner?: boolean | null | undefined;
  userHierarchyField: string;
};

export type ArchiveSettings = Metadata & {
  enableEntityArchivingEnabled?: boolean | null | undefined;
};

export type AssignmentRule = Metadata & {
  active?: boolean | null | undefined;
  ruleEntry: RuleEntry[];
};

export type RuleEntry = {
  assignedTo?: string | null | undefined;
  assignedToType?: string | null | undefined;
  booleanFilter?: string | null | undefined;
  businessHours?: string | null | undefined;
  businessHoursSource?: string | null | undefined;
  criteriaItems: FilterItem[];
  disableEscalationWhenModified?: boolean | null | undefined;
  escalationAction: EscalationAction[];
  escalationStartTime?: string | null | undefined;
  formula?: string | null | undefined;
  notifyCcRecipients?: boolean | null | undefined;
  overrideExistingTeams?: boolean | null | undefined;
  replyToEmail?: string | null | undefined;
  senderEmail?: string | null | undefined;
  senderName?: string | null | undefined;
  team: string[];
  template?: string | null | undefined;
};

export type EscalationAction = {
  assignedTo?: string | null | undefined;
  assignedToTemplate?: string | null | undefined;
  assignedToType?: string | null | undefined;
  minutesToEscalation?: number | null | undefined;
  notifyCaseOwner?: boolean | null | undefined;
  notifyEmail: string[];
  notifyTo?: string | null | undefined;
  notifyToTemplate?: string | null | undefined;
};

export type AssignmentRules = Metadata & {
  assignmentRule: AssignmentRule[];
};

export type Audience = Metadata & {
  audienceName: string;
  container: string;
  criteria: AudienceCriteria;
  description?: string | null | undefined;
  formula?: string | null | undefined;
  formulaFilterType?: string | null | undefined;
  targets?: PersonalizationTargetInfos | null | undefined;
};

export type AudienceCriteria = {
  criterion: AudienceCriterion[];
};

export type AudienceCriterion = {
  criteriaNumber?: number | null | undefined;
  criterionValue?: AudienceCriteriaValue | null | undefined;
  operator?: string | null | undefined;
  type: string;
};

export type AudienceCriteriaValue = {
  city?: string | null | undefined;
  country?: string | null | undefined;
  domain?: string | null | undefined;
  entityField?: string | null | undefined;
  entityType?: string | null | undefined;
  fieldValue?: string | null | undefined;
  isEnabled?: string | null | undefined;
  permissionName?: string | null | undefined;
  permissionType?: string | null | undefined;
  profile?: string | null | undefined;
  subdivision?: string | null | undefined;
};

export type PersonalizationTargetInfos = {
  target: PersonalizationTargetInfo[];
};

export type PersonalizationTargetInfo = {
  groupName: string;
  priority?: number | null | undefined;
  targetType: string;
  targetValue: string;
};

export type AuraDefinitionBundle = Metadata & {
  SVGContent?: string | null | undefined;
  apiVersion?: number | null | undefined;
  controllerContent?: string | null | undefined;
  description?: string | null | undefined;
  designContent?: string | null | undefined;
  documentationContent?: string | null | undefined;
  helperContent?: string | null | undefined;
  markup?: string | null | undefined;
  modelContent?: string | null | undefined;
  packageVersions: PackageVersion[];
  rendererContent?: string | null | undefined;
  styleContent?: string | null | undefined;
  testsuiteContent?: string | null | undefined;
  type?: string | null | undefined;
};

export type PackageVersion = {
  majorNumber: number;
  minorNumber: number;
  namespace: string;
};

export type AuthProvider = Metadata & {
  appleTeam?: string | null | undefined;
  authorizeUrl?: string | null | undefined;
  consumerKey?: string | null | undefined;
  consumerSecret?: string | null | undefined;
  customMetadataTypeRecord?: string | null | undefined;
  defaultScopes?: string | null | undefined;
  ecKey?: string | null | undefined;
  errorUrl?: string | null | undefined;
  executionUser?: string | null | undefined;
  friendlyName: string;
  iconUrl?: string | null | undefined;
  idTokenIssuer?: string | null | undefined;
  includeOrgIdInIdentifier?: boolean | null | undefined;
  linkKickoffUrl?: string | null | undefined;
  logoutUrl?: string | null | undefined;
  oauthKickoffUrl?: string | null | undefined;
  plugin?: string | null | undefined;
  portal?: string | null | undefined;
  providerType: string;
  registrationHandler?: string | null | undefined;
  sendAccessTokenInHeader?: boolean | null | undefined;
  sendClientCredentialsInHeader?: boolean | null | undefined;
  sendSecretInApis?: boolean | null | undefined;
  ssoKickoffUrl?: string | null | undefined;
  tokenUrl?: string | null | undefined;
  userInfoUrl?: string | null | undefined;
};

export type AutoResponseRule = Metadata & {
  active?: boolean | null | undefined;
  ruleEntry: RuleEntry[];
};

export type AutoResponseRules = Metadata & {
  autoResponseRule: AutoResponseRule[];
};

export type BlockchainSettings = Metadata & {
  enableBcp?: boolean | null | undefined;
  enableBcpCoin?: boolean | null | undefined;
};

export type Bot = Metadata & {
  botMlDomain?: LocalMlDomain | null | undefined;
  botUser?: string | null | undefined;
  botVersions: BotVersion[];
  contextVariables: ConversationContextVariable[];
  description?: string | null | undefined;
  label?: string | null | undefined;
};

export type LocalMlDomain = {
  label: string;
  mlIntents: MlIntent[];
  mlSlotClasses: MlSlotClass[];
  name: string;
};

export type MlIntent = {
  description?: string | null | undefined;
  developerName: string;
  label: string;
  mlIntentUtterances: MlIntentUtterance[];
  relatedMlIntents: MlRelatedIntent[];
};

export type MlIntentUtterance = {
  utterance: string;
};

export type MlRelatedIntent = {
  relatedMlIntent: string;
};

export type MlSlotClass = {
  dataType: string;
  description?: string | null | undefined;
  developerName: string;
  extractionRegex?: string | null | undefined;
  extractionType?: string | null | undefined;
  label: string;
  mlSlotClassValues: MlSlotClassValue[];
};

export type MlSlotClassValue = {
  synonymGroup?: SynonymGroup | null | undefined;
  value: string;
};

export type SynonymGroup = {
  languages: string[];
  terms: string[];
};

export type BotVersion = Metadata & {
  botDialogGroups: BotDialogGroup[];
  botDialogs: BotDialog[];
  conversationVariables: ConversationVariable[];
  entryDialog: string;
  mainMenuDialog: string;
  responseDelayMilliseconds?: number | null | undefined;
};

export type BotDialogGroup = {
  description?: string | null | undefined;
  developerName: string;
  label: string;
};

export type BotDialog = {
  botDialogGroup?: string | null | undefined;
  botSteps: BotStep[];
  description?: string | null | undefined;
  developerName: string;
  label: string;
  mlIntent?: string | null | undefined;
  mlIntentTrainingEnabled?: boolean | null | undefined;
  showInFooterMenu?: boolean | null | undefined;
};

export type BotStep = {
  booleanFilter?: string | null | undefined;
  botInvocation?: BotInvocation | null | undefined;
  botMessages: BotMessage[];
  botNavigation?: BotNavigation | null | undefined;
  botStepConditions: BotStepCondition[];
  botSteps: BotStep[];
  botVariableOperation?: BotVariableOperation | null | undefined;
  conversationRecordLookup?: ConversationRecordLookup | null | undefined;
  conversationSystemMessage?: ConversationSystemMessage | null | undefined;
  type: string;
};

export type BotInvocation = {
  invocationActionName?: string | null | undefined;
  invocationActionType?: string | null | undefined;
  invocationMappings: BotInvocationMapping[];
};

export type BotInvocationMapping = {
  parameterName: string;
  type: string;
  value?: string | null | undefined;
  variableName?: string | null | undefined;
  variableType?: string | null | undefined;
};

export type BotMessage = {
  message: string;
};

export type BotNavigation = {
  botNavigationLinks: BotNavigationLink[];
  type: string;
};

export type BotNavigationLink = {
  label?: string | null | undefined;
  targetBotDialog: string;
};

export type BotStepCondition = {
  leftOperandName: string;
  leftOperandType: string;
  operatorType: string;
  rightOperandValue?: string | null | undefined;
};

export type BotVariableOperation = {
  botInvocation?: BotInvocation | null | undefined;
  botMessages: BotMessage[];
  botQuickReplyOptions: BotQuickReplyOption[];
  botVariableOperands: BotVariableOperand[];
  invalidInputBotNavigation?: BotNavigation | null | undefined;
  quickReplyOptionTemplate?: string | null | undefined;
  quickReplyType?: string | null | undefined;
  quickReplyWidgetType?: string | null | undefined;
  sourceVariableName?: string | null | undefined;
  sourceVariableType?: string | null | undefined;
  type: string;
};

export type BotQuickReplyOption = {
  literalValue: string;
};

export type BotVariableOperand = {
  disableAutoFill?: boolean | null | undefined;
  sourceName?: string | null | undefined;
  sourceType?: string | null | undefined;
  sourceValue?: string | null | undefined;
  targetName: string;
  targetType: string;
};

export type ConversationRecordLookup = {
  SObjectType: string;
  lookupFields: ConversationRecordLookupField[];
  maxLookupResults: number;
  sourceVariableName: string;
  sourceVariableType: string;
  targetVariableName: string;
};

export type ConversationRecordLookupField = {
  fieldName: string;
};

export type ConversationSystemMessage = {
  systemMessageMappings: ConversationSystemMessageMapping[];
  type: string;
};

export type ConversationSystemMessageMapping = {
  mappingType: string;
  parameterType: string;
  variableName: string;
};

export type ConversationVariable = {
  SObjectType?: string | null | undefined;
  collectionType?: string | null | undefined;
  dataType: string;
  developerName: string;
  label: string;
};

export type ConversationContextVariable = {
  SObjectType?: string | null | undefined;
  contextVariableMappings: ConversationContextVariableMapping[];
  dataType: string;
  developerName: string;
  label: string;
};

export type ConversationContextVariableMapping = {
  SObjectType: string;
  fieldName: string;
  messageType: string;
};

export type BotSettings = Metadata & {
  enableBots?: boolean | null | undefined;
};

export type BrandingSet = Metadata & {
  brandingSetProperty: BrandingSetProperty[];
  description?: string | null | undefined;
  masterLabel: string;
  type?: string | null | undefined;
};

export type BrandingSetProperty = {
  propertyName: string;
  propertyValue?: string | null | undefined;
};

export type BusinessHoursEntry = Metadata & {
  active?: boolean | null | undefined;
  default: boolean;
  fridayEndTime?: string | null | undefined;
  fridayStartTime?: string | null | undefined;
  mondayEndTime?: string | null | undefined;
  mondayStartTime?: string | null | undefined;
  name?: string | null | undefined;
  saturdayEndTime?: string | null | undefined;
  saturdayStartTime?: string | null | undefined;
  sundayEndTime?: string | null | undefined;
  sundayStartTime?: string | null | undefined;
  thursdayEndTime?: string | null | undefined;
  thursdayStartTime?: string | null | undefined;
  timeZoneId?: string | null | undefined;
  tuesdayEndTime?: string | null | undefined;
  tuesdayStartTime?: string | null | undefined;
  wednesdayEndTime?: string | null | undefined;
  wednesdayStartTime?: string | null | undefined;
};

export type BusinessHoursSettings = Metadata & {
  businessHours: BusinessHoursEntry[];
  holidays: Holiday[];
};

export type Holiday = {
  activityDate?: string | null | undefined;
  businessHours: string[];
  description?: string | null | undefined;
  endTime?: string | null | undefined;
  isRecurring?: boolean | null | undefined;
  name?: string | null | undefined;
  recurrenceDayOfMonth?: number | null | undefined;
  recurrenceDayOfWeek: string[];
  recurrenceDayOfWeekMask?: number | null | undefined;
  recurrenceEndDate?: string | null | undefined;
  recurrenceInstance?: string | null | undefined;
  recurrenceInterval?: number | null | undefined;
  recurrenceMonthOfYear?: string | null | undefined;
  recurrenceStartDate?: string | null | undefined;
  recurrenceType?: string | null | undefined;
  startTime?: string | null | undefined;
};

export type BusinessProcess = Metadata & {
  description?: string | null | undefined;
  isActive?: boolean | null | undefined;
  values: PicklistValue[];
};

export type PicklistValue = Metadata & {
  color?: string | null | undefined;
  default: boolean;
  description?: string | null | undefined;
  isActive?: boolean | null | undefined;
  allowEmail?: boolean | null | undefined;
  closed?: boolean | null | undefined;
  controllingFieldValues: string[];
  converted?: boolean | null | undefined;
  cssExposed?: boolean | null | undefined;
  forecastCategory?: string | null | undefined;
  highPriority?: boolean | null | undefined;
  probability?: number | null | undefined;
  reverseRole?: string | null | undefined;
  reviewed?: boolean | null | undefined;
  won?: boolean | null | undefined;
};

export type CMSConnectSource = Metadata & {
  cmsConnectAsset: CMSConnectAsset[];
  cmsConnectLanguage: CMSConnectLanguage[];
  cmsConnectPersonalization?: CMSConnectPersonalization | null | undefined;
  cmsConnectResourceType: CMSConnectResourceType[];
  connectionType: string;
  cssScope?: string | null | undefined;
  developerName: string;
  languageEnabled?: string | null | undefined;
  masterLabel: string;
  namedCredential?: string | null | undefined;
  personalizationEnabled?: string | null | undefined;
  rootPath?: string | null | undefined;
  sortOrder: number;
  status: string;
  type: string;
  websiteUrl?: string | null | undefined;
};

export type CMSConnectAsset = {
  assetPath: string;
  assetType: string;
  sortOrder: number;
};

export type CMSConnectLanguage = {
  cmsLanguage: string;
  language: string;
};

export type CMSConnectPersonalization = {
  connectorPage: string;
  connectorPageAsset: string;
};

export type CMSConnectResourceType = {
  cmsConnectResourceDefinition: CMSConnectResourceDefinition[];
  developerName: string;
  masterLabel: string;
  resourceType: string;
};

export type CMSConnectResourceDefinition = {
  developerName: string;
  masterLabel: string;
  options: number;
  payloadType: string;
  resourceIdPath?: string | null | undefined;
  resourceNamePath?: string | null | undefined;
  resourcePath: string;
  rootNodePath?: string | null | undefined;
};

export type CallCenter = Metadata & {
  adapterUrl?: string | null | undefined;
  customSettings?: string | null | undefined;
  displayName: string;
  displayNameLabel: string;
  internalNameLabel: string;
  sections: CallCenterSection[];
  version?: string | null | undefined;
};

export type CallCenterSection = {
  items: CallCenterItem[];
  label: string;
  name: string;
};

export type CallCenterItem = {
  label: string;
  name: string;
  value: string;
};

export type CampaignInfluenceModel = Metadata & {
  isActive?: boolean | null | undefined;
  isDefaultModel: boolean;
  isModelLocked: boolean;
  modelDescription?: string | null | undefined;
  name: string;
  recordPreference?: string | null | undefined;
};

export type CampaignSettings = Metadata & {
  enableAutoCampInfluenceDisabled?: boolean | null | undefined;
  enableB2bmaCampaignInfluence2?: boolean | null | undefined;
  enableCampaignHistoryTrackEnabled?: boolean | null | undefined;
  enableCampaignInfluence2?: boolean | null | undefined;
  enableCampaignMemberTWCF?: boolean | null | undefined;
  enableSuppressNoValueCI2?: boolean | null | undefined;
};

export type CanvasMetadata = Metadata & {
  accessMethod: string;
  canvasOptions?: string | null | undefined;
  canvasUrl: string;
  lifecycleClass?: string | null | undefined;
  locationOptions?: string | null | undefined;
  samlInitiationMethod?: string | null | undefined;
};

export type CaseClassificationSettings = Metadata & {
  caseClassificationRecommendations?: boolean | null | undefined;
  reRunAttributeBasedRules?: boolean | null | undefined;
  runAssignmentRules?: boolean | null | undefined;
};

export type CaseSettings = Metadata & {
  caseAssignNotificationTemplate?: string | null | undefined;
  caseAutoProcUser?: boolean | null | undefined;
  caseCloseNotificationTemplate?: string | null | undefined;
  caseCommentNotificationTemplate?: string | null | undefined;
  caseCreateNotificationTemplate?: string | null | undefined;
  caseFeedItemSettings: FeedItemSettings[];
  caseFeedReadUnreadLtng?: boolean | null | undefined;
  caseMergeInLightning?: boolean | null | undefined;
  closeCaseThroughStatusChange?: boolean | null | undefined;
  defaultCaseFeedLayoutOn?: boolean | null | undefined;
  defaultCaseOwner?: string | null | undefined;
  defaultCaseOwnerType?: string | null | undefined;
  defaultCaseUser?: string | null | undefined;
  emailActionDefaultsHandlerClass?: string | null | undefined;
  emailToCase?: EmailToCaseSettings | null | undefined;
  enableCaseFeed?: boolean | null | undefined;
  enableCollapseEmailThread?: boolean | null | undefined;
  enableDraftEmails?: boolean | null | undefined;
  enableEarlyEscalationRuleTriggers?: boolean | null | undefined;
  enableEmailActionDefaultsHandler?: boolean | null | undefined;
  enableSuggestedArticlesApplication?: boolean | null | undefined;
  enableSuggestedArticlesCustomerPortal?: boolean | null | undefined;
  enableSuggestedArticlesPartnerPortal?: boolean | null | undefined;
  enableSuggestedSolutions?: boolean | null | undefined;
  escalateCaseBefore?: boolean | null | undefined;
  genericMessageEnabled?: boolean | null | undefined;
  keepRecordTypeOnAssignmentRule?: boolean | null | undefined;
  notifyContactOnCaseComment?: boolean | null | undefined;
  notifyDefaultCaseOwner?: boolean | null | undefined;
  notifyOwnerOnCaseComment?: boolean | null | undefined;
  notifyOwnerOnCaseOwnerChange?: boolean | null | undefined;
  predictiveSupportEnabled?: boolean | null | undefined;
  showEmailAttachmentsInCaseAttachmentsRL?: boolean | null | undefined;
  showFewerCloseActions?: boolean | null | undefined;
  systemUserEmail?: string | null | undefined;
  useSystemEmailAddress?: boolean | null | undefined;
  useSystemUserAsDefaultCaseUser?: boolean | null | undefined;
  webToCase?: WebToCaseSettings | null | undefined;
};

export type FeedItemSettings = {
  characterLimit?: number | null | undefined;
  displayFormat?: string | null | undefined;
  feedItemType: string;
};

export type EmailToCaseSettings = {
  enableE2CAttachmentAsFile?: boolean | null | undefined;
  enableE2CSourceTracking?: boolean | null | undefined;
  enableEmailToCase?: boolean | null | undefined;
  enableHtmlEmail?: boolean | null | undefined;
  enableOnDemandEmailToCase?: boolean | null | undefined;
  enableThreadIDInBody?: boolean | null | undefined;
  enableThreadIDInSubject?: boolean | null | undefined;
  notifyOwnerOnNewCaseEmail?: boolean | null | undefined;
  overEmailLimitAction?: string | null | undefined;
  preQuoteSignature?: boolean | null | undefined;
  routingAddresses: EmailToCaseRoutingAddress[];
  unauthorizedSenderAction?: string | null | undefined;
};

export type EmailToCaseRoutingAddress = {
  addressType?: string | null | undefined;
  authorizedSenders?: string | null | undefined;
  caseOrigin?: string | null | undefined;
  caseOwner?: string | null | undefined;
  caseOwnerType?: string | null | undefined;
  casePriority?: string | null | undefined;
  createTask?: boolean | null | undefined;
  emailAddress?: string | null | undefined;
  emailServicesAddress?: string | null | undefined;
  isVerified?: boolean | null | undefined;
  routingName?: string | null | undefined;
  saveEmailHeaders?: boolean | null | undefined;
  taskStatus?: string | null | undefined;
};

export type WebToCaseSettings = {
  caseOrigin?: string | null | undefined;
  defaultResponseTemplate?: string | null | undefined;
  enableWebToCase?: boolean | null | undefined;
};

export type CaseSubjectParticle = Metadata & {
  index: number;
  textField?: string | null | undefined;
  type: string;
};

export type ChannelLayout = Metadata & {
  enabledChannels: string[];
  label: string;
  layoutItems: ChannelLayoutItem[];
  recordType?: string | null | undefined;
};

export type ChannelLayoutItem = {
  field: string;
};

export type ChatterAnswersSettings = Metadata & {
  emailFollowersOnBestAnswer?: boolean | null | undefined;
  emailFollowersOnReply?: boolean | null | undefined;
  emailOwnerOnPrivateReply?: boolean | null | undefined;
  emailOwnerOnReply?: boolean | null | undefined;
  enableAnswerViaEmail?: boolean | null | undefined;
  enableChatterAnswers: boolean;
  enableFacebookSSO?: boolean | null | undefined;
  enableInlinePublisher?: boolean | null | undefined;
  enableReputation?: boolean | null | undefined;
  enableRichTextEditor?: boolean | null | undefined;
  facebookAuthProvider?: string | null | undefined;
  showInPortals?: boolean | null | undefined;
};

export type ChatterEmailsMDSettings = Metadata & {
  enableChatterDigestEmailsApiOnly?: boolean | null | undefined;
  enableChatterEmailAttachment?: boolean | null | undefined;
  enableCollaborationEmail?: boolean | null | undefined;
  enableDisplayAppDownloadBadges?: boolean | null | undefined;
  enableEmailReplyToChatter?: boolean | null | undefined;
  enableEmailToChatter?: boolean | null | undefined;
};

export type ChatterExtension = Metadata & {
  compositionComponent: string;
  description: string;
  extensionName: string;
  headerText?: string | null | undefined;
  hoverText?: string | null | undefined;
  icon: string;
  isProtected?: boolean | null | undefined;
  masterLabel: string;
  renderComponent: string;
  type: string;
};

export type ChatterSettings = Metadata & {
  allowChatterGroupArchiving?: boolean | null | undefined;
  allowRecordsInChatterGroup?: boolean | null | undefined;
  allowSharingInChatterGroup?: boolean | null | undefined;
  enableApprovalRequest?: boolean | null | undefined;
  enableChatter?: boolean | null | undefined;
  enableChatterEmoticons?: boolean | null | undefined;
  enableFeedEdit?: boolean | null | undefined;
  enableFeedPinning?: boolean | null | undefined;
  enableFeedsDraftPosts?: boolean | null | undefined;
  enableFeedsRichText?: boolean | null | undefined;
  enableInviteCsnUsers?: boolean | null | undefined;
  enableOutOfOfficeEnabledPref?: boolean | null | undefined;
  enableRichLinkPreviewsInFeed?: boolean | null | undefined;
  enableTodayRecsInFeed?: boolean | null | undefined;
  unlistedGroupsEnabled?: boolean | null | undefined;
};

export type CleanDataService = Metadata & {
  cleanRules: CleanRule[];
  description: string;
  masterLabel: string;
  matchEngine: string;
};

export type CleanRule = {
  bulkEnabled: boolean;
  bypassTriggers: boolean;
  bypassWorkflow: boolean;
  description: string;
  developerName: string;
  fieldMappings: FieldMapping[];
  masterLabel: string;
  matchRule: string;
  sourceSobjectType: string;
  status: string;
  targetSobjectType: string;
};

export type FieldMapping = {
  SObjectType: string;
  developerName: string;
  fieldMappingRows: FieldMappingRow[];
  masterLabel: string;
};

export type FieldMappingRow = {
  SObjectType: string;
  fieldMappingFields: FieldMappingField[];
  fieldName: string;
  mappingOperation: string;
};

export type FieldMappingField = {
  dataServiceField: string;
  dataServiceObjectName: string;
  priority: number;
};

export type CommandAction = Metadata & {
  actionType: string;
  description?: string | null | undefined;
  intents: CommandActionIntent[];
  label: string;
  parameters: CommandActionParam[];
  responseTemplates: CommandActionResponse[];
  target?: string | null | undefined;
};

export type CommandActionIntent = {
  phrase: string;
  responseTemplates: CommandActionResponse[];
};

export type CommandActionResponse = {
  template: string;
};

export type CommandActionParam = {
  defaultValue?: string | null | undefined;
  description?: string | null | undefined;
  name: string;
  required?: boolean | null | undefined;
  type: string;
};

export type CommunitiesSettings = Metadata & {
  canModerateAllFeedPosts?: boolean | null | undefined;
  canModerateInternalFeedPosts?: boolean | null | undefined;
  embeddedVisualforcePages?: boolean | null | undefined;
  enableCommunityWorkspaces?: boolean | null | undefined;
  enableCspContactVisibilityPref?: boolean | null | undefined;
  enableCspNotesOnAccConPref?: boolean | null | undefined;
  enableEnablePRM?: boolean | null | undefined;
  enableExternalAccHierPref?: boolean | null | undefined;
  enableGuestRecordReassignOrgPref?: boolean | null | undefined;
  enableInviteChatterGuestEnabled?: boolean | null | undefined;
  enableNetPortalUserReportOpts?: boolean | null | undefined;
  enableNetworksEnabled?: boolean | null | undefined;
  enableOotbProfExtUserOpsEnable?: boolean | null | undefined;
  enablePRMAccRelPref?: boolean | null | undefined;
  enablePowerCustomerCaseStatus?: boolean | null | undefined;
  enableRelaxPartnerAccountFieldPref?: boolean | null | undefined;
  enableUsernameUniqForOrgPref?: boolean | null | undefined;
};

export type Community = Metadata & {
  active?: boolean | null | undefined;
  chatterAnswersFacebookSsoUrl?: string | null | undefined;
  communityFeedPage?: string | null | undefined;
  dataCategoryName?: string | null | undefined;
  description?: string | null | undefined;
  emailFooterDocument?: string | null | undefined;
  emailHeaderDocument?: string | null | undefined;
  emailNotificationUrl?: string | null | undefined;
  enableChatterAnswers?: boolean | null | undefined;
  enablePrivateQuestions?: boolean | null | undefined;
  expertsGroup?: string | null | undefined;
  portal?: string | null | undefined;
  reputationLevels?: ReputationLevels | null | undefined;
  showInPortal?: boolean | null | undefined;
  site?: string | null | undefined;
};

export type ReputationLevels = {
  chatterAnswersReputationLevels: ChatterAnswersReputationLevel[];
  ideaReputationLevels: IdeaReputationLevel[];
};

export type ChatterAnswersReputationLevel = {
  name: string;
  value: number;
};

export type IdeaReputationLevel = {
  name: string;
  value: number;
};

export type CommunityTemplateDefinition = Metadata & {
  baseTemplate?: string | null | undefined;
  bundlesInfo: CommunityTemplateBundleInfo[];
  category: string;
  defaultBrandingSet?: string | null | undefined;
  defaultThemeDefinition: string;
  description?: string | null | undefined;
  enableExtendedCleanUpOnDelete?: boolean | null | undefined;
  masterLabel: string;
  navigationLinkSet: NavigationLinkSet[];
  pageSetting: CommunityTemplatePageSetting[];
  publisher?: string | null | undefined;
};

export type CommunityTemplateBundleInfo = {
  description?: string | null | undefined;
  image?: string | null | undefined;
  order: number;
  title: string;
  type: string;
};

export type CommunityThemeBundleInfo = CommunityTemplateBundleInfo & {};

export type NavigationLinkSet = {
  navigationMenuItem: NavigationMenuItem[];
};

export type NavigationMenuItem = {
  defaultListViewId?: string | null | undefined;
  label: string;
  menuItemBranding?: NavigationMenuItemBranding | null | undefined;
  position: number;
  publiclyAvailable?: boolean | null | undefined;
  subMenu?: NavigationSubMenu | null | undefined;
  target?: string | null | undefined;
  targetPreference?: string | null | undefined;
  type: string;
};

export type NavigationMenuItemBranding = {
  tileImage?: string | null | undefined;
};

export type NavigationSubMenu = {
  navigationMenuItem: NavigationMenuItem[];
};

export type CommunityTemplatePageSetting = {
  page: string;
  themeLayout: string;
};

export type CommunityThemeDefinition = Metadata & {
  bundlesInfo: CommunityThemeBundleInfo[];
  customThemeLayoutType: CommunityCustomThemeLayoutType[];
  defaultBrandingSet?: string | null | undefined;
  description?: string | null | undefined;
  enableExtendedCleanUpOnDelete?: boolean | null | undefined;
  masterLabel: string;
  publisher?: string | null | undefined;
  themeRouteOverride: CommunityThemeRouteOverride[];
  themeSetting: CommunityThemeSetting[];
};

export type CommunityCustomThemeLayoutType = {
  description?: string | null | undefined;
  label: string;
};

export type CommunityThemeRouteOverride = {
  customThemeLayoutType?: string | null | undefined;
  pageAttributes: string;
  pageType: string;
  themeLayoutType?: string | null | undefined;
};

export type CommunityThemeSetting = {
  customThemeLayoutType?: string | null | undefined;
  themeLayout: string;
  themeLayoutType?: string | null | undefined;
};

export type CompactLayout = Metadata & {
  fields: string[];
  label: string;
};

export type CompanySettings = Metadata & {
  enableCustomFiscalYear: boolean;
  fiscalYear?: FiscalYearSettings | null | undefined;
};

export type FiscalYearSettings = {
  fiscalYearNameBasedOn?: string | null | undefined;
  startMonth?: string | null | undefined;
};

export type ConnectedApp = Metadata & {
  attributes: ConnectedAppAttribute[];
  canvas?: CanvasMetadata | null | undefined;
  canvasConfig?: ConnectedAppCanvasConfig | null | undefined;
  contactEmail: string;
  contactPhone?: string | null | undefined;
  description?: string | null | undefined;
  iconUrl?: string | null | undefined;
  infoUrl?: string | null | undefined;
  ipRanges: ConnectedAppIpRange[];
  label: string;
  logoUrl?: string | null | undefined;
  mobileAppConfig?: ConnectedAppMobileDetailConfig | null | undefined;
  mobileStartUrl?: string | null | undefined;
  oauthConfig?: ConnectedAppOauthConfig | null | undefined;
  permissionSetName: string[];
  plugin?: string | null | undefined;
  pluginExecutionUser?: string | null | undefined;
  profileName: string[];
  samlConfig?: ConnectedAppSamlConfig | null | undefined;
  startUrl?: string | null | undefined;
};

export type ConnectedAppAttribute = {
  formula: string;
  key: string;
};

export type ConnectedAppCanvasConfig = {
  accessMethod: string;
  canvasUrl: string;
  lifecycleClass?: string | null | undefined;
  locations: string[];
  options: string[];
  samlInitiationMethod?: string | null | undefined;
};

export type ConnectedAppIpRange = {
  description?: string | null | undefined;
  end: string;
  start: string;
};

export type ConnectedAppMobileDetailConfig = {
  applicationBinaryFile?: string | null | undefined;
  applicationBinaryFileName?: string | null | undefined;
  applicationBundleIdentifier?: string | null | undefined;
  applicationFileLength?: number | null | undefined;
  applicationIconFile?: string | null | undefined;
  applicationIconFileName?: string | null | undefined;
  applicationInstallUrl?: string | null | undefined;
  devicePlatform: string;
  deviceType?: string | null | undefined;
  minimumOsVersion?: string | null | undefined;
  privateApp?: boolean | null | undefined;
  version: string;
};

export type ConnectedAppOauthConfig = {
  callbackUrl: string;
  certificate?: string | null | undefined;
  consumerKey?: string | null | undefined;
  consumerSecret?: string | null | undefined;
  idTokenConfig?: ConnectedAppOauthIdToken | null | undefined;
  isAdminApproved?: boolean | null | undefined;
  scopes: string[];
  singleLogoutUrl?: string | null | undefined;
};

export type ConnectedAppOauthIdToken = {
  idTokenAudience?: string | null | undefined;
  idTokenIncludeAttributes?: boolean | null | undefined;
  idTokenIncludeCustomPerms?: boolean | null | undefined;
  idTokenIncludeStandardClaims?: boolean | null | undefined;
  idTokenValidity?: number | null | undefined;
};

export type ConnectedAppSamlConfig = {
  acsUrl: string;
  certificate?: string | null | undefined;
  encryptionCertificate?: string | null | undefined;
  encryptionType?: string | null | undefined;
  entityUrl: string;
  issuer?: string | null | undefined;
  samlIdpSLOBindingEnum?: string | null | undefined;
  samlNameIdFormat?: string | null | undefined;
  samlSloUrl?: string | null | undefined;
  samlSubjectCustomAttr?: string | null | undefined;
  samlSubjectType: string;
};

export type ConnectedAppSettings = Metadata & {
  enableAdminApprovedAppsOnly?: boolean | null | undefined;
  enableSkipUserProvisioningWizardWelcomePage?: boolean | null | undefined;
};

export type ContentSettings = Metadata & {
  enableChatterFileLink?: boolean | null | undefined;
  enableContent?: boolean | null | undefined;
  enableContentAutoAssign?: boolean | null | undefined;
  enableContentDistForPortalUsers?: boolean | null | undefined;
  enableContentDistPwOptionsBit1?: boolean | null | undefined;
  enableContentDistPwOptionsBit2?: boolean | null | undefined;
  enableContentDistribution?: boolean | null | undefined;
  enableContentSupportMultiLanguage?: boolean | null | undefined;
  enableContentWorkspaceAccess?: boolean | null | undefined;
  enableFileShareSetByRecord?: boolean | null | undefined;
  enableFilesUsrShareNetRestricted?: boolean | null | undefined;
  enableJPGPreviews?: boolean | null | undefined;
  enableLibraryManagedFiles?: boolean | null | undefined;
  enableSiteGuestUserToUploadFiles?: boolean | null | undefined;
  enableUploadFilesOnAttachments?: boolean | null | undefined;
  skipContentAssetTriggers?: boolean | null | undefined;
  skipContentAssetTriggersOnDeploy?: boolean | null | undefined;
};

export type ContractSettings = Metadata & {
  autoCalculateEndDate?: boolean | null | undefined;
  autoExpirationDelay?: string | null | undefined;
  autoExpirationRecipient?: string | null | undefined;
  autoExpireContracts?: boolean | null | undefined;
  enableContractHistoryTracking?: boolean | null | undefined;
  notifyOwnersOnContractExpiration?: boolean | null | undefined;
};

export type CorsWhitelistOrigin = Metadata & {
  urlPattern: string;
};

export type CspTrustedSite = Metadata & {
  context?: string | null | undefined;
  description?: string | null | undefined;
  endpointUrl: string;
  isActive: boolean;
};

export type CurrencySettings = Metadata & {
  enableCurrencyEffectiveDates?: boolean | null | undefined;
  enableCurrencySymbolWithMultiCurrency?: boolean | null | undefined;
  enableMultiCurrency?: boolean | null | undefined;
  isMultiCurrencyActivationAllowed?: boolean | null | undefined;
  isParenCurrencyConvDisabled?: boolean | null | undefined;
};

export type CustomApplication = Metadata & {
  actionOverrides: AppActionOverride[];
  brand?: AppBrand | null | undefined;
  consoleConfig?: ServiceCloudConsoleConfig | null | undefined;
  defaultLandingTab?: string | null | undefined;
  description?: string | null | undefined;
  formFactors: string[];
  isNavAutoTempTabsDisabled?: boolean | null | undefined;
  isNavPersonalizationDisabled?: boolean | null | undefined;
  isServiceCloudConsole?: boolean | null | undefined;
  label?: string | null | undefined;
  logo?: string | null | undefined;
  navType?: string | null | undefined;
  preferences?: AppPreferences | null | undefined;
  profileActionOverrides: AppProfileActionOverride[];
  setupExperience?: string | null | undefined;
  subscriberTabs: string[];
  tabs: string[];
  uiType?: string | null | undefined;
  utilityBar?: string | null | undefined;
  workspaceConfig?: AppWorkspaceConfig | null | undefined;
};

export type AppActionOverride = ActionOverride & {
  pageOrSobjectType: string;
};

export type ActionOverride = {
  actionName?: string | null | undefined;
  comment?: string | null | undefined;
  content?: string | null | undefined;
  formFactor?: string | null | undefined;
  skipRecordTypeSelect?: boolean | null | undefined;
  type?: string | null | undefined;
};

export type AppBrand = {
  footerColor?: string | null | undefined;
  headerColor?: string | null | undefined;
  logo?: string | null | undefined;
  logoVersion?: number | null | undefined;
  shouldOverrideOrgTheme?: boolean | null | undefined;
};

export type ServiceCloudConsoleConfig = {
  componentList?: AppComponentList | null | undefined;
  detailPageRefreshMethod: string;
  footerColor?: string | null | undefined;
  headerColor?: string | null | undefined;
  keyboardShortcuts: KeyboardShortcuts;
  listPlacement: ListPlacement;
  listRefreshMethod: string;
  liveAgentConfig?: LiveAgentConfig | null | undefined;
  primaryTabColor?: string | null | undefined;
  pushNotifications: PushNotification[];
  tabLimitConfig?: TabLimitConfig | null | undefined;
  whitelistedDomains: string[];
};

export type AppComponentList = {
  alignment: string;
  components: string[];
};

export type KeyboardShortcuts = {
  customShortcuts: CustomShortcut[];
  defaultShortcuts: DefaultShortcut[];
};

export type CustomShortcut = DefaultShortcut & {
  description?: string | null | undefined;
  eventName: string;
};

export type DefaultShortcut = {
  action: string;
  active: boolean;
  keyCommand: string;
};

export type ListPlacement = {
  height?: number | null | undefined;
  location: string;
  units?: string | null | undefined;
  width?: number | null | undefined;
};

export type LiveAgentConfig = {
  enableLiveChat?: boolean | null | undefined;
  openNewAccountSubtab?: boolean | null | undefined;
  openNewCaseSubtab?: boolean | null | undefined;
  openNewContactSubtab?: boolean | null | undefined;
  openNewLeadSubtab?: boolean | null | undefined;
  openNewVFPageSubtab?: boolean | null | undefined;
  pageNamesToOpen: string[];
  showKnowledgeArticles?: boolean | null | undefined;
};

export type PushNotification = {
  fieldNames: string[];
  objectName: string;
};

export type TabLimitConfig = {
  maxNumberOfPrimaryTabs?: string | null | undefined;
  maxNumberOfSubTabs?: string | null | undefined;
};

export type AppPreferences = {
  enableCustomizeMyTabs: boolean;
  enableKeyboardShortcuts: boolean;
  enableListViewHover: boolean;
  enableListViewReskin: boolean;
  enableMultiMonitorComponents: boolean;
  enablePinTabs: boolean;
  enableTabHover: boolean;
  enableTabLimits: boolean;
  saveUserSessions: boolean;
};

export type AppProfileActionOverride = ProfileActionOverride & {
  profile: string;
};

export type ProfileActionOverride = {
  actionName: string;
  content?: string | null | undefined;
  formFactor: string;
  pageOrSobjectType: string;
  recordType?: string | null | undefined;
  type: string;
};

export type AppWorkspaceConfig = {
  mappings: WorkspaceMapping[];
};

export type WorkspaceMapping = {
  fieldName?: string | null | undefined;
  tab: string;
};

export type CustomApplicationComponent = Metadata & {
  buttonIconUrl?: string | null | undefined;
  buttonStyle?: string | null | undefined;
  buttonText?: string | null | undefined;
  buttonWidth?: number | null | undefined;
  height?: number | null | undefined;
  isHeightFixed: boolean;
  isHidden: boolean;
  isWidthFixed: boolean;
  visualforcePage: string;
  width?: number | null | undefined;
};

export type CustomFeedFilter = Metadata & {
  criteria: FeedFilterCriterion[];
  description?: string | null | undefined;
  isProtected?: boolean | null | undefined;
  label: string;
};

export type FeedFilterCriterion = {
  feedItemType: string;
  feedItemVisibility?: string | null | undefined;
  relatedSObjectType?: string | null | undefined;
};

export type CustomField = Metadata & {
  businessOwnerGroup?: string | null | undefined;
  businessOwnerUser?: string | null | undefined;
  businessStatus?: string | null | undefined;
  caseSensitive?: boolean | null | undefined;
  complianceGroup?: string | null | undefined;
  customDataType?: string | null | undefined;
  defaultValue?: string | null | undefined;
  deleteConstraint?: string | null | undefined;
  deprecated?: boolean | null | undefined;
  description?: string | null | undefined;
  displayFormat?: string | null | undefined;
  encryptionScheme?: string | null | undefined;
  escapeMarkup?: boolean | null | undefined;
  externalDeveloperName?: string | null | undefined;
  externalId?: boolean | null | undefined;
  fieldManageability?: string | null | undefined;
  formula?: string | null | undefined;
  formulaTreatBlanksAs?: string | null | undefined;
  inlineHelpText?: string | null | undefined;
  isAIPredictionField?: boolean | null | undefined;
  isConvertLeadDisabled?: boolean | null | undefined;
  isFilteringDisabled?: boolean | null | undefined;
  isNameField?: boolean | null | undefined;
  isSortingDisabled?: boolean | null | undefined;
  label?: string | null | undefined;
  length?: number | null | undefined;
  lookupFilter?: LookupFilter | null | undefined;
  maskChar?: string | null | undefined;
  maskType?: string | null | undefined;
  metadataRelationshipControllingField?: string | null | undefined;
  populateExistingRows?: boolean | null | undefined;
  precision?: number | null | undefined;
  referenceTargetField?: string | null | undefined;
  referenceTo?: string | null | undefined;
  relationshipLabel?: string | null | undefined;
  relationshipName?: string | null | undefined;
  relationshipOrder?: number | null | undefined;
  reparentableMasterDetail?: boolean | null | undefined;
  required?: boolean | null | undefined;
  restrictedAdminField?: boolean | null | undefined;
  scale?: number | null | undefined;
  securityClassification?: string | null | undefined;
  startingNumber?: number | null | undefined;
  stripMarkup?: boolean | null | undefined;
  summarizedField?: string | null | undefined;
  summaryFilterItems: FilterItem[];
  summaryForeignKey?: string | null | undefined;
  summaryOperation?: string | null | undefined;
  trackFeedHistory?: boolean | null | undefined;
  trackHistory?: boolean | null | undefined;
  trackTrending?: boolean | null | undefined;
  translateData?: boolean | null | undefined;
  type?: string | null | undefined;
  unique?: boolean | null | undefined;
  valueSet?: ValueSet | null | undefined;
  visibleLines?: number | null | undefined;
  writeRequiresMasterRead?: boolean | null | undefined;
};

export type LookupFilter = {
  active: boolean;
  booleanFilter?: string | null | undefined;
  description?: string | null | undefined;
  errorMessage?: string | null | undefined;
  filterItems: FilterItem[];
  infoMessage?: string | null | undefined;
  isOptional: boolean;
};

export type ValueSet = {
  controllingField?: string | null | undefined;
  restricted?: boolean | null | undefined;
  valueSetDefinition?: ValueSetValuesDefinition | null | undefined;
  valueSetName?: string | null | undefined;
  valueSettings: ValueSettings[];
};

export type ValueSetValuesDefinition = {
  sorted: boolean;
  value: CustomValue[];
};

export type CustomValue = Metadata & {
  color?: string | null | undefined;
  default: boolean;
  description?: string | null | undefined;
  isActive?: boolean | null | undefined;
  label?: string | null | undefined;
};

export type StandardValue = CustomValue & {
  allowEmail?: boolean | null | undefined;
  closed?: boolean | null | undefined;
  converted?: boolean | null | undefined;
  cssExposed?: boolean | null | undefined;
  forecastCategory?: string | null | undefined;
  groupingString?: string | null | undefined;
  highPriority?: boolean | null | undefined;
  probability?: number | null | undefined;
  reverseRole?: string | null | undefined;
  reviewed?: boolean | null | undefined;
  won?: boolean | null | undefined;
};

export type ValueSettings = {
  controllingFieldValue: string[];
  valueName: string;
};

export type CustomHelpMenuSection = Metadata & {
  customHelpMenuItems: CustomHelpMenuItem[];
  masterLabel: string;
};

export type CustomHelpMenuItem = {
  linkUrl: string;
  masterLabel: string;
  sortOrder: number;
};

export type CustomLabel = Metadata & {
  categories?: string | null | undefined;
  language: string;
  protected: boolean;
  shortDescription: string;
  value: string;
};

export type CustomLabels = Metadata & {
  labels: CustomLabel[];
};

export type CustomMetadata = Metadata & {
  description?: string | null | undefined;
  label?: string | null | undefined;
  protected?: boolean | null | undefined;
  values: CustomMetadataValue[];
};

export type CustomMetadataValue = {
  field: string;
  value?: any | null | undefined;
};

export type CustomNotificationType = Metadata & {
  customNotifTypeName: string;
  description?: string | null | undefined;
  desktop: boolean;
  masterLabel: string;
  mobile: boolean;
};

export type CustomObject = Metadata & {
  actionOverrides: ActionOverride[];
  allowInChatterGroups?: boolean | null | undefined;
  articleTypeChannelDisplay?: ArticleTypeChannelDisplay | null | undefined;
  businessProcesses: BusinessProcess[];
  compactLayoutAssignment?: string | null | undefined;
  compactLayouts: CompactLayout[];
  customHelp?: string | null | undefined;
  customHelpPage?: string | null | undefined;
  customSettingsType?: string | null | undefined;
  deploymentStatus?: string | null | undefined;
  deprecated?: boolean | null | undefined;
  description?: string | null | undefined;
  enableActivities?: boolean | null | undefined;
  enableBulkApi?: boolean | null | undefined;
  enableDataTranslation?: boolean | null | undefined;
  enableDivisions?: boolean | null | undefined;
  enableEnhancedLookup?: boolean | null | undefined;
  enableFeeds?: boolean | null | undefined;
  enableHistory?: boolean | null | undefined;
  enableLicensing?: boolean | null | undefined;
  enableReports?: boolean | null | undefined;
  enableSearch?: boolean | null | undefined;
  enableSharing?: boolean | null | undefined;
  enableStreamingApi?: boolean | null | undefined;
  eventType?: string | null | undefined;
  externalDataSource?: string | null | undefined;
  externalName?: string | null | undefined;
  externalRepository?: string | null | undefined;
  externalSharingModel?: string | null | undefined;
  fieldSets: FieldSet[];
  fields: CustomField[];
  gender?: string | null | undefined;
  historyRetentionPolicy?: HistoryRetentionPolicy | null | undefined;
  household?: boolean | null | undefined;
  indexes: Index[];
  label?: string | null | undefined;
  listViews: ListView[];
  nameField?: CustomField | null | undefined;
  pluralLabel?: string | null | undefined;
  profileSearchLayouts: ProfileSearchLayouts[];
  publishBehavior?: string | null | undefined;
  recordTypeTrackFeedHistory?: boolean | null | undefined;
  recordTypeTrackHistory?: boolean | null | undefined;
  recordTypes: RecordType[];
  searchLayouts?: SearchLayouts | null | undefined;
  sharingModel?: string | null | undefined;
  sharingReasons: SharingReason[];
  sharingRecalculations: SharingRecalculation[];
  startsWith?: string | null | undefined;
  validationRules: ValidationRule[];
  visibility?: string | null | undefined;
  webLinks: WebLink[];
};

export type ArticleTypeChannelDisplay = {
  articleTypeTemplates: ArticleTypeTemplate[];
};

export type ArticleTypeTemplate = {
  channel: string;
  page?: string | null | undefined;
  template: string;
};

export type FieldSet = Metadata & {
  availableFields: FieldSetItem[];
  description: string;
  displayedFields: FieldSetItem[];
  label: string;
};

export type FieldSetItem = {
  field?: string | null | undefined;
  isFieldManaged?: boolean | null | undefined;
  isRequired?: boolean | null | undefined;
};

export type HistoryRetentionPolicy = {
  archiveAfterMonths: number;
  archiveRetentionYears: number;
  description?: string | null | undefined;
};

export type Index = Metadata & {
  fields: IndexField[];
  label: string;
};

export type IndexField = {
  name: string;
  sortDirection: string;
};

export type ListView = Metadata & {
  booleanFilter?: string | null | undefined;
  columns: string[];
  division?: string | null | undefined;
  filterScope: string;
  filters: ListViewFilter[];
  label: string;
  language?: string | null | undefined;
  queue?: string | null | undefined;
  sharedTo?: SharedTo | null | undefined;
};

export type ListViewFilter = {
  field: string;
  operation: string;
  value?: string | null | undefined;
};

export type SharedTo = {
  allCustomerPortalUsers?: string | null | undefined;
  allInternalUsers?: string | null | undefined;
  allPartnerUsers?: string | null | undefined;
  channelProgramGroup: string[];
  channelProgramGroups: string[];
  group: string[];
  groups: string[];
  guestUser: string[];
  managerSubordinates: string[];
  managers: string[];
  portalRole: string[];
  portalRoleAndSubordinates: string[];
  queue: string[];
  role: string[];
  roleAndSubordinates: string[];
  roleAndSubordinatesInternal: string[];
  roles: string[];
  rolesAndSubordinates: string[];
  territories: string[];
  territoriesAndSubordinates: string[];
  territory: string[];
  territoryAndSubordinates: string[];
};

export type ProfileSearchLayouts = {
  fields: string[];
  profileName?: string | null | undefined;
};

export type RecordType = Metadata & {
  active: boolean;
  businessProcess?: string | null | undefined;
  compactLayoutAssignment?: string | null | undefined;
  description?: string | null | undefined;
  label: string;
  picklistValues: RecordTypePicklistValue[];
};

export type RecordTypePicklistValue = {
  picklist: string;
  values: PicklistValue[];
};

export type SearchLayouts = {
  customTabListAdditionalFields: string[];
  excludedStandardButtons: string[];
  listViewButtons: string[];
  lookupDialogsAdditionalFields: string[];
  lookupFilterFields: string[];
  lookupPhoneDialogsAdditionalFields: string[];
  massQuickActions: string[];
  searchFilterFields: string[];
  searchResultsAdditionalFields: string[];
  searchResultsCustomButtons: string[];
};

export type SharingReason = Metadata & {
  label: string;
};

export type SharingRecalculation = {
  className: string;
};

export type ValidationRule = Metadata & {
  active: boolean;
  description?: string | null | undefined;
  errorConditionFormula: string;
  errorDisplayField?: string | null | undefined;
  errorMessage: string;
};

export type WebLink = Metadata & {
  availability: string;
  description?: string | null | undefined;
  displayType: string;
  encodingKey?: string | null | undefined;
  hasMenubar?: boolean | null | undefined;
  hasScrollbars?: boolean | null | undefined;
  hasToolbar?: boolean | null | undefined;
  height?: number | null | undefined;
  isResizable?: boolean | null | undefined;
  linkType: string;
  masterLabel?: string | null | undefined;
  openType: string;
  page?: string | null | undefined;
  position?: string | null | undefined;
  protected: boolean;
  requireRowSelection?: boolean | null | undefined;
  scontrol?: string | null | undefined;
  showsLocation?: boolean | null | undefined;
  showsStatus?: boolean | null | undefined;
  url?: string | null | undefined;
  width?: number | null | undefined;
};

export type CustomObjectTranslation = Metadata & {
  caseValues: ObjectNameCaseValue[];
  fieldSets: FieldSetTranslation[];
  fields: CustomFieldTranslation[];
  gender?: string | null | undefined;
  layouts: LayoutTranslation[];
  nameFieldLabel?: string | null | undefined;
  quickActions: QuickActionTranslation[];
  recordTypes: RecordTypeTranslation[];
  sharingReasons: SharingReasonTranslation[];
  standardFields: StandardFieldTranslation[];
  startsWith?: string | null | undefined;
  validationRules: ValidationRuleTranslation[];
  webLinks: WebLinkTranslation[];
  workflowTasks: WorkflowTaskTranslation[];
};

export type ObjectNameCaseValue = {
  article?: string | null | undefined;
  caseType?: string | null | undefined;
  plural?: boolean | null | undefined;
  possessive?: string | null | undefined;
  value: string;
};

export type FieldSetTranslation = {
  label: string;
  name: string;
};

export type CustomFieldTranslation = {
  caseValues: ObjectNameCaseValue[];
  gender?: string | null | undefined;
  help?: string | null | undefined;
  label?: string | null | undefined;
  lookupFilter?: LookupFilterTranslation | null | undefined;
  name: string;
  picklistValues: PicklistValueTranslation[];
  relationshipLabel?: string | null | undefined;
  startsWith?: string | null | undefined;
};

export type LookupFilterTranslation = {
  errorMessage: string;
  informationalMessage: string;
};

export type PicklistValueTranslation = {
  masterLabel: string;
  translation?: string | null | undefined;
};

export type LayoutTranslation = {
  layout: string;
  layoutType?: string | null | undefined;
  sections: LayoutSectionTranslation[];
};

export type LayoutSectionTranslation = {
  label: string;
  section: string;
};

export type QuickActionTranslation = {
  label: string;
  name: string;
};

export type RecordTypeTranslation = {
  description?: string | null | undefined;
  label: string;
  name: string;
};

export type SharingReasonTranslation = {
  label: string;
  name: string;
};

export type StandardFieldTranslation = {
  label?: string | null | undefined;
  name: string;
};

export type ValidationRuleTranslation = {
  errorMessage: string;
  name: string;
};

export type WebLinkTranslation = {
  label: string;
  name: string;
};

export type WorkflowTaskTranslation = {
  description?: string | null | undefined;
  name: string;
  subject?: string | null | undefined;
};

export type CustomPageWebLink = Metadata & {
  availability: string;
  description?: string | null | undefined;
  displayType: string;
  encodingKey?: string | null | undefined;
  hasMenubar?: boolean | null | undefined;
  hasScrollbars?: boolean | null | undefined;
  hasToolbar?: boolean | null | undefined;
  height?: number | null | undefined;
  isResizable?: boolean | null | undefined;
  linkType: string;
  masterLabel?: string | null | undefined;
  openType: string;
  page?: string | null | undefined;
  position?: string | null | undefined;
  protected: boolean;
  requireRowSelection?: boolean | null | undefined;
  scontrol?: string | null | undefined;
  showsLocation?: boolean | null | undefined;
  showsStatus?: boolean | null | undefined;
  url?: string | null | undefined;
  width?: number | null | undefined;
};

export type CustomPermission = Metadata & {
  connectedApp?: string | null | undefined;
  description?: string | null | undefined;
  label: string;
  requiredPermission: CustomPermissionDependencyRequired[];
};

export type CustomPermissionDependencyRequired = {
  customPermission: string;
  dependency: boolean;
};

export type CustomSite = Metadata & {
  active: boolean;
  allowHomePage: boolean;
  allowStandardAnswersPages?: boolean | null | undefined;
  allowStandardIdeasPages: boolean;
  allowStandardLookups: boolean;
  allowStandardPortalPages: boolean;
  allowStandardSearch: boolean;
  analyticsTrackingCode?: string | null | undefined;
  authorizationRequiredPage?: string | null | undefined;
  bandwidthExceededPage?: string | null | undefined;
  browserXssProtection: boolean;
  changePasswordPage?: string | null | undefined;
  chatterAnswersForgotPasswordConfirmPage?: string | null | undefined;
  chatterAnswersForgotPasswordPage?: string | null | undefined;
  chatterAnswersHelpPage?: string | null | undefined;
  chatterAnswersLoginPage?: string | null | undefined;
  chatterAnswersRegistrationPage?: string | null | undefined;
  clickjackProtectionLevel: string;
  contentSniffingProtection: boolean;
  cspUpgradeInsecureRequests: boolean;
  customWebAddresses: SiteWebAddress[];
  description?: string | null | undefined;
  enableAuraRequests?: boolean | null | undefined;
  favoriteIcon?: string | null | undefined;
  fileNotFoundPage?: string | null | undefined;
  forgotPasswordPage?: string | null | undefined;
  genericErrorPage?: string | null | undefined;
  guestProfile?: string | null | undefined;
  inMaintenancePage?: string | null | undefined;
  inactiveIndexPage?: string | null | undefined;
  indexPage: string;
  masterLabel: string;
  myProfilePage?: string | null | undefined;
  portal?: string | null | undefined;
  referrerPolicyOriginWhenCrossOrigin: boolean;
  requireHttps: boolean;
  requireInsecurePortalAccess: boolean;
  robotsTxtPage?: string | null | undefined;
  rootComponent?: string | null | undefined;
  selfRegPage?: string | null | undefined;
  serverIsDown?: string | null | undefined;
  siteAdmin?: string | null | undefined;
  siteRedirectMappings: SiteRedirectMapping[];
  siteTemplate?: string | null | undefined;
  siteType: string;
  subdomain?: string | null | undefined;
  urlPathPrefix?: string | null | undefined;
};

export type SiteWebAddress = {
  certificate?: string | null | undefined;
  domainName: string;
  primary: boolean;
};

export type SiteRedirectMapping = {
  action: string;
  isActive?: boolean | null | undefined;
  source: string;
  target: string;
};

export type CustomTab = Metadata & {
  actionOverrides: ActionOverride[];
  auraComponent?: string | null | undefined;
  customObject?: boolean | null | undefined;
  description?: string | null | undefined;
  flexiPage?: string | null | undefined;
  frameHeight?: number | null | undefined;
  hasSidebar?: boolean | null | undefined;
  icon?: string | null | undefined;
  label?: string | null | undefined;
  lwcComponent?: string | null | undefined;
  motif?: string | null | undefined;
  page?: string | null | undefined;
  scontrol?: string | null | undefined;
  splashPageLink?: string | null | undefined;
  url?: string | null | undefined;
  urlEncodingKey?: string | null | undefined;
};

export type Dashboard = Metadata & {
  backgroundEndColor: string;
  backgroundFadeDirection: string;
  backgroundStartColor: string;
  chartTheme?: string | null | undefined;
  colorPalette?: string | null | undefined;
  dashboardChartTheme?: string | null | undefined;
  dashboardColorPalette?: string | null | undefined;
  dashboardFilters: DashboardFilter[];
  dashboardGridLayout?: DashboardGridLayout | null | undefined;
  dashboardResultRefreshedDate?: string | null | undefined;
  dashboardResultRunningUser?: string | null | undefined;
  dashboardType?: string | null | undefined;
  description?: string | null | undefined;
  folderName?: string | null | undefined;
  isGridLayout?: boolean | null | undefined;
  leftSection?: DashboardComponentSection | null | undefined;
  middleSection?: DashboardComponentSection | null | undefined;
  numSubscriptions?: number | null | undefined;
  rightSection?: DashboardComponentSection | null | undefined;
  runningUser?: string | null | undefined;
  textColor: string;
  title: string;
  titleColor: string;
  titleSize: number;
};

export type DashboardFilter = {
  dashboardFilterOptions: DashboardFilterOption[];
  name: string;
};

export type DashboardFilterOption = {
  operator: string;
  values: string[];
};

export type DashboardGridLayout = {
  dashboardGridComponents: DashboardGridComponent[];
  numberOfColumns: number;
  rowHeight: number;
};

export type DashboardGridComponent = {
  colSpan: number;
  columnIndex: number;
  dashboardComponent: DashboardComponent;
  rowIndex: number;
  rowSpan: number;
};

export type DashboardComponent = {
  autoselectColumnsFromReport?: boolean | null | undefined;
  chartAxisRange?: string | null | undefined;
  chartAxisRangeMax?: number | null | undefined;
  chartAxisRangeMin?: number | null | undefined;
  chartSummary: ChartSummary[];
  componentChartTheme?: string | null | undefined;
  componentType: string;
  dashboardFilterColumns: DashboardFilterColumn[];
  dashboardTableColumn: DashboardTableColumn[];
  decimalPrecision?: number | null | undefined;
  displayUnits?: string | null | undefined;
  drillDownUrl?: string | null | undefined;
  drillEnabled?: boolean | null | undefined;
  drillToDetailEnabled?: boolean | null | undefined;
  enableHover?: boolean | null | undefined;
  expandOthers?: boolean | null | undefined;
  flexComponentProperties?:
    | DashboardFlexTableComponentProperties
    | null
    | undefined;
  footer?: string | null | undefined;
  gaugeMax?: number | null | undefined;
  gaugeMin?: number | null | undefined;
  groupingColumn: string[];
  groupingSortProperties?:
    | DashboardComponentGroupingSortProperties
    | null
    | undefined;
  header?: string | null | undefined;
  indicatorBreakpoint1?: number | null | undefined;
  indicatorBreakpoint2?: number | null | undefined;
  indicatorHighColor?: string | null | undefined;
  indicatorLowColor?: string | null | undefined;
  indicatorMiddleColor?: string | null | undefined;
  legendPosition?: string | null | undefined;
  maxValuesDisplayed?: number | null | undefined;
  metricLabel?: string | null | undefined;
  page?: string | null | undefined;
  pageHeightInPixels?: number | null | undefined;
  report?: string | null | undefined;
  scontrol?: string | null | undefined;
  scontrolHeightInPixels?: number | null | undefined;
  showPercentage?: boolean | null | undefined;
  showPicturesOnCharts?: boolean | null | undefined;
  showPicturesOnTables?: boolean | null | undefined;
  showRange?: boolean | null | undefined;
  showTotal?: boolean | null | undefined;
  showValues?: boolean | null | undefined;
  sortBy?: string | null | undefined;
  title?: string | null | undefined;
  useReportChart?: boolean | null | undefined;
};

export type ChartSummary = {
  aggregate?: string | null | undefined;
  axisBinding?: string | null | undefined;
  column: string;
};

export type DashboardFilterColumn = {
  column: string;
};

export type DashboardTableColumn = {
  aggregateType?: string | null | undefined;
  calculatePercent?: boolean | null | undefined;
  column: string;
  decimalPlaces?: number | null | undefined;
  showSubTotal?: boolean | null | undefined;
  showTotal?: boolean | null | undefined;
  sortBy?: string | null | undefined;
};

export type DashboardFlexTableComponentProperties = {
  decimalPrecision?: number | null | undefined;
  flexTableColumn: DashboardComponentColumn[];
  flexTableSortInfo?: DashboardComponentSortInfo | null | undefined;
  hideChatterPhotos?: boolean | null | undefined;
};

export type DashboardComponentColumn = {
  breakPoint1?: number | null | undefined;
  breakPoint2?: number | null | undefined;
  breakPointOrder?: number | null | undefined;
  highRangeColor?: number | null | undefined;
  lowRangeColor?: number | null | undefined;
  midRangeColor?: number | null | undefined;
  reportColumn: string;
  showSubTotal?: boolean | null | undefined;
  showTotal?: boolean | null | undefined;
  type: string;
};

export type DashboardComponentSortInfo = {
  sortColumn?: string | null | undefined;
  sortOrder?: string | null | undefined;
};

export type DashboardComponentGroupingSortProperties = {
  groupingSorts: DashboardComponentGroupingSort[];
};

export type DashboardComponentGroupingSort = {
  groupingLevel: string;
  inheritedReportGroupingSort?: string | null | undefined;
  sortColumn?: string | null | undefined;
  sortOrder?: string | null | undefined;
};

export type DashboardComponentSection = {
  columnSize: string;
  components: DashboardComponent[];
};

export type DataCategoryGroup = Metadata & {
  active: boolean;
  dataCategory: DataCategory;
  description?: string | null | undefined;
  label: string;
  objectUsage?: ObjectUsage | null | undefined;
};

export type DataCategory = {
  dataCategory: DataCategory[];
  label: string;
  name: string;
};

export type ObjectUsage = {
  object: string[];
};

export type DataDotComSettings = Metadata & {
  enableAccountExportButtonOff?: boolean | null | undefined;
  enableAccountImportButtonOff?: boolean | null | undefined;
  enableAllowDupeContactFromLead?: boolean | null | undefined;
  enableAllowDupeLeadFromContact?: boolean | null | undefined;
  enableCleanUpgradeRequested?: boolean | null | undefined;
  enableContactExportButtonOff?: boolean | null | undefined;
  enableContactImportButtonOff?: boolean | null | undefined;
};

export type DelegateGroup = Metadata & {
  customObjects: string[];
  groups: string[];
  label: string;
  loginAccess: boolean;
  permissionSets: string[];
  profiles: string[];
  roles: string[];
};

export type DeploymentSettings = Metadata & {
  doesSkipAsyncApexValidation?: boolean | null | undefined;
};

export type DevHubSettings = Metadata & {
  enableShapeExportPref?: boolean | null | undefined;
};

export type DiscoverySettings = Metadata & {
  enableEinsteinAnswersPref?: boolean | null | undefined;
};

export type DocumentType = Metadata & {
  description: string;
  isActive: boolean;
  masterLabel: string;
};

export type DuplicateRule = Metadata & {
  actionOnInsert: string;
  actionOnUpdate: string;
  alertText?: string | null | undefined;
  description?: string | null | undefined;
  duplicateRuleFilter?: DuplicateRuleFilter | null | undefined;
  duplicateRuleMatchRules?: DuplicateRuleMatchRule[] | null | undefined;
  isActive: boolean;
  masterLabel: string;
  operationsOnInsert: string[];
  operationsOnUpdate: string[];
  securityOption: string;
  sortOrder: number;
};

export type DuplicateRuleFilter = {
  booleanFilter?: string | null | undefined;
  duplicateRuleFilterItems: DuplicateRuleFilterItem[];
};

export type DuplicateRuleMatchRule = {
  matchRuleSObjectType: string;
  matchingRule: string;
  objectMapping?: ObjectMapping | null | undefined;
};

export type ObjectMapping = {
  inputObject: string;
  mappingFields: ObjectMappingField[];
  outputObject: string;
};

export type ObjectMappingField = {
  inputField: string;
  outputField: string;
};

export type EACSettings = Metadata & {
  enableEACForEveryonePref?: boolean | null | undefined;
  enableInboxActivitySharing?: boolean | null | undefined;
  enableInsightsInTimeline?: boolean | null | undefined;
  enableInsightsInTimelineEacStd?: boolean | null | undefined;
};

export type EmailAdministrationSettings = Metadata & {
  enableComplianceBcc?: boolean | null | undefined;
  enableEmailConsentManagement?: boolean | null | undefined;
  enableEmailSenderIdCompliance?: boolean | null | undefined;
  enableEmailSpfCompliance?: boolean | null | undefined;
  enableEmailToSalesforce?: boolean | null | undefined;
  enableEmailWorkflowApproval?: boolean | null | undefined;
  enableEnhancedEmailEnabled?: boolean | null | undefined;
  enableHandleBouncedEmails?: boolean | null | undefined;
  enableHtmlEmail?: boolean | null | undefined;
  enableListEmailLogActivities?: boolean | null | undefined;
  enableResendBouncedEmails?: boolean | null | undefined;
  enableRestrictTlsToDomains?: boolean | null | undefined;
  enableSendThroughGmailPref?: boolean | null | undefined;
  enableSendViaExchangePref?: boolean | null | undefined;
  enableSendViaGmailPref?: boolean | null | undefined;
  enableSetMatchingEmailsOnBounce?: boolean | null | undefined;
  enableUseOrgFootersForExtTrans?: boolean | null | undefined;
  sendEmailsEvenWhenAutomationUpdatesSameRecord?: boolean | null | undefined;
  sendMassEmailNotification?: boolean | null | undefined;
  sendTextOnlySystemEmails?: boolean | null | undefined;
};

export type EmailIntegrationSettings = Metadata & {
  doesEmailLogAsEmailMessageInOutlook?: boolean | null | undefined;
  doesGmailStayConnectedToSalesforce?: boolean | null | undefined;
  enableContactAndEventSync?: boolean | null | undefined;
  enableEmailTrackingInMobile?: boolean | null | undefined;
  enableEngageForOutlook?: boolean | null | undefined;
  enableGmailIntegration?: boolean | null | undefined;
  enableOutlookIntegration?: boolean | null | undefined;
  enableProductivityFeatures?: boolean | null | undefined;
  enableSupplementalContactInfoInMobile?: boolean | null | undefined;
  isLayoutCustomizationAllowed?: boolean | null | undefined;
  shouldUseTrustedDomainsList?: boolean | null | undefined;
};

export type EmailServicesFunction = Metadata & {
  apexClass: string;
  attachmentOption: string;
  authenticationFailureAction: string;
  authorizationFailureAction: string;
  authorizedSenders?: string | null | undefined;
  emailServicesAddresses: EmailServicesAddress[];
  errorRoutingAddress?: string | null | undefined;
  functionInactiveAction: string;
  functionName: string;
  isActive?: boolean | null | undefined;
  isAuthenticationRequired?: boolean | null | undefined;
  isErrorRoutingEnabled?: boolean | null | undefined;
  isTextAttachmentsAsBinary?: boolean | null | undefined;
  isTlsRequired?: boolean | null | undefined;
  overLimitAction: string;
};

export type EmailServicesAddress = {
  authorizedSenders?: string | null | undefined;
  developerName: string;
  isActive?: boolean | null | undefined;
  localPart: string;
  runAsUser: string;
};

export type EmailTemplateSettings = Metadata & {
  enableLwcEmailTemplateBuilder?: boolean | null | undefined;
  enableTemplateEnhancedFolderPref?: boolean | null | undefined;
};

export type EmbeddedServiceBranding = Metadata & {
  contrastInvertedColor?: string | null | undefined;
  contrastPrimaryColor?: string | null | undefined;
  embeddedServiceConfig: string;
  font?: string | null | undefined;
  height?: number | null | undefined;
  masterLabel: string;
  navBarColor?: string | null | undefined;
  primaryColor?: string | null | undefined;
  secondaryColor?: string | null | undefined;
  width?: number | null | undefined;
};

export type EmbeddedServiceConfig = Metadata & {
  areGuestUsersAllowed?: boolean | null | undefined;
  authMethod?: string | null | undefined;
  embeddedServiceAppointmentSettings?:
    | EmbeddedServiceAppointmentSettings
    | null
    | undefined;
  embeddedServiceCustomComponents: EmbeddedServiceCustomComponent[];
  embeddedServiceCustomLabels: EmbeddedServiceCustomLabel[];
  embeddedServiceFlowConfig?: EmbeddedServiceFlowConfig | null | undefined;
  embeddedServiceFlows: EmbeddedServiceFlow[];
  embeddedServiceLayouts: EmbeddedServiceLayout[];
  masterLabel: string;
  shouldHideAuthDialog?: boolean | null | undefined;
  site: string;
};

export type EmbeddedServiceAppointmentSettings = {
  appointmentConfirmImg?: string | null | undefined;
  enabled: boolean;
  homeImg?: string | null | undefined;
  logoImg?: string | null | undefined;
  shouldShowExistingAppointment?: boolean | null | undefined;
  shouldShowNewAppointment?: boolean | null | undefined;
};

export type EmbeddedServiceCustomComponent = {
  componentBundleType?: string | null | undefined;
  customComponent?: string | null | undefined;
  customComponentType?: string | null | undefined;
};

export type EmbeddedServiceCustomLabel = {
  customLabel?: string | null | undefined;
  feature?: string | null | undefined;
  labelKey?: string | null | undefined;
};

export type EmbeddedServiceFlowConfig = Metadata & {
  enabled: boolean;
};

export type EmbeddedServiceFlow = {
  flow: string;
  flowType: string;
  isAuthenticationRequired: boolean;
};

export type EmbeddedServiceLayout = {
  embeddedServiceLayoutRules: EmbeddedServiceLayoutRule[];
  layout: string;
  layoutType?: string | null | undefined;
};

export type EmbeddedServiceLayoutRule = {
  appointmentStatus: string;
};

export type EmbeddedServiceLiveAgent = Metadata & {
  avatarImg?: string | null | undefined;
  embeddedServiceConfig: string;
  embeddedServiceQuickActions: EmbeddedServiceQuickAction[];
  enabled: boolean;
  fontSize: string;
  headerBackgroundImg?: string | null | undefined;
  isOfflineCaseEnabled?: boolean | null | undefined;
  isQueuePositionEnabled?: boolean | null | undefined;
  liveAgentChatUrl?: string | null | undefined;
  liveAgentContentUrl?: string | null | undefined;
  liveChatButton: string;
  liveChatDeployment: string;
  masterLabel: string;
  offlineCaseBackgroundImg?: string | null | undefined;
  prechatBackgroundImg?: string | null | undefined;
  prechatEnabled: boolean;
  prechatJson?: string | null | undefined;
  scenario: string;
  smallCompanyLogoImg?: string | null | undefined;
  waitingStateBackgroundImg?: string | null | undefined;
};

export type EmbeddedServiceQuickAction = {
  embeddedServiceLiveAgent: string;
  order: number;
  quickActionDefinition: string;
  quickActionType?: string | null | undefined;
};

export type EmbeddedServiceMenuSettings = Metadata & {
  branding?: string | null | undefined;
  embeddedServiceMenuItems: EmbeddedServiceMenuItem[];
  isEnabled?: boolean | null | undefined;
  masterLabel?: string | null | undefined;
  site?: string | null | undefined;
};

export type EmbeddedServiceMenuItem = {
  channel?: string | null | undefined;
  channelType?: string | null | undefined;
  displayOrder?: number | null | undefined;
  phoneNumber?: string | null | undefined;
};

export type EncryptionKeySettings = Metadata & {
  canOptOutOfDerivationWithBYOK?: boolean | null | undefined;
  enableCacheOnlyKeys?: boolean | null | undefined;
  enableReplayDetection?: boolean | null | undefined;
};

export type EnhancedNotesSettings = Metadata & {
  enableEnhancedNotes?: boolean | null | undefined;
  enableTasksOnEnhancedNotes?: boolean | null | undefined;
};

export type EntitlementProcess = Metadata & {
  SObjectType?: string | null | undefined;
  active?: boolean | null | undefined;
  businessHours?: string | null | undefined;
  description?: string | null | undefined;
  entryStartDateField?: string | null | undefined;
  exitCriteriaBooleanFilter?: string | null | undefined;
  exitCriteriaFilterItems: FilterItem[];
  exitCriteriaFormula?: string | null | undefined;
  isRecordTypeApplied?: boolean | null | undefined;
  isVersionDefault?: boolean | null | undefined;
  milestones: EntitlementProcessMilestoneItem[];
  name?: string | null | undefined;
  recordType?: string | null | undefined;
  versionMaster?: string | null | undefined;
  versionNotes?: string | null | undefined;
  versionNumber?: number | null | undefined;
};

export type EntitlementProcessMilestoneItem = {
  businessHours?: string | null | undefined;
  criteriaBooleanFilter?: string | null | undefined;
  milestoneCriteriaFilterItems: FilterItem[];
  milestoneCriteriaFormula?: string | null | undefined;
  milestoneName?: string | null | undefined;
  minutesCustomClass?: string | null | undefined;
  minutesToComplete?: number | null | undefined;
  successActions: WorkflowActionReference[];
  timeTriggers: EntitlementProcessMilestoneTimeTrigger[];
  useCriteriaStartTime?: boolean | null | undefined;
};

export type EntitlementProcessMilestoneTimeTrigger = {
  actions: WorkflowActionReference[];
  timeLength?: number | null | undefined;
  workflowTimeTriggerUnit: string;
};

export type EntitlementSettings = Metadata & {
  assetLookupLimitedToActiveEntitlementsOnAccount?: boolean | null | undefined;
  assetLookupLimitedToActiveEntitlementsOnContact?: boolean | null | undefined;
  assetLookupLimitedToSameAccount?: boolean | null | undefined;
  assetLookupLimitedToSameContact?: boolean | null | undefined;
  enableEntitlementVersioning: boolean;
  enableEntitlements: boolean;
  enableMilestoneFeedItem?: boolean | null | undefined;
  enableMilestoneStoppedTime?: boolean | null | undefined;
  entitlementLookupLimitedToActiveStatus?: boolean | null | undefined;
  entitlementLookupLimitedToSameAccount?: boolean | null | undefined;
  entitlementLookupLimitedToSameAsset?: boolean | null | undefined;
  entitlementLookupLimitedToSameContact?: boolean | null | undefined;
  ignoreMilestoneBusinessHours?: boolean | null | undefined;
};

export type EntitlementTemplate = Metadata & {
  businessHours?: string | null | undefined;
  casesPerEntitlement?: number | null | undefined;
  entitlementProcess?: string | null | undefined;
  isPerIncident?: boolean | null | undefined;
  term?: number | null | undefined;
  type?: string | null | undefined;
};

export type EntityImplements = Metadata & {
  fieldMap: FieldImplements[];
  interface?: string | null | undefined;
  isDefault?: boolean | null | undefined;
};

export type FieldImplements = {
  field?: string | null | undefined;
  interfaceField?: string | null | undefined;
};

export type EscalationRule = Metadata & {
  active?: boolean | null | undefined;
  ruleEntry: RuleEntry[];
};

export type EscalationRules = Metadata & {
  escalationRule: EscalationRule[];
};

export type EssentialsSettings = Metadata & {
  emailConnectorEnabled?: boolean | null | undefined;
  essentialsAppEnabled?: boolean | null | undefined;
};

export type EssentialsTrialOrgSettings = Metadata & {
  enableSampleDataDeleted?: boolean | null | undefined;
};

export type EventSettings = Metadata & {
  enableApexLimitEvents?: boolean | null | undefined;
  enableDeleteMonitoringData?: boolean | null | undefined;
  enableDynamicStreamingChannel?: boolean | null | undefined;
  enableEventLogWaveIntegration?: boolean | null | undefined;
  enableLoginForensics?: boolean | null | undefined;
  enableStreamingApi?: boolean | null | undefined;
  enableTerminateOldestSession?: boolean | null | undefined;
  enableTransactionSecurityPolicies?: boolean | null | undefined;
};

export type ExperienceBundleSettings = Metadata & {
  enableExperienceBundleMetadata?: boolean | null | undefined;
};

export type ExternalDataSource = Metadata & {
  authProvider?: string | null | undefined;
  certificate?: string | null | undefined;
  customConfiguration?: string | null | undefined;
  customHttpHeaders: CustomHttpHeader[];
  endpoint?: string | null | undefined;
  isWritable?: boolean | null | undefined;
  label: string;
  oauthRefreshToken?: string | null | undefined;
  oauthScope?: string | null | undefined;
  oauthToken?: string | null | undefined;
  password?: string | null | undefined;
  principalType: string;
  protocol: string;
  repository?: string | null | undefined;
  type: string;
  username?: string | null | undefined;
  version?: string | null | undefined;
};

export type CustomHttpHeader = {
  description?: string | null | undefined;
  headerFieldName: string;
  headerFieldValue: string;
  isActive?: boolean | null | undefined;
};

export type ExternalServiceRegistration = Metadata & {
  description?: string | null | undefined;
  label: string;
  namedCredential?: string | null | undefined;
  schema?: string | null | undefined;
  schemaType?: string | null | undefined;
  schemaUrl?: string | null | undefined;
  status: string;
};

export type ExternalServicesSettings = Metadata & {
  enableEnhancedExternalServices?: boolean | null | undefined;
};

export type FieldServiceSettings = Metadata & {
  capacityUsageCalcClassId?: string | null | undefined;
  doesAllowEditSaForCrew?: boolean | null | undefined;
  doesShareSaParentWoWithAr?: boolean | null | undefined;
  doesShareSaWithAr?: boolean | null | undefined;
  enableWorkOrders?: boolean | null | undefined;
  fieldServiceNotificationsOrgPref?: boolean | null | undefined;
  fieldServiceOrgPref?: boolean | null | undefined;
  isGeoCodeSyncEnabled?: boolean | null | undefined;
  isLocationHistoryEnabled?: boolean | null | undefined;
  serviceAppointmentsDueDateOffsetOrgValue?: number | null | undefined;
  workOrderLineItemSearchFields: string[];
  workOrderSearchFields: string[];
};

export type FileUploadAndDownloadSecuritySettings = Metadata & {
  dispositions: FileTypeDispositionAssignmentBean[];
  noHtmlUploadAsAttachment: boolean;
};

export type FileTypeDispositionAssignmentBean = {
  behavior: string;
  fileType: string;
  securityRiskFileType: boolean;
};

export type FilesConnectSettings = Metadata & {
  enableContentHubAllowed?: boolean | null | undefined;
  enableContentHubCvtLinksAllowed?: boolean | null | undefined;
  enableContentHubEOSearchLayout?: boolean | null | undefined;
};

export type FlexiPage = Metadata & {
  description?: string | null | undefined;
  flexiPageRegions: FlexiPageRegion[];
  masterLabel: string;
  parentFlexiPage?: string | null | undefined;
  platformActionlist?: PlatformActionList | null | undefined;
  quickActionList?: QuickActionList | null | undefined;
  sobjectType?: string | null | undefined;
  template: FlexiPageTemplateInstance;
  type: string;
};

export type FlexiPageRegion = {
  appendable?: string | null | undefined;
  componentInstances: ComponentInstance[];
  mode?: string | null | undefined;
  name: string;
  prependable?: string | null | undefined;
  replaceable?: string | null | undefined;
  type: string;
};

export type ComponentInstance = {
  componentInstanceProperties: ComponentInstanceProperty[];
  componentName: string;
  visibilityRule?: UiFormulaRule | null | undefined;
};

export type ComponentInstanceProperty = {
  name?: string | null | undefined;
  type?: string | null | undefined;
  value?: string | null | undefined;
};

export type UiFormulaRule = {
  booleanFilter?: string | null | undefined;
  criteria: UiFormulaCriterion[];
};

export type UiFormulaCriterion = {
  leftValue: string;
  operator: string;
  rightValue?: string | null | undefined;
};

export type PlatformActionList = Metadata & {
  actionListContext: string;
  platformActionListItems: PlatformActionListItem[];
  relatedSourceEntity?: string | null | undefined;
};

export type PlatformActionListItem = {
  actionName: string;
  actionType: string;
  sortOrder: number;
  subtype?: string | null | undefined;
};

export type QuickActionList = {
  quickActionListItems: QuickActionListItem[];
};

export type QuickActionListItem = {
  quickActionName: string;
};

export type FlexiPageTemplateInstance = {
  name: string;
  properties: ComponentInstanceProperty[];
};

export type Flow = Metadata & {
  actionCalls: FlowActionCall[];
  apexPluginCalls: FlowApexPluginCall[];
  assignments: FlowAssignment[];
  choices: FlowChoice[];
  constants: FlowConstant[];
  decisions: FlowDecision[];
  description?: string | null | undefined;
  dynamicChoiceSets: FlowDynamicChoiceSet[];
  formulas: FlowFormula[];
  interviewLabel?: string | null | undefined;
  isAdditionalPermissionRequiredToRun?: boolean | null | undefined;
  isTemplate?: boolean | null | undefined;
  label: string;
  loops: FlowLoop[];
  processMetadataValues: FlowMetadataValue[];
  processType?: string | null | undefined;
  recordCreates: FlowRecordCreate[];
  recordDeletes: FlowRecordDelete[];
  recordLookups: FlowRecordLookup[];
  recordUpdates: FlowRecordUpdate[];
  screens: FlowScreen[];
  stages: FlowStage[];
  start?: FlowStart | null | undefined;
  startElementReference?: string | null | undefined;
  status?: string | null | undefined;
  steps: FlowStep[];
  subflows: FlowSubflow[];
  textTemplates: FlowTextTemplate[];
  variables: FlowVariable[];
  waits: FlowWait[];
};

export type FlowActionCall = FlowNode & {
  actionName: string;
  actionType: string;
  connector?: FlowConnector | null | undefined;
  faultConnector?: FlowConnector | null | undefined;
  inputParameters: FlowActionCallInputParameter[];
  outputParameters: FlowActionCallOutputParameter[];
};

export type FlowNode = FlowElement & {
  label?: string | null | undefined;
  locationX: number;
  locationY: number;
};

export type FlowElement = FlowBaseElement & {
  description?: string | null | undefined;
  name?: string | null | undefined;
};

export type FlowBaseElement = {
  processMetadataValues: FlowMetadataValue[];
};

export type FlowMetadataValue = {
  name: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowElementReferenceOrValue = {
  booleanValue?: boolean | null | undefined;
  dateTimeValue?: string | null | undefined;
  dateValue?: string | null | undefined;
  elementReference?: string | null | undefined;
  numberValue?: number | null | undefined;
  stringValue?: string | null | undefined;
};

export type FlowActionCallInputParameter = FlowBaseElement & {
  name: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowActionCallOutputParameter = FlowBaseElement & {
  assignToReference: string;
  name: string;
};

export type FlowApexPluginCallInputParameter = FlowBaseElement & {
  name: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowApexPluginCallOutputParameter = FlowBaseElement & {
  assignToReference: string;
  name: string;
};

export type FlowAssignmentItem = FlowBaseElement & {
  assignToReference: string;
  operator: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowChoiceUserInput = FlowBaseElement & {
  isRequired?: boolean | null | undefined;
  promptText?: string | null | undefined;
  validationRule?: FlowInputValidationRule | null | undefined;
};

export type FlowInputValidationRule = {
  errorMessage: string;
  formulaExpression: string;
};

export type FlowCondition = FlowBaseElement & {
  leftValueReference: string;
  operator: string;
  rightValue?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowConnector = FlowBaseElement & {
  targetReference: string;
};

export type FlowInputFieldAssignment = FlowBaseElement & {
  field: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowOutputFieldAssignment = FlowBaseElement & {
  assignToReference: string;
  field: string;
};

export type FlowRecordFilter = FlowBaseElement & {
  field: string;
  operator: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowScreenFieldInputParameter = FlowBaseElement & {
  name: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowScreenFieldOutputParameter = FlowBaseElement & {
  assignToReference: string;
  name: string;
};

export type FlowScreenRule = FlowBaseElement & {
  conditionLogic?: string | null | undefined;
  conditions: FlowCondition[];
  label: string;
  ruleActions: FlowScreenRuleAction[];
};

export type FlowScreenRuleAction = FlowBaseElement & {
  attribute: string;
  fieldReference: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowSubflowInputAssignment = FlowBaseElement & {
  name: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowSubflowOutputAssignment = FlowBaseElement & {
  assignToReference: string;
  name: string;
};

export type FlowVisibilityRule = FlowBaseElement & {
  conditionLogic?: string | null | undefined;
  conditions: FlowCondition[];
};

export type FlowWaitEventInputParameter = FlowBaseElement & {
  name: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowWaitEventOutputParameter = FlowBaseElement & {
  assignToReference: string;
  name: string;
};

export type FlowChoice = FlowElement & {
  choiceText: string;
  dataType: string;
  userInput?: FlowChoiceUserInput | null | undefined;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowConstant = FlowElement & {
  dataType: string;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowDynamicChoiceSet = FlowElement & {
  dataType: string;
  displayField: string;
  filters: FlowRecordFilter[];
  limit?: number | null | undefined;
  object: string;
  outputAssignments: FlowOutputFieldAssignment[];
  picklistField?: string | null | undefined;
  picklistObject?: string | null | undefined;
  sortField?: string | null | undefined;
  sortOrder?: string | null | undefined;
  valueField?: string | null | undefined;
};

export type FlowFormula = FlowElement & {
  dataType?: string | null | undefined;
  expression: string;
  scale?: number | null | undefined;
};

export type FlowRule = FlowElement & {
  conditionLogic: string;
  conditions: FlowCondition[];
  connector?: FlowConnector | null | undefined;
  label: string;
};

export type FlowScreenField = FlowElement & {
  choiceReferences: string[];
  dataType?: string | null | undefined;
  defaultSelectedChoiceReference?: string | null | undefined;
  defaultValue?: FlowElementReferenceOrValue | null | undefined;
  extensionName?: string | null | undefined;
  fieldText?: string | null | undefined;
  fieldType: string;
  helpText?: string | null | undefined;
  inputParameters: FlowScreenFieldInputParameter[];
  isRequired?: boolean | null | undefined;
  isVisible?: boolean | null | undefined;
  outputParameters: FlowScreenFieldOutputParameter[];
  scale?: number | null | undefined;
  storeOutputAutomatically?: boolean | null | undefined;
  validationRule?: FlowInputValidationRule | null | undefined;
  visibilityRule?: FlowVisibilityRule | null | undefined;
};

export type FlowStage = FlowElement & {
  isActive: boolean;
  label: string;
  stageOrder: number;
};

export type FlowTextTemplate = FlowElement & {
  text: string;
};

export type FlowVariable = FlowElement & {
  apexClass?: string | null | undefined;
  dataType: string;
  isCollection?: boolean | null | undefined;
  isInput?: boolean | null | undefined;
  isOutput?: boolean | null | undefined;
  objectType?: string | null | undefined;
  scale?: number | null | undefined;
  value?: FlowElementReferenceOrValue | null | undefined;
};

export type FlowWaitEvent = FlowElement & {
  conditionLogic?: string | null | undefined;
  conditions: FlowCondition[];
  connector: FlowConnector;
  eventType: string;
  inputParameters: FlowWaitEventInputParameter[];
  label: string;
  outputParameters: FlowWaitEventOutputParameter[];
};

export type FlowApexPluginCall = FlowNode & {
  apexClass: string;
  connector?: FlowConnector | null | undefined;
  faultConnector?: FlowConnector | null | undefined;
  inputParameters: FlowApexPluginCallInputParameter[];
  outputParameters: FlowApexPluginCallOutputParameter[];
};

export type FlowAssignment = FlowNode & {
  assignmentItems: FlowAssignmentItem[];
  connector?: FlowConnector | null | undefined;
};

export type FlowDecision = FlowNode & {
  defaultConnector?: FlowConnector | null | undefined;
  defaultConnectorLabel?: string | null | undefined;
  rules: FlowRule[];
};

export type FlowLoop = FlowNode & {
  assignNextValueToReference: string;
  collectionReference: string;
  iterationOrder?: string | null | undefined;
  nextValueConnector?: FlowConnector | null | undefined;
  noMoreValuesConnector?: FlowConnector | null | undefined;
};

export type FlowRecordCreate = FlowNode & {
  assignRecordIdToReference?: string | null | undefined;
  connector?: FlowConnector | null | undefined;
  faultConnector?: FlowConnector | null | undefined;
  inputAssignments: FlowInputFieldAssignment[];
  inputReference?: string | null | undefined;
  object?: string | null | undefined;
};

export type FlowRecordDelete = FlowNode & {
  connector?: FlowConnector | null | undefined;
  faultConnector?: FlowConnector | null | undefined;
  filters: FlowRecordFilter[];
  inputReference?: string | null | undefined;
  object?: string | null | undefined;
};

export type FlowRecordLookup = FlowNode & {
  assignNullValuesIfNoRecordsFound?: boolean | null | undefined;
  connector?: FlowConnector | null | undefined;
  faultConnector?: FlowConnector | null | undefined;
  filters: FlowRecordFilter[];
  getFirstRecordOnly?: boolean | null | undefined;
  object: string;
  outputAssignments: FlowOutputFieldAssignment[];
  outputReference?: string | null | undefined;
  queriedFields: string[];
  sortField?: string | null | undefined;
  sortOrder?: string | null | undefined;
  storeOutputAutomatically?: boolean | null | undefined;
};

export type FlowRecordUpdate = FlowNode & {
  connector?: FlowConnector | null | undefined;
  faultConnector?: FlowConnector | null | undefined;
  filters: FlowRecordFilter[];
  inputAssignments: FlowInputFieldAssignment[];
  inputReference?: string | null | undefined;
  object?: string | null | undefined;
};

export type FlowScreen = FlowNode & {
  allowBack?: boolean | null | undefined;
  allowFinish?: boolean | null | undefined;
  allowPause?: boolean | null | undefined;
  connector?: FlowConnector | null | undefined;
  fields: FlowScreenField[];
  helpText?: string | null | undefined;
  pausedText?: string | null | undefined;
  rules: FlowScreenRule[];
  showFooter?: boolean | null | undefined;
  showHeader?: boolean | null | undefined;
};

export type FlowStart = FlowNode & {
  connector?: FlowConnector | null | undefined;
  filters: FlowRecordFilter[];
  object?: string | null | undefined;
  schedule?: FlowSchedule | null | undefined;
  triggerType?: string | null | undefined;
};

export type FlowSchedule = {
  frequency?: string | null | undefined;
  startDate?: string | null | undefined;
  startTime?: string | null | undefined;
};

export type FlowStep = FlowNode & {
  connectors: FlowConnector[];
};

export type FlowSubflow = FlowNode & {
  connector?: FlowConnector | null | undefined;
  flowName: string;
  inputAssignments: FlowSubflowInputAssignment[];
  outputAssignments: FlowSubflowOutputAssignment[];
};

export type FlowWait = FlowNode & {
  defaultConnector?: FlowConnector | null | undefined;
  defaultConnectorLabel: string;
  faultConnector?: FlowConnector | null | undefined;
  waitEvents: FlowWaitEvent[];
};

export type FlowCategory = Metadata & {
  description?: string | null | undefined;
  flowCategoryItems: FlowCategoryItems[];
  masterLabel: string;
};

export type FlowCategoryItems = {
  flow: string;
};

export type FlowDefinition = Metadata & {
  activeVersionNumber?: number | null | undefined;
  description?: string | null | undefined;
  masterLabel?: string | null | undefined;
};

export type FlowSettings = Metadata & {
  enableFlowBREncodedFixEnabled?: boolean | null | undefined;
  enableFlowDeployAsActiveEnabled?: boolean | null | undefined;
  enableFlowFieldFilterEnabled?: boolean | null | undefined;
  enableFlowFormulasFixEnabled?: boolean | null | undefined;
  enableFlowInterviewSharingEnabled?: boolean | null | undefined;
  enableFlowNullPreviousValueFix?: boolean | null | undefined;
  enableFlowPauseEnabled?: boolean | null | undefined;
  enableFlowUseApexExceptionEmail?: boolean | null | undefined;
  enableInvocableFlowFixEnabled?: boolean | null | undefined;
  enableLightningRuntimeEnabled?: boolean | null | undefined;
  enableUseFlowBuilder?: boolean | null | undefined;
  isAccessToInvokedApexRequired?: boolean | null | undefined;
  isEnhancedFlowListViewVisible?: boolean | null | undefined;
  isManageFlowRequiredForAutomationCharts?: boolean | null | undefined;
};

export type Folder = Metadata & {
  accessType?: string | null | undefined;
  folderShares: FolderShare[];
  name: string;
  publicFolderAccess?: string | null | undefined;
  sharedTo?: SharedTo | null | undefined;
};

export type FolderShare = {
  accessLevel: string;
  sharedTo: string;
  sharedToType: string;
};

export type DashboardFolder = Folder & {};

export type DocumentFolder = Folder & {};

export type EmailFolder = Folder & {};

export type ReportFolder = Folder & {};

export type ForecastingSettings = Metadata & {
  defaultToPersonalCurrency?: boolean | null | undefined;
  enableForecasts?: boolean | null | undefined;
  forecastingCategoryMappings: ForecastingCategoryMapping[];
  forecastingDisplayedFamilySettings: ForecastingDisplayedFamilySettings[];
  forecastingTypeSettings: ForecastingTypeSettings[];
};

export type ForecastingCategoryMapping = {
  forecastingItemCategoryApiName: string;
  weightedSourceCategories: WeightedSourceCategory[];
};

export type WeightedSourceCategory = {
  sourceCategoryApiName: string;
  weight: number;
};

export type ForecastingDisplayedFamilySettings = {
  productFamily?: string | null | undefined;
};

export type ForecastingTypeSettings = {
  active: boolean;
  adjustmentsSettings: AdjustmentsSettings;
  displayedCategoryApiNames: string[];
  forecastRangeSettings: ForecastRangeSettings;
  forecastedCategoryApiNames: string[];
  forecastingDateType: string;
  hasProductFamily: boolean;
  isAmount: boolean;
  isAvailable: boolean;
  isQuantity: boolean;
  managerAdjustableCategoryApiNames: string[];
  masterLabel: string;
  name: string;
  opportunityListFieldsLabelMappings: OpportunityListFieldsLabelMapping[];
  opportunityListFieldsSelectedSettings: OpportunityListFieldsSelectedSettings;
  opportunityListFieldsUnselectedSettings: OpportunityListFieldsUnselectedSettings;
  opportunitySplitName?: string | null | undefined;
  ownerAdjustableCategoryApiNames: string[];
  quotasSettings: QuotasSettings;
  territory2ModelName?: string | null | undefined;
};

export type AdjustmentsSettings = {
  enableAdjustments: boolean;
  enableOwnerAdjustments: boolean;
};

export type ForecastRangeSettings = {
  beginning: number;
  displaying: number;
  periodType: string;
};

export type OpportunityListFieldsLabelMapping = {
  field: string;
  label: string;
};

export type OpportunityListFieldsSelectedSettings = {
  field: string[];
};

export type OpportunityListFieldsUnselectedSettings = {
  field: string[];
};

export type QuotasSettings = {
  showQuotas: boolean;
};

export type Form = Metadata & {
  description?: string | null | undefined;
  formSections: FormSection[];
  masterLabel: string;
};

export type FormSection = Metadata & {
  formColumns: FormColumn[];
  masterLabel: string;
  tabOrderType: string;
};

export type FormColumn = {
  formItems: FormItem[];
};

export type FormItem = {
  emptySpace?: boolean | null | undefined;
  expression?: string | null | undefined;
  formLayoutableItem?: string | null | undefined;
  helpText?: string | null | undefined;
};

export type FormulaSettings = Metadata & {
  enableDSTAwareDatevalue?: boolean | null | undefined;
};

export type GlobalValueSet = Metadata & {
  customValue: CustomValue[];
  description?: string | null | undefined;
  masterLabel: string;
  sorted: boolean;
};

export type GlobalValueSetTranslation = Metadata & {
  valueTranslation: ValueTranslation[];
};

export type ValueTranslation = {
  masterLabel: string;
  translation?: string | null | undefined;
};

export type GoogleAppsSettings = Metadata & {
  enableGmailButtons?: boolean | null | undefined;
  enableGmailButtonsAndLinks?: boolean | null | undefined;
  enableGmailLinks?: boolean | null | undefined;
  enableGoogleDocs?: boolean | null | undefined;
  enableGoogleDocsTab?: boolean | null | undefined;
  enableGoogleTalk?: boolean | null | undefined;
  googleAppsDomain?: string | null | undefined;
  googleAppsDomainLinked?: boolean | null | undefined;
  googleAppsDomainValidated?: boolean | null | undefined;
};

export type Group = Metadata & {
  doesIncludeBosses?: boolean | null | undefined;
  name: string;
};

export type HighVelocitySalesSettings = Metadata & {
  enableDispositionCategory?: boolean | null | undefined;
  enableEngagementWaveAnalyticsPref?: boolean | null | undefined;
  enableHighVelocitySales?: boolean | null | undefined;
  enableHighVelocitySalesSetup?: boolean | null | undefined;
};

export type HomePageComponent = Metadata & {
  body?: string | null | undefined;
  height?: number | null | undefined;
  links: string[];
  page?: string | null | undefined;
  pageComponentType: string;
  showLabel?: boolean | null | undefined;
  showScrollbars?: boolean | null | undefined;
  width?: string | null | undefined;
};

export type HomePageLayout = Metadata & {
  narrowComponents: string[];
  wideComponents: string[];
};

export type IdeasSettings = Metadata & {
  enableChatterProfile?: boolean | null | undefined;
  enableHtmlIdea?: boolean | null | undefined;
  enableIdeaMultipleCategory?: boolean | null | undefined;
  enableIdeaThemes?: boolean | null | undefined;
  enableIdeas?: boolean | null | undefined;
  enableIdeasControllerExtensions?: boolean | null | undefined;
  enableIdeasReputation?: boolean | null | undefined;
  halfLife?: number | null | undefined;
  ideasProfilePage?: string | null | undefined;
};

export type IndustriesManufacturingSettings = Metadata & {
  enableIndManufacturing?: boolean | null | undefined;
  enableIndustriesMfgAccountForecast?: boolean | null | undefined;
};

export type IndustriesSettings = Metadata & {
  allowMultipleProducersToWorkOnSamePolicy?: boolean | null | undefined;
  enableAccessToMasterListOfCoverageTypes?: boolean | null | undefined;
  enableBlockResourceAvailabilityOrgPref?: boolean | null | undefined;
  enableEventManagementOrgPref?: boolean | null | undefined;
  enableHCReferralScoring?: boolean | null | undefined;
  enableManyToManyRelationships?: boolean | null | undefined;
  enableMortgageRlaTotalsOrgPref?: boolean | null | undefined;
  enableMultiResourceOrgPref?: boolean | null | undefined;
  enableObjectDetection?: boolean | null | undefined;
  enableOverbookingOrgPref?: boolean | null | undefined;
  enableProviderSearchSyncOrgPref?: boolean | null | undefined;
  enableReferralScoring?: boolean | null | undefined;
  enableSentimentAnalysis?: boolean | null | undefined;
};

export type InstalledPackage = Metadata & {
  activateRSS: boolean;
  password?: string | null | undefined;
  versionNumber: string;
};

export type IntegrationHubSettings = Metadata & {
  canonicalName?: string | null | undefined;
  canonicalNameBindingChar?: string | null | undefined;
  description?: string | null | undefined;
  isEnabled?: boolean | null | undefined;
  isProtected?: boolean | null | undefined;
  masterLabel: string;
  setupData?: string | null | undefined;
  setupDefinition?: string | null | undefined;
  setupNamespace?: string | null | undefined;
  setupSimpleName: string;
  uUID?: string | null | undefined;
  version?: string | null | undefined;
  versionBuild?: number | null | undefined;
  versionMajor?: number | null | undefined;
  versionMinor?: number | null | undefined;
  versionSetUuid?: string | null | undefined;
};

export type IntegrationHubSettingsType = Metadata & {
  canonicalName?: string | null | undefined;
  canonicalNameBindingChar?: string | null | undefined;
  description?: string | null | undefined;
  isEnabled?: boolean | null | undefined;
  isProtected?: boolean | null | undefined;
  masterLabel: string;
  setupNamespace?: string | null | undefined;
  setupSimpleName: string;
  uUID?: string | null | undefined;
  version?: string | null | undefined;
  versionBuild?: number | null | undefined;
  versionMajor?: number | null | undefined;
  versionMinor?: number | null | undefined;
  versionSetUuid?: string | null | undefined;
};

export type InvocableActionSettings = Metadata & {
  isPartialSaveAllowed?: boolean | null | undefined;
};

export type IoTSettings = Metadata & {
  enableIoT?: boolean | null | undefined;
  enableIoTInsightsPilot?: boolean | null | undefined;
  enableIoTUsageEmail?: boolean | null | undefined;
};

export type IsvHammerSettings = Metadata & {
  enableIsvHammerSubIsOptedOut?: boolean | null | undefined;
};

export type KeywordList = Metadata & {
  description?: string | null | undefined;
  keywords: Keyword[];
  masterLabel: string;
};

export type Keyword = {
  keyword: string;
};

export type KnowledgeSettings = Metadata & {
  answers?: KnowledgeAnswerSettings | null | undefined;
  cases?: KnowledgeCaseSettings | null | undefined;
  defaultLanguage?: string | null | undefined;
  enableChatterQuestionKBDeflection?: boolean | null | undefined;
  enableCreateEditOnArticlesTab?: boolean | null | undefined;
  enableExternalMediaContent?: boolean | null | undefined;
  enableKnowledge?: boolean | null | undefined;
  enableKnowledgeArticleTextHighlights?: boolean | null | undefined;
  enableKnowledgeKeywordAutoComplete?: boolean | null | undefined;
  enableKnowledgeTitleAutoComplete?: boolean | null | undefined;
  enableLightningKbAutoLoadRichTextField?: boolean | null | undefined;
  enableLightningKnowledge?: boolean | null | undefined;
  languages?: KnowledgeLanguageSettings | null | undefined;
  showArticleSummariesCustomerPortal?: boolean | null | undefined;
  showArticleSummariesInternalApp?: boolean | null | undefined;
  showArticleSummariesPartnerPortal?: boolean | null | undefined;
  showValidationStatusField?: boolean | null | undefined;
  suggestedArticles?: KnowledgeSuggestedArticlesSettings | null | undefined;
};

export type KnowledgeAnswerSettings = {
  assignTo?: string | null | undefined;
  defaultArticleType?: string | null | undefined;
  enableArticleCreation?: boolean | null | undefined;
};

export type KnowledgeCaseSettings = {
  articlePDFCreationProfile?: string | null | undefined;
  articlePublicSharingCommunities?:
    | KnowledgeCommunitiesSettings
    | null
    | undefined;
  articlePublicSharingSites?: KnowledgeSitesSettings | null | undefined;
  articlePublicSharingSitesChatterAnswers?:
    | KnowledgeSitesSettings
    | null
    | undefined;
  assignTo?: string | null | undefined;
  customizationClass?: string | null | undefined;
  defaultContributionArticleType?: string | null | undefined;
  editor?: string | null | undefined;
  enableArticleCreation?: boolean | null | undefined;
  enableArticlePublicSharingSites?: boolean | null | undefined;
  enableCaseDataCategoryMapping?: boolean | null | undefined;
  useProfileForPDFCreation?: boolean | null | undefined;
};

export type KnowledgeCommunitiesSettings = {
  community: string[];
};

export type KnowledgeSitesSettings = {
  site: string[];
};

export type KnowledgeLanguageSettings = {
  language: KnowledgeLanguage[];
};

export type KnowledgeLanguage = {
  active?: boolean | null | undefined;
  defaultAssignee?: string | null | undefined;
  defaultAssigneeType?: string | null | undefined;
  defaultReviewer?: string | null | undefined;
  defaultReviewerType?: string | null | undefined;
  name: string;
};

export type KnowledgeSuggestedArticlesSettings = {
  caseFields?: KnowledgeCaseFieldsSettings | null | undefined;
  useSuggestedArticlesForCase?: boolean | null | undefined;
  workOrderFields?: KnowledgeWorkOrderFieldsSettings | null | undefined;
  workOrderLineItemFields?:
    | KnowledgeWorkOrderLineItemFieldsSettings
    | null
    | undefined;
};

export type KnowledgeCaseFieldsSettings = {
  field: KnowledgeCaseField[];
};

export type KnowledgeCaseField = {
  name?: string | null | undefined;
};

export type KnowledgeWorkOrderFieldsSettings = {
  field: KnowledgeWorkOrderField[];
};

export type KnowledgeWorkOrderField = {
  name?: string | null | undefined;
};

export type KnowledgeWorkOrderLineItemFieldsSettings = {
  field: KnowledgeWorkOrderLineItemField[];
};

export type KnowledgeWorkOrderLineItemField = {
  name?: string | null | undefined;
};

export type LanguageSettings = Metadata & {
  enableCanadaIcuFormat?: boolean | null | undefined;
  enableEndUserLanguages?: boolean | null | undefined;
  enableICULocaleDateFormat?: boolean | null | undefined;
  enablePlatformLanguages?: boolean | null | undefined;
  enableTranslationWorkbench?: boolean | null | undefined;
  useLanguageFallback?: boolean | null | undefined;
};

export type Layout = Metadata & {
  customButtons: string[];
  customConsoleComponents?: CustomConsoleComponents | null | undefined;
  emailDefault?: boolean | null | undefined;
  excludeButtons: string[];
  feedLayout?: FeedLayout | null | undefined;
  headers: string[];
  layoutSections: LayoutSection[];
  miniLayout?: MiniLayout | null | undefined;
  multilineLayoutFields: string[];
  platformActionList?: PlatformActionList | null | undefined;
  quickActionList?: QuickActionList | null | undefined;
  relatedContent?: RelatedContent | null | undefined;
  relatedLists: RelatedListItem[];
  relatedObjects: string[];
  runAssignmentRulesDefault?: boolean | null | undefined;
  showEmailCheckbox?: boolean | null | undefined;
  showHighlightsPanel?: boolean | null | undefined;
  showInteractionLogPanel?: boolean | null | undefined;
  showKnowledgeComponent?: boolean | null | undefined;
  showRunAssignmentRulesCheckbox?: boolean | null | undefined;
  showSolutionSection?: boolean | null | undefined;
  showSubmitAndAttachButton?: boolean | null | undefined;
  summaryLayout?: SummaryLayout | null | undefined;
};

export type CustomConsoleComponents = {
  primaryTabComponents?: PrimaryTabComponents | null | undefined;
  subtabComponents?: SubtabComponents | null | undefined;
};

export type PrimaryTabComponents = {
  containers: Container[];
};

export type Container = {
  height?: number | null | undefined;
  isContainerAutoSizeEnabled: boolean;
  region: string;
  sidebarComponents: SidebarComponent[];
  style: string;
  unit: string;
  width?: number | null | undefined;
};

export type SidebarComponent = {
  componentType: string;
  createAction?: string | null | undefined;
  enableLinking?: boolean | null | undefined;
  height?: number | null | undefined;
  label?: string | null | undefined;
  lookup?: string | null | undefined;
  page?: string | null | undefined;
  relatedLists: RelatedList[];
  unit?: string | null | undefined;
  updateAction?: string | null | undefined;
  width?: number | null | undefined;
};

export type RelatedList = {
  hideOnDetail: boolean;
  name: string;
};

export type SubtabComponents = {
  containers: Container[];
};

export type FeedLayout = {
  autocollapsePublisher?: boolean | null | undefined;
  compactFeed?: boolean | null | undefined;
  feedFilterPosition?: string | null | undefined;
  feedFilters: FeedLayoutFilter[];
  fullWidthFeed?: boolean | null | undefined;
  hideSidebar?: boolean | null | undefined;
  highlightExternalFeedItems?: boolean | null | undefined;
  leftComponents: FeedLayoutComponent[];
  rightComponents: FeedLayoutComponent[];
  useInlineFiltersInConsole?: boolean | null | undefined;
};

export type FeedLayoutFilter = {
  feedFilterName?: string | null | undefined;
  feedFilterType: string;
  feedItemType?: string | null | undefined;
};

export type FeedLayoutComponent = {
  componentType: string;
  height?: number | null | undefined;
  page?: string | null | undefined;
};

export type LayoutSection = {
  customLabel?: boolean | null | undefined;
  detailHeading?: boolean | null | undefined;
  editHeading?: boolean | null | undefined;
  label?: string | null | undefined;
  layoutColumns: LayoutColumn[];
  style: string;
};

export type LayoutColumn = {
  layoutItems: LayoutItem[];
  reserved?: string | null | undefined;
};

export type LayoutItem = {
  analyticsCloudComponent?:
    | AnalyticsCloudComponentLayoutItem
    | null
    | undefined;
  behavior?: string | null | undefined;
  canvas?: string | null | undefined;
  component?: string | null | undefined;
  customLink?: string | null | undefined;
  emptySpace?: boolean | null | undefined;
  field?: string | null | undefined;
  height?: number | null | undefined;
  page?: string | null | undefined;
  reportChartComponent?: ReportChartComponentLayoutItem | null | undefined;
  scontrol?: string | null | undefined;
  showLabel?: boolean | null | undefined;
  showScrollbars?: boolean | null | undefined;
  width?: string | null | undefined;
};

export type AnalyticsCloudComponentLayoutItem = {
  assetType: string;
  devName: string;
  error?: string | null | undefined;
  filter?: string | null | undefined;
  height?: number | null | undefined;
  hideOnError?: boolean | null | undefined;
  showHeader?: boolean | null | undefined;
  showSharing?: boolean | null | undefined;
  showTitle?: boolean | null | undefined;
  width?: string | null | undefined;
};

export type ReportChartComponentLayoutItem = {
  cacheData?: boolean | null | undefined;
  contextFilterableField?: string | null | undefined;
  error?: string | null | undefined;
  hideOnError?: boolean | null | undefined;
  includeContext?: boolean | null | undefined;
  reportName: string;
  showTitle?: boolean | null | undefined;
  size?: string | null | undefined;
};

export type MiniLayout = {
  fields: string[];
  relatedLists: RelatedListItem[];
};

export type RelatedListItem = {
  customButtons: string[];
  excludeButtons: string[];
  fields: string[];
  relatedList: string;
  sortField?: string | null | undefined;
  sortOrder?: string | null | undefined;
};

export type RelatedContent = {
  relatedContentItems: RelatedContentItem[];
};

export type RelatedContentItem = {
  layoutItem: LayoutItem;
};

export type SummaryLayout = {
  masterLabel: string;
  sizeX: number;
  sizeY?: number | null | undefined;
  sizeZ?: number | null | undefined;
  summaryLayoutItems: SummaryLayoutItem[];
  summaryLayoutStyle: string;
};

export type SummaryLayoutItem = {
  customLink?: string | null | undefined;
  field?: string | null | undefined;
  posX: number;
  posY?: number | null | undefined;
  posZ?: number | null | undefined;
};

export type LeadConfigSettings = Metadata & {
  doesEnableLeadConvertDefaultSubjectBlankTaskCreation?:
    | boolean
    | null
    | undefined;
  doesHideOpportunityInConvertLeadWindow?: boolean | null | undefined;
  doesPreserveLeadStatus?: boolean | null | undefined;
  doesSelectNoOpportunityOnConvertLead?: boolean | null | undefined;
  doesTrackHistory?: boolean | null | undefined;
  enableConversionsOnMobile?: boolean | null | undefined;
  enableOrgWideMergeAndDelete?: boolean | null | undefined;
  shouldLeadConvertRequireValidation?: boolean | null | undefined;
};

export type LeadConvertSettings = Metadata & {
  allowOwnerChange?: boolean | null | undefined;
  objectMapping: ObjectMapping[];
  opportunityCreationOptions?: string | null | undefined;
};

export type Letterhead = Metadata & {
  available: boolean;
  backgroundColor: string;
  bodyColor: string;
  bottomLine: LetterheadLine;
  description?: string | null | undefined;
  footer: LetterheadHeaderFooter;
  header: LetterheadHeaderFooter;
  middleLine: LetterheadLine;
  name: string;
  topLine: LetterheadLine;
};

export type LetterheadLine = {
  color: string;
  height: number;
};

export type LetterheadHeaderFooter = {
  backgroundColor: string;
  height: number;
  horizontalAlignment?: string | null | undefined;
  logo?: string | null | undefined;
  verticalAlignment?: string | null | undefined;
};

export type LicenseDefinition = Metadata & {
  aggregationGroup: string;
  description?: string | null | undefined;
  isPublished: boolean;
  label: string;
  licensedCustomPermissions: LicensedCustomPermissions[];
  licensingAuthority: string;
  licensingAuthorityProvider: string;
  minPlatformVersion: number;
  origin: string;
  revision: number;
  trialLicenseDuration: number;
  trialLicenseQuantity: number;
};

export type LicensedCustomPermissions = {
  customPermission: string;
  licenseDefinition: string;
};

export type LightningBolt = Metadata & {
  category: string;
  lightningBoltFeatures: LightningBoltFeatures[];
  lightningBoltImages: LightningBoltImages[];
  lightningBoltItems: LightningBoltItems[];
  masterLabel: string;
  publisher: string;
  summary: string;
};

export type LightningBoltFeatures = {
  description?: string | null | undefined;
  order: number;
  title: string;
};

export type LightningBoltImages = {
  image: string;
  order: number;
};

export type LightningBoltItems = {
  name: string;
  type: string;
};

export type LightningComponentBundle = Metadata & {
  apiVersion?: number | null | undefined;
  description?: string | null | undefined;
  isExplicitImport?: boolean | null | undefined;
  isExposed?: boolean | null | undefined;
  lwcResources?: LwcResources | null | undefined;
  masterLabel?: string | null | undefined;
  runtimeNamespace?: string | null | undefined;
  targetConfigs?: string | null | undefined;
  targets?: Targets | null | undefined;
};

export type LwcResources = {
  lwcResource: LwcResource[];
};

export type LwcResource = {
  filePath: string;
  source: string;
};

export type Targets = {
  target: string[];
};

export type LightningExperienceSettings = Metadata & {
  enableAccessCheckCrucPref?: boolean | null | undefined;
  enableApiUserLtngOutAccessPref?: boolean | null | undefined;
  enableAuraCDNPref?: boolean | null | undefined;
  enableFeedbackInMobile?: boolean | null | undefined;
  enableIE11DeprecationMsgHidden?: boolean | null | undefined;
  enableIE11LEXCrucPref?: boolean | null | undefined;
  enableInAppTooltips?: boolean | null | undefined;
  enableLEXOnIpadEnabled?: boolean | null | undefined;
  enableLexEndUsersNoSwitching?: boolean | null | undefined;
  enableNavPersonalizationOptOut?: boolean | null | undefined;
  enableRemoveThemeBrandBanner?: boolean | null | undefined;
  enableS1BannerPref?: boolean | null | undefined;
  enableS1BrowserEnabled?: boolean | null | undefined;
  enableS1DesktopEnabled?: boolean | null | undefined;
  enableS1UiLoggingEnabled?: boolean | null | undefined;
  enableTryLightningOptOut?: boolean | null | undefined;
  enableUseS1AlohaDesktop?: boolean | null | undefined;
  enableUsersAreLightningOnly?: boolean | null | undefined;
};

export type LightningExperienceTheme = Metadata & {
  defaultBrandingSet: string;
  description?: string | null | undefined;
  masterLabel: string;
  shouldOverrideLoadingImage?: boolean | null | undefined;
};

export type LightningMessageChannel = Metadata & {
  description?: string | null | undefined;
  isExposed?: boolean | null | undefined;
  lightningMessageFields: LightningMessageField[];
  masterLabel: string;
};

export type LightningMessageField = {
  description?: string | null | undefined;
  fieldName: string;
};

export type LightningOnboardingConfig = Metadata & {
  collaborationGroup?: string | null | undefined;
  customQuestion: string;
  feedbackFormDaysFrequency: number;
  isCustom: boolean;
  masterLabel: string;
  sendFeedbackToSalesforce: boolean;
};

export type LiveAgentSettings = Metadata & {
  enableLiveAgent?: boolean | null | undefined;
  enableQuickTextEnabled?: boolean | null | undefined;
};

export type LiveChatAgentConfig = Metadata & {
  assignments?: AgentConfigAssignments | null | undefined;
  autoGreeting?: string | null | undefined;
  capacity?: number | null | undefined;
  criticalWaitTime?: number | null | undefined;
  customAgentName?: string | null | undefined;
  enableAgentFileTransfer?: boolean | null | undefined;
  enableAgentSneakPeek?: boolean | null | undefined;
  enableAssistanceFlag?: boolean | null | undefined;
  enableAutoAwayOnDecline?: boolean | null | undefined;
  enableAutoAwayOnPushTimeout?: boolean | null | undefined;
  enableChatConferencing?: boolean | null | undefined;
  enableChatMonitoring?: boolean | null | undefined;
  enableChatTransferToAgent?: boolean | null | undefined;
  enableChatTransferToButton?: boolean | null | undefined;
  enableChatTransferToSkill?: boolean | null | undefined;
  enableLogoutSound?: boolean | null | undefined;
  enableNotifications?: boolean | null | undefined;
  enableRequestSound?: boolean | null | undefined;
  enableSneakPeek?: boolean | null | undefined;
  enableVisitorBlocking?: boolean | null | undefined;
  enableWhisperMessage?: boolean | null | undefined;
  label: string;
  supervisorDefaultAgentStatusFilter?: string | null | undefined;
  supervisorDefaultButtonFilter?: string | null | undefined;
  supervisorDefaultSkillFilter?: string | null | undefined;
  supervisorSkills?: SupervisorAgentConfigSkills | null | undefined;
  transferableButtons?: AgentConfigButtons | null | undefined;
  transferableSkills?: AgentConfigSkills | null | undefined;
};

export type AgentConfigAssignments = {
  profiles?: AgentConfigProfileAssignments | null | undefined;
  users?: AgentConfigUserAssignments | null | undefined;
};

export type AgentConfigProfileAssignments = {
  profile: string[];
};

export type AgentConfigUserAssignments = {
  user: string[];
};

export type SupervisorAgentConfigSkills = {
  skill: string[];
};

export type AgentConfigButtons = {
  button: string[];
};

export type AgentConfigSkills = {
  skill: string[];
};

export type LiveChatButton = Metadata & {
  animation?: string | null | undefined;
  autoGreeting?: string | null | undefined;
  chasitorIdleTimeout?: number | null | undefined;
  chasitorIdleTimeoutWarning?: number | null | undefined;
  chatPage?: string | null | undefined;
  customAgentName?: string | null | undefined;
  deployments?: LiveChatButtonDeployments | null | undefined;
  enableQueue?: boolean | null | undefined;
  inviteEndPosition?: string | null | undefined;
  inviteImage?: string | null | undefined;
  inviteStartPosition?: string | null | undefined;
  isActive?: boolean | null | undefined;
  label: string;
  numberOfReroutingAttempts?: number | null | undefined;
  offlineImage?: string | null | undefined;
  onlineImage?: string | null | undefined;
  optionsCustomRoutingIsEnabled?: boolean | null | undefined;
  optionsHasChasitorIdleTimeout: boolean;
  optionsHasInviteAfterAccept?: boolean | null | undefined;
  optionsHasInviteAfterReject?: boolean | null | undefined;
  optionsHasRerouteDeclinedRequest?: boolean | null | undefined;
  optionsIsAutoAccept?: boolean | null | undefined;
  optionsIsInviteAutoRemove?: boolean | null | undefined;
  overallQueueLength?: number | null | undefined;
  perAgentQueueLength?: number | null | undefined;
  postChatPage?: string | null | undefined;
  postChatUrl?: string | null | undefined;
  preChatFormPage?: string | null | undefined;
  preChatFormUrl?: string | null | undefined;
  pushTimeOut?: number | null | undefined;
  routingType: string;
  site?: string | null | undefined;
  skills?: LiveChatButtonSkills | null | undefined;
  timeToRemoveInvite?: number | null | undefined;
  type: string;
  windowLanguage?: string | null | undefined;
};

export type LiveChatButtonDeployments = {
  deployment: string[];
};

export type LiveChatButtonSkills = {
  skill: string[];
};

export type LiveChatDeployment = Metadata & {
  brandingImage?: string | null | undefined;
  connectionTimeoutDuration?: number | null | undefined;
  connectionWarningDuration?: number | null | undefined;
  displayQueuePosition?: boolean | null | undefined;
  domainWhiteList?: LiveChatDeploymentDomainWhitelist | null | undefined;
  enablePrechatApi?: boolean | null | undefined;
  enableTranscriptSave?: boolean | null | undefined;
  label: string;
  mobileBrandingImage?: string | null | undefined;
  site?: string | null | undefined;
  windowTitle: string;
};

export type LiveChatDeploymentDomainWhitelist = {
  domain: string[];
};

export type LiveChatSensitiveDataRule = Metadata & {
  actionType: string;
  description?: string | null | undefined;
  enforceOn: number;
  isEnabled: boolean;
  pattern: string;
  priority: number;
  replacement?: string | null | undefined;
};

export type LiveMessageSettings = Metadata & {
  enableLiveMessage?: boolean | null | undefined;
};

export type MacroSettings = Metadata & {
  enableAdvancedSearch?: boolean | null | undefined;
  macrosInFolders?: boolean | null | undefined;
};

export type ManagedContentType = Metadata & {
  description?: string | null | undefined;
  developerName: string;
  managedContentNodeTypes: ManagedContentNodeType[];
  masterLabel: string;
};

export type ManagedContentNodeType = {
  helpText?: string | null | undefined;
  isLocalizable?: boolean | null | undefined;
  isRequired?: boolean | null | undefined;
  nodeLabel: string;
  nodeName: string;
  nodeType: string;
  placeholderText?: string | null | undefined;
};

export type ManagedTopic = Metadata & {
  managedTopicType: string;
  name: string;
  parentName: string;
  position: number;
  topicDescription: string;
};

export type ManagedTopics = Metadata & {
  managedTopic: ManagedTopic[];
};

export type SourceTrackingSettings = Metadata & {
  enableSourceTrackingSandboxes?: boolean | null | undefined;
};

export type MapsAndLocationSettings = Metadata & {
  enableAddressAutoComplete?: boolean | null | undefined;
  enableMapsAndLocation?: boolean | null | undefined;
};
export type MatchingRule = Metadata & {
  booleanFilter?: string | null | undefined;
  description?: string | null | undefined;
  label: string;
  matchingRuleItems: MatchingRuleItem[];
  ruleStatus: string;
};

export type MatchingRuleItem = {
  blankValueBehavior?: string | null | undefined;
  fieldName: string;
  matchingMethod: string;
};

export type MatchingRules = Metadata & {
  matchingRules: MatchingRule[];
};

export type MetadataWithContent = Metadata & {
  content?: string | null | undefined;
};

export type AccessControlPolicy = MetadataWithContent & {
  active: boolean;
  deploymentStatus: string;
  description?: string | null | undefined;
  masterLabel: string;
  targetEntity: string;
  version: number;
};

export type ApexClass = MetadataWithContent & {
  apiVersion: number;
  packageVersions: PackageVersion[];
  status: string;
};

export type ApexComponent = MetadataWithContent & {
  apiVersion?: number | null | undefined;
  description?: string | null | undefined;
  label: string;
  packageVersions: PackageVersion[];
};

export type ApexPage = MetadataWithContent & {
  apiVersion: number;
  availableInTouch?: boolean | null | undefined;
  confirmationTokenRequired?: boolean | null | undefined;
  description?: string | null | undefined;
  label: string;
  packageVersions: PackageVersion[];
};

export type ApexTrigger = MetadataWithContent & {
  apiVersion: number;
  packageVersions: PackageVersion[];
  status: string;
};

export type Certificate = MetadataWithContent & {
  caSigned: boolean;
  encryptedWithPlatformEncryption?: boolean | null | undefined;
  expirationDate?: string | null | undefined;
  keySize?: number | null | undefined;
  masterLabel: string;
  privateKeyExportable?: boolean | null | undefined;
};

export type ContentAsset = MetadataWithContent & {
  format?: string | null | undefined;
  isVisibleByExternalUsers?: boolean | null | undefined;
  language: string;
  masterLabel: string;
  originNetwork?: string | null | undefined;
  relationships?: ContentAssetRelationships | null | undefined;
  versions: ContentAssetVersions;
};

export type ContentAssetRelationships = {
  insightsApplication: ContentAssetLink[];
  network: ContentAssetLink[];
  organization?: ContentAssetLink | null | undefined;
  workspace: ContentAssetLink[];
};

export type ContentAssetLink = {
  access: string;
  isManagingWorkspace?: boolean | null | undefined;
  name?: string | null | undefined;
};

export type ContentAssetVersions = {
  version: ContentAssetVersion[];
};

export type ContentAssetVersion = {
  number: string;
  pathOnClient: string;
  zipEntry?: string | null | undefined;
};

export type Document = MetadataWithContent & {
  description?: string | null | undefined;
  internalUseOnly: boolean;
  keywords?: string | null | undefined;
  name?: string | null | undefined;
  public: boolean;
};

export type EclairGeoData = MetadataWithContent & {
  maps: EclairMap[];
  masterLabel: string;
};

export type EclairMap = {
  boundingBoxBottom?: number | null | undefined;
  boundingBoxLeft?: number | null | undefined;
  boundingBoxRight?: number | null | undefined;
  boundingBoxTop?: number | null | undefined;
  mapLabel?: string | null | undefined;
  mapName: string;
  projection: string;
};

export type EmailTemplate = MetadataWithContent & {
  apiVersion?: number | null | undefined;
  attachedDocuments: string[];
  attachments: Attachment[];
  available: boolean;
  description?: string | null | undefined;
  encodingKey: string;
  letterhead?: string | null | undefined;
  name: string;
  packageVersions: PackageVersion[];
  relatedEntityType?: string | null | undefined;
  style: string;
  subject?: string | null | undefined;
  textOnly?: string | null | undefined;
  type: string;
  uiType?: string | null | undefined;
};

export type Attachment = {
  content: string;
  name: string;
};

export type NetworkBranding = MetadataWithContent & {
  loginBackgroundImageUrl?: string | null | undefined;
  loginFooterText?: string | null | undefined;
  loginLogo?: string | null | undefined;
  loginLogoName?: string | null | undefined;
  loginPrimaryColor?: string | null | undefined;
  loginQuaternaryColor?: string | null | undefined;
  loginRightFrameUrl?: string | null | undefined;
  network?: string | null | undefined;
  pageFooter?: string | null | undefined;
  pageHeader?: string | null | undefined;
  primaryColor: string;
  primaryComplementColor: string;
  quaternaryColor: string;
  quaternaryComplementColor: string;
  secondaryColor: string;
  staticLogoImageUrl?: string | null | undefined;
  tertiaryColor: string;
  tertiaryComplementColor: string;
  zeronaryColor: string;
  zeronaryComplementColor: string;
};

export type Orchestration = MetadataWithContent & {
  context: string;
  masterLabel: string;
};

export type Scontrol = MetadataWithContent & {
  contentSource: string;
  description?: string | null | undefined;
  encodingKey: string;
  fileContent?: string | null | undefined;
  fileName?: string | null | undefined;
  name: string;
  supportsCaching: boolean;
};

export type SiteDotCom = MetadataWithContent & {
  label: string;
  siteType: string;
};

export type StaticResource = MetadataWithContent & {
  cacheControl: string;
  contentType: string;
  description?: string | null | undefined;
};

export type UiPlugin = MetadataWithContent & {
  description?: string | null | undefined;
  extensionPointIdentifier: string;
  isEnabled: boolean;
  language: string;
  masterLabel: string;
};

export type WaveDashboard = MetadataWithContent & {
  application: string;
  description?: string | null | undefined;
  masterLabel: string;
  templateAssetSourceName?: string | null | undefined;
};

export type WaveDataflow = MetadataWithContent & {
  dataflowType?: string | null | undefined;
  description?: string | null | undefined;
  masterLabel: string;
};

export type WaveLens = MetadataWithContent & {
  application: string;
  datasets: string[];
  description?: string | null | undefined;
  masterLabel: string;
  templateAssetSourceName?: string | null | undefined;
  visualizationType: string;
};

export type WaveRecipe = MetadataWithContent & {
  dataflow: string;
  masterLabel: string;
  securityPredicate?: string | null | undefined;
  targetDatasetAlias: string;
};

export type MilestoneType = Metadata & {
  description?: string | null | undefined;
  recurrenceType?: string | null | undefined;
};

export type MlDomain = Metadata & {
  description?: string | null | undefined;
  label: string;
  mlIntents: MlIntent[];
  mlSlotClasses: MlSlotClass[];
};

export type MobileApplicationDetail = Metadata & {
  applicationBinaryFile?: string | null | undefined;
  applicationBinaryFileName?: string | null | undefined;
  applicationBundleIdentifier?: string | null | undefined;
  applicationFileLength?: number | null | undefined;
  applicationIconFile?: string | null | undefined;
  applicationIconFileName?: string | null | undefined;
  applicationInstallUrl?: string | null | undefined;
  devicePlatform: string;
  deviceType?: string | null | undefined;
  minimumOsVersion?: string | null | undefined;
  privateApp?: boolean | null | undefined;
  version: string;
};

export type MobileSettings = Metadata & {
  dashboardMobile?: DashboardMobileSettings | null | undefined;
  enableImportContactFromDevice?: boolean | null | undefined;
  enableLightningOnMobile?: boolean | null | undefined;
  enableOfflineDraftsEnabled?: boolean | null | undefined;
  enablePopulateNameManuallyInToday?: boolean | null | undefined;
  enableS1EncryptedStoragePref2?: boolean | null | undefined;
  enableS1OfflinePref?: boolean | null | undefined;
};

export type DashboardMobileSettings = {
  enableDashboardIPadApp?: boolean | null | undefined;
};

export type ModerationRule = Metadata & {
  action: string;
  actionLimit?: number | null | undefined;
  active: boolean;
  description?: string | null | undefined;
  entitiesAndFields: ModeratedEntityField[];
  masterLabel: string;
  notifyLimit?: number | null | undefined;
  timePeriod?: string | null | undefined;
  type?: string | null | undefined;
  userCriteria: string[];
  userMessage?: string | null | undefined;
};

export type ModeratedEntityField = {
  entityName: string;
  fieldName?: string | null | undefined;
  keywordList?: string | null | undefined;
};

export type MyDomainSettings = Metadata & {
  canOnlyLoginWithMyDomainUrl?: boolean | null | undefined;
  doesApiLoginRequireOrgDomain?: boolean | null | undefined;
  enableNativeBrowserForAuthOnAndroid?: boolean | null | undefined;
  enableNativeBrowserForAuthOnIos?: boolean | null | undefined;
  useStabilizedMyDomainHostnames?: boolean | null | undefined;
  useStabilizedSandboxMyDomainHostnames?: boolean | null | undefined;
};

export type NameSettings = Metadata & {
  enableMiddleName?: boolean | null | undefined;
  enableNameSuffix?: boolean | null | undefined;
};

export type NamedCredential = Metadata & {
  allowMergeFieldsInBody?: boolean | null | undefined;
  allowMergeFieldsInHeader?: boolean | null | undefined;
  authProvider?: string | null | undefined;
  authTokenEndpointUrl?: string | null | undefined;
  awsAccessKey?: string | null | undefined;
  awsAccessSecret?: string | null | undefined;
  awsRegion?: string | null | undefined;
  awsService?: string | null | undefined;
  certificate?: string | null | undefined;
  endpoint?: string | null | undefined;
  generateAuthorizationHeader?: boolean | null | undefined;
  jwtAudience?: string | null | undefined;
  jwtFormulaSubject?: string | null | undefined;
  jwtIssuer?: string | null | undefined;
  jwtSigningCertificate?: string | null | undefined;
  jwtTextSubject?: string | null | undefined;
  jwtValidityPeriodSeconds?: number | null | undefined;
  label: string;
  oauthRefreshToken?: string | null | undefined;
  oauthScope?: string | null | undefined;
  oauthToken?: string | null | undefined;
  password?: string | null | undefined;
  principalType: string;
  privateConnection?: string | null | undefined;
  protocol: string;
  username?: string | null | undefined;
};

export type NavigationMenu = Metadata & {
  container: string;
  containerType: string;
  label: string;
  navigationMenuItem: NavigationMenuItem[];
};

export type Network = Metadata & {
  allowInternalUserLogin?: boolean | null | undefined;
  allowMembersToFlag?: boolean | null | undefined;
  allowedExtensions?: string | null | undefined;
  caseCommentEmailTemplate?: string | null | undefined;
  changePasswordTemplate: string;
  communityRoles?: CommunityRoles | null | undefined;
  description?: string | null | undefined;
  disableReputationRecordConversations?: boolean | null | undefined;
  emailFooterLogo?: string | null | undefined;
  emailFooterText?: string | null | undefined;
  emailSenderAddress: string;
  emailSenderName: string;
  enableCustomVFErrorPageOverrides?: boolean | null | undefined;
  enableDirectMessages?: boolean | null | undefined;
  enableGuestChatter?: boolean | null | undefined;
  enableGuestFileAccess?: boolean | null | undefined;
  enableGuestMemberVisibility?: boolean | null | undefined;
  enableInvitation?: boolean | null | undefined;
  enableKnowledgeable?: boolean | null | undefined;
  enableMemberVisibility?: boolean | null | undefined;
  enableNicknameDisplay?: boolean | null | undefined;
  enablePrivateMessages?: boolean | null | undefined;
  enableReputation?: boolean | null | undefined;
  enableShowAllNetworkSettings?: boolean | null | undefined;
  enableSiteAsContainer?: boolean | null | undefined;
  enableTalkingAboutStats?: boolean | null | undefined;
  enableTopicAssignmentRules?: boolean | null | undefined;
  enableTopicSuggestions?: boolean | null | undefined;
  enableUpDownVote?: boolean | null | undefined;
  feedChannel?: string | null | undefined;
  forgotPasswordTemplate: string;
  gatherCustomerSentimentData?: boolean | null | undefined;
  lockoutTemplate?: string | null | undefined;
  logoutUrl?: string | null | undefined;
  maxFileSizeKb?: number | null | undefined;
  navigationLinkSet?: NavigationLinkSet | null | undefined;
  networkMemberGroups?: NetworkMemberGroup | null | undefined;
  networkPageOverrides?: NetworkPageOverride | null | undefined;
  newSenderAddress?: string | null | undefined;
  picassoSite?: string | null | undefined;
  recommendationAudience?: RecommendationAudience | null | undefined;
  recommendationDefinition?: RecommendationDefinition | null | undefined;
  reputationLevels?: ReputationLevelDefinitions | null | undefined;
  reputationPointsRules?: ReputationPointsRules | null | undefined;
  selfRegProfile?: string | null | undefined;
  selfRegistration?: boolean | null | undefined;
  sendWelcomeEmail?: boolean | null | undefined;
  site: string;
  status: string;
  tabs: NetworkTabSet;
  urlPathPrefix?: string | null | undefined;
  verificationTemplate?: string | null | undefined;
  welcomeTemplate: string;
};

export type CommunityRoles = {
  customerUserRole?: string | null | undefined;
  employeeUserRole?: string | null | undefined;
  partnerUserRole?: string | null | undefined;
};

export type NetworkMemberGroup = {
  permissionSet: string[];
  profile: string[];
};

export type NetworkPageOverride = {
  changePasswordPageOverrideSetting?: string | null | undefined;
  forgotPasswordPageOverrideSetting?: string | null | undefined;
  homePageOverrideSetting?: string | null | undefined;
  loginPageOverrideSetting?: string | null | undefined;
  selfRegProfilePageOverrideSetting?: string | null | undefined;
};

export type RecommendationAudience = {
  recommendationAudienceDetails: RecommendationAudienceDetail[];
};

export type RecommendationAudienceDetail = {
  audienceCriteriaType?: string | null | undefined;
  audienceCriteriaValue?: string | null | undefined;
  setupName?: string | null | undefined;
};

export type RecommendationDefinition = {
  recommendationDefinitionDetails: RecommendationDefinitionDetail[];
};

export type RecommendationDefinitionDetail = {
  actionUrl?: string | null | undefined;
  description?: string | null | undefined;
  linkText?: string | null | undefined;
  scheduledRecommendations?: ScheduledRecommendation | null | undefined;
  setupName?: string | null | undefined;
  title?: string | null | undefined;
};

export type ScheduledRecommendation = {
  scheduledRecommendationDetails: ScheduledRecommendationDetail[];
};

export type ScheduledRecommendationDetail = {
  channel?: string | null | undefined;
  enabled?: boolean | null | undefined;
  rank?: number | null | undefined;
  recommendationAudience?: string | null | undefined;
};

export type ReputationLevelDefinitions = {
  level: ReputationLevel[];
};

export type ReputationLevel = {
  branding?: ReputationBranding | null | undefined;
  label?: string | null | undefined;
  lowerThreshold: number;
};

export type ReputationBranding = {
  smallImage?: string | null | undefined;
};

export type ReputationPointsRules = {
  pointsRule: ReputationPointsRule[];
};

export type ReputationPointsRule = {
  eventType: string;
  points: number;
};

export type NetworkTabSet = {
  customTab: string[];
  defaultTab: string;
  standardTab: string[];
};

export type NotificationsSettings = Metadata & {
  enableMobileAppPushNotifications?: boolean | null | undefined;
  enableNotifications?: boolean | null | undefined;
};

export type OauthCustomScope = Metadata & {
  description: string;
  developerName: string;
  isProtected?: boolean | null | undefined;
  isPublic?: boolean | null | undefined;
  masterLabel: string;
};

export type ObjectLinkingSettings = Metadata & {
  enableObjectLinking?: boolean | null | undefined;
};

export type OmniChannelSettings = Metadata & {
  enableOmniAutoLoginPrompt?: boolean | null | undefined;
  enableOmniChannel?: boolean | null | undefined;
  enableOmniSecondaryRoutingPriority?: boolean | null | undefined;
  enableOmniSkillsRouting?: boolean | null | undefined;
};

export type OpportunitySettings = Metadata & {
  autoActivateNewReminders?: boolean | null | undefined;
  customizableProductSchedulesEnabled?: boolean | null | undefined;
  doesAutoAddSplitOwnerAsOpportunityTeamMember?: boolean | null | undefined;
  doesEnforceStandardOpportunitySaveLogic?: boolean | null | undefined;
  enableFindSimilarOpportunities?: boolean | null | undefined;
  enableOpportunityFieldHistoryTracking?: boolean | null | undefined;
  enableOpportunityInsightsInMobile?: boolean | null | undefined;
  enableOpportunityTeam?: boolean | null | undefined;
  enableUpdateReminders?: boolean | null | undefined;
  findSimilarOppFilter?: FindSimilarOppFilter | null | undefined;
  promptToAddProducts?: boolean | null | undefined;
};

export type FindSimilarOppFilter = {
  similarOpportunitiesDisplayColumns: string[];
  similarOpportunitiesMatchFields: string[];
};

export type OrchestrationContext = Metadata & {
  datasets: OrchestrationContextDataset[];
  description?: string | null | undefined;
  events: OrchestrationContextEvent[];
  imageFile: string;
  imageScale: number;
  masterLabel: string;
  runtimeType: string;
  salesforceObject?: string | null | undefined;
  salesforceObjectPrimaryKey?: string | null | undefined;
};

export type OrchestrationContextDataset = {
  datasetType: string;
  orchestrationDataset: string;
};

export type OrchestrationContextEvent = {
  eventType: string;
  orchestrationEvent: string;
  platformEvent: string;
  platformEventPrimaryKey: string;
};

export type OrderManagementSettings = Metadata & {
  enableOrderManagement?: boolean | null | undefined;
};

export type OrderSettings = Metadata & {
  enableNegativeQuantity?: boolean | null | undefined;
  enableOrders?: boolean | null | undefined;
  enableReductionOrders?: boolean | null | undefined;
  enableZeroQuantity?: boolean | null | undefined;
};

export type OrgPreferenceSettings = Metadata & {
  preferences: OrganizationSettingsDetail[];
};

export type OrganizationSettingsDetail = {
  settingName: string;
  settingValue: boolean;
};

export type OrgSettings = Metadata & {
  enableCustomerSuccessPortal?: boolean | null | undefined;
  enableExtendedMailMerge?: boolean | null | undefined;
  enableIncludeContractStatus?: boolean | null | undefined;
  enableMakeDeploymentsMandatory?: boolean | null | undefined;
  enableManageSelfServiceUsers?: boolean | null | undefined;
  enableOrgFeedSentimentAnalysis?: boolean | null | undefined;
  enableRADeploymentAttributeOnly?: boolean | null | undefined;
  enableResetDivisionOnLogin?: boolean | null | undefined;
  saveMailMergeDocsAsSalesforceDocs?: boolean | null | undefined;
};

export type Package = Metadata & {
  apiAccessLevel?: string | null | undefined;
  description?: string | null | undefined;
  namespacePrefix?: string | null | undefined;
  objectPermissions: ProfileObjectPermissions[];
  packageType?: string | null | undefined;
  postInstallClass?: string | null | undefined;
  setupWeblink?: string | null | undefined;
  types: PackageTypeMembers[];
  uninstallClass?: string | null | undefined;
  version: string;
};

export type ProfileObjectPermissions = {
  allowCreate?: boolean | null | undefined;
  allowDelete?: boolean | null | undefined;
  allowEdit?: boolean | null | undefined;
  allowRead?: boolean | null | undefined;
  modifyAllRecords?: boolean | null | undefined;
  object: string;
  viewAllRecords?: boolean | null | undefined;
};

export type PackageTypeMembers = {
  members: string[];
  name: string;
};

export type PardotEinsteinSettings = Metadata & {
  enableCampaignInsight?: boolean | null | undefined;
  enableEngagementScore?: boolean | null | undefined;
};

export type PardotSettings = Metadata & {
  enableB2bmaAppEnabled?: boolean | null | undefined;
  enableEngagementHistoryDashboards?: boolean | null | undefined;
  enablePardotAppV1Enabled?: boolean | null | undefined;
  enablePardotEnabled?: boolean | null | undefined;
  enableProspectActivityDataset?: boolean | null | undefined;
};

export type PartyDataModelSettings = Metadata & {
  enableAutoSelectIndividualOnMerge?: boolean | null | undefined;
  enableConsentManagement?: boolean | null | undefined;
};

export type PathAssistant = Metadata & {
  active: boolean;
  entityName: string;
  fieldName: string;
  masterLabel: string;
  pathAssistantSteps: PathAssistantStep[];
  recordTypeName: string;
};

export type PathAssistantStep = {
  fieldNames: string[];
  info?: string | null | undefined;
  picklistValueName: string;
};

export type PathAssistantSettings = Metadata & {
  canOverrideAutoPathCollapseWithUserPref?: boolean | null | undefined;
  pathAssistantEnabled?: boolean | null | undefined;
};

export type PermissionSet = Metadata & {
  applicationVisibilities: PermissionSetApplicationVisibility[];
  classAccesses: PermissionSetApexClassAccess[];
  customMetadataTypeAccesses: PermissionSetCustomMetadataTypeAccess[];
  customPermissions: PermissionSetCustomPermissions[];
  description?: string | null | undefined;
  externalDataSourceAccesses: PermissionSetExternalDataSourceAccess[];
  fieldPermissions: PermissionSetFieldPermissions[];
  flowAccesses: PermissionSetFlowAccess[];
  hasActivationRequired?: boolean | null | undefined;
  label: string;
  license?: string | null | undefined;
  objectPermissions: PermissionSetObjectPermissions[];
  pageAccesses: PermissionSetApexPageAccess[];
  recordTypeVisibilities: PermissionSetRecordTypeVisibility[];
  tabSettings: PermissionSetTabSetting[];
  userPermissions: PermissionSetUserPermission[];
};

export type PermissionSetApplicationVisibility = {
  application: string;
  visible: boolean;
};

export type PermissionSetApexClassAccess = {
  apexClass: string;
  enabled: boolean;
};

export type PermissionSetCustomMetadataTypeAccess = {
  enabled: boolean;
  name: string;
};

export type PermissionSetCustomPermissions = {
  enabled: boolean;
  name: string;
};

export type PermissionSetExternalDataSourceAccess = {
  enabled: boolean;
  externalDataSource: string;
};

export type PermissionSetFieldPermissions = {
  editable: boolean;
  field: string;
  readable?: boolean | null | undefined;
};

export type PermissionSetFlowAccess = {
  enabled: boolean;
  flow: string;
};

export type PermissionSetObjectPermissions = {
  allowCreate: boolean;
  allowDelete: boolean;
  allowEdit: boolean;
  allowRead: boolean;
  modifyAllRecords: boolean;
  object: string;
  viewAllRecords: boolean;
};

export type PermissionSetApexPageAccess = {
  apexPage: string;
  enabled: boolean;
};

export type PermissionSetRecordTypeVisibility = {
  recordType: string;
  visible: boolean;
};

export type PermissionSetTabSetting = {
  tab: string;
  visibility: string;
};

export type PermissionSetUserPermission = {
  enabled: boolean;
  name: string;
};

export type MutingPermissionSet = PermissionSet & {
  label: string;
};

export type PermissionSetGroup = Metadata & {
  description?: string | null | undefined;
  label: string;
  mutingPermissionSets: string[];
  permissionSets: string[];
  status?: string | null | undefined;
};

export type PersonListSettings = Metadata & {
  enablePersonList: boolean;
};

export type PicklistSettings = Metadata & {
  isPicklistApiNameEditDisabled?: boolean | null | undefined;
};

export type PlatformCachePartition = Metadata & {
  description?: string | null | undefined;
  isDefaultPartition: boolean;
  masterLabel: string;
  platformCachePartitionTypes: PlatformCachePartitionType[];
};

export type PlatformCachePartitionType = {
  allocatedCapacity: number;
  allocatedPurchasedCapacity: number;
  allocatedTrialCapacity: number;
  cacheType: string;
};

export type PlatformEncryptionSettings = Metadata & {
  canEncryptManagedPackageFields?: boolean | null | undefined;
  enableDeterministicEncryption?: boolean | null | undefined;
  enableEncryptFieldHistory?: boolean | null | undefined;
  enableEventBusEncryption?: boolean | null | undefined;
  isMEKForEncryptionRequired?: boolean | null | undefined;
  isUseHighAssuranceKeysRequired?: boolean | null | undefined;
};

export type PlatformEventChannel = Metadata & {
  channelType: string;
  label: string;
};

export type PlatformEventChannelMember = Metadata & {
  eventChannel: string;
  selectedEntity: string;
};

export type Portal = Metadata & {
  active: boolean;
  admin?: string | null | undefined;
  defaultLanguage?: string | null | undefined;
  description?: string | null | undefined;
  emailSenderAddress: string;
  emailSenderName: string;
  enableSelfCloseCase?: boolean | null | undefined;
  footerDocument?: string | null | undefined;
  forgotPassTemplate?: string | null | undefined;
  headerDocument?: string | null | undefined;
  isSelfRegistrationActivated?: boolean | null | undefined;
  loginHeaderDocument?: string | null | undefined;
  logoDocument?: string | null | undefined;
  logoutUrl?: string | null | undefined;
  newCommentTemplate?: string | null | undefined;
  newPassTemplate?: string | null | undefined;
  newUserTemplate?: string | null | undefined;
  ownerNotifyTemplate?: string | null | undefined;
  selfRegNewUserUrl?: string | null | undefined;
  selfRegUserDefaultProfile?: string | null | undefined;
  selfRegUserDefaultRole?: string | null | undefined;
  selfRegUserTemplate?: string | null | undefined;
  showActionConfirmation?: boolean | null | undefined;
  stylesheetDocument?: string | null | undefined;
  type: string;
};

export type PostTemplate = Metadata & {
  default?: boolean | null | undefined;
  description?: string | null | undefined;
  fields: string[];
  label: string;
};

export type PresenceDeclineReason = Metadata & {
  label: string;
};

export type PresenceUserConfig = Metadata & {
  assignments?: PresenceConfigAssignments | null | undefined;
  capacity: number;
  declineReasons: string[];
  enableAutoAccept?: boolean | null | undefined;
  enableDecline?: boolean | null | undefined;
  enableDeclineReason?: boolean | null | undefined;
  enableDisconnectSound?: boolean | null | undefined;
  enableRequestSound?: boolean | null | undefined;
  label: string;
  presenceStatusOnDecline?: string | null | undefined;
  presenceStatusOnPushTimeout?: string | null | undefined;
};

export type PresenceConfigAssignments = {
  profiles?: PresenceConfigProfileAssignments | null | undefined;
  users?: PresenceConfigUserAssignments | null | undefined;
};

export type PresenceConfigProfileAssignments = {
  profile: string[];
};

export type PresenceConfigUserAssignments = {
  user: string[];
};

export type PrivacySettings = Metadata & {
  enableConsentAuditTrail?: boolean | null | undefined;
  enableConsentEventStream?: boolean | null | undefined;
  enableDefaultMetadataValues?: boolean | null | undefined;
};

export type PrivateConnection = Metadata & {
  description?: string | null | undefined;
  direction: string;
  externalConnectionProperties: ExternalConnectionProperty[];
  label: string;
  status: string;
  type: string;
};

export type ExternalConnectionProperty = {
  propertyName: string;
  propertyValue: string;
};

export type ProductSettings = Metadata & {
  enableCascadeActivateToRelatedPrices?: boolean | null | undefined;
  enableMySettings?: boolean | null | undefined;
  enableQuantitySchedule?: boolean | null | undefined;
  enableRevenueSchedule?: boolean | null | undefined;
};

export type Profile = Metadata & {
  applicationVisibilities: ProfileApplicationVisibility[];
  categoryGroupVisibilities: ProfileCategoryGroupVisibility[];
  classAccesses: ProfileApexClassAccess[];
  custom?: boolean | null | undefined;
  customMetadataTypeAccesses: ProfileCustomMetadataTypeAccess[];
  customPermissions: ProfileCustomPermissions[];
  description?: string | null | undefined;
  externalDataSourceAccesses: ProfileExternalDataSourceAccess[];
  fieldPermissions: ProfileFieldLevelSecurity[];
  flowAccesses: ProfileFlowAccess[];
  layoutAssignments: ProfileLayoutAssignment[];
  loginHours?: ProfileLoginHours | null | undefined;
  loginIpRanges: ProfileLoginIpRange[];
  objectPermissions: ProfileObjectPermissions[];
  pageAccesses: ProfileApexPageAccess[];
  profileActionOverrides: ProfileActionOverride[];
  recordTypeVisibilities: ProfileRecordTypeVisibility[];
  tabVisibilities: ProfileTabVisibility[];
  userLicense?: string | null | undefined;
  userPermissions: ProfileUserPermission[];
};

export type ProfileApplicationVisibility = {
  application: string;
  default: boolean;
  visible: boolean;
};

export type ProfileCategoryGroupVisibility = {
  dataCategories: string[];
  dataCategoryGroup: string;
  visibility: string;
};

export type ProfileApexClassAccess = {
  apexClass: string;
  enabled: boolean;
};

export type ProfileCustomMetadataTypeAccess = {
  enabled: boolean;
  name: string;
};

export type ProfileCustomPermissions = {
  enabled: boolean;
  name: string;
};

export type ProfileExternalDataSourceAccess = {
  enabled: boolean;
  externalDataSource: string;
};

export type ProfileFieldLevelSecurity = {
  editable: boolean;
  field: string;
  readable?: boolean | null | undefined;
};

export type ProfileFlowAccess = {
  enabled: boolean;
  flow: string;
};

export type ProfileLayoutAssignment = {
  layout: string;
  recordType?: string | null | undefined;
};

export type ProfileLoginHours = {
  fridayEnd?: string | null | undefined;
  fridayStart?: string | null | undefined;
  mondayEnd?: string | null | undefined;
  mondayStart?: string | null | undefined;
  saturdayEnd?: string | null | undefined;
  saturdayStart?: string | null | undefined;
  sundayEnd?: string | null | undefined;
  sundayStart?: string | null | undefined;
  thursdayEnd?: string | null | undefined;
  thursdayStart?: string | null | undefined;
  tuesdayEnd?: string | null | undefined;
  tuesdayStart?: string | null | undefined;
  wednesdayEnd?: string | null | undefined;
  wednesdayStart?: string | null | undefined;
};

export type ProfileLoginIpRange = {
  description?: string | null | undefined;
  endAddress: string;
  startAddress: string;
};

export type ProfileApexPageAccess = {
  apexPage: string;
  enabled: boolean;
};

export type ProfileRecordTypeVisibility = {
  default: boolean;
  personAccountDefault?: boolean | null | undefined;
  recordType: string;
  visible: boolean;
};

export type ProfileTabVisibility = {
  tab: string;
  visibility: string;
};

export type ProfileUserPermission = {
  enabled: boolean;
  name: string;
};

export type ProfilePasswordPolicy = Metadata & {
  forgotPasswordRedirect?: boolean | null | undefined;
  lockoutInterval: number;
  maxLoginAttempts: number;
  minimumPasswordLength: number;
  minimumPasswordLifetime?: boolean | null | undefined;
  obscure?: boolean | null | undefined;
  passwordComplexity: number;
  passwordExpiration: number;
  passwordHistory: number;
  passwordQuestion: number;
  profile: string;
};

export type ProfileSessionSetting = Metadata & {
  externalCommunityUserIdentityVerif: boolean;
  forceLogout: boolean;
  profile: string;
  requiredSessionLevel?: string | null | undefined;
  sessionPersistence: boolean;
  sessionTimeout: number;
  sessionTimeoutWarning: boolean;
};

export type Prompt = Metadata & {
  masterLabel: string;
  promptVersions: PromptVersion[];
};

export type PromptVersion = {
  actionButtonLabel?: string | null | undefined;
  actionButtonLink?: string | null | undefined;
  body: string;
  customApplication?: string | null | undefined;
  delayDays: number;
  description?: string | null | undefined;
  dismissButtonLabel?: string | null | undefined;
  displayPosition?: string | null | undefined;
  displayType: string;
  endDate?: string | null | undefined;
  header?: string | null | undefined;
  indexWithIsPublished?: string | null | undefined;
  indexWithoutIsPublished?: string | null | undefined;
  isPublished?: boolean | null | undefined;
  masterLabel: string;
  publishedByUser?: string | null | undefined;
  publishedDate?: string | null | undefined;
  shouldDisplayActionButton: boolean;
  startDate: string;
  targetAppDeveloperName: string;
  targetAppNamespacePrefix?: string | null | undefined;
  targetPageKey1: string;
  targetPageKey2?: string | null | undefined;
  targetPageType: string;
  timesToDisplay: number;
  title: string;
  uiFormulaRule?: UiFormulaRule | null | undefined;
  userAccess: string;
  versionNumber: number;
};

export type Queue = Metadata & {
  doesSendEmailToMembers?: boolean | null | undefined;
  email?: string | null | undefined;
  name: string;
  queueMembers?: QueueMembers | null | undefined;
  queueRoutingConfig?: string | null | undefined;
  queueSobject: QueueSobject[];
};

export type QueueMembers = {
  publicGroups?: PublicGroups | null | undefined;
  roleAndSubordinates?: RoleAndSubordinates | null | undefined;
  roleAndSubordinatesInternal?: RoleAndSubordinatesInternal | null | undefined;
  roles?: Roles | null | undefined;
  users?: Users | null | undefined;
};

export type PublicGroups = {
  publicGroup: string[];
};

export type RoleAndSubordinates = {
  roleAndSubordinate: string[];
};

export type RoleAndSubordinatesInternal = {
  roleAndSubordinateInternal: string[];
};

export type Roles = {
  role: string[];
};

export type Users = {
  user: string[];
};

export type QueueSobject = {
  sobjectType: string;
};

export type QueueRoutingConfig = Metadata & {
  capacityPercentage?: number | null | undefined;
  capacityWeight?: number | null | undefined;
  dropAdditionalSkillsTimeout?: number | null | undefined;
  isAttributeBased?: boolean | null | undefined;
  label: string;
  pushTimeout?: number | null | undefined;
  queueOverflowAssignee?: string | null | undefined;
  routingModel: string;
  routingPriority: number;
  userOverflowAssignee?: string | null | undefined;
};

export type QuickAction = Metadata & {
  canvas?: string | null | undefined;
  description?: string | null | undefined;
  fieldOverrides: FieldOverride[];
  flowDefinition?: string | null | undefined;
  height?: number | null | undefined;
  icon?: string | null | undefined;
  isProtected?: boolean | null | undefined;
  label?: string | null | undefined;
  lightningComponent?: string | null | undefined;
  mobExtDisplayMode?: string | null | undefined;
  optionsCreateFeedItem: boolean;
  page?: string | null | undefined;
  quickActionLayout?: QuickActionLayout | null | undefined;
  quickActionSendEmailOptions?: QuickActionSendEmailOptions | null | undefined;
  standardLabel?: string | null | undefined;
  successMessage?: string | null | undefined;
  targetObject?: string | null | undefined;
  targetParentField?: string | null | undefined;
  targetRecordType?: string | null | undefined;
  type: string;
  width?: number | null | undefined;
};

export type FieldOverride = {
  field: string;
  formula?: string | null | undefined;
  literalValue?: string | null | undefined;
};

export type QuickActionLayout = {
  layoutSectionStyle: string;
  quickActionLayoutColumns: QuickActionLayoutColumn[];
};

export type QuickActionLayoutColumn = {
  quickActionLayoutItems: QuickActionLayoutItem[];
};

export type QuickActionLayoutItem = {
  emptySpace?: boolean | null | undefined;
  field?: string | null | undefined;
  uiBehavior?: string | null | undefined;
};

export type QuickActionSendEmailOptions = {
  defaultEmailTemplateName?: string | null | undefined;
  ignoreDefaultEmailTemplateSubject: boolean;
};

export type QuoteSettings = Metadata & {
  enableQuote: boolean;
  enableQuotesWithoutOppEnabled?: boolean | null | undefined;
};

export type RecommendationStrategy = Metadata & {
  actionContext: StrategyAction[];
  contextRecordType?: string | null | undefined;
  description?: string | null | undefined;
  filter: StrategyNodeFilter[];
  if: StrategyNodeIf[];
  invocableAction: StrategyNodeInvocableAction[];
  isTemplate?: boolean | null | undefined;
  label: string;
  map: StrategyNodeMap[];
  mutuallyExclusive: StrategyNodeExclusive[];
  onBehalfOfExpression?: string | null | undefined;
  recommendationLimit: StrategyNodeRecommendationLimit[];
  recommendationLoad: StrategyNodeRecommendationLoad[];
  sort: StrategyNodeSort[];
  union: StrategyNodeUnion[];
};

export type StrategyAction = {
  action: string;
  argument: StrategyActionArg[];
  description?: string | null | undefined;
  label?: string | null | undefined;
  name: string;
  type: string;
};

export type StrategyActionArg = {
  name: string;
  value: string;
};

export type StrategyNodeFilter = StrategyNodeUnionBase & {
  expression: string;
};

export type StrategyNodeUnionBase = StrategyNodeBase & {
  limit?: number | null | undefined;
};

export type StrategyNodeBase = {
  childNode: string[];
  description?: string | null | undefined;
  label?: string | null | undefined;
  name: string;
};

export type StrategyNodeExclusive = StrategyNodeUnionBase & {};

export type StrategyNodeIf = StrategyNodeUnionBase & {
  childNodeExpression: IfExpression[];
  onlyFirstMatch?: boolean | null | undefined;
};

export type IfExpression = {
  childName: string;
  expression: string;
};

export type StrategyNodeInvocableAction = StrategyNodeUnionBase & {
  action: string;
  argument: StrategyNodeInvocableActionArg[];
  isGenerator: boolean;
  type: string;
};

export type StrategyNodeInvocableActionArg = {
  name: string;
  value: string;
};

export type StrategyNodeMap = StrategyNodeUnionBase & {
  mapExpression: MapExpression[];
};

export type MapExpression = {
  expression: string;
  name: string;
  type: string;
};

export type StrategyNodeRecommendationLimit = StrategyNodeUnionBase & {
  filterMode: string[];
  lookbackDuration?: number | null | undefined;
  maxRecommendationCount?: number | null | undefined;
};

export type StrategyNodeRecommendationLoad = StrategyNodeUnionBase & {
  condition: RecommendationLoadCondition[];
  conditionLogic?: string | null | undefined;
};

export type RecommendationLoadCondition = {
  field: string;
  operator: string;
  value: RecommendationConditionValue;
};

export type RecommendationConditionValue = {
  type: string;
  value?: string | null | undefined;
};

export type StrategyNodeSort = StrategyNodeUnionBase & {
  field: StrategyNodeSortField[];
};

export type StrategyNodeSortField = {
  name: string;
  nullsFirst?: boolean | null | undefined;
  order?: string | null | undefined;
};

export type StrategyNodeUnion = StrategyNodeUnionBase & {};

export type RecordActionDeployment = Metadata & {
  channelConfigurations: RecordActionDeploymentChannel[];
  deploymentContexts: RecordActionDeploymentContext[];
  hasGuidedActions?: boolean | null | undefined;
  hasRecommendations?: boolean | null | undefined;
  masterLabel: string;
  recommendation?: RecordActionRecommendation | null | undefined;
  selectableItems: RecordActionSelectableItem[];
};

export type RecordActionDeploymentChannel = {
  channel: string;
  channelItems: RecordActionDefaultItem[];
  isAutopopEnabled?: boolean | null | undefined;
};

export type RecordActionDefaultItem = {
  action: string;
  isMandatory?: boolean | null | undefined;
  isUiRemoveHidden?: boolean | null | undefined;
  pinned: string;
  position: number;
  type: string;
};

export type RecordActionDeploymentContext = {
  entityName: string;
  recommendationStrategy?: string | null | undefined;
};

export type RecordActionRecommendation = {
  defaultStrategy?: string | null | undefined;
  hasDescription: boolean;
  hasImage: boolean;
  hasRejectAction: boolean;
  hasTitle: boolean;
  maxDisplayRecommendations: number;
};

export type RecordActionSelectableItem = {
  action: string;
  type: string;
};

export type RecordPageSettings = Metadata & {
  enableActivityRelatedList?: boolean | null | undefined;
  enableFullRecordView?: boolean | null | undefined;
};

export type RemoteSiteSetting = Metadata & {
  description?: string | null | undefined;
  disableProtocolSecurity: boolean;
  isActive: boolean;
  url: string;
};

export type Report = Metadata & {
  aggregates: ReportAggregate[];
  block: Report[];
  blockInfo?: ReportBlockInfo | null | undefined;
  buckets: ReportBucketField[];
  chart?: ReportChart | null | undefined;
  colorRanges: ReportColorRange[];
  columns: ReportColumn[];
  crossFilters: ReportCrossFilter[];
  currency?: string | null | undefined;
  customDetailFormulas: ReportCustomDetailFormula[];
  dataCategoryFilters: ReportDataCategoryFilter[];
  description?: string | null | undefined;
  division?: string | null | undefined;
  filter?: ReportFilter | null | undefined;
  folderName?: string | null | undefined;
  format: string;
  formattingRules: ReportFormattingRule[];
  groupingsAcross: ReportGrouping[];
  groupingsDown: ReportGrouping[];
  historicalSelector?: ReportHistoricalSelector | null | undefined;
  name: string;
  numSubscriptions?: number | null | undefined;
  params: ReportParam[];
  reportType: string;
  roleHierarchyFilter?: string | null | undefined;
  rowLimit?: number | null | undefined;
  scope?: string | null | undefined;
  showCurrentDate?: boolean | null | undefined;
  showDetails?: boolean | null | undefined;
  showGrandTotal?: boolean | null | undefined;
  showSubTotals?: boolean | null | undefined;
  sortColumn?: string | null | undefined;
  sortOrder?: string | null | undefined;
  territoryHierarchyFilter?: string | null | undefined;
  timeFrameFilter?: ReportTimeFrameFilter | null | undefined;
  userFilter?: string | null | undefined;
};

export type ReportAggregate = {
  acrossGroupingContext?: string | null | undefined;
  calculatedFormula: string;
  datatype: string;
  description?: string | null | undefined;
  developerName: string;
  downGroupingContext?: string | null | undefined;
  isActive: boolean;
  isCrossBlock?: boolean | null | undefined;
  masterLabel: string;
  reportType?: string | null | undefined;
  scale?: number | null | undefined;
};

export type ReportBlockInfo = {
  aggregateReferences: ReportAggregateReference[];
  blockId: string;
  joinTable: string;
};

export type ReportAggregateReference = {
  aggregate: string;
};

export type ReportBucketField = {
  bucketType: string;
  developerName: string;
  masterLabel: string;
  nullTreatment?: string | null | undefined;
  otherBucketLabel?: string | null | undefined;
  sourceColumnName: string;
  useOther?: boolean | null | undefined;
  values: ReportBucketFieldValue[];
};

export type ReportBucketFieldValue = {
  sourceValues: ReportBucketFieldSourceValue[];
  value: string;
};

export type ReportBucketFieldSourceValue = {
  from?: string | null | undefined;
  sourceValue?: string | null | undefined;
  to?: string | null | undefined;
};

export type ReportChart = {
  backgroundColor1?: string | null | undefined;
  backgroundColor2?: string | null | undefined;
  backgroundFadeDir?: string | null | undefined;
  chartSummaries: ChartSummary[];
  chartType: string;
  enableHoverLabels?: boolean | null | undefined;
  expandOthers?: boolean | null | undefined;
  groupingColumn?: string | null | undefined;
  legendPosition?: string | null | undefined;
  location?: string | null | undefined;
  secondaryGroupingColumn?: string | null | undefined;
  showAxisLabels?: boolean | null | undefined;
  showPercentage?: boolean | null | undefined;
  showTotal?: boolean | null | undefined;
  showValues?: boolean | null | undefined;
  size?: string | null | undefined;
  summaryAxisManualRangeEnd?: number | null | undefined;
  summaryAxisManualRangeStart?: number | null | undefined;
  summaryAxisRange?: string | null | undefined;
  textColor?: string | null | undefined;
  textSize?: number | null | undefined;
  title?: string | null | undefined;
  titleColor?: string | null | undefined;
  titleSize?: number | null | undefined;
};

export type ReportColorRange = {
  aggregate?: string | null | undefined;
  columnName: string;
  highBreakpoint?: number | null | undefined;
  highColor: string;
  lowBreakpoint?: number | null | undefined;
  lowColor: string;
  midColor: string;
};

export type ReportColumn = {
  aggregateTypes: string[];
  field: string;
  reverseColors?: boolean | null | undefined;
  showChanges?: boolean | null | undefined;
};

export type ReportCrossFilter = {
  criteriaItems: ReportFilterItem[];
  operation: string;
  primaryTableColumn: string;
  relatedTable: string;
  relatedTableJoinColumn: string;
};

export type ReportFilterItem = {
  column: string;
  columnToColumn?: boolean | null | undefined;
  isUnlocked?: boolean | null | undefined;
  operator: string;
  snapshot?: string | null | undefined;
  value?: string | null | undefined;
};

export type ReportCustomDetailFormula = {
  calculatedFormula: string;
  dataType: string;
  description?: string | null | undefined;
  developerName: string;
  label: string;
  scale: number;
};

export type ReportDataCategoryFilter = {
  dataCategory: string;
  dataCategoryGroup: string;
  operator: string;
};

export type ReportFilter = {
  booleanFilter?: string | null | undefined;
  criteriaItems: ReportFilterItem[];
  language?: string | null | undefined;
};

export type ReportFormattingRule = {
  aggregate?: string | null | undefined;
  columnName: string;
  values: ReportFormattingRuleValue[];
};

export type ReportFormattingRuleValue = {
  backgroundColor?: string | null | undefined;
  rangeUpperBound?: number | null | undefined;
};

export type ReportGrouping = {
  aggregateType?: string | null | undefined;
  dateGranularity?: string | null | undefined;
  field: string;
  sortByName?: string | null | undefined;
  sortOrder: string;
  sortType?: string | null | undefined;
};

export type ReportHistoricalSelector = {
  snapshot: string[];
};

export type ReportParam = {
  name: string;
  value: string;
};

export type ReportTimeFrameFilter = {
  dateColumn: string;
  endDate?: string | null | undefined;
  interval: string;
  startDate?: string | null | undefined;
};

export type ReportType = Metadata & {
  autogenerated?: boolean | null | undefined;
  baseObject: string;
  category: string;
  deployed: boolean;
  description?: string | null | undefined;
  join?: ObjectRelationship | null | undefined;
  label: string;
  sections: ReportLayoutSection[];
};

export type ObjectRelationship = {
  join?: ObjectRelationship | null | undefined;
  outerJoin: boolean;
  relationship: string;
};

export type ReportLayoutSection = {
  columns: ReportTypeColumn[];
  masterLabel: string;
};

export type ReportTypeColumn = {
  checkedByDefault: boolean;
  displayNameOverride?: string | null | undefined;
  field: string;
  table: string;
};

export type RestrictionRule = Metadata & {
  active: boolean;
  description: string;
  enforcementType: string;
  masterLabel: string;
  recordFilter: string;
  targetEntity: string;
  userCriteria: string;
  version: number;
};

export type RetailExecutionSettings = Metadata & {
  enableRetailExecution?: boolean | null | undefined;
};

export type RoleOrTerritory = Metadata & {
  caseAccessLevel?: string | null | undefined;
  contactAccessLevel?: string | null | undefined;
  description?: string | null | undefined;
  mayForecastManagerShare?: boolean | null | undefined;
  name: string;
  opportunityAccessLevel?: string | null | undefined;
};

export type Role = RoleOrTerritory & {
  parentRole?: string | null | undefined;
};

export type Territory = RoleOrTerritory & {
  accountAccessLevel?: string | null | undefined;
  parentTerritory?: string | null | undefined;
};

export type SamlSsoConfig = Metadata & {
  attributeName?: string | null | undefined;
  attributeNameIdFormat?: string | null | undefined;
  decryptionCertificate?: string | null | undefined;
  errorUrl?: string | null | undefined;
  executionUserId?: string | null | undefined;
  identityLocation: string;
  identityMapping: string;
  issuer: string;
  loginUrl?: string | null | undefined;
  logoutUrl?: string | null | undefined;
  name: string;
  oauthTokenEndpoint?: string | null | undefined;
  redirectBinding?: boolean | null | undefined;
  requestSignatureMethod?: string | null | undefined;
  requestSigningCertId?: string | null | undefined;
  salesforceLoginUrl?: string | null | undefined;
  samlEntityId: string;
  samlJitHandlerId?: string | null | undefined;
  samlVersion: string;
  singleLogoutBinding?: string | null | undefined;
  singleLogoutUrl?: string | null | undefined;
  userProvisioning?: boolean | null | undefined;
  validationCert: string;
};

export type SchemaSettings = Metadata & {
  enableAdvancedCMTSecurity?: boolean | null | undefined;
  enableAdvancedCSSecurity?: boolean | null | undefined;
  enableListCustomSettingCreation?: boolean | null | undefined;
  enableSOSLOnCustomSettings?: boolean | null | undefined;
};

export type SearchSettings = Metadata & {
  documentContentSearchEnabled: boolean;
  enableAdvancedSearchInAlohaSidebar?: boolean | null | undefined;
  enableEinsteinSearchPersonalization?: boolean | null | undefined;
  enableQuerySuggestionPigOn?: boolean | null | undefined;
  enableSalesforceGeneratedSynonyms?: boolean | null | undefined;
  enableSetupSearch?: boolean | null | undefined;
  optimizeSearchForCJKEnabled: boolean;
  recentlyViewedUsersForBlankLookupEnabled: boolean;
  searchSettingsByObject: SearchSettingsByObject;
  sidebarAutoCompleteEnabled: boolean;
  sidebarDropDownListEnabled: boolean;
  sidebarLimitToItemsIOwnCheckboxEnabled: boolean;
  singleSearchResultShortcutEnabled: boolean;
  spellCorrectKnowledgeSearchEnabled: boolean;
};

export type SearchSettingsByObject = {
  searchSettingsByObject: ObjectSearchSetting[];
};

export type ObjectSearchSetting = {
  enhancedLookupEnabled: boolean;
  lookupAutoCompleteEnabled: boolean;
  name: string;
  resultsPerPageCount: number;
};

export type SecuritySettings = Metadata & {
  canUsersGrantLoginAccess?: boolean | null | undefined;
  enableAdminLoginAsAnyUser?: boolean | null | undefined;
  enableAuditFieldsInactiveOwner?: boolean | null | undefined;
  enableAuraSecureEvalPref?: boolean | null | undefined;
  enableRequireHttpsConnection?: boolean | null | undefined;
  isTLSv12Required?: boolean | null | undefined;
  isTLSv12RequiredCommunities?: boolean | null | undefined;
  networkAccess?: NetworkAccess | null | undefined;
  passwordPolicies?: PasswordPolicies | null | undefined;
  sessionSettings?: SessionSettings | null | undefined;
  singleSignOnSettings?: SingleSignOnSettings | null | undefined;
};

export type NetworkAccess = {
  ipRanges: IpRange[];
};

export type IpRange = {
  description?: string | null | undefined;
  end?: string | null | undefined;
  start?: string | null | undefined;
};

export type PasswordPolicies = {
  apiOnlyUserHomePageURL?: string | null | undefined;
  complexity?: string | null | undefined;
  enableSetPasswordInApi?: boolean | null | undefined;
  expiration?: string | null | undefined;
  historyRestriction?: string | null | undefined;
  lockoutInterval?: string | null | undefined;
  maxLoginAttempts?: string | null | undefined;
  minimumPasswordLength?: string | null | undefined;
  minimumPasswordLifetime?: boolean | null | undefined;
  obscureSecretAnswer?: boolean | null | undefined;
  passwordAssistanceMessage?: string | null | undefined;
  passwordAssistanceURL?: string | null | undefined;
  questionRestriction?: string | null | undefined;
};

export type SessionSettings = {
  allowUserAuthenticationByCertificate?: boolean | null | undefined;
  canConfirmEmailChangeInLightningCommunities?: boolean | null | undefined;
  disableTimeoutWarning?: boolean | null | undefined;
  enableCSPOnEmail?: boolean | null | undefined;
  enableCSRFOnGet?: boolean | null | undefined;
  enableCSRFOnPost?: boolean | null | undefined;
  enableCacheAndAutocomplete?: boolean | null | undefined;
  enableClickjackNonsetupSFDC?: boolean | null | undefined;
  enableClickjackNonsetupUser?: boolean | null | undefined;
  enableClickjackNonsetupUserHeaderless?: boolean | null | undefined;
  enableClickjackSetup?: boolean | null | undefined;
  enableContentSniffingProtection?: boolean | null | undefined;
  enableLightningLogin?: boolean | null | undefined;
  enableLightningLoginOnlyWithUserPerm?: boolean | null | undefined;
  enablePostForSessions?: boolean | null | undefined;
  enableSMSIdentity?: boolean | null | undefined;
  enableU2F?: boolean | null | undefined;
  enableUpgradeInsecureRequests?: boolean | null | undefined;
  enableXssProtection?: boolean | null | undefined;
  enforceIpRangesEveryRequest?: boolean | null | undefined;
  forceLogoutOnSessionTimeout?: boolean | null | undefined;
  forceRelogin?: boolean | null | undefined;
  hasRetainedLoginHints?: boolean | null | undefined;
  hasUserSwitching?: boolean | null | undefined;
  hstsOnForcecomSites?: boolean | null | undefined;
  identityConfirmationOnEmailChange?: boolean | null | undefined;
  identityConfirmationOnTwoFactorRegistrationEnabled?:
    | boolean
    | null
    | undefined;
  lockSessionsToDomain?: boolean | null | undefined;
  lockSessionsToIp?: boolean | null | undefined;
  lockerServiceAPIVersion?: string | null | undefined;
  lockerServiceCSP?: boolean | null | undefined;
  lockerServiceFrozenRealm?: boolean | null | undefined;
  logoutURL?: string | null | undefined;
  redirectionWarning?: boolean | null | undefined;
  referrerPolicy?: boolean | null | undefined;
  requireHttpOnly?: boolean | null | undefined;
  requireHttps?: boolean | null | undefined;
  securityCentralKillSession?: boolean | null | undefined;
  sessionTimeout?: string | null | undefined;
};

export type SingleSignOnSettings = {
  enableForceDelegatedCallout?: boolean | null | undefined;
  enableMultipleSamlConfigs?: boolean | null | undefined;
  enableSamlJitProvisioning?: boolean | null | undefined;
  enableSamlLogin?: boolean | null | undefined;
};

export type ServiceChannel = Metadata & {
  interactionComponent?: string | null | undefined;
  label: string;
  relatedEntityType: string;
  secondaryRoutingPriorityField?: string | null | undefined;
  serviceChannelFieldPriorities: ServiceChannelFieldPriority[];
};

export type ServiceChannelFieldPriority = {
  priority: number;
  value: string;
};

export type ServicePresenceStatus = Metadata & {
  channels?: ServiceChannelStatus | null | undefined;
  label: string;
};

export type ServiceChannelStatus = {
  channel: string[];
};

export type SharingBaseRule = Metadata & {
  accessLevel: string;
  accountSettings?: AccountSharingRuleSettings | null | undefined;
  description?: string | null | undefined;
  label: string;
  sharedTo: SharedTo;
};

export type AccountSharingRuleSettings = {
  caseAccessLevel: string;
  contactAccessLevel: string;
  opportunityAccessLevel: string;
};

export type SharingCriteriaRule = SharingBaseRule & {
  booleanFilter?: string | null | undefined;
  criteriaItems: FilterItem[];
};

export type SharingGuestRule = SharingBaseRule & {
  booleanFilter?: string | null | undefined;
  criteriaItems: FilterItem[];
};

export type SharingOwnerRule = SharingBaseRule & {
  sharedFrom: SharedTo;
};

export type SharingTerritoryRule = SharingOwnerRule & {};

export type SharingRules = Metadata & {
  sharingCriteriaRules: SharingCriteriaRule[];
  sharingGuestRules: SharingGuestRule[];
  sharingOwnerRules: SharingOwnerRule[];
  sharingTerritoryRules: SharingTerritoryRule[];
};

export type SharingSet = Metadata & {
  accessMappings: AccessMapping[];
  description?: string | null | undefined;
  name: string;
  profiles: string[];
};

export type AccessMapping = {
  accessLevel: string;
  object: string;
  objectField: string;
  userField: string;
};

export type SharingSettings = Metadata & {
  enableAccountRoleOptimization?: boolean | null | undefined;
  enableAssetSharing?: boolean | null | undefined;
  enableCommunityUserVisibility?: boolean | null | undefined;
  enableExternalSharingModel?: boolean | null | undefined;
  enableManagerGroups?: boolean | null | undefined;
  enableManualUserRecordSharing?: boolean | null | undefined;
  enablePartnerSuperUserAccess?: boolean | null | undefined;
  enablePortalUserCaseSharing?: boolean | null | undefined;
  enablePortalUserVisibility?: boolean | null | undefined;
  enableRemoveTMGroupMembership?: boolean | null | undefined;
  enableSecureGuestAccess?: boolean | null | undefined;
  enableStandardReportVisibility?: boolean | null | undefined;
  enableTerritoryForecastManager?: boolean | null | undefined;
};

export type SiteSettings = Metadata & {
  enableProxyLoginICHeader?: boolean | null | undefined;
  enableTopicsInSites?: boolean | null | undefined;
  enableVisualforceApiAccessAllowed?: boolean | null | undefined;
};

export type Skill = Metadata & {
  assignments?: SkillAssignments | null | undefined;
  description?: string | null | undefined;
  label: string;
};

export type SkillAssignments = {
  profiles?: SkillProfileAssignments | null | undefined;
  users?: SkillUserAssignments | null | undefined;
};

export type SkillProfileAssignments = {
  profile: string[];
};

export type SkillUserAssignments = {
  user: string[];
};

export type SocialCustomerServiceSettings = Metadata & {
  caseSubjectOption: string;
  enableSocialApprovals?: boolean | null | undefined;
  enableSocialCaseAssignmentRules?: boolean | null | undefined;
  enableSocialCustomerService?: boolean | null | undefined;
  enableSocialPersonaHistoryTracking?: boolean | null | undefined;
  enableSocialPostHistoryTracking?: boolean | null | undefined;
  enableSocialReceiveParentPost?: boolean | null | undefined;
};

export type SocialProfileSettings = Metadata & {
  enableSocialProfiles?: boolean | null | undefined;
  isFacebookSocialProfilesDisabled?: boolean | null | undefined;
  isLinkedInSocialProfilesDisabled?: boolean | null | undefined;
  isTwitterSocialProfilesDisabled?: boolean | null | undefined;
  isYouTubeSocialProfilesDisabled?: boolean | null | undefined;
};

export type StandardValueSet = Metadata & {
  groupingStringEnum?: string | null | undefined;
  sorted: boolean;
  standardValue: StandardValue[];
};

export type StandardValueSetTranslation = Metadata & {
  valueTranslation: ValueTranslation[];
};

export type SurveySettings = Metadata & {
  enableSurvey?: boolean | null | undefined;
  enableSurveyOwnerCanManageResponse?: boolean | null | undefined;
};

export type SynonymDictionary = Metadata & {
  groups: SynonymGroup[];
  isProtected?: boolean | null | undefined;
  label: string;
};

export type SystemNotificationSettings = Metadata & {
  disableDowntimeNotifications?: boolean | null | undefined;
  disableMaintenanceNotifications?: boolean | null | undefined;
};

export type Territory2 = Metadata & {
  accountAccessLevel?: string | null | undefined;
  caseAccessLevel?: string | null | undefined;
  contactAccessLevel?: string | null | undefined;
  customFields: FieldValue[];
  description?: string | null | undefined;
  name: string;
  opportunityAccessLevel?: string | null | undefined;
  parentTerritory?: string | null | undefined;
  ruleAssociations: Territory2RuleAssociation[];
  territory2Type: string;
};

export type FieldValue = {
  name: string;
  value?: any | null | undefined;
};

export type Territory2RuleAssociation = {
  inherited: boolean;
  ruleName: string;
};

export type Territory2Model = Metadata & {
  customFields: FieldValue[];
  description?: string | null | undefined;
  name: string;
};

export type Territory2Rule = Metadata & {
  active: boolean;
  booleanFilter?: string | null | undefined;
  name: string;
  objectType: string;
  ruleItems: Territory2RuleItem[];
};

export type Territory2RuleItem = {
  field: string;
  operation: string;
  value?: string | null | undefined;
};

export type Territory2Settings = Metadata & {
  defaultAccountAccessLevel?: string | null | undefined;
  defaultCaseAccessLevel?: string | null | undefined;
  defaultContactAccessLevel?: string | null | undefined;
  defaultOpportunityAccessLevel?: string | null | undefined;
  enableTerritoryManagement2?: boolean | null | undefined;
  opportunityFilterSettings?:
    | Territory2SettingsOpportunityFilter
    | null
    | undefined;
};

export type Territory2SettingsOpportunityFilter = {
  apexClassName?: string | null | undefined;
  enableFilter: boolean;
  runOnCreate: boolean;
};

export type Territory2Type = Metadata & {
  description?: string | null | undefined;
  name: string;
  priority: number;
};

export type TimeSheetTemplate = Metadata & {
  active: boolean;
  description?: string | null | undefined;
  frequency: string;
  masterLabel: string;
  startDate: string;
  timeSheetTemplateAssignments: TimeSheetTemplateAssignment[];
  workWeekEndDay: string;
  workWeekStartDay: string;
};

export type TimeSheetTemplateAssignment = {
  assignedTo?: string | null | undefined;
};

export type TopicsForObjects = Metadata & {
  enableTopics: boolean;
  entityApiName: string;
};

export type TrailheadSettings = Metadata & {
  enableMyTrailheadPref?: boolean | null | undefined;
};

export type TransactionSecurityPolicy = Metadata & {
  action: TransactionSecurityAction;
  active: boolean;
  apexClass?: string | null | undefined;
  description?: string | null | undefined;
  developerName?: string | null | undefined;
  eventName?: string | null | undefined;
  eventType?: string | null | undefined;
  executionUser?: string | null | undefined;
  flow?: string | null | undefined;
  masterLabel?: string | null | undefined;
  resourceName?: string | null | undefined;
  type?: string | null | undefined;
};

export type TransactionSecurityAction = {
  block: boolean;
  endSession: boolean;
  freezeUser: boolean;
  notifications: TransactionSecurityNotification[];
  twoFactorAuthentication: boolean;
};

export type TransactionSecurityNotification = {
  inApp: boolean;
  sendEmail: boolean;
  user: string;
};

export type Translations = Metadata & {
  customApplications: CustomApplicationTranslation[];
  customDataTypeTranslations: CustomDataTypeTranslation[];
  customLabels: CustomLabelTranslation[];
  customPageWebLinks: CustomPageWebLinkTranslation[];
  customTabs: CustomTabTranslation[];
  flowDefinitions: FlowDefinitionTranslation[];
  quickActions: GlobalQuickActionTranslation[];
  reportTypes: ReportTypeTranslation[];
  scontrols: ScontrolTranslation[];
};

export type CustomApplicationTranslation = {
  label: string;
  name: string;
};

export type CustomDataTypeTranslation = {
  components: CustomDataTypeComponentTranslation[];
  customDataTypeName: string;
  description?: string | null | undefined;
  label?: string | null | undefined;
};

export type CustomDataTypeComponentTranslation = {
  developerSuffix: string;
  label?: string | null | undefined;
};

export type CustomLabelTranslation = {
  label: string;
  name: string;
};

export type CustomPageWebLinkTranslation = {
  label: string;
  name: string;
};

export type CustomTabTranslation = {
  label: string;
  name: string;
};

export type FlowDefinitionTranslation = {
  flows: FlowTranslation[];
  fullName: string;
  label?: string | null | undefined;
};

export type FlowTranslation = {
  choices: FlowChoiceTranslation[];
  fullName: string;
  label?: string | null | undefined;
  screens: FlowScreenTranslation[];
  stages: FlowStageTranslation[];
  textTemplates: FlowTextTemplateTranslation[];
};

export type FlowChoiceTranslation = {
  choiceText?: string | null | undefined;
  name: string;
  userInput?: FlowChoiceUserInputTranslation | null | undefined;
};

export type FlowChoiceUserInputTranslation = {
  promptText?: string | null | undefined;
  validationRule?: FlowInputValidationRuleTranslation | null | undefined;
};

export type FlowInputValidationRuleTranslation = {
  errorMessage?: string | null | undefined;
};

export type FlowScreenTranslation = {
  fields: FlowScreenFieldTranslation[];
  helpText?: string | null | undefined;
  name: string;
  pausedText?: string | null | undefined;
};

export type FlowScreenFieldTranslation = {
  fieldText?: string | null | undefined;
  helpText?: string | null | undefined;
  name: string;
  validationRule?: FlowInputValidationRuleTranslation | null | undefined;
};

export type FlowStageTranslation = {
  label?: string | null | undefined;
  name: string;
};

export type FlowTextTemplateTranslation = {
  name: string;
  text?: string | null | undefined;
};

export type GlobalQuickActionTranslation = {
  label: string;
  name: string;
};

export type ReportTypeTranslation = {
  description?: string | null | undefined;
  label?: string | null | undefined;
  name: string;
  sections: ReportTypeSectionTranslation[];
};

export type ReportTypeSectionTranslation = {
  columns: ReportTypeColumnTranslation[];
  label?: string | null | undefined;
  name: string;
};

export type ReportTypeColumnTranslation = {
  label: string;
  name: string;
};

export type ScontrolTranslation = {
  label: string;
  name: string;
};

export type UIObjectRelationConfig = Metadata & {
  UIObjectRelationFieldConfigs: UIObjectRelationFieldConfig[];
  contextObject: string;
  contextObjectRecordType?: string | null | undefined;
  directRelationshipField?: string | null | undefined;
  indirectObjectContextField?: string | null | undefined;
  indirectObjectRelatedField?: string | null | undefined;
  indirectRelationshipObject?: string | null | undefined;
  isActive: boolean;
  masterLabel: string;
  relatedObject: string;
  relatedObjectRecordType?: string | null | undefined;
  relationshipType: string;
};

export type UIObjectRelationFieldConfig = {
  displayLabel: string;
  queryText: string;
  rowOrder: number;
};

export type UserCriteria = Metadata & {
  creationAgeInSeconds?: number | null | undefined;
  description?: string | null | undefined;
  lastChatterActivityAgeInSeconds?: number | null | undefined;
  masterLabel: string;
  profiles: string[];
  userTypes: string[];
};

export type UserEngagementSettings = Metadata & {
  canGovCloudUseAdoptionApps?: boolean | null | undefined;
  doesScheduledSwitcherRunDaily?: boolean | null | undefined;
  enableCustomHelpGlobalSection?: boolean | null | undefined;
  enableHelpMenuShowFeedback?: boolean | null | undefined;
  enableHelpMenuShowHelp?: boolean | null | undefined;
  enableHelpMenuShowNewUser?: boolean | null | undefined;
  enableHelpMenuShowSearch?: boolean | null | undefined;
  enableHelpMenuShowSfdcContent?: boolean | null | undefined;
  enableHelpMenuShowShortcut?: boolean | null | undefined;
  enableHelpMenuShowSupport?: boolean | null | undefined;
  enableHelpMenuShowTrailhead?: boolean | null | undefined;
  enableIBILOptOutDashboards?: boolean | null | undefined;
  enableIBILOptOutEvents?: boolean | null | undefined;
  enableIBILOptOutReports?: boolean | null | undefined;
  enableIBILOptOutTasks?: boolean | null | undefined;
  enableLexToClassicFeedbackEnable?: boolean | null | undefined;
  enableOrchestrationInSandbox?: boolean | null | undefined;
  enableOrgUserAssistEnabled?: boolean | null | undefined;
  enableScheduledSwitcher?: boolean | null | undefined;
  enableSfdcProductFeedbackSurvey?: boolean | null | undefined;
  enableShowSalesforceUserAssist?: boolean | null | undefined;
  isAutoTransitionDelayed?: boolean | null | undefined;
  isCrucNotificationDisabled?: boolean | null | undefined;
  isCustomProfileAutoTransitionDelayed?: boolean | null | undefined;
  isLEXWelcomeMatDisabled?: boolean | null | undefined;
  isMeetTheAssistantDisabledInClassic?: boolean | null | undefined;
  isMeetTheAssistantDisabledInLightning?: boolean | null | undefined;
  optimizerAppEnabled?: boolean | null | undefined;
};

export type UserInterfaceSettings = Metadata & {
  alternateAlohaListView?: boolean | null | undefined;
  enableAsyncRelatedLists?: boolean | null | undefined;
  enableClickjackUserPageHeaderless?: boolean | null | undefined;
  enableCollapsibleSections?: boolean | null | undefined;
  enableCollapsibleSideBar?: boolean | null | undefined;
  enableCustomObjectTruncate?: boolean | null | undefined;
  enableCustomeSideBarOnAllPages?: boolean | null | undefined;
  enableDeleteFieldHistory?: boolean | null | undefined;
  enableHoverDetails?: boolean | null | undefined;
  enableInlineEdit?: boolean | null | undefined;
  enableNewPageLayoutEditor?: boolean | null | undefined;
  enablePersonalCanvas?: boolean | null | undefined;
  enablePrintableListViews?: boolean | null | undefined;
  enableProfileCustomTabsets?: boolean | null | undefined;
  enableQuickCreate?: boolean | null | undefined;
  enableTabOrganizer?: boolean | null | undefined;
};

export type UserManagementSettings = Metadata & {
  enableCanAnswerContainUsername?: boolean | null | undefined;
  enableCanSaveUserPerm?: boolean | null | undefined;
  enableConcealPersonalInfo?: boolean | null | undefined;
  enableContactlessExternalIdentityUsers?: boolean | null | undefined;
  enableEnhancedPermsetMgmt?: boolean | null | undefined;
  enableEnhancedProfileMgmt?: boolean | null | undefined;
  enableNewProfileUI?: boolean | null | undefined;
  enableScrambleUserData?: boolean | null | undefined;
  enableUserSelfDeactivate?: boolean | null | undefined;
};

export type VoiceSettings = Metadata & {
  enableCallDisposition?: boolean | null | undefined;
  enableVoiceCallList?: boolean | null | undefined;
  enableVoiceCallRecording?: boolean | null | undefined;
  enableVoiceCoaching?: boolean | null | undefined;
  enableVoiceConferencing?: boolean | null | undefined;
  enableVoiceLocalPresence?: boolean | null | undefined;
  enableVoiceMail?: boolean | null | undefined;
  enableVoiceMailDrop?: boolean | null | undefined;
};

export type WaveApplication = Metadata & {
  assetIcon?: string | null | undefined;
  description?: string | null | undefined;
  folder: string;
  masterLabel: string;
  shares: FolderShare[];
  templateOrigin?: string | null | undefined;
  templateVersion?: string | null | undefined;
};

export type WaveDataset = Metadata & {
  application: string;
  description?: string | null | undefined;
  masterLabel: string;
  templateAssetSourceName?: string | null | undefined;
};

export type WaveTemplateBundle = Metadata & {
  assetIcon?: string | null | undefined;
  assetVersion?: number | null | undefined;
  description?: string | null | undefined;
  label: string;
  templateType: string;
};

export type WaveXmd = Metadata & {
  application?: string | null | undefined;
  dataset: string;
  datasetConnector?: string | null | undefined;
  datasetFullyQualifiedName?: string | null | undefined;
  dates: WaveXmdDate[];
  dimensions: WaveXmdDimension[];
  measures: WaveXmdMeasure[];
  organizations: WaveXmdOrganization[];
  origin?: string | null | undefined;
  type?: string | null | undefined;
  waveVisualization?: string | null | undefined;
};

export type WaveXmdDate = {
  alias: string;
  compact?: boolean | null | undefined;
  dateFieldDay?: string | null | undefined;
  dateFieldEpochDay?: string | null | undefined;
  dateFieldEpochSecond?: string | null | undefined;
  dateFieldFiscalMonth?: string | null | undefined;
  dateFieldFiscalQuarter?: string | null | undefined;
  dateFieldFiscalWeek?: string | null | undefined;
  dateFieldFiscalYear?: string | null | undefined;
  dateFieldFullYear?: string | null | undefined;
  dateFieldHour?: string | null | undefined;
  dateFieldMinute?: string | null | undefined;
  dateFieldMonth?: string | null | undefined;
  dateFieldQuarter?: string | null | undefined;
  dateFieldSecond?: string | null | undefined;
  dateFieldWeek?: string | null | undefined;
  dateFieldYear?: string | null | undefined;
  description?: string | null | undefined;
  firstDayOfWeek: number;
  fiscalMonthOffset: number;
  isYearEndFiscalYear?: boolean | null | undefined;
  label?: string | null | undefined;
  showInExplorer?: boolean | null | undefined;
  sortIndex: number;
  type: string;
};

export type WaveXmdDimension = {
  conditionalFormatting: WaveXmdFormattingProperty[];
  customActions: WaveXmdDimensionCustomAction[];
  customActionsEnabled?: boolean | null | undefined;
  dateFormat?: string | null | undefined;
  description?: string | null | undefined;
  field: string;
  fullyQualifiedName?: string | null | undefined;
  imageTemplate?: string | null | undefined;
  isDerived: boolean;
  isMultiValue?: boolean | null | undefined;
  label?: string | null | undefined;
  linkTemplate?: string | null | undefined;
  linkTemplateEnabled?: boolean | null | undefined;
  linkTooltip?: string | null | undefined;
  members: WaveXmdDimensionMember[];
  origin?: string | null | undefined;
  recordDisplayFields: WaveXmdRecordDisplayLookup[];
  recordIdField?: string | null | undefined;
  recordOrganizationIdField?: string | null | undefined;
  salesforceActions: WaveXmdDimensionSalesforceAction[];
  salesforceActionsEnabled?: boolean | null | undefined;
  showDetailsDefaultFieldIndex?: number | null | undefined;
  showInExplorer?: boolean | null | undefined;
  sortIndex: number;
};

export type WaveXmdFormattingProperty = {
  formattingBins: WaveXmdFormattingBin[];
  formattingPredicates: WaveXmdFormattingPredicate[];
  property: string;
  referenceField: string;
  sortIndex: number;
  type: string;
};

export type WaveXmdFormattingBin = {
  bin: string;
  formatValue: string;
  label: string;
  sortIndex: number;
};

export type WaveXmdFormattingPredicate = {
  formatValue: string;
  operator: string;
  sortIndex: number;
  value: string;
};

export type WaveXmdDimensionCustomAction = {
  customActionName: string;
  enabled: boolean;
  icon?: string | null | undefined;
  method?: string | null | undefined;
  sortIndex: number;
  target?: string | null | undefined;
  tooltip?: string | null | undefined;
  url?: string | null | undefined;
};

export type WaveXmdDimensionMember = {
  color?: string | null | undefined;
  label?: string | null | undefined;
  member: string;
  sortIndex: number;
};

export type WaveXmdRecordDisplayLookup = {
  recordDisplayField: string;
};

export type WaveXmdDimensionSalesforceAction = {
  enabled: boolean;
  salesforceActionName: string;
  sortIndex: number;
};

export type WaveXmdMeasure = {
  conditionalFormatting: WaveXmdFormattingProperty[];
  dateFormat?: string | null | undefined;
  description?: string | null | undefined;
  field: string;
  formatCustomFormat?: string | null | undefined;
  formatDecimalDigits?: number | null | undefined;
  formatIsNegativeParens?: boolean | null | undefined;
  formatPrefix?: string | null | undefined;
  formatSuffix?: string | null | undefined;
  formatUnit?: string | null | undefined;
  formatUnitMultiplier?: number | null | undefined;
  fullyQualifiedName?: string | null | undefined;
  isDerived: boolean;
  label?: string | null | undefined;
  origin?: string | null | undefined;
  showDetailsDefaultFieldIndex?: number | null | undefined;
  showInExplorer?: boolean | null | undefined;
  sortIndex: number;
};

export type WaveXmdOrganization = {
  instanceUrl: string;
  label: string;
  organizationIdentifier: string;
  sortIndex: number;
};

export type WorkDotComSettings = Metadata & {
  enableCoachingManagerGroupAccess?: boolean | null | undefined;
  enableGoalManagerGroupAccess?: boolean | null | undefined;
  enableProfileSkills?: boolean | null | undefined;
  enableProfileSkillsAddFeedPost?: boolean | null | undefined;
  enableProfileSkillsAutoSuggest?: boolean | null | undefined;
  enableProfileSkillsUsePlatform?: boolean | null | undefined;
  enableWorkBadgeDefRestrictPref?: boolean | null | undefined;
  enableWorkCalibration?: boolean | null | undefined;
  enableWorkCanvasPref?: boolean | null | undefined;
  enableWorkCertification?: boolean | null | undefined;
  enableWorkCertificationNotification?: boolean | null | undefined;
  enableWorkRewardsPref?: boolean | null | undefined;
  enableWorkThanksPref?: boolean | null | undefined;
  enableWorkUseObjectivesForGoals?: boolean | null | undefined;
};

export type Workflow = Metadata & {
  alerts: WorkflowAlert[];
  fieldUpdates: WorkflowFieldUpdate[];
  flowActions: WorkflowFlowAction[];
  knowledgePublishes: WorkflowKnowledgePublish[];
  outboundMessages: WorkflowOutboundMessage[];
  rules: WorkflowRule[];
  send: WorkflowSend[];
  tasks: WorkflowTask[];
};

export type WorkflowAlert = WorkflowAction & {
  ccEmails: string[];
  description: string;
  protected: boolean;
  recipients: WorkflowEmailRecipient[];
  senderAddress?: string | null | undefined;
  senderType?: string | null | undefined;
  template: string;
};

export type WorkflowAction = Metadata & {};

export type WorkflowFieldUpdate = WorkflowAction & {
  description?: string | null | undefined;
  field: string;
  formula?: string | null | undefined;
  literalValue?: string | null | undefined;
  lookupValue?: string | null | undefined;
  lookupValueType?: string | null | undefined;
  name: string;
  notifyAssignee: boolean;
  operation: string;
  protected: boolean;
  reevaluateOnChange?: boolean | null | undefined;
  targetObject?: string | null | undefined;
};

export type WorkflowFlowAction = WorkflowAction & {
  description?: string | null | undefined;
  flow: string;
  flowInputs: WorkflowFlowActionParameter[];
  label: string;
  language?: string | null | undefined;
  protected: boolean;
};

export type WorkflowFlowActionParameter = {
  name: string;
  value?: string | null | undefined;
};

export type WorkflowKnowledgePublish = WorkflowAction & {
  action: string;
  description?: string | null | undefined;
  label: string;
  language?: string | null | undefined;
  protected: boolean;
};

export type WorkflowOutboundMessage = WorkflowAction & {
  apiVersion: number;
  description?: string | null | undefined;
  endpointUrl: string;
  fields: string[];
  includeSessionId: boolean;
  integrationUser: string;
  name: string;
  protected: boolean;
  useDeadLetterQueue?: boolean | null | undefined;
};

export type WorkflowSend = WorkflowAction & {
  action: string;
  description?: string | null | undefined;
  label: string;
  language?: string | null | undefined;
  protected: boolean;
};

export type WorkflowTask = WorkflowAction & {
  assignedTo?: string | null | undefined;
  assignedToType: string;
  description?: string | null | undefined;
  dueDateOffset: number;
  notifyAssignee: boolean;
  offsetFromField?: string | null | undefined;
  priority: string;
  protected: boolean;
  status: string;
  subject: string;
};

export type WorkflowEmailRecipient = {
  field?: string | null | undefined;
  recipient?: string | null | undefined;
  type: string;
};

export type WorkflowRule = Metadata & {
  actions: WorkflowActionReference[];
  active: boolean;
  booleanFilter?: string | null | undefined;
  criteriaItems: FilterItem[];
  description?: string | null | undefined;
  formula?: string | null | undefined;
  triggerType: string;
  workflowTimeTriggers: WorkflowTimeTrigger[];
};

export type WorkflowTimeTrigger = {
  actions: WorkflowActionReference[];
  offsetFromField?: string | null | undefined;
  timeLength?: string | null | undefined;
  workflowTimeTriggerUnit: string;
};

export type SaveResult = {
  errors: Error[];
  fullName: string;
  success: boolean;
};

export type Error = {
  extendedErrorDetails: ExtendedErrorDetails[];
  fields: string[];
  message: string;
  statusCode: string;
};

export type ExtendedErrorDetails = {
  extendedErrorCode: string;
};

export type DeleteResult = {
  errors: Error[];
  fullName: string;
  success: boolean;
};

export type DeployOptions = {
  allowMissingFiles: boolean;
  autoUpdatePackage: boolean;
  checkOnly: boolean;
  ignoreWarnings: boolean;
  performRetrieve: boolean;
  purgeOnDelete: boolean;
  rollbackOnError: boolean;
  runTests: string[];
  singlePackage: boolean;
  testLevel: string;
};

export type AsyncResult = {
  done: boolean;
  id: string;
  message?: string | null | undefined;
  state: string;
  statusCode?: string | null | undefined;
};

export type DescribeMetadataResult = {
  metadataObjects: DescribeMetadataObject[];
  organizationNamespace: string;
  partialSaveAllowed: boolean;
  testRequired: boolean;
};

export type DescribeMetadataObject = {
  childXmlNames: string[];
  directoryName: string;
  inFolder: boolean;
  metaFile: boolean;
  suffix?: string | null | undefined;
  xmlName: string;
};

export type DescribeValueTypeResult = {
  apiCreatable: boolean;
  apiDeletable: boolean;
  apiReadable: boolean;
  apiUpdatable: boolean;
  parentField?: ValueTypeField | null | undefined;
  valueTypeFields: ValueTypeField[];
};

export type ValueTypeField = {
  fields: ValueTypeField[];
  foreignKeyDomain: string[];
  isForeignKey: boolean;
  isNameField: boolean;
  minOccurs: number;
  name: string;
  picklistValues: PicklistEntry[];
  soapType: string;
  valueRequired: boolean;
};

export type PicklistEntry = {
  active: boolean;
  defaultValue: boolean;
  label: string;
  validFor?: string | null | undefined;
  value: string;
};

export type ListMetadataQuery = {
  folder?: string | null | undefined;
  type: string;
};

export type ReadResult = {
  records: Metadata[];
};

export type RetrieveRequest = {
  apiVersion: number;
  packageNames: string[];
  singlePackage: boolean;
  specificFiles: string[];
  unpackaged?: Package | null | undefined;
};

export type UpsertResult = {
  created: boolean;
  errors: Error[];
  fullName: string;
  success: boolean;
};

export type LogInfo = {
  category: string;
  level: string;
};

export type ApiSchemaTypes = {
  CancelDeployResult: CancelDeployResult;
  DeployResult: DeployResult;
  DeployDetails: DeployDetails;
  DeployMessage: DeployMessage;
  RetrieveResult: RetrieveResult;
  FileProperties: FileProperties;
  RetrieveMessage: RetrieveMessage;
  RunTestsResult: RunTestsResult;
  CodeCoverageResult: CodeCoverageResult;
  CodeLocation: CodeLocation;
  CodeCoverageWarning: CodeCoverageWarning;
  RunTestFailure: RunTestFailure;
  FlowCoverageResult: FlowCoverageResult;
  FlowCoverageWarning: FlowCoverageWarning;
  RunTestSuccess: RunTestSuccess;
  Metadata: Metadata;
  AccountRelationshipShareRule: AccountRelationshipShareRule;
  AccountSettings: AccountSettings;
  ActionLinkGroupTemplate: ActionLinkGroupTemplate;
  ActionLinkTemplate: ActionLinkTemplate;
  ActionPlanTemplate: ActionPlanTemplate;
  ActionPlanTemplateItem: ActionPlanTemplateItem;
  ActionPlanTemplateItemValue: ActionPlanTemplateItemValue;
  ActionsSettings: ActionsSettings;
  ActivitiesSettings: ActivitiesSettings;
  AddressSettings: AddressSettings;
  CountriesAndStates: CountriesAndStates;
  Country: Country;
  State: State;
  AnalyticSnapshot: AnalyticSnapshot;
  AnalyticSnapshotMapping: AnalyticSnapshotMapping;
  AnalyticsSettings: AnalyticsSettings;
  AnimationRule: AnimationRule;
  ApexSettings: ApexSettings;
  ApexTestSuite: ApexTestSuite;
  AppExperienceSettings: AppExperienceSettings;
  AppMenu: AppMenu;
  AppMenuItem: AppMenuItem;
  AppointmentSchedulingPolicy: AppointmentSchedulingPolicy;
  ApprovalProcess: ApprovalProcess;
  ApprovalSubmitter: ApprovalSubmitter;
  ApprovalPageField: ApprovalPageField;
  ApprovalStep: ApprovalStep;
  ApprovalAction: ApprovalAction;
  WorkflowActionReference: WorkflowActionReference;
  ApprovalStepApprover: ApprovalStepApprover;
  Approver: Approver;
  ApprovalEntryCriteria: ApprovalEntryCriteria;
  FilterItem: FilterItem;
  DuplicateRuleFilterItem: DuplicateRuleFilterItem;
  ApprovalStepRejectBehavior: ApprovalStepRejectBehavior;
  NextAutomatedApprover: NextAutomatedApprover;
  ArchiveSettings: ArchiveSettings;
  AssignmentRule: AssignmentRule;
  RuleEntry: RuleEntry;
  EscalationAction: EscalationAction;
  AssignmentRules: AssignmentRules;
  Audience: Audience;
  AudienceCriteria: AudienceCriteria;
  AudienceCriterion: AudienceCriterion;
  AudienceCriteriaValue: AudienceCriteriaValue;
  PersonalizationTargetInfos: PersonalizationTargetInfos;
  PersonalizationTargetInfo: PersonalizationTargetInfo;
  AuraDefinitionBundle: AuraDefinitionBundle;
  PackageVersion: PackageVersion;
  AuthProvider: AuthProvider;
  AutoResponseRule: AutoResponseRule;
  AutoResponseRules: AutoResponseRules;
  BlockchainSettings: BlockchainSettings;
  Bot: Bot;
  LocalMlDomain: LocalMlDomain;
  MlIntent: MlIntent;
  MlIntentUtterance: MlIntentUtterance;
  MlRelatedIntent: MlRelatedIntent;
  MlSlotClass: MlSlotClass;
  MlSlotClassValue: MlSlotClassValue;
  SynonymGroup: SynonymGroup;
  BotVersion: BotVersion;
  BotDialogGroup: BotDialogGroup;
  BotDialog: BotDialog;
  BotStep: BotStep;
  BotInvocation: BotInvocation;
  BotInvocationMapping: BotInvocationMapping;
  BotMessage: BotMessage;
  BotNavigation: BotNavigation;
  BotNavigationLink: BotNavigationLink;
  BotStepCondition: BotStepCondition;
  BotVariableOperation: BotVariableOperation;
  BotQuickReplyOption: BotQuickReplyOption;
  BotVariableOperand: BotVariableOperand;
  ConversationRecordLookup: ConversationRecordLookup;
  ConversationRecordLookupField: ConversationRecordLookupField;
  ConversationSystemMessage: ConversationSystemMessage;
  ConversationSystemMessageMapping: ConversationSystemMessageMapping;
  ConversationVariable: ConversationVariable;
  ConversationContextVariable: ConversationContextVariable;
  ConversationContextVariableMapping: ConversationContextVariableMapping;
  BotSettings: BotSettings;
  BrandingSet: BrandingSet;
  BrandingSetProperty: BrandingSetProperty;
  BusinessHoursEntry: BusinessHoursEntry;
  BusinessHoursSettings: BusinessHoursSettings;
  Holiday: Holiday;
  BusinessProcess: BusinessProcess;
  PicklistValue: PicklistValue;
  CMSConnectSource: CMSConnectSource;
  CMSConnectAsset: CMSConnectAsset;
  CMSConnectLanguage: CMSConnectLanguage;
  CMSConnectPersonalization: CMSConnectPersonalization;
  CMSConnectResourceType: CMSConnectResourceType;
  CMSConnectResourceDefinition: CMSConnectResourceDefinition;
  CallCenter: CallCenter;
  CallCenterSection: CallCenterSection;
  CallCenterItem: CallCenterItem;
  CampaignInfluenceModel: CampaignInfluenceModel;
  CampaignSettings: CampaignSettings;
  CanvasMetadata: CanvasMetadata;
  CaseClassificationSettings: CaseClassificationSettings;
  CaseSettings: CaseSettings;
  FeedItemSettings: FeedItemSettings;
  EmailToCaseSettings: EmailToCaseSettings;
  EmailToCaseRoutingAddress: EmailToCaseRoutingAddress;
  WebToCaseSettings: WebToCaseSettings;
  CaseSubjectParticle: CaseSubjectParticle;
  ChannelLayout: ChannelLayout;
  ChannelLayoutItem: ChannelLayoutItem;
  ChatterAnswersSettings: ChatterAnswersSettings;
  ChatterEmailsMDSettings: ChatterEmailsMDSettings;
  ChatterExtension: ChatterExtension;
  ChatterSettings: ChatterSettings;
  CleanDataService: CleanDataService;
  CleanRule: CleanRule;
  FieldMapping: FieldMapping;
  FieldMappingRow: FieldMappingRow;
  FieldMappingField: FieldMappingField;
  CommandAction: CommandAction;
  CommandActionIntent: CommandActionIntent;
  CommandActionResponse: CommandActionResponse;
  CommandActionParam: CommandActionParam;
  CommunitiesSettings: CommunitiesSettings;
  Community: Community;
  ReputationLevels: ReputationLevels;
  ChatterAnswersReputationLevel: ChatterAnswersReputationLevel;
  IdeaReputationLevel: IdeaReputationLevel;
  CommunityTemplateDefinition: CommunityTemplateDefinition;
  CommunityTemplateBundleInfo: CommunityTemplateBundleInfo;
  CommunityThemeBundleInfo: CommunityThemeBundleInfo;
  NavigationLinkSet: NavigationLinkSet;
  NavigationMenuItem: NavigationMenuItem;
  NavigationMenuItemBranding: NavigationMenuItemBranding;
  NavigationSubMenu: NavigationSubMenu;
  CommunityTemplatePageSetting: CommunityTemplatePageSetting;
  CommunityThemeDefinition: CommunityThemeDefinition;
  CommunityCustomThemeLayoutType: CommunityCustomThemeLayoutType;
  CommunityThemeRouteOverride: CommunityThemeRouteOverride;
  CommunityThemeSetting: CommunityThemeSetting;
  CompactLayout: CompactLayout;
  CompanySettings: CompanySettings;
  FiscalYearSettings: FiscalYearSettings;
  ConnectedApp: ConnectedApp;
  ConnectedAppAttribute: ConnectedAppAttribute;
  ConnectedAppCanvasConfig: ConnectedAppCanvasConfig;
  ConnectedAppIpRange: ConnectedAppIpRange;
  ConnectedAppMobileDetailConfig: ConnectedAppMobileDetailConfig;
  ConnectedAppOauthConfig: ConnectedAppOauthConfig;
  ConnectedAppOauthIdToken: ConnectedAppOauthIdToken;
  ConnectedAppSamlConfig: ConnectedAppSamlConfig;
  ConnectedAppSettings: ConnectedAppSettings;
  ContentSettings: ContentSettings;
  ContractSettings: ContractSettings;
  CorsWhitelistOrigin: CorsWhitelistOrigin;
  CspTrustedSite: CspTrustedSite;
  CurrencySettings: CurrencySettings;
  CustomApplication: CustomApplication;
  AppActionOverride: AppActionOverride;
  ActionOverride: ActionOverride;
  AppBrand: AppBrand;
  ServiceCloudConsoleConfig: ServiceCloudConsoleConfig;
  AppComponentList: AppComponentList;
  KeyboardShortcuts: KeyboardShortcuts;
  CustomShortcut: CustomShortcut;
  DefaultShortcut: DefaultShortcut;
  ListPlacement: ListPlacement;
  LiveAgentConfig: LiveAgentConfig;
  PushNotification: PushNotification;
  TabLimitConfig: TabLimitConfig;
  AppPreferences: AppPreferences;
  AppProfileActionOverride: AppProfileActionOverride;
  ProfileActionOverride: ProfileActionOverride;
  AppWorkspaceConfig: AppWorkspaceConfig;
  WorkspaceMapping: WorkspaceMapping;
  CustomApplicationComponent: CustomApplicationComponent;
  CustomFeedFilter: CustomFeedFilter;
  FeedFilterCriterion: FeedFilterCriterion;
  CustomField: CustomField;
  LookupFilter: LookupFilter;
  ValueSet: ValueSet;
  ValueSetValuesDefinition: ValueSetValuesDefinition;
  CustomValue: CustomValue;
  StandardValue: StandardValue;
  ValueSettings: ValueSettings;
  CustomHelpMenuSection: CustomHelpMenuSection;
  CustomHelpMenuItem: CustomHelpMenuItem;
  CustomLabel: CustomLabel;
  CustomLabels: CustomLabels;
  CustomMetadata: CustomMetadata;
  CustomMetadataValue: CustomMetadataValue;
  CustomNotificationType: CustomNotificationType;
  CustomObject: CustomObject;
  ArticleTypeChannelDisplay: ArticleTypeChannelDisplay;
  ArticleTypeTemplate: ArticleTypeTemplate;
  FieldSet: FieldSet;
  FieldSetItem: FieldSetItem;
  HistoryRetentionPolicy: HistoryRetentionPolicy;
  Index: Index;
  IndexField: IndexField;
  ListView: ListView;
  ListViewFilter: ListViewFilter;
  SharedTo: SharedTo;
  ProfileSearchLayouts: ProfileSearchLayouts;
  RecordType: RecordType;
  RecordTypePicklistValue: RecordTypePicklistValue;
  SearchLayouts: SearchLayouts;
  SharingReason: SharingReason;
  SharingRecalculation: SharingRecalculation;
  ValidationRule: ValidationRule;
  WebLink: WebLink;
  CustomObjectTranslation: CustomObjectTranslation;
  ObjectNameCaseValue: ObjectNameCaseValue;
  FieldSetTranslation: FieldSetTranslation;
  CustomFieldTranslation: CustomFieldTranslation;
  LookupFilterTranslation: LookupFilterTranslation;
  PicklistValueTranslation: PicklistValueTranslation;
  LayoutTranslation: LayoutTranslation;
  LayoutSectionTranslation: LayoutSectionTranslation;
  QuickActionTranslation: QuickActionTranslation;
  RecordTypeTranslation: RecordTypeTranslation;
  SharingReasonTranslation: SharingReasonTranslation;
  StandardFieldTranslation: StandardFieldTranslation;
  ValidationRuleTranslation: ValidationRuleTranslation;
  WebLinkTranslation: WebLinkTranslation;
  WorkflowTaskTranslation: WorkflowTaskTranslation;
  CustomPageWebLink: CustomPageWebLink;
  CustomPermission: CustomPermission;
  CustomPermissionDependencyRequired: CustomPermissionDependencyRequired;
  CustomSite: CustomSite;
  SiteWebAddress: SiteWebAddress;
  SiteRedirectMapping: SiteRedirectMapping;
  CustomTab: CustomTab;
  Dashboard: Dashboard;
  DashboardFilter: DashboardFilter;
  DashboardFilterOption: DashboardFilterOption;
  DashboardGridLayout: DashboardGridLayout;
  DashboardGridComponent: DashboardGridComponent;
  DashboardComponent: DashboardComponent;
  ChartSummary: ChartSummary;
  DashboardFilterColumn: DashboardFilterColumn;
  DashboardTableColumn: DashboardTableColumn;
  DashboardFlexTableComponentProperties: DashboardFlexTableComponentProperties;
  DashboardComponentColumn: DashboardComponentColumn;
  DashboardComponentSortInfo: DashboardComponentSortInfo;
  DashboardComponentGroupingSortProperties: DashboardComponentGroupingSortProperties;
  DashboardComponentGroupingSort: DashboardComponentGroupingSort;
  DashboardComponentSection: DashboardComponentSection;
  DataCategoryGroup: DataCategoryGroup;
  DataCategory: DataCategory;
  ObjectUsage: ObjectUsage;
  DataDotComSettings: DataDotComSettings;
  DelegateGroup: DelegateGroup;
  DeploymentSettings: DeploymentSettings;
  DevHubSettings: DevHubSettings;
  DiscoverySettings: DiscoverySettings;
  DocumentType: DocumentType;
  DuplicateRule: DuplicateRule;
  DuplicateRuleFilter: DuplicateRuleFilter;
  DuplicateRuleMatchRule: DuplicateRuleMatchRule;
  ObjectMapping: ObjectMapping;
  ObjectMappingField: ObjectMappingField;
  EACSettings: EACSettings;
  EmailAdministrationSettings: EmailAdministrationSettings;
  EmailIntegrationSettings: EmailIntegrationSettings;
  EmailServicesFunction: EmailServicesFunction;
  EmailServicesAddress: EmailServicesAddress;
  EmailTemplateSettings: EmailTemplateSettings;
  EmbeddedServiceBranding: EmbeddedServiceBranding;
  EmbeddedServiceConfig: EmbeddedServiceConfig;
  EmbeddedServiceAppointmentSettings: EmbeddedServiceAppointmentSettings;
  EmbeddedServiceCustomComponent: EmbeddedServiceCustomComponent;
  EmbeddedServiceCustomLabel: EmbeddedServiceCustomLabel;
  EmbeddedServiceFlowConfig: EmbeddedServiceFlowConfig;
  EmbeddedServiceFlow: EmbeddedServiceFlow;
  EmbeddedServiceLayout: EmbeddedServiceLayout;
  EmbeddedServiceLayoutRule: EmbeddedServiceLayoutRule;
  EmbeddedServiceLiveAgent: EmbeddedServiceLiveAgent;
  EmbeddedServiceQuickAction: EmbeddedServiceQuickAction;
  EmbeddedServiceMenuSettings: EmbeddedServiceMenuSettings;
  EmbeddedServiceMenuItem: EmbeddedServiceMenuItem;
  EncryptionKeySettings: EncryptionKeySettings;
  EnhancedNotesSettings: EnhancedNotesSettings;
  EntitlementProcess: EntitlementProcess;
  EntitlementProcessMilestoneItem: EntitlementProcessMilestoneItem;
  EntitlementProcessMilestoneTimeTrigger: EntitlementProcessMilestoneTimeTrigger;
  EntitlementSettings: EntitlementSettings;
  EntitlementTemplate: EntitlementTemplate;
  EntityImplements: EntityImplements;
  FieldImplements: FieldImplements;
  EscalationRule: EscalationRule;
  EscalationRules: EscalationRules;
  EssentialsSettings: EssentialsSettings;
  EssentialsTrialOrgSettings: EssentialsTrialOrgSettings;
  EventSettings: EventSettings;
  ExperienceBundleSettings: ExperienceBundleSettings;
  ExternalDataSource: ExternalDataSource;
  CustomHttpHeader: CustomHttpHeader;
  ExternalServiceRegistration: ExternalServiceRegistration;
  ExternalServicesSettings: ExternalServicesSettings;
  FieldServiceSettings: FieldServiceSettings;
  FileUploadAndDownloadSecuritySettings: FileUploadAndDownloadSecuritySettings;
  FileTypeDispositionAssignmentBean: FileTypeDispositionAssignmentBean;
  FilesConnectSettings: FilesConnectSettings;
  FlexiPage: FlexiPage;
  FlexiPageRegion: FlexiPageRegion;
  ComponentInstance: ComponentInstance;
  ComponentInstanceProperty: ComponentInstanceProperty;
  UiFormulaRule: UiFormulaRule;
  UiFormulaCriterion: UiFormulaCriterion;
  PlatformActionList: PlatformActionList;
  PlatformActionListItem: PlatformActionListItem;
  QuickActionList: QuickActionList;
  QuickActionListItem: QuickActionListItem;
  FlexiPageTemplateInstance: FlexiPageTemplateInstance;
  Flow: Flow;
  FlowActionCall: FlowActionCall;
  FlowNode: FlowNode;
  FlowElement: FlowElement;
  FlowBaseElement: FlowBaseElement;
  FlowMetadataValue: FlowMetadataValue;
  FlowElementReferenceOrValue: FlowElementReferenceOrValue;
  FlowActionCallInputParameter: FlowActionCallInputParameter;
  FlowActionCallOutputParameter: FlowActionCallOutputParameter;
  FlowApexPluginCallInputParameter: FlowApexPluginCallInputParameter;
  FlowApexPluginCallOutputParameter: FlowApexPluginCallOutputParameter;
  FlowAssignmentItem: FlowAssignmentItem;
  FlowChoiceUserInput: FlowChoiceUserInput;
  FlowInputValidationRule: FlowInputValidationRule;
  FlowCondition: FlowCondition;
  FlowConnector: FlowConnector;
  FlowInputFieldAssignment: FlowInputFieldAssignment;
  FlowOutputFieldAssignment: FlowOutputFieldAssignment;
  FlowRecordFilter: FlowRecordFilter;
  FlowScreenFieldInputParameter: FlowScreenFieldInputParameter;
  FlowScreenFieldOutputParameter: FlowScreenFieldOutputParameter;
  FlowScreenRule: FlowScreenRule;
  FlowScreenRuleAction: FlowScreenRuleAction;
  FlowSubflowInputAssignment: FlowSubflowInputAssignment;
  FlowSubflowOutputAssignment: FlowSubflowOutputAssignment;
  FlowVisibilityRule: FlowVisibilityRule;
  FlowWaitEventInputParameter: FlowWaitEventInputParameter;
  FlowWaitEventOutputParameter: FlowWaitEventOutputParameter;
  FlowChoice: FlowChoice;
  FlowConstant: FlowConstant;
  FlowDynamicChoiceSet: FlowDynamicChoiceSet;
  FlowFormula: FlowFormula;
  FlowRule: FlowRule;
  FlowScreenField: FlowScreenField;
  FlowStage: FlowStage;
  FlowTextTemplate: FlowTextTemplate;
  FlowVariable: FlowVariable;
  FlowWaitEvent: FlowWaitEvent;
  FlowApexPluginCall: FlowApexPluginCall;
  FlowAssignment: FlowAssignment;
  FlowDecision: FlowDecision;
  FlowLoop: FlowLoop;
  FlowRecordCreate: FlowRecordCreate;
  FlowRecordDelete: FlowRecordDelete;
  FlowRecordLookup: FlowRecordLookup;
  FlowRecordUpdate: FlowRecordUpdate;
  FlowScreen: FlowScreen;
  FlowStart: FlowStart;
  FlowSchedule: FlowSchedule;
  FlowStep: FlowStep;
  FlowSubflow: FlowSubflow;
  FlowWait: FlowWait;
  FlowCategory: FlowCategory;
  FlowCategoryItems: FlowCategoryItems;
  FlowDefinition: FlowDefinition;
  FlowSettings: FlowSettings;
  Folder: Folder;
  FolderShare: FolderShare;
  DashboardFolder: DashboardFolder;
  DocumentFolder: DocumentFolder;
  EmailFolder: EmailFolder;
  ReportFolder: ReportFolder;
  ForecastingSettings: ForecastingSettings;
  ForecastingCategoryMapping: ForecastingCategoryMapping;
  WeightedSourceCategory: WeightedSourceCategory;
  ForecastingDisplayedFamilySettings: ForecastingDisplayedFamilySettings;
  ForecastingTypeSettings: ForecastingTypeSettings;
  AdjustmentsSettings: AdjustmentsSettings;
  ForecastRangeSettings: ForecastRangeSettings;
  OpportunityListFieldsLabelMapping: OpportunityListFieldsLabelMapping;
  OpportunityListFieldsSelectedSettings: OpportunityListFieldsSelectedSettings;
  OpportunityListFieldsUnselectedSettings: OpportunityListFieldsUnselectedSettings;
  QuotasSettings: QuotasSettings;
  Form: Form;
  FormSection: FormSection;
  FormColumn: FormColumn;
  FormItem: FormItem;
  FormulaSettings: FormulaSettings;
  GlobalValueSet: GlobalValueSet;
  GlobalValueSetTranslation: GlobalValueSetTranslation;
  ValueTranslation: ValueTranslation;
  GoogleAppsSettings: GoogleAppsSettings;
  Group: Group;
  HighVelocitySalesSettings: HighVelocitySalesSettings;
  HomePageComponent: HomePageComponent;
  HomePageLayout: HomePageLayout;
  IdeasSettings: IdeasSettings;
  IndustriesManufacturingSettings: IndustriesManufacturingSettings;
  IndustriesSettings: IndustriesSettings;
  InstalledPackage: InstalledPackage;
  IntegrationHubSettings: IntegrationHubSettings;
  IntegrationHubSettingsType: IntegrationHubSettingsType;
  InvocableActionSettings: InvocableActionSettings;
  IoTSettings: IoTSettings;
  IsvHammerSettings: IsvHammerSettings;
  KeywordList: KeywordList;
  Keyword: Keyword;
  KnowledgeSettings: KnowledgeSettings;
  KnowledgeAnswerSettings: KnowledgeAnswerSettings;
  KnowledgeCaseSettings: KnowledgeCaseSettings;
  KnowledgeCommunitiesSettings: KnowledgeCommunitiesSettings;
  KnowledgeSitesSettings: KnowledgeSitesSettings;
  KnowledgeLanguageSettings: KnowledgeLanguageSettings;
  KnowledgeLanguage: KnowledgeLanguage;
  KnowledgeSuggestedArticlesSettings: KnowledgeSuggestedArticlesSettings;
  KnowledgeCaseFieldsSettings: KnowledgeCaseFieldsSettings;
  KnowledgeCaseField: KnowledgeCaseField;
  KnowledgeWorkOrderFieldsSettings: KnowledgeWorkOrderFieldsSettings;
  KnowledgeWorkOrderField: KnowledgeWorkOrderField;
  KnowledgeWorkOrderLineItemFieldsSettings: KnowledgeWorkOrderLineItemFieldsSettings;
  KnowledgeWorkOrderLineItemField: KnowledgeWorkOrderLineItemField;
  LanguageSettings: LanguageSettings;
  Layout: Layout;
  CustomConsoleComponents: CustomConsoleComponents;
  PrimaryTabComponents: PrimaryTabComponents;
  Container: Container;
  SidebarComponent: SidebarComponent;
  RelatedList: RelatedList;
  SubtabComponents: SubtabComponents;
  FeedLayout: FeedLayout;
  FeedLayoutFilter: FeedLayoutFilter;
  FeedLayoutComponent: FeedLayoutComponent;
  LayoutSection: LayoutSection;
  LayoutColumn: LayoutColumn;
  LayoutItem: LayoutItem;
  AnalyticsCloudComponentLayoutItem: AnalyticsCloudComponentLayoutItem;
  ReportChartComponentLayoutItem: ReportChartComponentLayoutItem;
  MiniLayout: MiniLayout;
  RelatedListItem: RelatedListItem;
  RelatedContent: RelatedContent;
  RelatedContentItem: RelatedContentItem;
  SummaryLayout: SummaryLayout;
  SummaryLayoutItem: SummaryLayoutItem;
  LeadConfigSettings: LeadConfigSettings;
  LeadConvertSettings: LeadConvertSettings;
  Letterhead: Letterhead;
  LetterheadLine: LetterheadLine;
  LetterheadHeaderFooter: LetterheadHeaderFooter;
  LicenseDefinition: LicenseDefinition;
  LicensedCustomPermissions: LicensedCustomPermissions;
  LightningBolt: LightningBolt;
  LightningBoltFeatures: LightningBoltFeatures;
  LightningBoltImages: LightningBoltImages;
  LightningBoltItems: LightningBoltItems;
  LightningComponentBundle: LightningComponentBundle;
  LwcResources: LwcResources;
  LwcResource: LwcResource;
  Targets: Targets;
  LightningExperienceSettings: LightningExperienceSettings;
  LightningExperienceTheme: LightningExperienceTheme;
  LightningMessageChannel: LightningMessageChannel;
  LightningMessageField: LightningMessageField;
  LightningOnboardingConfig: LightningOnboardingConfig;
  LiveAgentSettings: LiveAgentSettings;
  LiveChatAgentConfig: LiveChatAgentConfig;
  AgentConfigAssignments: AgentConfigAssignments;
  AgentConfigProfileAssignments: AgentConfigProfileAssignments;
  AgentConfigUserAssignments: AgentConfigUserAssignments;
  SupervisorAgentConfigSkills: SupervisorAgentConfigSkills;
  AgentConfigButtons: AgentConfigButtons;
  AgentConfigSkills: AgentConfigSkills;
  LiveChatButton: LiveChatButton;
  LiveChatButtonDeployments: LiveChatButtonDeployments;
  LiveChatButtonSkills: LiveChatButtonSkills;
  LiveChatDeployment: LiveChatDeployment;
  LiveChatDeploymentDomainWhitelist: LiveChatDeploymentDomainWhitelist;
  LiveChatSensitiveDataRule: LiveChatSensitiveDataRule;
  LiveMessageSettings: LiveMessageSettings;
  MacroSettings: MacroSettings;
  ManagedContentType: ManagedContentType;
  ManagedContentNodeType: ManagedContentNodeType;
  ManagedTopic: ManagedTopic;
  ManagedTopics: ManagedTopics;
  MapsAndLocationSettings: MapsAndLocationSettings;
  SourceTrackingSettings: SourceTrackingSettings;
  MatchingRule: MatchingRule;
  MatchingRuleItem: MatchingRuleItem;
  MatchingRules: MatchingRules;
  MetadataWithContent: MetadataWithContent;
  AccessControlPolicy: AccessControlPolicy;
  ApexClass: ApexClass;
  ApexComponent: ApexComponent;
  ApexPage: ApexPage;
  ApexTrigger: ApexTrigger;
  Certificate: Certificate;
  ContentAsset: ContentAsset;
  ContentAssetRelationships: ContentAssetRelationships;
  ContentAssetLink: ContentAssetLink;
  ContentAssetVersions: ContentAssetVersions;
  ContentAssetVersion: ContentAssetVersion;
  Document: Document;
  EclairGeoData: EclairGeoData;
  EclairMap: EclairMap;
  EmailTemplate: EmailTemplate;
  Attachment: Attachment;
  NetworkBranding: NetworkBranding;
  Orchestration: Orchestration;
  Scontrol: Scontrol;
  SiteDotCom: SiteDotCom;
  StaticResource: StaticResource;
  UiPlugin: UiPlugin;
  WaveDashboard: WaveDashboard;
  WaveDataflow: WaveDataflow;
  WaveLens: WaveLens;
  WaveRecipe: WaveRecipe;
  MilestoneType: MilestoneType;
  MlDomain: MlDomain;
  MobileApplicationDetail: MobileApplicationDetail;
  MobileSettings: MobileSettings;
  DashboardMobileSettings: DashboardMobileSettings;
  ModerationRule: ModerationRule;
  ModeratedEntityField: ModeratedEntityField;
  MyDomainSettings: MyDomainSettings;
  NameSettings: NameSettings;
  NamedCredential: NamedCredential;
  NavigationMenu: NavigationMenu;
  Network: Network;
  CommunityRoles: CommunityRoles;
  NetworkMemberGroup: NetworkMemberGroup;
  NetworkPageOverride: NetworkPageOverride;
  RecommendationAudience: RecommendationAudience;
  RecommendationAudienceDetail: RecommendationAudienceDetail;
  RecommendationDefinition: RecommendationDefinition;
  RecommendationDefinitionDetail: RecommendationDefinitionDetail;
  ScheduledRecommendation: ScheduledRecommendation;
  ScheduledRecommendationDetail: ScheduledRecommendationDetail;
  ReputationLevelDefinitions: ReputationLevelDefinitions;
  ReputationLevel: ReputationLevel;
  ReputationBranding: ReputationBranding;
  ReputationPointsRules: ReputationPointsRules;
  ReputationPointsRule: ReputationPointsRule;
  NetworkTabSet: NetworkTabSet;
  NotificationsSettings: NotificationsSettings;
  OauthCustomScope: OauthCustomScope;
  ObjectLinkingSettings: ObjectLinkingSettings;
  OmniChannelSettings: OmniChannelSettings;
  OpportunitySettings: OpportunitySettings;
  FindSimilarOppFilter: FindSimilarOppFilter;
  OrchestrationContext: OrchestrationContext;
  OrchestrationContextDataset: OrchestrationContextDataset;
  OrchestrationContextEvent: OrchestrationContextEvent;
  OrderManagementSettings: OrderManagementSettings;
  OrderSettings: OrderSettings;
  OrgPreferenceSettings: OrgPreferenceSettings;
  OrganizationSettingsDetail: OrganizationSettingsDetail;
  OrgSettings: OrgSettings;
  Package: Package;
  ProfileObjectPermissions: ProfileObjectPermissions;
  PackageTypeMembers: PackageTypeMembers;
  PardotEinsteinSettings: PardotEinsteinSettings;
  PardotSettings: PardotSettings;
  PartyDataModelSettings: PartyDataModelSettings;
  PathAssistant: PathAssistant;
  PathAssistantStep: PathAssistantStep;
  PathAssistantSettings: PathAssistantSettings;
  PermissionSet: PermissionSet;
  PermissionSetApplicationVisibility: PermissionSetApplicationVisibility;
  PermissionSetApexClassAccess: PermissionSetApexClassAccess;
  PermissionSetCustomMetadataTypeAccess: PermissionSetCustomMetadataTypeAccess;
  PermissionSetCustomPermissions: PermissionSetCustomPermissions;
  PermissionSetExternalDataSourceAccess: PermissionSetExternalDataSourceAccess;
  PermissionSetFieldPermissions: PermissionSetFieldPermissions;
  PermissionSetFlowAccess: PermissionSetFlowAccess;
  PermissionSetObjectPermissions: PermissionSetObjectPermissions;
  PermissionSetApexPageAccess: PermissionSetApexPageAccess;
  PermissionSetRecordTypeVisibility: PermissionSetRecordTypeVisibility;
  PermissionSetTabSetting: PermissionSetTabSetting;
  PermissionSetUserPermission: PermissionSetUserPermission;
  MutingPermissionSet: MutingPermissionSet;
  PermissionSetGroup: PermissionSetGroup;
  PersonListSettings: PersonListSettings;
  PicklistSettings: PicklistSettings;
  PlatformCachePartition: PlatformCachePartition;
  PlatformCachePartitionType: PlatformCachePartitionType;
  PlatformEncryptionSettings: PlatformEncryptionSettings;
  PlatformEventChannel: PlatformEventChannel;
  PlatformEventChannelMember: PlatformEventChannelMember;
  Portal: Portal;
  PostTemplate: PostTemplate;
  PresenceDeclineReason: PresenceDeclineReason;
  PresenceUserConfig: PresenceUserConfig;
  PresenceConfigAssignments: PresenceConfigAssignments;
  PresenceConfigProfileAssignments: PresenceConfigProfileAssignments;
  PresenceConfigUserAssignments: PresenceConfigUserAssignments;
  PrivacySettings: PrivacySettings;
  PrivateConnection: PrivateConnection;
  ExternalConnectionProperty: ExternalConnectionProperty;
  ProductSettings: ProductSettings;
  Profile: Profile;
  ProfileApplicationVisibility: ProfileApplicationVisibility;
  ProfileCategoryGroupVisibility: ProfileCategoryGroupVisibility;
  ProfileApexClassAccess: ProfileApexClassAccess;
  ProfileCustomMetadataTypeAccess: ProfileCustomMetadataTypeAccess;
  ProfileCustomPermissions: ProfileCustomPermissions;
  ProfileExternalDataSourceAccess: ProfileExternalDataSourceAccess;
  ProfileFieldLevelSecurity: ProfileFieldLevelSecurity;
  ProfileFlowAccess: ProfileFlowAccess;
  ProfileLayoutAssignment: ProfileLayoutAssignment;
  ProfileLoginHours: ProfileLoginHours;
  ProfileLoginIpRange: ProfileLoginIpRange;
  ProfileApexPageAccess: ProfileApexPageAccess;
  ProfileRecordTypeVisibility: ProfileRecordTypeVisibility;
  ProfileTabVisibility: ProfileTabVisibility;
  ProfileUserPermission: ProfileUserPermission;
  ProfilePasswordPolicy: ProfilePasswordPolicy;
  ProfileSessionSetting: ProfileSessionSetting;
  Prompt: Prompt;
  PromptVersion: PromptVersion;
  Queue: Queue;
  QueueMembers: QueueMembers;
  PublicGroups: PublicGroups;
  RoleAndSubordinates: RoleAndSubordinates;
  RoleAndSubordinatesInternal: RoleAndSubordinatesInternal;
  Roles: Roles;
  Users: Users;
  QueueSobject: QueueSobject;
  QueueRoutingConfig: QueueRoutingConfig;
  QuickAction: QuickAction;
  FieldOverride: FieldOverride;
  QuickActionLayout: QuickActionLayout;
  QuickActionLayoutColumn: QuickActionLayoutColumn;
  QuickActionLayoutItem: QuickActionLayoutItem;
  QuickActionSendEmailOptions: QuickActionSendEmailOptions;
  QuoteSettings: QuoteSettings;
  RecommendationStrategy: RecommendationStrategy;
  StrategyAction: StrategyAction;
  StrategyActionArg: StrategyActionArg;
  StrategyNodeFilter: StrategyNodeFilter;
  StrategyNodeUnionBase: StrategyNodeUnionBase;
  StrategyNodeBase: StrategyNodeBase;
  StrategyNodeExclusive: StrategyNodeExclusive;
  StrategyNodeIf: StrategyNodeIf;
  IfExpression: IfExpression;
  StrategyNodeInvocableAction: StrategyNodeInvocableAction;
  StrategyNodeInvocableActionArg: StrategyNodeInvocableActionArg;
  StrategyNodeMap: StrategyNodeMap;
  MapExpression: MapExpression;
  StrategyNodeRecommendationLimit: StrategyNodeRecommendationLimit;
  StrategyNodeRecommendationLoad: StrategyNodeRecommendationLoad;
  RecommendationLoadCondition: RecommendationLoadCondition;
  RecommendationConditionValue: RecommendationConditionValue;
  StrategyNodeSort: StrategyNodeSort;
  StrategyNodeSortField: StrategyNodeSortField;
  StrategyNodeUnion: StrategyNodeUnion;
  RecordActionDeployment: RecordActionDeployment;
  RecordActionDeploymentChannel: RecordActionDeploymentChannel;
  RecordActionDefaultItem: RecordActionDefaultItem;
  RecordActionDeploymentContext: RecordActionDeploymentContext;
  RecordActionRecommendation: RecordActionRecommendation;
  RecordActionSelectableItem: RecordActionSelectableItem;
  RecordPageSettings: RecordPageSettings;
  RemoteSiteSetting: RemoteSiteSetting;
  Report: Report;
  ReportAggregate: ReportAggregate;
  ReportBlockInfo: ReportBlockInfo;
  ReportAggregateReference: ReportAggregateReference;
  ReportBucketField: ReportBucketField;
  ReportBucketFieldValue: ReportBucketFieldValue;
  ReportBucketFieldSourceValue: ReportBucketFieldSourceValue;
  ReportChart: ReportChart;
  ReportColorRange: ReportColorRange;
  ReportColumn: ReportColumn;
  ReportCrossFilter: ReportCrossFilter;
  ReportFilterItem: ReportFilterItem;
  ReportCustomDetailFormula: ReportCustomDetailFormula;
  ReportDataCategoryFilter: ReportDataCategoryFilter;
  ReportFilter: ReportFilter;
  ReportFormattingRule: ReportFormattingRule;
  ReportFormattingRuleValue: ReportFormattingRuleValue;
  ReportGrouping: ReportGrouping;
  ReportHistoricalSelector: ReportHistoricalSelector;
  ReportParam: ReportParam;
  ReportTimeFrameFilter: ReportTimeFrameFilter;
  ReportType: ReportType;
  ObjectRelationship: ObjectRelationship;
  ReportLayoutSection: ReportLayoutSection;
  ReportTypeColumn: ReportTypeColumn;
  RestrictionRule: RestrictionRule;
  RetailExecutionSettings: RetailExecutionSettings;
  RoleOrTerritory: RoleOrTerritory;
  Role: Role;
  Territory: Territory;
  SamlSsoConfig: SamlSsoConfig;
  SchemaSettings: SchemaSettings;
  SearchSettings: SearchSettings;
  SearchSettingsByObject: SearchSettingsByObject;
  ObjectSearchSetting: ObjectSearchSetting;
  SecuritySettings: SecuritySettings;
  NetworkAccess: NetworkAccess;
  IpRange: IpRange;
  PasswordPolicies: PasswordPolicies;
  SessionSettings: SessionSettings;
  SingleSignOnSettings: SingleSignOnSettings;
  ServiceChannel: ServiceChannel;
  ServiceChannelFieldPriority: ServiceChannelFieldPriority;
  ServicePresenceStatus: ServicePresenceStatus;
  ServiceChannelStatus: ServiceChannelStatus;
  SharingBaseRule: SharingBaseRule;
  AccountSharingRuleSettings: AccountSharingRuleSettings;
  SharingCriteriaRule: SharingCriteriaRule;
  SharingGuestRule: SharingGuestRule;
  SharingOwnerRule: SharingOwnerRule;
  SharingTerritoryRule: SharingTerritoryRule;
  SharingRules: SharingRules;
  SharingSet: SharingSet;
  AccessMapping: AccessMapping;
  SharingSettings: SharingSettings;
  SiteSettings: SiteSettings;
  Skill: Skill;
  SkillAssignments: SkillAssignments;
  SkillProfileAssignments: SkillProfileAssignments;
  SkillUserAssignments: SkillUserAssignments;
  SocialCustomerServiceSettings: SocialCustomerServiceSettings;
  SocialProfileSettings: SocialProfileSettings;
  StandardValueSet: StandardValueSet;
  StandardValueSetTranslation: StandardValueSetTranslation;
  SurveySettings: SurveySettings;
  SynonymDictionary: SynonymDictionary;
  SystemNotificationSettings: SystemNotificationSettings;
  Territory2: Territory2;
  FieldValue: FieldValue;
  Territory2RuleAssociation: Territory2RuleAssociation;
  Territory2Model: Territory2Model;
  Territory2Rule: Territory2Rule;
  Territory2RuleItem: Territory2RuleItem;
  Territory2Settings: Territory2Settings;
  Territory2SettingsOpportunityFilter: Territory2SettingsOpportunityFilter;
  Territory2Type: Territory2Type;
  TimeSheetTemplate: TimeSheetTemplate;
  TimeSheetTemplateAssignment: TimeSheetTemplateAssignment;
  TopicsForObjects: TopicsForObjects;
  TrailheadSettings: TrailheadSettings;
  TransactionSecurityPolicy: TransactionSecurityPolicy;
  TransactionSecurityAction: TransactionSecurityAction;
  TransactionSecurityNotification: TransactionSecurityNotification;
  Translations: Translations;
  CustomApplicationTranslation: CustomApplicationTranslation;
  CustomDataTypeTranslation: CustomDataTypeTranslation;
  CustomDataTypeComponentTranslation: CustomDataTypeComponentTranslation;
  CustomLabelTranslation: CustomLabelTranslation;
  CustomPageWebLinkTranslation: CustomPageWebLinkTranslation;
  CustomTabTranslation: CustomTabTranslation;
  FlowDefinitionTranslation: FlowDefinitionTranslation;
  FlowTranslation: FlowTranslation;
  FlowChoiceTranslation: FlowChoiceTranslation;
  FlowChoiceUserInputTranslation: FlowChoiceUserInputTranslation;
  FlowInputValidationRuleTranslation: FlowInputValidationRuleTranslation;
  FlowScreenTranslation: FlowScreenTranslation;
  FlowScreenFieldTranslation: FlowScreenFieldTranslation;
  FlowStageTranslation: FlowStageTranslation;
  FlowTextTemplateTranslation: FlowTextTemplateTranslation;
  GlobalQuickActionTranslation: GlobalQuickActionTranslation;
  ReportTypeTranslation: ReportTypeTranslation;
  ReportTypeSectionTranslation: ReportTypeSectionTranslation;
  ReportTypeColumnTranslation: ReportTypeColumnTranslation;
  ScontrolTranslation: ScontrolTranslation;
  UIObjectRelationConfig: UIObjectRelationConfig;
  UIObjectRelationFieldConfig: UIObjectRelationFieldConfig;
  UserCriteria: UserCriteria;
  UserEngagementSettings: UserEngagementSettings;
  UserInterfaceSettings: UserInterfaceSettings;
  UserManagementSettings: UserManagementSettings;
  VoiceSettings: VoiceSettings;
  WaveApplication: WaveApplication;
  WaveDataset: WaveDataset;
  WaveTemplateBundle: WaveTemplateBundle;
  WaveXmd: WaveXmd;
  WaveXmdDate: WaveXmdDate;
  WaveXmdDimension: WaveXmdDimension;
  WaveXmdFormattingProperty: WaveXmdFormattingProperty;
  WaveXmdFormattingBin: WaveXmdFormattingBin;
  WaveXmdFormattingPredicate: WaveXmdFormattingPredicate;
  WaveXmdDimensionCustomAction: WaveXmdDimensionCustomAction;
  WaveXmdDimensionMember: WaveXmdDimensionMember;
  WaveXmdRecordDisplayLookup: WaveXmdRecordDisplayLookup;
  WaveXmdDimensionSalesforceAction: WaveXmdDimensionSalesforceAction;
  WaveXmdMeasure: WaveXmdMeasure;
  WaveXmdOrganization: WaveXmdOrganization;
  WorkDotComSettings: WorkDotComSettings;
  Workflow: Workflow;
  WorkflowAlert: WorkflowAlert;
  WorkflowAction: WorkflowAction;
  WorkflowFieldUpdate: WorkflowFieldUpdate;
  WorkflowFlowAction: WorkflowFlowAction;
  WorkflowFlowActionParameter: WorkflowFlowActionParameter;
  WorkflowKnowledgePublish: WorkflowKnowledgePublish;
  WorkflowOutboundMessage: WorkflowOutboundMessage;
  WorkflowSend: WorkflowSend;
  WorkflowTask: WorkflowTask;
  WorkflowEmailRecipient: WorkflowEmailRecipient;
  WorkflowRule: WorkflowRule;
  WorkflowTimeTrigger: WorkflowTimeTrigger;
  SaveResult: SaveResult;
  Error: Error;
  ExtendedErrorDetails: ExtendedErrorDetails;
  DeleteResult: DeleteResult;
  DeployOptions: DeployOptions;
  AsyncResult: AsyncResult;
  DescribeMetadataResult: DescribeMetadataResult;
  DescribeMetadataObject: DescribeMetadataObject;
  DescribeValueTypeResult: DescribeValueTypeResult;
  ValueTypeField: ValueTypeField;
  PicklistEntry: PicklistEntry;
  ListMetadataQuery: ListMetadataQuery;
  ReadResult: ReadResult;
  RetrieveRequest: RetrieveRequest;
  UpsertResult: UpsertResult;
  LogInfo: LogInfo;
};
