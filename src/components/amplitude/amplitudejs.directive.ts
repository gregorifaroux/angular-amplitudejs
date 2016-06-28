
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
      scope.$watch(($window['amplitude'], () => {
        if ($window['amplitude'] === undefined) {
          return;
        }
        console.log('$watch amplitude loaded'+typeof($window['amplitude']));
        console.log('$watch amplitude loaded'+typeof($window['amplitude'].getInstance));
        console.log("amplitude.getInstance().init "+scope['apikey']);
    //        $window['amplitude'].getInstance().init(this.apikey);
  }));

      if ($window['amplitude']) {
        console.log('amplitude already loaded');
      } else {
        this.lazyLoadApi().then(() => { console.log('loaded ...');}, (reason) => {console.log('ERROR: '+JSON.stringify(reason))}, (update) => { console.log('UPDATE')});
      }
    }

  }


  export class AmplitudejsService {
    static $inject = ['$window'];
    private $window: ng.IWindowService;
    private queue: string[] = [];
    private apikey: string;

    constructor($window: ng.IWindowService) {
      var vm = this;
      vm.$window = $window;
    }
    public getUsername(): String {
      return "gregorifaroux@gmail.com";
    }

    public setApikey(key:string): void {
      this.apikey = key;
    }

    public init(apikey: string) {
      console.log('AmplitudejsService.init ' + apikey);
      this.$window['amplitude'].init(apikey, null);
    }

    public logEvent(event: string) {
      console.log('Amplitude.logevent ' + event + ' queue:' + this.queue.length);
      if (this.$window['amplitude']) {
        if (this.queue.length > 0 ) {
          this.init(this.apikey);
          var i = this.queue.length
          while (i--) {
            console.log('queue: ' + this.queue[i]);
            this.$window['amplitude'].logEvent(this.queue.splice(i, 1)[0]);
          }
        }
        console.log('send: ' + event);
        this.$window['amplitude'].logEvent(event);
      } else {
        console.warn('Amplitude not loaded yet ... queued');
        this.queue.push(event);
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
      api.setApikey(vm.apikey);


    }
  }

}

angular.module('angular-amplitudejs', [])
  .directive("amplitudejs", ['$window', '$q', ($window: ng.IWindowService, $q: ng.IQService) => new AngularAmplitudejs.AmplitudejsDirective($window, $q)])
  .service('amplitudejsService', AngularAmplitudejs.AmplitudejsService)
  ;
