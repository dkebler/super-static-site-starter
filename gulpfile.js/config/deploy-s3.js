var config = require('./')

module.exports = {
	profile:'hwdeploy',  // aws profile with write privileges to bucket.
	grants:'read=uri=http://acs.amazonaws.com/groups/global/AllUsers',
	dryrun:'',
	delete:'',
// use this for testing bucket	
	testing: {
		url: 'test.healthwrights.org',
		bucket:'test.healthwrights.org'
	},
// use this for live production bucket	  	
	live: {
		url: 'web.healthwrights.org',
		bucket:'web.healthwrights.org'
	},
	location: 'testing' // default is to testing bucket
}