
/**
 * Setup the demo
 * @param {gov.alcoholttb.network.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {
  var factory = getFactory();
  var NS = 'gov.alcoholttb.network';


  return getParticipantRegistry(NS + '.Regulator')
  .then(function(regulatorRegistry) {
      var regulator = factory.newResource(NS, 'Regulator', 'REGULATOR');
      regulator.Id = 'REGULATOR';
      regulator.firstName = 'TTB';
      regulator.lastName = 'Regulator';
      return regulatorRegistry.addAll([regulator]);
  })
  .then(function() {
      return getParticipantRegistry(NS + '.CivicAuthority');
  })
  .then(function(civicRegistry) {
      var civicA = factory.newResource(NS, 'CivicAuthority', 'CA_1');
      civicA.Id = 'CA_1';
      civicA.firstName = 'Civic';
      civicA.lastName = 'Authority';
      return civicRegistry.addAll([civicA]);
  })  
  .then(function() {
      return getParticipantRegistry(NS + '.Individual');
  })
  .then(function(IndividualRegistry) {
	  var owner1 = factory.newResource(NS, 'Individual', 'IND_1');
	  owner1.EIN = 'IND_1'
      owner1.firstName = 'First';
      owner1.lastName = 'Owner';
	  owner1.gender = 'FEMALE'
	  owner1.email = 'owner1@mail.com'
	  owner1.phone = '9611292317'
	  owner1.placeOfBirthCity = 'New York'
      owner1.placeOfBirthState = 'NY'
      owner1.isUSCitizen = true
	  
	  owner1.address = factory.newConcept(NS, 'Address');
      owner1.address.city = 'NY'
      owner1.address.country = "US"
      owner1.address.state = 'NY'
      owner1.address.street1 =  '111 First Ave'
      owner1.address.postalCode = '11212'

	  var owner2 = factory.newResource(NS, 'Individual', 'IND_2');
	  owner2.EIN = 'IND_2'
      owner2.firstName = 'Second';
      owner2.lastName = 'Owner';
	  owner2.gender = 'FEMALE'
	  owner2.email = 'owner2@mail.com'
	  owner2.phone = '9611292317'
	  owner2.placeOfBirthCity = 'New York'
      owner2.placeOfBirthState = 'NY'
      owner2.isUSCitizen = true

	  owner2.address = factory.newConcept(NS, 'Address');	  
      owner2.address.city = 'NY'
      owner2.address.country = "US"
      owner2.address.state = 'NY'
      owner2.address.street1 =  '111 First Ave'
      owner2.address.postalCode = '11212'
	  
	  var owners = [owner1,owner2]
	  
      return IndividualRegistry.addAll(owners);
  })
  .then(function() {
      return getAssetRegistry(NS + '.ApplicationDetail');
  })
  .then(function(ApplicationDetailRegistry) {
	  var appD = factory.newResource(NS, 'ApplicationDetail', 'APP_DET_1');
	  appD.appDetId = 'APP_DET_1'
	  appD.dateApplied = new Date('2017-07-28')
	  appD.reason = 'NEW_BUSINESS'
	  
  	  appD.premise = factory.newConcept(NS, 'BusinessPremise');	  
	  appD.premise.contactName = 'manager_P1'
	  appD.premise.contactPhone = '9232367567'
	  appD.premise.address = factory.newConcept(NS, 'Address');	  
      appD.premise.address.city = 'NY'
      appD.premise.address.country = "US"
      appD.premise.address.state = 'NY'
      appD.premise.address.street1 =  '1212 Park Ave'
      appD.premise.address.postalCode = '11213'
	  
	  appD.commodities = ['BREWERY']
	  appD.owner = factory.newRelationship(NS, 'OwnerOfficer', 'IND_1');

      return ApplicationDetailRegistry.addAll([appD]);

  });  
  
}

