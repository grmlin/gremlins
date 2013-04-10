goog.provide 'gremlin.domObserver.DomObserver'
goog.require 'gremlin.MutationObserverShim'
goog.require 'gremlin.domObserver.ElementList'
goog.require 'gremlin.util.Helper'


class gremlin.domObserver.DomObserver
  TAG_SELECTOR = '*'

  constructor : ->
    @_elementList = new gremlin.domObserver.ElementList

  _bindMutations : ->
    gremlin.MutationObserverShim.get().on gremlin.MutationObserverShim.ON_TICK, @_handleMutation
    @_triggerTick()

  _triggerTick : ->
    gremlin.MutationObserverShim.get().tickNow()

  _handleMutation : =>
    elements = @_elementList.getList()
    if elements.length > 0
      @onNewElements elements

  observe : ->
    @_bindMutations()

  onNewElements : ->

