// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var App = angular.module('starter', ['ionic','ionic.service.core', 'ngCordova', 'ionic.service.analytics'])

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


App.controller("ScannerController", function($scope, $cordovaBarcodeScanner, $ionicPlatform, $cordovaSQLite){

  $scope.scans = [];
  
  //All ngCordova plugins need to be inside of this
  $ionicPlatform.ready(function(){

    //Open connection to DB
    var db = $cordovaSQLite.openDB({ name:"scans.db", location: 'default'});

    //Update list of scans with all that is inside of Scans_table
    db.executeSql(
      "SELECT * FROM Scans_table",
      [],
      function(result){
        console.log("SUCCESS querying Scans_table");
        console.log(result);

        //Empty scans array
        $scope.scans = [];

        //Add all items ro scans array
        for(var x=0 ; x < result.rows.length ; x++){
          var queryRes = result.rows.item(x);
          $scope.scans.push({
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
        console.log("ERROR querying Scans_table: ");
        console.log(error);
      }
    );

    $scope.insertScan = function(scanObj) {
      db.executeSql(
        "INSERT INTO Scans_table (text, format, dateTaken, imgSource) VALUES (?,?,?,?)",
        [scanObj.text, scanObj.format, new Date(), scanObj.image.source],
        function(result){
          console.log("all good");
          console.log(result);
        },
        function(error){
          console.log("error inserting values");
          console.log(error)
        }
      );
    }

    //Do initial DB connection and insert a thing
    //The 3 functions are: db transactions, error callback, success callback
    db.executeSql(
      "CREATE TABLE IF NOT EXISTS Scans_table (text, format, dateTaken, imgSource)", [],
      function(result){
        
      },
      function(error){
        console.log("ERROR creating Scans_table");
        console.log(error)  
      }
    );


    $scope.scanBarcode = function(){

      //Launch the Scanner
      $cordovaBarcodeScanner
        .scan()
        .then(
          function(barcodeData){
            //Barcode scan worked

            if(!barcodeData.cancelled){

              var newScan = {
                text: barcodeData.text,
                format: barcodeData.format,
                dateTaken: new Date(),
                image: {
                  source: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURI(barcodeData.text)
                }
              }
              //scan not cancelled
              $scope.scans.push(newScan);
              $scope.insertScan(newScan);
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
