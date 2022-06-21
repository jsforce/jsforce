# assuming you have a default devhub set up, this creates a scratch org you can use to run the tests
sfdx force:org:delete -u jsforceTestOrg --noprompt
sfdx force:org:create edition=Developer -a jsforceTestOrg features=EnableSetPasswordInApi hasSampleData=true
sfdx force:user:password:generate -u jsforceTestOrg

# wait for deploy to complete, otherwise bulk upserts will fail
sfdx force:mdapi:deploy -u jsforceTestOrg -d test/package/JSForceTestSuite -w 60

sfdx force:user:permset:assign -u jsforceTestOrg -n JSForceTestPowerUser

# create a big table and insert it a lot of times
rm test/data/BigTable.csv
USERID=$(sfdx force:user:display --json -u jsforceTestOrg | grep -o '005.*\w')
printf "USERID: $USERID\n"

echo 'OwnerId'>> test/data/BigTable.csv
for i in {1..5000}
do
  echo $USERID>> test/data/BigTable.csv
done

sfdx force:data:bulk:upsert -u jsforceTestOrg --csvfile test/data/BigTable.csv -s BigTable__c -i Id
sfdx force:data:bulk:upsert -u jsforceTestOrg --csvfile test/data/BigTable.csv -s BigTable__c -i Id
sfdx force:data:bulk:upsert -u jsforceTestOrg --csvfile test/data/BigTable.csv -s BigTable__c -i Id
sfdx force:data:bulk:upsert -u jsforceTestOrg --csvfile test/data/BigTable.csv -s BigTable__c -i Id
sfdx force:data:bulk:upsert -u jsforceTestOrg --csvfile test/data/BigTable.csv -s BigTable__c -i Id

sfdx force:data:record:create \
-u jsforceTestOrg \
-s PushTopic \
-v "Name='JSforceTestAccountUpdates' Query='SELECT Id, Name FROM Account' ApiVersion='54.0' NotifyForFields=Referenced NotifyForOperationCreate=true NotifyForOperationUpdate=true NotifyForOperationDelete=false NotifyForOperationUndelete=false"
PASSWORD=$(sfdx force:org:display --json -u jsforceTestOrg | jq -r '.result.password')
USERNAME=$(sfdx force:org:display --json -u jsforceTestOrg | jq -r '.result.username')
INSTANCE_URL=$(sfdx force:org:display --json -u jsforceTestOrg | jq -r '.result.instanceUrl')

echo "Run tests using this scratch org by appending SF_LOGIN_URL=$INSTANCE_URL SF_USERNAME=$USERNAME SF_PASSWORD=$PASSWORD"
