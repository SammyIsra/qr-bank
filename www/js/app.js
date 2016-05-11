// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var App = angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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


App.controller("ScannerController", function($scope, $cordovaBarcodeScanner, $ionicPlatform){

  $scope.scans = [{
    text: "Example Text",
    format: "Example Format",
    dateTaken: new Date(),
    image: {
      source: 'http://placehold.it/300x300'
    }
  }, {
    text: "Example Text",
    format: "Example Format",
    dateTaken: new Date(),
    image: {
      source: 'http://placehold.it/300x300'
    }
  }];

  $ionicPlatform.ready(function(){

    $scope.scanBarcode = function(){

      //Launch the Scanner
      $cordovaBarcodeScanner
        .scan().
        then(
          function(barcodeData){
            //Barcode scan worked

            //scan not cancelled
            if(!barcodeData.cancelled){
              $scope.scans.push({
                text: barcodeData.text,
                format: barcodeData.format,
                dateTaken: new Date(),
                image: {
                  source: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+barcodeData.text
                }
              });
            }
            //if scan was cancelled, it does nothing

        },
          function(error){
            //Barcode did not work
            alert("It did not work!");
        });
      }
  });
});
