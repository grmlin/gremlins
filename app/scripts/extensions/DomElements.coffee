goog.provide 'extensions.DomElements'

goog.require 'gremlin.util.Helper'
goog.require 'gremlin.util.FeatureDetector'
# @private
class extensions.DomElements
  isSupported = gremlin.util.FeatureDetector.hasQuerySelectorAll
  addElements = () ->
    if typeof @klass.elements is 'object'
      for own selector, propertyName of @klass.elements
        throw new TypeError "Element member #{propertyName} already defined!" unless (typeof @[propertyName] is "undefined")
        throw new TypeError "Element selector have to be referenced by strings!" unless (typeof selector is "string")
        @[propertyName] = @el.querySelectorAll(selector)

  @test: ->
    isSupported
    
  @extend: ->
    
  @bind: (gremlinInstance) ->
    addElements.call gremlinInstance