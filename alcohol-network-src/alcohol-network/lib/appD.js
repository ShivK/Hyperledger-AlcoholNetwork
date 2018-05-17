
/**
 * Submit the Application for a Permit
 * @param {gov.alcoholttb.network.SubmitApplication} appDetail - submit the application
 * @transaction
 */
function SubmitApplication(appDetail) {
    console.log('submitting application');

    var factory = getFactory();
	var NS = 'gov.alcoholttb.network';

    var app = factory.newResource(NS, 'Application', appDetail.appId);
	app.appStatus = 'INITIAL_ANALYSIS'
	app.appDetail = factory.newRelationship(NS, 'ApplicationDetail', appDetail.appDet.appDetId);
	app.owner = factory.newRelationship(NS, 'OwnerOfficer', appDetail.submitter.EIN);

    // save Application
    return getAssetRegistry(app.getFullyQualifiedType())
        .then(function (registry) {
            return registry.add(app);
        })
        .then(function(){
    		var submitAppEvent = factory.newEvent(NS, 'SubmitApplicationEvent');
      		submitAppEvent.appId = app.appId;
    		emit(submitAppEvent);
    	});
}

/**
 * Update the status of an application
 * @param {gov.alcoholttb.network.UpdateApplicationStatus} updateAppStatus - the UpdateApplicationStatus transaction
 * @transaction
 */
function updateApplicationStatus(updateAppStatus) {
    console.log('updateApplicationStatus');

    var factory = getFactory();
	var NS = 'gov.alcoholttb.network';
    var pending = false;
	

  	// get Application
  	return getAssetRegistry(NS + '.Application')
  		.then(function(registry) {
			//return registry.get(updateAppStatus.app.appId)
			return registry.get(updateAppStatus.appId)
				.then(function(app) {
					var currAppStatus = app.appStatus;
					if (updateAppStatus.appStatus == 'ACCEPTED') {
						if (currAppStatus !== 'INITIAL_ANALYSIS') 
							throw new Error('Application status should be INITIAL_ANALYSIS for it to be changed to ACCEPTED');
					}
					//Other check conditions here
					if (updateAppStatus.appStatus == 'GRANTED') {
						if (currAppStatus !== 'ACCEPTABLE' && currAppStatus !== 'PENDING_APPEAL') 
							throw new Error('Application status should be ACCEPTABLE for it to be changed to GRANTED');
					}
							app.appStatus = updateAppStatus.appStatus;

              //Check if any Appeals are Pending
					return getAssetRegistry(NS + '.Appeal')
						.then(function (appealAssetRegistry) {
							// Get all of the appeals in the asset registry.
							return appealAssetRegistry.getAll();
					})
 				    .then(function (appeals) {
						// Process the array of appeals
						appeals.forEach(function (appeal) {
							if (appeal.appId == updateAppStatus.appId) {
								if (appeal.appealStatus !== 'DISPOSED') {
									pending = true;
								}
							}
						});
						if (currAppStatus == 'ACCEPTABLE' || currAppStatus == 'PENDING_APPEAL' ) {
							if (pending) {
								app.appStatus = 'PENDING_APPEAL'
							}
						}
								
                      	return registry.update(app);
  
					})					

					//End Appeals check              
					
				})
		})
        .then(function(){
    		var updateApplicationStatusEvent = factory.newEvent(NS, 'UpdateApplicationStatusEvent');
      		updateApplicationStatusEvent.appStatus = updateAppStatus.appStatus;
      		updateApplicationStatusEvent.appId = updateAppStatus.appId;
    		emit(updateApplicationStatusEvent);
    	});
        
}
