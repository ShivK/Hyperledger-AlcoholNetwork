
/**
 * Submit the Appeal for an Application
 * @param {gov.alcoholttb.network.SubmitAppeal} appeal - submit the appeal
 * @transaction
 */
 function SubmitAppeal(appeal) {
    console.log('submitting appeal');

    var factory = getFactory();
	var NS = 'gov.alcoholttb.network';

    var app = factory.newResource(NS, 'Appeal', appeal.appealId);
	app.appId = appeal.appId;
	app.appealStatus = 'PENDING';
	app.reason = appeal.reason;

      // save Appeal
    return getAssetRegistry(app.getFullyQualifiedType())
        .then(function (registry) {
            return registry.add(app);
        })
  	.then(function() {
		return getAssetRegistry(NS + '.Application')
		.then(function(appRegistry) {
			return appRegistry.get(appeal.appId)
				.then(function(app) {
                    var idA = app.appealIds;
              		if (idA == null) {
                      idA = [appeal.appealId]
                    }else {
                      idA.push(appeal.appealId)
                    }
              		app.appealIds = idA;
					return appRegistry.update(app);
				})
		})
	})
	
	.then(function(){
		var submitAppEvent = factory.newEvent(NS, 'SubmitAppealEvent');
		submitAppEvent.appealId = appeal.appealId;
		submitAppEvent.appId = appeal.appId;
		emit(submitAppEvent);
	});
 }
 
 /**
 * Update the status of an Appeal
 * @param {gov.alcoholttb.network.UpdateAppealStatus} updateAppStatus - the UpdateAppealStatus transaction
 * @transaction
 */
function updateAppealStatus(updateAppStatus) {
    console.log('updateAppealStatus');

    var factory = getFactory();
	var NS = 'gov.alcoholttb.network';
    var pending = false;
	

  	// get Appeal
  	return getAssetRegistry(NS + '.Appeal')
  		.then(function(registry) {
			return registry.get(updateAppStatus.appealId)
				.then(function(appeal) {
					appeal.appealStatus = updateAppStatus.appealStatus;
					return registry.update(appeal);
				})
		})
		//New
		.then(function() {
			return getAssetRegistry(NS + '.Application');
		})
  		.then(function(registry) {
			return registry.get(updateAppStatus.appId)
				.then(function(app) {
					if (app.appStatus == 'PENDING_APPEAL') {
						//Check if any Appeals are Pending
						return getAssetRegistry(NS + '.Appeal')
							.then(function (appealAssetRegistry) {
								// Get all of the appeals in the asset registry.
								return appealAssetRegistry.getAll();
						})
	 				    .then(function (appeals) {
							// Process the array of appeals
							appeals.forEach(function (appeal) {
							if (appeal.appId == app.appId) {
								if (appeal.Id == updateAppStatus.appealId)
									appeal.appealStatus = updateAppStatus.appealStatus;
                              
								if (appeal.appealStatus !== 'DISPOSED') {
									pending = true;
								}
							}
							});
							if (!pending) {
								app.appStatus = 'GRANTED'
							}
							return registry.update(app);
					    })
						
					
					}
					//appeal.appealStatus = updateAppStatus.appealStatus;
					//return registry.update(appeal);
				})
		})		
		//End New
  
        .then(function(){
    		var updateAppealStatusEvent = factory.newEvent(NS, 'UpdateAppealStatusEvent');
      		updateAppealStatusEvent.appealStatus = updateAppStatus.appealStatus;
			updateAppealStatusEvent.appealId = updateAppStatus.appealId;
      		updateAppealStatusEvent.appId = updateAppStatus.appId;
    		emit(updateAppealStatusEvent);
    	});
        
}
