//Script for flite finder
//1.3

var guidList = [];
var guidLoc, theGuid, newURL; 
var guidRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

chrome.browserAction.setBadgeBackgroundColor({color: "#888888"});

//reset guidList on every page load
chrome.webNavigation.onBeforeNavigate.addListener(
	function(details) {
		if (details.frameId === 0){
			//console.log(details.frameId + " " + details.url);
			guidList = [];
			chrome.browserAction.setBadgeText({text: ""});
			//chrome.browserAction.setIcon({path: "icons/flite-finder-icons_inactive.png"}); 
		}
	}
);

//check all requests; if it is calling a flite ad, grab the guid and add it to the list
chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		//console.log(info.url);
		guidLoc = info.url.search(guidRegEx);
		if (guidLoc < 0) {return;}
		theGuid = info.url.substring(guidLoc, guidLoc+36);
		if (guidList.indexOf(theGuid) === -1) {
			guidList.push(theGuid);
			//chrome.browserAction.setIcon({path: "icons/flite-finder-icons_active.png"});
			chrome.browserAction.setBadgeText({text: guidList.length.toString()});
		}
		
		//console.log(guidList);
	},
	//filters:
	{
		urls: ["https://r.flite.com/syndication/*", "http://r.flite.com/syndication/*"]
	}
);

//open the flite ads in new tabs on click of the extension button
chrome.browserAction.onClicked.addListener(
	function(tab){
		for (i = 0; i < guidList.length; i++){
			newURL = "http://console.flite.com/i/"+guidList[i];
			chrome.tabs.create({url: newURL, index: tab.index + i + 1});
		}
	}
);

/* 
//This is for seizure mode below
var r= Math.floor((Math.random() * 256)), g, b, a, cArray;

setInterval(function () {
		r = Math.floor((Math.random() * 256));
		g = Math.floor((Math.random() * 256));
		b = Math.floor((Math.random() * 256));
		//cArray = [r, g, b, a];

		chrome.browserAction.setBadgeBackgroundColor({color: [r, g, b, 255]});
	},
	86400000
);
*/