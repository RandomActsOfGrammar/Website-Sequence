//background page

//list of active tabs and their sequences and indices in object form
//{tabid: int, websites: array of websites, index: int}
var activetabs = [];


//add a tab to the list of active tabs
function addTab(tab, websiteList){
    var tabObj = {tabid: tab.id, websites: websiteList, index: 0};
    activetabs.push(tabObj);
    return tabObj;
}


//find the specified tab's thing in the list if it exists
function findTab(tabid){
    var i = 0;
    while (i < activetabs.length){
	if (activetabs[i].tabid == tabid){
	    return activetabs[i];
	}
	i++;
    }
    return null;
}


//remove the tab with the given ID from the active list
function removeTab(tabID){
    var i = 0;
    var found = false;
    while (!found && i < activetabs.length){
	if (activetabs[i].tabid == tabID){
	    found = true;
	}
	else{
	    i++;
	}
    }
    activetabs.splice(i, 1);
}


//go to the next website
function nextWebsite(tabObj){
    chrome.tabs.query({active: true, currentWindow: true},
	function(tabArray){
	    var tab = tabArray[0];
	    var day = new Date(Date.now()).getDay();
	    switch(day){
	      case 0:
		day = 's';
		break;
	      case 1:
		day = 'm';
		break;
	      case 2:
		day = 't';
		break;
	      case 3:
		day = 'w';
		break;
	      case 4:
		day = 'h';
		break;
	      case 5:
		day = 'f';
		break;
	      case 6:
		day = 'a';
		break;
	    }
	    var nextwebsite = tabObj.websites[tabObj.index];
	    var found = false;
	    while (!found && tabObj.index < tabObj.websites.length){
		var i = 0;
		while (i < nextwebsite.days.length && !found){
		    if (nextwebsite.days[i] == day){
			found = true;
		    }
		    i++;
		}
		if (!found){
		    tabObj.index++;
		    nextwebsite = tabObj.websites[tabObj.index];
		}
	    }
	    if (found){
		var newurl = "http://"+nextwebsite.url;
		tabObj.index++;
		chrome.tabs.update(tab.id, {url: newurl},
			function(){});
	    }
	    if (tabObj.index >= tabObj.websites.length){ //sequence done
		removeTab(tab.id);
		if (!found){
		    actionClicked(); //do something else now that it is done
		}
	    }
	});
}


//what to do when the browser action is clicked
function actionClicked(){
    chrome.tabs.query({active: true, currentWindow: true},
	function(tabArray){
	    var tab = tabArray[0];
	    var tabObj = findTab(tab.id);
	    if (tabObj != null){
		nextWebsite(tabObj);
	    }
	    else{
		//open page in new tab to choose sequence
		//chrome.tabs.create({ url: "sequenceChoosing.html" });
		//open page in same tab to choose sequences
		chrome.tabs.update(tab.id, {url: "sequenceChoosing.html"},
			function(){});
	    }
	});
}

//bind browser action
chrome.browserAction.onClicked.addListener(
    function(request, sender, sendResponse){
	actionClicked();
    });


//listen for message indicating a new sequence is made
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
	var webs = request.websites;
	chrome.tabs.query({active: true, currentWindow: true},
	function(tabArray){
	    var tab = tabArray[0];
	    var tabObj = addTab(tab, webs);
	    nextWebsite(tabObj);
	});
    });
