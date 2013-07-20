# Helper

`gremlin.util.Helper` 

Utility methods used by GremlinJS.

## Static Members

### .extend()

Extends an object. Copy all properties of the source objects into the target, overwriting existing properties.

#### `.extend(target, *objects):Function|Object` 
- **`target`** : Object

	The object to extend

- **`objects`** : Object
	
	One or more source objects

###  .mixin()

Mix an object into a constructor functions prototype

#### `.mixin(targetClass, mixinObject)`
- **`targetClass`** : Function

	The constructor function to extend

- **`mxinObject`** : Object

	An object containing all properties that will be mixed into the prototype of `targetClass`

### .clone()

Create a deep copy of an object

#### `.clone(obj):Object`
- **`obj`** : Object

	The object to clone
 

### .hasClass()

Test, if a dom element has a certain class.

#### `.hasClass(element, className):Boolean`
- **`element`** : Object

	The dom element

- **`className`** : String

	The class name

### .addClass()

Add a new class to a dom element.

#### `.addClass(element, className)`
- **`element`** : Object

	The dom element

- **`className`** : String

	The class name

### .removeClass()

Remove a class from a dom element

#### `.removeClass(element, className)`
- **`element`** : Object

	The dom element

- **`className`** : String

	The class name

### .addStyleSheet() 

Add some new css styles to your document

#### `.addStyleSheet(cssText)`
- **`cssText`** : String

	The css you want to add to your document

#### Example

```js
    var css = '.foo {color:red;}';
	GremlinJS.Helper.addStyleSheet(css);
```
