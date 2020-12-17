@isTest
public class JSforceTestLogicTest {

    @isTest
    static void testSayHello() {
        JSforceTestLogic.sayHello();
    }

    @isTest
    static void testCrud() {
        JSforceTestLogic.doCrud();
    }

    @isTest
    static void testCrudWithError() {
        JSforceTestLogic.doCrudWithError();
    }

}