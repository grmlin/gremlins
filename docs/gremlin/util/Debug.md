# Debug

`gremlin.util.Debug` 

Debugger Class used for console logging and gremlin highlighting in the document.   
If instantiated with activated debugging, all gremlins
will be highlighted visually by GremlinJS, and components that are ready, pending or broken are listed at the bottom left
part of the site.

> This class is not directly accessible from outside GremlinJS. Use the [`GremlinJS.debug`](../../GremlinJS.html#debug) instance to debug your gremlins!

### Example

Open your console to see the logging there.

<pre class="codepen" data-height="250" data-type="result" data-href="qpmEc" data-user="grmlin" data-safe="true">
</pre>
<script async src="http://codepen.io/assets/embed/ei.js">
</script>

## Constructor

### Debug()
Creates a new `gremlin.util.Debug` instance.

#### `Debug(isDebug)`

- **`isDebug`** : Boolean
	Set `isDebug` to `true`, if debugging should be enabled and `false` otherwise.

#### Example
```js
    goog.require('gremlin.util.Debug');// Mantri dependency
    var debugger = new gremlin.util.Debug(true);
```
## Instance Members

### console
A reference to the console object you know and love.

#### `#console:Object`

**If** GremlinJS is in debug mode, the `console` methods are linked directly to the native `console` object. Otherwise all your `console.log` statements will be muted.

---

The following list of commands is currently supported by `GremlinJS.debug` *(if the browser supports them, of course)*:

```js
["debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline", "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd", "clear"]
```