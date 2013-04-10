goog.provide 'gremlin.domObserver.ElementList'
goog.require 'gremlin.gremlins.NameProvider'

class gremlin.domObserver.ElementList
  DATA_NAME = 'data-gremlin-name'
  class NativeQuerySelector
    @get: (attributeName) ->
      elements = document.querySelectorAll "[#{gremlin.gremlins.NameProvider.DATA_NAME_ATTR}]"
      (element for element in elements)

  class LegacySelector
    @get: (attributeName) ->
      elements = document.all ? document.getElementsByTagName '*'
      (element for element in elements when gremlin.gremlins.NameProvider.isGremlin(element))

  isNative = typeof document.querySelectorAll is "function"
  Selector = if isNative then NativeQuerySelector else LegacySelector

  constructor: (@_attributeName) ->

  getList: ->
    Selector.get @_attributeName