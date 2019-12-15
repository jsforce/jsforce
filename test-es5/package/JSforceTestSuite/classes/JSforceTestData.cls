@RestResource(urlMapping='/JSforceTestData/')
global class JSforceTestData {

    @HttpDelete
    global static void cleanupData() {
        cleanupData(System.now());
    }

    public static void cleanupData(Datetime dt) {
        JSforceTestSetting__c setting = JSforceTestSetting__c.getInstance(UserInfo.getUserId());
        if (setting != null) {
            String testUsername = setting.ExecUsername__c;
            String targetTableNames = setting.TargetTableNames__c;
            if (targetTableNames == null) {
              targetTableNames = 'Lead,Opportunity,Contact,Account,UpsertTable__c';
            }
            String[] tableNames = targetTableNames.split(',');
            for (String table : tableNames) {
                String soql = 'SELECT Id FROM ' + table + ' WHERE CreatedBy.Username = \'' + testUsername + '\' AND CreatedDate < ' + dt.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
                delete Database.query(soql);
            }
        }
    }
}
