//Sequence Choosing

//let a person choose the sequence they would like to go through


//add the sequence to the document
function displaySequence(seq, division){ //seq is [name, [w1, w2, w3]]
    var newdiv = document.createElement('div');
    var titleLabel = document.createElement('label');
    var titleText = document.createTextNode(seq[0]);
    titleLabel.appendChild(titleText);
    newdiv.appendChild(titleLabel);
    newdiv.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
    var chooseButton = document.createElement('button');
    var buttonText = document.createTextNode('Choose');
    chooseButton.appendChild(buttonText);
    chooseButton.addEventListener('click',
	function(){
	    chrome.runtime.sendMessage({websites: seq[1]},
	       function(response){});
	});
    newdiv.appendChild(chooseButton);
    division.appendChild(newdiv);
    division.appendChild(document.createElement('hr'));
}


//display all the sequences in memory
function displaySequences(){
    chrome.storage.local.get({
	sequences: []
    }, function(items){
	var seqs = items.sequences;
	var division = document.getElementById("sequences");
	for (var i = 0; i < seqs.length; i++){
	    displaySequence(seqs[i], division);
	}
    });
}


//open the options page
function openOptions(){
    chrome.tabs.query({active: true, currentWindow: true},
	function(tabArray){
	    var tab = tabArray[0];
	    chrome.tabs.update(tab.id, {url: "options.html"},
			       function(){});
	})
}

//bind displaying sequences to content load
document.addEventListener('DOMContentLoaded', displaySequences);

//bind opening options page to openOptionsButton
document.getElementById('openOptionsButton').addEventListener('click',openOptions);
