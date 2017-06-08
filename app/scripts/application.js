(function()
{
    'use strict';
    var app = angular.module('contextmenu',['ui.bootstrap','ui.router','ngSanitize']);


app.config(function ($stateProvider, $urlRouterProvider, $httpProvider)
{
    console.log('Application config...');
    $stateProvider

        .state('app', {
            url: '/',
            views: {
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'IndexController as vm'
                }
            }
        })
    ;
    $urlRouterProvider.otherwise('/');
});
})();

