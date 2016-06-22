//options control page
//make lists, check days of the week for each website

//STORAGE things
//sequences  array of different lists in form hopefully name, websites
//           sequences = [[name, [website1, website2]], [name2, [w1,w2,w3]]]
//                   website = {title:"name", url: "whatever", days: "smtwhfa"}

var app = angular.module('optionsPageApp', []);
app.controller('optionsPageController', function($scope){

    chrome.storage.local.get({
	sequences: []
    }, function(items) {
	$scope.sequences = items.sequences;
	$scope.currentSequence = $scope.sequences[0];
	$scope.currentSequenceWebsites = $scope.copyArray($scope.currentSequence[0][1]);
	$scope.newWebsiteS = '';
	$scope.newWebsiteM = '';
	$scope.newWebsiteT = '';
	$scope.newWebsiteW = '';
	$scope.newWebsiteH = '';
	$scope.newWebsiteF = '';
	$scope.newWebsiteA = '';
	$scope.$apply();
    });

    //change currentSequenceWebsites when currentSequence changes
    $scope.$watch('currentSequence', function (newValue, oldValue, $scope) {
	if (newValue) {
	    $scope.currentSequenceWebsites = $scope.copyArray(newValue[1]);
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
	    if ($scope.sequences[i][0] == $scope.newSequenceName){
		return; //display error message
	    }
	}
	var newSequence = [$scope.newSequenceName, []];
	$scope.sequences.push(newSequence);
	$scope.currentSequence = newSequence;
	$scope.newSequenceName = '';
	chrome.storage.local.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //remove the current sequence
    $scope.removeCurrentSequence = function() {
	var index = $scope.sequences.indexOf($scope.currentSequence);
	var reallyRemove = confirm("Are you sure you want to remove the sequence " + $scope.currentSequence[0] + "?");
	if (reallyRemove){
	    $scope.sequences.splice(index, 1);
	    if (index < $scope.sequences.length){
		$scope.currentSequence = $scope.sequences[index];
	    }
	    else{
		$scope.currentSequence = $scope.sequences[index-1];
	    }
	    chrome.storage.local.set({
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
	if (isNaN(index) || index-1 < 0 || index-1 >= $scope.currentSequence[1].length){
	    $scope.currentSequence[1].push(newWebsite);
	}
	else{
	    $scope.currentSequence[1].splice(index-1, 0, newWebsite);
	}
	$scope.currentSequenceWebsites = $scope.copyArray($scope.currentSequence[1]);
	$scope.newWebsiteIndex = $scope.currentSequenceWebsites.length + 1;
	chrome.storage.local.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //save changes made to the website
    $scope.saveWebsiteChanges = function(index,title,url,s,m,t,w,h,f,a) {
	$scope.currentSequence[1][index].title = title;
	$scope.currentSequence[1][index].url = url;
	$scope.currentSequence[1][index].days = s + m + t + w + h + f + a;
	$scope.currentSequence[1][index].S = s;
	$scope.currentSequence[1][index].M = m;
	$scope.currentSequence[1][index].T = t;
	$scope.currentSequence[1][index].W = w;
	$scope.currentSequence[1][index].H = h;
	$scope.currentSequence[1][index].F = f;
	$scope.currentSequence[1][index].A = a;
	chrome.storage.local.set({
	    sequences: $scope.sequences
	}, function(){});
    }

    //remove the website at index from the sequence
    $scope.removeWebsite = function(index) {
	$scope.currentSequence[1].splice(index, 1);
	$scope.currentSequenceWebsites = $scope.copyArray($scope.currentSequence[1]);
	chrome.storage.local.set({
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

});
