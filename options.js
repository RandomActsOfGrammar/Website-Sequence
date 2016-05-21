//options control page
//make lists, check days of the week for each website


//HTML things
//"newname"  entry field for new sequence name
//"newlist"  button to createa new list
//"sequencechosen"  dropdown for different sequences
//"remove"  button to remove the chosen sequence
//"newtitle" text input for new website name
//"newurl"  text input for new website url
//"days"  checkbuttons for days of the week
//"add"  add new website button
//"webindex"  text input for location to add new website at

//STORAGE things
//sequences  array of different lists in form hopefully name, websites
//           sequences = [[name, [website1, website2]], [name2, [w1,w2,w3]]]
//                   website = {title:"name", url: "whatever", days: "smtwhfa"}


//remove everything from inside the given division
function clearbox(elementID){
    document.getElementById(elementID).innerHTML = "";
}


//find the sequence with the given name; returns [sequence, index]
function findSequence(name, seqs){ //seqs is list of sequences from memory
    var i = 0;
    var found = false;
    var seq = [];
    while (i < seqs.length && !found){
	if (seqs[i][0] == name){
	    found = true;
	    seq = seqs[i];
	}
	i = i + 1;
    }
    var retvalue = [seq, i-1];
    return retvalue;
}


//remove a website from the currently displayed sequence
function removeWebsite(nameURL){
    chrome.storage.local.get({
	sequences: []
    }, function(items){
	var parent = document.getElementById("websites");
	var child = document.getElementById(nameURL + "div");
	parent.removeChild(child);
	var seqs = items.sequences;
	var sequencename = document.getElementById("sequencechosen").value;
	var seqind = findSequence(sequencename, seqs);
	var webslist = seqind[0][1];
	var i = 0;
	while (i < webslist.length){
	    if (webslist[i].url == nameURL){
		webslist.splice(i, 1);
	    }
	    i++;
	}
	chrome.storage.local.set({
	    sequences: seqs
	}, function() {});
    });
}


//update the stored days and url for the named website
function updateDays(nameURL){
    chrome.storage.local.get({
	sequences: []
    }, function(items){
	var seqs = items.sequences;
	var sequencename = document.getElementById("sequencechosen").value;
	var seqind = findSequence(sequencename, seqs);
	var webslist = seqind[0][1];
	var dayschecks = document.getElementsByName(nameURL + "days");
	var webdays = "";
	for (var j = 0; j < 7; j++){
	    if (dayschecks[j].checked == true){
		webdays = webdays + dayschecks[j].value;
	    }
	}
	var newurl = document.getElementById(nameURL + "url").value;
	var newtitle = document.getElementById(nameURL + "title").value;
	var i = 0;
	while (i < webslist.length){
	    if (webslist[i].url == nameURL){
		webslist[i].days = webdays;
		webslist[i].url = newurl;
		webslist[i].title = newtitle;
	    }
	    i++;
	}
	chrome.storage.local.set({
	    sequences: seqs
	}, function() {});
    });
}


//write out each website with options
//each website goes in its own division named "<website title>div"
function displayWebsite(webObj, nextAfter){
    var websitediv = document.getElementById("websites");
    var division = document.createElement('div');
    division.id = webObj.url + 'div';
    if (nextAfter == null){
	websitediv.appendChild(division);
    }
    else{
	var nextAfter = document.getElementById(nextAfter);
	websitediv.insertBefore(division, nextAfter);
    }
    var titlename = webObj.url + "title";
    division.innerHTML += "<input type='text' name='"+titlename+"' id='"+
	titlename+"' value=\""+webObj.title+"\" style='font-size:12px'>";
    division.innerHTML += "&nbsp;&nbsp;";
    var urlname = webObj.url + "url";
    division.innerHTML += "<input type='text' name='"+urlname+"' id='"+urlname+
	"' value='"+webObj.url+"' style='font-size:12px' size='35'>";
    division.innerHTML += '&nbsp;&nbsp;&nbsp;';
    //create checkboxes for days of the week
    var days = 'smtwhfa';
    var labelnames = 'SMTWTFS';
    var currentdays = webObj.days;
    var daysind = 0;
    for (var i = 0; i < 7; i++){
	if (daysind < currentdays.length && days[i] == currentdays[daysind]){
	    division.innerHTML += "<input type='checkbox' name='" + 
		webObj.url + "days' value='" + days[i]+"' checked>";
	    daysind++;
	}
	else{
	    division.innerHTML += "<input type='checkbox' name='" + 
		webObj.url + "days' value='" + days[i] + "'>";
	}
	var label = document.createElement('label');
	var text = document.createTextNode(labelnames[i]);
	label.appendChild(text);
	division.appendChild(label);
    }
    division.innerHTML += '&nbsp;&nbsp;&nbsp;';
    //make save button for website options
    var savebutton = document.createElement('button');
    var savetext = document.createTextNode('Save');
    savebutton.appendChild(savetext);
    division.appendChild(savebutton);
    savebutton.addEventListener('click',function(){updateDays(webObj.url)});
    //make remove button for website
    var removebutton = document.createElement('button');
    var text = document.createTextNode('Remove');
    removebutton.id = webObj.title + 'remove';
    removebutton.appendChild(text);
    division.appendChild(removebutton);
    removebutton.addEventListener('click',
				  function(){removeWebsite(webObj.url)});
    division.appendChild(document.createElement("hr"));
}


