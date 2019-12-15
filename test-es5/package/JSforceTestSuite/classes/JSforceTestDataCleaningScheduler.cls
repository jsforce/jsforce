global class JSforceTestDataCleaningScheduler implements Schedulable {
    global void execute(SchedulableContext sc) {
        JSforceTestData.cleanupData();
    }
}