//Sequence Choosing

//let a person choose the sequence they would like to go through

var app = angular.module('sequenceChoosingApp', []);
app.controller('sequenceChoosingController', function($scope){

    chrome.storage.local.get({
	sequences: [],
    theme: ""
    }, function(items){
	$scope.sequences = items.sequences;
    $scope.theme = items.theme;
	$scope.$apply();
    });

    $scope.startSequence = function(sequence) {
	chrome.runtime.sendMessage({websites: sequence[1]},
				   function(response){});
    }

    $scope.gotoOptions = function() {
	chrome.tabs.query({active: true, currentWindow: true},
			  function(tabArray){
			      var tab = tabArray[0];
			      chrome.tabs.update(tab.id, {url: "options.html"},
						 function(){});
			  })
    }

});
