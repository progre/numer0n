/// <reference path="../../DefinitelyTyped/angular-1.0.d.ts"/>
/// <reference path="../../DefinitelyTyped/linq.d.ts"/>
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
    ['$scope', '$timeout', ($scope: any, $timeout: ng.ITimeoutService) => {
        var numer0n = new Numer0n();
        $scope.aiNumer = numer0n.getAINumber();
        $scope.start = (playerNumber: string, playerFirst: boolean) => {
            $scope.danger = '';
            try {
                numer0n.start(playerNumber, playerFirst);
            } catch (e) {
                $scope.danger = e.message;
                return;
            }
            $scope.isGameStarted = true;
            mainLoop($timeout, $scope, numer0n);
        };
        $scope.call = () => {
            $scope.danger = '';
            try {
                numer0n.put($scope.lastPlayerAttack);
            } catch (e) {
                $scope.danger = e.message;
                return;
            }
            mainLoop($timeout, $scope, numer0n);
        };
        $scope.reset = () => {
            $scope.wait = false;
            $scope.done = false;
            $scope.isGameStarted = false;
            $scope.info = '';
            $scope.lastPlayerAttack = '';
            $scope.playerMessage = '';
            $scope.lastAIAttack = '';
            $scope.aiMessage = '';
            $scope.playerAttacks = [];
            $scope.aiAttacks = [];
            numer0n = new Numer0n();
            $scope.aiNumer = numer0n.getAINumber();
        };
    }]);

angular.bootstrap(<any>document, ['app']);

function mainLoop($timeout: ng.ITimeoutService, $scope: any, numer0n: Numer0n) {
    $scope.wait = true;
    var sleep = numer0n.next();
    $scope.info = numer0n.info;
    $scope.lastPlayerAttack = numer0n.lastPlayerAttack;
    $scope.playerMessage = numer0n.playerMessage;
    $scope.lastAIAttack = numer0n.lastAIAttack;
    $scope.aiMessage = numer0n.aiMessage;
    $scope.playerAttacks = numer0n.playerAttacks;
    $scope.aiAttacks = numer0n.aiAttacks;
    switch (sleep) {
        case -1:
            $scope.wait = false;
            return;
        case -2:
            $scope.done = true;
            return;
    }
    $timeout(() => mainLoop($timeout, $scope, numer0n), sleep);
}
