//options control page
//make lists, check days of the week for each website

//STORAGE things
//sequences  array of different lists in form hopefully name, websites
//           sequences = [{name: name, websites: [website1, website 2]}, {name: name2, websites: [w1,w2,w3]}]
//                            old version was [[name, [website1, website2]], [name2, [w1,w2,w3]]]
//                   website = {title:"name", url: "whatever", days: "smtwhfa"}

var app = angular.module('optionsPageApp', []);
app.controller('optionsPageController', function($scope){

    chrome.storage.sync.get({
	sequences: [],
        theme: ""
    }, function(items) {
	$scope.theme = items.theme;

	$scope.sequences = items.sequences;
	$scope.currentSequence = $scope.sequences[0];
	$scope.currentSequenceWebsites = $scope.copyArray($scope.currentSequence.websites);
	$scope.newWebsiteS = '';
	$scope.newWebsiteM = '';
	$scope.newWebsiteT = '';
	$scope.newWebsiteW = '';
	$scope.newWebsiteH = '';
	$scope.newWebsiteF = '';
	$scope.newWebsiteA = '';
	$scope.newSequenceError = false;

	$scope.$apply();
    });

    //change currentSequenceWebsites when currentSequence changes
    $scope.$watch('currentSequence', function (newValue, oldValue, $scope) {
	if (newValue) {
	    $scope.currentSequenceWebsites = $scope.copyArray(newValue.websites);
	}
    });

    //change default newWebsiteIndex when currentSequenceWebsites changes
    $scope.$watch('currentSequenceWebsites', function (newValue, oldValue, $scope) {
	if (newValue) {
	    $scope.newWebsiteIndex = newValue.length + 1;
	}
    });

    //add a new sequence to the lists
    $scope.addSequence = function(website) {
	if (!$scope.newSequenceName) {
	    return;
	}
	for (var i = 0; i < $scope.sequences.length; i++){
	    if ($scope.sequences[i].name == $scope.newSequenceName){
		$scope.newSequenceError = true;
		return; //display error message
	    }
	}
	$scope.newSequenceError = false;
	var newSequence = {name: $scope.newSequenceName, websites: []};
	$scope.sequences.push(newSequence);
	$scope.currentSequence = newSequence;
	$scope.newSequenceName = '';
	chrome.storage.sync.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //remove the current sequence
    $scope.removeCurrentSequence = function() {
	var index = $scope.findCurrentSequenceIndex();
	var reallyRemove = confirm("Are you sure you want to remove the sequence " + $scope.currentSequence.name + "?");
	if (reallyRemove){
	    $scope.sequences.splice(index, 1);
	    if (index < $scope.sequences.length){
		$scope.currentSequence = $scope.sequences[index];
	    }
	    else{
		$scope.currentSequence = $scope.sequences[index-1];
	    }
	    chrome.storage.sync.set({
	        sequences: $scope.sequences
	    }, function(){});
	}
    }

    //add a new website to the sequence
    $scope.addNewWebsite = function() {
	if (!$scope.newWebsiteUrl){
	    return;
	}
	var newWebsite = {};
	newWebsite.title = $scope.newWebsiteTitle;
	$scope.newWebsiteTitle = '';
	newWebsite.url = $scope.newWebsiteUrl;
	$scope.newWebsiteUrl = ''
	newWebsite.days = $scope.newWebsiteS + $scope.newWebsiteM + $scope.newWebsiteT + $scope.newWebsiteW +
	    $scope.newWebsiteH + $scope.newWebsiteF + $scope.newWebsiteA;
	newWebsite.S = $scope.newWebsiteS;
	newWebsite.M = $scope.newWebsiteM;
	newWebsite.T = $scope.newWebsiteT;
	newWebsite.W = $scope.newWebsiteW;
	newWebsite.H = $scope.newWebsiteH;
	newWebsite.F = $scope.newWebsiteF;
	newWebsite.A = $scope.newWebsiteA;
	$scope.newWebsiteS = '';
	$scope.newWebsiteM = '';
	$scope.newWebsiteT = '';
	$scope.newWebsiteW = '';
	$scope.newWebsiteH = '';
	$scope.newWebsiteF = '';
	$scope.newWebsiteA = '';
	var index = parseInt($scope.newWebsiteIndex);
	if (isNaN(index) || index-1 < 0 || index-1 >= $scope.currentSequence.websites.length){
	    $scope.currentSequence.websites.push(newWebsite);
	}
	else{
	    $scope.currentSequence.websites.splice(index-1, 0, newWebsite);
	}
	$scope.currentSequenceWebsites = $scope.copyArray($scope.currentSequence.websites);
	$scope.newWebsiteIndex = $scope.currentSequenceWebsites.length + 1;
	$scope.sequences[$scope.findCurrentSequenceIndex()] = $scope.currentSequence;
	chrome.storage.sync.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //save changes made to the website
    $scope.saveWebsiteChanges = function(index,title,url,s,m,t,w,h,f,a) {
	$scope.currentSequence.websites[index].title = title;
	$scope.currentSequence.websites[index].url = url;
	$scope.currentSequence.websites[index].days = s + m + t + w + h + f + a;
	$scope.currentSequence.websites[index].S = s;
	$scope.currentSequence.websites[index].M = m;
	$scope.currentSequence.websites[index].T = t;
	$scope.currentSequence.websites[index].W = w;
	$scope.currentSequence.websites[index].H = h;
	$scope.currentSequence.websites[index].F = f;
	$scope.currentSequence.websites[index].A = a;
	$scope.sequences[$scope.findCurrentSequenceIndex()] = $scope.currentSequence;
	chrome.storage.sync.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //remove the website at index from the sequence
    $scope.removeWebsite = function(index) {
	$scope.currentSequence.websites.splice(index, 1);
	$scope.currentSequenceWebsites = $scope.copyArray($scope.currentSequence.websites);
	$scope.sequences[$scope.findCurrentSequenceIndex()] = $scope.currentSequence;
	chrome.storage.sync.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //make a copy of the given array of objects
    $scope.copyArray = function(oldArray) {
	var newArray = [];
	for (var i = 0; i < oldArray.length; i++){
	    newArray[i] = JSON.parse(JSON.stringify(oldArray[i]));
	}
	return newArray;
    }

    //find the index of the current sequence in the list of sequences
    $scope.findCurrentSequenceIndex = function() {
	for (var i = 0; i < $scope.sequences.length; i++){
	    if ($scope.sequences[i].name == $scope.currentSequence.name) {
		return i;
	    }
	}
	return -1;
    }

    //save the theme
    $scope.saveTheme = function() {
        chrome.storage.sync.set({
            theme: $scope.theme
        });
    }

});
