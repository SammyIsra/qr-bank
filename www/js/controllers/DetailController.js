/* Controller for the list of scans */
angular.module('starter')
.controller('DetailController', ['$scope', '$ionicPlatform', '$cordovaSQLite', '$state', '$stateParams', 
function($scope, $ionicPlatform, $cordovaSQLite, $state, $stateParams){

  $scope.argScanId = $stateParams.scanId;
  console.log("Got id: " + $scope.argScanId);

  $ionicPlatform.ready(function(){

    var db = $cordovaSQLite.openDB({ name:'scans.db', location: 'default'});

    //Do initial DB connection
    createScansTable(db);

    $scope.$on("$ionicView.loaded", function(event, data){
      
      //Handle event
      $rootScope.util.notice(data.stateParams, "(DETAIL )IONIC VIEW LOADED");
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