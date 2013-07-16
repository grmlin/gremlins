# IExtension

`gremlin.gremlinDefinitions.IExtension`

Interface every extension has to implement.

## test():Boolean
**static** Should return true, if the extension is available, false otherwise

## bind(gremlinInstance)
**static** Binds the extension to a gremlin instance.

### Arguments
- **`gremlinInstance:Object`**    
The instance of a gremlin component the extension will be bound to.

Will be called for every gremlin in the document, if the extension is available.