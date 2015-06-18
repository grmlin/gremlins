
![GremlinJS](logo.png)  


#GREMLIN.JS
dead simple web components

GREMLIN.JS is a highly modularized library to build web components. These components are not as fancy as libraries like Polymer, but they're great to build reusable javascript components for boringly normal websites, where your HTML is rendered on the server.  
Throw in some bundled js, add the corresponding tags to your HTML, and you're good to go.

```javascript
var gremlins = require('gremlins');
gremlins.create('my-slider', {
  initialize: function(){
    this.initSlider();
  }
  // awesome slider magic
});
```

```html
<my-slider>
  <!-- awesome slider HTML -->
</my-slider>
```

## Installation
[Release Notes](https://github.com/grmlin/gremlinjs/blob/master/release-notes.md)

### npm
    
    $ npm install gremlins --save
    
### bower

    $ bower install gremlins
    
### global

    <script src="gremlin.js" />
    
    

---

## Creating Components

To create a new component, you'll have to add new specs for them to GREMLIN.JS

A Spec is a javascript object literal, that later will be used as a prototype for all the components found and intantiated in the page.

Every component will inherit from `Gremlin`, the base prototype of all components.

-----

### Gremlin

#### mixins
An object, or an array of objects, used as mixin(s). This way it's easy to extend you're components capabilities in a modular way.  
If you're mixins and componenet use the same method names, they will be decorated and called in the order they were added to the spec.

#### el
The dom element for this component. Available inside the `initialize` call

##### initialize() 
constructor function called for all instances. Can safely be overwritten by the component

#### destroy()
called, when the element leaves the dom. Can be used to unbind event handlers and such

#### create()
extends the base prototype with a new spec. **Don't overwrite this**, you can't extend from your **new** component anymore if you do so.   
This is the method `gremlins.create` calls!

----

### gremlins.create(tagName, Spec)

Create a new spec for components

```js
gremlins.create('foo-bar', {
  initialize: function(){
  	// your constructor function called in the context of every dom element found for this spec
  	this.hello();
  },
  hello: function(){
    this.el.querySelector('span').innerHTML = 'hello world!';
  }
});
```

### Using Components

```html
<foo-bar>
	<span></span>
</foo-bar>
```

will be rendered with javascript as

```html
<foo-bar>
	<span>hello world!</span>
</foo-bar>
```


**GREMLIN.JS**, a dependency-free library to build reusable Javascript components.


[**Visit Website**](http://grml.in)


