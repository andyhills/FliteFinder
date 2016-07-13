//Script for flite finder
//1.3

var guidList = [];
var guidRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
var adGuids, cGuids;

chrome.browserAction.setBadgeBackgroundColor({color: "#888888"});

//reset guidList on every page load
chrome.webNavigation.onBeforeNavigate.addListener(
	function(details) {
		if (details.frameId === 0){
			//console.log(details.frameId + " " + details.url);
			guidList = [];
			adGuids = 0;
			cGuids = 0;
			chrome.browserAction.setBadgeText({text: ""});
			//chrome.browserAction.setIcon({path: "icons/flite-finder-icons_inactive.png"});
		}
	}
);

//check all requests; if it is calling a flite ad, grab the guid and add it to the list
chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		//console.log(info.url);
		var guidLoc, theGuid;

		//get's the ad instance ID if in a campaign
		if (info.url.indexOf('/ci/') > -1) {
			guidLoc = info.url.indexOf('/ci/') + 4;
			theGuid = info.url.substring(guidLoc, guidLoc+36);
			if (guidList.indexOf(theGuid) < 0) {
				guidList.push(theGuid);
				cGuids++;
			}
		}

		guidLoc = info.url.indexOf('/i/') + 3;
		theGuid = info.url.substring(guidLoc, guidLoc+36);
		if (guidList.indexOf(theGuid) < 0) {
			guidList.push(theGuid);
			adGuids++;
		}

		chrome.browserAction.setBadgeText({text: adGuids.toString()});
		if (cGuids) {
			chrome.browserAction.setBadgeText({text: cGuids.toString() + "/" + adGuids.toString()});
		}

	},
	//filters:
	{
		urls: ["https://s.flite.com/syndication/ad.js/*", "http://s.flite.com/syndication/ad.js/*"]
	}
);

//open the flite ads in new tabs on click of the extension button
chrome.browserAction.onClicked.addListener(
	function(tab){
		var newURL;
		for (i = 0; i < guidList.length; i++){
			newURL = "http://console.flite.com/i/"+guidList[i];
			chrome.tabs.create({url: newURL, index: tab.index+i+1});
		}
	}
);


//This is for seizure mode below
/*

var r, g, b;

setInterval(function () {
		r = Math.floor((Math.random() * 256));
		g = Math.floor((Math.random() * 256));
		b = Math.floor((Math.random() * 256));

		chrome.browserAction.setBadgeBackgroundColor({color: [r, g, b, 255]});
	},
	86400000
);
*/
