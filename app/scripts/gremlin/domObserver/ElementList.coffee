goog.provide 'gremlin.domObserver.ElementList'
goog.require 'gremlin.util.FeatureDetector'
goog.require 'gremlin.gremlins.NameProvider'

class gremlin.domObserver.ElementList
  class NativeQuerySelector
    @get: (attributeName) ->
      elements = document.body.querySelectorAll "[#{gremlin.gremlins.NameProvider.DATA_NAME_ATTR}]"
      (element for element in elements)

  class LegacySelector
    @get: (attributeName) ->
      elements = document.body.getElementsByTagName '*'
      (element for element in elements when gremlin.gremlins.NameProvider.isGremlin(element))

  isNative = gremlin.util.FeatureDetector.hasQuerySelectorAll
  Selector = if isNative then NativeQuerySelector else LegacySelector

  constructor: (@_attributeName) ->

  getList: ->
    Selector.get @_attributeName