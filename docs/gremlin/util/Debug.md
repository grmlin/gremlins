# Debug

`gremlin.util.Debug` 

Debugger Class used for console logging and gremlin highlighting in the document.   
If instantiated with activated debugging, all gremlins
will be highlighted visually by GremlinJS, and components that are ready, pending or broken are listed at the bottom left
part of the site.

> This class is not directly accessible from outside GremlinJS. Use the [`GremlinJS.debug`](../../GremlinJS.html#debug) instance to debug your gremlins!

## constructor(isDebug)
Creates a new `gremlin.util.Debug` instance.

### Arguments
- **`isDebug:Boolean`**   
Set `isDebug` to `true`, if debugging should be enabled or `false` otherwise.



### Example
```js
    goog.require('gremlin.util.Debug');// Mantri dependency
    var debugger = new gremlin.util.Debug(true);
```

## console

A reference to the console object you know and love. **If** GremlinJS is in debug mode, the `console` methods are a
direct reference to the native `console` object. Otherwise all your `console.log` statements will be muted.




---

The following list of commands is currently supported by `GremlinJS.debug` *(if the browser supports them, of course)*:

```js
["debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline", "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd", "clear"]
```