public class JSforceTestUtil {

    private static JSforceTestSetting__c getTestSetting() {
        JSforceTestSetting__c setting = JSforceTestSetting__c.getOrgDefaults();
        if (setting == null) { setting = new JSforceTestSetting__c(ExecUsername__c=UserInfo.getUserName()); }
        return setting;
    }

    public static Boolean lockTestSession() {
        JSforceTestSetting__c setting = getTestSetting();
        Datetime now = System.now();
        if (setting.ExecLatch__c != null && setting.ExecLatch__c > now.addMinutes(-10)) {
            return false;
        }
        setting.ExecLatch__c = now;
        upsert setting;
        cleanupData();
        return true;
    }

    public static Boolean unlockTestSession() {
        JSforceTestSetting__c setting = getTestSetting();
        setting.ExecLatch__c = null;
        upsert setting;
        cleanupData();
        return true;
    }

    public static void cleanupData() {
        cleanupData(System.now());
    }    

    public static void cleanupData(Datetime dt) {
        JSforceTestSetting__c setting = JSforceTestSetting__c.getInstance(UserInfo.getUserId());
        if (setting != null) {
	        String testUsername = setting.ExecUsername__c;
            String targetTableNames = setting.TargetTableNames__c;
            String[] tableNames = targetTableNames.split(',');
            for (String table : tableNames) {
                String soql = 'SELECT Id FROM ' + table + ' WHERE CreatedBy.Username = \'' + testUsername + '\' AND CreatedDate < ' + dt.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
            	delete Database.query(soql);
            }
        }
    }
}