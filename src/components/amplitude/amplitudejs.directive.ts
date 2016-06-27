
module AngularAmplitudejs {
  export class AmplitudejsDirective implements ng.IDirective {
    public restrict: string = "E";
    public replace: boolean = true;
    public controller = AngularAmplitudejs.AmplitudejsController;
    public controllerAs: string = 'vm';
    public scope = {
      apikey: '@'
    };

    $window: ng.IWindowService;
    $q: ng.IQService;
    static $inject = ["$window", "$q"];

    constructor($window: ng.IWindowService, $q: ng.IQService) {
      this.$window = $window;
      this.$q = $q;

    }

    load_script() {
      var s = document.createElement('script'); // use global document since Angular's $document is weak
      s.innerHTML = `(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.type="text/javascript";
      r.async=true;r.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.0.1-min.gz.js";
      r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName("script")[0];
      i.parentNode.insertBefore(r,i);function s(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
      return this}}var o=function(){this._q=[];return this};var a=["add","append","clearAll","prepend","set","setOnce","unset"];
      for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[];return this;
      };var p=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"];
      for(var l=0;l<p.length;l++){s(c,p[l])}n.Revenue=c;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId"];
      function v(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
      }}for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){e=(!e||e.length===0?"$default_instance":e).toLowerCase();
      if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]};e.amplitude=n;
      })(window,document);
      console.log("amplitude.getInstance().init");
      window.amplitude.getInstance().init("80670c002958c669424d60a2a2c852e2");
      window.amplitude.getInstance().logEvent('Test from directive');
      `;
      document.head.appendChild(s);
    }

    lazyLoadApi() {
      var deferred = this.$q.defer();
      (<any>this.$window).initialize = function() {
        deferred.resolve();
      };
      // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
      if ((<any>this.$window).attachEvent) {
        (<any>this.$window).attachEvent('onload', this.load_script);
      } else {
        this.$window.addEventListener('load', this.load_script, false);
      }
      return deferred.promise;
    }

    link = (scope: ng.IScope, element: ng.IAugmentedJQuery, $window: ng.IWindowService) => {
      if ($window['google'] && $window['google'].maps) {
        console.log('gmaps already loaded');
      } else {
        this.lazyLoadApi().then(function() {
          console.log('promise resolved');
          if ($window['google'] && $window['google'].maps) {
            console.log('gmaps loaded');
          } else {
            console.log('gmaps not loaded');
          }
        }, function() {
          console.log('promise rejected');
        });
      }
    }

  }


  export class AmplitudejsService {
    static $inject = ['$window'];
    private $window: ng.IWindowService;

    constructor($window: ng.IWindowService) {
      var vm = this;
      vm.$window = $window;
    }
    public getUsername(): String {
      return "gregorifaroux@gmail.com";
    }

    public init(apikey: string) {
      console.log('AmplitudejsService.init ' + apikey);
      this.$window['amplitude'].init(apikey, null);
    }

    public logEvent(event: string) {
      console.log('Amplitude.logevent ' + event + ' ' + this.$window + ' this.initialized = ' + this.$window['amplitude']);
      if (this.$window['amplitude']) {
        this.$window['amplitude'].logEvent(event);
      } else {
        console.warn('Amplitude not loaded yet');
      }
    }

    public setUserId(userid: string) {
      this.$window['amplitude'].setUserId(userid);
    }

    public setUserProperties(properties: any) {
      this.$window['amplitude'].setUserProperties(properties);
    }


  }


  export class AmplitudejsController {
    public apikey: string;
    $window: ng.IWindowService;
    static $inject = ['$window', '$attrs', 'amplitudejsService'];
    constructor($window: ng.IWindowService, $attrs: ng.IAttributes, api: AmplitudejsService) {
      var vm = this;
      vm.apikey = $attrs['apikey'];
      vm.$window = $window;


    }
  }

}

angular.module('angular-amplitudejs', [])
  .directive("amplitudejs", ['$window', '$q', ($window: ng.IWindowService, $q: ng.IQService) => new AngularAmplitudejs.AmplitudejsDirective($window, $q)])
  .service('amplitudejsService', AngularAmplitudejs.AmplitudejsService)
  ;
