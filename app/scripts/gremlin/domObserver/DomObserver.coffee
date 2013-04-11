goog.provide 'gremlin.domObserver.DomObserver'
goog.require 'gremlin.MutationObserverShim'
goog.require 'gremlin.domObserver.ElementList'
goog.require 'gremlin.util.Helper'


class gremlin.domObserver.DomObserver
  TAG_SELECTOR = '*'

  constructor : ->
    @_elementList = new gremlin.domObserver.ElementList

  _bindMutations : ->
    observer = gremlin.MutationObserverShim.get()
    observer.on gremlin.MutationObserverShim.ON_MUTATION, @_handleMutation
    observer.observe()

  _handleMutation : =>
    #console.time "searching gremlins"
    elements = @_elementList.getList()
    if elements.length > 0
      @onNewElements elements
    #console.timeEnd "searching gremlins"

  observe : ->
    @_bindMutations()

  onNewElements : ->

