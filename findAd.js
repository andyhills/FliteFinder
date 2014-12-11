//Script for flite finder
//1.2

var guidList = [];
var guidLoc, theGuid, newURL; 

//reset guidList on every page load
chrome.webNavigation.onBeforeNavigate.addListener(
	function(details) {
		if (details.frameId === 0){
			//console.log(details.frameId + " " + details.url);
			guidList = [];
			chrome.browserAction.setBadgeText({text: ""});
		}
	}
);

//check all requests; if it is calling a flite ad, grab the guid and add it to the list
chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		//console.log(info.url);
		guidLoc = info.url.search('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
		theGuid = info.url.substring(guidLoc, guidLoc+36);
		if (guidList.indexOf(theGuid) === -1  && theGuid.search('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}') === 0) {
			guidList.push(theGuid);
		}
		chrome.browserAction.setBadgeText({text: guidList.length.toString()});
		//console.log(guidList);
	},
	//filters:
	{
		urls: ["https://r.flite.com/syndication/*", "http://r.flite.com/syndication/*"]
	}
);

chrome.browserAction.onClicked.addListener(
	function(tab){
		for (i = 0; i < guidList.length; i++){
			newURL = "http://console.flite.com/i/"+guidList[i];
			chrome.tabs.create({url: newURL, index: tab.index + i + 1});
		}
	}
);