/* Controller for the list of scans */
angular.module('starter')
.controller('MenuController', ['$scope', '$ionicPlatform', '$state', '$stateParams',
function($scope, $ionicPlatform, $state, $stateParams){

  $scope.goToList = function(){
    $state.go('app.list');
  }

  $scope.goToNewScan = function(){
    $state.go('app.newscan');
  }

}]);