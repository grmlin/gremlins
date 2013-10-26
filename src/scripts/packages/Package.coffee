goog.provide 'packages.Package'

goog.require 'pkg'

class packages.Package

  root = pkg

  namespace = (name, source = null) ->
    items = name.split '.'
    last = items.pop()
    target = root

    target = target[item] or= {} for item in items

    target[last] = source or (target[last] or= {})

  constructor: (ns, source) ->
    return new packages.Package arguments... if this not instanceof packages.Package
    @_package  = namespace ns, source

  @get: (ns) -> namespace ns