@RestResource(urlMapping='/JSforceTestUserPool/*')
global with sharing class JSforceTestUserPool {
    
    @HttpPost
    global static Map<String, String> checkout(String clientName) {
        UserPool__c[] userpools = [
            SELECT Id, Name FROM UserPool__c
            WHERE IsPooled__c = true
            ORDER BY LastCheckedOutAt__c ASC NULLS FIRST
            LIMIT 1
        ];
        if (userpools.size() == 0) {
            return null;
        }
        Id poolId = userpools[0].Id;
        userpools = [
            SELECT Id, Name FROM UserPool__c
            WHERE IsPooled__c = true
            AND Id = :poolId
            LIMIT 1
            FOR UPDATE
        ];
        if (userpools.size() == 0) {
            return null;
        }
        Datetime now = System.now();
        userpools[0].LastCheckedOutAt__c = now;
        userpools[0].CheckedOutAt__c = now;
        userpools[0].CheckedOutBy__c = clientName;
        update userpools;
        return new Map<String, String> {
            'username' => userpools[0].Name
        };
    }

    @HttpDelete
    global static void checkin() {
        RestRequest req = RestContext.request;
        String username = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        UserPool__c[] userpools = [
            SELECT Id, Name FROM UserPool__c
            WHERE Name = :username
            LIMIT 1
            FOR UPDATE
        ];
        if (userpools.size() == 0) {
            return;
        }
        userpools[0].CheckedOutAt__c = null;
        userpools[0].CheckedOutBy__c = null;
        update userpools;
    }
  
}