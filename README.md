
![GremlinJS](logo.png)  


#GREMLIN.JS
dead simple web components

GREMLIN.JS is a highly modularized library to build web components. These components are not as fancy as libraries like Polymer, but they're great to build reusable javascript components for boringly normal websites, where your HTML is rendered on the server.  
Throw in some bundled js, add the corresponding tags to your HTML, and you're good to go.

```javascript
var gremlins = require('gremlins');
gremlins.create({
  name: 'Slider'
  initialize: function(){
    this.initSlider();
  }
  // awesome slider magic
});
```

```html
<slider-gremlin>
  <!-- awesome slider HTML -->
</slider-gremlin>
```

## Installation
[Release Notes](https://github.com/grmlin/gremlinjs/blob/master/release-notes.md)

### npm
    
    $ npm install gremlins --save
    
### bower

    $ bower install gremlins
    
### global

    <script src="gremlin.min.js" />
    
    

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

#### name
**required** name of this component

#### tagName
optional tag name. If you omit the `tagName`, the custom element will have the tag `${name}-gremlin`.  

Be aware you have to add a minimum of one hypen! (custom elements work this way).  
`tagName: responsive-slider` **ok**  
`tagName: slider` **error**

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

### gremlins.create(Spec)

Create a new spec for components with the name `name` 

```js
gremlins.create({
  name: 'foo', // required name property
  tagName: 'foo-bar', // optional tagname used for the custom dom element. Defaults to " ${name}-gremlin"
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


