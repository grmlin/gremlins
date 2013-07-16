# IExtension

`gremlin.gremlinDefinitions.IExtension`

Interface every extension has to implement.

## .bind(gremlinInstance)
Binds the extension to a gremlin instance. Do whatever yout want to do with a gremlins instance in here. 

### Arguments
- **`gremlinInstance:Object`**    
The instance of a gremlin component the extension will be bound to.

> Will be called **for every gremlin element** in the document separately

### Example

```js
    Extension.bind = function(gremlinInstance) {
        gremlinInstance.foo = 'bar';
    };
```
## .extend(GremlinDefinition)
Change and extend the gremlin definition (constructor function, aka. class) in this handler.  
`extend` is the place where you might want to add static members to the classes or extend their prototypes. 

### Arguments
- **`GremlinDefinition:Function`**    
The constructor function used to create gremlin instances.

> Will be called **once for every gremlin definition** the moment the defintion is added to GremlinJS with 
[`GremlinJS.define()`](../../GremlinJS.html#define)

### Example

```js
    Extension.extend= function(Gremlin) {
        Gremlin.foo = 'bar';
        Gremlin.prototype.talk = function(){
            alert(this.klass.foo);
        }
    };
```
## .test():Boolean
Should return true, if the extension is available, false otherwise

> Will be called **for every gremlin element** in the document separately


### Example

```js
    Extension.test= function() {
        return Modernizr.geolocation
    };
```