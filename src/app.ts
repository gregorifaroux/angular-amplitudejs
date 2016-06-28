/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="../typings/globals/angular/index.d.ts" />

module app {
  'use strict';
  console.log('app.ts ... started!');
  angular.module('amplitudejsdemo', ['angular-amplitudejs']);

  class HomeController {
    static $inject = ['amplitudejsService'];
    title: string;
    amplitudejs: AngularAmplitudejs.AmplitudejsService;

    constructor(amplitudejs: AngularAmplitudejs.AmplitudejsService) {
      console.log("homeController constructor.");
      var vm = this;
      vm.title = 'AngularJS AmplitudeJS Demo';
      vm.amplitudejs = amplitudejs;
      console.log('amplitudejs service: ' + amplitudejs.getUsername());
      amplitudejs.logEvent('Test Custom Event');


    }

    sendEvent = () => {
      console.log('sendEvent');
      this.amplitudejs.logEvent('sendEvent');
    }

  }
  angular.module('amplitudejsdemo').controller('homeController', HomeController);

}
