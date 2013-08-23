goog.provide 'domObserver.ElementList'

goog.require 'util.FeatureDetector'
goog.require 'gremlins.NameProvider'

class domObserver.ElementList
  class NativeQuerySelector
    @get: (attributeName) ->
      elements = document.querySelectorAll "[#{gremlins.NameProvider.DATA_NAME_ATTR}]"
      (element for element in elements)

  class LegacySelector
    @get: (attributeName) ->
      elements = document.getElementsByTagName '*'
      (element for element in elements when gremlins.NameProvider.isGremlin(element))

  isNative = util.FeatureDetector.hasQuerySelectorAll
  Selector = if isNative then NativeQuerySelector else LegacySelector

  constructor: (@_attributeName) ->

  getList: ->
    Selector.get @_attributeName