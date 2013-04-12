goog.provide 'gremlin.gremlinDefinitions.extensions.DomElements'
goog.require 'gremlin.util.Helper'

class gremlin.gremlinDefinitions.extensions.DomElements
  isSupported = gremlin.util.FeatureDetector.hasQuerySelectorAll
  addElements = () ->
    if typeof @elements is 'object'
      for own selector, propertyName of @elements
        throw new TypeError "Element member #{propertyName} already defined!" unless (typeof @[propertyName] is "undefined")
        throw new TypeError "Element selector have to be referenced by strings!" unless (typeof selector is "string")
        @[propertyName] = @el.querySelectorAll(selector)

  @test: ->
    isSupported

  @bind: (gremlinInstance) ->
    addElements.call gremlinInstance