# IExtension

`gremlin.gremlinDefinitions.IExtension`

Interface every extension has to implement.

##### Live Preview

<pre class="codepen" data-height="430" data-type="js" data-href="mAGDC" data-user="grmlin" data-safe="true">
</pre>
<script async src="http://codepen.io/assets/embed/ei.js">
</script>

## Static Members

### .bind

Binds the extension to a gremlin instance. Do whatever yout want to do with a gremlins instance in here. 

#### `.bind(gremlinInstance)`

- **`gremlinInstance`** : Gremlin 

	The instance of a gremlin component the extension will be bound to.

> Will be called **for every gremlin element** in the document separately

#### Example

```js
    Extension.bind = function(gremlinInstance) {
        gremlinInstance.foo = 'bar';
    };
```
### .extend

Change and extend the gremlin definition (constructor function, aka. class) in this handler.  

#### `.extend(AbstractGremlin)`
- **`AbstractGremlin`** : gremlin.gremlinDefinitions.AbstractGremlin

	The constructor function used to create gremlin instances.

`extend` is the place where you might want to add static members to the classes or extend their prototypes. 

> Will be called **once when adding the extension**

#### Example

```js
    Extension.extend= function(Gremlin) {
        Gremlin.foo = 'bar';
        Gremlin.prototype.talk = function(){
            alert(this.klass.foo);
        }
    };
```
### .test()
Test the extensions availability

#### `.test():Boolean`
Should return `true`, if the extension is available, `false` otherwise.

This little helper is needed to prevent errors for the some of the build in extensions. In most cases you will return `true` here.

> Will be called **once when adding the extension**

#### Example

```js
    Extension.test= function() {
        return Modernizr.geolocation
    };
```