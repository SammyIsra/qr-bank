// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var App = angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ngCordova'])

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
      templateUrl: 'templates/menu.html'
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
          templateUrl: 'templates/detail.html'
        }
      }
    });
  
  $urlRouterProvider.otherwise('/app/list');

})

.controller('ListController', function($scope, $ionicPlatform, $cordovaSQLite){

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
    });
  });
})

.controller("ScannerController", function($scope, $cordovaBarcodeScanner, $state, $ionicPlatform, $cordovaSQLite){

  //This runs every time the page is in view, to refresh the scans (runs when view is in focus)
  $scope.$on('$ionicView.enter', function(event, data) {
    //Handle event
    notice(data.stateParams, "(SCANNER) IONIC VIEW ENTERED");
  });
  
  //All ngCordova plugins need to be inside of this
  $ionicPlatform.ready(function(){

    //Open connection to DB
    var db = $cordovaSQLite.openDB({ name:"scans.db", location: 'default'});

    //Insert a scan to the DB, after being scanned
    function insertScan(scanObj) {
      db.executeSql(
        "INSERT INTO Scans_table (name, comment, text, format, dateTaken, imgSource) VALUES (?,?,?,?,?,?)",
        [scanObj.name, scanObj.comment, scanObj.text, scanObj.format, scanObj.dateTaken, scanObj.image.source],
        function(result){
          notice(result, "SUCCESS inserting scan to DB");
        },
        function(error){
          notice(error, "ERROR inserting scan to DB");
        }
      );
    }

    //Do initial DB connection and insert a thing
    //The 3 functions are: db transactions, error callback, success callback
    createScansTable(db);

    $scope.saveCode = function(){
      insertScan(Object.assign($scope.newScanNotes, $scope.newScan));
      $state.go('app.list');
    };

    $scope.newScanNotes = {
      name: "",
      comment: ""
    }

    //Scan barcode, called when a button is pressed on the View
    $scope.scanBarcode = function(){

      //Launch the Scanner
      $cordovaBarcodeScanner
        .scan()
        .then(
          function(barcodeData){
            //Barcode scan worked

            notice(barcodeData, "SUCCESS scanning barcode");

            if(!barcodeData.cancelled){

              $scope.newScan = {
                text: barcodeData.text,
                format: barcodeData.format,
                dateTaken: new Date(),
                image: {
                  source: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURI(barcodeData.text)
                }
              }
            } else {
              notice(barcodeData, "CANCELLED scan");
            }
        },
          function(error){
            //Barcode did not work
            notice(error, "ERROR Barcode scan did not work");
        });
      }
  });
});

function createScansTable(db){

  db.executeSql(
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
      notice(result, "SUCCESS creating Scans_table");
    },
    function(error){
      notice(error, "ERROR creating Scans_table");
    }
  );
};

function updateScansList(db, scope){

  db.executeSql(
    "SELECT * FROM Scans_table",
    [],
    function(result){
    //On successfull call
      notice(ready, "SUCCESS querying Scans_table");

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
      notice(error, "ERROR querying Scans_table: ");
    }
  );
}

function notice (Obj, note){
  console.log(note);
  console.log(Obj);
}