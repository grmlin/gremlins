# GremlinJS #

`window.GremlinJS`

Global GremlinJS Namespace



## Static Members

### debug

#### `.debug:gremlin.util.Debug`
Instance of [`gremlin.util.Debug`](gremlin/util/debug.html).   
Used for console logging and gremlin highlighting in the document. With activated debugging, all gremlins
will be highlighted visually by GremlinJS, listing components that are ready, pending or broken.



To enable the debug mode, set `debug` to `true` at the body of your document.

```html
    &lt;body data-gremlin-config='{&quot;debug&quot;:true}'&gt;
    ...
    &lt;/body&gt;
```

The debugger instance provides a reference to the browsers `console` object. If debugging is disabled, all `console`
statements will be muted.



#### Example

Open your console to see the logging there.

<pre class="codepen" data-height="250" data-type="result" data-href="qpmEc" data-user="grmlin" data-safe="true">
</pre>
<script async src="http://codepen.io/assets/embed/ei.js">
</script>

### define()

Defines a new gremlin.  
Creates a gremlin definition (*"class"*) that later will be used to activate elements in the document for this gremlin.
 
#### `.define(name, constructor [, instanceMembers] [, staticMembers]):Gremlin` 

- **`name`** : String    

	A unique String used to reference the new Gremlin, the gremlin's name. Use this name in the `data-gremlin` attribute of a dom element to select the gremlin.

- **`constructor`** : Function    

	The constructor function being called every time a gremlin with `name` was found in the dom and gets instantiated.   
	`this` inside the constructor refers to the instance of `AbstractGremlin`

- **`instanceMembers`** : Object *optional*

	All instance members of this class as an object literal. Will be mixed into the `prototype` of the gremlin (the constructor function returned by `GremlinJS.define`). 

- **`staticMembers`** : Object *optional*
 
	All static members of this class as an object literal. <br> To access static members from inside gremlin instances, `AbstractGremlin.klass` references the original constructor function.





#### Example
##### HTML
```html
   <div data-gremlin="HelloWorld"></div>
```

##### JS
```js
    GremlinJS.define('HelloWorld', function () {
            this.talk();
        },
        {
            talk: function () {
                this.el.innerHTML = this.klass.GREETING;
            }
        },
        {
            GREETING: 'Hello World!'
        }
    );
```

##### Live Preview

<pre class="codepen" data-height="150" data-type="result" data-href="IqFbf" data-user="grmlin" data-safe="true">
</pre>
<script async src="http://codepen.io/assets/embed/ei.js">
</script>

### Helper
Reference of [`gremlin.util.Helper`](gremlin/util/Helper.html)

#### `.Helper:Object`
Object providing some useful utility methods.

### registerExtension() 

Adds a new extension to GremlinJS.

#### `.registerExtension(Extension)`

- **`Extension`** : Object implementing gremlin.gremlinDefinitions.IExtension

	[`gremlin.gremlinDefinitions.IExtension`](gremlin/gremlinDefinitions/IExtension.html) does not exist in code and there is no error handling when registring extensions at all. Take care and be sure to provide the necessary methods. 

**Always include your extensions before your gremlin definitions**

#### Example

The extension in the example below modifies the prototype for all gremlin instances, adds a property to the class itself and then binds custom data to each individual instance.

<pre class="codepen" data-height="430" data-type="js" data-href="mAGDC" data-user="grmlin" data-safe="true">
</pre>
<script async src="http://codepen.io/assets/embed/ei.js">
</script>