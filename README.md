# AngularJS wrapper for Amplitude's Javascript SDK 

This is a directive wrapper for Amplitude's Javascript SDK. There is a working example that is using ui-router and sends a custom event at each page.

## Usage
In your HTML, includes the library after including the angular library:

```javascript
<script src="lib/amplitude.directive.js">
```

In the header of your HTML, you can drop the tag with your API Key. If you haven't already, go to http://amplitude.com and register for an account. You will receive an API Key.

```html
<head>
  <amplitudejs apikey="YOUR API KEY"></amplitudejs>
```

Add 'angular-amplitudejs' to your main module's list of dependencies and include 'amplitudejsService' in your controller to start logging event:

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
