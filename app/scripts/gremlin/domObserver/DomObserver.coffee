goog.provide 'gremlin.domObserver.DomObserver'
goog.require "gremlin.MutationObserverShim"

class gremlin.domObserver.DomObserver
  TAG_SELECTOR = '*'
  constructor: (@cssClassName) ->
    @_isModern = typeof document.getElementsByClassName is "function"
    @_nodeList = if @_isModern then document.getElementsByClassName(@cssClassName) else document.getElementsByTagName(TAG_SELECTOR)

  _bindMutations: ->
    gremlin.MutationObserverShim.get().on gremlin.MutationObserverShim.ON_TICK, @_handleMutation

  _handleMutation: =>
    elArray = @_getNodeArray()
    if elArray.length > 0
      @onNewElements elArray

  _getNodeArray: ->
    (node for node in @_nodeList when @_isModern or gremlin.className is @cssClassName)

  observe: ->
    @_bindMutations()
    @_handleMutation()

  onNewElements: ->

