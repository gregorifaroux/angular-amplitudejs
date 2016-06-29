/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/angular-ui-router/index.d.ts" />
/// <reference path="../../typings/globals/angular/index.d.ts" />
var app;
(function (app) {
    'use strict';
    console.log('app.ts ... started!');
    angular.module('amplitudejsdemo', ['angular-amplitudejs', 'ui.router'])
        .config(['$stateProvider', '$urlRouterProvider',
        function routes($stateProvider, $routerProvider) {
            $routerProvider.otherwise('/page1');
            $stateProvider
                .state('page1', {
                url: '/page1',
                template: "<h1>Page 1</h1>",
                controller: Page1Controller
            })
                .state('page2', {
                url: '/page2',
                template: "<h1>Page 2</h1>",
                controller: Page2Controller
            });
        }
    ]);
    var Page1Controller = (function () {
        function Page1Controller(amplitudejs) {
            console.log("page1 constructor... calling logEvent");
            amplitudejs.logEvent('Page1');
        }
        Page1Controller.$inject = ['amplitudejsService'];
        return Page1Controller;
    }());
    ;
    var Page2Controller = (function () {
        function Page2Controller(amplitudejs) {
            console.log("page2 constructor... calling logEvent");
            amplitudejs.logEvent('Page2');
        }
        Page2Controller.$inject = ['amplitudejsService'];
        return Page2Controller;
    }());
    ;
    var HomeController = (function () {
        function HomeController(amplitudejs) {
            var _this = this;
            this.sendEvent = function () {
                console.log('Test Custom Event');
                _this.amplitudejs.logEvent('Test Custom Event');
            };
            console.log("homeController constructor...");
            var vm = this;
            vm.title = 'AngularJS AmplitudeJS Demo';
            vm.amplitudejs = amplitudejs;
            amplitudejs.setUserId('test@test.test');
            amplitudejs.logEvent('Test Custom Event');
        }
        HomeController.$inject = ['amplitudejsService'];
        return HomeController;
    }());
    angular.module('amplitudejsdemo').controller('homeController', HomeController);
})(app || (app = {}));
/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/angular/index.d.ts" />
var AngularAmplitudejs;
(function (AngularAmplitudejs) {
    var AmplitudejsDirective = (function () {
        function AmplitudejsDirective($window, $q) {
            var _this = this;
            this.restrict = "E";
            this.replace = true;
            this.controller = AngularAmplitudejs.AmplitudejsController;
            this.controllerAs = 'vm';
            this.scope = {
                apikey: '@'
            };
            this.link = function (scope, element, $window) {
                scope.$watch(($window['amplitude'], function () {
                    if ($window['amplitude'] === undefined) {
                        return;
                    }
                }));
                if (!$window['amplitude']) {
                    _this.lazyLoadApi().then(function () { console.log('loaded ...'); }, function (reason) { console.log('ERROR: ' + JSON.stringify(reason)); }, function (update) { console.log('UPDATE'); });
                }
            };
            this.$window = $window;
            this.$q = $q;
        }
        AmplitudejsDirective.prototype.load_script = function () {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.innerHTML = "(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement(\"script\");r.type=\"text/javascript\";\n      r.async=true;r.src=\"https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.0.1-min.gz.js\";\n      r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName(\"script\")[0];\n      i.parentNode.insertBefore(r,i);function s(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));\n      return this}}var o=function(){this._q=[];return this};var a=[\"add\",\"append\",\"clearAll\",\"prepend\",\"set\",\"setOnce\",\"unset\"];\n      for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[];return this;\n      };var p=[\"setProductId\",\"setQuantity\",\"setPrice\",\"setRevenueType\",\"setEventProperties\"];\n      for(var l=0;l<p.length;l++){s(c,p[l])}n.Revenue=c;var d=[\"init\",\"logEvent\",\"logRevenue\",\"setUserId\",\"setUserProperties\",\"setOptOut\",\"setVersionName\",\"setDomain\",\"setDeviceId\",\"setGlobalUserProperties\",\"identify\",\"clearUserProperties\",\"setGroup\",\"logRevenueV2\",\"regenerateDeviceId\"];\n      function v(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));\n      }}for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){e=(!e||e.length===0?\"$default_instance\":e).toLowerCase();\n      if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]};e.amplitude=n;\n      })(window,document);\n      ";
            document.head.appendChild(s);
        };
        AmplitudejsDirective.prototype.lazyLoadApi = function () {
            var deferred = this.$q.defer();
            this.$window.initialize = function () {
                deferred.resolve();
            };
            // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
            if (this.$window.attachEvent) {
                this.$window.attachEvent('onload', this.load_script);
            }
            else {
                this.$window.addEventListener('load', this.load_script, false);
            }
            return deferred.promise;
        };
        AmplitudejsDirective.$inject = ["$window", "$q"];
        return AmplitudejsDirective;
    }());
    AngularAmplitudejs.AmplitudejsDirective = AmplitudejsDirective;
    var AmplitudejsService = (function () {
        function AmplitudejsService($window, $timeout) {
            var _this = this;
            this.queue = [];
            var vm = this;
            vm.$window = $window;
            // Process the events and setUserId queue using a timeout. The second safe guard is at each logEvent we check the queue
            $timeout(function () {
                if (_this.$window['amplitude']) {
                    _this.processQueue();
                }
            }, 3000);
        }
        AmplitudejsService.prototype.setApikey = function (key) {
            this.apikey = key;
        };
        AmplitudejsService.prototype.init = function (apikey) {
            this.$window['amplitude'].init(apikey, null);
        };
        /**
        * Process all the events and setUserId that have been queued as the library was not loaded yet
        */
        AmplitudejsService.prototype.processQueue = function () {
            this.init(this.apikey);
            var i = this.queue.length;
            while (i--) {
                this.$window['amplitude'].logEvent(this.queue.splice(i, 1)[0]);
            }
            if (this.userid) {
                this.setUserId(this.userid);
            }
            if (this.userdata) {
                this.setUserProperties(this.userdata);
            }
            console.log('[Amplitude Directive] Processed queued events.');
        };
        AmplitudejsService.prototype.logEvent = function (event) {
            console.log('[Amplitude Directive] logevent ' + event);
            if (this.$window['amplitude']) {
                // Second safeguard, check if we have a queue of events.
                if (this.queue.length > 0) {
                    this.processQueue();
                }
                this.$window['amplitude'].logEvent(event);
            }
            else {
                console.warn('[Amplitude Directive] Amplitude not yet available ... adding event to queue.');
                this.queue.push(event);
            }
        };
        AmplitudejsService.prototype.setUserId = function (userid) {
            if (this.$window['amplitude']) {
                this.$window['amplitude'].setUserId(userid);
            }
            else {
                this.userid = userid;
            }
        };
        AmplitudejsService.prototype.setUserProperties = function (properties) {
            if (this.$window['amplitude']) {
                this.$window['amplitude'].setUserProperties(properties);
            }
            else {
                this.userdata = properties;
            }
        };
        AmplitudejsService.$inject = ['$window', '$timeout'];
        return AmplitudejsService;
    }());
    AngularAmplitudejs.AmplitudejsService = AmplitudejsService;
    var AmplitudejsController = (function () {
        function AmplitudejsController($window, $attrs, api) {
            var vm = this;
            vm.apikey = $attrs['apikey'];
            vm.$window = $window;
            api.setApikey(vm.apikey);
        }
        AmplitudejsController.$inject = ['$window', '$attrs', 'amplitudejsService'];
        return AmplitudejsController;
    }());
    AngularAmplitudejs.AmplitudejsController = AmplitudejsController;
})(AngularAmplitudejs || (AngularAmplitudejs = {}));
angular.module('angular-amplitudejs', [])
    .directive("amplitudejs", ['$window', '$q', function ($window, $q) { return new AngularAmplitudejs.AmplitudejsDirective($window, $q); }])
    .service('amplitudejsService', AngularAmplitudejs.AmplitudejsService);
