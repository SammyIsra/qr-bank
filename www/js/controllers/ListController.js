/* Controller for the list of scans */
angular.module('starter')
.controller('ListController', ['$scope', '$ionicPlatform', '$cordovaSQLite', '$state', 
function($scope, $ionicPlatform, $cordovaSQLite, $state){

  $scope.scans = [];

  $ionicPlatform.ready(function(){

    var db = $cordovaSQLite.openDB({ name:'scans.db', location: 'default'});

    //Do initial DB connection
    createScansTable(db);

    $scope.$on("$ionicView.loaded", function(event, data){
      
      //Handle event
      $rootScope.util.notice(data.stateParams, "IONIC VIEW LOADED");
      //Update scans list in $scope
      updateScansList(db, $scope);
    });


    //This runs every time the page is in view, to refresh the scans (runs when view is in focus)
    $scope.$on('$ionicView.enter', function(event, data) {
      
      //Handle event
      $rootScope.util.notice(data.stateParams, "(LIST) IONIC VIEW ENTERED");
      //Update scans list in $scope
      updateScansList(db, $scope);
    });
  });

  $scope.goToDetail = function(){
    $state.go('app.detail', {scanId: scanId});
  }

}]);
