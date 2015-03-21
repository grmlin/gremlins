# Release notes
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