# Tax and Trade Bureau network

> This is the network for the Tax and Trade Bureau that deals with granting Permits to enterprises and deals with Appeals against them

This network defines:

**Participant**
`OwnerOfficer`
`Individual`
`Employee`
`Regulator`
`CivicAuthority`

**Asset**
`Application`
`ApplicationDetail`
`Appeal`

**Transaction**
`SubmitApplication`
`UpdateApplicationStatus`
`SubmitAppeal`
`UpdateAppealStatus`


**Event**
`SubmitApplicationEvent``
`UpdateApplicationStatusEvent``
`SubmitAppealEvent`
`UpdateAppealStatusEvent`

There are three types of users in the system.
Individual and Employee are derived from the abstract OwnerOfficer. These are users/applicants who apply for Permits.
The secondtype of user is the Regulator. This is an official from the TTB who iversees the application and grants Permits.
The third type of user is the CivicAuthority who deals with Appeals filed aagaint the Application (for Permits).

There are three type of Assets. An ApplicationDetail is filled out by the applicant and on the SubmitApplication transaction, this turns into an Application.
An Appeal is filed by members of the public, but the CivicAuthority is the one who keep tracks of them and enters it into this system.

An Application starts from an initial state of 'Initial Analysis' and proceeds to 'Granted' that indicates the grant of the Permit. 



To test this Network Definition in the **Test** tab:

Run the SetupDemo transaction.
This sets up two Individual users with identifiers 'IND_1' and 'IND_2', a Regulator with the identifier 'REGULATOR", a CivicAuthority with the identifier 'CA_1'.
This sets up a ApplicationDetail asset (for a Brewery) with identifier 'APP_DET_1' with the owner reference to OwnerOfficer identifier 'IND_1'.
Though the instance created is an Individual, the reference is to an OwnerOfficer as this will accomodate other types of users like the Employee.

You should now be able to see all of these in the Registry.

Next, to submit this application, choose the `SubmitApplication` transaction and fill in the details as shown below.
Note that the value of the application identifier appId is entered as 'APP_1'. This is as required by the TTB rules where they generate a applicaion identifier based on some predefined codes.

```
{
  "$class": "gov.alcoholttb.network.SubmitApplication",
  "appId": "APP_1",
  "appDet": "resource:gov.alcoholttb.network.ApplicationDetail#appDetId:APP_DET_1",
  "submitter": "resource:gov.alcoholttb.network.Individual#EIN:IND_1"
}
```

You should now be able to see an `Application` asset created with the appId of 'APP_1' in the AssetRegistry with an appStatus of 'INITIAL_ANALYSIS'.

We will skip intermediate stages of the Application and change the status to 'ACCEPTABLE'.
For this, choose the `UpdateApplicationStatus` transaction and fill in the details as shown below.
You could enter the values for the appStatus and appId variables only and just take the default date (the current date) that the system provides.

```
{
  "$class": "gov.alcoholttb.network.UpdateApplicationStatus",
  "appStatus": "ACCEPTABLE",
  "updateDate": "2017-07-29T11:41:15.003Z",
  "appId": "APP_1"
}
```
You should now be able to see an the `Application` asset with the appId of 'APP_1' in the AssetRegistry with an appStatus of 'ACCEPTABLE'.

Now we will create two Appeals against this Application.
Choose the `SubmitAppeal` transaction and fill in the details as shown below.

```
{
  "$class": "gov.alcoholttb.network.SubmitAppeal",
  "appealId": "APPEAL_1",
  "appId": "APP_1",
  "reason": "Residential Area"
}
```

For the second Appeal, choose the `SubmitAppeal` transaction and fill in the details as shown below.

```
{
  "$class": "gov.alcoholttb.network.SubmitAppeal",
  "appealId": "APPEAL_2",
  "appId": "APP_1",
  "reason": "Residential Area"
}
```

You should now be able to see two `Appeal` assets created with the appealId of 'APPEAL_1' and 'APPEAL_2' in the AssetRegistry with an appStatus of 'PENDING'.

Also, look at the Application asset and note that the appealIds have the two AppealIds added to them.

```
{
  "$class": "gov.alcoholttb.network.Application",
  "appId": "APP_1",
  "appStatus": "ACCEPTABLE",
  "appealIds": [
    "APPEAL_1",
    "APPEAL_2"
  ],
  "appDetail": "resource:gov.alcoholttb.network.ApplicationDetail#appDetId:APP_DET_1",
  "owner": "resource:gov.alcoholttb.network.OwnerOfficer#EIN:IND_1"
}
```
Now, we will try to update the Application status to 'GRANTED'. Since two Appeals are pending against this Application, the system should not allow this change, 
but instead should change the state to 'PENDING_APPEAL'

Choose the `UpdateApplicationStatus` transaction and fill in the details as shown below.
You could enter the values for the appStatus and appId variables only and just take the default date (the current date) that the system provides.

```
{
  "$class": "gov.alcoholttb.network.UpdateApplicationStatus",
  "appStatus": "GRANTED",
  "updateDate": "2017-07-29T11:41:15.003Z",
  "appId": "APP_1"
}
```
You should now be able to see an the `Application` asset with the appId of 'APP_1' in the AssetRegistry with an appStatus of 'PENDING_APPEAL'.

Now let us change the status of the appeal to 'DISPOSED' indicating that this Appeal has been dismissed.

```
{
  "$class": "gov.alcoholttb.network.UpdateAppealStatus",
  "appealStatus": "DISPOSED",
  "updateDate": "2017-07-29T12:32:05.951Z",
  "appealId": "APPEAL_1",
  "appId": "APP_1"
}
```

You should now be able to see an the `Appeal` asset with the appId of 'APPEAL_1' in the AssetRegistry with an appealStatus of 'DISPOSED'.
The `Application` asset with the appId of 'APP_1' in the AssetRegistry will still have an appStatus of 'PENDING_APPEAL'.

Now let us change the status of the second appeal with Id 'APPEAL_2' to 'DISPOSED' indicating that this Appeal has been dismissed.
This should trigger the status of the Application with appId 'APP_1' to 'Granted' as all the Appeals againt this Application have been dismissed.

```
{
  "$class": "gov.alcoholttb.network.UpdateAppealStatus",
  "appealStatus": "DISPOSED",
  "updateDate": "2017-07-29T12:32:05.951Z",
  "appealId": "APPEAL_2",
  "appId": "APP_1"
}
```

You should now be able to see an the `Appeal` asset with the appId of 'APPEAL_2' in the AssetRegistry with an appealStatus of 'DISPOSED'.
The `Application` asset with the appId of 'APP_1' in the AssetRegistry should now have an appStatus of 'GRANTED'.


