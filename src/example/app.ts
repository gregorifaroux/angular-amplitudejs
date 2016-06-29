/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/angular-ui-router/index.d.ts" />
/// <reference path="../../typings/globals/angular/index.d.ts" />

module app {
  'use strict';
  console.log('app.ts ... started!');
  angular.module('amplitudejsdemo', ['angular-amplitudejs', 'ui.router'])
    .config(['$stateProvider', '$urlRouterProvider',
      function routes($stateProvider: ng.ui.IStateProvider, $routerProvider: ng.ui.IUrlRouterProvider) {
        $routerProvider.otherwise('/page1');

        $stateProvider
          .state('page1', {
            url: '/page1',
            template: `<h1>Page 1</h1>`,
            controller: Page1Controller
          })
          .state('page2', {
            url: '/page2',
            template: `<h1>Page 2</h1>`,
            controller: Page2Controller
          });
      }
    ]);

  class Page1Controller {
    static $inject = ['amplitudejsService'];
    constructor(amplitudejs: AngularAmplitudejs.AmplitudejsService) {
      console.log("page1 constructor... calling logEvent");
      amplitudejs.logEvent('Page1');
    }


  };


  class Page2Controller {
    static $inject = ['amplitudejsService'];
    constructor(amplitudejs: AngularAmplitudejs.AmplitudejsService) {
      console.log("page2 constructor... calling logEvent");
      amplitudejs.logEvent('Page2');
    }


  };

  class HomeController {
    static $inject = ['amplitudejsService'];
    title: string;
    amplitudejs: AngularAmplitudejs.AmplitudejsService;

    constructor(amplitudejs: AngularAmplitudejs.AmplitudejsService) {
      console.log("homeController constructor...");
      var vm = this;
      vm.title = 'AngularJS AmplitudeJS Demo';
      vm.amplitudejs = amplitudejs;
      amplitudejs.setUserId('test@test.test');
      amplitudejs.logEvent('Test Custom Event');


    }


    sendEvent = () => {
      console.log('Test Custom Event');
      this.amplitudejs.logEvent('Test Custom Event');
    }

  }
  angular.module('amplitudejsdemo').controller('homeController', HomeController);

}
