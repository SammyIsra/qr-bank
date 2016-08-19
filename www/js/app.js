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
    });
  
  $urlRouterProvider.otherwise('/app/list');

})

.controller('ListController', function($scope, $ionicPlatform, $cordovaSQLite){

  $scope.scans = [];

  $ionicPlatform.ready(function(){

    var db = $cordovaSQLite.openDB({ name:'scans.db', location: 'default'});

    //Do initial DB connection and insert a thing
    //The 3 functions are: db transactions, error callback, success callback
    db.executeSql(
      "CREATE TABLE IF NOT EXISTS Scans_table (id PRIMARY KEY, name, comment, text, format, dateTaken, imgSource)", [],
      function(result){
        console.log("SUCCESS creating Scans_table");
        console.log(result);
      },
      function(error){
        console.log("ERROR creating Scans_table");
        console.log(error);  
      }
    );

    //This runs every time the page is in view, to refresh the scans
    $scope.$on('$ionicView.enter', function(e) {
      
      db.executeSql(
        "SELECT * FROM Scans_table",
        [],
        function(result){
        //On successfull call
          console.log("SUCCESS querying Scans_table");
          console.log(result);

          //Empty the scans array
          $scope.scans = [];

          //Add all query results to scans array
          for(var x=0 ; x < result.rows.length ; x++){
            var queryRes = result.rows.item(x);
            $scope.scans.push({
              id: queryRes.id,
              name: queryRes.name,
              comment: queryRes.comment,
              text: queryRes.text,
              format: queryRes.format,
              dateTaken: queryRes.dateTaken,
              image: {
                source: queryRes.imgSource
              }
            });
          }
        },
        function(error){
        //On failed call
          console.log("ERROR querying Scans_table: ");
          console.log(error);
        }
      );
    });
  });
})

.controller("ScannerController", function($scope, $cordovaBarcodeScanner, $ionicPlatform, $cordovaSQLite){
  
  //All ngCordova plugins need to be inside of this
  $ionicPlatform.ready(function(){

    //Open connection to DB
    var db = $cordovaSQLite.openDB({ name:"scans.db", location: 'default'});

    //Insert a scan to the DB, after being scanned
    function insertScan(scanObj) {
      console.log(scanObj);
      db.executeSql(
        "INSERT INTO Scans_table (name, comment, text, format, dateTaken, imgSource) VALUES (?,?,?,?,?,?)",
        [scanObj.name, scanObj.comment, scanObj.text, scanObj.format, scanObj.dateTaken, scanObj.image.source],
        function(result){
          console.log("SUCCESS inserting scan to DB");
          console.log(result);
        },
        function(error){
          console.log("ERROR inserting scan to DB");
          console.log(error)
        }
      );
    }

    //Do initial DB connection and insert a thing
    //The 3 functions are: db transactions, error callback, success callback
    db.executeSql(
      "CREATE TABLE IF NOT EXISTS Scans_table (id PRIMARY KEY, name, comment, text, format, dateTaken, imgSource)", [],
      function(result){
        console.log("SUCCESS creating Scans_table");
        console.log(result);
      },
      function(error){
        console.log("ERROR creating Scans_table");
        console.log(error);  
      }
    );

    $scope.saveCode = function(){
      insertScan(Object.assign($scope.newScanNotes, $scope.newScan));
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

            console.log("SUCESS scanning barcode");
            console.log(barcodeData);

            if(!barcodeData.cancelled){

              $scope.newScan = {
                text: barcodeData.text,
                format: barcodeData.format,
                dateTaken: new Date(),
                image: {
                  source: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURI(barcodeData.text)
                }
              }
            }
            //if scan was cancelled, it does nothing

        },
          function(error){
            //Barcode did not work
            console.log("ERROR Barcode scan did not work");
            console.log(error);
        });
      }
  });
});
