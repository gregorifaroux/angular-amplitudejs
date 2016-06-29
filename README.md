# AngularJS wrapper for Amplitude's Javascript SDK 

This is a directive wrapper for Amplitude's Javascript SDK. There is a working example that is using ui-router and sends a custom event at each page.

## Usage
####1. In your HTML, includes the library after including the angular library:

```javascript
<script src="  "bower_components/angular-amplitudejs/dist/lib/amplitude.directive.js">
```

#### 2. In the header of your HTML, you can drop the tag with your API Key. 
If you haven't already, go to http://amplitude.com and register for an account. You will receive an API Key.

```html
<head>
  <amplitudejs apikey="YOUR API KEY"></amplitudejs>
```

#### 3. Add 'angular-amplitudejs' to your main module's list of dependencies.

```javascript
    angular.module('myapp', ['amplitude-angularjs'])
```        
#### 4. include 'amplitudejsService' in your controller to start logging event via logEvent:

```javascript
  var Page1Controller = (function () {
        function Page1Controller(amplitudejs) {
            console.log("page1 constructor... calling logEvent");
            amplitudejs.logEvent('Page1');
        }
        Page1Controller.$inject = ['amplitudejsService'];
        return Page1Controller;
    }());
    ;
```

#### 5. If you are using TypeScript include the reference and use 'AngularAmplitudejs.AmplitudejsService'

```javascript
/// <reference path="../../../../bower_components/angular-amplitudejs/src/lib/amplitude.directive.ts" />
  export class DataAccessService {
    static $inject = ['amplitudejsService'];
    private amplitude: AngularAmplitudejs.AmplitudejsService;

    constructor(amplitude:AngularAmplitudejs.AmplitudejsService) {
      this.amplitude = amplitude;
    }
    
```

## Logging events using 'amplitudejsService'

- amplitudejsService.logEvent("YOUR CUSTOM EVENT")
- setUserId("YOUR CUSTOM ID")

## Compiling and running the example
The example and library are written in TypeScript and Jade for the small HTML example.

### Before the install
Check that you have npm, bower, and typings installed:

- $ npm --version
- $ bower --version
- $ typings --version

### To install
$ npm install

### To view
$ gulp serve

There are three links: page1 and page2 using ui.router and sending a 'Page1' and 'Page2' event.
The third link sendEvent calls function to send 'Test Custom Event.'
