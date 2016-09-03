/* CONTROLELR FOR THE SCANNER AND NEW PAGE SCANNER */

angular.module('starter')
.controller("ScannerController", ['$scope', '$cordovaBarcodeScanner', '$state', '$ionicPlatform', '$cordovaSQLite', 
function($scope, $cordovaBarcodeScanner, $state, $ionicPlatform, $cordovaSQLite){

  //This runs every time the page is in view, to refresh the scans (runs when view is in focus)
  $scope.$on('$ionicView.enter', function(event, data) {
    //Handle event
    $rootScope.util.notice(data.stateParams, "(SCANNER) IONIC VIEW ENTERED");
  });
  
  //All ngCordova plugins need to be inside of this
  $ionicPlatform.ready(function(){

    //Open connection to DB
    var db = $cordovaSQLite.openDB({ name:"scans.db", location: 'default'});

    //Do initial DB connection and insert a thing
    //The 3 functions are: db transactions, error callback, success callback
    createScansTable(db);

    $scope.saveCode = function(){
      insertScan(db, Object.assign($scope.newScanNotes, $scope.newScan));
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

            $rootScope.util.notice(barcodeData, "SUCCESS scanning barcode");

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
              $rootScope.util.notice(barcodeData, "CANCELLED scan");
            }
        },
          function(error){
            //Barcode did not work
            $rootScope.util.notice(error, "ERROR Barcode scan did not work");
        });
      }
  });
}]);

