/* Controller for the list of scans */
angular.module('starter')
.controller('ListController', ['$scope', '$ionicPlatform', '$cordovaSQLite', '$state', 
function($scope, $ionicPlatform, $cordovaSQLite, $state){

  $scope.scans = [];

  $scope.$on("$ionicView.loaded", function(event, data){
    //Handle event
    $rootScope.util.notice(data.stateParams, "IONIC VIEW LOADED");
    //Update scans list in $scope
    $rootScope.util.TableInterface.updateScansList($scope);
  });

  //This runs every time the page is in view, to refresh the scans (runs when view is in focus)
  $scope.$on('$ionicView.enter', function(event, data) {
    
    //Tell console
    $rootScope.util.notice(data.stateParams, "(LIST) IONIC VIEW ENTERED");

    //Update scans list in $scope
    $rootScope.util.TableInterface.updateScansList($scope);
  });

  $scope.goToDetail = function(){
    $state.go('app.detail', {scanId: scanId});
  }

}]);
