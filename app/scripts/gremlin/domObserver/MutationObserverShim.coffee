goog.provide "gremlin.MutationObserverShim"
goog.require "gremlin.Event"

class gremlin.MutationObserverShim
  instance = null
  MutationObserver = window.MutationObserver or window.WebKitMutationObserver or window.MozMutationObserver or null

  class MutationObserverShim extends gremlin.Event
    @RESCAN_INTERVAL: 500

    constructor: (@_node) ->
      super
      if typeof MutationObserver is "function" then @_addDomMutationListener() else @_initiateInterval()

    _initiateInterval: ->
      @_interval = window.setTimeout @_onInterval, MutationObserverShim.RESCAN_INTERVAL

    _onInterval: =>
      console.log "DomObserver fired"
      @_onTick()
      @_initiateInterval()

    _addDomMutationListener: ->
      observer = new MutationObserver @_onMutation
      observer.observe @_node,
        childList: true
        subtree: true

    _onMutation: (mutations) =>
      for mutation in mutations
        if mutation.type is "childList"
          console.log "childs changed"
          @_onTick()

    _onTick: ->
      @emit gremlin.MutationObserverShim.ON_TICK

  @ON_TICK: 'ON_TICK'
  @get: () ->
    instance ?= new MutationObserverShim(document)




