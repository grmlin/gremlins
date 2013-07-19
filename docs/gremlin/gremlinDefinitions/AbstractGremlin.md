# AbstractGremlin
`gremlin.gremlinDefinitions.AbstractGremlin`

All gremlin definitions added with [`GremlinJS.define()`](../../GremlinJS.html#define) are inheriting from this class.
Every instance will  get some useful members helping a lot implementing the usual dom-work.

> This class is not directly accessible from outside GremlinJS. Use the [`GremlinJS.debug`](../../GremlinJS.html#debug) instance to debug your gremlins!

## Constructor

### AbstractGremlin()

The constructor function used internally to instantiate gremlins.

#### `AbstractGremlin(el, data, id, init)` 

- **`el`** : Object    
	 
	The dom element the gremlin is bound to.

- **`data`** : Object    

	The elements data attributes

- **`id`** : Number    

	A unique id for every gremlin in the page. 

- **`init`** : Function
     
	A init function called inside the constructor. Here, the extensions will be bound to the newly created instance.


## Instance Members

### data

#### `#data:Object`
All data-attributes of the gremlin's dom element.   
GremlinJS will parse all the data-attributes for you and tries to guess their types. Numbers will be Javascript Numbers, the strings *true* and *false* Booleans... and it's possible to define native Objects as JSON. 

GremlinJS converts the attribute names separated by '-' into camel cased keys, without the leading *data*. `data-foo-bar` becomes `data.fooBar`.

##### JSON inside data-attributes

Objects in data-attributes will be parsed with `JSON.parse`. It's absolutely necessary to enter a valid JSON string inside the attribute, otherwise the object wont be parsed and stay an uninteresting string.   
Enclose the JSON string in single quotes and write your JSON.

```html
    &lt;div data-gremlin="Foo" data-config='{&quot;foo&quot;:&quot;bar&quot;}'&gt;&lt;/div&gt;
```

#### Example
The following attributes
                                                           
```html
   &lt;div data-gremlin=&quot;foo&quot; 
        data-config='{&quot;foo&quot;:&quot;bar&quot;}' 
        data-my-number=&quot;42&quot;&gt;
   &lt;/div&gt;
```

will give you a number, `this.data.myNumber` and an object `this.data.config`.

```js
   console.log(this.data.number); // prints 42
   console.log(typeof this.data.number); // prints number
   console.log(this.data.config.foo); // prints bar
   console.log(typeof this.data.config); // prints object
```

inside your gremlin instance.


### el

#### `#el:Object`
A [dom element](https://developer.mozilla.org/en-US/docs/Web/API/element "Open Mozilla Web API Reference").

A reference to the dom element the gremlin was added to.  
**This element should always be the starting point for all your dom manipulations, queryselectors etc...**


### id

#### `#id:Number`
Unique id amongst all gremlin instances.

### klass

#### `#klass:Function`
Points to the class/definition the instance belongs to. 

Especially handy, when you define static gremlin members with [`GremlinJS.define()`](../../GremlinJS.html#define) and want to access them from inside your instance.


#### Example

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

