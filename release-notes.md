# Release notes
## v1.1.0

- updated handling of a components lifecycle to match the of a custom element
    - the use of the `initialize` and `destroy` callbacks are deprecated and should not be used anymore from now on
    - three new callbacks were added to a components spec
        - `created` — a component/element was created. This callback is called **once** and the element does not have to be part of the document yet
        - `attached` — called every time when an element was added to the document
        - `detached` — called every time when an element was removed from the document
- changed the way `gremlins.findGremlin()` works. It does not return null or a gremlin anymore, as it's not guaranteed, that the component has already been created.  
`gremlins.findGremlin()` returns a promise now.
## v1.0.0

- first major release
- now publishing babel compiled version to npm

## v0.8.0

### New

- complete rewrite with ES6 and custom elements

### Removed

- nearly everything

## v0.6.0 *2013-11-10*

### New

- `G.Gizmo.extend` to inherit from gremlin classes
- `G.Package.require` to reference packages

### Removed

- `G.define`, use `G.Gizmo.extend`
- `G.require`, use `G.Package.require`
- `G.namespace`, `G.ns`, use `G.Package.require`
- `G.Gizmo#klass`, use `G.Gizmo#constructor` 

## v0.5.1 *2013-11-6*

### New

- `G.require` to reference packages

## v0.5.0 *2013-10-30*

### New

- **PACKAGES**, use `G.Package` to add your own packages
- **MODULES**, add modules to your gremlin classes with `G.Module`and include them in any gremlin you like

### Removed

- **Extensions are gone!** They are called modules now and have to be required in every Gremlin class with the static `include` property

## v0.4.0 *2013-08-29*

- fresh rewrite of the original **gremlin.js**, the starting point if you like