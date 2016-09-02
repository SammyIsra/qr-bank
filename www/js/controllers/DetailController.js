/* Controller for the list of scans */
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ngCordova'])
.controller('DetailController', ['$scope', '$ionicPlatform', '$cordovaSQLite', '$state', '$stateParams', 
function($scope, $ionicPlatform, $cordovaSQLite, $state, $stateParams){

  $scope.scanId = $stateParams.scanId;

  $ionicPlatform.ready(function(){

    var db = $cordovaSQLite.openDB({ name:'scans.db', location: 'default'});

    //Do initial DB connection
    createScansTable(db);

    $scope.$on("$ionicView.loaded", function(event, data){
      
      //Handle event
      notice(data.stateParams, "(DETAIL )IONIC VIEW LOADED");
    });


    //This runs every time the page is in view, to refresh the scans (runs when view is in focus)
    $scope.$on('$ionicView.enter', function(event, data) {
      
      //Handle event
      notice(data.stateParams, "(LIST) IONIC VIEW ENTERED");
      //Update scans list in $scope
      updateScansList(db, $scope);
    });
  });

  $scope.goToDetail = function(){
    $state.go('app.detail', {scanId: scanId});
  }

}]);