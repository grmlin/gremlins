goog.provide 'modules.Module'

goog.require 'pkg'

class modules.Module
  root = pkg

  namespace = (name, source = null) ->
    items = name.split '.'
    last = items.pop()
    target = root

    target = target[item] or= {} for item in items

    target[last] = source or (target[last] or= {})

  constructor: (ns, source) ->
    return new modules.Module arguments... if this not instanceof modules.Module
    @_module  = namespace ns, source

  @get: (ns) -> namespace ns