//write out all the websites in the website list
function updateWebsiteList(){
    chrome.storage.local.get({
	sequences: []
    }, function(items){
	clearbox("websites");
	var name = document.getElementById("sequencechosen").value;
	var seqs = items.sequences;
	var seqind = findSequence(name, seqs);
	var webs = seqind[0][1];
	for (var i = 0; i < webs.length; i++){
	    displayWebsite(webs[i], null);
	}
    });
}


//create a new sequence
function newSequence() {
    chrome.storage.local.get({
	sequences: []
    }, function(items) {
	var name = document.getElementById("newname").value;
	document.getElementById("newname").value = "";
	var seq = items.sequences;
	var newlist = [name, []];
	seq.push(newlist);
	var option = document.createElement('option');
	option.text = name;
	option.value = name;
	var dropdown = document.getElementById("sequencechosen");
	dropdown.add(option, 0);
	dropdown.value = name;
	clearbox("websites");
	chrome.storage.local.set({
	    sequences: seq
	}, function(){});
    });
}


//add a new website to the chosen sequence
function newWebsite() {
    var webtitle = document.getElementById("newtitle").value;
    document.getElementById("newtitle").value = "";
    var weburl = document.getElementById("newurl").value;
    document.getElementById("newurl").value = "";
    var dayschecks = document.getElementsByName("days");
    var webdays = "";
    for (var i = 0; i < dayschecks.length; i++){
	if (dayschecks[i].checked == true){
	    webdays = webdays + dayschecks[i].value;
	    dayschecks[i].checked = false;
	}
    }
    var webobj = {title: webtitle, url: weburl, days: webdays};
    chrome.storage.local.get({
	sequences: []
    }, function(items){
	var seqind = findSequence(document.getElementById("sequencechosen").value, items.sequences);
	var seq = seqind[0];
	var ind = seqind[1];
	var webindex = parseInt(document.getElementById("webindex").value);
	var thingafter = null;
	if (isNaN(webindex) || webindex-1 >= seq[1].length || webindex-1 < 0){
	    seq[1].push(webobj);
	}
	else{
	    seq[1].splice(webindex-1, 0, webobj);
	    thingafter = seq[1][webindex].url + 'div';
	}
	document.getElementById("webindex").value = "";
	displayWebsite(webobj, thingafter);
	var sequences1 = items.sequences;
	sequences1[ind] = seq;
	chrome.storage.local.set({
	    sequences: sequences1
	}, function(){});
    });
}


//remove the sequence currently chosen
function removeSequence(){
    chrome.storage.local.get({
	sequences: []
    }, function(items){
	var name = document.getElementById("sequencechosen").value;
	var reallyRemove = confirm("Are you sure you want to remove the sequence " + name + "?");
	if (reallyRemove){
	    var seqind = findSequence(name, items.sequences);
	    var ind = seqind[1];
	    var sequences1 = items.sequences;
	    sequences1.splice(ind, 1);
	    var select = document.getElementById("sequencechosen");
	    var selectind = 0;
	    var found = false;
	    while (!found && selectind<select.length){
		if (select[selectind].value == name){
		    found = true;
		    selectind--;
		}
		selectind++;
	    }
	    select.remove(selectind); //remove from options
	    updateWebsiteList();
	    chrome.storage.local.set({
		sequences: sequences1
	    }, function(){});
	}
    });
}


//show settings on option page load
function restore_options() {
    chrome.storage.local.get({
	sequences: []
    }, function(items) {
	var sequences = items.sequences;
	var select = document.getElementById("sequencechosen");
	for (var i = 0; i < sequences.length; i++){
	    var option = document.createElement('option');
	    option.text = sequences[i][0];
	    option.value = sequences[i][0];
	    select.add(option, 0);
	}
	updateWebsiteList();
    });
}


//bind restoring options to opening options page
document.addEventListener('DOMContentLoaded', restore_options);

//bind adding new sequence to the button
document.getElementById('newlist').addEventListener('click', newSequence);

//bind adding a website to the button
document.getElementById('add').addEventListener('click',newWebsite);

//bind removing a sequence to the button
document.getElementById('remove').addEventListener('click',removeSequence);

//bind changing sequence selection to updating website list display
document.getElementById('sequencechosen').addEventListener('change',updateWebsiteList);
