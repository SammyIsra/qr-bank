// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ngCordova'])

.run(function($ionicPlatform, $ionicAnalytics, $cordovaSQLite, $rootScope) {

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

    /*************************************
     *      SETUP FOR THE SCANS TABLE    *
     *************************************/

    $rootScope.TableInterface = {};

    //DB object
    $rootScope.TableInterface.db = $cordovaSQLite.openDB({ name:'scans.db', location: 'default'});

    //Create the scans table (runs once, hopefully) 
    $rootScope.TableInterface.createScansTable = function(){

      $rootScope.TableInterface.db.executeSql(
        "CREATE TABLE IF NOT EXISTS Scans_table (" +
          "rowid      INTEGER PRIMARY KEY ," +
          "name       TEXT                NOT NULL," +
          "comment    TEXT, " +
          "text       TEXT                NOT NULL, " +
          "format     TEXT                NOT NULL, " +
          "dateTaken  TEXT                NOT NULL, " +
          "imgSource  TEXT                NOT NULL)", 
          [],
        function(result){
          $rootScope.util.notice(result, "SUCCESS creating Scans_table");
        },
        function(error){
          $rootScope.util.notice(error, "ERROR creating Scans_table");
        }
      );
    }

    //Insert a scan to the DB, runs after a new scan
    $rootScope.TableInterface.insertScan = function(ScanObj){

      $rootScope.TableInterface.db.executeSql(
      "INSERT INTO Scans_table " +
      "(name, comment, text, format, dateTaken, imgSource) " + 
      "VALUES (?,?,?,?,?,?)",
      [scanObj.name, scanObj.comment, scanObj.text, scanObj.format, scanObj.dateTaken, scanObj.image.source],
      function(result){
          $rootScope.util.notice(result, "SUCCESS inserting scan to DB");
      },
      function(error){
          $rootScope.util.notice(error, "ERROR inserting scan to DB");
      });
    }


    //Update scans list. Only used on the ListController
    $rootScope.TableInterface.updateScanList = function (scope){

      $rootScope.TableInterface.db.executeSql(
        "SELECT * FROM Scans_table",
        [],
        function(result){
        //On successfull call
          $rootScope.notice(ready, "SUCCESS querying Scans_table");

          //Empty the scans array
          scope.scans = [];

          //Add all query results to scans array
          for(var x=0 ; x < result.rows.length ; x++){
            var queryRes = result.rows.item(x);
            notice(queryRes,"QUERY RESULT is");
            scope.scans.push({
              id: queryRes.id,
              name: queryRes.name,
              comment: queryRes.comment,
              text: queryRes.text,
              format: queryRes.format,
              dateTaken: new Date(queryRes.dateTaken),
              image: {
                source: queryRes.imgSource
              }
            });
          }
        },
        function(error){
        //On failed call
          $rootScope.util.notice(error, "ERROR querying Scans_table: ");
        }
      );

      $rootScope.util.notice(null, "QUERY FINISHED");
    }

    //Send stuff to notification
    $rootScope.util = {};
    $rootScope.util.notice = function (Obj, note){
      console.log(note);
      console.log(Obj);
    }

    //Run the functions to setup the db 
    $rootScope.TableInterface.createScansTable();

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