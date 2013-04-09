goog.provide 'gremlin.domObserver.DomObserver'
goog.require 'gremlin.MutationObserverShim'
goog.require 'gremlin.util.Helper'


class gremlin.domObserver.DomObserver
  TAG_SELECTOR = '*'

  _cssClass : null
  _nodeList : null

  constructor : ->
    @_isModern = typeof document.getElementsByClassName is "function"

  setCssClass : (cssClass) ->
    unless cssClass is @_cssClass
      @_cssClass = cssClass
      @_updateNodeList()
      @_triggerTick()

  _updateNodeList : () ->
    console.log "looking for '.#{@_cssClass}' gremlins"
    return if @_cssClass is null
    
    if @_isModern
      @_nodeList = document.getElementsByClassName(@_cssClass)
    else
      @_nodeList = document.getElementsByTagName(TAG_SELECTOR)

  _bindMutations : ->
    gremlin.MutationObserverShim.get().on gremlin.MutationObserverShim.ON_TICK, @_handleMutation
    @_triggerTick()

  _triggerTick : ->
    gremlin.MutationObserverShim.get().tickNow()

  _handleMutation : =>
    elArray = @_getNodeArray()
    if elArray.length > 0
      @onNewElements elArray, @_cssClass

  _getNodeArray : ->
    (node for node in @_nodeList when @_isModern or gremlin.util.Helper.hasClass(node.className, @_cssClass))

  observe : ->
    @_bindMutations()

  onNewElements : ->

