# GremlinJS #

`window.GremlinJS`

Global GremlinJS Namespace


## debug:Object

Debugger instance used for console logging and gremlin highlighting in the document. With activated debugging, all gremlins
will be highlighted visually by GremlinJS, listing components that are ready, pending or broken.

To enable the debug mode, set `debug` to `true` at the body of your document.

```html
    &lt;body data-gremlin-config='{&quot;debug&quot;:true}'&gt;
    ...
    &lt;/body&gt;
```

The debugger instance provides a reference to the browsers `console` object. If debugging is disabled, all `console`
statements will be muted.

For more details see: [`gremlin.util.Debug`](gremlin/util/debug.html)

### Example

```js
   GremlinJS.debug.console.log('Hello World');

   GremlinJS.debug.console.warn('Heads up, something wrent wrong');
```


## define(name, constructor, instanceMembers, staticMembers):Function

Defines a new gremlin.  
Creates a gremlin definition (*"class"*) that later will be used to activate elements in the document for this gremlin.
 
 
### Arguments
- **`name:String`**  
A unique String used to reference the new Gremlin, the gremlin's name. Use this name in the `data-gremlin` attribute of
 a dom element to select the gremlin.

- **`constructor:Function`**  
The constructor function being called every time a gremlin with `name` was found in the dom and gets instantiated. 

- **`instanceMembers:Object`**  
All instance members of this class as an object literal. Will be mixed into the `prototype` of the gremlin (the 
constructor function returned by `GremlinJS.define`). 

- **`staticMembers:Object`**  
All static members of this class as an object literal. <br> To access static members from inside gremlin instances, 
`&lt;gremlinInstance&gt;.<strong>klass</strong>` references the original constructor function.


`this` inside the constructor refers to the <a href="/api.html#gremlin-instance">gremlin instance</a>.


### Example
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

## registerExtension(Extension) 

Add a new extension to GremlinJS.

### Arguments
- **`Extension:Function|Object`**  
The new extension implementing  [`gremlin.gremlinDefinitions.IExtension.`](gremlin/gremlinDefinitions/IExtension.html) 

> The Interface does not exist in code and there is no error handling when registring extensions at all. Take care and provide
the necessary methods. 