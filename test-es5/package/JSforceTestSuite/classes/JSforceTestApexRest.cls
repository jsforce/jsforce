@RestResource(urlMapping='/JSforceTestApexRest/*')
global with sharing class JSforceTestApexRest {
    
    @HttpGet
    global static Account doGet() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        Account result = [SELECT Id, Name, Phone, Website FROM Account WHERE Id = :accountId];
        return result;
    }
  
    @HttpPost
    global static String doPost(String name, String phone, String website) {
        Account account = new Account();
        account.Name = name;
        account.Phone = phone;
        account.Website = website;
        insert account;
        return account.Id;
    }

    @HttpPatch
    global static Account doPatch(String name) {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        Account account = new Account(Id=accountId);
        account.Name = name;
        update account;
        account = [SELECT Id, Name, Phone, Website FROM Account WHERE Id = :accountId];
        return account;
    }
    
    @HttpPut
    global static Account doPut(Account account) {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        account.Id = accountId;
        update account;
        account = [SELECT Id, Name, Phone, Website FROM Account WHERE Id = :accountId];
        return account;
    }

    @HttpDelete
    global static void doDelete() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        Account account = [SELECT Id FROM Account WHERE Id = :accountId];
        delete account;
    }
  
}