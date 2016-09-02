// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ngCordova'])

.run(function($ionicPlatform, $ionicAnalytics) {

  $ionicPlatform.ready(function() {

    //Register the app with Ionic analytics
    $ionicAnalytics.register();

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){

  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MenuController'
    })

    .state('app.list', {
      url: '/list',
      views: {
        'menuContent': {
          templateUrl: 'templates/list.html',
          controller: 'ListController'
        }
      }
    })

    .state('app.newscan', {
      url: '/newScan',
      views: {
        'menuContent': {
          templateUrl: 'templates/newScan.html',
          controller: 'ScannerController'
        }
      }
    })
    
    .state('app.detail', {
      url: '/detail',
      views: {
        'menuContent': {
          templateUrl: 'templates/detail.html',
          controller: 'DetailController'
        }
      }
    });
  
  $urlRouterProvider.otherwise('/app/list');

});

  $scope.scans = [];

  $ionicPlatform.ready(function(){

    var db = $cordovaSQLite.openDB({ name:'scans.db', location: 'default'});

    //Do initial DB connection
    createScansTable(db);

    $scope.$on("$ionicView.loaded", function(event, data){
      
      //Handle event
      notice(data.stateParams, "IONIC VIEW LOADED");
      //Update scans list in $scope
      updateScansList(db, $scope);
    });


    //This runs every time the page is in view, to refresh the scans (runs when view is in focus)
    $scope.$on('$ionicView.enter', function(event, data) {
      
      //Handle event
      notice(data.stateParams, "(LIST) IONIC VIEW ENTERED");
      //Update scans list in $scope
      updateScansList(db, $scope);
    }