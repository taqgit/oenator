'use strict';
angular.module('oenator')
    .controller('FileCtrl', function ($scope, $http, API_URL, $rootScope) {
        $scope.uploadtxt = function () {
            console.log('Sending Txt......................................................');

            var reader = new FileReader();
            reader.readAsText($scope.file, "UTF-8");

            reader.addEventListener("loadend", function (evt) {
                $http.post(API_URL + 'handleTxtFile', {
                    name: $scope.file.name,
                    data: reader.result
                }).success(function () {
                });
            });
        };

        $scope.uploadxml = function () {
            console.log('Sending Xml......................................................');

            var reader = new FileReader();

            reader.readAsText($scope.xmlfile, "UTF-8");

            reader.addEventListener("loadend", function (evt) {
                $http.post(API_URL + 'handleXmlFile', {
                    name: $scope.xmlfile.name,
                    data: reader.result
                }).then(function (res) {
                    console.log('yo xml .......................... ' + res.status);
                    $scope.done = true;
                });
            });
        };

    });

