goog.provide 'packages.Package'

goog.require 'namespace'

class packages.Package

  root = namespace

  getNamespace = (name, content = null) ->
    items = name.split '.'
    last = items.pop()
    target = root

    target = target[item] or= {} for item in items

    target[last] = content or (target[last] or= {})

  constructor: (ns, content) ->
    return new packages.Package arguments... if this not instanceof packages.Package
    @_package  = getNamespace ns, content

  @get: (ns) -> getNamespace ns