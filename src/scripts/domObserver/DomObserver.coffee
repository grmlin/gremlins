goog.provide 'domObserver.DomObserver'
goog.require 'MutationObserverShim'
goog.require 'domObserver.ElementList'
goog.require 'util.Helper'


class domObserver.DomObserver
  TAG_SELECTOR = '*'

  constructor : ->
    @_elementList = new domObserver.ElementList

  _bindMutations : ->
    observer = MutationObserverShim.get()
    observer.on MutationObserverShim.ON_MUTATION, @_handleMutation
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

