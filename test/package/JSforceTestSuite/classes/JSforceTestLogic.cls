public class JSforceTestLogic {
    public static void sayHello() {
        System.debug('Hello, world');
    }

    public static void doCrud() {
        Account acc = new Account(Name='JSforceTestLogic Account #1');
        insert acc;
        System.debug('Acc Id=' + acc.Id);
        acc.Name = 'JSforceTestLogic Account #1 (Updated)';
        update acc;
        acc = [SELECT Id FROM Account WHERE Name LIKE 'JSforceTestLogic Account%' LIMIT 1];
        delete acc;
    }

    public static void doCrudWithError() {
        Account acc = new Account(Name='JSforceTestLogic Account #1');
        insert acc;
        System.debug('Acc Id=' + acc.Id);
        acc.Name = 'JSforceTestLogic Account #1 (Updated)';
        update acc;
        acc = [SELECT Id FROM Account WHERE Name LIKE 'Should not find by name%' LIMIT 1];
        delete acc;
    }

}