/* Controller for the list of scans */
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ngCordova'])
.controller('MenuController', ['$scope', '$ionicPlatform', '$state', '$stateParams'
function($scope, $ionicPlatform, $state, $stateParams){

  $scope.goToList = function(){
    $state.go('app.list');
  }

  $scope.goToNewScan = function(){
    $state.go('app.newscan');
  }

  $scope.goToDetail = function(){
    $state.go('app.detail', {scanId: scanId});
  }

}]);