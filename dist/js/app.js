/// <reference path="../typings/globals/angular/index.d.ts" />
var app;
(function (app) {
    'use strict';
    console.log('app.ts ... started!');
    angular.module('amplitudejsdemo', ['angular-amplitudejs']);
    var HomeController = (function () {
        function HomeController(amplitudejs) {
            var _this = this;
            this.sendEvent = function () {
                console.log('sendEvent');
                _this.amplitudejs.logEvent('sendEvent');
            };
            console.log("homeController constructor.");
            var vm = this;
            vm.title = 'AngularJS AmplitudeJS Demo';
            vm.amplitudejs = amplitudejs;
            console.log('amplitudejs service: ' + amplitudejs.getUsername());
            amplitudejs.logEvent('Test Custom Event');
        }
        HomeController.$inject = ['amplitudejsService'];
        return HomeController;
    }());
    angular.module('amplitudejsdemo').controller('homeController', HomeController);
})(app || (app = {}));
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
                if ($window['google'] && $window['google'].maps) {
                    console.log('gmaps already loaded');
                }
                else {
                    _this.lazyLoadApi().then(function () {
                        console.log('promise resolved');
                        if ($window['google'] && $window['google'].maps) {
                            console.log('gmaps loaded');
                        }
                        else {
                            console.log('gmaps not loaded');
                        }
                    }, function () {
                        console.log('promise rejected');
                    });
                }
            };
            this.$window = $window;
            this.$q = $q;
        }
        AmplitudejsDirective.prototype.load_script = function () {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.innerHTML = "(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement(\"script\");r.type=\"text/javascript\";\n      r.async=true;r.src=\"https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.0.1-min.gz.js\";\n      r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName(\"script\")[0];\n      i.parentNode.insertBefore(r,i);function s(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));\n      return this}}var o=function(){this._q=[];return this};var a=[\"add\",\"append\",\"clearAll\",\"prepend\",\"set\",\"setOnce\",\"unset\"];\n      for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[];return this;\n      };var p=[\"setProductId\",\"setQuantity\",\"setPrice\",\"setRevenueType\",\"setEventProperties\"];\n      for(var l=0;l<p.length;l++){s(c,p[l])}n.Revenue=c;var d=[\"init\",\"logEvent\",\"logRevenue\",\"setUserId\",\"setUserProperties\",\"setOptOut\",\"setVersionName\",\"setDomain\",\"setDeviceId\",\"setGlobalUserProperties\",\"identify\",\"clearUserProperties\",\"setGroup\",\"logRevenueV2\",\"regenerateDeviceId\"];\n      function v(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));\n      }}for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){e=(!e||e.length===0?\"$default_instance\":e).toLowerCase();\n      if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]};e.amplitude=n;\n      })(window,document);\n      console.log(\"amplitude.getInstance().init\");\n      window.amplitude.getInstance().init(\"80670c002958c669424d60a2a2c852e2\");\n      window.amplitude.getInstance().logEvent('Test from directive');\n      ";
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
        function AmplitudejsService($window) {
            var vm = this;
            vm.$window = $window;
        }
        AmplitudejsService.prototype.getUsername = function () {
            return "gregorifaroux@gmail.com";
        };
        AmplitudejsService.prototype.init = function (apikey) {
            console.log('AmplitudejsService.init ' + apikey);
            this.$window['amplitude'].init(apikey, null);
        };
        AmplitudejsService.prototype.logEvent = function (event) {
            console.log('Amplitude.logevent ' + event + ' ' + this.$window + ' this.initialized = ' + this.$window['amplitude']);
            if (this.$window['amplitude']) {
                this.$window['amplitude'].logEvent(event);
            }
            else {
                console.warn('Amplitude not loaded yet');
            }
        };
        AmplitudejsService.prototype.setUserId = function (userid) {
            this.$window['amplitude'].setUserId(userid);
        };
        AmplitudejsService.prototype.setUserProperties = function (properties) {
            this.$window['amplitude'].setUserProperties(properties);
        };
        AmplitudejsService.$inject = ['$window'];
        return AmplitudejsService;
    }());
    AngularAmplitudejs.AmplitudejsService = AmplitudejsService;
    var AmplitudejsController = (function () {
        function AmplitudejsController($window, $attrs, api) {
            var vm = this;
            vm.apikey = $attrs['apikey'];
            vm.$window = $window;
        }
        AmplitudejsController.$inject = ['$window', '$attrs', 'amplitudejsService'];
        return AmplitudejsController;
    }());
    AngularAmplitudejs.AmplitudejsController = AmplitudejsController;
})(AngularAmplitudejs || (AngularAmplitudejs = {}));
angular.module('angular-amplitudejs', [])
    .directive("amplitudejs", ['$window', '$q', function ($window, $q) { return new AngularAmplitudejs.AmplitudejsDirective($window, $q); }])
    .service('amplitudejsService', AngularAmplitudejs.AmplitudejsService);
