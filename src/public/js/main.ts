/// <reference path="../../DefinitelyTyped/angular-1.0.d.ts"/>
import Numer0n = require('./numer0n/numer0n');

var app = angular.module('app', ['ngRoute']);
app.config(['$routeProvider',
    ($routeProvider: ng.IRouteProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'html/index.html', controller: 'IndexController'
            }).otherwise({
                templateUrl: 'html/404.html'
            });
    }
]);
app.controller('IndexController',
    ['$scope', ($scope: any) => {
        var numer0n = new Numer0n();
        $scope.playerFirst = true;
        $scope.aiNum = numer0n.getRandomNumber().toString();
        $scope.start = (playerNum: string, playerFirst: boolean) => {
            clearAlerts($scope);
            try {
                numer0n.start(playerNum, playerFirst);
            } catch (e) {
                $scope['danger'] = e.message;
            }
        };
    }]);

angular.bootstrap(<any>document, ['app']);

function clearAlerts($scope: any) {
    $scope.danger = '';
}